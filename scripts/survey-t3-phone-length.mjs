import { chromium } from '@playwright/test';
import fs from 'node:fs';

/**
 * Xác định ngưỡng độ dài SĐT mà nút Login của T3 được bật (Ngày 4 — Ngân).
 *
 * Phục vụ thiết kế BVA cho FR-M4-03 ("số không đủ độ dài bị từ chối hoặc
 * cảnh báo"). ADR-11: chỉ quan sát trạng thái nút, không bấm Login.
 *
 * Đầu ra: `reports/raw/survey-T3-phone-length.csv`
 */
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
await page.waitForTimeout(4000);
await page.getByRole('button', { name: 'Book Now' }).first().click();
await page.waitForTimeout(4000);

const oSDT = page.getByPlaceholder('Mobile number').first();
const rows = [['Input_Digits', 'Rendered_Value', 'Login_Disabled', 'Warning_Shown', 'Note']];

for (let doDai = 0; doDai <= 11; doDai += 1) {
  const sdt = '6095550199'.slice(0, doDai);
  await oSDT.fill(sdt);
  await page.waitForTimeout(500);

  const trangThai = await page.evaluate(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    const nut = [...(drawer?.querySelectorAll('button') ?? [])].find(
      (b) => b.textContent.trim() === 'Login',
    );
    const loi = [...(drawer?.querySelectorAll('.MuiFormHelperText-root, [role="alert"]') ?? [])]
      .map((el) => el.textContent.trim())
      .filter(Boolean);
    return {
      disabled: nut ? nut.disabled : null,
      value: document.querySelector('input[placeholder="Mobile number"]')?.value ?? '',
      loi,
    };
  });

  rows.push([
    String(doDai),
    trangThai.value,
    String(trangThai.disabled),
    trangThai.loi.join(' | '),
    doDai === 0
      ? 'Ô trống — nút bị khoá'
      : doDai === 1
        ? 'Chỉ 1 ký tự — nút đã bật, không có cảnh báo độ dài tối thiểu'
        : '',
  ]);

  console.log(
    `nhập ${doDai} ký tự → "${trangThai.value}" · Login disabled=${trangThai.disabled}` +
      (trangThai.loi.length ? ` · cảnh báo: ${trangThai.loi.join(' | ')}` : ''),
  );
}

await browser.close();

const csv = rows.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
fs.writeFileSync('reports/raw/survey-T3-phone-length.csv', `\uFEFF${csv}\n`, 'utf8');
console.log(`\nsurvey-T3-phone-length.csv: ${rows.length - 1} dòng`);
