import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: noi dung cong bo phu thu di chuyen tren trang chu T1 + FAQ. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const body = await page.locator('body').innerText();

// Lay phan noi dung ve phu thu di chuyen.
const idx = body.search(/phụ thu di chuyển/i);
const doan = idx >= 0 ? body.slice(Math.max(0, idx - 400), idx + 1400) : '(khong tim thay)';

console.log('=== ĐOẠN NÓI DUNG PHỤ THU DI CHUYỂN ===');
console.log(doan);
console.log('\n=== FAQ "Phụ thu tại nhà tính như thế nào?" ===');
const faq = await page.locator('.hm-faq__q').allInnerTexts();
console.log(faq.join(' | '));

// Mo FAQ phu thu tai nha va FAQ dia chi
for (const q of faq) {
  if (/Phụ thu tại nhà tính/i.test(q)) {
    await page.locator('.hm-faq__q', { hasText: q.slice(0, 20) }).first().click();
    await page.waitForTimeout(700);
    const item = await page.locator('.hm-faq__q', { hasText: q.slice(0, 20) }).first().evaluate((el) => el.parentElement?.innerText ?? el.innerText);
    console.log('\n--- Nội dung FAQ phụ thu tại nhà ---\n' + item.slice(0, 900));
  }
  if (/Cân nặng được xác định/i.test(q)) {
    await page.locator('.hm-faq__q', { hasText: q.slice(0, 20) }).first().click();
    await page.waitForTimeout(700);
    const item = await page.locator('.hm-faq__q', { hasText: q.slice(0, 20) }).first().evaluate((el) => el.parentElement?.innerText ?? el.innerText);
    console.log('\n--- Nội dung FAQ cân nặng ---\n' + item.slice(0, 900));
  }
}

fs.writeFileSync('reports/raw/probe-t1-surcharge-page.json', JSON.stringify({ doan, faq }, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t1-surcharge-page.json');
await browser.close();
