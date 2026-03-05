import { Redis, RedisOptions } from "ioredis";

/**
 * Creates a shared Redis connection for BullMQ.
 * Set maxRetriesPerRequest to null as required by BullMQ.
 */
export function createRedisConnection(
  url: string,
  options: RedisOptions = {},
): Redis {
  return new Redis(url, {
    maxRetriesPerRequest: null,
    ...options,
  });
}
