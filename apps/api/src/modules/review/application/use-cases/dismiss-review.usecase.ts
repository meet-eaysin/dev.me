import { Injectable, NotFoundException } from '@nestjs/common';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { ReviewDismissalModel } from '@repo/db';
import { Types } from 'mongoose';

@Injectable()
export class DismissReviewUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(documentId: string, userId: string): Promise<void> {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) {
      throw new NotFoundException('Document not found or does not belong to user');
    }

    const today = new Date().toISOString().split('T')[0] ?? '';

    await ReviewDismissalModel.updateOne(
      {
        userId: new Types.ObjectId(userId),
        targetId: new Types.ObjectId(documentId),
        date: today,
      },
      {
        $set: {
          targetType: 'document',
          createdAt: new Date(),
        },
      },
      { upsert: true },
    );
  }
}
