# Auth and User Module Proposal

## Goal

Design a production-ready authentication and user-management approach for the backend while fitting the current DDD-style NestJS module structure and preserving a practical app-dev workflow.

This proposal does not implement code. It defines:

- architectural decisions
- package choices
- DDD module boundaries
- API endpoint contract
- provider login flow for Google and GitHub
- dev-mode behavior
- rollout sequence

## Current State

The backend already has:

- an `AuthModule` placeholder
- a `User` model in the database
- per-user business modules such as documents, knowledge, notion, analytics, search, and llm-config
- a temporary request identity flow based on a development header

The current state indicates that user-scoped business logic already exists, but authentication and internal user lifecycle are not yet formalized.

## Primary Recommendation

Use serverless-first, backend-owned OAuth authentication with backend-issued stateless access tokens and persisted refresh sessions.

That means:

1. Google and GitHub are only identity providers.
2. The API handles the OAuth redirect and callback flow.
3. The API provisions or links an internal user.
4. The API issues its own access and refresh tokens.
5. The API persists refresh-session records in the database.
6. Business modules remain provider-agnostic and depend only on internal application identity.

This is the best fit for this codebase because the backend is the actual application core and already owns all domain modules and user-scoped data.

## Serverless Constraint

This proposal assumes a serverless deployment model rather than a traditional long-running server with in-memory sessions.

The auth design should therefore avoid:

- in-memory session state
- sticky-session assumptions
- `express-session`
- Passport session serialization
- any flow that depends on one server instance remembering prior requests

Each request must be independently verifiable.

## Why This Approach

### Good fit for DDD

This keeps auth concerns separate from domain modules:

- `auth` handles identity proof and session issuance
- `users` handles internal user lifecycle and profile management
- business modules consume only application user identity

### Good fit for multi-provider login

Google and GitHub can both map into one internal user model without leaking provider-specific logic into business modules.

### Good fit for app-dev mode

You can add a development-only login path that issues the same internal app session shape as production auth, without forcing business modules to care whether the user came from OAuth or a dev shortcut.

## Explicit Non-Goals

This proposal does not recommend:

- making Google or GitHub the application user model
- pushing auth ownership into the frontend
- coupling domain modules to OAuth provider payloads
- using localStorage for long-lived session storage
- forcing all modules to change immediately during phase 1

## Recommended Packages

### Backend

Use these packages in the Nest API:

- `@nestjs/jwt`
- `openid-client`
- `jose`
- `cookie-parser`

Useful type packages:

- `@types/cookie-parser`

### Why these packages

For a serverless-first design, `openid-client` is the better fit for Google and GitHub OAuth than provider-specific Passport strategies.

Reasons:

- it aligns better with stateless OAuth/OIDC callback handling
- it avoids pressure toward session middleware
- it works well for authorization-code flow, PKCE, state, and nonce handling
- it keeps provider integration explicit instead of strategy-driven

`jose` is a strong fit for signing and verifying application tokens in a serverless environment.

`@nestjs/jwt` remains acceptable if the team prefers Nest's JWT wrapper for app-issued access tokens.

### Alternative considered

Passport-based provider login is still possible, but it is less attractive for a serverless-first application. If Passport is used at all, it should be used without server sessions. The preferred direction for this proposal is explicit OAuth handlers using `openid-client`.

## High-Level Architecture

### Bounded Contexts

Introduce two explicit modules:

- `auth`
- `users`

Optional future split if the auth surface grows:

- `auth`
- `identity`
- `users`

For now, `auth` plus `users` is enough.

### Module Responsibilities

#### `auth`

Owns:

- provider login initiation
- provider callback handling
- application token issuance
- refresh token rotation
- logout and logout-all
- session inspection
- auth guards and auth decorators
- state and PKCE verification for OAuth flows

Does not own:

- user profile editing
- long-term user preferences
- business authorization rules inside domain modules

#### `users`

Owns:

- internal user aggregate
- user provisioning and upsert from identity information
- `me` profile endpoints
- profile update behavior
- account status management later

Does not own:

- OAuth provider orchestration
- JWT verification
- refresh token/session issuance

