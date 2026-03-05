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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentUseCase } from '../application/use-cases/create-document.usecase';
import { CreateUploadDocumentUseCase } from '../application/use-cases/create-upload-document.usecase';
import { DeleteDocumentUseCase } from '../application/use-cases/delete-document.usecase';
import { GetDocumentUseCase } from '../application/use-cases/get-document.usecase';
import { GetIngestionStatusUseCase } from '../application/use-cases/get-ingestion-status.usecase';
import { ListDocumentsUseCase } from '../application/use-cases/list-documents.usecase';
import { RetryIngestionUseCase } from '../application/use-cases/retry-ingestion.usecase';
import { SummaryUseCase } from '../application/use-cases/summary.usecase';
import { TranscriptUseCase } from '../application/use-cases/transcript.usecase';
import { UpdateDocumentUseCase } from '../application/use-cases/update-document.usecase';
import {
  CreateDocumentDto,
  UpdateDocumentDto,
  ListDocumentsDto,
  UploadDocumentDto,
} from './dtos/documents.schema';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { User } from '../../../shared/decorators/user.decorator';

@Controller('documents')
@UseGuards(DevUserGuard)
export class DocumentsController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly createUploadDocumentUseCase: CreateUploadDocumentUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly getIngestionStatusUseCase: GetIngestionStatusUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly retryIngestionUseCase: RetryIngestionUseCase,
    private readonly summaryUseCase: SummaryUseCase,
    private readonly transcriptUseCase: TranscriptUseCase,
    private readonly updateDocumentUseCase: UpdateDocumentUseCase,
  ) {}

  @Get()
  async listDocuments(
    @User('userId') userId: string,
    @Query() filters: ListDocumentsDto,
  ) {
    return this.listDocumentsUseCase.execute(userId, filters);
  }

  @Post()
  async createDocument(
    @User('userId') userId: string,
    @Body() data: CreateDocumentDto,
  ) {
    const doc = await this.createDocumentUseCase.execute({
      userId,
      ...data,
      source: data.source,
    });
    return { success: true, data: { document: doc } };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @User('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadDocumentDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const doc = await this.createUploadDocumentUseCase.execute({
      userId,
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      title: body.title,
      folderIds: body.folderIds,
      tagIds: body.tagIds,
      metadata: body.metadata,
    });

    return { success: true, data: { document: doc } };
  }

  @Get(':id')
  async getDocument(@User('userId') userId: string, @Param('id') id: string) {
    const doc = await this.getDocumentUseCase.execute(id, userId);
    return { success: true, data: { document: doc } };
  }

  @Patch(':id')
  async updateDocument(
    @User('userId') userId: string,
    @Param('id') id: string,
    @Body() data: UpdateDocumentDto,
  ) {
    const doc = await this.updateDocumentUseCase.execute({
      id,
      userId,
      data,
    });
    return { success: true, data: { document: doc } };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDocument(
    @User('userId') userId: string,
    @Param('id') id: string,
  ) {
    await this.deleteDocumentUseCase.execute(id, userId);
  }

  @Get(':id/ingestion-status')
  async getIngestionStatus(
    @User('userId') userId: string,
    @Param('id') id: string,
  ) {
    const status = await this.getIngestionStatusUseCase.execute(id, userId);
    return { success: true, data: status };
  }

  @Post(':id/retry-ingestion')
  async retryIngestion(
    @User('userId') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.retryIngestionUseCase.execute(id, userId);
    return { success: true, data: result };
  }

  @Post(':id/summary')
  async generateSummary(
    @User('userId') userId: string,
    @Param('id') id: string,
  ) {
    await this.summaryUseCase.generateSummary(id, userId);
    return { success: true, message: 'Summary generation started' };
  }

  @Delete(':id/summary')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSummary(@User('userId') userId: string, @Param('id') id: string) {
    await this.summaryUseCase.deleteSummary(id, userId);
  }

  @Get(':id/transcript')
  async getTranscript(@User('userId') userId: string, @Param('id') id: string) {
    const result = await this.transcriptUseCase.getTranscript(id, userId);
    return { success: true, data: result };
  }

  @Post(':id/transcript')
  async generateTranscript(
    @User('userId') userId: string,
    @Param('id') id: string,
  ) {
    const result = await this.transcriptUseCase.generateTranscript(id, userId);
    return { success: true, data: result };
  }
}
