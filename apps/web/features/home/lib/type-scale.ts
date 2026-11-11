/**
 * Five sizes do the work across the whole page (house law: "five sizes on a
 * page is the ceiling") — shared as classnames so every section's register
 * renders identically.
 */
export const TEXT_DISPLAY = "text-[clamp(2.75rem,12.8vw,15rem)]";
export const TEXT_HEADING = "text-[clamp(2.5rem,1.4rem+4.6vw,5.5rem)]";
export const TEXT_LEAD = "text-[clamp(1.25rem,1rem+0.9vw,1.875rem)]";
export const TEXT_BODY = "text-[clamp(1.0625rem,1rem+0.25vw,1.1875rem)]";
export const TEXT_SMALL = "text-[clamp(0.875rem,0.85rem+0.1vw,0.9375rem)]";

/** Display register: condensed, heavy, uppercase — Archivo pushed to its narrowest, heaviest setting. */
export const DISPLAY_FACE = "uppercase font-extrabold leading-[0.86] tracking-[-0.01em] [font-stretch:62%]";

/** One grid, one pair of margins, used by every section. */
export const CONTAINER = "mx-auto w-full max-w-[1600px] px-5 sm:px-10";

/** The gap between sections — clearly larger than any gap inside one. */
export const SECTION_SPACE = "py-24 md:py-36";

/** The page's one easing curve for entrances. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
