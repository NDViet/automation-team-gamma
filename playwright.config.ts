import { defineConfig, devices } from '@playwright/test';
import type { PlatformReporterOptions } from '@ndviet/adapter-playwright';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    [
      '@ndviet/adapter-playwright',
      {
        endpoint: process.env.PLATFORM_ENDPOINT ?? 'http://localhost:8081',
        apiKey: process.env.PLATFORM_API_KEY,
        teamId: process.env.PLATFORM_TEAM_ID ?? 'automation-team-gamma',
        projectId: process.env.PLATFORM_PROJECT_ID ?? 'shop-labs',
        printSummary: true,
      } satisfies PlatformReporterOptions,
    ],
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
