"use client";

import { useState } from "react";
import { calibration000, gateById, meanDistribution, outputOf, perRun, psi, superpositionExperiments, type GateId, type RunSet } from "@/content/data/quantum";
import { envColor, envLabel, pct, Segmented } from "./controls";

const choices: { id: GateId; label: string }[] = [
  { id: "cswap", label: "CSWAP" },
  { id: "peres", label: "Peres" },
  { id: "ccnot", label: "CCNOT" },
];

function StateSketch({ gateId }: { gateId: GateId }) {
  const gate = gateById(gateId);
  const target = outputOf(gate, "100");
  const action = gateId === "cswap" ? "q0 = 1, swap q1 and q2" : gateId === "peres" ? "q0 = 1, q1 ← q0 ⊕ q1" : "q0 = 1, but q1 = 0: no flip";
  const W = 640;
  const barMax = 210;
  return (
    <svg viewBox={`0 0 ${W} 210`} className="h-auto w-full min-w-[32rem]" role="img" aria-label={`q0 starts in |ψ⟩ = 0.577|0⟩ + 0.816|1⟩. With probability 1/3 it is 0 and the ${gate.name} does nothing, giving 000; with probability 2/3 it is 1 and the gate acts on 100, giving ${target}.`}>
      <text x="0" y="18" fontSize="13" fill="var(--muted)">Prepared state of q0</text>
      <text x="0" y="46" fontSize="17" fill="var(--ink)">|ψ⟩ = 0.577 |0⟩ + 0.816 |1⟩</text>
      {[
        { label: "|0⟩", amp: psi.alpha, p: psi.alphaSquared, y: 78 },
        { label: "|1⟩", amp: psi.beta, p: psi.betaSquared, y: 128 },
      ].map((row) => (
        <g key={row.label}>
          <text x="0" y={row.y + 15} fontSize="14" fill="var(--ink)">{row.label}</text>
          <rect x="34" y={row.y} width={barMax} height="22" rx="6" fill="var(--surface-2)" />
          <rect x="34" y={row.y} width={barMax * row.p} height="22" rx="6" fill="var(--series-5)" className="transition-all duration-500" />
          <text x={42 + barMax} y={row.y + 15} fontSize="12" fill="var(--ink-2)">{`|amp|² = ${row.label === "|0⟩" ? "1/3" : "2/3"}`}</text>
        </g>
      ))}
      <text x="0" y="190" fontSize="12" fill="var(--muted)">{`α = √(1/3) = ${psi.alpha.toFixed(3)},  β = √(2/3) = ${psi.beta.toFixed(3)}`}</text>

      <g transform="translate(330 0)">
        <text x="0" y="18" fontSize="13" fill="var(--muted)">{`Through the ${gate.name}, with q1 = q2 = 0`}</text>
        <circle cx="20" cy="105" r="16" fill="color-mix(in srgb, var(--series-5) 22%, var(--surface))" stroke="var(--series-5)" strokeWidth="1.5" />
        <text x="20" y="110" textAnchor="middle" fontSize="13" fill="var(--ink)">ψ</text>
        <path d="M36 98 C80 70, 100 62, 140 62" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
        <path d="M36 112 C80 140, 100 148, 140 148" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
        <text x="62" y="62" fontSize="12" fill="var(--ink-2)">1/3</text>
        <text x="62" y="160" fontSize="12" fill="var(--ink-2)">2/3</text>
        <rect x="140" y="40" width="168" height="44" rx="10" fill="var(--surface-2)" />
        <text x="152" y="57" fontSize="12" fill="var(--ink-2)">q0 = 0, no action</text>
        <text x="152" y="75" fontSize="14" fontFamily="var(--font-mono, monospace)" fontWeight="600" fill="var(--ink)">000</text>
        <rect x="140" y="126" width="168" height="50" rx="10" fill="var(--primary-soft)" />
        <text x="152" y="143" fontSize="12" fill="var(--ink-2)">{action}</text>
        <text x="152" y="165" fontSize="14" fontFamily="var(--font-mono, monospace)" fontWeight="600" fill="var(--primary)">{`100 → ${target}`}</text>
      </g>
    </svg>
  );
}

