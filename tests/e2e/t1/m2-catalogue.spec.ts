import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M2-01, FR-M2-02, FR-M2-03, FR-M2-05 — T1 Pet NGON
 * Danh mục dịch vụ: tên + mô tả + giá + thời lượng, phân biệt tại spa / tại nhà.
 * Chỉ đọc trang công khai, không mở/gửi form đặt lịch (ADR-11).
 */

/** Nhãn tại nhà / tại spa theo từng dịch vụ T1 (quan sát 21/11/2026). */
const DICH_VU_T1 = [
  { ten: 'Tắm', nhan: 'Có tận nhà', phuThu: '+50.000₫' },
  { ten: 'Cắt tỉa lông', nhan: 'Chỉ tại spa', phuThu: null },
  { ten: 'Cạo lông', nhan: 'Có tận nhà', phuThu: '+80.000₫' },
  { ten: 'Combo Tắm + Vệ sinh', nhan: 'Có tận nhà', phuThu: '+70.000₫' },
  { ten: 'Combo Tắm + Cắt tỉa', nhan: 'Chỉ tại spa', phuThu: null },
  { ten: 'Combo Tắm + Cạo', nhan: 'Có tận nhà', phuThu: '+100.000₫' },
] as const;

/** Trả về text của 6 thẻ dịch vụ trên trang chủ T1. */
async function theDichVu(page: Page): Promise<string[]> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  return page.locator('.hm-svc').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
}

test.describe('T1 Pet NGON — M2 Danh mục dịch vụ', () => {
  test('TC-T1-M2-001: Mỗi dịch vụ trong danh mục có đủ tên, mô tả, giá và thời lượng', async ({ page }) => {
    const the = await theDichVu(page);
    expect(the).toHaveLength(DICH_VU_T1.length);

    for (const dv of DICH_VU_T1) {
      const card = the.find((t) => t.includes(dv.ten));
      expect(card, `Thiếu thẻ dịch vụ "${dv.ten}"`).toBeTruthy();
      // Tên: chuỗi có chứa đúng tên dịch vụ.
      expect(card).toContain(dv.ten);
      // Mô tả: có câu văn sau tên (mô tả thành phần bao gồm).
      const moTa = card!.replace(dv.ten, '').replace(/Có tận nhà|Chỉ tại spa/g, '');
      expect(moTa.length, `Mô tả "${dv.ten}" quá ngắn`).toBeGreaterThan(60);
      // Giá: có dấu phân cách nghìn dạng "88.000₫".
      expect(card!, 'Thiếu giá dạng "88.000₫"').toMatch(/\d{1,3}\.\d{3}₫/);
      // Thời lượng: "45 phút" / "90 phút" / "120 phút".
      expect(card!, 'Thiếu thời lượng dạng "45 phút"').toMatch(/\d{1,3}\s*phút/);
    }
  });

  test('TC-T1-M2-002: Mỗi dịch vụ nêu rõ thành phần bao gồm', async ({ page }) => {
    const the = await theDichVu(page);

    // FR-M2-02: 100% dịch vụ có mô tả "bao gồm" danh sách thành phần.
    for (const dv of DICH_VU_T1) {
      const card = the.find((t) => t.includes(dv.ten));
      expect(card, `Thiếu thẻ dịch vụ "${dv.ten}"`).toBeTruthy();
      const moTa = card!.replace(dv.ten, '').replace(/Có tận nhà|Chỉ tại spa/g, '');
      // Mô tả phải liệt kê thành phần: ≥ 2 mệnh đề, phân tách bằng dấu phẩy,
      // chấm phẩy, "và" hoặc " + ".
      const soThanhPhan = moTa
        .split(/[,;]| hay | và | \+ /i)
        .map((s) => s.trim())
        .filter((s) => s.length > 8).length;
      expect(
        soThanhPhan,
        `"${dv.ten}" không nêu rõ thành phần bao gồm: "${moTa.slice(0, 120)}"`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  test('TC-T1-M2-003: Dịch vụ không hỗ trợ tại nhà có nhãn Chỉ tại spa', async ({ page }) => {
    const the = await theDichVu(page);

    const khongTaiNha = DICH_VU_T1.filter((dv) => dv.nhan === 'Chỉ tại spa');
    expect(khongTaiNha.length).toBeGreaterThan(0);

    for (const dv of khongTaiNha) {
      const card = the.find((t) => t.includes(dv.ten))!;
      expect(card, `"${dv.ten}" phải ghi "Chỉ tại spa"`).toContain('Chỉ tại spa');
      expect(card, `"${dv.ten}" không được ghi "Có tận nhà"`).not.toContain('Có tận nhà');
    }
  });

  test('TC-T1-M2-004: Dịch vụ hỗ trợ tại nhà có nhãn Có tận nhà', async ({ page }) => {
    const the = await theDichVu(page);

    const taiNha = DICH_VU_T1.filter((dv) => dv.nhan === 'Có tận nhà');
    expect(taiNha.length).toBeGreaterThan(0);

    for (const dv of taiNha) {
      const card = the.find((t) => t.includes(dv.ten))!;
      expect(card, `"${dv.ten}" phải ghi "Có tận nhà"`).toContain('Có tận nhà');
      expect(card, `"${dv.ten}" không được ghi "Chỉ tại spa"`).not.toContain('Chỉ tại spa');
    }
  });

  test('TC-T1-M2-005: Gói phổ biện được đánh dấu rõ ràng', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });

    // Nhãn "Phổ biến" hoặc "Tiết kiệm" đánh dấu gói nổi bật.
    const danhDau = await page
      .locator('.hm-svc')
      .evaluateAll((els) =>
        els
          .map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim())
          .filter((t) => t.includes('Phổ biến') || t.includes('Tiết kiệm')),
      );
    expect(danhDau.length).toBeGreaterThan(0);

    // FR-M2-05: gói phổ biến có **1** nhãn đánh dấu (không nhân bản nhãn).
    for (const card of danhDau) {
      const soNhan = (card.match(/Phổ biến|Tiết kiệm/g) ?? []).length;
      expect(soNhan, `Gói đánh dấu có ${soNhan} nhãn: "${card.slice(0, 90)}"`).toBe(1);
    }
  });

  test('TC-T1-M2-006: Mỗi gói tại nhà ghi rõ mức phụ thu cộng thêm', async ({ page }) => {
    const the = await theDichVu(page);

    for (const dv of DICH_VU_T1) {
      if (dv.phuThu === null) continue;
      const card = the.find((t) => t.includes(dv.ten))!;
      expect(card, `"${dv.ten}" thiếu dòng phụ thu tại nhà`).toContain('Phụ thu tận nhà:');
      expect(card, `"${dv.ten}" thiếu mức ${dv.phuThu}`).toContain(dv.phuThu);
    }
  });

  test('TC-T1-M2-007: Số dịch vụ niêm yết khớp bảng giá mục 3 của SRS', async ({ page }) => {
    const the = await theDichVu(page);
    expect(the).toHaveLength(6);

    // Bảng giá phải có đúng 6 cột dịch vụ + cột "Loài & cân nặng".
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    const headers = await page
      .locator('table.hm-pricing-matrix thead th')
      .allInnerTexts();
    expect(headers.length).toBe(DICH_VU_T1.length + 1);
    // Bảng giá dùng `text-transform: uppercase` nên so khớp không phân biệt hoa thường.
    const chuoiHeader = headers.join(' | ').toLowerCase();
    for (const dv of DICH_VU_T1) {
      expect(chuoiHeader).toContain(dv.ten.toLowerCase());
    }
  });
});
