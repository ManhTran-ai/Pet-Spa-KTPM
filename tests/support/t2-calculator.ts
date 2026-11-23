import { expect, type Page } from '@playwright/test';

/**
 * Helper điều khiển calculator giá 3 bước của T2 (Mật Pet Family).
 *
 * Cấu trúc DOM đã xác minh bằng `scripts/_probe-t2-spec-dom.mjs`
 * và `scripts/_probe-t2-bva.mjs`:
 *   - Bước 1 (loài): `.pet-opt` — "🐶 Chó" / "🐱 Mèo"
 *   - Bước 2 (cân nặng): `.chip` — 7 bậc: `<3kg`, `>3–6kg`, `>6–10kg`,
 *     `>10–20kg`, `>20–30kg`, `>30–40kg`, `>40kg`
 *   - Bước 3 (dịch vụ): `.svc.combo` (4 combo) + `.svc` (dịch vụ lẻ)
 *   - Khối giá: `.rail-price` — giá dự kiến tức thì
 *   - Khối tóm tắt: `.rail-lines` — loài / bậc / dịch vụ
 *   - Điều hướng: nút "Tiếp tục →", nút `button.back` ("← Quay lại")
 *
 * RANH GIỚI ADR-11: helper chỉ chọn, **không** bấm "Giữ chỗ cho bé".
 */

export const NEXT_T2 = 'Tiếp tục →';

/** Chọn loài ở bước 1 rồi sang bước 2. */
export async function chonLoaiT2(page: Page, loai: '🐶 Chó' | '🐱 Mèo'): Promise<void> {
  await page.getByRole('button', { name: loai, exact: true }).click();
  await page.waitForTimeout(600);
  const next = page.getByRole('button', { name: NEXT_T2 });
  await expect(next).toBeEnabled();
  await next.click();
  await page.waitForTimeout(1000);
}

/** Chọn bậc cân nặng ở bước 2 rồi sang bước 3. */
export async function chonCanNangT2(page: Page, band: string): Promise<void> {
  await page.getByRole('button', { name: band, exact: true }).click();
  await page.waitForTimeout(500);
  const next = page.getByRole('button', { name: NEXT_T2 });
  await expect(next).toBeEnabled();
  await next.click();
  await page.waitForTimeout(1000);
}

/** Chọn dịch vụ ở bước 3 (theo tên, khớp một phần). */
export async function chonDichVuT2(page: Page, ten: string): Promise<void> {
  const re = new RegExp(ten.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  await page.getByRole('button', { name: re }).first().click();
  await page.waitForTimeout(900);
}

/**
 * Đọc giá dự kiến hiển thị, đã bỏ dấu phân cách.
 *
 * LƯU Ý: `.rail-price` hiển thị theo định dạng tiền Việt có dấu chấm phân
 * tách nghìn (`~200.000đ`). Hàm này chuẩn hoá về **số nguyên không dấu**
 * (`200000`) để so sánh được với giá trị mong đợi kiểu số.
 *
 * Số phân tích nằm trong thẻ `<small>` (đơn vị "đ") nên phải bỏ qua.
 */
export async function docGiaT2(page: Page): Promise<string> {
  const txt = await page.locator('.rail-price').innerText();
  return txt
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, '')
    .replace(/,$/, '');
}

/** Đọc khối tóm tắt lựa chọn (`.rail-lines` — chỉ có sau khi đã chọn dịch vụ). */
export async function docTomTatT2(page: Page): Promise<string> {
  return page.locator('.rail-lines').innerText();
}

/**
 * Đọc khối "TÓM TẮT LỰA CHỌN" (`.book-summary`) — khối này **luôn có mặt**,
 * kể cả khi chưa chọn gì (lúc đó hiện "Chưa có lựa chọn").
 *
 * Khác với `.rail-lines` (chỉ xuất hiện sau khi đã chọn dịch vụ), dùng
 * `.book-summary` để kiểm tra trạng thái "chưa có lựa chọn" ở bước 1.
 */
export async function docTomTatDayDuT2(page: Page): Promise<string> {
  return page.locator('.book-summary').innerText();
}

/**
 * Bảng giá tĩnh của T2 — 3 thẻ `<table>` trong trang `/spa`.
 *
 * LƯU Ý QUAN TRỌNG (bằng chứng `reports/raw/probe-t2-banggia4.json`):
 * các bảng giá nằm **dưới vùng nhìn thấy** và trang render theo kiểu lazy.
 * `body.innerText` chỉ trả về phần đang hiển thị, nên phải cuộn hết trang
 * trước khi đọc — nếu không, nội dung bảng giá sẽ "biến mất" và test fail
 * một cách gây hiểu nhầm.
 *
 * Hàm trả về toàn bộ nội dung text của cả 3 bảng, đã gộp lại.
 */
export async function docBangGiaT2(page: Page): Promise<string> {
  // Cuộn hết trang để React/IntersectionObserver render toàn bộ bảng giá.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  const texts = await page.locator('table').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
  return texts.join(' | ');
}

/** Nhãn của 7 bậc cân nặng. */
export async function docBacCanNangT2(page: Page): Promise<string[]> {
  return page.locator('.chip').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  );
}

/** Quay lại bước trước. */
export async function quayLaiT2(page: Page): Promise<void> {
  await page.locator('button.back').click();
  await page.waitForTimeout(800);
}
