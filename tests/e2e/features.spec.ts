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
    expect(studies.sort()).toEqual([
      "/research/federated-alzheimers-detection",
      "/research/knowledge-distillation-ckks-federated-learning",
      "/research/quantum-gate-assessment",
    ]);
  });

  test("removed pages redirect to their closest replacement", async ({ page }) => {
    await page.goto("/research/federated-knowledge-distillation");
    await expect(page).toHaveURL(/\/research\/knowledge-distillation-ckks-federated-learning$/);
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

test.describe("cookie notice", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("asks once, and essential only stops preferences being stored", async ({ page, context }) => {
    await page.goto("/");
    const notice = page.getByRole("region", { name: "Cookie notice" });
    await expect(notice).toBeVisible();
    await notice.getByRole("button", { name: "Details" }).click();
    await expect(notice).toContainText("Analytics and advertising");
    await notice.getByRole("button", { name: "Essential only" }).click();
    await expect(notice).toBeHidden();
    const cookie = (await context.cookies()).find((item) => item.name === "dbro_consent");
    expect(cookie?.value).toBe("essential");

    await page.getByRole("button", { name: "Pause animations" }).click();
    expect(await page.evaluate(() => localStorage.getItem("motion"))).toBeNull();

    await page.reload();
    await expect(page.getByRole("region", { name: "Cookie notice" })).toBeHidden();
    await page.getByRole("button", { name: "Cookie settings" }).click();
    await page.getByRole("region", { name: "Cookie notice" }).getByRole("button", { name: "Allow preferences" }).click();
    expect((await context.cookies()).find((item) => item.name === "dbro_consent")?.value).toBe("all");
  });

  test("the policy lists every stored item", async ({ page }) => {
    await page.goto("/cookies");
    for (const name of ["dbro_consent", "theme", "motion", "bookmarked-articles", "assistant-chat-v1"]) {
      await expect(page.getByRole("rowheader", { name, exact: true })).toBeVisible();
    }
  });
});

test.describe("new research features", () => {
  test("the header shows the visitor's live time", async ({ page }) => {
    await page.goto("/");
    const clock = page.getByRole("timer");
    await expect(clock).toHaveAttribute("aria-label", /Your local date and time: .+\d{2}:\d{2}:\d{2}/);
    const first = await clock.getAttribute("aria-label");
    await expect.poll(() => clock.getAttribute("aria-label"), { timeout: 4000 }).not.toBe(first);
  });

  test("case studies use full titles and include the ongoing work", async ({ page }) => {
    await page.goto("/research");
    const list = page.locator("#studies-title").locator("xpath=ancestor::section[1]");
    await expect(list).toContainText("Privacy-Preserving Alzheimer's Disease Detection for Non-IID MRI Data: A Comparative Analysis of Federated Learning Algorithms under Homomorphic Encryption");
    await expect(list).toContainText("Knowledge Distillation for CKKS-Secured Federated Learning");
    await expect(list).toContainText("Ongoing");
    await expect(page.getByRole("img", { name: /animated researcher/ })).toBeVisible();
  });

  test("the explorer starts short and grows on request", async ({ page }) => {
    await page.goto("/research");
    const explorer = page.locator("#explorer-title").locator("xpath=ancestor::section[1]");
    await expect(explorer.locator("ul li a")).toHaveCount(4);
    await explorer.getByRole("button", { name: /Show 4 more/ }).click();
    await expect(explorer.locator("ul li a")).toHaveCount(8);
    await explorer.getByRole("button", { name: /Show all/ }).click();
    expect(await explorer.locator("ul li a").count()).toBeGreaterThan(20);
    await explorer.getByRole("button", { name: "Federated Learning" }).click();
    await expect(explorer.getByRole("button", { name: "Federated Learning" })).toHaveAttribute("aria-pressed", "true");
  });

  test("model results switch by backbone and algorithm", async ({ page }) => {
    await page.goto("/research/federated-alzheimers-detection");
    const results = page.locator("#results");
    await results.getByRole("button", { name: /MobileNetV2/ }).first().click();
    await results.getByRole("group", { name: "Federated algorithm" }).getByRole("button", { name: "FedDyn" }).click();
    await expect(results.getByText("Experiment 3", { exact: true })).toBeVisible();
    await expect(results).toContainText("92.45%");
    await results.getByRole("button", { name: "Feature maps" }).click();
    await expect(results.locator('img[src*="mobilenetv2-feddyn-features"]')).toBeVisible();

    await page.getByRole("tab", { name: /Very mild/ }).click();
    await expect(page.getByRole("tabpanel", { name: /Very mild samples/ }).locator("img")).toHaveCount(6);
    await expect(page.getByRole("heading", { name: "Conclusions", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Inside the Custom CNN" })).toBeVisible();
    await page.getByRole("button", { name: "Show all layers" }).click();
    await expect(page.getByRole("cell", { name: "2,575,764" }).first()).toBeVisible();
  });
});
