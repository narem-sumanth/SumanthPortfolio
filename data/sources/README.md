# Data sources

This directory documents where the portfolio's knowledge comes from and the
priority used when sources conflict (see `apps/api/src/retrieval`).

1. `data/*` (this repository) — explicit, hand-authored portfolio data. Always wins.
2. GitHub (`GITHUB_USERNAME` in `.env`) — public repository metadata, fetched live and cached.
3. Live project URLs (`project.live` in `data/projects/projects.json`) — fetched only when a
   visitor asks about that specific project, with a timeout, size cap, and SSRF-safe validation.

LinkedIn is intentionally **not** scraped. If you want LinkedIn content reflected in
answers, export the relevant details into `data/profile/profile.json` or
`data/experience/experience.json` yourself.
