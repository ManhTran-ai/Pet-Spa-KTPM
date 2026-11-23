import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Xác minh lại FR-M4-04 của T1 sau khi SRS v1.2 sửa tiêu chí chấp nhận
 * (Inspection RV-06, 18/11): "7 ngày cố định + 8 khung giờ 08:30–17:00,
 * ngày trong quá khứ không chọn được".
 *
 * Mục tiêu: quyết định DEF-023 còn hiệu lực hay đã lỗi thời.
 */

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN', viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

await page.goto('https://petngon.vn/vi', { waitUntil: 'load' });
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /Đặt lịch/i }).first().click();
await page.waitForTimeout(1200);
await page.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
await page.waitForTimeout(400);
await page.locator('.bk-foot button', { hasText: /Tiếp tục/i }).first().click();
await page.waitForTimeout(800);
await page.locator('.bk-pet-grid:not(.bk-pet-grid--2) .bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await page.locator('.bk-input[placeholder*="Bông"]').fill('Test');
await page.waitForTimeout(300);
await page.locator('.bk-foot button', { hasText: /Tiếp tục/i }).first().click();
await page.waitForTimeout(1200);

const days = await page.locator('.bk-day').evaluateAll((els) =>
  els.map((e) => ({
    txt: (e.textContent || '').replace(/\s+/g, ' ').trim(),
    disabled: e.disabled,
    cls: (e.className || '').toString(),
    ariaDisabled: e.getAttribute('aria-disabled'),
  })),
);
const times = await page.locator('.bk-time').evaluateAll((els) =>
  els.map((e) => ({ txt: (e.textContent || '').trim(), disabled: e.disabled })),
);

const homNay = new Date();
const ketQua = {
  kiemTraLuc: new Date().toISOString(),
  homNay: homNay.toISOString().slice(0, 10),
  soNgay: days.length,
  ngay: days,
  soKhoiGio: times.length,
  khoiGio: times,
  coInputDate: await page.locator('input[type="date"]').count(),
  coChonNgayTuDo: days.every((d) => !d.disabled),
};

console.log('Số ngày:', ketQua.soNgay, '| Số khung giờ:', ketQua.soKhoiGio);
console.log('có input[type=date]:', ketQua.coInputDate);
console.log('Ngày:', JSON.stringify(days, null, 1));
console.log('Giờ:', JSON.stringify(times));
console.log('Tất cả ngày đều chọn được?', ketQua.coChonNgayTuDo);

fs.writeFileSync('reports/raw/t1-m4-004-date-step.json', JSON.stringify(ketQua, null, 2), 'utf8');
await browser.close();
