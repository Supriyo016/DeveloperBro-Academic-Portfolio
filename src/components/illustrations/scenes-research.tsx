import { Anim, Books, CodeLines, Head, il, Laptop, Mug, Plant, Scene, Sparkle, toon } from "./base";

const backdrop = <circle cx="240" cy="200" r="176" fill={il.soft} />;
const ground = <ellipse cx="240" cy="374" rx="190" ry="11" fill={il.ground} />;

export function MriScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A researcher studying a brain MRI scan on a lightbox.">
      {backdrop}
      {ground}
      <rect x="52" y="92" width="232" height="192" rx="12" fill={toon.coat} />
      <rect x="64" y="104" width="208" height="168" rx="6" fill={il.onPaper} />
      <g transform="translate(168 188)">
        <ellipse rx="66" ry="74" fill="#d9dcea" />
        <ellipse rx="56" ry="64" fill="#9aa1bd" />
        <path d="M0-62C-8-30 8-14 0 0S-10 40 0 62" fill="none" stroke="#d9dcea" strokeWidth="3" />
        <path d="M-40-24c12 6 20 18 22 34M40-24c-12 6-20 18-22 34M-36 26c10-6 18-6 26 0M36 26c-10-6-18-6-26 0" fill="none" stroke="#d9dcea" strokeWidth="3" strokeLinecap="round" />
        <ellipse cx="-14" cy="-6" rx="9" ry="16" fill="#3b4063" />
        <ellipse cx="14" cy="-6" rx="9" ry="16" fill="#3b4063" />
        <circle cx="30" cy="-30" r="20" fill="none" stroke={il.amber} strokeWidth="3" className="il-pulse" />
        <rect x="-70" y="-2" width="140" height="4" rx="2" fill={il.cyan} className="il-scan" />
      </g>
      <text x="74" y="122" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill={il.cyan} className="il-glow">MRI · T1</text>
      <path d="M130 284h76l10 26h-96Z" fill={toon.coat2} />
      <Anim kind="il-breathe" origin="357 372">
        <path d="M314 372c-4-70 2-132 36-160 36 8 54 62 50 160Z" fill={il.paper} stroke={il.line} />
        <path d="M336 214l16 40 16-42Z" fill={il.primary} />
        <path d="M344 262h20M344 280h20" stroke={il.line} strokeWidth="2" strokeLinecap="round" />
        <rect x="370" y="250" width="14" height="18" rx="3" fill={il.cyan} opacity="0.6" />
      </Anim>
      <Head x={352} y={160} glasses />
      <Anim kind="il-point" origin="334 238">
        <path d="M330 232c-16 6-30 12-46 12l-4 16c22 2 42-2 58-10Z" fill={il.paper} stroke={il.line} />
        <circle cx="280" cy="252" r="9" fill={toon.skin} />
        <path d="M272 248l-10-6" stroke={il.skin} strokeWidth="5" strokeLinecap="round" />
      </Anim>
      <Sparkle x={420} y={96} size={8} delay={0.4} />
    </Scene>
  );
}

