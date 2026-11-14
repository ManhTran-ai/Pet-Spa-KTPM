import { test, expect } from '@playwright/test';

/**
 * NFR-04 — Tương thích: trang không cuộn ngang ở màn hình 360px và
 * luồng tính giá vẫn dùng được trên khung nhìn di động.
 * Chỉ đọc/chọn, không gửi form (ADR-11).
 */
const TARGETS = [
  { id: 'T1', url: 'https://petngon.vn/vi' },
  { id: 'T2', url: 'https://matpet.vn/spa' },
  { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
];

const VIEWPORT = { width: 360, height: 740 };

test.describe('NFR-04 — Tương thích di động 360px', () => {
  test('TC-NFR-04-001: chức năng tính giá của T2 chạy đúng trên Chrome', async ({ page }) => {
    await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const next = page.getByRole('button', { name: 'Tiếp tục →' });
    for (let i = 0; i < 5; i += 1) {
      await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
      if (await next.isEnabled()) break;
      await page.waitForTimeout(1000);
    }
    await expect(next).toBeEnabled();
    await next.click();

    // Khối "GIÁ DỰ KIẾN" xuất hiện sau khi chọn đủ loài/cân nặng/dịch vụ.
    await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
  });

  test('TC-NFR-04-005: không có cuộn ngang ở màn hình 360px trên cả 3 site', async ({ browser }) => {
    const problems: string[] = [];
    for (const target of TARGETS) {
      const context = await browser.newContext({ viewport: VIEWPORT });
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(2000);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 2) problems.push(`${target.id} tràn ngang ${overflow}px ở 360px`);
      await context.close();
    }
    expect(problems, problems.join('; ')).toEqual([]);
  });

  test('TC-NFR-04-006: luồng tính giá của T2 dùng được trên khung nhìn 360x740', async ({ browser }) => {
    const context = await browser.newContext({ viewport: VIEWPORT });
    const page = await context.newPage();
    await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
    await page.waitForTimeout(3000);

    const next = page.getByRole('button', { name: 'Tiếp tục →' });
    for (let i = 0; i < 5; i += 1) {
      await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
      if (await next.isEnabled()) break;
      await page.waitForTimeout(1000);
    }
    await expect(next).toBeEnabled();
    await next.click();

    // Ở khung nhìn hẹp, bảng giá nằm trong khối "GIÁ DỰ KIẾN" — dùng nhãn
    // hiển thị thay vì selector class để chịu được thay đổi giao diện.
    await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
    await context.close();
  });
});
