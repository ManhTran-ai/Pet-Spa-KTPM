import { chromium } from '@playwright/test';

/**
 * Toàn bộ nội dung drawer "Book Now" của T3 sau khi mở rộng "more ˅"
 * (Ngày 12 — Ngân). Mục đích xác định có bước chọn khung giờ hay không.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(5000);

const more = page.getByRole('button', { name: /more/i }).first();
if (await more.isVisible().catch(() => false)) {
  await more.click();
  await page.waitForTimeout(3000);
}

const text = await page.evaluate(() => document.body.innerText);
console.log('=== BODY ===');
console.log(text.slice(0, 4000));

await browser.close();
