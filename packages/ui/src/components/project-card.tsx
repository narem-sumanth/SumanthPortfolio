import * as React from "react";
import { Github, ExternalLink, Star, GitFork } from "lucide-react";
import type { Project } from "@portfolio/types";
import { cn } from "../lib/cn";
import { Badge } from "./badge";
import { Panel } from "./card";
import { Button } from "./button";

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const meta = project.githubMeta;
  return (
    <Panel surface="raised" padding="md" className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-foreground">{project.name}</h4>
        {meta && (
          <div className="flex shrink-0 items-center gap-2.5 text-xs text-foreground-subtle">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3" /> {meta.stars}
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-3 w-3" /> {meta.forks}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-foreground-muted">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.technologies.map((tech) => (
          <Badge key={tech} variant="default">
            {tech}
          </Badge>
        ))}
      </div>

      <div className="mt-1 flex items-center gap-2">
        {project.github && (
          <Button asChild variant="outline" size="sm">
            <a href={project.github} target="_blank" rel="noreferrer noopener">
              <Github className="h-3.5 w-3.5" /> GitHub
            </a>
          </Button>
        )}
        {project.live && (
          <Button asChild variant="secondary" size="sm">
            <a href={project.live} target="_blank" rel="noreferrer noopener">
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </a>
          </Button>
        )}
      </div>
    </Panel>
  );
}

export function ProjectGrid({ projects, className }: { projects: Project[]; className?: string }) {
  if (projects.length === 0) return null;
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
