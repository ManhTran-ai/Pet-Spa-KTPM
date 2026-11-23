import { chromium } from '@playwright/test';

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ga-booking-btn', { timeout: 20000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15000 });
await page.waitForTimeout(1500);
const data = await page.locator('.bk-modal').evaluate((m) => ({
  bkSvc: [...m.querySelectorAll('.bk-svc')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  bkPrice: [...m.querySelectorAll('.bk-svc__price')].map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
  allText: (m.textContent || '').replace(/\s+/g, ' ').slice(0, 1500),
}));
console.log(JSON.stringify(data, null, 1));
await b.close();
