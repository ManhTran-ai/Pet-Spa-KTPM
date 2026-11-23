import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Kiem chung trien khai FR-M7-01 / FR-M7-02 (tim kiem tu khoa) va FR-M5-04
 * (chinh sach huy) tren TOAN BO cac trang cong khai cua T2.
 *
 * ADR-11: chi doc, khong gui form.
 */
const TRANG = [
  '/spa',
  '/so-sanh',
  '/bang-gia',
  '/cho',
  '/meo',
  '/bao-hanh',
  '/showroom',
  '/cau-hoi-thuong-gap',
  '/dat-lich',
  '/tin-tuc',
  '/blog',
  '/tuyen-dung',
  '/tim-kiem-bebe-thuong',
];

const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

const ketQua = { timKiem: [], faq: null };

for (const duong of TRANG) {
  const url = `https://matpet.vn${duong}`;
  let status = 0;
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    status = resp?.status() ?? 0;
    await page.waitForTimeout(1500);
  } catch (e) {
    console.log(`${duong} -> LOAI: ${e.message.slice(0, 60)}`);
    ketQua.timKiem.push({ duong, status, loi: e.message.slice(0, 120) });
    continue;
  }

  const inputs = await page
    .locator('input')
    .evaluateAll((els) =>
      els.map((e) => ({
        type: e.getAttribute('type') ?? '',
        ph: e.getAttribute('placeholder') ?? '',
        name: e.getAttribute('name') ?? '',
        cls: e.className ?? '',
        id: e.id ?? '',
        aria: e.getAttribute('aria-label') ?? '',
      })),
    );
  const oTimKiem = inputs.filter((i) =>
    /search|tim|tìm|keyword|tu-khoa/i.test(`${i.type} ${i.ph} ${i.name} ${i.cls} ${i.id} ${i.aria}`),
  );

  const dong = {
    duong,
    status,
    soInput: inputs.length,
    oTimKiem: oTimKiem.map((i) => i.ph || i.name || i.cls || i.id || i.type),
    tatCaInput: inputs.map((i) => `${i.type}:${i.ph || i.name || i.id}`).slice(0, 12),
  };
  ketQua.timKiem.push(dong);
  console.log(
    `${duong.padEnd(24)} ${status}  inputs=${inputs.length}  oTimKiem=${dong.oTimKiem.length} ${JSON.stringify(dong.oTimKiem)}`,
  );
}

// ---------------------------------------------------------------- FAQ day du
await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

// Mo het cac accordion
const moHet = await page.evaluate(() => {
  const nodes = document.querySelectorAll('details, [class*=accordion] button, [class*=faq] button');
  let n = 0;
  for (const el of nodes) {
    if (el.tagName === 'DETAILS') {
      el.open = true;
      n += 1;
    } else if (el.getAttribute('aria-expanded') === 'false') {
      el.click();
      n += 1;
    }
  }
  return n;
});
await page.waitForTimeout(2000);
const faqText = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

const trich = faqText.match(/[^.]{0,120}(hủy|huỷ|đặt cọc|hoàn cọc|hoàn tiền|refund)[^.]{0,200}\./gi) ?? [];
ketQua.faq = {
  soPhanTuMo: moHet,
  doDai: faqText.length,
  coTuHuy: /hủy|huỷ/i.test(faqText),
  coDatCoc: /đặt cọc|cọc/i.test(faqText),
  coHoanCoc: /hoàn (lại )?(tiền )?cọc|hoàn cọc|được hoàn|hoàn lại/i.test(faqText),
  coKhongHoan: /không (được )?hoàn|không hoàn|mất cọc|giữ lại cọc|không refund/i.test(faqText),
  trich,
};

console.log('\n=== FAQ T2 ===');
console.log('đã mở', moHet, 'phần tử · độ dài text', faqText.length);
console.log('coTuHuy =', ketQua.faq.coTuHuy);
console.log('coDatCoc =', ketQua.faq.coDatCoc);
console.log('coHoanCoc =', ketQua.faq.coHoanCoc);
console.log('coKhongHoan =', ketQua.faq.coKhongHoan);
console.log('trích:', JSON.stringify(trich, null, 1));
console.log('\n--- Toàn văn FAQ (4000 ký tự đầu) ---');
console.log(faqText.slice(0, 4000));

fs.writeFileSync('reports/raw/probe-t2-search-faq.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t2-search-faq.json');

await browser.close();
