import { expect, test } from "@playwright/test";

test.describe("site assistant", () => {
  test("opens, answers from site content, links onward and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    const launcher = page.getByRole("button", { name: "Chat with the site assistant" });
    await launcher.click();
    const dialog = page.getByRole("dialog", { name: /assistant/ });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("log")).toContainText("I'm Bro");
    await expect(page.getByLabel("Ask a question")).toBeFocused();

    await page.getByLabel("Ask a question").fill("Tell me about the Arduino project");
    await page.keyboard.press("Enter");
    await expect(dialog.getByRole("log")).toContainText("HC-SR04", { timeout: 5000 });
    await expect(dialog.getByRole("link", { name: "Project page" }).last()).toHaveAttribute("href", "/projects/third-hand-eye");

    await dialog.getByRole("button", { name: /Tell me about Tour India/ }).click();
    await expect(dialog.getByRole("log")).toContainText("Smart India Hackathon 2022", { timeout: 5000 });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Chat with the site assistant" })).toBeFocused();
  });

  test("keeps the conversation across pages in the same session", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.getByRole("button", { name: "Chat with the site assistant" }).click();
    await page.getByLabel("Ask a question").fill("my name is Asha");
    await page.keyboard.press("Enter");
    await expect(page.getByRole("log")).toContainText("Nice to meet you, Asha", { timeout: 5000 });
    await page.goto("/projects");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    await page.getByRole("button", { name: "Chat with the site assistant" }).click();
    await expect(page.getByRole("log")).toContainText("Nice to meet you, Asha");
  });
});

test.describe("motion", () => {
  test("the pause switch stops animation and is remembered", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-ready", "true");
    const toggle = page.getByRole("button", { name: "Pause animations" });
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    const state = await page.locator(".il-blink").first().evaluate((element) => getComputedStyle(element).animationPlayState);
    expect(state).toBe("paused");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    await page.getByRole("button", { name: "Play animations" }).click();
    await expect(page.locator("html")).not.toHaveAttribute("data-motion", "paused");
  });

  test("illustrations and the background move continuously", async ({ page }) => {
    await page.goto("/");
    const running = await page.evaluate(() =>
      [".il-blink", ".il-nod", ".il-type", ".ambient-blob", ".ambient-glyph", ".il-dash"].map((selector) => {
        const element = document.querySelector(selector);
        return element ? getComputedStyle(element).animationName !== "none" && getComputedStyle(element).animationIterationCount === "infinite" : false;
      }),
    );
    expect(running).toEqual([true, true, true, true, true, true]);
  });
});

test.describe("content scope", () => {
  test("projects and research works list only the chosen items", async ({ page }) => {
    await page.goto("/projects");
    const cards = page.locator('main a[href^="/projects/"]');
    const hrefs = [...new Set(await cards.evaluateAll((links) => links.map((link) => link.getAttribute("href"))))];
    expect(hrefs.sort()).toEqual(["/projects/developerbro-academic-portfolio", "/projects/third-hand-eye", "/projects/tour-india"]);

    await page.goto("/research");
    const studies = [...new Set(await page.locator('main a[href^="/research/"]').evaluateAll((links) => links.map((link) => link.getAttribute("href"))))];
    expect(studies.sort()).toEqual(["/research/federated-alzheimers-detection", "/research/quantum-gate-assessment"]);
  });

  test("removed pages redirect to their closest replacement", async ({ page }) => {
    await page.goto("/research/federated-knowledge-distillation");
    await expect(page).toHaveURL(/\/blogs\/distillation-null-result$/);
    await page.goto("/projects/ibmq-gate-assessment");
    await expect(page).toHaveURL(/\/research\/quantum-gate-assessment$/);
  });

  test("marks appear only on About Me", async ({ page }) => {
    for (const route of ["/", "/education", "/cv", "/achievements", "/research", "/projects"]) {
      await page.goto(route);
      await expect(page.locator("main"), route).not.toContainText(/CGPA|8\.15|8\.95|70\.10|68\.71/);
    }
    await page.goto("/about");
    await expect(page.locator("main")).toContainText("CGPA");
  });

  test("the academic journey shows degrees, research works and projects only", async ({ page }) => {
    await page.goto("/education");
    const items = page.locator("main ol > li");
    await expect(items).toHaveCount(7);
    const kinds = new Set((await items.locator(".card span.rounded-full").allTextContents()).map((text) => text.trim()));
    expect([...kinds].sort()).toEqual(["Degree", "Project", "Research"]);
    await expect(page.locator("main")).not.toContainText(/PGET|Rank 43|Milestone/);
    await expect(page.locator("main")).toContainText("Bachelor of Technology, Computer Science and Engineering");
    await expect(page.locator("main")).toContainText("Third Hand-Eye");
  });
});
