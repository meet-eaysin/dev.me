import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { INoteRepository } from '../../domain/repositories/note.repository';
import { NotePublicView } from '../../domain/entities/note.entity';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';

interface CreateNoteCommand {
  userId: string;
  documentId: string;
  content: string;
}

@Injectable()
export class CreateNoteUseCase {
  private readonly logger = new Logger(CreateNoteUseCase.name);

  constructor(
    private readonly noteRepository: INoteRepository,
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(command: CreateNoteCommand): Promise<NotePublicView> {
    const doc = await this.documentRepository.findById(
      command.documentId,
      command.userId,
    );

    if (!doc) {
      throw new NotFoundException('Document not found or access denied');
    }

    const note = await this.noteRepository.create(command);

    this.logger.log(
      `Note created: ${note.id} for document: ${command.documentId} by user: ${command.userId}`,
    );

    return note.toPublicView();
  }
}
