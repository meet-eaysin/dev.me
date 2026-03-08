import type { JobsOptions } from 'bullmq';

export interface EmailJobData {
  to: string;
  subject: string;
  body: string;
}

export const DEFAULT_QUEUE_JOB_OPTIONS: JobsOptions = {
  removeOnComplete: true,
  removeOnFail: 1000,
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
};
