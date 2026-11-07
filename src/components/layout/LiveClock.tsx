"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

// The visitor's own date and time, ticking each second. Rendered only in the browser, so there is no hydration
// mismatch: the server renders a placeholder of the same size.
const subscribe = (callback: () => void) => {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
};
const snapshot = () => Math.floor(Date.now() / 1000);

const dateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const shortFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });

export function LiveClock({ className }: { className?: string }) {
  const seconds = useSyncExternalStore(subscribe, snapshot, () => 0);
  const now = seconds ? new Date(seconds * 1000) : null;

  return (
    <div
      className={cn("items-center gap-2 rounded-full border border-line bg-surface/80 py-1 pr-3 pl-3 shadow-sm sm:pl-2", className)}
      role="timer"
      aria-label={now ? `Your local date and time: ${dateFormat.format(now)}, ${timeFormat.format(now)}` : "Your local date and time"}
      aria-live="off"
    >
      <span className="relative hidden size-6 place-items-center rounded-full sm:grid bg-[linear-gradient(135deg,var(--primary),var(--accent))]" aria-hidden>
        <svg viewBox="0 0 24 24" className="size-4 text-white">
          <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span className="clock-dot absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--series-3)] ring-2 ring-surface" />
      </span>
      <span className="leading-none" aria-hidden>
        <span className="hidden text-[0.68rem] text-muted xl:block">{now ? dateFormat.format(now) : " "}</span>
        <time dateTime={now?.toISOString()} className="block font-mono text-[0.8rem] font-medium tabular-nums text-ink sm:min-w-[4.6rem] xl:mt-0.5">
          <span className="hidden sm:inline">{now ? timeFormat.format(now) : "--:--:--"}</span>
          <span className="sm:hidden">{now ? shortFormat.format(now) : "--:--"}</span>
        </time>
      </span>
    </div>
  );
}
