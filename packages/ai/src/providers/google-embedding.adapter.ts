import { GoogleGenAI } from '@google/genai';
import type { ResolvedLLMConfig } from './provider.factory';

export class GoogleEmbeddingAdapter {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  async embedText(text: string, config: ResolvedLLMConfig): Promise<number[]> {
    try {
      const response = await this.client.models.embedContent({
        model: config.embeddingModel,
        contents: [{ role: 'user', parts: [{ text }] }],
      });

      if (
        !response.embeddings ||
        !response.embeddings[0] ||
        !response.embeddings[0].values
      ) {
        throw new Error('Empty embedding response from Gemini API');
      }

      return response.embeddings[0].values;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Gemini embedding failed: ${message}`);
    }
  }

  async embedBatch(
    texts: string[],
    config: ResolvedLLMConfig,
  ): Promise<number[][]> {
    try {
      const response = await this.client.models.embedContent({
        model: config.embeddingModel,
        contents: texts.map((text) => ({ role: 'user', parts: [{ text }] })),
      });

      if (!response.embeddings) {
        throw new Error('Empty batch embedding response from Gemini API');
      }

      return response.embeddings.map((e) => {
        if (!e.values) {
          throw new Error('Invalid embedding value in batch response');
        }
        return e.values;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Gemini batch embedding failed: ${message}`);
    }
  }
}
