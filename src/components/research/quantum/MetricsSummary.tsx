import {
  basisExperiments,
  basisSuccess,
  expectedProbability,
  gateById,
  idealPsi,
  meanDistribution,
  psiExpected,
  superpositionExperiments,
  tvd,
} from "@/content/data/quantum";
import { envColor, pct } from "./controls";

/**
 * Heatmap of the basis-state runs: each cell is the mean share of shots that landed on the truth-table output,
 * P_exp = (1/R) Σ_r v_r(expected) / shots. Low cells lean orange, high cells green.
 */
export function BasisHeatmap() {
  const rows = basisExperiments.map((experiment) => ({ experiment, gate: gateById(experiment.gate), cells: basisSuccess(experiment) }));
  const values = rows.flatMap((row) => row.cells.map((cell) => cell.mean));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const tone = (value: number) => {
    const t = (value - min) / (max - min || 1);
    return `color-mix(in srgb, color-mix(in srgb, var(--series-3) ${Math.round(t * 100)}%, var(--series-2)) 40%, var(--surface))`;
  };
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-xl">Truth-table fidelity on hardware</h3>
      <p className="mt-1 text-[0.95rem] text-ink-2">Share of shots on the expected output for every basis input. Each cell shows the input (q0 q1 q2) and, below it, the measured share in percent.</p>
      <div className="relative mt-4 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-separate border-spacing-1 text-sm tabular-nums">
          <caption className="sr-only">Mean share of shots on the expected output, per gate, backend and input</caption>
          <thead>
            <tr>
              <th scope="col" className="text-left font-normal text-muted">Gate and backend</th>
              {Array.from({ length: 8 }, (_, index) => (
                <th key={index} scope="col" className="pb-1 text-xs font-normal text-muted">
                  <span className="sr-only">Input </span>
                  {index + 1}
                </th>
              ))}
              <th scope="col" className="pb-1 font-medium">Mean</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ experiment, gate, cells }) => (
              <tr key={experiment.id}>
                <th scope="row" className="pr-2 text-left font-normal whitespace-nowrap">
                  {gate.name} <span className="text-muted">{experiment.backend}</span>
                  <span className="block text-xs text-muted">{cells[0]?.runs === 1 ? "1 run per input" : `${cells[0]?.runs} runs per input`}</span>
                </th>
                {Array.from({ length: 8 }, (_, index) => {
                  const cell = cells[index];
                  if (!cell) return <td key={index} aria-hidden />;
                  return (
                    <td key={index} className="h-12 min-w-12 rounded-md text-center text-ink" style={{ background: tone(cell.mean) }} title={`Input ${cell.input}, expected ${cell.output}`}>
                      <span className="block font-mono text-xs text-ink-2">{cell.input}</span>
                      <span className="font-medium">{(cell.mean * 100).toFixed(1)}</span>
                    </td>
                  );
                })}
                <td className="pl-1 text-center font-medium whitespace-nowrap">{pct(cells.reduce((sum, cell) => sum + cell.mean, 0) / cells.length)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">
        Values are percentages. CNOT has four inputs, so its row stops at column 4. The simulator put every shot on the expected output for every input it ran, so it is not shown.
      </p>
    </div>
  );
}

function Bar({ value, color, max = 1 }: { value: number; color: string; max?: number }) {
  return (
    <span className="mt-1 block h-1.5 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden>
      <span className="block h-full rounded-full" style={{ width: `${Math.min(value / max, 1) * 100}%`, background: color }} />
    </span>
  );
}

/**
 * Superposition runs, raw against mitigated. P_exp = p̄(000) + p̄(gate(100)); TVD = ½ Σ |p̄(o) − ideal(o)| with the
 * ideal 1/3, 2/3 split. Both use the mean distribution over all runs of a batch.
 */
export function SuperpositionSummary() {
  const rows = superpositionExperiments.flatMap((experiment) => {
    const gate = gateById(experiment.gate);
    const ideal = idealPsi(gate);
    const expected = psiExpected(gate);
    return experiment.batches.map((batch) => {
      const raw = meanDistribution(batch.raw);
      const mitigated = batch.mitigated ? meanDistribution(batch.mitigated) : null;
      return {
        key: `${gate.id}-${batch.id}`,
        gate: gate.name,
        batch: `${batch.raw.backend}, ${batch.label}`,
        runs: batch.raw.runs.length,
        rawP: expectedProbability(raw, expected),
        mitP: mitigated ? expectedProbability(mitigated, expected) : null,
        rawTvd: tvd(raw, ideal),
        mitTvd: mitigated ? tvd(mitigated, ideal) : null,
      };
    });
  });
  const maxTvd = Math.max(...rows.map((row) => row.rawTvd));
  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-xl">Superposition input: raw against mitigated</h3>
      <p className="mt-1 text-[0.95rem] text-ink-2">
        Probability on the two expected outcomes and distance from the ideal 1/3 : 2/3 distribution, for every hardware batch.
      </p>
      <div className="relative mt-4 overflow-x-auto">
        <table className="w-full min-w-[38rem] text-sm tabular-nums">
          <caption className="sr-only">Expected-outcome probability and total variation distance from ideal, raw and mitigated, for each superposition batch</caption>
          <thead>
            <tr className="border-b border-line-strong text-left text-ink">
              <th scope="col" className="py-2 pr-3 font-medium">Gate</th>
              <th scope="col" className="py-2 pr-3 font-medium">Batch</th>
              <th scope="col" className="py-2 pr-3 font-medium">P on expected, raw</th>
              <th scope="col" className="py-2 pr-3 font-medium">mitigated</th>
              <th scope="col" className="py-2 pr-3 font-medium">TVD, raw</th>
              <th scope="col" className="py-2 font-medium">mitigated</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-line align-top">
                <th scope="row" className="py-2 pr-3 text-left font-medium">{row.gate}</th>
                <td className="py-2 pr-3 text-ink-2">
                  {row.batch}
                  <span className="block text-xs text-muted">{row.runs === 1 ? "1 run" : `${row.runs} runs`}</span>
                </td>
                <td className="py-2 pr-3">
                  {pct(row.rawP)}
                  <Bar value={row.rawP} color={envColor.hardware} />
                </td>
                <td className="py-2 pr-3">
                  {row.mitP === null ? <span className="text-muted">not run</span> : pct(row.mitP)}
                  {row.mitP !== null && <Bar value={row.mitP} color={envColor.mitigated} />}
                </td>
                <td className="py-2 pr-3">
                  {row.rawTvd.toFixed(3)}
                  <Bar value={row.rawTvd} max={maxTvd} color={envColor.hardware} />
                </td>
                <td className="py-2">
                  {row.mitTvd === null ? <span className="text-muted">not run</span> : row.mitTvd.toFixed(3)}
                  {row.mitTvd !== null && <Bar value={row.mitTvd} max={maxTvd} color={envColor.mitigated} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-muted">Lower TVD is better. The CCNOT row is a single run on ibmq_quito; its mitigated values are the quasi-probabilities printed on the notebook figure, to three decimals.</p>
    </div>
  );
}
