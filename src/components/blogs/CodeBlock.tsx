"use client";

import { Check, Copy } from "lucide-react";
import { useRef, useState, type ComponentProps } from "react";

export function CodeBlock(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative">
      <pre ref={ref} tabIndex={0} {...props} />
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Code copied" : "Copy code"}
        className="absolute top-2 right-2 grid size-8 place-items-center rounded-md border border-line bg-surface text-ink-2 transition-colors hover:text-primary"
      >
        {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      </button>
    </div>
  );
}
