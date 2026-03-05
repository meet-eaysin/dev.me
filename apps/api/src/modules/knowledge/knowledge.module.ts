import { Module } from '@nestjs/common';
import { IFolderRepository } from './domain/repositories/folder.repository';
import { ITagRepository } from './domain/repositories/tag.repository';
import { INoteRepository } from './domain/repositories/note.repository';
import { MongooseFolderRepository } from './infrastructure/persistence/mongoose-folder.repository';
import { MongooseTagRepository } from './infrastructure/persistence/mongoose-tag.repository';
import { MongooseNoteRepository } from './infrastructure/persistence/mongoose-note.repository';
import { CreateFolderUseCase } from './application/use-cases/create-folder.usecase';
import { GetFolderUseCase } from './application/use-cases/get-folder.usecase';
import { ListFoldersUseCase } from './application/use-cases/list-folders.usecase';
import { UpdateFolderUseCase } from './application/use-cases/update-folder.usecase';
import { DeleteFolderUseCase } from './application/use-cases/delete-folder.usecase';
import { ListFolderDocumentsUseCase } from './application/use-cases/list-folder-documents.usecase';
import { CreateTagUseCase } from './application/use-cases/create-tag.usecase';
import { ListTagsUseCase } from './application/use-cases/list-tags.usecase';
import { UpdateTagUseCase } from './application/use-cases/update-tag.usecase';
import { DeleteTagUseCase } from './application/use-cases/delete-tag.usecase';
import { ListTagDocumentsUseCase } from './application/use-cases/list-tag-documents.usecase';
import { CreateNoteUseCase } from './application/use-cases/create-note.usecase';
import { ListNotesUseCase } from './application/use-cases/list-notes.usecase';
import { GetNoteUseCase } from './application/use-cases/get-note.usecase';
import { UpdateNoteUseCase } from './application/use-cases/update-note.usecase';
import { DeleteNoteUseCase } from './application/use-cases/delete-note.usecase';
import { KnowledgeController } from './interface/knowledge.controller';
import { DocumentsModule } from '../documents/documents.module';

const useCases = [
  CreateFolderUseCase,
  GetFolderUseCase,
  ListFoldersUseCase,
  UpdateFolderUseCase,
  DeleteFolderUseCase,
  ListFolderDocumentsUseCase,
  CreateTagUseCase,
  ListTagsUseCase,
  UpdateTagUseCase,
  DeleteTagUseCase,
  ListTagDocumentsUseCase,
  CreateNoteUseCase,
  ListNotesUseCase,
  GetNoteUseCase,
  UpdateNoteUseCase,
  DeleteNoteUseCase,
];

@Module({
  imports: [DocumentsModule],
  controllers: [KnowledgeController],
  providers: [
    ...useCases,
    {
      provide: IFolderRepository,
      useClass: MongooseFolderRepository,
    },
    {
      provide: ITagRepository,
      useClass: MongooseTagRepository,
    },
    {
      provide: INoteRepository,
      useClass: MongooseNoteRepository,
    },
  ],
  exports: [IFolderRepository, ITagRepository, INoteRepository],
})
export class KnowledgeModule {}
