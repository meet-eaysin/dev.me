import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import type { Request } from 'express';
import type { AuthenticatedUser, AuthTokenClaims } from '@repo/types';
import { env } from '../../../../shared/utils/env';
import { IRefreshSessionRepository } from '../../domain/repositories/refresh-session.repository';
import { ACCESS_COOKIE_NAME } from '../cookies/auth-cookie.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly refreshSessionRepository: IRefreshSessionRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request?.cookies?.[ACCESS_COOKIE_NAME];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
    });
  }

  async validate(payload: AuthTokenClaims): Promise<AuthenticatedUser> {
    if (payload.typ !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    if (!payload.sid) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.refreshSessionRepository.findActiveBySessionId(
      payload.sid,
    );

    if (!session) {
      throw new UnauthorizedException('Session is no longer active');
    }

    return {
      userId: payload.sub,
      sessionId: payload.sid,
      authId: payload.authId,
      email: payload.email,
      name: payload.name,
      avatarUrl: payload.avatarUrl,
      provider: payload.provider,
      role: payload.role,
    };
  }
}
