"use client";

import { useState } from "react";
import {
  basisExperiments,
  expectedProbability,
  gateById,
  gates,
  idealBasis,
  idealPsi,
  labels,
  meanCounts,
  meanDistribution,
  outputOf,
  psiExpected,
  relativeDeviation,
  stdDev,
  superpositionExperiments,
  tvd,
  type Environment,
  type GateId,
  type RunSet,
} from "@/content/data/quantum";
import { envColor, envLabel, ket, Legend, pct, Segmented } from "./controls";

interface Series {
  env: Environment;
  p: number[];
  counts?: number[];
  set?: RunSet;
  note: string;
}

/** Share of shots on the expected outcomes in every run: P_exp,r = Σ_{o ∈ E} v_r(o) / T. */
const perRunExpected = (set: RunSet, expected: number[]) => set.runs.map((run) => expected.reduce((sum, o) => sum + (run[o] ?? 0), 0) / set.total);

function GroupedBars({ outcomes, series, expected, label }: { outcomes: string[]; series: Series[]; expected: number[]; label: string }) {
  const W = 660;
  const H = 220;
  const left = 46;
  const groupW = (W - left - 8) / outcomes.length;
  const barW = Math.min(22, (groupW - 14) / series.length);
  const y = (value: number) => 12 + (1 - Math.min(Math.max(value, 0), 1)) * H;
  return (
    <svg viewBox={`0 0 ${W} ${H + 44}`} className="h-auto w-full min-w-[34rem]" role="img" aria-label={label}>
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <g key={tick}>
          <line x1={left} x2={W - 4} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" />
          <text x={left - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{`${tick * 100}%`}</text>
        </g>
      ))}
      {outcomes.map((outcome, o) => {
        const x0 = left + o * groupW;
        const groupInner = barW * series.length;
        const isExpected = expected.includes(o);
        return (
          <g key={outcome}>
            {isExpected && <rect x={x0 + 2} y={8} width={groupW - 4} height={H + 6} rx="8" fill="var(--primary-soft)" opacity="0.55" />}
            {series.map((item, s) => {
              const value = item.p[o] ?? 0;
              const x = x0 + (groupW - groupInner) / 2 + s * barW;
              const top = y(value);
              const h = Math.max(y(0) - top, value > 0 ? 1.5 : 0);
              const tip = `${envLabel[item.env]}, outcome ${outcome}: ${pct(value, 2)}${item.counts ? ` (mean ${item.counts[o]?.toFixed(2)} ${item.set?.kind === "counts" ? "shots" : "quasi-counts"})` : ""}`;
              return item.env === "ideal" ? (
                <rect key={item.env} x={x + 1} y={y(0) - h} width={barW - 3} height={h} rx="3" fill="none" stroke={envColor.ideal} strokeWidth="1.5" strokeDasharray="3 2">
                  <title>{tip}</title>
                </rect>
              ) : (
                <rect key={item.env} x={x + 1} y={y(0) - h} width={barW - 3} height={h} rx="3" fill={envColor[item.env]} className="transition-all duration-500">
                  <title>{tip}</title>
                </rect>
              );
            })}
            <text x={x0 + groupW / 2} y={H + 32} textAnchor="middle" fontSize="13" fontFamily="var(--font-mono, monospace)" fontWeight={isExpected ? 700 : 400} fill={isExpected ? "var(--ink)" : "var(--ink-2)"}>
              {outcome}
            </text>
          </g>
        );
      })}
      <line x1={left} x2={W - 4} y1={y(0)} y2={y(0)} stroke="var(--line-strong)" />
    </svg>
  );
}

/**
 * Measured outcome distributions for every gate and input, simulator against IBM hardware (raw and, where it was run,
 * measurement-error mitigated). Probabilities are means over the saved runs.
 */
