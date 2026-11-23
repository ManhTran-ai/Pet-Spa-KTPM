import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** T2 — sau khi chon dich vu, trang /spa co form giu cho hay khong? Nut nao ton tai? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const next = page.getByRole('button', { name: 'Tiếp tục →' });
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await next.click();
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(1200);

// Tat ca button tren trang
const buttons = await page.locator('button').evaluateAll((els) =>
  els.map((e) => ({
    cls: typeof e.className === 'string' ? e.className : '',
    text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70),
    visible: e.offsetParent !== null,
    disabled: e.disabled === true,
  })),
);
console.log('=== BUTTONS ===');
console.log(JSON.stringify(buttons, null, 1));

const body = await page.locator('body').innerText();
console.log('\n=== BODY (4000 ky tu) ===');
console.log(body.slice(0, 4000));

fs.writeFileSync(
  'reports/raw/probe-t2-after-service.json',
  JSON.stringify({ buttons, body }, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t2-after-service.json');
await browser.close();
