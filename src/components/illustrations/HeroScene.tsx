import { Anim, Books, il, Mug, Plant, Scene, Sparkle } from "./base";

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
      label="A researcher at a laptop. Four hospital clients with different class mixes exchange model updates with a central aggregator."
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

      <path d="M268 484h44l-4 74h-34ZM328 484h44l-6 74h-34Z" fill={il.coat2} />
      <path d="M262 566c0-8 8-10 18-10h28v10ZM332 566v-10h28c10 0 18 2 18 10Z" fill={il.hair} />

      <Anim kind="il-breathe" origin="320 470">
        <path d="M212 470c6-62 34-92 74-100h68c40 8 68 38 74 100Z" fill={il.coat} />
        <path d="M296 370l24 62 24-62-24 12Z" fill={il.shirt} />
        <path d="M313 380h14l-3 12 6 40-10 12-10-12 6-40Z" fill={il.primary} />
        <path d="M296 370l-14 22 26 42 12-2ZM344 370l14 22-26 42-12-2Z" fill={il.coat2} />
        <path d="M302 330h36v44c-10 12-26 12-36 0Z" fill={il.skinShade} />
        <Anim kind="il-nod" origin="320 344">
        <ellipse cx="277" cy="288" rx="8" ry="13" fill={il.skinShade} />
        <ellipse cx="363" cy="288" rx="8" ry="13" fill={il.skinShade} />
        <path d="M278 268c0-30 18-46 42-46s42 16 42 46v26c0 34-22 56-42 56s-42-22-42-56Z" fill={il.skin} />
        <path d="M278 292c4 8 8 12 16 14 6-6 46-6 52 0 8-2 12-6 16-14v12c0 30-20 50-42 50s-42-20-42-50Z" fill={il.hair} />
        <path d="M308 318h24c-2 8-22 8-24 0Z" fill={il.skin} />
        <path d="M274 276c-8-34 8-66 46-68 22-8 48 8 50 34 2 14-2 26-6 34-2-14-8-24-16-30-20 6-46 6-60 2-8 8-12 18-14 28Z" fill={il.hair} />
        <Anim kind="il-blink" origin="320 280">
          <ellipse cx="303" cy="280" rx="3.4" ry="4" fill={il.hair} />
          <ellipse cx="337" cy="280" rx="3.4" ry="4" fill={il.hair} />
          <circle cx="304.4" cy="278.4" r="1.1" fill={il.paper} />
          <circle cx="338.4" cy="278.4" r="1.1" fill={il.paper} />
        </Anim>
        <path d="M295 268c5-3 12-3 16 0M329 268c4-3 11-3 16 0" fill="none" stroke={il.hair} strokeWidth="3" strokeLinecap="round" />
        <path d="M320 284v14" stroke={il.skinShade} strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="292" cy="300" r="6" fill={il.amber} opacity="0.16" />
        <circle cx="348" cy="300" r="6" fill={il.amber} opacity="0.16" />
        </Anim>
      </Anim>

      <rect x="124" y="470" width="392" height="14" rx="5" fill={il.wood} />
      <path d="M152 484h16l-8 82h-8ZM472 484h16l0 82h-8Z" fill={il.wood} opacity="0.75" />

      <g>
        <path d="M250 382a8 8 0 0 1 8-8h124a8 8 0 0 1 8 8v82H250Z" fill={il.paper2} />
        <path d="M232 464h176l6 6H226Z" fill={il.line} />
        <g transform="translate(320 420)">
          <g className="il-spin">
          <circle r="5" fill={il.primary} />
          {[0, 72, 144, 216, 288].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <line y1="-5" y2="-19" stroke={il.primary} strokeWidth="1.5" />
              <circle cy="-20" r="3" fill={il.cyan} />
            </g>
          ))}
          </g>
        </g>
        <Anim kind="il-type" origin="286 466">
          <path d="M266 470c4-10 14-14 26-12l6 10c-10 4-22 6-32 2Z" fill={il.skin} />
          <path d="M276 462l4 6M284 460l3 7M292 460l2 7" stroke={il.skinShade} strokeWidth="1.5" strokeLinecap="round" />
        </Anim>
        <Anim kind="il-type-late" origin="354 466">
          <path d="M374 470c-4-10-14-14-26-12l-6 10c10 4 22 6 32 2Z" fill={il.skin} />
          <path d="M364 462l-4 6M356 460l-3 7M348 460l-2 7" stroke={il.skinShade} strokeWidth="1.5" strokeLinecap="round" />
        </Anim>
      </g>

      <Books x={140} y={470} />
      <Mug x={446} y={470} />
      <Sparkle x={86} y={92} size={9} delay={0.2} />
      <Sparkle x={572} y={330} size={7} color={il.cyan} delay={1.1} />
      <Sparkle x={604} y={106} size={6} color={il.primary} delay={0.6} />
      <Plant x={80} y={538} scale={0.95} />
    </Scene>
  );
}
