import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { profile } from "@/content/profile";
import { buildCsp, securityHeaders } from "@/lib/security/headers";
import { clientKey, createRateLimiter } from "@/lib/security/rate-limit";
import { isSameOrigin } from "@/lib/security/same-origin";
import { checkFormToken, issueFormToken } from "@/lib/security/form-token";
import { contactSchema, isHoneypotHit } from "@/lib/validation/contact";

const valid = { name: "Ada Lovelace", email: "ada@example.com", subject: "Collaboration", message: "A message that is long enough to pass." };

describe("contact validation", () => {
  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects header injection in single-line fields", () => {
    expect(contactSchema.safeParse({ ...valid, subject: "Hi\r\nBcc: victim@example.com" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, name: "A\nB" }).success).toBe(false);
  });

  it("rejects unknown fields to prevent mass assignment", () => {
    expect(contactSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it("rejects NoSQL-style operator objects", () => {
    expect(contactSchema.safeParse({ ...valid, email: { $gt: "" } }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: { $ne: null } }).success).toBe(false);
  });

  it("enforces length limits", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(5001) }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, message: "short" }).success).toBe(false);
  });

  it("flags the honeypot and implausibly fast or missing timing", () => {
    expect(isHoneypotHit({ ...valid, verification_note: "spam" })).toBe(true);
    expect(isHoneypotHit({ ...valid, verification_note: "" })).toBe(false);
    const now = Date.now();
    expect(checkFormToken(issueFormToken(now - 500), now)).toBe("too-fast");
    expect(checkFormToken(issueFormToken(now - 10_000), now)).toBe("ok");
    expect(checkFormToken(issueFormToken(now - 7 * 60 * 60 * 1000), now)).toBe("expired");
    expect(checkFormToken(`${now - 10_000}.forged`, now)).toBe("invalid");
    expect(checkFormToken(undefined, now)).toBe("invalid");
  });
});

describe("rate limiter", () => {
  it("blocks after the limit and recovers after the window", () => {
    const check = createRateLimiter({ limit: 2, windowMs: 1000 });
    expect(check("ip", 0).allowed).toBe(true);
    expect(check("ip", 1).allowed).toBe(true);
    const blocked = check("ip", 2);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    expect(check("other", 2).allowed).toBe(true);
    expect(check("ip", 1001).allowed).toBe(true);
  });

  it("uses the first forwarded address", () => {
    expect(clientKey(new Headers({ "x-forwarded-for": "203.0.113.5, 10.0.0.1" }))).toBe("203.0.113.5");
    expect(clientKey(new Headers())).toBe("unknown");
  });
});

describe("same-origin check", () => {
  it("accepts matching and rejects foreign, missing or malformed origins", () => {
    expect(isSameOrigin(new Headers({ origin: "https://site.example", host: "site.example" }))).toBe(true);
    expect(isSameOrigin(new Headers({ origin: "https://evil.example", host: "site.example" }))).toBe(false);
    expect(isSameOrigin(new Headers({ host: "site.example" }))).toBe(false);
    expect(isSameOrigin(new Headers({ origin: "not a url", host: "site.example" }))).toBe(false);
  });
});

describe("security headers", () => {
  it("builds a strict production CSP", () => {
    const csp = buildCsp({ nonce: "abc", isDev: false, upgradeInsecure: true });
    expect(csp).toContain("script-src 'self' 'nonce-abc' 'strict-dynamic'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
  });

  it("sends HSTS only when asked", () => {
    expect(securityHeaders({ hsts: true })).toHaveProperty("Strict-Transport-Security");
    expect(securityHeaders({ hsts: false })).not.toHaveProperty("Strict-Transport-Security");
  });
});

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

describe("repository hygiene", () => {
  const sources = walk("src").filter((file) => /\.(ts|tsx|mdx|json|css)$/.test(file));

  it("contains no phone numbers or private CV field labels", () => {
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/\+91[\s-]?\d{5}/);
      expect(text, file).not.toMatch(/Father['’]s Name|Date of Birth|Marital Status/i);
    }
  });

  it("hardcodes no credentials", () => {
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/re_[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|mongodb(\+srv)?:\/\//);
    }
  });

  it("reads secrets only in server code", () => {
    const clientFiles = sources.filter((file) => /\.tsx?$/.test(file) && readFileSync(file, "utf8").startsWith('"use client"'));
    for (const file of clientFiles) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/RESEND_API_KEY|GITHUB_TOKEN|CONTACT_TO_EMAIL/);
    }
  });

  it("publishes only the public CV", () => {
    expect(readdirSync("public/documents")).toEqual(["academic-cv-public.pdf"]);
    expect(profile.cvPath).toBe("/documents/academic-cv-public.pdf");
  });

  it("lists only social accounts confirmed by the GitHub profile or CV", () => {
    expect(profile.social.map((item) => item.id).sort()).toEqual(["facebook", "github", "instagram", "linkedin", "x"]);
    for (const item of profile.social) expect(item.url).toMatch(/^https:\/\//);
  });

  it("keeps secrets and private notes out of git", () => {
    const ignore = readFileSync(".gitignore", "utf8");
    expect(ignore).toContain(".env");
    expect(ignore).toContain("docs/private/");
  });
});
