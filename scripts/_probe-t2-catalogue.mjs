import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Probe T2: danh muc (so dich vu, nhan "bao gia rieng"), thong bao dong y,
 * chinh sach huy/hoan coc, cau truc band can nang.
 * ADR-11: chi doc.
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await (await browser.newContext({ locale: 'vi-VN' })).newPage();
const ketQua = {};

/* ---------- 1. Danh muc tren /spa ---------- */
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);
const body = await page.locator('body').innerText();
ketQua.danhMuc = {
  coCombo: (body.match(/Combo/gi) ?? []).length,
  coBaoGiaRieng: /báo giá riêng|tuỳ thiết kế|tùy thiết kế/i.test(body),
  cacDongBaoGiaRieng: body
    .split('\n')
    .filter((l) => /báo giá riêng|tuỳ thiết kế|tùy thiết kế/i.test(l))
    .slice(0, 12),
  dongLienHe: body.split('\n').filter((l) => /liên hệ|để lại|Zalo|zalo/i.test(l)).slice(0, 8),
};

/* ---------- 2. Calculator: so band can nang + nhan "bao gia rieng" ---------- */
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(800);
ketQua.calc = {
  soBand: await page.locator('.chip').count(),
  bands: await page.locator('.chip').allInnerTexts(),
  soDichVu: await page.locator('.svc').count(),
  nhanDichVu: await page.locator('.svc').allInnerTexts(),
};

/* ---------- 3. Thong bao dong y truoc khi gui ---------- */
const toanBo = await page.locator('body').innerText();
ketQua.dongY = {
  coNhatQuan: /xác nhận|đồng ý|liên hệ qua|liên hệ với/i.test(toanBo),
  cacDong: toanBo.split('\n').filter((l) => /xác nhận|đồng ý|liên hệ/i.test(l)).slice(0, 10),
  nutGui: await page.locator('button').evaluateAll((els) =>
    els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()).filter((t) => t.length > 0 && t.length < 40),
  ),
};

/* ---------- 4. Chinh sach huy / hoan coc tren cac trang ---------- */
const DUONG = ['/spa', '/cau-hoi-thuong-gap', '/bang-gia', '/so-sanh', '/bao-hanh', '/lien-he', '/'];
ketQua.chinhSach = [];
for (const d of DUONG) {
  const resp = await page.goto(`https://matpet.vn${d}`, { waitUntil: 'load', timeout: 45_000 }).catch(() => null);
  await page.waitForTimeout(1500);
  const t = resp ? await page.locator('body').innerText() : '';
  ketQua.chinhSach.push({
    duong: d,
    status: resp?.status() ?? 0,
    coHuy: /hủy|huỷ|hủy lịch|huỷ lịch|đổi lịch/i.test(t),
    coHoanCoc: /hoàn (tiền|cọc)|hoàn cọc|hoàn tiền|refund|đổi lịch.*(miễn phí|hoàn)/i.test(t),
    dongLienQuan: t
      .split('\n')
      .filter((l) => /hủy|huỷ|hoàn cọc|hoàn tiền|đổi lịch|chính sách/i.test(l))
      .slice(0, 8),
  });
}

fs.writeFileSync('reports/raw/probe-t2-catalogue.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log(JSON.stringify(ketQua, null, 1).slice(0, 7000));
await browser.close();
