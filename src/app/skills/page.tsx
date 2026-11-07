import type { Metadata } from "next";
import { StudyScene } from "@/components/illustrations/scenes-research";
import { SkillExplorer } from "@/components/skills/SkillExplorer";
import { PageHeader } from "@/components/ui/primitives";
import { skillGroups } from "@/content/skills";
import { resolveWork } from "@/lib/work";

export const metadata: Metadata = {
  title: "Skills",
  description: "Technical skills grouped by area and linked to the work where each was used.",
  alternates: { canonical: "/skills" },
};

export default function SkillsPage() {
  const groups = skillGroups.map((group) => ({
    ...group,
    skills: group.skills.map((skill) => ({ name: skill.name, work: (skill.usedIn ?? []).map(resolveWork) })),
  }));

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="Skills, traced to the work"
        intro="No percentages here. Pick a skill to see where I used it, or pick a piece of work to see the skills behind it."
        illustration={<StudyScene />}
      />
      <div className="container-page">
        <SkillExplorer groups={groups} />
      </div>
    </>
  );
}
