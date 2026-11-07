import { defineConfig, devices } from "@playwright/test";

const liveUrl = process.env.E2E_BASE_URL;
const baseURL = liveUrl ?? "http://localhost:3200";

// Tests start with the cookie choice already made, so the notice does not cover the page.
// The cookie notice has its own tests, which start from an empty browser.
const consented = {
  cookies: [{ name: "dbro_consent", value: "all", domain: new URL(baseURL).hostname, path: "/", expires: -1, httpOnly: false, secure: baseURL.startsWith("https"), sameSite: "Lax" as const }],
  origins: [],
};

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: liveUrl ? 2 : 4,
  reporter: [["list"]],
  use: { baseURL, storageState: consented, ...devices["Desktop Chrome"] },
  webServer: liveUrl
    ? undefined
    : {
        command: "npx next start -p 3200",
        url: "http://localhost:3200",
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
