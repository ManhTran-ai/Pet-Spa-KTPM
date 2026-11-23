import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe nhanh: cau truc thanh buoc cua wizard T1 + trang thai nut "Tiep tuc" o moi buoc. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForSelector('.hm-svc', { timeout: 20_000 });
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 20_000 });
await page.waitForTimeout(1000);

const buoc = async (label) => {
  const stepEls = await page.locator('.bk-modal [class*=step], .bk-modal [class*=Step]').evaluateAll((els) =>
    els.map((e) => ({ tag: e.tagName, cls: e.className, text: (e.textContent || '').trim().slice(0, 60) })),
  );
  const nut = page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
  const nutDisabled = (await nut.count()) > 0 ? await nut.isDisabled() : null;
  const nutText = (await nut.count()) > 0 ? (await nut.innerText()).trim() : '';
  const svc = await page.locator('.bk-svc.is-on').count();
  const pet = await page.locator('.bk-pet.is-on').count();
  console.log(`\n=== ${label} ===`);
  console.log('  nutTiepTuc:', JSON.stringify(nutText), 'disabled=', nutDisabled);
  console.log('  bk-svc.is-on:', svc, ' bk-pet.is-on:', pet);
  console.log('  step els:', JSON.stringify(stepEls, null, 1).slice(0, 1200));
  return { stepEls, nutDisabled, nutText };
};

const buoc1 = await buoc('BUOC 1');
await page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' }).click();
await page.waitForTimeout(900);
const buoc2 = await buoc('BUOC 2');

// Bỏ qua chọn cân nặng: bỏ chọn bậc đang is-on, xem nút có bị khoá không.
await page.locator('.bk-pet.is-on').first().click();
await page.waitForTimeout(600);
const buoc2b = await buoc('BUOC 2 (bo chon bac nang)');

fs.writeFileSync(
  'reports/raw/probe-t1-steps.json',
  JSON.stringify({ buoc1, buoc2, buoc2b }, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/probe-t1-steps.json');

await browser.close();
