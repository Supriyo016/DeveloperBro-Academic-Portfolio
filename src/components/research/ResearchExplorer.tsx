"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/primitives";

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

  const options = useMemo(
    () =>
      Object.fromEntries(facets.map(({ key }) => [key, [...new Set(items.flatMap((item) => item[key]))].sort()])) as Record<FacetKey, string[]>,
    [items],
  );

  const results = filterExplorerItems(items, query, selected);
  const active = query !== "" || Object.values(selected).some(Boolean);

  return (
    <div>
      <div className="card grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="relative block sm:col-span-2 lg:col-span-1">
          <span className="sr-only">Search research</span>
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-11 w-full rounded-lg border border-line bg-bg pr-3 pl-9 text-[0.95rem] placeholder:text-muted"
          />
        </label>
        {facets.map(({ key, label }) => (
          <label key={key} className="block">
            <span className="sr-only">{label}</span>
            <select
              value={selected[key] ?? ""}
              onChange={(event) => setSelected({ ...selected, [key]: event.target.value })}
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

      <div className="mt-3 flex min-h-9 items-center justify-between text-sm text-muted">
        <p aria-live="polite">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelected({});
            }}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-2 text-primary hover:bg-primary-soft"
          >
            <X className="size-3.5" aria-hidden /> Clear filters
          </button>
        )}
      </div>

      <ul className="mt-2 grid gap-3 md:grid-cols-2">
        {results.map((item) => (
          <li key={item.href} className="fade-in">
            <Link href={item.href} className="card card-lift block h-full p-5">
              <Badge tone="primary">{item.kind}</Badge>
              <p className="mt-2 font-serif text-xl leading-snug">{item.title}</p>
              <p className="mt-1.5 line-clamp-2 text-[0.95rem] text-ink-2">{item.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="card mt-2 p-6 text-center text-ink-2">Nothing matches those filters.</p>}
    </div>
  );
}