## Domain Model Proposal

### User Aggregate

Recommended fields:

- `id`
- `email`
- `name`
- `avatarUrl`
- `status`
- `lastLoginAt`
- `createdAt`
- `updatedAt`

The current `User` model is close, but it should evolve beyond a single `authId` field if multiple providers are supported.

### ExternalIdentity Entity

Add a separate identity-linking model.

Recommended fields:

- `id`
- `userId`
- `provider` (`google` or `github`)
- `providerUserId`
- `email`
- `emailVerified`
- `profileSnapshot`
- `linkedAt`
- `lastLoginAt`

This avoids a structural problem where a single `authId` cannot model one user linked to multiple providers.

### RefreshSession Entity

Add a refresh-session model.

Recommended fields:

- `id`
- `userId`
- `tokenHash`
- `userAgent`
- `ipAddress`
- `expiresAt`
- `revokedAt`
- `createdAt`
- `updatedAt`

Store only a hash of the refresh token, not the raw token.

## Data Ownership Rules

The application should treat internal user identity as canonical.

Provider identity should be treated as external proof only.

That means:

- provider callback yields external identity
- auth resolves or creates internal user
- downstream modules receive internal `userId`

This lets business modules remain stable even if the auth providers change later.

## Session Strategy

Use short-lived stateless access tokens and long-lived persisted refresh sessions.

### Recommended behavior

- access token:
  - JWT
  - short TTL
  - carried in secure `HttpOnly` cookie
- refresh token:
  - opaque random token
  - long TTL
  - hashed in database
  - rotated on refresh
  - carried in secure `HttpOnly` cookie

### Why cookies

For a browser-based app, secure cookies are the better default than storing tokens in localStorage.

Benefits:

- safer against common token exfiltration mistakes
- easier browser session behavior
- cleaner frontend auth state
- less accidental leakage into client-side code

### Why this is serverless-safe

This model works in serverless because:

- access-token verification is stateless
- refresh validation uses database state, not process memory
- callback integrity is protected by signed state and PKCE
- no request depends on a previous in-memory server session

## OAuth Provider Proposal

### Google

Use Google login with authorization code flow.

Scopes:

- `openid`
- `email`
- `profile`

Google should be treated as an OIDC-compatible identity source.

### GitHub

Use GitHub OAuth login with authorization code flow.

Scopes:

- `read:user`
- `user:email`

GitHub may not always return the email in the base profile, so the callback flow should support resolving the verified primary email when needed.

## Account Linking Strategy

Support one internal user linked to multiple external identities.

On successful OAuth callback:

1. Validate callback `state` and PKCE verifier.
2. Resolve `(provider, providerUserId)`.
3. If found, load its internal `userId`.
4. If not found, try matching an existing user by verified email.
5. If a matching user exists, attach the new external identity to that user.
6. Otherwise create a new internal user and attach the identity.
7. Issue app session tokens.

This avoids duplicate internal users when the same person uses both Google and GitHub.

## DDD-Oriented Folder Proposal

### Auth module

Suggested structure:

```text
apps/api/src/modules/auth/
  auth.module.ts
  application/
    use-cases/
      start-google-login.usecase.ts
      start-github-login.usecase.ts
      handle-oauth-callback.usecase.ts
      get-session.usecase.ts
      refresh-session.usecase.ts
      logout.usecase.ts
      logout-all.usecase.ts
  domain/
    entities/
      refresh-session.entity.ts
      external-identity.entity.ts
    repositories/
      external-identity.repository.ts
      refresh-session.repository.ts
    services/
      token-issuer.service.ts
      token-verifier.service.ts
      oauth-profile-mapper.service.ts
      oauth-state.service.ts
  infrastructure/
    persistence/
      mongoose-external-identity.repository.ts
      mongoose-refresh-session.repository.ts
    oauth/
      google-oauth.client.ts
      github-oauth.client.ts
    guards/
      jwt-auth.guard.ts
    cookies/
      auth-cookie.service.ts
  interface/
    auth.controller.ts
    dtos/
      auth-session.response.dto.ts
```

### Users module

Suggested structure:

