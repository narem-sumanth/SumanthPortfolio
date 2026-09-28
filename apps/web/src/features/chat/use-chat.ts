"use client";

import * as React from "react";
import type { ChatAction, ChatSourceOption, ChatStreamEvent, SourceReference } from "@portfolio/types";
import type { ActivityStep } from "@portfolio/ui";
import { apiClient } from "@/lib/apiClient";
import { track } from "@/lib/analytics";
import { clearChatHistory, loadChatHistory, saveChatHistory } from "@/lib/chatStorage";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceReference[];
  actions?: ChatAction[];
  suggestions?: string[];
  /** The real pipeline steps taken to produce this message, preserved after streaming ends. */
  steps?: ActivityStep[];
  streaming?: boolean;
  errored?: boolean;
}

function uid() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

const DEFAULT_SOURCES: ChatSourceOption[] = ["portfolio", "github"];

export function useChat() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [activity, setActivity] = React.useState<ActivityStep[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(true);
  // ChatInput rendered in multiple views — source selection must live in hook to persist.
  const [sources, setSources] = React.useState<ChatSourceOption[]>(DEFAULT_SOURCES);
  const abortRef = React.useRef<(() => void) | null>(null);
  const hasStartedRef = React.useRef(false);

  const toggleSource = React.useCallback((id: ChatSourceOption) => {
    setSources((prev) => {
      if (!prev.includes(id)) return [...prev, id];
      // At least one source must always stay selected.
      if (prev.length === 1) return prev;
      return prev.filter((s) => s !== id);
    });
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    loadChatHistory<ChatMessage[]>().then((stored) => {
      if (cancelled) return;
      if (stored && stored.length > 0) {
        setMessages(stored);
        hasStartedRef.current = true;
      }
      setIsRestoring(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (isRestoring || isStreaming || messages.length === 0) return;
    saveChatHistory(messages);
  }, [messages, isStreaming, isRestoring]);

  const sendMessage = React.useCallback(
    (rawText: string) => {
      const text = rawText.trim();
      if (!text || isStreaming) return;

      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        track("chat_started");
      }
      track("question_submitted", { length: text.length });

// Bounded to recent window — backend only uses last 6 turns; avoids schema cap.
      const history = messages.slice(-12).map((m) => ({ role: m.role, content: m.content }));
      const userMessage: ChatMessage = { id: uid(), role: "user", content: text };
      const assistantId = uid();

      setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "", streaming: true }]);
      setActivity([]);
      setIsStreaming(true);

      const stepLabels: string[] = [];

      abortRef.current = apiClient.streamChat({ message: text, history, sources }, (event: ChatStreamEvent) => {
        if (event.type === "status") {
          stepLabels.push(event.label);
          setActivity(stepLabels.map((label, i) => ({ label, status: i === stepLabels.length - 1 ? "active" : "done" })));
        } else if (event.type === "token") {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + event.value } : m)));
        } else if (event.type === "done") {
          const finalSteps: ActivityStep[] = stepLabels.map((label) => ({ label, status: "done" }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content: event.data.answer,
                    sources: event.data.sources,
                    actions: event.data.actions,
                    suggestions: event.data.suggestions,
                    steps: finalSteps,
                    streaming: false,
                  }
                : m,
            ),
          );
          setIsStreaming(false);
          setActivity([]);
        } else if (event.type === "error") {
          const finalSteps: ActivityStep[] = stepLabels.map((label) => ({ label, status: "done" }));
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? { ...m, content: event.message, steps: finalSteps, streaming: false, errored: true }
                : m,
            ),
          );
          setIsStreaming(false);
          setActivity([]);
        }
      });
    },
    [messages, isStreaming, sources],
  );

  const clearChat = React.useCallback(() => {
    abortRef.current?.();
    setMessages([]);
    setActivity([]);
    setIsStreaming(false);
    hasStartedRef.current = false;
    clearChatHistory();
  }, []);

  React.useEffect(() => () => abortRef.current?.(), []);

  return { messages, activity, isStreaming, isRestoring, sources, toggleSource, sendMessage, clearChat };
}
