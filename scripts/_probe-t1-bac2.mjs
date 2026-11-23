import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: buoc 2 cua wizard T1 co o nhap can nang (kg) hay khong? + phan tich nhan bac. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');
await modal.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(900);

// Tat ca input/select trong modal
const inputs = await modal.locator('input,select,textarea').evaluateAll((els) =>
  els.map((e) => ({
    tag: e.tagName,
    type: e.getAttribute('type'),
    name: e.getAttribute('name'),
    placeholder: e.getAttribute('placeholder'),
    value: e.value,
    cls: e.className,
  })),
);

// Bat ky input nao co chua "kg" hay "can nang" trong placeholder/label
const textModal = (await modal.innerText()).replace(/\n{2,}/g, '\n');

// HTML cua .bk-pet (mot the bac)
const htmlPet = await modal
  .locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet')
  .first()
  .evaluate((e) => e.outerHTML);

const ketQua = { inputs, textModal, htmlPet };
fs.writeFileSync('reports/raw/probe-t1-bac2.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
