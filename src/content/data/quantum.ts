import figureManifest from "./quantum-figures.json";
import results from "./quantum-results.json";

// Data for the B.Tech dissertation "Quantum gate performance assessment in the presence of superposition state using
// IBMQ server". Measured counts come from quantum-results.json, extracted from the owner's results workbook by
// private/scripts/extract_btech_results.mjs and checked against the histograms saved in the six notebooks (ten
// transcription slips in the workbook are corrected there from the notebook figures). The CCNOT values below are read
// from the notebook figures directly because that experiment is not in the workbook.
//
// Bit strings are written q0 q1 q2 from left to right (q0 is the top wire, the control). The notebooks reversed
// Qiskit's little-endian keys before plotting; the CCNOT notebook did not, so its values are re-ordered here.

export type GateId = "cnot" | "ccnot" | "cswap" | "peres";
export type Environment = "ideal" | "simulator" | "hardware" | "mitigated";

/** A set of repeated runs. Each run lists the value of every outcome, in order 0...0 to 1...1. */
export interface RunSet {
  runs: number[][];
  /** What one run sums to: the shot count for counts, 1 for quasi-probabilities. */
  total: number;
  shots: number;
  backend: string;
  source: string;
  kind: "counts" | "quasi-counts" | "quasi-probabilities";
}

export type CircuitOp =
  | { kind: "control-x"; controls: number[]; target: number }
  | { kind: "control-swap"; control: number; targets: [number, number] };

export interface GateInfo {
  id: GateId;
  name: string;
  aka: string;
  qubits: 2 | 3;
  summary: string;
  /** The Qiskit calls used in the notebooks. */
  qiskit: string;
  /** Boolean form, inputs A B C to outputs P Q R. */
  expression: string;
  ops: CircuitOp[];
  apply: (bits: number[]) => number[];
  /** What was measured for this gate. */
  studied: string;
}

const b = (bits: number[], index: number) => bits[index] ?? 0;

export const gates: GateInfo[] = [
  {
    id: "cnot",
    name: "CNOT",
    aka: "Controlled-NOT, Feynman gate",
    qubits: 2,
    summary: "Flips the target qubit when the control is 1.",
    qiskit: "qc.cx(0, 1)",
    expression: "P = A,  Q = A ⊕ B",
    ops: [{ kind: "control-x", controls: [0], target: 1 }],
    apply: (bits) => [b(bits, 0), b(bits, 0) ^ b(bits, 1)],
    studied: "All four basis inputs, one run of 1,024 shots each on ibm_perth.",
  },
  {
    id: "ccnot",
    name: "CCNOT",
    aka: "Toffoli gate",
    qubits: 3,
    summary: "Flips the target when both controls are 1. Classically it computes AND reversibly.",
    qiskit: "qc.ccx(0, 1, 2)",
    expression: "P = A,  Q = B,  R = AB ⊕ C",
    ops: [{ kind: "control-x", controls: [0, 1], target: 2 }],
    apply: (bits) => [b(bits, 0), b(bits, 1), (b(bits, 0) & b(bits, 1)) ^ b(bits, 2)],
    studied: "The superposition input only: one run of 1,024 shots on ibmq_quito, with measurement-error mitigation.",
  },
  {
    id: "cswap",
    name: "CSWAP",
    aka: "Controlled-SWAP, Fredkin gate",
    qubits: 3,
    summary: "Swaps the two target qubits when the control is 1, and leaves them alone when it is 0.",
    qiskit: "qc.cswap(0, 1, 2)",
    expression: "P = A,  Q = B ⊕ A(B ⊕ C),  R = C ⊕ A(B ⊕ C)",
    ops: [{ kind: "control-swap", control: 0, targets: [1, 2] }],
    apply: (bits) => (b(bits, 0) ? [1, b(bits, 2), b(bits, 1)] : [0, b(bits, 1), b(bits, 2)]),
    studied: "All eight basis inputs, 20 runs of 1,024 shots on ibm_lagos plus one run on ibm_perth; the superposition input on ibm_perth with and without mitigation.",
  },
  {
    id: "peres",
    name: "Peres",
    aka: "Toffoli followed by CNOT",
    qubits: 3,
    summary: "A Toffoli gate followed by a CNOT on the first two qubits. It computes AND and XOR in one reversible step.",
    qiskit: "qc.ccx(0, 1, 2)\nqc.cx(0, 1)",
    expression: "P = A,  Q = A ⊕ B,  R = AB ⊕ C",
    ops: [
      { kind: "control-x", controls: [0, 1], target: 2 },
      { kind: "control-x", controls: [0], target: 1 },
    ],
    apply: (bits) => [b(bits, 0), b(bits, 0) ^ b(bits, 1), (b(bits, 0) & b(bits, 1)) ^ b(bits, 2)],
    studied: "All eight basis inputs, 20 runs of 1,024 shots on both ibm_perth and ibm_lagos; the superposition input on ibm_perth with and without mitigation.",
  },
];

