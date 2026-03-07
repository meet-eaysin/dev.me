import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpsertUserFromIdentityUseCase } from '../../../users/application/use-cases/upsert-user-from-identity.usecase';
import { TokenService } from '../../domain/services/token.service';
import { DevLoginDto } from '../../interface/dtos/dev-login.dto';
import { RefreshSessionService } from '../../domain/services/refresh-session.service';

@Injectable()
export class DevLoginUseCase {
  constructor(
    private readonly upsertUserFromIdentityUseCase: UpsertUserFromIdentityUseCase,
    private readonly tokenService: TokenService,
    private readonly refreshSessionService: RefreshSessionService,
  ) {}

  async execute(
    input: DevLoginDto,
    metadata?: { userAgent?: string; ipAddress?: string },
  ) {
    const authId = input.authId ?? `dev:${randomUUID()}`;
    const normalizedEmail =
      input.email ??
      `${authId.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase()}@dev.local`;

    const user = await this.upsertUserFromIdentityUseCase.execute({
      authId,
      email: normalizedEmail,
      name: input.name ?? 'Development User',
      avatarUrl: input.avatarUrl,
    });

    const authenticatedUser = {
      userId: user.id,
      authId: user.authId,
      email: user.props.email,
      name: user.props.name,
      avatarUrl: user.props.avatarUrl,
      provider: 'dev',
    } as const;

    const tokens = await this.tokenService.issueSession({
      user: authenticatedUser,
    });

    await this.refreshSessionService.createSession({
      user: authenticatedUser,
      tokens,
      userAgent: metadata?.userAgent,
      ipAddress: metadata?.ipAddress,
    });

    return {
      user: authenticatedUser,
      tokens,
    };
  }
}
