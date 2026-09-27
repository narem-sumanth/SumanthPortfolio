import type { RetrievedDocument, ScoredDocument, SearchProvider } from "./types";

/**
 * Keyword/topic scoring over structured metadata. No vector database — the
 * corpus is small (a personal portfolio), and `SearchProvider` is the seam
 * to swap in embeddings later without touching any caller.
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

export class KeywordSearchProvider implements SearchProvider {
  search(query: string, documents: RetrievedDocument[], limit = 5): ScoredDocument[] {
    const queryTokens = new Set(tokenize(query));
    if (queryTokens.size === 0) return [];

    const scored: ScoredDocument[] = documents.map((doc) => {
      const titleTokens = tokenize(doc.title);
      const contentTokens = tokenize(doc.content);
      let score = 0;
      for (const token of queryTokens) {
        if (titleTokens.includes(token)) score += 3;
        score += contentTokens.filter((t) => t === token).length;
      }
      return { ...doc, score };
    });

    return scored
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

export const searchProvider = new KeywordSearchProvider();
