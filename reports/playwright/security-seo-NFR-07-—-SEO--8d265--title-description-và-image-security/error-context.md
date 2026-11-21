# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security\seo.spec.ts >> NFR-07 — SEO và kỹ thuật bảo trì >> TC-NFR-07-006: thẻ Open Graph có title, description và image
- Location: tests\security\seo.spec.ts:94:3

# Error details

```
Error: T1 thiếu og:image; T2 thiếu og:image

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 4

- Array []
+ Array [
+   "T1 thiếu og:image",
+   "T2 thiếu og:image",
+ ]
```

# Test source

```ts
  13  | ];
  14  | 
  15  | test.describe('NFR-07 — SEO và kỹ thuật bảo trì', () => {
  16  |   test('TC-NFR-07-001: mỗi trang có đúng một thẻ title không rỗng', async ({ browser }) => {
  17  |     const problems: string[] = [];
  18  |     for (const target of TARGETS) {
  19  |       const context = await browser.newContext();
  20  |       const page = await context.newPage();
  21  |       await page.goto(target.url, { waitUntil: 'load' });
  22  |       const titles = await page.locator('title').allTextContents();
  23  |       if (titles.length !== 1) problems.push(`${target.id} có ${titles.length} thẻ title`);
  24  |       else if (!titles[0]?.trim()) problems.push(`${target.id} có thẻ title rỗng`);
  25  |       await context.close();
  26  |     }
  27  |     expect(problems, problems.join('; ')).toEqual([]);
  28  |   });
  29  | 
  30  |   test('TC-NFR-07-002: mỗi trang có thẻ meta description không rỗng', async ({ browser }) => {
  31  |     const problems: string[] = [];
  32  |     for (const target of TARGETS) {
  33  |       const context = await browser.newContext();
  34  |       const page = await context.newPage();
  35  |       await page.goto(target.url, { waitUntil: 'load' });
  36  |       const count = await page.locator('meta[name="description"]').count();
  37  |       if (count === 0) {
  38  |         problems.push(`${target.id} thiếu thẻ meta description`);
  39  |       } else {
  40  |         const content = await page.locator('meta[name="description"]').first().getAttribute('content', { timeout: 5000 });
  41  |         if (!content || !content.trim()) problems.push(`${target.id} có meta description rỗng`);
  42  |       }
  43  |       await context.close();
  44  |     }
  45  |     expect(problems, problems.join('; ')).toEqual([]);
  46  |   });
  47  | 
  48  |   test('TC-NFR-07-003: thẻ html có thuộc tính lang', async ({ browser }) => {
  49  |     const problems: string[] = [];
  50  |     for (const target of TARGETS) {
  51  |       const context = await browser.newContext();
  52  |       const page = await context.newPage();
  53  |       await page.goto(target.url, { waitUntil: 'load' });
  54  |       const lang = await page.locator('html').getAttribute('lang', { timeout: 5000 });
  55  |       if (!lang || !lang.trim()) problems.push(`${target.id} thiếu thuộc tính lang trên thẻ html`);
  56  |       await context.close();
  57  |     }
  58  |     expect(problems, problems.join('; ')).toEqual([]);
  59  |   });
  60  | 
  61  |   test('TC-NFR-07-004: sitemap.xml tồn tại và không chặn trang quan trọng', async ({ request }) => {
  62  |     const problems: string[] = [];
  63  |     for (const target of TARGETS) {
  64  |       const origin = new URL(target.url).origin;
  65  |       const response = await getWithRetry(request, `${origin}/sitemap.xml`);
  66  |       if (response.status() !== 200) {
  67  |         problems.push(`${target.id} sitemap.xml trả ${response.status()}`);
  68  |         continue;
  69  |       }
  70  |       const body = await response.text();
  71  |       if (!body.includes('<urlset')) problems.push(`${target.id} sitemap.xml không phải định dạng urlset`);
  72  |     }
  73  |     expect(problems, problems.join('; ')).toEqual([]);
  74  |   });
  75  | 
  76  |   test('TC-NFR-07-005: robots.txt tồn tại và không chặn toàn bộ site', async ({ request }) => {
  77  |     const problems: string[] = [];
  78  |     for (const target of TARGETS) {
  79  |       const origin = new URL(target.url).origin;
  80  |       const response = await getWithRetry(request, `${origin}/robots.txt`);
  81  |       if (response.status() !== 200) {
  82  |         problems.push(`${target.id} robots.txt trả ${response.status()}`);
  83  |         continue;
  84  |       }
  85  |       const body = await response.text();
  86  |       if (!body.trim()) problems.push(`${target.id} robots.txt rỗng`);
  87  |       if (/^User-agent:\s*\*\s*$/im.test(body) && /^Disallow:\s*\/\s*$/im.test(body)) {
  88  |         problems.push(`${target.id} robots.txt chặn toàn bộ site`);
  89  |       }
  90  |     }
  91  |     expect(problems, problems.join('; ')).toEqual([]);
  92  |   });
  93  | 
  94  |   test('TC-NFR-07-006: thẻ Open Graph có title, description và image', async ({ browser }) => {
  95  |     const problems: string[] = [];
  96  |     for (const target of TARGETS) {
  97  |       const context = await browser.newContext();
  98  |       const page = await context.newPage();
  99  |       await page.goto(target.url, { waitUntil: 'load' });
  100 |       const missing: string[] = [];
  101 |       for (const property of ['og:title', 'og:description', 'og:image']) {
  102 |         const locator = page.locator(`meta[property="${property}"]`);
  103 |         if ((await locator.count()) === 0) {
  104 |           missing.push(property);
  105 |           continue;
  106 |         }
  107 |         const value = await locator.first().getAttribute('content');
  108 |         if (!value || !value.trim()) missing.push(property);
  109 |       }
  110 |       if (missing.length > 0) problems.push(`${target.id} thiếu ${missing.join(', ')}`);
  111 |       await context.close();
  112 |     }
> 113 |     expect(problems, problems.join('; ')).toEqual([]);
      |                                           ^ Error: T1 thiếu og:image; T2 thiếu og:image
  114 |   });
  115 | });
  116 | 
```