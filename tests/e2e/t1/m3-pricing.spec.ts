import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M3-01, FR-M3-02, FR-M3-05, FR-M3-07 — T1 Pet NGON
 * Bảng giá theo bậc cân nặng: EP + BVA trên ngưỡng bậc, đối chiếu giá gói,
 * và câu chữ "Từ ...₫" của FR-M3-07.
 *
 * Chỉ đọc bảng giá công khai + bước 1–2 của wizard (ADR-11).
 * Bằng chứng: `reports/raw/probe-t1-catalogue2.json`.
 */

/** Thứ tự 6 cột dịch vụ trong bảng giá T1. */
const COT = ['Tắm', 'Cắt tỉa lông', 'Cạo lông', 'Combo Tắm + Vệ sinh', 'Combo Tắm + Cắt tỉa', 'Combo Tắm + Cạo'];

type Hang = { loai: string; nhan: string; gia: number[] };

/** Đọc bảng giá T1 thành cấu trúc: mỗi loài là một mảng hang, mỗi hang 6 giá theo thứ tự cột. */
async function docBangGia(page: Page): Promise<Hang[]> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('table.hm-pricing-matrix', { timeout: 20_000 });

  return page.locator('table.hm-pricing-matrix tbody tr').evaluateAll((rows) => {
    const out: { loai: string; nhan: string; gia: number[] }[] = [];
    let loai = '';
    for (const r of rows) {
      const cells = Array.from(r.querySelectorAll('th,td')).map((c) =>
        (c.textContent || '').replace(/\s+/g, ' ').trim(),
      );
      if (cells.length === 0) continue;
      // Dòng tiêu đề loài: chỉ có 1 ô.
      if (cells.length === 1) {
        loai = cells[0]!;
        continue;
      }
      const gia = cells.slice(1).map((c) => {
        const m = c.replace(/[₫.\s]/g, '').match(/\d+/);
        return m ? Number(m[0]) : NaN;
      });
      out.push({ loai, nhan: cells[0]!, gia });
    }
    return out;
  });
}

/**
 * Bậc cân nặng chứa `kg` theo nhãn hiển thị của T1.
 *
 * Quy ước biên (theo `docs/testcases/t1.csv`, các ca TC-T1-M3-007..018):
 * khoảng `a–b` của T1 là khoảng **đóng bên dưới, mở bên trên** — cân nặng
 * đúng ngưỡng `a` thuộc bậc `a–b`, cân nặng đúng ngưỡng `b` thuộc bậc kế tiếp.
 * Vì vậy chỉ so `kg >= lo && kg < hi`.
 *
 * Bằng chứng: `docs/reference/pricing-baseline.csv` (REF-01) + nhãn thật trên
 * bảng giá T1 (`Chó nhỏ 3–5kg`, `Chó vừa 5–10kg`, …) và `docs/design/test-design-techniques.md`
 * §3.1 — bảng BVA kỳ vọng 3kg → `3–5`, 5kg → `5–10`, 10kg → `10–15`…
 * tức ngưỡng dưới **được tính** vào bậc hiện tại.
 *
 * Trả về `null` nếu site không có bậc nào chứa cân nặng đó.
 */
function bacChua(bang: Hang[], loai: string, kg: number): Hang | null {
  const hang = bang.filter((h) => h.loai === loai);
  for (const h of hang) {
    const m = h.nhan.match(/([\d.,]+)\s*[–\-]\s*([\d.,]+)\s*kg/);
    if (!m) {
      // Bậc đầu tiên — nhãn thật khác nhau theo loài:
      //   Chó: "Chó mini < 3kg"  → **loại trừ** 3 kg (3kg thuộc bậc kế tiếp)
      //   Mèo:  "Mèo mini ≤ 3kg"  → **bao gồm** 3 kg
      // Bằng chứng: `reports/raw/probe-t1-bac.json` (nhãn `< 3kg` và `≤ 3kg`).
      const d = h.nhan.match(/([<≤])\s*([\d.,]+)\s*kg/);
      if (!d) continue;
      const nguong = Number(d[2]!.replace(/\./g, ''));
      const laBangTrong = d[1] === '≤';
      if (laBangTrong ? kg <= nguong : kg < nguong) return h;
      continue;
    }
    const lo = Number(m[1]!.replace(/\./g, ''));
    const hi = Number(m[2]!.replace(/\./g, ''));
    if (kg >= lo && kg < hi) return h;
  }
  return null;
}

