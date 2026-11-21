import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do cac trang co tim kiem cua T2: /so-sanh (So sanh giong), /tim-be-thuong.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const out = {};
for (const duongDan of ['/so-sanh', '/tim-be-thuong', '/cau-hoi-thuong-gap']) {
  await page.goto(`https://matpet.vn${duongDan}`, { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(2500);

  const fields = await page.locator('input, textarea, select').evaluateAll((els) =>
    els.map((e) => ({
      tag: e.tagName,
      type: e.getAttribute('type') || '',
      ph: e.getAttribute('placeholder') || '',
      cls: typeof e.className === 'string' ? e.className : '',
      visible: !!(e.offsetWidth || e.offsetHeight),
    })),
  );
  const tieuDe = await page.title();
  const h1 = await page.locator('h1, h2').first().innerText().catch(() => '');
  console.log(`\n===== ${duongDan} =====`);
  console.log(`title: ${tieuDe} | h1: ${h1}`);
  fields.filter((f) => f.visible).forEach((f) => console.log('  INPUT ' + JSON.stringify(f)));

  out[duongDan] = { tieuDe, h1, fields };
}

fs.writeFileSync('reports/raw/survey-T2-search-dom.json', JSON.stringify(out, null, 2), 'utf8');
await browser.close();
