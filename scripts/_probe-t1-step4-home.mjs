import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: chon "Tan nha" o buoc 4 — co o nhap dia chi / cong thuc phu thu km khong? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(900);

const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
await T.click();
await page.waitForTimeout(900);
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(300);
await T.click();
await page.waitForTimeout(900);
await T.click();
await page.waitForTimeout(1200);

// Chon "Tan nha"
await page.locator('.bk-loc', { hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(1200);

const buoc4Nha = await page.locator('.bk-modal').innerText();
console.log('--- BUOC 4 (Tận nhà) ---');
console.log(buoc4Nha);

const fields = await page.locator('.bk-modal input, .bk-modal textarea, .bk-modal select').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type') ?? '',
    ph: e.getAttribute('placeholder') ?? '',
    name: e.getAttribute('name') ?? '',
    cls: e.className ?? '',
    id: e.id ?? '',
    maxlength: e.getAttribute('maxlength') ?? '',
  })),
);
console.log('\nFIELDS:', JSON.stringify(fields, null, 1));

fs.writeFileSync('reports/raw/probe-t1-step4-home.json', JSON.stringify({ buoc4Nha, fields }, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t1-step4-home.json');
await browser.close();
