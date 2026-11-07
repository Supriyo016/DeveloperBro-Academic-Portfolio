import { classLabels, classOrder, clientDistribution } from "@/content/data/alzheimers";

// A wide, colourful map of one federated round as it ran in the dissertation. Server component: pure SVG,
// with packets travelling along the links (CSS offset-path, paused by the motion switch and reduced motion).

const classColors = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];
const W = 1000;
const clientY = 380;
const clientW = 168;
const gap = (W - 5 * clientW) / 6;
const clientX = (index: number) => gap + index * (clientW + gap);
const serverBox = { x: 330, y: 40, w: 340, h: 132 };

function ClientCard({ index }: { index: number }) {
  const row = clientDistribution[index];
  if (!row) return null;
  const counts = classOrder.map((name) => row.counts[name]);
  const total = counts.reduce((sum, value) => sum + value, 0);
  const x = clientX(index);
  const barW = clientW - 28;
  const starts = counts.map((_, position) => counts.slice(0, position).reduce((sum, value) => sum + (barW * value) / total, 0));
  return (
    <g transform={`translate(${x} ${clientY})`}>
      <rect width={clientW} height="118" rx="16" fill="var(--surface)" stroke="var(--line-strong)" />
      <rect width={clientW} height="34" rx="16" fill={`url(#fa-client-${index % 2})`} />
      <rect y="18" width={clientW} height="16" fill={`url(#fa-client-${index % 2})`} />
      {/* hospital icon */}
      <g transform="translate(14 7)" fill="#fff">
        <rect width="20" height="20" rx="4" opacity="0.25" />
        <path d="M8 4h4v4h4v4h-4v4H8v-4H4V8h4Z" />
      </g>
      <text x="42" y="22" fontSize="15" fontWeight="600" fill="#fff">{row.client}</text>
      <text x="14" y="58" fontSize="22" fontWeight="600" fill="var(--ink)" className="tabular-nums">{total.toLocaleString("en-GB")}</text>
      <text x="14" y="74" fontSize="11.5" fill="var(--muted)">private MRI images</text>
      <g transform="translate(14 86)">
        <rect width={clientW - 28} height="12" rx="6" fill="var(--surface-2)" />
        {counts.map((value, position) => (
          <rect key={position} x={starts[position]} width={(barW * value) / total} height="12" fill={classColors[position]} />
        ))}
      </g>
      <text x="14" y="112" fontSize="10.5" fill="var(--muted)">10 local epochs per round</text>
    </g>
  );
}

