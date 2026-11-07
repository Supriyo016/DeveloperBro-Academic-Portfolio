import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { routes } from "./routes";

const widths = [320, 375, 425, 768, 1024, 1440, 1920];

test.describe("responsive layout", () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of routes) {
        await page.goto(route);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${route} at ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test("touch targets stay usable on a small phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const route of ["/", "/research", "/projects", "/contact"]) {
      await page.goto(route);
      const small = await page.locator("main button:visible").evaluateAll((buttons) =>
        buttons.filter((button) => button.getBoundingClientRect().height < 24).map((button) => button.textContent),
      );
      expect(small, route).toEqual([]);
    }
  });
});

test.describe("accessibility", () => {
  for (const theme of ["light", "dark"] as const) {
    for (const route of routes) {
      test(`axe ${theme} ${route}`, async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
        await page.goto(route);
        await page.evaluate(() => document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible")));
        await page.waitForTimeout(900);
        const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
        expect(violations.map((item) => `${item.id}: ${item.nodes.map((node) => node.target.join(" ")).slice(0, 3).join(" | ")}`)).toEqual([]);
      });
    }
  }

  test("reduced motion shows all content without animation", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator(".il-packet").first()).toBeHidden();
    const hidden = await page.locator(".reveal").evaluateAll((items) => items.filter((item) => getComputedStyle(item).opacity !== "1").length);
    expect(hidden).toBe(0);
    await context.close();
  });

  test("content appears if the JavaScript bundle fails to load", async ({ page }) => {
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveClass(/\bjs\b/, { timeout: 7000 });
    const hidden = await page.locator(".reveal").evaluateAll((items) => items.filter((item) => getComputedStyle(item).opacity !== "1").length);
    expect(hidden).toBe(0);
  });

  test("content is readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const hidden = await page.locator(".reveal").evaluateAll((items) => items.filter((item) => getComputedStyle(item).opacity !== "1").length);
    expect(hidden).toBe(0);
    await context.close();
  });
});

test.describe("security in the browser", () => {
  test("every page sends security headers with a unique nonce", async ({ request }) => {
    const nonces = new Set<string>();
    for (const route of ["/", "/research", "/contact"]) {
      const headers = (await request.get(route)).headers();
      const csp = headers["content-security-policy"] ?? "";
      expect(csp).toContain("frame-ancestors 'none'");
      expect(csp).not.toContain("unsafe-eval");
      expect(headers["x-content-type-options"]).toBe("nosniff");
      expect(headers["x-frame-options"]).toBe("DENY");
      expect(headers["referrer-policy"]).toBeTruthy();
      expect(headers["x-powered-by"]).toBeUndefined();
      nonces.add(/nonce-([^']+)/.exec(csp)?.[1] ?? "");
    }
    expect(nonces.size).toBe(3);
  });

  test("no page triggers a CSP violation or console error", async ({ page }) => {
    const problems: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error" && !/404|Failed to load resource/.test(message.text())) problems.push(message.text());
    });
    page.on("pageerror", (error) => problems.push(error.message));
    for (const route of routes) {
      await page.goto(route, { waitUntil: "load" });
      await page.waitForTimeout(500);
    }
    expect(problems).toEqual([]);
  });

  const injectMarkup = () =>
    new Promise<boolean>((resolve) => {
      const host = document.createElement("div");
      host.innerHTML = `<img src="/does-not-exist.png" onerror="window.__pwned = true"><a href="javascript:window.__pwned=true" id="x">x</a>`;
      document.body.appendChild(host);
      host.querySelector<HTMLAnchorElement>("#x")?.click();
      setTimeout(() => resolve((window as unknown as { __pwned?: boolean }).__pwned === true), 400);
    });

  test("injected markup cannot run script, with a no-CSP control", async ({ page, browser }) => {
    await page.goto("/");
    expect(await page.evaluate(injectMarkup)).toBe(false);

    const control = await browser.newPage();
    await control.route("**/*", (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><body></body>" }));
    await control.goto("http://control.test/");
    expect(await control.evaluate(injectMarkup)).toBe(true);
    await control.close();
  });

  test("a parser-inserted script without a nonce is blocked", async ({ page }) => {
    const seen: string[] = [];
    page.on("console", (message) => seen.push(message.text()));
    await page.route("**/", async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace("</body>", "<script>window.__pwned = true</script></body>");
      await route.fulfill({ response, body });
    });
    await page.goto("/");
    expect(await page.evaluate(() => (window as unknown as { __pwned?: boolean }).__pwned === true)).toBe(false);
    expect(seen.some((text) => text.includes("Content Security Policy"))).toBe(true);
  });

  test("a script from another origin is blocked", async ({ page }) => {
    let requested = false;
    await page.route("https://evil.example/**", (route) => {
      requested = true;
      return route.fulfill({ contentType: "text/javascript", body: "window.__pwned = true" });
    });
    await page.route("**/", async (route) => {
      const response = await route.fetch();
      const body = (await response.text()).replace("</body>", '<script src="https://evil.example/x.js"></script></body>');
      await route.fulfill({ response, body });
    });
    await page.goto("/");
    expect(requested).toBe(false);
  });

  test("path traversal and the private docs folder are not served", async ({ request }) => {
    expect((await request.get("/documents/..%2f..%2fpackage.json")).status()).toBeGreaterThanOrEqual(400);
    expect((await request.get("/docs/private/RESEARCH_VERIFICATION.md")).status()).toBe(404);
    expect((await request.get("/.env")).status()).toBe(404);
  });

  test("contact API refuses cross-origin and wrong methods", async ({ request }) => {
    const foreign = await request.post("/api/contact", { headers: { origin: "https://evil.example" }, data: {} });
    expect(foreign.status()).toBe(403);
    expect((await request.get("/api/contact")).status()).toBe(405);
  });

  test("external links use noopener", async ({ page }) => {
    for (const route of ["/", "/projects/tour-india", "/contact"]) {
      await page.goto(route);
      const unsafe = await page.locator('a[target="_blank"]:not([rel*="noopener"])').count();
      expect(unsafe, route).toBe(0);
    }
  });
});
