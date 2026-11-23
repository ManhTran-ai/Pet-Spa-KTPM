import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do NFR-03 (kha nang su dung) cho T1 va T2:
 *  - NFR-03-001: hoan tat luong tinh gia trong <= 5 thao tac
 *  - NFR-03-002: thong bao loi ne ro ten truong bi loi
 *  - NFR-03-003: nhan cac truong form nhat quan giua cac trang
 *  - NFR-03-004: dieu huong va thao tac form duoc bang ban phim
 */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ locale: 'vi-VN' });
const page = await context.newPage();

const ketQua = {};

// ---------------------------------------------------------------- T1
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.waitForTimeout(1500);

const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
const nut = async () => (await T.count()) > 0 ? T : page.locator('.bn-btn--primary').first();

// NFR-03-001 — dem so thao tac de xem gia cuoi cung cua T1.
// Luong: mo wizard -> chon dich vu (co san) -> Tiep tuc -> chon loai+can nang
//         -> Tiep tuc -> Tiep tuc (ngay) -> chon "Tai nha" -> xem tong.
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(700);

let soThaoTac = 1; // mo wizard
await T.click(); soThaoTac += 1;            // buoc 1 -> 2
await page.waitForTimeout(700);
await page.locator('.bk-pet').first().click(); soThaoTac += 1; // chon bac can nang
await page.locator('.bk-input').first().fill('Bông'); soThaoTac += 1;
await T.click(); soThaoTac += 1;            // buoc 2 -> 3
await page.waitForTimeout(800);
await T.click(); soThaoTac += 1;            // buoc 3 -> 4
await page.waitForTimeout(1000);
await page.locator('.bk-loc', { hasText: 'Tận nhà' }).first().click(); soThaoTac += 1;
await page.waitForTimeout(900);

const tongT1 = await page.locator('.bk-modal').innerText();
const coTong = /Tạm tính/i.test(tongT1);
const soThaoTacTinhGia = soThaoTac;

ketQua['TC-NFR-03-001'] = {
  heThong: 'T1',
  soThaoTac: soThaoTacTinhGia,
  coHienThiTongGia: coTong,
  trich: tongT1.match(/Tạm tính[\s\S]{0,40}/)?.[0] ?? '',
  ghiChu: 'Tính giá T1 đòi hỏi chọn dịch vụ + bậc cân nặng + hình thức (tại nhà/tại spa) + tên bé — vượt 5 thao tác nếu tính cả bước mở wizard.',
};

// NFR-03-002 — thong bao loi cua form T1 khi bo trong truong bat buoc.
await page.locator('.bk-close').click();
await page.waitForTimeout(600);
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(700);
await T.click();
await page.waitForTimeout(800);
await T.click(); // bỏ trống tên -> thu muc? khong
await page.waitForTimeout(900);
const loiT1 = await page.locator('.bk-modal').innerText();
const doanLoiT1 = loiT1.match(/[^.\n]{0,120}(Vui lòng|bắt buộc|không được|không được để trống)[^.\n]{0,120}/gi) ?? [];
ketQua['TC-NFR-03-002'] = {
  heThong: 'T1',
  coThongBaoLoi: doanLoiT1.length > 0,
  doanLoi: doanLoiT1,
  trich: loiT1.slice(0, 400),
};

// NFR-03-003 — nhan truong form nhat quan giua trang chu va trang lien he.
const nhanT1 = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('label, .bk-label, [class*=label]')) {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (t && t.length < 60) out.push(t);
  }
  return [...new Set(out)];
});
await page.goto('https://petngon.vn/vi/contact', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);
const nhanLienHe = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('label, [class*=label], [class*=form] span')) {
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (t && t.length < 60) out.push(t);
  }
  return [...new Set(out)];
});
const chung = nhanT1.filter((x) => nhanLienHe.includes(x));
ketQua['TC-NFR-03-003'] = {
  heThong: 'T1',
  soNhanTrangChu: nhanT1.length,
  soNhanTrangLienHe: nhanLienHe.length,
  soNhanChung: chung.length,
  nhanTrangChu: nhanT1.slice(0, 25),
  nhanTrangLienHe: nhanLienHe.slice(0, 25),
};

// NFR-03-004 — dieu huong bang ban phim: tab toi nut "Dat lich", Enter/Space kich hoat.
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.waitForTimeout(1200);
await page.locator('.ga-booking-btn').first().focus();
let soPhim = 1;
for (let i = 0; i < 4; i += 1) {
  await page.keyboard.press('Tab');
  soPhim += 1;
}
const focused = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, cls: el?.className, text: (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) };
});
await page.keyboard.press('Enter');
await page.waitForTimeout(1200);
const moModal = await page.locator('.bk-modal').count();
ketQua['TC-NFR-03-004'] = {
  heThong: 'T1',
  soPhimTab: soPhim,
  phanTuTieuDien: focused,
  enterKichHoatModal: moModal > 0,
};

// ---------------------------------------------------------------- T2
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

// NFR-03-001 (T2) — dem thao tac tinh gia.
const next2 = page.getByRole('button', { name: 'Tiếp tục →' });
let tt = 1; // trang /spa
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click(); tt += 1;
await page.waitForTimeout(400);
await next2.click(); tt += 1;
await page.waitForTimeout(700);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click(); tt += 1;
await page.waitForTimeout(400);
await next2.click(); tt += 1;
await page.waitForTimeout(800);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click(); tt += 1;
await page.waitForTimeout(900);
const giaT2 = await page.locator('.rail-price').innerText();
ketQua['TC-NFR-03-001-T2'] = {
  heThong: 'T2',
  soThaoTac: tt,
  giaHienThi: giaT2.trim(),
  nhanTrongTinhGia: /GIÁ DỰ KIẾN/i.test(await page.locator('body').innerText()),
};

// NFR-03-002 (T2) — bao loi form giu cho.
const loiT2 = await page.locator('body').innerText();
const doanLoiT2 = loiT2.match(/[^.\n]{0,120}(Vui lòng|bắt buộc|không được|không được để trống|required)[^.\n]{0,120}/gi) ?? [];
ketQua['TC-NFR-03-002-T2'] = {
  heThong: 'T2',
  coThongBaoLoi: doanLoiT2.length > 0,
  doanLoi: doanLoiT2.slice(0, 5),
};

// NFR-03-004 (T2) — ban phim.
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2200);
await page.getByRole('button', { name: '🐶 Chó', exact: true }).focus();
for (let i = 0; i < 3; i += 1) await page.keyboard.press('Tab');
const focused2 = await page.evaluate(() => {
  const el = document.activeElement;
  return { tag: el?.tagName, cls: el?.className, text: (el?.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) };
});
await page.keyboard.press('Enter');
await page.waitForTimeout(900);
const trangT2 = await page.locator('body').innerText();
const daSangBuoc2 = />3–6kg/.test(trangT2) || /Chọn cân nặng|bậc cân nặng/i.test(trangT2);
ketQua['TC-NFR-03-004-T2'] = {
  heThong: 'T2',
  phanTuTieuDien: focused2,
  enterKichHoat: daSangBuoc2,
};

fs.writeFileSync('reports/raw/probe-nfr-03.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 2));
console.log('\n-> reports/raw/probe-nfr-03.json');

await browser.close();
