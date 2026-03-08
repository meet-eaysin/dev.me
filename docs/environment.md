# Environment Setup

This project uses three env layers:

1. Root [`.env`](/home/eaysin/workspace/mind-stack/.env) for shared local development defaults across the monorepo.
2. API [`.env`](/home/eaysin/workspace/mind-stack/apps/api/.env) for the NestJS backend.
3. Web env file based on [`.env.example`](/home/eaysin/workspace/mind-stack/apps/web/.env.example) for the Next.js frontend.

For local setup:

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

## Variables

### Required for all environments

| Variable | Used by | Purpose |
| --- | --- | --- |
| `NODE_ENV` | API | Runtime mode. Use `production` in production. |
| `HOST` | API | API bind host. |
| `PORT` | API | API port. |
| `MONGODB_URI` | API | Main database connection string. |
| `REDIS_URL` | API workers | Queue and background jobs. |
| `QDRANT_URL` | API | Vector database endpoint. |
| `OLLAMA_URL` | API | AI provider default endpoint. |
| `OLLAMA_BASE_URL` | AI package | Default Ollama base URL fallback. |
| `JWT_SECRET` | API | Access token signing secret. |
| `JWT_EXPIRES_IN` | API | Access token TTL. |
| `REFRESH_TOKEN_SECRET` | API | Refresh token signing secret. |
| `REFRESH_TOKEN_EXPIRES_IN` | API | Refresh token TTL. |
| `ENCRYPTION_KEY` | API | 32-byte AES key for stored tokens and API keys. |
| `FILE_UPLOAD_DIR` | API | Local document storage path. |
| `MAX_FILE_SIZE_MB` | API | Upload limit. |
| `WEB_APP_URL` | API | Frontend redirect target after OAuth. |
| `CORS_ORIGIN` | API | Allowed frontend origin. |
| `NEXT_PUBLIC_API_BASE_URL` | Web | Browser-visible API base URL. |
| `NEXT_PUBLIC_DEV_USER_ID` | Web | Local development fallback user id header. |
| `NEXT_PUBLIC_WEBAPP_URL` | Web | Public frontend origin. |

### Optional

| Variable | Purpose |
| --- | --- |
| `QDRANT_API_KEY` | Required only when your Qdrant deployment is secured. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_CALLBACK_URL` | Required only if you enable Google OAuth login. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` / `GITHUB_CALLBACK_URL` | Required only if you enable GitHub OAuth login. |
| `NEXT_PUBLIC_CALCOM_VERSION` | Used for icon sprite versioning. |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | Used for cache-busting assets in deployments. |

## Production Credentials

### Generate yourself

These should come from your secret manager, not from source control:

- `JWT_SECRET`: generate a long random secret. Example: `openssl rand -base64 48`
- `REFRESH_TOKEN_SECRET`: generate another independent secret. Example: `openssl rand -base64 48`
- `ENCRYPTION_KEY`: must be exactly 32 bytes for AES-256-GCM. Example: `openssl rand -hex 16`
  Convert that to a 32-character ASCII value only if you want a plain string key; otherwise ensure the final stored value is exactly 32 bytes.

Safer plain-string example:

```bash
python - <<'PY'
import secrets, string
alphabet = string.ascii_letters + string.digits
print(''.join(secrets.choice(alphabet) for _ in range(32)))
PY
```

### Provision from providers

- `MONGODB_URI`: MongoDB Atlas, AWS DocumentDB, or your own MongoDB cluster.
- `REDIS_URL`: Redis Cloud, Upstash Redis, AWS ElastiCache, or self-hosted Redis.
- `QDRANT_URL` and `QDRANT_API_KEY`: Qdrant Cloud or self-hosted Qdrant.
- `OLLAMA_URL` and `OLLAMA_BASE_URL`: your own Ollama server reachable from the API hosts.

### OAuth credentials

- Google:
  Create an OAuth 2.0 Web Application in Google Cloud Console.
  Use your production callback URL for `GOOGLE_CALLBACK_URL`.
- GitHub:
  Create an OAuth App in GitHub Developer Settings.
  Use your production callback URL for `GITHUB_CALLBACK_URL`.

### Frontend/public values

These are not secrets, but they must match production URLs:

- `WEB_APP_URL`
- `CORS_ORIGIN`
- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_WEBAPP_URL`

## Recommended Production Storage

- Store secrets in your platform secret manager: Vercel, Railway, Render, Fly.io, AWS SSM, Doppler, 1Password Secrets Automation, or Vault.
- Do not commit production `.env` files.
- Keep API secrets only in backend runtime envs.
- Only expose `NEXT_PUBLIC_*` values to the frontend.
