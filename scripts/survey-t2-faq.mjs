import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Mo tat ca FAQ T2 (details/summary) va ghi lai noi dung tra loi. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

// Mo tat ca <details>
const soDetails = await page.locator('details').count();
for (let i = 0; i < soDetails; i += 1) {
  const d = page.locator('details').nth(i);
  if (!(await d.getAttribute('open'))) {
    await d.locator('summary').first().click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(150);
  }
}
console.log('so details:', soDetails);

const cauHoi = await page.locator('details').evaluateAll((els) =>
  els.map((e) => ({
    q: (e.querySelector('summary')?.textContent || '').replace(/\s+/g, ' ').trim(),
    a: (e.textContent || '').replace(/\s+/g, ' ').trim(),
  })),
);
cauHoi.forEach((c) => console.log(`\nQ: ${c.q}\nA: ${c.a}`));

fs.writeFileSync(
  'reports/raw/survey-T2-faq-full.json',
  JSON.stringify(cauHoi, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/survey-T2-faq-full.json');
await browser.close();
