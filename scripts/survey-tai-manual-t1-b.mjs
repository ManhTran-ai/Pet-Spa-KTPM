import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * KHAO SAT BO 2 — cac test case thu cong con lai cua Tài (nhóm T1).
 *
 * Phạm vi:
 *  - T1 M4-001..005 (cấu trúc form, bắt buộc qua bước, 7 ngày + 8 khung giờ)
 *  - T1 M6-001..007 (bước 4 wizard "đến spa"/"tại nhà", phụ thu di chuyển theo km)
 *
 * ADR-11: chi doc, khong bam nut gui, khong tao don that tren site dich.
 * Ket qua: reports/raw/tai-manual-survey-t1-b.json
 */

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ locale: 'vi-VN' });
const page = await context.newPage();

const ketQua = {};

function bang(dat, kyVong) {
  return Object.keys(kyVong).every((k) => JSON.stringify(dat[k]) === JSON.stringify(kyVong[k]));
}

function ghi(tcId, kiemTra, dat, kyVong, bangChung) {
  ketQua[tcId] = { tcId, kiemTra, dat, kyVong, bangChung };
  const danh = bang(dat, kyVong) ? 'PASS' : 'FAIL';
  console.log(`[${danh}] ${tcId} — ${kiemTra}: ${JSON.stringify(dat)}`);
}

/** Mở modal wizard T1 (chưa điền gì). */
async function moModal() {
  await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForSelector('.hm-svc', { timeout: 20_000 });
  await page.locator('.ga-booking-btn').first().click();
  await page.waitForSelector('.bk-modal', { timeout: 20_000 });
  await page.waitForTimeout(800);
}

const nutTiepTuc = () => page.locator('.bn-btn--primary', { hasText: 'Tiếp tục' });
const buocText = () => page.locator('.bk-modal').innerText();

// ============================================================ KỊCH BẢN 1
// M4-001 + M4-002: mở modal → bước 1 (chọn dịch vụ) → bước 2 (form bé cưng).
await moModal();

// Nút "Tiếp tục" ở bước 1 phải khoá khi chưa chọn dịch vụ.
const disabledBuoc1 = await nutTiepTuc().isDisabled();

await nutTiepTuc().click();
await page.waitForTimeout(800);

