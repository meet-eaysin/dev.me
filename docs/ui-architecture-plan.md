# Mind Stack — Complete UI Architecture & Design Plan

> Derived entirely from backend codebase analysis (12 NestJS modules, 48+ endpoints, 16 DB models) and the system design document (v1.0, March 2026).

---

## Step 1 — Backend Analysis Summary

### Monorepo Structure

| Layer | Path | Technology |
|-------|------|-----------|
| **API** | `apps/api/` | NestJS, Mongoose, BullMQ, Qdrant |
| **Web** | `apps/web/` | Next.js 14 (App Router) — scaffold only |
| **Packages** | `packages/` | `db`, `ai`, `queue`, `types`, `crypto`, `api`, `ui` |

### API Modules (12 total)

| Module | Controller | Endpoint Count | Key Operations |
|--------|-----------|---------------|----------------|
| **auth** | — (module only) | 7 | register, login, refresh, logout, me, update profile, change password |
| **documents** | `DocumentsController` | 12 | CRUD, upload, ingestion status, retry, summary, transcript |
| **knowledge** | `KnowledgeController` | 15 | folders CRUD + docs, tags CRUD + docs, notes CRUD |
| **graph** | `GraphController` | 3 | full graph, document subgraph, rebuild |
| **search** | `SearchController` | 2 | semantic search, AI RAG ask |
| **review** | `ReviewController` | 3 | daily review, dismiss, recommendations |
| **analytics** | `AnalyticsController` | 2 | heatmap, stats |
| **llm-config** | `LLMConfigController` | 4 | get, save, validate, delete |
| **notion** | `NotionController` | 6 | config, connect, databases, update, sync, disconnect |
| **ingestion** | — (internal) | 0 | background processing pipeline |
| **summary** | — (internal) | 0 | summary generation worker |
| **health** | `HealthController` | 1 | health check |

### Response Envelope

```typescript
{ success: boolean; data: T; error?: { code: string; message: string; details: unknown } }
```

### Pagination Contract

```typescript
{ items: T[]; total: number; page: number; limit: number }
```

### Key Enums from `@repo/types`

| Enum | Values |
|------|--------|
| `DocumentType` | `url`, `youtube`, `pdf`, `image`, `text` |
| `DocumentStatus` | `to_read`, `to_watch`, `in_process`, `review`, `upcoming`, `completed`, `pending_completion` |
| `IngestionStatus` | `pending`, `processing`, `completed`, `failed` |
| `GraphNodeType` | `root`, `document` |
| `GraphRelationType` | `semantic_similarity`, `topical`, `shared_tags`, `root_connection` |
| `NotionSyncDirection` | `to_notion`, `from_notion`, `both` |

---

## Step 2 — Complete Feature List

### Core Features

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 1 | **Document ingestion** (URL, YouTube, PDF, Image, Text) | `DocumentsController.createDocument`, `uploadDocument` | `POST /documents`, `POST /documents/upload` |
| 2 | **Document library** with filters & pagination | `DocumentsController.listDocuments` | `GET /documents` |
| 3 | **Document detail view** (type-specific rendering) | `DocumentsController.getDocument` | `GET /documents/:id` |
| 4 | **Document metadata editing** (title, status, folders, tags) | `DocumentsController.updateDocument` | `PATCH /documents/:id` |
| 5 | **Document deletion** | `DocumentsController.deleteDocument` | `DELETE /documents/:id` |
| 6 | **Ingestion status tracking** with polling | `DocumentsController.getIngestionStatus` | `GET /documents/:id/ingestion-status` |
| 7 | **Retry failed ingestion** | `DocumentsController.retryIngestion` | `POST /documents/:id/retry-ingestion` |
| 8 | **AI summary generation** (on-demand) | `DocumentsController.generateSummary` | `POST /documents/:id/summary` |
| 9 | **Summary deletion** | `DocumentsController.deleteSummary` | `DELETE /documents/:id/summary` |
| 10 | **YouTube transcript** (get + generate) | `DocumentsController.getTranscript`, `generateTranscript` | `GET/POST /documents/:id/transcript` |

### Knowledge Organization

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 11 | **Folder management** (CRUD) | `KnowledgeController` | `GET/POST/PATCH/DELETE /folders` |
| 12 | **Folder document listing** | `KnowledgeController.listFolderDocuments` | `GET /folders/:id/documents` |
| 13 | **Tag management** (CRUD, user + AI tags) | `KnowledgeController` | `GET/POST/PATCH/DELETE /tags` |
| 14 | **Tag document listing** | `KnowledgeController.listTagDocuments` | `GET /tags/:id/documents` |
| 15 | **Notes per document** (rich text, CRUD) | `KnowledgeController` | `GET/POST/PATCH/DELETE /notes` |

