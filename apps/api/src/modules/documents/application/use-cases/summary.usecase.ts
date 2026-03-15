import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { IngestionStatus, QUEUE_SUMMARY } from '@repo/types';
import { QueueService } from '@repo/queue';
import { IDocumentRepository } from '../../domain/repositories/document.repository';

@Injectable()
export class SummaryUseCase {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly queueService: QueueService,
  ) {}

  async generateSummary(documentId: string, userId: string): Promise<void> {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.ingestionStatus !== IngestionStatus.COMPLETED) {
      throw new BadRequestException('Document ingestion is not completed yet');
    }

    await this.queueService.publishMessage(QUEUE_SUMMARY, {
      documentId,
      userId,
    });
  }

  async deleteSummary(documentId: string, userId: string): Promise<void> {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    await this.documentRepository.update(documentId, userId, {
      summary: undefined,
    });
  }
}
