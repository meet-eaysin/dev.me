import { Module, Global } from '@nestjs/common';
import { LLMClientFactory } from '@repo/ai';
import { env } from '../../shared/utils/env';

@Global()
@Module({
  providers: [
    {
      provide: LLMClientFactory,
      useFactory: () =>
        new LLMClientFactory({
          defaultProviderId: env.DEFAULT_LLM_PROVIDER_ID,
          defaultModelId: env.DEFAULT_LLM_MODEL_ID,
          defaultApiKey: env.DEFAULT_LLM_API_KEY,
          defaultEmbeddingProviderId: env.DEFAULT_EMBEDDING_PROVIDER_ID,
          defaultEmbeddingModelId: env.DEFAULT_EMBEDDING_MODEL_ID,
          defaultEmbeddingApiKey: env.DEFAULT_EMBEDDING_API_KEY,
          encryptionKey: env.ENCRYPTION_KEY,
          ollamaUrl: env.OLLAMA_URL,
          allowDevFallback: env.NODE_ENV === 'development',
        }),
    },
  ],
  exports: [LLMClientFactory],
})
export class LlmModule {}
