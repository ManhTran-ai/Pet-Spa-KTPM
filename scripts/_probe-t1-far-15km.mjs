import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: dia chi >15km — T1 co chuyen sang "Lien he bao gia rieng" khong? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
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
await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(400);

const DIA_CHI = [
  'Hà Giang',
  'Móng Cái, Quảng Ninh',
  'Sa Pa, Lào Cai',
  'Tuyên Quang',
  'Lào Cai',
  'Hà Nội',
  'Bắc Kạn',
  'Cao Bằng',
  'Lạng Sơn',
  'Bắc Giang',
  'Yên Bái',
  'Phú Thọ',
  'Vĩnh Phúc',
  'Hòa Bình',
  'Sơn La',
  'Điện Biên Phủ',
  'Ninh Bình',
  'Thanh Hoá',
  'Nghệ An',
  'Hà Tĩnh',
  'Quảng Bình',
  'Quảng Trị',
  'Quảng Nam',
  'Quảng Ngãi',
  'Kon Tum',
  'Gia Lai',
  'Đắk Lắk',
  'Phú Yên',
  'Khánh Hoà',
  'Ninh Thuận',
  'Bình Thuận',
  'Vũng Tàu',
  'Long Xuyên, An Giang',
  'Cà Mau',
  'Bạc Liêu',
  'Sóc Trăng',
  'Hậu Giang',
  'Đồng Tháp',
  'Tiền Giang',
  'Trà Vinh',
  'Bến Tre',
  'Vĩnh Long',
  'An Giang',
];

const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
const ketQua = [];
for (const d of DIA_CHI) {
  try {
    await onDiaChi.fill(d);
    await page.waitForTimeout(2000);
    const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
    const m = txt.match(/Phí di chuyển \((\d+(?:\.\d+)?)km\)/);
    const phi = txt.match(/Phí di chuyển\s*\n?\s*\+\s*([\d.]+)₫/);
    const mien = /Phí di chuyển \(miễn phí/i.test(txt);
    ketQua.push({
      diaChi: d,
      km: m ? Number(m[1]) : null,
      phi: phi ? Number(phi[1].replace(/\./g, '')) : mien ? 0 : null,
      lienHe: /Liên hệ|Báo giá riêng theo lộ trình/i.test(txt),
    });
  } catch (e) {
    ketQua.push({ diaChi: d, loi: String(e).slice(0, 100) });
  }
}

fs.writeFileSync('reports/raw/probe-t1-far-15km.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
