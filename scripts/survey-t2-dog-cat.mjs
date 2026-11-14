import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Đối chiếu giá tính tức thì của T2 giữa Chó và Mèo ở cùng bậc cân nặng (FR-M3-02).
 * Ngày 2 — dữ liệu tham chiếu.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();

const results = [];

async function giaTheoLoai(loai, band, service) {
  await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(2500);
  const next = page.getByRole('button', { name: 'Tiếp tục →' });

  const chonLoai = page.getByRole('button', { name: loai === 'Chó' ? /🐶 Chó/ : /🐱 Mèo/, exact: false }).first();
  await chonLoai.click();
  for (let i = 0; i < 3 && !(await next.isEnabled()); i += 1) {
    await chonLoai.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  await next.click();

  const chonBand = page.getByRole('button', { name: band, exact: true }).first();
  await chonBand.click();
  for (let i = 0; i < 3 && !(await next.isEnabled()); i += 1) {
    await chonBand.click().catch(() => {});
    await page.waitForTimeout(300);
  }
  await next.click();

  await page.getByRole('button', { name: new RegExp(service.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().click();
  await page.waitForTimeout(1200);

  const price = await page.locator('.rail-price').first().innerText();
  const lines = await page.locator('.rail-lines').first().innerText();
  return { price: price.trim(), lines: lines.replace(/\s+/g, ' ').trim() };
}

for (const band of ['>3–6kg', '>6–10kg']) {
  for (const loai of ['Chó', 'Mèo']) {
    try {
      const r = await giaTheoLoai(loai, band, 'Combo Tắm Vệ Sinh');
      results.push({ band, loai, ...r });
      console.log(`${loai} ${band} Combo Tắm Vệ Sinh -> ${r.price} | ${r.lines}`);
    } catch (e) {
      console.log(`${loai} ${band} LỖI: ${e.message.split('\n')[0]}`);
    }
  }
}

fs.writeFileSync('reports/raw/survey-T2-dog-vs-cat.json', JSON.stringify(results, null, 2), 'utf8');
await browser.close();