export const gateById = (id: GateId) => gates.find((gate) => gate.id === id) as GateInfo;

export const labels = (qubits: number) => Array.from({ length: 2 ** qubits }, (_, index) => index.toString(2).padStart(qubits, "0"));
export const toBits = (label: string) => [...label].map(Number);
export const toLabel = (bits: number[]) => bits.join("");
export const outputOf = (gate: GateInfo, input: string) => toLabel(gate.apply(toBits(input)));

/** The input state used in every superposition experiment: |ψ⟩ = α|0⟩ + β|1⟩ on q0 with |α|² = 1/3, |β|² = 2/3. */
export const psi = {
  alphaSquared: 1 / 3,
  betaSquared: 2 / 3,
  // qc.initialize([alpha, beta], 0); the circuit drawings label the box [0.577, 0.816].
  alpha: Math.sqrt(1 / 3),
  beta: Math.sqrt(2 / 3),
};

/**
 * Ideal outcome distribution for |ψ⟩ ⊗ |0⟩ ⊗ |0⟩ through a gate: with probability |α|² q0 is 0 and nothing changes
 * (outcome 000); with probability |β|² q0 is 1 and the gate acts on 100.
 */
export function idealPsi(gate: GateInfo): number[] {
  const p = new Array(2 ** gate.qubits).fill(0) as number[];
  p[0] = psi.alphaSquared;
  const target = parseInt(outputOf(gate, "100"), 2);
  p[target] = (p[target] ?? 0) + psi.betaSquared;
  return p;
}

/** Ideal distribution for a basis input: all probability on the truth-table output. */
export function idealBasis(gate: GateInfo, input: string): number[] {
  const p = new Array(2 ** gate.qubits).fill(0) as number[];
  p[parseInt(outputOf(gate, input), 2)] = 1;
  return p;
}

/* ------------------------------------------------------------------ measured data */

type Results = typeof results;
const basis = results.basis as Record<keyof Results["basis"], number[][][]>;
const sup = results.superposition as Record<"peres" | "cswap", Record<"simulator" | "rawOnly" | "raw1024" | "mitigated1024" | "raw2048" | "mitigated2048", number[][]>>;

export interface BasisExperiment {
  id: string;
  gate: GateId;
  backend: string;
  shots: number;
  /** input label -> runs */
  perInput: Record<string, RunSet>;
  /** The simulator put every shot on the truth-table output in each saved run. */
  simulator?: { shots: number; runs: number; source: string };
  source: string;
}

function basisExperiment(id: string, gate: GateId, backend: string, data: number[][][], source: string, simulator?: BasisExperiment["simulator"]): BasisExperiment {
  const info = gateById(gate);
  const perInput: Record<string, RunSet> = {};
  labels(info.qubits).forEach((input, index) => {
    perInput[input] = { runs: data[index] ?? [], total: 1024, shots: 1024, backend, source, kind: "counts" };
  });
  return { id, gate, backend, shots: 1024, perInput, simulator, source };
}

