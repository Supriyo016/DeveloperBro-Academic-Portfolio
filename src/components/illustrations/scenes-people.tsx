import { Anim, Books, Head, il, Plant, Scene, Sparkle, toon } from "./base";

export function ReadingScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student sitting on a stack of books, reading, with mathematical symbols floating nearby.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="372" rx="170" ry="11" fill={il.ground} />
      <g fontFamily="var(--font-newsreader), serif" fontStyle="italic" fill={il.primary}>
        <text x="84" y="110" fontSize="44" className="il-float">Σ</text>
        <text x="376" y="96" fontSize="36" fill={il.cyan} className="il-bob">∇</text>
        <text x="392" y="208" fontSize="30" fill={il.amber} className="il-bob" style={{ animationDelay: "1s" }}>π</text>
        <text x="58" y="222" fontSize="30" fill={il.cyan} className="il-bob" style={{ animationDelay: "1.8s" }}>∫</text>
      </g>
      <rect x="150" y="334" width="190" height="34" rx="5" fill={il.primary} />
      <rect x="162" y="304" width="170" height="30" rx="5" fill={il.amber} />
      <rect x="146" y="278" width="184" height="26" rx="5" fill={il.cyan} />
      <path d="M170 320h100M172 352h120" stroke={il.paper} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <Anim kind="il-breathe" origin="250 278">
        <path d="M196 278c-6-58 8-108 50-112 40-4 56 34 58 112Z" fill={toon.lavender} />
      </Anim>
      <path d="M210 276c40-16 90-12 138 8 10 4 12 18 2 22l-58 4c-40 2-80-10-82-34Z" fill={toon.coat} />
      <path d="M322 296l36 4c10 2 12 14 2 16l-40 2Z" fill={il.hair} />
      <path d="M240 142h34v34c-10 10-24 10-34 0Z" fill={toon.skinShade} />
      <Head x={258} y={118} scale={1.18} hair="long" delay={1} />
      <path d="M252 192c30 8 56 26 66 44l-14 12c-16-14-40-26-62-30Z" fill={toon.lavender} />
      <path d="M300 226l54-26 4 8c-14 12-32 26-52 36Z" fill={toon.skin} />
      <Anim kind="il-bob">
        <g transform="rotate(-18 330 206)">
          <path d="M284 196c18-8 34-8 46 0v48c-12-8-28-8-46 0Z" fill={il.paper} stroke={il.line} />
          <path d="M376 196c-18-8-34-8-46 0v48c12-8 28-8 46 0Z" fill={il.paper2} stroke={il.line} />
          <path d="M330 196c14-8 30-8 46 0v48c-16-8-32-8-46 0Z" fill={il.paper} stroke={il.line} className="il-page" />
          <path d="M294 212c10-4 20-4 28 0M294 224c10-4 20-4 28 0M338 212c10-4 20-4 28 0" stroke={il.line} strokeWidth="2" fill="none" />
        </g>
      </Anim>
      <Sparkle x={150} y={70} size={8} delay={0.5} />
    </Scene>
  );
}

export function GraduationScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A graduate in cap and gown holding a scroll in front of a university building.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="374" rx="190" ry="11" fill={il.ground} />
      <g>
        <rect x="74" y="176" width="262" height="194" fill={il.paper} stroke={il.line} />
        <path d="M58 180L205 96l147 84Z" fill={il.primary} />
        <circle cx="205" cy="146" r="16" fill={il.paper} />
        <Anim kind="il-clock" origin="205 146">
          <path d="M205 146v-10" fill="none" stroke={il.primary} strokeWidth="2.5" strokeLinecap="round" />
        </Anim>
        <path d="M205 146l7 5" fill="none" stroke={il.primary} strokeWidth="2.5" strokeLinecap="round" />
        {[92, 136, 180, 224, 268, 312].map((x) => (
          <rect key={x} x={x - 7} y="194" width="14" height="150" fill={il.paper2} />
        ))}
        <rect x="64" y="344" width="282" height="26" fill={toon.lavender} />
        <rect x="186" y="270" width="38" height="74" rx="19" fill={toon.coat} />
      </g>
      <Plant x={402} y={338} scale={0.9} />
      <Anim kind="il-breathe" origin="358 372">
        <path d="M300 372c0-90 12-160 52-176 44 14 60 90 64 176Z" fill={toon.coat} />
        <path d="M340 198h28l-14 34Z" fill={toon.shirt} />
      </Anim>
      <path d="M338 170h32v28c-8 10-24 10-32 0Z" fill={toon.skinShade} />
      <Head x={354} y={148} scale={1.08} skin={il.skinShade} />
      <Anim kind="il-nod" origin="354 191">
        <path d="M354 96l58 22-58 22-58-22Z" fill={toon.hair} />
        <path d="M330 124h48v10c-14 6-34 6-48 0Z" fill={toon.hair} />
        <Anim kind="il-sway" origin="410 118">
          <path d="M410 118v30" stroke={il.amber} strokeWidth="3" />
          <circle cx="410" cy="152" r="5" fill={il.amber} />
        </Anim>
      </Anim>
      <Anim kind="il-wave" origin="398 224">
        <path d="M396 226c20-14 34-36 40-60l-14-6c-10 20-24 34-44 44Z" fill={toon.coat2} />
        <circle cx="430" cy="156" r="11" fill={toon.skinShade} />
        <g transform="rotate(-24 430 140)">
          <rect x="396" y="130" width="70" height="20" rx="10" fill={il.paper} stroke={il.line} />
          <rect x="425" y="128" width="10" height="24" fill={il.amber} />
        </g>
      </Anim>
      <Sparkle x={120} y={120} size={8} delay={0.3} />
      <Sparkle x={440} y={86} size={7} color={il.cyan} delay={1} />
    </Scene>
  );
}

