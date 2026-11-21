import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * KHAO SAT MA TRAN GIA T2 (Mật Pet Family) — REF-01, Ngày 2.
 *
 * Mục tiêu: thu thập giá hiển thị thực tế theo (loài × bậc cân nặng × dịch vụ)
 * để dùng làm test oracle cho FR-M3-02/03/04 và DT bảng giá.
 *
 * Ranh giới ADR-11: chỉ đọc và chọn trong calculator, KHÔNG bấm nút gửi form.
 */
const BANDS = ['<3kg', '>3–6kg', '>6–10kg', '>10–20kg', '>20–30kg', '>30–40kg', '>40kg'];
const PETS = [
  { key: 'Cho', button: '🐶 Chó' },
  { key: 'Meo', button: '🐱 Mèo' },
];

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ locale: 'vi-VN' });
const page = await context.newPage();

const rows = [];

/** Đọc toàn bộ nút dịch vụ (kèm giá ghi ngay trên nhãn) ở bước 3. */
async function docDichVu() {
  return page.locator('.svc').evaluateAll((els) =>
    els.map((e) => ({
      text: (e.textContent || '').replace(/\s+/g, ' ').trim(),
      cls: e.className,
    })),
  );
}

/** Tách tên dịch vụ và giá từ nhãn nút, ví dụ "Combo Tắm Vệ Sinh200k". */
function tachTenVaGia(text) {
  const gia = text.match(/(\d[\d.,]*)\s*(k|tr|đ)?\s*$/i);
  if (!gia) return { ten: text, giaHienThi: '' };
  return { ten: text.slice(0, gia.index).trim(), giaHienThi: gia[0].trim() };
}

for (const pet of PETS) {
  for (const band of BANDS) {
    // Mỗi tổ hợp bắt đầu từ trang sạch để tránh trạng thái dịch vụ còn sót.
    await page.goto('https://matpet.vn/spa', { waitUntil: 'load', timeout: 60_000 });
    await page.waitForTimeout(2200);

    await page.getByRole('button', { name: pet.button, exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Tiếp tục →' }).click();
    await page.waitForTimeout(800);

    await page.getByRole('button', { name: band, exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Tiếp tục →' }).click();
    await page.waitForTimeout(1100);

    const dvCombo = await docDichVu();

    // Chuyển sang tab "Dịch vụ lẻ" để thu thập cả nhóm lẻ.
    await page.getByRole('button', { name: 'Dịch vụ lẻ', exact: true }).click();
    await page.waitForTimeout(700);
    const dvLe = await docDichVu();

    const tatCa = new Map();
    for (const item of [...dvCombo, ...dvLe]) {
      const { ten, giaHienThi } = tachTenVaGia(item.text);
      if (!tatCa.has(ten)) {
        tatCa.set(ten, {
          ten,
          giaHienThi,
          laBaoGiaRieng: item.text.includes('Báo giá riêng'),
          laCombo: item.cls.includes('combo'),
        });
      }
    }

    for (const v of tatCa.values()) {
      rows.push({
        System: 'T2',
        Pet: pet.key,
        Band: band,
        Service: v.ten,
        Price: v.giaHienThi,
        Combo: v.laCombo ? 'Yes' : 'No',
        'BaoGiaRieng': v.laBaoGiaRieng ? 'Yes' : 'No',
      });
    }

    console.log(`${pet.key} ${band}: ${tatCa.size} dịch vụ`);
  }
}

const header = 'System,Pet,Band,Service,Price,Combo,BaoGiaRieng';
const body = rows
  .map((r) =>
    [r.System, r.Pet, r.Band, r.Service, r.Price, r.Combo, r.BaoGiaRieng]
      .map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v))
      .join(','),
  )
  .join('\n');

fs.mkdirSync('reports/raw', { recursive: true });
fs.writeFileSync('reports/raw/survey-T2-matrix.csv', `${header}\n${body}\n`, 'utf8');
fs.writeFileSync('reports/raw/survey-T2-matrix.json', JSON.stringify(rows, null, 2), 'utf8');
console.log(`\nTONG: ${rows.length} dong -> reports/raw/survey-T2-matrix.csv`);

await browser.close();
