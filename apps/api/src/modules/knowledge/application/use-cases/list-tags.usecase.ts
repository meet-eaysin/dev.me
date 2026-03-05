import { Injectable } from '@nestjs/common';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import { TagPublicView } from '../../domain/entities/tag.entity';

@Injectable()
export class ListTagsUseCase {
  constructor(private readonly tagRepository: ITagRepository) {}

  async execute(userId: string): Promise<TagPublicView[]> {
    const tags = await this.tagRepository.findAll(userId);
    return tags.map((t) => t.toPublicView());
  }
}
