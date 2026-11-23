import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: tim dia chi -> km on dinh cho cac moc 0-2, 5, 6, 7, 10, 15, >15 km. */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await page.waitForTimeout(250);
await modal.locator('.bk-input[placeholder*="Bông" i]').fill('Bé Test');
await page.waitForTimeout(250);
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
await modal.locator('.bk-day').nth(1).click();
await modal.locator('.bk-time').nth(1).click();
await page.waitForTimeout(200);
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(800);
await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(500);

const DIA_CHI = [
  'Quận 1, TP. Hồ Chí Minh',
  '1.09 A1 Westgate, Bình Chánh',
  'Phước Long, Bình Chánh',
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
  'Phú Cường, Thủ Dầu Một, Bình Dương',
  'Hà Đông, Hà Nội',
  'Đống Đa, Hà Nội',
  'Hoàng Mai, Hà Nội',
  'Long Biên, Hà Nội',
  'Thanh Xuân, Hà Nội',
  'Cầu Giấy, Hà Nội',
  'Sóc Sơn, Hà Nội',
  'Thanh Trì, Hà Nội',
  'Hoài Đức, Hà Nội',
  'Mê Linh, Hà Nội',
  'Ứng Hòa, Hà Nội',
  'Thanh Oai, Hà Nội',
  'Quốc Oai, Hà Nội',
];

const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
const ketQua = [];
for (const d of DIA_CHI) {
  try {
    await onDiaChi.fill(d);
    await page.waitForTimeout(2400);
    const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
    const km = (txt.match(/Khoảng cách ước tính\s*\n?\s*([\d.,]+)\s*km/) || [])[1] ?? null;
    const phiDong = (txt.match(/Phí di chuyển[^\n]*/g) || []);
    const phi = (txt.match(/Phí di chuyển \([\d.,]+km\)\s*\n?\s*\+?\s*([\d.]+)₫/) || [])[1] ?? null;
    const mien = /Phí di chuyển \(miễn phí/i.test(txt);
    ketQua.push({
      diaChi: d,
      km,
      phi: phi ?? (mien ? 'Miễn phí' : null),
      coBaoGiaRieng: /Báo giá riêng/i.test(txt),
      dongPhi: phiDong,
    });
  } catch (e) {
    ketQua.push({ diaChi: d, loi: String(e).slice(0, 80) });
  }
}

fs.writeFileSync('reports/raw/probe-t1-km-2026-11-22.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.table(ketQua.map((k) => ({ diaChi: k.diaChi, km: k.km, phi: k.phi, baoGia: k.coBaoGiaRieng })));
await browser.close();
