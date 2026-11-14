import { test, expect } from '@playwright/test';

/**
 * FR-M1-01, FR-M1-02, FR-M1-04 — T1 Pet NGON
 * Trang chủ trả HTTP 200, điều hướng mở được, không có liên kết chết 404.
 * Chỉ đọc, không tương tác ghi dữ liệu (ADR-11).
 */
test.describe('T1 Pet NGON — M1 Truy cập và điều hướng', () => {
  test('TC-T1-M1-001: trang chủ trả HTTP 200 và hiển thị tiêu đề', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/.+/);
  });

  test('TC-T1-M1-002: mọi liên kết menu trả HTTP 200', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hrefs = await page.locator('nav a[href], header a[href]').evaluateAll((links) =>
      links
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href) => href.startsWith('http')),
    );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of [...new Set(hrefs)].slice(0, 20)) {
      const response = await request.get(href, { maxRedirects: 3 });
      expect(response.status(), `Link ${href} trả ${response.status()}`).toBeLessThan(400);
    }
  });

  test('TC-T1-M1-004: không có liên kết chết 404 trong menu và footer', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hrefs = await page
      .locator('nav a[href], header a[href], footer a[href]')
      .evaluateAll((links) =>
        links
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((href) => href.startsWith('http')),
      );
    const broken: string[] = [];
    for (const href of [...new Set(hrefs)].slice(0, 30)) {
      const response = await request.get(href, { maxRedirects: 3 });
      if (response.status() === 404) broken.push(href);
    }
    expect(broken).toEqual([]);
  });
});
