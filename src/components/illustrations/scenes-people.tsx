import { Anim, Books, Head, il, Plant, Scene, Sparkle, toon } from "./base";
import { Arm, BookBack, BookGrip, Legs, SeatedLegs, Shoes, SHOULDER_L, SHOULDER_R, Torso } from "./body";

export function ReadingScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A student sits on a stack of books holding up an open book to read, with mathematical symbols floating nearby.">
      <circle cx="240" cy="200" r="176" fill={il.soft} />
      <ellipse cx="240" cy="372" rx="170" ry="11" fill={il.ground} />
      <g fontFamily="var(--font-newsreader), serif" fontStyle="italic" fill={il.primary}>
        <text x="84" y="110" fontSize="44" className="il-float">Σ</text>
        <text x="376" y="96" fontSize="36" fill={il.cyan} className="il-bob">∇</text>
        <text x="392" y="208" fontSize="30" fill={il.amber} className="il-bob" style={{ animationDelay: "1s" }}>π</text>
        <text x="58" y="222" fontSize="30" fill={il.cyan} className="il-bob" style={{ animationDelay: "1.8s" }}>∫</text>
      </g>
      <rect x="150" y="334" width="190" height="38" rx="5" fill={il.primary} />
      <rect x="162" y="304" width="170" height="30" rx="5" fill={il.amber} />
      <rect x="146" y="278" width="184" height="26" rx="5" fill={il.cyan} />
      <path d="M160 290h20M296 318h22M168 352h18M306 352h20" stroke={il.paper} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <g transform="translate(244 354.8) scale(0.8)">
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="blouse" color={toon.lavender} />
          <Head x={0} y={-230} hair="long" delay={1} look="il-read-look" />
        </Anim>
        <SeatedLegs knee={-90} floor={21.5} pants={toon.coat2} />
        <Anim kind="il-bob-soft" origin="0 -150">
          <Arm shoulder={SHOULDER_R} elbow={[-74, -116]} wrist={[-62, -144]} sleeve={toon.lavender} cuff={null} pose="none" />
          <Arm shoulder={SHOULDER_L} elbow={[74, -116]} wrist={[62, -144]} sleeve={toon.lavender} cuff={null} pose="none" />
          <g transform="translate(0 -150)">
            <BookBack color={il.amber} flip />
            <BookGrip y={6} />
          </g>
        </Anim>
      </g>
      <Sparkle x={150} y={70} size={8} delay={0.5} />
    </Scene>
  );
}

/** A mortarboard and tassel, drawn in the head's frame so it nods with the head. */
function Mortarboard() {
  return (
    <g>
      <path d="M-29-24c0-10 13-16 29-16s29 6 29 16l-2 8c-8-4-17-6-27-6s-19 2-27 6Z" fill={toon.hair} />
      <path d="M0-58L52-42L0-26L-52-42Z" fill={toon.hair} />
      <path d="M-40-45L0-56" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" />
      <circle cx="0" cy="-42" r="3" fill={il.amber} />
      <path d="M0-42L40-37" stroke={il.amber} strokeWidth="2.2" />
      <Anim kind="il-sway" origin="40 -37">
        <path d="M40-37v26" stroke={il.amber} strokeWidth="2.2" />
        <path d="M37-14h6l2 10h-10Z" fill={il.amber} />
      </Anim>
    </g>
  );
}

export function GraduationScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A graduate in cap and gown raises a diploma scroll in front of a university building.">
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
      <Plant x={444} y={349} scale={0.9} />
      <g transform="translate(356 374) scale(0.82)">
        <path d="M-40-16h30v4h-30ZM10-16h30v4h-30Z" fill={toon.coat2} />
        <Shoes />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-cheer" origin="44 -166">
            <g transform="translate(100.1 -257) rotate(10.9)">
              <rect x="-35" y="-8" width="70" height="16" rx="8" fill={il.paper} stroke={il.line} />
              <ellipse cx="33" cy="0" rx="3.5" ry="8" fill={il.paper2} stroke={il.line} />
              <rect x="-24" y="-9" width="8" height="18" fill={il.amber} />
            </g>
            <Arm shoulder={[44, -166]} elbow={[88, -194]} wrist={[98, -246]} width={28} cuff={null} pose="fist" dark />
          </Anim>
          <Torso outfit="gown" color={toon.coat} accent={il.amber} />
          <Arm shoulder={SHOULDER_R} elbow={[-54, -118]} wrist={[-57, -72]} width={28} cuff={null} pose="mitten" dark />
          <Head x={0} y={-230} skin={il.skinShade} moustache>
            <Mortarboard />
          </Head>
        </Anim>
      </g>
      <Sparkle x={120} y={120} size={8} delay={0.3} />
      <Sparkle x={440} y={86} size={7} color={il.cyan} delay={1} />
    </Scene>
  );
}

