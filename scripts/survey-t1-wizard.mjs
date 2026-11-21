import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do tung buoc wizard dat lich T1 (modal 4 buoc) de viet spec M4/M6.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);
await page.locator('.ga-booking-btn').first().click();
await page.waitForTimeout(1200);

const dump = async (nhan) => {
  const fields = await page.locator('.bk-modal button, .bk-modal input, .bk-modal select, .bk-modal textarea, .bk-modal [class*=opt], .bk-modal [class*=chip], .bk-modal [class*=radio]').evaluateAll((els) =>
    els
      .map((e) => ({
        tag: e.tagName,
        type: e.getAttribute('type') || '',
        name: e.getAttribute('name') || '',
        cls: e.className,
        text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70),
        visible: !!(e.offsetWidth || e.offsetHeight),
      }))
      .filter((f) => f.visible && (f.text || f.tag === 'INPUT' || f.tag === 'SELECT' || f.tag === 'TEXTAREA')),
  );
  console.log(`\n===== ${nhan} =====`);
  fields.forEach((f) => console.log(`${f.tag}[${f.type}] "${f.text}" cls="${String(f.cls).slice(0, 50)}"`));
  return fields;
};

const buoc1 = await dump('BUOC 1 - DICH VU');

// Chon "Combo Tam + Ve sinh" roi Tiep tuc
await page.locator('.bk-svc', { hasText: 'Combo Tắm + Vệ sinh' }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

const buoc2 = await dump('BUOC 2 - BE CUNG');

// Chon loai + can nang
const opts = await page.locator('.bk-modal [class*=opt], .bk-modal button').evaluateAll((els) =>
  els
    .map((e) => ({ cls: e.className, text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60) }))
    .filter((o) => o.text && o.visible !== false),
);
console.log('\n--- opts buoc 2 ---');
opts.forEach((o) => console.log(`[${String(o.cls).slice(0, 45)}] ${o.text}`));

fs.writeFileSync(
  'reports/raw/survey-T1-wizard-dom.json',
  JSON.stringify({ buoc1, buoc2, opts }, null, 2),
  'utf8',
);
await browser.close();
