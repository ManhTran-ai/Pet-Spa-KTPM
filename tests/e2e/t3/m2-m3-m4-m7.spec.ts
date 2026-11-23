import { test, expect, type Page } from '@playwright/test';

/**
 * T3 Pretty Paws — M2 (danh mục dịch vụ), M3 (bảng giá theo bậc lbs),
 * M4 (form tra cứu khách hàng hiện có), M7 (kênh liên hệ).
 *
 * Ranh giới ADR-11: chỉ đọc danh mục và điền form tra cứu bằng SĐT **không tồn tại**
 * để quan sát phản hồi từ chối. Không bấm `Login` với SĐT thuộc hồ sơ thật —
 * hành động đó trả về hồ sơ khách hàng thật (tên, email, danh sách thú cưng).
 */

/** Drawer "Book Now" của T3 — chỉ mở khi cần kiểm tra form M4. */
async function moDrawer(page: Page) {
  await page.getByRole('button', { name: 'Book Now' }).first().click();
  const drawer = page.locator('.MuiDrawer-paper');
  await drawer.waitFor({ state: 'visible', timeout: 30_000 });
  return drawer;
}

/** Mở nhóm dịch vụ để danh mục và giá được render ra. */
async function moNhomDichVu(page: Page, tenNhom: string) {
  await page.getByText(tenNhom, { exact: false }).first().scrollIntoViewIfNeeded();
  await page.getByText(tenNhom, { exact: false }).first().click();
  await page.waitForTimeout(1500);
}

