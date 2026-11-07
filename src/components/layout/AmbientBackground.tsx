// A continuously moving page background: drifting light, a data network with flowing links,
// and mathematical symbols rising slowly. Pure CSS and SVG, decorative only, and off under reduced motion.

const blobs = [
  { top: "-12%", left: "-10%", color: "var(--lavender)", delay: "0s" },
  { top: "35%", left: "65%", color: "var(--accent-soft)", delay: "-9s" },
  { top: "70%", left: "-5%", color: "var(--primary-soft)", delay: "-17s" },
];

const orbs = [
  { left: "8%", size: 70, color: "var(--primary)", duration: 34, delay: 0, sway: "40px" },
  { left: "26%", size: 38, color: "var(--accent)", duration: 26, delay: -9, sway: "-30px" },
  { left: "48%", size: 90, color: "var(--pink)", duration: 40, delay: -20, sway: "50px" },
  { left: "70%", size: 46, color: "var(--series-5)", duration: 30, delay: -4, sway: "-40px" },
  { left: "88%", size: 60, color: "var(--accent)", duration: 36, delay: -15, sway: "30px" },
];

const comets = [
  { top: "12%", left: "92%", delay: "0s" },
  { top: "38%", left: "105%", delay: "-6s" },
  { top: "6%", left: "60%", delay: "-10s" },
];

const glyphs = ["Σ", "∇", "θ", "|ψ⟩", "λ", "∫", "π", "⊕", "σ", "∂", "α", "ℏ"];

const nodes = [
  [8, 18], [22, 42], [14, 72], [36, 12], [48, 58], [62, 28], [72, 76], [86, 44], [94, 14], [56, 92], [30, 88], [80, 92],
] as const;
const edges = [
  [0, 1], [1, 2], [1, 4], [0, 3], [3, 5], [4, 5], [4, 6], [5, 7], [7, 8], [6, 9], [2, 10], [6, 11], [7, 11], [4, 10],
] as const;

export function AmbientBackground() {
  return (
    <div className="ambient" aria-hidden="true">
      <span className="ambient-aurora" />
      <span className="ambient-grid" />
      {blobs.map((blob) => (
        <span key={blob.top} className="ambient-blob" style={{ top: blob.top, left: blob.left, animationDelay: blob.delay, ["--blob" as string]: blob.color }} />
      ))}
      <svg className="ambient-net" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={nodes[a][0]}
            y1={nodes[a][1]}
            x2={nodes[b][0]}
            y2={nodes[b][1]}
            stroke="var(--primary)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            className="il-dash"
            style={{ strokeDasharray: "0.8 1.2", animationDuration: `${3 + ((a + b) % 4)}s` }}
          />
        ))}
        {nodes.map(([x, y], index) => (
          <circle key={index} cx={x} cy={y} r="0.6" fill="var(--accent)" className="il-twinkle" style={{ animationDelay: `${index * 0.33}s`, animationDuration: "2.4s" }} />
        ))}
      </svg>
      {orbs.map((orb) => (
        <span
          key={orb.left}
          className="ambient-orb"
          style={{ left: orb.left, width: orb.size, height: orb.size, animationDuration: `${orb.duration}s`, animationDelay: `${orb.delay}s`, ["--orb" as string]: orb.color, ["--sway" as string]: orb.sway }}
        />
      ))}
      {comets.map((comet) => (
        <span key={comet.delay} className="ambient-comet" style={{ top: comet.top, left: comet.left, animationDelay: comet.delay }} />
      ))}
      {glyphs.map((glyph, index) => (
        <span
          key={glyph}
          className="ambient-glyph"
          style={{
            left: `${4 + ((index * 83) % 92)}%`,
            fontSize: `${1.2 + (index % 4) * 0.5}rem`,
            animationDuration: `${26 + (index % 5) * 6}s`,
            animationDelay: `${-index * 4.3}s`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}
