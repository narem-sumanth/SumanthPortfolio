import { describe, expect, it } from "vitest";
import { KeywordSearchProvider } from "../src/services/retrieval/search.provider";
import type { RetrievedDocument } from "../src/services/retrieval/types";

const docs: RetrievedDocument[] = [
  { id: "1", sourceKind: "portfolio", title: "Kubernetes Deployment Platform", content: "Automates deployments with Kubernetes and Helm." },
  { id: "2", sourceKind: "portfolio", title: "Recipe Sharing App", content: "A React app for sharing recipes." },
];

describe("KeywordSearchProvider", () => {
  it("ranks the matching document above the unrelated one", () => {
    const results = new KeywordSearchProvider().search("kubernetes projects", docs);
    expect(results[0]?.id).toBe("1");
  });

  it("returns nothing for a query with no matches", () => {
    const results = new KeywordSearchProvider().search("xyzzy quokka", docs);
    expect(results).toHaveLength(0);
  });
});
