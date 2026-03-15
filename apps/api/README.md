# Mind Stack - Core API

This is the core backend application for Mind Stack, built with **NestJS 11**.

## 🚀 Tech Stack

- **Framework:** NestJS 11
- **Language:** TypeScript 5
- **Authentication:** Passport, JWT, OAuth (Google/GitHub)
- **API Docs:** Swagger (OpenAPI)

## 🛠 Setup & Development

Ensure you have run `yarn install` from the root of the monorepo.

To start the development server for this app specifically:

```bash
yarn workspace api dev
```

Or run the dev script from the root using Turbo:

```bash
yarn turbo run dev --filter api
```

## 🏗 Key Features

- **Robust Architecture:** Follows NestJS modular architecture and dependency injection.
- **Secure:** Integrated authentication strategies, OAuth Proxies, and helmet protection.
- **Shared Packages:** Leverages `@repo/db` for MongoDB connections, `@repo/cache` for Redis, and `@repo/queue` to dispatch background jobs to the worker.

## ⚙️ Environment Variables

Make sure to configure the `.env` file for the API. It requires connections to MongoDB, Redis, queue provider configuration, JWT secrets, and OAuth Client IDs/Secrets.
