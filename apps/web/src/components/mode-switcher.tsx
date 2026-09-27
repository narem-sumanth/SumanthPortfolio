"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Sparkles, LayoutGrid } from "lucide-react";
import { NavigationRail } from "@portfolio/ui";
import { track } from "@/lib/analytics";

/** The two modes of one product — see docs/architecture.md. */
export function ModeSwitcher() {
  const pathname = usePathname();
  const isPortfolio = pathname?.startsWith("/portfolio");

  return (
    <NavigationRail
      items={[
        { label: "AI Mode", href: "/", icon: Sparkles, active: !isPortfolio },
        {
          label: "Portfolio Mode",
          href: "/portfolio",
          icon: LayoutGrid,
          active: isPortfolio,
        },
      ].map((item) => ({
        ...item,
        onClick: () => item.label === "Portfolio Mode" && track("portfolio_mode_opened"),
      }))}
    />
  );
}
