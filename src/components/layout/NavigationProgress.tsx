"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Shows that the site is responding while the next page loads: a moving bar at once, and after a
// short wait (a slow connection) a small card with an animated brain and travelling dots.
const SLOW_MS = 700;
const GIVE_UP_MS = 15000;

function isInternalNavigation(event: MouseEvent): boolean {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const link = (event.target as Element | null)?.closest("a");
  if (!link || link.target === "_blank" || link.hasAttribute("download")) return false;
  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;
  return url.pathname !== window.location.pathname || url.search !== window.location.search;
}

export function NavigationProgress() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "slow">("idle");

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isInternalNavigation(event)) setState("loading");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (state !== "loading") return;
    const slow = window.setTimeout(() => setState("slow"), SLOW_MS);
    const stop = window.setTimeout(() => setState("idle"), GIVE_UP_MS);
    return () => {
      window.clearTimeout(slow);
      window.clearTimeout(stop);
    };
  }, [state]);

  // The new page has arrived.
  const [arrived, setArrived] = useState(`${pathname}?${search}`);
  const key = `${pathname}?${search}`;
  if (key !== arrived) {
    setArrived(key);
    setState("idle");
  }

  if (state === "idle") return null;
  return (
    <div className="no-print" role="status" aria-live="polite">
      <span className="nav-bar" aria-hidden />
      {state === "slow" && (
        <div className="nav-card fixed top-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-surface px-4 py-2 shadow-xl">
          <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--line)" strokeWidth="3" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="30 96" strokeLinecap="round" className="nav-spin" />
            <path d="M18 30c-4 0-6-3-6-6s2-5 4-5c0-3 3-5 6-4 1-2 5-2 6 0 3-1 6 1 6 4 2 0 4 2 4 5s-2 6-6 6Z" fill="var(--lavender)" className="nav-pulse" />
            <path d="M24 16v14M19 22h10" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
          <span className="text-sm text-ink-2">
            Fetching the next page<span className="nav-dots" aria-hidden />
            <span className="block text-xs text-muted">The connection seems slow, it is on its way</span>
          </span>
        </div>
      )}
    </div>
  );
}
