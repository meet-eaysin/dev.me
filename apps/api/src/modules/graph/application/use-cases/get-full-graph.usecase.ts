import { Injectable } from '@nestjs/common';
import { IGraphRepository } from '../../domain/repositories/graph.repository';
import { GraphNodeView } from '../../domain/entities/graph-node.entity';
import { GraphEdgeView } from '../../domain/entities/graph-edge.entity';

export interface FullGraphResponse {
  nodes: GraphNodeView[];
  edges: GraphEdgeView[];
  rootNodeId: string;
}

@Injectable()
export class GetFullGraphUseCase {
  constructor(private readonly graphRepository: IGraphRepository) {}

  async execute(userId: string): Promise<FullGraphResponse> {
    const nodes = await this.graphRepository.findAllNodes(userId);
    const edges = await this.graphRepository.findAllEdges(userId);
    const rootNode = await this.graphRepository.findRootNode(userId);

    return {
      nodes: nodes.map((n) => n.toView()),
      edges: edges.map((e) => e.toView()),
      rootNodeId: rootNode?.id || '',
    };
  }
}
