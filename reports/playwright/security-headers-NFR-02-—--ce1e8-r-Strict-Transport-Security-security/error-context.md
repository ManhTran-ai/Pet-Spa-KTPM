# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\headers.spec.ts >> NFR-02 — Baseline bảo mật >> TC-NFR-02-001: cả 3 site bật HTTPS và trả header Strict-Transport-Security
- Location: tests\security\headers.spec.ts:56:3

# Error details

```
Error: T1 thiếu HSTS; T3 thiếu HSTS

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "T1 thiếu HSTS",
+   "T3 thiếu HSTS",
+ ]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { mkdirSync, writeFileSync } from 'node:fs';
  3   | import path from 'node:path';
  4   | import { getWithRetry } from '../support/http';
  5   | 
  6   | /**
  7   |  * NFR-02 — Kiểm tra header bảo mật, cookie và TLS cho cả 3 hệ thống đích.
  8   |  * Chỉ đọc header, không gửi payload phá hại (ADR-11).
  9   |  *
  10  |  * Mỗi header là một test case riêng để khi Fail thì báo lỗi gọn (tránh Defect masking).
  11  |  * Test case trong `docs/testcases/nfr.csv` có System = ALL nên mỗi test áp dụng
  12  |  * cho cả 3 site và Fail nếu có bất kỳ site nào vi phạm.
  13  |  *
  14  |  * Kết quả tổng hợp ghi vào `reports/raw/security-summary.csv` (nguồn số liệu EC-6).
  15  |  */
  16  | const TARGETS = [
  17  |   { id: 'T1', url: 'https://petngon.vn/vi' },
  18  |   { id: 'T2', url: 'https://matpet.vn/spa' },
  19  |   { id: 'T3', url: 'https://prettypawscatanddoggrooming.groomore.com/' },
  20  | ];
  21  | 
  22  | const SECURITY_HEADERS = [
  23  |   ['x-content-type-options', 'X-Content-Type-Options'],
  24  |   ['x-frame-options', 'X-Frame-Options'],
  25  |   ['content-security-policy', 'Content-Security-Policy'],
  26  |   ['referrer-policy', 'Referrer-Policy'],
  27  |   ['strict-transport-security', 'Strict-Transport-Security'],
  28  | ] as const;
  29  | 
  30  | const RAW = path.join('reports', 'raw');
  31  | const SECURITY_CSV = path.join(RAW, 'security-summary.csv');
  32  | 
  33  | function toCsv(data: string[][]) {
  34  |   return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
  35  | }
  36  | 
  37  | test.describe('NFR-02 — Baseline bảo mật', () => {
  38  |   test.beforeAll(() => {
  39  |     mkdirSync(RAW, { recursive: true });
  40  |   });
  41  | 
  42  |   test('tổng hợp HTTP security header của 3 site vào reports/raw/security-summary.csv', async ({ request }) => {
  43  |     const rows = [['System', 'Header', 'Present', 'Value']];
  44  |     for (const target of TARGETS) {
  45  |       const response = await getWithRetry(request, target.url);
  46  |       const headers = response.headers();
  47  |       for (const [key, label] of SECURITY_HEADERS) {
  48  |         const value = headers[key];
  49  |         rows.push([target.id, label, value ? 'Yes' : 'No', value ?? '']);
  50  |       }
  51  |     }
  52  |     writeFileSync(SECURITY_CSV, `\uFEFF${toCsv(rows)}\n`, 'utf8');
  53  |     expect(rows.length - 1).toBe(TARGETS.length * SECURITY_HEADERS.length);
  54  |   });
  55  | 
  56  |   test('TC-NFR-02-001: cả 3 site bật HTTPS và trả header Strict-Transport-Security', async ({ request }) => {
  57  |     const missing: string[] = [];
  58  |     for (const target of TARGETS) {
  59  |       const response = await getWithRetry(request, target.url);
  60  |       if (!response.url().startsWith('https://')) missing.push(`${target.id} không dùng HTTPS`);
  61  |       if (!response.headers()['strict-transport-security']) missing.push(`${target.id} thiếu HSTS`);
  62  |     }
> 63  |     expect(missing, missing.join('; ')).toEqual([]);
      |                                         ^ Error: T1 thiếu HSTS; T3 thiếu HSTS
  64  |   });
  65  | 
  66  |   test('TC-NFR-02-002: cả 3 site trả header X-Content-Type-Options: nosniff', async ({ request }) => {
  67  |     const missing: string[] = [];
  68  |     for (const target of TARGETS) {
  69  |       const response = await getWithRetry(request, target.url);
  70  |       expect(response.status()).toBeLessThan(400);
  71  |       if (response.headers()['x-content-type-options'] !== 'nosniff') {
  72  |         missing.push(`${target.id} thiếu X-Content-Type-Options: nosniff`);
  73  |       }
  74  |     }
  75  |     expect(missing, missing.join('; ')).toEqual([]);
  76  |   });
  77  | 
  78  |   test('TC-NFR-02-003: cả 3 site có X-Frame-Options hoặc CSP frame-ancestors', async ({ request }) => {
  79  |     const missing: string[] = [];
  80  |     for (const target of TARGETS) {
  81  |       const response = await getWithRetry(request, target.url);
  82  |       const headers = response.headers();
  83  |       if (!headers['x-frame-options'] && !headers['content-security-policy']) {
  84  |         missing.push(`${target.id} thiếu X-Frame-Options hoặc CSP frame-ancestors`);
  85  |       }
  86  |     }
  87  |     expect(missing, missing.join('; ')).toEqual([]);
  88  |   });
  89  | 
  90  |   test('TC-NFR-02-004: cả 3 site có header Referrer-Policy', async ({ request }) => {
  91  |     const missing: string[] = [];
  92  |     for (const target of TARGETS) {
  93  |       const response = await getWithRetry(request, target.url);
  94  |       if (!response.headers()['referrer-policy']) missing.push(`${target.id} thiếu Referrer-Policy`);
  95  |     }
  96  |     expect(missing, missing.join('; ')).toEqual([]);
  97  |   });
  98  | 
  99  |   test('TC-NFR-02-005: cookie phiên của cả 3 site có Secure và HttpOnly', async ({ request }) => {
  100 |     const problems: string[] = [];
  101 |     for (const target of TARGETS) {
  102 |       const response = await getWithRetry(request, target.url);
  103 |       const raw = response.headersArray().filter((h) => h.name.toLowerCase() === 'set-cookie');
  104 |       const sessionCookies = raw.filter((h) => /session|sid|auth/i.test(h.value));
  105 |       for (const cookie of sessionCookies) {
  106 |         const value = cookie.value.toLowerCase();
  107 |         if (!value.includes('secure')) problems.push(`${target.id} cookie ${cookie.name} thiếu Secure`);
  108 |         if (!value.includes('httponly')) problems.push(`${target.id} cookie ${cookie.name} thiếu HttpOnly`);
  109 |       }
  110 |     }
  111 |     expect(problems, problems.join('; ')).toEqual([]);
  112 |   });
  113 | 
  114 |   test('TC-NFR-02-008: URL sai trả trang lỗi thân thiện, không lộ stack trace', async ({ request }) => {
  115 |     const leaks: string[] = [];
  116 |     for (const target of TARGETS) {
  117 |       const response = await getWithRetry(request, `${target.url}/__khong-ton-tai-kiem-thu-404`);
  118 |       const body = await response.text();
  119 |       if (/at \w+ \(.*:\d+:\d+\)/.test(body)) leaks.push(`${target.id} lộ stack trace`);
  120 |       if (/node_modules|\/usr\/lib\/node/i.test(body)) leaks.push(`${target.id} lộ đường dẫn hệ thống`);
  121 |     }
  122 |     expect(leaks, leaks.join('; ')).toEqual([]);
  123 |   });
  124 | });
  125 | 
```