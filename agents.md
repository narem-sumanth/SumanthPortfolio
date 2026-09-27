# Agent Guidelines for Sumanth AI Portfolio

This file provides mandatory instructions for any AI agent working on this codebase. Follow these rules strictly to avoid mismanipulation.

## Core Principles

1. **Read before write** — Always read relevant files before making changes. Use `grep`/`glob` to understand existing patterns.
2. **Follow existing conventions** — Mimic code style, naming, imports, and patterns already in the codebase.
3. **Minimal changes** — Make the smallest change necessary. Don't refactor unrelated code.
4. **Verify after changes** — Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` after modifications.
5. **Never read `.env` files** — Agents are blocked from reading environment files. Use `.env.example` as reference only. All env vars validated at boot via Zod (`apps/api/src/config/env.ts`).

## Design Principles

- **Separation of Concerns** — Layered architecture: controllers → services → repositories
- **Type Safety First** — Shared types in `packages/types` as single source of truth
- **Content-Driven** — All user-facing content in `data/` (JSON + markdown), never hardcoded
- **Server-First Rendering** — Prefer React Server Components; minimize client components
- **Streaming-First Chat** — SSE for real-time chat, handled by `packages/api-client`
- **Provider Pattern** — LLM providers implement `LLMProvider` interface with MockProvider fallback
- **Validation at Boundaries** — Zod schemas at controllers, repositories, and providers
- **Security by Default** — CORS allowlist, rate limiting, SSRF protection, honeypot fields

## Complete Repository Structure

```
SumanthPortfolio/
├── apps/
│   ├── api/                      # Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── app.ts            # Express app setup, middleware, routes
│   │   │   ├── index.ts          # Entry point, server bootstrap
│   │   │   ├── config/
│   │   │   │   └── env.ts        # Zod-validated environment config
│   │   │   ├── controllers/      # Thin HTTP handlers only
│   │   │   │   ├── chat.controller.ts
│   │   │   │   ├── contact.controller.ts
│   │   │   │   ├── health.controller.ts
│   │   │   │   ├── profile.controller.ts
│   │   │   │   └── projects.controller.ts
│   │   │   ├── middlewares/      # Express middlewares
│   │   │   │   ├── cors.middleware.ts
│   │   │   │   ├── error-handler.middleware.ts
│   │   │   │   ├── rate-limit.middleware.ts
│   │   │   │   └── request-context.middleware.ts
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   └── portfolio.repository.ts
│   │   │   ├── routes/           # Route registration
│   │   │   │   ├── index.ts
│   │   │   │   ├── chat.routes.ts
│   │   │   │   ├── contact.routes.ts
│   │   │   │   ├── health.routes.ts
│   │   │   │   ├── profile.routes.ts
│   │   │   │   └── projects.routes.ts
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── chat/
│   │   │   │   │   ├── chat-pipeline.service.ts
│   │   │   │   │   ├── chat-tools.service.ts
│   │   │   │   │   ├── system-prompt.ts
│   │   │   │   │   └── providers/     # LLM Provider implementations
│   │   │   │   │       ├── llm-provider.ts       # Interface
│   │   │   │   │       ├── fallback.provider.ts  # Fallback chain
│   │   │   │   │       ├── mock.provider.ts      # No API key required
│   │   │   │   │       └── nvidia.provider.ts    # NVIDIA Nemotron
│   │   │   │   ├── contact/
│   │   │   │   │   ├── contact.service.ts
│   │   │   │   │   ├── contact.validation.ts
│   │   │   │   │   └── contact.webhook.ts
│   │   │   │   └── retrieval/
│   │   │   │       ├── github.source.ts
│   │   │   │       ├── google-search.source.ts
│   │   │   │       ├── local-file.source.ts
│   │   │   │       ├── search.provider.ts
│   │   │   │       ├── types.ts
│   │   │   │       └── web.source.ts
│   │   │   └── utils/
│   │   │       └── logger.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                       # Next.js 14 (App Router) Frontend
│       ├── src/
│       │   ├── app/              # App Router pages
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx          # Chat UI (home)
│       │   │   ├── portfolio/page.tsx
│       │   │   ├── robots.ts
│       │   │   └── sitemap.ts
│       │   ├── components/       # Shared UI components
│       │   │   ├── app-chrome.tsx
│       │   │   ├── command-palette-provider.tsx
│       │   │   ├── mode-switcher.tsx
│       │   │   ├── theme-provider.tsx
│       │   │   └── theme-toggle.tsx
│       │   ├── features/         # Feature-based components
│       │   │   └── chat/
│       │   │       ├── chat-input.tsx
│       │   │       ├── chat-message-list.tsx
│       │   │       ├── chat-view.tsx
│       │   │       ├── contact-flow.tsx
│       │   │       ├── live-step-ticker.tsx
│       │   │       ├── source-picker.tsx
│       │   │       ├── steps-disclosure.tsx
│       │   │       ├── suggested-questions.tsx
│       │   │       └── use-chat.ts
│       │   └── lib/              # Client-side utilities
│       │       ├── analytics.ts
│       │       ├── apiClient.ts        # Typed API client (packages/api-client)
│       │       ├── chatStorage.ts
│       │       └── serverApi.ts
│       ├── tests/                # Vitest + React Testing Library
│       │   ├── setup.ts
│       │   ├── chat-input.test.tsx
│       │   └── suggested-questions.test.tsx
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.js
│
├── packages/
│   ├── types/                   # Shared domain types (SOURCE OF TRUTH)
│   │   ├── src/
│   │   │   ├── api.ts           # API request/response types
│   │   │   ├── domain.ts        # Domain entities (Project, Skill, etc.)
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── design-system/           # CSS tokens + Tailwind preset
│   │   ├── src/
│   │   │   └── tokens.ts        # Design tokens (colors, spacing, etc.)
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                      # shadcn-based component primitives
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── activity-indicator.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── command-palette.tsx
│   │   │   │   ├── contact-card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── message-bubble.tsx
│   │   │   │   ├── navigation-rail.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── project-card.tsx
│   │   │   │   ├── source-chip.tsx
│   │   │   │   └── tooltip.tsx
│   │   │   ├── lib/
│   │   │   │   └── cn.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/              # Typed fetch/SSE client for API
│   │   ├── src/
│   │   │   ├── client.ts        # SSE + REST client implementation
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── config/                  # Shared TypeScript configs
│   │   ├── tsconfig.base.json
│   │   ├── tsconfig.nextjs.json
│   │   ├── tsconfig.node.json
│   │   └── package.json
│   │
│   └── eslint-config/           # Flat ESLint config
│       ├── package.json
│       └── eslint.config.js
│
├── data/                        # Portfolio content (EDIT THESE FOR CONTENT)
│   ├── profile/
│   │   ├── profile.json
│   │   └── bio.md
│   ├── experience/
│   │   └── experience.json
│   ├── projects/
│   │   └── projects.json
│   ├── skills/
│   │   └── skills.json
│   ├── education/
│   │   └── education.json
│   ├── achievements/
│   │   └── achievements.json
│   ├── sources/
│   │   └── README.md
│   └── generated/
│       └── github-cache.json    # GitHub metadata cache (from ingest)
│
├── scripts/
│   └── ingest.ts                # GitHub cache warming script
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
│
├── infra/
│   └── k8s/                     # Kubernetes manifests
│
├── package.json                 # Root pnpm workspace
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.json
└── README.md
```

## API Structure

### REST Endpoints

| Method | Path | Controller | Description |
|--------|------|------------|-------------|
| GET | `/api/health` | health.controller | Health check |
| GET | `/api/profile` | profile.controller | Get profile data |
| GET | `/api/projects` | projects.controller | List all projects |
| POST | `/api/contact` | contact.controller | Submit contact form |
| POST | `/api/chat` | chat.controller | SSE chat stream |

### Chat Streaming (SSE)

- Endpoint: `POST /api/chat`
- Request: `{ message: string, sources?: string[], conversationId?: string }`
- Response: Server-Sent Events stream with typed events:
  - `step` — Pipeline step updates
  - `token` — LLM token chunks
  - `tool` — Tool invocation results
  - `complete` — Final response
  - `error` — Error events

### Data Flow

```
Request → Middleware (cors, rate-limit, request-context)
  → Controller (thin, validation via Zod)
  → Service (business logic, single responsibility)
  → Repository (data access: file system, GitHub, web)
  → Response
