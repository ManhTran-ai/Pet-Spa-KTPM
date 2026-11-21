import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do DOM trang T1 (petngon.vn/vi) phuc vu viet spec Playwright:
 * - bang gia theo can nang
 * - wizard dat lich (4 buoc)
 * - nhan i18n VI/EN
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

// --- Bang gia ---
const tables = await page.evaluate(() =>
  [...document.querySelectorAll('table')].map((t) => ({
    cls: t.className,
    rows: [...t.querySelectorAll('tr')].map((r) =>
      [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
    ),
  })),
);
console.log('=== BANG GIA ===');
tables.forEach((t, i) => {
  console.log(`--- bang ${i} (${t.cls}) ---`);
  t.rows.slice(0, 4).forEach((r) => console.log(r.join(' | ')));
  console.log(`   (tong ${t.rows.length} dong)`);
});

// --- Cac nut / dieu huong ---
const btns = await page.locator('button, a[href]').evaluateAll((els) =>
  els
    .map((e) => ({
      tag: e.tagName,
      text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      cls: e.className,
      href: e.getAttribute('href') || '',
    }))
    .filter((b) => b.text),
);
console.log('\n=== BUTTON / LINK ===');
btns.forEach((b) => console.log(`[${b.tag}.${String(b.cls).slice(0, 40)}] "${b.text}" ${b.href}`));

fs.writeFileSync('reports/raw/survey-T1-dom.json', JSON.stringify({ tables, btns }, null, 2), 'utf8');
await browser.close();
