import type { Metadata } from "next";
import { WorkbenchScene } from "@/components/illustrations/scenes-objects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { PageHeader } from "@/components/ui/primitives";
import { projectCategories, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: "Research, embedded and web projects with filters, search and detail pages.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Projects"
        intro="From a federated learning benchmark to an assistive device built on an Arduino. Filter by area or technology."
        illustration={<WorkbenchScene />}
      />
      <div className="container-page">
        <ProjectExplorer projects={projects} categories={projectCategories} />
      </div>
    </>
  );
}
