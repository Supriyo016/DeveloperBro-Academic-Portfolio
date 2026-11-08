import { Anim, Books, CodeLines, Head, il, Mug, Plant, Scene, Sparkle, toon } from "./base";
import { Arm, BookBack, BookGrip, LaptopBack, Legs, OfficeChair, SeatedLegs, SHOULDER_L, SHOULDER_R, Torso } from "./body";

const backdrop = <circle cx="240" cy="200" r="176" fill={il.soft} />;
const ground = <ellipse cx="240" cy="374" rx="190" ry="11" fill={il.ground} />;

/** A small padlock for the back of a laptop lid. */
const lockLogo = (
  <g>
    <rect x="-7" y="-3" width="14" height="11" rx="2.5" fill={il.primary} />
    <path d="M-4.5-3v-3.5a4.5 4.5 0 0 1 9 0V-3" fill="none" stroke={il.primary} strokeWidth="2.2" />
  </g>
);

export function MriScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A bearded researcher in a lab coat and glasses stands beside a lightbox and points at a highlighted region of a brain MRI scan.">
      {backdrop}
      {ground}
      <rect x="161" y="282" width="14" height="82" fill={toon.coat2} />
      <path d="M116 372c0-6 4-9 10-9h84c6 0 10 3 10 9Z" fill={toon.coat} />
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

      <g transform="translate(364 372) scale(0.82)">
        <Legs pants={toon.coat2} />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-aim" origin="-44 -166">
            <Arm shoulder={[-44, -166]} elbow={[-95.8, -161.5]} wrist={[-132.4, -195.6]} sleeve={toon.paper} pose="point" twist={4.75} />
          </Anim>
          <Torso outfit="labcoat" color={toon.coat2} accent={il.primary} />
          <Arm shoulder={SHOULDER_L} elbow={[50, -118]} wrist={[53, -72]} sleeve={toon.paper} pose="mitten" flip />
          <Head x={0} y={-230} glasses beard />
        </Anim>
      </g>
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
    <Scene viewBox="0 0 480 400" label="A researcher stands at a whiteboard on an easel and touches a node of the neural network drawn on it.">
      {backdrop}
      {ground}
      <path d="M72 326h11l-7 46h-9ZM261 326h11l5 46h-9Z" fill={il.wood} />
      <rect x="44" y="64" width="256" height="256" rx="10" fill={il.paper} stroke={il.line} />
      <rect x="44" y="318" width="256" height="10" rx="4" fill={il.wood} />
      <rect x="236" y="311" width="26" height="7" rx="3" fill={il.primary} />
      <g stroke={il.line} strokeWidth="1.5">
        {layers[0]?.ys.flatMap((a) => layers[1]?.ys.map((b) => <line key={`a${a}${b}`} x1="92" y1={a} x2="172" y2={b} className="il-dash" />))}
        {layers[1]?.ys.flatMap((a) => layers[2]?.ys.map((b) => <line key={`b${a}${b}`} x1="172" y1={a} x2="252" y2={b} className="il-dash" />))}
      </g>
      {layers.map((layer, index) =>
        layer.ys.map((y, row) => (
          <circle key={`${layer.x}${y}`} cx={layer.x} cy={y} r="14" fill={[il.cyan, il.primary, il.amber][index]} className="il-pulse" style={{ animationDelay: `${index * 0.35 + row * 0.2}s` }} />
        )),
      )}
      <g transform="translate(386 372) scale(0.82)">
        <Legs pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-aim" origin="-44 -166">
            <Arm shoulder={[-44, -166]} elbow={[-92.9, -148.2]} wrist={[-123.3, -180]} sleeve={toon.lavender} pose="point" twist={7.75} dark />
          </Anim>
          <Torso outfit="sweater" color={toon.lavender} />
          <Arm shoulder={SHOULDER_L} elbow={[50, -118]} wrist={[53, -72]} sleeve={toon.lavender} pose="mitten" flip dark />
          <Head x={0} y={-230} skin={il.skinShade} moustache delay={1} />
        </Anim>
      </g>
      <Sparkle x={436} y={110} size={7} color={il.cyan} delay={0.8} />
    </Scene>
  );
}

