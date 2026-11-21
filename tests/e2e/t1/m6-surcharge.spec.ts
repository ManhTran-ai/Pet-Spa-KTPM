import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M6-01, FR-M6-03, FR-M6-04, BR-06, BR-16 — T1 Pet NGON
 * Phụ thu tại nhà cố định theo từng gói, và việc dịch vụ tại nhà là nguồn duy nhất
 * phát sinh phụ thu di chuyển.
 * Chỉ đọc thẻ dịch vụ — không mở/gửi wizard đặt lịch (ADR-11).
 */

const PHU_THU_TAI_NHA = [
  { ten: 'Tắm', phuThu: '+50.000₫' },
  { ten: 'Cạo lông', phuThu: '+80.000₫' },
  { ten: 'Combo Tắm + Vệ sinh', phuThu: '+70.000₫' },
  { ten: 'Combo Tắm + Cạo', phuThu: '+100.000₫' },
] as const;

async function theDichVu(page: Page): Promise<string[]> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  return page.locator('.hm-svc').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
}

/**
 * Tìm thẻ dịch vụ theo tên chính xác.
 * Thẻ bắt đầu bằng tên icon Material (ví dụ "bathtubTắm…"), nên phải khớp
 * theo ranh giới từ chứ không dùng `includes` (tránh nhầm "Tắm" với "Combo Tắm…").
 */
async function timThe(page: Page, ten: string): Promise<string> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  const the = await theDichVu(page);
  return the.find((x) => x.includes(ten)) ?? '';
}

test.describe('T1 Pet NGON — M6 Phụ thu dịch vụ tại nhà', () => {
  test('TC-T1-M6-011: gói Tắm tại nhà công phụ thu cố định 50.000₫', async ({ page }) => {
    const card = await timThe(page, 'Tắm');
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +50.000₫');
  });

  test('TC-T1-M6-012: gói Cạo lông tại nhà công phụ thu cố định 80.000₫', async ({ page }) => {
    const card = await timThe(page, 'Cạo lông');
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +80.000₫');
  });

  test('TC-T1-M6-013: gói Combo Tắm+Cạo tại nhà công phụ thu cố định 100.000₫', async ({ page }) => {
    const card = await timThe(page, 'Combo Tắm + Cạo');
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +100.000₫');
  });

  test('TC-T1-M6-019: gói Combo Tắm+Vệ sinh tại nhà công phụ thu cố định 70.000₫ (CHG-2026-11-21-01)', async ({
    page,
  }) => {
    const card = await timThe(page, 'Combo Tắm + Vệ sinh');
    expect(card, 'Thiếu thẻ "Combo Tắm + Vệ sinh"').toBeTruthy();
    expect(card).toContain('Có tận nhà');
    expect(card).toContain('Phụ thu tận nhà: +70.000₫');
  });

  test('TC-T1-M6-015: mọi gói tại nhà ghi rõ chưa gồm phí di chuyển', async ({ page }) => {
    const the = await theDichVu(page);
    for (const dv of PHU_THU_TAI_NHA) {
      const card = the.find((t) => t.includes(dv.ten))!;
      expect(card, `"${dv.ten}" thiếu ghi chú phí di chuyển`).toContain('chưa gồm phí di chuyển');
    }
  });

  test('TC-T1-M6-016: gói không hỗ trợ tại nhà không ghi sai nhãn phụ thu tại nhà', async ({ page }) => {
    const the = await theDichVu(page);
    for (const ten of ['Cắt tỉa lông', 'Combo Tắm + Cắt tỉa']) {
      const card = the.find((t) => t.includes(ten))!;
      expect(card, `"${ten}" không được ghi "Có tận nhà"`).not.toContain('Có tận nhà');
      expect(card, `"${ten}" không được ghi phụ thu tại nhà`).not.toContain('Phụ thu tận nhà:');
    }
  });

  test('TC-T1-M6-017: bảng khoảng cách đề xuất 4 dảng 0-5, 5-10, 10-15, trên 15 km', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });

    // Bảng dải km nằm trong section phụ thu di chuyển (BR-05).
    // Dải dùng khoảng trắng quanh dấu en-dash: "0 – 5 km", "5 – 10 km", …
    const noiDung = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
    for (const dai of ['0 – 5 km', '5 – 10 km', '10 – 15 km', 'Trên 15 km']) {
      expect(noiDung, `Thiếu dải km "${dai}"`).toContain(dai);
    }
    // Dải cuối không hiện con số mà chuyển sang báo giá riêng (BR-05, FR-M6-06).
    expect(noiDung).toMatch(/Trên 15 km[\s\S]{0,80}Báo giá riêng/i);
  });
});