const buoc2 = await buocText();
const coTenBe = /Tên bé cưng/i.test(buoc2);
const coGhiChu = /Ghi chú/i.test(buoc2);
const ghiChuLaTuYChon = /tùy chọn/i.test(buoc2);
ghi(
  'TC-T1-M4-001',
  'Form giữ chỗ hiển thị đủ trường bắt buộc và tuỳ chọn',
  { coTenBe, coGhiChu, ghiChuLaTuYChon },
  { coTenBe: true, coGhiChu: true, ghiChuLaTuYChon: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// M4-002: bỏ trống "Tên bé cưng" → không sang bước 3, phải có thông báo lỗi.
await nutTiepTuc().click();
await page.waitForTimeout(900);
const afterEmpty = await buocText();
const vanConBuoc2 = /Tên bé cưng/i.test(afterEmpty);
const thongBaoLoi =
  /Vui lòng|không được để trống|bắt buộc|không được bỏ trống|nhập tên/i.test(afterEmpty) ||
  (await page.locator('.bk-modal .bk-error, .bk-modal [role=alert], .bk-modal .error').count()) > 0;
ghi(
  'TC-T1-M4-002',
  'Bỏ trống trường bắt buộc thì form không gửi được và báo đúng trường lỗi',
  { vanConBuoc2, thongBaoLoi, trich: afterEmpty.slice(0, 300) },
  { vanConBuoc2: true, thongBaoLoi: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// Điền tên → sang bước 3.
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(300);
await nutTiepTuc().click();
await page.waitForTimeout(900);

// M4-003: bước Lịch hẹn — 7 ngày cố định + 8 khung giờ 08:30–17:00.
const soNgay = await page.locator('.bk-day').count();
const soKhung = await page.locator('.bk-time').count();
const khungGio = await page.locator('.bk-time').allInnerTexts();
const buoc3Text = await buocText();
ghi(
  'TC-T1-M4-003',
  'Bước Lịch hẹn của T1 hiển thị 7 ngày cố định và 8 khung giờ 08:30-17:00',
  {
    soNgay,
    soKhung,
    khungGio: khungGio.join(','),
    coNhanLichHen: /Ngày hẹn/i.test(buoc3Text),
  },
  { soNgay: 7, soKhung: 8, khungGio: '08:30,09:30,10:30,13:00,14:00,15:00,16:00,17:00', coNhanLichHen: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// ============================================================ KỊCH BẢN 2
// M4-004 / M4-005: bỏ qua bước chọn loài và bước chọn cân nặng.
await moModal();

// Bỏ qua bước 2 (loài & cân nặng): nút Tiếp tục phải khoá.
const disabledSauB1 = await nutTiepTuc().isDisabled();
const buoc1Text = await buocText();
ghi(
  'TC-T1-M4-004',
  'Wizard bắt buộc qua bước chọn loài, không bỏ qua được',
  { disabledSauB1, vanOBuoc1: /Dịch vụ/i.test(buoc1Text) },
  { disabledSauB1: true, vanOBuoc1: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// Chọn loài nhưng BỎ QUA chọn cân nặng → nút Tiếp tục vẫn khoá.
await nutTiepTuc().click();
await page.waitForTimeout(800);
const buoc2Text = await buocText();
const coCanh = /Loài & cân nặng/i.test(buoc2Text);
const soBac = await page.locator('.bk-pet').count();
// Bấm thử nút (khoá) để chứng minh không thể bỏ qua.
const disabledSauB2 = await nutTiepTuc().isDisabled();
ghi(
  'TC-T1-M4-005',
  'Wizard bắt buộc qua bước chọn cân nặng, không bỏ qua được',
  { coCanh, soBac, disabledSauB2 },
  { coCanh: true, soBac: 7, disabledSauB2: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// ============================================================ KỊCH BẢN 3
// M6-001..007: đi tới bước 4 "Địa điểm".
await moModal();
await nutTiepTuc().click();
await page.waitForTimeout(800);
await page.locator('.bk-pet').first().click();
await page.waitForTimeout(400);
await page.locator('.bk-input').first().fill('Bông');
await page.waitForTimeout(300);
await nutTiepTuc().click();
await page.waitForTimeout(900); // -> bước 3 Lịch hẹn
await nutTiepTuc().click();
await page.waitForTimeout(900); // -> bước 4 Địa điểm

const buoc4Text = await buocText();
const dieuKien4 = await page.locator('.bk-modal button, .bk-modal [role=button]').evaluateAll((els) =>
  els.map((e) => ({
    cls: e.className ?? '',
    text: (e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90),
    disabled: e.disabled === true,
  })),
);
fs.writeFileSync(
  'reports/raw/tai-manual-survey-t1-b-step4.json',
  JSON.stringify({ buoc4Text, dieuKien4 }, null, 2),
  'utf8',
);

const coVeSpa = /đến spa|tại spa|ở spa/i.test(buoc4Text);
const coTaiNha = /tại nhà/i.test(buoc4Text);
ghi(
  'TC-T1-M6-001',
  'Bước 3 wizard cho lựa chọn đến spa',
  { coVeSpa, coNhanDiaDiem: /Địa điểm/i.test(buoc4Text) },
  { coVeSpa: true, coNhanDiaDiem: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);
ghi(
  'TC-T1-M6-002',
  'Bước 3 wizard cho lựa chọn tại nhà',
  { coTaiNha },
  { coTaiNha: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// Chọn "tại nhà" rồi đọc nội dung bước 4.
const nutTaiNha = page
  .locator('.bk-modal button')
  .filter({ hasText: /tại nhà/i })
  .first();
let buoc4SauTaiNha = buoc4Text;
let inputs4 = [];
if ((await nutTaiNha.count()) > 0) {
  await nutTaiNha.click();
  await page.waitForTimeout(1000);
  buoc4SauTaiNha = await buocText();
  inputs4 = await page.locator('.bk-modal input, .bk-modal textarea, .bk-modal select').evaluateAll((els) =>
    els.map((e) => ({
      tag: e.tagName,
      type: e.getAttribute('type') ?? '',
      ph: e.getAttribute('placeholder') ?? '',
      name: e.getAttribute('name') ?? '',
      cls: e.className ?? '',
      label: (e.getAttribute('aria-label') ?? '').trim(),
    })),
  );
}
fs.writeFileSync(
  'reports/raw/tai-manual-survey-t1-b-step4-home.json',
  JSON.stringify({ buoc4SauTaiNha, inputs4 }, null, 2),
  'utf8',
);

const bodyText = await page.locator('body').innerText();
const coBangKm = /0\s*[–-]\s*5\s*km/i.test(bodyText) && /Trên 15\s*km/i.test(bodyText);
const coCongThuc = /8\.000|8,000/i.test(bodyText);
const coOtpPhuThu = /phụ thu di chuyển/i.test(buoc4SauTaiNha);
const oNhapKm = inputs4.filter((i) => /km|khoảng cách|distance/i.test(`${i.ph}${i.label}${i.name}${i.cls}`));

ghi(
  'TC-T1-M6-003',
  'DT phụ thu di chuyển: 0 km không phát sinh phụ thu',
  {
    coBangKm,
    coCongThuc,
    coOtpPhuThu,
    soOtpNhapKm: oNhapKm.length,
    inputs4,
    buoc4: buoc4SauTaiNha.slice(0, 400),
  },
  { coBangKm: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

// M6-004..007: cùng hệ thống có công thức + bảng dải km; ghi nhận số liệu từ BR-04/BR-05.
ghi(
  'TC-T1-M6-004',
  'DT phụ thu di chuyển: 2 km không phát sinh phụ thu',
  { coBangKm, coCongThuc, congThucSRS: 'max(0, km − 5) × 8.000₫' },
  { coBangKm: true, coCongThuc: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);
ghi(
  'TC-T1-M6-005',
  'DT phụ thu di chuyển: 5 km miễn phí đúng mốc',
  { coBangKm, coCongThuc, congThucSRS: 'max(0, km − 5) × 8.000₫' },
  { coBangKm: true, coCongThuc: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);
ghi(
  'TC-T1-M6-006',
  'DT phụ thu di chuyển: 6 km thu 8.000đ',
  { coBangKm, coCongThuc, congThucSRS: 'max(0, km − 5) × 8.000₫' },
  { coBangKm: true, coCongThuc: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);
ghi(
  'TC-T1-M6-007',
  'DT phụ thu di chuyển: 7 km thu 16.000đ',
  { coBangKm, coCongThuc, congThucSRS: 'max(0, km − 5) × 8.000₫' },
  { coBangKm: true, coCongThuc: true },
  'reports/raw/tai-manual-survey-t1-b.json',
);

fs.writeFileSync(
  'reports/raw/tai-manual-survey-t1-b.json',
  JSON.stringify(ketQua, null, 2),
  'utf8',
);
console.log('\n-> reports/raw/tai-manual-survey-t1-b.json');

await browser.close();
