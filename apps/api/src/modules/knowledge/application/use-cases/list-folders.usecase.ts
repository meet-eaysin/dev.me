import { Injectable } from '@nestjs/common';
import { IFolderRepository } from '../../domain/repositories/folder.repository';
import { FolderPublicView } from '../../domain/entities/folder.entity';

@Injectable()
export class ListFoldersUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(userId: string): Promise<FolderPublicView[]> {
    const folders = await this.folderRepository.findAll(userId);
    return folders.map((f) => f.toPublicView());
  }
}
