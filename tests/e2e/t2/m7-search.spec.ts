import { test, expect } from '@playwright/test';

/**
 * FR-M7-01, FR-M7-02 — T2 Mật Pet Family
 * Tìm kiếm nội dung qua overlay "Tìm kiếm" (button[aria-label="Tìm kiếm"]).
 *
 * ADR-11: chỉ GET trang công khai, không đăng nhập, không gửi form.
 * Bằng chứng: `reports/raw/probe-t2-spec-dom.json` (mục `search`),
 * `reports/raw/probe-t2-search-all.json`.
 */

const OVERLAY_INPUT = 'input[placeholder*="Tìm giống chó/mèo" i]';

test.describe('T2 Mật Pet — M7 Tìm kiếm', () => {
  test('TC-T2-M7-004: Tìm kiếm với từ khoá không tồn tại trả về thông báo rõ ràng', async ({
    page,
  }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(1200);

    // Mở overlay tìm kiếm.
    await page.locator('button[aria-label="Tìm kiếm"]').first().click();
    await page.waitForSelector(OVERLAY_INPUT, { timeout: 10_000 });

    await page.locator(OVERLAY_INPUT).fill('zzzkhongcothat123');
    await page.waitForTimeout(1200);

    const noiDung = await page.locator('body').innerText();
    expect(noiDung, 'Tìm kiếm không có kết quả phải có thông báo rõ ràng').toMatch(
      /Không thấy kết quả|không tìm thấy|không có kết quả/i,
    );
  });
});
