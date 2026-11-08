import type { Metadata } from "next";
import Link from "next/link";
import { AwardScene } from "@/components/illustrations/scenes-objects";
import { PageHeader, Reveal } from "@/components/ui/primitives";
import { CourseTable } from "@/components/shared/CourseTable";
import { achievements } from "@/content/achievements";
import type { Achievement } from "@/types/content";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Academic achievements, competitive examinations, hackathons and courses.",
  alternates: { canonical: "/achievements" },
};

const groups: Achievement["group"][] = ["Academic achievements", "Competitive examinations", "Hackathons"];

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
          <p className="mt-2 text-ink-2">Each certificate can be checked on the platform that issued it.</p>
          <div className="mt-4">
            <CourseTable />
          </div>
        </section>
      </div>
    </>
  );
}
