import "katex/dist/katex.min.css";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReadingProgress, ReadingTools, ShareButtons } from "@/components/blogs/ArticleExtras";
import { JsonLd } from "@/components/layout/JsonLd";
import { Badge, ExternalLink } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { getAdjacentArticles, getArticle, getRelatedArticles } from "@/lib/articles";
import { renderArticle } from "@/lib/mdx";
import { rssAlternate, siteUrl } from "@/lib/site";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/blogs/${article.slug}`, types: rssAlternate },
    openGraph: { type: "article", title: article.title, description: article.description, publishedTime: article.date, modifiedTime: article.updated },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const content = await renderArticle(article.source);
  const related = getRelatedArticles(article);
  const { previous, next } = getAdjacentArticles(article.slug);
  const url = `${siteUrl}/blogs/${article.slug}`;

  return (
    <>
      <ReadingProgress />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.updated ?? article.date,
          url,
          keywords: article.tags.join(", "),
          author: { "@type": "Person", name: profile.name },
        }}
      />
      <div className="container-page grid gap-12 pt-10 lg:grid-cols-[1fr_14rem]">
        <article className="reading-center min-w-0 max-w-[44rem]">
          <nav aria-label="Breadcrumb" className="text-sm text-muted">
            <Link href="/blogs" className="hover:text-primary">Blogs</Link> / <span>{article.category}</span>
          </nav>
          <header className="mt-4">
            <h1 className="text-4xl leading-tight sm:text-5xl">{article.title}</h1>
            <p className="mt-4 font-serif text-xl text-ink-2">{article.description}</p>
            <p className="mt-4 font-mono text-sm text-muted">
              {formatDate(article.date)}
              {article.updated && ` · Updated ${formatDate(article.updated)}`} · {article.readingMinutes} min read
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="mt-4">
              <ReadingTools slug={article.slug} />
            </div>
          </header>
          <div className="prose-article mt-8">{content}</div>

          {article.references.length > 0 && (
            <section aria-labelledby="references-title" className="mt-10 border-t border-line pt-6">
              <h2 id="references-title" className="text-2xl">References</h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.95rem] text-ink-2">
                {article.references.map((reference) => (
                  <li key={reference.url}>
                    <a href={reference.url} target="_blank" rel="noopener noreferrer" className="link">{reference.text}</a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-10 border-t border-line pt-5">
            <ShareButtons title={article.title} url={url} />
          </div>

          <nav aria-label="Previous and next articles" className="reading-hide mt-8 grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link href={`/blogs/${previous.slug}`} className="card card-lift block p-4">
                <span className="inline-flex items-center gap-1 text-sm text-muted"><ArrowLeft className="size-3.5" aria-hidden /> Previous</span>
                <span className="mt-1 block font-serif text-lg leading-snug">{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/blogs/${next.slug}`} className="card card-lift block p-4 text-right">
                <span className="inline-flex items-center gap-1 text-sm text-muted">Next <ArrowRight className="size-3.5" aria-hidden /></span>
                <span className="mt-1 block font-serif text-lg leading-snug">{next.title}</span>
              </Link>
            )}
          </nav>
        </article>

        <aside className="reading-hide hidden lg:block">
          <nav aria-label="Table of contents" className="sticky top-24">
            <p className="eyebrow">Contents</p>
            <ul className="mt-3 space-y-1.5 border-l border-line text-sm">
              {article.headings.map((heading) => (
                <li key={heading.id}>
                  <a href={`#${heading.id}`} className="-ml-px block border-l border-transparent pl-3 text-ink-2 transition-colors hover:border-primary hover:text-primary">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="reading-hide container-page mt-14" aria-labelledby="related-title">
          <h2 id="related-title" className="text-2xl">Related notes</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/blogs/${item.slug}`} className="card card-lift block h-full p-5">
                  <p className="font-serif text-xl leading-snug">{item.title}</p>
                  <p className="mt-1 text-[0.95rem] text-ink-2">{item.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="reading-hide container-page mt-6 text-sm">
        <ExternalLink href="/feed.xml">RSS feed</ExternalLink>
      </p>
    </>
  );
}
