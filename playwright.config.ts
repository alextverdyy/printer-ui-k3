import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  use: {
    baseURL: 'http://127.0.0.1:4410',
    headless: true,
    launchOptions: process.env.K3_CHROMIUM_PATH ? { executablePath: process.env.K3_CHROMIUM_PATH } : {},
  },
  projects: [
    { name: 'waveshare-400', use: { viewport: { width: 400, height: 1280 } } },
    { name: 'portrait-480', use: { viewport: { width: 480, height: 800 } } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4410 --strictPort',
    url: 'http://127.0.0.1:4410',
    reuseExistingServer: !process.env.CI,
  },
});
