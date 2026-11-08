import { NextResponse } from "next/server";
import { clientKey, createRateLimiter } from "@/lib/security/rate-limit";
import { checkFormToken } from "@/lib/security/form-token";
import { isSameOrigin } from "@/lib/security/same-origin";
import { contactSchema, isHoneypotHit } from "@/lib/validation/contact";
import { sendContactEmail } from "@/services/email";

const MAX_BODY_BYTES = 16 * 1024;
const checkLimit = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });
// A ceiling on all messages per instance per day, so a flood cannot exhaust the email quota.
const checkDaily = createRateLimiter({ limit: 40, windowMs: 24 * 60 * 60 * 1000 });

/** Reads the body, stopping as soon as it passes the size limit. Returns null if it is too large. */
async function readLimited(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder().decode(Buffer.concat(chunks));
}

const reply = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

export async function POST(request: Request) {
  if (!isSameOrigin(request.headers)) return reply(403, { error: "Request not allowed." });

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return reply(415, { error: "Unsupported content type." });
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return reply(413, { error: "Message is too large." });

  const limit = checkLimit(clientKey(request.headers));
  if (!limit.allowed) {
    return reply(429, { error: "Too many messages. Please try again later." }, { "Retry-After": String(limit.retryAfterSeconds) });
  }

  let raw: string | null;
  try {
    raw = await readLimited(request);
  } catch {
    return reply(400, { error: "Could not read the request." });
  }
  if (raw === null) return reply(413, { error: "Message is too large." });

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return reply(400, { error: "Invalid request." });
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      fieldErrors[field] ??= issue.message;
    }
    return reply(422, { error: "Please check the highlighted fields.", fieldErrors });
  }

  if (isHoneypotHit(parsed.data)) return reply(200, { ok: true });
  const token = checkFormToken(parsed.data.formToken);
  if (token === "too-fast") return reply(429, { error: "That was very quick. Please wait a moment and send it again." });
  if (token !== "ok") return reply(400, { error: "This form has expired. Please reload the page and try again." });
  if (!checkDaily("all").allowed) return reply(429, { error: "The inbox is busy today. Please use email instead." });

  const outcome = await sendContactEmail(parsed.data);
  if (outcome === "sent") return reply(200, { ok: true });
  if (outcome === "unconfigured") return reply(503, { error: "The contact form is not available right now. Please use email instead." });
  return reply(502, { error: "Your message could not be sent. Please try again or use email." });
}
