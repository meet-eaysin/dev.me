import { Injectable, NotFoundException } from '@nestjs/common';
import { ITagRepository } from '../../domain/repositories/tag.repository';
import { IDocumentUnlinkRepository } from '../../domain/repositories/document-unlink.repository';

@Injectable()
export class DeleteTagUseCase {
  constructor(
    private readonly tagRepository: ITagRepository,
    private readonly documentUnlinkRepository: IDocumentUnlinkRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const tag = await this.tagRepository.findById(id, userId);

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    // 2. Call documentUnlinkRepo.removeTagFromAllDocuments(tagId, userId)
    await this.documentUnlinkRepository.removeTagFromAllDocuments(id, userId);

    // 3. Delete tag
    await this.tagRepository.delete(id, userId);
  }
}
