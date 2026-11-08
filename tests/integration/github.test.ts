import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGithubSnapshot } from "@/services/github";

const repo = {
  name: "TourIndia",
  html_url: "https://github.com/Supriyo016/TourIndia",
  description: null,
  language: "HTML",
  stargazers_count: 0,
  forks_count: 0,
  fork: false,
  pushed_at: "2023-07-05T09:23:14Z",
};

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe("GitHub integration", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  const stubFetch = (handler: (url: string) => Response | Promise<Response>) => {
    const mock = vi.fn((url: string) => Promise.resolve(handler(url)));
    vi.stubGlobal("fetch", mock);
    return mock;
  };

  it("returns validated data", async () => {
    stubFetch((url) => (url.includes("/repos") ? json([repo]) : json({ public_repos: 5, followers: 1 })));
    const snapshot = await getGithubSnapshot();
    expect(snapshot?.user.public_repos).toBe(5);
    expect(snapshot?.repos.map((item) => item.name)).toEqual(["TourIndia"]);
  });

  it("returns null when the network fails", async () => {
    stubFetch(() => Promise.reject(new Error("network down")));
    await expect(getGithubSnapshot()).resolves.toBeNull();
  });

  it("returns null when rate limited", async () => {
    stubFetch(() => json({ message: "rate limit" }, 403));
    await expect(getGithubSnapshot()).resolves.toBeNull();
  });

  it("rejects a malformed response instead of rendering it", async () => {
    stubFetch((url) => (url.includes("/repos") ? json([{ name: 42, html_url: "javascript:alert(1)" }]) : json({ public_repos: 5, followers: 1 })));
    await expect(getGithubSnapshot()).resolves.toBeNull();
  });

  it("sends the token only as a header and never logs it", async () => {
    vi.stubEnv("GITHUB_TOKEN", "test-token-value");
    const mock = stubFetch(() => json({ message: "nope" }, 500));
    await getGithubSnapshot();
    const [url, init] = mock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).not.toContain("test-token-value");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-token-value");
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("test-token-value");
  });
});
