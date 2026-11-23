import { test, expect } from '@playwright/test';

/**
 * FR-M7-03, FR-M7-04, FR-M7-06 — T1 Pet NGON
 * Kênh liên hệ, chuyển ngôn ngữ VI/EN và hành vi accordion FAQ.
 *
 * Chỉ đọc trang công khai, không gửi biểu mẫu liên hệ (ADR-11).
 * Bằng chứng: `reports/raw/probe-t1-final2.json`, `reports/raw/probe-t1-faq.json`,
 * `reports/raw/probe-t1-catalogue2.json` (mục `faqAccordion`).
 */

test.describe('T1 Pet NGON — M7 Thông tin, liên hệ và FAQ', () => {
  test('TC-T1-M7-001: Chuyển sang tiếng Anh vẫn ở trang hiện tại và dịch đủ', async ({ page }) => {
    // Bắt đầu ở trang chủ T1.
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.bn-locale', { timeout: 20_000 });

    await page.locator('.bn-locale').click();
    await page.waitForTimeout(1800);

    // FR-M7-03: vẫn ở trang hiện tại (trang chủ), chuyển sang EN.
    const url = page.url();
    expect(url, 'Chuyển ngôn ngữ phải giữ nguyên trang hiện tại').toMatch(/\/en(\/|$)/);

    // Nội dung chính đã dịch sang tiếng Anh — 0 chuỗi tiếng Việt còn sót.
    const noiDung = await page.locator('body').innerText();
    expect(noiDung).toMatch(/Pet NGON|Book|Services|Grooming|Spa/i);

    // Danh sách chuỗi tiếng Việt đặc trưng của trang chủ VI.
    const chuoiViet = [
      'Đặt lịch',
      'Bảng giá',
      'Câu hỏi thường gặp',
      'Phụ thu tận nhà',
      'Chỉ tại spa',
      'Có tận nhà',
    ].filter((s) => noiDung.includes(s));

    expect(
      chuoiViet,
      `Còn sót chuỗi tiếng Việt sau khi chuyển EN: ${chuoiViet.join(', ')}`,
    ).toEqual([]);
  });

  test('TC-T1-M7-002: Có ít nhất 2 kênh liên hệ hoạt động, liên kết Zalo mở đúng ứng dụng', async ({
    page,
    request,
  }) => {
    await page.goto('/vi/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('footer', { timeout: 20_000 });

    const links = await page.locator('a[href]').evaluateAll((els) =>
      els.map((a) => ({
        href: (a as HTMLAnchorElement).getAttribute('href') ?? '',
        text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
      })),
    );

    const zalo = links.filter((l) => /zalo\.me/.test(l.href));
    const tel = links.filter((l) => l.href.startsWith('tel:'));
    const mail = links.filter((l) => l.href.startsWith('mailto:'));
    const zaloText = links.some((l) => /Chat Zalo|Zalo/i.test(l.text));

    // FR-M7-04: ít nhất 2 kênh hoạt động.
    expect(tel.length, 'Thiếu liên kết gọi điện thoại (tel:)').toBeGreaterThan(0);
    expect(mail.length, 'Thiếu liên kết email (mailto:)').toBeGreaterThan(0);
    expect(
      zalo.length + (zaloText ? 1 : 0),
      'Thiếu kênh liên hệ qua Zalo',
    ).toBeGreaterThan(0);

    // Liên kết Zalo phải trỏ đúng ứng dụng và không chết.
    const zaloDau = zalo[0];
    if (zaloDau) {
      const href = zaloDau.href;
      expect(href, 'Liên kết Zalo không đúng định dạng').toMatch(/^https:\/\/zalo\.me\/\d+/);
      const resp = await request.get(href, { maxRedirects: 5 });
      expect(resp.status(), `Liên kết Zalo ${href} trả ${resp.status()}`).toBeLessThan(400);
    }
  });

  test('TC-T1-M7-003: Mục FAQ accordion mở độc lập, đóng lại được, biểu tượng đổi theo trạng thái', async ({
    page,
  }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-faq__q', { timeout: 20_000 });

    const so = await page.locator('.hm-faq__q').count();
    expect(so).toBeGreaterThanOrEqual(3);

    const icon = async (i: number) =>
      (
        await page
          .locator('.hm-faq__q')
          .nth(i)
          .locator('.material-symbols-outlined')
          .innerText()
      ).trim();

    // Trạng thái ban đầu: mục đầu tiên mở sẵn (biểu tượng "remove"),
    // các mục còn lại đóng ("add").
    expect(await icon(0), 'Mục FAQ đầu tiên phải mở sẵn').toBe('remove');
    expect(await icon(1), 'Mục FAQ thứ hai phải đóng ban đầu').toBe('add');

    // Mở mục thứ hai — FR-M7-06 yêu cầu ≥ 2 mục mở cùng lúc, KHÔNG đóng lẫn nhau.
    await page.locator('.hm-faq__q').nth(1).click();
    await page.waitForTimeout(500);

    const icon0Sau = await icon(0);
    const icon1 = await icon(1);

    // Thực tế T1 dùng accordion **mở đơn** (mở mục này đóng mục kia) —
    // vi phạm FR-M7-06. Đã ghi nhận trong defect log.
    expect(
      icon0Sau,
      'Mở mục thứ 2 đã đóng mục thứ 1 — vi phạm FR-M7-06 (mở độc lập)',
    ).toBe('remove');
    expect(icon1, 'Biểu tượng mục đang mở phải là "remove"').toBe('remove');

    // Bấm lại mục đang mở → phải đóng được và biểu tượng đổi về "add".
    await page.locator('.hm-faq__q').nth(1).click();
    await page.waitForTimeout(500);
    expect(await icon(1), 'Bấm lại phải đóng mục và đổi biểu tượng về "add"').toBe('add');
  });
});
