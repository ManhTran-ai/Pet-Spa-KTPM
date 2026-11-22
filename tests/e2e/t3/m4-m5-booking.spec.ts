import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M4-05, FR-M4-07, FR-M4-11, FR-M5-06 — T3 Pretty Paws (đối chiếu chéo, Ngân).
 *
 *   TC-T3-M4-005: luồng đặt lịch T3 không có bước chọn ngày ở bước nhập SĐT
 *   TC-T3-M4-006: bước chọn dịch vụ hiển thị đầy đủ, không dịch vụ nào vô hình
 *   TC-T3-M4-008: nút "Book Now" hoạt động ngoài giờ mở cửa (FR-M4-11, BR-13)
 *   TC-T3-M5-003: khung giờ ngoài giờ mở cửa phải bị từ chối kèm lý do (FR-M5-06)
 *   TC-T3-M5-004: khung giờ nằm trong giờ mở cửa được chấp nhận (FR-M5-06)
 *
 * Ranh giới ADR-11: chỉ đọc. Không bấm nút gửi cuối cùng, không tạo lịch.
 *
 * Về FR-M5-06: màn chọn khung giờ của T3 nằm sau bước đăng nhập khách hàng
 * cũ (`POST /booking-api/v1/login` trả `code 7002` cho khách mới), nên
 * không thể thao tác chọn khung giờ trên giao diện mà không tạo lịch.
 * Oracle thay thế là endpoint công khai `GET /booking-api/v1/available-time` —
 * chính là nguồn dữ liệu mà màn hình khung giờ dùng để vẽ lịch. Mọi khung
 * giờ mà endpoint trả về đều là khung giờ mà khách có thể chọn, nên:
 *   - khung giờ nằm ngoài 08:00–20:00 mà vẫn được trả về → vi phạm FR-M5-06
 *     và BR-13 (xem DEF-032);
 *   - khung giờ nằm trong 08:00–20:00 → được chấp nhận.
 */

/** Giờ mở cửa khai trong `book-online-setting` (BR-13): 08:00–20:00, múi giờ New York. */
const MO_GIO = 8 * 60;
const DONG_GIO = 20 * 60;

/** Nhóm dịch vụ và số lượng khai trong SRS-01 §3 / BR-03. */
const NHOM: { ten: string; soLuong: number }[] = [
  { ten: 'EMERGENCY APPOINTMENT', soLuong: 2 },
  { ten: 'Dog (bath included)', soLuong: 16 },
  { ten: 'Cat (bath included)', soLuong: 4 },
  { ten: 'QUICK SERVICE (no bath)', soLuong: 12 },
  { ten: 'ADD ON TO GROOM', soLuong: 7 },
];

/** Dịch vụ dùng để dò khung giờ (lấy từ `reports/raw/survey-T3-services.json`). */
const DICH_VU_DO = [
  { ten: 'Dog Bath 20-50lbs', id: 293693, duration: 30, price: 6500 },
  { ten: 'Cat Bath', id: 293691, duration: 30, price: 6000 },
];

async function moTrangChu(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('.NameAndDesc-name').first().waitFor({ state: 'attached', timeout: 20_000 });
  await page.waitForTimeout(1_500);
}

/** Mở (hoặc thu gọn) một nhóm dịch vụ và chờ nội dung render xong. */
async function batNhom(page: Page, tenNhom: string): Promise<void> {
  await page.locator('.MuiListItemText-primary', { hasText: tenNhom }).first().click();
  await page.waitForTimeout(1_200);
}

type DichVu = { ten: string; gia: string; thoiLuong: string; hienThi: boolean };

/**
 * Đọc các dịch vụ thuộc một nhóm.
 *
 * Cấu trúc DOM của T3: `ul.MuiList-root` chứa xen kẽ `li` tiêu đề nhóm và
 * `div.MuiCollapse-root` chứa các `li` dịch vụ của nhóm đó.
 */
