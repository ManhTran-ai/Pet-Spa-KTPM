import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Kiểm thử tích hợp T1 (Ngày 10) — bước 1b: đi hết wizard 4 bước, ghi lại
 * mọi request XHR/fetch phát sinh + dữ liệu giá ở mỗi bước.
 *
 * ADR-11: KHÔNG bấm nút gửi/đặt lịch cuối cùng.
 */

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const apiCalls = [];
page.on('request', (req) => {
  const t = req.resourceType();
  if (t === 'xhr' || t === 'fetch') {
    apiCalls.push({ method: req.method(), url: req.url(), postData: req.postData() });
  }
});

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

const nutDatLich = page.getByRole('button', { name: /Đặt lịch/i }).first();
await nutDatLich.click();
await page.waitForTimeout(1500);

const buoc = [];
const snapshot = async (ten) => {
  const state = await page.evaluate(() => {
    const active = document.querySelector('.bk-step.is-active .bk-step__label')?.textContent?.trim() ?? null;
    const wrap = document.querySelector('.bk-modal, [class*=bk-][class*=wrap], .bk');
    const text = (wrap?.textContent || document.body.textContent || '')
      .replace(/\s+/g, ' ')
      .trim();
    return { active, text: text.slice(0, 4000) };
  });
  buoc.push({ ten, ...state });
  console.log(`\n=== ${ten} | active=${state.active} ===`);
  console.log(state.text.slice(0, 900));
};

// BUOC 1 — Dich vu
const svcItems = await page.locator('.bk-modal .pkg, .bk-modal [class*=pkg]').count();
console.log('So goi dich vu:', svcItems);
if (svcItems === 0) {
  const dump = await page.evaluate(() => {
    const root = document.querySelector('.bk-modal') || document.body;
    const set = new Set();
    root.querySelectorAll('*').forEach((e) => {
      (e.className || '').toString().split(/\s+/).forEach((c) => { if (c) set.add(c); });
    });
    return [...set].sort();
  });
  console.log('Classes trong modal:', dump.join(' '));
}
await snapshot('B1_DichVu');

fs.writeFileSync('reports/raw/t1-network.json', JSON.stringify({ apiCalls, buoc }, null, 2), 'utf8');
await browser.close();
