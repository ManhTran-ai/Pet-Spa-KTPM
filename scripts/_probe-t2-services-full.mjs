import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: bang gia tinh T2 day du + so dich vu calculator so voi bang tinh. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);
K.bangGiaDayDu = await page.locator('table').evaluateAll((els) =>
  els.map((t) =>
    [...t.querySelectorAll('tbody tr')].map((r) =>
      [...r.querySelectorAll('th,td')].map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
  ),
);

// Dinh danh dich vu trong bang tinh (tên o dau cot / nhom)
K.nhomDichVu = await page.locator('table').evaluateAll((els) =>
  els.map((t) => ({
    headers: [...t.querySelectorAll('thead th')].map((h) => (h.textContent || '').replace(/\s+/g, ' ').trim()),
    nhom: [...t.querySelectorAll('tbody tr')].map((r) => {
      const cells = [...r.querySelectorAll('th,td')];
      return cells.length === 1 ? cells[0].textContent?.trim() : null;
    }).filter(Boolean),
    ten: [...t.querySelectorAll('tbody tr')].map((r) => {
      const cells = [...r.querySelectorAll('th,td')];
      return cells.length > 1 ? cells[0].textContent?.replace(/\s+/g, ' ').trim() : null;
    }).filter(Boolean),
  })),
);

// Calculator: danh sach dich vu
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(1800);

K.calcDichVu = await page.locator('.svc').evaluateAll((els) =>
  els.map((e) => ({ cls: e.className, ten: (e.querySelector('b,strong,h3,h4,.svc-name')?.textContent || e.textContent || '').replace(/\s+/g, ' ').trim() })),
);
K.calcSoLuong = await page.locator('.svc').count();
// Co the nut phan trang / "Xem them" khong?
K.nutPhanTrang = await page.locator('button, a').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter((t) => /xem thêm|thêm|tat ca|tất cả|load|more/i.test(t)),
);

fs.writeFileSync('reports/raw/probe-t2-services-full.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 9000));
await browser.close();
