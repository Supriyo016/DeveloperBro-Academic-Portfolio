import { NextResponse } from "next/server";
import { clientKey, createRateLimiter } from "@/lib/security/rate-limit";
import { isSameOrigin } from "@/lib/security/same-origin";
import { contactSchema, isHoneypotHit, isTooFast } from "@/lib/validation/contact";
import { sendContactEmail } from "@/services/email";

const MAX_BODY_BYTES = 16 * 1024;
const checkLimit = createRateLimiter({ limit: 5, windowMs: 60 * 60 * 1000 });

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

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return reply(400, { error: "Could not read the request." });
  }
  if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return reply(413, { error: "Message is too large." });

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
  if (isTooFast(parsed.data)) return reply(429, { error: "That was very quick. Please wait a moment and send it again." });

  const outcome = await sendContactEmail(parsed.data);
  if (outcome === "sent") return reply(200, { ok: true });
  if (outcome === "unconfigured") return reply(503, { error: "The contact form is not available right now. Please use email instead." });
  return reply(502, { error: "Your message could not be sent. Please try again or use email." });
}