function RunStrip({ gateId }: { gateId: GateId }) {
  const experiment = superpositionExperiments.find((item) => item.gate === gateId)!;
  const gate = gateById(gateId);
  const target = parseInt(outputOf(gate, "100"), 2);
  const batch = experiment.batches[0]!;
  const columns: { env: "simulator" | "hardware" | "mitigated"; set: RunSet }[] = [
    { env: "simulator", set: experiment.simulator },
    { env: "hardware", set: batch.raw },
    ...(batch.mitigated ? [{ env: "mitigated" as const, set: batch.mitigated }] : []),
  ];
  const W = 640;
  const H = 230;
  const left = 44;
  const colW = (W - left) / columns.length;
  const y = (value: number) => 14 + (1 - value) * H;
  const summary = columns
    .map(({ env, set }) => {
      const p = meanDistribution(set);
      return `${envLabel[env]}: 000 ${pct(p[0] ?? 0)}, ${outputOf(gate, "100")} ${pct(p[target] ?? 0)}`;
    })
    .join("; ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 52}`} className="h-auto w-full min-w-[32rem]" role="img" aria-label={`Per-run probability of 000 and ${outputOf(gate, "100")} against the ideal 1/3 and 2/3. Means: ${summary}.`}>
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <g key={tick}>
          <line x1={left} x2={W} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" />
          <text x={left - 6} y={y(tick) + 4} textAnchor="end" fontSize="11" fill="var(--muted)">{`${tick * 100}%`}</text>
        </g>
      ))}
      {[psi.alphaSquared, psi.betaSquared].map((value) => (
        <g key={value}>
          <line x1={left} x2={W} y1={y(value)} y2={y(value)} stroke="var(--ink-2)" strokeDasharray="5 4" />
          <text x={W - 4} y={y(value) - 5} textAnchor="end" fontSize="11" fill="var(--ink-2)">{value < 0.5 ? "ideal 1/3" : "ideal 2/3"}</text>
        </g>
      ))}
      {columns.map(({ env, set }, c) => {
        const cx = left + colW * c + colW / 2;
        const lows = perRun(set, 0);
        const highs = perRun(set, target);
        const spread = (index: number) => (set.runs.length > 1 ? ((index % 10) - 4.5) * 7 + (index >= 10 ? 3.5 : 0) : 0);
        return (
          <g key={env}>
            {[lows, highs].map((values, k) =>
              values.map((value, index) => (
                <circle key={`${k}-${index}`} cx={cx + (k ? 22 : -22) + spread(index)} cy={y(value)} r="4.5" fill={envColor[env]} fillOpacity={k ? 0.9 : 0.55} stroke="var(--surface)" strokeWidth="1">
                  <title>{`${envLabel[env]}, run ${index + 1}: ${k ? outputOf(gate, "100") : "000"} ${pct(value, 2)}`}</title>
                </circle>
              )),
            )}
            <text x={cx} y={H + 46} textAnchor="middle" fontSize="12.5" fill="var(--ink)">{envLabel[env]}</text>
            <text x={cx} y={H + 30} textAnchor="middle" fontSize="11" fill="var(--muted)">{`${set.backend}, ${set.runs.length === 1 ? "1 run" : `${set.runs.length} runs`}`}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** What the superposition experiment expects, and what each run measured, for the three gates it was run on. */
export function SuperpositionExplainer() {
  const [gateId, setGateId] = useState<GateId>("cswap");
  const gate = gateById(gateId);
  const misread = calibration000.shots - (calibration000.counts["000"] ?? 0);
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 sm:px-6">
        <div>
          <h3 className="text-2xl">From |ψ⟩ to a 1/3 : 2/3 histogram</h3>
          <p className="mt-0.5 text-sm text-ink-2">The superposition was prepared with qc.initialize on q0, not with a Hadamard gate.</p>
        </div>
        <Segmented label="Gate" options={choices} value={gateId} onChange={setGateId} />
      </div>
      <div className="space-y-5 p-4 sm:p-6">
        <div className="relative overflow-x-auto">
          <StateSketch gateId={gateId} />
        </div>
        <div>
          <h4 className="text-lg text-ink">Every saved run, {gate.name}</h4>
          <p className="mt-0.5 text-sm text-ink-2">
            Pale dots are P(000), solid dots P({outputOf(gate, "100")}). Hardware columns use the 1,024-shot batch that was run with mitigation, so the raw and mitigated dots come from the same jobs.
          </p>
          <div className="relative mt-3 overflow-x-auto">
            <RunStrip gateId={gateId} />
          </div>
        </div>
        <p className="rounded-xl bg-surface-2 p-3 text-sm text-ink-2">
          Why mitigation helps: in the calibration run on {calibration000.backend}, preparing 000 and measuring it straight away returned 000 in {calibration000.counts["000"]} of {calibration000.shots.toLocaleString("en-GB")} shots, so readout alone misreported {misread} shots ({pct(misread / calibration000.shots)}). The measurement filter inverts that calibration matrix; it does not correct errors made by the gates themselves.
        </p>
      </div>
    </div>
  );
}
