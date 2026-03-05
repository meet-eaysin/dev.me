import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IDocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentDetailView } from '../../domain/entities/document.entity';

@Injectable()
export class GetDocumentUseCase {
  private readonly logger = new Logger(GetDocumentUseCase.name);

  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(id: string, userId: string): Promise<DocumentDetailView> {
    const updatedDoc = await this.documentRepository.update(id, userId, {
      lastOpenedAt: new Date(),
    });

    if (!updatedDoc) {
      throw new NotFoundException('Document not found');
    }

    // Log activity
    this.logger.log(`Document opened: ${id} by User: ${userId}`);

    return updatedDoc.toDetailView();
  }
}
