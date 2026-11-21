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
  test('TC-T1-M2-001: danh mục có 6 dịch vụ, mỗi dịch vụ có tên, giá và thời lượng', async ({ page }) => {
    const the = await theDichVu(page);
    expect(the).toHaveLength(DICH_VU_T1.length);

    for (const dv of DICH_VU_T1) {
      const card = the.find((t) => t.includes(dv.ten));
      expect(card, `Thiếu thẻ dịch vụ "${dv.ten}"`).toBeTruthy();
      // Giá: có dấu phân cách nghìn dạng "88.000₫"
      expect(card!, /\d{1,3}\.\d{3}₫/).toBeTruthy();
      // Thời lượng: "45 phút" / "90 phút" / "120 phút"
      expect(card!, /\d{1,3}\s*phút/).toBeTruthy();
    }
  });

  test('TC-T1-M2-002: mỗi dịch vụ nêu rõ thành phần bao gồm trong mô tả', async ({ page }) => {
    const the = await theDichVu(page);

    // Mỗi thẻ phải có đoạn mô tả dài hơn nhãn (nội dung "bao gồm" thành phần).
    for (const dv of DICH_VU_T1) {
      const card = the.find((t) => t.includes(dv.ten))!;
      const moTa = card.replace(dv.ten, '').replace(/Có tận nhà|Chỉ tại spa/g, '');
      expect(moTa.length, `Mô tả "${dv.ten}" quá ngắn`).toBeGreaterThan(60);
    }
  });

  test('TC-T1-M2-003: mọi dịch vụ không hỗ trợ tại nhà đều ghi rõ nhãn "Chỉ tại spa"', async ({ page }) => {
    const the = await theDichVu(page);

    for (const dv of DICH_VU_T1) {
      const card = the.find((t) => t.includes(dv.ten))!;
      if (dv.nhan === 'Chỉ tại spa') {
        expect(card, `"${dv.ten}" phải ghi "Chỉ tại spa"`).toContain('Chỉ tại spa');
        expect(card, `"${dv.ten}" không được ghi "Có tận nhà"`).not.toContain('Có tận nhà');
      } else {
        expect(card, `"${dv.ten}" phải ghi "Có tận nhà"`).toContain('Có tận nhà');
      }
    }
  });

  test('TC-T1-M2-008: không dịch vụ nào của T1 thiếu nhãn tại spa / tại nhà', async ({ page }) => {
    const the = await theDichVu(page);

    for (const card of the) {
      const coNhan =
        card.includes('Có tận nhà') || card.includes('Chỉ tại spa');
      expect(coNhan, `Thẻ thiếu nhãn tại spa/tại nhà: "${card.slice(0, 80)}"`).toBe(true);
    }
  });

  test('TC-T1-M2-005: gói phổ biến có nhãn đánh dấu riêng', async ({ page }) => {
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
  });

  test('TC-T1-M2-006: 100% gói tại nhà ghi rõ mức phụ thu cộng thêm bằng số (₫)', async ({ page }) => {
    const the = await theDichVu(page);

    for (const dv of DICH_VU_T1) {
      if (dv.phuThu === null) continue;
      const card = the.find((t) => t.includes(dv.ten))!;
      expect(card, `"${dv.ten}" thiếu dòng phụ thu tại nhà`).toContain('Phụ thu tận nhà:');
      expect(card, `"${dv.ten}" thiếu mức ${dv.phuThu}`).toContain(dv.phuThu);
      // Mức phụ thu chưa gồm phí di chuyển — BR-16 / FR-M6-04.
      expect(card, `"${dv.ten}" thiếu ghi chú chưa gồm phí di chuyển`).toContain(
        'chưa gồm phí di chuyển',
      );
    }
  });

  test('TC-T1-M2-007: số dịch vụ niêm yết khớp bảng giá mục 3 của SRS (6 dịch vụ)', async ({ page }) => {
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
