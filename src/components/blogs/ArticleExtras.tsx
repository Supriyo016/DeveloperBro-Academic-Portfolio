"use client";

import { Bookmark, BookmarkCheck, Glasses, Share2 } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CopyButton } from "@/components/shared/CopyButton";
import { useScrollFrame } from "@/hooks/useScrollFrame";

const BOOKMARKS_KEY = "bookmarked-articles";

function readBookmarks(): string[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(BOOKMARKS_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

const bookmarkSnapshot = () => readBookmarks().join("|");

function subscribeBookmarks(callback: () => void) {
  window.addEventListener("bookmarkchange", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("bookmarkchange", callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBookmarks(): string[] {
  const raw = useSyncExternalStore(subscribeBookmarks, bookmarkSnapshot, () => "");
  return raw ? raw.split("|") : [];
}

function toggleBookmark(slug: string) {
  const current = readBookmarks();
  const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  } catch {
    return;
  }
  window.dispatchEvent(new Event("bookmarkchange"));
}

export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useScrollFrame(() => {
    const article = document.querySelector("article");
    if (!article || !bar.current) return;
    const box = article.getBoundingClientRect();
    const total = box.height - window.innerHeight;
    const ratio = total <= 0 ? 1 : Math.min(Math.max(-box.top / total, 0), 1);
    bar.current.style.transform = `scaleX(${ratio})`;
  });

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden>
      <div ref={bar} data-testid="reading-progress" className="h-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}

const chip = "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-ink-2 transition-colors hover:border-primary hover:text-primary";

export function ReadingTools({ slug }: { slug: string }) {
  const bookmarks = useBookmarks();
  const [focus, setFocus] = useState(false);
  const saved = bookmarks.includes(slug);

  useEffect(() => {
    const root = document.documentElement;
    if (focus) root.dataset.reading = "true";
    else delete root.dataset.reading;
    return () => {
      delete root.dataset.reading;
    };
  }, [focus]);

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button type="button" aria-pressed={saved} onClick={() => toggleBookmark(slug)} className={chip}>
        {saved ? <BookmarkCheck className="size-3.5" aria-hidden /> : <Bookmark className="size-3.5" aria-hidden />}
        {saved ? "Saved" : "Save"}
      </button>
      <button type="button" aria-pressed={focus} onClick={() => setFocus((value) => !value)} className={chip}>
        <Glasses className="size-3.5" aria-hidden />
        {focus ? "Exit reading mode" : "Reading mode"}
      </button>
    </div>
  );
}

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-sm text-muted">
        <Share2 className="size-4" aria-hidden /> Share
      </span>
      <CopyButton value={url} label="Copy link" />
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className={chip}>
        LinkedIn
      </a>
      <a href={`https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer" className={chip}>
        X
      </a>
    </div>
  );
}
