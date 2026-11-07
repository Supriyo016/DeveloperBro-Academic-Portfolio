import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import type { Project } from "@/types/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="card spotlight glow-border flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs text-muted">{project.year} · {project.kind}</span>
        {project.featured && <Badge tone="accent">Featured</Badge>}
      </div>
      <p className="mt-2 font-serif text-2xl leading-snug">{project.title}</p>
      <p className="mt-1.5 flex-1 text-[0.95rem] text-ink-2">{project.tagline}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((tech) => (
          <li key={tech}>
            <Badge>{tech}</Badge>
          </li>
        ))}
      </ul>
    </Link>
  );
}
