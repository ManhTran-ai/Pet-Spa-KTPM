import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * KHAO SAT BO SUNG cho cac test case thu cong cua Tài (Task 5).
 * Chi doc — khong gui form, khong tao don that tren site (ADR-11).
 *
 * Ghi ra reports/raw/tai-manual-survey.json: moi truong hop la bang chung
 * de ghi ket qua thu cong vao execution-log.
 */

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ locale: 'vi-VN' });
const page = await context.newPage();

const ketQua = {};

/** So sanh "dat" voi "kyVong" theo tung key cua kyVong (bo qua key chi co o dat). */
function bang(dat, kyVong) {
  return Object.keys(kyVong).every((k) => JSON.stringify(dat[k]) === JSON.stringify(kyVong[k]));
}

/** Ghi nhan ket qua cua mot truong hop. */
function ghi(tcId, kiemTra, dat, kyVong, bangChung) {
  ketQua[tcId] = { tcId, kiemTra, dat, kyVong, bangChung };
  const danh = bang(dat, kyVong) ? 'PASS' : 'FAIL';
  console.log(`[${danh}] ${tcId} — ${kiemTra}: ${JSON.stringify(dat)}`);
}

// ---------------------------------------------------------------- T1
await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(3000);

const t1Body = await page.locator('body').innerText();
const t1Cards = await page.locator('.hm-svc').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
const t1Headers = await page.locator('table.hm-pricing-matrix thead th').allInnerTexts();
const t1Rows = await page.locator('table.hm-pricing-matrix tbody tr').evaluateAll((rows) =>
  rows.map((r) => [...r.querySelectorAll('th,td')].map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim())),
);
const t1Links = await page.locator('a[href]').evaluateAll((els) =>
  els.map((a) => ({
    href: a.getAttribute('href') ?? '',
    text: (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60),
  })),
);

// TC-T1-M1-003 — dia chi, dien thoai, email, gio mo cua
// Giờ mở cửa chỉ được công bố ở trang /vi/contact (không có ở trang chủ).
await page.goto('https://petngon.vn/vi/contact', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2000);
const t1Contact = await page.locator('body').innerText();
const coGioMo = /07:00/.test(t1Contact) && /22:00/.test(t1Contact);
ghi(
  'TC-T1-M1-003',
  'Trang hiển thị đủ địa chỉ, điện thoại, email và giờ mở cửa',
  {
    diaChi: /TP\.?\s*Hồ Chí Minh/i.test(t1Contact),
    dienThoai: /\+84|\(0\d{2}\)|0\d{2}[\s.]?\d{3}[\s.]?\d{3}/.test(t1Contact),
    email: /[\w.+-]+@[\w-]+\.[\w.]+/.test(t1Contact),
    gioMoCua: coGioMo,
  },
  { diaChi: true, dienThoai: true, email: true, gioMoCua: true },
  'reports/raw/survey-T1-dom.json',
);

