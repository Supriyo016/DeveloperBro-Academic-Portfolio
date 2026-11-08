"use client";

import { Download, Printer } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button, ButtonAnchor } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

export function CvViewer({ children }: { children: ReactNode }) {
  const [view, setView] = useState<"web" | "pdf">("web");

  return (
    <div>
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label="CV view" className="inline-flex rounded-full bg-surface-2 p-1">
          {(["web", "pdf"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => setView(value)}
              className={cn("min-h-9 rounded-full px-4 text-sm transition-colors", view === value ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink")}
            >
              {value === "web" ? "Web version" : "PDF preview"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            <Printer className="size-4" aria-hidden /> Print
          </Button>
          <ButtonAnchor href={profile.cvPath} download>
            <Download className="size-4" aria-hidden /> Download PDF
          </ButtonAnchor>
        </div>
      </div>
      <p className="no-print mt-3 text-sm text-muted">Original CV, last updated {profile.cvUpdated}.</p>

      <div className="mt-5">
        {view === "web" ? (
          children
        ) : (
          <div>
            <iframe src={profile.cvPath} title="Academic CV of Supriyo Sarkar (PDF)" className="h-[80vh] w-full rounded-xl border border-line bg-white" />
            <p className="mt-2 text-sm text-muted">
              If the preview does not load on your device, <a href={profile.cvPath} className="link">open the PDF directly</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
