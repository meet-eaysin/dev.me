import { Injectable } from '@nestjs/common';
import { QUEUE_GRAPH } from '@repo/types';
import { QueueService } from '@repo/queue';
import { IGraphRepository } from '../../domain/repositories/graph.repository';

@Injectable()
export class RebuildDocumentGraphUseCase {
  constructor(
    private readonly graphRepository: IGraphRepository,
    private readonly queueService: QueueService,
  ) {}

  async execute(documentId: string, userId: string): Promise<string> {
    await this.graphRepository.deleteEdgesForDocument(documentId, userId);

    await this.queueService.publishMessage(QUEUE_GRAPH, {
      documentId,
      userId,
    });

    return 'triggered';
  }
}
