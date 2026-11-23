import { chromium } from '@playwright/test';

/** Kiểm tra trạng thái chọn dịch vụ T3 khi thu gọn/mở lại nhóm (Ngày 12 — Ngân). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

await page.getByText('Dog (bath included)', { exact: false }).first().click();
await page.waitForTimeout(1500);

const doc = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.MuiListItem-root')].filter((el) =>
    el.querySelector('.NameAndDesc-name'),
  );
  return items.slice(0, 3).map((el) => ({
    cls: el.className,
    aria: el.getAttribute('aria-selected'),
    role: el.getAttribute('role'),
    html: el.outerHTML.slice(0, 200),
  }));
});
console.log('TRƯỚC khi bấm:', JSON.stringify(doc, null, 2));

await page.locator('.NameAndDesc-name', { hasText: 'Dog Bath 20-50lbs' }).first().click();
await page.waitForTimeout(1500);

const sau = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.MuiListItem-root')].filter((el) =>
    el.querySelector('.NameAndDesc-name'),
  );
  return items.slice(0, 3).map((el) => ({
    cls: el.className,
    aria: el.getAttribute('aria-selected'),
    html: el.outerHTML.slice(0, 200),
  }));
});
console.log('SAU khi bấm:', JSON.stringify(sau, null, 2));

await browser.close();
