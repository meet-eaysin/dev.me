import type { EmailJobData } from '@repo/types';

export abstract class IEmailQueueDispatcher {
  abstract enqueue(data: EmailJobData): Promise<void>;
}
