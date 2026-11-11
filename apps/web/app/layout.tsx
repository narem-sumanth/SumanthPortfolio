import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { TooltipProvider } from "@portfolio/ui";
import { AppChrome, ThemeProvider, ApiProvider } from "@/features/shell";
import { getMetadata } from "@/app/metadata";
import { getProfileSafe } from "@/features/portfolio";
import "./globals.css";

// Variable font (weight omitted on purpose — loads the full wght range) with
// the extra `wdth` axis, so display type can be set at a condensed stretch
// via `font-stretch` while body text stays at its normal width.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

// Profile data lives in a separately-deployed API, not this app's build —
// static prerendering would freeze it (or bake in the safe-fallback null
// forever if the API isn't reachable at build time). Fetch it per-request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getMetadata();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfileSafe();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark ${archivo.variable}`}
      style={{ backgroundColor: "rgb(7,18,13)" }}
    >
      <body>
        <ApiProvider baseUrl={process.env.API_URL ?? ""}>
          <ThemeProvider>
            <TooltipProvider delayDuration={200}>
              <AppChrome profile={profile}>{children}</AppChrome>
            </TooltipProvider>
          </ThemeProvider>
        </ApiProvider>
      </body>
    </html>
  );
}
