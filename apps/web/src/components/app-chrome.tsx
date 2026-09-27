"use client";

import * as React from "react";
import Link from "next/link";
import type { Profile } from "@portfolio/types";
import { ModeSwitcher } from "./mode-switcher";
import { ThemeToggle } from "./theme-toggle";
import { CommandPaletteProvider } from "./command-palette-provider";

export function AppChrome({ profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
            {profile?.name.split(" ")[0] ?? "Sumanth"} <span className="text-foreground-subtle">AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <ModeSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
      <CommandPaletteProvider profile={profile} />
    </div>
  );
}
