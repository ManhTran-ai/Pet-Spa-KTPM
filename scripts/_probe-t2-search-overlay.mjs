import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: mo overlay "Tìm kiếm" tren T2 va kiem tra co o input tim kiem khong. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

const nut = page.locator('button[aria-label="Tìm kiếm"]').first();
console.log('so nut Tim kiem =', await page.locator('button[aria-label="Tìm kiếm"]').count());
await nut.click();
await page.waitForTimeout(1500);

const ketQua = {
  coOverlay: await page.locator('input').count(),
  inputs: await page.locator('input').evaluateAll((els) =>
    els.map((e) => ({
      type: e.getAttribute('type') || '(none)',
      placeholder: e.getAttribute('placeholder') || '',
      aria: e.getAttribute('aria-label') || '',
      id: e.id || '',
      cls: e.className || '',
      visible: !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length),
    })),
  ),
};
const body = await page.locator('body').innerText();
ketQua.doanText = body.split('\n').filter((l) => /tìm kiếm|tim kiem/i.test(l)).slice(0, 10);

fs.writeFileSync('reports/raw/probe-t2-search-overlay.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
