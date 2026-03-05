import { Injectable } from '@nestjs/common';
import { NormalSearchService } from '../../domain/services/normal-search.service';
import { SemanticSearchService } from '../../domain/services/semantic-search.service';
import { ProviderFactory } from '@repo/ai';
import {
  SearchQueryDto,
  SemanticSearchResultDto,
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
    items: (DocumentPublicView | SemanticSearchResultDto)[];
    total: number;
    page: number;
    limit: number;
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
        items: results,
        total: results.length,
        page: query.page ?? 1,
        limit: query.limit ?? 20,
        mode: 'ai',
      };
    }

    // Default to 'normal'
    const { docs, total } = await this.normalSearchService.search(
      userId,
      query,
    );
    return {
      items: docs,
      total,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      mode: 'normal',
    };
  }
}
