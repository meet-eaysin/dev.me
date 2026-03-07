import { Injectable } from '@nestjs/common';
import { IRefreshSessionDocument, RefreshSessionModel } from '@repo/db';
import { Types } from 'mongoose';
import {
  CreateRefreshSessionInput,
  IRefreshSessionRepository,
} from '../../domain/repositories/refresh-session.repository';
import { RefreshSessionEntity } from '../../domain/entities/refresh-session.entity';

@Injectable()
export class MongooseRefreshSessionRepository implements IRefreshSessionRepository {
  async create(
    input: CreateRefreshSessionInput,
  ): Promise<RefreshSessionEntity> {
    const doc = await RefreshSessionModel.create({
      sessionId: input.sessionId,
      userId: new Types.ObjectId(input.userId),
      tokenHash: input.tokenHash,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
      expiresAt: input.expiresAt,
    });

    return this.toEntity(doc);
  }

  async findActiveBySessionId(
    sessionId: string,
  ): Promise<RefreshSessionEntity | null> {
    const doc = await RefreshSessionModel.findOne({
      sessionId,
      revokedAt: { $exists: false },
    }).exec();

    if (!doc) {
      return null;
    }

    const entity = this.toEntity(doc);
    return entity.isActive() ? entity : null;
  }

  async findActiveByUserId(userId: string): Promise<RefreshSessionEntity[]> {
    const docs = await RefreshSessionModel.find({
      userId: new Types.ObjectId(userId),
      revokedAt: { $exists: false },
    }).exec();

    return docs
      .map((doc) => this.toEntity(doc))
      .filter((session) => session.isActive());
  }

  async revoke(sessionId: string): Promise<void> {
    await RefreshSessionModel.updateOne(
      { sessionId, revokedAt: { $exists: false } },
      { $set: { revokedAt: new Date() } },
    ).exec();
  }

  async revokeAllForUser(userId: string): Promise<void> {
    await RefreshSessionModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        revokedAt: { $exists: false },
      },
      { $set: { revokedAt: new Date() } },
    ).exec();
  }

  private toEntity(doc: IRefreshSessionDocument): RefreshSessionEntity {
    return new RefreshSessionEntity({
      id: doc._id.toString(),
      sessionId: doc.sessionId,
      userId: doc.userId.toString(),
      tokenHash: doc.tokenHash,
      userAgent: doc.userAgent,
      ipAddress: doc.ipAddress,
      expiresAt: doc.expiresAt,
      revokedAt: doc.revokedAt,
    });
  }
}
