import { Injectable, NotFoundException } from '@nestjs/common';
import { NotionConfigModel } from '@repo/db';
import { NotionConfigPublicView, UpdateNotionConfigRequest } from '@repo/types';

@Injectable()
export class UpdateNotionConfigUseCase {
  async execute(
    userId: string,
    data: UpdateNotionConfigRequest,
  ): Promise<NotionConfigPublicView> {
    const config = await NotionConfigModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true },
    );

    if (!config) {
      throw new NotFoundException('Notion not connected');
    }

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
