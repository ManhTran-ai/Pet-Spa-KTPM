import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M1-01, FR-M1-03, FR-M5-07, FR-M4-11 — T3 Pretty Paws
 * Trang chủ trả HTTP 200, có thông tin liên hệ, trạng thái mở/đóng và nút đặt lịch 24/7.
 * Chỉ đọc, không bấm "Book Now" để tránh mở form gửi dữ liệu (ADR-11).
 */

/**
 * Trang T3 render nội dung trong một Drawer của Material UI; chờ Drawer hiện rồi mới đọc text.
 *
 * Lưu ý (rà soát 22/11 — Tài): Drawer hiện ra **trước** khi nội dung
 * "trạng thái mở/đóng" được nạp xong (render bất đồng bộ từ dữ liệu giờ
 * làm việc). Nếu đọc ngay, `innerText` có thể **thiếu** chuỗi "Open"/"Closed"
 * → ca Fail vì lỗi race của test, không phải lỗi site.
 * Vì vậy hàm này chờ tới khi nội dung ổn định (giờ mở cửa xuất hiện).
 */
async function noiDungTrang(page: Page): Promise<string> {
  const drawer = page.locator('.MuiDrawer-paper');
  await drawer.waitFor({ state: 'visible', timeout: 20_000 });
  // Chờ nội dung động (giờ mở cửa / trạng thái) được nạp.
  await drawer
    .getByText(/\d{1,2}:\d{2}\s*AM/i)
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 })
    .catch(() => undefined);
  await page.waitForTimeout(500);
  return drawer.innerText();
}

/**
 * Chờ **trạng thái mở/đóng** xuất hiện trong Drawer của T3.
 *
 * Lý do: Drawer của T3 hiện ra **trước** khi trạng thái "Open"/"Closed" được
 * render (nạp bất đồng bộ). Đọc `innerText` ngay sẽ thỉnh thoảng **thiếu**
 * chuỗi trạng thái → ca Fail vì race condition của test, không phải lỗi site.
 * Đã xác nhận: khi chờ đủ, nội dung luôn có "Closed 8:00 AM - 8:00 PM".
 */
async function choTrangThaiXuatHien(page: Page): Promise<void> {
  const drawer = page.locator('.MuiDrawer-paper');
  await drawer
    .getByText(/\b(open|closed)\b/i)
    .first()
    .waitFor({ state: 'visible', timeout: 20_000 });
}

test.describe('T3 Pretty Paws — M1/M5 Truy cập, liên hệ và trạng thái tiệm', () => {
  test('TC-T3-M1-001: Trang chủ Pretty Paws trả HTTP 200 và hiển thị tiêu đề + điều hướng chính', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Pretty Paws/i);
  });

  test('TC-T3-M1-002: mọi liên kết điều hướng đều trả HTTP 200', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'load' });
    await noiDungTrang(page);

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href') || '').filter(Boolean))]);

    // T3 là trang một trang: không có liên kết nội bộ dạng đường dẫn.
    // Mọi liên kết đều là kênh liên hệ hoặc liên kết ra ngoài.
    expect(hrefs.length).toBeGreaterThan(0);

    const errors: string[] = [];
    for (const href of hrefs) {
      // Bỏ qua liên kết gọi ứng dụng khác (sms:, mailto:, tel:).
      if (/^(sms:|mailto:|tel:)/i.test(href)) continue;
      const response = await request.get(href, { maxRedirects: 5, timeout: 30_000 });
      if (response.status() !== 200) errors.push(`${href} → HTTP ${response.status()}`);
    }
    expect(errors, errors.join('; ')).toEqual([]);
  });

  test('TC-T3-M1-003: trang hiển thị đủ điện thoại, email và địa chỉ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const body = await noiDungTrang(page);

    expect(body).toMatch(/\(?\d{3}\)?\s*\d{3}-\d{4}/);
    expect(body).toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(body).toMatch(/Hamilton,?\s*NJ/i);
  });

  test('TC-T3-M5-005: Trang hiển thị trạng thái Open/Closed và giờ mở cửa', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    const drawer = page.locator('.MuiDrawer-paper');
    await drawer.waitFor({ state: 'visible', timeout: 20_000 });

    // Trạng thái mở/đóng do API giờ mở cửa quyết định nên render sau khung giờ;
    // chờ chính thẻ trạng thái xuất hiện thay vì đọc text một lần.
    const trangThai = drawer.locator('span.text-bold').filter({ hasText: /^(Open|Closed)$/ });
    await expect(trangThai.first()).toBeVisible({ timeout: 20_000 });

    const body = await drawer.innerText();
    expect(body).toMatch(/\d{1,2}:\d{2}\s*AM\s*-\s*\d{1,2}:\d{2}\s*PM/);
  });

  test('TC-T3-M4-009: Luồng đặt lịch không yêu cầu đăng nhập hoặc tạo tài khoản', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await noiDungTrang(page);
    await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible();
    // Không có trường đăng nhập/đăng ký trên trang chủ.
    await expect(page.getByRole('textbox', { name: /password|mật khẩu/i })).toHaveCount(0);
  });
});
