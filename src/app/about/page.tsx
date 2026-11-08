import { Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { LibraryScene } from "@/components/illustrations/scenes-research";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { ArrowLink, Badge, ButtonAnchor, ButtonLink, Reveal } from "@/components/ui/primitives";
import { achievements } from "@/content/achievements";
import { timeline } from "@/content/education";
import { about, education, profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { evidenceLabels, researchAreas } from "@/content/research-areas";
import { skillGroups } from "@/content/skills";
import { CourseTable } from "@/components/shared/CourseTable";

export const metadata: Metadata = {
  title: "About Me",
  description: "Academic background, qualifications, research journey, skills, courses and goals of Supriyo Sarkar.",
  alternates: { canonical: "/about" },
};

const sections = [
  ["introduction", "Introduction"],
  ["background", "Academic background"],
  ["qualifications", "Educational qualifications"],
  ["interests", "Research interests"],
  ["journey", "Research journey"],
  ["dissertations", "Dissertation work"],
  ["skills", "Technical skills"],
  ["projects", "Academic projects"],
  ["courses", "Courses and certifications"],
  ["achievements", "Achievements"],
  ["milestones", "Research works and projects"],
  ["languages", "Languages"],
  ["personal", "Personal interests"],
  ["goals", "Future research goals"],
] as const;

function Chapter({ id, title, children }: { id: (typeof sections)[number][0]; title: string; children: ReactNode }) {
  return (
    <Reveal as="section" className="border-t border-line py-7">
      <span id={id} className="block" aria-hidden />
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-3 space-y-3 text-ink-2">{children}</div>
    </Reveal>
  );
}

const Tags = ({ items }: { items: readonly string[] }) => (
  <ul className="flex flex-wrap gap-1.5">
    {items.map((item) => (
      <li key={item}><Badge>{item}</Badge></li>
    ))}
  </ul>
);

export default function AboutPage() {
  const dissertations = studies.filter((study) => study.kind.endsWith("dissertation"));
  const academicProjects = projects.filter((project) => project.kind === "Academic project");
  const milestones = timeline.filter((event) => event.kind !== "degree");
  // Marks appear on this page only, in Educational qualifications.
  const skills = skillGroups.filter((group) => group.id !== "methods");

  return (
    <div className="container-page pt-12 sm:pt-16">
      <header className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-5">
            <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} width={120} height={150} priority className="h-28 w-[5.6rem] shrink-0 rounded-xl object-cover object-top ring-1 ring-line" />
            <div>
              <p className="eyebrow">About me</p>
              <h1 className="mt-2 text-4xl sm:text-5xl">{profile.name}</h1>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <ButtonAnchor href={profile.cvPath} download>
              <Download className="size-4" aria-hidden /> Download academic CV
            </ButtonAnchor>
            <ButtonLink href="/cv" variant="secondary">Preview CV</ButtonLink>
            <SocialLinks />
          </div>
        </div>
        <div className="mx-auto w-full max-w-xs">
          <LibraryScene />
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_14rem]">
        <div className="min-w-0 max-w-3xl">
          <Chapter id="introduction" title="Professional introduction">
            <p className="font-serif text-xl leading-relaxed text-ink">{profile.shortBio}</p>
          </Chapter>

          <Chapter id="background" title="Academic background">
            {about.background.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Chapter>

          <Chapter id="qualifications" title="Educational qualifications">
            <ul className="divide-y divide-line border-y border-line text-[0.95rem]">
              {education.map((item) => (
                <li key={item.title} className="grid gap-1 py-3 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div>
                    <p className="font-medium text-ink">{item.title}</p>
                    <p>{item.institution}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-mono text-sm text-muted">{item.period}</p>
                    <p className="font-medium text-ink">{item.result}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="interests" title="Research interests">
            <ul className="grid gap-2 sm:grid-cols-2">
              {researchAreas.map((area) => (
                <li key={area.id} className="rounded-lg border border-line px-3 py-2">
                  <p className="text-ink">{area.name}</p>
                  <p className="text-xs text-muted">{evidenceLabels[area.evidence]}</p>
                </li>
              ))}
            </ul>
            <ArrowLink href="/research#interests">Explore research interests</ArrowLink>
          </Chapter>

          <Chapter id="journey" title="Research journey">
            {about.journey.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <h3 className="pt-2 text-xl text-ink">How I work</h3>
            {about.philosophy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Chapter>

          <Chapter id="dissertations" title="Dissertation and thesis work">
            <ul className="space-y-3">
              {dissertations.map((study) => (
                <li key={study.slug}>
                  <Link href={`/research/${study.slug}`} className="card card-lift block p-4">
                    <Badge tone="primary">{study.kind}</Badge>
                    <p className="mt-2 font-serif text-lg leading-snug text-ink">{study.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="skills" title="Technical skills">
            <div className="grid gap-3 sm:grid-cols-2">
              {skills.map((group) => (
                <div key={group.id} className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="text-sm font-semibold text-ink">{group.name}</h3>
                  <p className="mb-2 text-xs text-muted">{group.blurb}</p>
                  <Tags items={group.skills.map((skill) => skill.name)} />
                </div>
              ))}
              <div className="rounded-xl border border-line bg-surface p-4">
                <h3 className="text-sm font-semibold text-ink">Soft skills</h3>
                <p className="mb-2 text-xs text-muted">How I work with people.</p>
                <Tags items={profile.softSkills} />
              </div>
            </div>
            <ArrowLink href="/skills">See where each skill was used</ArrowLink>
          </Chapter>

          <Chapter id="projects" title="Academic projects">
            <ul className="space-y-2">
              {academicProjects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`} className="link">{project.title}</Link>. {project.tagline}
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="courses" title="Courses and certifications">
            <CourseTable />
          </Chapter>

          <Chapter id="achievements" title="Achievements">
            <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
              {achievements.filter((item) => item.group !== "Academic achievements").map((item) => (
                <li key={item.title}><span className="text-ink">{item.title}.</span> {item.detail}</li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="milestones" title="Research works and projects">
            <ol className="space-y-2 border-l border-line pl-4 text-[0.95rem]">
              {milestones.map((event) => (
                <li key={event.id}>
                  <span className="font-mono text-sm text-muted">{event.period}</span>{" "}
                  {event.href ? <Link href={event.href} className="link">{event.title}</Link> : <span className="text-ink">{event.title}</span>}
                </li>
              ))}
            </ol>
            <ArrowLink href="/education">Full timeline</ArrowLink>
          </Chapter>

          <Chapter id="languages" title="Languages">
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {profile.languages.map((language) => (
                <li key={language.name}>
                  <p className="text-ink">{language.name}</p>
                  <p className="text-sm text-muted">{language.level}</p>
                </li>
              ))}
            </ul>
          </Chapter>

          <Chapter id="personal" title="Personal interests">
            <p>{profile.hobbies.join(", ")}.</p>
            {about.interests.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </Chapter>

          <Chapter id="goals" title="Future research goals">
            <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
              {about.objectives.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Chapter>
        </div>

        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24">
            <p className="eyebrow">On this page</p>
            <ul className="mt-3 space-y-1 border-l border-line text-sm">
              {sections.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 text-ink-2 transition-colors hover:border-primary hover:text-primary">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}
