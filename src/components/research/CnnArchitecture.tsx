"use client";

import { useState } from "react";
import { backboneComparison, blockParams, cnnBlocks, cnnTotalParams, type LayerKind } from "@/content/data/cnn-architecture";
import { cn } from "@/lib/utils";

const kindStyle: Record<LayerKind, { label: string; color: string }> = {
  input: { label: "Input", color: "var(--series-5)" },
  conv: { label: "Convolution", color: "var(--series-1)" },
  norm: { label: "Normalisation", color: "var(--series-3)" },
  act: { label: "Activation", color: "var(--series-4)" },
  pool: { label: "Pooling", color: "var(--series-6)" },
  dropout: { label: "Dropout", color: "var(--muted)" },
  linear: { label: "Fully connected", color: "var(--series-2)" },
  output: { label: "Output", color: "var(--series-7)" },
  align: { label: "Alignment", color: "var(--muted)" },
};

const n = (value: number) => value.toLocaleString("en-GB");

/** A cuboid for one feature map. Height follows spatial size, depth follows channel count. */
function Cuboid({ x, size, channels, color, active }: { x: number; size: number; channels: number; color: string; active: boolean }) {
  const h = 28 + Math.log2(Math.max(size, 1) + 1) * 22;
  const d = 10 + Math.log2(channels) * 5;
  const w = 16 + Math.log2(channels) * 3.2;
  const y = 150 - h / 2;
  const k = d * 0.55;
  return (
    <g className={cn("transition-opacity", active ? "opacity-100" : "opacity-80")}>
      <path d={`M${x} ${y}l${k} ${-k}h${w}l${-k} ${k}Z`} fill={color} opacity="0.55" />
      <path d={`M${x + w} ${y}l${k} ${-k}v${h}l${-k} ${k}Z`} fill={color} opacity="0.75" />
      <rect x={x} y={y} width={w} height={h} fill={color} />
      <rect x={x} y={y} width={w} height={h} fill="url(#cnn-shine)" />
      {active && <rect x={x - 4} y={y - k - 4} width={w + k + 8} height={h + k + 8} rx="6" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 4" className="il-dash" />}
    </g>
  );
}

export function CnnArchitecture() {
  const [active, setActive] = useState("block-1");
  const [showAll, setShowAll] = useState(false);
  const block = cnnBlocks.find((item) => item.id === active) ?? cnnBlocks[0];
  const xs = cnnBlocks.map((_, index) => 24 + index * 118);
  const rows = showAll ? cnnBlocks.flatMap((item) => item.layers.map((layer) => ({ ...layer, block: item.label }))) : (block?.layers ?? []).map((layer) => ({ ...layer, block: block?.label ?? "" }));

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6">
        <h3 className="text-2xl">Inside the Custom CNN</h3>
        <p className="mt-1 text-[0.95rem] text-ink-2">
          Five convolution blocks and a two-layer classifier, {n(cnnTotalParams)} trainable parameters in total. Choose a block to see its layers.
        </p>
      </div>

      <div className="overflow-x-auto border-y border-line bg-surface-2/60">
        <svg viewBox="0 0 980 270" className="h-auto w-full min-w-[44rem]" role="img" aria-label="Diagram of the Custom CNN, from a 64 by 64 input through five convolution blocks to a four-class output">
          <defs>
            <linearGradient id="cnn-shine" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M${xs[0]} 150H${(xs.at(-1) ?? 0) + 60}`} stroke="var(--line-strong)" strokeWidth="2" strokeDasharray="5 6" className="il-dash" />
          {cnnBlocks.map((item, index) => (
            <circle key={item.id} r="5" fill={item.color} className="il-packet" style={{ offsetPath: `path("M${xs[0]} 150H${(xs.at(-1) ?? 0) + 60}")`, animationDelay: `${index * 0.9}s`, animationDuration: "6.5s" }} />
          ))}
          {cnnBlocks.map((item, index) => {
            const x = xs[index] ?? 0;
            const on = item.id === active;
            return (
              <g key={item.id} onClick={() => setActive(item.id)} className="cursor-pointer">
                <rect x={x - 12} y="20" width="112" height="240" rx="14" fill={on ? "var(--surface)" : "transparent"} stroke={on ? item.color : "transparent"} strokeWidth="2" />
                {item.id === "head" || item.id === "align" ? (
                  <g>
                    {[0, 1, 2, 3].map((dot) => (
                      <circle key={dot} cx={x + 40} cy={104 + dot * 30} r={item.id === "align" ? 6 : 9} fill={item.color} opacity={0.6 + dot * 0.1} className={on ? "il-pulse" : undefined} />
                    ))}
                  </g>
                ) : (
                  <Cuboid x={x + 16} size={item.size} channels={item.channels} color={item.color} active={on} />
                )}
                <text x={x + 44} y="44" textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--ink)">{item.label}</text>
                <text x={x + 44} y="238" textAnchor="middle" fontSize="12" fill="var(--ink-2)" fontFamily="var(--font-geist-mono), monospace">
                  {item.layers.at(-1)?.output}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div role="group" aria-label="Choose a block" className="flex flex-wrap gap-1.5 px-4 pt-4 sm:px-6">
        {cnnBlocks.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === active && !showAll}
            onClick={() => {
              setActive(item.id);
              setShowAll(false);
            }}
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm transition-colors",
              item.id === active && !showAll ? "border-transparent bg-ink text-bg" : "border-line text-ink-2 hover:border-line-strong",
            )}
          >
            <span className="size-2.5 rounded-full" style={{ background: item.color }} aria-hidden />
            {item.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 p-4 sm:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-serif text-xl">{showAll ? "Every layer" : `${block?.label}: ${block?.role}`}</p>
            <button type="button" onClick={() => setShowAll(!showAll)} aria-pressed={showAll} className="min-h-9 rounded-full border border-line px-3 text-sm text-primary hover:bg-primary-soft">
              {showAll ? "Show the chosen block" : "Show all layers"}
            </button>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm tabular-nums">
              <thead>
                <tr className="border-b border-line-strong text-ink">
                  {showAll && <th scope="col" className="py-2 pr-3 font-medium">Block</th>}
                  <th scope="col" className="py-2 pr-3 font-medium">Layer</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Settings</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Output</th>
                  <th scope="col" className="py-2 text-right font-medium">Parameters</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((layer, index) => (
                  <tr key={`${layer.block}-${layer.name}-${index}`} className="border-b border-line">
                    {showAll && <td className="py-2 pr-3 whitespace-nowrap text-muted">{layer.block}</td>}
                    <th scope="row" className="py-2 pr-3 font-normal whitespace-nowrap">
                      <span className="mr-2 inline-block size-2.5 rounded-full align-middle" style={{ background: kindStyle[layer.kind].color }} aria-hidden />
                      {layer.name}
                    </th>
                    <td className="py-2 pr-3 text-ink-2">{layer.detail}</td>
                    <td className="py-2 pr-3 font-mono text-xs whitespace-nowrap">{layer.output}</td>
                    <td className="py-2 text-right">{n(layer.params)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="eyebrow">Where the parameters are</p>
          <div className="mt-3 flex h-4 overflow-hidden rounded-full" aria-hidden>
            {blockParams.map((item) => (
              <span key={item.id} style={{ width: `${(item.params / cnnTotalParams) * 100}%`, background: item.color }} />
            ))}
          </div>
          <ul className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
            {blockParams.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: item.color }} aria-hidden />
                  {item.label}
                </span>
                <span className="tabular-nums text-ink-2">
                  {n(item.params)} <span className="text-muted">({((item.params / cnnTotalParams) * 100).toFixed(1)}%)</span>
                </span>
              </li>
            ))}
            <li className="flex justify-between border-t border-line pt-1.5 font-medium sm:col-span-2">
              <span>Total</span>
              <span className="tabular-nums">{n(cnnTotalParams)}</span>
            </li>
          </ul>
          <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted">
            {(["conv", "norm", "act", "pool", "linear", "dropout"] as const).map((kind) => (
              <li key={kind} className="flex items-center gap-1">
                <span className="size-2 rounded-full" style={{ background: kindStyle[kind].color }} aria-hidden />
                {kindStyle[kind].label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line p-4 sm:p-6">
        <h4 className="text-xl">Three backbones, the same trainable budget</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-line-strong text-ink">
                <th scope="col" className="py-2 pr-3 font-medium">Backbone</th>
                <th scope="col" className="py-2 pr-3 font-medium">Start</th>
                <th scope="col" className="py-2 pr-3 font-medium">Normalisation</th>
                <th scope="col" className="py-2 pr-3 font-medium">Body</th>
                <th scope="col" className="py-2 pr-3 font-medium">Frozen</th>
                <th scope="col" className="py-2 pr-3 font-medium">Head</th>
                <th scope="col" className="py-2 text-right font-medium">Trainable / total</th>
              </tr>
            </thead>
            <tbody>
              {backboneComparison.map((row) => (
                <tr key={row.name} className="border-b border-line align-top">
                  <th scope="row" className="py-2 pr-3 font-medium whitespace-nowrap">{row.name}</th>
                  <td className="py-2 pr-3 text-ink-2">{row.origin}</td>
                  <td className="py-2 pr-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs whitespace-nowrap", row.normalisation.startsWith("Group") ? "bg-ok-soft text-ok-ink" : "bg-warn-soft text-warn-ink")}>{row.normalisation}</span>
                  </td>
                  <td className="py-2 pr-3 text-ink-2">{row.depth}, {row.activation}</td>
                  <td className="py-2 pr-3 text-ink-2">{row.frozen}</td>
                  <td className="py-2 pr-3 text-ink-2">{row.head}</td>
                  <td className="py-2 text-right tabular-nums whitespace-nowrap">
                    {n(row.trainable)}
                    <span className="block text-xs text-muted">of {n(row.total)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">Read from the model definitions in the three thesis notebooks. Trainable counts are the values each notebook printed.</p>
      </div>
    </div>
  );
}
