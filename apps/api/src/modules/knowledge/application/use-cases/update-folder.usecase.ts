import { Injectable, NotFoundException } from '@nestjs/common';
import { IFolderRepository } from '../../domain/repositories/folder.repository';
import {
  FolderEntityProps,
  FolderPublicView,
} from '../../domain/entities/folder.entity';

interface UpdateFolderCommand {
  id: string;
  userId: string;
  data: {
    name?: string | undefined;
    description?: string | undefined;
    color?: string | undefined;
    parentId?: string | null | undefined;
  };
}

@Injectable()
export class UpdateFolderUseCase {
  constructor(private readonly folderRepository: IFolderRepository) {}

  async execute(command: UpdateFolderCommand): Promise<FolderPublicView> {
    const updateData: Partial<FolderEntityProps> = {};
    if (command.data.name !== undefined) updateData.name = command.data.name;
    if (command.data.description !== undefined)
      updateData.description = command.data.description;
    if (command.data.color !== undefined) updateData.color = command.data.color;
    if (command.data.parentId !== undefined)
      updateData.parentId = command.data.parentId;

    const folder = await this.folderRepository.update(
      command.id,
      command.userId,
      updateData,
    );

    if (!folder) {
      throw new NotFoundException('Folder not found');
    }

    return folder.toPublicView();
  }
}
