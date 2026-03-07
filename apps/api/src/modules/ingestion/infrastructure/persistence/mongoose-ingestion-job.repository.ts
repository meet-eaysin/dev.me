import { Injectable } from '@nestjs/common';
import { IngestionJobModel, IIngestionJobDocument } from '@repo/db';
import { Types } from 'mongoose';
import {
  IIngestionJobRepository,
  IngestionJobView,
} from '../../domain/repositories/ingestion-job.repository';
import { IngestionStatus, IngestionStage } from '@repo/types';

@Injectable()
export class MongooseIngestionJobRepository extends IIngestionJobRepository {
  async create(data: {
    userId: string;
    documentId: string;
    status?: IngestionStatus;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    await IngestionJobModel.findOneAndUpdate(
      { documentId: new Types.ObjectId(data.documentId) },
      {
        $set: {
          userId: new Types.ObjectId(data.userId),
          status: data.status || IngestionStatus.PENDING,
          metadata: data.metadata || {},
        },
      },
      { upsert: true },
    );
  }

  async updateStage(
    documentId: string,
    stage: IngestionStage,
    status: IngestionStatus,
    userId?: string, // Optional userId for upsert support
  ): Promise<void> {
    const update: Record<string, unknown> = {
      $set: {
        [`stages.${stage}.status`]: status,
        [`stages.${stage}.updatedAt`]: new Date(),
        updatedAt: new Date(),
      },
    };

    if (userId) {
      update.$setOnInsert = {
        userId: new Types.ObjectId(userId),
        documentId: new Types.ObjectId(documentId),
        status: IngestionStatus.PROCESSING,
      };
    }

    await IngestionJobModel.findOneAndUpdate(
      { documentId: new Types.ObjectId(documentId) },
      update,
      { upsert: true },
    );
  }

  async markFailed(documentId: string, error: string): Promise<void> {
    await IngestionJobModel.updateOne(
      { documentId: new Types.ObjectId(documentId) },
      {
        $set: { status: IngestionStatus.FAILED, error, updatedAt: new Date() },
      },
    );
  }

  async findByDocumentId(documentId: string): Promise<IngestionJobView | null> {
    const doc = await IngestionJobModel.findOne({
      documentId: new Types.ObjectId(documentId),
    }).lean<IIngestionJobDocument>();

    if (!doc) return null;

    return {
      documentId: doc.documentId.toString(),
      userId: doc.userId.toString(),
      status: doc.status,
      error: doc.error || undefined,
      progress: doc.progress,
      metadata: doc.metadata || {},
    };
  }
}
