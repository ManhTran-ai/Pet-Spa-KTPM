# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\responsive.spec.ts >> NFR-04 — Tương thích di động 360px >> TC-NFR-04-005: Không có cuộn ngang ở màn hình 360px trên trang đặt lịch
- Location: tests\security\responsive.spec.ts:18:3

# Error details

```
Error: T1 tràn ngang 19px ở 360px (scrollWidth 379 > clientWidth 360, scrollLeft tối đa = 19) — phần tử vượt mép: <DIV.bn-bar__right> right=379 | <BUTTON.bn-btn bn-btn--primary bn-bar__book ga-booking-btn> right=379 | <SPAN.material-symbols-outlined > right=367 | <DIV.bn-hero__visual-glow> right=378 | <TABLE.hm-pricing-matrix> right=741

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "T1 tràn ngang 19px ở 360px (scrollWidth 379 > clientWidth 360, scrollLeft tối đa = 19) — phần tử vượt mép: <DIV.bn-bar__right> right=379 | <BUTTON.bn-btn bn-btn--primary bn-bar__book ga-booking-btn> right=379 | <SPAN.material-symbols-outlined > right=367 | <DIV.bn-hero__visual-glow> right=378 | <TABLE.hm-pricing-matrix> right=741",
+ ]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import fs from 'node:fs';
  3  | 
  4  | /**
  5  |  * NFR-04 — Tương thích: trang không cuộn ngang ở màn hình 360px và
  6  |  * luồng tính giá vẫn dùng được trên khung nhìn di động.
  7  |  * Chỉ đọc/chọn, không gửi form (ADR-11).
  8  |  */
  9  | const TARGETS = [
  10 |   { id: 'T1', url: 'https://petngon.vn/vi' },
  11 |   { id: 'T2', url: 'https://matpet.vn/spa' },
  12 |   { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
  13 | ];
  14 | 
  15 | const VIEWPORT = { width: 360, height: 740 };
  16 | 
  17 | test.describe('NFR-04 — Tương thích di động 360px', () => {
  18 |   test('TC-NFR-04-005: Không có cuộn ngang ở màn hình 360px trên trang đặt lịch', async ({ browser }) => {
  19 |     const problems: string[] = [];
  20 |     const bangChung: Record<string, unknown> = {};
  21 | 
  22 |     for (const target of TARGETS) {
  23 |       const context = await browser.newContext({ viewport: VIEWPORT });
  24 |       const page = await context.newPage();
  25 |       await page.goto(target.url, { waitUntil: 'load' });
  26 |       await page.waitForTimeout(2000);
  27 | 
  28 |       const doD = await page.evaluate(() => {
  29 |         const de = document.documentElement;
  30 |         const clientWidth = de.clientWidth;
  31 |         const scrollWidth = de.scrollWidth;
  32 | 
  33 |         // Phần tử vượt mép phải (loại trừ nội dung nằm trong vùng cuộn riêng).
  34 |         const vuot = Array.from(document.querySelectorAll('*'))
  35 |           .map((el) => {
  36 |             const r = el.getBoundingClientRect();
  37 |             return {
  38 |               tag: el.tagName,
  39 |               cls: (el.className || '').toString().slice(0, 60),
  40 |               right: Math.round(r.right),
  41 |               width: Math.round(r.width),
  42 |             };
  43 |           })
  44 |           .filter((e) => e.width > 0 && e.right > clientWidth + 1);
  45 | 
  46 |         // Xác nhận người dùng THỰC SỰ cuộn ngang được (không chỉ tràn vô hại).
  47 |         de.scrollLeft = 9999;
  48 |         const maxScroll = de.scrollLeft;
  49 |         de.scrollLeft = 0;
  50 | 
  51 |         return { clientWidth, scrollWidth, tran: scrollWidth - clientWidth, maxScroll, vuot };
  52 |       });
  53 | 
  54 |       if (doD.tran > 2) {
  55 |         const nguyenNhan = doD.vuot
  56 |           .slice(0, 5)
  57 |           .map((v) => `<${v.tag}.${v.cls}> right=${v.right}`)
  58 |           .join(' | ');
  59 |         problems.push(
  60 |           `${target.id} tràn ngang ${doD.tran}px ở 360px ` +
  61 |             `(scrollWidth ${doD.scrollWidth} > clientWidth ${doD.clientWidth}, ` +
  62 |             `scrollLeft tối đa = ${doD.maxScroll}) — phần tử vượt mép: ${nguyenNhan}`,
  63 |         );
  64 |       }
  65 |       bangChung[target.id] = doD;
  66 |       await context.close();
  67 |     }
  68 | 
  69 |     // Ghi bằng chứng thô — cần cho báo cáo defect DEF-016.
  70 |     fs.mkdirSync('reports/raw', { recursive: true });
  71 |     fs.writeFileSync('reports/raw/nfr-04-005-overflow.json', JSON.stringify(bangChung, null, 2), 'utf8');
  72 | 
> 73 |     expect(problems, problems.join('\n')).toEqual([]);
     |                                           ^ Error: T1 tràn ngang 19px ở 360px (scrollWidth 379 > clientWidth 360, scrollLeft tối đa = 19) — phần tử vượt mép: <DIV.bn-bar__right> right=379 | <BUTTON.bn-btn bn-btn--primary bn-bar__book ga-booking-btn> right=379 | <SPAN.material-symbols-outlined > right=367 | <DIV.bn-hero__visual-glow> right=378 | <TABLE.hm-pricing-matrix> right=741
  74 |   });
  75 | 
  76 |   test('TC-NFR-04-006: Chức năng tính giá chạy đúng trên khung nhìn di động 360x740', async ({ browser }) => {
  77 |     const context = await browser.newContext({ viewport: VIEWPORT });
  78 |     const page = await context.newPage();
  79 |     await page.goto('https://matpet.vn/spa', { waitUntil: 'load' });
  80 |     await page.waitForTimeout(3000);
  81 | 
  82 |     const next = page.getByRole('button', { name: 'Tiếp tục →' });
  83 |     for (let i = 0; i < 5; i += 1) {
  84 |       await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  85 |       if (await next.isEnabled()) break;
  86 |       await page.waitForTimeout(1000);
  87 |     }
  88 |     await expect(next).toBeEnabled();
  89 |     await next.click();
  90 | 
  91 |     // Ở khung nhìn hẹp, bảng giá nằm trong khối "GIÁ DỰ KIẾN" — dùng nhãn
  92 |     // hiển thị thay vì selector class để chịu được thay đổi giao diện.
  93 |     await expect(page.getByText('GIÁ DỰ KIẾN').first()).toBeVisible();
  94 |     await context.close();
  95 |   });
  96 | });
  97 | 
```