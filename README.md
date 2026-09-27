# Sumanth AI — AI-First Personal Portfolio

An intelligent portfolio where the **AI chat is the primary interface**. Ask about experience, skills, or projects — it answers from verified, version-controlled data, never hallucinated. A classic landing page (`/portfolio`) serves as the alternate mode, reading from the same API and data.

---

## Quick Start

```bash
# Install dependencies (uses pnpm@11.20.0 via packageManager)
pnpm install

# Copy env template — all vars have safe fallbacks
cp .env.example .env

# Start both apps: Next.js web (:3000) + Express API (:4000)
pnpm dev
```

Open **http://localhost:3000**. No `NVIDIA_API_KEY`? The chat still works — `MockProvider` answers from retrieved context deterministically until you add a real key.

---

## Tech Stack & Rationale

### Core Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | Next.js 14 (App Router) | Server-first rendering, streaming, React Server Components, zero-bundle JS for static pages |
| **Backend** | Express + TypeScript | Minimal, typed, single runtime — avoids context-switching between Python/JS |
| **Package Manager** | **pnpm@11.20.0** | Fast, disk-efficient, strict dependency resolution, native monorepo support via workspaces |
| **Build System** | Turborepo | Remote caching, parallel execution, task pipeline — scales with repo growth |
| **Language** | TypeScript (strict) | End-to-end type safety from API contracts → UI components |
| **Styling** | Tailwind CSS + Design Tokens | Utility-first, consistent design system via `packages/design-system` |
| **UI Primitives** | shadcn/ui (customized in `packages/ui`) | Accessible, copy-pasteable components — no runtime dependency on a component library |
| **API Client** | Custom typed client (`packages/api-client`) | Typed SSE + REST, reconnection, abort signals — no `fetch` in components |
| **Validation** | Zod | Schema validation at every boundary (controllers, repos, providers) |
| **Logging** | Pino | Structured JSON logs with request IDs for tracing |
| **Git Hooks** | lefthook | Runs `lint` + `build` on staged files pre-commit — zero-config for contributors |

### AI / LLM Layer

| Component | Choice | Why |
|-----------|--------|-----|
| **Primary Model** | **NVIDIA Nemotron 3 Ultra** (`nvidia/nemotron-3-ultra`) | Best-in-class reasoning for coding/technical tasks, OpenAI-compatible API, generous free tier on `build.nvidia.com`, low latency |
| **Provider Interface** | `LLMProvider` (1 method: `streamCompletion`) | Swappable — add any OpenAI-compatible provider in one file |
| **Fallback** | `MockProvider` | Works without API keys; deterministic canned responses for local dev/CI |
| **Retrieval** | Multi-source (GitHub, Web, Local files) | Grounded answers from real data — not parametric memory |
| **Prompt Injection Defense** | `<context>` wrapping + explicit system instructions | Retrieved content treated as reference, never instructions |

**Why Nemotron 3 Ultra?**
- **Technical reasoning**: Outperforms GPT-4o on coding benchmarks (HumanEval, MBPP)
- **OpenAI-compatible**: Drop-in replacement — no vendor lock-in
- **Cost**: Free tier on NVIDIA's platform; pay-as-you-go beyond that
- **Latency**: Optimized for NVIDIA GPUs — fast token generation
- **Context**: 128k tokens — fits entire portfolio context + retrieval

---

## Repository Layout

```
SumanthPortfolio/
├── apps/
│   ├── api/                      # Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── app.ts            # Express setup, middleware, routes
│   │   │   ├── index.ts          # Entry point, graceful shutdown
│   │   │   ├── config/env.ts     # Zod-validated env (validated at boot)
│   │   │   ├── controllers/      # Thin HTTP handlers only
│   │   │   ├── middlewares/      # CORS, rate-limit, error handling, request context
│   │   │   ├── repositories/     # Data access (file system, GitHub, web)
│   │   │   ├── routes/           # Route registration
│   │   │   ├── services/         # Business logic
│   │   │   │   ├── chat/         # Chat pipeline, tools, providers
│   │   │   │   ├── contact/      # Contact form + webhook
│   │   │   │   └── retrieval/    # GitHub, Google Search, web, local sources
│   │   │   └── utils/logger.ts   # Pino structured logging
│   │   └── package.json
│   │
│   └── web/                       # Next.js 14 (App Router) Frontend
│       ├── src/
│       │   ├── app/              # App Router pages (chat, portfolio, robots, sitemap)
│       │   ├── components/       # Shared layout components (chrome, theme, palette)
│       │   ├── features/chat/    # Feature-colocated chat components
│       │   │   ├── chat-view.tsx        # Main chat container
│       │   │   ├── chat-input.tsx       # Message input
│       │   │   ├── chat-message-list.tsx
│       │   │   ├── live-step-ticker.tsx # Streaming step indicator
│       │   │   ├── steps-disclosure.tsx # Expandable reasoning steps
│       │   │   ├── source-picker.tsx    # Source selection UI
│       │   │   ├── suggested-questions.tsx
│       │   │   ├── contact-flow.tsx     # Contact form modal
│       │   │   └── use-chat.ts          # SSE hook + state
│       │   ├── lib/              # Client utilities (apiClient, analytics, storage)
│       │   └── tests/            # Vitest + React Testing Library
│       └── package.json
│
├── packages/
│   ├── types/                   # **Source of Truth** — domain + API types
│   ├── design-system/           # CSS tokens + Tailwind preset
│   ├── ui/                      # shadcn-based component primitives
│   ├── api-client/              # Typed fetch/SSE client
│   ├── config/                  # Shared tsconfig bases
│   └── eslint-config/           # Flat ESLint config
│
├── data/                        # **All user-facing content lives here**
│   ├── profile/                 # profile.json + bio.md
│   ├── experience/              # experience.json
│   ├── projects/                # projects.json (GitHub URLs → auto-enriched)
│   ├── skills/                  # skills.json
│   ├── education/               # education.json
│   ├── achievements/            # achievements.json
│   └── generated/               # github-cache.json (committed for CI)
│
├── scripts/
│   └── ingest.ts                # GitHub cache warming
│
├── docs/
│   ├── architecture.md          # System design + scope decisions
│   ├── api.md                   # Full API contract (REST + SSE)
│   └── deployment.md            # Deploy guide + env checklist
│
├── .github/workflows/
│   └── check-lint-build.yml     # CI: lint → typecheck → test → build
│
├── package.json                 # Root: pnpm workspace + turbo scripts
├── pnpm-workspace.yaml
├── turbo.json
├── lefthook.yml                 # Pre-commit: lint + build on staged files
└── tsconfig.json
```

