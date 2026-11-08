import { outputOf, toBits, type CircuitOp, type GateInfo } from "@/content/data/quantum";

const WIRE_GAP = 58;
const TOP = 34;

function describeOp(op: CircuitOp) {
  return op.kind === "control-x"
    ? `${op.controls.length === 2 ? "Toffoli" : "CNOT"}: flip q${op.target} when ${op.controls.map((c) => `q${c}`).join(" and ")} ${op.controls.length === 2 ? "are" : "is"} 1`
    : `Controlled swap: exchange q${op.targets[0]} and q${op.targets[1]} when q${op.control} is 1`;
}

/**
 * The circuits as built in the notebooks: input preparation (X gates, or the |ψ⟩ initialiser on q0), a barrier, the
 * gate, a barrier and a measurement of every qubit into the classical register. Drawn from the gate data, not an image.
 */
export function CircuitDiagram({ gate, input }: { gate: GateInfo; input: string | "psi" }) {
  const n = gate.qubits;
  const y = (q: number) => TOP + q * WIRE_GAP;
  const cY = y(n - 1) + 50;
  const psi = input === "psi";
  const bits = psi ? new Array(n).fill(0) : toBits(input);
  const output = psi ? null : toBits(outputOf(gate, input));

  const prepX = 98;
  const barrier1 = 150;
  const opX = (index: number) => 200 + index * 66;
  const barrier2 = opX(gate.ops.length - 1) + 52;
  const measureX = (q: number) => barrier2 + 48 + q * 46;
  const end = measureX(n - 1) + 40;
  const W = end + (psi ? 24 : 70);
  const H = cY + 26;

  const prepared = psi ? "|ψ⟩ on q0" : bits.some(Boolean) ? `X on ${bits.flatMap((bit, q) => (bit ? [`q${q}`] : [])).join(", ")}` : "no X gates";
  const label = `${gate.name} circuit for ${psi ? "the superposition input" : `input ${input}`}: ${prepared}, then ${gate.ops.map(describeOp).join(", then ")}, then every qubit is measured.${output ? ` Ideal output ${output.join("")}.` : ""}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[30rem]" role="img" aria-label={label}>
      {/* quantum wires */}
      {Array.from({ length: n }, (_, q) => (
        <g key={`wire-${q}`}>
          <text x="10" y={y(q) + 5} fontSize="15" fontStyle="italic" fill="var(--ink)">
            q<tspan fontSize="11" dy="4">{q}</tspan>
          </text>
          <line x1="44" x2={end} y1={y(q)} y2={y(q)} stroke="var(--ink-2)" strokeWidth="1.5" />
        </g>
      ))}
      {/* classical register */}
      <text x="12" y={cY + 5} fontSize="15" fill="var(--ink)">c</text>
      <line x1="44" x2={end} y1={cY - 2} y2={cY - 2} stroke="var(--muted)" strokeWidth="1.2" />
      <line x1="44" x2={end} y1={cY + 2} y2={cY + 2} stroke="var(--muted)" strokeWidth="1.2" />
      <line x1="56" x2="66" y1={cY + 8} y2={cY - 8} stroke="var(--muted)" strokeWidth="1.2" />
      <text x="70" y={cY - 8} fontSize="10" fill="var(--muted)">{n}</text>

      {/* preparation */}
      <g key={`prep-${input}`} className="fade-in">
        {psi ? (
          <g>
            <title>qc.initialize([√(1/3), √(2/3)], 0)</title>
            <rect x={prepX - 30} y={y(0) - 17} width="60" height="34" rx="6" fill="color-mix(in srgb, var(--series-5) 22%, var(--surface))" stroke="var(--series-5)" strokeWidth="1.5" />
            <text x={prepX} y={y(0) + 5} textAnchor="middle" fontSize="15" fill="var(--ink)">|ψ⟩</text>
          </g>
        ) : (
          bits.map((bit, q) =>
            bit ? (
              <g key={`x-${q}`}>
                <title>{`X gate: prepares q${q} = 1`}</title>
                <rect x={prepX - 16} y={y(q) - 16} width="32" height="32" rx="5" fill="var(--primary-soft)" stroke="var(--primary)" strokeWidth="1.5" />
                <text x={prepX} y={y(q) + 5} textAnchor="middle" fontSize="15" fontWeight="600" fill="var(--primary)">X</text>
              </g>
            ) : null,
          )
        )}
      </g>

      {/* barriers */}
      {[barrier1, barrier2].map((x) => (
        <g key={`barrier-${x}`} aria-hidden>
          <rect x={x - 7} y={y(0) - 22} width="14" height={y(n - 1) - y(0) + 44} fill="var(--surface-2)" />
          <line x1={x} x2={x} y1={y(0) - 22} y2={y(n - 1) + 22} stroke="var(--muted)" strokeDasharray="4 3" />
        </g>
      ))}

      {/* gate operations */}
      {gate.ops.map((op, index) => {
        const x = opX(index);
        if (op.kind === "control-x") {
          const span = [...op.controls, op.target];
          return (
            <g key={`op-${index}`}>
              <title>{describeOp(op)}</title>
              <line x1={x} x2={x} y1={y(Math.min(...span))} y2={y(Math.max(...span))} stroke="var(--primary)" strokeWidth="2" />
              {op.controls.map((c) => (
                <circle key={c} cx={x} cy={y(c)} r="6" fill="var(--primary)" />
              ))}
              <circle cx={x} cy={y(op.target)} r="14" fill="var(--surface)" stroke="var(--primary)" strokeWidth="2" />
              <line x1={x - 14} x2={x + 14} y1={y(op.target)} y2={y(op.target)} stroke="var(--primary)" strokeWidth="2" />
              <line x1={x} x2={x} y1={y(op.target) - 14} y2={y(op.target) + 14} stroke="var(--primary)" strokeWidth="2" />
            </g>
          );
        }
        return (
          <g key={`op-${index}`}>
            <title>{describeOp(op)}</title>
            <line x1={x} x2={x} y1={y(op.control)} y2={y(Math.max(...op.targets))} stroke="var(--primary)" strokeWidth="2" />
            <circle cx={x} cy={y(op.control)} r="6" fill="var(--primary)" />
            {op.targets.map((t) => (
              <g key={t} stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round">
                <line x1={x - 8} x2={x + 8} y1={y(t) - 8} y2={y(t) + 8} />
                <line x1={x - 8} x2={x + 8} y1={y(t) + 8} y2={y(t) - 8} />
              </g>
            ))}
          </g>
        );
      })}

      {/* measurements */}
      {Array.from({ length: n }, (_, q) => {
        const x = measureX(q);
        return (
          <g key={`m-${q}`}>
            <title>{`Measure q${q} into classical bit ${q}`}</title>
            <line x1={x - 2} x2={x - 2} y1={y(q) + 15} y2={cY - 9} stroke="var(--muted)" strokeWidth="1.2" />
            <line x1={x + 2} x2={x + 2} y1={y(q) + 15} y2={cY - 9} stroke="var(--muted)" strokeWidth="1.2" />
            <path d={`M${x - 6} ${cY - 10}L${x} ${cY - 2}L${x + 6} ${cY - 10}Z`} fill="var(--muted)" />
            <text x={x + 7} y={cY + 16} fontSize="10" fill="var(--muted)">{q}</text>
            <rect x={x - 16} y={y(q) - 16} width="32" height="32" rx="4" fill="var(--ink)" />
            <path d={`M${x - 10} ${y(q) + 7}A10 10 0 0 1 ${x + 10} ${y(q) + 7}`} fill="none" stroke="var(--surface)" strokeWidth="1.6" />
            <line x1={x} x2={x + 8} y1={y(q) + 7} y2={y(q) - 8} stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        );
      })}

      {/* ideal output per wire */}
      {output && (
        <g key={`out-${input}`} className="fade-in">
          {output.map((bit, q) => (
            <g key={`o-${q}`}>
              <rect x={end + 14} y={y(q) - 13} width="34" height="26" rx="13" fill={bit !== bits[q] ? "var(--accent-soft)" : "var(--surface-2)"} />
              <text x={end + 31} y={y(q) + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill={bit !== bits[q] ? "var(--accent)" : "var(--ink)"}>
                {bit}
              </text>
            </g>
          ))}
        </g>
      )}
    </svg>
  );
}
