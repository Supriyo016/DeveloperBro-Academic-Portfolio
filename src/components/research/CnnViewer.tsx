"use client";

import { useState } from "react";
import { customCnnStages } from "@/content/data/alzheimers";
import { cn } from "@/lib/utils";

const widest = Math.log2(512);

export function CnnViewer() {
  const [active, setActive] = useState(1);
  const stage = customCnnStages[active] ?? customCnnStages[0];

  return (
    <div className="card p-4 sm:p-6">
      <h3 className="text-xl">Inside the Custom CNN</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-[1fr_1fr]">
        <ol className="space-y-1.5">
          {customCnnStages.map((item, index) => (
            <li key={item.stage}>
              <button
                type="button"
                aria-pressed={active === index}
                onClick={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                className="group flex min-h-9 w-full items-center gap-3 rounded-md text-left text-sm"
              >
                <span className={cn("w-20 shrink-0 transition-colors", active === index ? "text-primary" : "text-ink-2")}>{item.stage}</span>
                <span className="h-5 flex-1">
                  <span
                    className={cn("block h-full rounded transition-colors", active === index ? "bg-primary" : "bg-lavender group-hover:bg-primary/60")}
                    style={{ width: `${Math.max((Math.log2(item.channels) / widest) * 100, 8)}%` }}
                  />
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div aria-live="polite" className="rounded-xl bg-surface-2 p-4">
          <p className="eyebrow">{stage?.stage}</p>
          <p className="mt-2 text-ink-2">{stage?.layers}</p>
          <p className="mt-3 text-sm text-muted">Output</p>
          <p className="font-mono text-sm">{stage?.output}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted">Bar length shows channel width on a log scale.</p>
    </div>
  );
}
