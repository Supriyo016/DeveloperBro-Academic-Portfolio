import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

const ORIGIN = "https://site.example";
const body = { name: "Ada Lovelace", email: "ada@example.com", subject: "Collaboration", message: "A message that is long enough to pass." };
let ip = 0;

function request(payload: unknown, headers: Record<string, string> = {}) {
  ip += 1;
  return new Request(`${ORIGIN}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN, host: "site.example", "x-forwarded-for": `198.51.100.${ip}`, ...headers },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

const human = () => ({ ...body, fillMs: 10_000 });

describe("POST /api/contact", () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "site@example.com");
  });

  afterEach(() => vi.unstubAllEnvs());

  const post = async (req: Request) => (await import("@/app/api/contact/route")).POST(req);

  it("sends a valid message as plain text with reply-to", async () => {
    const response = await post(request(human()));
    expect(response.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    const message = send.mock.calls[0]?.[0];
    expect(message.replyTo).toBe(body.email);
    expect(message.to).toBe("owner@example.com");
    expect(message.html).toBeUndefined();
  });

  it("rejects cross-origin requests", async () => {
    const response = await post(request(human(), { origin: "https://evil.example" }));
    expect(response.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects other content types", async () => {
    expect((await post(request(human(), { "content-type": "text/plain" }))).status).toBe(415);
  });

  it("rejects oversized bodies, including under-declared ones", async () => {
    const big = { ...human(), message: "x".repeat(20_000) };
    expect((await post(request(big, { "content-length": "20100" }))).status).toBe(413);
    expect((await post(request(big))).status).toBe(413);
  });

  it("rejects malformed JSON", async () => {
    expect((await post(request("{not json"))).status).toBe(400);
  });

  it("returns field errors for invalid input", async () => {
    const response = await post(request({ ...human(), email: "nope" }));
    expect(response.status).toBe(422);
    expect((await response.json()).fieldErrors.email).toBeTruthy();
  });

  it("quietly drops honeypot submissions", async () => {
    const response = await post(request({ ...human(), verification_note: "http://spam.example" }));
    expect(response.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("tells a fast sender to retry rather than silently dropping the message", async () => {
    const response = await post(request({ ...body, fillMs: 300 }));
    expect(response.status).toBe(429);
    expect(send).not.toHaveBeenCalled();
    expect((await response.json()).error).toContain("send it again");
  });

  it("rate limits one client", async () => {
    const fixed = { "x-forwarded-for": "203.0.113.77" };
    for (let attempt = 0; attempt < 5; attempt += 1) expect((await post(request(human(), fixed))).status).toBe(200);
    const blocked = await post(request(human(), fixed));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("retry-after")).toBeTruthy();
  });

  it("reports when email is not configured, without leaking why", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const response = await post(request(human()));
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toMatch(/RESEND|key/i);
  });

  it("hides provider errors from the visitor", async () => {
    send.mockResolvedValue({ data: null, error: { name: "validation_error", message: "secret detail" } });
    const response = await post(request(human()));
    expect(response.status).toBe(502);
    expect(JSON.stringify(await response.json())).not.toContain("secret detail");
  });
});
