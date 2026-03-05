import { Module } from '@nestjs/common';
import { NotionClient } from './infrastructure/notion-client';
import { NotionWorker } from './infrastructure/workers/notion.worker';
import { ConnectNotionUseCase } from './application/use-cases/connect-notion.usecase';
import { ListNotionDatabasesUseCase } from './application/use-cases/list-notion-databases.usecase';
import { UpdateNotionConfigUseCase } from './application/use-cases/update-notion-config.usecase';
import { SyncAllToNotionUseCase } from './application/use-cases/sync-all-to-notion.usecase';
import { DisconnectNotionUseCase } from './application/use-cases/disconnect-notion.usecase';
import { NotionController } from './interface/notion.controller';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  controllers: [NotionController],
  providers: [
    NotionClient,
    NotionWorker,
    ConnectNotionUseCase,
    ListNotionDatabasesUseCase,
    UpdateNotionConfigUseCase,
    SyncAllToNotionUseCase,
    DisconnectNotionUseCase,
  ],
})
export class NotionModule {}
