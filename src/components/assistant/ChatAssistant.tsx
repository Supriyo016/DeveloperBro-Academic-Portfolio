"use client";

import { ExternalLink, Send, Sparkles, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { initialState, respond, welcome, type BotReply, type ChatState } from "@/lib/assistant/engine";
import type { Knowledge } from "@/lib/assistant/knowledge";
import { cn } from "@/lib/utils";
import { canRemember } from "@/lib/consent";

interface Message extends BotReply {
  id: number;
  from: "bot" | "visitor";
}

const STORAGE_KEY = "assistant-chat-v1";
const MAX_LENGTH = 300;

function RobotFace({ mood = "happy", className }: { mood?: BotReply["mood"]; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M32 9V3" stroke="var(--il-line, var(--line-strong))" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="3.5" r="3.5" fill="var(--il-amber)" className="il-pulse" />
      <rect x="7" y="9" width="50" height="44" rx="16" fill="var(--il-paper)" stroke="var(--line-strong)" strokeWidth="2" />
      <rect x="13" y="16" width="38" height="26" rx="10" fill="var(--il-coat)" />
      <g className="il-blink" style={{ transformOrigin: "32px 28px" }}>
        {mood === "thinking" ? (
          <path d="M20 28h8M36 28h8" stroke="var(--il-cyan)" strokeWidth="3.5" strokeLinecap="round" />
        ) : (
          <>
            <ellipse cx="24" cy="28" rx="4" ry="4.8" fill="var(--il-cyan)" />
            <ellipse cx="40" cy="28" rx="4" ry="4.8" fill="var(--il-cyan)" />
            <circle cx="25.4" cy="26.4" r="1.3" fill="var(--il-paper)" />
            <circle cx="41.4" cy="26.4" r="1.3" fill="var(--il-paper)" />
          </>
        )}
      </g>
      <path d={mood === "thinking" ? "M28 37h8" : "M26 36c4 3 8 3 12 0"} fill="none" stroke="var(--il-cyan)" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="3" y="24" width="5" height="12" rx="2.5" fill="var(--il-primary)" />
      <rect x="56" y="24" width="5" height="12" rx="2.5" fill="var(--il-primary)" />
      <path d="M22 53h20l-3 8H25Z" fill="var(--il-primary)" />
    </svg>
  );
}

function readStored(): { messages: Message[]; state: ChatState } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { messages: Message[]; state: ChatState };
    return Array.isArray(parsed.messages) ? parsed : null;
  } catch {
    return null;
  }
}

function isExternal(href: string) {
  return /^(https?:|mailto:)/.test(href) || href.endsWith(".pdf");
}

