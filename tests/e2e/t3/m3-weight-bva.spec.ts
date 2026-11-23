import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M3-02 — T3 Pretty Paws (đối chiếu chéo, Ngân).
 *
 * BVA theo BR-03 (SRS §6): ngưỡng cân nặng của T3 **khác nhau theo từng dòng
 * sản phẩm**, mã hoá trong tên dịch vụ. T3 không có ô nhập cân nặng.
 *
 *   TC-T3-M3-006: 19 lbs thuộc bậc 0-20lbs (Dog Bath)
 *   TC-T3-M3-007: 20 lbs thuộc bậc 0-20lbs (Dog Bath)
 *   TC-T3-M3-008: 21 lbs thuộc bậc 20-50lbs (Dog Bath)
 *   TC-T3-M3-009: 60 lbs thuộc bậc 41-60lbs (Dog Full Groom)
 *   TC-T3-M3-010: 61 lbs thuộc bậc 61-78lbs (Dog Full Groom)
 *
 * Vì T3 không cho nhập cân nặng, cách kiểm chứng duy nhất là đối chiếu
 * **tên dịch vụ mà khách chọn** với bậc cân nặng tương ứng: tên dịch vụ phải
 * bao hàm đúng dải chứa trọng số cân nặng, và mức giá phải đúng ô của bậc đó.
 *
 * ADR-11: chỉ đọc danh mục, không mở drawer đặt lịch.
 */

/**
 * Bậc cân nặng (lbs) theo BR-03. Khoảng được **parse từ chính tên dịch vụ**
 * để không phụ thuộc vào khoảng trắng/hoa thường mà T3 dùng không nhất quán
 * (ví dụ `Dog Full groom 61 - 78lbs` vs `Dog Full Groom 41 - 60lbs`).
 */
const BAC_CUA_DONG: Record<string, { ten: string; gia: string }[]> = {
  'Dog Bath': [
    { ten: 'Dog Bath 0-20lbs', gia: '$52.00' },
    { ten: 'Dog Bath 20-50lbs', gia: '$65.00' },
  ],
  'Dog Full Groom': [
    { ten: 'Dog Full Groom  0 - 20 lbs', gia: '$69.00' },
    { ten: 'Dog Full groom 21 - 30lbs', gia: '$77.00' },
    { ten: 'Dog Full Groom  31 - 40lbs', gia: '$86.00' },
    { ten: 'Dog Full Groom 41 - 60lbs', gia: '$102.00' },
    { ten: 'Dog Full groom 61 - 78lbs', gia: '$121.00' },
    { ten: 'Dog Full groom 79 - 90lbs', gia: '$136.00' },
    { ten: 'Dog Full Groom 91-100+ pounds', gia: '$175.00' },
  ],
};

/** Chuẩn hoá: bỏ khoảng trắng thừa + bỏ khoảng trắng quanh dấu `-`. */
function chuanHoa(s: string): string {
  return s.replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-').trim();
}

/** Bậc cân nặng khai trong tên dịch vụ, ví dụ `... 61-78lbs` → { min: 61, max: 78 }. */
function khoang(trongTen: string): { min: number; max: number } | null {
  const m = trongTen.match(/(\d+)\s*-\s*(\d+)/);
  if (!m) return null;
  return { min: Number(m[1]), max: Number(m[2]) };
}

type DichVu = { ten: string; tenChuanHoa: string; gia: string; thoiLuong: string };

async function moTrangChu(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('.NameAndDesc-name').first().waitFor({ state: 'attached', timeout: 20_000 });
  await page.waitForTimeout(1_500);
}

async function docDanhMuc(page: Page): Promise<DichVu[]> {
  const raw = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.MuiListItem-root'))
      .filter((li) => li.querySelector('.NameAndDesc-name'))
      .map((li) => ({
        ten: li.querySelector('.NameAndDesc-name')?.textContent?.trim() ?? '',
        gia: li.querySelector('.PriceAndDuration-price')?.textContent?.trim() ?? '',
        thoiLuong: li.querySelector('.PriceAndDuration-duration')?.textContent?.trim() ?? '',
      })),
  );
  return raw.map((d) => ({ ...d, tenChuanHoa: chuanHoa(d.ten) }));
}

