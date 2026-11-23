import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2500);

// --- Search overlay ---
out.search = await page.evaluate(() => {
  const btn = document.querySelector('button[aria-label*="Tìm kiếm" i], button[aria-label*="search" i]');
  return { coNut: !!btn, aria: btn?.getAttribute('aria-label') ?? null, html: btn?.outerHTML?.slice(0, 300) ?? null };
});
if (out.search.coNut) {
  await page.locator('button[aria-label*="Tìm kiếm" i], button[aria-label*="search" i]').first().click();
  await page.waitForTimeout(800);
  out.searchSauMo = await page.evaluate(() => {
    const inp = document.querySelector('input[type=search], input[placeholder*="tìm" i], input[placeholder*="Tìm" i]');
    return { coInput: !!inp, ph: inp?.getAttribute('placeholder') ?? null, cls: inp?.className ?? null };
  });
  if (out.searchSauMo.coInput) {
    const inp = page.locator('input[type=search], input[placeholder*="tìm" i], input[placeholder*="Tìm" i]').first();
    await inp.fill('spa');
    await page.waitForTimeout(900);
    out.ketQuaLower = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    await inp.fill('SPA');
    await page.waitForTimeout(900);
    out.ketQuaUpper = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    await inp.fill('zzzkhongcothat123');
    await page.waitForTimeout(900);
    out.ketQuaRong = await page.evaluate(() => document.body.innerText.slice(0, 1500));
    await inp.fill('');
    await page.waitForTimeout(900);
    out.ketQuaEmpty = await page.evaluate(() => document.body.innerText.slice(0, 1200));
  }
}

// --- Bang gia tinh ---
const priceInfo = await page.evaluate(() => {
  const tables = [...document.querySelectorAll('table')];
  return tables.map((t) => ({
    cls: t.className,
    head: [...t.querySelectorAll('thead th')].map((e) => e.textContent.trim()),
    rows: t.querySelectorAll('tbody tr').length,
    firstRow: [...(t.querySelector('tbody tr')?.querySelectorAll('th,td') ?? [])].map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
  }));
});
out.bangGia = priceInfo;

// --- Danh muc dich vu ---
out.danhMuc = await page.evaluate(() => {
  const svc = [...document.querySelectorAll('[class*="svc"], [class*="service"]')].slice(0, 40);
  return svc.map((e) => ({ cls: e.className, txt: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140) }));
});

// --- Nhom / tieu de nhom ---
out.nhom = await page.evaluate(() =>
  [...document.querySelectorAll('h2, h3, h4')].map((e) => ({ cls: e.className, txt: (e.textContent || '').replace(/\s+/g, ' ').trim() })).slice(0, 60),
);

// --- Form dat lich ---
out.form = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('input, textarea, select')];
  return {
    inputs: inputs.map((i) => ({ tag: i.tagName, type: i.type, name: i.name, ph: i.placeholder, min: i.min, max: i.max })),
    labels: [...document.querySelectorAll('label')].map((l) => (l.textContent || '').replace(/\s+/g, ' ').trim()).slice(0, 40),
  };
});

// --- Cac trang khac ---
for (const p of ['/', '/faq', '/chinh-sach', '/dich-vu', '/lien-he', '/so-sanh', '/tim-bem-thuong', '/bao-hanh', '/en/spa']) {
  const r = await page.goto('https://matpet.vn' + p, { waitUntil: 'domcontentloaded' }).catch((e) => ({ status: () => 'ERR ' + e }));
  out['trang_' + p] = { status: r?.status?.() ?? '?' };
  await page.waitForTimeout(300);
}

fs.writeFileSync('reports/raw/probe-t2-spec-dom.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
