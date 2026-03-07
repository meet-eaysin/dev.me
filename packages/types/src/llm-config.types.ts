export interface LLMConfigPublicView {
  userId: string;
  provider: 'openai' | 'anthropic' | 'ollama';
  chatModel: string;
  embeddingModel: string;
  baseUrl: string | null;
  capabilities: {
    chat: boolean;
    embeddings: boolean;
  };
  validatedAt: string | null;
}

export interface SaveLLMConfigRequest {
  provider: 'openai' | 'anthropic' | 'ollama';
  chatModel: string;
  embeddingModel: string;
  apiKey?: string;
  baseUrl?: string;
}

export type ValidateLLMConfigRequest = SaveLLMConfigRequest;

export interface LLMCapabilities {
  chat: boolean;
  embeddings: boolean;
}
