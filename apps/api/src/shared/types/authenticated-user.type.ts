export interface AuthenticatedUser {
  userId: string;
  sessionId?: string;
  authId?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  provider?: 'google' | 'github' | 'dev' | string;
}
