import { Injectable, NotFoundException } from '@nestjs/common';
import { IFolderRepository } from '../../domain/repositories/folder.repository';
import { FolderPublicView } from '../../domain/entities/folder.entity';

@Injectable()
export class GetFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(
    id: string,
    userId: string,
  ): Promise<{ folder: FolderPublicView; documentCount: number }> {
    const folder = await this.folderRepository.findById(id, userId);

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    const documentCount = await this.folderRepository.countDocuments(
      id,
      userId,
    );

    return {
      folder: folder.toPublicView(),
      documentCount,
    };
  }
}
