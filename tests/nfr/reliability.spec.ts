import { test, expect, type Page } from '@playwright/test';

/**
 * NFR-05 — Độ tin cậy (Ngân, Ngày 8/11).
 *
 * TC-NFR-05-001: gửi form 3 lần liên tiếp không tạo bản ghi trùng.
 * TC-NFR-05-002: lỗi mạng hiển thị thông báo, không treo trang.
 * TC-NFR-05-003: tải lại trang giữ nguyên trạng thái đã chọn.
 * TC-NFR-05-004: tải lại trang trong luồng wizard không làm mất lựa chọn.
 *
 * Ranh giới ADR-11: chỉ đọc và kiểm tra trạng thái, KHÔNG gửi form hợp lệ
 * (không tạo bản ghi thật trên hệ thống đang chạy).
 */

const T2_SPA = 'https://matpet.vn/spa';

async function chonComboT2(page: Page, band = '>3–6kg') {
  await page.goto(T2_SPA, { waitUntil: 'load' });
  await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  const next = page.getByRole('button', { name: 'Tiếp tục →' });
  await expect(next).toBeEnabled();
  await next.click();
  await page.getByRole('button', { name: band, exact: true }).click();
  await expect(next).toBeEnabled();
  await next.click();
  await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
}

test.describe('NFR-05 — Độ tin cậy', () => {
  test('TC-NFR-05-001: bấm gửi 3 lần liên tiếp không tạo bản ghi trùng', async ({ page }) => {
    await chonComboT2(page);
    await page.getByRole('button', { name: 'Giữ chỗ với mức giá này →' }).click();

    // ADR-11: không được tạo bản ghi thật trên hệ thống đang chạy.
    // Chặn mọi POST và trả lời giả để quan sát hành vi phía client.
    let soRequestGui = 0;
    await page.route('**/*', async (route) => {
      const req = route.request();
      if (req.method() === 'POST') {
        soRequestGui += 1;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true }),
        });
        return;
      }
      await route.continue();
    });

    await page.locator('#f_phone').fill('0912345678');
    const nútGửi = page.getByRole('button', { name: 'Giữ chỗ cho bé →' });

    // Bấm tối đa 3 lần; nếu form đã đóng sau lần gửi đầu (dấu hiệu chống
    // gửi trùng) thì dừng — nút không còn trong DOM.
    for (let i = 0; i < 3; i += 1) {
      if (!(await nútGửi.isVisible().catch(() => false))) break;
      await nútGửi.click();
      await page.waitForTimeout(800);
    }

    // Trang không treo.
    await expect(page.locator('body')).toBeVisible();
    // Tối đa 1 lần gửi thực sự ra server cho 3 lần bấm (chống gửi trùng).
    expect(soRequestGui).toBeLessThanOrEqual(1);
  });

  test('TC-NFR-05-002: lỗi mạng hiển thị thông báo, không treo trang', async ({ page }) => {
    await chonComboT2(page);

    // Chặn mọi request tới API của site để mô phỏng mất mạng.
    await page.route('**/api/**', (route) => route.abort('failed'));

    await page.getByRole('button', { name: 'Giữ chỗ với mức giá này →' }).click();
    await page.locator('#f_phone').fill('0912345678');
    await page.getByRole('button', { name: 'Giữ chỗ cho bé →' }).click();
    await page.waitForTimeout(2_000);

    // Trang vẫn phản hồi (không treo) và có thông báo lỗi hoặc thông báo
    // thất bại cho người dùng.
    await expect(page.locator('body')).toBeVisible();
    const coThongBao = await page
      .getByText(/không gửi được|thất bại|lỗi|vui lòng thử lại|liên hệ/i)
      .count();
    expect(coThongBao).toBeGreaterThan(0);
  });

  test('TC-NFR-05-003: tải lại trang giữ nguyên trạng thái đã chọn', async ({ page }) => {
    await chonComboT2(page);
    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1_500);

    // Tiêu chí chấp nhận NFR-05: 100% lựa chọn được giữ sau khi tải lại trang.
    // T2 không lưu trạng thái → DEF-029.
    await expect(page.locator('.rail-price')).toContainText('200.000');
    await expect(page.locator('.rail-lines')).toContainText('Combo Tắm Vệ Sinh');
  });

  test('TC-NFR-05-004: tải lại trang trong luồng wizard không làm mất lựa chọn', async ({ page }) => {
    await page.goto(T2_SPA, { waitUntil: 'load' });
    await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
    const next = page.getByRole('button', { name: 'Tiếp tục →' });
    await expect(next).toBeEnabled();
    await next.click();
    await page.getByRole('button', { name: '>6–10kg', exact: true }).click();

    await page.reload({ waitUntil: 'load' });
    await page.waitForTimeout(1_500);

    // Bậc cân nặng đã chọn vẫn còn sau khi tải lại (DEF-029).
    await expect(page.locator('.chip.sel')).toHaveText('>6–10kg');
  });
});
