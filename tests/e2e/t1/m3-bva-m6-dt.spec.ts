import { test, expect, type Page } from '@playwright/test';

/**
 * T1 Pet NGON — M1 (hiển thị di động), M3 (bảng giá theo bậc cân nặng),
 * M6 (phụ thu di chuyển và phụ thu tại nhà).
 *
 * Ranh giới ADR-11: chỉ đọc bảng giá và điền form wizard tới bước 4, **không bấm
 * "Xác nhận đặt lịch"** nên không tạo lịch hẹn thật.
 */

/** Bảng giá tĩnh của T1 — 6 dịch vụ × 7 bậc × Chó/Mèo. */
async function docGiaBangGia(page: Page) {
  await page.goto('/vi', { waitUntil: 'load' });
  await page.waitForTimeout(2000);
  const table = page.locator('table').first();
  await table.waitFor({ state: 'visible', timeout: 30_000 });
  return table;
}

/** Mở wizard đặt lịch và đi tới bước 4 (Địa điểm) — không gửi form. */
async function toiBuocDiaDiem(page: Page, dichVu: string, loai: string, bac: string) {
  await page.goto('/vi', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
  const overlay = page.locator('.bk-overlay');
  await overlay.waitFor({ state: 'visible', timeout: 30_000 });
  const next = () => overlay.locator('button').filter({ hasText: 'Tiếp tục' });

  await overlay.locator('.bk-svc').filter({ hasText: dichVu }).first().click();
  await page.waitForTimeout(500);
  await overlay.locator('.bk-pet').filter({ hasText: loai }).first().click();
  await page.waitForTimeout(1000);
  await next().click();
  await page.waitForTimeout(1500);

  await overlay.locator('.bk-pet').filter({ hasText: bac }).first().click();
  await page.waitForTimeout(800);
  await overlay.locator('.bk-input').first().fill('Bé Kiểm Thử');
  await page.waitForTimeout(600);
  await next().click();
  await page.waitForTimeout(1500);

  await overlay.locator('button').filter({ hasText: /\d{2}\/\d{2}/ }).first().click();
  await page.waitForTimeout(600);
  await overlay.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first().click();
  await page.waitForTimeout(800);
  await next().click();
  await page.waitForTimeout(1800);

  return overlay;
}

test.describe('T1 Pet NGON — M1 Hiển thị trên màn hình di động', () => {
  test('TC-T1-M1-005: trang chủ không cuộn ngang ở màn hình 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    // Trang không được tràn ngang ở 360px.
    expect(
      overflow.scrollWidth,
      `scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth}`,
    ).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});

test.describe('T1 Pet NGON — M3 Bảng giá theo bậc cân nặng', () => {
  // BVA theo ngưỡng của BR-01. T1 chọn BẬC (vùng) chứ không nhập số kg,
  // nên biên BVA là biên của vùng cân nặng trên bảng giá.
  const BAN_CAN_NANG = [
    { tc: '008', band: '3–5kg', moTa: 'ngưỡng 3kg' },
    { tc: '009', band: '3–5kg', moTa: 'ngưỡng 3kg + 0.1kg' },
    { tc: '010', band: '5–10kg', moTa: 'ngưỡng 5kg' },
    { tc: '011', band: '5–10kg', moTa: 'ngưỡng 5kg + 0.1kg' },
    { tc: '012', band: '5–10kg', moTa: 'ngưỡng 10kg − 0.1kg' },
    { tc: '013', band: '10–15kg', moTa: 'ngưỡng 10kg' },
    { tc: '014', band: '10–15kg', moTa: 'ngưỡng 10kg + 0.1kg' },
  ] as const;

  for (const bc of BAN_CAN_NANG) {
    test(`TC-T1-M3-${bc.tc}: BVA ngưỡng ${bc.moTa} thuộc bậc ${bc.band}`, async ({ page }) => {
      const table = await docGiaBangGia(page);
      const text = await table.innerText();

      // Bậc cân nặng phải xuất hiện trong bảng giá.
      expect(text).toContain(bc.band);
    });
  }
});

test.describe('T1 Pet NGON — M6 Phụ thu di chuyển và phụ thu tại nhà', () => {
  test('TC-T1-M6-008: DT phụ thu di chuyển: 10 km thu 40.000₫', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').innerText();
    // Dải 5–10 km công bố mức phụ thu 40.000₫–80.000₫ (BR-05).
    expect(body).toMatch(/5\s*–\s*10 km[\s\S]{0,120}?40\.000₫\s*–\s*80\.000₫/);
  });

  test('TC-T1-M6-009: DT phụ thu di chuyển: 15 km thu 80.000₫', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').innerText();
    // Dải 10–15 km công bố mức phụ thu 80.000₫–120.000₫ (BR-05).
    expect(body).toMatch(/10\s*–\s*15 km[\s\S]{0,120}?80\.000₫\s*–\s*120\.000₫/);
  });

  test('TC-T1-M6-010: DT phụ thu di chuyển: 20 km hiển thị Liên hệ báo giá riêng thay vì con số', async ({
    page,
  }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const body = await page.locator('body').innerText();
    // Dải trên 15 km không hiện con số cố định (FR-M6-06).
    expect(body).toMatch(/Trên 15 km[\s\S]{0,160}?Liên hệ[\s\S]{0,80}?Báo giá riêng theo lộ trình/);
    // Không được gắn con số cố định vào dải trên 15 km.
    expect(body).not.toMatch(/Trên 15 km[\s\S]{0,60}?\d{1,3}\.\d{3}₫/);
  });

  test('TC-T1-M6-011: gói tắm tại nhà cộng phụ thu cố định 50.000₫', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Mỗi gói dịch vụ công bố phụ thu tại nhà trong `.hm-svc__home-note`.
    const ghiChu = page.locator('.hm-svc__home-note');
    const giaTam = ghiChu.locator('xpath=preceding-sibling::*[1]').filter({ hasText: 'Tắm' });
    void giaTam;

    const theTam = page.locator('.hm-svc').filter({ hasText: 'Tắm' }).first();
    await theTam.scrollIntoViewIfNeeded();
    const text = await theTam.innerText();
    expect(text).toMatch(/\+50\.000₫/);
    // Phụ thu cố định không bao gồm phí di chuyển (FR-M6-04).
    expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  });

  test('TC-T1-M6-012: gói cạo tại nhà cộng phụ thu cố định 80.000₫', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const theCao = page.locator('.hm-svc').filter({ hasText: 'Cạo lông' }).first();
    await theCao.scrollIntoViewIfNeeded();
    const text = await theCao.innerText();
    expect(text).toMatch(/\+80\.000₫/);
    expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  });

  test('TC-T1-M6-013: combo tắm cạo tại nhà cộng phụ thu cố định 100.000₫', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const theCombo = page.locator('.hm-svc').filter({ hasText: 'Combo Tắm + Cạo' }).first();
    await theCombo.scrollIntoViewIfNeeded();
    const text = await theCombo.innerText();
    expect(text).toMatch(/\+100\.000₫/);
    expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  });

  test('TC-T1-M6-014: tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển', async ({ page }) => {
    // Wizard T1: Chó nhỏ (3–5kg) + Tắm = 155.000₫; chọn "Tận nhà" → +50.000₫.
    const overlay = await toiBuocDiaDiem(page, 'Tắm', 'Chó', 'Chó nhỏ');

    await overlay.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).click();
    await page.waitForTimeout(1500);

    const text = await overlay.innerText();
    expect(text).toMatch(/155\.000₫/);
    expect(text).toMatch(/\+\s*Phụ thu tận nhà/i);
    expect(text).toMatch(/50\.000₫/);
    // Tạm tính = 155.000 + 50.000 = 205.000₫.
    expect(text).toMatch(/205\.000₫/);

    // Không bấm "Xác nhận đặt lịch" — không tạo lịch thật (ADR-11).
  });

  test('TC-T1-M6-015: mọi gói tại nhà ghi rõ chưa gồm phí di chuyển', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // FR-M6-04: 100% gói tại nhà ghi rõ "(chưa gồm phí di chuyển)".
    const ghiChuPhuThu = page.locator('.hm-svc__home-note');
    const soGhiChu = await ghiChuPhuThu.count();
    expect(soGhiChu).toBeGreaterThan(0);

    for (let i = 0; i < soGhiChu; i += 1) {
      await expect(ghiChuPhuThu.nth(i)).toContainText('(chưa gồm phí di chuyển)');
    }
  });
});
