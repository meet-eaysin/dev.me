import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserPublicView } from '../../domain/entities/user.entity';

@Injectable()
export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(userId: string): Promise<UserPublicView> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException('Authenticated user not found');
    }

    return user.toPublicView();
  }
}
