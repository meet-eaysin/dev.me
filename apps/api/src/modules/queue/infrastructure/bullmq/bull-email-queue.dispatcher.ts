import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { EmailJobData, QUEUE_EMAILS } from '@repo/types';
import { IEmailQueueDispatcher } from '../../domain/repositories/email-queue-dispatcher.repository';
const EMAIL_JOB_NAME = 'send-email'; // Keep it local or move to constants

@Injectable()
export class BullEmailQueueDispatcher implements IEmailQueueDispatcher {
  constructor(
    @InjectQueue(QUEUE_EMAILS)
    private readonly emailQueue: Queue<EmailJobData>,
  ) {}

  async enqueue(data: EmailJobData): Promise<void> {
    await this.emailQueue.add(EMAIL_JOB_NAME, data);
  }
}