export function MeasurementExplorer() {
  const [gateId, setGateId] = useState<GateId>("peres");
  const [inputs, setInputs] = useState<Record<GateId, string>>({ cnot: "10", ccnot: "psi", cswap: "psi", peres: "psi" });
  const [backends, setBackends] = useState<Record<GateId, string>>({ cnot: "cnot-ibm_perth", ccnot: "", cswap: "cswap-ibm_lagos", peres: "peres-ibm_perth" });
  const [batchId, setBatchId] = useState("mitigated-1024");
  const [view, setView] = useState<"chart" | "table">("chart");

  const gate = gateById(gateId);
  const outcomes = labels(gate.qubits);
  const experiments = basisExperiments.filter((experiment) => experiment.gate === gate.id);
  const superposition = superpositionExperiments.find((experiment) => experiment.gate === gate.id);
  const inputOptions = [...(experiments.length ? outcomes.map((id) => ({ id, label: id })) : []), ...(superposition ? [{ id: "psi", label: "|ψ⟩" }] : [])];
  const input = inputOptions.some((option) => option.id === inputs[gate.id]) ? inputs[gate.id] : (inputOptions[0]?.id ?? "psi");
  const psi = input === "psi";

  let series: Series[] = [];
  let expected: number[] = [];
  let context = "";
  if (psi && superposition) {
    const batch = superposition.batches.find((item) => item.id === batchId) ?? superposition.batches[0]!;
    expected = psiExpected(gate);
    series = [
      { env: "ideal", p: idealPsi(gate), note: "|α|² = 1/3 on 000, |β|² = 2/3 on the gate's output for 100" },
      { env: "simulator", p: meanDistribution(superposition.simulator), counts: meanCounts(superposition.simulator), set: superposition.simulator, note: `${superposition.simulator.backend}, ${superposition.simulator.runs.length} × ${superposition.simulator.shots} shots` },
      { env: "hardware", p: meanDistribution(batch.raw), counts: meanCounts(batch.raw), set: batch.raw, note: `${batch.raw.backend}, ${batch.raw.runs.length} × ${batch.raw.shots} shots` },
      ...(batch.mitigated
        ? [{ env: "mitigated" as const, p: meanDistribution(batch.mitigated), counts: meanCounts(batch.mitigated), set: batch.mitigated, note: `Same runs after the measurement filter (${batch.mitigated.kind.replace("-", " ")})` }]
        : []),
    ];
    context = `${gate.name} with |ψ⟩ on q0. ${batch.raw.source}${superposition.simulator.source !== batch.raw.source ? `; simulator: ${superposition.simulator.source}` : ""}.`;
  } else {
    const experiment = experiments.find((item) => item.id === backends[gate.id]) ?? experiments[0]!;
    const set = experiment.perInput[input] as RunSet;
    const ideal = idealBasis(gate, input);
    expected = [parseInt(outputOf(gate, input), 2)];
    series = [
      { env: "ideal", p: ideal, note: `Truth table: ${input} → ${outputOf(gate, input)}` },
      ...(experiment.simulator
        ? [{ env: "simulator" as const, p: ideal, note: `qasm_simulator put all ${experiment.simulator.shots.toLocaleString("en-GB")} shots on ${outputOf(gate, input)} in each of ${experiment.simulator.runs} saved run${experiment.simulator.runs > 1 ? "s" : ""}` }]
        : []),
      { env: "hardware", p: meanDistribution(set), counts: meanCounts(set), set, note: `${experiment.backend}, ${set.runs.length} × ${set.shots} shots` },
    ];
    context = `${gate.name}, input ${input}, expected ${outputOf(gate, input)}. ${experiment.source}${experiment.simulator ? `; simulator: ${experiment.simulator.source}` : ""}.`;
  }
  const ideal = series[0]!.p;
  const simulator = series.find((item) => item.env === "simulator");
  const measured = series.filter((item) => item.env !== "ideal");
  const chartLabel = `Grouped bar chart of outcome probabilities for ${gate.name}, ${psi ? "superposition input" : `input ${input}`}: ${measured
    .map((item) => `${envLabel[item.env]} ${pct(expectedProbability(item.p, expected))} on the expected outcome${expected.length > 1 ? "s" : ""}`)
    .join("; ")}.`;

  return (
    <div className="card overflow-hidden">
      <div className="space-y-3 border-b border-line p-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <Segmented label="Gate" options={gates.map((item) => ({ id: item.id, label: item.name }))} value={gate.id} onChange={setGateId} />
          <Segmented
            label="View"
            className="ml-auto"
            options={[
              { id: "chart", label: "Chart" },
              { id: "table", label: "Table" },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted">Input</span>
          <Segmented label="Input state" options={inputOptions} value={input} onChange={(value) => setInputs((current) => ({ ...current, [gate.id]: value }))} />
        </div>
        {!psi && experiments.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Backend</span>
            <Segmented
              label="IBM backend"
              options={experiments.map((item) => ({ id: item.id, label: `${item.backend} · ${(item.perInput[input]?.runs.length ?? 0) === 1 ? "1 run" : "20 runs"}` }))}
              value={experiments.some((item) => item.id === backends[gate.id]) ? backends[gate.id] : experiments[0]!.id}
              onChange={(value) => setBackends((current) => ({ ...current, [gate.id]: value }))}
            />
          </div>
        )}
        {psi && superposition && superposition.batches.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted">Hardware batch</span>
            <Segmented label="Hardware batch" options={superposition.batches.map((item) => ({ id: item.id, label: item.label }))} value={superposition.batches.some((item) => item.id === batchId) ? batchId : superposition.batches[0]!.id} onChange={setBatchId} />
          </div>
        )}
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        <p className="text-sm text-ink-2">{context}</p>
        {view === "chart" ? (
          <>
            <div className="relative overflow-x-auto">
              <GroupedBars outcomes={outcomes} series={series} expected={expected} label={chartLabel} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Legend items={series.map((item) => item.env)} />
              <p className="text-xs text-muted">Shaded columns are the expected outcome{expected.length > 1 ? "s" : ""}. Hover a bar for its value.</p>
            </div>
          </>
        ) : (
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[30rem] text-sm tabular-nums">
              <caption className="sr-only">{`Mean probability and mean shots per outcome for ${gate.name}, ${psi ? "superposition input" : `input ${input}`}`}</caption>
              <thead>
                <tr className="border-b border-line-strong text-left text-ink">
                  <th scope="col" className="py-2 pr-3 font-medium">Outcome</th>
                  {series.map((item) => (
                    <th key={item.env} scope="col" className="py-2 pr-3 text-right font-medium">{envLabel[item.env]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {outcomes.map((outcome, o) => (
                  <tr key={outcome} className={expected.includes(o) ? "border-b border-line bg-primary-soft" : "border-b border-line"}>
                    <th scope="row" className="py-1.5 pr-3 text-left font-mono font-normal">{ket(outcome)}</th>
                    {series.map((item) => (
                      <td key={item.env} className="py-1.5 pr-3 text-right">
                        {pct(item.p[o] ?? 0, 2)}
                        {item.counts && <span className="block text-xs text-muted">{item.counts[o]?.toFixed(2)} {item.set?.kind === "counts" ? "shots" : "quasi-counts"}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <dl className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
          {measured.map((item) => {
            const pExp = expectedProbability(item.p, expected);
            const runs = item.set ? perRunExpected(item.set, expected) : [];
            return (
              <div key={item.env} className="bg-surface p-3" style={{ boxShadow: `inset 0 3px 0 ${envColor[item.env]}` }}>
                <dt className="text-sm text-muted">{envLabel[item.env]}</dt>
                <dd className="mt-1 space-y-0.5 text-sm text-ink-2">
                  <p>
                    <span className="text-xl font-medium text-ink tabular-nums">{pct(pExp)}</span> on the expected outcome{expected.length > 1 ? "s" : ""}
                    {runs.length > 1 && stdDev(runs) > 0 && <span className="text-muted tabular-nums"> (± {pct(stdDev(runs))} across runs)</span>}
                  </p>
                  <p className="tabular-nums">TVD from ideal {tvd(item.p, ideal).toFixed(3)}</p>
                  {psi && simulator && item.env !== "simulator" && (
                    <p className="tabular-nums">
                      Deviation from simulator: {expected.map((o) => `${outcomes[o]} ${pct(relativeDeviation(simulator.p[o] ?? 0, item.p[o] ?? 0))}`).join(", ")}
                    </p>
                  )}
                  <p className="text-xs text-muted">{item.note}</p>
                </dd>
              </div>
            );
          })}
        </dl>
        <p className="text-xs text-muted">
          TVD is the total variation distance, ½ Σ |p(o) − q(o)| over all outcomes: 0 means the distribution matches the ideal one exactly. Deviation from simulator is |p_sim − p| / p_sim per outcome, the
          &ldquo;error rate&rdquo; used in the report, recomputed from the saved simulator runs. Mitigated values are quasi-counts returned by the measurement filter, not new shots.
        </p>
      </div>
    </div>
  );
}
