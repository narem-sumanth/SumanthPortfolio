"use client";

import * as React from "react";
import { X, Sparkles, Zap } from "lucide-react";
import type { Profile } from "@portfolio/types";
import { useChatPanel } from "./chat-panel-provider";
import { ChatView } from "./chat-view";

interface ChatSidePanelProps {
  profile: Profile | null;
}

export function ChatSidePanel({ profile }: ChatSidePanelProps) {
  const { isOpen, close } = useChatPanel();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const firstName = profile?.name?.split(" ")[0] ?? "Sumanth";

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label="AI Chat"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 flex h-full w-full flex-col border-l border-border bg-base sm:max-w-[480px]"
        style={{ animation: "slide-in-right 0.38s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-elevated/60 px-5 py-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 ring-1 ring-accent/30">
                <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-base bg-success"
                aria-hidden="true"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {firstName}&rsquo;s AI Twin
              </p>
              <p className="flex items-center gap-1.5 text-[11px] text-foreground-subtle">
                <Zap className="h-2.5 w-2.5 text-accent" aria-hidden="true" />
                NVIDIA Nemotron · always online
              </p>
            </div>
          </div>

          <button
            onClick={close}
            aria-label="Close chat"
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-raised hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable chat area */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          <ChatView profile={profile} compact />
        </div>
      </div>
    </div>
  );
}
