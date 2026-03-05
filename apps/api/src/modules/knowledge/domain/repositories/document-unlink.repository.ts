export abstract class IDocumentUnlinkRepository {
  abstract removeFolderFromAllDocuments(
    folderId: string,
    userId: string,
  ): Promise<void>;
  abstract removeTagFromAllDocuments(
    tagId: string,
    userId: string,
  ): Promise<void>;
}