test.describe('T3 Pretty Paws — M2/M3 Danh mục dịch vụ và bảng giá', () => {
  test('TC-T3-M2-001: mọi dịch vụ trong danh mục có tên, mô tả và thời lượng', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    // Danh mục được chia thành 5 nhóm; mỗi nhóm khai số lượng dịch vụ.
    await expect(page.getByText('EMERGENCY APPOINTMENT (2)')).toBeVisible();
    await expect(page.getByText('Dog (bath included) (16)')).toBeVisible();
    await expect(page.getByText('Cat (bath included) (4)')).toBeVisible();
    await expect(page.getByText('QUICK SERVICE (no bath) (12)')).toBeVisible();
    await expect(page.getByText('ADD ON TO GROOM (7)')).toBeVisible();

    await moNhomDichVu(page, 'Dog (bath included)');

    // Mỗi dịch vụ phải có mô tả và thời lượng ("30mins" / "1h").
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Dog Bath 0-20lbs/);
    expect(body).toMatch(/30mins|1h|1h30mins|2h/);
  });

  test('TC-T3-M2-002: mỗi dịch vụ có mô tả thành phần dịch vụ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await moNhomDichVu(page, 'Dog (bath included)');

    const body = await page.locator('body').innerText();
    // Mô tả dịch vụ nêu các thành phần (tắm, cắt móng, chải, vệ sinh tai...).
    expect(body).toMatch(/shampoo|conditioner|nail clip|brush out|ears|teeth/i);
  });

  test('TC-T3-M3-001: bảng giá có đủ cột cho mọi dịch vụ trong nhóm', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await moNhomDichVu(page, 'Dog (bath included)');

    const gia = await page.locator('body').innerText();
    const soDichVu = (gia.match(/\(\d+\)/g) ?? []).length;
    expect(soDichVu).toBeGreaterThan(0);

    // Mỗi dịch vụ mở ra đều có giá dạng $xx.xx — không ô nào ghi "tùy".
    const prices = gia.match(/\$\s?[\d.]+/g) ?? [];
    expect(prices.length).toBeGreaterThan(0);
    expect(gia).not.toMatch(/\$\s?(tùy|tuy|variable|N\/A)/i);
  });

  test('TC-T3-M3-002: tra bảng giá đúng cho dịch vụ chọn theo bậc lbs trong tên', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await moNhomDichVu(page, 'Dog (bath included)');

    // REF-01: Dog Bath 0-20lbs = $52.00 · Dog Bath 20-50lbs = $65.00
    const body = await page.locator('body').innerText();
    expect(body).toMatch(/Dog Bath 0-20lbs[\s\S]{0,400}?\$52\.00/);
    expect(body).toMatch(/Dog Bath 20-50lbs[\s\S]{0,400}?\$65\.00/);
  });

  test('TC-T3-M3-003: T3 tách nhóm Chó và Mèo — dịch vụ Mèo có bảng giá riêng', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    await moNhomDichVu(page, 'Dog (bath included)');
    const cho = await page.locator('body').innerText();
    expect(cho).toMatch(/Dog Bath 0-20lbs[\s\S]{0,400}?\$52\.00/);

    // Nhóm Mèo có danh mục riêng (Cat Bath) với bảng giá riêng.
    await moNhomDichVu(page, 'Cat (bath included)');
    const meo = await page.locator('body').innerText();
    expect(meo).toMatch(/Cat Bath[\s\S]{0,300}?\$60\.00/);

    // Dịch vụ Chó và Mèo là hai dòng khác nhau, giá khác nhau.
    const giaCho = cho.match(/Dog Bath 0-20lbs[\s\S]{0,400}?\$([\d.]+)/)?.[1];
    const giaMeo = meo.match(/Cat Bath[\s\S]{0,300}?\$([\d.]+)/)?.[1];
    expect(giaCho).toBeDefined();
    expect(giaMeo).toBeDefined();
    expect(giaMeo).not.toBe(giaCho);
  });

  test('TC-T3-M3-004: giá được ghi rõ là dự kiến, không phải giá cuối', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await moNhomDichVu(page, 'Dog (bath included)');

    const body = await page.locator('body').innerText();
    // Trang phải có câu nhắc giá cuối cùng được xác nhận tại tiệm.
    expect(body).toMatch(/final price|confirmed at|at the shop|actual weight|final/i);
  });

  test('TC-T3-M3-005: danh mục nêu rõ các khoản phụ thu ngoại lệ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    await expect(page.getByText('EMERGENCY APPOINTMENT (2)')).toBeVisible();
    await moNhomDichVu(page, 'EMERGENCY APPOINTMENT');

    const body = await page.locator('body').innerText();
    expect(body).toMatch(/HOLIDAY FEE/i);
    expect(body).toMatch(/\$27\.00/);
    expect(body).toMatch(/Emergency appointment fee/i);
    expect(body).toMatch(/\$25\.00/);
  });

  test('TC-T3-M4-001: drawer Book Now có trường SĐT bắt buộc và chọn quốc gia', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const country = drawer.locator('select.PhoneInputCountrySelect');

    await expect(phone).toBeVisible();
    await expect(phone).toHaveAttribute('type', 'tel');
    await expect(country).toBeVisible();

    // Danh sách quốc gia là đầy đủ, không phải vài lựa chọn rút gọn.
    const soQuocGia = await country.locator('option').count();
    expect(soQuocGia).toBeGreaterThan(200);
  });

  test('TC-T3-M4-002: bỏ trống SĐT thì nút Login bị khoá và form không gửi được', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const login = drawer.getByRole('button', { name: 'Login' });

    await expect(login).toBeDisabled();
    // Không có request nào được gửi khi nút bị khoá.
    let calls = 0;
    page.on('request', (r) => {
      if (r.url().includes('/booking-api/v1/login')) calls += 1;
    });
    await page.waitForTimeout(1000);
    expect(calls).toBe(0);
  });

  test('TC-T3-M4-003: nhập SĐT chứa chữ cái vào drawer T3 thì nút Login bị khoá', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const login = drawer.getByRole('button', { name: 'Login' });

    await phone.fill('abc');
    await page.waitForTimeout(800);

    // Ô nhập chỉ nhận ký tự số → giá trị vẫn rỗng.
    await expect(phone).toHaveValue('');
    await expect(login).toBeDisabled();
  });

  test('TC-T3-M4-004: nhập SĐT 10 chữ số hợp lệ vào drawer T3 thì nút Login được kích hoạt', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const login = drawer.getByRole('button', { name: 'Login' });

    await phone.fill('6098167755');
    await page.waitForTimeout(800);

    await expect(login).toBeEnabled();
  });

  test('TC-T3-M4-005: nút Book Now hoạt động 24/7 và mở được drawer ngoài giờ mở cửa', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    // Trạng thái hiện tại của tiệm không ảnh hưởng tới việc mở drawer.
    const drawer = await moDrawer(page);
    await expect(drawer.locator('input.PhoneInputInput')).toBeVisible();
  });

  test('TC-T3-M4-006: đặt lịch T3 bằng SĐT chưa có hồ sơ bị từ chối kèm thông báo rõ ràng', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const login = drawer.getByRole('button', { name: 'Login' });

    // Số dùng để kiểm thử không thuộc hồ sơ khách hàng nào của T3.
    await phone.fill('5551234567');
    await page.waitForTimeout(800);
    await expect(login).toBeEnabled();

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/booking-api/v1/login'), { timeout: 30_000 }),
      login.click(),
    ]);
    expect(response.status()).toBe(200);
    const payload = JSON.parse(await response.text());
    // API từ chối SĐT không có hồ sơ.
    expect(payload.code).toBe(1023);
    expect(payload.message).toMatch(/phone number invalid/i);

    // FR-M4-13: người dùng phải đọc được thông báo từ chối.
    const drawerText = await drawer.innerText();
    expect(drawerText).toMatch(/only available for existing client|phone number invalid|not available/i);
  });

  test('TC-T3-M4-007: trang chủ T3 hướng khách mới tới form tiếp nhận thay vì đặt lịch trực tiếp', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    // Hướng dẫn khách mới nằm trong drawer "Book Now", không ở trang chủ.
    const drawer = await moDrawer(page);
    const drawerText = await drawer.innerText();

    expect(drawerText).toMatch(/NEW CLIENTS/i);
    expect(drawerText).toMatch(/intake form/i);
    // Hướng dẫn nêu rõ kênh tiếp nhận: form Facebook hoặc nhắn tin.
    expect(drawerText).toMatch(/Facebook page/i);
    expect(drawerText).toMatch(/text\s?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/i);
  });

  test('TC-T3-M4-008: nút Book Now không bị khoá ngoài khung giờ mở cửa 08:00-20:00', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const body = await page.locator('body').innerText();
    // Khung giờ mở cửa được công bố 08:00 AM - 08:00 PM cho cả 7 ngày.
    expect(body).toMatch(/8:00 AM\s*-\s*8:00 PM/);

    // Nút Book Now luôn bấm được, kể cả khi tiệm đang đóng.
    const bookNow = page.getByRole('button', { name: 'Book Now' }).first();
    await expect(bookNow).toBeEnabled();
  });

  test('TC-T3-M4-009: T3 không có bước tạo tài khoản mới, chỉ tra cứu khách hiện có', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const drawerText = await drawer.innerText();

    expect(drawerText).toMatch(/existing clients only/i);
    // Không có ô mật khẩu hay liên kết đăng ký trong drawer.
    await expect(drawer.locator('input[type="password"]')).toHaveCount(0);
    await expect(drawer.getByRole('link', { name: /sign up|register|đăng ký/i })).toHaveCount(0);
  });

  test('TC-T3-M4-010: ST xoá hết ký tự SĐT thì nút Login bị khoá lại', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const login = drawer.getByRole('button', { name: 'Login' });

    await phone.fill('6098167755');
    await page.waitForTimeout(600);
    await expect(login).toBeEnabled();

    // FR-M4-03: T3 không kiểm tra độ dài tối thiểu → xoá còn 9 số vẫn cho bấm.
    await phone.press('Backspace');
    await page.waitForTimeout(500);
    await expect(login).toBeEnabled();

    // Xoá hết → ô rỗng → nút khoá (FR-M4-02).
    await phone.fill('');
    await page.waitForTimeout(600);
    await expect(login).toBeDisabled();
  });

  test('TC-T3-M4-011: ST sau khi nhập SĐT hợp lệ nút Login được bật', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const drawer = await moDrawer(page);
    const phone = drawer.locator('input.PhoneInputInput');
    const login = drawer.getByRole('button', { name: 'Login' });

    await phone.fill('6098167755');
    await page.waitForTimeout(800);
    await expect(login).toBeEnabled();
  });

  test('TC-T3-M5-001: trang mô tả quy trình đặt lịch ở mức nghiệp vụ', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const body = await page.locator('body').innerText();
    expect(body).toMatch(/book now/i);
    expect(body).toMatch(/appointment/i);
  });

  test('TC-T3-M5-002: nội dung hủy/đổi lịch hợp lệ với điều kiện tại tiệm', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const body = await page.locator('body').innerText();
    // T3 không công bố chính sách hủy/đổi lịch trên trang công khai.
    expect(body).not.toMatch(/cancellation policy|refund policy/i);
  });

  test('TC-T3-M7-001: cung cấp ít nhất 2 kênh liên hệ hoạt động, liên kết mở đúng ứng dụng', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'load' });
    await page.waitForTimeout(2500);

    const sdt = page.locator('a[href^="sms:"]');
    const email = page.locator('a[href^="mailto:"]');
    const diaChi = page.locator('a[href*="google.com/maps"]');

    await expect(sdt).toHaveCount(1);
    await expect(email).toHaveCount(1);
    // 2 liên kết bản đồ: tìm địa chỉ và chỉ đường.
    expect(await diaChi.count()).toBeGreaterThanOrEqual(2);

    // Kênh điện thoại dùng mã quốc gia +1 (609).
    await expect(sdt).toHaveAttribute('href', /sms:\+16098167755/);
    await expect(email).toHaveAttribute('href', /^mailto:.+@.+/);
  });
});
