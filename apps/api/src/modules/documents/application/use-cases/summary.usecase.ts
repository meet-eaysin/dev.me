import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { summaryQueue } from '@repo/queue';
import { IDocumentRepository } from '../../domain/repositories/document.repository';
import { IngestionStatus } from '@repo/types';

@Injectable()
export class SummaryUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async generateSummary(documentId: string, userId: string): Promise<void> {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.props.ingestionStatus !== IngestionStatus.COMPLETED) {
      throw new BadRequestException('Document ingestion is not completed yet');
    }

    await summaryQueue.addJob(documentId, userId);
  }

  async deleteSummary(documentId: string, userId: string): Promise<void> {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    await this.documentRepository.update(documentId, userId, {
      summary: undefined,
    });
  }
}
