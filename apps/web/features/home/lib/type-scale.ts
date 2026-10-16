/**
 * Five sizes do the work across the whole page (house law: "five sizes on a
 * page is the ceiling"). The dealt Archivo type system's own clamp formulas —
 * shared as classnames so every section's register renders identically.
 */
export const TEXT_DISPLAY = "text-[clamp(2.5rem,1.2rem+5vw,5.5rem)]";
export const TEXT_HEADING = "text-[26px]";
export const TEXT_LEAD = "text-[clamp(1.25rem,1.1rem+0.7vw,1.625rem)]";
export const TEXT_BODY = "text-[clamp(1.0625rem,1rem+0.25vw,1.1875rem)]";
export const TEXT_SMALL = "text-[clamp(0.8125rem,0.79rem+0.1vw,0.875rem)]";

/** Display register: condensed, heavy, uppercase — Archivo pushed to its narrowest, heaviest setting. Used by Skills' poster lines. */
export const DISPLAY_FACE = "uppercase font-extrabold leading-[0.86] tracking-[-0.01em] [font-stretch:62%]";

/** Headline register: normal width, sentence case, confident weight — the rest of the page's one display moment. */
export const HEADLINE_FACE = "font-bold leading-[1.08] tracking-[-0.02em]";

/** Sized for a short, sentence-case, multi-word headline (Hero, Contact) — distinct from Skills' single-word poster size. */
export const TEXT_PAGE_HEADLINE = "text-[clamp(2.25rem,1.1rem+4.5vw,4.5rem)]";
