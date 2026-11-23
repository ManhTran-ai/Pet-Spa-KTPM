import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: (1) T1 dia chi >15km co bao gia rieng khong? (2) T2 co mo ta quy trinh 4 buoc? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

/* ---------- T1: thu dia chi xa ---------- */
async function moWizard() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1200);
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  const modal = page.locator('.bk-modal');
  await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(300);
  await modal.locator('.bk-input').first().fill('Bé Test');
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  if ((await modal.locator('.bk-time').count()) > 0) {
    await modal.locator('.bk-time').first().click();
    await page.waitForTimeout(300);
  }
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  // Chon "Tận nhà" de hien dia chi.
  await modal.locator('.bk-loc').filter({ hasText: /Tận nhà|Tận nhà/ }).first().click();
  await page.waitForTimeout(500);
  return modal;
}

const modal = await moWizard();
const diaChi = ['Hà Nội', 'Đà Lạt, Lâm Đồng', 'Quảng Ngãi', 'Nha Trang, Khánh Hoà', 'Hải Phòng'];
const ketQua = [];
for (const d of diaChi) {
  const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
  if ((await onDiaChi.count()) === 0) break;
  await onDiaChi.fill(d);
  await page.waitForTimeout(2500);
  const doan = (await modal.innerText()).replace(/\n{2,}/g, '\n');
  const i = doan.search(/Phí di chuyển/);
  ketQua.push({
    diaChi: d,
    doan: i >= 0 ? doan.slice(i, i + 160) : doan.slice(0, 300),
    coLienHe: /Liên hệ|Báo giá riêng/i.test(doan),
  });
}
K.t1_diaChiXa = ketQua;

/* ---------- T2: quy trinh 4 buoc ---------- */
const trangT2 = ['/spa', '/bang-gia', '/cham-soc', '/so-sanh', '/showroom', '/blog', '/cau-hoi-thuong-gap'];
const quet = [];
for (const duong of trangT2) {
  const resp = await page.goto(`https://matpet.vn${duong}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  if (!resp) continue;
  await page.waitForTimeout(800);
  const txt = await page.locator('body').innerText();
  const reBuoc = /\b(\d)\s*[\.\)]?\s*(tiếp nhận|tiếp nhận|kiểm tra|grooming|bàn giao|chăm sóc|tắm|cắt)/gi;
  quet.push({
    duong,
    status: resp.status(),
    coBuoc: /tiếp nhận|bàn giao/i.test(txt),
    doanBuoc: (() => {
      const i = txt.search(/tiếp nhận|bàn giao/i);
      return i >= 0 ? txt.slice(Math.max(0, i - 300), i + 600) : '';
    })(),
    coNenDat: /2\s*[–\-]\s*4 giờ|trước ít nhất/i.test(txt),
    coGoiXacNhan: /sẽ gọi xác nhận|gọi xác nhận|xác nhận khung giờ/i.test(txt),
    coHuy: /huỷ|hủy|hủy|đổi lịch/i.test(txt),
  });
}
K.t2_quyTrinh = quet;

fs.writeFileSync('reports/raw/probe-far-process.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 16000));
await browser.close();
