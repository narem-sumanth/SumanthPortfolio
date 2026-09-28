import type { SourceReference } from "./domain";

/**
 * API contract shared by both backend implementations (Express, FastAPI).
 * The frontend must be able to talk to either without caring which is live.
 */

export interface HealthResponse {
  status: "ok";
  service: string;
  timestamp: string;
  commit?: string;
}

export interface ReadyResponse {
  status: "ready" | "degraded";
  checks: Record<string, boolean>;
}

export type ChatActionType = "open_url" | "show_contact_form";

export interface ChatAction {
  type: ChatActionType;
  label: string;
  payload?: Record<string, unknown>;
}

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

/** Sources a visitor can opt into grounding an answer with (see the chat input's source picker). */
export type ChatSourceOption = "portfolio" | "google" | "github";

export interface ChatRequest {
  message: string;
  history?: ChatMessageInput[];
  sources?: ChatSourceOption[];
}

/** Non-streaming shape of a completed chat turn (also the final SSE payload). */
export interface ChatResponse {
  answer: string;
  sources: SourceReference[];
  actions?: ChatAction[];
  /** Canned follow-up prompts the visitor can tap to continue the conversation. */
  suggestions?: string[];
}

export type ChatStreamEvent =
  | { type: "status"; label: string }
  | { type: "token"; value: string }
  | { type: "done"; data: ChatResponse }
  | { type: "error"; message: string };

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  /** Honeypot field — must stay empty. Real users never see or fill it in. */
  company?: string;
}

export interface ContactResponse {
  ok: true;
  id: string;
}

export interface ApiErrorResponse {
  ok: false;
  error: string;
}
