import type { ResearchStudy } from "@/types/content";

/** Latest year a study covers. "present" counts as the newest possible. */
function endYear(period: string): number {
  if (/present/i.test(period)) return 9999;
  const years = period.match(/\d{4}/g)?.map(Number) ?? [];
  return years.length ? Math.max(...years) : 0;
}

const startYear = (period: string) => Number(period.match(/\d{4}/)?.[0] ?? 0);

/** Newest work first: by end year, then by start year. */
export function byRecency<T extends Pick<ResearchStudy, "period">>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => endYear(b.period) - endYear(a.period) || startYear(b.period) - startYear(a.period));
}
