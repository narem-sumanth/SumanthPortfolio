import type { Profile } from "@portfolio/types";
import { isPlaceholder } from "../lib/format";
import { HEADLINE_FACE, TEXT_BODY, TEXT_PAGE_HEADLINE, TEXT_SMALL } from "../lib/type-scale";
import { Reveal } from "./reveal";

export function ContactBand({ profile }: { profile: Profile | null }) {
  const email = profile?.socials.find((s) => s.url.startsWith("mailto:") && !isPlaceholder(s.url));
  const other = profile?.socials.filter((s) => !s.url.startsWith("mailto:") && !isPlaceholder(s.url)) ?? [];
  if (!email) return null;

  return (
    <footer id="contact" className="w-full bg-elevated py-20 md:py-28">
      <Reveal className="mx-auto flex w-full max-w-5xl flex-col items-start px-6 sm:px-10">
        <h2 className={`max-w-xl ${TEXT_PAGE_HEADLINE} ${HEADLINE_FACE} text-foreground`}>
          Let&rsquo;s build something real.
        </h2>
        <p className={`mt-5 max-w-lg ${TEXT_BODY} text-foreground-muted`}>
          Open to conversations about backend systems, infrastructure, or applied AI. Reach out directly, or ask
          the AI twin above.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={email.url}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:bg-accent/90"
          >
            Email me
          </a>
          {other.map((social) => (
            <a
              key={social.url}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-elevated"
            >
              {social.label}
            </a>
          ))}
        </div>

        {profile?.availability && !isPlaceholder(profile.availability) && (
          <p className={`mt-10 ${TEXT_SMALL} text-foreground-muted`}>{profile.availability}</p>
        )}
      </Reveal>
    </footer>
  );
}
