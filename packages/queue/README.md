# `@repo/queue`

This package handles background job dispatching and routing for Mind Stack.

## 🚀 Purpose

Integrates with Upstash QStash to:

- Enqueue asynchronous tasks (e.g., document summarization, embedding generation).
- Ensure reliable, serverless-friendly webhook deliveries to the `apps/worker` processor.

## 📦 Usage

To use this package, add it to your app's dependencies:

```json
"@repo/queue": "workspace:*"
```
