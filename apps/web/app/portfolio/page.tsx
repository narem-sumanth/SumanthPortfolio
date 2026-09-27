import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@portfolio/ui";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "The classic portfolio view is coming soon.",
};

/**
 * Placeholder for the classic landing-page mode while it's rebuilt — see
 * docs/architecture.md. The AI chat at "/" remains the primary interface.
 */
export default function PortfolioPage() {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-foreground-subtle">Portfolio mode</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Coming soon</h1>
      <p className="mt-3 max-w-md text-sm text-foreground-muted">
        The classic portfolio view is being rebuilt. In the meantime, ask the AI directly about experience, skills,
        and projects.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">
          <Sparkles className="h-4 w-4" /> Ask AI instead
        </Link>
      </Button>
    </div>
  );
}
