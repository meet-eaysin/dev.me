import { Injectable } from '@nestjs/common';
import { NormalSearchService } from '../../domain/services/normal-search.service';
import { SemanticSearchService } from '../../domain/services/semantic-search.service';
import { ProviderFactory } from '@repo/ai';
import {
  SearchQueryDto,
  SemanticSearchResult,
} from '../../interface/schemas/search.schema';
import { DocumentPublicView } from '../../../documents/domain/entities/document.entity';

@Injectable()
export class SearchUseCase {
  constructor(
    private readonly normalSearchService: NormalSearchService,
    private readonly semanticSearchService: SemanticSearchService,
  ) {}

  async execute(
    userId: string,
    query: SearchQueryDto,
  ): Promise<{
    documents?: DocumentPublicView[];
    results?: SemanticSearchResult[];
    total: number;
    mode: 'normal' | 'ai';
  }> {
    if (query.mode === 'ai') {
      const llmConfig = await ProviderFactory.getLLMConfig(userId);
      const results = await this.semanticSearchService.search(
        userId,
        query,
        llmConfig,
      );
      return {
        results,
        total: results.length,
        mode: 'ai',
      };
    }

    // Default to 'normal'
    const { docs, total } = await this.normalSearchService.search(
      userId,
      query,
    );
    return {
      documents: docs,
      total,
      mode: 'normal',
    };
  }
}
