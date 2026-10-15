"use client";

import * as React from "react";
import { Briefcase, Trash2 } from "lucide-react";
import { Button, ExperienceTimeline, MessageBubble, type ActivityStep } from "@portfolio/ui";
import type { ChatMessage } from "../lib/use-chat";
import { ContactFlow } from "./contact-flow";
import { LiveStepTicker } from "./live-step-ticker";
import { StepsDisclosure } from "./steps-disclosure";
import { SuggestedQuestions } from "./suggested-questions";

export interface ChatMessageListProps {
  messages: ChatMessage[];
  activity: ActivityStep[];
  onSuggestionSelect: (question: string) => void;
  onClearChat: () => void;
}

export function ChatMessageList({ messages, activity, onSuggestionSelect, onClearChat }: ChatMessageListProps) {
  const endRef = React.useRef<HTMLDivElement>(null);
  const hasScrolledOnceRef = React.useRef(false);

  React.useEffect(() => {
    // First paint (e.g. restoring history on panel open) should land at the
    // bottom instantly — only scroll-animate for messages that arrive after.
    endRef.current?.scrollIntoView({ behavior: hasScrolledOnceRef.current ? "smooth" : "auto", block: "end" });
    hasScrolledOnceRef.current = true;
  }, [messages, activity]);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message, index) => {
        const isLast = index === messages.length - 1;
        const showActivity = message.role === "assistant" && message.streaming && message.content === "" && isLast;
        const showsContactForm = message.actions?.some((a) => a.type === "show_contact_form");
        const showFooterRow = isLast && message.role === "assistant" && !message.streaming;

        return (
          <div key={message.id} className="flex flex-col gap-2">
            {showActivity ? (
              <StepsDisclosure steps={activity} label={<LiveStepTicker steps={activity} />} />
            ) : (
              <>
                {message.role === "assistant" && message.steps && message.steps.length > 0 && (
                  <StepsDisclosure
                    steps={message.steps}
                    label={`Worked through ${message.steps.length} step${message.steps.length === 1 ? "" : "s"}`}
                  />
                )}
                <MessageBubble
                  role={message.role}
                  sources={message.sources}
                  errored={message.errored}
                  widget={
                    message.widget?.type === "experience_timeline" ? (
                      <div className="flex flex-col gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
                          <Briefcase className="h-3 w-3" /> Experience
                        </span>
                        <ExperienceTimeline entries={message.widget.entries} compact />
                      </div>
                    ) : undefined
                  }
                >
                  {message.content}
                </MessageBubble>
              </>
            )}
            {showsContactForm && <ContactFlow />}
            {showFooterRow && (
              <div className="flex flex-wrap items-center gap-2">
                <SuggestedQuestions questions={message.suggestions ?? []} onSelect={onSuggestionSelect} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearChat}
                  className="ml-auto shrink-0 text-foreground-subtle not-disabled:hover:bg-danger/10 not-disabled:hover:text-danger"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear chat
                </Button>
              </div>
            )}
          </div>
        );
      })}
      <div ref={endRef} className="scroll-mb-40 sm:scroll-mb-44" />
    </div>
  );
}
