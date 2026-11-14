# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\accessibility.spec.ts >> NFR-06 — Khả năng tiếp cận >> TC-NFR-06-001: axe-core không có vi phạm mức critical trên cả 3 site
- Location: tests\security\accessibility.spec.ts:40:3

# Error details

```
Error: vi phạm axe-core mức critical: T3 image-alt (49 node)

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "T3 image-alt (49 node)",
+ ]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | import AxeBuilder from '@axe-core/playwright';
  3   | import { mkdirSync, writeFileSync } from 'node:fs';
  4   | import path from 'node:path';
  5   | 
  6   | /**
  7   |  * NFR-06 — Khả năng tiếp cận (WCAG 2.1 AA) cho 3 site đích.
  8   |  *
  9   |  * Mỗi test case trong `docs/testcases/nfr.csv` có System = ALL, nên mỗi test
  10  |  * chạy trên cả 3 site trong một lần và Fail nếu có bất kỳ site nào vi phạm.
  11  |  * Kết quả chi tiết ghi vào `reports/raw/axe-summary.csv` (nguồn số liệu cho EC-6).
  12  |  *
  13  |  * Chỉ đọc trang, không thao tác ghi dữ liệu (ADR-11).
  14  |  */
  15  | const TARGETS = [
  16  |   { id: 'T1', url: 'https://petngon.vn/vi' },
  17  |   { id: 'T2', url: 'https://matpet.vn/spa' },
  18  |   { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
  19  | ];
  20  | 
  21  | const RAW = path.join('reports', 'raw');
  22  | const AXE_CSV = path.join(RAW, 'axe-summary.csv');
  23  | 
  24  | /** Chờ ảnh và nội dung render xong — quét sớm sẽ bỏ sót lỗi alt/contrast. */
  25  | async function quetAxe(page: Page, url: string) {
  26  |   await page.goto(url, { waitUntil: 'load' });
  27  |   await page.waitForTimeout(3000);
  28  |   return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  29  | }
  30  | 
  31  | function toCsv(data: string[][]) {
  32  |   return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
  33  | }
  34  | 
  35  | test.describe('NFR-06 — Khả năng tiếp cận', () => {
  36  |   test.beforeAll(() => {
  37  |     mkdirSync(RAW, { recursive: true });
  38  |   });
  39  | 
  40  |   test('TC-NFR-06-001: axe-core không có vi phạm mức critical trên cả 3 site', async ({ browser }) => {
  41  |     const rows = [['System', 'Rule_ID', 'Impact', 'Severity', 'Occurrences', 'Help_URL']];
  42  |     const critical: string[] = [];
  43  | 
  44  |     for (const target of TARGETS) {
  45  |       const context = await browser.newContext();
  46  |       const page = await context.newPage();
  47  |       const results = await quetAxe(page, target.url);
  48  | 
  49  |       for (const violation of results.violations) {
  50  |         const severity =
  51  |           violation.impact === 'critical' ? 'critical' : violation.impact === 'serious' ? 'serious' : 'moderate';
  52  |         rows.push([
  53  |           target.id,
  54  |           violation.id,
  55  |           violation.impact ?? 'unknown',
  56  |           severity,
  57  |           String(violation.nodes.length),
  58  |           violation.helpUrl,
  59  |         ]);
  60  |         if (severity === 'critical') {
  61  |           critical.push(`${target.id} ${violation.id} (${violation.nodes.length} node)`);
  62  |         }
  63  |       }
  64  |       await context.close();
  65  |     }
  66  | 
  67  |     writeFileSync(AXE_CSV, `\uFEFF${toCsv(rows)}\n`, 'utf8');
  68  | 
> 69  |     expect(critical, `vi phạm axe-core mức critical: ${critical.join('; ')}`).toEqual([]);
      |                                                                               ^ Error: vi phạm axe-core mức critical: T3 image-alt (49 node)
  70  |   });
  71  | 
  72  |   test('TC-NFR-06-002: mọi vùng chữ đạt tương phản ≥ 4,5:1 trên cả 3 site', async ({ browser }) => {
  73  |     const violations: string[] = [];
  74  |     for (const target of TARGETS) {
  75  |       const context = await browser.newContext();
  76  |       const page = await context.newPage();
  77  |       const results = await quetAxe(page, target.url);
  78  |       for (const violation of results.violations.filter((v) => v.id === 'color-contrast')) {
  79  |         violations.push(`${target.id} color-contrast (${violation.nodes.length} node)`);
  80  |       }
  81  |       await context.close();
  82  |     }
  83  |     expect(violations, `vi phạm tương phản màu: ${violations.join('; ')}`).toEqual([]);
  84  |   });
  85  | 
  86  |   test('TC-NFR-06-003: mọi trường form có nhãn gắn liền trên cả 3 site', async ({ browser }) => {
  87  |     const violations: string[] = [];
  88  |     for (const target of TARGETS) {
  89  |       const context = await browser.newContext();
  90  |       const page = await context.newPage();
  91  |       const results = await quetAxe(page, target.url);
  92  |       for (const violation of results.violations.filter((v) => v.id === 'label' || v.id === 'form-field-multiple-labels')) {
  93  |         violations.push(`${target.id} ${violation.id} (${violation.nodes.length} node)`);
  94  |       }
  95  |       await context.close();
  96  |     }
  97  |     expect(violations, `vi phạm nhãn trường form: ${violations.join('; ')}`).toEqual([]);
  98  |   });
  99  | 
  100 |   test('TC-NFR-06-004: mọi ảnh nội dung có thuộc tính alt trên cả 3 site', async ({ browser }) => {
  101 |     const violations: string[] = [];
  102 |     for (const target of TARGETS) {
  103 |       const context = await browser.newContext();
  104 |       const page = await context.newPage();
  105 |       const results = await quetAxe(page, target.url);
  106 |       for (const violation of results.violations.filter((v) => v.id === 'image-alt')) {
  107 |         violations.push(`${target.id} image-alt (${violation.nodes.length} node)`);
  108 |       }
  109 |       await context.close();
  110 |     }
  111 |     expect(violations, `vi phạm thuộc tính alt: ${violations.join('; ')}`).toEqual([]);
  112 |   });
  113 | 
  114 |   test('TC-NFR-06-005: mỗi trang có đúng một tiêu đề h1 trên cả 3 site', async ({ browser }) => {
  115 |     const details: string[] = [];
  116 |     for (const target of TARGETS) {
  117 |       const context = await browser.newContext();
  118 |       const page = await context.newPage();
  119 |       await page.goto(target.url, { waitUntil: 'load' });
  120 |       await page.waitForTimeout(3000);
  121 |       const count = await page.locator('h1').count();
  122 |       if (count !== 1) details.push(`${target.id} có ${count} phần tử h1`);
  123 |       await context.close();
  124 |     }
  125 |     expect(details, `tiêu đề h1 không đúng: ${details.join('; ')}`).toEqual([]);
  126 |   });
  127 | });
  128 | 
```