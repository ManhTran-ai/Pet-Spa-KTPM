import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ---- T1: header / footer co gio mo cua? ----
for (const p of ['/vi', '/vi/contact']) {
  await page.goto('https://petngon.vn' + p, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  out['t1_' + p] = await page.evaluate(() => {
    const hd = document.querySelector('header');
    const ft = document.querySelector('footer');
    const gioRe = /\d{1,2}\s*[:hH]\s*\d{2}\s*[-–—]\s*\d{1,2}\s*[:hH]?\s*\d{0,2}/;
    return {
      coGioHeader: hd ? gioRe.test(hd.innerText) : false,
      headerText: hd ? hd.innerText.replace(/\s+/g, ' ').slice(0, 400) : null,
      coGioFooter: ft ? gioRe.test(ft.innerText) : false,
      footerText: ft ? ft.innerText.replace(/\s+/g, ' ').slice(0, 600) : null,
      coGioToanTrang: gioRe.test(document.body.innerText),
      doanGio: (document.body.innerText.match(/.{0,120}\d{1,2}\s*[:hH]\s*\d{2}\s*[-–—]\s*\d{1,2}\s*[:hH]?\s*\d{0,2}.{0,120}/) || [''])[0].replace(/\s+/g, ' '),
    };
  });
}

// ---- T1: menu / footer links ----
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.t1lienKet = await page.evaluate(() =>
  [...document.querySelectorAll('header a[href], nav a[href], footer a[href]')].map((a) => a.getAttribute('href')),
);

// ---- T2: validation khi SDT rong / sai dinh dang ----
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const next = page.locator('button:has-text("Tiếp tục →")').first();
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(500);
await next.click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(500);
await next.click();
await page.waitForTimeout(1000);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(800);
await page.locator('button:has-text("Giữ chỗ với mức giá này")').first().click();
await page.waitForTimeout(1200);
out.t2form = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coNutGui: [...document.querySelectorAll('button')].map((b) => (b.textContent || '').replace(/\s+/g, ' ').trim()).filter((x) => /giữ chỗ|xác nhận|gửi/i.test(x)),
    coLoi: /lỗi|không hợp lệ|vui lòng nhập|bắt buộc/i.test(t),
    doanLoi: (t.match(/.{0,80}(lỗi|không hợp lệ|vui lòng nhập).{0,120}/i) || [''])[0].replace(/\s+/g, ' '),
    coDongY: /liên hệ qua (điện thoại|Zalo)|đồng ý|Zalo/i.test(t),
    doanDongY: (t.match(/.{0,150}(liên hệ qua|Zalo|đồng ý).{0,200}/i) || [''])[0].replace(/\s+/g, ' '),
    inputs: [...document.querySelectorAll('input')].map((i) => ({ type: i.type, ph: i.placeholder, required: i.required, min: i.min, max: i.max })),
    coThongBaoZalo: /gọi xác nhận/i.test(t),
  };
});

// Bấm nút giữ chỗ với SDT rong
const nut = page.locator('button:has-text("Giữ chỗ →")').first();
if ((await nut.count()) > 0) {
  out.t2coNutGui2 = true;
  await nut.click();
  await page.waitForTimeout(1200);
  out.t2sauBam = await page.evaluate(() => {
    const t = document.body.innerText;
    return {
      coLoi: /lỗi|không hợp lệ|vui lòng nhập|Số điện thoại/i.test(t),
      doan: (t.match(/.{0,120}(lỗi|không hợp lệ|vui lòng nhập).{0,160}/i) || [''])[0].replace(/\s+/g, ' '),
    };
  });
} else {
  out.t2coNutGui2 = false;
}

fs.writeFileSync('reports/raw/probe-final4.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
