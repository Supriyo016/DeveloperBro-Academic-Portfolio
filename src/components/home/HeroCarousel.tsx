"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 9000;
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const readMotion = () => window.matchMedia(MOTION_QUERY).matches;

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia(MOTION_QUERY);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function HeroCarousel({ slides, labels }: { slides: ReactNode[]; labels: string[] }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const slidesRoot = useRef<HTMLDivElement>(null);
  const prefersCalm = useSyncExternalStore(subscribeMotion, readMotion, () => true);
  const autoplay = choice ?? !prefersCalm;
  const held = hovered || focused;

  useEffect(() => {
    if (!autoplay || held) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") setIndex((value) => (value + 1) % slides.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [autoplay, held, slides.length]);

  const go = (next: number) => {
    setChoice(false);
    setIndex((next + slides.length) % slides.length);
  };

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Research profile highlights"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
    >
      <div
        ref={slidesRoot}
        aria-live={autoplay ? "off" : "polite"}
        className="grid grid-cols-1"
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          if (!slidesRoot.current?.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {slides.map((slide, position) => (
          <div
            key={labels[position]}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${slides.length}: ${labels[position]}`}
            inert={position !== index}
            data-active={position === index ? "true" : "false"}
            className={cn("col-start-1 row-start-1 min-w-0 transition-[opacity,translate] duration-500 ease-out", position === index ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0")}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous slide" className="carousel-control">
          <ChevronLeft className="size-4" aria-hidden />
        </button>
        <ul className="flex items-center">
          {labels.map((label, position) => (
            <li key={label}>
              <button type="button" onClick={() => go(position)} aria-label={`Show slide ${position + 1}: ${label}`} aria-current={position === index ? "true" : undefined} className="grid h-7 min-w-7 place-items-center px-0.5">
                <span className={cn("relative block h-1.5 overflow-hidden rounded-full transition-all duration-300", position === index ? "w-8 bg-line-strong" : "w-1.5 bg-line-strong")}>
                  {position === index && (
                    <span
                      key={`${index}-${autoplay}`}
                      data-held={held || !autoplay ? "true" : "false"}
                      className={cn("absolute inset-0 rounded-full bg-primary", autoplay && "slide-progress")}
                      style={{ ["--slide-ms" as string]: `${INTERVAL_MS}ms` }}
                    />
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next slide" className="carousel-control">
          <ChevronRight className="size-4" aria-hidden />
        </button>
        <button type="button" onClick={() => setChoice(!autoplay)} aria-label={autoplay ? "Pause automatic slides" : "Play automatic slides"} className="carousel-control ml-1">
          {autoplay ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}
