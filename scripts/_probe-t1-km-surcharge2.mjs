import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do them phu thu di chuyen cua T1 theo dia chi nhap — bo sung cac diem can
 * kiem chung cong thuc BR-04 `max(0, km - 5) x 8.000d` va dai km BR-05.
 *
 * ADR-11: chi doc, khong bam nut "Xac nhan dat lich".
 */
const DIA_CHI = [
  { nhan: 'Binh Chanh (0km - tai spa)', diaChi: '1.09 A1 Westgate, Binh Chanh' },
  { nhan: 'Tan Xuan, Binh Chanh', diaChi: 'Tan Xuan, Binh Chanh' },
  { nhan: 'Phuoc Long, Binh Chanh', diaChi: 'Phuoc Long, Binh Chanh' },
  { nhan: 'Ben Luc, Binh Chanh', diaChi: 'Ben Luc, Binh Chanh' },
  { nhan: 'Binh Tri, Binh Chanh', diaChi: 'Binh Tri, Binh Chanh' },
  { nhan: 'Duc Hiep, Binh Chanh', diaChi: 'Duc Hiep, Binh Chanh' },
  { nhan: 'Can Tho (xa)', diaChi: 'Ninh Kieu, Can Tho' },
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

async function moBuoc4() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 20_000 });
  await page.waitForTimeout(900);
  const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
  await T.click();
  await page.waitForTimeout(900);
  await page.locator('.bk-input').first().fill('Bông');
  await page.waitForTimeout(300);
  await T.click();
  await page.waitForTimeout(900);
  await T.click();
  await page.waitForTimeout(1200);
  await page.locator('.bk-loc', { hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(1000);
}

const ketQua = [];
for (const item of DIA_CHI) {
  await moBuoc4();
  const oDiaChi = page.locator('.bk-modal input[placeholder*="Nguyễn Huệ"]').first();
  await oDiaChi.fill(item.diaChi);
  await oDiaChi.press('Tab');
  await page.waitForTimeout(4500);

  const text = await page.locator('.bk-modal').innerText();
  const mKm = text.match(/Khoảng cách ước tính\s*\n?\s*([\d.]+)\s*km/);
  const mPhi = text.match(/Phí di chuyển[^\n]*\n?\s*\+?\s*([\d.]+)\s*₫/);
  const mPhiFree = /Phí di chuyển \(miễn phí ≤ 5km\)/.test(text);
  const mLienHe = /Liên hệ|báo giá riêng/i.test(text);

  const km = mKm ? Number(mKm[1]) : null;
  const phi = mPhi ? Number(mPhi[1].replace(/\./g, '')) : mPhiFree ? 0 : null;
  const kyVong = km === null ? null : Math.max(0, km - 5) * 8000;
  const khop = phi !== null && kyVong !== null ? Math.abs(phi - kyVong) < 1 : null;
  // Quy tắc thay thế: max(0, ceil(km) - 5) x 8000
  const kyVong2 = km === null ? null : Math.max(0, Math.ceil(km) - 5) * 8000;

  const dong = {
    diaChi: item.nhan,
    nhanNhap: item.diaChi,
    km,
    phiDiChuyenHienThi: phi,
    congThucSRS: kyVong,
    quyTacThayThe: kyVong2,
    khopCongThucSRS: khop,
    khopQuyTacThayThe: phi !== null && kyVong2 !== null ? phi === kyVong2 : null,
    coNhanLienHeBaoGiaRieng: mLienHe,
  };
  ketQua.push(dong);
  console.log(
    `${item.nhan.padEnd(28)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)} SRS=${String(kyVong).padEnd(8)} ceil=${String(kyVong2).padEnd(8)} lienHe=${mLienHe}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-surcharge-2.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-surcharge-2.json');

await browser.close();
