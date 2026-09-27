import type { SourceKind } from "@portfolio/types";

/**
 * A normalized unit of retrievable knowledge. `content` is treated as
 * untrusted data when it originates from GitHub/web sources — it is framed
 * to the model as reference material, never as instructions (see ai/systemPrompt.ts).
 */
export interface RetrievedDocument {
  id: string;
  sourceKind: SourceKind;
  title: string;
  content: string;
  url?: string;
}

export interface ScoredDocument extends RetrievedDocument {
  score: number;
}

export interface SourceConnector {
  name: string;
  fetchDocuments(): Promise<RetrievedDocument[]>;
}

export interface SearchProvider {
  search(query: string, documents: RetrievedDocument[], limit?: number): ScoredDocument[];
}
