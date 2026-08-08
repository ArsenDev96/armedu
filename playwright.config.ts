import { loadEnvConfig } from "@next/env";
import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests against the local dev server.
 *
 * The suite is deliberately small and selector-light: it drives the app the way
 * a reader does, through accessible roles and visible text, so a class rename
 * never breaks a test. Nothing here needs Supabase credentials — the newsletter
 * tests cover client-side validation and the missing-configuration path only.
 */

/*
  Give the test runner the same environment the dev server reads.

  `next dev` loads `.env.local`; Playwright's own process does not. The map
  tests compare what the browser rendered against the tile configuration
  resolved from `process.env`, and without this the two halves would disagree
  the moment anyone configured a basemap locally — a false failure with a
  confusing cause. This is Next's own helper, used the way its testing guidance
  suggests.
*/
loadEnvConfig(process.cwd());

const PORT = 3002;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],

  webServer: {
    command: "npm run dev",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
