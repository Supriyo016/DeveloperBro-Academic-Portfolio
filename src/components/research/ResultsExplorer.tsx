"use client";

import { useState } from "react";
import { classLabels, classOrder, experimentRuns, type ExperimentRun } from "@/content/data/alzheimers";
import { cn, formatPercent } from "@/lib/utils";
import { ConvergenceChart } from "./ConvergenceChart";

type Metric = "accuracy" | "macroF1" | "macroAuc";

const metrics: { id: Metric; label: string }[] = [
  { id: "accuracy", label: "Accuracy" },
  { id: "macroF1", label: "Macro F1" },
  { id: "macroAuc", label: "Macro AUC" },
];

const backbones = ["custom-cnn", "mobilenetv2", "efficientnetb0"];
const algorithms = ["FedAvg", "FedProx", "FedDyn"] as const;

const find = (backbone: string, algorithm: string) =>
  experimentRuns.find((run) => run.backbone === backbone && run.algorithm === algorithm) as ExperimentRun;

function shade(value: number, values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const position = max === min ? 1 : (value - min) / (max - min);
  return `color-mix(in srgb, var(--series-1) ${Math.round(8 + position * 34)}%, var(--surface))`;
}

export function ResultsExplorer() {
  const [metric, setMetric] = useState<Metric>("accuracy");
  const [selected, setSelected] = useState<ExperimentRun>(find("custom-cnn", "FedAvg"));
  const values = experimentRuns.map((run) => run[metric]).filter((value): value is number => value !== null);

  return (
    <div className="space-y-8">
      <div className="card p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl">Nine configurations</h3>
          <div role="group" aria-label="Metric" className="inline-flex rounded-full bg-surface-2 p-1">
            {metrics.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={metric === item.id}
                onClick={() => setMetric(item.id)}
                className={cn(
                  "min-h-9 rounded-full px-3 text-sm transition-colors",
                  metric === item.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[26rem] border-separate border-spacing-1.5 text-sm">
            <caption className="sr-only">Selected metric for each backbone and federated algorithm. Choose a cell to see details.</caption>
            <thead>
              <tr>
                <th scope="col" className="text-left font-normal text-muted">Backbone</th>
                {algorithms.map((algorithm) => (
                  <th key={algorithm} scope="col" className="pb-1 font-medium">{algorithm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {backbones.map((backbone) => (
                <tr key={backbone}>
                  <th scope="row" className="pr-2 text-left font-medium whitespace-nowrap">{find(backbone, "FedAvg").backboneLabel}</th>
                  {algorithms.map((algorithm) => {
                    const run = find(backbone, algorithm);
                    const value = run[metric];
                    const active = selected.experiment === run.experiment;
                    return (
                      <td key={algorithm} className="p-0">
                        <button
                          type="button"
                          aria-pressed={active}
                          aria-label={`${run.backboneLabel} with ${algorithm}: ${value === null ? "not recorded" : formatPercent(value)}`}
                          onClick={() => setSelected(run)}
                          style={{ background: value === null ? "var(--surface-2)" : shade(value, values) }}
                          className={cn(
                            "h-14 w-full rounded-lg text-[0.95rem] font-medium tabular-nums transition-shadow",
                            active && "ring-2 ring-primary ring-offset-2 ring-offset-surface",
                          )}
                        >
                          {value === null ? <span className="text-sm font-normal text-muted">not recorded</span> : formatPercent(value)}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted">
          Final-round values on 8,800 held-out images, one federated run per configuration. Stronger colour means a higher score within this metric. FedDyn AUC is the mean of the per-class AUCs on its ROC figure.
        </p>

        <div className="mt-6 border-t border-line pt-5" aria-live="polite">
          <p className="eyebrow">Experiment {selected.experiment}</p>
          <p className="mt-1 font-serif text-xl">{selected.backboneLabel} with {selected.algorithm}</p>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {classOrder.map((name) => {
              const f1 = selected.perClass[name].f1;
              return (
                <li key={name}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-2">{classLabels[name]}</span>
                    <span className="font-medium tabular-nums">F1 {formatPercent(f1)}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                    <div className="h-full rounded-full bg-[var(--series-1)] transition-[width] duration-500" style={{ width: `${f1 * 100}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <ConvergenceChart runs={experimentRuns} />
    </div>
  );
}
