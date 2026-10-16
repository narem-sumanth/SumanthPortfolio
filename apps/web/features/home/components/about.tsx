import type { Profile } from "@portfolio/types";
import { cleanPlaceholder, socialHandle } from "../lib/format";
import { TEXT_BODY, TEXT_HEADING, TEXT_SMALL } from "../lib/type-scale";
import { Reveal } from "./reveal";

export function About({ profile }: { profile: Profile | null }) {
  const bio = cleanPlaceholder(profile?.bio);
  const github = profile?.socials.find((s) => s.icon === "github" || /github\.com/.test(s.url));
  const facts = [
    profile?.role ? { label: "Role", value: profile.role } : null,
    profile?.availability ? { label: "Status", value: profile.availability } : null,
    profile?.currentlyLearning?.[0] ? { label: "Currently learning", value: profile.currentlyLearning[0] } : null,
    github ? { label: "GitHub", value: socialHandle(github.url) } : null,
  ].filter((f): f is { label: string; value: string } => f !== null);

  if (!bio && facts.length === 0) return null;

  return (
    <section id="about" className="w-full bg-elevated pb-14 pt-20 md:pb-16 md:pt-28">
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-12 px-6 sm:px-10 md:grid-cols-[220px_1fr] md:gap-16">
        <Reveal>
          <h2 className={`${TEXT_HEADING} font-semibold text-foreground`}>About</h2>
          <dl className="mt-8 flex flex-col gap-5">
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col gap-1">
                <dt className={`${TEXT_SMALL} text-foreground-muted`}>{fact.label}</dt>
                <dd className={`${TEXT_BODY} text-foreground`}>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {bio && (
          <Reveal delay={0.1} className={`max-w-[65ch] ${TEXT_BODY} leading-[1.7] text-foreground`}>
            <p>{bio}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