async function docDichVuTrongNhom(page: Page, tenNhom: string): Promise<DichVu[]> {
  return page.evaluate((ten) => {
    const headers = Array.from(document.querySelectorAll('.MuiListItemText-primary'));
    const index = headers.findIndex((h) => h.textContent?.trim().startsWith(ten));
    if (index < 0) return [];
    const header = headers[index];
    if (!header) return [];
    const ul = header.closest('ul');
    if (!ul) return [];

    const children = Array.from(ul.children);
    const viTri = children.indexOf(header.closest('li') ?? header);
    const collapse = children
      .slice(viTri + 1)
      .find((c) => c.classList.contains('MuiCollapse-root'));
    if (!collapse) return [];

    return Array.from(collapse.querySelectorAll('.MuiListItem-root'))
      .filter((li) => li.querySelector('.NameAndDesc-name'))
      .map((li) => {
        const style = getComputedStyle(li);
        const rect = li.getBoundingClientRect();
        return {
          ten: li.querySelector('.NameAndDesc-name')?.textContent?.trim() ?? '',
          gia: li.querySelector('.PriceAndDuration-price')?.textContent?.trim() ?? '',
          thoiLuong: li.querySelector('.PriceAndDuration-duration')?.textContent?.trim() ?? '',
          hienThi: style.visibility !== 'hidden' && style.display !== 'none' && rect.height > 0,
        };
      });
  }, tenNhom);
}

/**
 * Đặt đồng hồ trình duyệt về một giờ cụ thể theo giờ địa phương của máy chạy test.
 * Dùng để kiểm tra hành vi ngoài giờ mở cửa mà không cần chờ thật.
 */
