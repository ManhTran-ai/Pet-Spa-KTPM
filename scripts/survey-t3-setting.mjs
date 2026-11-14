import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Lấy cấu hình đặt lịch công khai của T3 để kiểm chứng "phí lễ tân" (BR-12). */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

const result = await page.evaluate(async () => {
  const r = await fetch('/booking-api/v1/book-online-setting');
  return await r.text();
});
fs.writeFileSync('reports/raw/survey-T3-setting.json', result, 'utf8');
console.log(result.slice(0, 5000));
await browser.close();
