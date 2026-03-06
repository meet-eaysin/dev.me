import { Injectable } from '@nestjs/common';
import { LLMConfigModel } from '@repo/db';
import { LLMConfigPublicView, SaveLLMConfigRequest } from '@repo/types';
import { LLMConfigEntity } from '../../domain/entities/llm-config.entity';
import { encrypt } from '@repo/crypto';
import { env } from '../../../../shared/utils/env';
import { LLMValidatorService } from '../../domain/services/llm-validator.service';
import { Types } from 'mongoose';

@Injectable()
export class SaveLLMConfigUseCase {
  constructor(private readonly validatorService: LLMValidatorService) {}

  async execute(
    userId: string,
    data: SaveLLMConfigRequest,
  ): Promise<LLMConfigPublicView> {
    // 1. Validate
    const capabilities = await this.validatorService.validate(
      data.provider,
      data.apiKey || null,
      data.baseUrl || null,
      data.chatModel,
      data.embeddingModel,
    );

    // 2. Encrypt API key
    let encryptedApiKey: string | undefined;
    if (data.apiKey) {
      encryptedApiKey = encrypt(data.apiKey, env.ENCRYPTION_KEY);
    }

    // 3. Upsert
    const updated = await LLMConfigModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $set: {
          provider: data.provider,
          chatModel: data.chatModel,
          embeddingModel: data.embeddingModel,
          apiKey: encryptedApiKey,
          baseUrl: data.baseUrl,
          capabilities,
          validatedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    const entity = new LLMConfigEntity({
      id: updated._id.toString(),
      userId: updated.userId.toString(),
      provider: updated.provider,
      chatModel: updated.chatModel,
      embeddingModel: updated.embeddingModel,
      apiKey: null, // Strip for entity to ensure toPublicView is safe
      baseUrl: updated.baseUrl || null,
      capabilities: updated.capabilities,
      validatedAt: updated.validatedAt,
    });

    return entity.toPublicView();
  }
}
