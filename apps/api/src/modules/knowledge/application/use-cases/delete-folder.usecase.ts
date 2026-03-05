import { Injectable, NotFoundException } from '@nestjs/common';
import { IFolderRepository } from '../../domain/repositories/folder.repository';
import { IDocumentUnlinkRepository } from '../../domain/repositories/document-unlink.repository';

@Injectable()
export class DeleteFolderUseCase {
  constructor(
    private readonly folderRepository: IFolderRepository,
    private readonly documentUnlinkRepository: IDocumentUnlinkRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const folder = await this.folderRepository.findById(id, userId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    // 2. Call documentUnlinkRepo.removeFolderFromAllDocuments(folderId, userId)
    await this.documentUnlinkRepository.removeFolderFromAllDocuments(
      id,
      userId,
    );

    // 3. Delete folder
    await this.folderRepository.delete(id, userId);
  }
}