### AI & Search

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 16 | **Semantic search** (normal + AI mode) | `SearchController.search` | `GET /search` |
| 17 | **AI question answering** (RAG with source attribution) | `SearchController.ask` | `POST /search/ask` |

### Knowledge Graph

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 18 | **Interactive knowledge graph** visualization | `GraphController.getFullGraph` | `GET /graph` |
| 19 | **Document-focused subgraph** | `GraphController.getDocumentSubgraph` | `GET /graph/document/:docId` |
| 20 | **Manual graph rebuild** | `GraphController.rebuildDocumentGraph` | `POST /graph/rebuild/:docId` |

### Learning & Review

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 21 | **Daily review** (spaced repetition) | `ReviewController.getDailyReview` | `GET /review/daily` |
| 22 | **Dismiss from review** | `ReviewController.dismissReview` | `POST /review/dismiss/:docId` |
| 23 | **AI recommendations** | `ReviewController.getRecommendations` | `GET /review/recommendations` |

### Analytics

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 24 | **Activity heatmap** (365 days) | `AnalyticsController.getHeatmap` | `GET /analytics/heatmap` |
| 25 | **Engagement stats** (totals, streaks) | `AnalyticsController.getStats` | `GET /analytics/stats` |

### Settings & Integrations

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 26 | **LLM provider config** (Ollama, OpenAI, Anthropic) | `LLMConfigController` | `GET/PUT/POST/DELETE /llm-config` |
| 27 | **LLM config validation** | `LLMConfigController.validateConfig` | `POST /llm-config/validate` |
| 28 | **Notion integration** (connect, sync, disconnect) | `NotionController` | 6 endpoints under `/notion` |
| 29 | **User profile management** | Auth endpoints | `GET/PATCH /auth/me` |
| 30 | **Password change** | Auth endpoint | `PATCH /auth/me/password` |

### Authentication

| # | Feature | Backend Source | Endpoints |
|---|---------|---------------|-----------|
| 31 | **Registration** | Auth | `POST /auth/register` |
| 32 | **Login** | Auth | `POST /auth/login` |
| 33 | **Token refresh** | Auth | `POST /auth/refresh` |
| 34 | **Logout** | Auth | `POST /auth/logout` |

---

## Step 3 — User Roles

The backend enforces **single-role, per-user data isolation**. Every query filters by `userId`. There is no admin panel, no multi-tenant roles, no RBAC middleware.

| Role | Access | Evidence |
|------|--------|----------|
| **Authenticated User** | Full access to own documents, folders, tags, notes, graph, search, ask, review, analytics, settings | All controllers use `@User('userId')` decorator; `DevUserGuard` enforces auth |
| **Unauthenticated Visitor** | Login, Register only | Auth endpoints are the only unguarded routes |

> [!NOTE]
> There is no admin, manager, or system role in the current backend. The application is personal/single-user by design. The system design doc explicitly states: "Documents are private to each user" and "No collaboration" in Out of Scope.

---

## Step 4 — Frontend Tech Stack Recommendation

### Framework & Core

| Technology | Recommendation | Rationale |
|-----------|---------------|-----------|
| **Framework** | **Next.js 14** (App Router) | Already scaffolded in `apps/web/`, matches system design doc spec |
| **Language** | **TypeScript** (strict mode) | Existing monorepo is fully TypeScript; `@repo/types` provides shared contracts |
| **Server state** | **TanStack Query v5** | Already specified in system design; excellent for polling ingestion status, cache invalidation, optimistic updates |
| **Client state** | **Zustand** | Already specified in system design; lightweight, perfect for UI state (sidebar open, active filters, graph viewport) |

### UI Library

| Choice | **shadcn/ui** | Rationale |
|--------|--------------|-----------|
| Why | Component primitives built on **Radix UI** + **Tailwind CSS** | Already specified in system design doc; accessible by default, fully customizable, no runtime dependency — components are copied into the project |
| Alternatives considered | Mantine (heavier), Material UI (opinionated design system), Chakra UI (similar but less modern) | shadcn/ui is the best fit for a Notion/Linear-inspired aesthetic with full design control |

### Supporting Libraries

