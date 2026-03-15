import { Controller, Get, Patch, Post, Body } from '@nestjs/common';
import { Types } from 'mongoose';
import { LLMClientFactory, getProviderRegistry } from '@repo/ai';
import { encrypt } from '@repo/crypto';
import type {
  UpdateLLMConfigRequest,
  LLMSettingsResponse,
  TestLLMConfigRequest,
  LLMConfig,
} from '@repo/types';
import { User } from '../../../shared/decorators/user.decorator';
import { env } from '../../../shared/utils/env';

@Controller('user/settings/llm')
export class UserLlmSettingsController {
  constructor(private readonly llmClientFactory: LLMClientFactory) {}

  @Get()
  async getSettings(
    @User('userId') userId: string,
  ): Promise<LLMSettingsResponse> {
    const { UserModel } = await import('@repo/db');
    const user = await UserModel.findById(userId).select('llmUserSettings').lean();
    const settings = user?.llmUserSettings || { configs: [], activeConfigId: undefined };

    return {
      registry: getProviderRegistry(),
      configs: settings.configs.map((config) => ({
        id: config.id,
        providerId: config.providerId,
        modelId: config.modelId,
        embeddingModelId: config.embeddingModelId,
        useSystemDefault: config.useSystemDefault,
        hasApiKey: !!config.apiKey,
      })),
      activeConfigId: settings.activeConfigId,
    };
  }

  @Patch()
  async updateSettings(
    @User('userId') userId: string,
    @Body() body: UpdateLLMConfigRequest,
  ): Promise<{ success: boolean; message: string }> {
    const { UserModel } = await import('@repo/db');
    const user = await UserModel.findById(userId);

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const settings = user.llmUserSettings || {
      configs: [],
      activeConfigId: undefined,
    };

    if (body.activeConfigId !== undefined) {
      settings.activeConfigId = body.activeConfigId;
    }

    // If providerId is present, we are updating or adding a specific config
    if (body.providerId) {
      const configIndex = settings.configs.findIndex((c) => c.id === body.id);

      const newConfig: LLMConfig = {
        id: body.id || new Types.ObjectId().toHexString(),
        providerId: body.providerId,
        modelId: body.modelId,
        embeddingModelId: body.embeddingModelId,
        useSystemDefault: body.useSystemDefault,
      };

      if (body.apiKey !== undefined) {
        if (body.apiKey.trim() === '') {
          newConfig.apiKey = undefined;
        } else {
          newConfig.apiKey = encrypt(body.apiKey, env.ENCRYPTION_KEY);
        }
      } else if (configIndex > -1) {
        // Keep existing API key if it wasn't provided in the update
        newConfig.apiKey = settings.configs[configIndex]?.apiKey;
      }

      if (configIndex > -1) {
        settings.configs[configIndex] = newConfig;
      } else {
        settings.configs.push(newConfig);
        if (!settings.activeConfigId) {
          settings.activeConfigId = newConfig.id;
        }
      }
    }

    user.llmUserSettings = settings;
    await user.save();

    return { success: true, message: 'LLM settings updated successfully' };
  }

  @Post('test')
  async testConfig(
    @User('userId') _userId: string,
    @Body() body: TestLLMConfigRequest,
  ): Promise<{ success: boolean; message: string; response?: string }> {
    try {
      const testConfig = {
        providerId: body.providerId,
        modelId: body.modelId,
        apiKey: body.apiKey
          ? encrypt(body.apiKey, env.ENCRYPTION_KEY)
          : undefined,
        useSystemDefault: body.useSystemDefault,
      };

      const resolvedClient =
        await this.llmClientFactory.createForUser(testConfig);

      const response = await resolvedClient.complete({
        messages: [
          {
            role: 'user',
            content: body.message || 'Hello! Test my connection.',
          },
        ],
      });

      return {
        success: true,
        message: 'Connection successful',
        response,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Connection failed';
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}
