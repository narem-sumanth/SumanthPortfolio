import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GithubRepoMeta } from "@portfolio/types";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import type { RetrievedDocument, SourceConnector } from "./types";

const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_README_CHARS = 3000;
const GENERATED_CACHE_PATH = join(__dirname, "../../../../../data/generated/github-cache.json");

let memoryCache: { repos: GithubRepoMeta[]; fetchedAt: number } | null = null;
const readmeCache = new Map<string, { content: string; fetchedAt: number }>();

function readDiskCache(): GithubRepoMeta[] {
  try {
    const raw = readFileSync(GENERATED_CACHE_PATH, "utf-8");
    return JSON.parse(raw) as GithubRepoMeta[];
  } catch {
    return [];
  }
}

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
  default_branch: string;
}

function toRepoMeta(repo: GithubApiRepo): GithubRepoMeta {
  return {
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    updatedAt: repo.updated_at,
    archived: repo.archived,
    defaultBranch: repo.default_branch,
  };
}

/** GitHub serves a zip archive of any public repo at this URL — no custom packaging needed. */
function zipUrl(repo: GithubRepoMeta): string {
  return `${repo.url}/archive/refs/heads/${repo.defaultBranch}.zip`;
}

/**
 * GitHub project discovery. Never throws — a GitHub outage or missing token
 * degrades to the on-disk cache (written by `pnpm ingest`) or an empty list,
 * never a broken chat response.
 */
export class GithubSource implements SourceConnector {
  name = "github";

  async fetchRepos(): Promise<GithubRepoMeta[]> {
    if (!env.GITHUB_USERNAME) return [];

    if (memoryCache && Date.now() - memoryCache.fetchedAt < CACHE_TTL_MS) {
      return memoryCache.repos;
    }

    try {
      const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
      if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

      const res = await fetch(
        `https://api.github.com/users/${env.GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
        { headers, signal: AbortSignal.timeout(8000) },
      );
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`);

      const raw = (await res.json()) as GithubApiRepo[];
      const repos = raw.filter((r) => !r.fork && !r.archived).map(toRepoMeta);
      memoryCache = { repos, fetchedAt: Date.now() };
      return repos;
    } catch (err) {
      logger.warn({ err }, "GitHub live fetch failed, falling back to cached data");
      const fallback = readDiskCache();
      memoryCache = { repos: fallback, fetchedAt: Date.now() };
      return fallback;
    }
  }

  async fetchDocuments(): Promise<RetrievedDocument[]> {
    const repos = await this.fetchRepos();
    return repos.map((repo) => ({
      id: `github-${repo.name}`,
      sourceKind: "github" as const,
      title: repo.name,
      content: [
        repo.description ?? "",
        `Language: ${repo.language ?? "n/a"}`,
        `Topics: ${repo.topics.join(", ")}`,
        `Stars: ${repo.stars}, Forks: ${repo.forks}`,
        `Zip download: ${zipUrl(repo)}`,
      ].join("\n"),
      url: repo.url,
    }));
  }

  /**
   * Fetches one repo's README as plain text, for on-demand enrichment of a
   * small, already-matched set of repos — never called for the whole repo
   * list at once, to stay well under GitHub's (especially unauthenticated)
   * rate limit. Cached per repo; degrades to an empty string on any failure
   * (missing README, rate limit, network error) so one bad repo never breaks
   * the whole answer.
   */
  async fetchReadme(repoName: string): Promise<string> {
    const cached = readmeCache.get(repoName);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.content;

    try {
      const headers: Record<string, string> = { Accept: "application/vnd.github.raw+json" };
      if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;

      const res = await fetch(`https://api.github.com/repos/${env.GITHUB_USERNAME}/${repoName}/readme`, {
        headers,
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) {
        readmeCache.set(repoName, { content: "", fetchedAt: Date.now() });
        return "";
      }

      const content = (await res.text()).slice(0, MAX_README_CHARS);
      readmeCache.set(repoName, { content, fetchedAt: Date.now() });
      return content;
    } catch (err) {
      logger.warn({ err, repoName }, "README fetch failed, continuing without it");
      return cached?.content ?? "";
    }
  }
}

export const githubSource = new GithubSource();
