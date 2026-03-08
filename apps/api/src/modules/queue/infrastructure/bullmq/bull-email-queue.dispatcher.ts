import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import type { EmailJobData } from '@repo/queue';
import { IEmailQueueDispatcher } from '../../domain/repositories/email-queue-dispatcher.repository';
import { EMAIL_JOB_NAME, EMAIL_QUEUE_NAME } from './email-queue.constants';

@Injectable()
export class BullEmailQueueDispatcher implements IEmailQueueDispatcher {
  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME)
    private readonly emailQueue: Queue<EmailJobData>,
  ) {}

  async enqueue(data: EmailJobData): Promise<void> {
    await this.emailQueue.add(EMAIL_JOB_NAME, data);
  }
}
