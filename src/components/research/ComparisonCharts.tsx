import { classLabels, classOrder, experimentRuns, type ExperimentRun } from "@/content/data/alzheimers";
import { formatPercent } from "@/lib/utils";

const backbones = [
  { id: "custom-cnn", label: "Custom CNN" },
  { id: "mobilenetv2", label: "MobileNetV2" },
  { id: "efficientnetb0", label: "EfficientNetB0" },
];
const algorithms = [
  { id: "FedAvg", color: "var(--series-1)" },
  { id: "FedProx", color: "var(--series-2)" },
  { id: "FedDyn", color: "var(--series-3)" },
];
const runOf = (backbone: string, algorithm: string) => experimentRuns.find((run) => run.backbone === backbone && run.algorithm === algorithm) as ExperimentRun;

/** Podium of the three best configurations by macro F1. */
export function Podium() {
  const top = [...experimentRuns].sort((a, b) => b.macroF1 - a.macroF1).slice(0, 3);
  const order = [top[1], top[0], top[2]];
  const heights = [118, 160, 92];
  const medal = ["#f5b82e", "#c3cbe0", "#d98a4e"];
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-xl">Top three by macro F1</h3>
      <div className="mt-6 flex items-end justify-center gap-2 sm:gap-4">
        {order.map((run, index) => {
          if (!run) return null;
          const place = index === 1 ? 1 : index === 0 ? 2 : 3;
          return (
            <div key={run.experiment} className="flex w-1/3 max-w-[11rem] flex-col items-center text-center">
              <span className="podium-medal grid size-11 place-items-center rounded-full text-lg font-semibold text-[#161b33] shadow-md" style={{ background: medal[place - 1], animationDelay: `${index * 0.3}s` }}>
                {place}
              </span>
              <p className="mt-2 text-sm leading-tight font-medium">{run.backboneLabel}</p>
              <p className="text-xs text-muted">{run.algorithm}</p>
              <div
                className="podium-step mt-2 flex w-full items-start justify-center rounded-t-xl pt-3 text-lg font-semibold text-[#161b33] tabular-nums"
                style={{ height: heights[index], background: `linear-gradient(180deg, ${medal[place - 1]}, color-mix(in srgb, ${medal[place - 1]} 45%, #ffffff))` }}
              >
                {formatPercent(run.macroF1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Macro F1 for every configuration, grouped by backbone. */
export function GroupedF1() {
  const W = 620;
  const H = 230;
  const groupW = (W - 50) / 3;
  const y = (value: number) => 12 + ((1 - value) / 0.3) * H;
  return (
    <figure className="card p-4 sm:p-6">
      <h3 className="text-xl">Macro F1, backbone by algorithm</h3>
      <svg viewBox={`0 0 ${W} ${H + 50}`} className="mt-4 h-auto w-full" role="img" aria-label="Grouped bar chart of macro F1 for the nine configurations">
        {[0.7, 0.8, 0.9, 1].map((tick) => (
          <g key={tick}>
            <line x1="40" x2={W} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" />
            <text x="34" y={y(tick) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{Math.round(tick * 100)}%</text>
          </g>
        ))}
        {backbones.map((backbone, group) => (
          <g key={backbone.id} transform={`translate(${50 + group * groupW} 0)`}>
            {algorithms.map((algorithm, index) => {
              const value = runOf(backbone.id, algorithm.id).macroF1;
              const top = y(value);
              const x = 14 + index * ((groupW - 28) / 3);
              const w = (groupW - 28) / 3 - 8;
              return (
                <g key={algorithm.id}>
                  <rect x={x} y={top} width={w} height={y(0.7) - top} rx="6" fill={algorithm.color} className="bar-grow" style={{ animationDelay: `${(group * 3 + index) * 0.08}s` }}>
                    <title>{`${backbone.label} with ${algorithm.id}: ${formatPercent(value)}`}</title>
                  </rect>
                  <text x={x + w / 2} y={top - 6} textAnchor="middle" fontSize="11" fill="var(--ink-2)" className="tabular-nums">{(value * 100).toFixed(1)}</text>
                </g>
              );
            })}
            <text x={groupW / 2 - 4} y={H + 34} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--ink)">{backbone.label}</text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-muted">
        {algorithms.map((algorithm) => (
          <span key={algorithm.id} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: algorithm.color }} aria-hidden />
            {algorithm.id}
          </span>
        ))}
        <span>Axis starts at 70%.</span>
      </figcaption>
    </figure>
  );
}

/** Per-class F1 for all nine runs. The weakest column is Very mild in every row. */
export function ClassHeatmap() {
  const values = experimentRuns.flatMap((run) => classOrder.map((name) => run.perClass[name].f1));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const tone = (value: number) => {
    const t = (value - min) / (max - min);
    return `color-mix(in srgb, color-mix(in srgb, var(--series-3) ${Math.round(t * 100)}%, var(--series-2)) 42%, var(--surface))`;
  };
  const rows = backbones.flatMap((backbone) => algorithms.map((algorithm) => runOf(backbone.id, algorithm.id)));
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-xl">Per-class F1 in all nine runs</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[30rem] border-separate border-spacing-1 text-sm tabular-nums">
          <caption className="sr-only">Per-class F1 score for each configuration</caption>
          <thead>
            <tr>
              <th scope="col" className="text-left font-normal text-muted">Configuration</th>
              {classOrder.map((name) => (
                <th key={name} scope="col" className="pb-1 font-medium">{classLabels[name]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((run) => (
              <tr key={run.experiment}>
                <th scope="row" className="pr-2 text-left font-normal whitespace-nowrap">
                  {run.backboneLabel} <span className="text-muted">{run.algorithm}</span>
                </th>
                {classOrder.map((name) => {
                  const value = run.perClass[name].f1;
                  return (
                    <td key={name} className="h-10 rounded-md text-center font-medium text-ink" style={{ background: tone(value) }}>
                      {(value * 100).toFixed(1)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">Green is higher, orange lower. Very mild is the weakest class in every row, Moderate the strongest.</p>
    </div>
  );
}
