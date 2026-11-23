import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do bang phu thu di chuyen cua T1 theo dia chi nhap.
 * Mục đích: kiểm chứng công thức `max(0, km - 5) x 8.000đ` (BR-04) và
 * dải km BR-05, phục vụ TC-T1-M6-003..007.
 *
 * ADR-11: chi doc, khong bam nut "Xac nhan dat lich".
 */
const DIA_CHI = [
  { nhan: 'Q.1 (trong 5km)', diaChi: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1' },
  { nhan: 'Q.7', diaChi: 'Quận 7, TP. Hồ Chí Minh' },
  { nhan: 'Tân Bình', diaChi: 'Tân Bình, TP. Hồ Chí Minh' },
  { nhan: 'Thủ Đức', diaChi: 'Thủ Đức, TP. Hồ Chí Minh' },
  { nhan: 'Bình Chánh', diaChi: 'Bình Chánh, TP. Hồ Chí Minh' },
  { nhan: 'Nhà Bè', diaChi: 'Nhà Bè, TP. Hồ Chí Minh' },
  { nhan: 'Gò Vấp', diaChi: 'Gò Vấp, TP. Hồ Chí Minh' },
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
  const dung = phi !== null && kyVong !== null ? Math.abs(phi - kyVong) < 1 : null;

  const dong = {
    diaChi: item.nhan,
    nhanNhap: item.diaChi,
    km,
    phiDiChuyenHienThi: phi,
    congThucSRS: kyVong,
    khopCongThuc: dung,
    coNhanLienHeBaoGiaRieng: mLienHe,
  };
  ketQua.push(dong);
  console.log(
    `${item.nhan.padEnd(18)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)} kyVong=${String(kyVong).padEnd(8)} khop=${dung}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-surcharge.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-surcharge.json');

await browser.close();
