import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: bang (diaChi -> km hien thi, phi) cua T1 de viet decision table FR-M6-02. */
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
  'Quận 1, TP. Hồ Chí Minh',
  'Quận 3, TP. Hồ Chí Minh',
  'Bình Thạnh, TP. Hồ Chí Minh',
  'Phú Nhuận, TP. Hồ Chí Minh',
  'Quận 10, TP. Hồ Chí Minh',
  'Phú Cường, Thủ Dầu Một, Bình Dương',
  'Võ Văn Kiệt, Thủ Dầu Một',
  'Trí Chánh, Củ Chi',
  'Đông Hóa, Củ Chi',
  'Nha Trang, Khánh Hoà',
  'Bến Tây, Bình Dương',
  'Diện Thạnh, Bình Dương',
  'Tân Bình, TP. Hồ Chí Minh',
  'Gò Vấp, TP. Hồ Chí Minh',
  'Phú Mỹ Hưng, Quận 7',
  'Tân Tạo, Bình Tân',
  'Tân Vạn, Bình Dương',
  'Bình Hưng Hòa A, Bình Tân, TP. Hồ Chí Minh',
  'Thủ Đức, TP. Hồ Chí Minh',
  'Bà Quẹo, Bình Tân',
  'Quảng Ngãi',
  'Biên Hòa, Đồng Nai',
  'Rạch Giá, Kiên Giang',
  'Phan Thiết, Bình Thuận',
  'Cần Thơ',
  'Đà Lạt, Lâm Đồng',
  'Hà Nội',
  'Hải Phòng',
  'Hà Giang',
  'Điện Biên Phủ',
  'Sapa, Lào Cai',
  'Vinh, Nghệ An',
  'Huế',
  'Đà Nẵng',
  'Bạc Liêu',
  'Cà Mau',
  'Ninh Bình',
];

const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
const ketQua = [];
for (const d of DIA_CHI) {
  try {
    await onDiaChi.fill(d);
    await page.waitForTimeout(2200);
    const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
    const m = txt.match(/Phí di chuyển \((\d+(?:\.\d+)?)km\)\s*\n?\s*\+?\s*([\d.]+)₫/);
    const mien = /Phí di chuyển \(miễn phí/i.test(txt);
    const lienHe = /Liên hệ|Báo giá riêng/i.test(txt);
    ketQua.push({
      diaChi: d,
      km: m ? Number(m[1]) : null,
      phi: m ? Number(m[2].replace(/\./g, '')) : mien ? 0 : null,
      lienHe,
      doan: txt.slice(Math.max(0, txt.indexOf('Phí di chuyển')), txt.indexOf('Phí di chuyển') + 80),
    });
  } catch (e) {
    ketQua.push({ diaChi: d, loi: String(e).slice(0, 120) });
  }
}

fs.writeFileSync('reports/raw/probe-t1-km-table.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
