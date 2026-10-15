"use client";

import { Badge, cn } from "@portfolio/ui";

export interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  /** Center the chips (empty-state starter questions); left-aligned by default (in-conversation follow-ups). */
  centered?: boolean;
}

export function SuggestedQuestions({ questions, onSelect, centered }: SuggestedQuestionsProps) {
  if (questions.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-2", centered ? "justify-center" : "justify-start")}>
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          onClick={() => onSelect(q)}
          className="cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.03] active:scale-[0.97]"
        >
          <Badge variant="outline" className="cursor-pointer px-3 py-1.5 transition-colors duration-300 ease-out hover:border-accent/50 hover:text-accent">
            {q}
          </Badge>
        </button>
      ))}
    </div>
  );
}
