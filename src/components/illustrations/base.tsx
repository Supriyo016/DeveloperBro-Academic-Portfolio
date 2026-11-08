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

/**
 * Cartoon fills: soft gradients that give skin, hair and clothes a lit, rounded look. Each falls back to the flat
 * colour if the shared gradient definitions are missing. The gradients are defined once per page by <ToonDefs />.
 */
export const toon = {
  skin: "url(#toon-skin) var(--il-skin)",
  skinShade: "url(#toon-skin-shade) var(--il-skin-shade)",
  hair: "url(#toon-hair) var(--il-hair)",
  coat: "url(#toon-coat) var(--il-coat)",
  coat2: "url(#toon-coat-2) var(--il-coat-2)",
  lavender: "url(#toon-lavender) var(--il-lavender)",
  shirt: "url(#toon-shirt) var(--il-shirt)",
  paper: "url(#toon-paper) var(--il-paper)",
  cheek: "url(#toon-cheek) transparent",
  iris: "url(#toon-iris) #4b3427",
} as const;

function Shade({ id, top, bottom, light = 0.28 }: { id: string; top: string; bottom: string; light?: number }) {
  return (
    <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${top} ${Math.round((1 - light) * 100)}%, #fff)` }} />
      <stop offset="0.55" style={{ stopColor: top }} />
      <stop offset="1" style={{ stopColor: bottom }} />
    </linearGradient>
  );
}

/** Shared gradients for every illustration on the page. Rendered once in the root layout. */
export function ToonDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <defs>
        <Shade id="toon-skin" top="var(--il-skin)" bottom="var(--il-skin-shade)" light={0.22} />
        <Shade id="toon-skin-shade" top="var(--il-skin-shade)" bottom="color-mix(in srgb, var(--il-skin-shade) 80%, #000)" light={0.2} />
        <Shade id="toon-hair" top="var(--il-hair)" bottom="color-mix(in srgb, var(--il-hair) 70%, #000)" light={0.12} />
        <Shade id="toon-coat" top="var(--il-coat)" bottom="color-mix(in srgb, var(--il-coat) 72%, #000)" />
        <Shade id="toon-coat-2" top="var(--il-coat-2)" bottom="color-mix(in srgb, var(--il-coat-2) 72%, #000)" />
        <Shade id="toon-lavender" top="var(--il-lavender)" bottom="color-mix(in srgb, var(--il-lavender) 75%, var(--il-primary))" />
        <Shade id="toon-shirt" top="var(--il-shirt)" bottom="color-mix(in srgb, var(--il-shirt) 82%, var(--il-paper-2))" light={0.1} />
        <Shade id="toon-paper" top="var(--il-paper)" bottom="var(--il-paper-2)" light={0.05} />
        <radialGradient id="toon-cheek">
          <stop offset="0" stopColor="#ff7a8a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ff7a8a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="toon-iris" cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#9a6b45" />
          <stop offset="0.6" stopColor="#5a3a24" />
          <stop offset="1" stopColor="#2b1a10" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export type HairStyle = "short" | "long" | "curly" | "bun";

/** Big glossy cartoon eyes. They blink, and the irises glance around. Centred on (0, 3) of the face. */
export function ToonEyes({ late = false, look, lashes = false }: { late?: boolean; look?: string; lashes?: boolean }) {
  return (
    <Anim kind={late ? "il-blink-late" : "il-blink"} origin="0 3">
      <ellipse cx="-11" cy="3" rx="7.2" ry="8.4" fill="#fff" />
      <ellipse cx="11" cy="3" rx="7.2" ry="8.4" fill="#fff" />
      <Anim kind={look ?? (late ? "il-look-late" : "il-look")}>
        <circle cx="-10.5" cy="4" r="5.2" fill={toon.iris} />
        <circle cx="11.5" cy="4" r="5.2" fill={toon.iris} />
        <circle cx="-10.5" cy="4.3" r="2.7" fill="#140d08" />
        <circle cx="11.5" cy="4.3" r="2.7" fill="#140d08" />
        <circle cx="-8.6" cy="1.6" r="1.8" fill="#fff" />
        <circle cx="13.4" cy="1.6" r="1.8" fill="#fff" />
        <circle cx="-11.8" cy="6.2" r="0.8" fill="#fff" opacity="0.85" />
        <circle cx="10.2" cy="6.2" r="0.8" fill="#fff" opacity="0.85" />
      </Anim>
      <path d="M-18.5 0.5c3-5.5 11-6.5 15-1.5M3.5-1c4-5 12-4 15 1.5" fill="none" stroke={il.hair} strokeWidth="2.2" strokeLinecap="round" />
      {lashes && (
        <path d="M-17.4-1.6l-3.8-2.2M-15.2-4.4l-2.6-3.2M17.4-1.6l3.8-2.2M15.2-4.4l2.6-3.2" fill="none" stroke={il.hair} strokeWidth="1.8" strokeLinecap="round" />
      )}
    </Anim>
  );
}

