import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe tổng hợp: wizard T1 (ngày/khung giờ/bước địa điểm), quy trình, T2 quy trình + hủy/đổi. */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();
const K = {};

/* ---------------- T1 ---------------- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1500);

// Quy trình 4 bước + mô tả xác nhận 5 phút qua Zalo.
K.t1_quyTrinh = await page.evaluate(() => {
  const t = document.body.innerText.replace(/\n{2,}/g, '\n');
  const i = t.indexOf('QUY TRÌNH');
  return {
    doan: i >= 0 ? t.slice(i, i + 1600) : '',
    co4Buoc: /4 bước/.test(t),
    co5PhutZalo: /5 phút/.test(t) && /Zalo/i.test(t),
    coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(t),
    coDoiLich: /đổi.*lịch|huỷ.*lịch|hủy.*lịch/i.test(t),
  };
});

// Mở wizard, đi tới bước 3 (Lịch hẹn) và bước 4 (Địa điểm).
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal', { timeout: 15_000 });
const modal = page.locator('.bk-modal');

await modal.locator('.bk-svc', { hasText: 'Tắm' }).first().click();
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(700);

const buoc2 = {
  soLoai: await modal.locator('.bk-pet').count(),
  coInputTen: await modal.locator('.bk-input').count(),
  nutTiepTucDisabled: await modal.getByRole('button', { name: /Tiếp tục/ }).isDisabled(),
};
K.t1_buoc2 = buoc2;

// Chọn bậc cân nặng + tên + số điện thoại rồi sang bước 3.
await modal.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
await page.waitForTimeout(400);
K.t1_buoc2_nutSauChon = await modal.getByRole('button', { name: /Tiếp tục/ }).isDisabled();

await modal.locator('.bk-input').first().fill('Bé Test');
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(1200);

K.t1_buoc3 = {
  tieuDeBuoc: (await modal.locator('.bk-steps').innerText()).replace(/\n/g, ' '),
  soNgay: await modal.locator('.bk-day').count(),
  ngay: await modal.locator('.bk-day').allInnerTexts(),
  soKhungGio: await modal.locator('.bk-time').count(),
  khungGio: await modal.locator('.bk-time').allInnerTexts(),
  coInputDate: await modal.locator('input[type=date]').count(),
};

// Chọn khung giờ rồi sang bước 4.
if ((await modal.locator('.bk-time').count()) > 0) {
  await modal.locator('.bk-time').first().click();
  await page.waitForTimeout(400);
}
await modal.getByRole('button', { name: /Tiếp tục/ }).click();
await page.waitForTimeout(1000);

K.t1_buoc4 = {
  tieuDeBuoc: (await modal.locator('.bk-steps').innerText()).replace(/\n/g, ' '),
  text: (await modal.innerText()).replace(/\n{2,}/g, '\n').slice(0, 1200),
  coLuaChonDiaDiem: /Tại spa/i.test(await modal.innerText()) && /Tận nhà/i.test(await modal.innerText()),
};

// Kiểm tra bước địa điểm nằm ở bước mấy (FR-M6-01 nói "bước 3").
K.t1_buoc4_soBuoc = await modal.locator('.bk-step.is-active .bk-step__num').innerText();

/* ---------------- T2 ---------------- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(1800);

const trangT2 = await page.evaluate(() => document.body.innerText.replace(/\n{2,}/g, '\n'));
K.t2 = {
  coQuyTrinh4Buoc: /4 bước|QUY TRÌNH/i.test(trangT2),
  doanQuyTrinh: (() => {
    const i = trangT2.search(/QUY TRÌNH|quy trình/i);
    return i >= 0 ? trangT2.slice(i, i + 1200) : '';
  })(),
  coGoiXacNhan: /gọi xác nhận|xác nhận khung giờ/i.test(trangT2),
  coHuyDoi: /huỷ|hủy|hủy|đổi lịch|chính sách/i.test(trangT2),
  coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(trangT2),
  coNenDatLich: /2–4 giờ|2-4 giờ|trước ít nhất/i.test(trangT2),
};

// Duyệt FAQ các trang công khai T2 tìm chính sách hủy/đổi/hoàn cọc spa.
const trangT2Faq = ['/spa', '/faq', '/chinh-sach', '/dich-vu', '/ve-mat-pet', '/lien-he'];
const ketQuaFaq = [];
for (const duong of trangT2Faq) {
  const resp = await page.goto(`https://matpet.vn${duong}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  if (!resp) continue;
  await page.waitForTimeout(800);
  const txt = await page.locator('body').innerText();
  ketQuaFaq.push({
    duong,
    status: resp.status(),
    coHuy: /huỷ|hủy|hủy/i.test(txt),
    coDoiLich: /đổi lịch|đổi.*lịch/i.test(txt),
    coHoanCoc: /hoàn cọc|hoàn tiền|refund/i.test(txt),
    doanLienQuan: (() => {
      const i = txt.search(/huỷ|hủy|hủy|hoàn cọc|refund/i);
      return i >= 0 ? txt.slice(Math.max(0, i - 200), i + 700) : '';
    })(),
  });
}
K.t2_trangFaq = ketQuaFaq;

fs.writeFileSync('reports/raw/probe-final-facts.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 12000));
await browser.close();
