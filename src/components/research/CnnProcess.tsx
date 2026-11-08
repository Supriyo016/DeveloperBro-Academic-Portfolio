import Image from "next/image";
import { mriSamples } from "@/content/data/alzheimers-figures";

// The Custom CNN's forward pass, stage by stage, as responsive cards, then a close-up of one block and a
// diagram of how the classifier's nodes connect. Shapes and sizes follow `CustomAlzheimerNet` in the thesis notebook.

const BLOCKS = [
  { n: 1, cin: 3, cout: 32, groups: 8, size: 64, color: "var(--series-1)", sees: "edges and outlines" },
  { n: 2, cin: 32, cout: 64, groups: 16, size: 32, color: "var(--series-3)", sees: "simple textures" },
  { n: 3, cin: 64, cout: 128, groups: 32, size: 16, color: "var(--series-4)", sees: "shapes such as the ventricles" },
  { n: 4, cin: 128, cout: 256, groups: 32, size: 8, color: "var(--series-2)", sees: "larger tissue patterns" },
] as const;

const CLASSES = ["Mild", "Moderate", "Non-demented", "Very mild"];
const CLASS_COLORS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

/** A stack of feature maps: more sheets for more channels, smaller sheets for smaller maps. */
function MapStack({ size, channels, color, label }: { size: number; channels: number; color: string; label: string }) {
  const sheets = Math.min(2 + Math.round(Math.log2(channels) - 1), 8);
  const side = 22 + Math.log2(size) * 9;
  return (
    <svg viewBox="0 0 120 110" className="h-24 w-full" role="img" aria-label={label}>
      {Array.from({ length: sheets }, (_, index) => {
        const offset = index * 6;
        return <rect key={index} x={18 + offset} y={88 - side - offset * 0.6} width={side} height={side} rx="3" fill={color} opacity={0.35 + (index / sheets) * 0.65} stroke="var(--surface)" />;
      })}
      <rect x={18 + (sheets - 1) * 6} y={88 - side - (sheets - 1) * 3.6} width={side} height={side} rx="3" fill="none" stroke="var(--ink)" strokeOpacity="0.25" />
    </svg>
  );
}