const HAIR_SHORT = "M-33 4c-6-26 12-42 34-41 20 1 32 15 31 35-6-10-13-15-23-16-4 6-14 9-26 8-6 2-12 7-16 14Z";
const HAIR_LONG = "M-36-8c-9 30-7 54 3 70 15-8 15-34 11-64ZM36-8c9 30 7 54-3 70-15-8-15-34-11-64Z";
const BEARD = "M-30.8 4C-30.5 22-18 40 0 42 18 40 30.5 22 30.8 4 28.6 12 25.4 17.4 20 20.6 15.4 23.2 13.2 27 10.4 30 6.2 33.4-6.2 33.4-10.4 30-13.2 27-15.4 23.2-20 20.6-25.4 17.4-28.6 12-30.8 4Z";
const CURLS = [-26, -15, -3, 9, 21];

/**
 * In the dark theme hair, beards and shoes are almost as dark as the night-blue background, so they get a thin light
 * rim (the --il-rim colour is transparent in the light theme, see toon.css).
 */
export const RIM = "var(--il-rim, transparent)";

/** The face shape, ears, hair, nose and cheeks, without eyes, brows or mouth. */
export function ToonFace({ skin, hair = "short", beard = false }: { skin?: string; hair?: HairStyle; beard?: boolean }) {
  const face = skin === il.skinShade ? toon.skinShade : toon.skin;
  return (
    <g>
      <g fill="none" stroke={RIM} strokeWidth="3">
        {hair === "long" && <path d={HAIR_LONG} />}
        {hair === "bun" && <circle cy="-40" r="13" />}
        {hair === "curly" ? CURLS.map((cx, index) => <circle key={cx} cx={cx} cy={-22 - (index % 2) * 6} r="11" />) : <path d={HAIR_SHORT} />}
        {beard && <path d={BEARD} />}
      </g>
      {hair === "long" && <path d={HAIR_LONG} fill={toon.hair} />}
      {hair === "bun" && <circle cy="-40" r="13" fill={toon.hair} />}
      <ellipse cx="-31" cy="6" rx="6" ry="8.5" fill={face} />
      <ellipse cx="31" cy="6" rx="6" ry="8.5" fill={face} />
      <path d="M-32 3c2 2 2 5 0 7M32 3c-2 2-2 5 0 7" fill="none" stroke={il.skinShade} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <path d="M-31 2c0-22 13-34 31-34s31 12 31 34c0 16-6 26-14 32-5 3-11 5-17 5s-12-2-17-5c-8-6-14-16-14-32Z" fill={face} />
      {beard && (
        <g>
          <path d={BEARD} fill="color-mix(in srgb, var(--il-hair) 84%, var(--il-skin-shade))" />
          <path d="M-6 31.6c4 1.4 8 1.4 12 0l-2 4.4c-2.6 0.8-5.4 0.8-8 0Z" fill="var(--il-skin-shade)" opacity="0.55" />
          <path d="M-22 24c3 6 7 10 12 12M22 24c-3 6-7 10-12 12M-26 14c1 4 2.4 7 4.4 9.6M26 14c-1 4-2.4 7-4.4 9.6" fill="none" stroke="#fff" strokeOpacity="0.14" strokeWidth="1.3" strokeLinecap="round" />
        </g>
      )}
      {hair === "curly" ? (
        <g fill={toon.hair}>
          {CURLS.map((cx, index) => (
            <circle key={cx} cx={cx} cy={-22 - (index % 2) * 6} r="11" />
          ))}
          <path d="M-32 0c-2-12 2-20 8-24l6 10c-6 2-10 8-14 14ZM32 0c2-12-2-20-8-24l-6 10c6 2 10 8 14 14Z" />
        </g>
      ) : (
        <path d={HAIR_SHORT} fill={toon.hair} />
      )}
      <path d="M-14-30c8-5 20-5 28 1" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" strokeLinecap="round" />
      <path d="M14-27c4 0 8 2 10 4" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
      <path d="M-1 8c-3 4-4 7-1 8.5 2 1 4 0.5 5-0.5" fill="none" stroke={il.skinShade} strokeWidth="2" strokeLinecap="round" />
      <circle cx="0.5" cy="11" r="1.2" fill="#fff" opacity="0.35" />
      <ellipse cx="-19" cy="14" rx="7" ry="4.5" fill={toon.cheek} />
      <ellipse cx="19" cy="14" rx="7" ry="4.5" fill={toon.cheek} />
    </g>
  );
}

