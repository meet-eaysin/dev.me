import { BullModule } from '@nestjs/bullmq';
import { Module, Global } from '@nestjs/common';
import {
  DEFAULT_QUEUE_JOB_OPTIONS,
  QUEUE_EMAILS,
  QUEUE_INGESTION,
  QUEUE_SUMMARY,
  QUEUE_TRANSCRIPT,
  QUEUE_GRAPH,
  QUEUE_NOTION_SYNC,
} from '@repo/types';
import { EnqueueEmailUseCase } from './application/use-cases/enqueue-email.usecase';
import { IEmailQueueDispatcher } from './domain/repositories/email-queue-dispatcher.repository';
import { createBullQueueConfig } from './infrastructure/bullmq/bull-queue.config';
import { BullEmailQueueDispatcher } from './infrastructure/bullmq/bull-email-queue.dispatcher';
import { EmailProcessor } from './infrastructure/bullmq/email.processor';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      ...createBullQueueConfig(),
      prefix: 'mindstack',
      defaultJobOptions: DEFAULT_QUEUE_JOB_OPTIONS,
    }),
    BullModule.registerQueue(
      { name: QUEUE_EMAILS },
      { name: QUEUE_INGESTION },
      { name: QUEUE_SUMMARY },
      { name: QUEUE_TRANSCRIPT },
      { name: QUEUE_GRAPH },
      { name: QUEUE_NOTION_SYNC },
    ),
  ],
  providers: [
    EnqueueEmailUseCase,
    EmailProcessor,
    {
      provide: IEmailQueueDispatcher,
      useClass: BullEmailQueueDispatcher,
    },
  ],
  exports: [EnqueueEmailUseCase, IEmailQueueDispatcher, BullModule],
})
export class QueueModule {}
