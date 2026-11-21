import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M4-06, FR-M4-07, FR-M4-08, FR-M4-09, FR-M4-12 — T2 Mật Pet Family
 * Hành trình calculator 3 bước: quay lại giữ lựa chọn, tóm tắt lựa chọn,
 * và không yêu cầu đăng nhập / tạo tài khoản.
 *
 * ADR-11: chỉ chọn trong calculator, KHÔNG bấm nút "Giữ chỗ" / gửi form.
 */

const NEXT = 'Tiếp tục →';

/** Đi qua bước 1 (chọn loài). */
async function buocLoai(page: Page, loai: '🐶 Chó' | '🐱 Mèo') {
  await page.getByRole('button', { name: loai, exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: NEXT }).click();
  await page.waitForTimeout(800);
}

/** Đi qua bước 2 (chọn bậc cân nặng). */
async function buocCanNang(page: Page, band: string) {
  await page.getByRole('button', { name: band, exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: NEXT }).click();
  await page.waitForTimeout(1000);
}

test.describe('T2 Mật Pet — M4 Hành trình đặt lịch', () => {
  test('TC-T2-M4-009: quay lại bước trước giữ nguyên lựa chọn đã làm', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await buocLoai(page, '🐶 Chó');
    await buocCanNang(page, '>6–10kg');

    // Quay lại bước 2 — bậc cân nặng đã chọn vẫn còn được đánh dấu
    // (T2 dùng class `sel` cho chip đang chọn).
    await page.locator('button.back').click();
    await page.waitForTimeout(700);

    const chon = await page.locator('.chip').evaluateAll((els) =>
      els.map((e) => ({
        text: (e.textContent || '').trim(),
        active: e.className.includes('sel') || e.className.includes('active'),
      })),
    );
    const dangChon = chon.filter((c) => c.active).map((c) => c.text);
    expect(dangChon).toContain('>6–10kg');

    // Quay lại bước 1 — loài Chó vẫn được đánh dấu.
    await page.locator('button.back').click();
    await page.waitForTimeout(700);
    const pet = await page.locator('.pet-opt').evaluateAll((els) =>
      els.map((e) => ({
        text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
        active: e.className.includes('sel') || e.className.includes('active'),
      })),
    );
    expect(pet.find((p) => p.active)?.text).toMatch(/Chó/);
  });

  test('TC-T2-M4-010: tóm tắt lựa chọn hiển thị loài, bậc cân nặng, dịch vụ và giá', async ({
    page,
  }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await buocLoai(page, '🐱 Mèo');
    await buocCanNang(page, '>3–6kg');
    await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
    await page.waitForTimeout(900);

    // FR-M4-09: tóm tắt hiển thị đủ loài + bậc + dịch vụ + giá.
    await expect(page.locator('.rail-lines')).toContainText('Mèo');
    await expect(page.locator('.rail-lines')).toContainText('>3–6kg');
    await expect(page.locator('.rail-lines')).toContainText('Combo Tắm Vệ Sinh');
    await expect(page.locator('.rail-price')).toContainText('200.000');
  });

  test('TC-T2-M4-012: luồng đặt lịch không yêu cầu đăng nhập hoặc tạo tài khoản', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });

    // Không có form đăng nhập / đăng ký nào trong luồng.
    const noiDung = await page.locator('body').innerText();
    expect(noiDung).not.toMatch(/đăng\s*nhập|đăng\s*ký|tạo\s*tài\s*khoản|sign\s*in|sign\s*up|log\s*in/i);

    // Các ô nhập trong luồng chỉ là số điện thoại, tên bé, ngày — không có mật khẩu.
    const fields = await page.locator('input, textarea, select').evaluateAll((els) =>
      els.map((e) => ({
        type: e.getAttribute('type') || '',
        name: e.getAttribute('name') || '',
      })),
    );
    for (const f of fields) {
      expect(f.type, `Có ô nhập yêu cầu đăng nhập: ${f.type}/${f.name}`).not.toBe('password');
    }
  });

  test('TC-T2-M4-008: bước chọn dịch vụ hiển thị đủ dịch vụ, không dịch vụ nào bị hụt', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await buocLoai(page, '🐶 Chó');
    await buocCanNang(page, '>3–6kg');

    const combo = await page.locator('.svc.combo').allInnerTexts();
    expect(combo).toHaveLength(4);
    const tenCombo = combo.map((t) => t.replace(/\s+/g, ' ').trim());
    expect(tenCombo.join(' | ')).toContain('Combo Tắm Vệ Sinh');
    expect(tenCombo.join(' | ')).toContain('Combo Tắm Cạo');
    expect(tenCombo.join(' | ')).toContain('Combo Tắm Cắt');
    expect(tenCombo.join(' | ')).toContain('Combo Tắm Cắt Tạo Hình');
  });

  test('TC-T2-M4-015: nút "Tiếp tục" bị vô hiệu hoá khi bỏ qua bước chọn loài', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(800);

    // FR-M4-06: không thể bỏ qua bước 1.
    await expect(page.getByRole('button', { name: NEXT })).toBeDisabled();
  });

  test('TC-T2-M4-014: nút "Tiếp tục" bị vô hiệu hoá khi bỏ qua bước chọn cân nặng', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await buocLoai(page, '🐶 Chó');

    // FR-M4-06: không thể bỏ qua bước 2.
    await expect(page.getByRole('button', { name: NEXT })).toBeDisabled();
  });
});
