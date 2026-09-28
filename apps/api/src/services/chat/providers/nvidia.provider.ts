import { logger } from "../../../utils/logger";
import type { LLMMessage, LLMProvider } from "./llm-provider";
import { ProviderError } from "./fallback.provider";

interface NvidiaProviderOptions {
  apiKey: string;
  baseUrl: string;
  model: string;
}

/**
 * OpenAI-compatible streaming chat completion against NVIDIA's hosted API
 * (build.nvidia.com). The model id is fully configurable via NVIDIA_MODEL —
 * never hard-coded beyond the env default.
 */
export class NvidiaProvider implements LLMProvider {
  readonly name = "nvidia";

  constructor(private readonly options: NvidiaProviderOptions) {}

  async *streamCompletion(messages: LLMMessage[]): AsyncGenerator<string> {
    const res = await fetch(`${this.options.baseUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.options.apiKey}`,
      },
      body: JSON.stringify({
        model: this.options.model,
        messages,
        stream: true,
        temperature: 0.4,
// Nemotron reasons internally — low max_tokens leaves empty answer (NVIDIA uses 16384).
        max_tokens: 16384,
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      logger.error({ status: res.status, body }, "NVIDIA API request failed");
      throw new ProviderError("The AI model is temporarily unavailable.", res.status, this.name);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const parsed = JSON.parse(payload);
          const delta: string | undefined = parsed.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // Skip bad SSE frames instead of aborting stream.
        }
      }
    }
  }
}
