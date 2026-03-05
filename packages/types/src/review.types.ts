import { DocumentType, DocumentStatus } from "./document.types";

export interface ReviewItem {
  documentId: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  reason: string;
  priorityScore: number;
}

export interface RecommendationResult {
  ownedDocuments: Array<{
    id: string;
    title: string;
    type: DocumentType;
    tags: string[];
  }>;
  suggestedTopics: string[];
}
