import { Worker, Job } from 'bullmq';
import { Injectable , Logger } from '@nestjs/common';
import { GraphJobData, createRedisConnection } from '@repo/queue';
import { env } from '../../../../shared/utils/env';
import { GraphBuilderService } from '../../domain/services/graph-builder.service';

@Injectable()
export class GraphWorker {
  private readonly logger = new Logger(GraphWorker.name);

  private _worker: Worker<GraphJobData>;

  get worker(): Worker<GraphJobData> {
    return this._worker;
  }

  constructor(private readonly graphBuilder: GraphBuilderService) {
    const redis = createRedisConnection(env.REDIS_URL);

    this._worker = new Worker<GraphJobData>(
      'graph',
      async (job: Job<GraphJobData>) => {
        await this.processJob(job);
      },
      {
        connection: redis,
        concurrency: 1,
        prefix: 'mindstack',
      },
    );

    this.logger.log('[GraphWorker] Worker started and listening to queue');
  }

  private async processJob(job: Job<GraphJobData>): Promise<void> {
    this.logger.log(
      `[GraphWorker] Processing relationships for document: ${job.data.documentId}`,
    );

    await this.graphBuilder.buildRelationships(
      job.data.documentId,
      job.data.userId,
    );
  }

  async close() {
    await this._worker.close();
  }
}
