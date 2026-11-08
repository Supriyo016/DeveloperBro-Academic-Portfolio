"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const monthTitle = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });
const fullDate = new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/** Days to show for a month, Monday first, padded with the neighbouring months' days. */
function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  return Array.from({ length: 42 }, (_, index) => new Date(year, month, 1 - offset + index));
}

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function CalendarPopover({ up = false }: { up?: boolean }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date());
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const today = new Date();
  const days = monthGrid(view.getFullYear(), view.getMonth());
  const shift = (months: number) => setView(new Date(view.getFullYear(), view.getMonth() + months, 1));

  return (
    <div ref={box} className="relative">
      <button
        ref={button}
        type="button"
        aria-label="Open calendar"
        aria-expanded={open}
        aria-controls="site-calendar"
        onClick={() => {
          setView(new Date());
          setOpen(!open);
        }}
        className={cn("grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-primary hover:text-primary", open && "border-primary text-primary")}
      >
        <CalendarDays className="size-4" aria-hidden />
      </button>
      {open && (
        <div id="site-calendar" role="dialog" aria-label="Calendar" className={cn("calendar-pop absolute right-0 z-50", up ? "bottom-12" : "top-12", " w-[19rem] rounded-2xl border border-line-strong bg-surface p-4 shadow-2xl")}>
          <div className="flex items-center justify-between">
            <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className="grid size-9 place-items-center rounded-full hover:bg-surface-2">
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <p className="font-serif text-lg" aria-live="polite">{monthTitle.format(view)}</p>
            <button type="button" onClick={() => shift(1)} aria-label="Next month" className="grid size-9 place-items-center rounded-full hover:bg-surface-2">
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
          <table className="mt-2 w-full table-fixed text-center text-sm tabular-nums">
            <caption className="sr-only">{monthTitle.format(view)}</caption>
            <thead>
              <tr>
                {WEEKDAYS.map((day) => (
                  <th key={day} scope="col" abbr={day} className="pb-1 text-xs font-medium text-muted">
                    {day.slice(0, 2)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }, (_, week) => (
                <tr key={week}>
                  {days.slice(week * 7, week * 7 + 7).map((day) => {
                    const isToday = sameDay(day, today);
                    const inMonth = day.getMonth() === view.getMonth();
                    return (
                      <td key={day.toISOString()} className="p-0.5">
                        <span
                          aria-current={isToday ? "date" : undefined}
                          title={fullDate.format(day)}
                          className={cn(
                            "grid h-8 place-items-center rounded-full",
                            isToday ? "bg-primary font-semibold text-on-primary shadow" : inMonth ? "text-ink" : "text-muted/60",
                            !isToday && (day.getDay() === 0 || day.getDay() === 6) && inMonth && "text-accent",
                          )}
                        >
                          {day.getDate()}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-sm">
            <span className="text-ink-2">{fullDate.format(today)}</span>
            <button type="button" onClick={() => setView(new Date())} className="min-h-8 rounded-full px-2 text-primary hover:bg-primary-soft">
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
