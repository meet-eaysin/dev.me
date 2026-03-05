export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}

export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<boolean>;
}

export type { PaginatedResponse } from './pagination';
