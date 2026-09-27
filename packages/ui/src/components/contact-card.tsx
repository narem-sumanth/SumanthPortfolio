"use client";

import * as React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Panel } from "./card";
import { Input, Textarea } from "./input";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface ContactCardValues {
  name: string;
  email: string;
  message: string;
  company: string;
}

export interface ContactCardProps {
  onSubmit: (values: ContactCardValues) => Promise<void> | void;
  className?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Inline contact form rendered by the AI chat when a visitor asks to get in touch. */
export function ContactCard({ onSubmit, className }: ContactCardProps) {
  const [values, setValues] = React.useState<ContactCardValues>({ name: "", email: "", message: "", company: "" });
  const [status, setStatus] = React.useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const emailValid = EMAIL_RE.test(values.email);
  const canSubmit = values.name.trim().length > 1 && emailValid && values.message.trim().length > 5;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "submitting") return;
    setStatus("submitting");
    setError(null);
    try {
      await onSubmit(values);
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <Panel surface="raised" padding="md" className={cn("flex items-center gap-3", className)}>
        <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Message sent.</p>
          <p className="text-foreground-muted">Thanks {values.name.split(" ")[0]}, I'll get back to you soon.</p>
        </div>
      </Panel>
    );
  }

  return (
    <Panel surface="raised" padding="md" className={className}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            aria-label="Your name"
            placeholder="Your name"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            required
          />
          <Input
            aria-label="Your email"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            required
          />
        </div>
        <Textarea
          aria-label="Your message"
          placeholder="What would you like to say?"
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          required
        />
        {/* Honeypot: hidden from real users, bots that fill every field trip this */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))}
          className="absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        <Button type="submit" disabled={!canSubmit || status === "submitting"} className="self-start">
          {status === "submitting" && <Loader2 className="h-4 w-4 animate-spin" />}
          Send message
        </Button>
      </form>
    </Panel>
  );
}
