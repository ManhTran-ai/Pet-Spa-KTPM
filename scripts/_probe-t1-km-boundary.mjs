import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Tim dia chi cho ra quang cach dung 6km, 7km va >15km de kiem chung bien
 * TC-T1-M6-005..007 va FR-M6-06.
 *
 * ADR-11: chi doc, khong bam nut "Xac nhan dat lich".
 */
const DIA_CHI = [
  { nhan: 'Phuoc Loi Binh Chanh', diaChi: 'Phước Lợi, Bình Chánh' },
  { nhan: 'Phuoc An Binh Chanh', diaChi: 'Phước An, Bình Chánh' },
  { nhan: 'Tan Phong Binh Chanh', diaChi: 'Tân Phong, Bình Chánh' },
  { nhan: 'Thuan An Binh Chanh', diaChi: 'Thuận An, Bình Chánh' },
  { nhan: 'Phuoc Thuan Binh Chanh', diaChi: 'Phước Thuận, Bình Chánh' },
  { nhan: 'An Son Binh Chanh', diaChi: 'An Sơn, Bình Chánh' },
  { nhan: 'Binh Chanh', diaChi: 'Thị trấn Bình Chánh' },
  { nhan: 'Quang Ngai', diaChi: 'Quảng Ngãi' },
  { nhan: 'Bien Hoa', diaChi: 'Biên Hòa, Đồng Nai' },
  { nhan: 'Can Tho', diaChi: 'Cần Thơ' },
  { nhan: 'Rach Gia', diaChi: 'Rạch Giá, Kiên Giang' },
  { nhan: 'Phan Thiet', diaChi: 'Phan Thiết, Bình Thuận' },
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
for (const item of DIA_CHI) {
  await moBuoc4();
  const o = page.locator('.bk-modal input[placeholder*="Nguyễn Huệ"]').first();
  await o.fill(item.diaChi);
  await o.press('Tab');
  await page.waitForTimeout(4500);
  const text = await page.locator('.bk-modal').innerText();
  const mKm = text.match(/Khoảng cách ước tính\s*\n?\s*([\d.]+)\s*km/);
  const mPhi = text.match(/Phí di chuyển[^\n]*\n?\s*\+?\s*([\d.]+)\s*₫/);
  const free = /Phí di chuyển \(miễn phí ≤ 5km\)/.test(text);
  const iPhi = text.indexOf('Phí di chuyển');
  const doanPhi = iPhi >= 0 ? text.slice(iPhi, iPhi + 70) : '';
  const km = mKm ? Number(mKm[1]) : null;
  const phi = mPhi ? Number(mPhi[1].replace(/\./g, '')) : free ? 0 : null;
  const dong = {
    diaChi: item.nhan,
    nhanNhap: item.diaChi,
    km,
    phi,
    doanPhi,
    coLienHe: /Liên hệ|báo giá riêng theo lộ trình/i.test(doanPhi),
  };
  ketQua.push(dong);
  console.log(
    `${item.nhan.padEnd(24)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)} | ${doanPhi.replace(/\n/g, ' | ').slice(0, 60)}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-boundary.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-boundary.json');
await browser.close();
