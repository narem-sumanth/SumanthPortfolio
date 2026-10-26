import type { Metadata } from "next";
import { Archivo, Space_Grotesk, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { TooltipProvider } from "@portfolio/ui";
import { AppChrome, ThemeProvider, ApiProvider } from "@/features/shell";
import { getProfileSafe } from "@/features/portfolio";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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
      className={`${archivo.variable} ${spaceGrotesk.variable} ${geistMono.variable}`}
    >
      <body>
        <Script
          id="portfolio-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme')||'system';var r=t==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):t;document.documentElement.setAttribute('data-theme',r);if(r==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');document.documentElement.classList.add('dark');}})();`,
          }}
        />
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