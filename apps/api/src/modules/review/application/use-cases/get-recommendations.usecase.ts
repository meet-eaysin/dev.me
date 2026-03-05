import { Injectable } from '@nestjs/common';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { RecommendationResult, DocumentStatus } from '@repo/types';
import { DocumentEntity } from '../../../documents/domain/entities/document.entity';

@Injectable()
export class GetRecommendationsUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(userId: string): Promise<RecommendationResult> {
    const { docs: allDocs } = await this.documentRepository.findAll(userId, {
      page: 1,
      limit: 1000,
    });

    // 1. Topic clusters from tags
    const tagFrequencies: Record<string, number> = {};
    allDocs.forEach((doc: DocumentEntity) => {
      doc.props.tags.forEach((tag: string) => {
        tagFrequencies[tag] = (tagFrequencies[tag] ?? 0) + 1;
      });
    });

    const topTags = Object.entries(tagFrequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topicKeywords = topTags.map(([name]) => name);

    // 2. Find top 3 topic clusters (for now just using top 3 tags)
    const top3Clusters = topicKeywords.slice(0, 3);

    // 3. Find docs in library in those clusters with low read count (or never opened)
    const suggestedDocs = allDocs
      .filter((doc: DocumentEntity) => {
        const isUnread =
          doc.props.status === DocumentStatus.TO_READ ||
          doc.props.status === DocumentStatus.TO_WATCH;
        const hasCommonTag = doc.props.tags.some((t: string) =>
          top3Clusters.includes(t),
        );
        return isUnread && hasCommonTag;
      })
      .slice(0, 5)
      .map((doc: DocumentEntity) => ({
        id: doc.id,
        title: doc.title,
        type: doc.props.type,
        tags: doc.props.tags,
      }));

    return {
      ownedDocuments: suggestedDocs,
      suggestedTopics: topicKeywords,
    };
  }
}
