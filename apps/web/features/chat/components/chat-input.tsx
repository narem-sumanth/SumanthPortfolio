"use client";

import * as React from "react";
import { Send } from "lucide-react";
import type { ChatSourceOption } from "@portfolio/types";
import { Badge, Button, cn } from "@portfolio/ui";
import { SourcePicker } from "./source-picker";

export interface ChatInputProps {
  value: string;
  onValueChange: (value: string) => void;
  onSend: (text: string) => void;
  sources: ChatSourceOption[];
  onToggleSource: (id: ChatSourceOption) => void;
  disabled?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(function ChatInput(
  { value, onValueChange, onSend, sources, onToggleSource, disabled, autoFocus, placeholder = "Ask me anything…" },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLTextAreaElement>(null);
  React.useImperativeHandle(forwardedRef, () => innerRef.current as HTMLTextAreaElement);

  // Keeps the textarea's height in sync whether the value comes from typing
  // or is filled in externally (e.g. clicking a suggested question).
  React.useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value);
    onValueChange("");
  }

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border border-border bg-transparent p-4 shadow-floating transition duration-300 ease-out"
      )}
    >
      <textarea
        ref={innerRef}
        autoFocus={autoFocus}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={1}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        className="max-h-40 min-h-7 w-full resize-none bg-transparent px-1 py-1 text-[15px] text-foreground placeholder:text-foreground-subtle focus:outline-none disabled:opacity-50"
      />
      <div className="flex items-center justify-between w-full">
        <SourcePicker selected={sources} onToggle={onToggleSource} />
        <div className="flex items-center gap-3">
          <Badge className="h-8 text-foreground-subtle">
            NVIDIA Nemotron
          </Badge>
          <Button
            size="icon"
            onClick={submit}
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="h-8 w-8 rounded-md"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});
