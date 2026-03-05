import { NotionAction } from "@repo/types";

export interface IngestionJobData {
  documentId: string;
  userId: string;
  type: string;
  source: string;
  fileRef?: string;
}

export interface SummaryJobData {
  documentId: string;
  userId: string;
}

export interface GraphJobData {
  documentId: string;
  userId: string;
}

export interface NotionSyncJobData {
  documentId: string;
  userId: string;
  action: NotionAction;
}

export interface TranscriptJobData {
  documentId: string;
  userId: string;
}
