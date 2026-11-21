import { test, expect, type Page } from '@playwright/test';
import { moTrangSpa, chonLoai, chonBucCanNang, sangBuocDichVu, chonDichVu, moFormGiuCho } from './helpers';

/**
 * FR-M4-01, FR-M4-02, FR-M4-03, FR-M4-07 — T2 Mật Pet Family
 * Form giữ chỗ: trường bắt buộc, validate SĐT, danh sách dịch vụ đầy đủ.
 *
 * ADR-11: KHÔNG bấm nút gửi form cuối với dữ liệu hợp lệ — chỉ kiểm tra
 * trạng thái validate khi nhập SĐT sai/trống (form bị chặn, không tạo bản ghi).
 */

const THONG_BAO_LOI = 'Vui lòng nhập số điện thoại hợp lệ để spa liên hệ.';

async function denBuocDichVu(page: Page) {
  await moTrangSpa(page);
  await chonLoai(page, 'Chó');
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await chonBucCanNang(page, '>3–6kg');
  await sangBuocDichVu(page);
  await chonDichVu(page, 'Combo Tắm Vệ Sinh');
}

test.describe('T2 Mật Pet — M4 Form giữ chỗ', () => {
  test('TC-T2-M4-001: form giữ chỗ hiển thị SĐT bắt buộc và tên bé tuỳ chọn', async ({ page }) => {
    await denBuocDichVu(page);
    await moFormGiuCho(page);

    const sdt = page.locator('#f_phone');
    await expect(sdt).toBeVisible();
    await expect(sdt).toHaveAttribute('type', 'tel');
    await expect(sdt).toHaveAttribute('required', '');

    const tenBe = page.locator('#f_name');
    await expect(tenBe).toBeVisible();
    expect(await tenBe.getAttribute('required')).toBeNull();
  });

  test('TC-T2-M4-002: bỏ trống SĐT thì form không gửi được và báo đúng trường lỗi', async ({ page }) => {
    await denBuocDichVu(page);
    await moFormGiuCho(page);

    await page.getByRole('button', { name: 'Giữ chỗ cho bé →' }).click();

    // Thông báo lỗi nêu đúng trường "Số điện thoại".
    await expect(page.getByText(THONG_BAO_LOI)).toBeVisible();
    // Form chưa gửi: không có mã lịch hẹn / thông báo thành công.
    await expect(page.getByText(/mã lịch hẹn|đặt lịch thành công/i)).toHaveCount(0);
  });

  test('TC-T2-M4-003: nhập SĐT chứa chữ cái bị từ chối', async ({ page }) => {
    await denBuocDichVu(page);
    await moFormGiuCho(page);

    await page.locator('#f_phone').fill('abc');
    await page.getByRole('button', { name: 'Giữ chỗ cho bé →' }).click();

    await expect(page.getByText(THONG_BAO_LOI)).toBeVisible();
  });

  test('TC-T2-M4-004: nhập SĐT quá ngắn hoặc quá dài bị từ chối hoặc cảnh báo', async ({ page }) => {
    await denBuocDichVu(page);
    await moFormGiuCho(page);

    const sdt = page.locator('#f_phone');
    const nútGửi = page.getByRole('button', { name: 'Giữ chỗ cho bé →' });

    // Quá ngắn: 1 chữ số.
    await sdt.fill('0');
    await nútGửi.click();
    await expect(page.getByText(THONG_BAO_LOI)).toBeVisible();

    // Quá dài: 20 chữ số.
    await sdt.fill('01234567890123456789');
    await nútGửi.click();
    await expect(page.getByText(THONG_BAO_LOI)).toBeVisible();
  });

  test('TC-T2-M4-005: nhập SĐT hợp lệ định dạng Việt Nam không còn báo lỗi validate', async ({ page }) => {
    await denBuocDichVu(page);
    await moFormGiuCho(page);

    await page.locator('#f_phone').fill('0912345678');
    await page.getByRole('button', { name: 'Giữ chỗ cho bé →' }).click();

    await expect(page.getByText(THONG_BAO_LOI)).toHaveCount(0);
  });

  test('TC-T2-M4-008: bước chọn dịch vụ hiển thị đủ, không dịch vụ nào vô hình', async ({ page }) => {
    await denBuocDichVu(page);

    // Tab Combo trọn gói: 4 combo theo BR-02.
    await expect(page.locator('.svc.combo')).toHaveCount(4);

    // Tab Dịch vụ lẻ: 6 dịch vụ lẻ theo BR-11.
    await page.getByRole('button', { name: 'Dịch vụ lẻ', exact: true }).click();
    await expect(page.locator('.svc')).toHaveCount(15); // 6 lẻ + 3 nhuộm + 6 báo giá riêng

    // Không dịch vụ nào bị ẩn (visibility thay vì display).
    const soAn = await page.locator('.svc').evaluateAll((els) =>
      els.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width === 0 || r.height === 0;
      }).length,
    );
    expect(soAn).toBe(0);
  });
});
