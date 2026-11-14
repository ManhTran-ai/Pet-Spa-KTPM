import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Mở rộng danh mục dịch vụ T3 và đọc giá hiển thị trên giao diện để đối chiếu API. */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3500);

const labels = await page.evaluate(() =>
  [...document.querySelectorAll('*')]
    .filter((el) => el.children.length === 0 && /bath included|QUICK SERVICE|ADD ON|EMERGENCY/i.test(el.textContent ?? ''))
    .map((el) => ({ tag: el.tagName, cls: el.className, text: el.textContent.trim().slice(0, 60) })),
);
console.log('CANDIDATES', JSON.stringify(labels, null, 2));

// Thử click theo nhãn rồi đọc lại phần Services.
for (const name of ['Dog (bath included)', 'Cat (bath included)']) {
  try {
    await page.getByText(name, { exact: false }).first().click({ timeout: 5000 });
    await page.waitForTimeout(1500);
  } catch (e) {
    console.log(`click ${name} lỗi: ${e.message.split('\n')[0]}`);
  }
}
const after = await page.evaluate(() => document.body.innerText);
fs.writeFileSync('reports/raw/survey-T3-expanded2.txt', after, 'utf8');
console.log(after.slice(after.indexOf('Services'), after.indexOf('Powered by') + 100));

await browser.close();