```

## Backend Folder Structure (`apps/api/src/`)

```
src/
├── app.ts                      # Express setup, global middleware, route mounting
├── index.ts                    # Server entry, graceful shutdown
├── config/
│   └── env.ts                  # Zod schema for all env vars (validated at boot)
├── controllers/                # HTTP layer only — no business logic
│   ├── chat.controller.ts      # Handles SSE chat stream
│   ├── contact.controller.ts   # Contact form submission
│   ├── health.controller.ts    # Health check
│   ├── profile.controller.ts   # Profile data
│   └── projects.controller.ts  # Projects listing
├── middlewares/
│   ├── cors.middleware.ts      # CORS allowlist from CORS_ORIGINS
│   ├── error-handler.middleware.ts  # Centralized error handling
│   ├── rate-limit.middleware.ts     # Contact form rate limiting
│   └── request-context.middleware.ts # Request ID, timing
├── repositories/
│   └── portfolio.repository.ts # File-based data access (data/ folder)
├── routes/
│   ├── index.ts                # Route registry
│   ├── chat.routes.ts
│   ├── contact.routes.ts
│   ├── health.routes.ts
│   ├── profile.routes.ts
│   └── projects.routes.ts
├── services/
│   ├── chat/
│   │   ├── chat-pipeline.service.ts  # Orchestrates chat flow
│   │   ├── chat-tools.service.ts     # Tool definitions for LLM
│   │   ├── system-prompt.ts          # System prompt construction
│   │   └── providers/                # LLM Provider implementations
│   │       ├── llm-provider.ts       # Interface: complete(messages, tools)
│   │       ├── fallback.provider.ts  # Tries providers in order
│   │       ├── mock.provider.ts      # Works without API keys
│   │       └── nvidia.provider.ts    # NVIDIA Nemotron 3 Ultra
│   ├── contact/
│   │   ├── contact.service.ts        # Contact form processing
│   │   ├── contact.validation.ts     # Zod schemas for contact
│   │   └── contact.webhook.ts        # Webhook delivery
│   └── retrieval/
│       ├── github.source.ts          # GitHub API source
│       ├── google-search.source.ts   # Google Custom Search
│       ├── local-file.source.ts      # Local file search
│       ├── search.provider.ts        # Unified search interface
│       ├── types.ts                  # Search types
│       └── web.source.ts             # Web fetch + extract
└── utils/
    └── logger.ts               # Structured logging (pino)
