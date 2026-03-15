import type { ResolvedLLMConfig } from './provider.types';
import { getProviderAdapter } from './provider.adapters';

export class EmbeddingAdapter {
  async embedText(text: string, config: ResolvedLLMConfig): Promise<number[]> {
    const adapter = getProviderAdapter(config.embeddingAdapterKey);
    return adapter.embedText(text, config);
  }

  async embedBatch(
    texts: string[],
    config: ResolvedLLMConfig,
  ): Promise<number[][]> {
    const adapter = getProviderAdapter(config.embeddingAdapterKey);

    const batchSize = 25;
    const limit = pLimit(5);

    const batches: string[][] = [];
    for (let i = 0; i < texts.length; i += batchSize) {
      batches.push(texts.slice(i, i + batchSize));
    }

    const results = await Promise.all(
      batches.map((batch) => limit(() => adapter.embedBatch(batch, config))),
    );

    return results.flat();
  }
}
import pLimit from 'p-limit';
export const embeddingAdapter = new EmbeddingAdapter();
