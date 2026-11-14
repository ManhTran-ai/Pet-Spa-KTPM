import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Khảo sát danh mục dịch vụ và giá của T3 (Groomore) — Ngày 2. */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

// Mở các mục dịch vụ gập lại để lấy đủ danh sách và giá.
const toggles = await page.locator('[class*="accordion"], [class*="collapse"], summary, button').all();
for (const t of toggles) {
  try {
    const label = (await t.innerText()).trim();
    if (/DOG|CAT|QUICK|EMERGENCY|ADD ON|Services/i.test(label) && label.length < 60) {
      await t.click({ timeout: 2000 });
      await page.waitForTimeout(400);
    }
  } catch {
    /* bỏ qua phần tử không click được */
  }
}
await page.waitForTimeout(1500);

const text = await page.evaluate(() => document.body.innerText);
fs.writeFileSync('reports/raw/survey-T3-expanded.txt', text, 'utf8');
console.log(text);

const links = await page.evaluate(() =>
  [...document.querySelectorAll('a')].map((a) => `${a.textContent.trim()} -> ${a.href}`).filter((s) => s.includes('http')),
);
console.log('\n=== LINKS ===');
console.log(links.join('\n'));

await browser.close();
