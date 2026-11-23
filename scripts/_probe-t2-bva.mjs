import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Probe: cấu trúc chip bậc cân nặng + bảng giá tĩnh của T2,
 * phục vụ viết BVA `TC-T2-M3-013..018` và `TC-T2-M2-005/006`.
 *
 * ADR-11: chỉ đọc, không gửi form.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

const out = {};

// --- 1. Chip bậc cân nặng (bước 2 của calculator) ---
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(1200);

out.chips = await page.locator('.chip').evaluateAll((els) =>
  els.map((e) => ({
    text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
    cls: e.className,
    title: e.getAttribute('title') || '',
    aria: e.getAttribute('aria-label') || '',
    data: e.getAttribute('data-min') || e.getAttribute('data-band') || '',
  })),
);

out.htmlChip = await page.locator('.chip').first().evaluate((e) => e.outerHTML).catch(() => null);

// --- 2. Bảng giá tĩnh ---
await page.goto('https://matpet.vn/bang-gia', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

out.bangGia = await page.locator('table').evaluateAll((tables) =>
  tables.map((t) => ({
    head: [...t.querySelectorAll('thead th')].map((c) => (c.textContent || '').trim()),
    rows: [...t.querySelectorAll('tbody tr')].map((r) =>
      [...r.querySelectorAll('th,td')].map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
  })),
);

const body = await page.locator('body').innerText();
out.baoGiaRieng = body
  .split('\n')
  .filter((l) => /báo giá riêng|50\.000|tuỳ thiết kế|tùy thiết kế/i.test(l))
  .slice(0, 30);

fs.writeFileSync('reports/raw/probe-t2-bva.json', JSON.stringify(out, null, 2), 'utf8');
console.log(JSON.stringify(out, null, 1).slice(0, 8000));
await browser.close();
