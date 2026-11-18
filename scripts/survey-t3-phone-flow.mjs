import { chromium } from '@playwright/test';

/**
 * Khảo sát hành vi validation của ô SĐT trong luồng đặt lịch T3 (Ngày 4 — Ngân).
 *
 * Mục đích thiết kế test cho FR-M4-02 (bỏ trống trường bắt buộc), FR-M4-03
 * (định dạng số điện thoại), FR-M4-12 (không cần đăng nhập).
 *
 * ADR-11: KHÔNG bấm Login/Send khi ô đã hợp lệ — chỉ kiểm tra trạng thái nút
 * và thông báo lỗi. Số dùng để thử nằm trong dải 555-01xx dành riêng cho
 * số giả, không thuộc số thật của ai.
 */
const browser = await chromium.launch({ channel: 'chrome' });

const truongHop = [
  { ten: 'để trống', sdt: '' },
  { ten: 'chữ cái', sdt: 'abcdefghijk' },
  { ten: 'quá ngắn (5 số)', sdt: '60955' },
  { ten: 'hợp lệ (số giả dải 555)', sdt: '6095550199' },
];

for (const tc of truongHop) {
  const page = await browser.newPage();
  await page.goto('https://prettypawscatanddoggrooming.groomore.com/', { waitUntil: 'load', timeout: 60_000 });
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: 'Book Now' }).first().click();
  await page.waitForTimeout(4000);

  const oSDT = page.getByPlaceholder('Mobile number').first();
  if (tc.sdt) await oSDT.fill(tc.sdt);
  await page.waitForTimeout(800);

  const ketQua = await page.evaluate(() => {
    const drawer = document.querySelector('.MuiDrawer-paper');
    const nut = [...(drawer?.querySelectorAll('button') ?? [])].find(
      (b) => b.textContent.trim() === 'Login',
    );
    const loi = [...(drawer?.querySelectorAll('[class*="rror"], [role="alert"], .MuiFormHelperText-root') ?? [])]
      .map((el) => el.textContent.trim())
      .filter(Boolean);
    return {
      nutLoginDisabled: nut ? nut.disabled : null,
      thongBaoLoi: loi,
      inputValue: document.querySelector('input[placeholder="Mobile number"]')?.value ?? '',
    };
  });

  console.log(`\n${tc.ten}: value="${ketQua.inputValue}" · Login disabled=${ketQua.nutLoginDisabled}`);
  if (ketQua.thongBaoLoi.length) console.log(`  thông báo: ${ketQua.thongBaoLoi.join(' | ')}`);

  await page.close();
}

await browser.close();
