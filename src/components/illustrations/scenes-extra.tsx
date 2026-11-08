import { Anim, Head, il, Mug, Plant, Robot, Scene, Sparkle, toon } from "./base";
import { Arm, LaptopBack, OfficeChair, SeatedLegs, SHOULDER_L, SHOULDER_R, Torso } from "./body";

const orbit = (rx: number, ry: number) => `M${-rx} 0a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

/** B.Tech work: a researcher running a circuit while a qubit precesses on a Bloch sphere. */
export function QuantumScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A bearded researcher with glasses types at a laptop on his desk, running a quantum circuit, beside a Bloch sphere whose state vector rotates and electrons orbiting an atom.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="374" rx="190" ry="11" fill={il.ground} />

      <g transform="translate(380 150) scale(0.82)">
        <circle r="74" fill={il.paper} stroke={il.line} strokeWidth="2" />
        <ellipse rx="74" ry="24" fill="none" stroke={il.line} strokeWidth="1.5" strokeDasharray="4 6" className="il-dash" />
        <path d="M0-74V74M-74 0H74" stroke={il.line} strokeWidth="1" />
        <text x="-9" y="-80" fontFamily="var(--font-newsreader), serif" fontSize="16" fill={il.ink}>|0⟩</text>
        <text x="-9" y="96" fontFamily="var(--font-newsreader), serif" fontSize="16" fill={il.ink}>|1⟩</text>
        <Anim kind="il-clock" origin="0 0">
          <path d="M0 0L40-50" stroke={il.primary} strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="40" cy="-50" r="7" fill={il.primary} />
        </Anim>
        <circle r="4" fill={il.amber} className="il-orbit" style={{ offsetPath: `path("${orbit(74, 24)}")` }} />
        <circle r="5" fill={il.onPaper} />
      </g>

      <g transform="translate(62 176) scale(0.75)">
        <circle r="10" fill={il.amber} className="il-pulse" />
        {[0, 60, 120].map((angle, index) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse rx="46" ry="15" fill="none" stroke={il.cyan} strokeWidth="1.8" />
            <circle r="4.5" fill={il.cyan} className="il-orbit" style={{ offsetPath: `path("${orbit(46, 15)}")`, animationDelay: `${index * -2}s`, animationDuration: "3.6s" }} />
          </g>
        ))}
      </g>

      <g className="il-float">
        <g transform="translate(96 30)">
          <rect width="210" height="76" rx="10" fill={il.paper} stroke={il.line} />
          <path d="M14 26h182M14 54h182" stroke={il.line} strokeWidth="2" />
          <rect x="34" y="14" width="24" height="24" rx="4" fill={il.primary} />
          <text x="46" y="31" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="13" fill={il.paper}>H</text>
          <circle cx="96" cy="26" r="6" fill={il.onPaper} />
          <path d="M96 26v28" stroke={il.onPaper} strokeWidth="2" />
          <circle cx="96" cy="54" r="10" fill="none" stroke={il.onPaper} strokeWidth="2" />
          <path d="M86 54h20M96 44v20" stroke={il.onPaper} strokeWidth="2" />
          <rect x="136" y="42" width="24" height="24" rx="4" fill={il.amber} />
          <text x="148" y="59" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="13" fill={il.onPaper}>X</text>
          <g transform="translate(172 14)">
            <rect width="26" height="24" rx="4" fill={il.cyan} />
            <path d="M5 18a8 8 0 0 1 16 0" fill="none" stroke={il.paper} strokeWidth="2" />
            <Anim kind="il-point" origin="13 18">
              <path d="M13 18l6-9" stroke={il.paper} strokeWidth="2" strokeLinecap="round" />
            </Anim>
          </g>
          <circle r="4" fill={il.primary} className="il-orbit" style={{ offsetPath: 'path("M14 26H196")', animationDuration: "2.8s" }} />
          <circle r="4" fill={il.amber} className="il-orbit" style={{ offsetPath: 'path("M14 54H196")', animationDuration: "2.8s", animationDelay: "-1.4s" }} />
        </g>
      </g>

      <g transform="translate(165 358.4) scale(0.85)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="jacket" color={toon.coat2} accent={toon.coat} />
          <Arm shoulder={SHOULDER_R} elbow={[-66, -118]} wrist={[-32, -106]} sleeve={toon.coat2} pose="none" foreKind="il-type" />
          <Arm shoulder={SHOULDER_L} elbow={[66, -118]} wrist={[32, -106]} sleeve={toon.coat2} pose="none" foreKind="il-type-late" />
          <Head x={0} y={-230} glasses beard delay={1} look="il-screen-look" />
        </Anim>
      </g>
      <rect x="40" y="269" width="260" height="12" rx="5" fill={il.wood} />
      <path d="M62 281h12l-4 91h-6ZM266 281h12l-2 91h-6Z" fill={il.wood} opacity="0.75" />
      <LaptopBack x={165} y={269} width={92} />
      <Mug x={50} y={269} />
      <Plant x={432} y={349.6} scale={0.8} />
      <Sparkle x={330} y={50} size={8} delay={0.2} />
      <Sparkle x={30} y={110} size={6} color={il.primary} delay={1.1} />
    </Scene>
  );
}

const hospitals = [
  { x: 470, w: 70, h: 92 },
  { x: 560, w: 86, h: 120 },
  { x: 666, w: 64, h: 84 },
  { x: 752, w: 92, h: 108 },
];

/** A wide footer panorama: the researcher at work, hospitals exchanging encrypted updates, and the assistant waving. */
export function FooterScene() {
  const server = { x: 640, y: 46 };
  return (
    <Scene
      viewBox="0 0 1200 230"
      className="h-auto w-full"
      label="A panorama: a bearded researcher with glasses typing at a laptop on his desk, four hospitals sending encrypted updates to a locked server, a quantum atom, a plant, and the site's robot assistant waving."
    >
      <defs>
        <linearGradient id="footer-ground" x1="0" x2="1">
          <stop offset="0" stopColor="var(--il-lavender)" stopOpacity="0.5" />
          <stop offset="0.5" stopColor="var(--il-cyan-soft)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--il-lavender)" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <rect x="0" y="206" width="1200" height="24" fill="url(#footer-ground)" />
      {[
        [80, 40, 6], [210, 26, 5], [330, 60, 4], [930, 30, 6], [1050, 64, 5], [1150, 24, 4], [520, 22, 4], [860, 70, 3],
      ].map(([x, y, s], index) => (
        <Sparkle key={index} x={x as number} y={y as number} size={s as number} color={index % 2 ? il.cyan : il.amber} delay={index * 0.37} />
      ))}

      {/* The researcher at his desk, typing; the laptop faces him */}
      <g transform="translate(176 196.1) scale(0.62)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat2} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="jacket" />
          <Arm shoulder={SHOULDER_R} elbow={[-66, -118]} wrist={[-32, -106]} pose="none" foreKind="il-type" />
          <Arm shoulder={SHOULDER_L} elbow={[66, -118]} wrist={[32, -106]} pose="none" foreKind="il-type-late" />
          <Head x={0} y={-230} beard glasses look="il-screen-look" />
        </Anim>
      </g>
      <rect x="70" y="131" width="250" height="10" rx="4" fill={il.wood} />
      <path d="M92 141h10l-4 65h-6ZM290 141h10l-2 65h-6Z" fill={il.wood} opacity="0.75" />
      <LaptopBack x={176} y={131} width={66} />
      <Mug x={246} y={131} />
      <Plant x={300} y={115.6} scale={0.55} />

      {/* Federated hospitals and the locked aggregator */}
      {hospitals.map((h, index) => {
        const top = 206 - h.h;
        const link = `M${h.x + h.w / 2} ${top}Q${(h.x + h.w / 2 + server.x) / 2} ${Math.min(top, server.y) - 30} ${server.x} ${server.y}`;
        return (
          <g key={h.x}>
            <path d={link} fill="none" stroke={il.line} strokeWidth="1.4" className="il-dash" />
            <circle r="4.5" fill={index % 2 ? il.cyan : il.primary} className="il-packet" style={{ offsetPath: `path("${link}")`, animationDelay: `${index * 1.1}s` }} />
            <rect x={h.x} y={top} width={h.w} height={h.h} rx="6" fill={il.paper} stroke={il.line} />
            <path d={`M${h.x + h.w / 2 - 6} ${top + 14}h12M${h.x + h.w / 2} ${top + 8}v12`} stroke={il.cyan} strokeWidth="4" strokeLinecap="round" />
            {Array.from({ length: Math.floor((h.h - 40) / 22) }).flatMap((_, row) =>
              [0, 1, 2].map((col) => (
                <rect
                  key={`${row}-${col}`}
                  x={h.x + 10 + col * ((h.w - 20) / 3)}
                  y={top + 30 + row * 22}
                  width={(h.w - 20) / 3 - 6}
                  height="12"
                  rx="2"
                  fill={il.amber}
                  className="il-twinkle"
                  style={{ animationDelay: `${(row * 3 + col + index) * 0.41}s`, animationDuration: "2.6s" }}
                />
              )),
            )}
          </g>
        );
      })}
      <g transform={`translate(${server.x} ${server.y})`}>
        <circle r="30" fill={il.primary} opacity="0.15" className="il-pulse" />
        <circle r="38" fill="none" stroke={il.primary} strokeDasharray="3 8" className="il-spin" />
        <circle r="20" fill={il.primary} />
        <rect x="-7" y="-2" width="14" height="11" rx="2" fill={il.paper} />
        <path d="M-4.5-2v-4a4.5 4.5 0 0 1 9 0v4" fill="none" stroke={il.paper} strokeWidth="2.2" />
      </g>

      {/* Quantum atom */}
      <g transform="translate(940 120)">
        <circle r="7" fill={il.amber} className="il-pulse" />
        {[0, 60, 120].map((angle, index) => (
          <g key={angle} transform={`rotate(${angle})`}>
            <ellipse rx="34" ry="11" fill="none" stroke={il.cyan} strokeWidth="1.5" />
            <circle r="3.5" fill={il.cyan} className="il-orbit" style={{ offsetPath: `path("${orbit(34, 11)}")`, animationDelay: `${index * -1.3}s`, animationDuration: "3.2s" }} />
          </g>
        ))}
      </g>

      {/* The assistant */}
      <Robot x={1080} y={136} scale={0.7} />
      <g className="chat-hint" style={{ animationDelay: "1s" }}>
        <rect x="986" y="58" width="76" height="28" rx="12" fill={il.paper} stroke={il.line} />
        <text x="1024" y="77" textAnchor="middle" fontFamily="var(--font-geist), sans-serif" fontSize="13" fill={il.onPaper}>Hello!</text>
      </g>
      <Plant x={1170} y={206} scale={0.6} />
    </Scene>
  );
}
