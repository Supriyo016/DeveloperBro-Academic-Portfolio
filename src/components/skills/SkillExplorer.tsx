"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ResolvedWork } from "@/lib/work";

export interface ResolvedSkill {
  name: string;
  work: ResolvedWork[];
}

export interface ResolvedSkillGroup {
  id: string;
  name: string;
  blurb: string;
  skills: ResolvedSkill[];
}

export function SkillExplorer({ groups }: { groups: ResolvedSkillGroup[] }) {
  const [skill, setSkill] = useState<string | null>("PyTorch");
  const [workHref, setWorkHref] = useState<string | null>(null);

  const allWork = useMemo(() => {
    const seen = new Map<string, ResolvedWork>();
    for (const group of groups) for (const item of group.skills) for (const work of item.work) seen.set(work.href, work);
    return [...seen.values()];
  }, [groups]);

  const selectedSkill = groups.flatMap((group) => group.skills).find((item) => item.name === skill);
  const litWork = new Set(selectedSkill?.work.map((work) => work.href));
  const usesWork = (item: ResolvedSkill) => (workHref ? item.work.some((work) => work.href === workHref) : false);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <section key={group.id} className="card p-5" aria-labelledby={`group-${group.id}`}>
            <h2 id={`group-${group.id}`} className="text-xl">{group.name}</h2>
            <p className="mt-1 text-sm text-muted">{group.blurb}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.skills.map((item) => {
                const active = skill === item.name;
                const lit = usesWork(item);
                return (
                  <li key={item.name}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setSkill(active ? null : item.name);
                        setWorkHref(null);
                      }}
                      className={cn(
                        "min-h-9 rounded-full border px-3 py-1 text-sm transition-colors",
                        active ? "border-primary bg-primary text-on-primary" : lit ? "border-primary bg-primary-soft text-primary" : "border-line text-ink-2 hover:border-line-strong",
                      )}
                    >
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <aside className="card p-5 lg:sticky lg:top-24" aria-live="polite">
        <p className="eyebrow">Where it was used</p>
        {selectedSkill ? (
          <p className="mt-2 font-serif text-xl">{selectedSkill.name}</p>
        ) : (
          <p className="mt-2 text-sm text-muted">Pick a skill, or a piece of work below to see the skills behind it.</p>
        )}
        {selectedSkill && selectedSkill.work.length === 0 && <p className="mt-1 text-sm text-muted">Studied or in general use. Not tied to a listed project.</p>}
        <ul className="mt-3 space-y-1.5">
          {allWork.map((work) => {
            const lit = litWork.has(work.href) || workHref === work.href;
            return (
              <li key={work.href} className="flex items-center gap-1">
                <button
                  type="button"
                  aria-pressed={workHref === work.href}
                  onClick={() => {
                    setWorkHref(workHref === work.href ? null : work.href);
                    setSkill(null);
                  }}
                  className={cn(
                    "min-h-9 flex-1 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors",
                    lit ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-surface-2",
                  )}
                >
                  {work.title}
                </button>
                <Link href={work.href} aria-label={`Open ${work.title}`} className="grid size-9 place-items-center rounded-full text-muted hover:text-primary">
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
