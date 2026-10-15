"use client";

import * as React from "react";
import { Maximize2, Minimize2, Sparkles } from "lucide-react";
import { IconButton, Sheet, SheetContent, SheetTitle, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import type { Profile } from "@portfolio/types";
import { ChatView } from "./chat-view";

export function ChatSidePanel({
  profile,
  open,
  onOpenChange,
}: {
  profile: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = React.useState(false);

  // Always reopen collapsed - expand is a per-session choice, not a sticky preference.
  React.useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  // The panel is already right-anchored (`right: 0`), so growing only `width`
  // pushes the left edge out to fill the screen - `left` resolves on its own,
  // no need to touch it. This also keeps both ends of the transition as
  // concrete lengths (vw-based, never "auto"), so it animates smoothly.
  const expandedStyle = expanded ? { width: "100vw" } : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent style={expandedStyle}>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 pr-12">
          <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
          <SheetTitle>Ask AI</SheetTitle>
          <Tooltip>
            <TooltipTrigger asChild>
              <IconButton
                aria-label={expanded ? "Collapse panel" : "Expand panel"}
                className="ml-auto"
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </IconButton>
            </TooltipTrigger>
            <TooltipContent>{expanded ? "Collapse" : "Expand"}</TooltipContent>
          </Tooltip>
        </header>
        <div className="min-h-0 flex-1">
          <ChatView profile={profile} variant="panel" expanded={expanded} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
