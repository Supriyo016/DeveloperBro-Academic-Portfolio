"use client";

import { ChevronLeft, ChevronRight, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { pipelines, type PipelineStep } from "@/content/data/alzheimers";
import { cn } from "@/lib/utils";

const visibility: Record<PipelineStep["serverSees"], { Icon: typeof Eye; tone: string }> = {
  Nothing: { Icon: EyeOff, tone: "bg-surface-2 text-ink-2" },
  "Plaintext weights": { Icon: Eye, tone: "bg-warn-soft text-warn-ink" },
  "Ciphertext only": { Icon: Lock, tone: "bg-ok-soft text-ok-ink" },
  "Global model": { Icon: Eye, tone: "bg-surface-2 text-ink-2" },
};

export function PipelineViewer() {
  const [mode, setMode] = useState<keyof typeof pipelines>("dissertation");
  const [index, setIndex] = useState(0);
  const pipeline = pipelines[mode];
  const step = pipeline.steps[index] as PipelineStep;
  const { Icon, tone } = visibility[step.serverSees];

  return (
    <div className="card p-4 sm:p-6">
      <div role="group" aria-label="Pipeline version" className="inline-flex flex-wrap rounded-2xl bg-surface-2 p-1 sm:rounded-full">
        {(Object.keys(pipelines) as (keyof typeof pipelines)[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            onClick={() => {
              setMode(key);
              setIndex(0);
            }}
            className={cn("min-h-9 rounded-full px-3 text-sm transition-colors", mode === key ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
          >
            {pipelines[key].label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted">{pipeline.caption}</p>

      <ol className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {pipeline.steps.map((item, position) => (
          <li key={item.title}>
            <button
              type="button"
              aria-current={position === index ? "step" : undefined}
              onClick={() => setIndex(position)}
              className={cn(
                "flex h-full min-h-16 w-full flex-col justify-between rounded-lg border p-2 text-left text-sm leading-tight transition-colors",
                position === index ? "border-primary bg-primary-soft text-primary" : "border-line hover:border-line-strong",
              )}
            >
              <span className="font-mono text-xs opacity-70">{position + 1}</span>
              <span>{item.title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-4 min-h-44" aria-live="polite">
        <div key={`${mode}-${index}`} className="fade-in">
          <p className="font-serif text-xl">{step.summary}</p>
          <p className="mt-2 max-w-2xl text-ink-2">{step.detail}</p>
          <p className={cn("mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm", tone)}>
            <Icon className="size-3.5" aria-hidden />
            Server sees: {step.serverSees.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm text-primary hover:bg-primary-soft disabled:opacity-40"
        >
          <ChevronLeft className="size-4" aria-hidden /> Previous
        </button>
        <button
          type="button"
          disabled={index === pipeline.steps.length - 1}
          onClick={() => setIndex(index + 1)}
          className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-sm text-primary hover:bg-primary-soft disabled:opacity-40"
        >
          Next <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