export const basisExperiments: BasisExperiment[] = [
  basisExperiment("cnot-ibm_perth", "cnot", "ibm_perth", basis["cnot-ibm_perth"], "Notebook 1, cell 4; workbook sheet CNOT_CCNOT_CSWAP_Gate"),
  basisExperiment("cswap-ibm_perth", "cswap", "ibm_perth", basis["cswap-ibm_perth"], "Notebook 1, cell 8; workbook sheet CNOT_CCNOT_CSWAP_Gate", {
    shots: 1024,
    runs: 20,
    source: "Notebook 2, cell 7",
  }),
  basisExperiment("cswap-ibm_lagos", "cswap", "ibm_lagos", basis["cswap-ibm_lagos"], "Notebook 2, cell 6; workbook sheet CSWAP_Gate", { shots: 1024, runs: 20, source: "Notebook 2, cell 7" }),
  basisExperiment("peres-ibm_perth", "peres", "ibm_perth", basis["peres-ibm_perth"], "Notebook 3, cell 5; workbook sheet Peres_Gate", { shots: 2048, runs: 1, source: "Notebook 3, cell 9" }),
  basisExperiment("peres-ibm_lagos", "peres", "ibm_lagos", basis["peres-ibm_lagos"], "Notebook 3, cell 6; workbook sheet Peres_Gate", { shots: 2048, runs: 1, source: "Notebook 3, cell 9" }),
];

export interface SuperpositionBatch {
  id: string;
  label: string;
  raw: RunSet;
  mitigated?: RunSet;
}

export interface SuperpositionExperiment {
  gate: GateId;
  simulator: RunSet;
  batches: SuperpositionBatch[];
}

const counts = (runs: number[][], shots: number, backend: string, source: string, kind: RunSet["kind"] = "counts"): RunSet => ({ runs, total: shots, shots, backend, source, kind });

function workbookSuperposition(gate: "peres" | "cswap", notebook: number, cells: { sim: number; rawOnly: number; m1024: number; m2048: number }): SuperpositionExperiment {
  const data = sup[gate];
  const nb = `Notebook ${notebook}`;
  return {
    gate,
    simulator: counts(data.simulator, 1024, "qasm_simulator", `${nb}, cell ${cells.sim}`),
    batches: [
      {
        id: "mitigated-1024",
        label: "1,024 shots, mitigated",
        raw: counts(data.raw1024, 1024, "ibm_perth", `${nb}, cell ${cells.m1024}`),
        mitigated: counts(data.mitigated1024, 1024, "ibm_perth", `${nb}, cell ${cells.m1024}`, "quasi-counts"),
      },
      {
        id: "mitigated-2048",
        label: "2,048 shots, mitigated",
        raw: counts(data.raw2048, 2048, "ibm_perth", `${nb}, cell ${cells.m2048}`),
        mitigated: counts(data.mitigated2048, 2048, "ibm_perth", `${nb}, cell ${cells.m2048}`, "quasi-counts"),
      },
      { id: "raw-1024", label: "1,024 shots, separate raw batch", raw: counts(data.rawOnly, 1024, "ibm_perth", `${nb}, cell ${cells.rawOnly}`) },
    ],
  };
}

export const superpositionExperiments: SuperpositionExperiment[] = [
  workbookSuperposition("cswap", 5, { sim: 7, rawOnly: 8, m1024: 9, m2048: 10 }),
  workbookSuperposition("peres", 4, { sim: 6, rawOnly: 7, m1024: 8, m2048: 9 }),
  {
    gate: "ccnot",
    // Read from the notebook figures ("Creation of Superposition State_CCNOT", cells 4, 5 and 17) and re-ordered from
    // Qiskit's q2 q1 q0 labels to q0 q1 q2. Qiskit 001 (q0 = 1) is 100 here, 011 is 110, 100 is 001, 110 is 011.
    simulator: counts([[346, 0, 0, 0, 678, 0, 0, 0]], 1024, "qasm_simulator", "CCNOT notebook, cell 4"),
    batches: [
      {
        id: "mitigated-1024",
        label: "1,024 shots, mitigated",
        raw: counts([[369, 20, 16, 3, 548, 16, 44, 8]], 1024, "ibmq_quito", "CCNOT notebook, cell 5"),
        // Quasi-probabilities as printed on the cell 17 figure (three decimals).
        mitigated: { runs: [[0.313, 0, 0.001, 0, 0.645, 0, 0.038, 0.003]], total: 1, shots: 1024, backend: "ibmq_quito", source: "CCNOT notebook, cell 17", kind: "quasi-probabilities" },
      },
    ],
  },
];

/** Calibration run for prepared |000⟩ on ibmq_quito (CCNOT notebook, cell 12), re-ordered to q0 q1 q2. */
export const calibration000 = { backend: "ibmq_quito", shots: 1024, counts: { "000": 902, "001": 67, "010": 19, "100": 36 } as Record<string, number> };

