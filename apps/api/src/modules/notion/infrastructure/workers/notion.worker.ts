import { Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { NotionSyncJobData, createRedisConnection } from '@repo/queue';
import { NotionConfigModel, DocumentModel } from '@repo/db';
import { NotionAction } from '@repo/types';
import { NotionClient } from '../notion-client';
import { decrypt } from '../../../../shared/infrastructure/crypto/encryption';
import { env } from '../../../../shared/utils/env';

@Injectable()
export class NotionWorker {
  private readonly logger = new Logger(NotionWorker.name);
  private _worker: Worker<NotionSyncJobData>;

  get worker(): Worker<NotionSyncJobData> {
    return this._worker;
  }

  constructor(private readonly notionClient: NotionClient) {
    const redis = createRedisConnection(env.REDIS_URL);

    this._worker = new Worker<NotionSyncJobData>(
      'notion-sync',
      async (job: Job<NotionSyncJobData>) => {
        await this.processJob(job);
      },
      {
        connection: redis,
        concurrency: 1, // Rate limit enforced
        prefix: 'mindstack',
      },
    );

    this._worker.on('failed', (job, err) => {
      this.logger.error(`[NotionWorker] Job ${job?.id} failed: ${err.message}`);
    });

    this.logger.log('[NotionWorker] Worker started and listening to queue');
  }

  private async processJob(job: Job<NotionSyncJobData>): Promise<void> {
    const { documentId, userId, action } = job.data;

    const config = await NotionConfigModel.findOne({ userId });
    if (
      !config ||
      !config.accessToken ||
      !config.syncEnabled ||
      !config.targetDatabaseId
    ) {
      return;
    }

    const doc = await DocumentModel.findById(documentId);
    if (!doc && action !== NotionAction.DELETE) {
      return;
    }

    const token = decrypt(config.accessToken, env.ENCRYPTION_KEY);

    try {
      if (action === NotionAction.CREATE) {
        if (!doc) return;
        const pageId = await this.notionClient.createPage(
          token,
          config.targetDatabaseId,
          {
            title: doc.title,
            content: (doc.summary || doc.content) ?? undefined,
            url: doc.sourceUrl ?? undefined,
          },
        );
        doc.notionPageId = pageId;
        await doc.save();
      } else if (action === NotionAction.UPDATE) {
        if (!doc || !doc.notionPageId) return;
        await this.notionClient.updatePage(token, doc.notionPageId, {
          title: doc.title,
          content: (doc.summary || doc.content) ?? undefined,
          url: doc.sourceUrl ?? undefined,
        });
      } else if (action === NotionAction.DELETE) {
        // We might not have the doc anymore, but hopefully notionPageId was in job if needed
        // But the job only has documentId. Usually DELETE happens while doc exists or we pass pageId.
        // If doc is null, we can't get pageId.
        // In this implementation, let's assume doc is still there or we don't support delete-after-doc-removed easily without passing pageId.
        if (doc && doc.notionPageId) {
          await this.notionClient.deletePage(token, doc.notionPageId);
          doc.notionPageId = undefined;
          await doc.save();
        }
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[NotionWorker] Sync failed for doc ${documentId}: ${msg}`);
      throw error; // Let BullMQ handle retries
    }
  }

  async close() {
    await this._worker.close();
  }
}
