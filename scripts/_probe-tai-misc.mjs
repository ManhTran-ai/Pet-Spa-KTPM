import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe tong hop cac diem con mo: nav T2, gio mo cua, i18n EN, 404, 360px, quy trinh. */
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ locale: 'vi-VN' });
const page = await ctx.newPage();
const K = {};

/* ---------- T2: nav links ---------- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);
K.t2_nav = await page.locator('header a[href], nav a[href]').evaluateAll((els) =>
  els.map((a) => ({ href: a.getAttribute('href'), text: (a.textContent || '').replace(/\s+/g, ' ').trim() })).filter((x) => x.text),
);

/* ---------- T2: gio mo cua / lien he ---------- */
const b = await page.locator('body').innerText();
K.t2_lienHe = {
  diaChi: /Tân Bình|Quận Tân Bình|Chi nhánh/i.test(b),
  sdt: /\b0\d{3}\.?\d{2}\.?\d{2}\.?\d{2}\b|\+84/.test(b),
  email: /[\w.+-]+@[\w-]+\.[\w.]+/.test(b),
  gio: /\d{1,2}\s*[:h]\s*\d{0,2}\s*[–\-–~]\s*\d{1,2}\s*[:h]\s*\d{0,2}/.test(b),
  dongGio: b.split('\n').filter((l) => /mở cửa|mở cửa|8:00|08:00|22:00|9:00|21:00/i.test(l)).slice(0, 8),
  emailCua: b.match(/[\w.+-]+@[\w-]+\.[\w.]+/g)?.slice(0, 3) ?? [],
  sdtCua: b.match(/(?:\+84|0)\d[\d.\s]{7,13}/g)?.slice(0, 3) ?? [],
};

/* ---------- T2: 404 ---------- */
const r404 = await page.goto('https://matpet.vn/khong-ton-tai-xyz', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
K.t2_404 = {
  status: r404?.status() ?? 0,
  body: (await page.locator('body').innerText()).split('\n').filter((l) => l.trim()).slice(0, 10),
  coStack: /at\s+\w+\s+\(|Error:\s|\.js:\d+:\d+|Traceback/i.test(await page.locator('body').innerText()),
};

/* ---------- T2: 360px ---------- */
await page.setViewportSize({ width: 360, height: 740 });
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2000);
K.t2_360 = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
await page.setViewportSize({ width: 1280, height: 720 });

/* ---------- T2: quy trinh + xac nhan + 2-4 gio ---------- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
await page.waitForTimeout(2000);
const spa = await page.locator('body').innerText();
K.t2_quyTrinh = {
  co4Buoc: /4 bước|4 bước|quy trình/i.test(spa),
  cacBuoc: spa.split('\n').filter((l) => /tiếp nhận|kiểm tra|grooming|bàn giao|quy trình|bước/i.test(l)).slice(0, 12),
  xacNhan: spa.split('\n').filter((l) => /gọi xác nhận|xác nhận|phút|giờ/i.test(l)).slice(0, 10),
  haiDenBonGio: /2\s*[-–~]\s*4 giờ|trước \d+ giờ|2-4 giờ|ít nhất \d+ giờ/i.test(spa),
  dongHaiBonGio: spa.split('\n').filter((l) => /2\s*[-–~]\s*4|giờ trước|đặt trước/i.test(l)).slice(0, 8),
};

/* ---------- T2: i18n EN ---------- */
const nutEN = page.locator('a:has-text("EN"), button:has-text("EN"), [hreflang="en"], a[href$="/en"]');
K.t2_en = {
  soNut: await nutEN.count(),
  href: await nutEN.evaluateAll((els) => els.map((e) => e.getAttribute('href') ?? e.textContent?.trim())),
};
if ((await nutEN.count()) > 0) {
  await nutEN.first().click();
  await page.waitForTimeout(2000);
  K.t2_en.url = page.url();
  K.t2_en.tieuDe = await page.title();
  const en = await page.locator('body').innerText();
  K.t2_en.viConLai = en.split('\n').filter((l) => /Đặt lịch|Dịch vụ|Trang chủ|Liên hệ|chọn loài|cân nặng|Tiếp tục|Quay lại/i.test(l)).slice(0, 12);
  K.t2_en.anh = en.split('\n').filter((l) => /book|service|home|contact|choose|weight|continue/i.test(l)).slice(0, 12);
}

/* ---------- T1: i18n EN ---------- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load' });
await page.waitForTimeout(1500);
const nutEN1 = page.locator('button:has-text("EN"), a[href*="/en"], [hreflang="en"]');
K.t1_en = { soNut: await nutEN1.count() };
if ((await nutEN1.count()) > 0) {
  await nutEN1.first().click();
  await page.waitForTimeout(2500);
  K.t1_en.url = page.url();
  K.t1_en.tieuDe = await page.title();
  const en = await page.locator('body').innerText();
  K.t1_en.viConLai = en.split('\n').filter((l) => /Đặt lịch|Dịch vụ|Trang chủ|Liên hệ|Bé cưng|Lịch hẹn|Địa điểm|Tiếp tục|Quay lại|Tắm|Cạo/i.test(l)).slice(0, 15);
  K.t1_en.anh = en.split('\n').filter((l) => /book|service|home|contact|pet|appointment|location|continue|back|bath|shave/i.test(l)).slice(0, 15);
}

/* ---------- T1: quy trinh 4 buoc + 5 phut Zalo ---------- */
await page.goto('https://petngon.vn/vi', { waitUntil: 'load' });
await page.waitForTimeout(1500);
const t1 = await page.locator('body').innerText();
K.t1_quyTrinh = {
  co4Buoc: /4 bước/.test(t1),
  cacBuoc: t1.split('\n').filter((l) => /^\s*0[1-4]\s*$|Chọn dịch vụ|Đặt lịch trên web|Tại spa hoặc tại nhà|Xác nhận & thanh toán/.test(l)).slice(0, 12),
  xacNhan5Phut: /5 phút/.test(t1),
  dong5Phut: t1.split('\n').filter((l) => /5 phút|Zalo/i.test(l)).slice(0, 6),
};

fs.writeFileSync('reports/raw/probe-tai-misc.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 9000));
await browser.close();
