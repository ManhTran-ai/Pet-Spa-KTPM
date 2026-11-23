import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: danh muc dich vu T2 (buoc 3 calculator) + bang gia tinh. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(1500);

K.dichVu = await page.locator('.svc').evaluateAll((els) =>
  els.map((e) => ({
    cls: e.className,
    text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
  })),
);
K.soSvc = await page.locator('.svc').count();
K.soCombo = await page.locator('.svc.combo').count();
K.soLe = await page.locator('.svc:not(.combo)').count();

// Bang gia tinh tren trang
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const bang = await page.locator('table').evaluateAll((els) =>
  els.map((t) => ({
    rows: t.querySelectorAll('tbody tr').length,
    cols: t.querySelectorAll('thead th').length,
    headers: [...t.querySelectorAll('thead th')].map((h) => (h.textContent || '').replace(/\s+/g, ' ').trim()),
    sample: [...t.querySelectorAll('tbody tr')].slice(0, 3).map((r) =>
      [...r.querySelectorAll('th,td')].map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
  })),
);
K.bangGia = bang;

const t2body = await page.locator('body').innerText();
K.dongGia = t2body.split('\n').filter((l) => /\d{2,3}\.\d{3}|\d+k\b|₫|đ/.test(l)).slice(0, 40);

fs.writeFileSync('reports/raw/probe-t2-services.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 9000));
await browser.close();
