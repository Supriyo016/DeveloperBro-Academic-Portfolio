import { expect, test } from "@playwright/test";

test.describe("navigation", () => {
  test("primary links reach their pages", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("link", { name: "Research Works" }).click();
    await expect(page).toHaveURL(/\/research$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Learning from data");
    await nav.getByRole("link", { name: "Blogs" }).click();
    await expect(page).toHaveURL(/\/blogs$/);
    await nav.getByRole("link", { name: "About Me" }).click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test("old blog addresses redirect to blogs", async ({ page }) => {
    await page.goto("/blog/encrypted-fedavg-with-ckks");
    await expect(page).toHaveURL(/\/blogs\/encrypted-fedavg-with-ckks$/);
  });

  test("mobile menu works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Projects" }).click();
    await expect(page).toHaveURL(/\/projects$/);
    await expect(dialog).toBeHidden();
  });

  test("skip link moves to main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("theme", () => {
  test("toggle applies and persists across reload and navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Dark theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Light theme" }).click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await page.goto("/about");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("follows the system preference by default", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await context.close();
  });

  test("sets the theme before first paint", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.route("**/_next/static/**", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });
});

test.describe("interactive research features", () => {
  test("research map traces connections and links to work", async ({ page }) => {
    await page.goto("/research");
    await page.getByRole("button", { name: "Quantum Computing", exact: true }).click();
    await expect(page.getByRole("link", { name: "IBMQ gate study" })).toBeVisible();
    await expect(page.getByText("leads to 1 piece of work")).toBeVisible();
  });

  test("interest explorer supports keyboard and states evidence honestly", async ({ page }) => {
    await page.goto("/research");
    await page.getByRole("tab", { name: "Federated Learning" }).focus();
    await page.getByRole("tab", { name: "Large Language Models" }).click();
    await expect(page.getByRole("tabpanel")).toContainText("Current interest");
    await expect(page.getByRole("tabpanel")).toContainText("no completed project");
    await page.keyboard.press("ArrowUp");
    await expect(page.getByRole("tab", { name: "Natural Language Processing" })).toHaveAttribute("aria-selected", "true");
  });

  test("research explorer filters and clears", async ({ page }) => {
    await page.goto("/research");
    await page.getByLabel("Search research").fill("superposition");
    await expect(page.getByText("1 result", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(page.getByLabel("Search research")).toHaveValue("");
    await page.getByLabel("Search research").fill("zzzz");
    await expect(page.getByText("Nothing matches those filters.")).toBeVisible();
  });

  test("case study shows the encryption note, results and pipeline", async ({ page }) => {
    await page.goto("/research/federated-alzheimers-detection");
    await expect(page.getByText("What was and was not encrypted")).toBeVisible();
    await page.getByRole("button", { name: /MobileNetV2 with FedProx/ }).click();
    await expect(page.getByText("Experiment 2", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Macro AUC" }).click();
    await expect(page.getByRole("button", { name: /Custom CNN with FedDyn: 99\.24%/ })).toBeVisible();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByText("10 epochs on each client's own images")).toBeVisible();
    await page.getByRole("button", { name: "Follow-up design" }).click();
    await expect(page.getByText("Related files kept together")).toBeVisible();
  });

  test("thesis figures load with reserved space", async ({ page }) => {
    await page.goto("/research/federated-alzheimers-detection");
    const figures = page.locator("#results figure img");
    await expect(figures).toHaveCount(2);
    for (const image of await figures.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
      expect((await image.boundingBox())?.height ?? 0).toBeGreaterThan(100);
    }
  });

  test("charts offer a table view", async ({ page }) => {
    await page.goto("/research/federated-alzheimers-detection");
    await page.getByText("Show data table").first().click();
    await expect(page.getByRole("cell", { name: "4,038" })).toBeVisible();
  });

  test("project filters narrow the list and detail links work", async ({ page }) => {
    await page.goto("/projects");
    await page.getByRole("button", { name: "Embedded Systems" }).click();
    await expect(page.getByText("1 project", { exact: true })).toBeVisible();
    await page.getByRole("link", { name: /Third Hand-Eye/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Third Hand-Eye");
    await expect(page.getByRole("link", { name: /Source on GitHub/ })).toHaveAttribute("rel", /noopener/);
  });

  test("skill explorer links skills and work both ways", async ({ page }) => {
    await page.goto("/skills");
    await page.getByRole("button", { name: "Arduino IDE" }).click();
    await page.getByRole("button", { name: "Third Hand-Eye" }).click();
    await expect(page.getByRole("button", { name: "C++" })).toHaveClass(/bg-primary-soft/);
  });

  test("research map does not attach secure aggregation to the dissertation", async ({ page }) => {
    await page.goto("/research");
    await page.getByRole("button", { name: "CKKS secure aggregation" }).click();
    await expect(page.getByText("leads to 1 piece of work")).toBeVisible();
    await expect(page.getByRole("link", { name: "Distillation notes" }).first()).toBeVisible();
  });

  test("closing a dialog returns focus to the page", async ({ page }) => {
    await page.goto("/");
    const launcher = page.getByRole("button", { name: /terminal/ });
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await launcher.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Terminal" })).toBeHidden();
    await expect(launcher).toBeFocused();
  });

  test("terminal opens by key, runs commands and navigates", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.keyboard.press("`");
    const dialog = page.getByRole("dialog", { name: "Terminal" });
    await expect(dialog).toBeVisible();
    const input = dialog.getByLabel("Terminal command");
    await input.fill("whoami");
    await input.press("Enter");
    await expect(dialog).toContainText("Supriyo Sarkar");
    await input.fill("open cv");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/cv$/);
  });
});

test.describe("home page", () => {
  test("carousel moves by button, pauses, and hides inactive slides from assistive tech", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Supriyo Sarkar");
    await expect(page.getByRole("heading", { name: /How can hospitals/ })).toBeVisible();
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(page.getByRole("heading", { name: "Keeping updates private" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /How can hospitals/ })).toBeHidden();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Play automatic slides" })).toBeVisible();
    await page.getByRole("button", { name: /Show slide 5/ }).click();
    await expect(page.getByRole("heading", { name: /How well do gates behave/ })).toBeVisible();
    await page.getByRole("button", { name: /Show slide 7/ }).click();
    await expect(page.getByRole("heading", { name: "From simulation towards real hospitals" })).toBeVisible();
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(page.getByRole("heading", { name: /How can hospitals/ })).toBeVisible();
  });

  test("autoplay does not rotate while keyboard focus is in a slide", async ({ page }) => {
    await page.clock.install();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.getByRole("link", { name: "About my background" }).focus();
    await page.clock.runFor(30_000);
    await expect(page.getByRole("heading", { name: /How can hospitals/ })).toBeVisible();
    await page.getByRole("button", { name: "Pause automatic slides" }).focus();
    await page.clock.runFor(10_000);
    await expect(page.getByRole("heading", { name: "Keeping updates private" })).toBeVisible();
  });

  test("autoplay stays off with reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Play automatic slides" })).toBeVisible();
    await context.close();
  });

  test("shows every required section and action", async ({ page }) => {
    await page.goto("/");
    for (const name of ["Two dissertations, one research path", "What I work on", "Computer science and engineering, step by step", "Built along the way", "Research notes"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }
    await expect(page.getByRole("link", { name: "Download academic CV" })).toHaveAttribute("href", "/documents/academic-cv-public.pdf");
    await expect(page.getByRole("link", { name: "Contact me" })).toBeVisible();
  });

  test("global search opens by keyboard and navigates", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Search the site" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("combobox").fill("arduino");
    await expect(dialog.getByRole("option", { name: /Third Hand-Eye/ })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/third-hand-eye$/);
    await expect(dialog).toBeHidden();
  });

  test("back to top appears after scrolling", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.evaluate(() => window.scrollTo({ top: 1500, behavior: "instant" }));
    const button = page.getByRole("button", { name: "Back to top" });
    await expect(button).toHaveClass(/opacity-100/);
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("social links are verified accounts with safe attributes", async ({ page }) => {
    await page.goto("/contact");
    const footer = page.locator(".site-layer > footer");
    for (const [name, href] of [["LinkedIn", "linkedin.com/in/supriyo-sarkar"], ["GitHub", "github.com/Supriyo016"], ["X", "x.com/Supriyo016"], ["Instagram", "instagram.com/supriyo016"], ["Facebook", "100070487584093"]] as const) {
      const link = footer.getByRole("link", { name: `${name} profile` });
      await expect(link).toHaveAttribute("href", new RegExp(href));
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("research depth", () => {
  test("case study includes the full academic structure", async ({ page }) => {
    await page.goto("/research/federated-alzheimers-detection");
    for (const name of ["Research gaps", "Dataset", "Models and algorithms", "Evaluation metrics", "Comparative analysis", "Contributions", "Limitations", "References", "Cite this work"]) {
      await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
    }
    await expect(page.getByRole("button", { name: "Copy BibTeX" })).toBeVisible();
    await expect(page.getByRole("cell", { name: "Not reached" }).first()).toBeVisible();
  });

  test("research explorer filters by status, and proposed work is labelled", async ({ page }) => {
    await page.goto("/research");
    await page.getByRole("button", { name: "More filters" }).click();
    await page.getByRole("combobox", { name: /^Status/ }).selectOption("Completed");
    await expect(page.getByText("2 results", { exact: true })).toBeVisible();
    await expect(page.locator("#proposed").getByText("Proposed", { exact: true }).first()).toBeVisible();
  });

  test("project page shows verified implementation detail and repository stats", async ({ page }) => {
    await page.goto("/projects/third-hand-eye");
    await expect(page.getByText("Trigger on pin 12")).toBeVisible();
    await expect(page.getByText(/Repository updated|Live repository data is unavailable/)).toBeVisible({ timeout: 12_000 });
  });
});

test.describe("writing", () => {
  test("filters, opens an article and shows reading aids", async ({ page }) => {
    await page.goto("/blogs");
    await page.getByRole("button", { name: "Privacy" }).click();
    await page.getByRole("link", { name: /Encrypted FedAvg/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Encrypted FedAvg");
    await expect(page.getByText(/min read/)).toBeVisible();
    await expect(page.locator("pre code").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Who holds which key" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy link" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Copy code" }).first()).toBeVisible();
    await expect(page.locator(".katex").first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "References" })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Previous and next articles" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Related notes" })).toBeVisible();
  });

  test("reading progress bar grows as the reader scrolls", async ({ page }) => {
    await page.goto("/blogs/encrypted-fedavg-with-ckks");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    const bar = page.getByTestId("reading-progress");
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "instant" }));
    await expect.poll(async () => (await bar.boundingBox())?.width ?? 0).toBeGreaterThan(100);
  });

  test("reading mode hides site chrome and bookmarks persist", async ({ page }) => {
    await page.goto("/blogs/encrypted-fedavg-with-ckks");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.getByRole("button", { name: "Reading mode" }).click();
    await expect(page.locator(".site-layer > header")).toBeHidden();
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog", { name: "Search the site" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Search the site" })).toBeHidden();
    await page.getByRole("button", { name: "Exit reading mode" }).click();
    await expect(page.locator(".site-layer > header")).toBeVisible();
    await page.getByRole("button", { name: "Save" }).click();
    await page.goto("/blogs");
    await expect(page.getByRole("button", { name: "Saved (1)" })).toBeVisible();
    await page.getByRole("button", { name: "Saved (1)" }).click();
    await expect(page.getByRole("link", { name: /Encrypted FedAvg/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Batch Normalisation/ })).toHaveCount(0);
  });

  test("every article renders, and its table of contents links reach their headings", async ({ page }) => {
    await page.goto("/blogs");
    const slugs = [...new Set((await page.locator('main a[href^="/blogs/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""))).map((href) => href.replace("/blogs/", "")))];
    expect(slugs.length).toBeGreaterThanOrEqual(25);
    for (const slug of slugs) {
      const response = await page.goto(`/blogs/${slug}`);
      expect(response?.status(), slug).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }), slug).toBeVisible();
      await expect(page.locator(".prose-article"), slug).not.toContainText("undefined");
      await expect(page.locator(".prose-article"), slug).not.toContainText("NaN");
      for (const anchor of await page.getByRole("navigation", { name: "Table of contents" }).getByRole("link").all()) {
        const id = decodeURIComponent((await anchor.getAttribute("href"))?.slice(1) ?? "");
        await expect(page.locator(`[id="${id}"]`), `${slug}#${id}`).toHaveCount(1);
      }
    }
  });
});

