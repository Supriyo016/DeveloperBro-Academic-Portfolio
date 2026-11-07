import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CvViewer } from "@/components/cv/CvViewer";
import { WritingScene } from "@/components/illustrations/scenes-objects";
import { achievements, courses } from "@/content/achievements";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { studies } from "@/content/research";
import { researchAreas } from "@/content/research-areas";
import { timeline } from "@/content/education";

export const metadata: Metadata = {
  title: "Academic CV",
  description: "Read, print or download the academic CV of Supriyo Sarkar.",
  alternates: { canonical: "/cv" },
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line py-5 print:break-inside-avoid">
      <h2 className="text-xl">{title}</h2>
      <div className="mt-2 text-[0.95rem] text-ink-2">{children}</div>
    </section>
  );
}

export default function CvPage() {
  const degrees = timeline.filter((event) => event.kind === "degree");
  const dissertations = studies.filter((study) => study.kind.endsWith("dissertation"));
  const otherProjects = projects.filter((project) => !project.researchSlug);

  return (
    <div className="container-page max-w-4xl pt-12">
      <div className="no-print mb-6 flex items-center justify-between gap-6">
        <div>
          <p className="eyebrow">Academic CV</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Curriculum vitae</h1>
        </div>
        <div className="hidden w-44 sm:block">
          <WritingScene />
        </div>
      </div>
      <CvViewer>
        <div className="card p-5 sm:p-8 print:border-0 print:p-0">
          <header>
            <p className="font-serif text-3xl">{profile.name}</p>
            <p className="text-ink-2">{profile.degree}</p>
            <p className="mt-1 text-sm break-words text-muted">
              {profile.email} · github.com/{profile.githubUser} · linkedin.com/in/supriyo-sarkar
            </p>
          </header>
          <div className="mt-5">
            <Section title="Research interests">
              <p>{researchAreas.map((area) => area.name).join(", ")}.</p>
            </Section>
            <Section title="Education">
              <ul className="space-y-2">
                {degrees.map((degree) => (
                  <li key={degree.id}>
                    <p className="font-medium text-ink">{degree.title}</p>
                    <p>{degree.org}, {degree.period}.</p>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Dissertations">
              <ul className="space-y-3">
                {dissertations.map((study) => (
                  <li key={study.slug}>
                    <p className="font-medium text-ink">{study.title}</p>
                    <p>{study.kind}, {study.period}.</p>
                    <p>{study.abstract}</p>
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Selected projects">
              <ul className="space-y-1.5">
                {otherProjects.map((project) => (
                  <li key={project.slug}>
                    <span className="font-medium text-ink">{project.title}.</span> {project.tagline}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Achievements">
              <ul className="space-y-1">
                {achievements
                  .filter((item) => item.group !== "Academic achievements")
                  .map((item) => (
                    <li key={item.title}>
                      <span className="font-medium text-ink">{item.title}.</span> {item.detail}
                    </li>
                  ))}
              </ul>
            </Section>
            <Section title="Courses and certifications">
              <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {courses.map((course) => (
                  <li key={course.title}>{course.title} ({course.provider})</li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      </CvViewer>
    </div>
  );
}
