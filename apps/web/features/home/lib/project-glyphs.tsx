/**
 * Small flat line glyphs, drawn for these three projects in place of product
 * screenshots that don't exist (SKILL.md imagery order, step 4: "drawn in code
 * from the subject itself, for what no honest picture exists of"). One
 * consistent graphic language: single stroke, currentColor, no fill.
 */
import type { ComponentType } from "react";
import type { Project } from "@portfolio/types";

const STROKE = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** RAG / retrieval: a small graph of linked nodes. */
function GraphGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...STROKE}>
        <circle cx="12" cy="14" r="3.2" />
        <circle cx="36" cy="12" r="3.2" />
        <circle cx="14" cy="34" r="3.2" />
        <circle cx="34" cy="32" r="3.2" />
        <circle cx="24" cy="23" r="3.6" />
        <path d="M14.8 16.2 21 21M33.3 13.6 26.6 21M16.6 31.8 21.8 25.6M31.4 29.8 26.4 25.4" />
      </g>
    </svg>
  );
}

/** Clinical risk triage: a heartbeat line. */
function PulseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path {...STROKE} d="M4 24h9l4-12 7 20 5-14 3 6h12" />
    </svg>
  );
}

/** Audio classification: a waveform. */
function WaveformGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <g {...STROKE}>
        <path d="M6 24v0" />
        <path d="M11 20v8M17 14v20M23 9v30M29 17v14M35 12v24M41 20v8" />
      </g>
    </svg>
  );
}

/** Generic fallback: a single open bracket pair — still software, no claim beyond that. */
function BracketGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path {...STROKE} d="M20 12 9 24l11 12M28 12l11 12-11 12" />
    </svg>
  );
}

const GLYPH_BY_ID: Record<string, ComponentType<{ className?: string }>> = {
  "proj-portfolio-ai": GraphGlyph,
  "proj-infant-health-risk": PulseGlyph,
  "proj-bird-species": WaveformGlyph,
};

export function ProjectGlyph({ project, className }: { project: Project; className?: string }) {
  const ById = GLYPH_BY_ID[project.id];
  if (ById) return <ById className={className} />;

  const topics = [...project.topics, ...project.technologies].map((t) => t.toLowerCase());
  if (topics.some((t) => t.includes("audio") || t.includes("sound"))) return <WaveformGlyph className={className} />;
  if (topics.some((t) => t.includes("health") || t.includes("medical"))) return <PulseGlyph className={className} />;
  if (topics.some((t) => t.includes("ai") || t.includes("ml") || t.includes("machine-learning") || t.includes("rag")))
    return <GraphGlyph className={className} />;
  return <BracketGlyph className={className} />;
}
