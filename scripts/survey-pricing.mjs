import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Khảo sát bảng giá tham chiếu của 3 site đích (Ngày 2).
 * Chỉ đọc nội dung công khai, không gửi biểu mẫu (ADR-11).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const browser = await chromium.launch({ channel: 'chrome' });
const out = [];

for (const target of TARGETS) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(target.url, { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(3000);
    const tables = await page.evaluate(() => {
      return [...document.querySelectorAll('table')].map((t) => ({
        caption: t.querySelector('caption')?.textContent?.trim() ?? '',
        rows: [...t.querySelectorAll('tr')].map((r) =>
          [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
        ),
      }));
    });
    out.push({ id: target.id, url: target.url, tables });
    console.log(`\n===== ${target.id} — ${tables.length} bảng =====`);
    for (const [i, t] of tables.entries()) {
      console.log(`--- bảng ${i} (${t.rows.length} dòng) ---`);
      t.rows.forEach((r) => console.log(r.join(' || ')));
    }
    const text = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync(`reports/raw/survey-${target.id}-text.txt`, text, 'utf8');
  } catch (error) {
    console.log(`${target.id} LỖI: ${error.message}`);
  } finally {
    await context.close();
  }
}

fs.writeFileSync('reports/raw/survey-tables.json', JSON.stringify(out, null, 2), 'utf8');
await browser.close();
