import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthenticatedUser } from '@repo/types';
import type { Request } from 'express';
import { AuthCookieService } from '../cookies/auth-cookie.service';
import { TokenService } from '../../domain/services/token.service';
import { IRefreshSessionRepository } from '../../domain/repositories/refresh-session.repository';

@Injectable()
export class RequestAuthService {
  constructor(
    private readonly authCookieService: AuthCookieService,
    private readonly tokenService: TokenService,
    private readonly refreshSessionRepository: IRefreshSessionRepository,
  ) {}

  async authenticate(request: Request): Promise<AuthenticatedUser | null> {
    const bearerToken = this.getBearerToken(request);
    if (bearerToken) {
      const user = await this.tokenService.verifyAccessToken(bearerToken);
      return this.ensureActiveSession(user);
    }

    const cookieToken = this.authCookieService.getAccessToken(request);
    if (cookieToken) {
      const user = await this.tokenService.verifyAccessToken(cookieToken);
      return this.ensureActiveSession(user);
    }

    return null;
  }

  private getBearerToken(request: Request): string | null {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return null;
    }

    const token = header.slice('Bearer '.length).trim();
    return token.length > 0 ? token : null;
  }

  private async ensureActiveSession(
    user: AuthenticatedUser,
  ): Promise<AuthenticatedUser> {
    if (!user.sessionId) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.refreshSessionRepository.findActiveBySessionId(
      user.sessionId,
    );

    if (!session) {
      throw new UnauthorizedException('Session is no longer active');
    }

    return user;
  }
}
