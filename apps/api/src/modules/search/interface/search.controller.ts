import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { SearchUseCase } from '../application/use-cases/search.usecase';
import { AskUseCase } from '../application/use-cases/ask.usecase';
import { SearchQueryDto, AskQueryDto } from './schemas/search.schema';
import { User } from '../../../shared/decorators/user.decorator';

@Controller('search')
@UseGuards(DevUserGuard)
export class SearchController {
  constructor(
    private readonly searchUseCase: SearchUseCase,
    private readonly askUseCase: AskUseCase,
  ) {}

  @Get()
  async search(@User('userId') userId: string, @Query() query: SearchQueryDto) {
    return this.searchUseCase.execute(userId, query);
  }

  @Post('ask')
  async ask(@User('userId') userId: string, @Body() query: AskQueryDto) {
    return this.askUseCase.execute(userId, query);
  }
}
