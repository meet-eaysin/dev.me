import { Injectable, NotFoundException } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository';
import { NotePublicView } from '../../domain/entities/note.entity';

@Injectable()
export class GetNoteUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(id: string, userId: string): Promise<NotePublicView> {
    const note = await this.noteRepository.findById(id, userId);

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note.toPublicView();
  }
}
