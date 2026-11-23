import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** T1 wizard — buoc 2 sau khi bam "Tiep tuc". */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const apiCalls = [];
page.on('request', (r) => {
  const t = r.resourceType();
  if (t === 'xhr' || t === 'fetch') apiCalls.push({ method: r.method(), url: r.url(), postData: r.postData() });
});

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /Đặt lịch/i }).first().click();
await page.waitForTimeout(1200);
await page.locator('.bk-svc', { hasText: 'Combo Tắm + Vệ sinh' }).first().click();
await page.waitForTimeout(600);

const next = page.locator('.bk-foot button', { hasText: /Tiếp tục/i });
console.log('next text:', await next.first().innerText().catch(() => 'n/a'));
await next.first().click();
await page.waitForTimeout(1200);

const dom = await page.evaluate(() => {
  const root = document.querySelector('.bk-body') || document.body;
  return {
    active: document.querySelector('.bk-step.is-active .bk-step__label')?.textContent?.trim() ?? null,
    html: root.innerHTML.slice(0, 14000),
    summary: [...document.querySelectorAll('.bk-summary__row')].map((r) => (r.textContent || '').replace(/\s+/g, ' ').trim()),
  };
});
console.log('ACTIVE:', dom.active);
console.log('SUMMARY:', JSON.stringify(dom.summary));
fs.writeFileSync('reports/raw/t1-wizard-dom.json', JSON.stringify({ ...dom, apiCalls }, null, 2), 'utf8');
console.log('\nHTML:\n', dom.html.slice(0, 9000));
await browser.close();
