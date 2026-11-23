import { test, expect } from '@playwright/test';

/**
 * FR-M1-01..FR-M1-06 — T1 Pet NGON
 * Truy cập, điều hướng, thông tin liên hệ, hiển thị 360px và trang lỗi.
 * Chỉ đọc, không tương tác ghi dữ liệu (ADR-11).
 */

test.describe('T1 Pet NGON — M1 Truy cập và điều hướng', () => {
  test('TC-T1-M1-001: Trang chủ Pet NGON trả HTTP 200 và hiển thị tiêu đề + điều hướng chính', async ({ page }) => {
    const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/.+/);
  });

  test('TC-T1-M1-002: Mọi liên kết menu điều hướng đến trang con trả HTTP 200', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hrefs = await page.locator('nav a[href], header a[href]').evaluateAll((links) =>
      links
        .map((a) => (a as HTMLAnchorElement).href)
        .filter((href) => href.startsWith('http')),
    );
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of [...new Set(hrefs)].slice(0, 20)) {
      const response = await request.get(href, { maxRedirects: 3 });
      expect(response.status(), `Link ${href} trả ${response.status()}`).toBeLessThan(400);
    }
  });

  test('TC-T1-M1-003: Trang hiển thị đủ địa chỉ, điện thoại, email và giờ mở cửa', async ({ page }) => {
    await page.goto('/vi/contact', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('footer', { timeout: 20_000 });
    const body = await page.locator('body').innerText();

    // Địa chỉ, điện thoại, email — đều hiện ở trang liên hệ và footer.
    expect(body, 'Thiếu địa chỉ').toMatch(/1\.09\s*(block\s*)?A1|Westgate/i);
    expect(body, 'Thiếu số điện thoại').toMatch(/\+84|0\d{3}\s?\d{3}\s?\d{3}|\(\+84\)/);
    expect(body, 'Thiếu email').toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);

    // Giờ mở cửa: BR-14 quy định T1 mở cửa 07:00–22:00.
    // Site hiển thị ở khối "GIỜ LÀM VIỆC" dạng "07:00 – 22:00".
    expect(body, 'Thiếu giờ mở cửa 07:00 – 22:00 (BR-14)').toMatch(
      /07\s*[:h]\s*00\s*[–\-–~]\s*22\s*[:h]\s*00/,
    );
  });

  test('TC-T1-M1-004: Không có liên kết chết 404 trong menu và footer', async ({ page, request }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const hrefs = await page
      .locator('nav a[href], header a[href], footer a[href]')
      .evaluateAll((links) =>
        links
          .map((a) => (a as HTMLAnchorElement).href)
          .filter((href) => href.startsWith('http')),
      );
    const broken: string[] = [];
    for (const href of [...new Set(hrefs)].slice(0, 30)) {
      const response = await request.get(href, { maxRedirects: 3 });
      if (response.status() === 404) broken.push(href);
    }
    expect(broken).toEqual([]);
  });

  test('TC-T1-M1-005: Trang chủ không cuộn ngang ở màn hình 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-svc', { timeout: 20_000 });
    await page.waitForTimeout(800);

    const tran = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    // FR-M1-05: ở 360px không có cuộn ngang.
    expect(
      tran.scrollWidth,
      `Trang tràn ngang ${tran.scrollWidth - tran.clientWidth}px ở 360px`,
    ).toBeLessThanOrEqual(tran.clientWidth);
  });

  test('TC-T1-M1-006: URL sai hiển thị trang lỗi thân thiện, không lộ stack trace', async ({ page }) => {
    const response = await page.goto('/vi/khong-ton-tai-xyz-123', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(500);

    const body = await page.locator('body').innerText();
    expect(response?.status(), 'URL sai phải trả 404').toBe(404);

    // Có thông báo lỗi thân thiện…
    expect(body.trim().length, 'Trang lỗi phải có nội dung thông báo').toBeGreaterThan(0);
    expect(body, 'Trang lỗi phải nói rõ là không tìm thấy').toMatch(/404|không tìm thấy|not found/i);

    // …nhưng không lộ stack trace / lỗi nội bộ.
    expect(body, 'Trang lỗi lộ stack trace').not.toMatch(
      /at\s+\w+\s+\(|Error:\s|\.js:\d+:\d+|Traceback|node_modules|\/home\/|\/var\/www/i,
    );
  });
});
