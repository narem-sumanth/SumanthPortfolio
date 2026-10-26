"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import type { Profile } from "@portfolio/types";
import { useChat } from "../lib/use-chat";
import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";
import { SuggestedQuestions } from "./suggested-questions";

const STARTER_QUESTIONS = [
  "What's your experience?",
  "Show your best projects",
  "What are your DevOps skills?",
  "Why should I hire you?",
];

export function ChatView({
  profile,
  compact = false,
}: {
  profile: Profile | null;
  compact?: boolean;
}) {
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
    return <div className="h-full" />;
  }

  if (!hasStarted) {
    if (compact) {
      return (
        <div className="flex flex-1 flex-col gap-5 px-5 py-6">
          {/* Compact empty state for side panel */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              <p className="text-sm font-semibold text-foreground">
                Ask me anything about {firstName}
              </p>
            </div>
            <p className="text-[13px] text-foreground-muted leading-relaxed">
              Projects, skills, experience, availability — grounded in verified portfolio data.
            </p>
          </div>

          <SuggestedQuestions questions={STARTER_QUESTIONS} onSelect={fillDraft} />

          <div className="mt-auto pt-4">
            <ChatInput
              ref={inputRef}
              value={draft}
              onValueChange={setDraft}
              onSend={sendMessage}
              sources={sources}
              onToggleSource={toggleSource}
              autoFocus
              placeholder="Ask me anything…"
              className="w-full"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex w-full flex-col items-center justify-center px-6 py-20 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-brutal bg-base px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-foreground-subtle">
            {profile?.availability ?? "AI Portfolio"}
          </span>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-foreground font-display leading-[1.05]">
            Talk to {firstName}&rsquo;s AI twin
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed">
            Ask anything about {profile?.name ?? "my"} work, projects, skills, or background, grounded in verified
            portfolio data, never invented.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <ChatInput
            ref={inputRef}
            value={draft}
            onValueChange={setDraft}
            onSend={sendMessage}
            sources={sources}
            onToggleSource={toggleSource}
            autoFocus
            placeholder="Ask me anything…"
            className="w-full sm:w-[520px]"
          />
          <div className="flex flex-col items-center gap-2 sm:ml-6">
            <SuggestedQuestions questions={STARTER_QUESTIONS} onSelect={fillDraft} centered />
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex flex-1 flex-col gap-0">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <ChatMessageList messages={messages} activity={activity} onSuggestionSelect={fillDraft} onClearChat={handleClear} />
        </div>
        <div className="shrink-0 border-t border-border bg-base/80 px-4 py-3 backdrop-blur-md">
          <ChatInput
            ref={inputRef}
            value={draft}
            onValueChange={setDraft}
            onSend={sendMessage}
            sources={sources}
            onToggleSource={toggleSource}
            disabled={isStreaming}
            placeholder="Ask a follow-up…"
            className="w-full"
          />
          <p className="mt-2 text-center text-[10px] text-foreground-subtle">
            Grounded in verified portfolio data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-6 py-6">
          <ChatMessageList messages={messages} activity={activity} onSuggestionSelect={fillDraft} onClearChat={handleClear} />
        </div>
      </div>

      <div className="sticky bottom-0 z-30 flex w-full shrink-0 justify-center bg-base/80 backdrop-blur-md border-t border-border-brutal">
        <div className="w-full px-6 py-4">
          <ChatInput
            ref={inputRef}
            value={draft}
            onValueChange={setDraft}
            onSend={sendMessage}
            sources={sources}
            onToggleSource={toggleSource}
            disabled={isStreaming}
            placeholder="Ask a follow-up…"
            className="w-full sm:w-[640px]"
          />
          <p className="mt-2 text-center text-[11px] text-foreground-subtle">
            Answers are grounded in verified portfolio data. Sumanth&rsquo;s AI will say so when it doesn&rsquo;t know.
          </p>
        </div>
      </div>
    </div>
  );
}
