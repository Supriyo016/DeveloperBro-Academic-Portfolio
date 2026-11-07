import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/layout/JsonLd";
import { ClientDistribution } from "@/components/research/ClientDistribution";
import { CnnArchitecture } from "@/components/research/CnnArchitecture";
import { ClassHeatmap, GroupedF1, Podium } from "@/components/research/ComparisonCharts";
import { FederatedArchitecture } from "@/components/research/FederatedArchitecture";
import { ModelResults } from "@/components/research/ModelResults";
import { MriGallery } from "@/components/research/MriGallery";
import { StudyHero } from "@/components/research/StudyHero";
import { PipelineViewer } from "@/components/research/PipelineViewer";
import { ResultsExplorer } from "@/components/research/ResultsExplorer";
import { ComparisonTable } from "@/components/research/ComparisonTable";
import { CopyButton } from "@/components/shared/CopyButton";
import { ArrowLink, Badge, ExternalLink } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { getStudy, studies } from "@/content/research";
import { siteUrl } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getStudy((await params).slug);
  if (!study) return {};
  return {
    title: study.shortTitle,
    description: study.abstract.slice(0, 160),
    alternates: { canonical: `/research/${study.slug}` },
    openGraph: { type: "article", title: study.shortTitle, description: study.abstract.slice(0, 160) },
  };
}

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-ink-2">{children}</div>
    </section>
  );
}

const Bullets = ({ items }: { items: string[] }) => (
  <ul className="list-disc space-y-2 pl-5 marker:text-primary">
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
);

