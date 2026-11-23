import type { Locator, Page } from '@playwright/test';

/**
 * Helper điều khiển wizard đặt lịch 4 bước của T1 (Pet NGON).
 *
 * Cấu trúc DOM đã xác minh bằng `scripts/_probe-t1-spec-dom.mjs`
 * (bằng chứng: `reports/raw/probe-t1-spec-dom.json`):
 *   - Modal: `.bk-modal`
 *   - Thanh tiêu đề bước: `.bk-step` (`.bk-step__num` = số, `.bk-step__label` = tên)
 *   - Bước 1: `.bk-svc` (6 dịch vụ) + `.bk-pet-grid--2 .bk-pet` (toggle Chó/Mèo)
 *   - Bước 2: `.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet` (7 bậc) + `.bk-input` (tên bé)
 *   - Bước 3: `.bk-day` (7 ngày) + `.bk-time` (8 khung giờ)
 *   - Bước 4: `.bk-loc` (Tại spa / Tận nhà) + ô địa chỉ + `.bk-input` họ tên / SĐT
 *   - Tóm tắt: `.bk-summary__row`, tổng: `.bk-summary__row--total`
 *
 * RANH GIỚI ADR-11: helper chỉ điền/chọn, **không** bấm nút gửi cuối cùng.
 */

/** Mở modal đặt lịch từ trang chủ T1. */
export async function moWizard(page: Page): Promise<Locator> {
  await page.goto('/vi', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.ga-booking-btn', { timeout: 20_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  return page.locator('.bk-modal');
}

/** Bước tiếp tục — trả về false nếu nút đang bị khoá (không click để tránh timeout). */
export async function tiepTuc(modal: Locator): Promise<boolean> {
  const nut = modal.getByRole('button', { name: /Tiếp tục/ });
  if (await nut.isDisabled()) return false;
  await nut.click();
  await modal.page().waitForTimeout(600);
  return true;
}

/** Bước quay lại. */
export async function quayLai(modal: Locator): Promise<void> {
  await modal.getByRole('button', { name: /Quay lại/ }).click();
  await modal.page().waitForTimeout(600);
}

/** Chọn dịch vụ ở bước 1 theo tên (khớp theo ranh giới từ). */
export async function chonDichVu(modal: Locator, ten: string): Promise<void> {
  await modal.locator('.bk-svc').filter({ hasText: ten }).first().click();
  await modal.page().waitForTimeout(200);
}

/** Đi từ bước 1 sang bước 2 (chọn dịch vụ trước). */
export async function sangBuoc2(modal: Locator, tenDichVu = 'Tắm'): Promise<void> {
  await chonDichVu(modal, tenDichVu);
  await tiepTuc(modal);
}

/** Chọn bậc cân nặng ở bước 2. */
export async function chonCanNang(modal: Locator, ten: string): Promise<void> {
  await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: ten }).first().click();
  await modal.page().waitForTimeout(250);
}

/** Điền tên bé ở bước 2 (bắt buộc để mở khoá nút "Tiếp tục"). */
export async function dienTenBe(modal: Locator, ten = 'Bé Test'): Promise<void> {
  await modal.locator('.bk-input[placeholder*="Bông" i]').fill(ten);
  await modal.page().waitForTimeout(250);
}

/** Chọn ngày + khung giờ ở bước 3. */
export async function chonNgayGio(modal: Locator): Promise<void> {
  await modal.locator('.bk-day').nth(1).click();
  await modal.page().waitForTimeout(150);
  await modal.locator('.bk-time').nth(1).click();
  await modal.page().waitForTimeout(150);
}

/**
 * Đi tới bước 4 (Địa điểm) với lựa chọn mặc định.
 * Không bấm nút "Xác nhận đặt lịch" (ADR-11).
 */
export async function sangBuoc4(modal: Locator): Promise<void> {
  await chonCanNang(modal, 'Chó nhỏ');
  await dienTenBe(modal);
  await tiepTuc(modal);
  await chonNgayGio(modal);
  await tiepTuc(modal);
}

/** Chọn "Tận nhà" ở bước 4. */
export async function chonTanNha(modal: Locator): Promise<void> {
  await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
  await modal.page().waitForTimeout(400);
}

/** Chọn "Tại spa" ở bước 4. */
export async function chonTaiSpa(modal: Locator): Promise<void> {
  await modal.locator('.bk-loc').filter({ hasText: 'Tại spa' }).first().click();
  await modal.page().waitForTimeout(300);
}

/** Nhập địa chỉ ở bước 4 và chờ site tính khoảng cách. */
export async function nhapDiaChi(modal: Locator, diaChi: string): Promise<void> {
  await modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]').fill(diaChi);
  await modal.page().waitForTimeout(2200);
}

/** Đọc khoảng cách hiển thị (số km) ở bước 4. */
export async function docKm(modal: Locator): Promise<number | null> {
  const txt = await modal.innerText();
  const m = txt.match(/Khoảng cách ước tính\s*\n?\s*([\d.,]+)\s*km/);
  return m ? Number(m[1]!.replace(',', '.')) : null;
}

/** Đọc phí di chuyển hiển thị (₫) — `null` nếu không hiện con số. */
export async function docPhiDiChuyen(modal: Locator): Promise<number | null> {
  const txt = await modal.innerText();
  const m = txt.match(/Phí di chuyển \(([\d.,]+)km\)\s*\n?\s*\+?\s*([\d.]+)₫/);
  if (m) return Number(m[2]!.replace(/\./g, ''));
  return /Phí di chuyển \(miễn phí/i.test(txt) ? 0 : null;
}

/** Đọc các dòng tóm tắt ở bước 4 (giá gói, phụ thu, tổng). */
export async function docTongTat(modal: Locator): Promise<string[]> {
  return modal.locator('.bk-summary__row').evaluateAll((rows) =>
    rows.map((r) => (r.textContent || '').replace(/\s+/g, ' ').trim()),
  );
}

/** Đọc tổng tiền (số ₫) ở bước 4. */
export async function docTongTien(modal: Locator): Promise<number | null> {
  const txt = await modal.innerText();
  const m = txt.match(/Tạm tính\s*\n?\s*([\d.]+)₫/);
  return m ? Number(m[1]!.replace(/\./g, '')) : null;
}

/** Nút gửi cuối cùng ở bước 4. */
export function nutXacNhan(modal: Locator): Locator {
  return modal.getByRole('button', { name: /Xác nhận đặt lịch/ });
}
