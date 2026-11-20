import { chromium } from '@playwright/test';

/** Mở route /form của T3 và chờ render — Ngày 12 — Ngân. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const apis = [];
page.on('response', (r) => {
  if (r.url().includes('/booking-api/')) apis.push(`${r.request().method()} ${r.status()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/form', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(12_000);

console.log('URL:', page.url());
console.log('--- API ---');
console.log([...new Set(apis)].join('\n'));

const dom = await page.evaluate(() => ({
  text: document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 2000),
  buttons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean).slice(0, 30),
  inputs: [...document.querySelectorAll('input')].map((i) => `${i.type}|${i.placeholder}`),
  days: [...document.querySelectorAll('.gm-available-day, .gm-fullybooked-day, .gm-today-day')].length,
}));
console.log(JSON.stringify(dom, null, 2));

await browser.close();
