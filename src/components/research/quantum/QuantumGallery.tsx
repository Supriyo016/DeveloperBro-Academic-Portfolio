"use client";

import { ExternalLink as ExternalIcon } from "lucide-react";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { figureGroups, quantumFigures, type QuantumFigure } from "@/content/data/quantum";
import { cn } from "@/lib/utils";

type Group = QuantumFigure["group"];

/** The project's own figures: report photos and images saved in the notebooks, grouped by what they show. */
export function QuantumGallery() {
  const [group, setGroup] = useState<Group>("circuits");
  const shown = quantumFigures.filter((figure) => figure.group === group);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = figureGroups[(index + step + figureGroups.length) % figureGroups.length]!;
    setGroup(next.id);
    document.getElementById(`figure-tab-${next.id}`)?.focus();
  };

  return (
    <div className="space-y-4">
      <div role="tablist" aria-label="Figure group" className="flex flex-wrap gap-2">
        {figureGroups.map((item, index) => {
          const on = item.id === group;
          const count = quantumFigures.filter((figure) => figure.group === item.id).length;
          return (
            <button
              key={item.id}
              id={`figure-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="figure-panel"
              tabIndex={on ? 0 : -1}
              onKeyDown={(event) => onKey(event, index)}
              onClick={() => setGroup(item.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
                on ? "border-primary bg-primary-soft text-primary shadow-sm" : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
              )}
            >
              {item.label}
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", on ? "bg-surface" : "bg-surface-2")}>{count}</span>
            </button>
          );
        })}
      </div>
      <div id="figure-panel" role="tabpanel" aria-labelledby={`figure-tab-${group}`}>
      <ul className="grid gap-4 sm:grid-cols-2">
        {shown.map((figure, index) => (
          <li key={figure.id} className="fade-in" style={{ animationDelay: `${index * 50}ms` }}>
            <figure className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface">
              <a href={figure.src} target="_blank" rel="noopener" className="zoom-media group relative grid flex-1 place-items-center bg-white p-2" aria-label={`${figure.alt}, open full size`}>
                <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="h-auto max-h-72 w-full object-contain" />
                <span className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-ink/70 text-bg opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <ExternalIcon className="size-4" aria-hidden />
                </span>
              </a>
              <figcaption className="border-t border-line p-3 text-sm text-ink-2">{figure.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>
      </div>
      <p className="text-sm text-muted">
        The report&apos;s two simulator histograms (figures 5 and 8) are not shown: they were redrawn from typed-in values that sum to 1,000 rather than the 1,024 shots run. The simulator runs saved in the notebooks are used in the charts above instead.
      </p>
    </div>
  );
}
