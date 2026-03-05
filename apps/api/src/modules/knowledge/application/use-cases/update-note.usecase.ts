import { Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository';
import { NotePublicView } from '../../domain/entities/note.entity';

@Injectable()
export class UpdateNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(
    id: string,
    userId: string,
    content: string,
  ): Promise<NotePublicView> {
    const note = await this.noteRepository.update(id, userId, content);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note.toPublicView();
  }
}
