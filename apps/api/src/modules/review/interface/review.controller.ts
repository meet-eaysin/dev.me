import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { GetDailyReviewUseCase } from '../application/use-cases/get-daily-review.usecase';
import { DismissReviewUseCase } from '../application/use-cases/dismiss-review.usecase';
import { GetRecommendationsUseCase } from '../application/use-cases/get-recommendations.usecase';
import { User } from '../../../shared/decorators/user.decorator';

@Controller()
@UseGuards(DevUserGuard)
export class ReviewController {
  constructor(
    private readonly getDailyReviewUseCase: GetDailyReviewUseCase,
    private readonly dismissReviewUseCase: DismissReviewUseCase,
    private readonly getRecommendationsUseCase: GetRecommendationsUseCase,
  ) {}

  @Get('review/daily')
  async getDailyReview(@User('userId') userId: string) {
    const items = await this.getDailyReviewUseCase.execute(userId);
    return { success: true, items };
  }

  @Post('review/dismiss/:docId')
  async dismissReview(
    @Param('docId') docId: string,
    @User('userId') userId: string,
  ) {
    await this.dismissReviewUseCase.execute(docId, userId);
    return { success: true };
  }

  @Get('recommendations')
  async getRecommendations(@User('userId') userId: string) {
    const result = await this.getRecommendationsUseCase.execute(userId);
    return { success: true, ...result };
  }
}
