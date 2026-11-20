"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { tourIndiaDestinations } from "@/content/data/tour-india";
import { isCalm } from "@/lib/consent";

const RAD = Math.PI / 180;
const R = 150;
/** Zoom so the subcontinent fills the globe; points outside the disc are clipped. */
const ZOOM = 2.5;
const CENTRE_LAT = 22 * RAD;

/** Orthographic projection of (lat, lng) for a globe turned to `lng0`. Returns null on the far side. */
function project(lat: number, lng: number, lng0: number) {
  const phi = lat * RAD;
  const lambda = (lng - lng0) * RAD;
  const cosc = Math.sin(CENTRE_LAT) * Math.sin(phi) + Math.cos(CENTRE_LAT) * Math.cos(phi) * Math.cos(lambda);
  if (cosc < 0) return null;
  const x = ZOOM * R * Math.cos(phi) * Math.sin(lambda);
  const y = -ZOOM * R * (Math.cos(CENTRE_LAT) * Math.sin(phi) - Math.sin(CENTRE_LAT) * Math.cos(phi) * Math.cos(lambda));
  if (x * x + y * y > (R - 4) ** 2) return null;
  return { x, y, depth: cosc };
}

function graticule(lng0: number) {
  const lines: string[] = [];
  const path = (points: ({ x: number; y: number } | null)[]) => {
    let d = "";
    let pen = false;
    for (const point of points) {
      if (!point) {
        pen = false;
        continue;
      }
      d += `${pen ? "L" : "M"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      pen = true;
    }
    return d;
  };
  for (let lat = -10; lat <= 50; lat += 5) lines.push(path(Array.from({ length: 121 }, (_, i) => project(lat, i - 20 + 40, lng0))));
  for (let lng = 20; lng <= 140; lng += 5) lines.push(path(Array.from({ length: 61 }, (_, i) => project(i - 10, lng, lng0))));
  return lines;
}

/** A turning globe with the 52 Tour India destination guides at their real coordinates. */
export function DestinationGlobe() {
  const [lng0, setLng0] = useState(81);
  const [focus, setFocus] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCalm()) return;
    let frame = 0;
    let visible = true;
    let last = performance.now();
    let elapsed = 0;
    let lastPaint = 0;
    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
    });
    if (box.current) observer.observe(box.current);
    const loop = (now: number) => {
      const paused = document.documentElement.dataset.motion === "paused";
      if (visible && !paused) {
        elapsed += now - last;
        // About 15 updates a second is smooth for a slow swing and keeps the page responsive.
        if (now - lastPaint > 66) {
          lastPaint = now;
          // Swing back and forth across India, so the subcontinent stays in view.
          setLng0(Math.round((81 + Math.sin(elapsed / 5000) * 7) * 10) / 10);
          setFocus(Math.floor(elapsed / 2200) % tourIndiaDestinations.length);
        }
      }
      last = now;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  const grid = useMemo(() => graticule(lng0), [lng0]);
  const points = tourIndiaDestinations
    .map(([name, lat, lng], index) => ({ name, index, p: project(lat, lng, lng0) }))
    .filter((point) => point.p);
  const focused = tourIndiaDestinations[focus];
  const focusPoint = focused ? project(focused[1], focused[2], lng0) : null;

  return (
    <div ref={box} className="relative mx-auto w-full max-w-[26rem]">
      <svg viewBox="-170 -170 340 340" className="h-auto w-full" role="img" aria-label="A turning globe marking the 52 Tour India destination guides at their real coordinates across India.">
        <defs>
          <radialGradient id="globe-sea" cx="35%" cy="30%" r="75%">
            <stop offset="0" style={{ stopColor: "color-mix(in srgb, var(--primary) 30%, var(--surface))" }} />
            <stop offset="1" style={{ stopColor: "color-mix(in srgb, var(--primary) 70%, #050816)" }} />
          </radialGradient>
          <radialGradient id="globe-shine" cx="30%" cy="25%" r="50%">
            <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle r={R + 12} fill="var(--accent)" opacity="0.12" />
        <circle r={R} fill="url(#globe-sea)" />
        {grid.map((d, index) => (
          <path key={index} d={d} fill="none" stroke="#fff" strokeOpacity="0.16" strokeWidth="0.8" />
        ))}
        {points.map(({ name, index, p }) => (
          <circle key={name} cx={p!.x} cy={p!.y} r={index === focus ? 6 : 4} fill={index === focus ? "var(--gold)" : "#ffd27a"} opacity={0.45 + p!.depth * 0.55}>
            <title>{name}</title>
          </circle>
        ))}
        {focusPoint && focused && (
          <g transform={`translate(${focusPoint.x} ${focusPoint.y})`}>
            <circle r="10" fill="none" stroke="var(--gold)" strokeWidth="2" className="globe-ping" />
            <rect x={focusPoint.x > 40 ? -(focused[0].length * 6.4 + 24) : 10} y="-26" width={focused[0].length * 6.4 + 14} height="20" rx="10" fill="#0b1020" opacity="0.85" />
            <text x={focusPoint.x > 40 ? -(focused[0].length * 6.4 + 17) : 17} y="-12" fontSize="11" fill="#fff">{focused[0]}</text>
          </g>
        )}
        <circle r={R} fill="url(#globe-shine)" />
      </svg>
      <p className="text-center text-sm text-muted">52 destination guides, at their real coordinates</p>
    </div>
  );
}

const SCREENS = [
  { src: "/images/projects/tour-india/screenshot-home.webp", label: "Home: photo slider and search" },
  { src: "/images/projects/tour-india/screenshot-explore-globe.webp", label: "Explore: 3D globe of every guide" },
  { src: "/images/projects/tour-india/screenshot-destination.webp", label: "Destination guide: Agra" },
  { src: "/images/projects/tour-india/screenshot-planner.webp", label: "Trip planner" },
];

/** The live site's own screenshots on a slowly turning 3D carousel. Hover to stop it. */
export function ScreenCarousel3D() {
  return (
    <figure className="carousel3d" aria-label="Screenshots of the Tour India website">
      <div className="carousel3d-ring">
        {SCREENS.map((screen, index) => (
          <div key={screen.src} className="carousel3d-panel" style={{ ["--i" as string]: index }}>
            <Image src={screen.src} alt={screen.label} width={1440} height={810} sizes="(min-width: 768px) 420px, 70vw" className="h-auto w-full rounded-lg" />
            <span className="mt-1.5 block text-center text-xs text-ink-2">{screen.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="sr-only">Four screenshots: home, explore globe, a destination guide and the trip planner.</figcaption>
    </figure>
  );
}

const ERAS = [
  {
    year: "2022",
    title: "Smart India Hackathon",
    body: "A static travel site in HTML, CSS and JavaScript, hosted on GitHub Pages: a destination gallery, services, a video tour and a contact form.",
    tech: ["HTML", "CSS", "JavaScript", "GitHub Pages"],
  },
  {
    year: "2026",
    title: "Rebuilt as a full travel guide",
    body: "A Next.js 16 and TypeScript application on Vercel: an interactive map of every state and Union Territory, a 3D globe, a trip planner, a festival calendar and Yatri, a travel assistant. The original site is kept in legacy/.",
    tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS 4", "MongoDB (optional)", "Vercel"],
  },
];

export function Evolution() {
  return (
    <ol className="evolution relative grid gap-4 md:grid-cols-2">
      {ERAS.map((era, index) => (
        <li key={era.year} className="evolution-card card relative p-5" style={{ animationDelay: `${index * 0.25}s` }}>
          <p className="font-serif text-4xl text-primary">{era.year}</p>
          <p className="mt-1 text-lg font-medium text-ink">{era.title}</p>
          <p className="mt-2 text-[0.95rem] text-ink-2">{era.body}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {era.tech.map((tech) => (
              <li key={tech} className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-ink-2">{tech}</li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

/** Request flow from the Tour India architecture notes. */
export function TourIndiaFlow() {
  const nodes = [
    { x: 20, y: 90, w: 110, label: "Visitor", sub: "browser" },
    { x: 170, y: 90, w: 150, label: "Next.js 16", sub: "on Vercel" },
    { x: 370, y: 20, w: 170, label: "Static and ISR pages", sub: "content from src/data" },
    { x: 370, y: 160, w: 170, label: "API routes", sub: "Zod, rate limits" },
    { x: 590, y: 110, w: 150, label: "MongoDB Atlas", sub: "optional" },
    { x: 590, y: 200, w: 150, label: "Open-Meteo", sub: "weather" },
  ];
  const links = ["M130 115H170", "M320 105C345 105 345 45 370 45", "M320 125C345 125 345 185 370 185", "M540 180C565 180 565 135 590 135", "M540 190C565 190 565 225 590 225"];
  return (
    <div className="card overflow-x-auto p-3">
      <svg viewBox="0 0 760 260" className="h-auto w-full min-w-[36rem]" role="img" aria-label="Tour India architecture: the visitor reaches Next.js on Vercel, which serves static and cached pages built from typed data, and API routes that validate input and may use MongoDB and Open-Meteo.">
        {links.map((d, index) => (
          <g key={d}>
            <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="2.5" />
            <circle r="4.5" fill="var(--accent)" className="il-packet" style={{ offsetPath: `path("${d}")`, animationDelay: `${index * 0.6}s`, animationDuration: "2.8s" }} />
          </g>
        ))}
        {nodes.map((node, index) => (
          <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
            <rect width={node.w} height="50" rx="12" fill="var(--surface)" stroke={["var(--series-5)", "var(--primary)", "var(--series-3)", "var(--series-2)", "var(--series-1)", "var(--series-4)"][index]} strokeWidth="2" />
            <text x={node.w / 2} y="22" textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">{node.label}</text>
            <text x={node.w / 2} y="39" textAnchor="middle" fontSize="11" fill="var(--ink-2)">{node.sub}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