/* ------------------------------------------------------------------ derived metrics */

/** Mean count per outcome over R runs: c̄(o) = (1/R) Σ_r v_r(o). For quasi-probabilities this is scaled to shots. */
export function meanCounts(set: RunSet): number[] {
  const scale = set.shots / set.total;
  const width = set.runs[0]?.length ?? 0;
  return Array.from({ length: width }, (_, o) => (set.runs.reduce((sum, run) => sum + (run[o] ?? 0), 0) / Math.max(set.runs.length, 1)) * scale);
}

/** Mean probability per outcome: p̄(o) = (1/R) Σ_r v_r(o) / T, where T is what one run sums to (shots, or 1). */
export function meanDistribution(set: RunSet): number[] {
  return meanCounts(set).map((value) => value / set.shots);
}

/** Probability of the expected outcomes: P_exp = Σ_{o ∈ E} p(o). */
export const expectedProbability = (p: number[], expected: number[]) => expected.reduce((sum, o) => sum + (p[o] ?? 0), 0);

/** Total variation distance: TVD(p, q) = ½ Σ_o |p(o) − q(o)|. 0 means identical, 1 means disjoint. */
export const tvd = (p: number[], q: number[]) => 0.5 * p.reduce((sum, value, o) => sum + Math.abs(value - (q[o] ?? 0)), 0);

/** Per-run probability of one outcome: p_r(o) = v_r(o) / T. */
export const perRun = (set: RunSet, outcome: number) => set.runs.map((run) => (run[outcome] ?? 0) / set.total);

/** Sample standard deviation: s = √( Σ (x − x̄)² / (n − 1) ). Returns 0 for a single run. */
export function stdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, v) => a + v, 0) / values.length;
  return Math.sqrt(values.reduce((a, v) => a + (v - mean) ** 2, 0) / (values.length - 1));
}

/**
 * The report's "error rate": relative deviation from the simulator for one outcome,
 * δ(o) = |p̄_sim(o) − p̄_x(o)| / p̄_sim(o), which equals |c̄_sim(o) − c̄_x(o)| / c̄_sim(o) when the shot counts match.
 * Recomputed here from the simulator runs saved in the notebooks.
 */
export const relativeDeviation = (simulatorMean: number, mean: number) => (simulatorMean ? Math.abs(simulatorMean - mean) / simulatorMean : 0);

/** Indices of the outcomes expected from the superposition input: 000 and the gate's output for 100. */
export const psiExpected = (gate: GateInfo) => [0, parseInt(outputOf(gate, "100"), 2)];

/** Expected-outcome probability for every basis input of an experiment (mean over runs). */
export function basisSuccess(experiment: BasisExperiment) {
  const gate = gateById(experiment.gate);
  return labels(gate.qubits).map((input) => {
    const set = experiment.perInput[input] as RunSet;
    const target = parseInt(outputOf(gate, input), 2);
    const runs = perRun(set, target);
    return { input, output: outputOf(gate, input), mean: expectedProbability(meanDistribution(set), [target]), min: Math.min(...runs), max: Math.max(...runs), sd: stdDev(runs), runs: runs.length };
  });
}

/* ------------------------------------------------------------------ figures */

export interface QuantumFigure {
  id: keyof typeof figureManifest;
  group: "circuits" | "hardware" | "mitigation";
  alt: string;
  caption: string;
  src: string;
  width: number;
  height: number;
}

