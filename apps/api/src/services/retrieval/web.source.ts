import { logger } from "../../utils/logger";
import type { RetrievedDocument } from "./types";

const FETCH_TIMEOUT_MS = 5000;
const MAX_BYTES = 200_000;
const CACHE_TTL_MS = 30 * 60 * 1000;

const cache = new Map<string, { doc: RetrievedDocument; fetchedAt: number }>();

const BLOCKED_HOSTNAME_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./, // link-local / cloud metadata (e.g. AWS IMDS)
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^\[?::1\]?$/,
];

function isSafeUrl(rawUrl: string): URL | null {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (BLOCKED_HOSTNAME_PATTERNS.some((pattern) => pattern.test(url.hostname))) return null;
  return url;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fetches a live project URL on demand only (never proactively crawled).
 * SSRF-safe (blocks private/internal hosts), time- and size-bounded, cached.
 * The returned content is untrusted external data for the model to
 * summarize — never instructions to follow.
 */
export async function fetchLiveProject(rawUrl: string): Promise<RetrievedDocument | null> {
  const cached = cache.get(rawUrl);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) return cached.doc;

  const url = isSafeUrl(rawUrl);
  if (!url) {
    logger.warn({ rawUrl }, "Refused to fetch unsafe or invalid project URL");
    return null;
  }

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "sumanth-portfolio-bot/1.0" },
      redirect: "follow",
    });
    if (!res.ok || !res.body) return null;

    const reader = res.body.getReader();
    let received = 0;
    const chunks: Uint8Array[] = [];
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        received += value.byteLength;
        chunks.push(value);
        if (received >= MAX_BYTES) {
          await reader.cancel();
          break;
        }
      }
    }

    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
    const text = stripHtml(html).slice(0, 4000);

    const doc: RetrievedDocument = {
      id: `web-${url.hostname}`,
      sourceKind: "web",
      title: url.hostname,
      content: text,
      url: url.toString(),
    };
    cache.set(rawUrl, { doc, fetchedAt: Date.now() });
    return doc;
  } catch (err) {
    logger.warn({ err, rawUrl }, "Live project fetch failed");
    return null;
  }
}
