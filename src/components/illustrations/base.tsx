import type { CSSProperties, ReactNode } from "react";

export const il = {
  skin: "var(--il-skin)",
  skinShade: "var(--il-skin-shade)",
  hair: "var(--il-hair)",
  coat: "var(--il-coat)",
  coat2: "var(--il-coat-2)",
  shirt: "var(--il-shirt)",
  paper: "var(--il-paper)",
  paper2: "var(--il-paper-2)",
  primary: "var(--il-primary)",
  lavender: "var(--il-lavender)",
  cyan: "var(--il-cyan)",
  cyanSoft: "var(--il-cyan-soft)",
  amber: "var(--il-amber)",
  wood: "var(--il-wood)",
  ground: "var(--il-ground)",
  soft: "var(--primary-soft)",
  line: "var(--line-strong)",
  ink: "var(--ink)",
  onPaper: "#161b33",
} as const;

export function Scene({ label, viewBox, children, className }: { label: string; viewBox: string; children: ReactNode; className?: string }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={label} className={className ?? "h-auto w-full"} xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

/**
 * An animated group. `origin` is the pivot in SVG user units, e.g. "352 214" for a shoulder.
 * Never combine with a `transform` attribute on the same element: CSS animation would replace it.
 */
export function Anim({ kind, origin, delay, children }: { kind: string; origin?: string; delay?: number; children: ReactNode }) {
  const style: CSSProperties = {};
  if (origin) style.transformOrigin = origin.split(" ").map((value) => `${value}px`).join(" ");
  if (delay) style.animationDelay = `${delay}s`;
  return (
    <g className={kind} style={style}>
      {children}
    </g>
  );
}

/** A detailed head that blinks and gently nods. (x, y) is the centre of the face. */
export function Head({
  x,
  y,
  skin = il.skin,
  long = false,
  glasses = false,
  delay = 0,
  scale = 1,
}: {
  x: number;
  y: number;
  skin?: string;
  long?: boolean;
  glasses?: boolean;
  delay?: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M-14 24h28v22c-8 8-20 8-28 0Z" fill={il.skinShade} />
      <Anim kind="il-nod" origin="0 40" delay={delay}>
        {long && <path d="M-35-6c-7 28-5 50 4 64 13-10 13-32 9-60ZM35-6c7 28 5 50-4 64-13-10-13-32-9-60Z" fill={il.hair} />}
        <ellipse cx="-30" cy="6" rx="5.5" ry="8" fill={skin} />
        <ellipse cx="30" cy="6" rx="5.5" ry="8" fill={skin} />
        <ellipse cx="-30" cy="6" rx="2.5" ry="4" fill={il.skinShade} opacity="0.6" />
        <ellipse cx="30" cy="6" rx="2.5" ry="4" fill={il.skinShade} opacity="0.6" />
        <circle r="31" fill={skin} />
        <path d="M-32 2c-5-24 13-40 34-38 18 2 29 16 28 32-8-10-16-13-26-13C-10-16-24-12-32 2Z" fill={il.hair} />
        <path d="M-12-30c8-4 18-4 26 2" fill="none" stroke={il.paper} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
        <path d="M-17-5c4-3 9-3 13 0M5-5c4-3 9-3 13 0" fill="none" stroke={il.hair} strokeWidth="2.4" strokeLinecap="round" />
        <Anim kind={delay % 2 ? "il-blink-late" : "il-blink"} origin="0 4">
          <ellipse cx="-10" cy="4" rx="2.9" ry="3.4" fill={il.hair} />
          <ellipse cx="11" cy="4" rx="2.9" ry="3.4" fill={il.hair} />
          <circle cx="-9" cy="2.8" r="0.9" fill={il.paper} />
          <circle cx="12" cy="2.8" r="0.9" fill={il.paper} />
        </Anim>
        {glasses && <path d="M-19-2h16v12h-16ZM3-2h16v12H3ZM-3 3h6" fill="none" stroke={il.ink} strokeWidth="1.8" strokeLinejoin="round" />}
        <path d="M0 6v6l-2.5 1.5" fill="none" stroke={il.skinShade} strokeWidth="2" strokeLinecap="round" />
        <circle cx="-17" cy="13" r="4.5" fill={il.amber} opacity="0.18" />
        <circle cx="18" cy="13" r="4.5" fill={il.amber} opacity="0.18" />
        <path d="M-6 17c4 4 9 4 13 0" fill="none" stroke={il.skinShade} strokeWidth="2.5" strokeLinecap="round" />
      </Anim>
    </g>
  );
}

export function Plant({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Anim kind="il-sway" origin="0 0">
        <path d="M0 0c-4-22-22-30-32-30 2 18 14 30 32 30Z" fill={il.cyan} />
        <path d="M0 0c2-28 20-42 32-44 0 22-12 40-32 44Z" fill={il.primary} opacity="0.85" />
        <path d="M0 0c-2-20-4-34 0-50 6 16 6 34 0 50Z" fill={il.cyan} opacity="0.7" />
        <path d="M-14-14c-6-4-10-4-14-2M12-24c6-6 12-8 16-8" fill="none" stroke={il.paper} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      </Anim>
      <path d="M-16 0h32l-5 28h-22Z" fill={il.amber} />
      <path d="M-17 0h34v5h-34Z" fill={il.amber} opacity="0.7" />
    </g>
  );
}

export function Books({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-16" width="84" height="16" rx="3" fill={il.primary} />
      <rect x="6" y="-30" width="72" height="14" rx="3" fill={il.amber} />
      <rect x="-2" y="-46" width="78" height="16" rx="3" fill={il.cyan} />
      <path d="M10-38h40M10-8h46" stroke={il.paper} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </g>
  );
}

/** A mug with rising steam. (x, y) is the bottom-left of the mug. */
export function Mug({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[6, 16].map((dx, index) => (
        <Anim key={dx} kind="il-steam" delay={index * 1.3}>
          <path d={`M${dx}-30c-5-6 5-10 0-16`} fill="none" stroke={il.line} strokeWidth="2.5" strokeLinecap="round" />
        </Anim>
      ))}
      <path d="M0-26h26v20a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6Z" fill={il.paper} stroke={il.line} />
      <path d="M26-20h4a6 6 0 0 1 0 12h-4" fill="none" stroke={il.line} strokeWidth="3" />
      <path d="M6-16h14" stroke={il.primary} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/** A four-point sparkle that twinkles. */
export function Sparkle({ x, y, size = 8, color = il.amber, delay = 0 }: { x: number; y: number; size?: number; color?: string; delay?: number }) {
  const s = size;
  return (
    <Anim kind="il-twinkle" delay={delay}>
      <path d={`M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z`} fill={color} />
    </Anim>
  );
}

/** Lines of code that type themselves out on a screen, with a blinking cursor. */
export function CodeLines({ x, y, widths, gap = 10, colors }: { x: number; y: number; widths: number[]; gap?: number; colors?: string[] }) {
  const palette = colors ?? [il.primary, il.cyan, il.amber, il.lavender];
  const last = widths.length - 1;
  return (
    <g>
      {widths.map((width, index) => (
        <rect
          key={index}
          className="il-code"
          style={{ animationDelay: `${index * 0.45}s` }}
          x={x + (index % 3 === 1 ? 8 : 0)}
          y={y + index * gap}
          width={width}
          height="4"
          rx="2"
          fill={palette[index % palette.length]}
        />
      ))}
      <rect className="caret" x={x + (widths[last] ?? 0) + 12} y={y + last * gap - 2} width="2.5" height="8" fill={il.ink} />
    </g>
  );
}

/** An open laptop seen from the front. (x, y) is the centre of the keyboard edge. */
export function Laptop({ x, y, width = 150 }: { x: number; y: number; width?: number }) {
  const w = width;
  const h = w * 0.62;
  return (
    <g transform={`translate(${x - w / 2} ${y - h})`}>
      <rect width={w} height={h} rx="8" fill={il.coat} />
      <Anim kind="il-glow">
        <rect x="7" y="7" width={w - 14} height={h - 14} rx="4" fill={il.paper} />
      </Anim>
      <CodeLines x={16} y={16} widths={[w * 0.4, w * 0.26, w * 0.5, w * 0.32, w * 0.2].map(Math.round)} gap={(h - 30) / 5} />
      <path d={`M${-w * 0.12} ${h}h${w * 1.24}l-6 8H${-w * 0.08}Z`} fill={il.line} />
      <circle cx={w / 2} cy="3.5" r="1.6" fill={il.paper2} />
    </g>
  );
}

/** The assistant's robot mascot. (x, y) is the centre of its head. */
export function Robot({ x, y, scale = 1, waving = true }: { x: number; y: number; scale?: number; waving?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Anim kind="il-bob">
        <path d="M0-40v-14" stroke={il.line} strokeWidth="3" strokeLinecap="round" />
        <circle cy="-58" r="6" fill={il.amber} className="il-pulse" />
        <rect x="-40" y="-40" width="80" height="64" rx="22" fill={il.paper} stroke={il.line} strokeWidth="2" />
        <rect x="-30" y="-28" width="60" height="38" rx="14" fill={il.coat} />
        <Anim kind="il-blink" origin="0 -9">
          <ellipse cx="-12" cy="-9" rx="6" ry="7" fill={il.cyan} />
          <ellipse cx="12" cy="-9" rx="6" ry="7" fill={il.cyan} />
          <circle cx="-10" cy="-12" r="2" fill={il.paper} />
          <circle cx="14" cy="-12" r="2" fill={il.paper} />
        </Anim>
        <path d="M-8 2c5 4 11 4 16 0" fill="none" stroke={il.cyan} strokeWidth="2.5" strokeLinecap="round" />
        <rect x="-46" y="-16" width="8" height="20" rx="4" fill={il.primary} />
        <rect x="38" y="-16" width="8" height="20" rx="4" fill={il.primary} />
        <path d="M-26 28h52l-6 34h-40Z" fill={il.primary} />
        <circle cy="42" r="6" fill={il.amber} className="il-glow" />
        <path d="M-26 34l-12 18" stroke={il.primary} strokeWidth="8" strokeLinecap="round" />
        {waving ? (
          <Anim kind="il-wave" origin="24 34">
            <path d="M24 34l16-22" stroke={il.primary} strokeWidth="8" strokeLinecap="round" />
            <circle cx="42" cy="9" r="7" fill={il.paper} stroke={il.line} strokeWidth="2" />
          </Anim>
        ) : (
          <path d="M26 34l12 18" stroke={il.primary} strokeWidth="8" strokeLinecap="round" />
        )}
      </Anim>
    </g>
  );
}