test.describe('T1 Pet NGON — M3 Bảng giá theo cân nặng', () => {
  test('TC-T1-M3-001: Bảng giá có đủ cột cho mọi bậc cân nặng và mọi dịch vụ', async ({ page }) => {
    const bang = await docBangGia(page);

    const cho = bang.filter((h) => h.loai === 'Chó');
    const meo = bang.filter((h) => h.loai === 'Mèo');
    expect(cho).toHaveLength(7);
    expect(meo).toHaveLength(7);
    expect(bang).toHaveLength(14);

    // BR-01: ngưỡng bậc của chó và mèo.
    expect(cho.map((h) => h.nhan).join(' | ')).toMatch(/Chó mini< 3kg/);
    expect(cho[6]!.nhan).toMatch(/Chó siêu đại25–30kg/);
    expect(meo.map((h) => h.nhan).join(' | ')).toMatch(/Mèo mini≤ 3kg/);
    expect(meo[6]!.nhan).toMatch(/Mèo siêu đại25–30kg/);

    // 100% ô giá là số xác định > 0 (FR-M3-01).
    for (const h of bang) {
      expect(h.gia, `Thiếu cột ở "${h.nhan}"`).toHaveLength(COT.length);
      for (const g of h.gia) {
        expect(Number.isFinite(g)).toBe(true);
        expect(g).toBeGreaterThan(0);
      }
    }
  });

  test('TC-T1-M3-002: Tra bảng giá đúng cho (Chó, bậc 3-5kg) + dịch vụ đã chọn', async ({ page }) => {
    const bang = await docBangGia(page);
    const hang = bang.find((h) => h.loai === 'Chó' && h.nhan.includes('3–5kg'))!;
    const idx = COT.indexOf('Combo Tắm + Vệ sinh');
    expect(hang.gia[idx]).toBe(265000);

    // Đối chiếu với giá hiển thị ở bước 2 của wizard cho cùng bậc + dịch vụ.
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ga-booking-btn', { timeout: 20_000 });
    await page.locator('.ga-booking-btn').first().click();
    await page.waitForSelector('.bk-modal', { timeout: 15_000 });
    const modal = page.locator('.bk-modal');
    await modal.locator('.bk-svc').filter({ hasText: 'Combo Tắm + Vệ sinh' }).first().click();
    await modal.getByRole('button', { name: /Tiếp tục/ }).click();
    await page.waitForTimeout(700);

    const chips = await modal.locator('.bk-pet').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    const dong = chips.find((c) => c.includes('Chó nhỏ'))!;
    expect(dong).toContain('265.000₫');
  });

  test('TC-T1-M3-003: Cùng bậc cân nặng nhưng Mèo cho giá khác Chó', async ({ page }) => {
    const bang = await docBangGia(page);
    const idx = COT.indexOf('Combo Tắm + Vệ sinh');

    const cho = bang.find((h) => h.loai === 'Chó' && h.nhan.includes('3–5kg'))!;
    const meo = bang.find((h) => h.loai === 'Mèo' && h.nhan.includes('3–5kg'))!;

    // FR-M3-02 (T1): Chó ≠ Mèo ở cùng bậc cân nặng.
    expect(cho.gia[idx]).toBe(265000);
    expect(meo.gia[idx]).toBe(275000);
    expect(cho.gia[idx]).not.toBe(meo.gia[idx]);
  });

  test('TC-T1-M3-004: Trang giá ghi rõ giá cuối xác nhận tại spa, giá hiển thị chỉ là dự kiến', async ({
    page,
  }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    const noiDung = await page.locator('body').innerText();

    // FR-M3-05: câu ghi rõ giá cuối được xác nhận tại spa.
    const coXacNhan =
      /xác nhận tại spa/i.test(noiDung) ||
      /giá cuối cùng sẽ tính/i.test(noiDung) ||
      /xác nhận & thanh toán/i.test(noiDung);
    expect(coXacNhan, 'Không tìm thấy câu ghi rõ giá cuối được xác nhận tại spa').toBe(true);
  });

  test('TC-T1-M3-005: Gói hiển thị mức giá từ ...₫ kèm khoảng min-max', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });

    const the = await page.locator('.hm-svc').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );
    for (const card of the) {
      expect(card, `Thẻ không có mức "Từ ...?": "${card.slice(0, 80)}"`).toMatch(/Từ\s*\d{1,3}\.\d{3}₫/);
    }

    // Khoảng min–max xuất hiện ở bước 1 của wizard (thẻ dịch vụ chỉ có "Từ ...₫").
    await page.locator('.ga-booking-btn').first().click();
    await page.waitForSelector('.bk-modal', { timeout: 15_000 });
    const modal = page.locator('.bk-modal');
    const giaBuoc1 = await modal.locator('.bk-svc__price').allInnerTexts();
    const coKhoang = giaBuoc1.some((c) => /\d{1,3}\.\d{3}₫\s*[–\-]\s*\d{1,3}\.\d{3}₫/.test(c));
    expect(coKhoang, 'Không tìm thấy khoảng min–max giá').toBe(true);
  });

  test('TC-T1-M3-006: Khoảng min-max của gói khớp bảng giá', async ({ page }) => {
    const bang = await docBangGia(page);
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.ga-booking-btn', { timeout: 20_000 });
    await page.locator('.ga-booking-btn').first().click();
    await page.waitForSelector('.bk-modal', { timeout: 15_000 });
    const modal = page.locator('.bk-modal');

    const the = await modal.locator('.bk-svc').evaluateAll((els) =>
      els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
    );

    // Khoảng min–max trên thẻ dịch vụ được site tính theo **bảng giá Chó**
    // (loài mặc định của bảng giá T1), không phải gộp cả Chó lẫn Mèo.
    // Bằng chứng: `reports/raw/probe-t1-nghivan.json` → `M3_006.theGiaPrice`.
    //   Tắm               88.000₫ – 660.000₫  (đúng cả 2 cách)
    //   Cắt tỉa lông     145.000₫ – 440.000₫  (gộp Mèo ra 585.000₫ → sai)
    //   Combo Tắm+Cắt tỉa 240.000₫ – 835.000₫ (gộp Mèo ra 890.000₫ → sai)
    const giaCho = bang.filter((h) => h.loai === 'Chó');

    for (const [idx, ten] of COT.entries()) {
      const card = the.find((t) => t.includes(ten));
      expect(card, `Thiếu thẻ "${ten}"`).toBeTruthy();
      const m = card!.match(/(\d{1,3}\.\d{3})₫\s*[–\-]\s*(\d{1,3}\.\d{3})₫/);
      expect(m, `Thẻ "${ten}" không có khoảng min–max: "${card!.slice(0, 100)}"`).toBeTruthy();

      const giaCuaCot = giaCho
        .map((h) => h.gia[idx])
        .filter((g): g is number => Number.isFinite(g));
      expect(giaCuaCot.length, `Cột "${ten}" không có dữ liệu Chó`).toBeGreaterThan(0);
      const min = Math.min(...giaCuaCot);
      const max = Math.max(...giaCuaCot);
      const b = (n: number) => n.toLocaleString('vi-VN');

      expect(
        m![1],
        `Min của "${ten}" (${m![1]}) không khớp bảng giá Chó (${b(min)})`,
      ).toBe(b(min));
      expect(
        m![2],
        `Max của "${ten}" (${m![2]}) không khớp bảng giá Chó (${b(max)})`,
      ).toBe(b(max));
    }
  });

  // ---- BVA trên ngưỡng bậc cân nặng (FR-M3-02) ----
  //
  // Bộ dữ liệu BVA bám `docs/design/test-design-techniques.md` §3.1 và
  // `docs/testcases/t1.csv` (TC-T1-M3-007..018). Mỗi ngưỡng có 3 ca:
  // `min−1` (bậc trước), `min` (bậc bắt đầu tại ngưỡng), `min+1` (bậc sau).
  //
  // LƯU Ý về `TC-T1-M3-018`: BR-01 quy định bậc lớn nhất của T1 là `25–30kg`,
  // tức **không có bậc nào trên 30 kg**. Vì vậy giá trị biên trên của bậc
  // cuối là `30kg` (được tính vào `25–30kg`) và `30.1kg` **không thuộc bậc nào**.
  // Ca này kiểm chứng đúng hành vi thật: trọng lượng vượt bậc cao nhất
  // không có băng giá → phải được ghi nhận, không được bịa thêm bậc.
  const BVA = [
    { tc: 'TC-T1-M3-007', kg: 2.9, loai: 'Chó', nhan: 'Chó mini' },
    { tc: 'TC-T1-M3-008', kg: 3, loai: 'Chó', nhan: 'Chó nhỏ' },
    { tc: 'TC-T1-M3-009', kg: 3.1, loai: 'Chó', nhan: 'Chó nhỏ' },
    { tc: 'TC-T1-M3-010', kg: 5, loai: 'Chó', nhan: 'Chó vừa' },
    { tc: 'TC-T1-M3-011', kg: 5.1, loai: 'Chó', nhan: 'Chó vừa' },
    { tc: 'TC-T1-M3-012', kg: 9.9, loai: 'Chó', nhan: 'Chó vừa' },
    { tc: 'TC-T1-M3-013', kg: 10, loai: 'Chó', nhan: 'Chó lớn' },
    { tc: 'TC-T1-M3-014', kg: 10.1, loai: 'Chó', nhan: 'Chó lớn' },
    { tc: 'TC-T1-M3-015', kg: 15, loai: 'Chó', nhan: 'Chó rất lớn' },
    { tc: 'TC-T1-M3-016', kg: 20, loai: 'Chó', nhan: 'Chó đại' },
    { tc: 'TC-T1-M3-017', kg: 25, loai: 'Chó', nhan: 'Chó siêu đại' },
    { tc: 'TC-T1-M3-018', kg: 30.1, loai: 'Chó', nhan: null },
  ] as const;

  for (const c of BVA) {
    const ten = c.nhan ?? 'bậc trên 30kg (không tồn tại)';
    test(`${c.tc}: BVA ngưỡng ${c.kg}kg thuộc bậc "${ten}"`, async ({ page }) => {
      const bang = await docBangGia(page);
      const hang = bacChua(bang, c.loai, c.kg);

      if (c.nhan === null) {
        // Trên bậc cao nhất (30kg) → không được có băng giá.
        expect(
          hang,
          `${c.kg}kg vượt bậc cao nhất "25–30kg" của BR-01 nhưng bảng vẫn có bậc "${hang?.nhan}"`,
        ).toBeNull();
        return;
      }

      expect(
        hang,
        `${c.kg}kg không thuộc bậc nào của ${c.loai} (BR-01 chỉ có 7 bậc tới ${c.nhan})`,
      ).not.toBeNull();
      expect(
        hang!.nhan,
        `${c.kg}kg phải thuộc bậc "${c.nhan}" nhưng bảng cho "${hang!.nhan}"`,
      ).toContain(c.nhan);
    });
  }
});
