import { chromium } from '@playwright/test';

/** Tìm nút đóng drawer T3 — Ngày 12 — Ngân. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

const dom = await page.evaluate(() => ({
  drawerPaper: document.querySelectorAll('.MuiDrawer-paper').length,
  drawerRoot: document.querySelectorAll('.MuiDrawer-root').length,
  backdrop: document.querySelectorAll('.MuiBackdrop-root').length,
  closeish: [...document.querySelectorAll('[aria-label], [class*="close"], [class*="Close"]')]
    .map((el) => `${el.tagName}|aria=${el.getAttribute('aria-label')}|${String(el.className).slice(0, 70)}|${el.textContent.trim().slice(0, 20)}`)
    .slice(0, 25),
}));
console.log(JSON.stringify(dom, null, 2));

// Thử reload để reset trạng thái.
await page.getByPlaceholder('Mobile number').first().fill('6095550199');
await page.waitForTimeout(500);
console.log('trước reload:', await page.getByPlaceholder('Mobile number').first().inputValue());
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(4000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(3000);
console.log('sau reload, giá trị ô SĐT:', await page.getByPlaceholder('Mobile number').first().inputValue().catch(() => '<không có>'));

await browser.close();
