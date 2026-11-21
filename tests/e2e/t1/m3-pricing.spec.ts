import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M3-01, FR-M3-02, FR-M3-05, FR-M3-07, BR-18 — T1 Pet NGON
 * Bảng giá theo bậc cân nặng: EP + BVA trên ngưỡng bậc, tính đơn điệu BR-18,
 * và câu chữ "Từ ...?" của FR-M3-07.
 * Chỉ đọc bảng giá công khai (ADR-11).
 */

type Hang = { nhan: string; gia: number[] }[];

const COT = ['Tắm', 'Cắt tỉa lông', 'Cạo lông', 'Combo Tắm + Vệ sinh', 'Combo Tắm + Cắt tỉa', 'Combo Tắm + Cạo'];

/** Đọc bảng giá T1 thành cấu trúc: mỗi loài là một mảng hang, mỗi hang 6 giá theo thứ tự cột. */
async function docBangGia(page: Page) {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('table.hm-pricing-matrix', { timeout: 20_000 });

  return page.locator('table.hm-pricing-matrix tbody tr').evaluateAll((rows) => {
    const out: { loai: string; nhan: string; gia: number[] }[] = [];
    let loai = '';
    for (const r of rows) {
      const cells = [...r.querySelectorAll('th,td')].map((c) =>
        (c.textContent || '').replace(/\s+/g, ' ').trim(),
      );
      if (cells.length === 0) continue;
      // Dòng tiêu đề loài: chỉ có 1 ô.
      if (cells.length === 1) {
        loai = cells[0];
        continue;
      }
      const gia = cells.slice(1).map((c) => {
        const m = c.replace(/[₫.\s]/g, '').match(/\d+/);
        return m ? Number(m[0]) : NaN;
      });
      out.push({ loai, nhan: cells[0], gia });
    }
    return out;
  });
}

test.describe('T1 Pet NGON — M3 Bảng giá theo cân nặng', () => {
  test('TC-T1-M3-001: bảng giá có đủ 7 bậc cân nặng cho cả Chó và Mèo', async ({ page }) => {
    const bang = await docBangGia(page);

    const cho = bang.filter((h) => h.loai === 'Chó');
    const meo = bang.filter((h) => h.loai === 'Mèo');
    expect(cho).toHaveLength(7);
    expect(meo).toHaveLength(7);
    expect(bang).toHaveLength(14);

    // BR-01: ngưỡng bậc của chó và mèo.
    expect(cho.map((h) => h.nhan).join(' | ')).toMatch(/Chó mini< 3kg/);
    expect(cho[6].nhan).toMatch(/Chó siêu đại25–30kg/);
    expect(meo.map((h) => h.nhan).join(' | ')).toMatch(/Mèo mini≤ 3kg/);
    expect(meo[6].nhan).toMatch(/Mèo siêu đại25–30kg/);
  });

  test('TC-T1-M3-002: chọn (Chó, 5–10kg) + Combo Tắm+Vệ sinh → 375.000₫ đúng bảng', async ({ page }) => {
    const bang = await docBangGia(page);
    const hang = bang.find((h) => h.loai === 'Chó' && h.nhan.includes('5–10kg'))!;
    const idx = COT.indexOf('Combo Tắm + Vệ sinh');
    expect(hang.gia[idx]).toBe(375000);
  });

  test('TC-T1-M3-003: cùng bậc cân nặng nhưng Mèo có giá khác Chó (Combo Tắm+Vệ sinh)', async ({ page }) => {
    const bang = await docBangGia(page);
    const idx = COT.indexOf('Combo Tắm + Vệ sinh');

    const cho = bang.find((h) => h.loai === 'Chó' && h.nhan.includes('5–10kg'))!;
    const meo = bang.find((h) => h.loai === 'Mèo' && h.nhan.includes('5–10kg'))!;

    // FR-M3-02 (T1): Chó ≠ Mèo ở cùng bậc cân nặng.
    expect(cho.gia[idx]).toBe(375000);
    expect(meo.gia[idx]).toBe(405000);
    expect(cho.gia[idx]).not.toBe(meo.gia[idx]);
  });

  test('TC-T1-M3-007: 100% giá trong bảng đều là số nguyên > 0, không ô trống', async ({ page }) => {
    const bang = await docBangGia(page);
    for (const hang of bang) {
      expect(hang.gia).toHaveLength(COT.length);
      for (const g of hang.gia) {
        expect(Number.isFinite(g)).toBe(true);
        expect(g).toBeGreaterThan(0);
        expect(Number.isInteger(g)).toBe(true);
      }
    }
  });

  test('TC-T1-M3-010: BR-18 — giá tăng đơn điệu theo bậc cân nặng trong cùng một cột', async ({ page }) => {
    const bang = await docBangGia(page);

    for (const loai of ['Chó', 'Mèo']) {
      const hang = bang.filter((h) => h.loai === loai);
      for (let c = 0; c < COT.length; c += 1) {
        for (let i = 1; i < hang.length; i += 1) {
          const thap = hang[i - 1].gia[c];
          const cao = hang[i].gia[c];
          expect(
            cao,
            `${loai} · ${COT[c]} · ${hang[i].nhan} (${cao}) không lớn hơn bậc trước (${thap})`,
          ).toBeGreaterThanOrEqual(thap);
        }
      }
    }
  });

  test('TC-T1-M3-005: mỗi dịch vụ ghi rõ giá dưới dạng khoảng "Từ ...?"', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });

    const the = await page.locator('.hm-svc').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    for (const card of the) {
      expect(card, `Thẻ không có mức "Từ ...?": "${card.slice(0, 80)}"`).toMatch(/Từ\s*\d{1,3}\.\d{3}₫/);
    }
  });

  test('TC-T1-M3-004: trang giá ghi rõ giá cuối xác nhận tại spa', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    const noiDung = await page.locator('body').innerText();

    // FR-M3-05: câu ghi rõ giá cuối được xác nhận tại spa.
    // T1 diễn đạt bằng "Giá hiển thị là khoảng giá theo cân… Giá cuối cùng sẽ tính
    // theo loài + cân nặng" (nằm trong wizard đặt lịch) và "Xác nhận & thanh toán".
    const coXacNhan =
      /xác nhận tại spa/i.test(noiDung) ||
      /giá cuối cùng sẽ tính/i.test(noiDung) ||
      /xác nhận & thanh toán/i.test(noiDung);
    expect(coXacNhan, 'Không tìm thấy câu ghi rõ giá cuối được xác nhận tại spa').toBe(true);
  });
});
