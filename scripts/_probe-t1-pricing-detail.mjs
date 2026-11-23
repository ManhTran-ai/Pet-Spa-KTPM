import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: bang gia T1 + gia theo buoc 2/buoc 4 theo tung dich vu. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);

K.bangGia = await page.locator('table.hm-pricing-matrix tbody tr').evaluateAll((rows) => {
  const out = [];
  let loai = '';
  for (const r of rows) {
    const cells = [...r.querySelectorAll('th,td')].map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim());
    if (!cells.length) continue;
    if (cells.length === 1) {
      loai = cells[0];
      continue;
    }
    out.push({ loai, nhan: cells[0], gia: cells.slice(1) });
  }
  return out;
});

K.headerBangGia = await page.locator('table.hm-pricing-matrix thead th').allInnerTexts();

/* Buoc 2 gia theo tung dich vu */
async function buoc2Gia(tenDichVu) {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1000);
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  const modal = page.locator('.bk-modal');
  await modal.locator('.bk-svc').filter({ hasText: tenDichVu }).first().click();
  await page.waitForTimeout(500);
  const b1 = await modal.locator('.bk-svc').evaluateAll((els) =>
    els.map((e) => ({ on: e.className.includes('is-on'), text: (e.textContent || '').replace(/\s+/g, ' ').trim() })),
  );
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(700);
  const b2 = await modal.locator('.bk-pet').evaluateAll((els) =>
    els.map((e) => ({ on: e.className.includes('is-on'), text: (e.textContent || '').replace(/\s+/g, ' ').trim() })),
  );
  return { buoc1: b1.filter((x) => x.on), buoc2: b2 };
}

K.tam = await buoc2Gia('Tắm');
K.comboVeSinh = await buoc2Gia('Combo Tắm + Vệ sinh');

/* Buoc 4 gia tong */
async function buoc4Tong(tenDichVu) {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(1000);
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 15_000 });
  const modal = page.locator('.bk-modal');
  await modal.locator('.bk-svc').filter({ hasText: tenDichVu }).first().click();
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(600);
  await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(300);
  await modal.locator('.bk-input').first().fill('Bé Test');
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  if ((await modal.locator('.bk-time').count()) > 0) {
    await modal.locator('.bk-time').first().click();
    await page.waitForTimeout(300);
  }
  await modal.getByRole('button', { name: /Tiếp tục/ }).click();
  await page.waitForTimeout(900);
  await modal.locator('.bk-loc').filter({ hasText: 'Tận nhà' }).first().click();
  await page.waitForTimeout(400);
  const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
  const i = txt.indexOf('Tắm');
  return { doan: txt.slice(Math.max(0, i - 60), i + 400) };
}

K.tamBuoc4 = await buoc4Tong('Tắm');
K.comboVeSinhBuoc4 = await buoc4Tong('Combo Tắm + Vệ sinh');

fs.writeFileSync('reports/raw/probe-t1-pricing-detail.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 22000));
await browser.close();
