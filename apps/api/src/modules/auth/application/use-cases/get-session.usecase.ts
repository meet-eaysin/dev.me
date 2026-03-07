import { Injectable } from '@nestjs/common';
import { AuthenticatedUser } from '../../../../shared/types/authenticated-user.type';

export interface AuthSessionView {
  authenticated: true;
  user: {
    id: string;
    email: string | null;
    name: string | null;
    avatarUrl: string | null;
    provider: string | null;
  };
  session: {
    id: string | null;
  };
}

@Injectable()
export class GetSessionUseCase {
  execute(user: AuthenticatedUser): AuthSessionView {
    return {
      authenticated: true,
      user: {
        id: user.userId,
        email: user.email ?? null,
        name: user.name ?? null,
        avatarUrl: user.avatarUrl ?? null,
        provider: user.provider ?? null,
      },
      session: {
        id: user.sessionId ?? null,
      },
    };
  }
}
