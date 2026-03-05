import { Module, Global } from '@nestjs/common';
import { IDocumentRepository } from './domain/repositories/document.repository';
import { IDocumentUnlinkRepository } from '../knowledge/domain/repositories/document-unlink.repository';
import { MongooseDocumentRepository } from './infrastructure/persistence/mongoose-document.repository';
import { MongooseDocumentUnlinkRepository } from './infrastructure/persistence/document-unlink.repository';
import { CreateDocumentUseCase } from './application/use-cases/create-document.usecase';
import { CreateUploadDocumentUseCase } from './application/use-cases/create-upload-document.usecase';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.usecase';
import { GetDocumentUseCase } from './application/use-cases/get-document.usecase';
import { GetIngestionStatusUseCase } from './application/use-cases/get-ingestion-status.usecase';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.usecase';
import { RetryIngestionUseCase } from './application/use-cases/retry-ingestion.usecase';
import { SummaryUseCase } from './application/use-cases/summary.usecase';
import { TranscriptUseCase } from './application/use-cases/transcript.usecase';
import { UpdateDocumentUseCase } from './application/use-cases/update-document.usecase';
import { DocumentsController } from './interface/documents.controller';
import { LocalStorage } from '../../shared/infrastructure/storage/local-storage';

const useCases = [
  CreateDocumentUseCase,
  CreateUploadDocumentUseCase,
  DeleteDocumentUseCase,
  GetDocumentUseCase,
  GetIngestionStatusUseCase,
  ListDocumentsUseCase,
  RetryIngestionUseCase,
  SummaryUseCase,
  TranscriptUseCase,
  UpdateDocumentUseCase,
];

@Global()
@Module({
  controllers: [DocumentsController],
  providers: [
    ...useCases,
    LocalStorage,
    {
      provide: IDocumentRepository,
      useClass: MongooseDocumentRepository,
    },
    {
      provide: IDocumentUnlinkRepository,
      useClass: MongooseDocumentUnlinkRepository,
    },
  ],
  exports: [
    IDocumentRepository,
    IDocumentUnlinkRepository,
    LocalStorage,
    ...useCases,
  ],
})
export class DocumentsModule {}
