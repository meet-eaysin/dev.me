import type { NotionAction } from './ingestion.types';

/**
 * Queue Name Constants
 */
export const QUEUE_EMAILS = 'emails' as const;
export const QUEUE_INGESTION = 'ingestion' as const;
export const QUEUE_SUMMARY = 'summary' as const;
export const QUEUE_TRANSCRIPT = 'transcript' as const;
export const QUEUE_GRAPH = 'graph' as const;
export const QUEUE_NOTION_SYNC = 'notion-sync' as const;

/**
 * Default Job Options
 */
export const DEFAULT_QUEUE_JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  removeOnComplete: true,
  removeOnFail: 1000,
};

/**
 * Job Data Interfaces
 */
export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
  metadata?: Record<string, unknown>;
}

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