export function NeuralScene() {
  const layers = [
    { x: 92, ys: [130, 190, 250] },
    { x: 172, ys: [100, 160, 220, 280] },
    { x: 252, ys: [130, 190, 250] },
  ];
  return (
    <Scene viewBox="0 0 480 400" label="A researcher pointing at a neural network drawn on a board.">
      {backdrop}
      {ground}
      <rect x="44" y="64" width="256" height="256" rx="10" fill={il.paper} stroke={il.line} />
      <rect x="44" y="320" width="256" height="10" rx="4" fill={il.wood} />
      <g stroke={il.line} strokeWidth="1.5">
        {layers[0]?.ys.flatMap((a) => layers[1]?.ys.map((b) => <line key={`a${a}${b}`} x1="92" y1={a} x2="172" y2={b} className="il-dash" />))}
        {layers[1]?.ys.flatMap((a) => layers[2]?.ys.map((b) => <line key={`b${a}${b}`} x1="172" y1={a} x2="252" y2={b} className="il-dash" />))}
      </g>
      {layers.map((layer, index) =>
        layer.ys.map((y, row) => (
          <circle key={`${layer.x}${y}`} cx={layer.x} cy={y} r="14" fill={[il.cyan, il.primary, il.amber][index]} className="il-pulse" style={{ animationDelay: `${index * 0.35 + row * 0.2}s` }} />
        )),
      )}
      <Anim kind="il-breathe" origin="380 372">
        <path d="M340 372c-4-70 4-128 36-154 34 8 50 62 46 154Z" fill={toon.coat} />
        <path d="M362 216l14 30 14-30Z" fill={toon.shirt} />
        <circle cx="376" cy="270" r="3" fill={il.paper} opacity="0.6" />
        <circle cx="376" cy="296" r="3" fill={il.paper} opacity="0.6" />
      </Anim>
      <Head x={376} y={166} skin={il.skinShade} long delay={1} />
      <Anim kind="il-point" origin="356 244">
        <path d="M358 240c-22-14-44-34-60-50l-12 10c16 22 38 42 62 56Z" fill={toon.coat2} />
        <circle cx="288" cy="194" r="9" fill={toon.skinShade} />
      </Anim>
      <Sparkle x={432} y={110} size={7} color={il.cyan} delay={0.8} />
    </Scene>
  );
}

export function PresentScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student presenting research results on a projected slide to an audience.">
      {backdrop}
      {ground}
      <rect x="150" y="70" width="280" height="176" rx="8" fill={il.paper} stroke={il.line} />
      <path d="M176 104h130" stroke={il.primary} strokeWidth="7" strokeLinecap="round" />
      <path d="M176 214V132M176 214h142" stroke={il.line} strokeWidth="2" />
      <path d="M180 202c30-50 60-58 132-62" fill="none" stroke={il.primary} strokeWidth="3.5" strokeLinecap="round" pathLength={1} className="il-draw" />
      <rect x="340" y="128" width="16" height="86" rx="3" fill={toon.lavender} className="il-grow" />
      <rect x="364" y="156" width="16" height="58" rx="3" fill={il.cyan} className="il-grow" style={{ animationDelay: "0.4s" }} />
      <rect x="388" y="178" width="16" height="36" rx="3" fill={il.amber} className="il-grow" style={{ animationDelay: "0.8s" }} />
      <Anim kind="il-breathe" origin="102 372">
        <path d="M64 372c-4-64 2-118 34-142 32 8 46 58 44 142Z" fill={toon.coat} />
        <path d="M86 228l12 28 14-28Z" fill={toon.shirt} />
      </Anim>
      <Head x={98} y={180} />
      <Anim kind="il-point" origin="118 252">
        <path d="M120 250c16-12 30-30 42-52l-12-8c-12 18-26 30-44 40Z" fill={toon.coat2} />
        <circle cx="158" cy="192" r="9" fill={toon.skin} />
        <path d="M162 186l22-22" stroke={il.amber} strokeWidth="3" strokeLinecap="round" />
      </Anim>
      {[230, 300, 370].map((x, index) => (
        <g key={x}>
          <path d={`M${x - 28} 372c0-30 12-48 28-48s28 18 28 48Z`} fill={[il.lavender, il.cyan, il.coat2][index]} />
          <Anim kind="il-nod" origin={`${x} 326`} delay={index * 0.9}>
            <circle cx={x} cy="306" r="19" fill={index === 1 ? il.skinShade : il.skin} />
            <path d={`M${x - 19} 304c0-14 10-22 20-20 10 0 18 8 18 20-12-8-26-8-38 0Z`} fill={il.hair} />
          </Anim>
        </g>
      ))}
    </Scene>
  );
}

