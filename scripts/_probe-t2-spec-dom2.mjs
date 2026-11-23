import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2500);

// Danh muc dich vu — dung text thay vi class heuristic
out.danhMuc = await page.evaluate(() => {
  const t = document.body.innerText;
  return t.slice(0, 6000);
});

// Bang gia — lay text cua tung hang
out.bangGiaText = await page.evaluate(() =>
  [...document.querySelectorAll('table')].map((t) =>
    [...t.querySelectorAll('tr')].map((r) => [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim())),
  ),
);

// Tim the cua "bao gia rieng"
out.baoGiaRieng = await page.evaluate(() => {
  const t = document.body.innerText;
  const idx = t.indexOf('Báo giá riêng');
  return { co: idx >= 0, doan: idx >= 0 ? t.slice(idx - 200, idx + 900) : '' };
});

// Quy trinh / xac nhan / huy lich tren tat ca trang
const ROUTES = ['/', '/spa', '/so-sanh', '/bao-hanh', '/tim-bem-thuong', '/cho', '/meo', '/ve-mat-pet', '/en', '/en/spa'];
out.trang = {};
for (const p of ROUTES) {
  const resp = await page.goto('https://matpet.vn' + p, { waitUntil: 'domcontentloaded' }).catch(() => null);
  const status = resp?.status() ?? 'ERR';
  await page.waitForTimeout(400);
  const txt = await page.locator('body').innerText().catch(() => '');
  out.trang[p] = {
    status,
    coQuyTrinh: /quy trình|quytrinh/i.test(txt),
    co4Buoc: /\b4\s*bước|4 bước|4 bước/i.test(txt),
    coXacNhan: /xác nhận|xac nhan/i.test(txt),
    coHuy: /hủy|huy|đổi lịch|doi lich/i.test(txt),
    coHoanCoc: /hoàn cọc|hoan coc|hoàn tiền|hoan tien|refund/i.test(txt),
    coNenDat: /nên đặt|nen dat|2-4 giờ|2–4 giờ/i.test(txt),
    doanHuy: (() => {
      const m = txt.match(/.{0,120}(hủy|hoàn cọc|đổi lịch).{0,200}/i);
      return m ? m[0].replace(/\s+/g, ' ') : '';
    })(),
    dau: txt.slice(0, 300).replace(/\s+/g, ' '),
  };
}

fs.writeFileSync('reports/raw/probe-t2-spec-dom2.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
