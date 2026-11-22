import { test, expect } from '@playwright/test';
import { docBangGiaT2 } from '../../support/t2-calculator';

/**
 * FR-M2-01, FR-M2-04 — T2 Mật Pet Family
 * Danh mục dịch vụ: số lượng niêm yết khớp SRS và nhóm "báo giá riêng".
 *
 * ADR-11: chỉ đọc trang công khai, không gửi form.
 *
 * BẰng chứng:
 *   - `reports/raw/probe-t2-banggia4.json` — cấu trúc 3 thẻ `<table>` của T2
 *     (Grooming 7 bậc, Nhuộm 4 bậc, Báo giá riêng không có `<thead>`).
 *   - `reports/raw/probe-t2-huy-all.json` — quét toàn bộ trang nội bộ của
 *     T2, không trang nào có chính sách hủy/hoàn cọc của spa.
 *
 * LƯU Ý KỸ THUẬT: bảng giá của T2 nằm dưới vùng nhìn thấy và được render
 * lazy. Phải cuộn hết trang trước khi đọc (xem `docBangGiaT2`), nếu không
 * `body.innerText` sẽ không chứa nội dung bảng giá và ca sẽ fail nhầm.
 */

/** Nhóm dịch vụ báo giá riêng của T2 (SRS §3.2 + quan sát thực tế). */
const BAO_GIA_RIENG = [
  'Gỡ rối',
  'Tẩy ố',
  'Tắm trắng',
  'Xả dưỡng',
  'Nhuộm hình lớn',
  'Nhuộm tạo hình cơ thể',
];

/** 10 dịch vụ grooming (SRS §3.2 sau CHG-2026-11-14-01). */
const GROOMING = [
  'Combo Tắm Vệ Sinh',
  'Combo Tắm Cạo',
  'Combo Tắm Cắt',
  'Combo Tắm Cắt Tạo Hình',
  'Cắt dũa + Móng',
  'Vệ sinh tai',
  'Cạo bụng + Bàn + Hậu môn',
  'Tắm sấy',
  'Cạo lông',
  'Cắt lông',
];

/** 3 dịch vụ nhuộm niêm yết giá (SRS §3.2). */
const NHUOM = ['Nhuộm 2 tai + đuôi', 'Nhuộm 4 chân', 'Nhuộm hình nhỏ'];

test.describe('T2 Mật Pet — M2 Danh mục dịch vụ', () => {
  test('TC-T2-M2-005: Dịch vụ báo giá riêng được đánh dấu rõ ràng trong danh mục', async ({
    page,
  }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // Đọc bảng giá tĩnh (cần cuộn hết trang vì T2 render lazy).
    const noiDung = await docBangGiaT2(page);

    // FR-M2-04: mỗi dịch vụ "báo giá riêng" được đánh dấu rõ.
    for (const dv of BAO_GIA_RIENG) {
      expect(noiDung, `Thiếu dịch vụ "${dv}" trong danh mục`).toContain(dv);
    }
    expect(noiDung, 'Thiếu nhãn "Báo giá riêng"').toMatch(/Báo giá riêng/i);

    // FR-M3-04: tuyệt đối không hiện một con số đơn lẻ cho dịch vụ báo giá riêng.
    // 4 dịch vụ grooming hiện khoảng 50.000–500.000₫; 2 dịch vụ nhuộm hiện "tuỳ thiết kế".
    expect(noiDung, 'Thiếu khoảng giá 50.000–500.000₫ cho dịch vụ báo giá riêng').toMatch(
      /50\.000\s*[–-]\s*500\.000/,
    );
    expect(
      noiDung,
      'Thiếu thông báo "tuỳ thiết kế" cho dịch vụ báo giá riêng theo kích thước',
    ).toMatch(/tuỳ kích thước|tuỳ thiết kế|Báo giá theo thiết kế riêng/i);

    // Nhóm "báo giá riêng" phải là một khối riêng biệt (≥ 3 nhóm).
    expect(noiDung).toMatch(/Dịch vụ \(Grooming\)/i);
    expect(noiDung).toMatch(/Dịch vụ \(Nhuộm\)/i);
    expect(noiDung).toMatch(/Báo giá riêng — tuỳ tình trạng bé/i);
  });

  test('TC-T2-M2-006: Số dịch vụ niêm yết khớp bảng giá mục 3 của SRS', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const noiDung = await docBangGiaT2(page);

    // SRS §3.2 (sửa tại CHG-2026-11-14-01): 10 grooming (4 combo + 6 lẻ),
    // 3 nhuộm niêm yết giá, 6 báo giá riêng.
    for (const dv of [...GROOMING, ...NHUOM, ...BAO_GIA_RIENG]) {
      expect(noiDung, `Thiếu dịch vụ "${dv}" trong danh mục`).toContain(dv);
    }

    // Bảng giá grooming phải có đủ 7 cột bậc cân nặng.
    expect(noiDung).toMatch(
      /Dịch vụ \(Grooming\)\s*<3kg\s*>3–6kg\s*>6–10kg\s*>10–20kg\s*>20–30kg\s*>30–40kg\s*>40kg/,
    );
    // Bảng giá nhuộm có 4 cột bậc.
    expect(noiDung).toMatch(/Dịch vụ \(Nhuộm\)\s*<6kg\s*>6–15kg\s*>15–30kg\s*>30kg/);

    // Không niêm yết dịch vụ grooming nào ngoài danh mục SRS.
    const NGOAI = ['Combo Tắm + Vệ sinh', 'Combo Tắm + Cạo', 'Cắt tỉa lông'];
    for (const dv of NGOAI) {
      expect(noiDung, `Dịch vụ ngoài danh mục SRS: "${dv}"`).not.toContain(dv);
    }
  });
});
