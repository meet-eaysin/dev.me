import { Injectable } from '@nestjs/common';
import { NotionConfigModel } from '@repo/db';

@Injectable()
export class DisconnectNotionUseCase {
  async execute(userId: string): Promise<void> {
    await NotionConfigModel.deleteOne({ userId });
    // Optionally clear notionPageIds from documents, but usually we keep them as historical record
    // await DocumentModel.updateMany({ userId }, { $unset: { notionPageId: "" } });
  }
}
