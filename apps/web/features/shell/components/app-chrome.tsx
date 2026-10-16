"use client";

import * as React from "react";
import type { Profile } from "@portfolio/types";
import { ChatPanelProvider } from "@/features/chat";
import { CommandPaletteProvider } from "./command-palette-provider";

/**
 * No persistent nav bar by design — the hero carries its own wordmark and the
 * one theme-toggle link (see features/home/components/hero.tsx). A sticky
 * glass header is exactly the "designed-to-look-designed" chrome this redesign
 * removes.
 */
export function AppChrome({ profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  return (
    <ChatPanelProvider profile={profile}>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col">{children}</main>
        <CommandPaletteProvider profile={profile} />
      </div>
    </ChatPanelProvider>
  );
}
