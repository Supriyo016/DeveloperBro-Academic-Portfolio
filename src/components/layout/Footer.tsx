import Link from "next/link";
import { TerminalLauncher } from "@/components/fun/Terminal";
import { FooterScene } from "@/components/illustrations/scenes-extra";
import { CookieSettingsButton } from "@/components/layout/CookieNotice";
import { MotionToggle } from "@/components/layout/MotionToggle";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { profile } from "@/content/profile";
import { primaryNav, secondaryNav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface-2/60 backdrop-blur-[2px]">
      <div className="container-page pt-8">
        <FooterScene />
      </div>
      <div className="container-page grid gap-10 py-10 md:grid-cols-[1.6fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <Wordmark className="font-serif text-xl" />
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted">The research portfolio of {profile.name}. {profile.openTo}</p>
          <a href={`mailto:${profile.email}`} className="link mt-3 inline-block text-sm break-all">{profile.email}</a>
          <SocialLinks className="mt-3 -ml-2" />
        </div>
        {[
          { title: "Explore", links: primaryNav },
          { title: "Academic", links: secondaryNav },
        ].map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="eyebrow">{column.title}</p>
            <ul className="mt-3 space-y-1.5 text-[0.95rem]">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink-2 transition-colors hover:text-primary">{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-4 pr-20 text-sm text-muted">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved ·{" "}
            <Link href="/license" className="hover:text-primary">License</Link> ·{" "}
            <Link href="/cookies" className="hover:text-primary">Cookie policy</Link>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <MotionToggle />
            <CookieSettingsButton />
            <TerminalLauncher />
          </div>
        </div>
      </div>
    </footer>
  );
}
