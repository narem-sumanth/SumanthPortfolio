export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Abstraction over any OpenAI-compatible chat completion provider. Swapping
 * providers (NVIDIA today, anything else tomorrow) never touches the
 * retrieval pipeline or routes — only this interface's implementation.
 */
export interface LLMProvider {
  readonly name: string;
  streamCompletion(messages: LLMMessage[]): AsyncGenerator<string>;
}