export function ChatAssistant({ knowledge }: { knowledge: Knowledge }) {
  const [open, setOpen] = useState(false);
  // The panel is closed on first render, so restoring a stored chat here cannot cause a hydration mismatch.
  const [stored] = useState(() => (typeof window === "undefined" ? null : readStored()));
  const [messages, setMessages] = useState<Message[]>(stored?.messages ?? []);
  const [state, setState] = useState<ChatState>(stored?.state ?? initialState);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [mood, setMood] = useState<BotReply["mood"]>("waving");
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(Math.max(0, ...(stored?.messages ?? []).map((message) => message.id)) + 1);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => () => clearTimeout(timer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        launcher.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!messages.length || !canRemember()) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: messages.slice(-40), state }));
    } catch {
      // Storage can be blocked. The conversation still works on this page.
    }
  }, [messages, state]);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const botSays = useCallback((reply: BotReply) => {
    setMessages((current) => [...current, { ...reply, id: nextId.current++, from: "bot" }]);
    setMood(reply.mood ?? "happy");
  }, []);

  const openPanel = () => {
    setOpen(true);
    if (!messages.length) botSays(welcome(knowledge));
    requestAnimationFrame(() => input.current?.focus());
  };

  const closePanel = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  const send = (text: string) => {
    const clean = text.trim().slice(0, MAX_LENGTH);
    if (!clean || typing) return;
    setMessages((current) => [...current, { id: nextId.current++, from: "visitor", text: [clean] }]);
    setDraft("");
    setTyping(true);
    setMood("thinking");
    const { reply, state: nextState } = respond(clean, state, knowledge);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = calm ? 150 : Math.min(450 + reply.text.join(" ").length * 6, 1600);
    timer.current = setTimeout(() => {
      setTyping(false);
      setState(nextState);
      botSays(reply);
    }, delay);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(draft);
  };

  const reset = () => {
    clearTimeout(timer.current);
    setTyping(false);
    setState(initialState);
    nextId.current = 1;
    const first = { ...welcome(knowledge), id: nextId.current++, from: "bot" as const };
    setMessages([first]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clear.
    }
    input.current?.focus();
  };

  const lastBot = [...messages].reverse().find((message) => message.from === "bot");

  return (
    <div className="no-print">
      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="chat-pop fixed right-3 bottom-[5.25rem] z-40 flex h-[min(36rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-2xl sm:right-4"
        >
          <header className="relative flex items-center gap-3 overflow-hidden border-b border-line bg-primary-soft px-4 py-3">
            <span aria-hidden className="ambient-blob" style={{ width: "12rem", height: "12rem", top: "-6rem", right: "-4rem", ["--blob" as string]: "var(--lavender)" }} />
            <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-surface shadow-sm">
              <RobotFace mood={typing ? "thinking" : mood} className="il-bob size-9" />
            </span>
            <div className="relative min-w-0 flex-1">
              <h2 id={titleId} className="font-sans text-base font-semibold tracking-normal text-ink">Bro, {knowledge.firstName}&apos;s assistant</h2>
              <p className="flex items-center gap-1.5 text-xs text-ink-2">
                <span className="relative inline-flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[var(--ok-ink)] opacity-60" />
                  <span className="relative size-2 rounded-full bg-[var(--ok-ink)]" />
                </span>
                {typing ? "Typing…" : "Online · answers from this site"}
              </p>
            </div>
            <button type="button" onClick={reset} aria-label="Start a new conversation" className="relative grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-primary">
              <Trash2 className="size-4" aria-hidden />
            </button>
            <button type="button" onClick={closePanel} aria-label="Close chat" className="relative grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface hover:text-primary">
              <X className="size-4.5" aria-hidden />
            </button>
          </header>

          <div ref={log} role="log" aria-live="polite" aria-label="Conversation" className="flex-1 space-y-3 overflow-y-auto px-3 py-4" tabIndex={0}>
            {messages.map((message) =>
              message.from === "visitor" ? (
                <div key={message.id} className="chat-pop flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[0.95rem] leading-snug text-on-primary">
                    <span className="sr-only">You: </span>
                    {message.text[0]}
                  </p>
                </div>
              ) : (
                <div key={message.id} className="chat-pop flex items-end gap-2">
                  <RobotFace mood={message.mood} className="size-7 shrink-0" />
                  <div className="max-w-[85%] space-y-1.5 rounded-2xl rounded-bl-md border border-line bg-surface-2 px-3.5 py-2.5 text-[0.95rem] leading-snug text-ink">
                    <span className="sr-only">Assistant: </span>
                    {message.text.map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                    {message.links && message.links.length > 0 && (
                      <ul className="flex flex-wrap gap-1.5 pt-1">
                        {message.links.map((link) => (
                          <li key={link.href + link.label}>
                            {isExternal(link.href) ? (
                              <a href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-line-strong bg-surface px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:border-primary">
                                {link.label}
                                <ExternalLink className="size-3" aria-hidden />
                              </a>
                            ) : (
                              <Link href={link.href} className="inline-flex items-center rounded-full border border-line-strong bg-surface px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:border-primary">
                                {link.label}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ),
            )}
            {typing && (
              <div className="flex items-end gap-2" aria-label="The assistant is typing">
                <RobotFace mood="thinking" className="size-7 shrink-0" />
                <span className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-surface-2 px-3.5 py-3">
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className="chat-dot size-2 rounded-full bg-primary" style={{ animationDelay: `${dot * 0.15}s` }} />
                  ))}
                </span>
              </div>
            )}
          </div>

          {lastBot?.suggestions && !typing && (
            <ul className="flex gap-1.5 overflow-x-auto border-t border-line px-3 py-2 [scrollbar-width:thin]" aria-label="Suggested questions">
              {lastBot.suggestions.map((suggestion) => (
                <li key={suggestion} className="shrink-0">
                  <button type="button" onClick={() => send(suggestion)} className="inline-flex min-h-8 items-center gap-1 rounded-full border border-line-strong px-3 text-xs text-ink-2 transition-colors hover:border-primary hover:text-primary">
                    <Sparkles className="size-3" aria-hidden />
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Ask a question
            </label>
            <input
              id={`${panelId}-input`}
              ref={input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={MAX_LENGTH}
              autoComplete="off"
              placeholder="Ask about research, projects, contact…"
              className="min-h-10 min-w-0 flex-1 rounded-full border border-line-strong bg-bg px-4 text-[0.95rem] text-ink placeholder:text-muted focus:border-primary focus:outline-none"
            />
            <button type="submit" disabled={!draft.trim() || typing} aria-label="Send" className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
              <Send className="size-4" aria-hidden />
            </button>
          </form>
        </section>
      )}

      <div className="pointer-events-none fixed right-3 bottom-4 z-40 flex items-end gap-2 sm:right-4">
        {!open && (
          <span data-hint="Hi! Ask me anything 👋" className="chat-hint-once mb-2 hidden rounded-2xl rounded-br-md border border-line bg-surface px-3 py-1.5 text-sm text-ink shadow-md sm:block" aria-hidden="true" />
        )}
        <button
          ref={launcher}
          type="button"
          onClick={() => (open ? closePanel() : openPanel())}
          aria-expanded={open}
          aria-controls={open ? panelId : undefined}
          aria-label={open ? "Close chat with the site assistant" : "Chat with the site assistant"}
          className={cn(
            "pointer-events-auto group relative grid size-14 place-items-center rounded-full border border-line-strong bg-surface shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105",
            open && "ring-2 ring-primary",
          )}
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary opacity-10" />
          <RobotFace mood={open ? "happy" : "waving"} className="il-bob size-10" />
        </button>
      </div>
    </div>
  );
}
