import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M4-01..FR-M4-04, FR-M5-01, FR-M6-01 — T1 Pet NGON
 * Wizard đặt lịch 4 bước (Dịch vụ → Bé cưng → Lịch hẹn → Địa điểm).
 *
 * RANH GIỚI ADR-11: chỉ điền form ở các bước chọn, **KHÔNG bấm nút gửi cuối cùng**
 * và không tạo lịch thật trên hệ thống đích.
 */

/** Mở modal đặt lịch và trả về handle của modal. */
async function moWizard(page: Page) {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ga-booking-btn', { timeout: 20_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  return page.locator('.bk-modal');
}

test.describe('T1 Pet NGON — M4 Wizard đặt lịch', () => {
  test('TC-T1-M4-001: wizard mở ra với 4 bước đánh số', async ({ page }) => {
    const modal = await moWizard(page);
    await expect(modal).toBeVisible();

    // Tiêu đề 4 bước: 1 Dịch vụ, 2 Bé cưng, 3 Lịch hẹn, 4 Địa điểm.
    const tieuDe = await modal.innerText();
    for (const buoc of ['1', '2', '3', '4']) {
      expect(tieuDe).toContain(buoc);
    }
    expect(tieuDe).toContain('Dịch vụ');
    expect(tieuDe).toContain('Bé cưng');
    expect(tieuDe).toContain('Lịch hẹn');
  });

  test('TC-T1-M4-002: bước 1 liệt kê đủ 6 dịch vụ kèm khoảng giá', async ({ page }) => {
    const modal = await moWizard(page);
    const dichVu = await modal.locator('.bk-svc').allInnerTexts();
    expect(dichVu).toHaveLength(6);
    for (const dv of dichVu) {
      expect(dv).toMatch(/\d{1,3}\.\d{3}₫/);
      expect(dv).toMatch(/\d{1,3}'|\d{1,3} phút/);
    }
  });

  test('TC-T1-M4-003: bước 2 hiển thị 7 bậc cân nặng theo loài đã chọn', async ({ page }) => {
    const modal = await moWizard(page);

    // Chọn dịch vụ rồi sang bước 2.
    await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(600);

    const bacs = await modal.locator('.bk-pet').allInnerTexts();
    expect(bacs).toHaveLength(7);
    for (const b of bacs) {
      expect(b).toMatch(/Chó (mini|nhỏ|vừa|lớn|rất lớn|đại|siêu đại)/);
      expect(b).toMatch(/\d{1,3}\.\d{3}₫/);
    }
  });

  test('TC-T1-M4-004: đổi loài Chó/Mèo ở bước 1 đổi danh sách bậc cân nặng ở bước 2', async ({ page }) => {
    const modal = await moWizard(page);

    await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(600);

    // `allInnerTexts` trả về text đã qua CSS `text-transform: uppercase`,
    // nên phải đọc `textContent` gốc để so khớp không phân biệt hoa thường.
    const cho = await modal.locator('.bk-pet').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(cho.join(' | ')).toMatch(/Chó mini< 3kg/);

    // Quay lại bước 1, đổi sang Mèo.
    await modal.getByRole('button', { name: /Quay lại/ }).click();
    await page.waitForTimeout(500);
    await modal.locator('.bk-pet', { hasText: 'Mèo' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(600);

    const meo = await modal.locator('.bk-pet').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(meo).toHaveLength(7);
    expect(meo.join(' | ')).toMatch(/Mèo mini≤ 3kg/);
  });

  test('TC-T1-M4-005: bước 3 cho chọn ngày và khung giờ', async ({ page }) => {
    const modal = await moWizard(page);

    await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(500);

    await modal.locator('.bk-pet', { hasText: 'Chó vừa' }).click();
    await modal.locator('.bk-input').first().fill('Bé Test');
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(700);

    const ngay = await modal.locator('.bk-day').allInnerTexts();
    const gio = await modal.locator('.bk-time').allInnerTexts();
    expect(ngay.length).toBeGreaterThan(0);
    expect(gio.length).toBeGreaterThan(0);
    for (const g of gio) {
      expect(g).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  test('TC-T1-M4-006: nút gửi cuối cùng không được bấm (ranh giới ADR-11)', async ({ page }) => {
    const modal = await moWizard(page);
    await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(500);
    await modal.locator('.bk-pet', { hasText: 'Chó vừa' }).click();
    await modal.locator('.bk-input').first().fill('Bé Test');
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(700);
    await modal.locator('.bk-time').nth(1).click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(700);

    // Bước 4 — kiểm tra có lựa chọn tại spa / tại nhà nhưng KHÔNG submit.
    const buoc4 = await modal.innerText();
    expect(buoc4).toMatch(/Địa điểm/);
    expect(buoc4).toMatch(/tại spa|tại nhà/i);

    const nutGui = modal.getByRole('button', { name: /Đặt lịch|Xác nhận|Gửi/i });
    if ((await nutGui.count()) > 0) {
      await expect(nutGui.first()).toBeVisible();
    }
    // Cố tình không bấm nút gửi — ADR-11.
  });
});
