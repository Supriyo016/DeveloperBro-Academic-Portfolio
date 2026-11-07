import { ArrowRight, Download, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { HeroScene } from "@/components/illustrations/HeroScene";
import { WorkbenchScene } from "@/components/illustrations/scenes-objects";
import { QuantumScene } from "@/components/illustrations/scenes-extra";
import { CollaborationScene, DiagramScene, MriScene, NeuralScene, PresentScene } from "@/components/illustrations/scenes-research";
import { JsonLd } from "@/components/layout/JsonLd";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ArrowLink, Badge, ButtonAnchor, ButtonLink, Reveal, SectionHeading } from "@/components/ui/primitives";
import { timeline } from "@/content/education";
import { heroSlides } from "@/content/home";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { dissertations } from "@/content/research";
import { evidenceLabels, researchAreas } from "@/content/research-areas";
import { getArticleMetas } from "@/lib/articles";
import { siteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: siteUrl,
  image: `${siteUrl}${profile.portrait}`,
  jobTitle: profile.role,
  sameAs: profile.social.map((item) => item.url),
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Kalyani Government Engineering College" },
    { "@type": "CollegeOrUniversity", name: "Regent Education & Research Foundation" },
  ],
  knowsAbout: ["Federated Learning", "Medical Image Analysis", "Homomorphic Encryption", "Knowledge Distillation"],
};

const slideArt: Record<string, ReactNode> = {
  profile: <HeroScene />,
  privacy: <DiagramScene />,
  medical: <MriScene />,
  compression: <NeuralScene />,
  quantum: <QuantumScene />,
  projects: <WorkbenchScene />,
  future: <PresentScene />,
};

