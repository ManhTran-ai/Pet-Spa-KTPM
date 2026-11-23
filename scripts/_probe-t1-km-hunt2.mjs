import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Quet rong phuong/xa de tim dia chi cho ra quang cach DUNG 5.0 / 7.0 / 10.0 / 15.0 / 20.0 km.
 * ADR-11: chi doc.
 */
const DIA_CHI = [
  // Ham Thuan / Binh Chanh noi
  'Tân Nhựt, Bình Chánh',
  'Tân Quang, Bình Chánh',
  'Phú Hòa, Bình Chánh',
  'Quảng Thông, Bình Chánh',
  'Phú Mỹ Hưng, Bình Chánh',
  'Võ Văn Kiệt, Bình Chánh',
  // Quang 7 / Tan Binh / Go Vap
  'Quận 7, TP. Hồ Chí Minh',
  'Phú Mỹ Hưng, Quận 7',
  'Tân Bình, TP. Hồ Chí Minh',
  'Gò Vấp, TP. Hồ Chí Minh',
  'Tân Quang, Gò Vấp',
  'Quận 10, TP. Hồ Chí Minh',
  'Quận 11, TP. Hồ Chí Minh',
  'Bình Thạnh, TP. Hồ Chí Minh',
  'Phú Nhuận, TP. Hồ Chí Minh',
  'Quận 3, TP. Hồ Chí Minh',
  'Quận 1, TP. Hồ Chí Minh',
  // Binh Duong
  'Diện Thạnh, Bình Dương',
  'Tân Vạn, Bình Dương',
  'Phú Cường, Thủ Dầu Một, Bình Dương',
  'Võ Văn Kiệt, Thủ Dầu Một',
  'Bến Tây, Bình Dương',
  'Dĩ An, Bình Dương',
  // Thu Duc
  'Thủ Đức, TP. Hồ Chí Minh',
  'Hiệp Bình Chánh',
  'Lê Văn Khương, Thủ Đức',
  // Xa
  'Củ Chi, Củ Chi, TP. Hồ Chí Minh',
  'Trí Chánh, Củ Chi',
  'Đông Hóa, Củ Chi',
  'Bình Hưng Hòa A, Bình Tân, TP. Hồ Chí Minh',
  'Bà Quẹo, Bình Tân',
  'Long Lâm, Bình Tân',
  'Phú Lợi, Bình Chánh',
  'Vĩnh Lộc, Bình Chánh',
  'Tân Tạo, Bình Tân',
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

async function moBuoc4() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 20_000 });
  await page.waitForTimeout(800);
  const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
  await T.click();
  await page.waitForTimeout(800);
  await page.locator('.bk-input').first().fill('Bông');
  await page.waitForTimeout(300);
  await T.click();
  await page.waitForTimeout(800);
  await T.click();
  await page.waitForTimeout(1100);
  await page.locator('.bk-loc', { hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(900);
}

const ketQua = [];
for (const diaChi of DIA_CHI) {
  await moBuoc4();
  const o = page.locator('.bk-modal input[placeholder*="Nguyễn Huệ"]').first();
  await o.fill(diaChi);
  await o.press('Tab');
  await page.waitForTimeout(4200);
  const text = await page.locator('.bk-modal').innerText();
  const mKm = text.match(/Khoảng cách ước tính\s*\n?\s*([\d.]+)\s*km/);
  const mPhi = text.match(/Phí di chuyển[^\n]*\n?\s*\+?\s*([\d.]+)\s*₫/);
  const free = /Phí di chuyển \(miễn phí ≤ 5km\)/.test(text);
  const km = mKm ? Number(mKm[1]) : null;
  const phi = mPhi ? Number(mPhi[1].replace(/\./g, '')) : free ? 0 : null;
  ketQua.push({ diaChi, km, phi });
  const dacBiet = km !== null && [5, 7, 10, 15, 20].includes(Math.round(km));
  console.log(
    `${diaChi.padEnd(40)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)}${dacBiet ? '  <== BIEN' : ''}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-hunt2.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-hunt2.json');
await browser.close();
