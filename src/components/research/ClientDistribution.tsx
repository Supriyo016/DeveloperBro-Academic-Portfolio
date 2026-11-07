"use client";

import { useState } from "react";
import { classLabels, classOrder, clientDistribution } from "@/content/data/alzheimers";
import { cn } from "@/lib/utils";

const colors = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];
const total = (counts: Record<string, number>) => Object.values(counts).reduce((sum, value) => sum + value, 0);
const largest = Math.max(...clientDistribution.map((row) => total(row.counts)));

export function ClientDistribution() {
  const [mode, setMode] = useState<"count" | "share">("count");

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl">What each client holds</h3>
        <div role="group" aria-label="Scale" className="inline-flex rounded-full bg-surface-2 p-1">
          {(["count", "share"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => setMode(value)}
              className={cn("min-h-9 rounded-full px-3 text-sm transition-colors", mode === value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
            >
              {value === "count" ? "Image count" : "Class share"}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
        {classOrder.map((name, index) => (
          <li key={name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: colors[index] }} aria-hidden />
            {classLabels[name]}
          </li>
        ))}
      </ul>

      <ul className="mt-4 space-y-3">
        {clientDistribution.map((row) => {
          const rowTotal = total(row.counts);
          return (
            <li key={row.client} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-2 text-sm">
              <span className="text-ink-2">{row.client}</span>
              <div className="flex h-5 gap-0.5 transition-[width] duration-500" style={{ width: mode === "count" ? `${(rowTotal / largest) * 100}%` : "100%" }}>
                {classOrder.map((name, index) => (
                  <div
                    key={name}
                    title={`${classLabels[name]}: ${row.counts[name].toLocaleString("en-GB")} images (${((row.counts[name] / rowTotal) * 100).toFixed(1)}%)`}
                    className="h-full first:rounded-l last:rounded-r"
                    style={{ flexGrow: row.counts[name], flexBasis: 0, background: colors[index] }}
                  />
                ))}
              </div>
              <span className="text-right text-muted tabular-nums">{rowTotal.toLocaleString("en-GB")}</span>
            </li>
          );
        })}
      </ul>

      <details className="mt-4 text-sm">
        <summary className="text-primary">Show data table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left tabular-nums">
            <thead>
              <tr>
                <th scope="col" className="py-1 pr-4 font-medium">Client</th>
                {classOrder.map((name) => (
                  <th key={name} scope="col" className="py-1 pr-4 font-medium">{classLabels[name]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientDistribution.map((row) => (
                <tr key={row.client} className="border-t border-line">
                  <th scope="row" className="py-1 pr-4 font-normal">{row.client}</th>
                  {classOrder.map((name) => (
                    <td key={name} className="py-1 pr-4">{row.counts[name].toLocaleString("en-GB")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
