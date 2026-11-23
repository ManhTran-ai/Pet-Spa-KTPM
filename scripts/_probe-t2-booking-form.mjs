import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** T2 — form giu cho (buoc 4 cua calculator) + nhan truong + thong bao dong y lien he. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const next = page.getByRole('button', { name: 'Tiếp tục →' });
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(900);
await next.click(); // sang buoc 4 — form giu cho
await page.waitForTimeout(1500);

const buoc4 = await page.locator('body').innerText();
const idx = buoc4.search(/giữ chỗ|Thông tin liên hệ|SĐT|số điện thoại/i);
console.log('=== BƯỚC 4 T2 ===');
console.log(buoc4.slice(idx >= 0 ? Math.max(0, idx - 200) : 0, (idx >= 0 ? idx : 0) + 1800));

const fields = await page.locator('input, textarea, select, label').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type') ?? '',
    ph: e.getAttribute('placeholder') ?? '',
    name: e.getAttribute('name') ?? '',
    text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
  })),
);
console.log('\n=== FIELDS ===');
console.log(JSON.stringify(fields, null, 1));

const doanDongY = buoc4.match(/[^.\n]{0,180}(đồng ý|đồng ý.*liên hệ|liên hệ qua|sẽ gọi|nhắn Zalo|Zalo|thoại)[^.\n]{0,180}/gi) ?? [];
console.log('\n=== ĐOẠN ĐỒNG Ý / LIÊN HỆ ===');
console.log(JSON.stringify(doanDongY, null, 1));

fs.writeFileSync(
  'reports/raw/probe-t2-booking-form.json',
  JSON.stringify({ buoc4, fields, doanDongY }, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t2-booking-form.json');
await browser.close();
