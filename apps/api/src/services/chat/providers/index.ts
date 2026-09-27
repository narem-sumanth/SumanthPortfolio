import { env } from "../../../config/env";
import { logger } from "../../../utils/logger";
import type { LLMProvider } from "./llm-provider";
import { MockProvider } from "./mock.provider";
import { NvidiaProvider } from "./nvidia.provider";
import { FallbackProvider } from "./fallback.provider";

function createLlmProvider(): LLMProvider {
  if (env.NVIDIA_API_KEY) {
    const primary = new NvidiaProvider({
      apiKey: env.NVIDIA_API_KEY,
      baseUrl: env.NVIDIA_BASE_URL,
      model: env.NVIDIA_MODEL,
    });
    logger.info({ model: env.NVIDIA_MODEL }, "Using NvidiaProvider with MockProvider fallback for chat completions");
    return new FallbackProvider(primary, new MockProvider());
  }
  logger.warn("NVIDIA_API_KEY not set — using MockProvider. Add a key to .env for real AI responses.");
  return new MockProvider();
}

export const llmProvider = createLlmProvider();
export * from "./llm-provider";
export * from "./fallback.provider";
