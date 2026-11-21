import { expect, type Page } from '@playwright/test';

/**
 * Helper dùng chung cho các spec T2 Mật Pet Family (Ngân — Ngày 7/8).
 *
 * Wizard T2 có 3 bước (S1 loài → S2 cân nặng → S3 dịch vụ) theo
 * docs/design/state-transition.md. Mọi thao tác đều chỉ chọn, không gửi form
 * (ADR-11 — ranh giới an toàn trên hệ thống thật).
 */

export const T2_URL = '/spa';

export const BUOC_HA = 'Tiếp tục →';
export const BUOC_QUAY_LAI = '← Quay lại';

/** Mở trang spa và chờ React hydrate để các nút bật đúng trạng thái. */
export async function moTrangSpa(page: Page): Promise<void> {
  await page.goto(T2_URL, { waitUntil: 'load' });
  await expect(page.getByRole('button', { name: BUOC_HA })).toBeVisible();
}

export async function chonLoai(page: Page, loai: 'Chó' | 'Mèo'): Promise<void> {
  const emoji = loai === 'Chó' ? '🐶' : '🐱';
  await page.getByRole('button', { name: `${emoji} ${loai}`, exact: true }).click();
  await expect(page.getByRole('button', { name: BUOC_HA })).toBeEnabled();
}

export async function chonBucCanNang(page: Page, band: string): Promise<void> {
  await page.getByRole('button', { name: band, exact: true }).click();
  await expect(page.getByRole('button', { name: BUOC_HA })).toBeEnabled();
}

/** Chuyển sang bước chọn dịch vụ (S3). */
export async function sangBuocDichVu(page: Page): Promise<void> {
  await page.getByRole('button', { name: BUOC_HA }).click();
  await expect(page.getByRole('button', { name: 'Combo trọn gói' })).toBeVisible();
}

/** Chọn một dịch vụ trong tab đang mở (Combo trọn gói hoặc Dịch vụ lẻ). */
export async function chonDichVu(page: Page, tenDichVu: string): Promise<void> {
  await page.getByRole('button', { name: new RegExp(tenDichVu) }).first().click();
}

/** Đọc giá dự kiến và tóm tắt lựa chọn ở thanh bên phải. */
export async function docGiaDuKien(page: Page): Promise<{ gia: string; tongTat: string }> {
  const gia = await page.locator('.rail-price').innerText();
  const tongTat = await page.locator('.rail-lines').innerText();
  return { gia, tongTat };
}

/** Mở form giữ chỗ (S4) từ thanh giá dự kiến. */
export async function moFormGiuCho(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Giữ chỗ với mức giá này →' }).click();
  await expect(page.locator('#f_phone')).toBeVisible();
}
