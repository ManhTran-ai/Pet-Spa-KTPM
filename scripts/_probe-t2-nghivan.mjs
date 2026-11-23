import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: hanh vi thuc te cua calculator T2 (M2, M4, M5). */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();
const ketQua = {};

await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);

// (1) M4-013: nut "Tiep tuc" bi vo hieu hoa chua?
const next = page.getByRole('button', { name: 'Tiếp tục →' });
ketQua.M4_013 = {};
ketQua.M4_013.nextDisabledDau = await next.isDisabled();
ketQua.M4_013.railLinesDau = await page.locator('.rail-lines').innerText().catch(() => null);

// (2) M2-005/006: danh muc dich vu — dem va nhan "bao gia rieng"
const svcAll = await page.locator('.svc').evaluateAll((els) =>
  els.map((e) => ({
    cls: e.className,
    text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
  })),
);
ketQua.M2 = { soSvc: svcAll.length, svc: svcAll };

// (3) Bang gia tinh — so bang, dong
const tables = await page.locator('table').evaluateAll((els) =>
  els.map((t) => ({
    rows: t.querySelectorAll('tbody tr').length,
    head: Array.from(t.querySelectorAll('thead th')).map((h) => (h.textContent || '').replace(/\s+/g, ' ').trim()),
    firstRows: Array.from(t.querySelectorAll('tbody tr')).slice(0, 3).map((r) =>
      Array.from(r.querySelectorAll('th,td')).map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim()),
    ),
  })),
);
ketQua.tables = tables;

// (4) M5-004/005: chinh sach huy / hoan coc — tim trang
const links = await page.locator('a').evaluateAll((els) =>
  els.map((a) => ({ text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60), href: a.getAttribute('href') })).filter((l) => l.text),
);
ketQua.links = links;

// Tim trong FAQ co noi dung ve huy lich / hoan coc
const faqText = await page.locator('body').innerText();
ketQua.coHuyLich = /hủy lịch|hủy|huỷ|hoàn cọc|hoàn tiền|đổi lịch|chính sách hủy/i.test(faqText);

fs.writeFileSync('reports/raw/probe-t2-nghivan.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1));
await browser.close();
