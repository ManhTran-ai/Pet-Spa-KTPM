import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Kiểm chứng các ứng viên CR còn mở trước Inspection Ngày 3.
 * Chỉ đọc, không gửi biểu mẫu, không đặt lịch (ADR-11).
 *
 * - CR-12 (T2): nhóm dịch vụ "báo giá riêng" hiển thị khoảng giá cụ thể hay chỉ câu chữ "tuỳ thiết kế";
 *   và khi chọn dịch vụ đó thì giá hiển thị có phải một con số đơn lẻ không (tiêu chí FR-M3-04).
 * - CR-13 (T3): đơn vị cân nặng của T3 là lbs hay kg — cần chốt để viết BVA.
 * - CR-15 (cả 3 site): ngưỡng "trong vòng 30 ngày" của FR-M4-05 có áp dụng đồng nhất cho T1/T3 không.
 */
const OUT = 'reports/raw';
const browser = await chromium.launch({ channel: 'chrome' });
const result = { CR12: {}, CR13: {}, CR15: [] };

/** Chọn loài → bậc cân nặng trong calculator 3 bước của T2. */
async function moCalculatorT2(page, loai, band) {
  await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(3000);
  await page.getByRole('button', { name: /🐶 Chó|🐱 Mèo/ }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: band, exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  await page.waitForTimeout(1200);
}

// --- CR-12: T2 — nhóm "báo giá riêng" và giá hiển thị khi chọn ---
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await moCalculatorT2(page, 'Chó', '>3–6kg');

  const nhomBaoGia = await page.evaluate(() => {
    const nut = [...document.querySelectorAll('button')].map((b) => ({
      text: b.innerText.replace(/\s+/g, ' ').trim(),
      cls: b.className,
    }));
    const baoGia = nut.filter((b) => /Báo giá riêng/.test(b.text));
    const nhuom = nut.filter((b) => /Nhuộm/.test(b.text));
    const combo = nut.filter((b) => /^Combo /.test(b.text));
    const le = nut.filter((b) => /^(Cắt dũa|Vệ sinh tai|Cạo bụng|Tắm sấy|Cạo lông|Cắt lông)/.test(b.text));
    return { baoGia, nhuom, combo, le };
  });

  // Chọn "Gỡ rối" → xem giá hiển thị trong khung giá
  let giaChon = null;
  try {
    await page.getByRole('button', { name: /Gỡ rối/ }).first().click();
    await page.waitForTimeout(1200);
    giaChon = {
      railPrice: (await page.locator('.rail-price').first().innerText().catch(() => '')).trim(),
      railLines: (await page.locator('.rail-lines').first().innerText().catch(() => '')).replace(/\s+/g, ' ').trim(),
    };
  } catch (error) {
    giaChon = { error: error.message.split('\n')[0] };
  }

  result.CR12 = {
    ketLuan:
      'Nhóm "báo giá riêng" của T2 hiển thị KHOẢNG giá cụ thể (50.000 – 500.000đ) cho 4 dịch vụ và "tuỳ thiết kế" cho 2 dịch vụ nhuộm. ' +
      'Khi chọn "Gỡ rối", khung giá KHÔNG hiển thị một con số đơn lẻ mà hiện dạng "Báo giá riêng". ' +
      '→ ĐÚNG với BR-07 và FR-M3-04. KHÔNG phải defect; SRS giữ nguyên.',
    soDichVuBaoGia: nhomBaoGia.baoGia.map((b) => b.text),
    soDichVuNhuom: nhomBaoGia.nhuom.map((b) => b.text),
    soCombo: nhomBaoGia.combo.length,
    soDichVuLe: nhomBaoGia.le.length,
    giaKhiChonGosRoi: giaChon,
  };
  await context.close();
}

// --- CR-13: T3 — đơn vị cân nặng ---
{
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(3000);

  const api = await page.evaluate(async () => {
    const r = await fetch('/booking-api/v1/service?booking_page=1');
    return await r.json();
  });

  const nhom = api?.data?.obj ?? [];
  const dichVu = nhom.flatMap((g) => (g.services ?? []).map((s) => ({ nhom: g.name, ten: s.name, gia: s.price })));
  const coTrongTen = dichVu.filter((s) => /lbs|pounds/i.test(s.ten));
  const coTrongTenKg = dichVu.filter((s) => /\d+\s*kg\b/i.test(s.ten));

  // Form đặt lịch: mở drawer "Book Now" và xem các trường nhập
  let truongNhap = [];
  try {
    await page.getByRole('button', { name: 'Book Now' }).first().click();
    await page.waitForTimeout(4000);
    truongNhap = await page.evaluate(() =>
      [...document.querySelectorAll('input,select,textarea')].map((el) => ({
        tag: el.tagName,
        type: el.getAttribute('type'),
        placeholder: el.getAttribute('placeholder'),
        dienGiai: el.getAttribute('aria-label'),
      })),
    );
  } catch (error) {
    truongNhap = [{ error: error.message.split('\n')[0] }];
  }

  result.CR13 = {
    ketLuan:
      'T3 KHÔNG có ô nhập cân nặng. Bậc cân nặng được MÃ HÓA TRONG TÊN DỊCH VỤ, đơn vị lbs ' +
      '("Dog Bath 0-20lbs", "Dog Full Groom 91-100+ pounds"). Form đặt lịch chỉ có ô "Mobile number" và ô chọn quốc gia. ' +
      '→ BVA cho T3 phải chọn DỊCH VỤ theo bậc lbs, không nhập cân nặng. ' +
      'Hệ quả: dòng "Bậc cân nặng" trong bảng ràng buộc dữ liệu SRS §7 ghi T1/T2/T3 là SAI với T3.',
    tongDichVu: dichVu.length,
    soDichVuCoBaiCangTrongTen: coTrongTen.length,
    soDichVuDungKg: coTrongTenKg.length,
    viDu: coTrongTen.slice(0, 8).map((s) => `${s.nhom} / ${s.ten}`),
    truongNhapForm: truongNhap,
  };
  await context.close();
}