/**
 * Dịch vụ duy nhất của dòng sản phẩm mà bậc chứa `canNang` lbs.
 *
 * Quy ước chống chồng lấn: khi hai bậc cùng bao hàm một mốc (BR-03 khai
 * `Dog Bath` là `0–20` rồi `20–50`, chồng lấn tại 20 lbs), **bậc có mốc dưới
 * nhỏ hơn được ưu tiên** — tức mốc thuộc bậc dưới, bậc trên bắt đầu từ mốc + 1.
 */
function traBach(danhMuc: DichVu[], dong: string, canNang: number): DichVu {
  const bang = BAC_CUA_DONG[dong];
  if (!bang) throw new Error(`Không khai báo dòng sản phẩm "${dong}"`);
  const khop = danhMuc
    .filter((d) => bang.some((b) => chuanHoa(b.ten) === d.tenChuanHoa))
    .map((d) => ({ d, khoang: khoang(d.ten) }))
    .filter((x) => x.khoang !== null)
    .filter((x) => canNang >= x.khoang!.min && canNang <= x.khoang!.max)
    .sort((a, b) => a.khoang!.min - b.khoang!.min);

  expect(
    khop.length,
    `Không tìm thấy dịch vụ cho ${canNang} lbs trong dòng ${dong}`,
  ).toBeGreaterThan(0);

  // Chỉ bậc đầu tiên (mốc dưới nhỏ nhất) được chấp nhận → không chồng lấn.
  const bac = khop[0];
  if (!bac) throw new Error(`Không có bậc nào khớp ${canNang} lbs trong dòng ${dong}`);
  const kyVong = bang.find((b) => chuanHoa(b.ten) === bac.d.tenChuanHoa);
  expect(kyVong, `Không khai báo bậc cho ${bac.d.ten}`).toBeDefined();
  expect(bac.d.gia, `Giá của bậc "${bac.d.ten}"`).toBe(kyVong!.gia);
  return bac.d;
}

test.describe('T3 Pretty Paws — M3 BVA ngưỡng cân nặng theo BR-03', () => {
  test('TC-T3-M3-006: 19 lbs thuộc bậc 0-20lbs (Dog Bath)', async ({ page }) => {
    await moTrangChu(page);
    const dv = traBach(await docDanhMuc(page), 'Dog Bath', 19);
    expect(dv.tenChuanHoa).toBe('Dog Bath 0-20lbs');
  });

  test('TC-T3-M3-007: 20 lbs thuộc bậc 0-20lbs (Dog Bath)', async ({ page }) => {
    await moTrangChu(page);
    const dv = traBach(await docDanhMuc(page), 'Dog Bath', 20);
    expect(dv.tenChuanHoa).toBe('Dog Bath 0-20lbs');
  });

  test('TC-T3-M3-008: 21 lbs thuộc bậc 20-50lbs (Dog Bath)', async ({ page }) => {
    await moTrangChu(page);
    const dv = traBach(await docDanhMuc(page), 'Dog Bath', 21);
    expect(dv.tenChuanHoa).toBe('Dog Bath 20-50lbs');
  });

  test('TC-T3-M3-009: 60 lbs thuộc bậc 41-60lbs (Dog Full Groom)', async ({ page }) => {
    await moTrangChu(page);
    const dv = traBach(await docDanhMuc(page), 'Dog Full Groom', 60);
    expect(dv.tenChuanHoa).toBe('Dog Full Groom 41-60lbs');
  });

  test('TC-T3-M3-010: 61 lbs thuộc bậc 61-78lbs (Dog Full Groom)', async ({ page }) => {
    await moTrangChu(page);
    const dv = traBach(await docDanhMuc(page), 'Dog Full Groom', 61);
    expect(dv.tenChuanHoa).toBe('Dog Full groom 61-78lbs');
  });
});
