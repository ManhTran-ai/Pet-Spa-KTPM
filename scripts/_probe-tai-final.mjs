import { chromium } from '@playwright/test';
import fs from 'node:fs';

/** Probe tong hop: cac diem con mo cho T1 + T2. */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const K = {};

/* ---------- T1: 404 / gio mo cua / EN ---------- */
const r404 = await page.goto('https://petngon.vn/vi/khong-ton-tai-xyz', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
K.t1_404 = {
  status: r404?.status() ?? 0,
  coStackTrace: /at \w+ \(|Error:|\.js:\d+:\d+|Traceback|node_modules/i.test(
    await page.locator('body').innerText(),
  ),
  tieuDe: await page.title(),
  doan: (await page.locator('body').innerText()).split('\n').filter((l) => l.trim()).slice(0, 12),
};

await page.goto('https://petngon.vn/vi', { waitUntil: 'load' });
await page.waitForTimeout(1200);
const bodyVi = await page.locator('body').innerText();
K.t1_gioMoCua = {
  coGio: /\d{1,2}\s*[:h]\s*\d{0,2}\s*[–\-~]\s*\d{1,2}\s*[:h]\s*\d{0,2}/.test(bodyVi),
  cacDong: bodyVi.split('\n').filter((l) => /\d{1,2}\s*[:h]\s*\d{0,2}/.test(l)).slice(0, 10),
  coTuKhoa: bodyVi.split('\n').filter((l) => /mở cửa|mở cửa|giờ|7:00|07:00|22:00/i.test(l)).slice(0, 10),
};

// Nut doi ngon ngu
const nutEN = page.locator('a[href*="/en"], button:has-text("EN"), [class*=lang] a, [class*=lang] button');
K.t1_langLinks = await nutEN.evaluateAll((els) =>
  els.map((e) => ({ tag: e.tagName, href: e.getAttribute('href') ?? '', text: (e.textContent || '').trim() })),
);

/* ---------- T1: nhan bang can nang (cho BVA) ---------- */
K.t1_bands = { cho: [], meo: [] };
await page.locator('.ga-booking-btn').first().click();
await page.waitForSelector('.bk-modal');
await page.waitForTimeout(600);
await page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' }).click();
await page.waitForTimeout(700);
K.t1_bands.cho = await page.locator('.bk-pet').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
K.t1_bands.soLuong = await page.locator('.bk-pet').count();
// So ngay + khung gio o buoc 3
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(300);
await page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' }).click();
await page.waitForTimeout(900);
K.t1_buc3 = {
  soNgay: await page.locator('.bk-day').count(),
  ngay: await page.locator('.bk-day').allInnerTexts(),
  soKhungGio: await page.locator('.bk-time').count(),
  khungGio: await page.locator('.bk-time').allInnerTexts(),
};

/* ---------- T2: danh muc 19 dich vu ---------- */
await page.goto('https://matpet.vn/bang-gia', { waitUntil: 'load' });
await page.waitForTimeout(2500);
const bangGia = await page.locator('body').innerText();
K.t2_bangGia = {
  soDong: bangGia.split('\n').filter((l) => /Combo|Cắt|Vệ sinh|Cạo|Tắm sấy|Nhuộm/i.test(l)).length,
  cacDong: bangGia.split('\n').filter((l) => /Combo|Cắt|Vệ sinh|Cạo|Tắm|Nhuộm/i.test(l)).slice(0, 40),
  coBaoGiaRieng: /báo giá riêng|tuỳ thiết kế/i.test(bangGia),
  dongBaoGiaRieng: bangGia.split('\n').filter((l) => /báo giá riêng|tuỳ thiết kế|tùy thiết kế/i.test(l)).slice(0, 10),
};

/* ---------- T2: cac trang khac co danh muc dich vu ---------- */
for (const d of ['/spa', '/cho', '/meo']) {
  await page.goto(`https://matpet.vn${d}`, { waitUntil: 'load' });
  await page.waitForTimeout(1800);
  const t = await page.locator('body').innerText();
  K[`t2_${d.replace('/', '_')}_dichVu`] = t
    .split('\n')
    .filter((l) => /Combo Tắm|Cắt dũa|Vệ sinh tai|Cạo bụng|Tắm sấy|Cạo lông|Cắt lông|Nhuộm/i.test(l))
    .slice(0, 25);
}

fs.writeFileSync('reports/raw/probe-tai-final.json', JSON.stringify(K, null, 2), 'utf8');
console.log(JSON.stringify(K, null, 1).slice(0, 9000));
await browser.close();
