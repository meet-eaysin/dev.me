import { Injectable, NotFoundException } from '@nestjs/common';
import {
  IDocumentRepository,
  IngestionStatusView,
} from '../../domain/repositories/document.repository';

@Injectable()
export class GetIngestionStatusUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(id: string, userId: string): Promise<IngestionStatusView> {
    const status = await this.documentRepository.getIngestionStatus(id, userId);

    if (!status) {
      throw new NotFoundException('Document or ingestion status not found');
    }

    return status;
  }
}
