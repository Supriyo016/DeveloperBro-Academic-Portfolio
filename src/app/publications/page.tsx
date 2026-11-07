import type { Metadata } from "next";
import Link from "next/link";
import { PapersScene } from "@/components/illustrations/scenes-objects";
import { Badge, ExternalLink, PageHeader, Reveal, SectionHeading } from "@/components/ui/primitives";
import { publications, publicationStatuses } from "@/content/publications";
import { studies } from "@/content/research";

export const metadata: Metadata = {
  title: "Publications",
  description: "Publications by status, with dissertations listed separately.",
  alternates: { canonical: "/publications" },
};

export default function PublicationsPage() {
  const grouped = publicationStatuses
    .map((status) => ({ status, items: publications.filter((publication) => publication.status === status) }))
    .filter((group) => group.items.length > 0);
  const dissertations = studies.filter((study) => study.kind.endsWith("dissertation"));

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Publications and dissertations"
        intro="I have no peer-reviewed publications yet. A manuscript is in preparation, and it will appear here with its true status as it moves forward. My dissertations are listed separately because they are not journal or conference papers."
        illustration={<PapersScene />}
      />

      <div className="container-page space-y-14">
        {grouped.map((group) => (
          <section key={group.status} aria-label={group.status}>
            <h2 className="text-3xl">{group.status}</h2>
            <ul className="mt-4 space-y-3">
              {group.items.map((publication) => (
                <Reveal as="li" key={publication.title} className="card p-5">
                  <Badge tone="accent">{publication.status}</Badge>
                  <p className="mt-2 font-serif text-xl leading-snug">{publication.title}</p>
                  <p className="mt-1 text-[0.95rem] text-ink-2">{publication.authors.join(", ")}</p>
                  {publication.venue && <p className="text-[0.95rem] text-ink-2">{publication.venue}{publication.year ? `, ${publication.year}` : ""}</p>}
                  {publication.summary && <p className="mt-1 text-[0.95rem] text-muted">{publication.summary}</p>}
                  <div className="mt-2 flex flex-wrap gap-4 text-sm">
                    {publication.doi && <ExternalLink href={`https://doi.org/${publication.doi}`}>DOI</ExternalLink>}
                    {publication.url && <ExternalLink href={publication.url}>Paper</ExternalLink>}
                    {publication.researchSlug && <Link href={`/research/${publication.researchSlug}`} className="link">Research page</Link>}
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="dissertations-title">
          <SectionHeading id="dissertations-title" title="Dissertations" />
          <p className="mt-2 max-w-2xl text-ink-2">Submitted for my degrees. Not peer-reviewed publications.</p>
          <ul className="mt-4 space-y-3">
            {dissertations.map((study) => (
              <Reveal as="li" key={study.slug}>
                <Link href={`/research/${study.slug}`} className="card card-lift block p-5">
                  <Badge tone="primary">{study.kind}</Badge>
                  <p className="mt-2 font-serif text-xl leading-snug">{study.title}</p>
                  <p className="mt-1 text-[0.95rem] text-ink-2">{study.institution}, {study.period}</p>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
