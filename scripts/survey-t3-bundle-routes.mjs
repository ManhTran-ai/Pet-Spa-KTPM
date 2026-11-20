import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Trích các route path trong bundle JS của T3 (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'domcontentloaded', timeout: 60_000 });

const js = await page.evaluate(async () => {
  const res = await fetch('https://prettypawscatanddoggrooming.groomore.com/assets/index-CIZQSWBj.js');
  return res.text();
});
fs.writeFileSync('reports/raw/survey-T3-bundle.js', js, 'utf8');
console.log('bundle length:', js.length);

const paths = new Set();
for (const m of js.matchAll(/["'`](\/[a-zA-Z0-9_\-/:.{}$]{2,80})["'`]/g)) {
  const p = m[1];
  if (/\.(js|css|png|jpg|svg|ico|woff2?|json)$/.test(p)) continue;
  paths.add(p);
}
const list = [...paths].sort();
console.log(list.join('\n'));

await browser.close();
