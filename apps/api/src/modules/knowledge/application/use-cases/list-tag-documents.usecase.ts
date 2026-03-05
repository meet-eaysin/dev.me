import { Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import { DocumentPublicView } from '../../../documents/domain/entities/document.entity';

interface ListTagDocumentsCommand {
  tagId: string;
  userId: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListTagDocumentsUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(command: ListTagDocumentsCommand): Promise<{
    items: DocumentPublicView[];
    total: number;
  }> {
    const tag = await this.tagRepository.findById(
      command.tagId,
      command.userId,
    );
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    const { docs, total } = await this.documentRepository.findAll(
      command.userId,
      {
        tagIds: [tag.name],
        page: command.page,
        limit: command.limit,
      },
    );

    return {
      items: docs.map((doc) => doc.toPublicView()),
      total,
    };
  }
}
