import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: dia chi khong xac dinh duoc (Huế) — co con so phi di chuyen hay bien mat? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
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

const onDiaChi = modal.locator('input[placeholder*="Nguyễn Huệ" i]').first();
const DIA_CHI = ['Huế', 'Sapa, Lào Cai', 'xyz khong ton tai 123', 'Hà Giang', 'Hà Nội'];
const ketQua = [];
for (const d of DIA_CHI) {
  await onDiaChi.fill(d);
  await page.waitForTimeout(2500);
  const txt = (await modal.innerText()).replace(/\n{2,}/g, '\n');
  const i = txt.indexOf('Tạm tính');
  ketQua.push({
    diaChi: d,
    coPhi: /Phí di chuyển/.test(txt),
    doanTinh: i >= 0 ? txt.slice(Math.max(0, i - 300), i + 40) : txt.slice(0, 400),
  });
}

fs.writeFileSync('reports/raw/probe-t1-unknown-address.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
