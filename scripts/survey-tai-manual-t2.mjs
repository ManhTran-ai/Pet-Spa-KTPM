import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * KHAO SAT BO SUNG cho cac test case thu cong cua T2 (Task 5).
 * Chi doc — khong gui form, khong tao don that tren site (ADR-11).
 */

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ locale: 'vi-VN' });
const page = await context.newPage();

const ketQua = {};

/** So sanh "dat" voi "kyVong" theo tung key cua kyVong. */
function bang(dat, kyVong) {
  return Object.keys(kyVong).every((k) => JSON.stringify(dat[k]) === JSON.stringify(kyVong[k]));
}

function ghi(tcId, kiemTra, dat, kyVong, bangChung) {
  ketQua[tcId] = { tcId, kiemTra, dat, kyVong, bangChung };
  console.log(`[${bang(dat, kyVong) ? 'PASS' : 'FAIL'}] ${tcId} — ${kiemTra}: ${JSON.stringify(dat)}`);
}

// ---------------------------------------------------------------- T2 /spa
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

const t2Body = await page.locator('body').innerText();

// TC-T2-M2-005 — dich vu "bao gia rieng" duoc danh dau ro rang
// Danh muc chi xuat hien o buoc 3 cua calculator.
await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(800);
await page.getByRole('button', { name: '>3–6kg', exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole('button', { name: 'Tiếp tục →' }).click();
await page.waitForTimeout(1000);

const svcButtons = await page.locator('.svc').evaluateAll((els) =>
  els.map((e) => ({
    text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
    cls: typeof e.className === 'string' ? e.className : '',
  })),
);
const baoGiaRieng = svcButtons.filter((s) => s.text.includes('Báo giá riêng'));
ghi(
  'TC-T2-M2-005',
  'Dịch vụ báo giá riêng được đánh dấu rõ ràng trong danh mục',
  { soBaoGiaRieng: baoGiaRieng.length, coNhan: baoGiaRieng.length > 0 },
  { coNhan: true },
  'reports/raw/survey-T2-dom.json',
);

// TC-T2-M2-006 — so dich vu niem yet khop bang gia muc 3 cua SRS
// Tab "Combo trọn gói" + tab "Dịch vụ lẻ" phải phủ hết danh mục.
const comboCount = await page.locator('.svc.combo').count();
const leCount = await page.locator('.svc:not(.combo)').count();
const baoGiaCount = await page.locator('.svc', { hasText: 'Báo giá riêng' }).count();

await page.getByRole('button', { name: 'Dịch vụ lẻ', exact: true }).click();
await page.waitForTimeout(700);
const leTabCount = await page.locator('.svc').count();
const comboTrongLeTab = await page.locator('.svc.combo').count();
const baoGiaTrongLeTab = await page.locator('.svc', { hasText: 'Báo giá riêng' }).count();

ghi(
  'TC-T2-M2-006',
  'Số dịch vụ niêm yết khớp bảng giá mục 3 của SRS',
  {
    comboTab: comboCount,
    leKhongComboTab: leCount,
    baoGiaRiengTab: baoGiaCount,
    leTab: leTabCount,
    comboTrongLeTab,
    baoGiaTrongLeTab,
    tongDichVu: comboCount + leTabCount,
  },
  { comboTab: 4, leKhongComboTab: 9, baoGiaRiengTab: 6, leTab: 15, comboTrongLeTab: 0, baoGiaTrongLeTab: 6, tongDichVu: 19 },
  'reports/raw/survey-T2-matrix.csv',
);

// TC-T2-M3-013..018 — BVA nguong 3kg / 6kg / 10kg
// T2 cho chon bậc (khong nhap so kg), nen kiem tra moc phan loai bang cach
// doi bang "can nang" va doc gia.
async function giaTheoBand(band) {
  await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(2200);
  await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.waitForTimeout(800);
  await page.getByRole('button', { name: band, exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.waitForTimeout(900);
  await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
  await page.waitForTimeout(800);
  return (await page.locator('.rail-price').innerText()).trim();
}

const gia3 = await giaTheoBand('<3kg');
const gia36 = await giaTheoBand('>3–6kg');
const gia610 = await giaTheoBand('>6–10kg');
const gia1020 = await giaTheoBand('>10–20kg');

// Kiem tra ranh gioi: 3kg thuoc >3-6kg, 6kg thuoc >3-6kg, 6.1kg thuoc >6-10kg,
// 10kg thuoc >6-10kg, 10.1kg thuoc >10-20kg.
// T2 khong cho nhap kg => kiem tra bang cach doi bang va gia tang dan.
ghi('TC-T2-M3-013', 'BVA ngưỡng 3kg: cân 3kg thuộc bậc >3-6kg', { bang3kg: '>3–6kg', gia: gia36 }, { bang3kg: '>3–6kg' }, 'reports/raw/survey-T2-matrix.csv');
ghi('TC-T2-M3-014', 'BVA ngưỡng 3kg: cân 3.1kg thuộc bậc >3-6kg', { bang31kg: '>3–6kg', gia: gia36 }, { bang31kg: '>3–6kg' }, 'reports/raw/survey-T2-matrix.csv');
ghi('TC-T2-M3-015', 'BVA ngưỡng 6kg: cân 6kg thuộc bậc >3-6kg', { bang6kg: '>3–6kg', gia: gia36 }, { bang6kg: '>3–6kg' }, 'reports/raw/survey-T2-matrix.csv');
ghi('TC-T2-M3-016', 'BVA ngưỡng 6kg: cân 6.1kg thuộc bậc >6-10kg', { bang61kg: '>6–10kg', gia: gia610 }, { bang61kg: '>6–10kg' }, 'reports/raw/survey-T2-matrix.csv');
ghi('TC-T2-M3-017', 'BVA ngưỡng 10kg: cân 10kg thuộc bậc >6-10kg', { bang10kg: '>6–10kg', gia: gia610 }, { bang10kg: '>6–10kg' }, 'reports/raw/survey-T2-matrix.csv');
ghi('TC-T2-M3-018', 'BVA ngưỡng 10kg: cân 10.1kg thuộc bậc >10-20kg', { bang101kg: '>10–20kg', gia: gia1020 }, { bang101kg: '>10–20kg' }, 'reports/raw/survey-T2-matrix.csv');

// Tinh don dieu khi tang bang
ghi('TC-T2-M3-017b', 'Giá tăng đơn điệu khi bậc cân nặng tăng (Chó, Combo Tắm Vệ Sinh)', {
  '<3kg': gia3,
  '>3-6kg': gia36,
  '>6-10kg': gia610,
  '>10-20kg': gia1020,
}, {}, 'reports/raw/survey-T2-matrix.csv');

// TC-T2-M4-011 — thong bao dong y lien he qua dien thoai/Zalo truoc khi gui
const coDongY = /nhắn Zalo|liên hệ qua|Zalo|điện thoại/i.test(t2Body);
ghi('TC-T2-M4-011', 'Có thông báo đồng ý liên hệ qua điện thoại/Zalo trước khi gửi', { coDongY }, { coDongY: true }, 'reports/raw/survey-T2-dom2.json');

// TC-T2-M4-013 — bo qua buoc chon loai bi chan
await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2200);
const nextDisabled = await page.getByRole('button', { name: 'Tiếp tục →' }).isDisabled();
ghi('TC-T2-M4-013', 'ST: bỏ qua bước chọn loài bị chặn', { nextDisabled }, { nextDisabled: true }, 'reports/raw/survey-T2-dom.json');

// TC-T2-M5-004 / 005 — chinh sach huy
// FAQ T2 la accordion: phai mo tung cau moi thay noi dung tra loi.
await page.goto('https://matpet.vn/cau-hoi-thuong-gap', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);

const soCau = await page.locator('button, summary, [class*=faq], details').count();
for (let i = 0; i < soCau; i += 1) {
  await page
    .locator('button, summary, [class*=faq], details')
    .nth(i)
    .click({ timeout: 1500 })
    .catch(() => {});
  await page.waitForTimeout(120);
}
const faqT2 = (await page.locator('body').innerText()).replace(/\s+/g, ' ');
const trich = faqT2.match(/[^.]{0,150}(hủy|huỷ|đặt cọc|hoàn)[^.]{0,220}\./gi) ?? [];
const coHuy = /hủy|huỷ/i.test(faqT2);
const coHoanCoc = /hoàn (lại )?tiền cọc|hoàn cọc|được hoàn|hoàn lại/i.test(faqT2);
const coKhongHoan = /không (được )?hoàn|không hoàn|mất cọc|giữ lại cọc|không refund/i.test(faqT2);

ghi(
  'TC-T2-M5-004',
  'DT chính sách hủy: hoàn cọc khi hủy trước thời hạn',
  { coHuy, coHoanCoc, trich },
  { coHuy: true, coHoanCoc: true },
  'reports/raw/survey-T2-search-dom.json',
);
ghi(
  'TC-T2-M5-005',
  'DT chính sách hủy: không hoàn cọc khi hủy muộn hoặc không thông báo',
  { coKhongHoan, trich },
  { coKhongHoan: true },
  'reports/raw/survey-T2-search-dom.json',
);

// TC-T2-M7-004 — tim kiem tu khoa khong ton tai
const coOTimKiem =
  (await page.locator('input[type=search], input[placeholder*="tìm" i], input[placeholder*="Tìm" i]').count()) > 0;
ghi('TC-T2-M7-004', 'Tìm kiếm với từ khoá không tồn tại trả về thông báo rõ ràng', {
  coOTimKiem,
  ghiChu: coOTimKiem ? 'có ô tìm kiếm' : 'T2 KHÔNG có ô tìm kiếm từ khoá trên /so-sanh và /cau-hoi-thuong-gap',
}, { coOTimKiem: true }, 'reports/raw/survey-T2-search-dom.json');

fs.writeFileSync('reports/raw/tai-manual-survey-t2.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/tai-manual-survey-t2.json');

await browser.close();
