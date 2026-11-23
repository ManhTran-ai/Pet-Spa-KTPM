import { test, expect } from '@playwright/test';
import fs from 'node:fs';

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
  test('TC-NFR-04-005: Không có cuộn ngang ở màn hình 360px trên trang đặt lịch', async ({ browser }) => {
    const problems: string[] = [];
    const bangChung: Record<string, unknown> = {};

    for (const target of TARGETS) {
      const context = await browser.newContext({ viewport: VIEWPORT });
      const page = await context.newPage();
      await page.goto(target.url, { waitUntil: 'load' });
      await page.waitForTimeout(2000);

      const doD = await page.evaluate(() => {
        const de = document.documentElement;
        const clientWidth = de.clientWidth;
        const scrollWidth = de.scrollWidth;

        // Phần tử vượt mép phải (loại trừ nội dung nằm trong vùng cuộn riêng).
        const vuot = Array.from(document.querySelectorAll('*'))
          .map((el) => {
            const r = el.getBoundingClientRect();
            return {
              tag: el.tagName,
              cls: (el.className || '').toString().slice(0, 60),
              right: Math.round(r.right),
              width: Math.round(r.width),
            };
          })
          .filter((e) => e.width > 0 && e.right > clientWidth + 1);

        // Xác nhận người dùng THỰC SỰ cuộn ngang được (không chỉ tràn vô hại).
        de.scrollLeft = 9999;
        const maxScroll = de.scrollLeft;
        de.scrollLeft = 0;

        return { clientWidth, scrollWidth, tran: scrollWidth - clientWidth, maxScroll, vuot };
      });

      if (doD.tran > 2) {
        const nguyenNhan = doD.vuot
          .slice(0, 5)
          .map((v) => `<${v.tag}.${v.cls}> right=${v.right}`)
          .join(' | ');
        problems.push(
          `${target.id} tràn ngang ${doD.tran}px ở 360px ` +
            `(scrollWidth ${doD.scrollWidth} > clientWidth ${doD.clientWidth}, ` +
            `scrollLeft tối đa = ${doD.maxScroll}) — phần tử vượt mép: ${nguyenNhan}`,
        );
      }
      bangChung[target.id] = doD;
      await context.close();
    }

    // Ghi bằng chứng thô — cần cho báo cáo defect DEF-016.
    fs.mkdirSync('reports/raw', { recursive: true });
    fs.writeFileSync('reports/raw/nfr-04-005-overflow.json', JSON.stringify(bangChung, null, 2), 'utf8');

    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('TC-NFR-04-006: Chức năng tính giá chạy đúng trên khung nhìn di động 360x740', async ({ browser }) => {
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
