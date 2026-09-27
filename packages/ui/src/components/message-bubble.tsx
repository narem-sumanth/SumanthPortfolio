import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { SourceReference } from "@portfolio/types";
import { cn } from "../lib/cn";
import { SourceList } from "./source-chip";

export interface MessageBubbleProps {
  role: "user" | "assistant";
  children: string;
  sources?: SourceReference[];
  className?: string;
  /** True when this is a pipeline/network failure message, not a real answer - rendered distinctly so it never reads as the AI's actual response. */
  errored?: boolean;
}

const MARKDOWN_CLASSES =
  "[&_p]:mb-3 [&_p:last-child]:mb-0 " +
  "[&_a]:underline [&_a]:decoration-accent/50 [&_a]:underline-offset-2 " +
  "[&_strong]:font-semibold " +
  "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 " +
  "[&_:is(h1,h2,h3,h4,h5,h6)]:mb-1.5 [&_:is(h1,h2,h3,h4,h5,h6)]:mt-3 [&_:is(h1,h2,h3,h4,h5,h6)]:font-semibold " +
  "[&_:is(h1,h2,h3,h4,h5,h6)]:first:mt-0 " +
  "[&_code]:rounded [&_code]:bg-inset [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[13px] " +
  "[&_pre]:mb-3 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-inset [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:text-foreground-muted " +
  "[&_hr]:my-3 [&_hr]:border-border " +
  "[&_table]:w-full [&_table]:text-left [&_th]:border-b [&_th]:border-border [&_th]:pb-1 [&_th]:pr-3 " +
  "[&_td]:border-b [&_td]:border-border/50 [&_td]:py-1 [&_td]:pr-3";

/** Flat message bubbles — told apart by fill and alignment, never a shadow. Each carries a small
 * tail toward its sender: the corner it emerges from is squared off (not rounded), and the tail
 * is an SVG triangle sharing that exact corner point and the bubble's bottom edge, so it reads as
 * one continuous shape instead of a separate notch. The assistant bubble's fill (bg-elevated) is
 * the same white as the page background in light mode - only its border makes it visible at all -
 * so its tail needs a real stroke too, which a clip-path div can't provide (a border on the
 * pre-clip box never reaches the newly cut edge); an SVG polygon can. Of the triangle's three
 * edges, only two are ever part of the combined silhouette's outline - the diagonal (the visible
 * tail edge) and the one running along the bubble's own bottom edge (nothing else draws a border
 * there) - the third edge runs along the bubble's side border, which already draws it, so stroking
 * it too would double up into a visible seam. A separate unfilled <path> draws just those two. */
export function MessageBubble({ role, children, sources, className, errored }: MessageBubbleProps) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}>
      <div
        className={cn(
          "relative rounded-lg px-4 py-3 text-sm leading-relaxed animate-slide-up",
          isUser
            ? "max-w-[85%] sm:max-w-[75%] rounded-br-none bg-accent-soft text-foreground"
            : errored
              ? "w-full rounded-bl-none border border-danger/30 bg-danger/10 text-foreground"
              : "w-full rounded-bl-none border border-border bg-elevated text-foreground",
        )}
      >
        <svg aria-hidden viewBox="0 0 10 10" className={cn("absolute bottom-0 h-2.5 w-2.5 overflow-visible", isUser ? "-right-2.5" : "-left-2.5")}>
          <polygon
            points={isUser ? "0,0 10,10 0,10" : "10,0 10,10 0,10"}
            className={isUser ? "fill-accent-soft" : errored ? "fill-danger/10" : "fill-elevated"}
          />
          {!isUser && (
            <path d="M 10 0 L 0 10 L 10 10" fill="none" strokeWidth={1} className={errored ? "stroke-danger/30" : "stroke-border"} />
          )}
        </svg>
        {errored && <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-danger">Something went wrong</p>}
        <div className={MARKDOWN_CLASSES}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
        </div>
        {!isUser && sources && <SourceList sources={sources} />}
      </div>
    </div>
  );
}
