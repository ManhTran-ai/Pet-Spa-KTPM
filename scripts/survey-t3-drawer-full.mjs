import { chromium } from '@playwright/test';

/**
 * Khảo sát toàn bộ nội dung drawer T3 sau khi mở rộng "more ˅",
 * tìm đường dẫn tới màn chọn khung giờ (Ngày 12 — Ngân).
 * ADR-11: chỉ đọc, không gửi SĐT hợp lệ.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);

// Liên kết toàn trang (trước khi mở drawer).
const links = await page.evaluate(() =>
  [...document.querySelectorAll('a')].map((a) => `${a.textContent.trim().slice(0, 40)} -> ${a.href}`),
);
console.log('=== LINKS trang ===');
console.log([...new Set(links)].join('\n'));

await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

const more = page.getByRole('button', { name: /more/i }).first();
if (await more.isVisible().catch(() => false)) {
  await more.click();
  await page.waitForTimeout(3000);
}

const dump = await page.evaluate(() => {
  const drawer = document.querySelector('.MuiDrawer-paper');
  const root = drawer ?? document.body;
  const clone = root.cloneNode(true);
  for (const opt of clone.querySelectorAll('option')) opt.remove();
  for (const sel of clone.querySelectorAll('select')) sel.remove();
  return {
    text: clone.innerText.replace(/\n{3,}/g, '\n\n').trim(),
    buttons: [...root.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean),
    links: [...root.querySelectorAll('a')].map((a) => `${a.textContent.trim().slice(0, 40)} -> ${a.href}`),
    lists: [...root.querySelectorAll('.MuiListItemText-primary')].map((el) => el.textContent.trim()),
  };
});
console.log('\n=== DRAWER mở rộng ===');
console.log('TEXT:\n' + dump.text.slice(0, 3000));
console.log('\nBUTTONS:', dump.buttons.join(' | '));
console.log('\nLISTS:', dump.lists.join(' | '));
console.log('\nLINKS:', dump.links.join(' | '));

await browser.close();
