"use client";

import * as React from "react";
import { Command } from "cmdk";
import { cn } from "../lib/cn";

export interface CommandPaletteItem {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
}

export interface CommandPaletteGroup {
  heading: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandPaletteGroup[];
  placeholder?: string;
}

/** Cmd/Ctrl+K launcher. Callers own the keybinding; this only renders the dialog. */
export function CommandPalette({ open, onOpenChange, groups, placeholder = "Search portfolio…" }: CommandPaletteProps) {
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Command palette"
      className={cn(
        "fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border border-border",
        "bg-overlay shadow-overlay animate-slide-up",
      )}
      shouldFilter
    >
      <div className="border-b border-border/70 px-4 py-3">
        <Command.Input
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none"
        />
      </div>
      <Command.List className="no-scrollbar max-h-80 overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-foreground-subtle">No results found.</Command.Empty>
        {groups.map((group) => (
          <Command.Group
            key={group.heading}
            heading={group.heading}
            className="px-1 py-1 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
          >
            {group.items.map((item) => (
              <Command.Item
                key={item.id}
                onSelect={() => {
                  item.onSelect();
                  onOpenChange(false);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2.5 py-2 text-sm text-foreground-muted",
                  "aria-selected:bg-accent-soft aria-selected:text-accent",
                )}
              >
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-3.5 w-3.5" />}
                  {item.label}
                </span>
                {item.hint && <span className="text-xs text-foreground-subtle">{item.hint}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
