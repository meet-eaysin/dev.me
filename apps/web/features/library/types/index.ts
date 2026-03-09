import type {
  DocumentStatus,
  DocumentType,
  PaginatedResponse,
  SourceType,
} from '@repo/types';

export interface DocumentRow {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  sourceType: SourceType;
  sourceUrl?: string;
  tags: string[];
  folderId?: string;
  lastOpenedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentsListData = PaginatedResponse<DocumentRow>;
