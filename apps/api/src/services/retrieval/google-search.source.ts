import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import type { RetrievedDocument } from "./types";

const ENDPOINT = "https://www.googleapis.com/customsearch/v1";
const FETCH_TIMEOUT_MS = 6000;

let warnedMissingConfig = false;

interface GoogleSearchItem {
  title: string;
  link: string;
  snippet?: string;
}

/**
 * Tool: live Google web search via the Custom Search JSON API. Requires
 * GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_ENGINE_ID — returns no results
 * (never fabricated ones) when unconfigured, rather than pretending to search.
 */
export async function searchGoogleWeb(query: string, limit = 4): Promise<RetrievedDocument[]> {
  if (!env.GOOGLE_SEARCH_API_KEY || !env.GOOGLE_SEARCH_ENGINE_ID) {
    if (!warnedMissingConfig) {
      logger.warn(
        "Google search requested but GOOGLE_SEARCH_API_KEY/GOOGLE_SEARCH_ENGINE_ID are not configured; skipping",
      );
      warnedMissingConfig = true;
    }
    return [];
  }

  const params = new URLSearchParams({
    key: env.GOOGLE_SEARCH_API_KEY,
    cx: env.GOOGLE_SEARCH_ENGINE_ID,
    q: query,
    num: String(Math.min(Math.max(limit, 1), 10)),
  });

  try {
    const res = await fetch(`${ENDPOINT}?${params}`, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) {
      logger.warn({ status: res.status }, "Google search request failed");
      return [];
    }

    const body = (await res.json()) as { items?: GoogleSearchItem[] };
    return (body.items ?? []).slice(0, limit).map((item) => ({
      id: `google-${item.link}`,
      sourceKind: "web" as const,
      title: item.title,
      content: item.snippet ?? item.title,
      url: item.link,
    }));
  } catch (err) {
    logger.warn({ err }, "Google search request errored");
    return [];
  }
}