| Category | Library | Rationale |
|----------|---------|-----------|
| **Forms** | `react-hook-form` + `zod` | Matches backend validation strategy (zod schemas); system design doc specifies this |
| **Validation** | `zod` | Shared with `@repo/types`; can reuse schemas client-side |
| **API client** | Custom fetch wrapper + TanStack Query | Native `fetch` with typed response envelope; no need for Axios |
| **Tables / Data grids** | `@tanstack/react-table` | Headless, works with shadcn/ui tables; handles sorting, filtering, pagination |
| **Charts** | `recharts` | Lightweight, composable, React-native; perfect for heatmap + stats dashboards |
| **Graph visualization** | `@xyflow/react` (React Flow) | Explicitly specified in system design doc; free, feature-rich |
| **Rich text editor** | `@tiptap/react` | Specified in system design doc for personal notes |
| **PDF viewer** | `react-pdf` | Specified in system design doc |
| **Heatmap** | `react-calendar-heatmap` | Specified in system design doc |
| **Date utilities** | `date-fns` | Lightweight, tree-shakeable |
| **Auth** | `next-auth` (Auth.js v5) | Specified in system design doc |
| **CSS** | `tailwindcss` | Required by shadcn/ui |
| **Animations** | `framer-motion` | Subtle micro-interactions, page transitions |
| **Icons** | `lucide-react` | Default for shadcn/ui |

---

## Step 5 — Frontend Architecture

```
apps/web/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (no sidebar)
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx                # AuthLayout
│   ├── (dashboard)/                  # Dashboard route group (sidebar)
│   │   ├── layout.tsx                # DashboardLayout
│   │   ├── page.tsx                  # Dashboard overview
│   │   ├── documents/
│   │   │   ├── page.tsx              # Document library
│   │   │   └── [id]/page.tsx         # Document detail
│   │   ├── graph/page.tsx            # Knowledge graph
│   │   ├── search/page.tsx           # Search + Ask AI
│   │   ├── review/page.tsx           # Daily review
│   │   ├── analytics/page.tsx        # Activity & stats
│   │   └── settings/
│   │       ├── page.tsx              # Profile settings
│   │       ├── security/page.tsx     # Password change
│   │       ├── llm/page.tsx          # LLM provider config
│   │       └── notion/page.tsx       # Notion integration
│   ├── layout.tsx                    # Root layout
│   └── globals.css
├── components/
│   ├── ui/                           # shadcn/ui primitives (auto-generated)
│   ├── layout/
│   │   ├── sidebar.tsx
│   │   ├── topbar.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── command-palette.tsx
│   └── shared/
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       ├── error-boundary.tsx
│       └── confirm-dialog.tsx
├── features/
│   ├── auth/
│   │   ├── components/               # LoginForm, RegisterForm
│   │   ├── hooks/                    # useAuth, useSession
│   │   └── api/                      # auth mutations/queries
│   ├── documents/
│   │   ├── components/               # DocumentCard, DocumentTable, DocumentFilters
│   │   │   ├── viewers/              # UrlViewer, YouTubeViewer, PdfViewer, ImageViewer, TextViewer
│   │   │   ├── document-sidebar.tsx  # Notes + summary panel
│   │   │   └── ingestion-progress.tsx
│   │   ├── hooks/                    # useDocuments, useDocument, useIngestionStatus
│   │   └── api/                      # document queries/mutations
│   ├── knowledge/
│   │   ├── components/               # FolderList, TagCloud, NoteEditor
│   │   ├── hooks/
│   │   └── api/
│   ├── graph/
│   │   ├── components/               # GraphCanvas, GraphNode, GraphEdge, GraphControls
│   │   ├── hooks/                    # useGraph, useGraphFilters
│   │   └── api/
│   ├── search/
│   │   ├── components/               # SearchBar, SearchResults, AskAiPanel, SourceCard
│   │   ├── hooks/
│   │   └── api/
│   ├── review/
│   │   ├── components/               # ReviewCard, RecommendationCard
│   │   ├── hooks/
│   │   └── api/
│   ├── analytics/
│   │   ├── components/               # Heatmap, StatsCards, StreakBadge
│   │   ├── hooks/
│   │   └── api/
│   └── settings/
│       ├── components/               # ProfileForm, PasswordForm, LlmConfigForm, NotionSetup
│       ├── hooks/
│       └── api/
├── lib/
│   ├── api-client.ts                 # Typed fetch wrapper with envelope unwrapping
│   ├── query-client.ts               # TanStack Query provider config
│   ├── auth.ts                       # next-auth config
│   └── utils.ts                      # cn() and shared utilities
├── stores/
│   ├── ui.store.ts                   # Sidebar state, theme, command palette
│   └── graph.store.ts                # Graph viewport, selected node, edge filters
├── types/
│   └── index.ts                      # Re-export from @repo/types + frontend-only types
└── hooks/
    ├── use-debounce.ts
    ├── use-polling.ts
    └── use-breakpoint.ts
```

**Architecture principles:**
- **Feature-based** — each domain maps to a backend module
- **Co-location** — components, hooks, and API layer live together per feature
- **Shared UI** — shadcn/ui primitives in `components/ui/`, composed into feature components
- **Typed API layer** — `lib/api-client.ts` returns typed responses using `@repo/types`
- **State separation** — server state in TanStack Query, UI state in Zustand stores