export function LabScene() {
  return (
    <Scene viewBox="0 0 480 400" label="A bearded researcher with glasses, in a lab coat, stands at the end of a lab bench and points at a monitor showing a learning curve, beside a flask and a Bloch sphere.">
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
      <g transform="translate(286 240)">
        <circle r="42" fill="none" stroke={il.primary} strokeWidth="2.5" />
        <ellipse rx="42" ry="14" fill="none" stroke={il.primary} strokeWidth="1.5" />
        <Anim kind="il-clock" origin="0 0">
          <path d="M0 0L24-30" stroke={il.amber} strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="-30" r="5" fill={il.amber} />
        </Anim>
        <path d="M0-42V42" stroke={il.line} strokeWidth="1.5" />
        <rect x="-16" y="42" width="32" height="8" rx="3" fill={toon.coat2} />
      </g>
      <g transform="translate(36 212)">
        <path d="M14 0h16v26l18 42a7 7 0 0 1-6 10H2a7 7 0 0 1-6-10l18-42Z" fill={il.paper} stroke={il.line} />
        <path d="M3 56h38l5 12a4 4 0 0 1-4 6H2a4 4 0 0 1-4-6Z" fill={il.cyan} />
        {[14, 26, 20].map((cx, index) => (
          <Anim key={index} kind="il-steam" delay={index * 0.9}>
            <circle cx={cx} cy={52 - index * 4} r="3" fill={il.cyan} />
          </Anim>
        ))}
      </g>
      <g transform="translate(414 372) scale(0.78)">
        <Legs />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-aim" origin="-44 -166">
            <Arm shoulder={[-44, -166]} elbow={[-93, -156]} wrist={[-118, -201]} sleeve={toon.paper} pose="point" />
          </Anim>
          <Torso outfit="labcoat" color={toon.coat2} accent={il.amber} />
          <Arm shoulder={SHOULDER_L} elbow={[50, -118]} wrist={[53, -72]} sleeve={toon.paper} pose="mitten" flip />
          <Head x={0} y={-230} glasses beard />
        </Anim>
      </g>
      <Sparkle x={250} y={96} size={8} color={il.cyan} delay={0.6} />
    </Scene>
  );
}

export function LostScene() {
  return (
    <Scene viewBox="0 0 480 360" label="A person holds a magnifying glass over a node that has come loose from a network.">
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
      <circle cx="382" cy="124" r="13" fill={il.amber} />
      <g transform="translate(300 336) scale(0.78)">
        <Legs pants={toon.coat} />
        <Anim kind="il-breathe" origin="0 -96">
          <Anim kind="il-aim" origin="44 -166">
            <path d="M46.4-235.9L82.3-257.7" stroke={toon.coat} strokeWidth="9" strokeLinecap="round" />
            <circle cx="105.4" cy="-271.7" r="26" fill={il.paper} fillOpacity="0.25" stroke={il.primary} strokeWidth="7" />
            <path d="M92-284c6-6 16-7 24-2" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <Arm shoulder={[44, -166]} elbow={[89.6, -188]} wrist={[62.5, -232.5]} sleeve={toon.coat2} pose="fist" dark />
          </Anim>
          <Torso outfit="sweater" color={toon.coat2} />
          <Arm shoulder={SHOULDER_R} elbow={[-50, -118]} wrist={[-53, -72]} sleeve={toon.coat2} pose="mitten" dark />
          <Head x={0} y={-230} skin={il.skinShade} hair="curly" moustache delay={1} look="il-peer-look" />
        </Anim>
      </g>
      <Sparkle x={426} y={76} size={7} delay={0.4} />
      <Books x={60} y={336} />
    </Scene>
  );
}
