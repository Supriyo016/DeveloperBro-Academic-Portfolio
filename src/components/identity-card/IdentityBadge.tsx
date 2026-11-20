"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { isCalm } from "@/lib/consent";
import { BadgeFace } from "./BadgeFace";
import { badge } from "./identity-card-data";
import styles from "./identity-card.module.css";

// A hanging badge on a flexible lanyard. The strap is a chain of points moved with Verlet integration and kept at
// fixed spacing by distance constraints; the badge hangs from the last point. The loop runs only while the badge
// moves and is on screen. At rest a CSS sway takes over, and with reduced motion or the pause switch it hangs still.

const SEGMENTS = 9;
const GRAVITY = 2200; // px/s²
const DAMPING = 0.979;
const STEP = 1 / 120;
const ITERATIONS = 14;
const END_WEIGHT = 0.25; // the badge is heavier than a strap point, so constraints move it less
/** At rest the badge is turned slightly towards the page, as in the reference. */
const REST_YAW = -16;
const REST_TILT = 3;

type Vec = { x: number; y: number };

interface Sim {
  points: Vec[];
  previous: Vec[];
  anchor: Vec;
  segment: number;
  cardWidth: number;
  drag: { offset: Vec; target: Vec; samples: { x: number; y: number; t: number }[] } | null;
  yaw: number;
  pitch: number;
  still: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function IdentityBadge() {
  const stage = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const strap = useRef<SVGPathElement>(null);
  const edge = useRef<SVGPathElement>(null);
  const sim = useRef<Sim | null>(null);
  const frame = useRef(0);
  const visible = useRef(true);
  const [resting, setResting] = useState(false);

  /** Writes the current simulation state to the strap path and the card transform. */
  const paint = useCallback(() => {
    const state = sim.current;
    if (!state || !card.current || !strap.current) return;
    const p = state.points;
    let d = `M${p[0]!.x.toFixed(1)} ${p[0]!.y.toFixed(1)}`;
    for (let i = 1; i < p.length - 1; i += 1) {
      const mid = { x: (p[i]!.x + p[i + 1]!.x) / 2, y: (p[i]!.y + p[i + 1]!.y) / 2 };
      d += ` Q${p[i]!.x.toFixed(1)} ${p[i]!.y.toFixed(1)} ${mid.x.toFixed(1)} ${mid.y.toFixed(1)}`;
    }
    const end = p[p.length - 1]!;
    const before = p[p.length - 2]!;
    d += ` L${end.x.toFixed(1)} ${end.y.toFixed(1)}`;
    strap.current.setAttribute("d", d);
    edge.current?.setAttribute("d", d);

    const angle = (-Math.atan2(end.x - before.x, end.y - before.y) * 180) / Math.PI;
    const prevEnd = state.previous[p.length - 1]!;
    const vx = (end.x - prevEnd.x) / STEP;
    const vy = (end.y - prevEnd.y) / STEP;
    state.yaw += (clamp(vx * 0.03, -28, 28) - state.yaw) * 0.15;
    state.pitch += (clamp(-vy * 0.015, -14, 14) - state.pitch) * 0.15;
    card.current.dataset.placed = "true";
    card.current.style.transform = `translate3d(${(end.x - state.cardWidth / 2).toFixed(1)}px, ${(end.y + 22).toFixed(1)}px, 0) rotateZ(${(angle + REST_TILT).toFixed(2)}deg) rotateY(${(state.yaw + REST_YAW).toFixed(2)}deg) rotateX(${state.pitch.toFixed(2)}deg)`;
  }, []);

  /** Places the strap hanging straight down, optionally swung out to one side for the entrance. */
  const reset = useCallback(
    (swing: number) => {
      const element = stage.current;
      const badgeElement = card.current;
      if (!element || !badgeElement) return;
      const width = element.clientWidth;
      const height = element.clientHeight;
      const cardWidth = badgeElement.offsetWidth;
      const cardHeight = badgeElement.offsetHeight;
      // Hang right of centre on wide layouts, as in the reference; centred on phones.
      const anchor = { x: width * (width > 420 ? 0.6 : 0.5), y: -30 };
      element.style.setProperty("--anchor-x", `${anchor.x}px`);
      const length = Math.max(height - cardHeight - 60, 90);
      const segment = length / SEGMENTS;
      const points: Vec[] = [];
      for (let i = 0; i <= SEGMENTS; i += 1) {
        const t = i / SEGMENTS;
        points.push({ x: anchor.x + Math.sin(swing) * length * t, y: anchor.y + Math.cos(swing) * length * t });
      }
      sim.current = { points, previous: points.map((point) => ({ ...point })), anchor, segment, cardWidth, drag: null, yaw: 0, pitch: 0, still: 0 };
      paint();
    },
    [paint],
  );

  const step = useCallback(() => {
    const state = sim.current;
    if (!state) return 0;
    const { points, previous } = state;
    const last = points.length - 1;
    let motion = 0;
    for (let i = 1; i <= last; i += 1) {
      const point = points[i]!;
      const before = previous[i]!;
      if (i === last && state.drag) {
        previous[i] = { ...point };
        points[i] = { ...state.drag.target };
        continue;
      }
      const vx = (point.x - before.x) * DAMPING;
      const vy = (point.y - before.y) * DAMPING;
      previous[i] = { ...point };
      points[i] = { x: point.x + vx, y: point.y + vy + GRAVITY * STEP * STEP };
      motion += Math.abs(vx) + Math.abs(vy);
    }
    for (let k = 0; k < ITERATIONS; k += 1) {
      points[0] = { ...state.anchor };
      for (let i = 0; i < last; i += 1) {
        const a = points[i]!;
        const b = points[i + 1]!;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 0.0001;
        const error = (distance - state.segment) / distance;
        const fixedA = i === 0;
        const fixedB = i + 1 === last && Boolean(state.drag);
        const weightB = i + 1 === last ? END_WEIGHT : 1;
        const share = fixedA ? (fixedB ? 0 : 1) : fixedB ? 0 : weightB / (1 + weightB);
        const shareA = fixedA ? 0 : fixedB ? 1 : 1 - share;
        points[i] = { x: a.x + dx * error * shareA, y: a.y + dy * error * shareA };
        points[i + 1] = { x: b.x - dx * error * share, y: b.y - dy * error * share };
      }
    }
    return motion;
  }, []);

  const run = useCallback(() => {
    cancelAnimationFrame(frame.current);
    let last = performance.now();
    let carry = 0;
    const loop = (now: number) => {
      const state = sim.current;
      if (!state || !visible.current || document.documentElement.dataset.motion === "paused") {
        frame.current = 0;
        return;
      }
      carry = Math.min(carry + (now - last) / 1000, 0.1);
      last = now;
      let motion = 0;
      while (carry >= STEP) {
        motion = step();
        carry -= STEP;
      }
      paint();
      state.still = !state.drag && motion < 0.02 * SEGMENTS ? state.still + 1 : 0;
      if (state.still > 40) {
        frame.current = 0;
        setResting(true);
        return;
      }
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);
  }, [paint, step]);

  useEffect(() => {
    const calm = isCalm();
    reset(calm ? 0 : 0.9);
    if (!calm) run();

    const element = stage.current;
    const resize = new ResizeObserver(() => {
      reset(0);
      if (!isCalm()) {
        setResting(false);
        run();
      }
    });
    if (element) resize.observe(element);
    const io = new IntersectionObserver(([entry]) => {
      visible.current = Boolean(entry?.isIntersecting);
    });
    if (element) io.observe(element);
    return () => {
      cancelAnimationFrame(frame.current);
      resize.disconnect();
      io.disconnect();
    };
  }, [reset, run]);

  const toStage = (event: React.PointerEvent) => {
    const box = stage.current!.getBoundingClientRect();
    return { x: event.clientX - box.left, y: event.clientY - box.top };
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = sim.current;
    if (!state || isCalm()) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pointer = toStage(event);
    const end = state.points[state.points.length - 1]!;
    state.drag = { offset: { x: pointer.x - end.x, y: pointer.y - end.y }, target: { ...end }, samples: [{ ...pointer, t: performance.now() }] };
    setResting(false);
    if (!frame.current) run();
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = sim.current;
    if (!state?.drag) return;
    const pointer = toStage(event);
    const reach = state.segment * SEGMENTS * 1.25;
    const x = pointer.x - state.drag.offset.x;
    const y = pointer.y - state.drag.offset.y;
    const dx = x - state.anchor.x;
    const dy = y - state.anchor.y;
    const distance = Math.hypot(dx, dy);
    const scale = distance > reach ? reach / distance : 1;
    state.drag.target = { x: state.anchor.x + dx * scale, y: state.anchor.y + dy * scale };
    state.drag.samples = [...state.drag.samples.slice(-4), { ...pointer, t: performance.now() }];
  };

  const release = () => {
    const state = sim.current;
    if (!state?.drag) return;
    const samples = state.drag.samples;
    const first = samples[0]!;
    const latest = samples[samples.length - 1]!;
    const seconds = Math.max((latest.t - first.t) / 1000, 0.016);
    const velocity = { x: clamp((latest.x - first.x) / seconds, -2600, 2600), y: clamp((latest.y - first.y) / seconds, -2600, 2600) };
    const last = state.points.length - 1;
    state.previous[last] = { x: state.points[last]!.x - velocity.x * STEP, y: state.points[last]!.y - velocity.y * STEP };
    state.drag = null;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const state = sim.current;
    const push: Record<string, Vec> = { ArrowLeft: { x: -9, y: 0 }, ArrowRight: { x: 9, y: 0 }, ArrowUp: { x: 0, y: -9 }, ArrowDown: { x: 0, y: 4 } };
    const impulse = push[event.key];
    if (!state || !impulse || isCalm()) return;
    event.preventDefault();
    const last = state.points.length - 1;
    state.previous[last] = { x: state.previous[last]!.x - impulse.x, y: state.previous[last]!.y - impulse.y };
    setResting(false);
    if (!frame.current) run();
  };

  return (
    <div ref={stage} className={styles.stage}>
      <div className={styles.rig} data-resting={resting} style={{ transformOrigin: "var(--anchor-x, 50%) -30px" }}>
        <svg className={styles.strap} aria-hidden>
          <path ref={strap} id="identity-strap" className={styles.strapBand} />
          <path ref={edge} className={styles.strapEdge} />
          <text className={styles.strapText}>
            <textPath href="#identity-strap" startOffset="6%">
              {badge.strapText.repeat(3)}
            </textPath>
          </text>
        </svg>
        <div
          ref={card}
          className={styles.card}
          role="group"
          aria-roledescription="identity badge"
          aria-label={`Identity badge: ${badge.name}, ${badge.role.toLowerCase()}, ${badge.footer}. Drag it, or press the arrow keys to swing it.`}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={onKeyDown}
        >
          <span className={styles.clip} aria-hidden />
          <BadgeFace />
        </div>
      </div>
    </div>
  );
}