```

## Frontend Folder Structure (`apps/web/src/`)

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout, providers
│   ├── page.tsx                # Chat interface (home)
│   ├── portfolio/
│   │   └── page.tsx            # Portfolio page
│   ├── robots.ts               # robots.txt generation
│   └── sitemap.ts              # sitemap.xml generation
├── components/                 # Shared/layout components
│   ├── app-chrome.tsx          # App shell, navigation
│   ├── command-palette-provider.tsx
│   ├── mode-switcher.tsx       # Chat/Portfolio toggle
│   ├── theme-provider.tsx      # Theme context
│   └── theme-toggle.tsx        # Dark/light toggle
├── features/                   # Feature-based components (colocated)
│   └── chat/
│       ├── chat-input.tsx      # Message input with attachments
│       ├── chat-message-list.tsx
│       ├── chat-view.tsx       # Main chat container
│       ├── contact-flow.tsx    # Contact form modal
│       ├── live-step-ticker.tsx # Streaming step indicator
│       ├── source-picker.tsx   # Source selection UI
│       ├── steps-disclosure.tsx # Expandable reasoning steps
│       ├── suggested-questions.tsx
│       └── use-chat.ts         # Chat hook (SSE + state)
├── lib/                        # Client utilities
│   ├── analytics.ts            # Event tracking
│   ├── apiClient.ts            # Typed client (packages/api-client)
│   ├── chatStorage.ts          # LocalStorage persistence
│   └── serverApi.ts            # Server-side API calls
└── tests/                      # Vitest + RTL tests
    ├── setup.ts
    ├── chat-input.test.tsx
    └── suggested-questions.test.tsx
```

## Shared Packages Detail

### `packages/types` — Source of Truth
- `domain.ts` — Core entities: `Project`, `Skill`, `Experience`, `Education`, `Achievement`, `Profile`
- `api.ts` — API contracts: request/response types for all endpoints
- All packages import types from here

