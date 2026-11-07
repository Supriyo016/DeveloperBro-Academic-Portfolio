"use client";

import { FlaskConical, GraduationCap, Hammer } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Badge, Reveal } from "@/components/ui/primitives";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/types/content";

const kinds = {
  degree: { Icon: GraduationCap, label: "Degree", dot: "bg-primary text-on-primary" },
  research: { Icon: FlaskConical, label: "Research", dot: "bg-accent text-surface" },
  project: { Icon: Hammer, label: "Project", dot: "bg-lavender text-primary" },
} as const;

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const list = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLSpanElement>(null);

  useScrollFrame(() => {
    if (!list.current || !rail.current) return;
    const box = list.current.getBoundingClientRect();
    const ratio = Math.min(Math.max((window.innerHeight * 0.7 - box.top) / box.height, 0), 1);
    rail.current.style.transform = `scaleY(${ratio})`;
  });

  return (
    <ol ref={list} className="relative mx-auto max-w-4xl">
      <span className="absolute top-2 bottom-2 left-5 w-px bg-line md:left-1/2" aria-hidden />
      <span ref={rail} style={{ transform: "scaleY(0)" }} className="absolute top-2 bottom-2 left-5 w-px origin-top bg-primary transition-transform duration-200 ease-out md:left-1/2" aria-hidden />
      {events.map((event, index) => {
        const { Icon, label, dot } = kinds[event.kind];
        const right = index % 2 === 0;
        return (
          <li key={event.id} className="relative pb-10 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
            <span className={cn("timeline-dot absolute top-1 left-0 grid size-10 place-items-center rounded-full ring-4 ring-bg md:left-1/2 md:-translate-x-1/2", dot)}>
              <Icon className="size-4.5" aria-hidden />
            </span>
            <Reveal className={cn(right ? "md:col-start-2" : "md:col-start-1 md:text-right")}>
              <p className="font-mono text-sm text-muted">{event.period}</p>
              <div className={cn("card mt-2 p-5 text-left")}>
                <Badge tone={event.kind === "degree" ? "primary" : event.kind === "research" ? "accent" : "neutral"}>{label}</Badge>
                <h2 className="mt-2 text-xl leading-snug sm:text-2xl">{event.title}</h2>
                {event.org && <p className="mt-1 text-[0.95rem] text-ink-2">{event.org}</p>}
                {event.detail && <p className="mt-1 text-[0.95rem] text-ink-2">{event.detail}</p>}
                {event.href && (
                  <Link href={event.href} className="link mt-2 inline-block text-sm">
                    Open
                  </Link>
                )}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
