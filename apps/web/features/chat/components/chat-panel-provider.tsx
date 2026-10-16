"use client";

import * as React from "react";
import type { Profile } from "@portfolio/types";
import { track } from "@/features/shell";
import { ChatFab } from "./chat-fab";
import { ChatSidePanel } from "./chat-side-panel";

interface ChatPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  /** Opens the panel and sends `question` as the first message — the hero's live control uses this. */
  ask: (question: string) => void;
}

const ChatPanelContext = React.createContext<ChatPanelContextValue | null>(null);

export function useChatPanel() {
  const ctx = React.useContext(ChatPanelContext);
  if (!ctx) throw new Error("useChatPanel must be used within a ChatPanelProvider");
  return ctx;
}

/** Hosts the AI chat as a slide-over panel (full-screen on mobile) instead of a separate route. */
export function ChatPanelProvider({ profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pendingMessage, setPendingMessage] = React.useState<string | null>(null);

  const value = React.useMemo<ChatPanelContextValue>(
    () => ({
      isOpen,
      open: () => {
        track("ai_panel_opened");
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
      ask: (question: string) => {
        track("ai_panel_opened");
        setPendingMessage(question);
        setIsOpen(true);
      },
    }),
    [isOpen],
  );

  return (
    <ChatPanelContext.Provider value={value}>
      {children}
      {!isOpen && <ChatFab onClick={value.open} />}
      <ChatSidePanel
        profile={profile}
        open={isOpen}
        onOpenChange={setIsOpen}
        initialMessage={pendingMessage}
        onConsumeInitialMessage={() => setPendingMessage(null)}
      />
    </ChatPanelContext.Provider>
  );
}
