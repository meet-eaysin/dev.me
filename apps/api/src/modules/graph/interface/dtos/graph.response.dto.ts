import { ApiProperty } from '@nestjs/swagger';
import { GraphNodeType, GraphRelationType } from '@repo/types';

export class GraphNodeViewDto {
  @ApiProperty({ example: 'node_1' })
  id!: string;

  @ApiProperty({ example: 'Introduction to AI' })
  label!: string;

  @ApiProperty({ enum: GraphNodeType, example: GraphNodeType.DOCUMENT })
  type!: GraphNodeType;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  documentId!: string;

  @ApiProperty({ example: { importance: 0.8 }, required: false })
  metadata?: Record<string, unknown>;
}

export class GraphEdgeViewDto {
  @ApiProperty({ example: 'edge_1' })
  id!: string;

  @ApiProperty({ example: 'node_1' })
  from!: string;

  @ApiProperty({ example: 'node_2' })
  to!: string;

  @ApiProperty({
    enum: GraphRelationType,
    example: GraphRelationType.SEMANTIC_SIMILARITY,
  })
  type!: GraphRelationType;

  @ApiProperty({ example: 0.95 })
  weight!: number;

  @ApiProperty({ example: { commonTags: ['AI'] }, required: false })
  metadata?: Record<string, unknown>;
}

export class FullGraphResponseDto {
  @ApiProperty({ type: [GraphNodeViewDto] })
  nodes!: GraphNodeViewDto[];

  @ApiProperty({ type: [GraphEdgeViewDto] })
  edges!: GraphEdgeViewDto[];

  @ApiProperty({ example: 'root_node_id' })
  rootNodeId!: string;
}
