import { Inject, Injectable } from '@nestjs/common';
import {
  IQueueProvider,
  type IQueueProvider as IQueueProviderType,
} from './interfaces/queue-provider.interface';

@Injectable()
export class QueueService {
  constructor(
    @Inject(IQueueProvider)
    private readonly provider: IQueueProviderType,
  ) {}

  publishMessage<T>(queueName: string, payload: T): Promise<string> {
    return this.provider.publishMessage(queueName, payload);
  }
}
