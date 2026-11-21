import { chromium } from '@playwright/test';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(3000);

await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.getByRole('button', { name: '>6–10kg', exact: true }).click();
await page.waitForTimeout(500);

const truoc = await page.evaluate(() => ({
  chipSel: document.querySelector('.chip.sel')?.textContent?.trim() ?? null,
  petSel: document.querySelector('.pet-opt.sel')?.textContent?.trim() ?? null,
  stepActive: document.querySelector('.st.active')?.textContent?.trim() ?? null,
  storage: {
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  },
  cookie: document.cookie,
}));

await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(3000);

const sau = await page.evaluate(() => ({
  chipSel: document.querySelector('.chip.sel')?.textContent?.trim() ?? null,
  petSel: document.querySelector('.pet-opt.sel')?.textContent?.trim() ?? null,
  stepActive: document.querySelector('.st.active')?.textContent?.trim() ?? null,
  stepDone: [...document.querySelectorAll('.st.done')].map((e) => e.textContent?.trim()),
  chipCount: document.querySelectorAll('.chip').length,
  railEmpty: document.querySelector('.rail-empty')?.textContent?.trim() ?? null,
  storage: {
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
  },
}));

console.log('TRUOC:', JSON.stringify(truoc, null, 1));
console.log('SAU:', JSON.stringify(sau, null, 1));

await browser.close();
