import { Injectable } from '@nestjs/common';
import { EmailJobData } from '@repo/types';
import { IEmailQueueDispatcher } from '../../domain/repositories/email-queue-dispatcher.repository';

@Injectable()
export class EnqueueEmailUseCase {
  constructor(private readonly emailQueueDispatcher: IEmailQueueDispatcher) {}

  async execute(data: EmailJobData): Promise<void> {
    await this.emailQueueDispatcher.enqueue(data);
  }
}
