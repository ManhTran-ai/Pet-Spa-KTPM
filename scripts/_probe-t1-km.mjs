import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: bang dai km + thong bao phu thu di chuyen tren trang chu T1. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const body = await page.locator('body').innerText();

const tim = (re) => {
  const m = body.match(re);
  return m ? body.slice(Math.max(0, m.index - 300), m.index + 900) : '(khong thay)';
};

console.log('=== A. Bảng dải km (0 – 5 km) ===');
console.log(tim(/0\s*[–-]\s*5\s*km/i));
console.log('\n=== B. "Báo giá riêng" / Trên 15 km ===');
console.log(tim(/Trên 15\s*km/i));
console.log('\n=== C. "Phụ thu di chuyển" ===');
console.log(tim(/Phụ thu di chuyển/i));

fs.writeFileSync('reports/raw/probe-t1-km-tables.json', JSON.stringify({ body }, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t1-km-tables.json');
await browser.close();
