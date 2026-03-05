import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  Max,
  IsInt,
  Matches,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { DocumentType, DocumentStatus } from '@repo/types';

export enum SearchMode {
  NORMAL = 'normal',
  AI = 'ai',
}

export class SearchQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'Query is required' })
  q!: string;

  @IsEnum(SearchMode)
  @IsOptional()
  mode?: SearchMode = SearchMode.NORMAL;

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

export class AskQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'Question is required' })
  question!: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    each: true,
    message: 'Invalid document ID format',
  })
  documentIds?: string[];
}

export interface SemanticSearchResult {
  documentId: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  score: number;
  preview: string;
  tags?: string[];
  createdAt: Date;
}

export interface SourceRef {
  documentId: string;
  title: string;
  author: string | null;
  publishedAt: string | null;
  originalSource: string | null;
}

export interface AskResult {
  answer: string;
  sources: SourceRef[];
  tokensUsed: number;
}