### `packages/design-system`
- `tokens.ts` — CSS custom properties for colors, spacing, typography, radii
- Tailwind preset in `tailwind.config.ts` (extends tokens)

### `packages/ui` — Component Primitives
- Extends shadcn/ui patterns
- Uses design tokens from `design-system`
- Exports from `index.ts` for tree-shaking

### `packages/api-client`
- `client.ts` — Typed `fetch` wrapper + SSE client
- Handles event parsing, reconnection, abort signals
- Used by both web app and scripts

### `packages/config`
- Shared `tsconfig` bases: `base`, `nextjs`, `node`

## Critical Rules (Expanded)

### Data Layer (`data/`)
- **All user-facing content lives in `data/`** — profile, experience, projects, skills, education, achievements
- **Never hardcode content in components** — always read from `data/` via the API
- To update portfolio content: edit JSON/markdown files in `data/`, not code
- `data/generated/` is gitignored except `github-cache.json` (committed for CI)

### API Layer (`apps/api/`)
- Controllers: `src/controllers/` — thin, only HTTP handling
- Services: `src/services/` — business logic, single responsibility
- Repositories: `src/repositories/` — data access (file system, GitHub, web)
- Providers: `src/services/chat/providers/` — LLM implementations (`LLMProvider` interface)
- **Never skip validation** — all inputs validated via Zod schemas
- **Never read `.env` directly** — use `config/env.ts` validated config object

### Web Layer (`apps/web/`)
- App Router only — no Pages Router
- Components in `src/components/` — prefer server components
- Client components marked with `'use client'` — minimize these
- API calls via `packages/api-client` — never raw `fetch`
- Feature components in `src/features/` — colocalized by feature

### Shared Packages (`packages/`)
- **`types` is the source of truth** — all domain types defined here
- **`ui` components** — extend shadcn, use design tokens from `design-system`
- **`api-client`** — typed client for SSE chat stream + REST endpoints
- Never import across packages incorrectly — follow `package.json` dependencies

## Forbidden Actions

| Action | Reason |
|--------|--------|
| Modify `pnpm-lock.yaml` directly | Use `pnpm install` / `pnpm add` |
| Edit generated files (`.turbo/`, `node_modules/`, `dist/`) | Regenerated on build |
| Hardcode API URLs | Use `packages/api-client` |
| Bypass Zod validation | Security & type safety |
| Add new dependencies without checking | Monorepo uses shared configs |
| Change `data/` structure without updating types | Breaks API contract |
| Commit secrets (`.env`, API keys) | Use `.env.example` as template |
| **Read `.env` files** | **Blocked — use validated config from `env.ts`** |
| Import types from anywhere but `packages/types` | Single source of truth |
| Create components outside `packages/ui` or `apps/web/src/features` | Consistency |

## Required Commands After Changes

```bash
pnpm lint       # ESLint (all packages)
pnpm typecheck  # tsc --noEmit (all packages)
pnpm test       # Vitest (backend + frontend)
pnpm build      # Production build verification
```

## Common Tasks

### Add a new project to portfolio
1. Edit `data/projects/projects.json` — add entry with `github`/`live` URLs
2. Run `pnpm ingest` to fetch GitHub metadata
3. No code changes needed

### Update skills/experience/bio
1. Edit corresponding file in `data/` (`skills.json`, `experience.json`, `profile/bio.md`)
2. No code changes needed

### Add new API endpoint
1. Define types in `packages/types/src/`
2. Add repository method in `apps/api/src/repositories/`
3. Add service logic in `apps/api/src/services/`
4. Add controller in `apps/api/src/controllers/`
5. Register route in `apps/api/src/routes/` and `apps/api/src/app.ts`
6. Add client method in `packages/api-client/src/`

### Add new UI component
1. Create in `packages/ui/src/components/`
2. Use design tokens from `packages/design-system/`
3. Export from `packages/ui/src/index.ts`
4. Use in `apps/web/src/components/` or `apps/web/src/features/`

### Add new LLM provider
1. Implement `LLMProvider` interface in `apps/api/src/services/chat/providers/`
2. Add to fallback chain in `fallback.provider.ts`
3. Update `env.ts` with any new required env vars

## Architecture Decisions (Do Not Challenge)

