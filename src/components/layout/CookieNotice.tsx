"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { OPEN_SETTINGS_EVENT, readConsent, storedPreferences, subscribeConsent, writeConsent, type Consent } from "@/lib/consent";
import { cn } from "@/lib/utils";

/** A cookie with a face. It wobbles, blinks and drops crumbs. */
function CookieFace() {
  return (
    <svg viewBox="0 0 80 80" className="size-16 shrink-0" aria-hidden>
      <g className="cookie-bob">
        <path d="M40 6a34 34 0 1 0 34 34 9 9 0 0 1-10-9 9 9 0 0 1-9-10 9 9 0 0 1-15-15Z" fill="#e0a560" />
        <path d="M40 10a30 30 0 1 0 30 30 12 12 0 0 1-9-8 12 12 0 0 1-9-10 12 12 0 0 1-12-12Z" fill="#eab676" />
        {[[22, 30], [50, 52], [30, 56], [58, 38], [44, 24]].map(([cx, cy], index) => (
          <ellipse key={index} cx={cx} cy={cy} rx="3.6" ry="3" fill="#5b3a24" transform={`rotate(${index * 40} ${cx} ${cy})`} />
        ))}
        <g className="il-blink" style={{ transformOrigin: "36px 40px" }}>
          <ellipse cx="29" cy="40" rx="3.4" ry="4" fill="#2b1a10" />
          <ellipse cx="43" cy="40" rx="3.4" ry="4" fill="#2b1a10" />
          <circle cx="30" cy="38.6" r="1.2" fill="#fff" />
          <circle cx="44" cy="38.6" r="1.2" fill="#fff" />
        </g>
        <ellipse cx="23" cy="47" rx="4" ry="2.4" fill="#ff7a8a" opacity="0.5" />
        <ellipse cx="49" cy="47" rx="4" ry="2.4" fill="#ff7a8a" opacity="0.5" />
        <path d="M31 48c3 4 8 4 11 0" fill="none" stroke="#2b1a10" strokeWidth="2.2" strokeLinecap="round" />
      </g>
      {[[62, 22, "4px"], [68, 30, "-3px"], [58, 16, "6px"]].map(([cx, cy, dx], index) => (
        <circle key={index} cx={cx as number} cy={cy as number} r="1.8" fill="#e0a560" className="cookie-crumb" style={{ animationDelay: `${index * 0.6}s`, ["--cx" as string]: dx as string }} />
      ))}
    </svg>
  );
}

const subscribeAll = (callback: () => void) => {
  const off = subscribeConsent(callback);
  return off;
};

export function CookieNotice() {
  // undefined on the server and before hydration, so nothing renders until the cookie has been read
  const consent = useSyncExternalStore<Consent | null | undefined>(subscribeAll, readConsent, () => undefined);
  const [reopened, setReopened] = useState(false);
  const [details, setDetails] = useState(false);

  useEffect(() => {
    const open = () => {
      setReopened(true);
      setDetails(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  if (consent === undefined || (consent !== null && !reopened)) return null;

  const choose = (value: Consent) => {
    writeConsent(value);
    setReopened(false);
    setDetails(false);
  };

  return (
    <section
      aria-label="Cookie notice"
      className="cookie-in no-print fixed bottom-4 left-4 z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl sm:bottom-5 sm:left-5"
    >
      <div className="h-1 bg-[linear-gradient(90deg,var(--primary),var(--accent),var(--pink))]" />
      <div className="flex gap-3 p-4">
        <CookieFace />
        <div className="min-w-0">
          <h2 className="font-serif text-lg leading-tight">Cookies, only the friendly kind</h2>
          <p className="mt-1 text-sm text-ink-2">
            No tracking, no ads. One small cookie remembers this choice. If you allow preferences, your browser also remembers your theme, the animation switch, bookmarks and
            this tab&apos;s chat.
          </p>
        </div>
      </div>

      {details && (
        <div className="border-t border-line px-4 py-3 text-sm">
          <ul className="space-y-2">
            <li className="flex items-start justify-between gap-3">
              <span>
                <span className="font-medium">Essential</span>
                <span className="block text-muted">The {"“"}dbro_consent{"”"} cookie, 6 months</span>
              </span>
              <span className="rounded-full bg-ok-soft px-2 py-0.5 text-xs text-ok-ink">Always on</span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span>
                <span className="font-medium">Preferences</span>
                <span className="block text-muted">{storedPreferences.map((item) => item.key).join(", ")}</span>
              </span>
              <span className={cn("rounded-full px-2 py-0.5 text-xs", consent === "essential" ? "bg-surface-2 text-muted" : "bg-primary-soft text-primary")}>
                {consent === "essential" ? "Off" : consent === "all" ? "On" : "Your choice"}
              </span>
            </li>
            <li className="flex items-start justify-between gap-3">
              <span>
                <span className="font-medium">Analytics and advertising</span>
                <span className="block text-muted">This site does not use any</span>
              </span>
              <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">None</span>
            </li>
          </ul>
          <Link href="/cookies" className="link mt-2 inline-block">Read the cookie policy</Link>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 border-t border-line p-3">
        <button type="button" onClick={() => choose("all")} className="min-h-10 rounded-full bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover">
          Allow preferences
        </button>
        <button type="button" onClick={() => choose("essential")} className="min-h-10 rounded-full border border-line-strong px-4 text-sm text-ink hover:border-primary hover:text-primary">
          Essential only
        </button>
        <button type="button" onClick={() => setDetails(!details)} aria-expanded={details} className="ml-auto min-h-10 rounded-full px-3 text-sm text-primary hover:bg-primary-soft">
          {details ? "Hide details" : "Details"}
        </button>
      </div>
    </section>
  );
}

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-ink-2 transition-colors hover:border-primary hover:text-primary"
    >
      <span aria-hidden>🍪</span> Cookie settings
    </button>
  );
}
