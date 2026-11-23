import { test, expect, type Page } from '@playwright/test';

/**
 * NFR-04 — Tương thích trình duyệt.
 *
 * Một ca kiểm thử, chạy trên nhiều engine nhờ các project `cross-browser-*`
 * trong `playwright.config.ts`: Chromium, Firefox, WebKit (Safari).
 * Edge dùng chung engine Chromium nên được khai báo bằng `channel: 'msedge'`.
 *
 * Chỉ chọn lựa chọn trong form và đọc giá hiển thị, không gửi form (ADR-11).
 */

/** Chọn Chó → >3–6kg → Combo Tắm Vệ Sinh rồi đọc giá tính tức thì. */
async function tinhGiaT2(page: Page): Promise<string> {
  await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
  await page.waitForTimeout(3000);

  const next = page.getByRole('button', { name: 'Tiếp tục →' });
  for (let i = 0; i < 5; i += 1) {
    await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
    if (await next.isEnabled()) break;
    await page.waitForTimeout(1000);
  }
  await expect(next).toBeEnabled();
  await next.click();

  for (let i = 0; i < 5; i += 1) {
    await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
    if (await next.isEnabled()) break;
    await page.waitForTimeout(1000);
  }
  await expect(next).toBeEnabled();
  await next.click();

  await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
  await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
  return (await page.locator('.rail-price').innerText()).trim();
}

test.describe('NFR-04 — Tương thích trình duyệt', () => {
  test('TC-NFR-04-001: Chức năng tính giá chạy đúng trên Chrome', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Chỉ chạy trên Chromium');
    const price = await tinhGiaT2(page);
    expect(price, `giá tính tức thì ở trình duyệt hiện tại: ${price}`).toContain('200.000');
  });

  test('TC-NFR-04-002: Chức năng tính giá chạy đúng trên Firefox', async ({ page, browserName }) => {
    test.skip(browserName !== 'firefox', 'Chỉ chạy trên Firefox');
    const price = await tinhGiaT2(page);
    expect(price, `giá tính tức thì ở trình duyệt hiện tại: ${price}`).toContain('200.000');
  });

  test('TC-NFR-04-003: Chức năng tính giá chạy đúng trên Edge', async ({ page, browserName }) => {
    // Edge dùng chung engine Chromium; project `cross-browser-edge` khai báo channel 'msedge'.
    test.skip(browserName !== 'chromium', 'Chỉ chạy trên engine Chromium của Edge');
    const price = await tinhGiaT2(page);
    expect(price, `giá tính tức thì ở trình duyệt hiện tại: ${price}`).toContain('200.000');
  });

  test('TC-NFR-04-004: Chức năng tính giá chạy đúng trên Safari', async ({ page, browserName }) => {
    test.skip(browserName !== 'webkit', 'Chỉ chạy trên WebKit (Safari)');
    const price = await tinhGiaT2(page);
    expect(price, `giá tính tức thì ở trình duyệt hiện tại: ${price}`).toContain('200.000');
  });
});
