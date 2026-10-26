"use client";

import * as React from "react";
import type { Project } from "@portfolio/types";

interface ProjectCarouselProps {
  projects: Project[];
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  const handleScroll = () => {
    setScrollPosition(containerRef.current?.scrollLeft ?? 0);
  };

  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile scroll buttons */}
      <div className="mb-6 flex items-center justify-end gap-2 lg:hidden">
        <button
          onClick={scrollLeft}
          disabled={scrollPosition <= 0}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-elevated text-foreground-muted transition-colors hover:bg-raised hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Scroll projects left"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={scrollRight}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-elevated text-foreground-muted transition-colors hover:bg-raised hover:text-foreground"
          aria-label="Scroll projects right"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="-mx-6 flex gap-5 overflow-x-auto no-scrollbar px-6 pb-4 lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 xl:grid-cols-3"
        role="region"
        aria-label="Featured projects carousel"
      >
        {featuredProjects.map((project) => (
          <article
            key={project.id}
            className="card-hover group flex w-72 flex-shrink-0 flex-col rounded-lg border border-border bg-elevated transition-colors hover:border-accent/30 lg:w-auto"
          >
            {/* Project card image area */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg bg-raised">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="h-10 w-10 text-border-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              {/* Gradient number overlay */}
              <div className="absolute top-3 left-3 rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-sm">
                {project.topics?.slice(0, 1).join("") ?? "Project"}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-elevated/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
            </div>

            {/* Project info */}
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground font-display transition-colors group-hover:text-accent">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-foreground-muted line-clamp-2">{project.description}</p>
              </div>

              <div className="mt-auto flex flex-wrap gap-1.5" aria-label="Technologies">
                {project.technologies?.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="rounded border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 border-t border-border pt-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-foreground-subtle transition-colors hover:text-foreground"
                    aria-label={`${project.name} on GitHub`}
                  >
                    GitHub ↗
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-accent transition-colors hover:text-accent/80"
                    aria-label={`${project.name} live demo`}
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Scroll progress indicator (mobile) */}
      <div className="mt-5 block lg:hidden">
        <div className="relative h-0.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-accent transition-all duration-200 ease-out"
            style={{
              width: `${Math.max(
                ((containerRef.current?.clientWidth ?? 1) / (containerRef.current?.scrollWidth ?? 1)) * 100,
                20,
              )}%`,
              transform: `translateX(${
                (scrollPosition / ((containerRef.current?.scrollWidth ?? 1) - (containerRef.current?.clientWidth ?? 0))) *
                (100 - Math.max(((containerRef.current?.clientWidth ?? 1) / (containerRef.current?.scrollWidth ?? 1)) * 100, 20))
              }%)`,
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}