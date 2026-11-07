"use client";

import { TerminalSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { profile } from "@/content/profile";

const pages: Record<string, string> = {
  research: "/research",
  publications: "/publications",
  projects: "/projects",
  blogs: "/blogs",
  about: "/about",
  education: "/education",
  skills: "/skills",
  achievements: "/achievements",
  github: "/github",
  cv: "/cv",
  contact: "/contact",
};

const greeting = [`Welcome. This is a small terminal for curious visitors.`, `Type "help" to see what it can do.`];

export function runCommand(input: string): { output: string[]; navigate?: string; clear?: boolean } {
  const [command = "", argument = ""] = input.trim().toLowerCase().split(/\s+/);
  switch (command) {
    case "":
      return { output: [] };
    case "help":
      return { output: ["whoami        who runs this site", "ls            list pages", "open <page>   go to a page", "fedavg        the update rule, in one line", "clear         clear the screen", "exit          close the terminal"] };
    case "whoami":
      return { output: [`${profile.name}. ${profile.role}.`, profile.openTo] };
    case "ls":
      return { output: [Object.keys(pages).join("  ")] };
    case "open":
    case "cd": {
      const target = pages[argument];
      return target ? { output: [`Opening ${argument}...`], navigate: target } : { output: [`No such page: ${argument || "(none)"}. Try "ls".`] };
    }
    case "fedavg":
      return { output: ["θ(t+1) = Σ (n_k / n) θ_k(t)", "Weight each client by how much data it holds, then average."] };
    case "sudo":
      return { output: ["Permission denied. The aggregator holds no secret key."] };
    case "clear":
      return { output: [], clear: true };
    default:
      return { output: [`Command not found: ${command}. Try "help".`] };
  }
}

function TerminalDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>(greeting);

  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    element?.showModal();
    input.current?.focus();
    return () => {
      element?.close();
      previous?.focus();
    };
  }, []);

  useEffect(() => {
    screen.current?.scrollTo({ top: screen.current.scrollHeight });
  }, [lines]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = input.current?.value ?? "";
    if (input.current) input.current.value = "";
    if (value.trim().toLowerCase() === "exit") return onClose();
    const result = runCommand(value);
    setLines(result.clear ? [] : [...lines, `$ ${value}`, ...result.output]);
    if (result.navigate) {
      router.push(result.navigate);
      onClose();
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Terminal"
      onClose={onClose}
      className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-xl border border-line-strong bg-[#10132a] p-0 text-[#dfe3f7] shadow-2xl backdrop:bg-black/40"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 font-mono text-xs text-white/60">
        <span>supriyo@research ~</span>
        <button type="button" onClick={onClose} className="rounded px-2 py-1 hover:bg-white/10">
          Close
        </button>
      </div>
      <div ref={screen} className="h-72 overflow-y-auto p-4 font-mono text-sm leading-relaxed" aria-live="polite">
        {lines.map((line, index) => (
          <p key={index} className="break-words whitespace-pre-wrap">{line}</p>
        ))}
        <form onSubmit={onSubmit} className="mt-1 flex gap-2">
          <span aria-hidden>$</span>
          <label className="flex-1">
            <span className="sr-only">Terminal command</span>
            <input ref={input} autoComplete="off" autoCapitalize="off" spellCheck={false} className="w-full bg-transparent caret-[#74d3e2] outline-none" />
          </label>
        </form>
      </div>
    </dialog>
  );
}

export function TerminalLauncher() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "`") return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable]")) return;
      event.preventDefault();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 font-mono text-xs transition-colors hover:text-primary">
        <TerminalSquare className="size-3.5" aria-hidden />
        <span>terminal</span>
        <span className="caret" aria-hidden>_</span>
      </button>
      {open && createPortal(<TerminalDialog onClose={() => setOpen(false)} />, document.body)}
    </>
  );
}
