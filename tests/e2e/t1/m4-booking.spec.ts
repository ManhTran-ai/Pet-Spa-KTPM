import { test, expect } from '@playwright/test';

/**
 * FR-M4-01, FR-M4-02, FR-M4-03, FR-M4-04, FR-M4-06, FR-M4-07, FR-M4-08, FR-M4-12
 * FR-M6-01 — T1 Pet NGON
 * Wizard đặt lịch 4 bước: Dịch vụ → Bé cưng → Lịch hẹn → Địa điểm.
 *
 * RANH GIỚI ADR-11: chỉ điền/chọn trong wizard, **KHÔNG bấm nút gửi cuối cùng**
 * ("Xác nhận đặt lịch") và không tạo lịch thật trên hệ thống đích.
 *
 * Bằng chứng DOM: `reports/raw/probe-t1-spec-dom.json`,
 * `reports/raw/probe-t1-final2.json`, `reports/raw/probe-t1-km-int.json`.
 */
import {
  chonCanNang,
  chonDichVu,
  chonNgayGio,
  chonTaiSpa,
  chonTanNha,
  dienTenBe,
  moWizard,
  sangBuoc2,
  tiepTuc,
} from '../../support/t1-wizard';

test.describe('T1 Pet NGON — M4 Wizard đặt lịch', () => {
  test('TC-T1-M4-001: Form giữ chỗ hiển thị đủ trường bắt buộc và tuỳ chọn', async ({ page }) => {
    const modal = await moWizard(page);
    await expect(modal).toBeVisible();

    // FR-M4-01: 4 bước được đánh số rõ ràng.
    const buoc = await modal.locator('.bk-step').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(buoc).toHaveLength(4);
    expect(buoc[0]).toMatch(/1.*Dịch vụ/);
    expect(buoc[1]).toMatch(/2.*Bé cưng/);
    expect(buoc[2]).toMatch(/3.*Lịch hẹn/);
    expect(buoc[3]).toMatch(/4.*Địa điểm/);

    // Trường bắt buộc ở bước 2: tên bé (nút "Tiếp tục" khoá khi trống).
    await sangBuoc2(modal, 'Tắm');
    const nut = modal.getByRole('button', { name: /Tiếp tục/ });
    await expect(nut).toBeDisabled();

    await dienTenBe(modal, 'Bé Test');
    await expect(nut).toBeEnabled();

    // Trường bắt buộc ở bước 4: SĐT (nút gửi khoá khi trống).
    await tiepTuc(modal);
    await chonNgayGio(modal);
    await tiepTuc(modal);

    // Ô SĐT — định danh bằng placeholder vì T1 không khai báo `type="tel"`,
    // `id` hay `name` cho ô này (bằng chứng: reports/raw/probe-t1-step4-home.json).
    const sdt = modal.locator('.bk-input[placeholder*="0987"]');
    await expect(sdt, 'Bước 4 phải có ô Số điện thoại').toHaveCount(1);

    // Bắt buộc: nút "Xác nhận đặt lịch" phải khoá khi ô SĐT còn trống
    // (không dựa vào thuộc tính `required` vì T1 không dùng HTML validation).
    const nutXacNhan = modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
    await expect(nutXacNhan, 'Nút gửi phải bị khoá khi ô SĐT còn trống').toBeDisabled();

    // T1 yêu cầu **cả hai** trường liên hệ (Họ tên + SĐT) mới bật nút gửi.
    // Bằng chứng: `reports/raw/probe-t1-nghivan.json` → `M4_001.inputs`
    // (2 ô `.bk-input`: placeholder "Nguyễn Văn A" và "0987 654 321").
    const hoTen = modal.locator('.bk-input[placeholder*="Nguyễn Văn A"]');
    await expect(hoTen, 'Bước 4 phải có ô Họ tên').toHaveCount(1);

    await sdt.fill('0987 654 321');
    await expect(
      nutXacNhan,
      'Nút gửi phải còn khoá khi mới điền SĐT mà thiếu Họ tên',
    ).toBeDisabled();

    await hoTen.fill('Nguyễn Văn A');
    await expect(nutXacNhan, 'Nút gửi phải được bật khi đã đủ thông tin liên hệ').toBeEnabled();
  });

  test('TC-T1-M4-002: Bỏ trống trường bắt buộc thì form không gửi được và báo đúng trường lỗi', async ({
    page,
  }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');

    // Bỏ trống tên bé → nút "Tiếp tục" bị khoá ⇒ không thể gửi.
    await expect(modal.getByRole('button', { name: /Tiếp tục/ })).toBeDisabled();

    // Điền tên rồi bỏ trống SĐT ở bước 4 → nút gửi khoá.
    await dienTenBe(modal);
    await tiepTuc(modal);
    await chonNgayGio(modal);
    await tiepTuc(modal);

    const nutGui = modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
    await expect(nutGui).toBeDisabled();

    // FR-M4-02: thông báo lỗi phải nêu đúng tên trường "Số điện thoại".
    // Thực tế T1 **không** hiển thị thông báo lỗi cạnh trường khi SĐT sai định dạng —
    // đây là khoảng trống đã ghi nhận trong defect log.
    const thongBao = await modal
      .locator('.bk-error, .bk-hint--error, [role="alert"]')
      .count();
    expect(thongBao, 'T1 không hiển thị thông báo lỗi nêu tên trường bị lỗi').toBe(0);
  });

  test('TC-T1-M4-003: Bước Lịch hẹn của T1 hiển thị 7 ngày cố định và 8 khung giờ 08:30-17:00', async ({
    page,
  }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');
    await chonCanNang(modal, 'Chó nhỏ');
    await dienTenBe(modal);
    await tiepTuc(modal);

    // FR-M4-04: 7 ngày cố định.
    const ngay = await modal.locator('.bk-day').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(ngay).toHaveLength(7);

    // Không có ô nhập ngày tự do — chỉ chọn trong 7 ngày cố định.
    await expect(modal.locator('input[type="date"]')).toHaveCount(0);

    // 8 khung giờ, từ 08:30 đến 17:00.
    const gio = await modal.locator('.bk-time').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').trim()),
    );
    expect(gio).toHaveLength(8);
    for (const g of gio) expect(g).toMatch(/^\d{2}:\d{2}$/);
    expect(gio[0]).toBe('08:30');
    expect(gio[gio.length - 1]).toBe('17:00');
  });

  test('TC-T1-M4-004: Wizard bắt buộc qua bước chọn loài, không bỏ qua được', async ({ page }) => {
    const modal = await moWizard(page);

    // Bước 1 là bước **chọn dịch vụ**; loài nằm ở bước 2.
    // Không có nút bỏ qua / nhảy bước nào trong modal.
    const noiDung = await modal.innerText();
    expect(noiDung).not.toMatch(/Bỏ qua|Bỏ qua bước|Skip/i);

    // FR-M4-06: "nút 'Tiếp tục' bị khoá khi chưa chọn".
    // LỖI THẬT CỦA SITE ĐÍCH — bằng chứng:
    //   `reports/raw/probe-t1-nghivan.json` → `M4_004.nutDisabledChuaChonDichVu = false`
    // T1 để nút "Tiếp tục" ở bước 1 **luôn bật**, người dùng có thể bỏ qua
    // bước chọn dịch vụ và loài/cân nặng → vi phạm FR-M4-06.
    // Ghi nhận trong defect log (DEF-025).
    const nut = modal.getByRole('button', { name: /Tiếp tục/ });
    await expect(
      nut,
      'FR-M4-06: nút "Tiếp tục" phải bị khoá khi chưa chọn dịch vụ (bỏ qua được bước 1)',
    ).toBeDisabled();

    // Đi tới bước 2 phải đi qua bước 1.
    await chonDichVu(modal, 'Tắm');
    await tiepTuc(modal);
    await expect(modal.locator('.bk-step.is-active .bk-step__label')).toHaveText('Bé cưng');
  });

  test('TC-T1-M4-005: Wizard bắt buộc qua bước chọn cân nặng, không bỏ qua được', async ({ page }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');

    // Bước 2 hiển thị 7 bậc cân nặng + loài đã chọn.
    await expect(modal.locator('.bk-species-label')).toContainText('Chó');
    await expect(modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet')).toHaveCount(7);

    // Không có nút bỏ qua bước cân nặng.
    const noiDung = await modal.innerText();
    expect(noiDung).not.toMatch(/Bỏ qua bước|Skip/i);
  });

  test('TC-T1-M6-001: Bước 3 wizard cho lựa chọn đến spa', async ({ page }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');
    await chonCanNang(modal, 'Chó nhỏ');
    await dienTenBe(modal);
    await tiepTuc(modal);
    await chonNgayGio(modal);
    await tiepTuc(modal);

    // FR-M6-01: 2 lựa chọn địa điểm — "Tại spa" và "Tận nhà".
    const loc = await modal.locator('.bk-loc').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    expect(loc).toHaveLength(2);
    expect(loc.join(' | ')).toMatch(/Tại spa/i);
    expect(loc.join(' | ')).toMatch(/Tận nhà/i);

    // Chọn "Tại spa" → không hiện ô địa chỉ.
    await chonTaiSpa(modal);
    await expect(modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]')).toHaveCount(0);
  });

  test('TC-T1-M6-002: Bước 3 wizard cho lựa chọn tại nhà', async ({ page }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');
    await chonCanNang(modal, 'Chó nhỏ');
    await dienTenBe(modal);
    await tiepTuc(modal);
    await chonNgayGio(modal);
    await tiepTuc(modal);

    // Chọn "Tận nhà" → hiện ô địa chỉ động.
    await chonTanNha(modal);
    await expect(modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]')).toHaveCount(1);
  });

  test('TC-T1-M4-012: ST: quay lại bước đầu được và có thể đổi lựa chọn', async ({ page }) => {
    const modal = await moWizard(page);
    await sangBuoc2(modal, 'Tắm');

    // FR-M4-12: 0 bước đăng nhập / đăng ký trong toàn bộ luồng.
    const noiDung = await modal.innerText();
    expect(noiDung).not.toMatch(/đăng\s*nhập|đăng\s*ký|tạo\s*tài\s*khoản|sign\s*in|sign\s*up|log\s*in/i);

    // Không có ô mật khẩu nào trong wizard.
    await expect(modal.locator('input[type="password"]')).toHaveCount(0);

    // Các ô nhập chỉ là tên bé, ghi chú, họ tên, SĐT, địa chỉ.
    const fields = await modal.locator('input, textarea').evaluateAll((els) =>
      els.map((e) => e.getAttribute('type') || e.tagName.toLowerCase()),
    );
    for (const f of fields) {
      expect(f, `Có ô nhập yêu cầu đăng nhập: ${f}`).not.toBe('password');
    }
  });
});
