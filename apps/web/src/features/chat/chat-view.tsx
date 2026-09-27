"use client";

import * as React from "react";
import type { Profile } from "@portfolio/types";
import { useChat } from "./use-chat";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { SuggestedQuestions } from "./suggested-questions";

const STARTER_QUESTIONS = [
  "Tell me about your experience",
  "Show me your best projects",
  "What are your DevOps skills?",
  "What are you currently learning?",
  "Why should I hire you?",
  "How can I contact you?",
];

export function ChatView({ profile }: { profile: Profile | null }) {
  const { messages, activity, isStreaming, isRestoring, sources, toggleSource, sendMessage, clearChat } = useChat();
  const hasStarted = messages.length > 0;
  const firstName = profile?.name.split(" ")[0] ?? "my";
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  function handleClear() {
    if (window.confirm("Clear this conversation? This can't be undone.")) {
      clearChat();
    }
  }

  function fillDraft(question: string) {
    setDraft(question);
    inputRef.current?.focus();
  }

  if (isRestoring) {
    return <div className="min-h-[calc(100dvh-56px)]" />;
  }

  if (!hasStarted) {
    return (
      <div className="mx-auto flex min-h-[calc(100dvh-56px)] w-full max-w-3xl flex-col items-center justify-center px-4 sm:px-6">
        <div className="flex w-full flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="rounded-full border border-border bg-inset px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
              {profile?.availability ?? "AI Portfolio"}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Talk to {firstName}&rsquo;s AI twin</h1>
            <p className="max-w-md text-balance text-sm text-foreground-muted sm:text-base">
              Ask anything about {profile?.name ?? "my"} work, projects, skills, or background, grounded in verified
              portfolio data, never invented.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <ChatInput
              ref={inputRef}
              value={draft}
              onValueChange={setDraft}
              onSend={sendMessage}
              sources={sources}
              onToggleSource={toggleSource}
              autoFocus
              placeholder="Ask me anything…"
            />
            <div className="flex flex-col justify-center items-center gap-2">
              <SuggestedQuestions questions={STARTER_QUESTIONS} onSelect={fillDraft} centered />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-1 flex-col">
      <div className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 pt-4 sm:px-6">
          <ChatMessageList messages={messages} activity={activity} onSuggestionSelect={fillDraft} onClearChat={handleClear} />
        </div>
      </div>
      <div className="sticky bottom-0 z-30 flex w-full justify-center bg-base/95 backdrop-blur-md">
        <div className="w-full max-w-4xl px-4 pb-4 pt-3 sm:px-6 sm:pb-6">
          <ChatInput
            ref={inputRef}
            value={draft}
            onValueChange={setDraft}
            onSend={sendMessage}
            sources={sources}
            onToggleSource={toggleSource}
            disabled={isStreaming}
            placeholder="Ask a follow-up…"
          />
          <p className="mt-2 text-center text-[11px] text-foreground-subtle">
            Answers are grounded in verified portfolio data. Sumanth&rsquo;s AI will say so when it doesn&rsquo;t know.
          </p>
        </div>
      </div>
    </div>
  );
}
