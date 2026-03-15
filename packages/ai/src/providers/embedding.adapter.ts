import type { ResolvedLLMConfig } from './provider.types';
import { getProviderAdapter } from './provider.adapters';

export class EmbeddingAdapter {
  async embedText(text: string, config: ResolvedLLMConfig): Promise<number[]> {
    const adapter = getProviderAdapter(config.adapterKey);
    return adapter.embedText(text, config);
  }

  async embedBatch(
    texts: string[],
    config: ResolvedLLMConfig,
  ): Promise<number[][]> {
    const adapter = getProviderAdapter(config.adapterKey);
    return adapter.embedBatch(texts, config);
  }
}
export const embeddingAdapter = new EmbeddingAdapter();
