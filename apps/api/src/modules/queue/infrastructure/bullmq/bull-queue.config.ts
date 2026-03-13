import { env } from '../../../../shared/utils/env';
import type { QueueOptions } from 'bullmq';

export function createBullQueueConfig(): QueueOptions {
  return {
    connection: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
      family: 4,
      enableOfflineQueue: false,
      keepAlive: 10000,
    },
  };
}
