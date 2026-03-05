import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IDocumentRepository } from '../../domain/repositories/document.repository';
import { ingestionQueue } from '@repo/queue';
import { IngestionStatus } from '@repo/types';

@Injectable()
export class RetryIngestionUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(id: string, userId: string): Promise<{ jobId: string }> {
    const doc = await this.documentRepository.findById(id, userId);

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    if (doc.ingestionStatus !== IngestionStatus.FAILED) {
      throw new UnprocessableEntityException(
        'Document ingestion has not failed',
      );
    }

    await this.documentRepository.update(id, userId, {
      ingestionStatus: IngestionStatus.PENDING,
      ingestionError: null,
    });

    // Re-push to ingestion queue
    ingestionQueue.addJob(id, userId).catch(console.error);

    return { jobId: `dummy-job-${id}` };
  }
}
