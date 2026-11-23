import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Rà soát sâu NFR-03-004 — bàn phím trên T2 (bản đúng, không dùng `exact` cho
 * nút có thay đổi accessible name sau khi chọn).
 */

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const ketQua = {};

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);

const moTaFocus = () =>
  page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    return {
      tag: el.tagName,
      text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
      cls: (el.className || '').toString().slice(0, 60),
      disabled: el.disabled === undefined ? null : el.disabled,
    };
  });

/** Bấm bằng bàn phím: focus phần tử → Enter. */
const enter = async (locator, nhan) => {
  await locator.focus();
  const f = await moTaFocus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(800);
  return { nhan, focusTruoc: f, focusSau: await moTaFocus() };
};

const next = page.getByRole('button', { name: 'Tiếp tục →' });

// --- Buoc 1: chon loai bang ban phim
const buoc1 = await enter(page.getByRole('button', { name: /🐶\s*Chó/ }), 'Chó');
buoc1.nextDisabled = await next.isDisabled();
console.log('=== BUOC 1 ===');
console.log(JSON.stringify(buoc1, null, 1));
ketQua.buoc1 = buoc1;

// --- Buoc 1b: next bang ban phim
const buoc1b = await enter(next, 'Tiếp tục →');
console.log('\n=== BUOC 1b (next) ===');
console.log(JSON.stringify(buoc1b, null, 1));
ketQua.buoc1b = buoc1b;

// --- Buoc 2: chon bac can nang
const chipTexts = await page.locator('.chip').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
console.log('\nCHIPS:', JSON.stringify(chipTexts));
const buoc2 = await enter(page.getByRole('button', { name: '>3–6kg' }), '>3–6kg');
buoc2.nextDisabled = await next.isDisabled();
console.log('\n=== BUOC 2 ===');
console.log(JSON.stringify(buoc2, null, 1));
ketQua.buoc2 = buoc2;

// --- Buoc 2b: next
const buoc2b = await enter(next, 'Tiếp tục →');
console.log('\n=== BUOC 2b (next) ===');
console.log(JSON.stringify(buoc2b, null, 1));
ketQua.buoc2b = buoc2b;

// --- Buoc 3: chon dich vu
const svcTexts = await page.locator('.svc').evaluateAll((els) =>
  els.slice(0, 6).map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 70)),
);
console.log('\nSVC:', JSON.stringify(svcTexts));
const buoc3 = await enter(page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first(), 'Combo Tắm Vệ Sinh');
console.log('\n=== BUOC 3 ===');
console.log(JSON.stringify(buoc3, null, 1));
ketQua.buoc3 = buoc3;

// --- Ket qua
const ketQuaCuoi = {
  activeEl: await moTaFocus(),
  railPrice: await page.locator('.rail-price').innerText().catch(() => null),
  summary: await page.locator('.book-summary').innerText().catch(() => null),
};
console.log('\n=== KET QUA CUOI ===');
console.log(JSON.stringify(ketQuaCuoi, null, 1));
ketQua.ketQuaCuoi = ketQuaCuoi;

// --- Kiem tra cac truong nhap co focus duoc khong
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60000 });
await page.waitForTimeout(2000);
const truongNhap = await page.evaluate(() => {
  const ds = [...document.querySelectorAll('input, select, textarea')].map((el) => ({
    tag: el.tagName,
    id: el.id,
    name: el.getAttribute('name'),
    type: el.getAttribute('type'),
    ph: el.getAttribute('placeholder'),
    tabIndex: el.tabIndex,
    focusable: (() => {
      el.focus();
      return document.activeElement === el;
    })(),
  }));
  return ds;
});
console.log('\n=== TRUONG NHAP ===');
console.log(JSON.stringify(truongNhap, null, 1));
ketQua.truongNhap = truongNhap;

fs.writeFileSync('reports/raw/nfr-03-004-keyboard.json', JSON.stringify(ketQua, null, 2), 'utf8');
await browser.close();
