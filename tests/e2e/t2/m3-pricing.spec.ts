import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M3-02, FR-M3-03 — T2 Mật Pet Family
 * BVA ngưỡng bậc cân nặng và đối chiếu giá tính tức thì với bảng giá tĩnh.
 * Chỉ chọn, không gửi form (ADR-11).
 */

// Bảng giá tham chiếu quan sát được ngày 2026-11-13 (SRS-01 §6, BR-02).
const CASES = [
  { band: '>3–6kg', service: 'Combo Tắm Vệ Sinh', expected: '200.000' },
  { band: '>3–6kg', service: 'Combo Tắm Cạo', expected: '250.000' },
  { band: '>6–10kg', service: 'Combo Tắm Vệ Sinh', expected: '300.000' },
] as const;

const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Trang dùng React nên nút "Tiếp tục →" chỉ được bật sau khi script hydrate.
 * Bấm lại tối đa 3 lần cho tới khi nút chuyển sang enabled.
 */
async function tiepTuc(page: Page, buoc: () => Promise<void>) {
  const next = page.getByRole('button', { name: 'Tiếp tục →' });
  for (let i = 0; i < 3; i += 1) {
    await buoc();
    if (await next.isEnabled()) break;
  }
  await expect(next).toBeEnabled();
  await next.click();
}

async function chonCombo(page: Page, band: string, service: string) {
  await page.goto('/spa', { waitUntil: 'load' });
  await tiepTuc(page, () => page.getByRole('button', { name: '🐶 Chó', exact: true }).click());
  await tiepTuc(page, () => page.getByRole('button', { name: band, exact: true }).click());
  await page.getByRole('button', { name: new RegExp(escapeRe(service)) }).first().click();
}

test.describe('T2 Mật Pet — M3 Bảng giá theo cân nặng', () => {
  for (const target of CASES) {
    test(`TC-T2-M3-002: giá tính tức thì Chó ${target.band} ${target.service} khớp bảng giá tĩnh`, async ({
      page,
    }) => {
      await chonCombo(page, target.band, target.service);

      // Khối "GIÁ DỰ KIẾN" hiển thị giá tức thì; khối tóm tắt hiển thị lựa chọn.
      await expect(page.locator('.rail-price')).toContainText(target.expected);
      await expect(page.locator('.rail-lines')).toContainText(target.band);
      await expect(page.locator('.rail-lines')).toContainText(target.service);
    });
  }

  test('TC-T2-M3-004: Chọn xong loài, cân nặng, dịch vụ thì giá dự kiến hiển thị tức thì', async ({ page }) => {
    await chonCombo(page, '>3–6kg', 'Combo Tắm Vệ Sinh');
    const price = page.locator('.rail-price');
    await expect(price).toContainText('200.000');
    const priceBefore = await price.innerText();

    await chonCombo(page, '>6–10kg', 'Combo Tắm Vệ Sinh');
    await expect(price).toContainText('300.000');
    await expect(price).not.toHaveText(priceBefore);
  });
});
