/**
 * Programmatic access to design tokens for non-CSS contexts (e.g. computing
 * chart colors, or sharing values with the FastAPI docs generator). The CSS
 * custom properties in tokens.css remain the source of truth for rendering.
 */
export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
} as const;

export const surfaceLevels = ["base", "elevated", "raised", "inset", "floating", "overlay"] as const;
export type SurfaceLevel = (typeof surfaceLevels)[number];