export function LabScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A researcher in a lab coat beside a monitor showing a learning curve, a flask and a Bloch sphere.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="372" rx="190" ry="11" fill={il.ground} />
      <rect x="40" y="290" width="330" height="14" rx="5" fill={il.wood} />
      <path d="M66 304h14l-4 66h-8ZM330 304h14l-2 66h-8Z" fill={il.wood} opacity="0.75" />
      <rect x="62" y="130" width="176" height="124" rx="10" fill={toon.coat} />
      <rect x="72" y="140" width="156" height="104" rx="5" fill={il.paper} />
      <path d="M84 230h132M84 150v80" stroke={il.line} strokeWidth="1.5" />
      <path d="M84 222c26-46 44-58 68-62 22-4 42-6 64-6" fill="none" stroke={il.primary} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" />
      <path d="M84 226c28-24 46-36 68-40s42-6 64-6" fill="none" stroke={il.cyan} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" style={{ animationDelay: "0.8s" }} />
      <path d="M138 254h24l6 36h-36Z" fill={toon.coat2} />
      <g transform="translate(290 240)">
        <circle r="42" fill="none" stroke={il.primary} strokeWidth="2.5" />
        <ellipse rx="42" ry="14" fill="none" stroke={il.primary} strokeWidth="1.5" />
        <Anim kind="il-clock" origin="0 0">
          <path d="M0 0L24-30" stroke={il.amber} strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="-30" r="5" fill={il.amber} />
        </Anim>
        <path d="M0-42V42" stroke={il.line} strokeWidth="1.5" />
        <path d="M-14 50h28l4 0" stroke={il.ink} strokeWidth="0" />
        <rect x="-16" y="42" width="32" height="8" rx="3" fill={toon.coat2} />
      </g>
      <g transform="translate(36 214)">
        <path d="M14 0h16v26l18 42a7 7 0 0 1-6 10H2a7 7 0 0 1-6-10l18-42Z" fill={il.paper} stroke={il.line} />
        <path d="M3 56h38l5 12a4 4 0 0 1-4 6H2a4 4 0 0 1-4-6Z" fill={il.cyan} />
        {[14, 26, 20].map((cx, index) => (
          <Anim key={index} kind="il-steam" delay={index * 0.9}>
            <circle cx={cx} cy={52 - index * 4} r="3" fill={il.cyan} />
          </Anim>
        ))}
      </g>
      <Anim kind="il-breathe" origin="408 372">
        <path d="M368 372c-6-70-2-136 32-168 34 6 54 60 48 168Z" fill={il.paper} stroke={il.line} />
        <path d="M392 208l14 40 16-42Z" fill={il.primary} />
      </Anim>
      <path d="M392 178h30v30c-8 8-22 8-30 0Z" fill={toon.skinShade} />
      <Head x={406} y={152} glasses />
      <Anim kind="il-point" origin="382 224">
        <path d="M380 222c-16 8-28 22-36 40l14 8c10-14 20-24 34-30Z" fill={il.paper} stroke={il.line} />
        <circle cx="346" cy="268" r="9" fill={toon.skin} />
      </Anim>
      <Sparkle x={250} y={96} size={8} color={il.cyan} delay={0.6} />
    </Scene>
  );
}

export function LostScene() {
  return (
    <Scene viewBox="0 0 480 360" label="A person with a magnifying glass looking for a node that has come loose from a network.">
      <circle cx="240" cy="180" r="160" fill={il.soft} />
      <ellipse cx="240" cy="336" rx="170" ry="10" fill={il.ground} />
      <g stroke={il.line} strokeWidth="2">
        <path d="M86 118l70-44M156 74l76 40M86 118l52 74M138 192l94-78" className="il-dash" />
      </g>
      {[
        [86, 118],
        [156, 74],
        [232, 114],
        [138, 192],
      ].map(([cx, cy]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r="14" fill={il.primary} className="il-pulse" style={{ animationDelay: `${(cx ?? 0) / 100}s` }} />
      ))}
      <path d="M232 114l60 22" stroke={il.line} strokeWidth="2" className="il-dash" />
      <circle cx="396" cy="92" r="14" fill={il.amber} className="il-float" />
      <Anim kind="il-breathe" origin="310 336">
        <path d="M272 336c-4-64 2-106 34-124 34 10 46 56 42 124Z" fill={toon.coat} />
      </Anim>
      <path d="M294 186h26v24c-6 8-20 8-26 0Z" fill={toon.skinShade} />
      <Head x={307} y={164} skin={il.skinShade} hair="curly" delay={1} />
      <Anim kind="il-point" origin="340 232">
        <path d="M340 232c16-12 28-28 36-50l-14-6c-8 16-20 28-34 38Z" fill={toon.coat2} />
        <circle cx="376" cy="160" r="22" fill={il.paper} stroke={il.primary} strokeWidth="5" opacity="0.9" />
        <path d="M368 152c4-4 10-4 14 0" fill="none" stroke={il.primary} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M364 176l-12 14" stroke={il.primary} strokeWidth="6" strokeLinecap="round" />
      </Anim>
      <Sparkle x={420} y={64} size={7} delay={0.4} />
      <Books x={60} y={336} />
    </Scene>
  );
}
