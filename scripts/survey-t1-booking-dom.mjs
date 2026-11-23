import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do wizard dat lich T1 (modal 4 buoc) va bang gia day du.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

// Bang gia day du
const bang = await page.locator('table.hm-pricing-matrix tr').evaluateAll((rows) =>
  rows.map((r) => [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim())),
);
console.log('=== BANG GIA DAY DU ===');
bang.forEach((r) => console.log(r.join(' | ')));

// Mo modal dat lich
await page.locator('.ga-booking-btn').first().click();
await page.waitForTimeout(1500);

const modal = await page.locator('[role=dialog], .hm-modal, .bn-modal, [class*=modal]').evaluateAll((els) =>
  els.map((e) => ({ cls: e.className, text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 400) })),
);
console.log('\n=== MODAL ===');
modal.forEach((m) => console.log(`[${m.cls}] ${m.text}\n`));

const fields = await page.locator('input, select, textarea, button').evaluateAll((els) =>
  els
    .map((e) => ({
      tag: e.tagName,
      type: e.getAttribute('type') || '',
      name: e.getAttribute('name') || '',
      ph: e.getAttribute('placeholder') || '',
      text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
      cls: e.className,
      visible: !!(e.offsetWidth || e.offsetHeight),
    }))
    .filter((f) => f.visible),
);
console.log('\n=== FIELD VISIBLE ===');
fields.forEach((f) => console.log(`${f.tag}[${f.type}] name="${f.name}" ph="${f.ph}" cls="${String(f.cls).slice(0, 45)}" text="${f.text}"`));

fs.writeFileSync(
  'reports/raw/survey-T1-booking-dom.json',
  JSON.stringify({ bang, modal, fields }, null, 2),
  'utf8',
);
await browser.close();
