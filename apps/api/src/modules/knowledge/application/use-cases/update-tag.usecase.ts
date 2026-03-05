import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import {
  TagEntityProps,
  TagPublicView,
} from '../../domain/entities/tag.entity';

interface UpdateTagCommand {
  id: string;
  userId: string;
  data: {
    name?: string | undefined;
    color?: string | undefined;
  };
}

@Injectable()
export class UpdateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(command: UpdateTagCommand): Promise<TagPublicView> {
    if (command.data.name) {
      const existing = await this.tagRepository.findByName(
        command.data.name,
        command.userId,
      );
      if (existing && existing.id !== command.id) {
        throw new ConflictException(
          `Tag with name "${command.data.name}" already exists`,
        );
      }
    }

    const updateData: Partial<TagEntityProps> = {};
    if (command.data.name !== undefined) updateData.name = command.data.name;
    if (command.data.color !== undefined) updateData.color = command.data.color;

    const tag = await this.tagRepository.update(
      command.id,
      command.userId,
      updateData,
    );

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag.toPublicView();
  }
}
