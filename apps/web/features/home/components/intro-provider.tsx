"use client";

import * as React from "react";

interface IntroContextValue {
  /** True once the preloader has started lifting — the hero's entrance waits on this. */
  ready: boolean;
  markReady: () => void;
}

const IntroContext = React.createContext<IntroContextValue | null>(null);

export function useIntro() {
  const ctx = React.useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within an IntroProvider");
  return ctx;
}

/** Shares the preloader's "curtain is lifting" moment with the sections underneath it. */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  const value = React.useMemo(() => ({ ready, markReady: () => setReady(true) }), [ready]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}
