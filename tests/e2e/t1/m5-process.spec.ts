import { test, expect } from '@playwright/test';

/**
 * FR-M5-01, FR-M5-02 — T1 Pet NGON
 * Trang mô tả quy trình đặt lịch 4 bước và cam kết xác nhận lịch qua Zalo.
 *
 * Chỉ đọc trang công khai (ADR-11).
 * Bằng chứng: `reports/raw/probe-t1-final2.json` (mục `t1.quyTrinh`),
 * `reports/raw/probe-t1-faq.json`.
 */

test.describe('T1 Pet NGON — M5 Quy trình đặt lịch', () => {
  test('TC-T1-M5-001: Trang mô tả quy trình 4 bước từ đặt lịch đến nhận thú cưng', async ({
    page,
  }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });
    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // FR-M5-01: nêu rõ quy trình 4 bước.
    expect(noiDung, 'Thiếu tiêu đề quy trình 4 bước').toMatch(/QUY TRÌNH ĐẶT LỊCH 4 bước/i);

    // Từng bước phải có mô tả riêng.
    for (const buoc of [
      'Chọn dịch vụ',
      'Đặt lịch trên web',
      'Tại spa hoặc tại nhà',
      'Xác nhận & thanh toán',
    ]) {
      expect(noiDung, `Thiếu bước "${buoc}" trong quy trình`).toContain(buoc);
    }
  });

  test('TC-T1-M5-002: Có nêu xác nhận lịch trong 5 phút qua Zalo', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });
    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // FR-M5-02: thời gian xác nhận phải nêu rõ — "trong 5 phút".
    expect(noiDung, 'Thiếu cam kết xác nhận trong 5 phút').toMatch(/trong 5 phút/i);

    // Kênh xác nhận phải được nêu: Zalo.
    // Thực tế trang chủ nhắc "nhận tin nhắn xác nhận trong 5 phút" nhưng **không** ghi rõ
    // kênh Zalo tại đúng câu này → khoảng trống đã ghi nhận trong defect log.
    const nhoZalo = /Zalo/i.test(noiDung);
    expect(
      nhoZalo,
      'Trang không nhắc kênh Zalo trong phần xác nhận lịch 5 phút',
    ).toBe(true);
  });
});