```text
apps/api/src/modules/users/
  users.module.ts
  application/
    use-cases/
      get-me.usecase.ts
      update-profile.usecase.ts
      upsert-user-from-identity.usecase.ts
  domain/
    entities/
      user.entity.ts
    repositories/
      user.repository.ts
  infrastructure/
    persistence/
      mongoose-user.repository.ts
  interface/
    users.controller.ts
    dtos/
      user.response.dto.ts
      update-profile.dto.ts
```

## Request User Contract

The authenticated request object should expose an application-oriented identity shape.

Recommended request user shape:

```ts
type RequestUser = {
  userId: string;
  sessionId: string;
  email?: string;
  provider?: 'google' | 'github' | 'dev';
};
```

Business modules should depend only on `userId` unless there is a clear reason to use more.

## Guard Strategy

Adopt a global auth guard pattern instead of attaching a development guard to each controller.

Recommended pieces:

- `JwtAuthGuard`
- `@Public()` decorator
- `@User()` decorator

Behavior:

- all routes are protected by default
- auth bootstrap and health endpoints can be marked public
- individual modules do not need to know about provider mechanics
- token verification remains stateless per request

## API Endpoint Proposal

### Auth endpoints

Public:

- `GET /api/v1/auth/google`
- `GET /api/v1/auth/google/callback`
- `GET /api/v1/auth/github`
- `GET /api/v1/auth/github/callback`
- `POST /api/v1/auth/refresh`

Protected:

- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `GET /api/v1/auth/session`

### Users endpoints

