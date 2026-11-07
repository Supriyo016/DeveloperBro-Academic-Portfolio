import type { Metadata } from "next";
import Link from "next/link";
import { LabScene } from "@/components/illustrations/scenes-people";
import { InterestExplorer } from "@/components/research/InterestExplorer";
import { ResearchExplorer, type ExplorerItem } from "@/components/research/ResearchExplorer";
import { ResearchMap } from "@/components/research/ResearchMap";
import { Badge, PageHeader, Reveal, SectionHeading } from "@/components/ui/primitives";
import { proposedResearch, studies } from "@/content/research";
import { researchAreas } from "@/content/research-areas";
import { getArticleMetas } from "@/lib/articles";
import { resolveWork } from "@/lib/work";

export const metadata: Metadata = {
  title: "Research Works",
  description: "Research interests, an interactive map of how they connect, and case studies in federated learning, encryption and quantum computing.",
  alternates: { canonical: "/research" },
};

function explorerItems(): ExplorerItem[] {
  const fromStudies = studies.map((study) => ({
    title: study.shortTitle,
    href: `/research/${study.slug}`,
    kind: study.kind,
    summary: study.abstract,
    domains: study.domains,
    methods: study.methods,
    technologies: study.technologies,
    statuses: [study.status],
  }));
  const fromArticles = getArticleMetas().map((article) => ({
    title: article.title,
    href: `/blogs/${article.slug}`,
    kind: "Article",
    summary: article.description,
    domains: [article.category],
    methods: [],
    technologies: [],
    statuses: [],
  }));
  // Research Works lists only the two dissertations. Research notes are included as reading, not as works.
  return [...fromStudies, ...fromArticles];
}

export default function ResearchPage() {
  const areas = researchAreas.map(({ related, ...area }) => ({ ...area, work: related.map(resolveWork) }));

  return (
    <>
      <PageHeader
        eyebrow="Research works"
        title="Learning from data that cannot be pooled"
        intro="My work asks what changes when training is spread across institutions that cannot share their data, and how much privacy really costs. Each area below says plainly how much evidence stands behind it."
        illustration={<LabScene />}
      />

      <section className="container-page" aria-labelledby="studies-title">
        <SectionHeading id="studies-title" eyebrow="Case studies" title="Research works" />
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {studies.map((study) => (
            <Reveal as="li" key={study.slug}>
              <Link href={`/research/${study.slug}`} className="group grid gap-2 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-baseline sm:gap-6">
                <span className="font-mono text-sm text-muted">{study.period}</span>
                <span>
                  <span className="block font-serif text-2xl leading-snug transition-colors group-hover:text-primary">{study.shortTitle}</span>
                  <span className="mt-1 block text-sm text-ink-2">{study.kind}</span>
                </span>
                <Badge tone={study.status === "In progress" ? "accent" : "ok"} className="w-fit">{study.status}</Badge>
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16" aria-labelledby="map-title">
        <div className="max-w-2xl">
          <p className="eyebrow">Research map</p>
          <h2 id="map-title" className="mt-2 text-3xl sm:text-4xl">From area to problem to method to work</h2>
          <p className="mt-3 text-ink-2">Choose any box to follow its connections in both directions.</p>
        </div>
        <div className="mt-6">
          <ResearchMap />
        </div>
      </section>

      <section id="interests" className="container-page pt-16" aria-labelledby="interests-title">
        <div className="max-w-2xl">
          <p className="eyebrow">Interests</p>
          <h2 id="interests-title" className="mt-2 text-3xl sm:text-4xl">Research interest explorer</h2>
          <p className="mt-3 text-ink-2">The label beside each area shows where it stands: dissertation work, ongoing work, coursework, or a current interest with no completed work yet.</p>
        </div>
        <div className="mt-6">
          <InterestExplorer areas={areas} />
        </div>
      </section>

      <section id="proposed" className="container-page pt-16" aria-labelledby="proposed-title">
        <div className="max-w-2xl">
          <p className="eyebrow">Proposed research</p>
          <h2 id="proposed-title" className="mt-2 text-3xl sm:text-4xl">Where I would like to go next</h2>
          <p className="mt-3 text-ink-2">These are proposals, not research works. They come from the limits of my dissertation.</p>
        </div>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {proposedResearch.map((item) => (
            <li key={item.title} className="card spotlight p-5">
              <Badge>Proposed</Badge>
              <h3 className="mt-2 text-xl leading-snug">{item.title}</h3>
              <p className="mt-1.5 text-[0.95rem] text-ink-2">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page pt-16" aria-labelledby="explorer-title">
        <div className="max-w-2xl">
          <p className="eyebrow">Explorer</p>
          <h2 id="explorer-title" className="mt-2 text-3xl sm:text-4xl">Find work by topic</h2>
          <p className="mt-3 text-ink-2">Filter by domain, methodology, technology or status.</p>
        </div>
        <div className="mt-6">
          <ResearchExplorer items={explorerItems()} />
        </div>
      </section>
    </>
  );
}
