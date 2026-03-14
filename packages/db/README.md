# `@repo/db`

This package manages the MongoDB connections and schemas for Mind Stack.

## 🚀 Purpose

Centralizes the database layer:

- Connection setup via Mongoose.
- Definition of highly-typed schemas and models (e.g., Users, Documents, Jobs).
- Reusable repository patterns and database transactions.

## 📦 Usage

Ensure MongoDB is running (e.g., via `docker compose`). To use this package, add it to your app's dependencies:

```json
"@repo/db": "workspace:*"
```