/** A listener in the audience, seen from behind: hair covers the head, ears and neck show. */
function Listener({ x, color, long = false, dark = false, delay }: { x: number; color: string; long?: boolean; dark?: boolean; delay: number }) {
  const skin = dark ? toon.skinShade : toon.skin;
  return (
    <g>
      <rect x={x - 8} y="316" width="16" height="16" fill={skin} />
      <path d={`M${x - 30} 372c0-28 10-44 30-44s30 16 30 44Z`} fill={color} />
      <Anim kind="il-nod" origin={`${x} 326`} delay={delay}>
        <ellipse cx={x - 18.5} cy="309" rx="4.2" ry="6" fill={skin} />
        <ellipse cx={x + 18.5} cy="309" rx="4.2" ry="6" fill={skin} />
        <circle cx={x} cy="305" r="19" fill={toon.hair} />
        {long && <path d={`M${x - 19} 305c-2 14 0 26 4 32h30c4-6 6-18 4-32Z`} fill={toon.hair} />}
        <path d={`M${x - 10} 292c5-4 14-4 19 0`} fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="2.5" strokeLinecap="round" />
      </Anim>
    </g>
  );
}

export function PresentScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student points at a chart on a projection screen with a pointer stick while an audience, seen from behind, listens.">
      {backdrop}
      {ground}
      <rect x="286" y="244" width="8" height="122" fill={il.line} />
      <path d="M262 372l28-10 28 10" fill="none" stroke={il.line} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="144" y="62" width="292" height="10" rx="5" fill={toon.coat2} />
      <rect x="150" y="70" width="280" height="176" rx="6" fill={il.paper} stroke={il.line} />
      <path d="M176 104h130" stroke={il.primary} strokeWidth="7" strokeLinecap="round" />
      <path d="M176 214V132M176 214h142" stroke={il.line} strokeWidth="2" />
      <path d="M180 202c30-50 60-58 132-62" fill="none" stroke={il.primary} strokeWidth="3.5" strokeLinecap="round" pathLength={1} className="il-draw" />
      <rect x="340" y="128" width="16" height="86" rx="3" fill={toon.lavender} className="il-grow" />
      <rect x="364" y="156" width="16" height="58" rx="3" fill={il.cyan} className="il-grow" style={{ animationDelay: "0.4s" }} />
      <rect x="388" y="178" width="16" height="36" rx="3" fill={il.amber} className="il-grow" style={{ animationDelay: "0.8s" }} />

      <g transform="translate(92 372) scale(0.78)">
        <Legs pants={toon.coat2} />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-aim" origin="44 -166">
            <path d="M78-199L214-279" stroke={il.amber} strokeWidth="4" strokeLinecap="round" />
            <circle cx="214" cy="-279" r="3.5" fill={il.primary} />
            <Arm shoulder={[44, -166]} elbow={[92, -152]} wrist={[105, -203]} pose="fist" twist={-45} />
          </Anim>
          <Torso outfit="jacket" />
          <Arm shoulder={SHOULDER_R} elbow={[-50, -118]} wrist={[-53, -72]} pose="mitten" />
          <Head x={0} y={-230} moustache />
        </Anim>
      </g>

      <Listener x={230} color={il.lavender} long delay={0} />
      <Listener x={300} color={il.cyan} dark delay={0.9} />
      <Listener x={370} color={il.coat2} delay={1.8} />
    </Scene>
  );
}

