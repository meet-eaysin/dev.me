export enum DocumentType {
  URL = "url",
  YOUTUBE = "youtube",
  PDF = "pdf",
  IMAGE = "image",
  TEXT = "text",
}

export enum DocumentStatus {
  TO_READ = "to_read",
  TO_WATCH = "to_watch",
  IN_PROCESS = "in_process",
  REVIEW = "review",
  UPCOMING = "upcoming",
  COMPLETED = "completed",
  PENDING_COMPLETION = "pending_completion",
}

export enum SourceType {
  FILE = "file",
  URL = "url",
  NOTION = "notion",
}

export interface IDocumentView {
  id: string;
  userId: string;
  folderId?: string;
  title: string;
  content?: string;
  type: DocumentType;
  status: DocumentStatus;
  sourceType: SourceType;
  sourceUrl?: string;
  mimeType?: string;
  tags: string[];
  summary?: string;
  metadata: Record<string, unknown>;
  ingestionStatus?: string;
  createdAt: string;
  updatedAt: string;
}