export function CollaborationScene() {
  return (
    <Scene viewBox="0 0 480 400" label="Two students working together at a table with a laptop and notes.">
      {backdrop}
      {ground}
      <Anim kind="il-breathe" origin="108 306">
        <path d="M64 306c-2-60 8-104 42-122 34 10 50 54 46 122Z" fill={il.primary} />
      </Anim>
      <Head x={108} y={134} />
      <Anim kind="il-breathe" origin="372 306">
        <path d="M328 306c-4-68 12-108 46-122 34 18 44 62 42 122Z" fill={toon.lavender} />
      </Anim>
      <Head x={372} y={134} skin={il.skinShade} long delay={1} />
      <Anim kind="il-type" origin="142 228">
        <path d="M140 226c30 18 48 40 62 66l-16 12c-20-24-40-40-62-50Z" fill={toon.coat2} />
        <circle cx="196" cy="298" r="8" fill={toon.skin} />
      </Anim>
      <Anim kind="il-type-late" origin="338 228">
        <path d="M340 226c-30 18-48 40-62 66l16 12c20-24 40-40 62-50Z" fill={il.primary} opacity="0.8" />
        <circle cx="284" cy="298" r="8" fill={toon.skinShade} />
      </Anim>
      <rect x="44" y="302" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M84 316h14l-5 56h-6ZM382 316h14l-2 56h-6Z" fill={il.wood} opacity="0.75" />
      <path d="M196 226h88a8 8 0 0 1 8 8v60h-104v-60a8 8 0 0 1 8-8Z" fill={toon.coat} />
      <path d="M176 294h128l6 8H170Z" fill={il.line} />
      <path d="M212 276l18-20 16 12 22-26" fill="none" stroke={il.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="il-draw" />
      <Mug x={404} y={302} />
      <Sparkle x={170} y={74} size={8} delay={0.3} />
      <Sparkle x={320} y={60} size={6} color={il.cyan} delay={1.2} />
      <g className="il-float">
        <rect x="204" y="84" width="72" height="48" rx="12" fill={il.paper} stroke={il.line} />
        <path d="M222 132v14l14-14Z" fill={il.paper} stroke={il.line} />
        <path d="M218 102h44M218 114h28" stroke={il.primary} strokeWidth="4" strokeLinecap="round" />
      </g>
    </Scene>
  );
}

export function LibraryScene() {
  const shelf = (y: number, colors: string[]) =>
    colors.map((fill, index) => <rect key={`${y}-${index}`} x={70 + index * 24} y={y} width="19" height="58" rx="2" fill={fill} />);
  return (
    <Scene viewBox="0 0 480 400" label="A graduate student reading at a library desk in front of tall bookshelves.">
      {backdrop}
      {ground}
      <rect x="56" y="60" width="244" height="312" rx="6" fill={il.wood} />
      <rect x="64" y="68" width="228" height="296" fill={il.paper2} />
      {shelf(80, [il.primary, il.cyan, il.amber, il.coat2, il.lavender, il.primary, il.cyan, il.coat2, il.amber])}
      {shelf(150, [il.lavender, il.coat2, il.primary, il.amber, il.cyan, il.lavender, il.primary, il.amber, il.coat2])}
      {shelf(220, [il.cyan, il.amber, il.lavender, il.primary, il.coat2, il.cyan, il.amber, il.lavender, il.primary])}
      <path d="M64 142h228M64 212h228M64 282h228" stroke={il.wood} strokeWidth="6" />
      <Anim kind="il-breathe" origin="314 306">
        <path d="M270 306c-2-60 10-104 42-120 34 10 50 56 46 120Z" fill={toon.coat} />
        <path d="M296 186l16 28 16-28Z" fill={toon.shirt} />
      </Anim>
      <Head x={312} y={136} skin={il.skinShade} glasses />
      <rect x="190" y="302" width="256" height="14" rx="5" fill={il.wood} />
      <path d="M216 316h14l-5 56h-6ZM408 316h14l-2 56h-6Z" fill={il.wood} opacity="0.75" />
      <path d="M254 300c18-8 36-8 50 0 14-8 32-8 50 0v-34c-18-8-36-8-50 0-14-8-32-8-50 0Z" fill={il.paper} stroke={il.line} />
      <path d="M304 266c14-8 32-8 50 0v34c-18-8-36-8-50 0Z" fill={il.paper2} stroke={il.line} className="il-page" />
      <Anim kind="il-type" origin="300 250">
        <circle cx="262" cy="290" r="8" fill={toon.skinShade} />
      </Anim>
      <Sparkle x={420} y={120} size={7} delay={0.5} />
      <Sparkle x={86} y={44} size={6} color={il.cyan} delay={1.4} />
      <Books x={366} y={302} />
    </Scene>
  );
}

export function StudyScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student at a desk learning machine learning, with a loss curve and notes.">
      {backdrop}
      {ground}
      <rect x="44" y="296" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M84 310h14l-5 62h-6ZM382 310h14l-2 62h-6Z" fill={il.wood} opacity="0.75" />
      <Anim kind="il-breathe" origin="220 296">
        <path d="M176 296c-2-58 8-94 40-112 36 8 54 48 50 112Z" fill={il.cyan} />
      </Anim>
      <Head x={218} y={134} delay={1} />
      <Anim kind="il-write" origin="190 216">
        <path d="M186 214c-14 20-22 44-22 70l18 6c6-22 16-40 30-54Z" fill={il.cyan} />
        <circle cx="172" cy="286" r="8" fill={toon.skin} />
        <path d="M168 288l-10 12" stroke={il.primary} strokeWidth="3" strokeLinecap="round" />
      </Anim>
      <path d="M152 292c18-8 34-8 48 0 14-8 30-8 48 0v-16c-18-8-34-8-48 0-14-8-30-8-48 0Z" fill={il.paper} stroke={il.line} />
      <g className="il-float">
        <rect x="302" y="96" width="132" height="98" rx="10" fill={il.paper} stroke={il.line} />
        <path d="M320 112v64h100" fill="none" stroke={il.line} strokeWidth="2" />
        <path d="M324 120c10 40 30 48 92 50" fill="none" stroke={il.primary} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" />
      </g>
      <g fontFamily="var(--font-newsreader), serif" fontSize="26" fontStyle="italic">
        <text x="64" y="130" fill={il.primary} className="il-bob">∇L</text>
        <text x="92" y="210" fill={il.cyan} className="il-bob" style={{ animationDelay: "1.2s" }}>σ(x)</text>
      </g>
      <Plant x={392} y={268} scale={0.7} />
      <Mug x={330} y={296} />
    </Scene>
  );
}

