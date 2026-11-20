import { chromium } from '@playwright/test';

/**
 * Tìm nơi hiển thị khung giờ (SelectDateTime) của T3 — nghiên cứu flow
 * đặt lịch sau khi có phiên đăng nhập hợp lệ (Ngày 12 — Ngân).
 * ADR-11: chỉ đọc; dùng số giả dải 555-01xx.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const apis = [];
page.on('response', (r) => {
  if (r.url().includes('/booking-api/')) {
    apis.push(`${r.request().method()} ${r.status()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
  }
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(5000);

await page.getByPlaceholder('Mobile number').first().fill('6095550199');
await page.waitForTimeout(800);
await page.getByRole('button', { name: 'Login' }).first().click();
await page.waitForTimeout(8000);

console.log('--- API ---');
console.log([...new Set(apis)].join('\n'));

const dom = await page.evaluate(() => ({
  dialogs: [...document.querySelectorAll('[role="dialog"], .MuiDrawer-paper')].map((d) =>
    d.innerText.replace(/\s+/g, ' ').slice(0, 300),
  ),
  buttons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean).slice(0, 40),
  inputs: [...document.querySelectorAll('input')].map((i) => `${i.type}|${i.placeholder}|${i.name}`),
  selects: [...document.querySelectorAll('select')].map((s) => s.name || s.id),
}));
console.log(JSON.stringify(dom, null, 2));

await browser.close();
