import { Injectable } from '@nestjs/common';
import { IGraphRepository } from '../../domain/repositories/graph.repository';
import { graphQueue } from '@repo/queue';

@Injectable()
export class RebuildDocumentGraphUseCase {
  constructor(private readonly graphRepository: IGraphRepository) {}

  async execute(documentId: string, userId: string): Promise<string> {
    await this.graphRepository.deleteEdgesForDocument(documentId, userId);

    await graphQueue.addJob(documentId, userId);

    return 'triggered';
  }
}
