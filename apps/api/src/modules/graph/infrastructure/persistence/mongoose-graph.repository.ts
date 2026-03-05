import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  GraphNodeModel,
  GraphEdgeModel,
  IGraphNodeDocument,
  IGraphEdgeDocument,
  GraphNodeType,
} from '@repo/db';
import {
  IGraphRepository,
  UpsertEdgeData,
} from '../../domain/repositories/graph.repository';
import { GraphNodeEntity } from '../../domain/entities/graph-node.entity';
import { GraphEdgeEntity } from '../../domain/entities/graph-edge.entity';

@Injectable()
export class MongooseGraphRepository extends IGraphRepository {
  private mapNode(doc: IGraphNodeDocument): GraphNodeEntity {
    return GraphNodeEntity.create({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      type: doc.type,
      documentId: doc.documentId?.toString(),
      label: doc.label,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      properties: doc.properties,
    });
  }

  private mapEdge(doc: IGraphEdgeDocument): GraphEdgeEntity {
    return GraphEdgeEntity.create({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      fromNodeId: doc.fromNodeId.toString(),
      toNodeId: doc.toNodeId.toString(),
      relationType: doc.relationType,
      weight: doc.weight,
      generationMethod: doc.generationMethod,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      properties: doc.properties,
    });
  }

  async findRootNode(userId: string): Promise<GraphNodeEntity | null> {
    const doc = await GraphNodeModel.findOne({
      userId: new Types.ObjectId(userId),
      type: GraphNodeType.ROOT,
    })
      .lean<IGraphNodeDocument>()
      .exec();

    return doc ? this.mapNode(doc) : null;
  }

  async createRootNode(
    userId: string,
    label: string,
  ): Promise<GraphNodeEntity> {
    const doc = await GraphNodeModel.create({
      userId: new Types.ObjectId(userId),
      type: GraphNodeType.ROOT,
      label,
      properties: {},
    });

    return this.mapNode(doc.toObject());
  }

  async upsertDocumentNode(
    userId: string,
    documentId: string,
    label: string,
  ): Promise<GraphNodeEntity> {
    const doc = await GraphNodeModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        documentId: new Types.ObjectId(documentId),
      },
      { label, type: GraphNodeType.DOCUMENT },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
      .lean<IGraphNodeDocument>()
      .exec();

    if (!doc) throw new Error('Failed to upsert document node');
    return this.mapNode(doc);
  }

  async findNodeByDocumentId(
    userId: string,
    documentId: string,
  ): Promise<GraphNodeEntity | null> {
    const doc = await GraphNodeModel.findOne({
      userId: new Types.ObjectId(userId),
      documentId: new Types.ObjectId(documentId),
    })
      .lean<IGraphNodeDocument>()
      .exec();

    return doc ? this.mapNode(doc) : null;
  }

  async upsertEdge(data: UpsertEdgeData): Promise<GraphEdgeEntity> {
    const doc = await GraphEdgeModel.findOneAndUpdate(
      {
        fromNodeId: new Types.ObjectId(data.fromNodeId),
        toNodeId: new Types.ObjectId(data.toNodeId),
        relationType: data.relationType,
      },
      {
        userId: new Types.ObjectId(data.userId),
        weight: data.weight,
        generationMethod: data.generationMethod,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
      .lean<IGraphEdgeDocument>()
      .exec();

    if (!doc) throw new Error('Failed to upsert edge');
    return this.mapEdge(doc);
  }

  async findAllNodes(userId: string): Promise<GraphNodeEntity[]> {
    const docs =
      (await GraphNodeModel.find({
        userId: new Types.ObjectId(userId),
      })
        .lean<IGraphNodeDocument[]>()
        .exec()) || [];

    return docs.map((doc) => this.mapNode(doc));
  }

  async findAllEdges(userId: string): Promise<GraphEdgeEntity[]> {
    const docs =
      (await GraphEdgeModel.find({
        userId: new Types.ObjectId(userId),
      })
        .lean<IGraphEdgeDocument[]>()
        .exec()) || [];

    return docs.map((doc) => this.mapEdge(doc));
  }

  async findDirectEdges(
    nodeId: string,
    userId: string,
  ): Promise<GraphEdgeEntity[]> {
    const docs =
      (await GraphEdgeModel.find({
        userId: new Types.ObjectId(userId),
        $or: [
          { fromNodeId: new Types.ObjectId(nodeId) },
          { toNodeId: new Types.ObjectId(nodeId) },
        ],
      })
        .lean<IGraphEdgeDocument[]>()
        .exec()) || [];

    return docs.map((doc) => this.mapEdge(doc));
  }

  async findNodesByIds(nodeIds: string[]): Promise<GraphNodeEntity[]> {
    if (nodeIds.length === 0) return [];

    const docs =
      (await GraphNodeModel.find({
        _id: { $in: nodeIds.map((id) => new Types.ObjectId(id)) },
      })
        .lean<IGraphNodeDocument[]>()
        .exec()) || [];

    return docs.map((doc) => this.mapNode(doc));
  }

  async deleteNodeForDocument(
    documentId: string,
    userId: string,
  ): Promise<void> {
    await GraphNodeModel.deleteOne({
      userId: new Types.ObjectId(userId),
      documentId: new Types.ObjectId(documentId),
    }).exec();
  }

  async deleteEdgesForDocument(
    documentId: string,
    userId: string,
  ): Promise<void> {
    const node = await GraphNodeModel.findOne({
      userId: new Types.ObjectId(userId),
      documentId: new Types.ObjectId(documentId),
    })
      .lean<IGraphNodeDocument>()
      .exec();

    if (node) {
      await GraphEdgeModel.deleteMany({
        userId: new Types.ObjectId(userId),
        $or: [{ fromNodeId: node._id }, { toNodeId: node._id }],
      }).exec();
    }
  }
}
