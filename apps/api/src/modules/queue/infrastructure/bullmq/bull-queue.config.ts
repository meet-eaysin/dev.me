import { env } from '../../../../shared/utils/env';
import Redis from 'ioredis';

// Reuse the same connect instance for all BullMQ default requests
let sharedRedisConnection: Redis | null = null;

export function createBullQueueConfig() {
  if (!sharedRedisConnection) {
    sharedRedisConnection = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      ...(env.REDIS_PASSWORD ? { password: env.REDIS_PASSWORD } : {}),
      family: 4,
      enableOfflineQueue: false,
      keepAlive: 10000,
      maxRetriesPerRequest: null,
    });
  }

  return {
    connection: sharedRedisConnection,
  };
}
