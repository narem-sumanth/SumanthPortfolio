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
      return error.statusCode !== undefined && this.fallbackStatusCodes.includes(error.statusCode);
    }
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("503") ||
        message.includes("service unavailable") ||
        message.includes("temporarily unavailable") ||
        message.includes("overloaded")
      );
    }
    return false;
  }
}