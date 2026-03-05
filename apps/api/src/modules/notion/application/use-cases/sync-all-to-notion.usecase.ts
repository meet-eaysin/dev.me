import { Injectable, BadRequestException } from '@nestjs/common';
import { NotionConfigModel, DocumentModel } from '@repo/db';
import { NotionSyncResult } from '@repo/types';
import { NotionClient } from '../../infrastructure/notion-client';
import { decrypt } from '../../../../shared/infrastructure/crypto/encryption';
import { env } from '../../../../shared/utils/env';

@Injectable()
export class SyncAllToNotionUseCase {
  constructor(private readonly notionClient: NotionClient) {}

  async execute(userId: string): Promise<NotionSyncResult> {
    const config = await NotionConfigModel.findOne({ userId });
    if (
      !config ||
      !config.accessToken ||
      !config.targetDatabaseId ||
      !config.syncEnabled
    ) {
      throw new BadRequestException('Notion sync not configured or enabled');
    }

    const token = decrypt(config.accessToken, env.ENCRYPTION_KEY);
    const documents = await DocumentModel.find({ userId });

    let synced = 0;
    let failed = 0;
    const errors: string[] = [];

    // Batch process in groups of 5
    const batchSize = 5;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      await Promise.all(
        batch.map(async (doc) => {
          try {
            if (doc.notionPageId) {
              await this.notionClient.updatePage(token, doc.notionPageId, {
                title: doc.title,
                content: (doc.summary || doc.content) ?? undefined,
                url: doc.sourceUrl ?? undefined,
              });
            } else {
              const pageId = await this.notionClient.createPage(
                token,
                config.targetDatabaseId as string,
                {
                  title: doc.title,
                  content: (doc.summary || doc.content) ?? undefined,
                  url: doc.sourceUrl ?? undefined,
                },
              );
              doc.notionPageId = pageId;
              await doc.save();
            }
            synced++;
          } catch (error) {
            failed++;
            errors.push(
              `Failed to sync doc ${doc._id}: ${error instanceof Error ? error.message : String(error)}`,
            );
          }
        }),
      );
      // Wait to respect rate limits if more items remain
      if (i + batchSize < documents.length) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }

    config.lastSyncedAt = new Date();
    await config.save();

    return { synced, failed, errors };
  }
}
