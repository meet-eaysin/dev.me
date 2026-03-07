export interface AuthTokenClaims {
  sub: string;
  sid: string;
  typ: 'access' | 'refresh';
  authId?: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  provider?: string;
}
