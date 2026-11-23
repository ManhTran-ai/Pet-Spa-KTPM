import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);

// 1) Bang gia tren trang chu
out.bangGia = await page.evaluate(() => {
  const tables = [...document.querySelectorAll('table')];
  return tables.map((t) => ({
    cls: t.className,
    id: t.id,
    head: [...t.querySelectorAll('thead th')].map((e) => e.textContent.replace(/\s+/g, ' ').trim()),
    soDong: t.querySelectorAll('tbody tr').length,
    hang: [...t.querySelectorAll('tbody tr')].slice(0, 20).map((r) => [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim())),
  }));
});

// 2) The dich vu: co khoang min-max tren the?
out.theDichVu = await page.evaluate(() => {
  const cards = [...document.querySelectorAll('.hm-svc')];
  return cards.map((c) => ({
    ten: (c.querySelector('b')?.textContent || '').trim(),
    gia: (c.querySelector('[class*=price], .hm-svc__price')?.textContent || '').replace(/\s+/g, ' ').trim(),
    coKhoang: /\d{1,3}\.\d{3}₫\s*[–-]\s*\d{1,3}\.\d{3}₫/.test(c.textContent || ''),
    full: (c.textContent || '').replace(/\s+/g, ' ').trim(),
  }));
});

// 3) Co bao "Phu thu tan nha" + so tien?
out.nhanPhuThu = await page.evaluate(() => {
  const t = document.body.innerText;
  const m = t.match(/Phụ thu tận nhà:[^\n]*/g) || [];
  return m;
});

// 4) Xac nhan gia cuoi + tu dau gia
out.xacNhanGia = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coXacNhanSpa: /xác nhận tại spa/i.test(t),
    doan: (t.match(/.{0,100}(xác nhận tại spa|giá cuối cùng).{0,150}/i) || [''])[0].replace(/\s+/g, ' '),
  };
});

// 5) FAQ accordion - mo 2 muc dong thoi?
const q = page.locator('.hm-faq__q');
await q.nth(2).click();
await page.waitForTimeout(300);
await q.nth(3).click();
await page.waitForTimeout(300);
out.faqAccordion = await page.evaluate(() => {
  const qs = [...document.querySelectorAll('.hm-faq__q')];
  return qs.map((e) => ({
    txt: (e.querySelector('span')?.textContent || '').trim().slice(0, 50),
    icon: (e.querySelector('.material-symbols-outlined')?.textContent || '').trim(),
  }));
});

fs.writeFileSync('reports/raw/probe-t1-catalogue2.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