export default async function StudyPage({ params }: Props) {
  const study = getStudy((await params).slug);
  if (!study) notFound();

  const interactive = study.slug === "federated-alzheimers-detection";
  const sections = [
    study.motivation && ["motivation", "Motivation"],
    study.problem && ["problem", "Problem statement"],
    study.gaps && ["gaps", "Research gaps"],
    study.objectives && ["objectives", "Objectives"],
    study.methodology && ["methodology", "Methodology"],
    study.dataset && ["dataset", "Dataset"],
    study.models && ["models", "Models and algorithms"],
    interactive && ["architecture", "System architecture"],
    interactive && ["samples", "MRI samples and feature maps"],
    study.setup && ["setup", "Experimental setup"],
    study.metrics && ["metrics", "Evaluation metrics"],
    interactive && ["results", "Results"],
    interactive && ["comparison", "Comparative analysis"],
    study.conclusions && ["conclusions", "Conclusions"],
    study.contributions && ["contributions", "Contributions"],
    study.limitations && ["limitations", "Limitations"],
    study.future && ["future", "Future directions"],
    study.references && ["references", "References"],
    study.citation && ["cite", "Cite this work"],
  ].filter(Boolean) as [string, string][];

  return (
    <article className="container-page pt-10">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": study.status === "Completed" ? "Thesis" : "ResearchProject",
          name: study.title,
          abstract: study.abstract,
          url: `${siteUrl}/research/${study.slug}`,
          author: { "@type": "Person", name: profile.name },
          ...(study.institution ? { sourceOrganization: study.institution } : {}),
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/research" className="hover:text-primary">Research</Link> / <span>{study.shortTitle}</span>
      </nav>

      <header className="mt-5 grid items-center gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">{study.kind}</Badge>
            <Badge tone={study.status === "In progress" ? "accent" : "ok"}>{study.status}</Badge>
            <Badge>{study.period}</Badge>
          </div>
          <h1 className="headline mt-4 text-3xl leading-tight sm:text-[2.6rem]">{study.title}</h1>
          {study.institution && <p className="mt-3 text-ink-2">{study.institution}</p>}
          {study.supervisors && (
            <div className="mt-3 text-[0.95rem] text-ink-2">
              <p className="text-muted">Supervised by</p>
              <ul>
                {study.supervisors.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <StudyHero study={study} />
      </header>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_13rem]">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="abstract-title">
            <h2 id="abstract-title" className="eyebrow">Abstract</h2>
            <p className="mt-3 font-serif text-xl leading-relaxed sm:text-[1.4rem]">{study.abstract}</p>
            {study.stats && (
              <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-4">
                {study.stats.map((stat) => (
                  <div key={stat.label} className="bg-surface p-4">
                    <dd className="text-2xl font-medium">{stat.value}</dd>
                    <dt className="mt-0.5 text-sm text-muted">{stat.label}</dt>
                  </div>
                ))}
              </dl>
            )}
            {study.status === "In progress" && (
              <p className="mt-6 rounded-xl bg-accent-soft p-4 text-[0.95rem]">This work is in progress. It has not been published or peer reviewed, and no results are reported yet.</p>
            )}
          </section>

          {study.note && (
            <aside className="flex gap-3 rounded-xl border border-line bg-surface-2 p-5">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-medium">{study.note.title}</p>
                <p className="mt-1 text-[0.95rem] text-ink-2">{study.note.body}</p>
              </div>
            </aside>
          )}

          {study.motivation && (
            <Block id="motivation" title="Motivation">
              {study.motivation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Block>
          )}

          {study.problem && (
            <Block id="problem" title="Problem statement">
              <blockquote className="border-l-3 border-lavender pl-4 font-serif text-xl text-ink">{study.problem}</blockquote>
              {study.questions && <Bullets items={study.questions} />}
            </Block>
          )}

          {study.gaps && (
            <Block id="gaps" title="Research gaps">
              <div className="grid gap-4 sm:grid-cols-3">
                {study.gaps.map((gap) => (
                  <div key={gap.title} className="card p-4">
                    <h3 className="text-lg text-ink">{gap.title}</h3>
                    <p className="mt-1.5 text-[0.95rem]">{gap.body}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          {study.objectives && (
            <Block id="objectives" title="Objectives">
              <Bullets items={study.objectives} />
            </Block>
          )}

          {study.methodology && (
            <Block id="methodology" title="Methodology">
              <div className="grid gap-4 sm:grid-cols-2">
                {study.methodology.map((item) => (
                  <div key={item.title} className="card p-5">
                    <h3 className="text-xl text-ink">{item.title}</h3>
                    <p className="mt-2 text-[0.95rem]">{item.body}</p>
                  </div>
                ))}
              </div>
              {interactive && <ClientDistribution />}
            </Block>
          )}

          {study.dataset && (
            <Block id="dataset" title="Dataset">
              <p>{study.dataset.summary}</p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[26rem] text-left text-[0.95rem] tabular-nums">
                  <thead>
                    <tr className="border-b border-line-strong text-ink">
                      <th scope="col" className="py-2 pr-4 font-medium">Class</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Total</th>
                      <th scope="col" className="py-2 pr-4 font-medium">Training pool</th>
                      <th scope="col" className="py-2 font-medium">Test set</th>
                    </tr>
                  </thead>
                  <tbody>
                    {study.dataset.classes.map((row) => (
                      <tr key={row.name} className="border-b border-line">
                        <th scope="row" className="py-2 pr-4 font-normal">{row.name}</th>
                        <td className="py-2 pr-4">{row.total.toLocaleString("en-GB")}</td>
                        <td className="py-2 pr-4">{row.train.toLocaleString("en-GB")}</td>
                        <td className="py-2">{row.test.toLocaleString("en-GB")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ExternalLink href={study.dataset.source.href}>{study.dataset.source.label}</ExternalLink>
            </Block>
          )}

          {study.models && (
            <Block id="models" title="Models and algorithms">
              <div className="grid gap-4 sm:grid-cols-3">
                {study.models.map((model) => (
                  <div key={model.name} className="card p-4">
                    <h3 className="text-lg text-ink">{model.name}</h3>
                    <p className="text-sm text-muted">{model.role}</p>
                    <p className="mt-1.5 text-[0.95rem]">{model.detail}</p>
                  </div>
                ))}
              </div>
              {study.algorithms && (
                <dl className="divide-y divide-line border-y border-line text-[0.95rem]">
                  {study.algorithms.map((algorithm) => (
                    <div key={algorithm.name} className="grid gap-1 py-2.5 sm:grid-cols-[8rem_1fr]">
                      <dt className="font-medium text-ink">{algorithm.name}</dt>
                      <dd>{algorithm.detail}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Block>
          )}

          {interactive && (
            <Block id="architecture" title="System architecture">
              <p>Five simulated hospitals train locally and share only model weights. The map below is one round; the stepper after it walks through each stage and what the server can read.</p>
              <FederatedArchitecture />
              <PipelineViewer />
              <CnnArchitecture />
            </Block>
          )}

          {interactive && (
            <Block id="samples" title="MRI samples and feature maps">
              <MriGallery />
            </Block>
          )}

          {study.setup && (
            <Block id="setup" title="Experimental setup">
              <dl className="divide-y divide-line border-y border-line text-[0.95rem]">
                {study.setup.map((row) => (
                  <div key={row.label} className="grid gap-1 py-2.5 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-muted">{row.label}</dt>
                    <dd className="text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          {study.metrics && (
            <Block id="metrics" title="Evaluation metrics">
              <Bullets items={study.metrics} />
            </Block>
          )}

          {interactive && (
            <Block id="results" title="Results">
              <p>Choose a model, then an algorithm, to see every result from that run: scores, per-class metrics, the learning curve and the figures the notebook saved.</p>
              <ModelResults />
              {study.findings && (
                <div>
                  <h3 className="text-2xl text-ink">What the results show</h3>
                  <div className="mt-3">
                    <Bullets items={study.findings} />
                  </div>
                </div>
              )}
            </Block>
          )}

          {interactive && (
            <Block id="comparison" title="Comparative analysis">
              <p>All nine configurations side by side.</p>
              <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
                <Podium />
                <GroupedF1 />
              </div>
              <ClassHeatmap />
              <ResultsExplorer />
              <h3 className="text-2xl text-ink">Full table</h3>
              <p>Best accuracy first. Rounds to 90% is the first round where test accuracy reached 90%.</p>
              <ComparisonTable />
            </Block>
          )}

          {study.conclusions && (
            <Block id="conclusions" title="Conclusions">
              <ol className="grid gap-3 sm:grid-cols-2">
                {study.conclusions.map((item, index) => (
                  <li key={item} className="card spotlight relative overflow-hidden p-5 pl-14">
                    <span className="absolute top-4 left-4 grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-on-primary">{index + 1}</span>
                    <p className="text-[0.97rem]">{item}</p>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {study.contributions && (
            <Block id="contributions" title="Contributions">
              <Bullets items={study.contributions} />
            </Block>
          )}

          {study.limitations && (
            <Block id="limitations" title="Limitations">
              <Bullets items={study.limitations} />
            </Block>
          )}

          {study.future && (
            <Block id="future" title="Future directions">
              <Bullets items={study.future} />
            </Block>
          )}

          {study.references && (
            <Block id="references" title="References">
              <ol className="list-decimal space-y-2 pl-5 text-[0.95rem]">
                {study.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="link">{reference.text}</a>
                  </li>
                ))}
              </ol>
            </Block>
          )}

          {study.citation && (
            <Block id="cite" title="Cite this work">
              <p className="rounded-lg bg-surface-2 p-3 text-[0.95rem]">{study.citation.plain}</p>
              <div className="flex flex-wrap gap-2">
                <CopyButton value={study.citation.plain} label="Copy citation" />
                <CopyButton value={study.citation.bibtex} label="Copy BibTeX" />
              </div>
            </Block>
          )}

          <section aria-labelledby="tools-title" className="border-t border-line pt-8">
            <h2 id="tools-title" className="eyebrow">Tools and technologies</h2>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {study.technologies.map((tech) => (
                <li key={tech}>
                  <Badge>{tech}</Badge>
                </li>
              ))}
            </ul>
            {study.links?.map((link) => (
              <ExternalLink key={link.href} href={link.href} className="mt-4 mr-4">{link.label}</ExternalLink>
            ))}
          </section>

          <nav aria-label="More research" className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
            {studies
              .filter((other) => other.slug !== study.slug)
              .map((other) => (
                <ArrowLink key={other.slug} href={`/research/${other.slug}`}>{other.shortTitle}</ArrowLink>
              ))}
          </nav>
        </div>

        {sections.length > 2 && (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="eyebrow">On this page</p>
              <ul className="mt-3 space-y-1.5 border-l border-line text-sm">
                {sections.map(([id, label]) => (
                  <li key={id}>
                    <a href={`#${id}`} className="-ml-px block border-l border-transparent pl-3 text-ink-2 transition-colors hover:border-primary hover:text-primary">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        )}
      </div>
    </article>
  );
}
