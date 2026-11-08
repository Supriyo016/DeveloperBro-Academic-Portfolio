import results from "./alzheimers-results.json";

export type ClassName = "MildDemented" | "ModerateDemented" | "NonDemented" | "VeryMildDemented";

export interface ClassMetrics {
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface ExperimentRun {
  experiment: number;
  backbone: string;
  backboneLabel: string;
  algorithm: "FedAvg" | "FedProx" | "FedDyn";
  accuracy: number;
  testImages: number;
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  finalLoss: number;
  macroAuc: number | null;
  /** Set when AUC is the mean of the per-class AUCs shown on the notebook's ROC figure */
  aucSource?: "roc-figure";
  perClass: Record<ClassName, ClassMetrics>;
  accuracyByRound: number[];
}

export const experimentRuns = results.runs as ExperimentRun[];

export const classLabels: Record<ClassName, string> = {
  MildDemented: "Mild",
  ModerateDemented: "Moderate",
  NonDemented: "Non-demented",
  VeryMildDemented: "Very mild",
};

export const classOrder: ClassName[] = ["MildDemented", "ModerateDemented", "NonDemented", "VeryMildDemented"];

export const clientDistribution: { client: string; counts: Record<ClassName, number> }[] = [
  { client: "Client 1", counts: { MildDemented: 2780, ModerateDemented: 1847, NonDemented: 3494, VeryMildDemented: 184 } },
  { client: "Client 2", counts: { MildDemented: 183, ModerateDemented: 478, NonDemented: 2180, VeryMildDemented: 680 } },
  { client: "Client 3", counts: { MildDemented: 166, ModerateDemented: 3398, NonDemented: 212, VeryMildDemented: 2139 } },
  { client: "Client 4", counts: { MildDemented: 4038, ModerateDemented: 1475, NonDemented: 268, VeryMildDemented: 477 } },
  { client: "Client 5", counts: { MildDemented: 833, ModerateDemented: 802, NonDemented: 4086, VeryMildDemented: 5480 } },
];


export interface PipelineStep {
  title: string;
  summary: string;
  detail: string;
  serverSees: "Nothing" | "Plaintext weights" | "Ciphertext only" | "Global model";
}

export const pipelines: Record<"dissertation" | "secure", { label: string; caption: string; steps: PipelineStep[] }> = {
  dissertation: {
    label: "As run in the dissertation",
    caption: "The pipeline that produced the reported results. CKKS ran beside training as a prototype.",
    steps: [
      {
        title: "Partition",
        summary: "Dirichlet split across five clients",
        detail: "A Dirichlet draw with α = 0.5 assigns each class unevenly, so client sizes range from 3,521 to 11,201 images and no client mirrors the global mix.",
        serverSees: "Nothing",
      },
      {
        title: "Local training",
        summary: "10 epochs on each client's own images",
        detail: "Each client trains the global model with Adam on its private images. FedProx adds a proximal term and FedDyn a dynamic regulariser, both with coefficient 0.01.",
        serverSees: "Nothing",
      },
      {
        title: "CKKS check",
        summary: "Sampled weights encrypted and decrypted",
        detail: "A sampled slice of the weights goes through TenSEAL encryption and decryption each round to record the reconstruction error. This is a prototype of the encryption layer, separate from the update sent to the server.",
        serverSees: "Nothing",
      },
      {
        title: "Upload",
        summary: "Model weights sent to the server",
        detail: "Clients send model parameters, never images. The update itself is plaintext in these runs, which protects raw data but not the parameters.",
        serverSees: "Plaintext weights",
      },
      {
        title: "Aggregate",
        summary: "Sample-weighted average in Flower",
        detail: "The server averages client models, weighted by how many images each client holds, to form the next global model.",
        serverSees: "Plaintext weights",
      },
      {
        title: "Evaluate",
        summary: "Global model on 8,800 held-out images",
        detail: "Every round the global model is scored on the held-out test set. After 30 rounds the final-round values are reported, with no selection of a best round.",
        serverSees: "Global model",
      },
    ],
  },
  secure: {
    label: "Follow-up design",
    caption: "The encrypted aggregation in my ongoing work. No results are reported here yet.",
    steps: [
      {
        title: "Group-safe split",
        summary: "Related files kept together",
        detail: "Splitting by groups keeps identical files on the same side of every split, which removes one route for test data to leak into training.",
        serverSees: "Nothing",
      },
      {
        title: "Key setup",
        summary: "Secret key stays with clients",
        detail: "Clients hold a CKKS context with the secret key. The server receives a public context, and the code checks that it holds no secret key.",
        serverSees: "Nothing",
      },
      {
        title: "Local training",
        summary: "Each client decrypts the global model and trains",
        detail: "Clients decrypt the latest global model, then train on their private images.",
        serverSees: "Nothing",
      },
      {
        title: "Encrypt",
        summary: "Whole weighted model becomes ciphertext",
        detail: "Each client multiplies its model by its sample count, packs the values into CKKS vectors, and sends serialized ciphertexts.",
        serverSees: "Ciphertext only",
      },
      {
        title: "Homomorphic sum",
        summary: "Server adds ciphertexts it cannot read",
        detail: "Weighted averaging needs only addition, so the server can combine client updates without a key and without seeing any single client's parameters.",
        serverSees: "Ciphertext only",
      },
      {
        title: "Decrypt",
        summary: "Clients recover the new global model",
        detail: "The encrypted result returns to clients, who decrypt it and continue with the next round. Ciphertext size and CKKS error are logged per round.",
        serverSees: "Ciphertext only",
      },
    ],
  },
};
