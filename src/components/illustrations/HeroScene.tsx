import { Anim, Books, Head, il, Mug, Plant, Scene, Sparkle } from "./base";
import { Arm, LaptopBack, OfficeChair, SeatedLegs, SHOULDER_L, SHOULDER_R, Torso } from "./body";

const server = { x: 320, y: 96 };

const clients = [
  { id: "c1", x: 92, y: 196, mix: [0.34, 0.22, 0.42, 0.02] },
  { id: "c2", x: 178, y: 62, mix: [0.05, 0.14, 0.62, 0.19] },
  { id: "c3", x: 462, y: 62, mix: [0.03, 0.57, 0.04, 0.36] },
  { id: "c4", x: 548, y: 196, mix: [0.64, 0.24, 0.04, 0.08] },
];

const colors = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

function ClientCard({ x, y, mix }: { x: number; y: number; mix: number[] }) {
  const offsets = mix.map((_, index) => mix.slice(0, index).reduce((sum, share) => sum + share * 60, 0));
  return (
    <g transform={`translate(${x - 40} ${y - 30})`}>
      <rect width="80" height="60" rx="10" fill={il.paper} stroke={il.line} />
      <path d="M12 12h8M16 8v8" stroke={il.cyan} strokeWidth="3" strokeLinecap="round" />
      <rect x="28" y="9" width="40" height="3" rx="1.5" fill={il.paper2} />
      <rect x="28" y="16" width="26" height="3" rx="1.5" fill={il.paper2} />
      <g transform="translate(10 30)">
        {mix.map((share, index) => (
          <rect key={colors[index]} x={offsets[index]} width={Math.max(share * 60 - 1, 1)} height="18" rx="2" fill={colors[index]} />
        ))}
      </g>
    </g>
  );
}

const linkPath = (x: number, y: number) => {
  const midX = (x + server.x) / 2;
  return `M${x} ${y} Q${midX} ${Math.min(y, server.y) - 18} ${server.x} ${server.y}`;
};

export function HeroScene() {
  const laptopPath = `M320 372 C320 300 ${server.x} 200 ${server.x} ${server.y}`;

  return (
    <Scene
      viewBox="0 0 640 590"
      label="A bearded researcher with glasses typing at a laptop on his desk. Four hospital clients with different class mixes exchange model updates with a central aggregator."
    >
      <circle cx="320" cy="310" r="262" fill={il.soft} />
      <ellipse cx="320" cy="566" rx="240" ry="14" fill={il.ground} />

      {clients.map((client) => (
        <path key={client.id} d={linkPath(client.x, client.y)} fill="none" stroke={il.line} strokeWidth="1.5" className="il-dash" />
      ))}

      {clients.map((client, index) => (
        <circle
          key={`p-${client.id}`}
          r="5"
          fill={il.primary}
          className="il-packet"
          style={{ offsetPath: `path("${linkPath(client.x, client.y)}")`, animationDelay: `${index * 1.3}s` }}
        />
      ))}
      <circle r="5" fill={il.cyan} className="il-packet" style={{ offsetPath: `path("${laptopPath}")`, animationDelay: "0.7s" }} />

      {clients.map((client) => (
        <ClientCard key={`card-${client.id}`} x={client.x} y={client.y} mix={client.mix} />
      ))}

      <g transform={`translate(${server.x} ${server.y})`}>
        <circle r="46" fill={il.primary} opacity="0.14" className="il-pulse" />
        <circle r="58" fill="none" stroke={il.primary} strokeWidth="1.5" strokeDasharray="4 10" opacity="0.5" className="il-spin" />
        <circle r="31" fill={il.primary} />
        <rect x="-11" y="-3" width="22" height="16" rx="3" fill={il.paper} />
        <path d="M-7-3v-5a7 7 0 0 1 14 0v5" fill="none" stroke={il.paper} strokeWidth="3" />
        <circle cy="5" r="2.4" fill={il.primary} />
      </g>

      <g className="il-float" style={{ animationDuration: "5s" }}>
        <rect x="438" y="288" width="172" height="52" rx="10" fill={il.paper} stroke={il.line} />
        <text x="524" y="321" textAnchor="middle" fontFamily="var(--font-newsreader), serif" fontStyle="italic" fontSize="21" fill={il.onPaper}>
          θ = Σ (nₖ / n) θₖ
        </text>
      </g>

      {/* The researcher sits behind his desk, typing. The laptop faces him, so we see the back of its lid. */}
      <g transform="translate(320 546) scale(1.25)">
        <OfficeChair seat={-92} floor={16} />
        <SeatedLegs knee={-84} floor={16} />
        <Anim kind="il-breathe" origin="0 -96">
          <Torso outfit="jacket" />
          <Arm shoulder={SHOULDER_R} elbow={[-66, -118]} wrist={[-34, -105]} pose="none" foreKind="il-type" />
          <Arm shoulder={SHOULDER_L} elbow={[66, -118]} wrist={[34, -105]} pose="none" foreKind="il-type-late" />
          <Head x={0} y={-230} beard glasses />
        </Anim>
      </g>

      <rect x="124" y="415" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M152 429h16l-6 137h-6ZM472 429h16l-2 137h-8Z" fill={il.wood} opacity="0.75" />

      <LaptopBack
        x={320}
        y={415}
        width={124}
        logo={
          <g className="il-spin">
            <circle r="5" fill={il.primary} />
            {[0, 72, 144, 216, 288].map((angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line y1="-5" y2="-17" stroke={il.primary} strokeWidth="1.5" />
                <circle cy="-18" r="3" fill={il.cyan} />
              </g>
            ))}
          </g>
        }
      />

      <Books x={150} y={415} />
      <Mug x={448} y={415} />
      <Sparkle x={86} y={92} size={9} delay={0.2} />
      <Sparkle x={572} y={330} size={7} color={il.cyan} delay={1.1} />
      <Sparkle x={604} y={106} size={6} color={il.primary} delay={0.6} />
      <Plant x={80} y={538} scale={0.95} />
    </Scene>
  );
}