test.describe("CV", () => {
  test("offers web, PDF preview and download of the public copy", async ({ page, request }) => {
    await page.goto("/cv");
    await expect(page.getByText("Last updated")).toBeVisible();
    await page.getByRole("button", { name: "PDF preview" }).click();
    await expect(page.getByTitle(/Academic CV/)).toBeVisible();
    const pdf = await request.get("/documents/academic-cv-public.pdf");
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-type"]).toContain("pdf");
    expect(pdf.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  });

  test("download button delivers the file", async ({ page }) => {
    await page.goto("/cv");
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("link", { name: "Download PDF" }).click()]);
    expect(download.suggestedFilename()).toBe("academic-cv-public.pdf");
  });

  test("print layout keeps the name and hides site chrome, even in dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/cv");
    await page.emulateMedia({ media: "print" });
    const name = page.locator("main header p").first();
    await expect(name).toBeVisible();
    await expect(name).toHaveText("Supriyo Sarkar");
    await expect(name).toHaveCSS("color", "rgb(0, 0, 0)");
    await expect(page.getByRole("button", { name: "Print" })).toBeHidden();
    await expect(page.locator(".site-layer > footer")).toBeHidden();
  });

  test("web version omits private fields", async ({ page }) => {
    await page.goto("/cv");
    const text = await page.locator("main").innerText();
    expect(text).not.toMatch(/\+91|Date of Birth|Father|Marital/);
  });
});

