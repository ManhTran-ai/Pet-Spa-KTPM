import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe: T1 footer link "Đổi/huỷ lịch", contact page đầy đủ, T2 spa page chi tiết. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

/* T1 contact */
await page.goto('https://petngon.vn/vi/contact', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
K.t1_contact = await page.evaluate(() => {
  const t = document.body.innerText.replace(/\n{2,}/g, '\n');
  return {
    coDiaChi: /1\.09\s*block A1/i.test(t),
    coDienThoai: /\+84|\b0\d{3}\s?\d{3}\s?\d{3}\b|\(\+84\)/.test(t),
    coEmail: /[\w.+-]+@[\w-]+\.[\w.]+/.test(t),
    doanGio: (() => {
      const i = t.search(/GIỜ LÀM VIỆC|mở cửa|giờ làm việc/i);
      return i >= 0 ? t.slice(i, i + 300) : '';
    })(),
    linksFooter: [...document.querySelectorAll('footer a[href]')].map((a) => ({
      href: a.getAttribute('href'),
      text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
    })),
  };
});

/* T1: bam footer link "Đổi/huỷ lịch" */
const linkHuy = page.locator('footer a').filter({ hasText: /huỷ|hủy|hủy|Đổi/i }).first();
if (await linkHuy.count()) {
  await linkHuy.click();
  await page.waitForTimeout(1500);
  K.t1_trangHuy = {
    url: page.url(),
    text: (await page.locator('body').innerText()).replace(/\n{2,}/g, '\n').slice(0, 2500),
  };
}

/* T1: nen dat lich / quy trinh tren /vi */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
const t1 = await page.locator('body').innerText();
K.t1_trangChu = {
  coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(t1),
  doanHuy: (() => {
    const i = t1.search(/huỷ|hủy|hủy/i);
    return i >= 0 ? t1.slice(Math.max(0, i - 300), i + 600) : '';
  })(),
};

/* T2 spa day du */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1800);
const t2 = await page.locator('body').innerText();
K.t2_spa = {
  doanGoiXacNhan: (() => {
    const i = t2.search(/gọi xác nhận|xác nhận khung giờ/i);
    return i >= 0 ? t2.slice(Math.max(0, i - 300), i + 500) : '';
  })(),
  coQuyTrinh: /quy trình/i.test(t2),
  doanQuyTrinh: (() => {
    const i = t2.search(/quy trình/i);
    return i >= 0 ? t2.slice(i, i + 900) : '';
  })(),
  coBuoc: /\b4\s*bước|\b3\s*bước|\b5\s*bước/i.test(t2),
  coHuy: /huỷ|hủy|hủy/i.test(t2),
  coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(t2),
  coNenDat: /2\s*[–\-]\s*4 giờ|trước ít nhất/i.test(t2),
  doanDau: t2.slice(0, 1200),
};

/* T2 /cau-hoi-thuong-gap */
await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1200);
const t2faq = await page.locator('body').innerText();
K.t2_faq = {
  chuoiHoi: t2faq.split('\n').filter((l) => l.trim().length > 12).slice(0, 40),
  coHuy: /huỷ|hủy|hủy/i.test(t2faq),
  coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(t2faq),
  doanHuy: (() => {
    const i = t2faq.search(/huỷ|hủy|hủy|hoàn cọc|refund/i);
    return i >= 0 ? t2faq.slice(Math.max(0, i - 300), i + 800) : '';
  })(),
};

/* T2 /showroom gio mo cua */
await page.goto('https://matpet.vn/showroom', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1000);
const t2sr = await page.locator('body').innerText();
K.t2_showroom = {
  doanGio: (() => {
    const i = t2sr.search(/mở cửa|giờ làm việc|hoạt động/i);
    return i >= 0 ? t2sr.slice(Math.max(0, i - 200), i + 400) : '';
  })(),
};

fs.writeFileSync('reports/raw/probe-contact-policy.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 16000));
await browser.close();
