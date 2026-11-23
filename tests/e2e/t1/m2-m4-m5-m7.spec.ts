import { test, expect, type Page } from '@playwright/test';

/**
 * T1 Pet NGON — M2 (phan biet dich vu tai spa / tai nha),
 * M4 (buoc chon dich vu, quay lai, khong yeu cau dang nhap),
 * M5 (FAQ), M7 (kenh lien he).
 *
 * Ranh gioi ADR-11: chi doc trang va dieu wizard toi buoc 4,
 * KHONG bam "Xac nhan dat lich" de khong tao lich hen that.
 */

const T1 = 'https://petngon.vn/vi';

async function moTrang(page: Page) {
  await page.goto(T1, { waitUntil: 'load' });
  await page.waitForTimeout(2000);
}

/** Mở wizard, chọn loài + bậc cân nặng, đi tới bước 3 (Lịch hẹn). */
async function toiBuocLichHen(page: Page) {
  await moTrang(page);
  await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
  const overlay = page.locator('.bk-overlay');
  await overlay.waitFor({ state: 'visible', timeout: 30_000 });
  const next = () => overlay.locator('button').filter({ hasText: 'Tiếp tục' });

  await overlay.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
  await page.waitForTimeout(400);
  await overlay.locator('.bk-pet').filter({ hasText: 'Chó' }).first().click();
  await page.waitForTimeout(900);
  await next().click();
  await page.waitForTimeout(1200);

  await overlay.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
  await page.waitForTimeout(700);
  await overlay.locator('.bk-input').first().fill('Bé Kiểm Thử');
  await page.waitForTimeout(500);
  await next().click();
  await page.waitForTimeout(1500);

  return overlay;
}

test.describe('T1 Pet NGON — M2 Phân biệt dịch vụ tại spa và tại nhà', () => {
  test('TC-T1-M2-004: dịch vụ hỗ trợ tại nhà được đánh dấu rõ ràng', async ({ page }) => {
    await moTrang(page);

    // FR-M2-03: mỗi dịch vụ có 1 nhãn — "Có tận nhà" khi hỗ trợ tại nhà,
    // "Chỉ tại spa" khi không hỗ trợ tại nhà.
    const nhanTaiNha = page.locator('.hm-svc__home.is-on');
    await expect(nhanTaiNha.first()).toBeVisible();

    // Không dịch vụ nào thiếu nhãn: mọi card đều có badge trạng thái tại nhà.
    const soCard = await page.locator('.hm-svc').count();
    const soCoNhan = await page.locator('.hm-svc__home').count();
    expect(soCoNhan).toBe(soCard);

    // Nhãn phải ghi rõ chữ, không chỉ là icon.
    const texts = await page.locator('.hm-svc__home').allInnerTexts();
    for (const t of texts) {
      expect(t).toMatch(/Có tận nhà|Chỉ tại spa/i);
    }
  });

  test('TC-T1-M2-005: gói phí biến đổi được đánh dấu rõ ràng', async ({ page }) => {
    await moTrang(page);

    // FR-M2-05: gói phí biến đổi có 1 nhãn đánh dấu. T1 hiển thị giá theo bậc
    // cân nặng bằng nhãn tiền tố "Từ" trong khối giá của card.
    const gia = page.locator('.hm-svc .hm-svc__price');
    const soGia = await gia.count();
    expect(soGia).toBeGreaterThan(0);

    let soBienDoi = 0;
    for (let i = 0; i < soGia; i += 1) {
      const text = await gia.nth(i).innerText();
      // Giá biến đổi theo cân nặng: có tiền tố "Từ" hoặc hiển thị khoảng "a₫ – b₫".
      if (/^\s*TỪ/i.test(text) || /\d+\s*₫\s*–\s*\d+\s*₫/.test(text)) {
        soBienDoi += 1;
      }
    }
    // 100% gói đang hiển thị đều có dấu hiệu giá biến đổi theo cân nặng.
    expect(soBienDoi).toBe(soGia);
  });

  test('TC-T1-M2-006: mọi gói tại nhà ghi rõ mức phụ thu cố định thêm', async ({ page }) => {
    await moTrang(page);

    // FR-M2-05: 100% gói tại nhà ghi rõ mức phụ thu cố định bằng số.
    const ghiChu = page.locator('.hm-svc__home-note');
    const soGhiChu = await ghiChu.count();
    expect(soGhiChu).toBeGreaterThan(0);

    for (let i = 0; i < soGhiChu; i += 1) {
      const text = await ghiChu.nth(i).innerText();
      expect(text).toMatch(/Phụ thu tận nhà/i);
      // Mức phụ thu phải là con số, không phải "liên hệ" hay để trống.
      expect(text).toMatch(/\+?\s*\d{1,3}\.\d{3}₫/);
    }
  });
});

