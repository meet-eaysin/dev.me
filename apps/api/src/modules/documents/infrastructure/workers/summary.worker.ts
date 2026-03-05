import { Worker, Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { SummaryJobData, createRedisConnection } from '@repo/queue';
import { summarizePipeline, ProviderFactory } from '@repo/ai';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { env } from '../../../../shared/utils/env';
import { DocumentChunkModel, DocumentTranscriptModel } from '@repo/db';

@Injectable()
export class SummaryWorker {
  private readonly logger = new Logger(SummaryWorker.name);
  private _worker: Worker<SummaryJobData>;

  constructor(private readonly documentRepository: IDocumentRepository) {
    // ...
    const redis = createRedisConnection(env.REDIS_URL);

    this._worker = new Worker<SummaryJobData>(
      'summary',
      async (job: Job<SummaryJobData>) => {
        await this.processJob(job);
      },
      {
        connection: redis,
        concurrency: 3,
        prefix: 'mindstack',
        lockDuration: 300000,
        stalledInterval: 300000,
        maxStalledCount: 0,
      },
    );

    this._worker.on('failed', async (job, err) => {
      this.logger.error(
        `[SummaryWorker] Job ${job?.id} failed: ${err.message}`,
      );
      if (job) {
        try {
          await this.documentRepository.update(
            job.data.documentId,
            job.data.userId,
            { summary: `Error: ${err.message}` },
          );
        } catch (updateErr) {
          this.logger.error(
            '[SummaryWorker] Could not update document error state:',
            updateErr,
          );
        }
      }
    });

    this.logger.log('[SummaryWorker] Worker started and listening to queue');
  }

  private async processJob(job: Job<SummaryJobData>): Promise<void> {
    const { documentId, userId } = job.data;

    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new Error('Document not found');

    let textForSummary = '';
    const type = doc.props.type;

    if (type === 'youtube') {
      const transcript = await DocumentTranscriptModel.findOne()
        .where('documentId')
        .equals(documentId)
        .exec();

      if (transcript) {
        textForSummary = transcript.content;
      }
    } else {
      const chunks = await DocumentChunkModel.find({ documentId }).sort({
        chunkIndex: 1,
      });
      textForSummary = chunks.map((c) => c.content).join('\n\n');

      // Fallback for very short text documents that weren't chunked
      if (!textForSummary && doc.props.content) {
        textForSummary = doc.props.content;
      }
    }

    if (!textForSummary || textForSummary.trim().length === 0) {
      throw new Error('Document has no extractable text for summarization');
    }

    // Resolving LLM configuration from the Factory
    const llmConfig = await ProviderFactory.getLLMConfig(userId);

    const summary = await summarizePipeline.generateSummary(
      textForSummary,
      type,
      llmConfig,
    );

    await this.documentRepository.update(documentId, userId, {
      summary,
    });

    // We can cast error flags to null if successful, but doing it raw might violate types if not on IDocumentUpdate.
    // Usually handled securely in the persistence layer.

    this.logger.log(
      `Summary generated for document: ${documentId} by User: ${userId}`,
    );
  }
}
