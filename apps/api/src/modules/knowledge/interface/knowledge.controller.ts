import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { CreateFolderUseCase } from '../application/use-cases/create-folder.usecase';
import { GetFolderUseCase } from '../application/use-cases/get-folder.usecase';
import { ListFoldersUseCase } from '../application/use-cases/list-folders.usecase';
import { UpdateFolderUseCase } from '../application/use-cases/update-folder.usecase';
import { DeleteFolderUseCase } from '../application/use-cases/delete-folder.usecase';
import { ListFolderDocumentsUseCase } from '../application/use-cases/list-folder-documents.usecase';
import { CreateTagUseCase } from '../application/use-cases/create-tag.usecase';
import { ListTagsUseCase } from '../application/use-cases/list-tags.usecase';
import { UpdateTagUseCase } from '../application/use-cases/update-tag.usecase';
import { DeleteTagUseCase } from '../application/use-cases/delete-tag.usecase';
import { ListTagDocumentsUseCase } from '../application/use-cases/list-tag-documents.usecase';
import { CreateNoteUseCase } from '../application/use-cases/create-note.usecase';
import { ListNotesUseCase } from '../application/use-cases/list-notes.usecase';
import { GetNoteUseCase } from '../application/use-cases/get-note.usecase';
import { UpdateNoteUseCase } from '../application/use-cases/update-note.usecase';
import { DeleteNoteUseCase } from '../application/use-cases/delete-note.usecase';
import {
  CreateFolderDto,
  UpdateFolderDto,
  FolderPaginationDto,
} from './schemas/folder.schema';
import { CreateTagDto, UpdateTagDto } from './schemas/tag.schema';
import {
  CreateNoteDto,
  UpdateNoteDto,
  ListNotesDto,
} from './schemas/note.schema';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { User } from '../../../shared/decorators/user.decorator';

@Controller('knowledge')
@UseGuards(DevUserGuard)
export class KnowledgeController {
  constructor(
    private readonly listFoldersUseCase: ListFoldersUseCase,
    private readonly createFolderUseCase: CreateFolderUseCase,
    private readonly getFolderUseCase: GetFolderUseCase,
    private readonly updateFolderUseCase: UpdateFolderUseCase,
    private readonly deleteFolderUseCase: DeleteFolderUseCase,
    private readonly listFolderDocsUseCase: ListFolderDocumentsUseCase,
    private readonly listTagsUseCase: ListTagsUseCase,
    private readonly createTagUseCase: CreateTagUseCase,
    private readonly updateTagUseCase: UpdateTagUseCase,
    private readonly deleteTagUseCase: DeleteTagUseCase,
    private readonly listTagDocsUseCase: ListTagDocumentsUseCase,
    private readonly listNotesUseCase: ListNotesUseCase,
    private readonly createNoteUseCase: CreateNoteUseCase,
    private readonly getNoteUseCase: GetNoteUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {}

  // Folders
  @Get('folders')
  async listFolders(@User('userId') userId: string) {
    const folders = await this.listFoldersUseCase.execute(userId);
    return { success: true, data: { folders } };
  }

  @Post('folders')
  @HttpCode(HttpStatus.CREATED)
  async createFolder(
    @User('userId') userId: string,
    @Body() data: CreateFolderDto,
  ) {
    const folder = await this.createFolderUseCase.execute({
      userId,
      ...data,
    });
    return { success: true, data: { folder } };
  }

  @Get('folders/:id')
  async getFolder(@User('userId') userId: string, @Param('id') id: string) {
    const result = await this.getFolderUseCase.execute(id, userId);
    return { success: true, data: result };
  }

  @Patch('folders/:id')
  async updateFolder(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateFolderDto,
  ) {
    const folder = await this.updateFolderUseCase.execute({
      id,
      userId,
      data,
    });
    return { success: true, data: { folder } };
  }

  @Delete('folders/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFolder(@User('userId') userId: string, @Param('id') id: string) {
    await this.deleteFolderUseCase.execute(id, userId);
  }

  @Get('folders/:id/documents')
  async listFolderDocuments(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Query() query: FolderPaginationDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const result = await this.listFolderDocsUseCase.execute({
      folderId: id,
      userId,
      page,
      limit,
    });
    return {
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page,
        limit,
      },
    };
  }

  // Tags
  @Get('tags')
  async listTags(@User('userId') userId: string) {
    const tags = await this.listTagsUseCase.execute(userId);
    return { success: true, data: { tags } };
  }

  @Post('tags')
  @HttpCode(HttpStatus.CREATED)
  async createTag(@User('userId') userId: string, @Body() data: CreateTagDto) {
    const tag = await this.createTagUseCase.execute({
      userId,
      ...data,
    });
    return { success: true, data: { tag } };
  }

  @Patch('tags/:id')
  async updateTag(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateTagDto,
  ) {
    const tag = await this.updateTagUseCase.execute({
      id,
      userId,
      data,
    });
    return { success: true, data: { tag } };
  }

  @Delete('tags/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTag(@User('userId') userId: string, @Param('id') id: string) {
    await this.deleteTagUseCase.execute(id, userId);
  }

  @Get('tags/:id/documents')
  async listTagDocuments(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Query() query: FolderPaginationDto,
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const result = await this.listTagDocsUseCase.execute({
      tagId: id,
      userId,
      page,
      limit,
    });
    return {
      success: true,
      data: {
        items: result.items,
        total: result.total,
        page,
        limit,
      },
    };
  }

  // Notes
  @Get('notes')
  async listNotes(
    @User('userId') userId: string,
    @Query() query: ListNotesDto,
  ) {
    const notes = await this.listNotesUseCase.execute(query.documentId, userId);
    return { success: true, data: { notes } };
  }

  @Post('notes')
  @HttpCode(HttpStatus.CREATED)
  async createNote(
    @User('userId') userId: string,
    @Body() data: CreateNoteDto,
  ) {
    const note = await this.createNoteUseCase.execute({
      userId,
      ...data,
    });
    return { success: true, data: { note } };
  }

  @Get('notes/:id')
  async getNote(@User('userId') userId: string, @Param('id') id: string) {
    const note = await this.getNoteUseCase.execute(id, userId);
    return { success: true, data: { note } };
  }

  @Patch('notes/:id')
  async updateNote(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateNoteDto,
  ) {
    const note = await this.updateNoteUseCase.execute(id, userId, data.content);
    return { success: true, data: { note } };
  }

  @Delete('notes/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(@User('userId') userId: string, @Param('id') id: string) {
    await this.deleteNoteUseCase.execute(id, userId);
  }
}
