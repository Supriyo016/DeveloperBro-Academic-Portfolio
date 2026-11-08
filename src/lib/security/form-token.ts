import { createHmac, timingSafeEqual } from "node:crypto";

// A signed timestamp issued with the contact page. The route accepts a message only if the token is genuine,
// at least MIN_AGE_MS old (a person needs time to write) and not stale. A script cannot fake the age, because
// the signature uses a server-side secret.
export const MIN_AGE_MS = 3000;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

const secret = () => process.env.CONTACT_FORM_SECRET || process.env.RESEND_API_KEY || "local-development-only";
const sign = (issuedAt: string) => createHmac("sha256", secret()).update(`contact:${issuedAt}`).digest("base64url");

export function issueFormToken(now = Date.now()): string {
  return `${now}.${sign(String(now))}`;
}

export type TokenCheck = "ok" | "invalid" | "too-fast" | "expired";

export function checkFormToken(token: unknown, now = Date.now()): TokenCheck {
  if (typeof token !== "string") return "invalid";
  const [issuedAt = "", signature = ""] = token.split(".");
  if (!/^\d{13}$/.test(issuedAt)) return "invalid";
  const expected = Buffer.from(sign(issuedAt));
  const given = Buffer.from(signature);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return "invalid";
  const age = now - Number(issuedAt);
  if (age < MIN_AGE_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}
