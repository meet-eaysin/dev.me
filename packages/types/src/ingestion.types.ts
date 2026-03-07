export enum IngestionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum IngestionStage {
  START = 'start',
  EXTRACT = 'extract',
  CLASSIFY = 'classify',
  CHUNK = 'chunk',
  EMBED = 'embed',
  GRAPH = 'graph',
  NOTION_SYNC = 'notion-sync',
  DONE = 'done',
}

export enum NotionAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}
