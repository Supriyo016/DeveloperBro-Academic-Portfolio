"use client";

import Image from "next/image";
import { useState } from "react";
import { classLabels, classOrder, experimentRuns, type ClassName } from "@/content/data/alzheimers";
import { mriSamples, runFigures, runKey } from "@/content/data/alzheimers-figures";
import { cn, formatPercent } from "@/lib/utils";

const classColors: Record<ClassName, string> = {
  MildDemented: "var(--series-1)",
  ModerateDemented: "var(--series-2)",
  NonDemented: "var(--series-3)",
  VeryMildDemented: "var(--series-4)",
};
const counts: Record<ClassName, number> = { MildDemented: 10000, ModerateDemented: 10000, NonDemented: 12800, VeryMildDemented: 11200 };
const notebookName: Record<string, string> = { "custom-cnn": "Custom CNN", mobilenetv2: "MobileNetV2", efficientnetb0: "EfficientNetB0" };
const best = experimentRuns.find((run) => run.backbone === "custom-cnn" && run.algorithm === "FedAvg");
const backbones = ["custom-cnn", "mobilenetv2", "efficientnetb0"] as const;

export function MriGallery() {
  const [active, setActive] = useState<ClassName>("MildDemented");
  const [backbone, setBackbone] = useState<(typeof backbones)[number]>("custom-cnn");
  const samples = mriSamples[active] ?? [];
  const features = runFigures[runKey(backbone, "FedAvg")]?.features;

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        <div className="p-4 sm:p-6">
          <h3 className="text-2xl">MRI samples from every class</h3>
          <p className="mt-1 text-[0.95rem] text-ink-2">
            Random scans drawn by the three notebooks, from the training and the test split. Colour tints come from the augmentation in the published dataset.
          </p>
          <div role="tablist" aria-label="Diagnosis class" className="mt-4 flex flex-wrap gap-2">
            {classOrder.map((name) => (
              <button
                key={name}
                type="button"
                role="tab"
                aria-selected={active === name}
                aria-controls="mri-panel"
                onClick={() => setActive(name)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
                  active === name ? "text-ink shadow-md" : "border-line text-ink-2 hover:border-line-strong",
                )}
                style={active === name ? { background: `color-mix(in srgb, ${classColors[name]} 22%, var(--surface))`, borderColor: classColors[name] } : undefined}
              >
                {classLabels[name]}
                <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active === name ? "bg-surface" : "bg-surface-2")}>{counts[name].toLocaleString("en-GB")}</span>
              </button>
            ))}
          </div>
        </div>
        <div id="mri-panel" role="tabpanel" aria-label={`${classLabels[active]} samples`} className="border-t border-line bg-[#05060c] p-3 sm:p-4">
          <ul key={active} className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {samples.map((sample, index) => (
              <li key={sample.src} className="mri-tile fade-in relative overflow-hidden rounded-lg" style={{ animationDelay: `${index * 60}ms` }}>
                <Image src={sample.src} alt={`${classLabels[active]} MRI slice, ${sample.split} split`} width={sample.width} height={sample.height} className="aspect-square h-auto w-full object-contain" sizes="(min-width: 640px) 16vw, 33vw" />
                <span className="mri-scan" aria-hidden />
                <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-[0.65rem] text-white uppercase">{sample.split}</span>
              </li>
            ))}
          </ul>
        </div>
        <dl className="grid grid-cols-2 gap-px bg-line text-sm sm:grid-cols-4">
          <div className="bg-surface p-3">
            <dt className="text-muted">Images in class</dt>
            <dd className="text-lg font-medium tabular-nums">{counts[active].toLocaleString("en-GB")}</dd>
          </div>
          <div className="bg-surface p-3">
            <dt className="text-muted">Test images</dt>
            <dd className="text-lg font-medium tabular-nums">{best?.perClass[active].support.toLocaleString("en-GB")}</dd>
          </div>
          <div className="bg-surface p-3">
            <dt className="text-muted">Best F1 (Custom CNN, FedAvg)</dt>
            <dd className="text-lg font-medium tabular-nums">{best ? formatPercent(best.perClass[active].f1) : "–"}</dd>
          </div>
          <div className="bg-surface p-3">
            <dt className="text-muted">Recall</dt>
            <dd className="text-lg font-medium tabular-nums">{best ? formatPercent(best.perClass[active].recall) : "–"}</dd>
          </div>
        </dl>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-3 p-4 sm:p-6">
          <div>
            <h3 className="text-2xl">What each network sees</h3>
            <p className="mt-1 max-w-2xl text-[0.95rem] text-ink-2">
              Feature maps for a Mild Demented test scan after FedAvg training, at an early, a middle and a deep layer. Brighter means a stronger response.
            </p>
          </div>
          <div role="group" aria-label="Backbone" className="inline-flex flex-wrap gap-1 rounded-2xl bg-surface-2 p-1">
            {backbones.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={backbone === id}
                onClick={() => setBackbone(id)}
                className={cn("min-h-9 rounded-xl px-3 text-sm transition-all", backbone === id ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
              >
                {notebookName[id]}
              </button>
            ))}
          </div>
        </div>
        {features && (
          <div key={backbone} className="fade-in border-t border-line bg-white p-2">
            <Image src={features.src} alt={`Feature maps of the ${notebookName[backbone]} for a Mild Demented scan`} width={features.width} height={features.height} sizes="(min-width: 1024px) 760px, 100vw" className="h-auto w-full" />
          </div>
        )}
        <p className="border-t border-line p-3 text-sm text-muted">
          The Custom CNN responds to the outline of the ventricles and the cortex in its early layers, while the pretrained backbones&apos; deep maps are only 2 × 2 at this resolution.
          Grad-CAM heatmaps were not produced in the dissertation runs, and the trained weights were not saved, so none are shown here.
        </p>
      </div>
    </div>
  );
}
