import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M1-01, FR-M1-03, FR-M5-07, FR-M4-11 — T3 Pretty Paws
 * Trang chủ trả HTTP 200, có thông tin liên hệ, trạng thái mở/đóng và nút đặt lịch 24/7.
 * Chỉ đọc, không bấm "Book Now" để tránh mở form gửi dữ liệu (ADR-11).
 */

/** Trang T3 render nội dung trong một Drawer của Material UI; chờ Drawer hiện rồi mới đọc text. */
async function noiDungTrang(page: Page): Promise<string> {
  const drawer = page.locator('.MuiDrawer-paper');
  await drawer.waitFor({ state: 'visible', timeout: 20_000 });
  return drawer.innerText();
}

test.describe('T3 Pretty Paws — M1/M5 Truy cập, liên hệ và trạng thái tiệm', () => {
  test('TC-T3-M1-001: trang chủ trả HTTP 200 và có tiêu đề', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Pretty Paws/i);
  });

  test('TC-T3-M1-003: trang hiển thị đủ điện thoại, email và địa chỉ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const body = await noiDungTrang(page);

    expect(body).toMatch(/\(?\d{3}\)?\s*\d{3}-\d{4}/);
    expect(body).toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(body).toMatch(/Hamilton,?\s*NJ/i);
  });

  test('TC-T3-M5-005: trang hiển thị trạng thái mở/đóng kèm khung giờ mở cửa đầy đủ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const body = await noiDungTrang(page);

    expect(body).toMatch(/\b(Open|Closed)\b/);
    expect(body).toMatch(/\d{1,2}:\d{2}\s*AM\s*-\s*\d{1,2}:\d{2}\s*PM/);
  });

  test('TC-T3-M4-009: có nút "Book Now" để đặt lịch 24/7 mà không cần đăng nhập', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await noiDungTrang(page);
    await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible();
    // Không có trường đăng nhập/đăng ký trên trang chủ.
    await expect(page.getByRole('textbox', { name: /password|mật khẩu/i })).toHaveCount(0);
  });
});
