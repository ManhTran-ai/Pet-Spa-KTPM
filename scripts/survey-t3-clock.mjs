import { chromium } from '@playwright/test';

/**
 * Thử override Date để mô phỏng ngoài giờ mở cửa của T3 (Ngày 12 — Ngân).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ timezoneId: 'America/New_York' });
const page = await context.newPage();

await page.addInitScript(() => {
  const goc = Date.now();
  const lech = new Date('2026-11-21T04:00:00Z').getTime() - goc;
  const RealDate = Date;
  class FakeDate extends RealDate {
    constructor(...args) {
      if (args.length === 0) super(RealDate.now() + lech);
      else super(...args);
    }
    static now() {
      return RealDate.now() + lech;
    }
  }
  // eslint-disable-next-line no-global-assign
  Date = FakeDate;
});

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

const doc = await page.evaluate(() => {
  const drawer = document.querySelector('.MuiDrawer-paper');
  const text = drawer ? drawer.innerText.replace(/\s+/g, ' ') : document.body.innerText.replace(/\s+/g, ' ');
  return {
    gioTrongTrinh: new Date().toString(),
    status: /\b(Open|Closed)\b/.exec(text)?.[0] ?? null,
    coNutBookNow: !!document.querySelector('.MuiDrawer-paper button'),
    dau: text.slice(0, 200),
  };
});
console.log(JSON.stringify(doc, null, 2));

const nut = page.getByRole('button', { name: 'Book Now' }).first();
console.log('Book Now visible:', await nut.isVisible().catch(() => false));
await nut.click();
await page.waitForTimeout(3000);
console.log('drawer sau khi bấm:', (await page.locator('.MuiDrawer-paper').innerText()).replace(/\s+/g, ' ').slice(0, 200));

await browser.close();
