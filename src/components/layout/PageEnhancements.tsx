"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useScrollFrame } from "@/hooks/useScrollFrame";
import { isCalm } from "@/lib/consent";
import { cn } from "@/lib/utils";

const MAGNET_RANGE = 8;

export function PageEnhancements() {
  const [showTop, setShowTop] = useState(false);

  useScrollFrame(() => {
    setShowTop(window.scrollY > 700);
    // Drives the progress ring on the back-to-top button, and the top progress bar where scroll timelines are missing.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    document.documentElement.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : "0");
  });

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const calm = isCalm();
    if (!finePointer || calm) return;

    const onMove = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const card = target?.closest<HTMLElement>(".spotlight");
      if (card) {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${event.clientX - box.left}px`);
        card.style.setProperty("--my", `${event.clientY - box.top}px`);
      }
      const magnet = target?.closest<HTMLElement>("[data-magnetic]");
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const dx = ((event.clientX - box.left) / box.width - 0.5) * MAGNET_RANGE;
        const dy = ((event.clientY - box.top) / box.height - 0.5) * MAGNET_RANGE;
        magnet.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      }
    };
    const onOut = (event: PointerEvent) => {
      const magnet = (event.target as Element | null)?.closest<HTMLElement>("[data-magnetic]");
      if (magnet && !magnet.contains(event.relatedTarget as Node | null)) magnet.style.transform = "";
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      inert={!showTop}
      onClick={() => {
        window.scrollTo({ top: 0 });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className={cn(
        "top-ring no-print fixed right-4 bottom-[5.5rem] z-30 sm:right-5 grid size-12 place-items-center rounded-full p-[3px] text-ink-2 shadow-lg transition-all duration-300 hover:text-primary",
        showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="grid size-full place-items-center rounded-full bg-surface">
        <ArrowUp className="size-4" aria-hidden />
      </span>
    </button>
  );
}
