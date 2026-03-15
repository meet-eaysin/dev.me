import {
  DynamicModule,
  Global,
  Module,
  Provider,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueueService } from './queue.service';
import { IQueueProvider } from './interfaces/queue-provider.interface';
import {
  QStashQueueProvider,
  type QStashQueueProviderOptions,
} from './providers/qstash-queue.provider';
import {
  HttpQueueProvider,
  type HttpQueueProviderOptions,
} from './providers/http-queue.provider';

export interface QueueModuleOptions {
  provider: 'qstash' | 'http';
  qstash?: QStashQueueProviderOptions;
  http?: HttpQueueProviderOptions;
}

@Global()
@Module({})
export class QueueModule {
  static forRoot(options: QueueModuleOptions): DynamicModule {
    const providers: Provider[] = [QueueService];

    if (options.provider === 'qstash') {
      if (!options.qstash) {
        throw new InternalServerErrorException(
          'QStash configuration is required for QStash provider',
        );
      }
      providers.push({
        provide: IQueueProvider,
        useValue: new QStashQueueProvider(options.qstash),
      });
    } else if (options.provider === 'http') {
      if (!options.http) {
        throw new InternalServerErrorException(
          'HTTP configuration is required for HTTP provider',
        );
      }
      providers.push({
        provide: IQueueProvider,
        useValue: new HttpQueueProvider(options.http),
      });
    } else {
      throw new InternalServerErrorException(
        `Provider ${options.provider} not supported`,
      );
    }

    return {
      module: QueueModule,
      providers,
      exports: providers,
    };
  }
}
