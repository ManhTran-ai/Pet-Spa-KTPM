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
    // Trình duyệt của Playwright tự ghi trace vào thư mục output; antivirus
    // của máy đồ án xóa file trace giữa chừng nên Playwright báo ENOENT khi
    // đóng context. Bằng chứng lỗi vẫn được giữ bằng ảnh chụp.
    trace: 'off',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 't1',
      testMatch: /e2e[\\/]t1[\\/].*\.spec\.ts/,
      // Máy đồ án bị Application Control chặn binary chrome-headless-shell của
      // Playwright, nên dùng Chrome hệ thống (cũng trùng yêu cầu NFR-04).
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t1.origin, channel: 'chrome' },
    },
    {
      name: 't2',
      testMatch: /e2e[\\/]t2[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t2.origin, channel: 'chrome' },
    },
    {
      name: 't3',
      testMatch: /e2e[\\/]t3[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], baseURL: TARGETS.t3.origin, channel: 'chrome' },
    },
    {
      // NFR-02 và NFR-06 chạy trên cả 3 site trong cùng một file.
      name: 'security',
      testMatch: /security[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
    {
      // NFR-04 — tương thích trình duyệt: chạy cùng một ca kiểm thử trên
      // nhiều engine. `channel` chỉ áp dụng cho Chromium nên phải khai báo
      // riêng cho từng project, không đặt ở cấp `use` chung.
      name: 'cross-browser-chromium',
      testMatch: /crossbrowser[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'cross-browser-firefox',
      testMatch: /crossbrowser[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'cross-browser-webkit',
      testMatch: /crossbrowser[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      // Edge dùng chung engine Chromium với Chrome.
      name: 'cross-browser-edge',
      testMatch: /crossbrowser[\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'], channel: 'msedge' },
    },
  ],
});
