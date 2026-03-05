import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsObject,
  Matches,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { DocumentType, DocumentStatus } from '@repo/types';

export class CreateDocumentDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  type!: DocumentType;

  @IsString()
  @IsNotEmpty()
  source!: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    each: true,
    message: 'Invalid folder ID format',
  })
  @IsOptional()
  folderIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateDocumentDto {
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsString()
  @IsOptional()
  title?: string;

  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Invalid folder ID format' })
  @IsOptional()
  folderId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagIds?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class ListDocumentsDto {
  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;

  @IsEnum(DocumentType)
  @IsOptional()
  type?: DocumentType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    each: true,
    message: 'Invalid folder ID format',
  })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  folderIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  tagIds?: string[];

  @IsString()
  @IsOptional()
  q?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class UploadDocumentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    each: true,
    message: 'Invalid folder ID format',
  })
  folderIds?: string[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? [value] : value))
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  @IsObject()
  metadata?: Record<string, unknown>;
}
