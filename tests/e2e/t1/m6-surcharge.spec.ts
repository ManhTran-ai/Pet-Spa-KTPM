import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M6-02, FR-M6-03, FR-M6-04, FR-M6-05, FR-M6-06 — T1 Pet NGON
 * Phụ thu di chuyển theo khoảng cách, phụ thu cố định của gói tại nhà,
 * và bảng dải khoảng cách BR-05.
 *
 * RANH GIỚI ADR-11: chỉ điền địa chỉ để quan sát phụ thu, **KHÔNG bấm
 * "Xác nhận đặt lịch"**.
 *
 * BẰNG CHỨNG QUAN TRỌNG — công thức thực tế khác công thức trong SRS.
 * `FR-M6-02` / `BR-04` công bố: `max(0, km − 5) × 8.000₫` (liên tục).
 * Đo thực tế trên 32 địa chỉ (`reports/raw/probe-t1-km-int.json`) cho thấy
 * site làm tròn **LÊN** trước khi trừ: `max(0, ceil(km) − 5) × 8.000₫`.
 *   4.4km → 0₫ · 5.3km → 8.000₫ · 6.6km → 16.000₫ · 7.2km → 24.000₫
 *   13.8km → 72.000₫ · 15.0km → 80.000₫ · 15.7km → 88.000₫
 * Sai lệch tối đa quan sát được: 7.200₫ ở 7.2 km (24.000₫ thực tế vs 17.600₫ theo SRS).
 * → Đã mở CR về `BR-04`, xem `docs/change-requests.md`.
 */
import {
  chonCanNang,
  chonNgayGio,
  chonTanNha,
  dienTenBe,
  docKm,
  docPhiDiChuyen,
  docTongTat,
  docTongTien,
  moWizard,
  nhapDiaChi,
  sangBuoc2,
  tiepTuc,
} from '../../support/t1-wizard';

/** Mở bước 4 ở chế độ "Tận nhà". */
async function buoc4TaiNha(page: Page) {
  const modal = await moWizard(page);
  await sangBuoc2(modal, 'Tắm');
  await chonCanNang(modal, 'Chó nhỏ');
  await dienTenBe(modal);
  await tiepTuc(modal);
  await chonNgayGio(modal);
  await tiepTuc(modal);
  await chonTanNha(modal);
  return modal;
}

/** Text của 6 thẻ dịch vụ trên trang chủ T1. */
async function theDichVu(page: Page): Promise<string[]> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  return page.locator('.hm-svc').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
}

