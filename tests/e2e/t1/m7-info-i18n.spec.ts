import { test, expect } from '@playwright/test';

/**
 * FR-M1-03, FR-M2-01, FR-M7-01..FR-M7-04 — T1 Pet NGON
 * Liên hệ (nhiều kênh), thông tin cửa hàng, bản dịch VI/EN và câu hỏi FAQ.
 * Chỉ đọc trang công khai, không gửi biểu mẫu liên hệ (ADR-11).
 */

test.describe('T1 Pet NGON — M1/M7 Thông tin và liên hệ', () => {
  test('TC-T1-M1-003: trang hiển thị địa chỉ, điện thoại và email', async ({ page }) => {
    await page.goto('/vi/contact', { waitUntil: 'domcontentloaded' });
    const noiDung = await page.locator('body').innerText();

    // FR-M1-03: có đủ địa chỉ + điện thoại + email.
    expect(noiDung).toMatch(/TP\.?\s*Hồ Chí Minh|Hồ Chí Minh|TP\.HCM/i);
    // Điện thoại T1 hiển thị dạng "(+84) 325 305 143".
    expect(noiDung).toMatch(/\(\+84\)\s*[\d\s]{6,}|\+84\s*[\d\s]{6,}|\b0\d{2}[\s.]?\d{3}[\s.]?\d{3}\b/);
    expect(noiDung).toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });

  test('TC-T1-M7-001: có ít nhất 2 kênh liên hệ hoạt động (Zalo, điện thoại, email)', async ({ page }) => {
    await page.goto('/vi/contact', { waitUntil: 'domcontentloaded' });

    const links = await page.locator('a[href]').evaluateAll((els) =>
      els.map((a) => ({
        href: (a as HTMLAnchorElement).getAttribute('href') ?? '',
        text: (a.textContent || '').replace(/\s+/g, ' ').trim(),
      })),
    );

    const zalo = links.filter((l) => /zalo\.me/.test(l.href));
    const tel = links.filter((l) => l.href.startsWith('tel:'));
    const mail = links.filter((l) => l.href.startsWith('mailto:'));
    const zaloText = links.some((l) => /Chat Zalo/i.test(l.text));

    expect(zalo.length + zaloText).toBeGreaterThan(0);
    expect(tel.length).toBeGreaterThan(0);
    expect(mail.length).toBeGreaterThan(0);
    expect(zalo.length + zaloText + tel.length + mail.length).toBeGreaterThanOrEqual(2);
  });

  test('TC-T1-M7-002: liên kết Zalo trỏ tới ứng dụng Zalo hợp lệ', async ({ page, request }) => {
    await page.goto('/vi/contact', { waitUntil: 'domcontentloaded' });

    const href = await page
      .locator('a[href*="zalo.me"]')
      .first()
      .getAttribute('href');
    expect(href).toBeTruthy();
    expect(href!).toMatch(/^https:\/\/zalo\.me\/\d+/);

    // Kiểm tra liên kết không chết (theo dõi redirect cuối).
    const resp = await request.get(href!, { maxRedirects: 5 });
    expect(resp.status()).toBeLessThan(400);
  });

  test('TC-T1-M7-003: nút đổi ngôn ngữ chuyển từ VI sang EN', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.bn-locale', { timeout: 15_000 });

    await page.locator('.bn-locale').click();
    await page.waitForTimeout(1500);

    // URL hoặc nội dung phải chuyển sang tiếng Anh.
    const url = page.url();
    const noiDung = await page.locator('body').innerText();
    const sangEN = /\/en(\/|$)/.test(url) || /Book|Booking|Services|Grooming/i.test(noiDung);
    expect(sangEN, `Không chuyển sang EN (url=${url})`).toBe(true);
  });

  test('TC-T1-M7-004: FAQ trả lời được câu hỏi về dịch vụ tại nhà và phụ thu', async ({ page }) => {
    await page.goto('/vi', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.hm-faq__q', { timeout: 15_000 });

    const cauHoi = await page.locator('.hm-faq__q').allInnerTexts();
    expect(cauHoi.length).toBeGreaterThan(0);

    // Mở hết các câu hỏi để nội dung trả lời hiện ra.
    const so = await page.locator('.hm-faq__q').count();
    for (let i = 0; i < so; i += 1) {
      await page.locator('.hm-faq__q').nth(i).click();
      await page.waitForTimeout(200);
    }

    const noiDung = await page.locator('body').innerText();
    expect(noiDung).toMatch(/Dịch vụ nào có thể làm tại nhà/i);
    expect(noiDung).toMatch(/Phụ thu tại nhà tính như thế nào/i);
  });
});
