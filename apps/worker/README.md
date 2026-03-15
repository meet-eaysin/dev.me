# Mind Stack - Worker

This is the background processing service for Mind Stack, built as a standalone **NestJS 11** application.

## 🚀 Purpose

The worker is responsible for handling heavy, asynchronous tasks decoupled from the main API. It processes jobs dispatched via the queue provider. Common tasks include:

- Document parsing, text extraction, and chunking.
- Generating vector embeddings using `@repo/ai` and storing them in Qdrant.
- Interacting with local LLMs (Ollama) for summarization and knowledge extraction.

## 🛠 Setup & Development

Ensure you have run `yarn install` from the root of the monorepo.

To start the development server for this app specifically:

```bash
yarn workspace worker dev
```

Or run the dev script from the root using Turbo:

```bash
yarn turbo run dev --filter worker
```

## 🏗 Key Packages Used

- `@repo/queue`: Receives jobs.
- `@repo/ai`: Interfaces with Ollama and Qdrant.
- `@repo/db`: Updates document processing statuses in MongoDB.

## ⚙️ Environment Variables

Make sure to configure the `.env` file for the worker, particularly the endpoints for Qdrant, Ollama, MongoDB, and queue provider credentials.
