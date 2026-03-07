import { Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { NotionSyncJobData, createRedisConnection } from '@repo/queue';
import { NotionConfigModel, DocumentModel } from '@repo/db';
import { NotionAction } from '@repo/types';
import { NotionClient } from '../notion-client';
import { decrypt } from '@repo/crypto';
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

    const accessToken = config.accessToken;
    if (typeof accessToken !== 'string') {
      this.logger.error(`Invalid access token for user ${userId}`);
      return;
    }

    const token = decrypt(accessToken, env.ENCRYPTION_KEY);
    if (typeof token !== 'string') {
      this.logger.error(`Decryption failed for user ${userId}`);
      return;
    }

    try {
      const targetDatabaseId = config.targetDatabaseId;
      if (typeof targetDatabaseId !== 'string') {
        this.logger.error(`Database not configured for user ${userId}`);
        return;
      }

      if (action === NotionAction.CREATE) {
        if (!doc) return;

        const title = doc.title;
        if (typeof title !== 'string') return;

        const pageId = await this.notionClient.createPage(
          token,
          targetDatabaseId,
          {
            title,
            content: doc.summary || doc.content || undefined,
            url: doc.sourceUrl || undefined,
          },
        );
        doc.notionPageId = pageId;
        await doc.save();
      } else if (action === NotionAction.UPDATE) {
        const pageId = doc?.notionPageId;
        if (!doc || typeof pageId !== 'string') return;

        const title = doc.title;
        if (typeof title !== 'string') return;

        await this.notionClient.updatePage(token, pageId, {
          title,
          content: doc.summary || doc.content || undefined,
          url: doc.sourceUrl || undefined,
        });
      } else if (action === NotionAction.DELETE) {
        const pageId = doc?.notionPageId;
        if (doc && typeof pageId === 'string') {
          try {
            await this.notionClient.deletePage(token, pageId);
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to delete Notion page: ${message}`);
          }
          doc.notionPageId = undefined;
          await doc.save();
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Sync failed for doc ${documentId}: ${message}`);
      throw error; // Let BullMQ handle retries
    }
  }

  async close() {
    await this._worker.close();
  }
}
