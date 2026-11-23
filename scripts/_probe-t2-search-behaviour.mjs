import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: hanh vi tim kiem that cua T2 trong overlay "Tìm kiếm". */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

const ketQua = {};

/** Mo overlay tim kiem va tra ve o input. */
async function moOverlay() {
  await page.locator('button[aria-label="Tìm kiếm"]').first().click();
  await page.waitForTimeout(1200);
  return page.locator('input[aria-label="Tìm kiếm"], input[placeholder*="Tìm giống"]').first();
}

async function demKetQua() {
  return page.evaluate(() => {
    const btns = [...document.querySelectorAll('a')].filter((a) => {
      const r = a.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    const txt = document.body.innerText;
    return {
      soLink: btns.length,
      soKetQua: btns.filter((a) => /\/cho\/|\/meo\/|\/showroom\/|\/blog\/|\/spa\//.test(a.getAttribute('href') || '')).length,
      coThongBao: /không tìm thấy|không có kết quả|không tồn tại|chưa có kết quả|Tìm kiếm/i.test(txt),
      doan: txt.split('\n').filter((l) => l.trim().length > 0).slice(0, 40),
    };
  });
}

await page.goto('https://matpet.vn/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

const o = await moOverlay();
ketQua.rong = { truocKhiNhap: await demKetQua() };
await o.fill('');
await page.waitForTimeout(1200);
ketQua.rong.sauKhiNhapRong = await demKetQua();

await o.fill('spa');
await page.waitForTimeout(1500);
ketQua.sp_thuong = await demKetQua();

await o.fill('SPA');
await page.waitForTimeout(1500);
ketQua.SPA_hoa = await demKetQua();

await o.fill('xyzkhongtontai123');
await page.waitForTimeout(1500);
ketQua.khongTonTai = await demKetQua();

await o.fill('poodle');
await page.waitForTimeout(1500);
ketQua.poodle = await demKetQua();

fs.writeFileSync('reports/raw/probe-t2-search-behaviour.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1).slice(0, 9000));
await browser.close();
