import { experimentRuns } from "@/content/data/alzheimers";
import { formatPercent } from "@/lib/utils";

const TARGET = 0.9;

function roundsToTarget(accuracy: number[]): number | null {
  const index = accuracy.findIndex((value) => value >= TARGET);
  return index === -1 ? null : index + 1;
}

export function ComparisonTable() {
  const rows = [...experimentRuns].sort((a, b) => b.accuracy - a.accuracy);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[38rem] text-left text-[0.95rem] tabular-nums">
        <caption className="sr-only">All nine federated configurations, ordered by test accuracy.</caption>
        <thead>
          <tr className="border-b border-line-strong text-ink">
            <th scope="col" className="py-2 pr-3 font-medium">Configuration</th>
            <th scope="col" className="py-2 pr-3 font-medium">Accuracy</th>
            <th scope="col" className="py-2 pr-3 font-medium">Macro F1</th>
            <th scope="col" className="py-2 pr-3 font-medium">Macro AUC</th>
            <th scope="col" className="py-2 pr-3 font-medium">Test loss</th>
            <th scope="col" className="py-2 font-medium">Rounds to 90%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((run) => (
            <tr key={run.experiment} className="border-b border-line">
              <th scope="row" className="py-2 pr-3 font-normal whitespace-nowrap">{run.backboneLabel} + {run.algorithm}</th>
              <td className="py-2 pr-3">{formatPercent(run.accuracy)}</td>
              <td className="py-2 pr-3">{formatPercent(run.macroF1)}</td>
              <td className="py-2 pr-3">{run.macroAuc === null ? "Not logged" : formatPercent(run.macroAuc)}</td>
              <td className="py-2 pr-3">{run.finalLoss.toFixed(4)}</td>
              <td className="py-2">{roundsToTarget(run.accuracyByRound) ?? "Not reached"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
