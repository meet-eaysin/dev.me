import { Injectable } from '@nestjs/common';
import { CreateDocumentUseCase } from './create-document.usecase';
import { LocalStorage } from '../../../../shared/infrastructure/storage/local-storage';
import { validateFileType } from '../../../../shared/infrastructure/file-validation';
import { DocumentPublicView } from '../../domain/entities/document.entity';
import { CreateUploadDocumentCommand } from '../command/create-upload-document';

@Injectable()
export class CreateUploadDocumentUseCase {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly localStorage: LocalStorage,
  ) {}

  async execute(
    command: CreateUploadDocumentCommand,
  ): Promise<DocumentPublicView> {
    const fileType = validateFileType(command.buffer, command.mimeType);

    const fileRef = await this.localStorage.saveFile(
      command.buffer,
      command.originalName,
      command.userId,
    );

    return this.createDocumentUseCase.execute({
      ...command,
      type: fileType,
      source: fileRef,
      title: command.title ?? undefined,
      folderIds: command.folderIds ?? undefined,
      tagIds: command.tagIds ?? undefined,
      metadata: command.metadata ?? undefined,
    });
  }
}
