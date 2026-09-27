# Sumanth AI — an AI-first personal portfolio

The AI chat *is* the portfolio's primary interface. Ask it about experience,
skills, or projects and it answers from verified, version-controlled data —
never invented. A classic landing page (`/portfolio`) is the alternate mode,
reading from the same API and the same data — currently a "coming soon"
placeholder while that mode is rebuilt.

```
"Show me your Kubernetes projects"  →  grounded answer + project cards + sources
"How can I contact you?"            →  inline contact form, submitted only on your say-so
```

## Quick start

```bash
pnpm install
cp .env.example .env   # fill in what you have — everything has a safe fallback
pnpm dev                # runs apps/web (:3000) and apps/api (:4000) together
```

Open http://localhost:3000. No `NVIDIA_API_KEY`? The chat still works —
`MockProvider` answers from the same retrieved context, deterministically and
honestly, until you add a real key.

## Repository layout

```
apps/
  web/            Next.js app — both the AI chat and portfolio landing page
  api/            Express + TypeScript API — layered controllers/services/repositories
packages/
  types/          Shared domain + API contract types (the source of truth)
  design-system/  CSS design tokens + Tailwind preset
  ui/             Shared, restyled component primitives (shadcn-based)
  api-client/     Typed fetch/SSE client used by apps/web
  config/         Shared tsconfig bases
  eslint-config/  Shared flat ESLint config
data/             Portfolio content — profile, experience, projects, skills, education, achievements
scripts/          ingest.ts — pre-warms the GitHub project cache
infra/docker/     Dockerfiles for both apps
docs/             architecture.md, api.md, deployment.md
```

See `docs/architecture.md` for the full picture and the reasoning behind two
scope decisions made up front: **one Next.js app** instead of three
micro-frontends, and **one TypeScript backend** instead of parallel
FastAPI/Express implementations.

## Updating content

Everything the AI and the landing page say comes from `data/*`. To make this
your own:

1. Edit `data/profile/profile.json` and `data/profile/bio.md`.
2. Edit `data/experience/experience.json`, `data/skills/skills.json`,
   `data/education/education.json`, `data/achievements/achievements.json`.
3. Edit `data/projects/projects.json` — set real `github`/`live` URLs; GitHub
   metadata (stars, language, topics) is fetched automatically.
4. Set `GITHUB_USERNAME` in `.env` to your real handle.

No code changes required — the current content is clearly marked
`PLACEHOLDER` everywhere it needs replacing.

## Scripts

```bash
pnpm dev          # both apps, watch mode
pnpm build        # production build, all packages
pnpm lint         # eslint, all packages
pnpm typecheck    # tsc --noEmit, all packages
pnpm test         # vitest, backend + frontend
pnpm ingest       # pre-warm the GitHub project cache (see docs/deployment.md)
```

## AI provider

`LLMProvider` is a one-method interface (`streamCompletion`). `NvidiaProvider`
targets NVIDIA's OpenAI-compatible API (`build.nvidia.com`) via
`NVIDIA_API_KEY` / `NVIDIA_BASE_URL` / `NVIDIA_MODEL`; `MockProvider` is the
zero-config fallback. Swapping to a different OpenAI-compatible provider
means adding one class in `apps/api/src/services/chat/providers/` — nothing else changes.

## Security notes

- CORS is allowlisted via `CORS_ORIGINS`; env is validated at boot (zod) and
  the process refuses to start on misconfiguration.
- Contact submissions are rate-limited, honeypot-protected, and validated.
- Live project URL fetches (`services/retrieval/web.source.ts`) are SSRF-guarded
  (blocks private/internal hosts), timeout- and size-bounded, and cached.
- Content retrieved from GitHub READMEs or fetched web pages is treated as
  untrusted data in the system prompt — the model is explicitly instructed
  never to follow instructions embedded in it.

## Documentation

- `docs/architecture.md` — system design, diagrams, and the reasoning behind
  the scope decisions
- `docs/api.md` — full API contract, including the SSE chat stream format
- `docs/deployment.md` — deploying both apps, plus an environment checklist

## Explicitly out of scope for this pass

Documented here rather than silently dropped — see `docs/architecture.md`:

- A second (Python/FastAPI) backend implementation
- Vector-embeddings search (the `SearchProvider` interface is ready for it)
- True micro-frontend deployment / multi-zone routing
- Executed CI/CD against a live cloud account (workflow is written, not run)
