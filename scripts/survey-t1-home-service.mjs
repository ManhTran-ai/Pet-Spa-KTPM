import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do DOM trang dich vu T1 (petngon.vn/vi) de xac minh phu thu tai nha
 * cua tung goi dich vu (BR-06). Chi doc, khong gui form (ADR-11).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3500);

// Tim cac the "dich vu" / the phu thu tai nha
const cards = await page.locator('article, .card, .service-card, [class*=service], [class*=card]').evaluateAll((els) =>
  els
    .map((e) => ({
      cls: e.className,
      text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
    }))
    .filter((c) => c.text.length > 20 && c.text.length < 400)
    .slice(0, 60),
);
console.log('=== THE DICH VU ===');
cards.forEach((c) => console.log(`[${c.cls}]\n  ${c.text}\n`));

fs.writeFileSync('reports/raw/survey-T1-cards.json', JSON.stringify(cards, null, 2), 'utf8');
await browser.close();
