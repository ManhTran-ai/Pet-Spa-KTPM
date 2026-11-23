import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: tim dia chi cho ra km = 0, 2, 5, 6, 7 (va >15) de viet decision table FR-M6-02. */
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
await modal.locator('.bk-time').first().click();
await page.waitForTimeout(300);
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);
await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(400);

const DIA_CHI = [
  '1.09 A1 Westgate, Bình Chánh',
  'Số 1 Đường số 1, Khu đô thị Vạn Phúc, Quận 8',
  'Chung cư The Manor, Bình Chánh',
  'Bình Hưng Hòa A, Bình Tân, TP. Hồ Chí Minh',
  'An Phú, Quận 2, TP. Hồ Chí Minh',
  'Phú Mỹ Hưng, Quận 7',
  'Tân Tạo, Bình Tân',
  'Tân Vạn, Bình Dương',
  'Gò Vấp, TP. Hồ Chí Minh',
  'Tân Bình, TP. Hồ Chí Minh',
  'Bến Tây, Bình Dương',
  'Diện Thạnh, Bình Dương',
  'Võ Văn Kiệt, Thủ Dầu Một',
  'Trí Chánh, Củ Chi',
  'Đông Hóa, Củ Chi',
  'Cần Thơ',
  'Nha Trang, Khánh Hoà',
  'Vinh, Nghệ An',
  'Hà Nội',
  'Điện Biên Phủ',
  'Hà Giang',
  'Yên Bái',
  'Tiền Giang',
  'Sa Pa, Lào Cai',
  'Bến Tre',
  'Quảng Ngãi',
  'Thanh Hoá',
  'Khánh Hoà',
  'Hải Phòng',
  'Bạc Liêu',
  'Cà Mau',
  'Đà Nẵng',
];

const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
const ketQua = [];
for (const d of DIA_CHI) {
  try {
    await onDiaChi.fill(d);
    await page.waitForTimeout(2200);
    const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
    const mKm = txt.match(/Khoảng cách ước tính\s*\n?\s*([\d.,]+)\s*km/);
    const mPhi = txt.match(/Phí di chuyển \((\d+(?:\.\d+)?)km\)\s*\n?\s*\+?\s*([\d.]+)₫/);
    const mien = /Phí di chuyển \(miễn phí/i.test(txt);
    ketQua.push({
      diaChi: d,
      kmHienThi: mKm ? mKm[1] : null,
      kmTrongPhi: mPhi ? mPhi[1] : null,
      phi: mPhi ? mPhi[2] : mien ? 'Miễn phí' : null,
    });
  } catch (e) {
    ketQua.push({ diaChi: d, loi: String(e).slice(0, 100) });
  }
}

fs.writeFileSync('reports/raw/probe-t1-km-int.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
