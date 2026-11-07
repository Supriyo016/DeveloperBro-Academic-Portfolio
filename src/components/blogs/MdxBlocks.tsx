import Image from "next/image";
import type { ReactNode } from "react";

// MDX blocks for articles. MDX runs with JavaScript expressions blocked, so every prop is a plain string.
// Lists use "label=value" pairs separated by semicolons. Multi-series values are separated by "|".

const SERIES = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

export function parsePairs(input = ""): { label: string; value: string }[] {
  return input
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const at = part.indexOf("=");
      return at === -1 ? { label: part, value: "" } : { label: part.slice(0, at).trim(), value: part.slice(at + 1).trim() };
    });
}

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return value === undefined || value === "" || Number.isNaN(parsed) ? fallback : parsed;
};

function Caption({ title, caption }: { title?: string; caption?: string }) {
  if (!title && !caption) return null;
  return (
    <figcaption className="mt-3 text-sm leading-relaxed text-muted">
      {title && <span className="font-semibold text-ink">{title}. </span>}
      {caption}
    </figcaption>
  );
}

interface BarChartProps {
  data: string;
  title?: string;
  caption?: string;
  unit?: string;
  min?: string;
  max?: string;
  decimals?: string;
  series?: string;
  highlight?: string;
}

export function BarChart({ data, title, caption, unit = "", min, max, decimals = "1", series, highlight }: BarChartProps) {
  const rows = parsePairs(data).map((row) => ({ label: row.label, values: row.value.split("|").map((v) => Number(v)) }));
  const names = series ? series.split(",").map((name) => name.trim()) : [];
  const all = rows.flatMap((row) => row.values).filter((v) => !Number.isNaN(v));
  const lo = toNumber(min, 0);
  const hi = toNumber(max, Math.max(...all));
  const places = toNumber(decimals, 1);
  const marked = new Set((highlight ?? "").split(",").map((label) => label.trim()));
  const width = (value: number) => `${Math.max(1.5, Math.min(100, ((value - lo) / (hi - lo || 1)) * 100))}%`;

  return (
    <figure className="not-prose my-8 rounded-xl border border-line bg-surface p-4 sm:p-5">
      {names.length > 1 && (
        <ul className="mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2" aria-label="Legend">
          {names.map((name, index) => (
            <li key={name} className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block size-3 rounded-sm" style={{ background: SERIES[index % SERIES.length] }} />
              {name}
            </li>
          ))}
        </ul>
      )}
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="grid gap-1 sm:grid-cols-[minmax(0,11rem)_1fr] sm:items-center sm:gap-3">
            <span className={`text-sm ${marked.has(row.label) ? "font-semibold text-ink" : "text-ink-2"}`}>{row.label}</span>
            <span className="space-y-1">
              {row.values.map((value, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span className="h-3.5 flex-1 overflow-hidden rounded-sm bg-surface-2">
                    <span
                      className="block h-full rounded-sm"
                      style={{
                        width: width(value),
                        background: names.length > 1 ? SERIES[index % SERIES.length] : marked.has(row.label) ? "var(--primary)" : "var(--series-1)",
                        opacity: names.length > 1 || marked.size === 0 || marked.has(row.label) ? 1 : 0.55,
                      }}
                    />
                  </span>
                  <span className="w-16 shrink-0 text-right font-mono text-xs text-ink">
                    {names.length > 1 && <span className="sr-only">{names[index]}: </span>}
                    {Number.isNaN(value) ? "n/a" : `${value.toFixed(places)}${unit}`}
                  </span>
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
      {lo !== 0 && <p className="mt-3 text-xs text-muted">Bars start at {lo}{unit}, not zero.</p>}
      <Caption title={title} caption={caption} />
    </figure>
  );
}

interface LineChartProps {
  series: string;
  title?: string;
  caption?: string;
  xLabel?: string;
  yLabel?: string;
  yMin?: string;
  yMax?: string;
  xStart?: string;
  reference?: string;
  referenceLabel?: string;
  percent?: string;
  xLabels?: string;
  yStep?: string;
}

export function LineChart({ series, title, caption, xLabel = "", yLabel = "", yMin, yMax, xStart = "1", reference, referenceLabel, percent, xLabels, yStep }: LineChartProps) {
  const lines = parsePairs(series).map((line) => ({ name: line.label, points: line.value.split(",").map(Number) }));
  const all = lines.flatMap((line) => line.points);
  const lo = toNumber(yMin, Math.min(...all));
  const hi = toNumber(yMax, Math.max(...all));
  const first = toNumber(xStart, 1);
  const count = Math.max(...lines.map((line) => line.points.length));
  const asPercent = percent === "true";
  const W = 640;
  const H = 320;
  const pad = { left: 52, right: 16, top: 16, bottom: 44 };
  const x = (i: number) => pad.left + (i / Math.max(1, count - 1)) * (W - pad.left - pad.right);
  const y = (v: number) => pad.top + (1 - (v - lo) / (hi - lo || 1)) * (H - pad.top - pad.bottom);
  const step = toNumber(yStep, (hi - lo) / 4);
  const ticks = Array.from({ length: Math.floor((hi - lo) / step + 1e-9) + 1 }, (_, i) => lo + step * i);
  const names = xLabels ? xLabels.split(",").map((label) => label.trim()) : undefined;
  const xTicks = names ? names.map((_, i) => i) : Array.from(new Set([0, Math.round((count - 1) / 3), Math.round((2 * (count - 1)) / 3), count - 1]));
  const fmt = (v: number) => (asPercent ? `${Math.round(v * 100)}%` : Number(v.toFixed(2)).toString());
  const summary = lines.map((line) => `${line.name}: ${fmt(line.points[0] ?? 0)} to ${fmt(line.points.at(-1) ?? 0)}`).join("; ");

  return (
    <figure className="not-prose my-8 rounded-xl border border-line bg-surface p-4 sm:p-5">
      <ul className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-2" aria-label="Legend">
        {lines.map((line, index) => (
          <li key={line.name} className="flex items-center gap-1.5">
            <span aria-hidden className="inline-block h-0.5 w-4" style={{ background: SERIES[index % SERIES.length] }} />
            {line.name}
          </li>
        ))}
      </ul>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${title ?? "Line chart"}. ${summary}`}>
        {ticks.map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={W - pad.right} y1={y(tick)} y2={y(tick)} stroke="var(--grid)" strokeWidth="1" />
            <text x={pad.left - 8} y={y(tick) + 4} textAnchor="end" fontSize="12" fill="var(--muted)">{fmt(tick)}</text>
          </g>
        ))}
        {xTicks.map((i) => (
          <text key={i} x={x(i)} y={H - pad.bottom + 18} textAnchor="middle" fontSize="12" fill="var(--muted)">{names ? names[i] : first + i}</text>
        ))}
        {reference && (
          <g>
            <line x1={pad.left} x2={W - pad.right} y1={y(Number(reference))} y2={y(Number(reference))} stroke="var(--ink-2)" strokeDasharray="4 4" strokeWidth="1" />
            {referenceLabel && <text x={W - pad.right} y={y(Number(reference)) - 6} textAnchor="end" fontSize="12" fill="var(--ink-2)">{referenceLabel}</text>}
          </g>
        )}
        {lines.map((line, index) => (
          <polyline
            key={line.name}
            fill="none"
            stroke={SERIES[index % SERIES.length]}
            strokeWidth="2.25"
            strokeLinejoin="round"
            points={line.points.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")}
          />
        ))}
        {xLabel && <text x={(W + pad.left) / 2} y={H - 6} textAnchor="middle" fontSize="12" fill="var(--ink-2)">{xLabel}</text>}
        {yLabel && <text x={14} y={H / 2 - 10} textAnchor="middle" fontSize="12" fill="var(--ink-2)" transform={`rotate(-90 14 ${H / 2 - 10})`}>{yLabel}</text>}
      </svg>
      <Caption title={title} caption={caption} />
    </figure>
  );
}

export function Flow({ steps, title, caption }: { steps: string; title?: string; caption?: string }) {
  const items = parsePairs(steps);
  const across = items.length <= 4;
  return (
    <figure className="not-prose my-8">
      <ol className={`m-0 grid list-none gap-5 p-0 ${across ? "sm:auto-cols-fr sm:grid-flow-col" : ""}`} style={{ paddingLeft: 0 }}>
        {items.map((item, index) => (
          <li key={item.label} className="relative m-0 rounded-xl border border-line bg-surface p-3.5">
            <span className="font-mono text-xs text-primary">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
            {item.value && <p className="mt-1 text-sm leading-snug text-ink-2">{item.value}</p>}
            {index < items.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-1/2 -bottom-5 grid h-5 -translate-x-1/2 place-items-center text-sm leading-none text-muted ${across ? "sm:top-1/2 sm:-right-5 sm:bottom-auto sm:left-auto sm:h-auto sm:w-5 sm:translate-x-0 sm:-translate-y-1/2" : ""}`}
              >
                <span className={across ? "sm:hidden" : ""}>↓</span>
                {across && <span className="hidden sm:inline">→</span>}
              </span>
            )}
          </li>
        ))}
      </ol>
      <Caption title={title} caption={caption} />
    </figure>
  );
}

