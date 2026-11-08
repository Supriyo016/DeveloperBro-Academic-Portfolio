import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";
import { z } from "zod";
import type { ArticleMeta } from "@/types/content";

const ARTICLES_DIR = path.join(process.cwd(), "src/content/articles");
const WORDS_PER_MINUTE = 220;

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const frontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: isoDate,
  updated: isoDate.optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1),
  references: z.array(z.object({ text: z.string().min(1), url: z.url({ protocol: /^https?$/ }) })).default([]),
});

export interface Article extends ArticleMeta {
  source: string;
  headings: { id: string; text: string; level: number }[];
}

export function extractHeadings(source: string): Article["headings"] {
  const slugger = new GithubSlugger();
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  return [...withoutCode.matchAll(/^(#{2,3})\s+(.+)$/gm)].map((match) => {
    const text = (match[2] ?? "").trim();
    return { id: slugger.slug(text), text, level: (match[1] ?? "").length };
  });
}

export function estimateReadingMinutes(source: string): number {
  const words = source.replace(/```[\s\S]*?```/g, "").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

let cache: Article[] | undefined;

export function getArticles(): Article[] {
  if (cache) return cache;
  cache = readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const { data, content } = matter(readFileSync(path.join(ARTICLES_DIR, file), "utf8"));
      return {
        ...frontmatterSchema.parse(data),
        slug: file.replace(/\.mdx$/, ""),
        source: content,
        readingMinutes: estimateReadingMinutes(content),
        headings: extractHeadings(content),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
  return cache;
}

export const getArticle = (slug: string) => getArticles().find((article) => article.slug === slug);

export function getArticleMetas(): ArticleMeta[] {
  return getArticles().map(({ slug, title, description, date, updated, category, tags, references, readingMinutes }) => ({
    slug,
    title,
    description,
    date,
    updated,
    category,
    tags,
    references,
    readingMinutes,
  }));
}

export function getRelatedArticles(article: ArticleMeta, limit = 2): ArticleMeta[] {
  return getArticleMetas()
    .filter((other) => other.slug !== article.slug)
    .map((other) => ({ other, score: other.tags.filter((tag) => article.tags.includes(tag)).length + (other.category === article.category ? 1 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ other }) => other);
}

export function getAdjacentArticles(slug: string): { previous?: ArticleMeta; next?: ArticleMeta } {
  const metas = getArticleMetas();
  const index = metas.findIndex((article) => article.slug === slug);
  return { previous: metas[index + 1], next: index > 0 ? metas[index - 1] : undefined };
}
