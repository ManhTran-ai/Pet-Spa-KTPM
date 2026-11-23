import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: nhap dia chi o buoc 4 "Tan nha" — phu thu di chuyen co duoc tinh khong? */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(900);

const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
await T.click();
await page.waitForTimeout(900);
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(300);
await T.click();
await page.waitForTimeout(900);
await T.click();
await page.waitForTimeout(1200);
await page.locator('.bk-loc', { hasText: 'Tận nhà' }).first().click();
await page.waitForTimeout(1000);

const oDiaChi = page.locator('.bk-modal input[placeholder*="Nguyễn Huệ"]').first();
await oDiaChi.fill('123 Nguyễn Huệ, Phường Bến Nghé, Quận 1');
await oDiaChi.press('Tab');
await page.waitForTimeout(4000);

const sau = await page.locator('.bk-modal').innerText();
console.log('--- SAU KHI NHẬP ĐỊA CHỈ (Q.1 — trong 5km) ---');
console.log(sau);

const ket = await page.locator('.bk-modal').innerText();
const lay = (re) => {
  const m = ket.match(re);
  return m ? m[0] : '(khong thay)';
};
console.log('\nTạm tính:', lay(/Tạm tính[\s\S]{0,60}/));
console.log('Phụ thu tận nhà:', lay(/\+ Phụ thu tận nhà[\s\S]{0,40}/));
console.log('Có "di chuyển" trong bước 4?', /di chuyển/i.test(ket));

// Thu o dia chi o xa hon
await oDiaChi.fill('Bình Chánh, Bình Dương');
await oDiaChi.press('Tab');
await page.waitForTimeout(5000);
const sau2 = await page.locator('.bk-modal').innerText();
console.log('\n--- SAU KHI NHẬP ĐỊA CHỈ (Bình Chánh) ---');
console.log(sau2.slice(sau2.indexOf('Địa điểm thực hiện')));

fs.writeFileSync('reports/raw/probe-t1-address.json', JSON.stringify({ sau, sau2 }, null, 2), 'utf8');
console.log('\n-> reports/raw/probe-t1-address.json');
await browser.close();
