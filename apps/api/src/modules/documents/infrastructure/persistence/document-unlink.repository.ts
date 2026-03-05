import { Injectable } from '@nestjs/common';
import { DocumentModel, TagModel } from '@repo/db';
import { Types } from 'mongoose';
import { IDocumentUnlinkRepository } from '../../../knowledge/domain/repositories/document-unlink.repository';

@Injectable()
export class MongooseDocumentUnlinkRepository extends IDocumentUnlinkRepository {
  async removeFolderFromAllDocuments(
    folderId: string,
    userId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(folderId)) return;

    await DocumentModel.updateMany(
      { userId, folderId: new Types.ObjectId(folderId) },
      { $unset: { folderId: '' } },
    ).exec();
  }

  async removeTagFromAllDocuments(
    tagId: string,
    userId: string,
  ): Promise<void> {
    if (!Types.ObjectId.isValid(tagId)) return;

    const tag = await TagModel.findOne({
      _id: new Types.ObjectId(tagId),
      userId,
    })
      .select('name')
      .lean<{ name?: string }>()
      .exec();

    if (!tag?.name) return;

    await DocumentModel.updateMany(
      { userId, tags: tag.name },
      { $pull: { tags: tag.name } },
    ).exec();
  }
}
