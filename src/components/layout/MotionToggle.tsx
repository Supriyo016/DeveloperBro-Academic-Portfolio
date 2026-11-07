"use client";

import { Pause, Play } from "lucide-react";
import { useSyncExternalStore } from "react";

// Lets any visitor stop all moving content (WCAG 2.2.2 Pause, Stop, Hide). The choice is remembered.
const EVENT = "motionchange";
const subscribe = (callback: () => void) => {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
};
const read = () => document.documentElement.dataset.motion === "paused";

export function MotionToggle() {
  const paused = useSyncExternalStore(subscribe, read, () => false);

  const toggle = () => {
    const next = !paused;
    if (next) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
    try {
      if (next) localStorage.setItem("motion", "paused");
      else localStorage.removeItem("motion");
    } catch {
      // Storage can be blocked. The choice still applies on this page.
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line px-3 text-sm text-ink-2 transition-colors hover:border-primary hover:text-primary"
    >
      {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
