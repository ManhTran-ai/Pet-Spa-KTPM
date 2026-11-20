import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Tìm các chunk lazy-load của T3 để xem cách gọi `available-time` (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const html = await page.content();
const assets = [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+\.js)"/g)].map((m) => m[1]);
const all = new Set(assets);

// Thu thập thêm chunk được nạp động khi mở drawer.
page.on('response', (r) => {
  if (/\.js$/.test(r.url())) all.add(r.url());
});
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(5000);

console.log('assets:', all.size);
const names = [...all].map((u) => u.split('/').pop());
console.log(names.join('\n'));

for (const u of all) {
  const name = u.split('/').pop();
  if (!name || name === 'index-CIZQSWBj.js') continue;
  const text = await page.evaluate(async (url) => {
    const res = await fetch(url);
    return res.text();
  }, u);
  if (text.includes('available-time') || text.includes('getTimeslot')) {
    console.log(`\n### ${name} chứa getTimeslot (${text.length} bytes)`);
    const i = text.indexOf('getTimeslot');
    console.log(text.slice(Math.max(0, i - 800), i + 800));
    fs.writeFileSync(`reports/raw/survey-T3-chunk-${name}`, text, 'utf8');
  }
}

await browser.close();
