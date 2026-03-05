export interface CreateDocumentCommand {
  userId: string;
  type: string;
  source: string;
  title?: string | undefined;
  folderIds?: string[] | undefined;
  tagIds?: string[] | undefined;
  metadata?: Record<string, unknown> | undefined;
}
