"use client";

import * as React from "react";
import type { Profile } from "@portfolio/types";
import { track } from "@/features/shell";

interface ChatPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ChatPanelContext = React.createContext<ChatPanelContextValue | null>(null);

export function useChatPanel() {
  const ctx = React.useContext(ChatPanelContext);
  if (!ctx) throw new Error("useChatPanel must be used within a ChatPanelProvider");
  return ctx;
}

export function ChatPanelProvider({ profile: _profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const value = React.useMemo<ChatPanelContextValue>(
    () => ({
      isOpen,
      open: () => {
        track("ai_panel_opened");
        setIsOpen(true);
      },
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return <ChatPanelContext.Provider value={value}>{children}</ChatPanelContext.Provider>;
}