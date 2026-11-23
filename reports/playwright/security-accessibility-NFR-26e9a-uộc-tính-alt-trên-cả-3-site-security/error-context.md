# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\accessibility.spec.ts >> NFR-06 — Khả năng tiếp cận >> TC-NFR-06-004: mọi ảnh nội dung có thuộc tính alt trên cả 3 site
- Location: tests\security\accessibility.spec.ts:103:3

# Error details

```
Error: vi phạm thuộc tính alt: T3 image-alt (49 node)

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
  24  | type SiteScan = {
  25  |   id: string;
  26  |   violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];
  27  |   h1Count: number;
  28  | };
  29  | 
  30  | let scans: SiteScan[] = [];
  31  | 
  32  | function toCsv(data: string[][]) {
  33  |   return data.map((r) => r.map((v) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)).join(',')).join('\n');
  34  | }
  35  | 
  36  | test.describe('NFR-06 — Khả năng tiếp cận', () => {
  37  |   // Quét axe-core cả 3 site mất hơn 60 giây (mỗi site chờ render + quét
  38  |   // WCAG 2.1 AA), nên nới hạn thời gian riêng cho nhóm test này.
  39  |   test.describe.configure({ timeout: 300_000 });
  40  | 
  41  |   // Quét một lần cho cả 3 site rồi dùng lại kết quả cho 5 test case, thay vì
  42  |   // mỗi test lại tải trang 3 lần — giảm tải lên site bên thứ ba (ADR-11).
  43  |   test.beforeAll(async ({ browser }) => {
  44  |     mkdirSync(RAW, { recursive: true });
  45  |     scans = [];
  46  | 
  47  |     for (const target of TARGETS) {
  48  |       const context = await browser.newContext();
  49  |       const page = await context.newPage();
  50  |       await page.goto(target.url, { waitUntil: 'load' });
  51  |       await page.waitForTimeout(3000);
  52  |       const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  53  |       const h1Count = await page.locator('h1').count();
  54  |       scans.push({ id: target.id, violations: results.violations, h1Count });
  55  |       await context.close();
  56  |     }
  57  | 
  58  |     const rows = [['System', 'Rule_ID', 'Impact', 'Severity', 'Occurrences', 'Help_URL']];
  59  |     for (const scan of scans) {
  60  |       for (const violation of scan.violations) {
  61  |         const severity =
  62  |           violation.impact === 'critical' ? 'critical' : violation.impact === 'serious' ? 'serious' : 'moderate';
  63  |         rows.push([
  64  |           scan.id,
  65  |           violation.id,
  66  |           violation.impact ?? 'unknown',
  67  |           severity,
  68  |           String(violation.nodes.length),
  69  |           violation.helpUrl,
  70  |         ]);
  71  |       }
  72  |     }
  73  |     writeFileSync(AXE_CSV, `﻿${toCsv(rows)}\n`, 'utf8');
  74  |   });
  75  | 
  76  |   test('TC-NFR-06-001: axe-core không có vi phạm mức critical trên cả 3 site', () => {
  77  |     const critical = scans.flatMap((scan) =>
  78  |       scan.violations
  79  |         .filter((v) => v.impact === 'critical')
  80  |         .map((v) => `${scan.id} ${v.id} (${v.nodes.length} node)`),
  81  |     );
  82  |     expect(critical, `vi phạm axe-core mức critical: ${critical.join('; ')}`).toEqual([]);
  83  |   });
  84  | 
  85  |   test('TC-NFR-06-002: mọi vùng chữ đạt tương phản ≥ 4,5:1 trên cả 3 site', () => {
  86  |     const violations = scans.flatMap((scan) =>
  87  |       scan.violations
  88  |         .filter((v) => v.id === 'color-contrast')
  89  |         .map((v) => `${scan.id} color-contrast (${v.nodes.length} node)`),
  90  |     );
  91  |     expect(violations, `vi phạm tương phản màu: ${violations.join('; ')}`).toEqual([]);
  92  |   });
  93  | 
  94  |   test('TC-NFR-06-003: mọi trường form có nhãn gắn liền trên cả 3 site', () => {
  95  |     const violations = scans.flatMap((scan) =>
  96  |       scan.violations
  97  |         .filter((v) => v.id === 'label' || v.id === 'form-field-multiple-labels')
  98  |         .map((v) => `${scan.id} ${v.id} (${v.nodes.length} node)`),
  99  |     );
  100 |     expect(violations, `vi phạm nhãn trường form: ${violations.join('; ')}`).toEqual([]);
  101 |   });
  102 | 
  103 |   test('TC-NFR-06-004: mọi ảnh nội dung có thuộc tính alt trên cả 3 site', () => {
  104 |     const violations = scans.flatMap((scan) =>
  105 |       scan.violations
  106 |         .filter((v) => v.id === 'image-alt')
  107 |         .map((v) => `${scan.id} image-alt (${v.nodes.length} node)`),
  108 |     );
> 109 |     expect(violations, `vi phạm thuộc tính alt: ${violations.join('; ')}`).toEqual([]);
      |                                                                            ^ Error: vi phạm thuộc tính alt: T3 image-alt (49 node)
  110 |   });
  111 | 
  112 |   test('TC-NFR-06-005: mỗi trang có đúng một tiêu đề h1 trên cả 3 site', () => {
  113 |     const details = scans.filter((scan) => scan.h1Count !== 1).map((scan) => `${scan.id} có ${scan.h1Count} phần tử h1`);
  114 |     expect(details, `tiêu đề h1 không đúng: ${details.join('; ')}`).toEqual([]);
  115 |   });
  116 | });
  117 | 
```