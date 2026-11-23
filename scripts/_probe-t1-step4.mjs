import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: buoc 4 "Dia diem" cua wizard T1 + phu thu di chuyen. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(900);

const T = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });

// Buoc 1 -> 2
await T.click();
await page.waitForTimeout(900);
console.log('BUOC2 nut disabled =', await T.isDisabled());
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(400);
console.log('BUOC2 nut disabled sau khi nhap ten =', await T.isDisabled());

// Bo chon bac nang (bam lai chon dang active) -> xem nut co bi khoa khong
const activeBefore = await page.locator('.bk-pet.is-on').first().innerText();
console.log('bac dang active:', activeBefore);
// Chon bac khac -> phai co 1 active
await page.locator('.bk-pet', { hasText: 'Chó mini' }).first().click();
await page.waitForTimeout(400);
console.log('so bk-pet.is-on sau khi chon bac khac =', await page.locator('.bk-pet.is-on').count());

// Buoc 3
await T.click();
await page.waitForTimeout(900);
console.log('--- BUOC 3 (Lich hen) ---');
console.log('so .bk-day =', await page.locator('.bk-day').count());
console.log('so .bk-time =', await page.locator('.bk-time').count());
console.log('nut disabled =', await T.isDisabled());

// Buoc 4
await T.click();
await page.waitForTimeout(1200);
const buoc4 = await page.locator('.bk-modal').innerText();
console.log('\n--- BUOC 4 ---');
console.log(buoc4);
const btns = await page.locator('.bk-modal button, .bk-modal [role=button]').evaluateAll((els) =>
  els.map((e) => ({ cls: e.className, text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90) })),
);
console.log('\nBUTTONS:', JSON.stringify(btns, null, 1));

fs.writeFileSync('reports/raw/probe-t1-step4.json', JSON.stringify({ buoc4, btns }, null, 2), 'utf8');
await browser.close();
