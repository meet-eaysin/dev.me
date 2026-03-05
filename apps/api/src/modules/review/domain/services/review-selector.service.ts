import { Injectable } from '@nestjs/common';
import { DocumentEntity } from '../../../documents/domain/entities/document.entity';
import { GraphEdgeView } from '../../../graph/domain/entities/graph-edge.entity';
import { ReviewItem, DocumentStatus } from '@repo/types';

export interface ReviewSelectorParams {
  documents: DocumentEntity[];
  graphEdges: GraphEdgeView[];
  recentlyOpenedDocIds: string[];
  dismissedDocIds: string[];
  recentNoteDocIds: string[];
}

@Injectable()
export class ReviewSelectorService {
  selectDailyReview(params: ReviewSelectorParams): ReviewItem[] {
    const {
      documents,
      graphEdges,
      recentlyOpenedDocIds,
      dismissedDocIds,
      recentNoteDocIds,
    } = params;

    const items: ReviewItem[] = documents
      .filter((doc) => {
        const isDismissed = dismissedDocIds.includes(doc.id);
        const isCompleted = doc.props.status === DocumentStatus.COMPLETED;
        return !isDismissed && !isCompleted;
      })
      .map((doc) => {
        let score = 0;
        let reason = '';

        // 1. In progress or review
        if (
          doc.props.status === DocumentStatus.IN_PROCESS ||
          doc.props.status === DocumentStatus.REVIEW
        ) {
          score += 10;
          reason = 'In progress';
        }

        // 2. Never started
        if (
          (doc.props.status === DocumentStatus.TO_READ ||
            doc.props.status === DocumentStatus.TO_WATCH) &&
          !doc.props.lastOpenedAt
        ) {
          score += 8;
          reason = reason || 'Never started';
        }

        // 3. Due for review (central node)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const lastOpened = doc.props.lastOpenedAt || new Date(0);
        const edgeCount = graphEdges.filter(
          (e) => e.fromNodeId === doc.id || e.toNodeId === doc.id,
        ).length;

        if (lastOpened <= sevenDaysAgo && edgeCount >= 3) {
          score += 7;
          reason = reason || 'Due for review';
        }

        // 4. Related to recent reading
        const isNeighborOfRecent = graphEdges.some((e) => {
          const isFromDoc = e.fromNodeId === doc.id;
          const isToDoc = e.toNodeId === doc.id;
          if (isFromDoc) return recentlyOpenedDocIds.includes(e.toNodeId);
          if (isToDoc) return recentlyOpenedDocIds.includes(e.fromNodeId);
          return false;
        });

        if (isNeighborOfRecent) {
          score += 5;
          reason = reason || 'Related to recent reading';
        }

        // 5. Has notes
        if (recentNoteDocIds.includes(doc.id)) {
          score += 3;
          reason = reason || 'Has notes';
        }

        // 6. Upcoming
        if (doc.props.status === DocumentStatus.UPCOMING) {
          score += 2;
          reason = reason || 'Upcoming';
        }

        // 7. Needs completion
        if (doc.props.status === DocumentStatus.PENDING_COMPLETION) {
          score -= 5;
          reason = reason || 'Needs completion';
        }

        return {
          documentId: doc.id,
          title: doc.title,
          type: doc.props.type,
          status: doc.props.status,
          reason: reason || 'Suggested for you',
          priorityScore: score,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);

    const topItems = items.slice(0, 10);

    // Pad with random unread docs if < 3
    if (topItems.length < 3) {
      const remaining = items
        .slice(10)
        .filter(
          (item) =>
            item.status === DocumentStatus.TO_READ ||
            item.status === DocumentStatus.TO_WATCH,
        );

      while (topItems.length < 3 && remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length);
        const [randomDoc] = remaining.splice(randomIndex, 1);
        if (randomDoc) {
          topItems.push(randomDoc);
        }
      }
    }

    return topItems;
  }
}
