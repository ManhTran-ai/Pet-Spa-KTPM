import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** NFR-03-002 / 003 — loi form va nhan truong, do lai bang wizard MOI (khong reuse state). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

const ketQua = {};

// ---------------------------------------------------- T1: loi form buoc 2
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(800);
const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
await T.click(); // buoc 1 -> 2
await page.waitForTimeout(900);

const truoc = await page.locator('.bk-modal').innerText();
const nutDisabled = await T.isDisabled();
// Thoai "Tiếp tục" (nut khoá) de xem co thong bao loi nao hien ra.
await T.click({ force: true, timeout: 3000 }).catch(() => {});
await page.waitForTimeout(900);
const sau = await page.locator('.bk-modal').innerText();

const doanLoi = sau.match(/[^.\n]{0,150}(Vui lòng|bắt buộc|không được|không được để trống|chưa nhập|nhập tên|required)[^.\n]{0,150}/gi) ?? [];
const vanOBuoc2 = /Tên bé cưng/i.test(sau);

ketQua['TC-NFR-03-002-T1'] = {
  heThong: 'T1',
  nutTiepTucDisabledKhiThieuTen: nutDisabled,
  vanOCungBuoc2: vanOBuoc2,
  coThongBaoLoi: doanLoi.length > 0,
  doanLoi,
  chenhLechSoiChieu: sau === truoc ? 'khong doi' : 'thay doi',
};
console.log('T1 M4-002/NFR-03-002:', JSON.stringify(ketQua['TC-NFR-03-002-T1'], null, 2));

// Do DOM quanh o nhap ten de tim phan tu loi.
const domLoi = await page.evaluate(() => {
  const input = document.querySelector('.bk-modal .bk-input');
  if (!input) return 'khong tim thay input';
  const parent = input.parentElement;
  return {
    inputOuter: input.outerHTML.slice(0, 300),
    parentHtml: parent ? parent.innerHTML.slice(0, 900) : '',
    coTheLoi: /error|invalid|warn|lỗi/i.test(parent?.className ?? ''),
    parentCls: parent?.className ?? '',
  };
});
ketQua['TC-NFR-03-002-T1'].domLoi = domLoi;
console.log('\nDOM lỗi:', JSON.stringify(domLoi, null, 2));

// ---------------------------------------------------- T1: trang lien he
await page.goto('https://petpetngon.vn/vi/contact'.replace('petpetngon', 'petngon'), { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);
const lienHe = await page.locator('body').innerText();
const formLienHe = await page.locator('form, input, textarea, select, label').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type') ?? '',
    ph: e.getAttribute('placeholder') ?? '',
    name: e.getAttribute('name') ?? '',
    text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
  })),
);
ketQua['TC-NFR-03-003-T1'] = {
  heThong: 'T1',
  coFormLienHe: formLienHe.filter((f) => f.tag === 'INPUT' || f.tag === 'TEXTAREA' || f.tag === 'SELECT').length,
  soField: formLienHe.length,
  fields: formLienHe.slice(0, 20),
  trichLienHe: lienHe.slice(0, 900),
};
console.log('\nT1 trang liên hệ:', JSON.stringify(ketQua['TC-NFR-03-003-T1'], null, 2));

fs.writeFileSync('reports/raw/probe-nfr-03-b.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-nfr-03-b.json');
await browser.close();
