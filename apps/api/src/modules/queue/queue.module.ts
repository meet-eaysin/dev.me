import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { DEFAULT_QUEUE_JOB_OPTIONS } from '@repo/queue';
import { EnqueueEmailUseCase } from './application/use-cases/enqueue-email.usecase';
import { IEmailQueueDispatcher } from './domain/repositories/email-queue-dispatcher.repository';
import { createBullQueueConfig } from './infrastructure/bullmq/bull-queue.config';
import { BullEmailQueueDispatcher } from './infrastructure/bullmq/bull-email-queue.dispatcher';
import { EmailProcessor } from './infrastructure/bullmq/email.processor';
import { EMAIL_QUEUE_NAME } from './infrastructure/bullmq/email-queue.constants';

@Module({
  imports: [
    BullModule.forRoot({
      ...createBullQueueConfig(),
      defaultJobOptions: DEFAULT_QUEUE_JOB_OPTIONS,
    }),
    BullModule.registerQueue({
      name: EMAIL_QUEUE_NAME,
    }),
  ],
  providers: [
    EnqueueEmailUseCase,
    EmailProcessor,
    {
      provide: IEmailQueueDispatcher,
      useClass: BullEmailQueueDispatcher,
    },
  ],
  exports: [EnqueueEmailUseCase, IEmailQueueDispatcher],
})
export class QueueModule {}
