export type ProviderAdapterKey = 'openai' | 'google' | 'ollama';

export interface LlmFactoryOptions {
  defaultProviderId: string;
  defaultModelId: string;
  defaultApiKey?: string;
  defaultEmbeddingProviderId?: string;
  defaultEmbeddingModelId?: string;
  defaultEmbeddingApiKey?: string;
  encryptionKey?: string;
  ollamaUrl?: string;
  allowDevFallback?: boolean;
}

export interface ResolvedLLMConfig {
  provider: string;
  chatModel: string;
  embeddingProvider: string;
  embeddingModel: string;
  apiKey: string | undefined;
  embeddingApiKey: string | undefined;
  baseUrl: string;
  embeddingBaseUrl: string;
  adapterKey: ProviderAdapterKey;
  embeddingAdapterKey: ProviderAdapterKey;
  allowDevFallback: boolean;
}
