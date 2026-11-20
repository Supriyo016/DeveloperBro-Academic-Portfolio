import { ArrowRight, Download, Mail } from "lucide-react";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ButtonAnchor, ButtonLink } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { IdentityBadge } from "./IdentityBadge";
import { identity } from "./identity-card-data";

/** The top of the home page: who I am on the left, the hanging identity badge on the right. */
export function IdentityHero() {
  return (
    <div className="grid items-start gap-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
      <div className="order-2 lg:order-1 lg:pt-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 text-xs text-ink-2 backdrop-blur">
          <span className="size-2 rounded-full bg-[var(--series-3)] shadow-[0_0_8px_var(--series-3)]" aria-hidden />
          {identity.status}
        </p>
        <h1 className="mt-5 font-sans text-[3.2rem] leading-[0.95] font-semibold tracking-[-0.045em] sm:text-7xl xl:text-[5.6rem]">
          {"Supriyo "}
          <br />
          Sarkar
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-2">{identity.summary}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href="/research" data-magnetic>
            Explore research
            <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" data-magnetic>
            <Mail className="size-4" aria-hidden />
            Contact me
          </ButtonLink>
          <ButtonAnchor href={profile.cvPath} download variant="secondary" data-magnetic>
            <Download className="size-4" aria-hidden />
            Download academic CV
          </ButtonAnchor>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ul className="flex gap-1.5" aria-label="Main research tools">
            {identity.tools.map((tool) => (
              <li key={tool.short} title={tool.label} className="grid size-8 place-items-center rounded-lg border border-line-strong bg-primary-soft font-mono text-[0.7rem] font-semibold text-primary">
                <span aria-hidden>{tool.short}</span>
                <span className="sr-only">{tool.label}</span>
              </li>
            ))}
          </ul>
          <span className="text-sm text-muted">{identity.tools.map((tool) => tool.label).join(" · ")}</span>
          <SocialLinks only={["github", "linkedin"]} />
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <IdentityBadge />
      </div>
    </div>
  );
}