async function giaDongHocVeGio(page: Page, gio: number): Promise<void> {
  await page.addInitScript((gioCanDat) => {
    const Moc = Date;
    const hienTai = new Moc();
    const lech =
      gioCanDat * 3_600_000 -
      (hienTai.getHours() * 3_600_000 +
        hienTai.getMinutes() * 60_000 +
        hienTai.getSeconds() * 1_000 +
        hienTai.getMilliseconds());
    const mocGoc = hienTai.getTime();

    class DoiGio extends Moc {
      constructor(value?: ConstructorParameters<typeof Date>[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super((value === undefined ? mocGoc : (value as number)) as any);
      }
      static now(): number {
        return mocGoc + lech;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Date as any) = DoiGio;
  }, gio);
}

/** Dò khung giờ T3 công khai trong 30 ngày tới cho 2 dịch vụ đại diện. */
async function kiemTraKhungGio(
  page: Page,
): Promise<{ trong: string[]; ngoai: string[] }> {
  const raw = await page.evaluate(async (dichVu) => {
    const dinhDang = (d: Date) => d.toISOString().slice(0, 10);
    const hom = new Date();
    const start = dinhDang(hom);
    const end = dinhDang(new Date(hom.getTime() + 30 * 24 * 3600 * 1000));

    const ketQua: { ten: string; slot: number }[] = [];
    for (const dv of dichVu) {
      const params = new URLSearchParams({
        service_ids: String(dv.id),
        duration: String(dv.duration),
        start_date: start,
        end_date: end,
        services: JSON.stringify([
          { pet_id: 0, service_id: dv.id, price: dv.price, duration: dv.duration },
        ]),
        pets: JSON.stringify([{ pet_id: 0, weight: 0 }]),
      });
      const res = await fetch(`/booking-api/v1/available-time?${params.toString()}`);
      const json = await res.json();
      const list = json?.data?.list ?? {};
      for (const [ngay, v] of Object.entries<Record<string, unknown>>(list)) {
        const staff = (v?.available_staff ?? []) as { staff_available_time?: number[] }[];
        for (const st of staff) {
          for (const phut of st?.staff_available_time ?? []) {
            ketQua.push({ ten: `${dv.ten} ${ngay}`, slot: phut });
          }
        }
      }
    }
    return ketQua;
  }, DICH_VU_DO);

  const hienThi = (phut: number) =>
    `${String(Math.floor(phut / 60)).padStart(2, '0')}:${String(phut % 60).padStart(2, '0')}`;

  const trong: string[] = [];
  const ngoai: string[] = [];
  for (const r of raw) {
    const nhan = `${r.ten} ${hienThi(r.slot)}`;
    if (r.slot >= MO_GIO && r.slot < DONG_GIO) trong.push(nhan);
    else ngoai.push(nhan);
  }
  return { trong, ngoai };
}

test.describe('T3 Pretty Paws — M4/M5 Luồng đặt lịch và khung giờ', () => {
  test('TC-T3-M4-005: bước nhập SĐT của T3 không có ô chọn ngày', async ({ page }) => {
    await moTrangChu(page);

    await page.getByRole('button', { name: 'Book Now' }).first().click();
    await page.waitForTimeout(2_500);

    const drawer = page.locator('.MuiDrawer-paper').first();
    await expect(drawer).toBeVisible();

    // Bước đầu của luồng chỉ có: chọn quốc gia + nhập số điện thoại + nút Login.
    await expect(page.getByPlaceholder('Mobile number').first()).toBeVisible();
    await expect(drawer.getByRole('button', { name: 'Login' }).first()).toBeVisible();

    // Không có ô nhập ngày / date picker ở bước này.
    const soOngNgay = await drawer
      .locator('input[type="date"], input[type="datetime-local"]')
      .count();
    expect(soOngNgay, 'Số ô nhập ngày ở bước nhập SĐT').toBe(0);

    const coDatePicker = await drawer
      .locator(
        '.MuiDatePicker-root, [role="dialog"][aria-label*="date" i], input[placeholder*="date" i]',
      )
      .count();
    expect(coDatePicker, 'Số date picker ở bước nhập SĐT').toBe(0);
  });

  test('TC-T3-M4-006: mở nhóm nào thì dịch vụ trong nhóm đó hiện đủ, không vô hình', async ({
    page,
  }) => {
    await moTrangChu(page);

    let tong = 0;
    for (const nhom of NHOM) {
      await batNhom(page, nhom.ten);

      const dichVu = await docDichVuTrongNhom(page, nhom.ten);
      expect(dichVu.length, `Số dịch vụ trong nhóm "${nhom.ten}"`).toBe(nhom.soLuong);

      const voHinh = dichVu.filter((d) => !d.hienThi).map((d) => d.ten);
      expect(voHinh, `Dịch vụ không hiển thị trong nhóm "${nhom.ten}"`).toEqual([]);

      const thieuGia = dichVu.filter((d) => !d.gia || !d.thoiLuong).map((d) => d.ten);
      expect(thieuGia, `Dịch vụ thiếu giá/thời lượng trong nhóm "${nhom.ten}"`).toEqual([]);

      tong += dichVu.length;

      // Thu gọn nhóm lại để nhóm kế tiếp mở đúng.
      await batNhom(page, nhom.ten);
    }

    expect(tong, 'Tổng số dịch vụ hiển thị').toBe(41);
  });

  test('TC-T3-M4-008: nút Book Now vẫn hoạt động ngoài giờ mở cửa', async ({ page }) => {
    // Giờ tại tiệm là 23:00 — nằm ngoài khung 08:00–20:00.
    await giaDongHocVeGio(page, 23);

    await moTrangChu(page);

    const nut = page.getByRole('button', { name: 'Book Now' }).first();
    await expect(nut).toBeVisible();
    await expect(nut).toBeEnabled();

    await nut.click();
    await page.waitForTimeout(2_500);

    // Drawer đặt lịch mở được → nút hoạt động 24/7 (FR-M4-11, BR-13).
    await expect(page.getByPlaceholder('Mobile number').first()).toBeVisible();
  });

  test('TC-T3-M5-003: khung giờ ngoài giờ mở cửa phải bị từ chối kèm lý do', async ({ page }) => {
    await moTrangChu(page);

    const { ngoai } = await kiemTraKhungGio(page);
    expect(
      ngoai.length,
      `T3 trả về khung giờ ngoài 08:00–20:00: ${ngoai.slice(0, 10).join('; ')}`,
    ).toBe(0);
  });

  test('TC-T3-M5-004: khung giờ nằm trong giờ mở cửa được chấp nhận', async ({ page }) => {
    await moTrangChu(page);

    const { trong } = await kiemTraKhungGio(page);
    expect(trong.length, 'Số khung giờ trong 08:00–20:00').toBeGreaterThan(0);
  });
});
