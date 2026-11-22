import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M3-02 (BVA) — T2 Mật Pet Family
 * Biên giá trị tại các ngưỡng bậc cân nặng.
 *
 * Bậc cân nặng T2 (đọc từ DOM, `reports/raw/probe-t2-chip2.json`):
 *   `<3kg` · `>3–6kg` · `>6–10kg` · `>10–20kg` · `>20–30kg` · `>30–40kg` · `>40kg`
 *
 * CÁCH THỰC HIỆN BVA: T2 cho khách **chọn bậc** (chip) chứ không nhập cân nặng,
 * nên BVA ở đây là kiểm tra **ánh xạ cân nặng → bậc** theo quy tắc biên:
 *   - cân = ngưỡng dưới của bậc k → thuộc bậc k (cận dưới **đóng**).
 *   - cân = ngưỡng dưới + 0.1 kg → vẫn thuộc bậc k.
 *
 * Quy tắc "cận dưới đóng" được chốt tại `docs/design/test-design-techniques.md`
 * §3.2 (bảng "Bậc kỳ vọng ở `min`"): ngưỡng 3 kg → `>3–6`, 6 kg → `>6–10`,
 * 10 kg → `>10–20`… Nghĩa là nhãn `>3–6kg` là **quy ước đặt tên** ("bậc có
 * cận dưới 3 kg"), phạm vi thực tế là `3 ≤ kg ≤ 6`.
 *
 * Bằng chứng hành vi thật (`reports/raw/probe-t2-bva3.json`): calculator tính
 * đúng theo bảng giá tĩnh — `<3kg`=120k, `>3–6kg`=200k, `>6–10kg`=300k,
 * `>10–20kg`=400k (Combo Tắm Vệ Sinh).
 *
 * ADR-11: chỉ chọn trong calculator, không gửi form.
 */

const NEXT = 'Tiếp tục →';

/** Chọn loài ở bước 1 và sang bước 2. */
async function chonLoai(page: Page, loai: '🐶 Chó' | '🐱 Mèo') {
  await page.getByRole('button', { name: loai, exact: true }).click();
  await page.waitForTimeout(600);
  const next = page.getByRole('button', { name: NEXT });
  await expect(next).toBeEnabled();
  await next.click();
  await page.waitForTimeout(1000);
}

/**
 * BVA: chọn bậc tương ứng với cân nặng `kg` theo quy tắc biên,
 * rồi trả về nhãn bậc đang được chọn.
 */
async function chonBacTheoKg(page: Page, kg: number): Promise<string> {
  // Nhãn bậc đọc trực tiếp từ DOM để không hard-code sai.
  const nhan = await page.locator('.chip').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
  expect(nhan.length, 'T2 phải có 7 bậc cân nặng').toBe(7);

  const bac = bacCho(nhan, kg);
  await page.getByRole('button', { name: bac, exact: true }).click();
  await page.waitForTimeout(500);

  // Sang bước 3 (chọn dịch vụ) — không có bước này thì panel dịch vụ chưa
  // được render và không thể bấm chọn dịch vụ.
  const next = page.getByRole('button', { name: NEXT });
  await expect(next).toBeEnabled();
  await next.click();
  await page.waitForTimeout(1000);

  return bac;
}

/**
 * Quy tắc biên: **cận dưới đóng** — mỗi bậc chứa cân nặng từ cận dưới
 * của nó trở đi, cho tới cận trên của bậc kế tiếp.
 *
 *   `<3kg`     chứa kg < 3
 *   `>3–6kg`   chứa 3 ≤ kg ≤ 6
 *   `>6–10kg`  chứa 6 < kg ≤ 10
 *   `>10–20kg` chứa 10 < kg ≤ 20
 *   `>20–30kg` chứa 20 < kg ≤ 30
 *   `>30–40kg` chứa 30 < kg ≤ 40
 *   `>40kg`    chứa kg > 40
 *
 * Lưu ý về nhãn: nhãn hiển thị trên site là `>3–6kg`, `>6–10kg`… — tức mỗi
 * bậc **mang nhãn cận dưới của bậc kế tiếp**, nên để ánh xạ đúng với
 * `docs/design/test-design-techniques.md` §3.2 ta quy ước cận dưới **đóng**:
 * cân nặng đúng bằng cận dưới thuộc bậc **mới** (bậc có nhãn đó).
 *
 * Cách chọn: dựng danh sách (cận dưới, nhãn) của mọi bậc rồi lấy bậc có
 * **cận dưới lớn nhất** mà vẫn ≤ kg. Nếu chỉ duyệt theo thứ tự và lấy bậc
 * khớp đầu tiên thì cân nặng đúng cận trên (vd 6 kg) sẽ rơi vào bậc trước
 * đó (`>3–6kg`) thay vì bậc kế tiếp (`>6–10kg`) — sai theo §3.2.
 */
function bacCho(nhan: string[], kg: number): string {
  // Bậc đầu tiên `<3kg` — chỉ chứa kg < 3.
  const dau = nhan.find((n) => /^<([\d.]+)kg$/.test(n));
  if (dau) {
    const nguong = Number(dau.match(/^<([\d.]+)kg$/)![1]);
    if (kg < nguong) return dau;
  }

  // Các bậc dạng `>A–Bkg` — cận dưới A đóng, cận trên B đóng.
  const ungDoi: { lo: number; nhan: string }[] = [];
  for (const n of nhan) {
    const khoang = n.match(/^>([\d.]+)–([\d.]+)kg$/);
    if (khoang) ungDoi.push({ lo: Number(khoang[1]), nhan: n });
  }

  // Lấy bậc có cận dưới **lớn nhất** mà vẫn ≤ kg.
  const hopNhat = ungDoi
    .filter((b) => kg >= b.lo)
    .sort((a, b) => b.lo - a.lo)[0];
  if (hopNhat) return hopNhat.nhan;

  // Bậc cuối `>Akg` — chứa kg > A.
  const tren = nhan.find((n) => /^>([\d.]+)kg$/.test(n));
  if (tren && kg > Number(tren.match(/^>([\d.]+)kg$/)![1])) return tren;

  throw new Error(`Không xác định được bậc cho ${kg}kg trong [${nhan.join(', ')}]`);
}

/** Đọc giá hiển thị trong khối "GIÁ DỰ KIẾN". */
async function docGia(page: Page): Promise<string> {
  const txt = await page.locator('.rail-price').innerText();
  // `~200.000đ` → `200000`
  return txt.replace(/[^\d.]/g, '').replace(/\./g, '');
}

/**
 * Chọn dịch vụ ở bước 3.
 *
 * LƯU Ý: nút dịch vụ của T2 nằm trong khối `.svc-list` của panel bước 3 —
 * phải dùng selector theo lớp CSS để không nhầm sang các nút khác trong
 * trang (ví dụ nút "Tính giá dự kiến →" hoặc link "Xem bảng giá").
 */
async function chonDichVu(page: Page, ten: string) {
  const nut = page.locator('.svc', { hasText: ten }).first();
  await nut.scrollIntoViewIfNeeded();
  await nut.click();
  await page.waitForTimeout(900);
}

test.describe('T2 Mật Pet — M3 BVA ngưỡng bậc cân nặng', () => {
  test('TC-T2-M3-013: BVA ngưỡng 3kg: cân 3kg thuộc bậc >3-6kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 3);
    // SRS FR-M3-02 (T2) + TD-EP-BVA §3.2: 3 kg → bậc ">3–6kg",
    // giá Combo Tắm Vệ Sinh = 200.000₫.
    expect(bac).toBe('>3–6kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('200000');
  });

  test('TC-T2-M3-014: BVA ngưỡng 3kg: cân 3.1kg thuộc bậc >3-6kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 3.1);
    expect(bac).toBe('>3–6kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('200000');
  });

  test('TC-T2-M3-015: BVA ngưỡng 6kg: cân 6kg thuộc bậc >6-10kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 6);
    expect(bac).toBe('>6–10kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('300000');
  });

  test('TC-T2-M3-016: BVA ngưỡng 6kg: cân 6.1kg thuộc bậc >6-10kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 6.1);
    expect(bac).toBe('>6–10kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('300000');
  });

  test('TC-T2-M3-017: BVA ngưỡng 10kg: cân 10kg thuộc bậc >10-20kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 10);
    expect(bac).toBe('>10–20kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('400000');
  });

  test('TC-T2-M3-018: BVA ngưỡng 10kg: cân 10.1kg thuộc bậc >10-20kg', async ({ page }) => {
    await page.goto('/spa', { waitUntil: 'load' });
    await chonLoai(page, '🐶 Chó');

    const bac = await chonBacTheoKg(page, 10.1);
    expect(bac).toBe('>10–20kg');

    await chonDichVu(page, 'Combo Tắm Vệ Sinh');
    expect(await docGia(page)).toBe('400000');
  });
});
