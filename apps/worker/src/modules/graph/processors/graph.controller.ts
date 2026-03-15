import {
  Logger,
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { QueueWebhookGuard } from '../../../shared/guards/queue-webhook.guard';
import { QUEUE_GRAPH } from '@repo/types';
import type { GraphJobData } from '@repo/types';
import { GraphBuilderService } from '../graph-builder.service';

@Controller('api/webhooks')
export class GraphController {
  private readonly logger = new Logger(GraphController.name);

  constructor(private readonly graphBuilder: GraphBuilderService) {}

  @Post(QUEUE_GRAPH)
  @UseGuards(QueueWebhookGuard)
  async process(
    @Body() data: GraphJobData,
    @Headers('Upstash-Message-Id') messageId: string,
  ): Promise<void> {
    try {
      await this.processJob(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `[GraphController] Job ${messageId} failed: ${errorMessage}`,
      );
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Graph job failed');
    }
  }

  private async processJob(data: GraphJobData): Promise<void> {
    const { documentId, userId } = data;
    if (typeof documentId !== 'string' || typeof userId !== 'string') {
      throw new BadRequestException(
        'Invalid job data: documentId or userId is missing',
      );
    }

    this.logger.log(
      `[GraphWorker] Processing relationships for document: ${documentId}`,
    );

    await this.graphBuilder.buildRelationships(documentId, userId);
  }
}
