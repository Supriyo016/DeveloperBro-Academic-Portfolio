"use client";

import Link from "next/link";
import { useId, useState, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/primitives";
import { evidenceLabels } from "@/content/research-areas";
import type { ResolvedWork } from "@/lib/work";
import type { EvidenceLevel, ResearchArea } from "@/types/content";
import { cn } from "@/lib/utils";

export type AreaWithWork = Omit<ResearchArea, "related"> & { work: ResolvedWork[] };

const evidenceTone: Record<EvidenceLevel, "primary" | "accent" | "neutral" | "warn"> = {
  dissertation: "primary",
  ongoing: "accent",
  coursework: "neutral",
  interest: "warn",
};

const kindLabel: Record<ResolvedWork["type"], string> = { research: "Research", project: "Project", article: "Article" };

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="eyebrow">{title}</h4>
      <ul className="mt-2 space-y-1 text-[0.95rem] text-ink-2">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function InterestExplorer({ areas }: { areas: AreaWithWork[] }) {
  const [activeId, setActiveId] = useState(areas[0]?.id);
  const baseId = useId();
  const active = areas.find((area) => area.id === activeId) ?? areas[0];
  if (!active) return null;

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = areas[(index + delta + areas.length) % areas.length];
    if (!next) return;
    setActiveId(next.id);
    document.getElementById(`${baseId}-tab-${next.id}`)?.focus();
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[17rem_1fr]">
      <div role="tablist" aria-label="Research interests" aria-orientation="vertical" className="flex gap-1.5 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {areas.map((area, index) => (
          <button
            key={area.id}
            id={`${baseId}-tab-${area.id}`}
            role="tab"
            type="button"
            aria-selected={area.id === active.id}
            aria-controls={`${baseId}-panel`}
            tabIndex={area.id === active.id ? 0 : -1}
            onClick={() => setActiveId(area.id)}
            onKeyDown={(event) => onKeyDown(event, index)}
            className={cn(
              "min-h-11 shrink-0 rounded-lg px-3 py-2 text-left text-[0.95rem] whitespace-nowrap transition-colors duration-200 lg:whitespace-normal",
              area.id === active.id ? "bg-primary-soft text-primary" : "text-ink-2 hover:bg-surface-2",
            )}
          >
            {area.name}
          </button>
        ))}
      </div>

      <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${active.id}`} tabIndex={0} className="card min-h-96 p-5 sm:p-7">
        <div key={active.id} className="fade-in">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl sm:text-3xl">{active.name}</h3>
              <Badge tone={evidenceTone[active.evidence]}>{evidenceLabels[active.evidence]}</Badge>
            </div>
            <p className="mt-3 max-w-2xl text-ink-2">{active.summary}</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              <Column title="Problems" items={active.problems} />
              <Column title="Techniques" items={active.techniques} />
              <Column title="Directions" items={active.directions} />
            </div>
            {active.work.length > 0 && (
              <div className="mt-6 border-t border-line pt-4">
                <h4 className="eyebrow">Related work</h4>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {active.work.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-line px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary">
                        <span className="text-xs text-muted">{kindLabel[item.type]}</span>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
