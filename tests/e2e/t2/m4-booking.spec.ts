import { test, expect } from '@playwright/test';

/**
 * FR-M4-06, FR-M4-08, FR-M4-09, FR-M4-10, FR-M4-12 — T2 Mật Pet Family
 * Hành trình calculator 3 bước: quay lại giữ lựa chọn, tóm tắt lựa chọn,
 * thông báo đồng ý liên hệ, và không yêu cầu đăng nhập / tạo tài khoản.
 *
 * ADR-11: chỉ chọn trong calculator, KHÔNG bấm nút "Giữ chỗ cho bé" / gửi form.
 */
import {
  chonCanNangT2,
  chonDichVuT2,
  chonLoaiT2,
  docGiaT2,
  docTomTatT2,
  quayLaiT2,
} from '../../support/t2-calculator';

test.describe('T2 Mật Pet — M4 Hành trình đặt lịch', () => {
  test('TC-T2-M4-009: Quay lại bước trước giữ nguyên lựa chọn đã làm', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoaiT2(page, '🐶 Chó');
    await chonCanNangT2(page, '>6–10kg');

    // Quay lại bước 2 — bậc cân nặng đã chọn vẫn còn được đánh dấu.
    await quayLaiT2(page);
    const dangChon = await page.locator('.chip').evaluateAll((els) =>
      els
        .filter((e) => e.className.includes('sel') || e.className.includes('active'))
        .map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(dangChon, 'Quay lại phải giữ bậc cân nặng đã chọn').toContain('>6–10kg');

    // Quay lại bước 1 — loài Chó vẫn được đánh dấu.
    await quayLaiT2(page);
    const pet = await page.locator('.pet-opt').evaluateAll((els) =>
      els
        .filter((e) => e.className.includes('sel') || e.className.includes('active'))
        .map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(pet.join(' | '), 'Quay lại phải giữ loài đã chọn').toMatch(/Chó/);
  });

  test('TC-T2-M4-010: Tóm tắt lựa chọn hiển thị loài, bậc cân nặng, dịch vụ và giá', async ({
    page,
  }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoaiT2(page, '🐱 Mèo');
    await chonCanNangT2(page, '>3–6kg');
    await chonDichVuT2(page, 'Combo Tắm Vệ Sinh');

    // FR-M4-09: tóm tắt hiển thị đủ 4 trường.
    const tomTat = await docTomTatT2(page);
    expect(tomTat).toMatch(/Mèo/);
    expect(tomTat).toMatch(/>3–6kg/);
    expect(tomTat).toMatch(/Combo Tắm Vệ Sinh/);

    // Giá hiển thị trong khối giá dự kiến.
    // `.rail-price` hiển thị `~200.000đ` → `docGiaT2` chuẩn hoá thành `200000`.
    const gia = await docGiaT2(page);
    expect(gia).toBe('200000');
  });

  test('TC-T2-M4-011: Có thông báo đồng ý liên hệ qua điện thoại/Zalo trước khi gửi', async ({
    page,
  }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // FR-M4-10: thông báo đồng ý liên hệ qua điện thoại / Zalo.
    expect(noiDung, 'Thiếu thông báo đồng ý liên hệ lại').toMatch(
      /Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại \/ Zalo để xác nhận lịch/i,
    );

    // Phải nêu rõ SĐT là trường bắt buộc.
    expect(noiDung).toMatch(/Số điện thoại \/ Zalo\s*\*/);
  });

  test('TC-T2-M4-012: Luồng đặt lịch không yêu cầu đăng nhập hoặc tạo tài khoản', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    // FR-M4-12: 0 bước đăng nhập / đăng ký trong toàn bộ luồng.
    const noiDung = await page.locator('body').innerText();
    expect(noiDung).not.toMatch(/đăng\s*nhập|đăng\s*ký|tạo\s*tài\s*khoản|sign\s*in|sign\s*up|log\s*in/i);

    // Không có ô mật khẩu nào.
    const fields = await page.locator('input, textarea, select').evaluateAll((els) =>
      els.map((e) => ({
        type: e.getAttribute('type') || '',
        name: e.getAttribute('name') || '',
      })),
    );
    for (const f of fields) {
      expect(f.type, `Có ô nhập yêu cầu đăng nhập: ${f.type}/${f.name}`).not.toBe('password');
    }

    // Chọn hết các bước → vẫn không xuất hiện yêu cầu đăng nhập.
    await chonLoaiT2(page, '🐶 Chó');
    await chonCanNangT2(page, '>3–6kg');
    await chonDichVuT2(page, 'Combo Tắm Vệ Sinh');

    const noiDungSau = await page.locator('body').innerText();
    expect(noiDungSau).not.toMatch(/đăng\s*nhập|đăng\s*ký|tạo\s*tài\s*khoản|sign\s*in|sign\s*up|log\s*in/i);
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });

  test('TC-T2-M4-013: ST: bỏ qua bước chọn loài bị chặn', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(1200);

    // FR-M4-06: không thể bỏ qua bước 1 — nút "Tiếp tục" bị vô hiệu hoá.
    await expect(page.getByRole('button', { name: 'Tiếp tục →' })).toBeDisabled();

    // Tóm tắt vẫn trống vì chưa có lựa chọn nào.
    //
    // LƯU Ý: phải đọc `.book-summary` (khối "TÓM TẮT LỰA CHỌN"), **không** phải
    // `.rail-lines`. `.rail-lines` chỉ được render sau khi đã chọn dịch vụ
    // (bước 3), nên ở bước 1 nó không tồn tại → selector sai sẽ báo
    // "element(s) not found" chứ không phải "chưa có lựa chọn".
    // Bằng chứng: `reports/raw/probe-t2-huy.json` (mục `tomTat`).
    await expect(page.locator('.book-summary')).toContainText(/Chưa có lựa chọn/i);
  });
});
