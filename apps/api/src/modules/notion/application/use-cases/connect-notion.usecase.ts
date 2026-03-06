import { Injectable, UnauthorizedException } from '@nestjs/common';
import { NotionConfigModel } from '@repo/db';
import { NotionConfigPublicView, NotionSyncDirectionType } from '@repo/types';
import { NotionClient } from '../../infrastructure/notion-client';
import { encrypt } from '@repo/crypto';
import { env } from '../../../../shared/utils/env';

@Injectable()
export class ConnectNotionUseCase {
  constructor(private readonly notionClient: NotionClient) {}

  async execute(
    userId: string,
    accessToken: string,
  ): Promise<NotionConfigPublicView> {
    // 1. Validate token by fetching databases
    try {
      await this.notionClient.listDatabases(accessToken);
    } catch {
      throw new UnauthorizedException('Invalid Notion access token');
    }

    // 2. Encrypt token
    const encryptedToken = encrypt(accessToken, env.ENCRYPTION_KEY);

    // 3. Upsert config
    // For simplicity, using a dummy workspaceId/Name as we don't have OAuth flow here to get them easily
    // In a real app, these would come from the Notion OAuth response
    const config = await NotionConfigModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          accessToken: encryptedToken,
          workspaceId: 'manual_connection',
          workspaceName: 'Notion Workspace',
          syncEnabled: true,
          syncDirection: NotionSyncDirectionType.TO_NOTION,
        },
      },
      { upsert: true, new: true },
    );

    return {
      userId: config.userId.toString(),
      workspaceId: config.workspaceId,
      workspaceName: config.workspaceName,
      targetDatabaseId: config.targetDatabaseId,
      syncEnabled: config.syncEnabled,
      syncDirection: config.syncDirection,
      lastSyncedAt: config.lastSyncedAt?.toISOString() ?? undefined,
    };
  }
}
