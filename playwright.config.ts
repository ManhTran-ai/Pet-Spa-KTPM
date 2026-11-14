import { defineConfig, devices } from '@playwright/test';

/**
 * Cấu hình Playwright cho kiểm thử 3 hệ thống đích.
 * Ranh giới thao tác theo ADR-11: chỉ đọc và tương tác không phá hại, tần suất thấp.
 *
 * `origin` là gốc để `page.goto('/...')` luôn trỏ đúng thư mục;
 * `path` là đường dẫn trang chủ của từng hệ thống.
 */
export const TARGETS = {
  t1: {
    name: 'Pet NGON',
    origin: 'https://petngon.vn',
    path: '/vi',
    bookingUrl: 'https://petngon.vn/vi',
  },
  t2: {
    name: 'Mật Pet Family',
    origin: 'https://matpet.vn',
    path: '/spa',
    bookingUrl: 'https://matpet.vn/spa',
  },
  t3: {
    name: 'Pretty Paws',
    origin: 'https://prettypawscatanddoggrooming.groomore.com',
    path: '/',
    bookingUrl: 'https://prettypawscatanddoggrooming.groomore.com/',
  },
} as const;

export default defineConfig({
  testDir: './tests',
  outputDir: './reports/playwright',
  timeout: 60_000,
  expect: { timeout: 15_000 },
  // Tần suất thấp để không gây tải cho site đích (ADR-11).
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  reporter: [
    ['list'],
    ['json', { outputFile: 'reports/raw/playwright-report.json' }],
    ['html', { outputFolder: 'reports/playwright-html', open: 'never' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
    // Máy đồ án bị Application Control chặn binary chrome-headless-shell của
    // Playwright, nên dùng Chrome hệ thống (cũng trùng yêu cầu NFR-04).
    channel: 'chrome',
  },
  projects: [
    {
      name: 't1',
      testMatch: /e2e[\\/]t1[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t1.origin },
    },
    {
      name: 't2',
      testMatch: /e2e[\\/]t2[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t2.origin },
    },
    {
      name: 't3',
      testMatch: /e2e[\\/]t3[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t3.origin },
    },
    {
      // NFR-02 và NFR-06 chạy trên cả 3 site trong cùng một file.
      name: 'security',
      testMatch: /security[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
