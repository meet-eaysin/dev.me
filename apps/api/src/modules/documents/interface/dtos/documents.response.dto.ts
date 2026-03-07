import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, DocumentStatus, IngestionStatus } from '@repo/types';

export class DocumentPublicViewDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  id!: string;

  @ApiProperty({ example: 'Annual Report' })
  title!: string;

  @ApiProperty({ example: 'uploads/report.pdf' })
  source!: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.PDF })
  type!: DocumentType;

  @ApiProperty({ enum: DocumentStatus, example: DocumentStatus.COMPLETED })
  status!: DocumentStatus;

  @ApiProperty({ example: ['65f1a2b3c4d5e6f7a8b9c0d1'] })
  folderIds!: string[];

  @ApiProperty({ example: ['65f1a2b3c4d5e6f7a8b9c0d2'] })
  tagIds!: string[];

  @ApiPropertyOptional({ example: { author: 'Eaysin' } })
  metadata?: Record<string, unknown>;

  @ApiProperty({ example: '2026-03-05T12:00:00.000Z' })
  createdAt!: string;

  @ApiProperty({ example: '2026-03-05T12:00:00.000Z' })
  updatedAt!: string;
}

export class IngestionStatusViewDto {
  @ApiPropertyOptional({
    enum: IngestionStatus,
    example: IngestionStatus.COMPLETED,
  })
  ingestionStatus?: IngestionStatus;

  @ApiPropertyOptional({ example: 'Indexing content' })
  currentStage?: string;

  @ApiProperty({ example: true })
  embeddingsReady!: boolean;

  @ApiPropertyOptional({ example: 'Failed to parse file' })
  ingestionError?: string;
}

export class DocumentResponseDto {
  @ApiProperty({ type: DocumentPublicViewDto })
  document!: DocumentPublicViewDto;
}

export class TranscriptResponseDto {
  @ApiProperty({ example: 'Parsed content of the document...' })
  content!: string;
}
