/**
 * Pre-warms the GitHub project cache so the API has something to fall back
 * to if a live GitHub API call fails or is rate-limited at request time.
 * Deliberately standalone (no cross-package imports) — this is offline
 * ingestion, separate from the request-time retrieval path in
 * apps/api/src/services/retrieval/github.source.ts.
 *
 * Usage: pnpm ingest
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;
const OUT_DIR = join(__dirname, "../data/generated");
const OUT_FILE = join(OUT_DIR, "github-cache.json");

interface GithubApiRepo {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
  archived: boolean;
  fork: boolean;
}

async function main() {
  if (!USERNAME) {
    console.warn("GITHUB_USERNAME is not set — skipping GitHub ingestion.");
    return;
  }

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;

  const res = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=updated`, { headers });
  if (!res.ok) {
    console.error(`GitHub API responded ${res.status}. Skipping ingestion.`);
    return;
  }

  const raw = (await res.json()) as GithubApiRepo[];
  const repos = raw
    .filter((r) => !r.fork && !r.archived)
    .map((r) => ({
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      homepage: r.homepage,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      updatedAt: r.updated_at,
      archived: r.archived,
    }));

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(repos, null, 2));
  console.info(`Wrote ${repos.length} repositories to ${OUT_FILE}`);
}

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
