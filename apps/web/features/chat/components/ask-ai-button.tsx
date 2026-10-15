"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@portfolio/ui";
import { useChatPanel } from "./chat-panel-provider";

export function AskAiButton({ className }: { className?: string }) {
  const { open } = useChatPanel();
  return (
    <Button size="sm" className={className} onClick={open}>
      <Sparkles className="h-4 w-4" /> Ask AI
    </Button>
  );
}
