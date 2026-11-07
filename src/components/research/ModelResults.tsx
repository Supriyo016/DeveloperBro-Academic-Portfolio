"use client";

import { ExternalLink as ExternalIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { classLabels, classOrder, experimentRuns, type ExperimentRun } from "@/content/data/alzheimers";
import {
  backboneFigureLabels,
  backboneFigures,
  runFigureLabels,
  runFigures,
  runKey,
  type BackboneFigureKind,
  type RunFigureKind,
} from "@/content/data/alzheimers-figures";
import { cn, formatPercent } from "@/lib/utils";

const backbones = [
  { id: "custom-cnn", label: "Custom CNN", note: "Proposed, trained from scratch, Group Normalisation", color: "var(--series-1)" },
  { id: "mobilenetv2", label: "MobileNetV2", note: "ImageNet-pretrained, Batch Normalisation", color: "var(--series-3)" },
  { id: "efficientnetb0", label: "EfficientNetB0", note: "ImageNet-pretrained, Batch Normalisation", color: "var(--series-2)" },
] as const;
const algorithms = ["FedAvg", "FedProx", "FedDyn"] as const;
const metricColors = { precision: "var(--series-1)", recall: "var(--series-2)", f1: "var(--series-3)" };

const runOf = (backbone: string, algorithm: string) => experimentRuns.find((run) => run.backbone === backbone && run.algorithm === algorithm) as ExperimentRun;
const meanF1 = (backbone: string) => algorithms.reduce((sum, algorithm) => sum + runOf(backbone, algorithm).macroF1, 0) / algorithms.length;
const roundsTo90 = (run: ExperimentRun) => {
  const index = run.accuracyByRound.findIndex((value) => value >= 0.9);
  return index === -1 ? "Not reached" : `Round ${index + 1}`;
};

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { id: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div role="group" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-2xl bg-surface-2 p-1">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
          className={cn("min-h-9 rounded-xl px-3 text-sm transition-all", value === option.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ClassBars({ run }: { run: ExperimentRun }) {
  const H = 170;
  const groupW = 92;
  return (
    <svg viewBox={`0 0 ${groupW * 4 + 40} ${H + 46}`} className="h-auto w-full" role="img" aria-label={`Precision, recall and F1 for each class, ${run.backboneLabel} with ${run.algorithm}`}>
      {[0.6, 0.8, 1].map((tick) => {
        const y = 10 + (1 - (tick - 0.5) / 0.5) * H;
        return (
          <g key={tick}>
            <line x1="34" x2={groupW * 4 + 36} y1={y} y2={y} stroke="var(--grid)" />
            <text x="28" y={y + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{Math.round(tick * 100)}%</text>
          </g>
        );
      })}
      {classOrder.map((name, index) => {
        const metrics = run.perClass[name];
        return (
          <g key={name} transform={`translate(${40 + index * groupW} 0)`}>
            {(["precision", "recall", "f1"] as const).map((metric, position) => {
              const value = metrics[metric];
              const h = Math.max(((value - 0.5) / 0.5) * H, 2);
              return (
                <rect key={metric} x={10 + position * 24} y={10 + H - h} width="20" height={h} rx="4" fill={metricColors[metric]} className="transition-all duration-500">
                  <title>{`${classLabels[name]} ${metric}: ${formatPercent(value)}`}</title>
                </rect>
              );
            })}
            <text x="44" y={H + 30} textAnchor="middle" fontSize="12" fill="var(--ink-2)">{classLabels[name]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function RoundChart({ backbone, algorithm }: { backbone: string; algorithm: string }) {
  const W = 420;
  const H = 170;
  const x = (index: number) => 34 + (index / 29) * (W - 44);
  const y = (value: number) => 8 + ((1 - value) / 0.6) * H;
  const path = (values: number[]) => values.map((value, index) => `${index ? "L" : "M"}${x(index).toFixed(1)} ${y(Math.max(value, 0.4)).toFixed(1)}`).join("");
  return (
    <svg viewBox={`0 0 ${W} ${H + 34}`} className="h-auto w-full" role="img" aria-label={`Test accuracy per round for the three algorithms on ${backbone}, ${algorithm} highlighted`}>
      {[0.4, 0.6, 0.8, 0.9, 1].map((tick) => (
        <g key={tick}>
          <line x1="34" x2={W - 10} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" strokeDasharray={tick === 0.9 ? "4 4" : undefined} />
          <text x="28" y={y(tick) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{Math.round(tick * 100)}%</text>
        </g>
      ))}
      {[1, 10, 20, 30].map((round) => (
        <text key={round} x={x(round - 1)} y={H + 26} textAnchor="middle" fontSize="11" fill="var(--muted)">{round}</text>
      ))}
      {algorithms.map((name) => {
        const run = runOf(backbone, name);
        const on = name === algorithm;
        return (
          <path
            key={`${backbone}-${name}`}
            d={path(run.accuracyByRound)}
            fill="none"
            stroke={on ? "var(--primary)" : "var(--line-strong)"}
            strokeWidth={on ? 3 : 1.6}
            strokeLinecap="round"
            pathLength={1}
            className={on ? "draw-once" : undefined}
          />
        );
      })}
    </svg>
  );
}

function FigureCard({ src, width, height, alt, caption }: { src: string; width: number; height: number; alt: string; caption: string }) {
  return (
    <figure key={src} className="fade-in overflow-hidden rounded-xl border border-line">
      <a href={src} target="_blank" rel="noopener" className="zoom-media group relative block bg-white p-2" aria-label={`${alt}, open full size`}>
        <Image src={src} alt={alt} width={width} height={height} sizes="(min-width: 1024px) 760px, 100vw" className={cn("h-auto w-full", width / height < 1.4 && "mx-auto max-w-md")} />
        <span className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-ink/70 text-bg opacity-0 transition-opacity group-hover:opacity-100">
          <ExternalIcon className="size-4" aria-hidden />
        </span>
      </a>
      <figcaption className="border-t border-line p-3 text-sm text-muted">{caption}</figcaption>
    </figure>
  );
}

export function ModelResults() {
  const [backbone, setBackbone] = useState<string>("custom-cnn");
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]>("FedAvg");
  const [figure, setFigure] = useState<RunFigureKind>("curves");
  const [group, setGroup] = useState<BackboneFigureKind>("compare-f1");
  const run = runOf(backbone, algorithm);
  const info = backbones.find((item) => item.id === backbone) ?? backbones[0];
  const figures = runFigures[runKey(backbone, algorithm)] ?? {};
  const kinds = (Object.keys(runFigureLabels) as RunFigureKind[]).filter((kind) => figures[kind]);
  const current = figures[figure] ? figure : "curves";
  const shown = figures[current];
  const groupFigure = backboneFigures[backbone]?.[group];

  const kpis = [
    { label: "Accuracy", value: formatPercent(run.accuracy) },
    { label: "Macro precision", value: formatPercent(run.macroPrecision) },
    { label: "Macro recall", value: formatPercent(run.macroRecall) },
    { label: "Macro F1", value: formatPercent(run.macroF1) },
    { label: "Macro AUC", value: run.macroAuc === null ? "Not logged" : formatPercent(run.macroAuc) },
    { label: "Test loss", value: run.finalLoss.toFixed(4) },
    { label: "90% accuracy", value: roundsTo90(run) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Choose a model">
        {backbones.map((item) => {
          const on = item.id === backbone;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={on}
              onClick={() => setBackbone(item.id)}
              className={cn(
                "card relative overflow-hidden p-4 text-left transition-all duration-300",
                on ? "-translate-y-0.5 shadow-lg" : "hover:-translate-y-0.5",
              )}
              style={on ? { borderColor: item.color, boxShadow: `0 14px 30px -18px ${item.color}` } : undefined}
            >
              <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: item.color }} aria-hidden />
              <span className="block font-serif text-xl">{item.label}</span>
              <span className="mt-0.5 block text-sm text-muted">{item.note}</span>
              <span className="mt-3 block text-sm text-ink-2">
                Mean macro F1 <span className="font-medium text-ink tabular-nums">{formatPercent(meanF1(item.id))}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-6" style={{ background: `color-mix(in srgb, ${info.color} 9%, var(--surface))` }}>
          <div>
            <p className="eyebrow">Experiment {run.experiment}</p>
            <p className="font-serif text-2xl">
              {run.backboneLabel} with {run.algorithm}
            </p>
          </div>
          <Segmented label="Federated algorithm" options={algorithms.map((id) => ({ id, label: id }))} value={algorithm} onChange={setAlgorithm} />
        </div>

        <dl key={`${backbone}-${algorithm}`} className="fade-in grid grid-cols-2 gap-px bg-line sm:grid-cols-4 lg:grid-cols-7">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="bg-surface p-3 sm:p-4">
              <dd className="text-xl font-medium tabular-nums">{kpi.value}</dd>
              <dt className="text-xs text-muted">{kpi.label}</dt>
            </div>
          ))}
        </dl>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-2">
          <div>
            <h4 className="text-lg">Per-class scores</h4>
            <ClassBars run={run} />
            <ul className="flex gap-4 text-xs text-muted">
              {(["precision", "recall", "f1"] as const).map((metric) => (
                <li key={metric} className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm" style={{ background: metricColors[metric] }} aria-hidden />
                  {metric === "f1" ? "F1" : metric[0]?.toUpperCase() + metric.slice(1)}
                </li>
              ))}
            </ul>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-left text-sm tabular-nums">
                <caption className="sr-only">Per-class precision, recall, F1 and support</caption>
                <thead>
                  <tr className="border-b border-line-strong">
                    <th scope="col" className="py-1.5 pr-2 font-medium">Class</th>
                    <th scope="col" className="py-1.5 pr-2 font-medium">Precision</th>
                    <th scope="col" className="py-1.5 pr-2 font-medium">Recall</th>
                    <th scope="col" className="py-1.5 pr-2 font-medium">F1</th>
                    <th scope="col" className="py-1.5 font-medium">Images</th>
                  </tr>
                </thead>
                <tbody>
                  {classOrder.map((name) => {
                    const metrics = run.perClass[name];
                    return (
                      <tr key={name} className="border-b border-line">
                        <th scope="row" className="py-1.5 pr-2 font-normal">{classLabels[name]}</th>
                        <td className="py-1.5 pr-2">{formatPercent(metrics.precision)}</td>
                        <td className="py-1.5 pr-2">{formatPercent(metrics.recall)}</td>
                        <td className="py-1.5 pr-2">{formatPercent(metrics.f1)}</td>
                        <td className="py-1.5">{metrics.support.toLocaleString("en-GB")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="text-lg">Test accuracy by round</h4>
            <RoundChart backbone={backbone} algorithm={algorithm} />
            <p className="text-xs text-muted">{run.algorithm} is highlighted. Grey lines are the other two algorithms on {run.backboneLabel}. Dashed line: 90%.</p>
          </div>
        </div>

        <div className="border-t border-line p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-lg">Figures from this run</h4>
            <Segmented label="Figure" options={kinds.map((id) => ({ id, label: runFigureLabels[id].label }))} value={current} onChange={setFigure} />
          </div>
          {shown && (
            <div className="mt-4">
              <FigureCard
                src={shown.src}
                width={shown.width}
                height={shown.height}
                alt={`${runFigureLabels[current].label}, ${run.backboneLabel} with ${run.algorithm}`}
                caption={`${runFigureLabels[current].caption} ${run.backboneLabel} with ${run.algorithm}.`}
              />
            </div>
          )}
          {algorithm !== "FedAvg" && <p className="mt-2 text-sm text-muted">The confusion matrix and prediction grid were plotted for the FedAvg runs only.</p>}
        </div>

        <div className="border-t border-line p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-lg">All three algorithms on {info.label}</h4>
            <Segmented
              label="Comparison figure"
              options={(Object.keys(backboneFigureLabels) as BackboneFigureKind[]).map((id) => ({ id, label: backboneFigureLabels[id].label }))}
              value={group}
              onChange={setGroup}
            />
          </div>
          {groupFigure && (
            <div className="mt-4">
              <FigureCard
                src={groupFigure.src}
                width={groupFigure.width}
                height={groupFigure.height}
                alt={`${backboneFigureLabels[group].label}, ${info.label}`}
                caption={`${backboneFigureLabels[group].caption} ${info.label}.`}
              />
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted">
        Every number and figure is from the saved notebook outputs, final round, one run per configuration. FedDyn AUC is the mean of the four per-class AUCs printed on its ROC figure,
        because the FedDyn cells did not print a global value.
      </p>
    </div>
  );
}
