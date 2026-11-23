import { chromium } from '@playwright/test';

const b = await chromium.launch({ channel: 'chrome' });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.ga-booking-btn', { timeout: 20000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(500);
await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await modal.locator('.bk-input[placeholder*="Bông" i]').fill('Bé Test');
await page.waitForTimeout(250);
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(500);
await modal.locator('.bk-day').nth(1).click();
await modal.locator('.bk-time').nth(1).click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(500);
await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(400);
await modal.locator('.bk-input[placeholder*="Nguyễn Huệ" i]').fill('Yên Bái');
await page.waitForTimeout(3500);

const html = await modal.innerHTML();
// Tìm mọi node chứa chữ "Liên hệ" hoặc "báo giá riêng"
const hits = await modal.evaluate((m) => {
  const out = [];
  for (const el of m.querySelectorAll('*')) {
    const t = (el.textContent || '').trim();
    if (el.children.length === 0 && /liên hệ|báo giá riêng|báo giá|liênhe/i.test(t)) {
      out.push({ tag: el.tagName, cls: el.className, text: t.slice(0, 120) });
    }
  }
  return out;
});
console.log('--- nodes chua "lien he / bao gia rieng":');
console.log(JSON.stringify(hits, null, 1));
const kmIdx = html.indexOf('Khoảng cách');
console.log('--- HTML quanh "Khoảng cách":');
console.log(html.slice(Math.max(0, kmIdx - 1200), kmIdx + 1800).replace(/\s+/g, ' '));
await b.close();
