"use client";

import { ChevronDown, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const PAGE = 4;

export interface ExplorerItem {
  title: string;
  href: string;
  kind: string;
  summary: string;
  domains: string[];
  methods: string[];
  technologies: string[];
  statuses: string[];
}

const facets = [
  { key: "domains", label: "Domain" },
  { key: "methods", label: "Methodology" },
  { key: "technologies", label: "Technology" },
  { key: "statuses", label: "Status" },
] as const;

type FacetKey = (typeof facets)[number]["key"];

export function filterExplorerItems(items: ExplorerItem[], query: string, selected: Partial<Record<FacetKey, string>>) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    const matchesFacets = facets.every(({ key }) => !selected[key] || item[key].includes(selected[key]));
    if (!matchesFacets) return false;
    if (!needle) return true;
    return [item.title, item.summary, ...item.domains, ...item.methods, ...item.technologies, ...item.statuses].join(" ").toLowerCase().includes(needle);
  });
}

export function ResearchExplorer({ items }: { items: ExplorerItem[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Partial<Record<FacetKey, string>>>({});
  const [limit, setLimit] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const options = useMemo(
    () =>
      Object.fromEntries(facets.map(({ key }) => [key, [...new Set(items.flatMap((item) => item[key]))].sort()])) as Record<FacetKey, string[]>,
    [items],
  );

  // The most common domains become one-tap topic chips.
  const topics = useMemo(() => {
    const count = new Map<string, number>();
    for (const item of items) for (const domain of item.domains) count.set(domain, (count.get(domain) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name]) => name);
  }, [items]);

  const results = filterExplorerItems(items, query, selected);
  const active = query !== "" || Object.values(selected).some(Boolean);
  const visible = results.slice(0, limit);
  const hidden = results.length - visible.length;

  const update = (next: Partial<Record<FacetKey, string>>) => {
    setSelected(next);
    setLimit(PAGE);
  };

  return (
    <div>
      <div className="card p-4">
        <div className="flex flex-wrap gap-3">
          <label className="relative block min-w-0 flex-1 basis-60">
            <span className="sr-only">Search research</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setLimit(PAGE);
              }}
              placeholder="Search"
              className="h-11 w-full rounded-lg border border-line bg-bg pr-3 pl-9 text-[0.95rem] placeholder:text-muted"
            />
          </label>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="explorer-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-line px-3 text-sm text-ink-2 hover:border-primary hover:text-primary"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            More filters
            <ChevronDown className={cn("size-4 transition-transform duration-300", filtersOpen && "rotate-180")} aria-hidden />
          </button>
        </div>

        <div role="group" aria-label="Popular topics" className="mt-3 flex flex-wrap gap-2">
          {topics.map((topic, index) => {
            const on = selected.domains === topic;
            return (
              <button
                key={topic}
                type="button"
                aria-pressed={on}
                onClick={() => update({ ...selected, domains: on ? "" : topic })}
                className={cn("topic-chip inline-flex min-h-9 items-center rounded-full border px-3 text-sm transition-all", on ? "border-transparent bg-primary text-on-primary shadow-md" : "border-line text-ink-2 hover:-translate-y-0.5 hover:border-primary hover:text-primary")}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                {topic}
              </button>
            );
          })}
        </div>

        <div id="explorer-filters" hidden={!filtersOpen} className="mt-3 grid gap-3 border-t border-line pt-3 sm:grid-cols-2 lg:grid-cols-4">
          {facets.map(({ key, label }) => (
            <label key={key} className="block">
              <span className="sr-only">{label}</span>
              <select
                value={selected[key] ?? ""}
                onChange={(event) => update({ ...selected, [key]: event.target.value })}
                className="h-11 w-full rounded-lg border border-line bg-bg px-2 text-[0.95rem]"
              >
                <option value="">{label}: all</option>
                {options[key].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-h-9 items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              update({});
            }}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-primary hover:bg-primary-soft"
          >
            <X className="size-3.5" aria-hidden /> Clear filters
          </button>
        )}
      </div>

      <ul className="mt-2 grid gap-3 md:grid-cols-2">
        {visible.map((item, index) => (
          <li key={item.href} className="pop-in" style={{ animationDelay: `${(index % PAGE) * 70}ms` }}>
            <Link href={item.href} className="card card-lift block h-full p-5">
              <Badge tone="primary">{item.kind}</Badge>
              <p className="mt-2 font-serif text-xl leading-snug">{item.title}</p>
              <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-ink-2">{item.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="card mt-2 p-6 text-center text-ink-2">Nothing matches those filters.</p>}

      {results.length > PAGE && (
        <div className="mt-5 flex flex-col items-center gap-2">
          {hidden > 0 ? (
            <button type="button" onClick={() => setLimit(limit + PAGE)} className="more-stack group relative inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-bg shadow-lg transition-transform hover:-translate-y-0.5">
              <span className="relative grid size-8 place-items-center rounded-full bg-primary text-on-primary">
                <Plus className="size-4 transition-transform duration-300 group-hover:rotate-90" aria-hidden />
              </span>
              <span className="text-sm font-medium">
                Show {Math.min(PAGE, hidden)} more <span className="opacity-70">· {hidden} waiting</span>
              </span>
            </button>
          ) : (
            <button type="button" onClick={() => setLimit(PAGE)} className="min-h-10 rounded-full border border-line px-4 text-sm text-ink-2 hover:border-primary hover:text-primary">
              Show fewer
            </button>
          )}
          {hidden > PAGE && (
            <button type="button" onClick={() => setLimit(results.length)} className="min-h-10 rounded-full px-3 text-sm text-primary underline-offset-4 hover:underline">
              Show all {results.length}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
