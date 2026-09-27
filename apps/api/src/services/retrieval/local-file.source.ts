import { portfolioRepository } from "../../repositories/portfolio.repository";
import type { RetrievedDocument, SourceConnector } from "./types";

/** The highest-priority source: hand-authored portfolio data in this repo. */
export class LocalFileSource implements SourceConnector {
  name = "portfolio";

  async fetchDocuments(): Promise<RetrievedDocument[]> {
    const profile = portfolioRepository.getProfile();
    const docs: RetrievedDocument[] = [
      {
        id: "profile",
        sourceKind: "portfolio",
        title: `${profile.name}'s Profile`,
        content: `${profile.tagline}\n\n${profile.bio}\n\n${portfolioRepository.getBioLongForm()}`,
      },
    ];

    for (const exp of portfolioRepository.getExperience()) {
      docs.push({
        id: `experience-${exp.id}`,
        sourceKind: "portfolio",
        title: `${exp.title} at ${exp.company}`,
        content: [
          exp.summary,
          `Highlights: ${exp.highlights.join("; ")}`,
          `Technologies: ${exp.technologies.join(", ")}`,
          `Dates: ${exp.startDate} – ${exp.endDate ?? "present"}`,
        ].join("\n"),
      });
    }

    for (const project of portfolioRepository.getProjects()) {
      docs.push({
        id: `project-${project.id}`,
        sourceKind: "portfolio",
        title: project.name,
        content: [project.description, `Technologies: ${project.technologies.join(", ")}`, `Topics: ${project.topics.join(", ")}`].join(
          "\n",
        ),
        url: project.github,
      });
    }

    const skills = portfolioRepository.getSkills();
    docs.push({
      id: "skills",
      sourceKind: "portfolio",
      title: "Skills",
      content: skills.map((s) => `${s.name} (${s.category}, ${s.proficiency ?? "n/a"})`).join(", "),
    });

    for (const edu of portfolioRepository.getEducation()) {
      docs.push({
        id: `education-${edu.id}`,
        sourceKind: "portfolio",
        title: `${edu.credential} at ${edu.institution}`,
        content: [edu.notes, `Dates: ${edu.startDate} – ${edu.endDate ?? "present"}`].filter(Boolean).join("\n"),
      });
    }

    for (const achievement of portfolioRepository.getAchievements()) {
      docs.push({
        id: `achievement-${achievement.id}`,
        sourceKind: "portfolio",
        title: achievement.title,
        content: achievement.description,
        url: achievement.url,
      });
    }

    return docs;
  }
}

export const localFileSource = new LocalFileSource();