export default function HomePage() {
  const featuredProjects = projects.filter((project) => project.featured && !project.researchSlug);
  const articles = getArticleMetas().slice(0, 3);
  const areas = researchAreas.filter((area) => area.evidence === "dissertation" || area.evidence === "ongoing").slice(0, 6);

  const slides = heroSlides.map((slide) => {
    return (
      <div key={slide.id} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="eyebrow slide-part">{slide.eyebrow}</p>
          <h2 className="slide-part mt-3 text-[2.2rem] leading-[1.08] sm:text-5xl xl:text-[3.4rem]">{slide.title}</h2>
          <p className="slide-part mt-4 max-w-xl text-lg text-ink-2">{slide.body}</p>
          <div className="slide-part"><ArrowLink href={slide.href} className="mt-3">{slide.linkLabel}</ArrowLink></div>
        </div>
        <div className="slide-art mx-auto w-full max-w-[17rem] sm:max-w-sm lg:max-w-md">{slideArt[slide.id]}</div>
      </div>
    );
  });

  return (
    <>
      <JsonLd data={personSchema} />

      <section className="hero-backdrop relative overflow-hidden">
        <div className="container-page pt-8 pb-12 sm:pt-10">
          <div className="flex items-center gap-3">
            <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} width={64} height={80} priority className="size-14 rounded-full object-cover object-top ring-2 ring-line" />
            <div>
              <h1 className="text-xl leading-tight tracking-normal">{profile.name}</h1>
              <p className="text-sm text-ink-2">{profile.degree}. {profile.role}.</p>
            </div>
          </div>

          <div className="mt-6">
            <HeroCarousel slides={slides} labels={heroSlides.map((slide) => slide.label)} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ButtonLink href="/research" data-magnetic>
              Explore research
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
            </ButtonLink>
            <ButtonAnchor href={profile.cvPath} download variant="secondary" data-magnetic>
              <Download className="size-4" aria-hidden />
              Download academic CV
            </ButtonAnchor>
            <ButtonLink href="/contact" variant="secondary" data-magnetic>
              <Mail className="size-4" aria-hidden />
              Contact me
            </ButtonLink>
            <SocialLinks only={["github", "linkedin"]} />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface-2/40 py-14" aria-labelledby="research-title">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading id="research-title" eyebrow="Research highlights" title="Two dissertations, one research path" />
            <ArrowLink href="/research">All research works</ArrowLink>
          </div>
          <ul className="mt-8 grid gap-4 lg:grid-cols-2">
            {dissertations.map((study, index) => (
              <Reveal as="li" key={study.slug} delay={index * 80}>
                <Link href={`/research/${study.slug}`} className="card spotlight glow-border flex h-full flex-col p-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge tone={study.status === "In progress" ? "accent" : "primary"}>{study.kind}</Badge>
                    <Badge tone={study.status === "In progress" ? "accent" : "ok"}>{study.status}</Badge>
                  </div>
                  <h3 className="mt-3 text-2xl leading-snug">{study.shortTitle}</h3>
                  <p className="mt-1 text-sm text-muted">{study.domains.slice(0, 2).join(" · ")}</p>
                  <p className="mt-3 mb-auto line-clamp-4 text-[0.95rem] text-ink-2">{study.abstract}</p>
                  <dl className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted">Methods</dt>
                      <dd className="text-ink-2">{study.methods.slice(0, 3).join(", ")}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-muted">Tools</dt>
                      <dd className="text-ink-2">{study.technologies.slice(0, 3).join(", ")}</dd>
                    </div>
                    {study.stats?.[0] && (
                      <div className="flex gap-2">
                        <dt className="w-20 shrink-0 text-muted">Result</dt>
                        <dd className="text-ink-2">{study.stats[0].value} test accuracy, simulated</dd>
                      </div>
                    )}
                  </dl>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary">
                    View details <ArrowRight className="size-3.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page pt-16" aria-labelledby="interests-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="interests-title" eyebrow="Research interests" title="What I work on" />
          <ArrowLink href="/research#interests">Explore all interests</ArrowLink>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <li key={area.id} className="card spotlight p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xl leading-snug">{area.name}</h3>
              </div>
              <p className="mt-1 text-xs text-muted">{evidenceLabels[area.evidence]}</p>
              <p className="mt-2 line-clamp-3 text-[0.95rem] text-ink-2">{area.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16" aria-labelledby="journey-title">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <SectionHeading id="journey-title" eyebrow="Academic journey" title="Computer science and engineering, step by step" />
            <ArrowLink href="/education" className="mt-4">Full timeline</ArrowLink>
          </div>
          <ol className="relative border-l border-line pl-6">
            {timeline.map((event) => (
              <li key={event.id} className="relative pb-5 last:pb-0">
                <span className="timeline-dot absolute top-2 -left-[1.82rem] size-2.5 rounded-full bg-primary ring-4 ring-bg" aria-hidden />
                <p className="font-mono text-xs text-muted">{event.period}</p>
                <p className="font-medium">{event.href ? <Link href={event.href} className="hover:text-primary">{event.title}</Link> : event.title}</p>
                <p className="text-sm text-ink-2">{event.org ?? event.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page pt-16" aria-labelledby="projects-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="projects-title" eyebrow="Featured projects" title="Built along the way" />
          <ArrowLink href="/projects">All projects</ArrowLink>
        </div>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={index * 80}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16" aria-labelledby="writing-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <SectionHeading id="writing-title" eyebrow="Latest writing" title="Research notes" />
          <ArrowLink href="/blogs">All blogs</ArrowLink>
        </div>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {articles.map((article) => (
            <li key={article.slug}>
              <Link href={`/blogs/${article.slug}`} className="group grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <span className="font-mono text-sm text-muted">{formatDate(article.date)}</span>
                <span>
                  <span className="block font-serif text-xl leading-snug transition-colors group-hover:text-primary">{article.title}</span>
                  <span className="block text-[0.95rem] text-ink-2">{article.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16">
        <Reveal className="grid items-center gap-6 rounded-2xl bg-primary px-6 py-8 text-on-primary sm:px-10 md:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="text-3xl sm:text-4xl">Working on federated learning, privacy or medical imaging?</h2>
            <p className="mt-3 max-w-xl opacity-90">I would be glad to talk about doctoral opportunities, research collaboration or technical questions.</p>
            <Link href="/contact" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-5 py-2 font-medium text-ink transition-transform hover:-translate-y-0.5">
              Get in touch <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mx-auto hidden w-full max-w-60 rounded-2xl bg-surface/95 p-2 md:block">
            <CollaborationScene />
          </div>
        </Reveal>
      </section>
    </>
  );
}
