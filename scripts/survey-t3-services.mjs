import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Lấy danh mục dịch vụ T3 từ endpoint JSON công khai của Groomore.
 * Đây cũng là bằng chứng hợp đồng dữ liệu cho kiểm thử tích hợp (Ngày 10).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

const result = await page.evaluate(async () => {
  const r = await fetch('/booking-api/v1/service?booking_page=1');
  return { status: r.status, body: await r.text() };
});

fs.writeFileSync('reports/raw/survey-T3-services.json', result.body, 'utf8');
console.log('status', result.status);
console.log(result.body.slice(0, 6000));
await browser.close();
