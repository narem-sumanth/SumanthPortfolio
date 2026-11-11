"use client";

import * as React from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@portfolio/ui";
import { useChatPanel } from "@/features/chat";
import { CONTAINER, DISPLAY_FACE, TEXT_BODY, TEXT_HEADING } from "../lib/type-scale";
import { useIntro } from "./intro-provider";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

/**
 * A plain bar: clear over the hero, a solid ground fill once the page moves.
 * It steps out of the way while scrolling down and returns on the way up.
 */
export function Navbar({ name }: { name: string }) {
  const { ready } = useIntro();
  const { open } = useChatPanel();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const [solid, setSolid] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 480);
    setSolid(latest > 48);
  });

  function openChat() {
    setMobileOpen(false);
    open();
  }

  return (
    <motion.header
      data-reveal
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${solid ? "bg-base" : "bg-transparent"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0, y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className={`${CONTAINER} flex items-center justify-between gap-6 py-4 ${TEXT_BODY}`}>
        <a href="#top" className="font-semibold text-foreground transition-opacity hover:opacity-70">
          {name}
        </a>

        {/* Desktop: every link inline. Below lg there's no room for five links plus the Ask AI
            pill, so the full set moves into the slide-over menu instead of thinning out to just
            one link — a visitor on a phone can still reach every section, not only Contact. */}
        <nav aria-label="Sections" className="hidden items-center gap-1 lg:flex sm:gap-2">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="group relative px-3 py-2 text-foreground">
              {link.label}
              {/* Filled underline that wipes in from the left on hover. */}
              <span
                className="absolute inset-x-3 bottom-1 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                aria-hidden="true"
              />
            </a>
          ))}
          <button
            type="button"
            onClick={open}
            className="ml-2 rounded-full bg-accent px-5 py-2 font-semibold text-accent-foreground transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
          >
            Ask AI
          </button>
        </nav>

        {/* Mobile: a plain hamburger opening the same links in a full-screen slide-over. */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        {/* [&>button:last-child]:hidden hides SheetContent's built-in close (a small X pinned 16px
            from the corner). The bar below repeats the header row exactly — same container, same
            padding, same 40px button — so the X lands where the hamburger was. */}
        <SheetContent className="flex w-full flex-col bg-base p-0 sm:w-full md:w-full lg:w-full [&>button:last-child]:hidden">
          <div className={`${CONTAINER} flex items-center justify-end py-4 ${TEXT_BODY}`}>
            <SheetClose
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground"
            >
              <X className="h-6 w-6" />
            </SheetClose>
          </div>

          <div className={`${CONTAINER} flex flex-1 flex-col gap-10 pb-8 pt-6`}>
            <SheetTitle className={`${DISPLAY_FACE} ${TEXT_HEADING} text-foreground`}>Menu</SheetTitle>

            <nav aria-label="Sections" className="flex flex-1 flex-col justify-center gap-2">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`${DISPLAY_FACE} text-[clamp(2rem,7vw,3.5rem)] text-foreground transition-transform duration-300 ease-out hover:translate-x-3 hover:text-accent`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <button
              type="button"
              onClick={openChat}
              className="w-full rounded-full bg-accent px-6 py-4 text-center font-semibold text-accent-foreground"
            >
              Ask AI
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </motion.header>
  );
}