---

## Architecture Principles

1. **Content-Driven** — All user-facing content in `data/` (JSON + Markdown), never hardcoded
2. **Separation of Concerns** — Controllers → Services → Repositories (single responsibility)
3. **Type Safety First** — `packages/types` is the single source of truth
4. **Server-First Rendering** — Prefer React Server Components; minimize `'use client'`
5. **Streaming-First Chat** — SSE for real-time tokens, handled by `packages/api-client`
6. **Provider Pattern** — LLM providers implement `LLMProvider` interface; `MockProvider` fallback
7. **Validation at Boundaries** — Zod schemas at controllers, repositories, providers
8. **Security by Default** — CORS allowlist, rate limiting, SSRF protection, honeypot fields

---

## API Structure

### REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/profile` | Profile data |
| GET | `/api/projects` | All projects |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/chat` | SSE chat stream |

### Chat Streaming (SSE)

```
POST /api/chat
Request: { message: string, sources?: string[], conversationId?: string }
Response: Server-Sent Events
  - step   → Pipeline step updates
  - token  → LLM token chunks
  - tool   → Tool invocation results
  - complete → Final response + sources + follow-ups
  - error  → Error events
```

---

## Chat Pipeline Internals

```
User message
  → detectIntent()  →  Intent type (chitchat | contact | github | project | experience | skills | general)
  → retrieval step  →  RetrievedDocument[] (skipped for chitchat)
  → buildSystemPrompt()  →  System prompt + <context> block
  → LLMProvider.streamCompletion()  →  Token stream
  → extractFollowUps()  →  Splits answer from __FOLLOWUPS__[...] marker
  → SSE events to client
```

**Intent types** determine which sources are queried — `chitchat` bypasses retrieval entirely for speed.

---

## Updating Content

Everything the AI and landing page say comes from `data/*`. **No code changes required.**

| Content | File |
|---------|------|
| Profile & Bio | `data/profile/profile.json`, `data/profile/bio.md` |
| Experience | `data/experience/experience.json` |
| Projects | `data/projects/projects.json` (add `github`/`live` URLs) |
| Skills | `data/skills/skills.json` |
| Education | `data/education/education.json` |
| Achievements | `data/achievements/achievements.json` |

After editing `projects.json`, run `pnpm ingest` to fetch GitHub metadata (stars, language, topics).

---

## Scripts

```bash
pnpm dev          # Both apps in watch mode
pnpm build        # Production build (all packages)
pnpm lint         # ESLint (all packages)
pnpm typecheck    # tsc --noEmit (all packages)
pnpm test         # Vitest (backend + frontend)
pnpm ingest       # Pre-warm GitHub project cache
pnpm clean        # Turbo clean + remove node_modules
```

---

## Security Invariants (Never Break)

- **Rate limits**: Chat 20/min, Contact 5/10min — enforced in middleware
- **SSRF protection**: `isSafeUrl()` blocks private/internal hosts, 5s timeout, 200KB max body
- **Honeypot**: `company` field in contact form — must stay invisible; non-empty = silent reject
- **Prompt injection**: Retrieved content wrapped in `<context>`, system prompt forbids following embedded instructions
- **No secrets in repo** — `.env.example` only; env validated at boot via Zod

---

## Documentation

- `docs/architecture.md` — System design, diagrams, scope decisions (why one Next.js app, one TS backend)
- `docs/api.md` — Full API contract including SSE event formats
- `docs/deployment.md` — Deploying both apps, environment checklist

---

## Explicitly Out of Scope (This Pass)

Documented in `docs/architecture.md`:
- Second (Python/FastAPI) backend implementation
- Vector-embeddings search (interface ready in `SearchProvider`)
- True micro-frontend deployment / multi-zone routing
- Executed CI/CD against live cloud (workflow written, not run)