import { Module } from '@nestjs/common';
import { AnalyticsController } from './interface/controllers/analytics.controller';
import { GetHeatmapUseCase } from './application/use-cases/get-heatmap.usecase';
import { GetStatsUseCase } from './application/use-cases/get-stats.usecase';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [DocumentsModule],
  controllers: [AnalyticsController],
  providers: [GetHeatmapUseCase, GetStatsUseCase],
  exports: [GetHeatmapUseCase, GetStatsUseCase],
})
export class AnalyticsModule {}
