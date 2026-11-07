"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Project, ProjectCategory } from "@/types/content";
import { ProjectCard } from "./ProjectCard";

export function filterProjects(projects: Project[], query: string, category: ProjectCategory | "All", tech: string | null) {
  const needle = query.trim().toLowerCase();
  return projects.filter(
    (project) =>
      (category === "All" || project.categories.includes(category)) &&
      (!tech || project.tech.includes(tech)) &&
      (!needle || [project.title, project.tagline, ...project.tech, ...project.categories].join(" ").toLowerCase().includes(needle)),
  );
}

export function ProjectExplorer({ projects, categories }: { projects: Project[]; categories: ProjectCategory[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProjectCategory | "All">("All");
  const [tech, setTech] = useState<string | null>(null);

  const techOptions = useMemo(() => [...new Set(projects.flatMap((project) => project.tech))].sort(), [projects]);
  const results = filterProjects(projects, query, category, tech);

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {(["All", ...categories] as const).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn(
                "min-h-9 rounded-full border px-3 text-sm transition-colors",
                category === item ? "border-primary bg-primary text-on-primary" : "border-line text-ink-2 hover:border-line-strong",
              )}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="relative block flex-1 lg:w-52">
            <span className="sr-only">Search projects</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-10 w-full rounded-full border border-line bg-surface pr-3 pl-9 text-[0.95rem] placeholder:text-muted"
            />
          </label>
          <label className="block">
            <span className="sr-only">Filter by technology</span>
            <select value={tech ?? ""} onChange={(event) => setTech(event.target.value || null)} className="h-10 max-w-40 rounded-full border border-line bg-surface px-3 text-[0.95rem]">
              <option value="">All tech</option>
              {techOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"}
      </p>

      <ul className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((project) => (
          <li key={project.slug} className="fade-in">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="card mt-3 p-6 text-center text-ink-2">No projects match.</p>}
    </div>
  );
}
