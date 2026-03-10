import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  UpsertUserByIdInput,
} from '../../domain/repositories/user.repository';
import type { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class EnsureDevUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(input: UpsertUserByIdInput): Promise<UserEntity> {
    return this.userRepository.upsertById(input);
  }
}
