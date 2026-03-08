import type { EmailJobData } from '@repo/queue';

export abstract class IEmailQueueDispatcher {
  abstract enqueue(data: EmailJobData): Promise<void>;
}