test.describe("contact form", () => {
  test("shows accessible validation errors", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByLabel("Name")).toBeFocused();
  });

  test("reports clearly when email delivery is not configured", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Name").fill("Test Visitor");
    await page.getByRole("textbox", { name: "Email" }).fill("visitor@example.com");
    await page.getByLabel("Subject").fill("Collaboration");
    await page.getByLabel("Message").fill("I would like to talk about federated learning.");
    await page.waitForTimeout(3200);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("not available right now")).toBeVisible();
    await expect(page.getByRole("link", { name: "Email me directly" })).toBeVisible();
  });
});

test.describe("GitHub", () => {
  test("shows live repositories or a graceful fallback", async ({ page }) => {
    const response = await page.goto("/github");
    expect(response?.status()).toBe(200);
    const live = page.getByRole("link", { name: /TourIndia/ });
    const fallback = page.getByText("GitHub data is unavailable right now.");
    await expect(live.or(fallback).first()).toBeVisible({ timeout: 12_000 });
    await expect(page.getByLabel("Loading repositories")).toHaveCount(0);
  });
});

test.describe("errors and SEO", () => {
  test("unknown routes return a real 404", async ({ page, request }) => {
    expect((await request.get("/nope")).status()).toBe(404);
    expect((await request.get("/research/nope")).status()).toBe(404);
    expect((await request.get("/blogs/nope")).status()).toBe(404);
    await page.goto("/nope");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("dropped out");
  });

  test("pages have unique titles, descriptions and canonicals", async ({ page }) => {
    const seen = new Set<string>();
    for (const path of ["/", "/research", "/projects", "/blogs", "/cv", "/contact"]) {
      await page.goto(path);
      const title = await page.title();
      expect(seen.has(title)).toBe(false);
      seen.add(title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{30,}/);
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    }
  });

  test("article pages advertise the RSS feed", async ({ page }) => {
    await page.goto("/blogs/encrypted-fedavg-with-ckks");
    await expect(page.locator('link[type="application/rss+xml"]')).toHaveAttribute("href", /feed\.xml/);
  });

  test("RSS feed lists articles", async ({ request }) => {
    const feed = await request.get("/feed.xml");
    expect(feed.headers()["content-type"]).toContain("rss");
    expect(await feed.text()).toContain("/blogs/encrypted-fedavg-with-ckks");
  });

  test("structured data, sitemap and robots are served", async ({ page, request }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    expect(JSON.parse(json ?? "{}")["@type"]).toBe("Person");
    expect(await (await request.get("/sitemap.xml")).text()).toContain("/research/federated-alzheimers-detection");
    expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /api/");
    expect((await request.get("/opengraph-image")).headers()["content-type"]).toContain("image/png");
  });

  test("all internal links resolve", async ({ page, request }) => {
    const queue = ["/"];
    const seen = new Set<string>();
    while (queue.length) {
      const path = queue.shift() as string;
      if (seen.has(path)) continue;
      seen.add(path);
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
      if (!(response.headers()["content-type"] ?? "").includes("html")) continue;
      await page.goto(path);
      const hrefs = await page.locator("a[href^='/']").evaluateAll((links) => links.map((link) => link.getAttribute("href") ?? ""));
      for (const href of hrefs) queue.push(href.split("#")[0] as string);
    }
    expect(seen.size).toBeGreaterThan(15);
  });

  test("no empty or placeholder links anywhere", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator('a[href="#"], a[href=""]').count()).toBe(0);
  });
});
