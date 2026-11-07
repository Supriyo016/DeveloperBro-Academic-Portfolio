import { FacebookIcon, GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const icons = { linkedin: LinkedinIcon, github: GithubIcon, x: XIcon, instagram: InstagramIcon, facebook: FacebookIcon };

export function SocialLinks({ className, only }: { className?: string; only?: (keyof typeof icons)[] }) {
  const links = profile.social.filter((item) => item.url && (!only || only.includes(item.id as keyof typeof icons)));

  return (
    <ul className={cn("flex flex-wrap items-center gap-1", className)}>
      {links.map(({ id, label, url }) => {
        const Icon = icons[id as keyof typeof icons];
        return (
          <li key={id}>
            <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${label} profile (opens in a new tab)`} data-tooltip={label} className="social-link">
              <Icon className="size-[1.15rem]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