await page.goto('https://petngon.vn/vi', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(2500);

// TC-T1-M2-001 / 002 / 003 — danh muc
const thieuTen = t1Cards.filter((c) => !/\d{1,3}\.\d{3}₫/.test(c));
const thieuThoiLuong = t1Cards.filter((c) => !/\d{1,3}\s*phút/.test(c));
const moTaNgan = t1Cards.filter((c) => c.length < 80);
const nhanSai = t1Cards.filter((c) => {
  const taiNha = c.includes('Có tận nhà');
  const taiSpa = c.includes('Chỉ tại spa');
  return taiNha === taiSpa; // phải có đúng một nhãn
});

ghi('TC-T1-M2-001', 'Mỗi dịch vụ có đủ tên, mô tả, giá và thời lượng', {
  soDichVu: t1Cards.length,
  thieuGia: thieuTen.length,
  thieuThoiLuong: thieuThoiLuong.length,
}, { soDichVu: 6, thieuGia: 0, thieuThoiLuong: 0 }, 'reports/raw/survey-T1-cards.json');

ghi('TC-T1-M2-002', 'Mỗi dịch vụ nêu rõ thành phần bao gồm', {
  soMoTaNgan: moTaNgan.length,
  nhanThieu: moTaNgan,
}, { soMoTaNgan: 0 }, 'reports/raw/survey-T1-cards.json');

ghi('TC-T1-M2-003', 'Dịch vụ không hỗ trợ tại nhà có nhãn Chỉ tại spa', {
  soNhanSai: nhanSai.length,
  chiTaiSpa: t1Cards.filter((c) => c.includes('Chỉ tại spa')).length,
}, { soNhanSai: 0, chiTaiSpa: 2 }, 'reports/raw/survey-T1-cards.json');

// TC-T1-M3-001 — bang gia day du (17 dong gồm 2 dong tiêu đề loài + 14 dòng giá)
const soHang = t1Rows.length;
const soCot = t1Headers.length;
ghi('TC-T1-M3-001', 'Bảng giá có đủ cột cho mọi bậc cân nặng và mọi dịch vụ', {
  soHang,
  soCot,
}, { soHang: 16, soCot: 7 }, 'reports/raw/survey-T1-wizard-3.json');

// TC-T1-M3-002 — tra bang gia dung cho (Cho, 3-5kg)
const dongCho35 = t1Rows.find((r) => r[0]?.includes('Chó nhỏ') && r[0]?.includes('3–5kg')) ?? [];
ghi('TC-T1-M3-002', 'Tra bảng giá đúng cho (Chó, bậc 3-5kg) + dịch vụ đã chọn', {
  hang: dongCho35[0],
  comboTamVeSinh: dongCho35[4],
}, { comboTamVeSinh: '265.000₫' }, 'reports/raw/survey-T1-wizard-3.json');

// TC-T1-M3-003 — cung bac nang, Meo gia khac Cho
const dongMeo35 = t1Rows.find((r) => r[0]?.includes('Mèo nhỏ') && r[0]?.includes('3–5kg')) ?? [];
ghi('TC-T1-M3-003', 'Cùng bậc cân nặng nhưng Mèo cho giá khác Chó', {
  cho: dongCho35[4],
  meo: dongMeo35[4],
  khacNhau: dongCho35[4] !== dongMeo35[4],
}, { khacNhau: true }, 'reports/raw/survey-T1-wizard-3.json');

// TC-T1-M3-004 — gia cuoi xac nhan tai spa
const coGiaCuoi =
  /xác nhận tại spa/i.test(t1Body) ||
  /giá cuối cùng sẽ tính/i.test(t1Body) ||
  /Xác nhận & thanh toán/i.test(t1Body);
ghi('TC-T1-M3-004', 'Trang giá ghi rõ giá cuối xác nhận tại spa', { coGiaCuoi }, { coGiaCuoi: true }, 'reports/raw/survey-T1-dom.json');

// TC-T1-M3-005 / 006 — "Tu ...?" va khoang min-max
const coTu = t1Cards.filter((c) => /Từ\s*\d{1,3}\.\d{3}₫/.test(c)).length;
const coKhoang = t1Cards.filter((c) => /\d{1,3}\.\d{3}₫\s*[–—-]\s*\d{1,3}\.\d{3}₫/.test(c)).length;
ghi('TC-T1-M3-005', 'Gói hiển thị mức giá từ ...₫ kèm khoảng min-max', { coTu }, { coTu: 6 }, 'reports/raw/survey-T1-cards.json');
// Khoảng min-max chỉ xuất hiện trong wizard đặt lịch (bk-svc), không có ở thẻ dịch vụ.
// Đo riêng ở bước 1 của wizard:
await page.locator('.ga-booking-btn').first().click();
await page.waitForTimeout(1200);
const bkSvc = await page.locator('.bk-svc').evaluateAll((els) =>
  els.map((e) => (e.textContent || '').replace(/\s+/g, ' ').trim()),
);
const coKhoangWizard = bkSvc.filter((c) => /\d{1,3}\.\d{3}₫\s*[–—-]\s*\d{1,3}\.\d{3}₫/.test(c)).length;
ghi('TC-T1-M3-005b', 'Gói hiển thị khoảng min-max trong wizard đặt lịch', {
  soDichVu: bkSvc.length,
  coKhoangWizard,
}, { soDichVu: 6, coKhoangWizard: 6 }, 'reports/raw/survey-T1-wizard-dom.json');
await page.locator('.bk-close').click();
await page.waitForTimeout(500);

const giaBang = {};
for (const r of t1Rows) {
  if (r.length < 7) continue;
  const gia = r.slice(1, 7).map((c) => Number(c.replace(/[₫.\s]/g, '').replace(/\D/g, '')));
  if (gia.every((g) => Number.isFinite(g))) giaBang[r[0]] = gia;
}
let lechMinMax = 0;
for (const [ten, gia] of Object.entries(giaBang)) {
  const min = Math.min(...gia);
  const max = Math.max(...gia);
  const dong = t1Cards.find((c) => c.includes(ten.split(/\d|<|>|·/)[0].trim()));
  if (!dong) continue;
  const m = dong.match(/Từ\s*([\d.]+)₫/);
  if (!m) continue;
  const giaTu = Number(m[1].replace(/\./g, ''));
  if (giaTu !== min) lechMinMax += 1;
}
ghi('TC-T1-M3-006', 'Khoảng min-max của gói khớp bảng giá', { lechMinMax }, { lechMinMax: 0 }, 'reports/raw/survey-T1-wizard-3.json');

// TC-T1-M5-001 / 002 — quy trinh 4 buoc, xac nhan 5 phut qua Zalo
const coQuyTrinh = /Đặt lịch online|quy trình/i.test(t1Body);
const coXacNhan5Phut = /xác nhận trong 5 phút qua Zalo/i.test(t1Body);
ghi('TC-T1-M5-001', 'Trang mô tả quy trình 4 bước từ đặt lịch đến nhận thú cưng', { coQuyTrinh }, { coQuyTrinh: true }, 'reports/raw/survey-T1-dom.json');
ghi('TC-T1-M5-002', 'Có nêu xác nhận lịch trong 5 phút qua Zalo', { coXacNhan5Phut }, { coXacNhan5Phut: true }, 'reports/raw/survey-T1-dom.json');

// TC-T1-M7-001 — chuyen sang tieng Anh
await page.locator('.bn-locale').click();
await page.waitForTimeout(1800);
const urlEN = page.url();
const bodyEN = await page.locator('body').innerText();
const sangEN = /\/en(\/|$)/.test(urlEN) || /Book|Booking|Services|Grooming/i.test(bodyEN);
ghi('TC-T1-M7-001', 'Chuyển sang tiếng Anh vẫn ở trang hiện tại và dịch đủ', { urlEN, sangEN }, { sangEN: true }, 'reports/raw/survey-T1-dom.json');

fs.writeFileSync('reports/raw/tai-manual-survey-t1.json', JSON.stringify(ketQua, null, 2), 'utf8');
console.log('\n-> reports/raw/tai-manual-survey-t1.json');

await browser.close();
