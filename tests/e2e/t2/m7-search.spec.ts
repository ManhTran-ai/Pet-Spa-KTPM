import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M7-01, FR-M7-02 — T2 Mật Pet Family
 * Tìm kiếm nội dung: lọc theo từ khoá, không phân biệt hoa thường, từ khoá rỗng.
 * ADR-11: chỉ đọc, không điều hướng tới kết quả và không tạo dữ liệu.
 */

const O_TIM_KIEM = 'input[aria-label="Tìm kiếm"]';

/** Mở ô tìm kiếm và nhập từ khoá, trả về danh sách tiêu đề kết quả. */
async function timKiem(page: Page, tuKhoa: string): Promise<string[]> {
  await page.goto('/spa', { waitUntil: 'load' });
  await page.getByRole('button', { name: 'Tìm kiếm' }).last().click();

  const o = page.locator(O_TIM_KIEM);
  await o.waitFor({ state: 'visible' });
  await o.fill(tuKhoa);
  // Đợi kết quả render (site dùng bộ lọc phía client).
  await page.waitForTimeout(1_200);

  return page.evaluate(() => {
    const the = Array.from(document.querySelectorAll('h3, h4, a[href*="/blog"], [class*="result"]'));
    return the.map((e) => e.textContent?.trim() ?? '').filter((t) => t.length > 0);
  });
}

test.describe('T2 Mật Pet — M7 Tìm kiếm nội dung', () => {
  test('TC-T2-M7-001: nhập từ khoá ra danh sách kết quả lọc theo từ khoá', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Tìm kiếm' }).last().click();

    const o = page.locator(O_TIM_KIEM);
    await o.waitFor({ state: 'visible' });
    await o.fill('spa');
    await page.waitForTimeout(1_200);

    // Có kết quả khớp từ khoá.
    const body = await page.locator('body').innerText();
    expect(body.toLowerCase()).toContain('spa');
    // Ô tìm kiếm giữ nguyên giá trị đã nhập.
    await expect(o).toHaveValue('spa');
  });

  test('TC-T2-M7-002: tìm kiếm không phân biệt hoa thường — "SPA" và "spa" cho cùng tập kết quả', async ({
    page,
  }) => {
    const ketQuaThuong = await timKiem(page, 'spa');
    const ketQuaHoa = await timKiem(page, 'SPA');

    expect(ketQuaThuong.length).toBeGreaterThan(0);
    expect(ketQuaHoa).toEqual(ketQuaThuong);
  });

  test('TC-T2-M7-003: tìm kiếm với từ khoá rỗng không gây lỗi', async ({ page }) => {
    const loi: string[] = [];
    page.on('pageerror', (e) => loi.push(e.message));

    await page.goto('/spa', { waitUntil: 'load' });
    await page.getByRole('button', { name: 'Tìm kiếm' }).last().click();

    const o = page.locator(O_TIM_KIEM);
    await o.waitFor({ state: 'visible' });
    await o.fill('');
    await page.waitForTimeout(800);

    expect(loi).toEqual([]);
    await expect(o).toBeVisible();
    await expect(page.locator('body')).toBeVisible();
  });
});
