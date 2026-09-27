# Deployment

## Frontend (`apps/web`)

Deploy to Vercel (recommended) or any Node host that can run `next start`.

- Build command: `pnpm --filter @portfolio/web build` (from repo root, so
  workspace packages resolve).
- Start command: `pnpm --filter @portfolio/web start`.
- Required env: `NEXT_PUBLIC_API_URL` pointing at the deployed API,
  `NEXT_PUBLIC_SITE_URL` for correct OpenGraph/sitemap URLs.

## Backend (`apps/api`)

Deploy to Render, Fly.io, Railway, or any Node host — it's a standard Express
server with no filesystem writes at runtime (GitHub cache is in-memory; the
optional on-disk fallback is read-only at request time).

- Build command: `pnpm --filter @portfolio/api build`.
- Start command: `pnpm --filter @portfolio/api start`.
- Required env: see `.env.example`. At minimum, set `CORS_ORIGINS` to the
  deployed frontend's origin.
- Optional: run `pnpm ingest` in CI before deploy to pre-warm
  `data/generated/github-cache.json`, so a GitHub API outage or rate limit at
  runtime still has cached repository data to fall back to.

## Docker

`docker-compose.yml` runs both services together for local integration
testing:

```bash
docker compose up --build
```

`infra/docker/Dockerfile.web` and `infra/docker/Dockerfile.api` each
build their app in isolation from the monorepo (only the packages they
actually depend on are copied in). `Dockerfile.web` uses Next.js
[standalone output](https://nextjs.org/docs/pages/api-reference/next-config-js/output)
(`output: "standalone"` in `next.config.mjs`) — the runtime image copies only
the traced server bundle plus static assets, not the monorepo's
`node_modules`, keeping the final image in the ~120-150MB range instead of
~500MB.

## Environment checklist

- [ ] `NVIDIA_API_KEY` set (optional — falls back to `MockProvider` if unset)
- [ ] `GITHUB_USERNAME` set to your real GitHub handle
- [ ] `CORS_ORIGINS` includes the deployed frontend's exact origin
- [ ] `CONTACT_WEBHOOK_URL` set if you want contact submissions delivered
      somewhere (Slack incoming webhook, Zapier, custom endpoint)
- [ ] `NEXT_PUBLIC_API_URL` on the frontend points at the deployed backend
- [ ] Real content swapped into `data/*` (see "Updating content" in the README)
