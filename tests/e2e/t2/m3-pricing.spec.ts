import { test, expect, type Page } from '@playwright/test';
import { moTrangSpa, chonLoai, chonBucCanNang, sangBuocDichVu, chonDichVu, docGiaDuKien } from './helpers';

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

async function chonCombo(page: Page, band: string, service: string) {
  await moTrangSpa(page);
  await chonLoai(page, 'Chó');
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await chonBucCanNang(page, band);
  await sangBuocDichVu(page);
  await chonDichVu(page, escapeRe(service));
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

  test('TC-T2-M3-003: Mèo cùng bậc cân nặng cho giá BẰNG Chó (bảng giá dùng chung)', async ({ page }) => {
    await chonCombo(page, '>3–6kg', 'Combo Tắm Vệ Sinh');
    const giaCho = (await docGiaDuKien(page)).gia;

    await moTrangSpa(page);
    await chonLoai(page, 'Mèo');
    await page.getByRole('button', { name: 'Tiếp tục →' }).click();
    await chonBucCanNang(page, '>3–6kg');
    await sangBuocDichVu(page);
    await chonDichVu(page, escapeRe('Combo Tắm Vệ Sinh'));
    const giaMeo = (await docGiaDuKien(page)).gia;

    expect(giaMeo).toBe(giaCho);
  });

  test('TC-T2-M3-004: giá cập nhật tức thì khi đổi bậc cân nặng', async ({ page }) => {
    await chonCombo(page, '>3–6kg', 'Combo Tắm Vệ Sinh');
    const price = page.locator('.rail-price');
    await expect(price).toContainText('200.000');
    const priceBefore = await price.innerText();

    await chonCombo(page, '>6–10kg', 'Combo Tắm Vệ Sinh');
    await expect(price).toContainText('300.000');
    await expect(price).not.toHaveText(priceBefore);
  });

  test('TC-T2-M3-005: tóm tắt lựa chọn hiển thị loài, bậc cân nặng và dịch vụ', async ({ page }) => {
    await chonCombo(page, '>3–6kg', 'Combo Tắm Vệ Sinh');
    const { tongTat } = await docGiaDuKien(page);

    expect(tongTat).toContain('Chó');
    expect(tongTat).toContain('>3–6kg');
    expect(tongTat).toContain('Combo Tắm Vệ Sinh');
  });

  test('TC-T2-M3-006: đổi dịch vụ thì giá cập nhật tức thì', async ({ page }) => {
    await chonCombo(page, '>3–6kg', 'Combo Tắm Vệ Sinh');
    await expect(page.locator('.rail-price')).toContainText('200.000');

    await chonDichVu(page, escapeRe('Combo Tắm Cạo'));
    await expect(page.locator('.rail-price')).toContainText('250.000');
  });

  test('TC-T2-M3-011: giá tính tức thì khớp đúng ô của bảng giá tĩnh trên cùng trang', async ({ page }) => {
    const band = '>3–6kg';
    const service = 'Combo Tắm Vệ Sinh';

    await chonCombo(page, band, service);
    const { gia } = await docGiaDuKien(page);
    // Bảng giá tĩnh dùng đơn vị "k"; giá tính tức thì dùng "200.000".
    const soTien = Number(gia.replace(/[^\d]/g, ''));

    const bangGia = page.locator('table', { hasText: 'Dịch vụ (Grooming)' });
    // Bảng dùng hiệu ứng reveal khi cuộn tới nên ô có visibility:hidden —
    // innerText rỗng, phải đọc textContent.
    const oTieuDe = await bangGia
      .locator('tr')
      .first()
      .locator('th, td')
      .evaluateAll((cells) => cells.map((c) => c.textContent?.trim() ?? ''));
    const chiSo = oTieuDe.indexOf(band);
    expect(chiSo).toBeGreaterThan(0);

    const dong = bangGia.locator('tr', { hasText: service });
    const oDong = await dong
      .locator('td')
      .evaluateAll((cells) => cells.map((c) => c.textContent?.trim() ?? ''));
    // Cột 0 của hàng dữ liệu là tên dịch vụ, nên chỉ số cột giá trùng
    // với chỉ số cột trong hàng tiêu đề.
    const giaBang = oDong[chiSo] ?? '';

    const kyVong = Number(giaBang.replace(/[^\d]/g, '')) * 1000;
    expect(soTien).toBe(kyVong);
  });
});
