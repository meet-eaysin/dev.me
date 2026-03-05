import { Injectable } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository';
import { NotePublicView } from '../../domain/entities/note.entity';

@Injectable()
export class ListNotesUseCase {
  constructor(private readonly noteRepository: INoteRepository) {}

  async execute(documentId: string, userId: string): Promise<NotePublicView[]> {
    const notes = await this.noteRepository.findAllByDocument(
      documentId,
      userId,
    );
    return notes.map((n) => n.toPublicView());
  }
}