export function FederatedArchitecture() {
  const serverBottom = serverBox.y + serverBox.h;
  const links = Array.from({ length: 5 }, (_, index) => {
    const cx = clientX(index) + clientW / 2;
    const sx = serverBox.x + 60 + index * 55;
    return {
      up: `M${cx - 14} ${clientY} C ${cx - 14} ${clientY - 90}, ${sx - 8} ${serverBottom + 90}, ${sx - 8} ${serverBottom}`,
      down: `M${sx + 8} ${serverBottom} C ${sx + 8} ${serverBottom + 90}, ${cx + 14} ${clientY - 90}, ${cx + 14} ${clientY}`,
    };
  });

  return (
    <figure className="card overflow-hidden">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${W} 560`} role="img" aria-labelledby="fa-title fa-desc" className="h-auto w-full min-w-[46rem]">
          <title id="fa-title">One communication round of the federated system</title>
          <desc id="fa-desc">
            Five hospital clients each train on their own private MRI images and send model weights to a Flower server. The server averages them,
            weighted by image count, evaluates the global model on 8,800 held-out images and sends it back. A CKKS prototype encrypts and decrypts a
            sampled slice of the weights beside training.
          </desc>
          <defs>
            <linearGradient id="fa-server" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style={{ stopColor: "var(--primary)" }} />
              <stop offset="1" style={{ stopColor: "var(--accent)" }} />
            </linearGradient>
            <linearGradient id="fa-client-0" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--series-1)" }} />
              <stop offset="1" style={{ stopColor: "var(--primary)" }} />
            </linearGradient>
            <linearGradient id="fa-client-1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" style={{ stopColor: "var(--accent)" }} />
              <stop offset="1" style={{ stopColor: "var(--series-3)" }} />
            </linearGradient>
            <radialGradient id="fa-glow">
              <stop offset="0" style={{ stopColor: "var(--primary)", stopOpacity: 0.28 }} />
              <stop offset="1" style={{ stopColor: "var(--primary)", stopOpacity: 0 }} />
            </radialGradient>
            <marker id="fa-arrow-up" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10Z" fill="var(--series-2)" />
            </marker>
            <marker id="fa-arrow-down" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10Z" fill="var(--series-1)" />
            </marker>
          </defs>

          <rect width={W} height="560" fill="var(--surface)" />
          <ellipse cx="500" cy="110" rx="330" ry="150" fill="url(#fa-glow)" className="il-glow" />

          {/* links */}
          {links.map((link, index) => (
            <g key={index}>
              <path d={link.up} fill="none" stroke="var(--series-2)" strokeWidth="2.5" strokeDasharray="7 7" className="il-dash" markerEnd="url(#fa-arrow-up)" opacity="0.85" />
              <path d={link.down} fill="none" stroke="var(--series-1)" strokeWidth="2.5" strokeDasharray="7 7" className="il-dash" markerEnd="url(#fa-arrow-down)" opacity="0.85" />
              <rect x="-7" y="-5" width="14" height="10" rx="2.5" fill="var(--series-2)" className="il-packet" style={{ offsetPath: `path("${link.up}")`, animationDelay: `${index * 0.6}s` }} />
              <circle r="6" fill="var(--series-1)" className="il-packet" style={{ offsetPath: `path("${link.down}")`, animationDelay: `${2.6 + index * 0.6}s` }} />
            </g>
          ))}

          {/* server */}
          <g transform={`translate(${serverBox.x} ${serverBox.y})`}>
            <rect width={serverBox.w} height={serverBox.h} rx="22" fill="url(#fa-server)" />
            <rect x="6" y="6" width={serverBox.w - 12} height={serverBox.h - 12} rx="18" fill="none" stroke="#fff" strokeOpacity="0.25" />
            <g transform="translate(20 22)" fill="#fff">
              {[0, 16, 32].map((dy) => (
                <g key={dy}>
                  <rect y={dy} width="40" height="12" rx="3" opacity="0.3" />
                  <circle cx="33" cy={dy + 6} r="2.4" className="il-twinkle" style={{ animationDelay: `${dy / 20}s` }} />
                </g>
              ))}
            </g>
            <text x="76" y="36" fontSize="20" fontWeight="600" fill="#fff">Flower server</text>
            <text x="76" y="58" fontSize="13" fill="#fff" opacity="0.85">FedAvg, FedProx or FedDyn</text>
            <text x="20" y="98" fontSize="19" fill="#fff" fontFamily="var(--font-newsreader), serif" fontStyle="italic">
              w ← Σ (nₖ / n) · wₖ
            </text>
            <text x="20" y="118" fontSize="11.5" fill="#fff" opacity="0.85">average weighted by each client&apos;s image count</text>
          </g>

          {/* evaluation */}
          <g transform="translate(760 56)">
            <rect width="210" height="100" rx="18" fill="var(--ok-soft)" stroke="var(--series-3)" strokeWidth="1.5" />
            <text x="18" y="30" fontSize="14" fontWeight="600" fill="var(--ok-ink)">Every round: evaluate</text>
            <text x="18" y="54" fontSize="22" fontWeight="600" fill="var(--ink)">8,800</text>
            <text x="18" y="72" fontSize="11.5" fill="var(--ink-2)">held-out test images</text>
            <text x="18" y="89" fontSize="11.5" fill="var(--ink-2)">30 rounds, final round reported</text>
          </g>
          <path d="M670 106h82" stroke="var(--series-3)" strokeWidth="2.5" strokeDasharray="6 6" className="il-dash" />

          {/* CKKS prototype */}
          <g transform="translate(30 50)">
            <rect width="252" height="116" rx="18" fill="var(--warn-soft)" stroke="var(--series-4)" strokeWidth="1.5" strokeDasharray="6 5" />
            <g transform="translate(18 18)">
              <rect y="10" width="26" height="20" rx="5" fill="var(--series-4)" />
              <path d="M5 10V6a8 8 0 0 1 16 0v4" fill="none" stroke="var(--series-4)" strokeWidth="3" />
              <circle cx="13" cy="20" r="3" fill="var(--warn-soft)" className="il-pulse" />
            </g>
            <text x="56" y="34" fontSize="14" fontWeight="600" fill="var(--warn-ink)">CKKS prototype</text>
            <text x="56" y="51" fontSize="11.5" fill="var(--ink-2)">TenSEAL, degree 8192</text>
            <text x="18" y="76" fontSize="11.5" fill="var(--ink-2)">A sampled slice of weights is</text>
            <text x="18" y="91" fontSize="11.5" fill="var(--ink-2)">encrypted and decrypted each round</text>
            <text x="18" y="106" fontSize="11.5" fill="var(--ink-2)">to check error. Not in aggregation.</text>
          </g>
          <path d="M282 108h40" stroke="var(--series-4)" strokeWidth="2" strokeDasharray="4 5" className="il-dash" />

          {/* legend for the links */}
          <g transform="translate(330 214)" fontSize="12.5" fill="var(--ink-2)">
            <rect width="340" height="56" rx="12" fill="var(--surface)" stroke="var(--line)" />
            <path d="M16 20h28" stroke="var(--series-2)" strokeWidth="3" strokeDasharray="6 5" />
            <text x="52" y="24">Local model weights, sent up (plaintext)</text>
            <path d="M16 40h28" stroke="var(--series-1)" strokeWidth="3" strokeDasharray="6 5" />
            <text x="52" y="44">New global model, sent back to every client</text>
          </g>

          {Array.from({ length: 5 }, (_, index) => (
            <ClientCard key={index} index={index} />
          ))}

          <g transform={`translate(${gap} 528)`} fontSize="12" fill="var(--ink-2)">
            <text y="4" fill="var(--muted)">Class mix:</text>
            {classOrder.map((name, position) => (
              <g key={name} transform={`translate(${72 + position * 130} 0)`}>
                <rect y="-6" width="12" height="12" rx="3" fill={classColors[position]} />
                <text x="18" y="4">{classLabels[name]}</text>
              </g>
            ))}
            <text x="600" y="4" fill="var(--muted)">Images never leave a client. Only model weights travel.</text>
          </g>
        </svg>
      </div>
      <figcaption className="border-t border-line p-3 text-sm text-muted">
        One round of the dissertation pipeline. Client sizes and class mixes are the real Dirichlet partition (α = 0.5) of the 35,200 training images.
      </figcaption>
    </figure>
  );
}
