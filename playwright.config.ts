import { defineConfig, devices } from "@playwright/test";

const liveUrl = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  fullyParallel: true,
  workers: liveUrl ? 2 : 4,
  reporter: [["list"]],
  use: { baseURL: liveUrl ?? "http://localhost:3200", ...devices["Desktop Chrome"] },
  webServer: liveUrl
    ? undefined
    : {
        command: "npx next start -p 3200",
        url: "http://localhost:3200",
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
