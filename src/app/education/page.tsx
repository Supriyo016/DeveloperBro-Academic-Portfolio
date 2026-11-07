import type { Metadata } from "next";
import { Timeline } from "@/components/education/Timeline";
import { GraduationScene } from "@/components/illustrations/scenes-people";
import { PageHeader } from "@/components/ui/primitives";
import { timeline } from "@/content/education";

export const metadata: Metadata = {
  title: "Academic Journey",
  description: "Supriyo Sarkar's computer science and engineering journey: degrees, research works and projects.",
  alternates: { canonical: "/education" },
};

export default function EducationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academic journey"
        title="Six years in computer science"
        intro="From a first degree in Kolkata to an M.Tech dissertation on federated learning, most recent first."
        illustration={<GraduationScene />}
      />
      <div className="container-page pt-4">
        <Timeline events={timeline} />
      </div>
    </>
  );
}
