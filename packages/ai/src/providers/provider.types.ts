export type ProviderAdapterKey = 'openai' | 'google' | 'ollama';

export interface LlmFactoryOptions {
  defaultProviderId: string;
  defaultModelId: string;
  defaultApiKey?: string;
  encryptionKey?: string;
  ollamaUrl?: string;
  allowDevFallback?: boolean;
}

export interface ResolvedLLMConfig {
  provider: string;
  chatModel: string;
  embeddingModel: string;
  apiKey: string | undefined;
  baseUrl: string;
  adapterKey: ProviderAdapterKey;
  allowDevFallback: boolean;
}
