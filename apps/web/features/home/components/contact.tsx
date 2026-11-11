import { ArrowUpRight } from "lucide-react";
import type { Profile } from "@portfolio/types";
import { isPlaceholder } from "../lib/format";
import { CONTAINER, DISPLAY_FACE, SECTION_SPACE, TEXT_DISPLAY, TEXT_LEAD } from "../lib/type-scale";
import { ContactForm } from "./contact-form";
import { Reveal } from "./reveal";
import { SplitWords } from "./split-words";

export function Contact({ profile }: { profile: Profile | null }) {
  const socials = (profile?.socials ?? []).filter((social) => !isPlaceholder(social.url));
  const email = socials.find((social) => social.url.startsWith("mailto:"));
  const others = socials.filter((social) => social !== email);

  return (
    // White field, between the green project stack and the green footer.
    <section id="contact" data-field="white" className={`w-full bg-base text-foreground ${SECTION_SPACE}`}>
      <div className={CONTAINER}>
        <SplitWords lines={["Let's build it.", "Then ship it."]} className={`${DISPLAY_FACE} ${TEXT_DISPLAY}`} />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-14 lg:mt-24 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className={`max-w-[32ch] ${TEXT_LEAD} font-medium leading-[1.3]`}>
              Open to conversations about product engineering and platform work. Email is fastest; the form works too.
            </p>

            <ul className={`mt-10 flex flex-col items-start gap-3 ${TEXT_LEAD} font-bold`}>
              {email && (
                <li>
                  <a href={email.url} className="group flex items-center gap-2 break-all">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_3px]">
                      {email.url.replace("mailto:", "")}
                    </span>
                    <ArrowUpRight
                      className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )}
              {others.map((social) => (
                <li key={social.url}>
                  <a href={social.url} target="_blank" rel="noreferrer noopener" className="group flex items-center gap-2">
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-[length:100%_3px]">
                      {social.label}
                    </span>
                    <ArrowUpRight
                      className="h-6 w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-6 lg:col-start-7">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
