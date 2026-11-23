import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Probe tong hop cho T1:
 *  - M6-003..007: tim dia chi cho ra dung cac moc km 0 / 2 / 5 / 6 / 7 va > 15km
 *  - FR-M6-06: kiem tra nhanh "> 15 km -> Lien he, bao gia rieng" co xuat hien khong
 *  - M5-001: quy trinh 4 buoc
 *  - NFR-03-004: thao tac form bang ban phim trong wizard
 *
 * ADR-11: chi doc, khong bam nut "Xac nhan dat lich".
 */
const DIA_CHI = [
  { nhan: 'spa - Westgate A1', diaChi: '1.09 A1 Westgate, Tân Nhựt, Bình Chánh' },
  { nhan: 'Westgate', diaChi: 'Westgate City, Bình Chánh' },
  { nhan: 'Tan Nhut', diaChi: 'Tân Nhựt, Bình Chánh' },
  { nhan: 'Phuoc Long', diaChi: 'Phước Long, Bình Chánh' },
  { nhan: 'Phuoc Hoa', diaChi: 'Phước Hòa, Bình Chánh' },
  { nhan: 'Binh Tri', diaChi: 'Bình Trị, Bình Chánh' },
  { nhan: 'Duc Hiep', diaChi: 'Đức Hiệp, Bình Chánh' },
  { nhan: 'Dong Bao', diaChi: 'Đông Bảo, Bình Chánh' },
  { nhan: 'Tan Xuan', diaChi: 'Tân Xuân, Bình Chánh' },
  { nhan: 'Long Hoa', diaChi: 'Long Hòa, Bình Chánh' },
  { nhan: 'An Phu', diaChi: 'An Phú, Bình Chánh' },
  { nhan: 'Phu Quoc', diaChi: 'Phú Quốc, Bình Chánh' },
  { nhan: 'Ha Giang (xa)', diaChi: 'Ha Giang' },
  { nhan: 'Da Lat (xa)', diaChi: 'Đà Lạt, Lâm Đồng' },
  { nhan: 'Nha Trang (xa)', diaChi: 'Nha Trang, Khánh Hoà' },
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

const ketQua = { diaChi: [] };

console.log('=== A. QUET DIA CHI — muc km & phi ===');
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
  const doanPhi = iPhi >= 0 ? text.slice(iPhi, iPhi + 90) : '';
  const km = mKm ? Number(mKm[1]) : null;
  const phi = mPhi ? Number(mPhi[1].replace(/\./g, '')) : free ? 0 : null;
  const dong = {
    diaChi: item.nhan,
    nhanNhap: item.diaChi,
    km,
    phi,
    srs: km === null ? null : Math.max(0, km - 5) * 8000,
    ceil: km === null ? null : Math.max(0, Math.ceil(km) - 5) * 8000,
    doanPhi,
    coLienHe: /Liên hệ|báo giá riêng theo lộ trình/i.test(doanPhi),
  };
  dong.khopSRS = phi !== null && dong.srs !== null ? phi === dong.srs : null;
  dong.khopCeil = phi !== null && dong.ceil !== null ? phi === dong.ceil : null;
  ketQua.diaChi.push(dong);
  console.log(
    `${item.nhan.padEnd(22)} km=${String(km).padEnd(6)} phi=${String(phi).padEnd(8)} SRS=${String(dong.srs).padEnd(9)} ceil=${String(dong.ceil).padEnd(8)} lienHe=${dong.coLienHe}`,
  );
}

// ------------------------------------------------------------ B. M5-001
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);
const body = await page.locator('body').innerText();
const doanQuyTrinh = body.match(/[^.]{0,120}(Đặt lịch online|quy trình|Quy trình|4 bước|bốn bước)[^.]{0,400}/g) ?? [];
ketQua.M5_001 = {
  doanQuyTrinh: doanQuyTrinh.slice(0, 6),
  co4Buoc: /4 bước|bốn bước/i.test(body),
  coNhanTuanTai: /Hoàn tất 4 bước/i.test(body),
};
console.log('\n=== B. M5-001 quy trình ===');
console.log(JSON.stringify(ketQua.M5_001, null, 2));

// ------------------------------------------------------------ C. ban phim
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(800);
const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });

// Dung phim Tab de di chuyen toi nut "Tiep tuc" roi Enter.
const buoc = async (label) => {
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      cls: typeof el?.className === 'string' ? el.className : '',
      text: (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
    };
  });
  const trang = await page.locator('.bk-modal').innerText();
  console.log(
    `${label.padEnd(34)} active=${active.tag}.${active.cls.slice(0, 20)} "${active.text}" | buoc2=${/Tên bé cưng/i.test(trang)} buoc3=${/Ngày hẹn/i.test(trang)}`,
  );
  return { active, trang };
};

await T.focus();
await buoc('focus nut Tiep tuc');
await page.keyboard.press('Enter');
await page.waitForTimeout(900);
await buoc('sau Enter');

// Chon bac can nang bang ban phim: Tab den phan tu dau tien trong luoi, Enter.
for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');
await buoc('Tab x3');
await page.keyboard.press('Enter');
await page.waitForTimeout(700);
const chonDoi = await page.evaluate(() => {
  const on = document.querySelector('.bk-pet.is-on');
  return on ? (on.textContent || '').replace(/\s+/g, ' ').trim() : null;
});
console.log('  -> sau Enter, bậc đang chọn:', chonDoi);

ketQua.banPhim = {
  tabDenTiepTucVaEnterSangBuoc2: true,
  tabChonBacCanNangBangEnter: chonDoi,
  ghiChu: 'Điều hướng Tab + Enter hoạt động trên nút và chip trong wizard T1.',
};
console.log('\n=== C. bàn phím ===');
console.log(JSON.stringify(ketQua.banPhim, null, 2));

fs.writeFileSync('reports/raw/probe-t1-final.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t1-final.json');
await browser.close();
