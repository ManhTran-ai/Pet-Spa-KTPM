import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Quet rong phuong/xa de tim dia chi cho ra quang cach DUNG 5.0 / 6.0 / 7.0 km.
 * ADR-11: chi doc.
 */
const DIA_CHI = [
  'Phú Vang, Bình Chánh',
  'Tân Vạn, Bình Chánh',
  'Võ Văn Kiệt, Bình Chánh',
  'Phú Hòa, Bình Chánh',
  'Hưng Long, Bình Chánh',
  'Phú Mỹ Hưng, Bình Chánh',
  'Quảng Thông, Bình Chánh',
  'Tân Quang, Bình Chánh',
  'Điện Biên Phủ, Bình Chánh',
  'Nguyễn Huệ, Bình Chánh',
  'Nguyễn Văn Trỗi, Bình Chánh',
  'Trần Hưng Đạo, Bình Chánh',
  'Lê Văn Sỹ, Bình Chánh',
  'Phan Chu Trinh, Bình Chánh',
  'Phạm Văn Đồng, Bình Chánh',
  'Lê Văn Viện, Bình Chánh',
  'Nguyễn Đình Chiểu, Bình Chánh',
  'Phạm Ngũ Lão, Bình Chánh',
  'Bùi Văn Ba, Bình Chánh',
  'Trần Hưng Đạo, Thủ Đức',
  'Lê Văn Khương, Thủ Đức',
  'Hiệp Bình Chánh',
  'Thủ Đức',
  'Gò Vấp',
  'Tân Phú',
  'Diện Thạnh, Bình Dương',
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
  const dacBiet = km !== null && [5, 6, 7].includes(Math.round(km));
  console.log(
    `${diaChi.padEnd(34)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)}${dacBiet ? '  <== BIEN' : ''}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-hunt.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-hunt.json');
await browser.close();