test.describe('T1 Pet NGON — M6 Phụ thu tại nhà', () => {
  test('TC-T1-M6-003: DT phụ thu di chuyển: 0 km không phát sinh phụ thu', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // "Quận 1, TP. Hồ Chí Minh" ánh xạ 3.2 km trong bảng tra cứu của site
    // (bằng chứng: reports/raw/probe-t1-km-hunt2.json).
    await nhapDiaChi(modal, 'Quận 1, TP. Hồ Chí Minh');

    const phi = await docPhiDiChuyen(modal);
    expect(phi, 'Khoảng cách dưới 5 km phải miễn phí').toBe(0);
  });

  test('TC-T1-M6-004: DT phụ thu di chuyển: 2 km không phát sinh phụ thu', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // "Thanh Oai, Hà Nội" ánh xạ **3.8 km** — dưới mốc 5 km miễn phí.
    //
    // LƯU Ý (sửa 22/11/2026): trước đây ca này dùng "Phước Long, Bình Chánh"
    // và kỳ vọng 3.8 km. Bảng tra cứu của site đã đổi: "Phước Long, Bình Chánh"
    // nay ánh xạ **13.8 km** → 72.000₫ (bằng chứng:
    // `reports/raw/probe-t1-km-2026-11-22.json`, dòng "Phước Long, Bình Chánh").
    // Địa chỉ dưới đây được đo lại ngày 22/11/2026 và vẫn cho đúng 3.8 km.
    await nhapDiaChi(modal, 'Thanh Oai, Hà Nội');

    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    expect(km, 'Địa chỉ này phải ánh xạ dưới mốc 5 km').toBeCloseTo(3.8, 1);
    expect(phi, 'Dưới 5 km phải miễn phí').toBe(0);
  });

  test('TC-T1-M6-005: DT phụ thu di chuyển: 5 km miễn phí đúng mốc', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // "Phú Cường, Thủ Dầu Một, Bình Dương" ánh xạ **đúng 5.0 km** — mốc biên
    // của BR-04 (5 km đầu miễn phí).
    await nhapDiaChi(modal, 'Phú Cường, Thủ Dầu Một, Bình Dương');

    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    expect(km, 'Địa chỉ này phải ánh xạ đúng mốc 5 km').toBeCloseTo(5, 1);
    expect(phi, 'Đúng mốc 5 km vẫn miễn phí').toBe(0);
  });

  test('TC-T1-M6-006: DT phụ thu di chuyển: 6 km thu 8.000đ', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // 5.3 km → ceil = 6 → (6 − 5) × 8.000₫ = 8.000₫
    await nhapDiaChi(modal, 'Trí Chánh, Củ Chi');

    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    expect(km).toBeCloseTo(5.3, 1);
    expect(phi).toBe(8_000);
  });

  test('TC-T1-M6-007: DT phụ thu di chuyển: 7 km thu 16.000đ', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // 6.6 km → ceil = 7 → (7 − 5) × 8.000₫ = 16.000₫
    await nhapDiaChi(modal, 'Bến Tây, Bình Dương');

    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    expect(km).toBeCloseTo(6.6, 1);
    expect(phi).toBe(16_000);
  });

  test('TC-T1-M6-020: Phụ thu di chuyển hiển thị ngay khi nhập địa chỉ', async ({ page }) => {
    const modal = await buoc4TaiNha(page);

    // Trước khi nhập địa chỉ chưa có khoảng cách.
    expect(await docKm(modal)).toBeNull();

    await nhapDiaChi(modal, 'Gò Vấp, TP. Hồ Chí Minh');

    // Sau khi nhập: hiện ngay khoảng cách + phụ thu (không cần bấm nút nào).
    const km = await docKm(modal);
    const phi = await docPhiDiChuyen(modal);
    expect(km, 'Phải hiển thị khoảng cách ngay khi nhập địa chỉ').not.toBeNull();
    expect(phi, 'Phải hiển thị phụ thu di chuyển ngay khi nhập địa chỉ').not.toBeNull();
    expect(phi).toBe(24_000);
  });

  test('TC-T1-M6-011: Gói tắm tại nhà cộng phụ thu cố định 50.000đ', async ({ page }) => {
    const the = await theDichVu(page);
    // Thẻ "Tắm" (không phải "Combo Tắm + ...") — neo theo tên gói kèm biểu tượng
    // dịch vụ, tránh khớp nhầm các combo cũng chứa chữ "Tắm".
    const card = the.find((t) => /bathtub.*\bTắm\b/i.test(t) && !/Combo/i.test(t))!;
    expect(card, `Không tìm thấy thẻ dịch vụ "Tắm": ${the.join(' || ').slice(0, 200)}`).toBeTruthy();
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +50.000₫');
  });

  test('TC-T1-M6-012: Gói cạo tại nhà cộng phụ thu cố định 80.000đ', async ({ page }) => {
    const the = await theDichVu(page);
    const card = the.find((t) => t.includes('Cạo lông'))!;
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +80.000₫');
  });

  test('TC-T1-M6-013: Combo tắm cạo tại nhà cộng phụ thu cố định 100.000đ', async ({ page }) => {
    const the = await theDichVu(page);
    const card = the.find((t) => t.includes('Combo Tắm + Cạo'))!;
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +100.000₫');
  });

  test('TC-T1-M6-014: Tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    await nhapDiaChi(modal, 'Gò Vấp, TP. Hồ Chí Minh');

    const tong = await docTongTien(modal);
    const phi = await docPhiDiChuyen(modal);
    const dong = await docTongTat(modal);

    expect(tong, 'Phải hiển thị tổng tiền').not.toBeNull();
    expect(phi).toBe(24_000);

    // Tổng = giá gói (Chó nhỏ + Tắm = 155.000₫) + phụ thu tận nhà (50.000₫)
    //        + phụ thu di chuyển (24.000₫) = 229.000₫
    expect(tong).toBe(155_000 + 50_000 + 24_000);

    // Tóm tắt phải liệt kê đủ 3 thành phần.
    const chuoi = dong.join(' | ');
    expect(chuoi).toMatch(/155\.000₫/);
    expect(chuoi).toMatch(/50\.000₫/);
    expect(chuoi).toMatch(/24\.000₫/);
  });

  test('TC-T1-M6-015: Mỗi gói tại nhà ghi rõ chưa gồm phí di chuyển', async ({ page }) => {
    const the = await theDichVu(page);
    const taiNha = the.filter((t) => t.includes('Có tận nhà'));
    expect(taiNha.length).toBeGreaterThan(0);

    for (const card of taiNha) {
      expect(card, 'Gói tại nhà thiếu ghi chú "(chưa gồm phí di chuyển)"').toContain(
        'chưa gồm phí di chuyển',
      );
    }
  });

  test('TC-T1-M6-016: Không gói nào tại nhà ghi sai thành đã gồm phí di chuyển', async ({ page }) => {
    const the = await theDichVu(page);
    for (const card of the) {
      expect(card, 'Ghi sai "đã gồm phí di chuyển"').not.toMatch(/đã gồm phí di chuyển/i);
    }
  });

  test('TC-T1-M6-017: Bảng khoảng cách có đủ 4 dảng 0-5, 5-10, 10-15, trên 15 km', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });

    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    for (const dai of ['0 – 5 km', '5 – 10 km', '10 – 15 km', 'Trên 15 km']) {
      expect(noiDung, `Thiếu dải km "${dai}"`).toContain(dai);
    }
    // Dải cuối chuyển sang báo giá riêng (FR-M6-06).
    expect(noiDung).toMatch(/Trên 15 km[\s\S]{0,120}Báo giá riêng/i);
  });

  test('TC-T1-M6-018: Trên 15 km hiển thị Liên hệ báo giá riêng theo lộ trình', async ({ page }) => {
    const modal = await buoc4TaiNha(page);
    // "Yên Bái" ánh xạ **15.7 km** (> 15 km) — bằng chứng:
    // `reports/raw/probe-t1-km-2026-11-22.json`.
    await nhapDiaChi(modal, 'Yên Bái');

    const km = await docKm(modal);
    expect(km, 'Địa chỉ này phải nằm trên 15 km').not.toBeNull();
    expect(km!, 'Địa chỉ này phải nằm trên 15 km').toBeGreaterThan(15);

    const noiDung = await modal.innerText();
    // FR-M6-06: trên 15 km phải báo giá riêng.
    //
    // LỖI THẬT CỦA SITE ĐÍCH — bằng chứng:
    //   `reports/raw/probe-t1-km-2026-11-22.json` → "Yên Bái" = 15.7 km,
    //   phí di chuyển hiển thị **88.000₫** (con số cố định), không phải
    //   "Liên hệ — Báo giá riêng".
    // Ghi nhận trong defect log (DEF-026).
    expect(
      noiDung,
      'Trên 15 km phải hiện "Liên hệ — Báo giá riêng" thay vì con số phụ thu cố định',
    ).toMatch(/Liên hệ[\s\S]{0,60}Báo giá riêng/i);
  });

  test('TC-T1-M6-019: Nhập địa chỉ xa khoảng 20 km không hiển thị con số phụ thu cố định', async ({
    page,
  }) => {
    const modal = await buoc4TaiNha(page);
    // Địa chỉ xa: "Yên Bái" → 15.7 km theo bảng tra cứu của site.
    await nhapDiaChi(modal, 'Yên Bái');

    const noiDung = await modal.innerText();
    // FR-M6-06: không hiện con số phụ thu cố định khi trên 15 km.
    //
    // LỖI THẬT CỦA SITE ĐÍCH — cùng nguyên nhân với TC-T1-M6-018 (DEF-026):
    // site vẫn tính và hiển thị phụ thu theo công thức (88.000₫ cho 15.7 km).
    expect(noiDung).toMatch(/Liên hệ[\s\S]{0,60}Báo giá riêng/i);
  });
});
