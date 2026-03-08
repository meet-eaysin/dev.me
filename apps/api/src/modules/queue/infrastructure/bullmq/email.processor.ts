import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { EmailJobData, QUEUE_EMAILS } from '@repo/types';

@Processor(QUEUE_EMAILS)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    const { to, subject, body } = job.data;
    const jobId = job.id ?? 'unknown';
    this.logger.log(`Processing email job ${jobId} for recipient ${to}`);

    // Replace this with your real mail provider integration.
    this.logger.debug(`Email subject="${subject}" bodyLength=${body.length}`);
  }
}
