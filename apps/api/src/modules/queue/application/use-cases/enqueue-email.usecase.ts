import { Injectable } from '@nestjs/common';
import type { EmailJobData } from '@repo/queue';
import { IEmailQueueDispatcher } from '../../domain/repositories/email-queue-dispatcher.repository';

@Injectable()
export class EnqueueEmailUseCase {
  constructor(
    private readonly emailQueueDispatcher: IEmailQueueDispatcher,
  ) {}

  async execute(data: EmailJobData): Promise<void> {
    await this.emailQueueDispatcher.enqueue(data);
  }
}
