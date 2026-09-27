import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@portfolio/ui";
import { AppChrome } from "@/components/app-chrome";
import { ThemeProvider } from "@/components/theme-provider";
import { getProfileSafe } from "@/lib/serverApi";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

// Profile data lives in a separately-deployed API, not this app's build —
// static prerendering would freeze it (or bake in the safe-fallback null
// forever if the API isn't reachable at build time). Fetch it per-request.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileSafe();
  const name = profile?.name ?? "Sumanth Narem";
  const tagline = profile?.tagline ?? "Building across full-stack, DevOps, cloud, and AI.";

  return {
    title: { default: `${name} | AI Portfolio`, template: `%s | ${name}` },
    description: `Talk to ${name}'s AI twin, grounded in verified experience, skills, and projects. ${tagline}`,
    openGraph: {
      title: `${name} | AI Portfolio`,
      description: tagline,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | AI Portfolio`,
      description: tagline,
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfileSafe();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <AppChrome profile={profile}>{children}</AppChrome>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