---

## Step 6 — Complete Page List

### Authentication (unauthenticated)

| Page | Route | Backend Endpoints |
|------|-------|------------------|
| Login | `/login` | `POST /auth/login` |
| Register | `/register` | `POST /auth/register` |

### Dashboard (authenticated)

| Page | Route | Backend Endpoints |
|------|-------|------------------|
| Dashboard Overview | `/` | `GET /analytics/stats`, `GET /review/daily`, `GET /analytics/heatmap` |
| Document Library | `/documents` | `GET /documents`, `GET /folders`, `GET /tags` |
| Document Detail | `/documents/[id]` | `GET /documents/:id`, `GET /documents/:id/ingestion-status`, `GET /notes?documentId`, `GET/POST /documents/:id/transcript`, `POST/DELETE /documents/:id/summary` |
| Knowledge Graph | `/graph` | `GET /graph`, `GET /graph/document/:docId` |
| Search & Ask AI | `/search` | `GET /search`, `POST /search/ask` |
| Daily Review | `/review` | `GET /review/daily`, `POST /review/dismiss/:docId`, `GET /review/recommendations` |
| Analytics | `/analytics` | `GET /analytics/heatmap`, `GET /analytics/stats` |

### Settings (authenticated)

| Page | Route | Backend Endpoints |
|------|-------|------------------|
| Profile | `/settings` | `GET /auth/me`, `PATCH /auth/me` |
| Security | `/settings/security` | `PATCH /auth/me/password` |
| LLM Configuration | `/settings/llm` | `GET/PUT/POST/DELETE /llm-config` |
| Notion Integration | `/settings/notion` | `GET/POST/PATCH/DELETE /notion/*` |

**Total: 13 pages** covering all 48+ backend endpoints.

---

## Step 7 — Page Layouts

### Layout Types

#### 1. Auth Layout (`(auth)/layout.tsx`)

```
┌─────────────────────────────────────────────┐
│                                             │
│          ┌───────────────────┐              │
│          │                   │              │
│          │   Logo + Branding │              │
│          │                   │              │
│          │   ┌───────────┐   │              │
│          │   │   Form    │   │              │
│          │   │           │   │              │
│          │   └───────────┘   │              │
│          │                   │              │
│          └───────────────────┘              │
│                                             │
│          Centered card, no sidebar          │
└─────────────────────────────────────────────┘
```

- Centered vertically + horizontally
- Single card with logo, form, footer link
- Background: subtle gradient or pattern
- No sidebar or topbar

#### 2. Dashboard Layout (`(dashboard)/layout.tsx`)

