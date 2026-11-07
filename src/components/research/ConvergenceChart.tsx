"use client";

import { useMemo, useState } from "react";
import type { ExperimentRun } from "@/content/data/alzheimers";
import { cn, formatPercent } from "@/lib/utils";
import { useWidth } from "./useWidth";

const HEIGHT = 300;
const margin = { top: 14, right: 16, bottom: 38, left: 42 };
const ROUNDS = 30;
const Y_MIN = 0.4;
const Y_MAX = 1;
const yTicks = [0.4, 0.6, 0.8, 1];

const seriesColor: Record<string, string> = {
  FedAvg: "var(--series-1)",
  FedProx: "var(--series-2)",
  FedDyn: "var(--series-3)",
};

const backbones = [
  { id: "custom-cnn", label: "Custom CNN" },
  { id: "mobilenetv2", label: "MobileNetV2" },
  { id: "efficientnetb0", label: "EfficientNetB0" },
];

export function ConvergenceChart({ runs }: { runs: ExperimentRun[] }) {
  const [backbone, setBackbone] = useState("custom-cnn");
  const [hover, setHover] = useState<number | null>(null);
  const [ref, width] = useWidth<HTMLDivElement>(640);

  const series = useMemo(() => runs.filter((run) => run.backbone === backbone), [runs, backbone]);
  const plotWidth = Math.max(width - margin.left - margin.right, 120);
  const plotHeight = HEIGHT - margin.top - margin.bottom;
  const x = (round: number) => margin.left + ((round - 1) / (ROUNDS - 1)) * plotWidth;
  const y = (value: number) => margin.top + ((Y_MAX - value) / (Y_MAX - Y_MIN)) * plotHeight;
  const pathFor = (values: number[]) => values.map((value, index) => `${index ? "L" : "M"}${x(index + 1).toFixed(1)} ${y(value).toFixed(1)}`).join("");

  const onPointer = (event: React.PointerEvent<SVGRectElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - box.left) / box.width;
    setHover(Math.min(ROUNDS, Math.max(1, Math.round(ratio * (ROUNDS - 1)) + 1)));
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const step = event.key === "ArrowRight" ? 1 : -1;
    setHover((round) => Math.min(ROUNDS, Math.max(1, (round ?? ROUNDS) + step)));
  };

  const tooltipLeft = hover === null ? 0 : Math.min(Math.max(x(hover) + 10, 0), width - 150);

  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-xl">Test accuracy by round</h3>
        <div role="group" aria-label="Backbone" className="inline-flex flex-wrap rounded-full bg-surface-2 p-1">
          {backbones.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={backbone === item.id}
              onClick={() => setBackbone(item.id)}
              className={cn(
                "min-h-9 rounded-full px-3 text-sm transition-colors",
                backbone === item.id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
        {series.map((run) => (
          <li key={run.algorithm} className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full" style={{ background: seriesColor[run.algorithm] }} aria-hidden />
            {run.algorithm} <span className="text-muted tabular-nums">{formatPercent(run.accuracy)}</span>
          </li>
        ))}
      </ul>

      <div ref={ref} className="relative mt-3 overflow-hidden">
        <svg
          width="100%"
          height={HEIGHT}
          role="img"
          aria-label={`Line chart of test accuracy over 30 rounds for ${backbones.find((item) => item.id === backbone)?.label}. Use the left and right arrow keys to inspect rounds. A table follows.`}
          tabIndex={0}
          onKeyDown={onKey}
          onBlur={() => setHover(null)}
          className="block"
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line x1={margin.left} x2={margin.left + plotWidth} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" />
              <text x={margin.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="var(--muted)" className="tabular-nums">
                {Math.round(tick * 100)}%
              </text>
            </g>
          ))}
          {[1, 10, 20, 30].map((round) => (
            <text key={round} x={x(round)} y={HEIGHT - 16} textAnchor="middle" fontSize="12" fill="var(--muted)" className="tabular-nums">
              {round}
            </text>
          ))}
          <text x={margin.left + plotWidth / 2} y={HEIGHT - 1} textAnchor="middle" fontSize="12" fill="var(--muted)">
            Communication round
          </text>
          {series.map((run) => (
            <path key={run.algorithm} d={pathFor(run.accuracyByRound)} fill="none" stroke={seriesColor[run.algorithm]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          ))}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={margin.top} y2={margin.top + plotHeight} stroke="var(--line-strong)" />
              {series.map((run) => (
                <circle key={run.algorithm} cx={x(hover)} cy={y(run.accuracyByRound[hover - 1] ?? 0)} r="4.5" fill={seriesColor[run.algorithm]} stroke="var(--surface)" strokeWidth="2" />
              ))}
            </g>
          )}
          <rect
            x={margin.left}
            y={margin.top}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute top-3 w-[140px] rounded-lg border border-line bg-surface px-3 py-2 text-sm shadow-md" style={{ left: tooltipLeft }}>
            <p className="font-medium">Round {hover}</p>
            {series.map((run) => (
              <p key={run.algorithm} className="flex justify-between gap-2 text-ink-2">
                <span>{run.algorithm}</span>
                <span className="tabular-nums">{formatPercent(run.accuracyByRound[hover - 1] ?? 0, 1)}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      <details className="mt-3 text-sm">
        <summary className="text-primary">Show data table</summary>
        <div className="mt-2 max-h-64 overflow-auto">
          <table className="w-full text-left tabular-nums">
            <thead className="sticky top-0 bg-surface">
              <tr>
                <th scope="col" className="py-1 pr-4 font-medium">Round</th>
                {series.map((run) => (
                  <th key={run.algorithm} scope="col" className="py-1 pr-4 font-medium">{run.algorithm}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: ROUNDS }, (_, index) => (
                <tr key={index} className="border-t border-line">
                  <td className="py-1 pr-4">{index + 1}</td>
                  {series.map((run) => (
                    <td key={run.algorithm} className="py-1 pr-4">{formatPercent(run.accuracyByRound[index] ?? 0)}</td>
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
