"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { researchMap } from "@/content/research-areas";
import { cn } from "@/lib/utils";

const edges = researchMap.edges as readonly (readonly [string, string])[];

const adjacency = (direction: 0 | 1) => {
  const map = new Map<string, string[]>();
  for (const edge of edges) {
    const from = edge[direction];
    const to = edge[direction === 0 ? 1 : 0];
    map.set(from, [...(map.get(from) ?? []), to]);
  }
  return map;
};

const forward = adjacency(0);
const backward = adjacency(1);

function walk(start: string, graph: Map<string, string[]>, seen: Set<string>) {
  for (const next of graph.get(start) ?? []) {
    if (!seen.has(next)) {
      seen.add(next);
      walk(next, graph, seen);
    }
  }
}

export function connectedNodes(id: string): Set<string> {
  const seen = new Set([id]);
  walk(id, forward, seen);
  walk(id, backward, seen);
  return seen;
}

interface Line {
  key: string;
  d: string;
  on: boolean;
}

const allNodes = Object.values(researchMap.nodes).flat() as readonly { id: string; label: string; href?: string }[];

export function ResearchMap() {
  const [selected, setSelected] = useState<string | null>("a-fl");
  const [lines, setLines] = useState<Line[]>([]);
  const container = useRef<HTMLDivElement>(null);
  const reached = useMemo(() => (selected ? connectedNodes(selected) : null), [selected]);

  const measure = useCallback(() => {
    const root = container.current;
    if (!root || window.innerWidth < 1024) {
      setLines([]);
      return;
    }
    const box = root.getBoundingClientRect();
    const next: Line[] = [];
    for (const [from, to] of edges) {
      const a = root.querySelector(`[data-node="${from}"]`)?.getBoundingClientRect();
      const b = root.querySelector(`[data-node="${to}"]`)?.getBoundingClientRect();
      if (!a || !b) continue;
      const x1 = a.right - box.left;
      const y1 = a.top + a.height / 2 - box.top;
      const x2 = b.left - box.left;
      const y2 = b.top + b.height / 2 - box.top;
      const mid = (x1 + x2) / 2;
      next.push({ key: `${from}-${to}`, d: `M${x1} ${y1}C${mid} ${y1} ${mid} ${y2} ${x2} ${y2}`, on: Boolean(reached?.has(from) && reached.has(to)) });
    }
    setLines(next);
  }, [reached]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const works = researchMap.nodes.work.filter((node) => reached?.has(node.id));
  const selectedLabel = allNodes.find((node) => node.id === selected)?.label;

  return (
    <div className="card p-4 sm:p-6">
      <div ref={container} className="relative">
        <svg className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block" aria-hidden>
          {lines.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke={line.on ? "var(--primary)" : "var(--line)"}
              strokeWidth={line.on ? 1.75 : 1}
              className="transition-[stroke] duration-300"
            />
          ))}
        </svg>
        <div className="relative grid gap-5 lg:grid-cols-4 lg:gap-14">
          {researchMap.columns.map((column) => (
            <div key={column.id}>
              <h3 className="eyebrow">{column.title}</h3>
              <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col">
                {researchMap.nodes[column.id as keyof typeof researchMap.nodes].map((node) => {
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        data-node={node.id}
                        aria-pressed={selected === node.id}
                        onClick={() => setSelected(selected === node.id ? null : node.id)}
                        className={cn(
                          "min-h-11 w-full rounded-lg border px-3 py-2 text-left text-sm leading-snug transition-all duration-300",
                          selected === node.id
                            ? "border-primary bg-primary text-on-primary"
                            : reached?.has(node.id)
                              ? "border-primary bg-primary-soft text-primary"
                              : reached
                                ? "border-line bg-surface text-muted hover:border-line-strong"
                                : "border-line bg-surface text-ink-2 hover:border-line-strong",
                        )}
                      >
                        {node.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex min-h-11 flex-wrap items-center justify-between gap-3 border-t border-line pt-4" aria-live="polite">
        {selected ? (
          <>
            <p className="text-sm text-ink-2">
              <span className="font-medium text-ink">{selectedLabel}</span> leads to {works.length} piece{works.length === 1 ? "" : "s"} of work:
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {works.map((node) => (
                <Link key={node.id} href={node.href} className="group inline-flex items-center gap-1 text-sm text-primary">
                  {node.label}
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              ))}
              <button type="button" onClick={() => setSelected(null)} aria-label="Clear selection" className="grid size-9 place-items-center rounded-full text-muted hover:bg-surface-2">
                <X className="size-4" aria-hidden />
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted">Choose any box to trace how it connects.</p>
        )}
      </div>
    </div>
  );
}