```
┌──────┬──────────────────────────────────────┐
│      │  Topbar (Search | User | Settings)   │
│  S   ├──────────────────────────────────────┤
│  i   │  Breadcrumbs                         │
│  d   ├──────────────────────────────────────┤
│  e   │                                      │
│  b   │  Main Content Area                   │
│  a   │                                      │
│  r   │                                      │
│      │                                      │
│      │                                      │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

- **Sidebar** (collapsible, 240px): Navigation + quick actions
- **Topbar** (56px): Global search trigger, user avatar, notifications
- **Breadcrumbs**: Context-aware path navigation
- **Content area**: Scrollable, responsive max-width container

#### 3. Settings Layout (nested within Dashboard)

```
┌──────┬──────────────────────────────────────┐
│      │  Topbar                              │
│  S   ├──────────┬───────────────────────────┤
│  i   │Settings  │                           │
│  d   │Nav       │  Settings Content         │
│  e   │          │                           │
│  b   │ Profile  │  Form / Config area       │
│  a   │ Security │                           │
│  r   │ LLM      │                           │
│      │ Notion   │                           │
└──────┴──────────┴───────────────────────────┘
```

- Secondary vertical nav within content area
- Settings sections as tabs or vertical links

### Navigation Structure

#### Sidebar Navigation Items

| Icon | Label | Route | Badge |
|------|-------|-------|-------|
| 📊 | Dashboard | `/` | — |
| 📄 | Documents | `/documents` | Total count |
| 🧠 | Knowledge Graph | `/graph` | — |
| 🔍 | Search & Ask | `/search` | — |
| 📖 | Daily Review | `/review` | Review count |
| 📈 | Analytics | `/analytics` | Current streak |
| ⚙️ | Settings | `/settings` | — |

#### Topbar Elements

- **Command palette trigger** (`⌘K`) → global search / quick actions
- **User avatar + dropdown** → Profile, Settings, Logout
- **Quick add button** (`+`) → Add document modal

#### Breadcrumbs

| Page | Breadcrumb |
|------|-----------|
| Dashboard | `Home` |
| Documents | `Home / Documents` |
| Document Detail | `Home / Documents / {title}` |
| Settings > LLM | `Home / Settings / LLM Configuration` |

---

## Step 8 — Page Wireframes

### Dashboard Overview

```
┌──────┬──────────────────────────────────────────────────┐
│      │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────┐ │
│  S   │  │Total Docs│ │ Notes    │ │ Streak   │ │Type │ │
│  i   │  │   142    │ │   38     │ │  5 days  │ │Dist │ │
│  d   │  └──────────┘ └──────────┘ └──────────┘ └─────┘ │
│  e   ├──────────────────────────────────────────────────┤
│  b   │  Activity Heatmap (365 days)                     │
│  a   │  ░░▓▓░░▓▓▓░░░▓░▓▓░▓▓▓▓░░▓▓▓░░░░▓▓ ...          │
│  r   ├──────────────────────────────────────────────────┤
│      │  Daily Review (up to 10 items)                   │
│      │  ┌────────────────────────────────────────┐      │
│      │  │ 📄 Transformer Paper      [Review]     │      │
│      │  │ 🎥 LLM Explained          [Dismiss]    │      │
│      │  └────────────────────────────────────────┘      │
└──────┴──────────────────────────────────────────────────┘
```

### Document Library

```
┌──────┬──────────────────────────────────────────────────┐
│      │  Document Library             [+ Add Document]   │
│  S   ├──────────────────────────────────────────────────┤
│  i   │  Filters: [Status ▾] [Type ▾] [Folder ▾] [Tags] │
│  d   │  Search: [________________________] [🔍]        │
│  e   ├──────────────────────────────────────────────────┤
│  b   │  ┌──┬──────────┬──────┬────────┬──────┬───────┐ │
│  a   │  │ ░│ Title    │ Type │ Status │ Tags │ Date  │ │
│  r   │  ├──┼──────────┼──────┼────────┼──────┼───────┤ │
│      │  │ ░│ Annual   │ 📄   │ ●Read  │ AI   │ 2d ago│ │
│      │  │ ░│ LLM Vid  │ 🎥   │ ●Watch │ ML   │ 5d ago│ │
│      │  │ ░│ Notes.md │ 📝   │ ●Done  │ Dev  │ 1w ago│ │
│      │  └──┴──────────┴──────┴────────┴──────┴───────┘ │
│      │  Showing 1-20 of 142          [◀ 1 2 3 ... ▶]  │
└──────┴──────────────────────────────────────────────────┘
```

### Document Detail (PDF example)

```
┌──────┬──────────────────────────────┬───────────────────┐
│      │  ← Back to Documents                            │
│  S   │  Annual Report 2026                              │
│  i   │  📄 PDF · ●Completed · 42 pages                 │
│  d   │  Tags: [AI] [Research] Folders: [Papers]         │
│  e   ├──────────────────────────────┬───────────────────┤
│  b   │                              │ Notes             │
│  a   │   ┌────────────────────┐     │ ┌───────────────┐ │
│  r   │   │                    │     │ │ Rich text     │ │
│      │   │   PDF Viewer       │     │ │ editor area   │ │
│      │   │   (react-pdf)      │     │ │ (TipTap)      │ │
│      │   │                    │     │ └───────────────┘ │
│      │   │   Page 1 of 42     │     │                   │
│      │   └────────────────────┘     │ Summary           │
│      │   [◀] [▶] [Zoom] [Full]     │ [Generate Summary] │
└──────┴──────────────────────────────┴───────────────────┘
```

### Knowledge Graph

```
┌──────┬──────────────────────────────────────────────────┐
│      │  Knowledge Graph                    [Controls]   │
│  S   ├──────────────────────────────────────────────────┤
│  i   │  Edge Filters: [✓Semantic] [✓Topical] [✓Tags]  │
│  d   ├──────────────────────────────────────────────────┤
│  e   │                                                  │
│  b   │              [Doc A]──────[Doc B]                │
│  a   │               /    \        |                    │
│  r   │          [Doc C]  [Doc D] [Doc F]                │
│      │               \    /                             │
│      │            [🧠 User Brain]                       │
│      │               /       \                          │
│      │          [Doc E]    [Doc G]                       │
│      │                                                  │
│      │  React Flow canvas (pan, zoom, click-to-focus)   │
└──────┴──────────────────────────────────────────────────┘
```

### Search & Ask AI

```
┌──────┬──────────────────────────────────────────────────┐
│      │  Search & Ask AI                                 │
│  S   ├──────────────────────────────────────────────────┤
│  i   │  [🔍 Search your knowledge...        ] [Mode ▾] │
│  d   │  Mode: ○ Normal  ● Semantic                     │
│  e   ├──────────────────────────────────────────────────┤
│  b   │  Results (8 documents found)                     │
│  a   │  ┌──────────────────────────────────────────┐   │
│  r   │  │ 📄 Transformer Attention Explained       │   │
│      │  │ Relevance: 0.92 · Paper · 2 weeks ago    │   │
│      │  └──────────────────────────────────────────┘   │
│      ├──────────────────────────────────────────────────┤
│      │  Ask AI                                         │
│      │  [Ask a question about your documents...     ]  │
│      │  ┌──────────────────────────────────────────┐   │
│      │  │ Answer: Based on your documents...       │   │
│      │  │ Sources: [Doc A] [Doc C]                 │   │
│      │  └──────────────────────────────────────────┘   │
└──────┴──────────────────────────────────────────────────┘
```

### Daily Review

```
┌──────┬──────────────────────────────────────────────────┐
│      │  Daily Review                    3 items today   │
│  S   ├──────────────────────────────────────────────────┤
│  i   │  ┌──────────────────────────────────────────┐   │
│  d   │  │ 📄 Transformer Paper                     │   │
│  e   │  │ Reason: Not opened in 14 days, high      │   │
│  b   │  │ graph centrality (8 connections)          │   │
│  a   │  │                    [Open] [Dismiss]       │   │
│  r   │  └──────────────────────────────────────────┘   │
│      │  ┌──────────────────────────────────────────┐   │
│      │  │ 🎥 Neural Networks Explained              │   │
│      │  │ Reason: Status "in_process", active notes │   │
│      │  │                    [Open] [Dismiss]       │   │
│      │  └──────────────────────────────────────────┘   │
│      ├──────────────────────────────────────────────────┤
│      │  Recommendations                                │
│      │  Suggested topics: [RAG], [Vector Databases]    │
│      │  Related docs you own: [Doc X] [Doc Y]          │
└──────┴──────────────────────────────────────────────────┘
```

### Analytics

```
┌──────┬──────────────────────────────────────────────────┐
│      │  Analytics                                       │
│  S   ├──────────────────────────────────────────────────┤
│  i   │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  d   │  │Total Docs│ │Total     │ │Streaks           │ │
│  e   │  │   142    │ │Notes: 38 │ │Current: 5 days   │ │
│  b   │  │By type:  │ │          │ │Longest: 14 days  │ │
│  a   │  │URL:45    │ │          │ │Most active: 1/10 │ │
│  r   │  │PDF:30    │ │          │ │                  │ │
│      │  │YT:28     │ │          │ │                  │ │
│      │  └──────────┘ └──────────┘ └──────────────────┘ │
│      ├──────────────────────────────────────────────────┤
│      │  Activity Heatmap (365 days)                     │
│      │  ░░▓▓░░▓▓▓░░░▓░▓▓░▓▓▓▓░░▓▓▓░░░░▓▓░░▓░▓▓░▓▓▓   │
│      │  Jan   Feb   Mar   Apr   May   Jun ...           │
│      ├──────────────────────────────────────────────────┤
│      │  Breakdown by Type (Donut) │ By Status (Bar)    │
└──────┴──────────────────────────────────────────────────┘
```

### Settings — LLM Configuration

```
┌──────┬─────────┬────────────────────────────────────────┐
│      │         │  LLM Provider Configuration            │
│  S   │Settings │                                        │
│  i   │ Nav     │  Provider: [Ollama ▾]                  │
│  d   │         │  Chat Model: [llama3 ▾]                │
│  e   │●Profile │  Embedding Model: [nomic-embed ▾]      │
│  b   │ Security│  API Key: [•••••••••]  (encrypted)     │
│  a   │●LLM     │  Base URL: [http://localhost:11434]     │
│  r   │ Notion  │                                        │
│      │         │  Capabilities:                         │
│      │         │  ✅ Chat   ✅ Embeddings                │
│      │         │  Validated: 2 hours ago                 │
│      │         │                                        │
│      │         │  [Validate] [Save] [Reset to Default]  │
└──────┴─────────┴────────────────────────────────────────┘
```

---

## Step 9 — UX/UI Design Principles

### Design Philosophy

The UI should feel like a professional knowledge tool — similar to **Notion**, **Linear**, and **Stripe Dashboard**. Clean, professional, minimal, highly readable.

### Visual Guidelines

| Aspect | Guideline |
|--------|-----------|
| **Color palette** | Neutral dark mode default (zinc/slate base, `hsl(222, 47%, 11%)` background). Accent: subtle indigo/blue (`hsl(217, 91%, 60%)`). Status colors: semantic (green=completed, amber=in_process, blue=to_read) |
| **Typography** | `Inter` for body, `JetBrains Mono` for code. 14px base, 1.5 line-height. Tight hierarchy: 3-4 levels max |
| **Spacing** | 4px grid system. Generous whitespace. Content sections padded at 24-32px |
| **Borders** | 1px `border-border` (subtle), 8px border-radius for cards |
| **Shadows** | Minimal — elevation via subtle border + background shift, not drop shadows |
| **Icons** | Lucide React (16-20px, stroke-width 1.5) |

### Interaction Guidelines

| Aspect | Guideline |
|--------|-----------|
| **Transitions** | 150-200ms ease-out for hover states, 300ms for page transitions |
| **Micro-interactions** | Subtle scale on card hover (1.01), smooth skeleton loading, toast notifications |
| **Loading** | Skeleton screens for content, spinner only for actions (save, generate) |
| **Empty states** | Illustrated empty states with clear CTA ("Add your first document") |
| **Error handling** | Inline form errors (from backend `VALIDATION_ERROR` details), toast for server errors |
| **Optimistic updates** | For tag/folder assignment, status changes, dismiss review |
| **Keyboard shortcuts** | `⌘K` command palette, `⌘N` new document, `Esc` close modals |

### Avoid

- ❌ Excessive animations or flashy effects
- ❌ Gradients everywhere
- ❌ Rounded corners > 12px
- ❌ Auto-playing animations
- ❌ Per-page loading spinners (use skeletons)

---

## Step 10 — Component Inventory

### Primitives (from shadcn/ui)

| Component | Usage |
|-----------|-------|
| `Button` | Primary, secondary, outline, ghost, destructive variants |
| `Input` | Text inputs, search fields |
| `Textarea` | Notes, text document input |
| `Select` | Status/type/provider dropdowns |
| `Dialog` | Modals for create/edit operations |
| `Sheet` | Slide-out panels (mobile sidebar, document sidebar) |
| `Popover` | Dropdown menus, filter panels |
| `Tabs` | Settings navigation, search mode toggle |
| `Badge` | Status badges, type indicators, tag pills |
| `Card` | Stats cards, document cards, review items |
| `Table` | Document list, folder contents |
| `Tooltip` | Icon explanations, truncated text |
| `Skeleton` | Loading states for all content areas |
| `Toast` | Success/error notifications |
| `Command` | `⌘K` command palette |
| `DropdownMenu` | User menu, action menus |
| `AlertDialog` | Delete confirmations |
| `Separator` | Visual dividers |
| `ScrollArea` | Sidebar, notes panel |
| `Progress` | Ingestion progress bar |

### Composite Components (custom, built on primitives)

| Component | Props / Data | Backend Connection |
|-----------|-------------|-------------------|
| `DocumentCard` | `DocumentPublicViewDto` | `GET /documents` |
| `DocumentTable` | `PaginatedResponse<DocumentPublicViewDto>` | `GET /documents` |
| `DocumentFilters` | status, type, folder, tag filters | Filter params on `GET /documents` |
| `UrlViewer` | iframe with `src={originalSource}` | `document.source` |
| `YouTubeViewer` | YouTube embed + transcript panel | `GET/POST /documents/:id/transcript` |
| `PdfViewer` | `react-pdf` with navigation | `document.source` (file URL) |
| `ImageViewer` | `<img>` with zoom controls | `document.source` (file URL) |
| `TextViewer` | Rendered markdown | `document.content` |
| `IngestionProgress` | Stage indicators, polling | `GET /documents/:id/ingestion-status` |
| `NoteEditor` | TipTap rich text editor | `GET/POST/PATCH /notes` |
| `SummaryPanel` | Generate/show/regenerate | `POST/DELETE /documents/:id/summary` |
| `FolderList` | Expandable folder tree | `GET /folders` |
| `TagCloud` | Filterable tag pills | `GET /tags` |
| `GraphCanvas` | React Flow graph | `GET /graph` |
| `GraphNode` | Custom node with document info | Graph node data |
| `GraphEdgeFilters` | Toggle edge types | Client-side filter |
| `SearchBar` | Debounced input + mode toggle | `GET /search` |
| `SearchResults` | Ranked document list | Search response |
| `AskAiPanel` | Question input + answer + sources | `POST /search/ask` |
| `SourceCard` | Document reference from RAG | `ask.sources[]` |
| `ReviewCard` | Document + reason + actions | `GET /review/daily` |
| `RecommendationCard` | Topic + related docs | `GET /review/recommendations` |
| `ActivityHeatmap` | Calendar heatmap (365 days) | `GET /analytics/heatmap` |
| `StatsCards` | Grid of stat cards | `GET /analytics/stats` |
| `StreakBadge` | Current/longest streak display | Analytics stats |
| `LlmConfigForm` | Provider/model/key form | `GET/PUT/POST /llm-config` |
| `NotionSetup` | Connect/config/sync flow | `/notion/*` endpoints |
| `AddDocumentModal` | Type selector + source input | `POST /documents` |
| `UploadDocumentModal` | Drag-and-drop file upload | `POST /documents/upload` |
| `StatusBadge` | Color-coded document status | `DocumentStatus` enum |
| `TypeIcon` | Document type icon | `DocumentType` enum |
| `CommandPalette` | Global search + quick actions | Multiple endpoints |

---

## Step 11 — Data Fetching Strategy

### API Client Architecture

```typescript
// lib/api-client.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL + '/api/v1';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: { code: string; message: string; details: unknown };
}

async function apiClient<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: 'include',  // httpOnly JWT cookies
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.error.code, json.error.message, json.error.details);
  }

  return json.data;
}
```

### TanStack Query Patterns

| Pattern | Implementation |
|---------|---------------|
| **Query keys** | Feature-based: `['documents', filters]`, `['document', id]`, `['graph']`, `['analytics', 'heatmap', days]` |
| **Stale time** | 30s for lists, 60s for detail views, 5min for analytics |
| **Polling** | `refetchInterval: 3000` for ingestion status while `status !== 'completed' && status !== 'failed'` |
| **Pagination** | `keepPreviousData: true` for smooth page transitions |
| **Mutations** | Optimistic updates for: status change, tag assign, dismiss review. Invalidation for: create, delete, summary generation |
| **Prefetching** | Prefetch document detail on hover over document row |
| **Error handling** | Global `onError` handler shows toast; per-query `retry: 2` with exponential backoff |
| **Cache invalidation** | `queryClient.invalidateQueries(['documents'])` after create/delete; targeted invalidation for updates |

### Query Examples

```typescript
// features/documents/api/queries.ts
export function useDocuments(filters: ListDocumentsDto) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => apiClient<PaginatedResponse<DocumentPublicViewDto>>(
      `/documents?${new URLSearchParams(filters)}`
    ),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

// Polling for ingestion status
export function useIngestionStatus(docId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['document', docId, 'ingestion-status'],
    queryFn: () => apiClient<IngestionStatusView>(`/documents/${docId}/ingestion-status`),
    refetchInterval: (query) => {
      const status = query.state.data?.ingestionStatus;
      return status === 'completed' || status === 'failed' ? false : 3000;
    },
    enabled,
  });
}
```

### Error Handling Strategy

| Error Code | UI Behavior |
|-----------|-------------|
| `VALIDATION_ERROR` (400) | Inline field errors from `details[].field` + `details[].messages` |
| `UNAUTHORIZED` (401) | Redirect to `/login`, clear session |
| `FORBIDDEN` (403) | Toast: "Access denied" |
| `DOCUMENT_NOT_FOUND` (404) | Redirect to `/documents` with toast |
| `DUPLICATE_SOURCE` (409) | Toast with link to existing document |
| `FILE_TOO_LARGE` (413) | Inline error on upload form |
| `LLM_UNAVAILABLE` (503) | Toast: "AI service unavailable, check LLM settings" |
| `RATE_LIMITED` (429) | Toast: "Too many requests, please wait" |

---

## Step 12 — Final Summary

### Deliverables Checklist

| Deliverable | Status |
|-------------|--------|
| Full feature list (34 features) | ✅ |
| User roles (2: authenticated, unauthenticated) | ✅ |
| Frontend tech stack | ✅ Next.js 14 + TanStack Query + Zustand + shadcn/ui |
| UI library recommendation | ✅ shadcn/ui (Radix + Tailwind) |
| Frontend architecture | ✅ Feature-based, co-located, typed |
| Complete page list (13 pages) | ✅ |
| Page wireframes (8 key pages) | ✅ |
| Layout definitions (3 layouts) | ✅ |
| Navigation structure (sidebar + topbar + breadcrumbs) | ✅ |
| Reusable component system (50+ components) | ✅ |
| Data fetching strategy (TanStack Query + typed API client) | ✅ |
| Design principles (Notion/Linear-inspired) | ✅ |

### Key Design Decisions

1. **shadcn/ui** over Mantine/MUI — matches the system design doc, gives full design control for a Notion/Linear aesthetic
2. **Feature-based folder structure** — mirrors backend domain modules for easy mental mapping
3. **Polling over WebSockets** — system design explicitly excludes real-time sync; polling at 3s intervals for ingestion status is sufficient
4. **No admin panel** — backend has no admin roles; single-user, privacy-first design
5. **Dark mode first** — aligns with developer-focused product vision; light mode as secondary option
6. **Command palette** — `⌘K` for power users, consistent with Linear/Notion UX patterns
