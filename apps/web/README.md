# Recall - Web App

This is the frontend application for Recall, built with **Next.js 16 (App Router)**.

## 🚀 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript 5
- **Styling:** TailwindCSS v4
- **UI Components:** Shadcn UI, Radix UI
- **State Management:** React Query, React Hook Form
- **Animations:** Framer Motion

## 🛠 Setup & Development

Ensure you have run `yarn install` from the root of the monorepo.

To start the development server for this app specifically:

```bash
yarn workspace web dev
```

Or run the dev script from the root using Turbo:

```bash
yarn turbo run dev --filter web
```

## 🏗 Key Features

- **Modern Architecture:** Uses React 19 and Next.js 16 App Router for optimal performance and SEO.
- **Responsive UI:** Fully responsive design built with TailwindCSS.
- **Type-safe:** End-to-end type safety using shared interfaces from `@repo/types`.

## ⚙️ Environment Variables

Make sure to configure the `.env` file according to the properties required by this application (e.g., `WEB_APP_URL`, authentication callbacks, etc.). Review the root `turbo.globalEnv` list for required variables.