const CALLOUT = {
  note: { label: "Note", className: "border-[var(--accent)] bg-[var(--accent-soft)]" },
  warn: { label: "Caution", className: "border-[var(--warn-ink)] bg-[var(--warn-soft)]" },
  key: { label: "Key idea", className: "border-[var(--primary)] bg-[var(--primary-soft)]" },
} as const;

export function Callout({ type = "note", title, children }: { type?: keyof typeof CALLOUT; title?: string; children: ReactNode }) {
  const style = CALLOUT[type] ?? CALLOUT.note;
  return (
    <aside className={`not-prose my-6 rounded-r-xl border-l-4 px-4 py-3 text-base leading-relaxed text-ink ${style.className}`}>
      <p className="font-semibold">{title ?? style.label}</p>
      <div className="mt-1 space-y-2 text-ink-2 [&_code]:font-mono [&_code]:text-[0.9em] [&_strong]:text-ink">{children}</div>
    </aside>
  );
}

export function Stats({ items }: { items: string }) {
  return (
    <dl className="not-prose my-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {parsePairs(items).map((item) => (
        <div key={item.value} className="rounded-xl border border-line bg-surface p-3.5">
          <dt className="text-xs leading-snug text-muted">{item.value}</dt>
          <dd className="mt-1 font-mono text-xl text-ink">{item.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Figure({ src, alt, caption, width, height }: { src: string; alt: string; caption?: string; width: string; height: string }) {
  return (
    <figure className="not-prose my-8">
      <Image src={src} alt={alt} width={Number(width)} height={Number(height)} sizes="(min-width: 768px) 44rem, 100vw" className="h-auto w-full rounded-xl border border-line bg-white" />
      <Caption caption={caption} />
    </figure>
  );
}

export const mdxBlocks = { BarChart, LineChart, Flow, Callout, Stats, Figure };
