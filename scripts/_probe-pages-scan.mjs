import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: tat ca route T2 tim noi dung huy/doi/hoan coc + gio mo cua T1/T2. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

/* --- T2: liệt kê toàn bộ link nội bộ rồi dò nội dung --- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);
const links = await page
  .locator('a[href]')
  .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href') ?? ''))].filter((h) => h.startsWith('/')));
K.t2_links = links;

const quet = [];
for (const duong of links.slice(0, 30)) {
  const resp = await page.goto(`https://matpet.vn${duong}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  if (!resp) continue;
  await page.waitForTimeout(600);
  const txt = await page.locator('body').innerText();
  quet.push({
    duong,
    status: resp.status(),
    coHuy: /huỷ|hủy|hủy/i.test(txt),
    coDoiLich: /đổi lịch|đổi.*lịch|dời lịch/i.test(txt),
    coHoanCoc: /hoàn cọc|hoàn tiền|refund|đặt cọc|cọc lịch/i.test(txt),
    coGoiXacNhan: /gọi xác nhận|xác nhận khung giờ|gọi lại/i.test(txt),
    coQuyTrinh: /quy trình/i.test(txt),
    coNenDat: /2\s*[–\-]\s*4 giờ|ít nhất 2|trước ít nhất/i.test(txt),
    coGioMoCua: /mở cửa|giờ làm việc|hoạt động \d{1,2}h|\d{1,2}h\s*[–\-]\s*\d{1,2}h/i.test(txt),
    doan: (() => {
      const i = txt.search(/huỷ|hủy|hủy|hoàn cọc|refund|quy trình/i);
      return i >= 0 ? txt.slice(Math.max(0, i - 150), i + 600) : '';
    })(),
  });
}
K.t2_quetTrang = quet;

/* --- T1: tim trang nao co gio mo cua / hoan coc --- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
const linksT1 = await page
  .locator('a[href]')
  .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href') ?? ''))].filter((h) => h.startsWith('/')));
K.t1_links = linksT1;

const quetT1 = [];
for (const duong of linksT1.slice(0, 30)) {
  const resp = await page.goto(`https://petngon.vn${duong}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  if (!resp) continue;
  await page.waitForTimeout(500);
  const txt = await page.locator('body').innerText();
  quetT1.push({
    duong,
    status: resp.status(),
    coGioMoCua: /mở cửa|giờ làm việc|hoạt động \d{1,2}h|\b0?7\s*[:h]\s*0?0\b.{0,10}\b22\s*[:h]/i.test(txt),
    doanGio: (() => {
      const i = txt.search(/mở cửa|giờ làm việc|hoạt động/i);
      return i >= 0 ? txt.slice(Math.max(0, i - 150), i + 400) : '';
    })(),
    coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(txt),
  });
}
K.t1_quetTrang = quetT1;

fs.writeFileSync('reports/raw/probe-pages-scan.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 20000));
await browser.close();