export function CollaborationScene() {
  return (
    <Scene viewBox="0 0 480 400" label="Two students at a table: one types on the laptop in front of him while the other explains an idea with an open hand.">
      {backdrop}
      {ground}
      <g transform="translate(130 357.6) scale(0.9)">
        <OfficeChair seat={-92} floor={16} color={il.coat2} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="sweater" color={il.primary} />
          <Arm shoulder={SHOULDER_R} elbow={[-66, -118]} wrist={[-32, -106]} sleeve={il.primary} pose="none" foreKind="il-type" />
          <Arm shoulder={SHOULDER_L} elbow={[66, -118]} wrist={[32, -106]} sleeve={il.primary} pose="none" foreKind="il-type-late" />
          <Head x={0} y={-230} moustache look="il-screen-look" />
        </Anim>
      </g>
      <g transform="translate(350 357.6) scale(0.9)">
        <OfficeChair seat={-92} floor={16} color={il.coat2} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat2} />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-point" origin="-44 -166">
            <Arm shoulder={[-44, -166]} elbow={[-72, -124]} wrist={[-86, -166]} sleeve={toon.lavender} cuff={null} pose="open" flip twist={-18} dark />
          </Anim>
          <Torso outfit="blouse" color={toon.lavender} />
          <Head x={0} y={-230} skin={il.skinShade} long delay={1} mouth="chatter" />
        </Anim>
      </g>
      <rect x="44" y="263" width="406" height="14" rx="5" fill={il.wood} />
      <path d="M70 277h14l-5 95h-6ZM410 277h14l-2 95h-6Z" fill={il.wood} opacity="0.75" />
      <LaptopBack x={130} y={263} width={86} logo={lockLogo} />
      <path d="M342 262l8-8h44l6 8Z" fill={il.paper} stroke={il.line} />
      <path d="M356 257h28M354 260h20" stroke={il.primary} strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      <Mug x={414} y={263} />
      <g transform="translate(350 357.6) scale(0.9)">
        <Arm shoulder={SHOULDER_L} elbow={[60, -120]} wrist={[36, -114]} sleeve={toon.lavender} cuff={null} pose="mitten" flip twist={4} dark />
      </g>
      <Sparkle x={170} y={74} size={8} delay={0.3} />
      <Sparkle x={330} y={56} size={6} color={il.cyan} delay={1.2} />
      <g className="il-float">
        <rect x="214" y="78" width="80" height="48" rx="12" fill={il.paper} stroke={il.line} />
        <path d="M276 126l12 14-2-14Z" fill={il.paper} stroke={il.line} strokeLinejoin="round" />
        <path d="M277 125h8" stroke={il.paper} strokeWidth="3" />
        <path d="M228 110l12-12 10 8 16-16" fill="none" stroke={il.cyan} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="il-draw" />
      </g>
    </Scene>
  );
}

export function LibraryScene() {
  const shelf = (y: number, colors: string[]) =>
    colors.map((fill, index) => <rect key={`${y}-${index}`} x={70 + index * 24} y={y} width="19" height="58" rx="2" fill={fill} />);
  return (
    <Scene viewBox="0 0 480 400" label="A bearded graduate student with glasses sits at a library desk in front of tall bookshelves, holding up an open book to read.">
      {backdrop}
      {ground}
      <rect x="56" y="60" width="244" height="312" rx="6" fill={il.wood} />
      <rect x="64" y="68" width="228" height="296" fill={il.paper2} />
      {shelf(80, [il.primary, il.cyan, il.amber, il.coat2, il.lavender, il.primary, il.cyan, il.coat2, il.amber])}
      {shelf(150, [il.lavender, il.coat2, il.primary, il.amber, il.cyan, il.lavender, il.primary, il.amber, il.coat2])}
      {shelf(220, [il.cyan, il.amber, il.lavender, il.primary, il.coat2, il.cyan, il.amber, il.lavender, il.primary])}
      <path d="M64 142h228M64 212h228M64 282h228" stroke={il.wood} strokeWidth="6" />
      <g transform="translate(334 357.6) scale(0.9)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat2} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="sweater" color={toon.coat} />
          <Head x={0} y={-230} glasses beard look="il-read-look" />
        </Anim>
      </g>
      <rect x="190" y="263" width="256" height="14" rx="5" fill={il.wood} />
      <path d="M212 277h14l-5 95h-6ZM412 277h14l-2 95h-6Z" fill={il.wood} opacity="0.75" />
      <g transform="translate(196 263) scale(0.6)">
        <Books x={0} y={0} />
      </g>
      <g transform="translate(334 357.6) scale(0.9)">
        <Anim kind="il-bob-soft" origin="0 -148">
          <Arm shoulder={SHOULDER_R} elbow={[-80, -120]} wrist={[-62, -142]} sleeve={toon.coat} pose="none" />
          <Arm shoulder={SHOULDER_L} elbow={[80, -120]} wrist={[62, -142]} sleeve={toon.coat} pose="none" />
          <g transform="translate(0 -148)">
            <BookBack color={il.cyan} flip />
            <BookGrip y={6} />
          </g>
        </Anim>
      </g>
      <Sparkle x={420} y={120} size={7} delay={0.5} />
      <Sparkle x={86} y={44} size={6} color={il.cyan} delay={1.4} />
    </Scene>
  );
}

