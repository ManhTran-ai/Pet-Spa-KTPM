import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Tim dia chi cho ra quang cach trong cac dai BVA can kiem thu (5-6km, 6-7km, >15km)
 * va kiem chung hanh vi cong thuc cua T1.
 *
 * ADR-11: chi doc, khong bam nut "Xac nhan dat lich".
 */
const DIA_CHI = [
  // Quanh sat dia chi spa (A1 Westgate, Binh Chanh) — hy vong 0-7km
  { nhan: 'Westgate', diaChi: 'Westgate City, Binh Chanh' },
  { nhan: 'Phan Huy Ich', diaChi: 'Phan Huy Ich, Binh Chanh' },
  { nhan: 'Dong Bao', diaChi: 'Dong Bao, Binh Chanh' },
  { nhan: 'Quoc Lo', diaChi: 'Quoc Lo, Binh Chanh' },
  { nhan: 'Long Hoa', diaChi: 'Long Hoa, Binh Chanh' },
  { nhan: 'Phu Quoc', diaChi: 'Phu Quoc, Binh Chanh' },
  { nhan: 'An Phu', diaChi: 'An Phu, Binh Chanh' },
  { nhan: 'Thoai Son', diaChi: 'Thoai Son, Binh Chanh' },
  // Xa — hy vong >15km
  { nhan: 'Vung Tau', diaChi: 'Vung Tau, BR-VT' },
  { nhan: 'Long Hai', diaChi: 'Long Hai, BR-VT' },
  { nhan: 'My Tho', diaChi: 'My Tho, Tien Giang' },
  { nhan: 'Bac Ninh', diaChi: 'Bac Ninh' },
  { nhan: 'Hai Phong', diaChi: 'Hai Phong' },
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
  // Doan "Phi di chuyen" -> lay 120 ky tu sau do
  const iPhi = text.indexOf('Phí di chuyển');
  const doanPhi = iPhi >= 0 ? text.slice(iPhi, iPhi + 90) : '';
  const mLienHe =
    /Liên hệ|Báo giá riêng theo lộ trình/i.test(doanPhi);

  const km = mKm ? Number(mKm[1]) : null;
  const phi = mPhi ? Number(mPhi[1].replace(/\./g, '')) : mPhiFree ? 0 : null;
  const srs = km === null ? null : Math.max(0, km - 5) * 8000;
  const ceil = km === null ? null : Math.max(0, Math.ceil(km) - 5) * 8000;

  const dong = {
    diaChi: item.nhan,
    nhanNhap: item.diaChi,
    km,
    phi,
    congThucSRS: srs,
    quyTacCeil: ceil,
    khopSRS: phi !== null && srs !== null ? phi === srs : null,
    khopCeil: phi !== null && ceil !== null ? phi === ceil : null,
    doanPhi,
    coLienHeBaoGiaRieng: mLienHe,
  };
  ketQua.push(dong);
  console.log(
    `${item.nhan.padEnd(14)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)} SRS=${String(srs).padEnd(9)} ceil=${String(ceil).padEnd(8)} srsOK=${dong.khopSRS} ceilOK=${dong.khopCeil} lienHe=${mLienHe}`,
  );
}

fs.writeFileSync(
  'reports/raw/probe-t1-km-surcharge-3.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-km-surcharge-3.json');

await browser.close();
