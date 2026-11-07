import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RepoStats } from "@/components/projects/RepoStats";
import { ArrowLink, Badge, ExternalLink } from "@/components/ui/primitives";
import { getProject } from "@/content/projects";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  return (
    <article className="container-page max-w-3xl pt-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/projects" className="hover:text-primary">Projects</Link> / <span>{project.title}</span>
      </nav>
      <header className="mt-5">
        <div className="flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <Badge key={category} tone="primary">{category}</Badge>
          ))}
          <Badge>{project.year}</Badge>
          <Badge tone="accent">{project.kind}</Badge>
        </div>
        <h1 className="mt-4 text-4xl sm:text-5xl">{project.title}</h1>
        <p className="mt-3 font-serif text-xl text-ink-2">{project.tagline}</p>
      </header>

      <div className="mt-8 space-y-4 text-ink-2">
        {project.overview.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {project.problem && (
        <section className="mt-8" aria-labelledby="problem-title">
          <h2 id="problem-title" className="text-2xl">Problem</h2>
          <p className="mt-2 text-ink-2">{project.problem}</p>
        </section>
      )}

      {project.objectives && (
        <section className="mt-8" aria-labelledby="objectives-title">
          <h2 id="objectives-title" className="text-2xl">Objectives</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-primary">
            {project.objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {project.architecture && (
        <section className="mt-8" aria-labelledby="architecture-title">
          <h2 id="architecture-title" className="text-2xl">How it works</h2>
          <ol className="mt-3 grid gap-3 sm:grid-cols-3">
            {project.architecture.map((step, index) => (
              <li key={step.title} className="card p-4">
                <span className="font-mono text-xs text-muted">{index + 1}</span>
                <h3 className="text-lg">{step.title}</h3>
                <p className="mt-1 text-[0.95rem] text-ink-2">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {project.image && (
        <figure className="card mt-8 overflow-hidden">
          <div className="zoom-media bg-white p-2">
            <Image src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="(min-width: 768px) 720px, 100vw" className="mx-auto h-auto w-full" />
          </div>
          <figcaption className="border-t border-line p-3 text-sm text-muted">{project.image.caption}</figcaption>
        </figure>
      )}

      {project.highlights && (
        <section className="mt-8" aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="text-2xl">Main features</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-primary">
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {project.implementation && (
        <section className="mt-8" aria-labelledby="implementation-title">
          <h2 id="implementation-title" className="text-2xl">Implementation details</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-primary">
            {project.implementation.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {project.learning && (
        <section className="mt-8" aria-labelledby="learning-title">
          <h2 id="learning-title" className="text-2xl">Challenges and learning outcomes</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-ink-2 marker:text-primary">
            {project.learning.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8 border-t border-line pt-6" aria-labelledby="stack-title">
        <h2 id="stack-title" className="eyebrow">Technologies</h2>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li key={tech}>
              <Badge>{tech}</Badge>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
          {project.repo && <ExternalLink href={project.repo}>Source on GitHub</ExternalLink>}
          {project.live && <ExternalLink href={project.live}>Live site</ExternalLink>}
          {project.demo && <ExternalLink href={project.demo}>Video demonstration</ExternalLink>}
          {project.researchSlug && <ArrowLink href={`/research/${project.researchSlug}`}>Read the research</ArrowLink>}
        </div>
        {project.repoName && (
          <Suspense fallback={<div className="skeleton mt-4 h-5 w-64" />}>
            <RepoStats name={project.repoName} />
          </Suspense>
        )}
      </section>
    </article>
  );
}
