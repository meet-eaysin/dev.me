import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import type { EmailJobData } from '@repo/queue';
import { EMAIL_QUEUE_NAME } from './email-queue.constants';

@Processor(EMAIL_QUEUE_NAME)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>): Promise<void> {
    this.logger.log(
      `Processing email job ${job.id} for recipient ${job.data.to}`,
    );

    // Replace this with your real mail provider integration.
    this.logger.debug(
      `Email subject="${job.data.subject}" bodyLength=${job.data.body.length}`,
    );
  }
}