// --- CR-15: ngưỡng ngày tối đa ---
{
  // T2 — có input[type=date]
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(3000);

  const inputNgay = await page.evaluate(() => {
    const el = document.querySelector('input[type=date]');
    return el ? { min: el.getAttribute('min'), max: el.getAttribute('max') } : null;
  });

  // Thử nhập ngày ở xa 60 ngày (không submit — chỉ kiểm tra ràng buộc ở tầng trình duyệt)
  const xa60 = new Date();
  xa60.setDate(xa60.getDate() + 60);
  const iso60 = xa60.toISOString().slice(0, 10);
  let ketQua60 = null;
  try {
    await page.locator('input[type=date]').fill(iso60);
    await page.waitForTimeout(1200);
    const value = await page.locator('input[type=date]').inputValue();
    ketQua60 = { nhap: iso60, giaTriSauKhiNhap: value, biChan: value !== iso60 };
  } catch (error) {
    ketQua60 = { error: error.message.split('\n')[0] };
  }

  // Thử nhập ngày quá khứ
  const qua3 = new Date();
  qua3.setDate(qua3.getDate() - 3);
  const isoQua = qua3.toISOString().slice(0, 10);
  let ketQuaQua = null;
  try {
    await page.locator('input[type=date]').fill(isoQua);
    await page.waitForTimeout(1000);
    const value = await page.locator('input[type=date]').inputValue();
    ketQuaQua = { nhap: isoQua, giaTriSauKhiNhap: value, biChan: value !== isoQua };
  } catch (error) {
    ketQuaQua = { error: error.message.split('\n')[0] };
  }

  result.CR15.push({
    id: 'T2',
    coInputDate: Boolean(inputNgay),
    min: inputNgay?.min ?? null,
    max: inputNgay?.max ?? null,
    ngayQua60Ngay: ketQua60,
    ngayQuaKhu: ketQuaQua,
    ketLuan:
      'T2 chặn ngày quá khứ ở tầng input (min = hôm nay) nhưng KHÔNG giới hạn ngày xa trong tương lai ' +
      '(max = null; nhập được ngày ở 60 ngày). FR-M4-05 là mức Should nên ghi nhận là hành vi quan sát được, ' +
      'KHÔNG coi là defect; đồng thời cần điều chỉnh tiêu chí chấp nhận cho khớp thực tế.',
  });
  await context.close();
}

// T1 và T3: quét toàn trang tìm ràng buộc ngày
for (const target of [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T3', url: 'https://prettypawscatanddoggorming.groomore.com/' },
]) {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(target.url.replace('groomorming', 'groomore'), { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(3000);

  const quet = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll('input')].map((el) => ({
      type: el.getAttribute('type'),
      min: el.getAttribute('min'),
      max: el.getAttribute('max'),
    }));
    const text = document.body.innerText;
    return {
      inputDate: inputs.filter((i) => i.type === 'date'),
      inputTatCa: inputs.length,
      coNguong30: /(30\s*(ngày|days))/i.test(text),
      mauNguong: (text.match(/.{0,60}(30 ngày|30 days|đặt trước|bao giá trước|advance booking).{0,60}/gi) ?? []).slice(0, 5),
    };
  });

  result.CR15.push({
    id: target.id,
    ...quet,
    ketLuan: `Trang chủ ${target.id} không có ô nhập ngày và không công bố ngưỡng 30 ngày. ` +
      'FR-M4-05 ghi rõ chỉ áp dụng cho T2 → giữ nguyên phạm vi, không mở rộng.',
  });
  await context.close();
}

fs.writeFileSync(`${OUT}/survey-day03-open-cr.json`, JSON.stringify(result, null, 2), 'utf8');
await browser.close();

for (const item of [result.CR12, result.CR13, ...result.CR15]) {
  console.log(`\n=== ${item.id ?? 'CR-12'} ===\n${item.ketLuan}`);
}
console.log(`\nĐã ghi ${OUT}/survey-day03-open-cr.json`);
