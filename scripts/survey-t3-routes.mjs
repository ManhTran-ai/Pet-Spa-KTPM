import { chromium } from '@playwright/test';

/**
 * Tìm các route công khai của site T3 (Groomore) — có thể có màn chọn khung giờ
 * riêng ngoài drawer "Book Now" (Ngày 12 — Ngân). Chỉ GET, không gửi form.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

console.log('=== ROUTE trong bundle ===');
const routes = await page.evaluate(() => {
  const out = new Set();
  for (const s of document.querySelectorAll('script[src]')) out.add(s.src);
  return [...out];
});
console.log(routes.join('\n'));

const candidates = [
  '/book-online',
  '/booking',
  '/book',
  '/booknow',
  '/schedule',
  '/appointment',
  '/appointment-booking',
  '/book-online-setting',
  '/services',
  '/pricing',
];

for (const path of candidates) {
  try {
    const res = await page.goto(`https://prettypawscatanddoggrooming.groomore.com${path}`, {
      waitUntil: 'domcontentloaded',
      timeout: 20_000,
    });
    const title = await page.title();
    const len = await page.evaluate(() => document.body.innerText.length);
    console.log(`${path} -> ${res?.status()} | title="${title}" | len=${len}`);
  } catch (e) {
    console.log(`${path} -> LỖI ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
