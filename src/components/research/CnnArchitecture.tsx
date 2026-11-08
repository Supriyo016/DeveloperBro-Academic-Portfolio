"use client";

import { useState } from "react";
import { backboneComparison, blockParams, cnnBlocks, cnnTotalParams, type LayerKind } from "@/content/data/cnn-architecture";
import { cn } from "@/lib/utils";
import { CnnProcess } from "./CnnProcess";

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

export function CnnArchitecture() {
  const [active, setActive] = useState("block-1");
  const [showAll, setShowAll] = useState(false);
  const block = cnnBlocks.find((item) => item.id === active) ?? cnnBlocks[0];
  const rows = showAll ? cnnBlocks.flatMap((item) => item.layers.map((layer) => ({ ...layer, block: item.label }))) : (block?.layers ?? []).map((layer) => ({ ...layer, block: block?.label ?? "" }));

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6">
        <h3 className="text-2xl">Inside the Custom CNN</h3>
        <p className="mt-1 text-[0.95rem] text-ink-2">
          Five convolution blocks and a two-layer classifier, {n(cnnTotalParams)} trainable parameters in total. Below the process, choose a block to see its exact layers.
        </p>
      </div>

      <div className="border-y border-line bg-surface-2/40 p-4 sm:p-6">
        <h4 className="text-xl">From MRI slice to diagnosis</h4>
        <p className="mt-1 mb-4 text-sm text-ink-2">The forward pass in order. Shapes are channels × height × width.</p>
        <CnnProcess />
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