- **One Next.js app** for both chat and portfolio (not micro-frontends)
- **One TypeScript/Express backend** (not parallel FastAPI)
- **File-based data** in `data/` (not database) — version controlled
- **SSE for chat streaming** — `packages/api-client` handles this
- **MockProvider fallback** — works without `NVIDIA_API_KEY`
- **Zod validation at boundaries** — controllers, repositories, providers
- **pnpm workspaces** with Turborepo for build orchestration
- **No `.env` reading by agents** — all config via validated `env.ts`

## Security Requirements

- All env vars validated at boot via Zod (`apps/api/src/config/env.ts`)
- CORS allowlisted via `CORS_ORIGINS`
- Contact form: rate-limited, honeypot, validated
- Web fetches: SSRF-guarded, timeout/size bounded, cached
- Retrieved content treated as untrusted — system prompt forbids following embedded instructions
- No secrets in repo — `.env.example` as template only

### Security — Concrete Invariants (Never Break)

**Rate limits** (`apps/api/src/middlewares/rate-limit.middleware.ts`):
- Chat: 20 requests / 60 s (`chatRateLimit`)
- Contact: 5 requests / 10 min (`contactRateLimit`)
- Do not raise these limits or remove the middleware without explicit instruction.

**SSRF protection** (`apps/api/src/services/retrieval/web.source.ts`):
- `isSafeUrl()` blocks `localhost`, `127.*`, `0.0.0.0`, `10.*`, `192.168.*`, `169.254.*` (AWS IMDS), `172.16-31.*`, `::1`
- Only `http:` and `https:` schemes allowed
- Fetch timeout: 5 000 ms; max body: 200 000 bytes; cache TTL: 30 min
- Never remove or weaken `isSafeUrl()` — it is the only server-side SSRF fence.

**Honeypot field** (`apps/api/src/services/contact/contact.validation.ts`):
- The `company` field is the honeypot — it must remain invisible to real users in the UI.
- `isHoneypotTripped()` returns `true` if `company` is non-empty → request is silently rejected.
- Never render `company` as a visible form field. Never remove it from the schema.

**Prompt-injection mitigation** (`apps/api/src/services/chat/system-prompt.ts`):
- All retrieved content (GitHub READMEs, fetched pages) is wrapped in `<context>` tags.
- The system prompt explicitly instructs the model to treat `<context>` as **reference data, never instructions**.
- Never change the framing so retrieved content could be interpreted as system-level instructions.

**LLM interface** (`apps/api/src/services/chat/providers/llm-provider.ts`):
- `LLMProvider.streamCompletion(messages: LLMMessage[]): AsyncGenerator<string>`
- This is an intentionally simple, tools-free interface. Tool calls are resolved **before** LLM invocation inside `chat-pipeline.service.ts` via intent detection + retrieval — not passed as tool-call schemas to the model.

## Chat Pipeline Internals

Understanding this flow is essential before editing anything in `apps/api/src/services/chat/`.

### Intent Detection → Retrieval → LLM

```
User message
  → detectIntent()  →  Intent type (see table below)
  → retrieval step  →  RetrievedDocument[]
  → buildSystemPrompt()  →  system prompt + <context> block
  → LLMProvider.streamCompletion()  →  token stream
  → extractFollowUps()  →  splits answer from __FOLLOWUPS__[...] marker
  → SSE events to client
```

### Intent Types (`chat-pipeline.service.ts`)

| Intent | Triggers | Retrieval |
|--------|----------|-----------|
| `chitchat` | Short greetings/acks ("ok", "thanks", "hi") | Skip — no retrieval |
| `contact` | "contact", "reach out", "email me", "hire me" | Contact-flow UI trigger |
| `github` | "github", "repo", "repository" | GitHub source |
| `project` | "project", "built", "kubernetes", "deploy" | Projects + GitHub |
| `experience` | "experience", "worked", "company", "career" | Experience data |
| `skills` | "skill", "technology", "stack", "proficient" | Skills data |
| `general` | Anything else | All selected sources |

**Key rule**: `chitchat` bypasses all retrieval — the model replies from conversational context only. This prevents unnecessary source fetches for acknowledgments.

### Pipeline Event Types

Internal events emitted by `runChatPipeline()`:

