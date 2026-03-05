import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GetHeatmapUseCase } from '../../application/use-cases/get-heatmap.usecase';
import { GetStatsUseCase } from '../../application/use-cases/get-stats.usecase';
import { DevUserGuard } from '../../../../shared/guards/dev-user.guard';
import { User } from '../../../../shared/decorators/user.decorator';

@Controller('analytics')
@UseGuards(DevUserGuard)
export class AnalyticsController {
  constructor(
    private readonly getHeatmapUseCase: GetHeatmapUseCase,
    private readonly getStatsUseCase: GetStatsUseCase,
  ) {}

  @Get('heatmap')
  async getHeatmap(
    @User('userId') userId: string,
    @Query('days') days?: string,
  ) {
    const daysInt = days ? parseInt(days, 10) : 365;
    const data = await this.getHeatmapUseCase.execute(userId, daysInt);
    return { success: true, data };
  }

  @Get('stats')
  async getStats(@User('userId') userId: string) {
    const stats = await this.getStatsUseCase.execute(userId);
    return { success: true, data: stats };
  }
}
