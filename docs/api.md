# API Reference

Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:4000`). All
responses are JSON except `/api/chat`, which is Server-Sent Events. The
contract types below live in `packages/types/src/api.ts` and
`packages/types/src/domain.ts` — treat that package as the source of truth.

## `GET /api/health`

Liveness check. Always returns `200`.

```json
{ "status": "ok", "service": "api", "timestamp": "2026-01-01T00:00:00.000Z" }
```

## `GET /api/ready`

Readiness check — verifies seed data loaded. Returns `200` when ready, `503`
when degraded.

```json
{ "status": "ready", "checks": { "seedData": true } }
```

## `GET /api/profile`

Returns the `Profile` object from `data/profile/profile.json`.

## `GET /api/experience` / `GET /api/skills` / `GET /api/education` / `GET /api/achievements`

Return the corresponding arrays from `data/*`.

## `GET /api/projects`

Returns `Project[]`, enriched with live `githubMeta` where a matching public
repository exists for `GITHUB_USERNAME`.

## `POST /api/contact`

Body:

```json
{ "name": "Jane Doe", "email": "jane@example.com", "message": "Hi!", "company": "" }
```

`company` is a honeypot — must stay empty; a bot that fills every field trips
it and the submission is silently discarded (still returns `201` so the bot
doesn't learn anything). Rate-limited to 5 requests / 10 minutes per IP.

Responses: `201 { ok: true, id }` · `400 { ok: false, error }` on validation
failure · `429` on rate limit.

## `POST /api/chat`

Body:

```json
{ "message": "What projects have you built with Kubernetes?", "history": [{ "role": "user", "content": "..." }] }
```

Response is `text/event-stream`. Each frame is `data: <json>\n\n` where the
JSON is one of:

```ts
{ type: "status", label: string }        // real pipeline step, not a fake spinner
{ type: "token", value: string }         // one chunk of the streamed answer
{ type: "done", data: ChatResponse }     // final structured payload
{ type: "error", message: string }       // user-safe error message
```

`ChatResponse`:

```ts
{
  answer: string;
  sources: SourceReference[];   // { id, kind: "portfolio"|"github"|"web"|"resume", label, url? }
  projects?: Project[];         // rendered as project cards
  actions?: ChatAction[];       // e.g. { type: "show_contact_form", label }
}
```

Rate-limited to 20 requests / minute per IP.

## Errors

Every error response follows the same shape: `{ ok: false, error: string }`.
The `error` string is always safe to show a user — no stack traces, no
internal paths, no secrets.
