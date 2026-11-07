"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/primitives";
import { cn, formatDate } from "@/lib/utils";
import type { ArticleMeta } from "@/types/content";
import { useBookmarks } from "./ArticleExtras";

export function filterArticles(articles: ArticleMeta[], query: string, category: string | null, tag: string | null) {
  const needle = query.trim().toLowerCase();
  return articles.filter(
    (article) =>
      (!category || article.category === category) &&
      (!tag || article.tags.includes(tag)) &&
      (!needle || [article.title, article.description, article.category, ...article.tags].join(" ").toLowerCase().includes(needle)),
  );
}

export function ArticleList({ articles }: { articles: ArticleMeta[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [savedOnly, setSavedOnly] = useState(false);
  const bookmarks = useBookmarks();

  const categories = useMemo(() => [...new Set(articles.map((article) => article.category))].sort(), [articles]);
  const tags = useMemo(() => [...new Set(articles.flatMap((article) => article.tags))].sort(), [articles]);
  const results = filterArticles(articles, query, category, tag).filter((article) => !savedOnly || bookmarks.includes(article.slug));

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-1.5">
          {[null, ...categories].map((item) => (
            <button
              key={item ?? "all"}
              type="button"
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
              className={cn("min-h-9 rounded-full border px-3 text-sm transition-colors", category === item ? "border-primary bg-primary text-on-primary" : "border-line text-ink-2 hover:border-line-strong")}
            >
              {item ?? "All categories"}
            </button>
          ))}
          <button
            type="button"
            aria-pressed={savedOnly}
            onClick={() => setSavedOnly((value) => !value)}
            className={cn("min-h-9 rounded-full border px-3 text-sm transition-colors", savedOnly ? "border-primary bg-primary text-on-primary" : "border-line text-ink-2 hover:border-line-strong")}
          >
            Saved ({bookmarks.length})
          </button>
        </div>
        <div className="flex gap-2">
          <label className="block">
            <span className="sr-only">Filter by tag</span>
            <select value={tag ?? ""} onChange={(event) => setTag(event.target.value || null)} className="h-10 max-w-36 rounded-full border border-line bg-surface px-3 text-[0.95rem]">
              <option value="">All tags</option>
              {tags.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="relative block flex-1 sm:w-48">
            <span className="sr-only">Search articles</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="h-10 w-full rounded-full border border-line bg-surface pr-3 pl-9 text-[0.95rem] placeholder:text-muted" />
          </label>
        </div>
      </div>

      <ul className="mt-6 divide-y divide-line border-y border-line" aria-live="polite">
        {results.map((article) => (
          <li key={article.slug} className="fade-in">
            <Link href={`/blogs/${article.slug}`} className="group block py-6">
              <p className="font-mono text-xs text-muted">
                {formatDate(article.date)} · {article.readingMinutes} min read · {article.category}
              </p>
              <p className="mt-1.5 font-serif text-2xl leading-snug transition-colors group-hover:text-primary sm:text-3xl">{article.title}</p>
              <p className="mt-1.5 max-w-2xl text-ink-2">{article.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {article.tags.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </Link>
          </li>
        ))}
        {results.length === 0 && <li className="py-8 text-center text-ink-2">No articles match.</li>}
      </ul>
    </div>
  );
}
