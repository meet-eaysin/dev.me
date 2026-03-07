import { AuthProvider } from './external-identity.entity';

export interface OAuthProfile {
  provider: AuthProvider;
  providerUserId: string;
  email?: string;
  emailVerified: boolean;
  name: string;
  avatarUrl?: string;
  profileSnapshot: Record<string, unknown>;
}
