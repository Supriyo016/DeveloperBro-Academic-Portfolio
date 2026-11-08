"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export interface CaseStudyCard {
  slug: string;
  title: string;
  kind: string;
  period: string;
  status: string;
  abstract: string;
  domains: string[];
}

const statusLabel = (status: string) => (status === "In progress" ? "Ongoing" : status);

function Chips({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div role="group" aria-label={`Case studies by ${label.toLowerCase()}`} className="flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      {["All", ...options].map((option) => {
        const on = value === option;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(option)}
            className={cn("min-h-9 rounded-full border px-3 text-sm transition-all", on ? "border-transparent bg-primary text-on-primary shadow" : "border-line text-ink-2 hover:border-primary hover:text-primary")}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** Case studies, newest first (the list arrives sorted), with filters by status, type and domain. */
export function CaseStudies({ studies }: { studies: CaseStudyCard[] }) {
  const [status, setStatus] = useState("All");
  const [kind, setKind] = useState("All");
  const [domain, setDomain] = useState("All");

  const options = useMemo(
    () => ({
      status: [...new Set(studies.map((study) => statusLabel(study.status)))],
      kind: [...new Set(studies.map((study) => study.kind))],
      domain: [...new Set(studies.flatMap((study) => study.domains))].sort(),
    }),
    [studies],
  );

  const shown = studies.filter(
    (study) =>
      (status === "All" || statusLabel(study.status) === status) && (kind === "All" || study.kind === kind) && (domain === "All" || study.domains.includes(domain)),
  );

  return (
    <div>
      <div className="card mt-6 space-y-3 p-4">
        <Chips label="Status" options={options.status} value={status} onChange={setStatus} />
        <Chips label="Type" options={options.kind} value={kind} onChange={setKind} />
        <label className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium tracking-wide text-muted uppercase">Domain</span>
          <select value={domain} onChange={(event) => setDomain(event.target.value)} className="h-10 rounded-lg border border-line bg-bg px-2 text-sm">
            <option value="All">All domains</option>
            {options.domain.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mt-3 text-sm text-muted" aria-live="polite">
        {shown.length} {shown.length === 1 ? "research work" : "research works"}, newest first
      </p>

      <ul className="mt-3 grid gap-4">
        {shown.map((study, index) => (
          <li key={study.slug} className="pop-in" style={{ animationDelay: `${index * 80}ms` }}>
            <Link
              href={`/research/${study.slug}`}
              className="case-card group card card-lift relative grid gap-3 overflow-hidden p-5 sm:grid-cols-[8.5rem_1fr_auto] sm:items-start sm:gap-6 sm:p-6"
              data-status={study.status === "In progress" ? "ongoing" : "done"}
            >
              <span className="font-mono text-sm text-muted">{study.period}</span>
              <span>
                <span className="block text-sm font-medium text-accent">{study.kind}</span>
                <span className="mt-1 block font-serif text-xl leading-snug transition-colors group-hover:text-primary sm:text-2xl">{study.title}</span>
                <span className="mt-2 line-clamp-2 text-[0.95rem] text-ink-2">{study.abstract}</span>
              </span>
              <Badge tone={study.status === "In progress" ? "accent" : "ok"} className="w-fit">
                {study.status === "In progress" && <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-current" aria-hidden />}
                {statusLabel(study.status)}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
      {shown.length === 0 && <p className="card mt-3 p-6 text-center text-ink-2">No research work matches those filters.</p>}
    </div>
  );
}
