import { test, expect } from '@playwright/test';

/**
 * FR-M5-04 — T2 Mật Pet Family
 * Chính sách hủy / đổi lịch và hoàn cọc.
 *
 * Yêu cầu (SRS §5, `FR-M5-04`): *"Nêu rõ chính sách hủy và hoàn tiền — Có nội dung
 * cho cả 3 mục: hủy, đổi, hoàn cọc; không chỉ nêu 'liên hệ tiệm'"*.
 * Bảng quyết định A.6 (`docs/design/decision-tables.md`):
 *   R3 = hủy trước thời hạn → có nội dung → **hoàn cọc**  → `TC-T2-M5-004`
 *   R4 = hủy muộn         → không nêu  → **không hoàn cọc** → `TC-T2-M5-005`
 *
 * ADR-11: chỉ đọc trang công khai.
 *
 * KẾT QUẢ THỰC TẾ (lỗi ở site đích — bên thứ ba, nhóm không sửa được):
 *   T2 **không có** chính sách hủy / hoàn cọc của dịch vụ spa ở bất kỳ trang
 *   nào. Bằng chứng quét toàn bộ 21 liên kết nội bộ của T2
 *   (`reports/raw/probe-t2-huy-all.json`):
 *     - `/spa`, `/bang-gia`, `/cau-hoi-thuong-gap`, `/bao-hanh`, `/cham-soc`… →
 *       0 lần xuất hiện từ khoá hủy / hoàn cọc / đổi lịch.
 *     - Cụm "Hoàn tiền" duy nhất trên site thuộc `/bao-hanh` và nói về **mua
 *       bán thú cưng** ("Phát hiện không thuần chủng – hoàn tiền hoặc đổi trả"),
 *       **không** phải chính sách hủy lịch spa.
 *     - `/chinh-sach`, `/dieu-khoan`, `/gioi-thieu`, `/dich-vu` → HTTP 404.
 *   Vì vậy 2 ca dưới đây **Fail đúng như thực tế** và được ghi nhận là lỗi
 *   của site đích (DEF-028), không hạ tiêu chí để ép xanh.
 */

/** Trang công khai của T2 được dùng làm nguồn kiểm tra chính sách. */
const TRANG = '/cau-hoi-thuong-gap';

test.describe('T2 Mật Pet — M5 Chính sách hủy và hoàn tiền', () => {
  test('TC-T2-M5-004: DT chính sách hủy: hoàn cọc khi hủy trước thời hạn', async ({ page }) => {
    await page.goto(TRANG, { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // FR-M5-04: phải có nội dung về hủy, đổi và hoàn cọc.
    // Thực tế: trang FAQ của T2 (24 câu hỏi) chỉ nói về mua bán thú cưng,
    // vận chuyển, bảo hành, showroom — **không** có mục spa hủy/hoàn cọc.
    expect(
      noiDung,
      'T2 không có nội dung chính sách hủy / hoàn cọc của spa',
    ).toMatch(/hủy|huỷ|hủy lịch|hoàn cọc|hoàn tiền|đổi lịch/i);
  });

  test('TC-T2-M5-005: DT chính sách hủy: không hoàn cọc khi hủy muộn hoặc không thông báo', async ({
    page,
  }) => {
    await page.goto(TRANG, { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // Điều kiện "không hoàn cọc" phải được nêu cụ thể (thời hạn + hậu quả).
    expect(
      noiDung,
      'T2 không nêu điều kiện không hoàn cọc khi hủy muộn',
    ).toMatch(/trước \d+\s*(giờ|ngày)|không hoàn|không được hoàn/i);
  });
});
