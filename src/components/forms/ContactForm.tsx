"use client";

import { CheckCircle2, CircleAlert, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/primitives";
import { profile } from "@/content/profile";
import { contactSchema } from "@/lib/validation/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";
type Field = "name" | "email" | "subject" | "message";

const fieldClass = "mt-1.5 w-full rounded-lg border bg-surface px-3 py-2.5 text-[0.95rem] transition-colors placeholder:text-muted focus:border-primary";

function Text({ name, label, error, ...props }: { name: Field; label: string; error?: string } & React.ComponentProps<"input">) {
  return (
    <div>
      <label htmlFor={`contact-${name}`} className="text-sm font-medium">{label}</label>
      <input
        id={`contact-${name}`}
        name={name}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `contact-${name}-error` : undefined}
        className={cn(fieldClass, error ? "border-warn-ink" : "border-line")}
        {...props}
      />
      {error && <p id={`contact-${name}-error`} className="mt-1 text-sm text-warn-ink">{error}</p>}
    </div>
  );
}

export function ContactForm({ formToken }: { formToken: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { ...data, formToken };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const next: Partial<Record<Field, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Field;
        next[key] ??= issue.message;
      }
      setErrors(next);
      setStatus("idle");
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json()) as { error?: string; fieldErrors?: Partial<Record<Field, string>> };
      if (response.ok) {
        form.reset();
        setStatus("sent");
        setMessage("Thank you. Your message has been sent, and I will reply by email.");
        return;
      }
      setErrors(body.fieldErrors ?? {});
      setStatus("error");
      setMessage(body.error ?? "Something went wrong. Please try again.");
    } catch {
      setStatus("error");
      setMessage("The message could not be sent. Please check your connection and try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-5 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <Text name="name" label="Name" autoComplete="name" error={errors.name} />
        <Text name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
      </div>
      <Text name="subject" label="Subject" error={errors.subject} />
      <div>
        <label htmlFor="contact-message" className="text-sm font-medium">Message</label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={cn(fieldClass, "resize-y", errors.message ? "border-warn-ink" : "border-line")}
        />
        {errors.message && <p id="contact-message-error" className="mt-1 text-sm text-warn-ink">{errors.message}</p>}
      </div>
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Leave this field empty
          <input type="text" name="verification_note" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" && <Loader2 className="size-4 animate-spin" aria-hidden />}
          {status === "sending" ? "Sending" : "Send message"}
        </Button>
      </div>

      <div aria-live="polite">
        {status === "sent" && (
          <p className="flex items-start gap-2 rounded-lg bg-ok-soft p-3 text-sm text-ok-ink">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> {message}
          </p>
        )}
        {status === "error" && (
          <p className="flex items-start gap-2 rounded-lg bg-warn-soft p-3 text-sm text-warn-ink">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              {message}{" "}
              <a href={`mailto:${profile.email}`} className="underline">Email me directly</a>.
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
