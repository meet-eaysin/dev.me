import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, DocumentStatus } from '@repo/types';

export class ReviewItemDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  documentId!: string;

  @ApiProperty({ example: 'Advanced Quantum Mechanics' })
  title!: string;

  @ApiProperty({ enum: DocumentType, example: DocumentType.PDF })
  type!: DocumentType;

  @ApiProperty({ enum: DocumentStatus, example: DocumentStatus.COMPLETED })
  status!: DocumentStatus;

  @ApiProperty({ example: 'Due for spaced repetition review' })
  reason!: string;

  @ApiProperty({ example: 0.85 })
  priorityScore!: number;
}

export class ReviewRecommendationDto {
  @ApiProperty({ type: [ReviewItemDto] })
  ownedDocuments!: ReviewItemDto[];

  @ApiProperty({ type: [String], example: ['Physics', 'Quantum Computing'] })
  suggestedTopics!: string[];
}
