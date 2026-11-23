import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M2-01, FR-M2-06 — T3 Pretty Paws (đối chiếu chéo, Ngân).
 *
 * TC-T3-M2-007: số dịch vụ niêm yết khớp bảng giá mục 3 của SRS.
 * TC-T3-M2-008: danh mục phân biệt dịch vụ cho chó và dịch vụ cho mèo.
 *
 * Nguồn đối chiếu: `reports/raw/survey-T3-services.json` (API
 * `booking-api/v1/service?booking_page=1`) và `reports/raw/survey-T3-ui-prices.csv`.
 *
 * ADR-11: chỉ đọc danh mục, không mở drawer đặt lịch.
 */

/** Nhóm dịch vụ trên UI: tên + số lượng khai báo trong nhãn "(n)". */
const NHOM_UI: { ten: string; soLuong: number }[] = [
  { ten: 'EMERGENCY APPOINTMENT', soLuong: 2 },
  { ten: 'Dog (bath included)', soLuong: 16 },
  { ten: 'Cat (bath included)', soLuong: 4 },
  { ten: 'QUICK SERVICE (no bath)', soLuong: 12 },
  { ten: 'ADD ON TO GROOM', soLuong: 7 },
];

type Nhom = { ten: string; dichVu: string[] };

async function moTrangChu(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('.NameAndDesc-name').first().waitFor({ state: 'attached', timeout: 20_000 });
  await page.waitForTimeout(1_500);
}

/**
 * Gom danh mục theo nhóm. Cấu trúc DOM: mỗi nhóm là một `li` header
 * (`.MuiListItemText-primary`) kèm ngay sau là `div.MuiCollapse-root` chứa
 * các dịch vụ của nhóm đó.
 */
async function docDanhMucTheoNhom(page: Page): Promise<Nhom[]> {
  const danhSach = await page.evaluate(() => {
    const ul = Array.from(document.querySelectorAll('ul.MuiList-root')).find((u) =>
      u.querySelector('.NameAndDesc-name'),
    );
    if (!ul) return [];

    const nhom: { ten: string; dichVu: string[] }[] = [];
    for (const con of Array.from(ul.children)) {
      const header = con.querySelector('.MuiListItemText-primary')?.textContent?.trim();
      if (header) {
        nhom.push({ ten: header.replace(/\s*\(\d+\)\s*$/, ''), dichVu: [] });
        continue;
      }
      const dichVu = Array.from(con.querySelectorAll('.NameAndDesc-name')).map(
        (el) => el.textContent?.trim() ?? '',
      );
      const nhomHienTai = nhom[nhom.length - 1];
      if (dichVu.length > 0 && nhomHienTai) nhomHienTai.dichVu.push(...dichVu);
    }
    return nhom;
  });
  return danhSach;
}

test.describe('T3 Pretty Paws — M2 Danh mục dịch vụ', () => {
  test('TC-T3-M2-007: số dịch vụ niêm yết khớp bảng giá mục 3 của SRS', async ({ page }) => {
    await moTrangChu(page);

    const tongKhai = NHOM_UI.reduce((sum, n) => sum + n.soLuong, 0);
    expect(tongKhai).toBe(41);

    const danhMuc = await docDanhMucTheoNhom(page);
    expect(danhMuc.map((n) => n.ten)).toEqual(NHOM_UI.map((n) => n.ten));

    // Số lượng thực tế trong từng nhóm phải khớp con số trong nhãn "(n)".
    for (const [index, nhom] of NHOM_UI.entries()) {
      const thucTe = danhMuc[index];
      expect(thucTe?.dichVu.length, `Nhóm "${nhom.ten}"`).toBe(nhom.soLuong);
    }

    // Tổng số dịch vụ niêm yết khớp bảng giá mục 3 của SRS.
    const tongHienThi = danhMuc.reduce((sum, n) => sum + n.dichVu.length, 0);
    expect(tongHienThi, `Tổng dịch vụ UI ${tongHienThi}, khai báo ${tongKhai}`).toBe(tongKhai);

    // Mỗi dịch vụ có đủ giá và thời lượng (FR-M2-01).
    const thieu = await page.evaluate(() =>
      [...document.querySelectorAll('.MuiListItem-root')]
        .filter((li) => li.querySelector('.NameAndDesc-name'))
        .filter(
          (li) =>
            !li.querySelector('.PriceAndDuration-price') ||
            !li.querySelector('.PriceAndDuration-duration'),
        )
        .map((li) => li.querySelector('.NameAndDesc-name')?.textContent?.trim() ?? ''),
    );
    expect(thieu, `Dịch vụ thiếu giá/thời lượng: ${thieu.join(', ')}`).toEqual([]);
  });

  test('TC-T3-M2-008: danh mục phân biệt dịch vụ cho chó và dịch vụ cho mèo', async ({ page }) => {
    await moTrangChu(page);

    const danhMuc = await docDanhMucTheoNhom(page);

    // Đúng 2 nhóm dịch vụ riêng cho chó và mèo.
    const nhomCho = danhMuc.find((n) => n.ten.startsWith('Dog (bath included)'));
    const nhomMeo = danhMuc.find((n) => n.ten.startsWith('Cat (bath included)'));
    expect(nhomCho, 'Nhóm dịch vụ cho chó').toBeDefined();
    expect(nhomMeo, 'Nhóm dịch vụ cho mèo').toBeDefined();
    if (!nhomCho || !nhomMeo) throw new Error('Thiếu nhóm dịch vụ chó hoặc mèo');

    // Tên dịch vụ trong nhóm chó bắt đầu bằng "Dog", nhóm mèo bắt đầu bằng "Cat".
    expect(nhomCho.dichVu.every((t) => /^Dog\b/.test(t)), 'Nhóm chó chỉ có dịch vụ bắt đầu "Dog"').toBe(true);
    expect(nhomMeo.dichVu.every((t) => /^Cat\b/.test(t)), 'Nhóm mèo chỉ có dịch vụ bắt đầu "Cat"').toBe(true);

    expect(nhomCho.dichVu.length, 'Số dịch vụ cho chó').toBe(16);
    expect(nhomMeo.dichVu.length, 'Số dịch vụ cho mèo').toBe(4);

    // Hai nhóm không trùng tên — chó và mèo là dịch vụ khác nhau.
    const trung = nhomCho.dichVu.filter((t) => nhomMeo.dichVu.includes(t));
    expect(trung, `Dịch vụ chó/mèo trùng tên: ${trung.join(', ')}`).toEqual([]);
  });
});
