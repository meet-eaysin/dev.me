import { Injectable } from '@nestjs/common';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { DocumentPublicView } from '../../../documents/domain/entities/document.entity';

interface ListFolderDocumentsCommand {
  folderId: string;
  userId: string;
  page: number;
  limit: number;
}

@Injectable()
export class ListFolderDocumentsUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(command: ListFolderDocumentsCommand): Promise<{
    items: DocumentPublicView[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { docs, total } = await this.documentRepository.findAll(
      command.userId,
      {
        folderIds: [command.folderId],
        page: command.page,
        limit: command.limit,
      },
    );

    return {
      items: docs.map((doc) => doc.toPublicView()),
      total,
      page: command.page,
      limit: command.limit,
    };
  }
}