function Arrow() {
  return (
    <span className="cnn-arrow" aria-hidden>
      <svg viewBox="0 0 24 24" className="size-5">
        <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Stage({ step, title, shape, children, chips, color }: { step: number; title: string; shape: string; children: React.ReactNode; chips: string[]; color: string }) {
  return (
    <li className="cnn-stage relative flex flex-col rounded-2xl border border-line bg-surface p-3" style={{ ["--stage" as string]: color }}>
      <div className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold text-[#161b33]" style={{ background: color }}>{step}</span>
        <p className="text-sm leading-tight font-semibold">{title}</p>
      </div>
      <div className="mt-2 flex-1">{children}</div>
      <ul className="mt-2 flex flex-wrap gap-1">
        {chips.map((chip) => (
          <li key={chip} className="rounded-full bg-surface-2 px-2 py-0.5 text-[0.7rem] text-ink-2">{chip}</li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-[0.72rem] text-muted">{shape}</p>
      <Arrow />
    </li>
  );
}

/** Close-up of one block: a 3×3 kernel sliding over the input, group normalisation, GELU and 2×2 max pooling. */
function BlockCloseUp() {
  const grid = (x: number, y: number, n: number, cell: number, color: string) =>
    Array.from({ length: n * n }, (_, index) => (
      <rect key={index} x={x + (index % n) * cell} y={y + Math.floor(index / n) * cell} width={cell - 1.5} height={cell - 1.5} rx="1.5" fill={color} opacity={0.25 + ((index * 37) % 10) / 16} />
    ));
  const pool = [
    [3, 8, 1, 4],
    [5, 2, 7, 6],
    [9, 1, 2, 3],
    [4, 6, 8, 5],
  ];
  return (
    <figure className="mt-6 rounded-2xl border border-line bg-surface-2/60 p-3 sm:p-4">
      <figcaption className="text-sm font-semibold">Inside one block, step by step</figcaption>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-surface p-3">
          <svg viewBox="0 0 200 120" className="h-auto w-full" role="img" aria-label="A three by three kernel slides across the input; each position gives one output value">
            {grid(8, 10, 8, 12, "var(--series-1)")}
            <rect x="8" y="10" width="36" height="36" rx="3" fill="none" stroke="var(--accent)" strokeWidth="2.5" className="cnn-kernel" />
            {grid(132, 22, 6, 11, "var(--series-1)")}
            <rect x="132" y="22" width="10" height="10" rx="2" fill="var(--accent)" className="cnn-kernel-out" />
            <path d="M104 52h20" stroke="var(--ink-2)" strokeWidth="2" markerEnd="url(#cnn-head)" />
            <defs>
              <marker id="cnn-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0L10 5L0 10Z" fill="var(--ink-2)" />
              </marker>
            </defs>
            <text x="100" y="114" textAnchor="middle" fontSize="10" fill="var(--ink-2)">3 × 3 kernel, stride 1, padding 1</text>
          </svg>
          <p className="mt-1 text-xs text-ink-2"><span className="font-medium text-ink">Conv2d.</span> Each filter multiplies a 3 × 3 patch by its weights and adds them up. Padding keeps the height and width.</p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <svg viewBox="0 0 200 120" className="h-auto w-full" role="img" aria-label="Channels are split into groups and each group is normalised on its own">
            {Array.from({ length: 16 }, (_, index) => (
              <rect key={index} x={10 + index * 11.5} y={20 + ((index * 13) % 5) * 6} width="9" height={50 - ((index * 13) % 5) * 6} rx="2" fill={["var(--series-1)", "var(--series-3)", "var(--series-4)", "var(--series-2)"][Math.floor(index / 4)]} className="cnn-norm" style={{ animationDelay: `${Math.floor(index / 4) * 0.4}s` }} />
            ))}
            {[0, 1, 2, 3].map((group) => (
              <text key={group} x={10 + group * 46 + 20} y="88" textAnchor="middle" fontSize="10" fill="var(--ink-2)">group {group + 1}</text>
            ))}
            <text x="100" y="114" textAnchor="middle" fontSize="10" fill="var(--ink-2)">same statistics for any batch size</text>
          </svg>
          <p className="mt-1 text-xs text-ink-2"><span className="font-medium text-ink">GroupNorm.</span> Channels are normalised in groups, inside each image, so skewed client batches do not shift the statistics.</p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <svg viewBox="0 0 200 120" className="h-auto w-full" role="img" aria-label="The GELU curve: negative inputs are damped smoothly, positive inputs pass through">
            <path d="M20 90H180M100 105V12" stroke="var(--line-strong)" strokeWidth="1.5" />
            <path d="M20 90C60 90 80 94 92 92S110 76 180 18" fill="none" stroke="var(--series-4)" strokeWidth="3" strokeLinecap="round" />
            <circle r="5" fill="var(--accent)" className="il-packet" style={{ offsetPath: 'path("M20 90C60 90 80 94 92 92S110 76 180 18")', animationDuration: "3s" }} />
            <text x="100" y="116" textAnchor="middle" fontSize="10" fill="var(--ink-2)">GELU(x) = x · Φ(x)</text>
          </svg>
          <p className="mt-1 text-xs text-ink-2"><span className="font-medium text-ink">GELU.</span> A smooth activation: strong positive responses pass, weak and negative ones are damped.</p>
        </div>
        <div className="rounded-xl bg-surface p-3">
          <svg viewBox="0 0 200 120" className="h-auto w-full" role="img" aria-label="Two by two max pooling keeps the largest value of each window, halving height and width">
            {pool.flatMap((row, r) =>
              row.map((value, c) => {
                const winner = value === Math.max(...pool.slice(r - (r % 2), r - (r % 2) + 2).flatMap((line) => line.slice(c - (c % 2), c - (c % 2) + 2)));
                return (
                  <g key={`${r}-${c}`}>
                    <rect x={14 + c * 22} y={14 + r * 22} width="20" height="20" rx="3" fill={winner ? "var(--series-2)" : "var(--surface-2)"} stroke="var(--line-strong)" />
                    <text x={24 + c * 22} y={28 + r * 22} textAnchor="middle" fontSize="11" fill="var(--ink)">{value}</text>
                  </g>
                );
              }),
            )}
            <path d="M114 58h18" stroke="var(--ink-2)" strokeWidth="2" markerEnd="url(#cnn-head)" />
            {[
              [8, 7],
              [9, 8],
            ].flatMap((row, r) =>
              row.map((value, c) => (
                <g key={`p${r}${c}`}>
                  <rect x={140 + c * 24} y={36 + r * 24} width="22" height="22" rx="3" fill="var(--series-2)" />
                  <text x={151 + c * 24} y={51 + r * 24} textAnchor="middle" fontSize="11" fill="#161b33">{value}</text>
                </g>
              )),
            )}
            <text x="100" y="114" textAnchor="middle" fontSize="10" fill="var(--ink-2)">illustrative values</text>
          </svg>
          <p className="mt-1 text-xs text-ink-2"><span className="font-medium text-ink">MaxPool 2 × 2.</span> Keeps the strongest value in each window, so the map shrinks by half each block.</p>
        </div>
      </div>
    </figure>
  );
}

/** The classifier as a network: sampled nodes of each layer, every node connected to every node of the next. */
function ClassifierNetwork() {
  const W = 760;
  const H = 330;
  const layers = [
    { x: 110, count: 8, label: "512 features", sub: "after global average pooling", color: "var(--series-6)" },
    { x: 320, count: 10, label: "1,944 hidden units", sub: "Linear 512 → 1944, GELU", color: "var(--series-5)", dropped: [2, 7] },
    { x: 520, count: 4, label: "4 logits", sub: "Linear 1944 → 4", color: "var(--series-7)" },
  ];
  const nodeY = (count: number, index: number) => 46 + ((H - 110) / (count - 1)) * index;
  const edges: { d: string; key: string; live: boolean }[] = [];
  layers.slice(0, -1).forEach((layer, layerIndex) => {
    const next = layers[layerIndex + 1];
    if (!next) return;
    for (let a = 0; a < layer.count; a += 1)
      for (let b = 0; b < next.count; b += 1)
        edges.push({ key: `${layerIndex}-${a}-${b}`, d: `M${layer.x} ${nodeY(layer.count, a)}L${next.x} ${nodeY(next.count, b)}`, live: !next.dropped?.includes(b) && !layer.dropped?.includes(a) });
  });
  const pulses = edges.filter((edge, index) => edge.live && index % 9 === 0).slice(0, 14);
  return (
    <figure className="mt-6 overflow-hidden rounded-2xl border border-line bg-surface">
      <figcaption className="border-b border-line p-3 text-sm">
        <span className="font-semibold">How the classifier&apos;s nodes connect.</span> <span className="text-ink-2">Each layer is fully connected: every node feeds every node of the next layer. Only a sample of the 512 and 1,944 nodes is drawn. Crossed-out units are switched off by Dropout 0.4, during training only.</span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Fully connected network: 512 pooled features connect to 1,944 hidden units, which connect to 4 class outputs. Crossed-out hidden units show dropout during training.">
        {edges.map((edge) => (
          <path key={edge.key} d={edge.d} stroke={edge.live ? "var(--primary)" : "var(--line-strong)"} strokeOpacity={edge.live ? 0.18 : 0.35} strokeWidth="1" strokeDasharray={edge.live ? undefined : "3 4"} />
        ))}
        {pulses.map((edge, index) => (
          <circle key={edge.key} r="3.5" fill="var(--accent)" className="il-packet" style={{ offsetPath: `path("${edge.d}")`, animationDelay: `${index * 0.35}s`, animationDuration: "2.6s" }} />
        ))}
        {layers.map((layer) => (
          <g key={layer.label}>
            {Array.from({ length: layer.count }, (_, index) => {
              const y = nodeY(layer.count, index);
              const dropped = layer.dropped?.includes(index);
              return (
                <g key={index}>
                  <circle cx={layer.x} cy={y} r="11" fill={dropped ? "var(--surface-2)" : layer.color} stroke="var(--surface)" strokeWidth="2" className={dropped ? undefined : "cnn-node"} style={{ animationDelay: `${index * 0.12}s` }} />
                  {dropped && <path d={`M${layer.x - 6} ${y - 6}l12 12M${layer.x + 6} ${y - 6}l-12 12`} stroke="var(--muted)" strokeWidth="2" />}
                </g>
              );
            })}
            {layer.count > 4 && <text x={layer.x} y={nodeY(layer.count, layer.count - 1) + 30} textAnchor="middle" fontSize="16" fill="var(--muted)">⋮</text>}
            <text x={layer.x} y={18} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">{layer.label}</text>
            <text x={layer.x} y={H - 16} textAnchor="middle" fontSize="11" fill="var(--ink-2)">{layer.sub}</text>
          </g>
        ))}
        {CLASSES.map((name, index) => {
          const y = nodeY(4, index);
          return (
            <g key={name}>
              <path d={`M534 ${y}H600`} stroke={CLASS_COLORS[index]} strokeWidth="2" />
              <rect x="604" y={y - 12} width="142" height="24" rx="12" fill={`color-mix(in srgb, ${CLASS_COLORS[index]} 22%, var(--surface))`} stroke={CLASS_COLORS[index]} />
              <text x="675" y={y + 4} textAnchor="middle" fontSize="12" fill="var(--ink)">{name}</text>
            </g>
          );
        })}
        <text x="675" y={18} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">Softmax → class</text>
        <text x="675" y={H - 16} textAnchor="middle" fontSize="11" fill="var(--ink-2)">highest probability wins</text>
      </svg>
    </figure>
  );
}

export function CnnProcess() {
  const sample = mriSamples.MildDemented?.[0];
  return (
    <div>
      <ol className="cnn-flow grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Stage step={1} title="Input MRI slice" shape="3 × 64 × 64" chips={["Resize 64 × 64", "RGB", "ImageNet mean and std"]} color="var(--series-5)">
          <div className="flex items-center gap-2">
            {sample && <Image src={sample.src} alt="" width={sample.width} height={sample.height} className="size-20 rounded-lg bg-black object-cover" sizes="80px" />}
            <svg viewBox="0 0 70 80" className="h-20 w-16" aria-hidden>
              {["#e5484d", "#30a46c", "#3e63dd"].map((color, index) => (
                <rect key={color} x={6 + index * 9} y={6 + index * 9} width="44" height="44" rx="4" fill={color} opacity="0.75" stroke="var(--surface)" />
              ))}
            </svg>
          </div>
          <p className="mt-1 text-xs text-ink-2">One slice becomes three 64 × 64 channels.</p>
        </Stage>
        {BLOCKS.map((block) => (
          <Stage
            key={block.n}
            step={block.n + 1}
            title={`Block ${block.n}: ${block.cin} → ${block.cout} channels`}
            shape={`${block.cout} × ${block.size} × ${block.size} → ${block.cout} × ${block.size / 2} × ${block.size / 2}`}
            chips={["Conv 3 × 3", `GroupNorm ${block.groups}`, "GELU", "MaxPool 2 × 2"]}
            color={block.color}
          >
            <MapStack size={block.size / 2} channels={block.cout} color={block.color} label={`${block.cout} feature maps of ${block.size / 2} by ${block.size / 2}`} />
            <p className="text-xs text-ink-2">Learns {block.sees}.</p>
          </Stage>
        ))}
        <Stage step={6} title="Block 5 and global pooling" shape="512 × 4 × 4 → 512" chips={["Conv 3 × 3", "GroupNorm 32", "GELU", "Average pool", "Flatten"]} color="var(--series-6)">
          <svg viewBox="0 0 120 110" className="h-24 w-full" role="img" aria-label="512 maps of 4 by 4 are averaged into a vector of 512 numbers">
            {Array.from({ length: 5 }, (_, index) => (
              <rect key={index} x={10 + index * 5} y={30 - index * 3} width="30" height="30" rx="3" fill="var(--series-6)" opacity={0.4 + index * 0.12} stroke="var(--surface)" />
            ))}
            <path d="M58 45h14" stroke="var(--ink-2)" strokeWidth="2" markerEnd="url(#cnn-head)" />
            {Array.from({ length: 10 }, (_, index) => (
              <rect key={index} x="84" y={8 + index * 9} width="22" height="7" rx="2" fill="var(--series-6)" opacity={0.45 + (index % 3) * 0.2} className="cnn-node" style={{ animationDelay: `${index * 0.1}s` }} />
            ))}
          </svg>
          <p className="text-xs text-ink-2">Each map is averaged to one number: a 512-value summary of the scan.</p>
        </Stage>
        <Stage step={7} title="Hidden layer" shape="512 → 1944" chips={["Dropout 0.4", "Linear 512 → 1944", "GELU"]} color="var(--series-5)">
          <svg viewBox="0 0 120 110" className="h-24 w-full" role="img" aria-label="Every one of the 512 inputs connects to every one of the 1,944 hidden units">
            {[20, 40, 60, 80].flatMap((y1) => [12, 30, 48, 66, 84, 102].map((y2) => <path key={`${y1}-${y2}`} d={`M24 ${y1}L96 ${y2 - 2}`} stroke="var(--primary)" strokeOpacity="0.25" />))}
            {[20, 40, 60, 80].map((y) => <circle key={y} cx="24" cy={y} r="6" fill="var(--series-6)" />)}
            {[12, 30, 48, 66, 84, 102].map((y) => <circle key={y} cx="96" cy={y - 2} r="6" fill="var(--series-5)" className="cnn-node" />)}
          </svg>
          <p className="text-xs text-ink-2">Fully connected: 997,272 weights and biases.</p>
        </Stage>
        <Stage step={8} title="Output and prediction" shape="1944 → 4 logits" chips={["Dropout 0.4", "Linear 1944 → 4", "+ alignment × 0", "Softmax"]} color="var(--series-7)">
          <ul className="space-y-1">
            {CLASSES.map((name, index) => (
              <li key={name} className="flex items-center gap-2 text-xs">
                <span className="size-2.5 rounded-full" style={{ background: CLASS_COLORS[index] }} aria-hidden />
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-1 text-xs text-ink-2">Four scores, one per class; the largest is the diagnosis.</p>
        </Stage>
      </ol>
      <BlockCloseUp />
      <ClassifierNetwork />
    </div>
  );
}
