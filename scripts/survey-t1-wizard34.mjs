import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Do buoc 3 (Lich hen) cua wizard T1. Chi doc — KHONG bam nut gui (ADR-11).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);
await page.locator('.ga-booking-btn').first().click();
await page.waitForTimeout(1200);

const dump = async (nhan) => {
  const fields = await page.locator('.bk-modal button, .bk-modal input, .bk-modal select, .bk-modal textarea, .bk-modal label, .bk-modal [class*=opt]').evaluateAll((els) =>
    els
      .map((e) => ({
        tag: e.tagName,
        type: e.getAttribute('type') || '',
        cls: e.className,
        ph: e.getAttribute('placeholder') || '',
        text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
        visible: !!(e.offsetWidth || e.offsetHeight),
      }))
      .filter((f) => f.visible && (f.text || ['INPUT', 'SELECT', 'TEXTAREA'].includes(f.tag))),
  );
  console.log(`\n===== ${nhan} =====`);
  fields.forEach((f) => console.log(`${f.tag}[${f.type}] "${f.text}" ph="${f.ph}" cls="${String(f.cls).slice(0, 55)}"`));
  return fields;
};

await page.locator('.bk-svc', { hasText: 'Combo Tắm + Vệ sinh' }).click();
await page.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(700);
await page.locator('.bk-pet', { hasText: 'Chó vừa' }).click();
await page.waitForTimeout(400);

const buoc2 = await dump('BUOC 2 - BE CUNG (co placeholder)');

// Dien ten be va so dien thoai neu co
for (const inp of await page.locator('.bk-modal input, .bk-modal textarea').all()) {
  const ph = (await inp.getAttribute('placeholder')) ?? '';
  if (/tên|name/i.test(ph) || inp.evaluate((e) => e.tagName === 'TEXTAREA')) {
    await inp.fill('Bé Test').catch(() => {});
  } else if (/sđt|điện thoại|phone/i.test(ph)) {
    await inp.fill('0900000000').catch(() => {});
  }
}
await page.waitForTimeout(500);
const next = page.getByRole('button', { name: /Tiếp tục/ });
console.log('\nnext enabled sau khi nhap:', await next.isEnabled());
await next.click().catch((e) => console.log('LOI click next:', e.message.split('\n')[0]));
await page.waitForTimeout(1000);

const buoc3 = await dump('BUOC 3 - LICH HEN');

fs.writeFileSync(
  'reports/raw/survey-T1-wizard-3.json',
  JSON.stringify({ buoc2, buoc3 }, null, 2),
  'utf8',
);
await browser.close();
