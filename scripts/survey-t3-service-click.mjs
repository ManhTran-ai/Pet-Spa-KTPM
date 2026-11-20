import { chromium } from '@playwright/test';

/**
 * Thử bấm một dịch vụ trên danh mục chính của T3 để xem có đi tới màn
 * chọn khung giờ hay không (Ngày 12 — Ngân). Chỉ đọc, không gửi SĐT.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const apis = [];
page.on('response', (r) => {
  if (r.url().includes('/booking-api/')) apis.push(`${r.request().method()} ${r.status()} ${r.url().replace(/^https?:\/\/[^/]+/, '')}`);
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

const nhom = await page.evaluate(() =>
  [...document.querySelectorAll('.MuiListItemText-primary')].map((e) => e.textContent.trim()),
);
for (const ten of nhom) {
  await page.getByText(ten, { exact: false }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(700);
}

const item = page.locator('.NameAndDesc-name', { hasText: 'Dog Bath 20-50lbs' }).first();
console.log('item count:', await item.count());
await item.click({ timeout: 8000 }).catch((e) => console.log('click lỗi:', e.message.split('\n')[0]));
await page.waitForTimeout(5000);

console.log('\n--- API sau khi bấm dịch vụ ---');
console.log(apis.join('\n'));
console.log('\n--- dialog/drawer ---');
const dialogs = await page.evaluate(() => ({
  dialogs: [...document.querySelectorAll('[role="dialog"], .MuiDrawer-paper, .MuiModal-root')].map((d) =>
    d.innerText.replace(/\s+/g, ' ').slice(0, 400),
  ),
  buttons: [...document.querySelectorAll('button')].map((b) => b.textContent.trim()).filter(Boolean),
}));
console.log(JSON.stringify(dialogs, null, 2));

await browser.close();
