import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ---- T1: canh bao gia cuoi ----
await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
out.t1 = await page.evaluate(() => {
  const t = document.body.innerText;
  const pats = [/xác nhận tại spa/i, /giá cuối cùng[^.\n]{0,80}/i, /xác nhận & thanh toán/i, /giá cuối[^.\n]{0,80}/i];
  return pats.map((p) => ({ p: String(p), khop: p.test(t), doan: (t.match(p) || [''])[0] }));
});
out.t1.quyTrinhDoan = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('QUY TRÌNH');
  return t.slice(i, i + 500).replace(/\s+/g, ' ');
});

// ---- T2: chuyen ngon ngu ----
await page.goto('https://matpet.vn/spa', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
out.t2 = {};
out.t2.lienKetEN = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="en"]')].map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || '').trim() })).slice(0, 8),
);
await page.locator('a[href*="/en"]').first().click();
await page.waitForTimeout(2000);
out.t2.sauClickEN = { url: page.url(), tieuDe: await page.title() };
out.t2.lienKetENtrenEN = await page.evaluate(() =>
  [...document.querySelectorAll('a[href*="en"]')].map((a) => a.getAttribute('href')).slice(0, 8),
);
const en2 = page.locator('a[href*="/en"]').first();
if ((await en2.count()) > 0) {
  await en2.click();
  await page.waitForTimeout(1500);
  out.t2.sauClickEN2 = { url: page.url(), tieuDe: await page.title() };
}

// ---- T2: menu links ----
await page.goto('https://matpet.vn/spa', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);
const links = await page.evaluate(() =>
  [...document.querySelectorAll('header a[href], nav a[href], footer a[href]')].map((a) => a.getAttribute('href')),
);
out.t2.trangMenu = [];
for (const h of [...new Set(links)]) {
  if (!h || !h.startsWith('/')) continue;
  const r = await page.request.get('https://matpet.vn' + h).catch(() => null);
  out.t2.trangMenu.push({ href: h, status: r?.status() ?? 'ERR' });
}

// ---- T2: form giu cho, SDT rong ----
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2000);
const next = page.locator('button:has-text("Tiếp tục →")').first();
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(600);
out.t2.nextEnabledSauLoai = await next.isEnabled();
await next.click();
await page.waitForTimeout(900);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(600);
out.t2.nextEnabledSauCanNang = await next.isEnabled();
await next.click();
await page.waitForTimeout(1200);
await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
await page.waitForTimeout(1000);
out.t2.trangSauChon = await page.evaluate(() => document.body.innerText.slice(0, 1400).replace(/\s+/g, ' '));
const nut = page.locator('button:has-text("Giữ chỗ")').first();
out.t2.coNutGiuCho = await nut.count();
out.t2.nutLabels = await page.evaluate(() =>
  [...document.querySelectorAll('button')].map((b) => (b.textContent || '').replace(/\s+/g, ' ').trim()).filter((t) => t.length < 60).slice(-25),
);
if (out.t2.coNutGiuCho) {
  await nut.click();
  await page.waitForTimeout(1500);
  out.t2.sauBamGiuCho = await page.evaluate(() => document.body.innerText.slice(0, 1600).replace(/\s+/g, ' '));
}

fs.writeFileSync('reports/raw/probe-final3.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
