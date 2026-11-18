import { chromium } from '@playwright/test';

/**
 * Khảo sát drawer "Book Now" của T3, bỏ qua khối chọn quốc gia (Ngày 4 — Ngân).
 * ADR-11: KHÔNG gửi SĐT, KHÔNG hoàn tất đặt lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

// Thu thập nội dung drawer, loại bỏ option của select quốc gia.
const thu = async (nhan) => {
  const drawer = page.locator('.MuiDrawer-paper');
  const duLieu = await drawer.evaluate((root) => {
    const clone = root.cloneNode(true);
    for (const opt of clone.querySelectorAll('option')) opt.remove();
    for (const sel of clone.querySelectorAll('select')) sel.remove();
    return {
      text: clone.innerText.replace(/\n{3,}/g, '\n\n').trim(),
      buttons: [...root.querySelectorAll('button')].map((el) => el.textContent.trim()).filter(Boolean),
      links: [...root.querySelectorAll('a')].map((el) => `${el.textContent.trim()} -> ${el.getAttribute('href')}`),
      divs: [...root.querySelectorAll('div')]
        .filter((el) => el.children.length === 0 && el.textContent.trim().length > 0 && el.textContent.trim().length < 80)
        .map((el) => `${el.className}|${el.textContent.trim()}`),
    };
  });
  console.log(`\n=== ${nhan} ===`);
  console.log('TEXT:', duLieu.text.slice(0, 900));
  console.log('BUTTONS:', duLieu.buttons.join(' | '));
  console.log('LINKS:', duLieu.links.join(' | '));
  console.log('DIVS:', duLieu.divs.slice(0, 30).join('\n      '));
};

await thu('drawer sau khi bấm Book Now');

// Bấm "less ˄" để thu gọn khối giới thiệu, xem còn lại gì.
const less = page.getByRole('button', { name: /less/i }).first();
if (await less.isVisible().catch(() => false)) {
  await less.click();
  await page.waitForTimeout(2000);
  await thu('drawer sau khi thu gọn');
}

await browser.close();
