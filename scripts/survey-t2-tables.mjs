import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Khảo sát bảng giá tham chiếu của T2 cho cả Chó và Mèo (Ngày 2).
 * T2 có bảng "Xem bảng giá" riêng biệt với bộ chuyển Chó/Mèo.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext();
const page = await context.newPage();
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3500);

// Mở phần "Xem bảng giá" nếu đang ở trạng thái gập.
for (const label of [/Xem bảng giá/i, /bảng giá/i]) {
  try {
    const link = page.getByText(label).first();
    if (await link.isVisible({ timeout: 3000 })) {
      await link.click();
      await page.waitForTimeout(2000);
      break;
    }
  } catch {
    /* thử nhãn kế tiếp */
  }
}
await page.waitForTimeout(2000);

const tables = await page.evaluate(() =>
  [...document.querySelectorAll('table')].map((t) => ({
    rows: [...t.querySelectorAll('tr')].map((r) =>
      [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
    ),
  })),
);

for (const pet of ['Chó', 'Mèo']) {
  try {
    const btn = page.getByRole('button', { name: pet, exact: true });
    if (await btn.first().isVisible({ timeout: 3000 })) {
      await btn.first().click();
      await page.waitForTimeout(2000);
    }
  } catch {
    console.log(`không bấm được nút ${pet}`);
  }
  console.log(`\n===== T2 — bảng giá ${pet} =====`);
  const snapshot = await page.evaluate(() =>
    [...document.querySelectorAll('table')].map((t) =>
      [...t.querySelectorAll('tr')].map((r) =>
        [...r.querySelectorAll('th,td')].map((c) => c.textContent.replace(/\s+/g, ' ').trim()),
      ),
    ),
  );
  snapshot.forEach((t, i) => {
    console.log(`--- bảng ${i} ---`);
    t.forEach((r) => console.log(r.join(' || ')));
  });
  fs.writeFileSync(`reports/raw/survey-T2-table-${pet}.json`, JSON.stringify(snapshot, null, 2), 'utf8');
}

console.log('\n=== bảng lúc đầu ===');
tables.forEach((t, i) => {
  console.log(`--- bảng ${i} ---`);
  t.rows.forEach((r) => console.log(r.join(' || ')));
});

await browser.close();
