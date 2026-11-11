#!/usr/bin/env node
/**
 * Generates the Open Graph / Twitter share image (1200x630 PNG).
 *
 * Content comes from data/profile/profile.json (name, role, tagline) and is never
 * hardcoded here. Rendering uses `next/og` (Satori + resvg), which ships with Next.js,
 * so this adds no dependencies.
 *
 * Usage (from repo root):
 *   pnpm og:image                         -> apps/web/public/og-image.png
 *   pnpm og:image -- --out path/to/x.png  -> custom output path
 *   pnpm og:image -- --font path/to.ttf   -> custom font (TTF/OTF; WOFF2 is not supported)
 */
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WEB = resolve(ROOT, "apps/web");

// Resolve next/react from the web app so this script runs from anywhere in the repo.
const requireFromWeb = createRequire(resolve(WEB, "package.json"));
const { ImageResponse } = requireFromWeb("next/og");
const { createElement: h } = requireFromWeb("react");

function arg(flag) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : undefined;
}

const outPath = resolve(process.cwd(), arg("--out") ?? resolve(WEB, "public/og-image.png"));
const fontPath = arg("--font");

// Dark-theme tokens from packages/design-system/tokens.css
const C = {
  bg: "rgb(4 12 8)", // surface-inset: darker than the page base so the card reads deep
  glow: "rgb(7 18 13)", // surface-base, used only for the subtle top-right glow
  raised: "rgb(19 36 27)",
  border: "rgb(34 58 44)",
  fg: "rgb(255 255 255)",
  muted: "rgb(196 208 200)",
  subtle: "rgb(138 156 145)",
  success: "rgb(110 186 120)",
};

const profile = JSON.parse(await readFile(resolve(ROOT, "data/profile/profile.json"), "utf8"));
const name = profile.name;
const role = profile.role ?? "Software Developer & DevOps Engineer";
const tagline = profile.tagline ?? "";
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "").replace(/\/$/, "");
const github = profile.socials?.find((s) => s.icon === "github")?.url?.replace(/^https?:\/\//, "");

const chips = ["Next.js", "Django", "FastAPI", "Docker", "Kubernetes", "AWS", "CI/CD"];

const chip = (label) =>
  h(
    "div",
    {
      key: label,
      style: {
        display: "flex",
        padding: "8px 18px",
        borderRadius: 999,
        border: `1px solid ${C.border}`,
        background: C.raised,
        color: C.muted,
        fontSize: 22,
      },
    },
    label,
  );

const tree = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "72px 80px",
      background: C.bg,
      backgroundImage: `radial-gradient(circle at 85% 15%, ${C.glow} 0%, ${C.bg} 55%)`,
      color: C.fg,
      fontFamily: "OG",
    },
  },
  // Top: terminal-style prompt + site URL
  h(
    "div",
    { style: { display: "flex", justifyContent: "space-between", alignItems: "center", color: C.subtle, fontSize: 24 } },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 14 } },
      h("div", { style: { width: 14, height: 14, borderRadius: 999, background: C.success } }),
      h("div", { style: { display: "flex" } }, "$ kubectl get engineer --output=portfolio"),
    ),
    h("div", { style: { display: "flex", whiteSpace: "nowrap" } }, site || github || ""),
  ),
  // Middle: name, role, tagline
  h(
    "div",
    { style: { display: "flex", flexDirection: "column", gap: 18 } },
    h("div", { style: { display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -3, lineHeight: 1 } }, name),
    h("div", { style: { display: "flex", fontSize: 38, color: C.muted } }, role),
    tagline
      ? h("div", { style: { display: "flex", fontSize: 30, color: C.success, marginTop: 6 } }, tagline)
      : null,
  ),
  // Bottom: stack chips
  h("div", { style: { display: "flex", flexWrap: "wrap", gap: 12 } }, ...chips.map(chip)),
);

const fonts = fontPath
  ? [{ name: "OG", data: await readFile(resolve(process.cwd(), fontPath)), weight: 400, style: "normal" }]
  : undefined; // falls back to the Geist font bundled with next/og

const res = new ImageResponse(tree, { width: 1200, height: 630, ...(fonts ? { fonts } : {}) });
const png = Buffer.from(await res.arrayBuffer());

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, png);
console.log(`✓ OG image written to ${outPath} (${(png.length / 1024).toFixed(1)} KB)`);
