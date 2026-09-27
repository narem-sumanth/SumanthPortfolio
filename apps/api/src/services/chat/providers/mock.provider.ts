import type { LLMMessage, LLMProvider } from "./llm-provider";

/**
 * Deterministic, zero-cost fallback used whenever NVIDIA_API_KEY is unset.
 * It never invents facts: it summarizes only the retrieved-context block the
 * pipeline injected into the system prompt (see ai/pipeline.ts), so the app
 * stays honest and fully demoable without any provider configured.
 */
export class MockProvider implements LLMProvider {
  readonly name = "mock";

  async *streamCompletion(messages: LLMMessage[]): AsyncGenerator<string> {
    const system = messages.find((m) => m.role === "system")?.content ?? "";
    const userMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    // Anchored to a line that is *only* the tag, since buildSystemPrompt always emits
    // "<context>"/"</context>" as their own lines - matching the bare substring instead
    // would grab the first incidental "<context>" mentioned in the rules' prose text
    // (e.g. rule 1's "...isn't in <context> - a company name...") and swallow the rules.
    const contextMatch = system.match(/^<context>$\n([\s\S]*?)\n^<\/context>$/m);
    const context = contextMatch?.[1]?.trim();

    const answer = context
      ? `Based on the verified portfolio sources I have access to:\n\n${summarize(context, userMessage)}`
      : `I don't have enough verified information about "${userMessage}" in the portfolio sources I can access. ` +
        `You can ask about experience, projects, skills, or how to get in touch.`;

    for (const part of chunk(answer, 12)) {
      yield part;
      await sleep(15);
    }
  }
}

function summarize(context: string, userMessage: string): string {
  const lines = context.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length <= 6) {
    return lines.join("\n");
  }

  const keywords = userMessage
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["what", "how", "why", "tell", "about", "your", "me"].includes(w));

  let startIndex = 0;
  if (keywords.length > 0) {
    const lowerLines = lines.map((l) => l.toLowerCase());
    let bestScore = -1;
    let bestIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lowerLines[i] ?? "";
      let score = 0;
      for (const kw of keywords) {
        if (line.includes(kw)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }
    startIndex = bestIndex;
  }

  const rotated = lines.slice(startIndex).concat(lines.slice(0, startIndex));
  return rotated.slice(0, 6).join("\n");
}

function chunk(text: string, size: number): string[] {
  const words = text.split(" ");
  const out: string[] = [];
  for (let i = 0; i < words.length; i += size) {
    out.push(words.slice(i, i + size).join(" ") + (i + size < words.length ? " " : ""));
  }
  return out;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
