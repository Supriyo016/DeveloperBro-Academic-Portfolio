import type { Environment } from "@/content/data/quantum";
import { cn } from "@/lib/utils";

export const envColor: Record<Environment, string> = {
  ideal: "var(--ink-2)",
  simulator: "var(--series-1)",
  hardware: "var(--series-2)",
  mitigated: "var(--series-3)",
};

export const envLabel: Record<Environment, string> = {
  ideal: "Ideal",
  simulator: "Simulator",
  hardware: "IBM hardware, raw",
  mitigated: "IBM hardware, mitigated",
};

/** Toggle-button group. Each button reports its state with aria-pressed. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly { id: T; label: string; disabled?: boolean }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cn("inline-flex flex-wrap gap-1 rounded-2xl bg-surface-2 p-1", className)}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={value === option.id}
          disabled={option.disabled}
          onClick={() => onChange(option.id)}
          className={cn(
            "min-h-9 rounded-xl px-3 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50",
            value === option.id ? "bg-surface text-ink shadow-sm" : "text-ink-2 hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Legend({ items }: { items: Environment[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-2">
      {items.map((env) => (
        <li key={env} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={env === "ideal" ? { border: `1.5px dashed ${envColor.ideal}` } : { background: envColor[env] }}
            aria-hidden
          />
          {envLabel[env]}
        </li>
      ))}
    </ul>
  );
}

export const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;
export const ket = (label: string) => `|${label}⟩`;
