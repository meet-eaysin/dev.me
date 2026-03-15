import { ServiceUnavailableException } from '@nestjs/common';
import type { IQueueProvider } from '../interfaces/queue-provider.interface';

export interface HttpQueueProviderOptions {
  baseUrl: string;
  devBypassHeader?: boolean;
}

export class HttpQueueProvider implements IQueueProvider {
  constructor(private readonly options: HttpQueueProviderOptions) {}

  async publishMessage<T>(queueName: string, payload: T): Promise<string> {
    const response = await fetch(
      `${this.options.baseUrl}/api/webhooks/${queueName}`,
      {
        method: 'POST',
        headers: this.options.devBypassHeader
          ? {
              'Content-Type': 'application/json',
              'x-dev-bypass': 'true',
            }
          : { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new ServiceUnavailableException(
        `Queue webhook failed with status ${response.status}`,
      );
    }

    return 'http-local-id';
  }
}
