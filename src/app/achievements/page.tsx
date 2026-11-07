import type { Metadata } from "next";
import Link from "next/link";
import { AwardScene } from "@/components/illustrations/scenes-objects";
import { Badge, PageHeader, Reveal } from "@/components/ui/primitives";
import { achievements, courses } from "@/content/achievements";
import type { Achievement, Course } from "@/types/content";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Academic achievements, competitive examinations, hackathons and courses.",
  alternates: { canonical: "/achievements" },
};

const groups: Achievement["group"][] = ["Academic achievements", "Competitive examinations", "Hackathons"];
const topics: Course["topic"][] = ["Machine Learning", "Programming", "Web Development", "Professional Skills"];

export default function AchievementsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Achievements"
        title="Achievements and certifications"
        intro="Results, examinations and courses, as listed on my academic CV."
        illustration={<AwardScene />}
      />
      <div className="container-page space-y-12">
        {groups.map((group) => (
          <section key={group} aria-label={group}>
            <h2 className="text-3xl">{group}</h2>
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {achievements
                .filter((item) => item.group === group)
                .map((item) => (
                  <Reveal as="li" key={item.title} className="card p-5">
                    <p className="font-mono text-sm text-muted">{item.year}</p>
                    <p className="mt-1 font-serif text-xl leading-snug">{item.title}</p>
                    <p className="mt-1 text-[0.95rem] text-ink-2">{item.detail}</p>
                    {item.href && <Link href={item.href} className="link mt-2 inline-block text-sm">View project</Link>}
                  </Reveal>
                ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="courses">
          <h2 id="courses" className="text-3xl">Online courses and certifications</h2>
          <div className="mt-4 grid gap-x-10 gap-y-6 md:grid-cols-2">
            {topics.map((topic) => (
              <div key={topic}>
                <h3 className="eyebrow">{topic}</h3>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {courses
                    .filter((course) => course.topic === topic)
                    .map((course) => (
                      <li key={course.title} className="flex items-start justify-between gap-3 py-2.5">
                        <span className="text-[0.95rem]">{course.title}</span>
                        <Badge className="shrink-0">{course.provider}</Badge>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
