import * as React from "react";
import { Github, FileText, Globe, ScrollText } from "lucide-react";
import type { SourceReference } from "@portfolio/types";
import { cn } from "../lib/cn";

const ICONS: Record<SourceReference["kind"], React.ComponentType<{ className?: string }>> = {
  github: Github,
  portfolio: FileText,
  web: Globe,
  resume: ScrollText,
};

export function SourceChip({ source, className }: { source: SourceReference; className?: string }) {
  const Icon = ICONS[source.kind];
  const content = (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs text-foreground-muted transition-colors",
        source.url && "hover:border-border-strong hover:text-foreground",
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {source.label}
    </span>
  );

  if (!source.url) return content;

  return (
    <a href={source.url} target="_blank" rel="noreferrer noopener" aria-label={`Source: ${source.label}`}>
      {content}
    </a>
  );
}

export function SourceList({ sources }: { sources: SourceReference[] }) {
  if (sources.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3">
      <span className="text-[11px] font-medium uppercase tracking-wide text-foreground-subtle">Sources</span>
      {sources.map((source) => (
        <SourceChip key={source.id} source={source} />
      ))}
    </div>
  );
}
