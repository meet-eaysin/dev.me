import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { GetFullGraphUseCase } from '../application/use-cases/get-full-graph.usecase';
import { GetDocumentSubgraphUseCase } from '../application/use-cases/get-document-subgraph.usecase';
import { RebuildDocumentGraphUseCase } from '../application/use-cases/rebuild-document-graph.usecase';
import { User } from '../../../shared/decorators/user.decorator';

@Controller('graph')
@UseGuards(DevUserGuard)
export class GraphController {
  constructor(
    private readonly getFullGraphUseCase: GetFullGraphUseCase,
    private readonly getSubgraphUseCase: GetDocumentSubgraphUseCase,
    private readonly rebuildGraphUseCase: RebuildDocumentGraphUseCase,
  ) {}

  @Get()
  async getFullGraph(@User('userId') userId: string) {
    const result = await this.getFullGraphUseCase.execute(userId);
    return { success: true, data: result };
  }

  @Get('document/:docId')
  async getDocumentSubgraph(
    @Param('docId') docId: string,
    @User('userId') userId: string,
  ) {
    const result = await this.getSubgraphUseCase.execute(docId, userId);
    return { success: true, data: result };
  }

  @Post('rebuild/:docId')
  @HttpCode(HttpStatus.ACCEPTED)
  async rebuildDocumentGraph(
    @Param('docId') docId: string,
    @User('userId') userId: string,
  ) {
    const result = await this.rebuildGraphUseCase.execute(docId, userId);
    return { success: true, data: result };
  }
}
