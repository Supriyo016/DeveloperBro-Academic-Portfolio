import figures from "./alzheimers-figures.json";
import type { ClassName } from "./alzheimers";

// Figures exported from the saved outputs of the three thesis notebooks by private/scripts/export_thesis_figures.mjs.

export interface Img {
  src: string;
  width: number;
  height: number;
}

export type RunFigureKind = "curves" | "roc" | "tsne" | "features" | "confusion" | "predictions";
export type BackboneFigureKind = "cv" | "compare-f1" | "compare-curves" | "compare-roc" | "compare-tsne";

export const runFigures = figures.runs as Record<string, Partial<Record<RunFigureKind, Img>>>;
export const backboneFigures = figures.backbones as Record<string, Record<BackboneFigureKind, Img>>;
export const mriSamples = figures.samples as Record<ClassName, (Img & { split: string })[]>;

export const runKey = (backbone: string, algorithm: string) => `${backbone}-${algorithm.toLowerCase()}`;

export const runFigureLabels: Record<RunFigureKind, { label: string; caption: string }> = {
  curves: { label: "Training curves", caption: "Accuracy, loss and AUC for each communication round, training and validation." },
  roc: { label: "ROC curves", caption: "One-versus-rest ROC curve for each class, with its AUC." },
  tsne: { label: "t-SNE", caption: "Learned features of test images projected to two dimensions. Separate clusters mean the classes are easy to tell apart." },
  features: {
    label: "Feature maps",
    caption: "Activations for one Mild Demented test scan at an early, a middle and a deep layer. Early layers respond to edges, deeper ones to coarse regions.",
  },
  confusion: { label: "Confusion matrix", caption: "Rows are true classes, columns are predictions, on all 8,800 test images." },
  predictions: { label: "Predictions", caption: "Test scans with their true and predicted class. Green means correct." },
};

export const backboneFigureLabels: Record<BackboneFigureKind, { label: string; caption: string }> = {
  "compare-f1": { label: "F1 by class", caption: "Per-class F1 for FedAvg, FedProx and FedDyn on this backbone." },
  "compare-curves": { label: "Validation curves", caption: "Validation accuracy, loss and AUC per round for the three algorithms." },
  "compare-roc": { label: "ROC side by side", caption: "ROC curves of the three algorithms." },
  "compare-tsne": { label: "t-SNE side by side", caption: "Feature clusters learned by the three algorithms." },
  cv: { label: "Client pre-check", caption: "Stratified 10-fold cross-validation accuracy on each client's own data, before federated training." },
};
