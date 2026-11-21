import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do DOM T2 phuc vu spec M1/M4/M7: tim kiem, tom tat lua chon, dieu huong.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

// Tim kiem?
const search = await page.locator('input[type=search], input[placeholder*=tìm i], input[placeholder*=Tìm i], [class*=search]').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type') || '',
    ph: e.getAttribute('placeholder') || '',
    cls: e.className,
    visible: !!(e.offsetWidth || e.offsetHeight),
  })),
);
console.log('=== TIM KIEM ===');
search.forEach((s) => console.log(JSON.stringify(s)));

// Menu / dieu huong
const links = await page.locator('a[href]').evaluateAll((els) =>
  els.map((a) => ({
    href: a.getAttribute('href') || '',
    text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 50),
  })),
);
console.log('\n=== LINKS ===');
links.forEach((l) => console.log(`${l.text} -> ${l.href}`));

// Hoan tat calculator de xem tom tat
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(700);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(900);
await page.locator('.svc.combo').first().click();
await page.waitForTimeout(900);

const rail = await page.locator('[class*=rail]').evaluateAll((els) =>
  els.map((e) => ({ cls: e.className, text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 200) })),
);
console.log('\n=== RAIL / TOM TAT ===');
rail.forEach((r) => console.log(`[${r.cls}] ${r.text}`));

// Cac form field
const fields = await page.locator('input, textarea, select').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type') || '',
    name: e.getAttribute('name') || '',
    ph: e.getAttribute('placeholder') || '',
    required: e.hasAttribute('required'),
    cls: e.className,
    visible: !!(e.offsetWidth || e.offsetHeight),
  })),
);
console.log('\n=== INPUTS ===');
fields.forEach((f) => console.log(JSON.stringify(f)));

// Nut back
const back = await page.locator('button.back, .btn.back').evaluateAll((els) =>
  els.map((e) => ({ cls: e.className, text: (e.textContent || '').trim(), disabled: e.disabled })),
);
console.log('\n=== NUT BACK ===');
back.forEach((b) => console.log(JSON.stringify(b)));

fs.writeFileSync('reports/raw/survey-T2-dom2.json', JSON.stringify({ search, links, rail, fields, back }, null, 2), 'utf8');
await browser.close();
