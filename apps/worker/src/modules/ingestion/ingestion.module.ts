import { Module } from '@nestjs/common';
import { IngestionController } from './processors/ingestion.controller';
@Module({
  controllers: [IngestionController],
})
export class IngestionModule {}
