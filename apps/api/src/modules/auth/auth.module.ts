import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './interface/auth.controller';
import { GetSessionUseCase } from './application/use-cases/get-session.usecase';
import { DevLoginUseCase } from './application/use-cases/dev-login.usecase';
import { RefreshSessionUseCase } from './application/use-cases/refresh-session.usecase';
import { LogoutUseCase } from './application/use-cases/logout.usecase';
import { LogoutAllUseCase } from './application/use-cases/logout-all.usecase';
import { TokenService } from './domain/services/token.service';
import { RefreshSessionService } from './domain/services/refresh-session.service';
import { AuthCookieService } from './infrastructure/cookies/auth-cookie.service';
import { OAuthTransactionCookieService } from './infrastructure/cookies/oauth-transaction-cookie.service';
import { AppAuthGuard } from './infrastructure/guards/app-auth.guard';
import { RequestAuthService } from './infrastructure/guards/request-auth.service';
import { OAuthProviderService } from './infrastructure/oauth/oauth-provider.service';
import { InitiateOAuthLoginUseCase } from './application/use-cases/initiate-oauth-login.usecase';
import { HandleOAuthCallbackUseCase } from './application/use-cases/handle-oauth-callback.usecase';
import { IExternalIdentityRepository } from './domain/repositories/external-identity.repository';
import { IRefreshSessionRepository } from './domain/repositories/refresh-session.repository';
import { MongooseExternalIdentityRepository } from './infrastructure/persistence/mongoose-external-identity.repository';
import { MongooseRefreshSessionRepository } from './infrastructure/persistence/mongoose-refresh-session.repository';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [AuthController],
  providers: [
    GetSessionUseCase,
    DevLoginUseCase,
    InitiateOAuthLoginUseCase,
    HandleOAuthCallbackUseCase,
    RefreshSessionUseCase,
    LogoutUseCase,
    LogoutAllUseCase,
    TokenService,
    RefreshSessionService,
    AuthCookieService,
    OAuthTransactionCookieService,
    OAuthProviderService,
    AppAuthGuard,
    RequestAuthService,
    {
      provide: IExternalIdentityRepository,
      useClass: MongooseExternalIdentityRepository,
    },
    {
      provide: IRefreshSessionRepository,
      useClass: MongooseRefreshSessionRepository,
    },
  ],
  exports: [
    GetSessionUseCase,
    TokenService,
    RefreshSessionService,
    AuthCookieService,
    AppAuthGuard,
    RequestAuthService,
    IExternalIdentityRepository,
    IRefreshSessionRepository,
  ],
})
export class AuthModule {}
