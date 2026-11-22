# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\responsive.spec.ts >> NFR-04 — Tương thích di động 360px >> TC-NFR-04-005: không có cuộn ngang ở màn hình 360px trên cả 3 site
- Location: tests\security\responsive.spec.ts:34:3

# Error details

```
Error: T1 tràn ngang 19px ở 360px

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "T1 tràn ngang 19px ở 360px",
+ ]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * NFR-04 — Tương thích: trang không cuộn ngang ở màn hình 360px và
  5  |  * luồng tính giá vẫn dùng được trên khung nhìn di động.
  6  |  * Chỉ đọc/chọn, không gửi form (ADR-11).
  7  |  */
  8  | const TARGETS = [
  9  |   { id: 'T1', url: 'https://petngon.vn/vi' },
  10 |   { id: 'T2', url: 'https://matpet.vn/spa' },
  11 |   { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
  12 | ];
  13 | 
  14 | const VIEWPORT = { width: 360, height: 740 };
  15 | 
  16 | test.describe('NFR-04 — Tương thích di động 360px', () => {
  17 |   test('TC-NFR-04-001: chức năng tính giá của T2 chạy đúng trên Chrome', async ({ page }) => {
  18 |     await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
  19 |     await page.waitForTimeout(3000);
  20 | 
  21 |     const next = page.getByRole('button', { name: 'Tiếp tục →' });
  22 |     for (let i = 0; i < 5; i += 1) {
  23 |       await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  24 |       if (await next.isEnabled()) break;
  25 |       await page.waitForTimeout(1000);
  26 |     }
  27 |     await expect(next).toBeEnabled();
  28 |     await next.click();
  29 | 
  30 |     // Khối "GIÁ DỰ KIẾN" xuất hiện sau khi chọn đủ loài/cân nặng/dịch vụ.
  31 |     await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
  32 |   });
  33 | 
  34 |   test('TC-NFR-04-005: không có cuộn ngang ở màn hình 360px trên cả 3 site', async ({ browser }) => {
  35 |     const problems: string[] = [];
  36 |     for (const target of TARGETS) {
  37 |       const context = await browser.newContext({ viewport: VIEWPORT });
  38 |       const page = await context.newPage();
  39 |       await page.goto(target.url, { waitUntil: 'load' });
  40 |       await page.waitForTimeout(2000);
  41 |       const overflow = await page.evaluate(
  42 |         () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  43 |       );
  44 |       if (overflow > 2) problems.push(`${target.id} tràn ngang ${overflow}px ở 360px`);
  45 |       await context.close();
  46 |     }
> 47 |     expect(problems, problems.join('; ')).toEqual([]);
     |                                           ^ Error: T1 tràn ngang 19px ở 360px
  48 |   });
  49 | 
  50 |   test('TC-NFR-04-006: luồng tính giá của T2 dùng được trên khung nhìn 360x740', async ({ browser }) => {
  51 |     const context = await browser.newContext({ viewport: VIEWPORT });
  52 |     const page = await context.newPage();
  53 |     await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
  54 |     await page.waitForTimeout(3000);
  55 | 
  56 |     const next = page.getByRole('button', { name: 'Tiếp tục →' });
  57 |     for (let i = 0; i < 5; i += 1) {
  58 |       await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  59 |       if (await next.isEnabled()) break;
  60 |       await page.waitForTimeout(1000);
  61 |     }
  62 |     await expect(next).toBeEnabled();
  63 |     await next.click();
  64 | 
  65 |     // Ở khung nhìn hẹp, bảng giá nằm trong khối "GIÁ DỰ KIẾN" — dùng nhãn
  66 |     // hiển thị thay vì selector class để chịu được thay đổi giao diện.
  67 |     await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
  68 |     await context.close();
  69 |   });
  70 | });
  71 | 
```