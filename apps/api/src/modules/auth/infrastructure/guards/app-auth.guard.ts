import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedUser } from '@repo/types';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../../shared/decorators/public.decorator';
import { RequestAuthService } from './request-auth.service';

@Injectable()
export class AppAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly requestAuthService: RequestAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();

    let user: AuthenticatedUser | null = null;
    try {
      user = await this.requestAuthService.authenticate(request);
    } catch (error) {
      if (isPublic) return true;
      throw error;
    }
    if (user) {
      request.user = user;
      return true;
    }

    if (isPublic) return true;

    throw new UnauthorizedException('Authentication required');
  }

}