export function StudyScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student at a desk writes notes in a notebook while learning machine learning, with a loss curve floating nearby.">
      {backdrop}
      {ground}
      <g transform="translate(220 357.6) scale(0.9)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="sweater" color={il.cyan} />
          <Head x={0} y={-230} delay={1} moustache look="il-write-look" />
        </Anim>
      </g>
      <rect x="44" y="251" width="392" height="13" rx="3" fill={il.wood} opacity="0.8" />
      <rect x="44" y="263" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M70 277h14l-5 95h-6ZM396 277h14l-2 95h-6Z" fill={il.wood} opacity="0.75" />
      <Plant x={402} y={243} scale={0.7} />
      <Mug x={334} y={263} />
      <g transform="translate(220 357.6) scale(0.9)">
        <path d="M-44-106L-36-116L8-117.5V-105.5Z" fill={il.paper} stroke={il.line} strokeLinejoin="round" />
        <path d="M8-105.5V-117.5L52-116L60-106Z" fill={il.paper} stroke={il.line} strokeLinejoin="round" />
        <path d="M-32-112.5h34M-35-109h37M14-112.5h36M14-109h28" stroke={il.paper2} strokeWidth="1.4" />
        <path d="M-6-110.6c3-2.4 5 1.6 8-0.4s5 1.6 8-0.4" fill="none" stroke={il.primary} strokeWidth="1.4" strokeLinecap="round" pathLength={1} className="il-draw" />
        <Arm shoulder={SHOULDER_R} elbow={[-80, -124]} wrist={[-46, -114]} sleeve={il.cyan} pose="mitten" twist={-6} />
        <Arm shoulder={SHOULDER_L} elbow={[88, -128]} wrist={[55, -143]} sleeve={il.cyan} pose="pen" twist={-53.5} foreKind="il-scribble" />
      </g>
      <g className="il-float">
        <rect x="302" y="86" width="132" height="98" rx="10" fill={il.paper} stroke={il.line} />
        <path d="M320 102v64h100" fill="none" stroke={il.line} strokeWidth="2" />
        <path d="M324 110c10 40 30 48 92 50" fill="none" stroke={il.primary} strokeWidth="3" strokeLinecap="round" pathLength={1} className="il-draw" />
      </g>
      <g fontFamily="var(--font-newsreader), serif" fontSize="26" fontStyle="italic">
        <text x="64" y="120" fill={il.primary} className="il-bob">∇L</text>
        <text x="82" y="200" fill={il.cyan} className="il-bob" style={{ animationDelay: "1.2s" }}>σ(x)</text>
      </g>
    </Scene>
  );
}

export function DiagramScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student types at a laptop on a desk, below a diagram of encrypted computation blocks joined to a lock.">
      {backdrop}
      {ground}
      <g fill={il.paper} stroke={il.line}>
        <rect x="60" y="50" width="96" height="46" rx="8" />
        <rect x="60" y="126" width="96" height="46" rx="8" />
        <rect x="324" y="50" width="96" height="46" rx="8" />
      </g>
      <CodeLines x={74} y={67} widths={[60, 40]} gap={12} />
      <CodeLines x={74} y={143} widths={[54, 36]} gap={12} />
      <CodeLines x={338} y={67} widths={[60, 44]} gap={12} />
      <path d="M156 73c40 0 40 30 84 30M156 149c40 0 40-46 84-46M324 73c-40 0-40 30-84 30" fill="none" stroke={il.primary} strokeWidth="2" className="il-dash" />
      <circle cx="240" cy="103" r="44" fill={il.primary} opacity="0.15" className="il-pulse" />
      <circle cx="240" cy="103" r="32" fill={il.primary} />
      <rect x="228" y="100" width="24" height="19" rx="4" fill={il.paper} />
      <path d="M233 100v-6a7 7 0 0 1 14 0v6" fill="none" stroke={il.paper} strokeWidth="3.5" />

      <g transform="translate(240 359) scale(0.8)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="jacket" color={toon.coat} tie={false} />
          <Arm shoulder={SHOULDER_R} elbow={[-66, -118]} wrist={[-32, -106]} pose="none" foreKind="il-type" />
          <Arm shoulder={SHOULDER_L} elbow={[66, -118]} wrist={[32, -106]} pose="none" foreKind="il-type-late" />
          <Head x={0} y={-230} skin={il.skinShade} moustache look="il-screen-look" />
        </Anim>
      </g>
      <rect x="110" y="275" width="260" height="12" rx="5" fill={il.wood} />
      <path d="M130 287h12l-4 85h-6ZM338 287h12l-2 85h-6Z" fill={il.wood} opacity="0.75" />
      <LaptopBack x={240} y={275} width={84} logo={lockLogo} />
      <Mug x={320} y={275} />
      <Sparkle x={420} y={180} size={7} delay={0.7} />
    </Scene>
  );
}

