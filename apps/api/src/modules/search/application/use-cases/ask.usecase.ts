import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { RagService } from '../../domain/services/rag.service';
import { ProviderFactory } from '@repo/ai';
import { AskQueryDto, AskResultDto } from '../../interface/schemas/search.schema';
import { UserActivityModel } from '@repo/db';
import { Types } from 'mongoose';

@Injectable()
export class AskUseCase {
  private readonly logger = new Logger(AskUseCase.name);

  constructor(private readonly ragService: RagService) {}

  async execute(userId: string, query: AskQueryDto): Promise<AskResultDto> {
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to log user activity: ${msg}`);
    }

    return result;
  }
}
