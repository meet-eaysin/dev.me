import { Injectable } from '@nestjs/common';
import {
  IUserRepository,
  UpsertIdentityUserInput,
} from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UpsertUserFromIdentityUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  execute(input: UpsertIdentityUserInput): Promise<UserEntity> {
    return this.userRepository.upsertFromIdentity(input);
  }
}
