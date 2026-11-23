import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Probe tong hop T1: FAQ noi dung, gio mo cua, accordion, wizard buoc 3/4,
 * khung gio (8 khung 08:30-17:00), 7 ngay, i18n EN, phu thu tai nha.
 * ADR-11: chi doc, khong bam nut gui.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();
const ketQua = {};

/* ---------- 1. Gio mo cua / lien he ---------- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
const body = await page.locator('body').innerText();
ketQua.lienHe = {
  coDiaChi: /1\.09 block A1/i.test(body),
  coDienThoai: /\(\+84\) 325 305 143/.test(body),
  coEmail: /hello@petngon\.vn/.test(body),
  coGioMoCua: /\d{1,2}[:h]\d{0,2}\s*[–\-]\s*\d{1,2}[:h]\d{0,2}/.test(body),
  cacKhoangGio: [...body.matchAll(/\d{1,2}\s*[:h]\s*\d{0,2}\s*[–\-]\s*\d{1,2}\s*[:h]\s*\d{0,2}/g)].map((m) => m[0]),
  coTuKhoaMoCua: /mở cửa|mở cửa|giờ mở/i.test(body),
};
ketQua.lienHe.dongChuoiGioMoCua = body.match(/[^\n]*mở cửa[^\n]*/gi)?.slice(0, 5) ?? [];

/* ---------- 2. FAQ noi dung ---------- */
const faqItems = await page.locator('[class*=faq] button, .faq-item, [class*=accordion] button').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
ketQua.faq = { soMuc: faqItems.length, tieuDe: faqItems };

// Mo het cac muc de lay noi dung
const faqContainer = page.locator('[class*=faq], .faq, section:has(h2:has-text("CÂU HỎI"))').first();
const noiDungFaq = [];
const buttons = page.locator('button:has-text("Có thể đổi"), button:has-text("Phụ thu tại nhà"), button:has-text("Dịch vụ nào có thể")');
for (let i = 0; i < (await buttons.count()); i += 1) {
  await buttons.nth(i).click();
  await page.waitForTimeout(400);
  noiDungFaq.push(await faqContainer.innerText().catch(() => ''));
}
ketQua.faq.noiDung = noiDungFaq;
fs.writeFileSync('reports/raw/probe-t1-faq.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua.faq, null, 1).slice(0, 4000));

await browser.close();
