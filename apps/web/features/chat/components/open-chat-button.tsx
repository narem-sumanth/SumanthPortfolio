"use client";

import { Sparkles } from "lucide-react";
import { useChatPanel } from "./chat-panel-provider";

interface OpenChatButtonProps {
  label?: string;
  className?: string;
}

export function OpenChatButton({
  label = "Talk to my AI twin",
  className = "",
}: OpenChatButtonProps) {
  const { open } = useChatPanel();
  return (
    <button
      onClick={open}
      className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-md bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_4px_16px_rgb(var(--accent)/0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgb(var(--accent)/0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${className}`}
    >
      <span className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/10" aria-hidden="true" />
      <Sparkles className="relative h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span className="relative">{label}</span>
    </button>
  );
}
