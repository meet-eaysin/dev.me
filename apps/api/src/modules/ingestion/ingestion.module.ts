import { Module } from '@nestjs/common';
import { IIngestionJobRepository } from './domain/repositories/ingestion-job.repository';
import { MongooseIngestionJobRepository } from './infrastructure/persistence/mongoose-ingestion-job.repository';
import { IngestionWorker } from './infrastructure/workers/ingestion.worker';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  providers: [
    {
      provide: IIngestionJobRepository,
      useClass: MongooseIngestionJobRepository,
    },
    IngestionWorker,
  ],
  exports: [IIngestionJobRepository],
})
export class IngestionModule {}
