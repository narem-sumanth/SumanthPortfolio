"use client";

import * as React from "react";
import { FileText, Github, Plus, Check } from "lucide-react";
import type { ChatSourceOption } from "@portfolio/types";
import { IconButton, Popover, PopoverContent, PopoverTrigger, cn } from "@portfolio/ui";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

const SOURCE_OPTIONS: { id: ChatSourceOption; label: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean }[] = [
  { id: "portfolio", label: "My Portfolio", icon: FileText },
  { id: "github", label: "GitHub", icon: Github },
  { id: "google", label: "Google", icon: GoogleIcon, disabled: true },
];

export interface SourcePickerProps {
  selected: ChatSourceOption[];
  onToggle: (id: ChatSourceOption) => void;
}

/** Lets a visitor choose which sources the AI should ground its answer in. */
export function SourcePicker({ selected, onToggle }: SourcePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <IconButton
          aria-label="Choose sources"
          variant="ghost"
          className="h-8 w-8 rounded-md bg-inset text-foreground-muted shadow-[0_1px_4px_1px_rgb(var(--shadow-color)/0.05)] not-disabled:hover:bg-border/60 not-disabled:hover:shadow-button"
        >
          <Plus className="h-4 w-4" />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56">
        <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">
          Answer using
        </p>
        {SOURCE_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              disabled={option.disabled}
              onClick={() => onToggle(option.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm text-foreground-muted transition-colors",
                !option.disabled && "cursor-pointer hover:bg-elevated",
                isSelected && "text-foreground",
                option.disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <option.icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">{option.label}</span>
              {option.disabled ? (
                <span className="text-[10px] font-medium uppercase tracking-wide text-foreground-subtle">Soon</span>
              ) : (
                isSelected && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />
              )}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
