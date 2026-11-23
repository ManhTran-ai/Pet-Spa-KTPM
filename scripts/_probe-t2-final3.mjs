import { chromium } from 'playwright';
import fs from 'node:fs';

const out = {};
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// T2 FAQ - noi dung cau hoi ve spa / dat lich
await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1500);
out.faqCauHoi = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('Câu hỏi thường gặp');
  const phan = t.slice(i, i + 4000);
  // tach cac muc cau hoi (bat dau bang ▶)
  const items = phan.split('▶').map((s) => s.trim()).filter((s) => s.length > 3);
  return items.map((s) => ({ q: s.split('\n')[0].slice(0, 120), co: s.replace(/\s+/g, ' ').slice(0, 400) }));
});

// Mo tat ca de xem noi dung tra loi
out.faqMoTat = await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')];
  return btns.length;
});
// click cac muc
for (let i = 0; i < 40; i++) {
  const b = page.locator('button:has-text("Mật Pet có dịch vụ Spa & Hotel cho bé không?")').first();
  if ((await b.count()) === 0) break;
  await b.click();
  await page.waitForTimeout(200);
  break;
}
out.faqSpaDoan = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('Dịch vụ Spa & Hotel');
  return i >= 0 ? t.slice(i, i + 700).replace(/\s+/g, ' ') : 'KHONG THAY';
});

// T2 trang spa - nhan "tai nha"?
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2000);
out.taiNha = await page.evaluate(() => {
  const t = document.body.innerText;
  return {
    coTaiNha: /tại nhà|tận nhà|home service|đến nhà/i.test(t),
    doan: (t.match(/.{0,100}(tại nhà|tận nhà|đến nhà).{0,100}/i) || [''])[0].replace(/\s+/g, ' '),
  };
});

// T2: trang /spa co bao nhac "chung ta se goi xac nhan khung gio"?
out.xacNhanKhungGio = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('GIỮ CHỖ');
  return i >= 0 ? t.slice(i, i + 600).replace(/\s+/g, ' ') : 'KHONG THAY';
});

// T2: mo ta thoi luong / bao gom trong danh muc?
out.danhMucText = await page.evaluate(() => {
  const t = document.body.innerText;
  const i = t.indexOf('Combo trọn gói');
  return i >= 0 ? t.slice(i - 200, i + 1500).replace(/\s+/g, ' ') : 'KHONG THAY';
});

fs.writeFileSync('reports/raw/probe-t2-final3.json', JSON.stringify(out, null, 2));
console.log('OK');
await browser.close();
