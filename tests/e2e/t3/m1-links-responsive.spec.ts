import { test, expect, type Page } from '@playwright/test';

/**
 * FR-M1-04, FR-M1-05 — T3 Pretty Paws (đối chiếu chéo, Ngân).
 *
 * TC-T3-M1-004: không có liên kết chết 404 trong menu và footer.
 * TC-T3-M1-005: trang chủ không cuộn ngang ở màn hình 360px.
 *
 * ADR-11: chỉ GET/HEAD, không ghi dữ liệu.
 */

const T3 = 'https://prettypawscatanddoggrooming.groomore.com/';
const VIEWPORT_360 = { width: 360, height: 740 };

async function moTrangChu(page: Page): Promise<void> {
  await page.goto('/', { waitUntil: 'load' });
  await page.locator('.MuiDrawer-paper').waitFor({ state: 'visible', timeout: 20_000 });
}

/** Mở rộng toàn bộ nhóm dịch vụ để các liên kết trong danh mục cũng nằm trong DOM. */
async function moTatCaNhom(page: Page): Promise<void> {
  const nhom = await page.evaluate(() =>
    [...document.querySelectorAll('.MuiListItemText-primary')].map((el) => el.textContent.trim()),
  );
  for (const ten of nhom) {
    await page.getByText(ten, { exact: false }).first().click({ timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(700);
  }
}

test.describe('T3 Pretty Paws — M1 Truy cập, điều hướng', () => {
  test('TC-T3-M1-004: không có liên kết chết 404 trong menu và footer', async ({ page, request }) => {
    await moTrangChu(page);
    await moTatCaNhom(page);

    const hrefs = await page
      .locator('a[href]')
      .evaluateAll((links) =>
        links
          .map((a) => (a as HTMLAnchorElement).href)
          // Bỏ qua các scheme không phải http(s): sms:, mailto:, tel:
          .filter((href) => href.startsWith('http')),
      );
    expect(hrefs.length).toBeGreaterThan(0);

    const chet: string[] = [];
    for (const href of [...new Set(hrefs)]) {
      const response = await request.get(href, { maxRedirects: 3, timeout: 20_000 });
      if (response.status() === 404) chet.push(`${href} → 404`);
    }
    expect(chet, `Liên kết chết: ${chet.join('; ')}`).toEqual([]);
  });

  test('TC-T3-M1-005: trang chủ không cuộn ngang ở màn hình 360px', async ({ browser }) => {
    const context = await browser.newContext({ viewport: VIEWPORT_360 });
    const page = await context.newPage();
    await page.goto(T3, { waitUntil: 'load' });
    await page.locator('.MuiDrawer-paper').waitFor({ state: 'visible', timeout: 20_000 });
    await page.waitForTimeout(2_000);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    const tranNgang = scrollWidth - clientWidth;

    expect(tranNgang, `Tràn ngang ${tranNgang}px ở 360px`).toBeLessThanOrEqual(0);

    await context.close();
  });
});