export function ToonGlasses() {
  return (
    <g fill="none" stroke={il.ink} strokeWidth="2" strokeLinejoin="round">
      <circle cx="-11" cy="3" r="10" fill="#bfe3ff" fillOpacity="0.14" />
      <circle cx="11" cy="3" r="10" fill="#bfe3ff" fillOpacity="0.14" />
      <path d="M-1 2c0.7-1 1.3-1 2 0M-21 1l-9-3M21 1l9-3" />
      <path d="M-16-2l4-3" stroke="#fff" strokeOpacity="0.6" strokeWidth="1.5" />
    </g>
  );
}

/** A full moustache that sits between the nose and the upper lip. */
export function ToonMoustache() {
  return (
    <g>
      <path
        d="M0 16.2c-3-2.4-8.6-2.8-12.6 0-2.4 1.7-4.5 2.5-6.6 1.9 1.8 3.8 6.8 5.6 11.8 4 3.4-1 5.6-2.6 7.4-3.9 1.8 1.3 4 2.9 7.4 3.9 5 1.6 10-0.2 11.8-4-2.1 0.6-4.2-0.2-6.6-1.9-4-2.8-9.6-2.4-12.6 0Z"
        fill={toon.hair}
      />
      <path d="M-11 17.6c2-1 4.4-1 6.4 0M11 17.6c-2-1-4.4-1-6.4 0" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

const MOUTH_KIND: Record<string, string> = {
  talk: "il-say",
  "il-talk": "il-say",
  late: "il-say-late",
  "talk-late": "il-say-late",
  "il-talk-late": "il-say-late",
  chatter: "il-say-chat",
  "il-chatter": "il-say-chat",
};

/**
 * A mouth that speaks by switching between three shapes: a closed smile, a small round "o" and a wide open mouth
 * with teeth and tongue. "talk" says a few words now and then, "chatter" talks continuously, "still" only smiles.
 * Without motion the closed smile shows. (0, y) is the centre of the mouth.
 */
export function ToonMouth({ kind = "talk", y = 21 }: { kind?: string; y?: number }) {
  const cls = MOUTH_KIND[kind];
  return (
    <g transform={`translate(0 ${y - 21})`}>
      <g className={cls}>
        <g className="il-m-smile">
          <path d="M-7.5 19.4c3 4.6 12 4.6 15 0" fill="none" stroke="#7a2638" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M-9 18.6l1.6 1.1M9 18.6l-1.6 1.1" stroke="#7a2638" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
        </g>
        {cls && (
          <>
            <g className="il-m-o">
              <ellipse cx="0" cy="22" rx="3.9" ry="4.6" fill="#7a2638" />
              <ellipse cx="0" cy="24.3" rx="2.3" ry="1.5" fill="#ff8f9c" />
            </g>
            <g className="il-m-wide">
              <path d="M-8.6 18.4c1.4 9.6 15.8 9.6 17.2 0Z" fill="#7a2638" />
              <path d="M-7.4 18.8h14.8c-0.4 1.7-1 2.7-1.7 3.1H-5.7c-0.7-0.4-1.3-1.4-1.7-3.1Z" fill="#fff" />
              <path d="M-4.6 25c2.3-2.1 6.9-2.1 9.2 0-1.4 1.7-7.8 1.7-9.2 0Z" fill="#ff8f9c" />
            </g>
          </>
        )}
      </g>
    </g>
  );
}

/**
 * A cartoon head in the style of an animated film: big glossy eyes that blink and glance around, brows that lift,
 * a mouth that smiles and talks, blushing cheeks and lit hair. (x, y) is the centre of the face. Men wear a
 * moustache (the owner also a beard and glasses). Children are drawn in the head's frame and nod with it (a cap).
 */
export function Head({
  x,
  y,
  skin,
  long = false,
  glasses = false,
  beard = false,
  moustache = false,
  lashes,
  hair,
  delay = 0,
  scale = 1,
  mouth,
  look,
  neck = true,
  children,
}: {
  x: number;
  y: number;
  skin?: string;
  long?: boolean;
  glasses?: boolean;
  beard?: boolean;
  moustache?: boolean;
  lashes?: boolean;
  hair?: HairStyle;
  delay?: number;
  scale?: number;
  mouth?: string;
  look?: string;
  neck?: boolean;
  children?: ReactNode;
}) {
  const late = delay % 2 === 1;
  const whiskers = moustache || beard;
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {neck && (
        <>
          <path d="M-13 22h26v24c-8 7-18 7-26 0Z" fill={toon.skinShade} />
          <path d="M-13 30c8 4 18 4 26 0" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="3" />
        </>
      )}
      <Anim kind="il-nod" origin="0 40" delay={delay}>
        <ToonFace skin={skin} hair={hair ?? (long ? "long" : "short")} beard={beard} />
        <Anim kind={late ? "il-brow-late" : "il-brow"}>
          <path d="M-19-9c4-4 10-4 14-1M5-10c4-3 10-3 14 1" fill="none" stroke={il.hair} strokeWidth="2.8" strokeLinecap="round" />
        </Anim>
        <ToonEyes late={late} look={look} lashes={lashes ?? long} />
        {glasses && <ToonGlasses />}
        <ToonMouth kind={mouth ?? (late ? "talk-late" : "talk")} y={whiskers ? 24.5 : 21} />
        {whiskers && <ToonMoustache />}
        {children}
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

/** A mug with rising steam, its handle on the right. (x, y) is the bottom-left of the mug. */
export function Mug({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[6, 16].map((dx, index) => (
        <Anim key={dx} kind="il-steam" delay={index * 1.3}>
          <path d={`M${dx}-30c-5-6 5-10 0-16`} fill="none" stroke={il.line} strokeWidth="2.5" strokeLinecap="round" />
        </Anim>
      ))}
      <path d="M0-26h26v20a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6Z" fill={il.paper} stroke={il.coat2} strokeWidth="1.6" />
      <path d="M26-20h4a6 6 0 0 1 0 12h-4" fill="none" stroke={il.coat2} strokeWidth="3" />
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
      {/* legs and feet stand on the ground at y = 100; the body bobs a little above them */}
      <rect x="-19" y="52" width="11" height="42" rx="4" fill={il.coat2} />
      <rect x="8" y="52" width="11" height="42" rx="4" fill={il.coat2} />
      <path d="M-29 100c0-7 4-10 10-10h7c5 0 7 4 7 10ZM5 100c0-6 2-10 7-10h7c6 0 10 3 10 10Z" fill={il.paper} stroke={il.line} strokeWidth="2" strokeLinejoin="round" />
      <Anim kind="il-hover">
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
            <path d="M36 13c-3-4-2-10 3-12l2-6c1-2.6 4.6-2 4.4 0.8l-0.6 4.4c3 1 5 4 4 8-1.4 4.6-9.6 9-12.8 4.8Z" fill={il.paper} stroke={il.line} strokeWidth="2" strokeLinejoin="round" />
          </Anim>
        ) : (
          <path d="M26 34l12 18" stroke={il.primary} strokeWidth="8" strokeLinecap="round" />
        )}
      </Anim>
    </g>
  );
}