Protected:

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/me/sessions`
- `DELETE /api/v1/users/me/sessions/:sessionId`

## Endpoint Semantics

### `GET /api/v1/auth/google`

Starts Google OAuth flow.

Response:

- redirect to provider

Serverless note:

- generate signed `state`
- generate PKCE verifier/challenge where applicable
- do not rely on server session storage

### `GET /api/v1/auth/google/callback`

Handles Google callback.

Behavior:

- validate provider identity
- validate signed `state`
- validate PKCE verifier where applicable
- resolve or create internal user
- create refresh session
- set access and refresh cookies
- redirect back to frontend

### `GET /api/v1/auth/github`

Starts GitHub OAuth flow.

### `GET /api/v1/auth/github/callback`

Handles GitHub callback with the same internal behavior as Google.

### `POST /api/v1/auth/refresh`

Rotates refresh token and returns a fresh authenticated session.

Behavior:

- validate refresh cookie
- verify refresh session is active
- revoke old refresh session or rotate token
- set new cookies

### `POST /api/v1/auth/logout`

Revokes current refresh session and clears auth cookies.

### `POST /api/v1/auth/logout-all`

Revokes all refresh sessions for the current user.

### `GET /api/v1/auth/session`

Returns whether the current browser session is authenticated and the current user summary.

Suggested response shape:

```json
{
  "authenticated": true,
  "user": {
    "id": "65f1a2b3c4d5e6f7a8b9c0d1",
    "email": "user@example.com",
    "name": "User Name",
    "avatarUrl": "https://example.com/avatar.png",
    "providers": ["google", "github"]
  }
}
```

### `GET /api/v1/users/me`

Returns current internal user profile.

### `PATCH /api/v1/users/me`

Allows limited profile updates such as display name and avatar.

### `GET /api/v1/users/me/sessions`

Lists active refresh sessions for session management UI.

### `DELETE /api/v1/users/me/sessions/:sessionId`

Revokes one session.

## Development Mode Proposal

The app should support a dedicated dev login path instead of relying on request headers forever.

Recommended dev-only endpoint:

- `POST /api/v1/auth/dev/login`

Behavior:

- only available in non-production
- accepts a minimal identity payload or uses a fixed seed user
- provisions or resolves an internal user
- issues the same application cookies as production auth

This preserves app-dev speed while keeping the rest of the system aligned with the real auth architecture.

Recommended provider value for request user:

- `dev`

This is preferable to keeping fake identity logic spread across business controllers.

## Cookie Proposal

Recommended cookie names:

- `ms_access_token`
- `ms_refresh_token`

Recommended attributes:

- `HttpOnly: true`
- `Secure: true` in production
- `SameSite: Lax` for access token
- `SameSite: Lax` or `Strict` for refresh token depending on redirect needs
- path-scoped refresh cookie if desired

For serverless hosting, validate cookie settings against your actual frontend and API origins so callback redirects and cross-origin browser requests still work.

## Environment Variables

Add or refine these variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_CALLBACK_URL`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRES_IN`
- `WEB_APP_URL`
- `COOKIE_DOMAIN`
- `COOKIE_SECURE`
- `COOKIE_SAME_SITE`

If existing JWT-related variables already exist, they can be renamed or adapted for clarity, but the final naming should distinguish access and refresh concerns clearly.

## Database Proposal

### Keep

- `users`

### Add

- `external_identities`
- `refresh_sessions`

### Recommended indexes

For `external_identities`:

- unique index on `(provider, providerUserId)`
- index on `userId`
- optional index on normalized `email`

For `refresh_sessions`:

- index on `userId`
- index on `expiresAt`
- index on `revokedAt`
- optional unique index on `tokenHash`

## Relationship With Existing Modules

Business modules should not be redesigned around provider login.

Expected interaction:

- `documents`, `knowledge`, `search`, `analytics`, `graph`, `review`, `notion`, and `llm-config` continue receiving current application `userId`
- only controller-level request identity sourcing changes
- domain use cases remain auth-provider agnostic

This keeps auth implementation from contaminating the rest of the domain model.

## Migration Direction

The proposal intentionally avoids requiring immediate redesign of all business modules during phase 1.

Recommended rollout:

1. Introduce `users` module.
2. Introduce `auth` module with Google and GitHub login.
3. Add refresh session persistence.
4. Add signed OAuth `state` and PKCE handling.
5. Add JWT auth guard and `@Public()` decorator.
6. Add dev login endpoint for app-dev mode.
7. Move controllers from temporary development auth to real auth guard.
8. After auth is stable, normalize user identity handling across modules where needed.

This sequencing keeps auth deliverable without forcing a full backend-wide identity refactor first.

## Risks and Design Notes

### Risk: duplicate users

If provider identities are not linked through verified email and identity records, users will end up with one account per provider.

Mitigation:

- separate `external_identities`
- email-based linking on first login when safe

### Risk: provider-specific leakage

If provider payloads are used directly in business modules, auth changes later will be expensive.

Mitigation:

- keep provider mapping inside auth and users modules only

### Risk: dev-mode divergence

If dev mode continues to use a completely different authentication shape, production auth bugs will appear late.

Mitigation:

- dev login should mint the exact same app session shape as real OAuth login

### Risk: token theft or replay

Refresh tokens are long-lived and must be protected.

Mitigation:

- hash refresh tokens in persistence
- rotate on refresh
- allow session revocation

### Risk: callback tampering or CSRF during OAuth

OAuth callback flows are vulnerable if `state` and PKCE are not handled correctly.

Mitigation:

- signed and validated `state`
- PKCE where applicable
- strict callback URL validation
- short-lived login initiation artifacts

## Recommended Final Decision

Adopt:

- serverless-first backend-owned OAuth with Google and GitHub
- `openid-client` as the provider/OAuth client library
- `jose` for token signing and verification
- internal `users` module
- separate `external_identities` and `refresh_sessions`
- stateless JWT access token plus rotating refresh token
- secure `HttpOnly` cookies
- global auth guard with `@Public()`
- dedicated dev login path for app-dev mode

This gives the cleanest DDD alignment, the lowest provider leakage into business modules, and an auth/session model that is compatible with serverless deployment instead of traditional server-managed auth.

## References

- NestJS authentication docs: https://docs.nestjs.com/security/authentication
- Next.js authentication guidance: https://nextjs.org/docs/app/building-your-application/authentication
- Google OAuth web server flow: https://developers.google.com/identity/protocols/oauth2/web-server
- GitHub OAuth apps flow: https://docs.github.com/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
- `openid-client`: https://www.npmjs.com/package/openid-client
- `jose`: https://www.npmjs.com/package/jose
