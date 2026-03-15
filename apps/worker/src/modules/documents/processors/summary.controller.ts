import {
  Logger,
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
  NotFoundException,
  UnprocessableEntityException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { QueueWebhookGuard } from '../../../shared/guards/queue-webhook.guard';
import { summarizePipeline, LLMClientFactory } from '@repo/ai';
import { QUEUE_SUMMARY, DocumentType } from '@repo/types';
import type { SummaryJobData } from '@repo/types';
import {
  IDocumentRepository,
  DocumentChunkModel,
  DocumentTranscriptModel,
} from '@repo/db';

@Controller('api/webhooks')
export class SummaryController {
  private readonly logger = new Logger(SummaryController.name);

  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly llmClientFactory: LLMClientFactory,
  ) {}

  @Post(QUEUE_SUMMARY)
  @UseGuards(QueueWebhookGuard)
  async process(
    @Body() data: SummaryJobData,
    @Headers('Upstash-Message-Id') messageId: string,
  ): Promise<void> {
    try {
      await this.processJob(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      this.logger.error(
        `[SummaryController] Job ${messageId} failed: ${errorMessage}`,
      );
      if (err instanceof HttpException) {
        throw err;
      }
      throw new InternalServerErrorException('Summary job failed');
    }
  }

  private async processJob(data: SummaryJobData): Promise<void> {
    const { documentId, userId } = data;

    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    let textForSummary = '';
    const type = doc.type;

    if (type === DocumentType.YOUTUBE) {
      const transcript = await DocumentTranscriptModel.findOne({
        documentId,
      }).exec();
      if (transcript) {
        textForSummary = transcript.content;
      }
    } else {
      const chunks = await DocumentChunkModel.find({ documentId }).sort({
        chunkIndex: 1,
      });
      textForSummary = chunks.map((c) => c.content).join('\n\n');

      if (!textForSummary && doc.content) {
        textForSummary = doc.content;
      }
    }

    if (!textForSummary || textForSummary.trim().length === 0) {
      throw new UnprocessableEntityException(
        'Document has no extractable text for summarization',
      );
    }

    const resolvedClient = await this.llmClientFactory.createForUserId(userId);

    const summary = await summarizePipeline.generateSummary(
      textForSummary,
      type,
      resolvedClient,
    );

    await this.documentRepository.update(documentId, userId, {
      summary,
    });

    this.logger.log(
      `Summary generated for document: ${documentId} by User: ${userId}`,
    );
  }
}
