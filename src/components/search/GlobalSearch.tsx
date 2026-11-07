"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { searchItems, type SearchItem } from "@/lib/search";
import { cn } from "@/lib/utils";

function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const results = useMemo(() => searchItems(items ?? [], query), [items, query]);

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error("index unavailable");
        return response.json() as Promise<SearchItem[]>;
      })
      .then(setItems)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    document.getElementById(`search-option-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const open = (href: string) => {
    router.push(href);
    onClose();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((value) => (results.length ? (value + step + results.length) % results.length : 0));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      open(results[active].href);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Search the site"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
      className="m-auto mt-[12vh] w-[min(38rem,calc(100vw-2rem))] rounded-2xl border border-line-strong bg-surface p-0 text-ink shadow-2xl backdrop:bg-black/40"
    >
      <label className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="sr-only">Search research, projects and blogs</span>
        <input
          autoFocus
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `search-option-${active}` : undefined}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search research, projects and blogs"
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted"
        />
      </label>
      <ul id="search-results" role="listbox" aria-label="Search results" className="max-h-[50vh] overflow-y-auto p-2">
        {results.map((item, index) => (
          <li
            key={item.href}
            id={`search-option-${index}`}
            role="option"
            aria-selected={index === active}
            onClick={() => open(item.href)}
            onMouseEnter={() => setActive(index)}
            className={cn("flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2", index === active && "bg-primary-soft")}
          >
            <span>{item.title}</span>
            <span className="shrink-0 text-xs text-muted">{item.kind}</span>
          </li>
        ))}
      </ul>
      <p className="px-5 pb-4 text-sm text-muted" aria-live="polite">
        {failed ? "Search is unavailable right now." : query && items && results.length === 0 ? "No matches." : !query ? "Try federated learning, CKKS or Arduino." : ""}
      </p>
    </dialog>
  );
}

export function GlobalSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search the site" title="Search (Ctrl K)" className={cn("grid size-10 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:border-primary hover:text-primary", className)}>
        <Search className="size-4" aria-hidden />
      </button>
      {open && createPortal(<SearchDialog onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