test.describe('T1 Pet NGON — M4 Luồng đặt lịch', () => {
  test('TC-T1-M4-006: bước chọn dịch vụ hiển thị đủ ý, không dịch vụ nào vô hình', async ({ page }) => {
    await moTrang(page);

    await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
    const overlay = page.locator('.bk-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 30_000 });

    // FR-M4-07: mỗi dịch vụ có 1 bước chọn dịch vụ rõ ràng.
    const danhSach = overlay.locator('.bk-svc');
    const soDichVu = await danhSach.count();
    expect(soDichVu).toBeGreaterThan(0);

    // 0 dịch vụ nào bị ẩn: mọi card dịch vụ đều hiển thị tên, giá và thời lượng.
    for (let i = 0; i < soDichVu; i += 1) {
      const item = danhSach.nth(i);
      await expect(item).toBeVisible();
      const text = await item.innerText();
      expect(text).toMatch(/\d{1,3}\.\d{3}₫/);
      expect(text).toMatch(/\d+\s*'|\d+\s*phút/);
    }
  });

  test('TC-T1-M4-007: quay lại từ bước 3 giữ nguyên loài đã chọn', async ({ page }) => {
    const overlay = await toiBuocLichHen(page);

    // FR-M4-08: quay lại bước 3 giữ nguyên lựa chọn loài và cân nặng.
    await overlay.locator('.bn-btn--ghost').filter({ hasText: 'Quay lại' }).click();
    await page.waitForTimeout(1200);

    // Quay lại bước 2 (Bé cưng): lựa chọn loài "Chó" và bậc "Chó nhỏ" còn nguyên.
    await expect(overlay.locator('.bk-pet.is-on').filter({ hasText: 'Chó' })).toHaveCount(1);
    await expect(overlay.locator('.bk-pet.is-on').filter({ hasText: 'Chó nhỏ' })).toHaveCount(1);
  });

  test('TC-T1-M4-008: luồng đặt lịch không yêu cầu đăng nhập hoặc tạo tài khoản', async ({ page }) => {
    await moTrang(page);

    await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
    const overlay = page.locator('.bk-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 30_000 });

    // FR-M4-12: 0 bước đăng ký/đăng nhập trong toàn bộ luồng đặt lịch.
    const trang = await page.context().pages();
    for (const p of trang) {
      const url = p.url();
      expect(url).not.toMatch(/\/login|\/register|\/signin|\/signup|\/account/i);
    }

    // Đi tới bước 4 (Địa điểm) — vẫn không có bước đăng nhập nào chen vào.
    await overlay.locator('.bk-svc').filter({ hasText: 'Tắm' }).first().click();
    await page.waitForTimeout(400);
    await overlay.locator('.bk-pet').filter({ hasText: 'Chó' }).first().click();
    await page.waitForTimeout(900);
    await overlay.locator('button').filter({ hasText: 'Tiếp tục' }).click();
    await page.waitForTimeout(1200);
    await overlay.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
    await page.waitForTimeout(700);
    await overlay.locator('.bk-input').first().fill('Bé Kiểm Thử');
    await page.waitForTimeout(500);
    await overlay.locator('button').filter({ hasText: 'Tiếp tục' }).click();
    await page.waitForTimeout(1500);
    await overlay.locator('button').filter({ hasText: /\d{2}\/\d{2}/ }).first().click();
    await page.waitForTimeout(600);
    await overlay.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first().click();
    await page.waitForTimeout(800);
    await overlay.locator('button').filter({ hasText: 'Tiếp tục' }).click();
    await page.waitForTimeout(1800);

    // Vẫn ở trong overlay đặt lịch, không bị chuyển sang trang đăng nhập.
    await expect(overlay).toBeVisible();
    expect(page.url()).not.toMatch(/\/login|\/register/i);
  });

  test('TC-T1-M4-009: ST bỏ qua bước 1 và đi thẳng bước 2 bằng cách chọn', async ({ page }) => {
    await moTrang(page);

    await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
    const overlay = page.locator('.bk-overlay');
    await overlay.waitFor({ state: 'visible', timeout: 30_000 });
    const next = overlay.locator('button').filter({ hasText: 'Tiếp tục' });

    // FR-M4-06: wizard bắt buộc qua 2 bước loài và cân nặng.
    // Bước 2 (Bé cưng) chứa bậc cân nặng — nút "Tiếp tục" khoá khi chưa chọn
    // bậc cân nặng và tên bé, nên không thể bỏ qua bước này.
    await next.click();
    await page.waitForTimeout(1500);

    await expect(overlay.locator('.bk-step.is-active')).toContainText('Bé cưng');
    // Chưa chọn bậc cân nặng + chưa nhập tên → nút vẫn khoá.
    await expect(next).toBeDisabled();

    // Chọn bậc cân nặng nhưng chưa nhập tên bé → nút vẫn khoá.
    await overlay.locator('.bk-pet').filter({ hasText: 'Chó nhỏ' }).first().click();
    await page.waitForTimeout(800);
    await expect(next).toBeDisabled();

    // Nhập tên bé → nút mở khoá, đi thẳng sang bước 3.
    await overlay.locator('.bk-input').first().fill('Bé Kiểm Thử');
    await page.waitForTimeout(700);
    await expect(next).toBeEnabled();
    await next.click();
    await page.waitForTimeout(1500);
    await expect(overlay.locator('.bk-step.is-active')).toContainText('Lịch hẹn');
  });
});

test.describe('T1 Pet NGON — M5 Điều kiện đổi/hủy lịch', () => {
  test('TC-T1-M5-003: FAQ điều kiện đổi/hủy lịch nêu rõ điều kiện cụ thể', async ({ page }) => {
    await moTrang(page);

    // FR-M5-03: mục FAQ "Có thể đổi/huỷ lịch không?" trả lời ≥ 2 điều kiện cụ thể.
    const muc = page.locator('.hm-faq__item').filter({ hasText: /đổi|huỷ|hủy/i }).first();
    await muc.locator('.hm-faq__q').click();
    await page.waitForTimeout(800);

    const traLoi = await muc.locator('.hm-faq__a').innerText();
    expect(traLoi.trim().length).toBeGreaterThan(0);

    // Điều kiện 1: thời gian thông báo trước (số giờ).
    expect(traLoi).toMatch(/\d+\s*giờ/);
    // Điều kiện 2: hậu quả khi báo trễ (phụ thu 50%).
    expect(traLoi).toMatch(/50\s*%/);
  });

  test('TC-T1-M5-004: điều kiện đổi lịch nêu rõ thời gian và mức phụ thu', async ({ page }) => {
    await moTrang(page);

    const muc = page.locator('.hm-faq__item').filter({ hasText: /đổi|huỷ|hủy/i }).first();
    await muc.locator('.hm-faq__q').click();
    await page.waitForTimeout(800);

    const traLoi = await muc.locator('.hm-faq__a').innerText();
    // Miễn phí khi báo trước, có phụ thu khi báo trễ — tức là 2 điều kiện rõ ràng.
    expect(traLoi).toMatch(/miễn phí/i);
    expect(traLoi).toMatch(/trước\s*\d+\s*giờ/);
    expect(traLoi).toMatch(/phụ thu\s*50\s*%/);
  });
});

test.describe('T1 Pet NGON — M7 Kênh liên hệ', () => {
  test('TC-T1-M7-002: có ít nhất 2 kênh liên hệ hoạt động, có liên kết Zalo', async ({ page }) => {
    await page.goto('https://petngon.vn/vi/contact', { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    // FR-M7-04: ít nhất 2 kênh liên hệ hoạt động.
    const sdt = page.locator('a[href^="tel:"]');
    const email = page.locator('a[href^="mailto:"]');
    await expect(sdt.first()).toBeVisible();
    await expect(email.first()).toBeVisible();

    // Kênh Zalo/messenger mở ứng dụng: liên kết tới zalo.me.
    const zalo = page.locator('a[href*="zalo.me"]');
    await expect(zalo.first()).toBeVisible();
    const hrefZalo = await zalo.first().getAttribute('href');
    expect(hrefZalo).toMatch(/^https:\/\/zalo\.me\/\d+/);
  });
});
