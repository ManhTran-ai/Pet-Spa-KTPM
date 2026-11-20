import { chromium } from '@playwright/test';

/**
 * Mở nhóm dịch vụ T3 rồi đọc mô tả (detail) của từng dịch vụ (Ngày 12 — Ngân).
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(5000);

const nhom = await page.evaluate(() =>
  [...document.querySelectorAll('.MuiListItemText-primary')].map((e) => e.textContent.trim()),
);
for (const ten of nhom) {
  await page.getByText(ten, { exact: false }).first().click({ timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(900);
}

const data = await page.evaluate(() => {
  const items = [...document.querySelectorAll('.NameAndDesc-name')];
  const cls = new Set();
  const sample = [];
  for (const el of items.slice(0, 5)) {
    const parent = el.parentElement;
    sample.push(parent?.outerHTML?.slice(0, 900) ?? '');
  }
  for (const el of document.querySelectorAll('div,span,p')) {
    if (typeof el.className === 'string' && el.className && el.children.length === 0) {
      cls.add(el.className);
    }
  }
  return {
    sample,
    lopDichVu: [...cls].filter((c) => /name|desc|price|duration|item/i.test(c)),
    soTen: items.length,
  };
});

console.log(JSON.stringify(data, null, 2));
await browser.close();
