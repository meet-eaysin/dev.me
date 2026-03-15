import { Injectable } from '@nestjs/common';
import { EmailJobData, QUEUE_EMAILS } from '@repo/types';
import { IEmailQueueDispatcher } from '../../domain/repositories/email-queue-dispatcher.repository';
import { QueueService } from '@repo/queue';

@Injectable()
export class QueueEmailQueueDispatcher implements IEmailQueueDispatcher {
  constructor(private readonly queueService: QueueService) {}

  async enqueue(data: EmailJobData): Promise<void> {
    await this.queueService.publishMessage(QUEUE_EMAILS, data);
  }
}
