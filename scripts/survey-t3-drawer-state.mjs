import { chromium } from '@playwright/test';

/** Tìm cách đóng drawer T3 (nút X, backdrop, Escape) — Ngày 12 — Ngân. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

const mo = await page.evaluate(() => ({
  drawerVisible: !!document.querySelector('.MuiDrawer-paper'),
  backdrop: document.querySelectorAll('.MuiBackdrop-root').length,
  buttons: [...document.querySelectorAll('.MuiDrawer-paper button')].map((b) => ({
    text: b.textContent.trim().slice(0, 30),
    aria: b.getAttribute('aria-label'),
    cls: b.className.slice(0, 60),
  })),
}));
console.log('trước khi đóng:', JSON.stringify(mo, null, 2));

// Thử bấm backdrop.
const backdrop = page.locator('.MuiBackdrop-root').first();
if (await backdrop.count()) {
  await backdrop.click({ position: { x: 5, y: 5 }, force: true });
  await page.waitForTimeout(2000);
  console.log('sau khi bấm backdrop, drawer còn mở?', await page.locator('.MuiDrawer-paper').isVisible().catch(() => false));
}

// Đóng rồi mở lại, kiểm tra ô SĐT có giữ giá trị không.
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(3000);
const o = page.getByPlaceholder('Mobile number').first();
await o.fill('6095550199');
await page.waitForTimeout(600);
console.log('giá trị trước khi đóng:', await o.inputValue());

await page.keyboard.press('Escape');
await page.waitForTimeout(1500);
const backdrop2 = page.locator('.MuiBackdrop-root').first();
if (await backdrop2.count()) {
  await backdrop2.click({ position: { x: 5, y: 5 }, force: true });
  await page.waitForTimeout(2000);
}
console.log('drawer còn mở sau khi đóng?', await page.locator('.MuiDrawer-paper').isVisible().catch(() => false));

await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(3000);
const o2 = page.getByPlaceholder('Mobile number').first();
console.log('giá trị sau khi mở lại:', await o2.inputValue().catch(() => '<không có ô>'));

await browser.close();
