import type { DocumentFilters } from '@/features/library/types';

export const QUERY_KEYS = {
  AUTH: {
    SESSION: ['auth', 'session'] as const,
  },
  LIBRARY: {
    ROOT: ['library'] as const,
    documents: (filters: DocumentFilters) =>
      ['library', 'documents', filters] as const,
    document: (id: string) => ['library', 'document', id] as const,
    documentIngestion: (id: string) =>
      ['library', 'document', id, 'ingestion'] as const,
    documentTranscript: (id: string) =>
      ['library', 'document', id, 'transcript'] as const,
    folders: () => ['library', 'folders'] as const,
    folderDocuments: (id: string, page: number, limit: number) =>
      ['library', 'folders', id, 'documents', page, limit] as const,
    notes: (documentId: string) =>
      ['library', 'document', documentId, 'notes'] as const,
  },
  SEARCH: {
    ROOT: ['search'] as const,
    results: (params: Record<string, unknown>) =>
      ['search', 'results', params] as const,
    chats: (includeArchived = false) =>
      ['search', 'chats', { includeArchived }] as const,
    chat: (id: string) => ['search', 'chats', id] as const,
  },
  REVIEW: {
    ROOT: ['review'] as const,
    daily: () => ['review', 'daily'] as const,
    recommendations: () => ['review', 'recommendations'] as const,
  },
  ANALYTICS: {
    ROOT: ['analytics'] as const,
    stats: () => ['analytics', 'stats'] as const,
    heatmap: (days: number) => ['analytics', 'heatmap', days] as const,
  },
  USERS: {
    ROOT: ['users'] as const,
    me: () => ['users', 'me'] as const,
    sessions: () => ['users', 'me', 'sessions'] as const,
  },
  SETTINGS: {
    ROOT: ['settings'] as const,
    llm: () => ['settings', 'llm'] as const,
    notionConfig: () => ['settings', 'notion', 'config'] as const,
    notionDatabases: () => ['settings', 'notion', 'databases'] as const,
  },
  GRAPH: {
    ROOT: ['graph'] as const,
    full: () => ['graph', 'full'] as const,
    document: (id: string) => ['graph', 'document', id] as const,
  },
} as const;
