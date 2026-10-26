"use client";

import * as React from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import type { Profile } from "@portfolio/types";
import { ChatPanelProvider, ChatSidePanel, useChatPanel } from "@/features/chat";
import { ThemeToggle } from "./theme-toggle";
import { CommandPaletteProvider } from "./command-palette-provider";

const NAV_ITEMS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
] as const;

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function ChatFAB() {
  const { isOpen, open } = useChatPanel();
  if (isOpen) return null;
  return (
    <button
      onClick={open}
      aria-label="Open AI chat"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-accent px-5 py-3.5 text-accent-foreground shadow-[0_8px_24px_rgb(var(--accent)/0.4)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_36px_rgb(var(--accent)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      {/* Pulse ring */}
      <span
        className="absolute inset-0 rounded-full opacity-50 animate-pulse-ring"
        style={{ background: "rgb(var(--accent))" }}
        aria-hidden="true"
      />
      <Sparkles className="relative h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span className="relative text-sm font-semibold tracking-tight">Ask AI</span>
    </button>
  );
}

function AppNav({ profile }: { profile: Profile | null }) {
  const { open } = useChatPanel();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-base/90 shadow-[0_1px_0_rgb(var(--border))] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent backdrop-blur-none"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="#hero"
            onClick={(e) => { e.preventDefault(); scrollToSection("#hero"); }}
            className="group flex items-center gap-2 text-base font-bold tracking-tight text-foreground font-display"
          >
            <span className="relative flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 ring-1 ring-accent/25 transition-all group-hover:bg-accent/20">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            </span>
            <span>
              {profile?.name?.split(" ")[0] ?? "Sumanth"}
              <span className="text-foreground-subtle font-normal">.dev</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="relative text-sm font-medium text-foreground-muted transition-colors duration-150 hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={open}
              className="hidden lg:flex items-center gap-2 rounded-full border border-accent/30 bg-accent/8 px-4 py-2 text-sm font-medium text-accent transition-all duration-200 hover:border-accent/60 hover:bg-accent/15"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Ask AI
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted hover:bg-raised hover:text-foreground lg:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="border-t border-border bg-base/95 px-6 py-4 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => { scrollToSection(item.href); setMobileOpen(false); }}
                  className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-foreground-muted hover:bg-raised hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { open(); setMobileOpen(false); }}
                className="mt-2 flex items-center gap-2 rounded-md bg-accent/10 px-3 py-2.5 text-sm font-medium text-accent hover:bg-accent/20"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Ask my AI twin
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

export function AppChrome({ profile, children }: { profile: Profile | null; children: React.ReactNode }) {
  return (
    <ChatPanelProvider profile={profile}>
      <div className="flex min-h-screen flex-col">
        <AppNav profile={profile} />
        <main className="flex-1 flex flex-col">{children}</main>
        <ChatSidePanel profile={profile} />
        <ChatFAB />
        <CommandPaletteProvider profile={profile} />
      </div>
    </ChatPanelProvider>
  );
}
