"use client";

import * as React from "react";
import Link from "next/link";

interface Service {
  number: string;
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const SERVICES: Service[] = [
  {
    number: "01",
    title: "Full-Stack Development",
    description: "End-to-end web applications from database to UI, built with TypeScript, React, and modern backend frameworks.",
    href: "/services/fullstack",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "DevOps & Cloud Infrastructure",
    description: "Containerized deployments, CI/CD pipelines, and cloud-native architecture on AWS, Kubernetes, and Terraform.",
    href: "/services/devops",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "AI & RAG Systems",
    description: "Retrieval-augmented generation pipelines, LLM integration, and intelligent agents grounded in verified data.",
    href: "/services/ai",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Mobile Development",
    description: "Cross-platform mobile apps with React Native, from early flows to App Store and Play Store launch.",
    href: "/services/mobile",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <article
            key={service.number}
            className="card-hover group relative flex flex-col gap-4 rounded-lg border border-border bg-elevated p-6 transition-colors hover:border-accent/30"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-base text-foreground-muted transition-all group-hover:border-accent/40 group-hover:bg-accent/8 group-hover:text-accent">
              {service.icon}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground-subtle">
                {service.number}
              </p>
              <h3 className="text-base font-semibold tracking-tight text-foreground font-display transition-colors group-hover:text-accent">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted line-clamp-3">{service.description}</p>
            </div>
            <Link
              href={service.href}
              className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground-subtle transition-colors hover:text-accent"
              aria-label={`Learn more about ${service.title}`}
            >
              Learn more
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}