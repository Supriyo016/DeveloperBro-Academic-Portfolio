import type { ReactNode } from "react";
import { Anim, il, RIM, toon } from "./base";

/*
 * Bodies for the cartoon people. Everything here is drawn in "body units": a standing adult has the floor at y = 0,
 * the hips at y = -96, the shoulders at y = -174 and the centre of the face at y = -230 (draw <Head x={0} y={-230} />).
 * Place a person with <g transform="translate(x y) scale(s)">. A seated person uses the same frame: the desk top
 * sits around y = -105 and the knees just below it.
 */

export type Pt = readonly [number, number];
export type HandPose = "open" | "point" | "fist" | "mitten" | "wrap" | "pen" | "flat" | "none";

/** Shoulder joints of the standard torso: the person's right (viewer's left) and left (viewer's right). */
export const SHOULDER_R: Pt = [-42, -167];
export const SHOULDER_L: Pt = [42, -167];

const r2 = (n: number) => Math.round(n * 100) / 100;
const OUTLINE = { stroke: "#000", strokeOpacity: 0.16, strokeWidth: 1.2, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };

/** A rounded, optionally tapered capsule from a base point along an angle (degrees clockwise from straight up). */
export function capsule(bx: number, by: number, angle: number, length: number, width: number, tipWidth = width) {
  const rad = (angle * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const nx = -dy;
  const ny = dx;
  const r0 = width / 2;
  const r1 = tipWidth / 2;
  const tx = bx + dx * length;
  const ty = by + dy * length;
  return (
    `M${r2(bx + nx * r0)} ${r2(by + ny * r0)}L${r2(tx + nx * r1)} ${r2(ty + ny * r1)}` +
    `A${r2(r1)} ${r2(r1)} 0 0 0 ${r2(tx - nx * r1)} ${r2(ty - ny * r1)}` +
    `L${r2(bx - nx * r0)} ${r2(by - ny * r0)}A${r2(r0)} ${r2(r0)} 0 0 0 ${r2(bx + nx * r0)} ${r2(by + ny * r0)}Z`
  );
}

/** Angle (degrees clockwise from up) of the direction from a to b. */
export function heading(a: Pt, b: Pt) {
  return (Math.atan2(b[0] - a[0], -(b[1] - a[1])) * 180) / Math.PI;
}

function segment(a: Pt, b: Pt, wa: number, wb: number) {
  return capsule(a[0], a[1], heading(a, b), Math.hypot(b[0] - a[0], b[1] - a[1]), wa, wb);
}

type Finger = [number, number, number, number, number, number?];

const PALM = "M-9 1C-11-5-11-14-9.5-19.5H9.5C11-14 10.5-5 8.5 1Q0 4-9 1Z";
const PALM_FIST = "M-9 1C-11-5-11-14-9.6-17.6Q0-21.5 9.6-17.6C11-14 10.5-5 8.5 1Q0 4-9 1Z";

const FINGERS: Record<"open" | "mitten", Finger[]> = {
  open: [
    [-6.6, -16, -10, 14, 5.4, 5],
    [-2.2, -17, -2, 16, 5.4, 5],
    [2.2, -16.5, 5, 15, 5.4, 5],
    [6.6, -15, 13, 11.5, 4.9, 4.4],
  ],
  mitten: [
    [-5.8, -16, -2, 13, 5, 4.8],
    [-1.95, -17, 0, 15, 5, 4.8],
    [1.95, -16.5, 1, 14, 5, 4.8],
    [5.8, -15, 3, 11, 4.7, 4.4],
  ],
};
const KNUCKLES: Finger[] = [-6.3, -2.1, 2.1, 6.3].map((x) => [x, -14.5, 0, 4.2, 5.4] as Finger);

/** Where the tip of the pen ends up for a <Hand pose="pen" /> with the same placement. */
export function penTip(x: number, y: number, angle = 0, flip = false, scale = 1): Pt {
  const lx = (flip ? 1 : -1) * 8.55 * scale;
  const ly = -44.05 * scale;
  const rad = (angle * Math.PI) / 180;
  return [r2(x + lx * Math.cos(rad) - ly * Math.sin(rad)), r2(y + lx * Math.sin(rad) + ly * Math.cos(rad))];
}

/**
 * A cartoon hand. (x, y) is the wrist; with angle 0 the fingers point straight up and the thumb is on the left
 * (flip mirrors it). "open" shows a palm with spread fingers, "mitten" a relaxed hand, "wrap" fingers hooked over an
 * edge with the thumb hidden behind it, "fist" a grip around a rod, "point" an extended index finger, "pen" a writing
 * grip and "flat" a hand lying palm down, foreshortened towards the viewer.
 */
export function Hand({
  x,
  y,
  angle = 0,
  pose = "mitten",
  flip = false,
  scale = 1,
  dark = false,
}: {
  x: number;
  y: number;
  angle?: number;
  pose?: HandPose;
  flip?: boolean;
  scale?: number;
  dark?: boolean;
}) {
  if (pose === "none") return null;
  const fill = dark ? toon.skinShade : toon.skin;
  const edge = dark ? "color-mix(in srgb, var(--il-skin-shade) 72%, #000)" : "var(--il-skin-shade)";
  const skin = { fill, stroke: edge, strokeWidth: 1.3, paintOrder: "stroke" as const, strokeLinejoin: "round" as const };
  const fingers = (list: Finger[]) => list.map(([bx, by, a, l, w, t], index) => <path key={index} d={capsule(bx, by, a, l, w, t)} {...skin} />);
  const sy = pose === "flat" ? 0.62 : 1;

  let body: ReactNode;
  if (pose === "open") {
    body = (
      <>
        {fingers(FINGERS.open)}
        <path d={PALM} {...skin} />
        <path d="M-4-6c3 2 7 2 9-1" fill="none" stroke={edge} strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <path d={capsule(-8, -5, -52, 12, 6.2, 5.4)} {...skin} />
      </>
    );
  } else if (pose === "mitten" || pose === "flat" || pose === "wrap") {
    body = (
      <>
        {fingers(FINGERS.mitten)}
        <path d={PALM} {...skin} />
        {pose !== "wrap" && <path d={capsule(-8.4, -5, -26, 11, 6, 5.2)} {...skin} />}
      </>
    );
  } else if (pose === "point") {
    body = (
      <>
        <path d={capsule(-6.2, -15, -3, 17.5, 5.4, 5)} {...skin} />
        <path d={PALM_FIST} {...skin} />
        {fingers([
          [-1.8, -15, 0, 3.4, 5.2],
          [2.4, -14.5, 0, 3.2, 5.2],
          [6.4, -13.5, 0, 2.6, 4.8],
        ])}
        <path d={capsule(-8.6, -5.5, 62, 10, 6.2, 5.4)} {...skin} />
      </>
    );
  } else if (pose === "pen") {
    // Tripod grip: middle, ring and little fingers curl into the palm, the thumb and index finger pinch the pen
    // from either side near its tip, and the pen's back end rests in the web of the hand.
    body = (
      <>
        <path d={PALM_FIST} {...skin} />
        {fingers([
          [-0.6, -14.5, 0, 3.6, 5.2],
          [3.4, -14.2, 0, 3.4, 5.2],
          [7, -13.4, 4, 2.6, 4.8],
        ])}
        <path d={capsule(-9, -5, 6, 19, 6.2, 5.4)} {...skin} />
        <path d={capsule(5, 2, -16.4, 42, 4.6, 4.4)} fill={il.primary} stroke="#000" strokeOpacity="0.25" strokeWidth="0.8" />
        <path d="M-4.46-37.95L-8.55-44.05L-8.68-36.71Z" fill={il.coat} />
        <path d={capsule(-3.2, -15, -9, 18, 5.4, 5)} {...skin} />
        <path d="M-6.4-30.6c1.2 0.8 2.4 0.9 3.4 0.3" fill="none" stroke={edge} strokeWidth="0.9" strokeLinecap="round" />
      </>
    );
  } else {
    body = (
      <>
        <path d={PALM_FIST} {...skin} />
        {fingers(KNUCKLES)}
        <path d="M-4.2-13.5v4M0-14v4.4M4.2-13.5v4" stroke={edge} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <path d={capsule(-9, -6.5, 70, 11, 6.2, 5.4)} {...skin} />
      </>
    );
  }

  return (
    <g transform={`translate(${r2(x)} ${r2(y)}) rotate(${r2(angle)}) scale(${flip ? -scale : scale} ${r2(scale * sy)})`}>{body}</g>
  );
}

/**
 * An arm in a sleeve: upper arm from the shoulder to the elbow, forearm to the wrist, a shirt cuff and a hand. The
 * hand follows the forearm's direction (plus `twist`). `foreKind` animates the forearm and hand around the elbow.
 */
export function Arm({
  shoulder,
  elbow,
  wrist,
  sleeve = toon.coat,
  cuff = toon.shirt,
  width = 22,
  pose = "mitten",
  flip = false,
  twist = 0,
  handScale = 1.12,
  dark = false,
  foreKind,
  foreDelay,
  children,
}: {
  shoulder: Pt;
  elbow: Pt;
  wrist: Pt;
  sleeve?: string;
  cuff?: string | null;
  width?: number;
  pose?: HandPose;
  flip?: boolean;
  twist?: number;
  handScale?: number;
  dark?: boolean;
  foreKind?: string;
  foreDelay?: number;
  /** Drawn in the forearm's frame after the hand, e.g. an object the hand holds. */
  children?: ReactNode;
}) {
  const forearmAngle = heading(elbow, wrist);
  const rad = (forearmAngle * Math.PI) / 180;
  const back: Pt = [wrist[0] - Math.sin(rad) * 5, wrist[1] + Math.cos(rad) * 5];
  const forearm = (
    <>
      <path d={segment(elbow, wrist, width * 0.86, width * 0.72)} fill={sleeve} {...OUTLINE} />
      {cuff && <path d={segment(back, wrist, width * 0.66, width * 0.66)} fill={cuff} {...OUTLINE} />}
      <Hand x={wrist[0]} y={wrist[1]} angle={forearmAngle + twist} pose={pose} flip={flip} scale={handScale} dark={dark} />
      {children}
    </>
  );
  return (
    <g>
      <path d={segment(shoulder, elbow, width, width * 0.88)} fill={sleeve} {...OUTLINE} />
      {foreKind ? (
        <Anim kind={foreKind} origin={`${r2(elbow[0])} ${r2(elbow[1])}`} delay={foreDelay}>
          {forearm}
        </Anim>
      ) : (
        forearm
      )}
    </g>
  );
}

export type Outfit = "jacket" | "sweater" | "blouse" | "labcoat" | "gown";

const TORSO = "M-26-190C-42-189-55-183-57-166L-51-94Q0-86 51-94L57-166C55-183 42-189 26-190Z";
const TORSO_SLIM = "M-23-190C-39-189-50-183-52-166L-47-94Q0-87 47-94L52-166C50-183 39-189 23-190Z";

function Tie({ color = il.primary }: { color?: string }) {
  return (
    <g>
      <path d="M-3.6-180h7.2l2.6 6-3.6 32-2.6 5-2.6-5-3.6-32Z" fill={color} />
      <path d="M-4.4-187h8.8l-1.8 7h-5.2Z" fill={color} />
      <path d="M-1.5-176l3 3" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

/**
 * The torso from the shoulders to the hips (or to the knees for a lab coat, the ankles for a gown). `color` is the
 * main garment, `accent` the lapels or stole.
 */
export function Torso({ outfit = "jacket", color = toon.coat, accent = toon.coat2, tie = true }: { outfit?: Outfit; color?: string; accent?: string; tie?: boolean }) {
  if (outfit === "blouse") {
    return (
      <g>
        <path d={TORSO_SLIM} fill={color} {...OUTLINE} />
        <path d="M-17-190Q0-164 17-190Z" fill={toon.skinShade} />
        <path d="M-12-184Q0-168 12-184" fill="none" stroke={il.amber} strokeWidth="1.4" />
        <circle cx="0" cy="-174.5" r="2.6" fill={il.amber} />
        <path d="M-47-102Q0-94 47-102" fill="none" stroke="#000" strokeOpacity="0.1" strokeWidth="3" />
      </g>
    );
  }
  if (outfit === "sweater") {
    return (
      <g>
        <path d={TORSO} fill={color} {...OUTLINE} />
        <path d="M-17-191L-7-179L0-186L7-179L17-191Z" fill={toon.shirt} {...OUTLINE} />
        <path d="M-21-190Q0-172 21-190" fill="none" stroke="#000" strokeOpacity="0.18" strokeWidth="4" strokeLinecap="round" />
        <path d="M-51-101Q0-93 51-101" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="4" />
      </g>
    );
  }
  if (outfit === "labcoat") {
    return (
      <g>
        <path d="M-26-190C-42-189-55-183-57-166L-55-42Q0-36 55-42L57-166C55-183 42-189 26-190Z" fill={toon.paper} stroke={il.line} strokeWidth="1.5" />
        <path d="M-17-190L0-136L17-190Z" fill={color} />
        <path d="M-17-191L-7-179L0-186L7-179L17-191Z" fill={toon.shirt} {...OUTLINE} />
        {tie && <Tie color={accent} />}
        <path d="M-17-190L-29-174L-7-128L0-136ZM17-190L29-174L7-128L0-136Z" fill={toon.paper} stroke={il.line} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M0-136V-40" stroke={il.line} strokeWidth="1.5" />
        {[-116, -92, -68].map((cy) => (
          <circle key={cy} cx="-5" cy={cy} r="2.2" fill={il.line} />
        ))}
        <path d="M22-152h20v18c0 2-2 3-4 3h-12c-2 0-4-1-4-3Z" fill="none" stroke={il.line} strokeWidth="1.5" />
        <path d="M27-152v-7M33-152v-5" stroke={il.primary} strokeWidth="3" strokeLinecap="round" />
        <path d="M33-157v-3" stroke={il.amber} strokeWidth="3" strokeLinecap="round" />
      </g>
    );
  }
  if (outfit === "gown") {
    return (
      <g>
        <path d="M-26-190C-42-189-55-183-57-166L-62-14Q0-6 62-14L57-166C55-183 42-189 26-190Z" fill={color} {...OUTLINE} />
        <path d="M-15-190L0-158L15-190Z" fill={toon.shirt} />
        <path d="M-17-190L-6-150L-9-70H-21L-26-160ZM17-190L6-150L9-70H21L26-160Z" fill={accent} />
        <path d="M-21-70h12l-6 8ZM9-70h12l-6 8Z" fill={accent} />
        <path d="M-30-120Q-34-60-36-16M30-120Q34-60 36-16" fill="none" stroke="#000" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <path d={TORSO} fill={color} {...OUTLINE} />
      <path d="M-17-190L0-146L17-190Z" fill={toon.shirt} />
      <path d="M-17-191L-7-179L0-186L7-179L17-191Z" fill={toon.shirt} {...OUTLINE} />
      {tie && <Tie />}
      <path d="M-18-190L-30-174L-8-140L0-146ZM18-190L30-174L8-140L0-146Z" fill={accent} {...OUTLINE} />
      <circle cx="0" cy="-124" r="2.2" fill={accent} />
      <circle cx="0" cy="-108" r="2.2" fill={accent} />
    </g>
  );
}

/** Standing legs in trousers, with shoes, from the hips (y = -100) to the floor (y = 0). */
export function Legs({ pants = toon.coat2, shoes = il.hair }: { pants?: string; shoes?: string }) {
  return (
    <g>
      <path d="M-47-100H47L40-12H9L2-70H-2L-9-12H-40Z" fill={pants} {...OUTLINE} />
      <path d="M-2-70L-1-40M24-90l-2 30M-24-90l2 30" stroke="#000" strokeOpacity="0.1" strokeWidth="2" strokeLinecap="round" />
      <Shoes shoes={shoes} />
    </g>
  );
}

/** A pair of shoes seen from the front, resting on the floor at y = 0. */
export function Shoes({ shoes = il.hair, spread = 25 }: { shoes?: string; spread?: number }) {
  return (
    <g fill={shoes}>
      {[-spread, spread].map((cx) => (
        <g key={cx}>
          <path d={`M${cx - 20} 0c-1-9 5-15 17-15h6c12 0 18 6 17 15Z`} stroke={RIM} strokeWidth="2.4" paintOrder="stroke" />
          <path d={`M${cx - 11}-11c3-1.6 7-2 10-1.6`} fill="none" stroke="#fff" strokeOpacity="0.3" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

/** Lower legs of a seated person, seen under a desk: knees at `knee`, shoes on the floor at `floor`. */
export function SeatedLegs({ knee, floor, pants = toon.coat2, shoes = il.hair }: { knee: number; floor: number; pants?: string; shoes?: string }) {
  const shin = floor - 12;
  return (
    <g>
      <path d={`M-42 ${knee + 8}c0-9 7-13 17-13s17 4 17 13L-11 ${shin}h-26Z`} fill={pants} {...OUTLINE} />
      <path d={`M42 ${knee + 8}c0-9-7-13-17-13s-17 4-17 13L11 ${shin}h26Z`} fill={pants} {...OUTLINE} />
      <g transform={`translate(0 ${floor})`}>
        <Shoes shoes={shoes} spread={24} />
      </g>
    </g>
  );
}

/** A laptop seen from behind its open lid, so the lid's back and logo face the viewer. (x, y): centre of the base on the desk. */
export function LaptopBack({ x, y, width = 120, logo }: { x: number; y: number; width?: number; logo?: ReactNode }) {
  const w = width;
  const h = Math.round(w * 0.44);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-w / 2 - 6} -6h${w + 12}l4 6h${-w - 20}Z`} fill={il.line} />
      <rect x={-w / 2} y={-6 - h} width={w} height={h} rx="7" fill={il.paper2} stroke={il.line} strokeWidth="1.5" />
      <path d={`M${-w / 2 + 8} ${-h}h${w * 0.3}`} stroke="#fff" strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
      <g transform={`translate(0 ${-6 - h / 2})`}>
        {logo ?? (
          <g>
            <circle r={w * 0.08} fill={il.primary} opacity="0.9" />
            <circle r={w * 0.035} fill={il.paper2} />
          </g>
        )}
      </g>
    </g>
  );
}

/**
 * An office chair seen from the front under a desk: the seat edge just below the desk, the gas lift and the wheeled
 * base on the floor. Drawn behind the seated legs. `seat` and `floor` are in body units.
 */
export function OfficeChair({ seat, floor, color = il.coat }: { seat: number; floor: number; color?: string }) {
  return (
    <g>
      <rect x="-6" y={seat + 10} width="12" height={floor - seat - 22} fill={il.line} />
      <path d={`M-58 ${floor - 6}l50-8h16l50 8v4h-116Z`} fill={il.line} />
      {[-54, 0, 54].map((cx) => (
        <circle key={cx} cx={cx} cy={floor - 4} r="4" fill={il.hair} />
      ))}
      <rect x="-62" y={seat} width="124" height="13" rx="6.5" fill={color} />
    </g>
  );
}

/**
 * An open book held up by a reader who faces the viewer: we see the outside of the covers (back cover on the left,
 * front cover with its title on the right, the spine in the middle), never the pages. With `flip`, a page now and then
 * rises over the top edge as it is turned. Centred on (0, 0); `w` by `h` in the caller's units.
 */
export function BookBack({ color, w = 104, h = 56, flip = false }: { color: string; w?: number; h?: number; flip?: boolean }) {
  const x = w / 2;
  const y = h / 2;
  const dark = `color-mix(in srgb, ${color} 72%, #000)`;
  return (
    <g>
      {flip && (
        <Anim kind="il-pageflip" origin={`0 ${-y}`}>
          <path d={`M0 ${-y}c4-${y * 0.36} ${x * 0.6}-${y * 0.5} ${x * 0.84}-${y * 0.2}l-2 3c-${x * 0.26}-${y * 0.2}-${x * 0.68}-${y * 0.16}-${x * 0.8} 3Z`} fill={il.paper} stroke={il.line} strokeWidth="1" />
        </Anim>
      )}
      <path d={`M-3 ${-y + 1}L${-x} ${-y + 4.5}V${y - 2}L-3 ${y + 1}Z`} fill={color} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M3 ${-y + 1}L${x} ${-y + 4.5}V${y - 2}L3 ${y + 1}Z`} fill={color} stroke={dark} strokeWidth="1.2" strokeLinejoin="round" />
      <path d={`M${-x + 2} ${-y + 6}L-4 ${-y + 3}`} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="-4.5" y={-y - 0.5} width="9" height={h + 2} rx="2" fill={dark} />
      <path d={`M-4.5 ${-y + 7}h9M-4.5 ${y - 6}h9`} stroke={il.paper} strokeOpacity="0.55" strokeWidth="1.4" />
      <rect x={x * 0.26} y={-y * 0.5} width={x * 0.56} height={h * 0.1} rx="1.5" fill={il.paper} opacity="0.9" />
      <rect x={x * 0.34} y={-y * 0.2} width={x * 0.4} height={h * 0.05} rx="1" fill={il.paper} opacity="0.6" />
      <circle cx={x * 0.54} cy={y * 0.36} r={h * 0.13} fill="none" stroke={il.paper} strokeWidth="1.6" opacity="0.8" />
      <path d={`M${-x * 0.8} ${y * 0.45}h${x * 0.46}M${-x * 0.8} ${y * 0.62}h${x * 0.32}`} stroke={il.paper} strokeOpacity="0.45" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

/** Both hands of a reader gripping the side edges of a <BookBack />: fingers hook over the cover, thumbs hidden behind. */
export function BookGrip({ w = 104, y = 0, dark = false, scale = 1.02 }: { w?: number; y?: number; dark?: boolean; scale?: number }) {
  const x = w / 2 + 8;
  return (
    <g>
      <Hand x={-x} y={y} angle={90} pose="wrap" scale={scale} dark={dark} />
      <Hand x={x} y={y} angle={-90} pose="wrap" flip scale={scale} dark={dark} />
    </g>
  );
}
