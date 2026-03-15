export interface IQueueProvider {
  publishMessage<T>(queueName: string, payload: T): Promise<string>;
}

export const IQueueProvider = Symbol('IQueueProvider');
