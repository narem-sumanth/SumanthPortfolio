import { logger } from "../../../utils/logger";
import type { LLMMessage, LLMProvider } from "./llm-provider";

export class ProviderError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly providerName?: string
  ) {
    super(message);
    this.name = "ProviderError";
  }
}

export class FallbackProvider implements LLMProvider {
  readonly name = "fallback";

  constructor(
    private readonly primary: LLMProvider,
    private readonly fallback: LLMProvider,
    private readonly fallbackStatusCodes: number[] = [503, 502, 504]
  ) {}

  async *streamCompletion(messages: LLMMessage[]): AsyncGenerator<string> {
    try {
      yield* this.streamWithProvider(this.primary, messages);
    } catch (error) {
      if (this.shouldFallback(error)) {
        logger.warn(
          { primary: this.primary.name, fallback: this.fallback.name, error: String(error) },
          "Primary provider failed, falling back to secondary provider"
        );
        yield* this.streamWithProvider(this.fallback, messages);
      } else {
        throw error;
      }
    }
  }

  private async *streamWithProvider(
    provider: LLMProvider,
    messages: LLMMessage[]
  ): AsyncGenerator<string> {
    for await (const chunk of provider.streamCompletion(messages)) {
      yield chunk;
    }
  }

  private shouldFallback(error: unknown): boolean {
    if (error instanceof ProviderError) {
      // 4xx client errors (bad key, quota, bad request) are permanent for the
      // primary provider but the MockProvider still works — always fall back.
      return true;
    }
    if (error instanceof Error) {
      // Network errors, timeouts, etc. — always fall back.
      return true;
    }
    return false;
  }
}