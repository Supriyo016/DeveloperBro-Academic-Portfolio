"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { isCalm } from "@/lib/consent";
import { cn } from "@/lib/utils";

/** Counts up to `value` the first time it scrolls into view. Shows the final number at once when motion is reduced. */
export function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const element = ref.current;
    if (!element || isCalm() || !("IntersectionObserver" in window)) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / 1200, 1);
        setShown(Math.round(value * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      setShown(0);
      frame = requestAnimationFrame(tick);
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

export function StatGrid({ stats }: { stats: { value: number; suffix?: string; label: string }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat, index) => (
        <div key={stat.label} className="stat-card card p-4" style={{ animationDelay: `${index * 0.4}s` }}>
          <dd className="font-serif text-3xl text-primary">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </dd>
          <dt className="mt-1 text-sm text-ink-2">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** A card that tilts in 3D towards the pointer. Static on touch screens and with reduced motion. */
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || event.pointerType !== "mouse" || isCalm()) return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    element.style.transform = `rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <div className="[perspective:1000px]">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("tilt-card transition-transform duration-200 ease-out [transform-style:preserve-3d]", className)}>
        {children}
      </div>
    </div>
  );
}

export function VisualSection({ id, eyebrow, title, intro, children }: { id: string; eyebrow: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-14">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={`${id}-title`} className="mt-2 text-3xl">{title}</h2>
      {intro && <p className="mt-2 max-w-3xl text-ink-2">{intro}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}