export function DiagramScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student at a laptop working on an encrypted computation diagram of connected blocks and a lock.">
      {backdrop}
      {ground}
      <g fill={il.paper} stroke={il.line}>
        <rect x="60" y="74" width="96" height="46" rx="8" />
        <rect x="60" y="150" width="96" height="46" rx="8" />
        <rect x="324" y="74" width="96" height="46" rx="8" />
      </g>
      <CodeLines x={74} y={91} widths={[60, 40]} gap={12} />
      <CodeLines x={74} y={167} widths={[54, 36]} gap={12} />
      <CodeLines x={338} y={91} widths={[60, 44]} gap={12} />
      <path d="M156 97c40 0 40 30 84 30M156 173c40 0 40-46 84-46M324 97c-40 0-40 30-84 30" fill="none" stroke={il.primary} strokeWidth="2" className="il-dash" />
      <circle cx="240" cy="127" r="46" fill={il.primary} opacity="0.15" className="il-pulse" />
      <circle cx="240" cy="127" r="34" fill={il.primary} />
      <rect x="227" y="124" width="26" height="20" rx="4" fill={il.paper} />
      <path d="M232 124v-7a8 8 0 0 1 16 0v7" fill="none" stroke={il.paper} strokeWidth="3.5" />
      <Anim kind="il-breathe" origin="240 372">
        <path d="M188 372c-4-62 6-96 52-112 46 16 56 50 52 112Z" fill={toon.coat} />
      </Anim>
      <Head x={240} y={224} skin={il.skinShade} />
      <rect x="110" y="330" width="260" height="12" rx="5" fill={il.wood} />
      <Laptop x={240} y={330} width={112} />
      <Anim kind="il-type" origin="200 322">
        <ellipse cx="204" cy="326" rx="11" ry="6" fill={toon.skinShade} />
      </Anim>
      <Anim kind="il-type-late" origin="276 322">
        <ellipse cx="276" cy="326" rx="11" ry="6" fill={toon.skinShade} />
      </Anim>
      <Sparkle x={420} y={180} size={7} delay={0.7} />
    </Scene>
  );
}