| Type | Shape | Description |
|------|-------|-------------|
| `status` | `{ type: "status", label: string }` | Live-ticker label (step in progress) |
| `token` | `{ type: "token", value: string }` | LLM token chunk |
| `done` | `{ type: "done", data: ChatResponse }` | Final response with sources + follow-ups |
| `error` | `{ type: "error", message: string }` | Non-fatal error surfaced to client |

These map to SSE event names `step`, `token`, `complete`, `error` in `chat.controller.ts`.

### Follow-up Question Format

The LLM appends suggested follow-ups with this exact marker (parsed by `extractFollowUps()`):

```
__FOLLOWUPS__["Question 1?","Question 2?","Question 3?"]
```

If you change the system prompt's follow-up instructions, update `extractFollowUps()` regex in `chat-pipeline.service.ts` to match.

## Local Development Quick-Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy env template — no API keys required for local dev
cp .env.example .env

# 3. Start all services (API :4000, Web :3000)
pnpm dev

# 4. (Optional) Warm GitHub cache for realistic project data
pnpm ingest
```

MockProvider activates automatically when `NVIDIA_API_KEY` is unset — the chat UI works fully with canned responses.

## Problem → File Quick-Reference

Use this table when a problem statement arrives — go directly to the right file rather than searching.

| Symptom / Problem | Primary file(s) to read first |
|-------------------|-------------------------------|
| Chat response not streaming | `apps/api/src/controllers/chat.controller.ts`, `apps/api/src/services/chat/chat-pipeline.service.ts` |
| Wrong/missing chat answer | `apps/api/src/services/chat/system-prompt.ts`, `data/` JSON files |
| LLM provider failing | `apps/api/src/services/chat/providers/fallback.provider.ts`, `apps/api/src/services/chat/providers/nvidia.provider.ts` |
| Contact form not submitting | `apps/api/src/services/contact/contact.service.ts`, `apps/api/src/services/contact/contact.validation.ts` |
| Contact webhook not firing | `apps/api/src/services/contact/contact.webhook.ts`, `.env` `CONTACT_WEBHOOK_URL` |
| Portfolio data missing/stale | `data/` JSON files, `apps/api/src/repositories/portfolio.repository.ts` |
| GitHub projects not showing | `data/generated/github-cache.json`, `apps/api/src/services/retrieval/github.source.ts` |
| Web search not working | `apps/api/src/services/retrieval/google-search.source.ts`, `.env` `GOOGLE_SEARCH_*` |
| CORS error in browser | `apps/api/src/middlewares/cors.middleware.ts`, `CORS_ORIGINS` env var |
| Rate-limit 429 errors | `apps/api/src/middlewares/rate-limit.middleware.ts` |
| Type error after data change | `packages/types/src/domain.ts` — update type first, then `data/*.json` |
| SSE events not reaching UI | `packages/api-client/src/client.ts`, `apps/web/src/features/chat/use-chat.ts` |
| Live-ticker labels wrong | `apps/api/src/services/chat/chat-pipeline.service.ts` `*_LABELS` arrays |
| Follow-up questions missing | `extractFollowUps()` in `chat-pipeline.service.ts`, system prompt `__FOLLOWUPS__` instruction |

## Debugging Tips

**Structured logs** — The API uses `pino` (`apps/api/src/utils/logger.ts`). Every request gets a `requestId` injected by `request-context.middleware.ts`. Filter logs by `requestId` when tracing a specific chat turn.

**MockProvider output** — When `NVIDIA_API_KEY` is unset the `MockProvider` returns a fixed canned response. If you see identical answers every time, that is expected mock behaviour, not a bug.

**Build cache** — Turborepo caches builds. If changes aren't reflected run `pnpm build --force` to bypass cache.

**SSE debugging** — Use `curl -N -X POST http://localhost:4000/api/chat -H "Content-Type: application/json" -d '{"message":"hi"}'` to stream raw SSE events without a browser.

## Testing

- Unit tests: `*.test.ts` / `*.test.tsx` alongside source
- API tests: `apps/api/tests/`
- Web tests: `apps/web/tests/`
- Run `pnpm test` — uses Vitest

## When Uncertain

1. Search existing code for patterns: `grep -r "pattern" apps/ packages/`
2. Consult **Problem → File Quick-Reference** table above
3. Read `docs/architecture.md` for system design
4. Read `docs/api.md` for API contract
5. Ask for clarification rather than guessing