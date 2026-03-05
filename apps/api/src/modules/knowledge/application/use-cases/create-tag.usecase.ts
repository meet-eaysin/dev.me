import { Injectable, ConflictException } from '@nestjs/common';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import { TagPublicView } from '../../domain/entities/tag.entity';

interface CreateTagCommand {
  userId: string;
  name: string;
  color?: string | undefined;
  source?: string | undefined;
}

@Injectable()
export class CreateTagUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(command: CreateTagCommand): Promise<TagPublicView> {
    const existing = await this.tagRepository.findByName(
      command.name,
      command.userId,
    );

    if (existing) {
      throw new ConflictException(
        `Tag with name "${command.name}" already exists`,
      );
    }

    const tag = await this.tagRepository.create(command);
    return tag.toPublicView();
  }
}
