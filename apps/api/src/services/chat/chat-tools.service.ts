import type { Project, SourceReference } from "@portfolio/types";
import { portfolioRepository } from "../../repositories/portfolio.repository";
import { githubSource } from "../retrieval/github.source";
import { localFileSource } from "../retrieval/local-file.source";
import { searchGoogleWeb } from "../retrieval/google-search.source";
import { searchProvider } from "../retrieval/search.provider";
import { fetchLiveProject } from "../retrieval/web.source";
import type { RetrievedDocument } from "../retrieval/types";

export interface ToolResult {
  documents: RetrievedDocument[];
}

const MAX_SOURCE_LABEL_LENGTH = 40;

/**
 * Labels each cited source with its actual document title (e.g. "Skills",
 * "Infrastructure Automation Project") rather than a generic per-kind name —
 * otherwise two different portfolio documents both render as an
 * indistinguishable "Portfolio" chip.
 */
function toSourceReference(doc: RetrievedDocument): SourceReference {
  const title = doc.sourceKind === "resume" ? "Resume" : doc.title;
  const label = title.length > MAX_SOURCE_LABEL_LENGTH ? `${title.slice(0, MAX_SOURCE_LABEL_LENGTH - 1).trimEnd()}…` : title;
  return { id: doc.id, kind: doc.sourceKind, label, url: doc.url };
}

/** Tool: search the hand-authored portfolio content (profile/experience/projects/skills). */
export async function searchPortfolio(query: string): Promise<ToolResult> {
  const documents = await localFileSource.fetchDocuments();
  return { documents: searchProvider.search(query, documents, 6) };
}

/**
 * Tool: search public GitHub repositories for the configured username. A broad
 * question ("show me your best projects") often shares no keywords with any
 * repo's name/description/topics, so a fallback to the most recently updated
 * repos keeps the answer grounded in real data instead of surfacing nothing.
 * README fetching is capped to this small matched set (never the whole repo
 * list) to stay well under GitHub's rate limit.
 */
export async function searchGitHub(query: string): Promise<ToolResult> {
  const documents = await githubSource.fetchDocuments();
  const matched = searchProvider.search(query, documents, 6);
  const candidates: RetrievedDocument[] = matched.length > 0 ? matched : documents.slice(0, 5);

  const enriched = await Promise.all(
    candidates.map(async (doc) => {
      const readme = await githubSource.fetchReadme(doc.title);
      return readme ? { ...doc, content: `${doc.content}\nREADME:\n${readme}` } : doc;
    }),
  );
  return { documents: enriched };
}

/** Tool: fetch verified experience entries (used directly, not via keyword search). */
export function getExperience() {
  return portfolioRepository.getExperience();
}

/** Tool: fetch verified skills. */
export function getSkills() {
  return portfolioRepository.getSkills();
}

/** Tool: fetch the full, verified project list (used directly, not via lossy keyword search). */
export function getProjects() {
  return portfolioRepository.getProjects();
}

/** Tool: find a manually-catalogued project by fuzzy name match. */
export function getProject(nameOrId: string): Project | undefined {
  const needle = nameOrId.toLowerCase();
  return portfolioRepository.getProjects().find((p) => p.id === nameOrId || p.name.toLowerCase().includes(needle));
}

/** Tool: fetch a project's live URL on demand only (never crawled proactively). */
export async function fetchProjectUrl(url: string): Promise<RetrievedDocument | null> {
  return fetchLiveProject(url);
}

/** Tool: live Google web search — only invoked when a visitor opts into it. */
export async function searchWeb(query: string): Promise<RetrievedDocument[]> {
  return searchGoogleWeb(query);
}

export { toSourceReference };
