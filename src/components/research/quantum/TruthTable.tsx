import { basisExperiments, basisSuccess, labels, outputOf, type GateInfo } from "@/content/data/quantum";
import { cn } from "@/lib/utils";
import { pct } from "./controls";

const inNames = ["A", "B", "C"];
const outNames = ["P", "Q", "R"];

/**
 * Truth table of a gate. Each input is a button that draws that input in the circuit; flipped output bits are
 * highlighted. Where the input was run on IBM hardware, the last columns give the share of shots on the expected output.
 */
export function TruthTable({ gate, selected, onSelect }: { gate: GateInfo; selected: string; onSelect: (input: string) => void }) {
  const n = gate.qubits;
  const success = basisExperiments.filter((experiment) => experiment.gate === gate.id).map((experiment) => ({ experiment, rows: basisSuccess(experiment) }));

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[20rem] text-sm tabular-nums">
        <caption className="sr-only">
          {`Truth table of the ${gate.name} gate${success.length ? ", with the measured share of shots on the expected output" : ""}. Select an input to draw it in the circuit.`}
        </caption>
        <thead>
          <tr className="border-b border-line-strong text-left text-ink">
            <th scope="col" className="py-2 pr-3 font-medium">
              Input <span className="font-mono font-normal text-muted">{inNames.slice(0, n).join("")}</span>
            </th>
            <th scope="col" className="py-2 pr-3 font-medium">
              Output <span className="font-mono font-normal text-muted">{outNames.slice(0, n).join("")}</span>
            </th>
            {success.map(({ experiment, rows }) => (
              <th key={experiment.id} scope="col" className="py-2 pr-2 text-right font-medium">
                {experiment.backend}
                <span className="block text-xs font-normal text-muted">{rows[0]?.runs === 1 ? "1 run" : `mean of ${rows[0]?.runs ?? 0} runs`}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels(n).map((input, row) => {
            const output = outputOf(gate, input);
            const on = input === selected;
            return (
              <tr key={input} className={cn("border-b border-line transition-colors", on && "bg-primary-soft")}>
                <th scope="row" className="py-1 pr-3 text-left font-normal">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`Draw input ${input}`}
                    onClick={() => onSelect(input)}
                    className={cn(
                      "inline-flex min-h-8 items-center rounded-lg border px-2.5 font-mono tracking-[0.3em] transition-colors",
                      on ? "border-primary bg-surface font-semibold text-primary" : "border-line text-ink hover:border-primary",
                    )}
                  >
                    {input}
                  </button>
                </th>
                <td className="py-1 pr-3">
                  <span className="inline-flex gap-0.5 font-mono">
                    {[...output].map((bit, q) => {
                      const changed = bit !== input[q];
                      return (
                        <span key={q} className={cn("inline-grid size-7 place-items-center rounded-md", changed ? "bg-accent-soft font-semibold text-accent" : "text-ink")}>
                          {bit}
                          {changed && <span className="sr-only"> flipped</span>}
                        </span>
                      );
                    })}
                  </span>
                </td>
                {success.map(({ experiment, rows }) => (
                  <td key={experiment.id} className="py-1 pr-2 text-right text-ink-2">{pct(rows[row]?.mean ?? 0)}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
