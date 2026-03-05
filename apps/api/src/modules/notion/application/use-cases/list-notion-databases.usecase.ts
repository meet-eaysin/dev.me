import {
  Injectable,
  NotFoundException,
  BadGatewayException,
} from '@nestjs/common';
import { NotionConfigModel } from '@repo/db';
import { NotionDatabase } from '@repo/types';
import { NotionClient } from '../../infrastructure/notion-client';
import { decrypt } from '../../../../shared/infrastructure/crypto/encryption';
import { env } from '../../../../shared/utils/env';

@Injectable()
export class ListNotionDatabasesUseCase {
  constructor(private readonly notionClient: NotionClient) {}

  async execute(userId: string): Promise<NotionDatabase[]> {
    const config = await NotionConfigModel.findOne({ userId });
    if (!config || !config.accessToken) {
      throw new NotFoundException('Notion not connected');
    }

    try {
      const token = decrypt(config.accessToken, env.ENCRYPTION_KEY);
      return await this.notionClient.listDatabases(token);
    } catch {
      throw new BadGatewayException('Failed to fetch databases from Notion');
    }
  }
}
