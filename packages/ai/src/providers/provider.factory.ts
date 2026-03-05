import { LLMConfigModel, ILLMConfig } from "@repo/db";
import { Types } from "mongoose";

export interface ResolvedLLMConfig {
  provider: "openai" | "anthropic" | "ollama";
  chatModel: string;
  embeddingModel: string;
  apiKey: string | null;
  baseUrl: string | null;
}

export class ProviderFactory {
  static async getLLMConfig(userId: string): Promise<ResolvedLLMConfig> {
    if (!Types.ObjectId.isValid(userId)) {
      return ProviderFactory.ollamaDefaults();
    }

    const config = await LLMConfigModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean<ILLMConfig>();

    if (!config) {
      return ProviderFactory.ollamaDefaults();
    }

    // Decrypt API key if present
    let apiKey = config.apiKey ?? null;
    if (apiKey && process.env.ENCRYPTION_KEY) {
      const {
        decrypt,
      } = require("../../../apps/api/src/shared/infrastructure/crypto/encryption");
      try {
        apiKey = decrypt(apiKey, process.env.ENCRYPTION_KEY);
      } catch (e) {
        console.error("[ProviderFactory] Failed to decrypt API key");
      }
    }

    return {
      provider: config.provider,
      chatModel: config.chatModel,
      embeddingModel: config.embeddingModel,
      apiKey,
      baseUrl: config.baseUrl ?? null,
    };
  }

  private static ollamaDefaults(): ResolvedLLMConfig {
    return {
      provider: "ollama",
      chatModel: "llama3.2",
      embeddingModel: "nomic-embed-text",
      apiKey: null,
      baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
    };
  }
}
