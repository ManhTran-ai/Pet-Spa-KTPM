import { chromium } from '@playwright/test';

/**
 * Khảo sát hợp đồng dữ liệu T2: API search + calculator ↔ bảng giá tĩnh.
 * Ngày 10 — Ngân (TV3). ADR-11: chỉ đọc, không POST đặt lịch.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

const requests = [];
page.on('request', (r) => requests.push({ method: r.method(), url: r.url() }));
page.on('response', (r) => requests.push({ method: '->' + r.status(), url: r.url() }));

await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(4000);

console.log('=== REQUESTS ===');
for (const r of requests) console.log(r.method, r.url.slice(0, 140));

// Mở tìm kiếm và gọi API search
await page.getByRole('button', { name: 'Tìm kiếm' }).last().click();
const o = page.locator('input[aria-label="Tìm kiếm"]');
await o.waitFor({ state: 'visible' });
await o.fill('spa');
await page.waitForTimeout(2000);

const ketQua = await page.evaluate(() => {
  const panel = document.querySelector('[class*="search"]');
  return {
    panelCls: panel?.className ?? null,
    html: panel?.outerHTML.slice(0, 1500) ?? null,
    headings: Array.from(document.querySelectorAll('h3, h4')).map((e) => e.textContent?.trim()).filter(Boolean).slice(0, 15),
  };
});
console.log('\n=== KET QUA TIM KIEM ===');
console.log(JSON.stringify(ketQua, null, 1));

await browser.close();
