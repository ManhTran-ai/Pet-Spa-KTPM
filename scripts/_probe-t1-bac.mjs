import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: nhan dang bac can nang that cua T1 (bang gia + wizard buoc 2). */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('table.hm-pricing-matrix', { timeout: 30_000 });

const bang = await page.locator('table.hm-pricing-matrix tbody tr').evaluateAll((rows) => {
  const out = [];
  for (const r of rows) {
    const cells = Array.from(r.querySelectorAll('th,td')).map((c) =>
      (c.textContent || '').replace(/\s+/g, ' ').trim(),
    );
    out.push({ n: cells.length, cells });
  }
  return out;
});

// Wizard buoc 2: danh sach bac
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

const toggle = await modal.locator('.bk-pet-grid--2 .bk-pet').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
const bacCho = await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);

// Chon "Chó" neu can de xem bac cua cho
const nutCho = modal.locator('.bk-pet-grid--2 .bk-pet').filter({ hasText: /^Chó/ }).first();
if (await nutCho.count()) {
  await nutCho.click();
  await page.waitForTimeout(700);
}
const bacCho2 = await modal.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);

// Chuoi HTML cua mot o de xem dau gach
const htmlDau = await page
  .locator('table.hm-pricing-matrix tbody tr')
  .nth(1)
  .evaluate((r) => r.innerHTML.slice(0, 400));

const ketQua = { bang, toggle, bacCho, bacCho2, htmlDau };
fs.writeFileSync('reports/raw/probe-t1-bac.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
