"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { applyPreference, readPreference, savePreference, type ThemePreference } from "@/lib/theme";

const options: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light theme", Icon: Sun },
  { value: "dark", label: "Dark theme", Icon: Moon },
  { value: "system", label: "Use system theme", Icon: Monitor },
];

function subscribe(callback: () => void) {
  window.addEventListener("themechange", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("themechange", callback);
    window.removeEventListener("storage", callback);
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as ThemePreference);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readPreference() === "system") applyPreference("system");
    };
    const onStorage = () => applyPreference(readPreference());
    media.addEventListener("change", onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <div role="group" aria-label="Colour theme" className={cn("inline-flex rounded-full border border-line bg-surface p-0.5", className)}>
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={preference === value}
          title={label}
          onClick={() => savePreference(value)}
          className={cn(
            "grid size-8 place-items-center rounded-full transition-colors",
            preference === value ? "bg-primary-soft text-primary" : "text-muted hover:text-ink",
          )}
        >
          <Icon className="size-4" aria-hidden />
        </button>
      ))}
    </div>
  );
}
