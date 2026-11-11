"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@portfolio/ui";

export function ChatFab({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      size="icon"
      variant="primary"
      aria-label="Open AI chat"
      onClick={onClick}
      // ring-base: the button floats over both the green and the white sections, and its fill is
      // white — the green ring keeps it visible on white, and disappears into the green elsewhere.
      className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-floating ring-2 ring-base transition-transform duration-300 ease-out hover:scale-105 hover:shadow-overlay"
    >
      <Sparkles className="h-5 w-5" />
    </Button>
  );
}
