"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sparkles, LayoutGrid, Github, Moon } from "lucide-react";
import { CommandPalette, type CommandPaletteGroup } from "@portfolio/ui";
import type { Profile } from "@portfolio/types";
import { useChatPanel } from "@/features/chat";

/** Cmd/Ctrl+K launcher, wired to real navigation — no dead-end demo items. */
export function CommandPaletteProvider({ profile }: { profile: Profile | null }) {
  const [open, setOpen] = React.useState(false);
  const { open: openChat, close: closeChat } = useChatPanel();
  const { setTheme, resolvedTheme } = useTheme();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const githubUrl = profile?.socials.find((s) => s.icon === "github")?.url;

  const groups: CommandPaletteGroup[] = [
    {
      heading: "Navigate",
      items: [
        { id: "ask-ai", label: "Ask AI", icon: Sparkles, onSelect: openChat },
        { id: "portfolio", label: "View portfolio", icon: LayoutGrid, onSelect: closeChat },
      ],
    },
    {
      heading: "Actions",
      items: [
        ...(githubUrl
          ? [{ id: "github", label: "Open GitHub", icon: Github, onSelect: () => window.open(githubUrl, "_blank") }]
          : []),
        {
          id: "theme",
          label: "Toggle theme",
          icon: Moon,
          hint: resolvedTheme === "dark" ? "Dark" : "Light",
          onSelect: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
        },
      ],
    },
  ];

  return <CommandPalette open={open} onOpenChange={setOpen} groups={groups} />;
}
