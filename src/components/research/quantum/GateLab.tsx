"use client";

import { useState, type KeyboardEvent } from "react";
import { gates, outputOf, superpositionExperiments, type GateId } from "@/content/data/quantum";
import { cn } from "@/lib/utils";
import { CircuitDiagram } from "./CircuitDiagram";
import { TruthTable } from "./TruthTable";

/** Gate tabs; each panel pairs the circuit drawing with the gate's truth table. Picking a row redraws the circuit. */
export function GateLab() {
  const [gateId, setGateId] = useState<GateId>("cswap");
  const [inputs, setInputs] = useState<Record<GateId, string>>({ cnot: "10", ccnot: "110", cswap: "101", peres: "110" });
  const gate = gates.find((item) => item.id === gateId) ?? gates[0]!;
  const input = inputs[gate.id];
  const hasPsi = superpositionExperiments.some((experiment) => experiment.gate === gate.id);
  const choose = (value: string) => setInputs((current) => ({ ...current, [gate.id]: value }));

  const onKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = gates[(index + step + gates.length) % gates.length]!;
    setGateId(next.id);
    document.getElementById(`gate-tab-${next.id}`)?.focus();
  };

  return (
    <div className="card overflow-hidden">
      <div role="tablist" aria-label="Quantum gate" className="flex flex-wrap gap-2 border-b border-line p-3 sm:px-5">
        {gates.map((item, index) => {
          const on = item.id === gate.id;
          return (
            <button
              key={item.id}
              id={`gate-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="gate-panel"
              tabIndex={on ? 0 : -1}
              onKeyDown={(event) => onKey(event, index)}
              onClick={() => setGateId(item.id)}
              className={cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
                on ? "border-primary bg-primary-soft text-primary shadow-sm" : "border-line text-ink-2 hover:border-line-strong hover:text-ink",
              )}
            >
              {item.name}
              <span className="text-xs font-normal text-muted">{item.qubits} qubits</span>
            </button>
          );
        })}
      </div>

      <div id="gate-panel" role="tabpanel" aria-labelledby={`gate-tab-${gate.id}`} className="space-y-6 p-4 sm:p-6">
        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="text-2xl">
              {gate.name} <span className="text-base font-normal text-muted">{gate.aka}</span>
            </h3>
            <p className="mt-1 text-[0.95rem] text-ink-2">{gate.summary}</p>
          </div>
          <div className="relative overflow-x-auto rounded-xl border border-line bg-surface p-2">
            <CircuitDiagram gate={gate} input={input} />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {hasPsi && (
              <button
                type="button"
                aria-pressed={input === "psi"}
                onClick={() => choose("psi")}
                className={cn(
                  "inline-flex min-h-9 items-center rounded-full border px-3.5 transition-colors",
                  input === "psi" ? "font-semibold text-ink" :"border-line text-ink-2 hover:border-line-strong",
                )}
                style={input === "psi" ? { borderColor: "var(--series-5)", background: "color-mix(in srgb, var(--series-5) 14%, var(--surface))" } : undefined}
              >
                Superposition input |ψ⟩
              </button>
            )}
            <p className="text-ink-2" aria-live="polite">
              {input === "psi"
                ? `Ideal result: 000 with probability 1/3, ${outputOf(gate, "100")} with probability 2/3.`
                : `Input ${input} gives ${outputOf(gate, input)}. Highlighted output bits were flipped by the gate.`}
            </p>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <h4 className="eyebrow">Truth table</h4>
            <div className="mt-2">
              <TruthTable gate={gate} selected={input} onSelect={choose} />
            </div>
            <p className="mt-2 text-xs text-muted">Bits are written q0 q1 q2 from left to right; q0 is the control.</p>
          </div>
          <dl className="grid content-start gap-px overflow-hidden rounded-xl border border-line bg-line text-sm sm:grid-cols-2 xl:grid-cols-1">
            <div className="bg-surface p-3">
              <dt className="text-muted">Boolean form</dt>
              <dd className="mt-0.5 font-mono text-ink">{gate.expression}</dd>
            </div>
            <div className="bg-surface p-3">
              <dt className="text-muted">Qiskit, as in the notebooks</dt>
              <dd className="mt-0.5 font-mono whitespace-pre text-ink">{gate.qiskit}</dd>
            </div>
            <div className="bg-surface p-3 sm:col-span-2 xl:col-span-1">
              <dt className="text-muted">Measured in this project</dt>
              <dd className="mt-0.5 text-ink-2">{gate.studied}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
