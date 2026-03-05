import { Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository';

@Injectable()
export class DeleteNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const note = await this.noteRepository.findById(id, userId);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.delete(id, userId);
  }
}
