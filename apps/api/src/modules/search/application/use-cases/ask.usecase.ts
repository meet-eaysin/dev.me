import { Injectable, BadRequestException } from '@nestjs/common';
import { RagService } from '../../domain/services/rag.service';
import { ProviderFactory } from '@repo/ai';
import { AskQueryDto, AskResult } from '../../interface/schemas/search.schema';
import { UserActivityModel } from '@repo/db';
import { Types } from 'mongoose';

@Injectable()
export class AskUseCase {
  constructor(private readonly ragService: RagService) {}

  async execute(userId: string, query: AskQueryDto): Promise<AskResult> {
    if (!query.question || query.question.trim().length === 0) {
      throw new BadRequestException('Question cannot be empty');
    }

    const llmConfig = await ProviderFactory.getLLMConfig(userId);
    const result = await this.ragService.ask(
      userId,
      query.question,
      llmConfig,
      query.documentIds,
    );

    // Log user activity asynchronously
    try {
      await UserActivityModel.create({
        userId: new Types.ObjectId(userId),
        targetId: new Types.ObjectId(userId), // Using userId as dummy target if none generic available
        targetType: 'ask_result',
        action: 'ask_performed',
        metadata: {
          tokensUsed: result.tokensUsed,
          sourcesCount: result.sources.length,
        },
      });
    } catch (error) {
      console.error('[AskUseCase] Failed to log user activity:', error);
    }

    return result;
  }
}
