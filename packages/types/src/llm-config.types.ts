export interface LLMModel {
  id: string;
  name: string;
  contextWindow: number;
  free: boolean;
}

export interface LLMProvider {
  id: string;
  name: string;
  baseURL: string;
  requiresApiKey: boolean;
  defaultModel: string;
  models: LLMModel[];
}

export interface LLMConfig {
  id?: string;
  providerId: string;
  modelId: string;
  embeddingModelId?: string;
  apiKey?: string;
  useSystemDefault: boolean;
}

export interface LLMUserSettings {
  configs: LLMConfig[];
  activeConfigId?: string;
}

export interface LLMSettingsResponse {
  configs: (Omit<LLMConfig, 'apiKey'> & { hasApiKey: boolean })[];
  activeConfigId?: string;
  registry: LLMProvider[];
}

export interface UpdateLLMConfigRequest extends UpdateLLMConfigSubRequest {
  activeConfigId?: string;
}

export interface UpdateLLMConfigSubRequest {
  id?: string;
  providerId: string;
  modelId: string;
  embeddingModelId?: string;
  apiKey?: string;
  useSystemDefault: boolean;
}

export interface TestLLMConfigRequest {
  providerId: string;
  modelId: string;
  apiKey?: string;
  useSystemDefault: boolean;
  message?: string;
}
