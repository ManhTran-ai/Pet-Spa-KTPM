import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Tìm endpoint danh mục dịch vụ của T3 (Groomore) bằng cách theo dõi lưu lượng mạng. */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();

const requests = [];
page.on('response', async (response) => {
  const url = response.url();
  if (!/groomore/i.test(url)) return;
  const type = response.request().resourceType();
  if (!/xhr|fetch|json/i.test(type + (response.headers()['content-type'] ?? ''))) return;
  requests.push({ url, status: response.status() });
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

console.log('=== XHR/JSON ===');
for (const r of requests) console.log(r.status, r.url);

// Thử mở trang booking công khai của Groomore.
const bookingUrls = [
  'https://prettypawscatanddoggrooming.groomore.com/book',
  'https://prettypawscatanddoggrooming.groomore.com/booknow',
  'https://prettypawscatanddoggrooming.groomore.com/services',
  'https://prettypawscatanddoggrooming.groomore.com/pricing',
];
for (const url of bookingUrls) {
  try {
    const r = await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
    await page.waitForTimeout(2500);
    console.log(`\n=== ${url} -> ${r.status()} ===`);
    console.log((await page.evaluate(() => document.body.innerText)).slice(0, 2500));
  } catch (e) {
    console.log(`${url} LỖI ${e.message}`);
  }
}

fs.writeFileSync('reports/raw/survey-T3-requests.json', JSON.stringify(requests, null, 2), 'utf8');
await browser.close();