const figureText: Omit<QuantumFigure, "src" | "width" | "height">[] = [
  { id: "cswap-circuit-basis", group: "circuits", alt: "Qiskit drawing of the CSWAP circuit for input 000", caption: "CSWAP circuit for input 000: barrier, controlled swap of q1 and q2 on control q0, then measurement of all three qubits. Report figure 1." },
  { id: "peres-circuit-basis", group: "circuits", alt: "Qiskit drawing of the Peres circuit for input 000", caption: "Peres circuit for input 000: a Toffoli onto q2 followed by a CNOT from q0 to q1. Report figure 2." },
  { id: "cnot-circuit-10", group: "circuits", alt: "Qiskit drawing of the CNOT circuit with an X gate on q0", caption: "CNOT circuit for input 10. The X gate on q0 prepares the input; the CNOT then flips q1." },
  { id: "cswap-circuit-psi", group: "circuits", alt: "CSWAP circuit with the psi initialisation box on q0", caption: "CSWAP with |ψ⟩ = 0.577|0⟩ + 0.816|1⟩ prepared on q0 (the box label shows the two amplitudes). Report figure 3." },
  { id: "peres-circuit-psi", group: "circuits", alt: "Peres circuit with the psi initialisation box on q0", caption: "Peres gate with the same |ψ⟩ on q0. Report figure 4." },
  { id: "ccnot-circuit-psi", group: "circuits", alt: "Toffoli circuit with the psi initialisation box on q0", caption: "CCNOT (Toffoli) with |ψ⟩ on q0. With q1 = 0 the target never flips, so only 000 and 100 are expected." },
  { id: "cnot-hardware-10", group: "hardware", alt: "Histogram of CNOT input 10 on ibm_perth with 929 counts at 11", caption: "CNOT, input 10, ibm_perth, 1,024 shots: 929 shots at the expected 11. Bit order q0 q1." },
  { id: "cswap-lagos-101", group: "hardware", alt: "CSWAP circuit for input 101 and its ibm_lagos histogram peaking at 110", caption: "CSWAP, input 101, first run on ibm_lagos: 867 of 1,024 shots at the expected 110." },
  { id: "peres-lagos-110", group: "hardware", alt: "Peres circuit for input 110 and its ibm_lagos histogram peaking at 101", caption: "Peres, input 110, first run on ibm_lagos: 884 of 1,024 shots at the expected 101." },
  { id: "cswap-hardware-psi", group: "hardware", alt: "Histogram of CSWAP with psi on ibm_perth, 321 at 000 and 574 at 100", caption: "CSWAP with |ψ⟩ on ibm_perth, one run of 1,024 shots (run 8 of the raw batch): 321 at 000, 574 at 100, 129 elsewhere. Report figure 6." },
  { id: "peres-hardware-psi", group: "hardware", alt: "Histogram of Peres with psi on ibm_perth, 272 at 000 and 599 at 110", caption: "Peres with |ψ⟩ on ibm_perth, one run of 1,024 shots (run 3 of the raw batch): 272 at 000, 599 at 110. Report figure 9." },
  { id: "ccnot-simulator-psi", group: "hardware", alt: "Simulator histogram for CCNOT with psi, 346 and 678", caption: "CCNOT with |ψ⟩ on qasm_simulator, 1,024 shots. Qiskit labels (q2 q1 q0): 001 here is 100 in the q0 q1 q2 order used elsewhere." },
  { id: "ccnot-hardware-psi", group: "hardware", alt: "Histogram for CCNOT with psi on ibmq_quito", caption: "CCNOT with |ψ⟩ on ibmq_quito, 1,024 shots: 369 at 000 and 548 at 100 (Qiskit label 001)." },
  { id: "cswap-mitigated-psi", group: "mitigation", alt: "Raw and mitigated counts for CSWAP with psi", caption: "CSWAP with |ψ⟩, one run of the 1,024-shot mitigated batch (run 11): raw counts in blue, measurement-error-mitigated counts in pink. Report figure 7." },
  { id: "peres-mitigated-psi", group: "mitigation", alt: "Raw and mitigated counts for Peres with psi", caption: "Peres with |ψ⟩, run 10 of the 1,024-shot mitigated batch: raw 326 and 567, mitigated 366.51 and 636.20. Report figure 10." },
  { id: "ccnot-calibration", group: "mitigation", alt: "Measurement calibration matrix for ibmq_quito", caption: "Measurement calibration matrix from the eight calibration circuits on ibmq_quito. Off-diagonal grey cells are readout errors. Qiskit bit order." },
  { id: "ccnot-mitigated-psi", group: "mitigation", alt: "Noisy and mitigated quasi-probabilities for CCNOT with psi", caption: "CCNOT with |ψ⟩ on ibmq_quito: noisy probabilities against mitigated quasi-probabilities (0.313 and 0.645 for the two expected outcomes). Qiskit bit order." },
];

export const quantumFigures: QuantumFigure[] = figureText.map((item) => ({ ...item, ...figureManifest[item.id] }));
export const figureGroups = [
  { id: "circuits", label: "Circuits" },
  { id: "hardware", label: "Measured histograms" },
  { id: "mitigation", label: "Error mitigation" },
] as const;
