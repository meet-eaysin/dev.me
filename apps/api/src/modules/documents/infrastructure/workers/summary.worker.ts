import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { summarizePipeline, ProviderFactory } from '@repo/ai';
import { SummaryJobData, QUEUE_SUMMARY, DocumentType } from '@repo/types';
import { IDocumentRepository } from '../../../documents/domain/repositories/document.repository';
import { DocumentChunkModel, DocumentTranscriptModel } from '@repo/db';

@Processor(QUEUE_SUMMARY)
@Injectable()
export class SummaryWorker extends WorkerHost {
  private readonly logger = new Logger(SummaryWorker.name);

  constructor(private readonly documentRepository: IDocumentRepository) {
    super();
  }

  async process(job: Job<SummaryJobData>): Promise<void> {
    await this.processJob(job);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<SummaryJobData> | undefined, err: Error) {
    const jobId = job?.id ?? 'unknown';
    this.logger.error(`[SummaryWorker] Job ${jobId} failed: ${err.message}`);
    if (job) {
      try {
        const { documentId, userId } = job.data;
        if (typeof documentId !== 'string' || typeof userId !== 'string') {
          throw new Error('Invalid job data: documentId or userId is missing');
        }
        await this.documentRepository.update(documentId, userId, {
          summary: `Error: ${err.message}`,
        });
      } catch (updateErr: unknown) {
        const errorMsg =
          updateErr instanceof Error ? updateErr.message : String(updateErr);
        this.logger.error(
          '[SummaryWorker] Could not update document error state:',
          errorMsg,
        );
      }
    }
  }

  private async processJob(job: Job<SummaryJobData>): Promise<void> {
    const { documentId, userId } = job.data;
    if (typeof documentId !== 'string' || typeof userId !== 'string') {
      throw new Error('Invalid job data: documentId or userId is missing');
    }

    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new Error('Document not found');

    let textForSummary = '';
    const type = doc.type;

    if (type === DocumentType.YOUTUBE) {
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
      if (!textForSummary && doc.content) {
        textForSummary = doc.content;
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
