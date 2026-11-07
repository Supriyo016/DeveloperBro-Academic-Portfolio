import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

const buttonStyles: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-line-strong bg-surface text-ink hover:border-primary hover:text-primary",
};

const buttonBase =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2 text-[0.95rem] font-medium transition-all duration-200 active:scale-[0.98]";

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={cn(buttonBase, buttonStyles[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function ButtonAnchor({ variant = "primary", className, children, ...props }: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a className={cn(buttonBase, buttonStyles[variant], className)} {...props}>
      {children}
    </a>
  );
}

export function Button({ variant = "primary", className, children, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={cn(buttonBase, buttonStyles[variant], "disabled:opacity-60", className)} {...props}>
      {children}
    </button>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-1.5 text-primary", className)}>
      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">{children}</span>
      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("group inline-flex items-center gap-1 text-primary", className)}>
      <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">{children}</span>
      <ArrowUpRight className="size-4" aria-hidden />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

type Tone = "neutral" | "primary" | "accent" | "ok" | "warn";

const toneStyles: Record<Tone, string> = {
  neutral: "bg-surface-2 text-ink-2",
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent",
  ok: "bg-ok-soft text-ok-ink",
  warn: "bg-warn-soft text-warn-ink",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", toneStyles[tone], className)}>{children}</span>
  );
}

export function Reveal({ children, className, delay = 0, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }) {
  return (
    <Tag className={cn("reveal", className)} style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}

export function SectionHeading({ id, eyebrow, title, children, className }: { id?: string; eyebrow?: string; title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-2 text-3xl sm:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-ink-2">{children}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, intro, illustration }: { eyebrow: string; title: string; intro: ReactNode; illustration?: ReactNode }) {
  return (
    <header className="container-page grid items-center gap-8 pt-12 pb-10 sm:pt-16 md:grid-cols-[1.25fr_1fr]">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="headline mt-3 text-4xl sm:text-5xl">{title}</h1>
        <div className="mt-4 max-w-xl text-lg text-ink-2">{intro}</div>
      </div>
      {illustration && <div className="mx-auto w-full max-w-sm">{illustration}</div>}
    </header>
  );
}
