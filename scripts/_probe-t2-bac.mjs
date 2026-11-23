import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: nhan bac can nang that cua T2 + gia tinh tuc theo tung bac. */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);

const ketQua = {};

// Buoc 1: chon Cho
const btnCh = page.getByRole('button', { name: '🐶 Chó', exact: true });
if (await btnCh.count()) {
  await btnCh.first().click();
  await page.waitForTimeout(700);
}
const next = page.getByRole('button', { name: 'Tiếp tục →' });
await next.click();
await page.waitForTimeout(1200);

const chips = await page.locator('.chip').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
ketQua.chips = chips;

// Gia tinh tuc theo tung bac
const giaTheoBac = [];
for (const c of chips) {
  try {
    await page.getByRole('button', { name: c, exact: true }).click();
    await page.waitForTimeout(600);
    const svc = page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first();
    if (await svc.count()) {
      await svc.click();
      await page.waitForTimeout(900);
      const gia = await page.locator('.rail-price').innerText();
      giaTheoBac.push({ bac: c, gia: gia.replace(/\s+/g, ' ').trim() });
    }
  } catch (e) {
    giaTheoBac.push({ bac: c, loi: String(e).slice(0, 80) });
  }
}
ketQua.giaTheoBac = giaTheoBac;

fs.writeFileSync('reports/raw/probe-t2-bac-2026-11-22.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
