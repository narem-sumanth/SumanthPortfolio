"use client";

import * as React from "react";
import Link from "next/link";
import type { Profile } from "@portfolio/types";

interface HeroSectionProps {
  profile: Profile | null;
}

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center py-16 lg:py-24" aria-labelledby="hero-heading">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 w-full">
        {/* Scroll indicator */}
        <div className="absolute left-6 lg:left-8 bottom-8 lg:bottom-12 flex flex-col items-center gap-2 text-foreground-subtle opacity-60 animate-bounce-slow" aria-hidden="true">
          <p className="text-xs font-medium uppercase tracking-widest writing-mode-vertical-tb">Scroll</p>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        <div className="text-center">
          {/* Eyebrow / Tagline */}
          <p className="text-xs font-medium uppercase tracking-widest text-foreground-subtle mb-6 lg:mb-8">
            {profile?.availability ?? "Software Engineer"}
          </p>

          {/* Main Heading */}
          <h1 id="hero-heading" className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-foreground font-display leading-[1.05] mb-6 lg:mb-8">
            {profile?.name ?? "Sumanth Narem"}
          </h1>

          {/* Subheading / Description */}
          <p className="text-base lg:text-lg xl:text-xl text-foreground-muted max-w-3xl mx-auto mb-10 lg:mb-12 leading-relaxed">
            {profile?.tagline ?? "Building across full-stack, DevOps, cloud, and AI."}
          </p>

          {/* Bio snippet */}
          {profile?.bio && !profile.bio.includes("PLACEHOLDER") && (
            <p className="text-sm lg:text-base text-foreground-muted max-w-2xl mx-auto mb-10 lg:mb-12 leading-relaxed">
              {profile.bio}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/work"
              className="w-full sm:w-auto px-8 py-4 border-2 border-border-brutal text-foreground font-medium tracking-tight text-sm lg:text-base hover:bg-raised transition-colors duration-150"
            >
              See the work →
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-accent text-accent-foreground font-medium tracking-tight text-sm lg:text-base hover:opacity-90 transition-opacity duration-150"
            >
              Start a project
            </Link>
          </div>

          {/* Tech badges */}
          <div className="mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground-subtle opacity-70">
            {["Next.js", "TypeScript", "React", "Docker", "Kubernetes", "AWS", "AI/RAG", "PostgreSQL"].map((tech) => (
              <span key={tech} className="px-3 py-1 border border-border-brutal bg-base hover:border-border-brutal-strong hover:text-foreground transition-colors duration-150">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}