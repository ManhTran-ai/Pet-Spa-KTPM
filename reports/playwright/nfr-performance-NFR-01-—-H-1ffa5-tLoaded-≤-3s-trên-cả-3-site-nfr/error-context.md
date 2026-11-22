# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nfr\performance.spec.ts >> NFR-01 — Hiệu năng tải trang trên mạng 4G mô phỏng >> TC-NFR-01-003: DOMContentLoaded ≤ 3s trên cả 3 site
- Location: tests\nfr\performance.spec.ts:73:3

# Error details

```
Error: T3: DOMContentLoaded

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 3000
Received:    6416.100000023842
```

# Page snapshot

```yaml
- dialog [active] [ref=f2e2]:
  - generic [ref=f2e3]:
    - generic [ref=f2e5]:
      - img "business logo" [ref=f2e6]
      - generic [ref=f2e7]: Pretty Paws Cat and Dog Grooming
    - generic [ref=f2e20]:
      - generic [ref=f2e21]:
        - generic [ref=f2e23]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=f2e24]
          - generic [ref=f2e25]:
            - link "(609) 816-7755" [ref=f2e29] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=f2e33] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=f2e37] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=f2e41] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=f2e42]:
              - generic [ref=f2e46]: Closed
              - generic [ref=f2e47]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=f2e49] [cursor=pointer]
        - generic [ref=f2e52]:
          - heading "Business Hours" [level=5] [ref=f2e53]
          - list [ref=f2e54]:
            - generic [ref=f2e55]:
              - generic [ref=f2e56]: SUN
              - generic [ref=f2e57]: 8:00 AM
              - generic [ref=f2e58]: "-"
              - generic [ref=f2e59]: 8:00 PM
            - generic [ref=f2e60]:
              - generic [ref=f2e61]: MON
              - generic [ref=f2e62]: 8:00 AM
              - generic [ref=f2e63]: "-"
              - generic [ref=f2e64]: 8:00 PM
            - generic [ref=f2e65]:
              - generic [ref=f2e66]: TUE
              - generic [ref=f2e67]: 8:00 AM
              - generic [ref=f2e68]: "-"
              - generic [ref=f2e69]: 8:00 PM
            - generic [ref=f2e70]:
              - generic [ref=f2e71]: WED
              - generic [ref=f2e72]: 8:00 AM
              - generic [ref=f2e73]: "-"
              - generic [ref=f2e74]: 8:00 PM
            - generic [ref=f2e75]:
              - generic [ref=f2e76]: THU
              - generic [ref=f2e77]: 8:00 AM
              - generic [ref=f2e78]: "-"
              - generic [ref=f2e79]: 8:00 PM
            - generic [ref=f2e80]:
              - generic [ref=f2e81]: FRI
              - generic [ref=f2e82]: 8:00 AM
              - generic [ref=f2e83]: "-"
              - generic [ref=f2e84]: 8:00 PM
            - generic [ref=f2e85]:
              - generic [ref=f2e86]: SAT
              - generic [ref=f2e87]: 8:00 AM
              - generic [ref=f2e88]: "-"
              - generic [ref=f2e89]: 8:00 PM
      - generic [ref=f2e90]:
        - heading "About us" [level=5] [ref=f2e91]
        - generic [ref=f2e93]:
          - generic [ref=f2e94]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=f2e95]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=f2e96]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=f2e97]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=f2e99]:
        - heading "Services" [level=5] [ref=f2e100]
        - list [ref=f2e101]:
          - listitem [ref=f2e102]:
            - generic [ref=f2e103]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=f2e107]:
            - generic [ref=f2e108]: Dog (bath included) (16)
          - listitem [ref=f2e112]:
            - generic [ref=f2e113]: Cat (bath included) (4)
          - listitem [ref=f2e117]:
            - generic [ref=f2e118]: QUICK SERVICE (no bath) (12)
          - listitem [ref=f2e122]:
            - generic [ref=f2e123]: ADD ON TO GROOM (7)
    - generic [ref=f2e138]:
      - heading [level=6] [ref=f2e139]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=f2e140] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=f2e141] [cursor=pointer]
```

# Test source

```ts
  1   | import { test, expect, type Page, type CDPSession } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * NFR-01 — Hiệu năng tải trang trong trình duyệt thật (Ngân, Ngày 5/8).
  5   |  *
  6   |  * TC-NFR-01-003: DOMContentLoaded ≤ 3 giây trên mạng 4G mô phỏng.
  7   |  * TC-NFR-01-004: LCP ≤ 2,5 giây trên mạng 4G mô phỏng (trang chủ).
  8   |  * TC-NFR-01-005: LCP ≤ 2,5 giây trên mạng 4G mô phỏng (trang đặt lịch T1 và T2).
  9   |  *
  10  |  * Ranh giới ADR-11: chỉ GET trang công khai, không tương tác gửi form.
  11  |  * Tham số mô phỏng 4G theo Chrome DevTools "Slow 4G": tải 1,6 Mbps,
  12  |  * tải lên 750 kbps, độ trễ 150 ms.
  13  |  */
  14  | 
  15  | const MANG_4G = {
  16  |   offline: false,
  17  |   latency: 150,
  18  |   downloadThroughput: (1.6 * 1024 * 1024) / 8,
  19  |   uploadThroughput: (750 * 1024) / 8,
  20  | };
  21  | 
  22  | const GIOI_HAN_DCL = 3_000;
  23  | const GIOI_HAN_LCP = 2_500;
  24  | 
  25  | type DoDuc = {
  26  |   domContentLoaded: number;
  27  |   lcp: number;
  28  |   fcp: number;
  29  | };
  30  | 
  31  | /**
  32  |  * Gắn PerformanceObserver trước khi điều hướng để không bỏ sót LCP
  33  |  * (LCP được ghi đè liên tục cho tới khi người dùng tương tác).
  34  |  */
  35  | async function doTrucNghien(page: Page, url: string): Promise<DoDuc> {
  36  |   await page.addInitScript(() => {
  37  |     (window as unknown as { __lcp: number }).__lcp = 0;
  38  |     new PerformanceObserver((list) => {
  39  |       for (const entry of list.getEntries()) {
  40  |         (window as unknown as { __lcp: number }).__lcp = entry.startTime;
  41  |       }
  42  |     }).observe({ type: 'largest-contentful-paint', buffered: true });
  43  |   });
  44  | 
  45  |   await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  46  |   await page.waitForTimeout(3_000);
  47  | 
  48  |   return page.evaluate(() => {
  49  |     const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  50  |     const fcp = performance.getEntriesByName('first-contentful-paint')[0];
  51  |     return {
  52  |       domContentLoaded: nav ? nav.domContentLoadedEventEnd : Number.NaN,
  53  |       lcp: (window as unknown as { __lcp: number }).__lcp,
  54  |       fcp: fcp ? fcp.startTime : Number.NaN,
  55  |     };
  56  |   });
  57  | }
  58  | 
  59  | async function bat4G(page: Page): Promise<CDPSession> {
  60  |   const cdp = await page.context().newCDPSession(page);
  61  |   await cdp.send('Network.enable');
  62  |   await cdp.send('Network.emulateNetworkConditions', MANG_4G);
  63  |   return cdp;
  64  | }
  65  | 
  66  | const TRANG_CHU = {
  67  |   T1: 'https://petngon.vn/vi',
  68  |   T2: 'https://matpet.vn/spa',
  69  |   T3: 'https://prettypawscatanddoggrooming.groomore.com/',
  70  | };
  71  | 
  72  | test.describe('NFR-01 — Hiệu năng tải trang trên mạng 4G mô phỏng', () => {
  73  |   test('TC-NFR-01-003: DOMContentLoaded ≤ 3s trên cả 3 site', async ({ page }) => {
  74  |     const cdp = await bat4G(page);
  75  | 
  76  |     for (const [heThong, url] of Object.entries(TRANG_CHU)) {
  77  |       const doDuc = await doTrucNghien(page, url);
  78  | 
  79  |       console.log(
  80  |         `[NFR-01-003] ${heThong}: DCL=${Math.round(doDuc.domContentLoaded)}ms ` +
  81  |           `LCP=${Math.round(doDuc.lcp)}ms FCP=${Math.round(doDuc.fcp)}ms`,
  82  |       );
> 83  |       expect(doDuc.domContentLoaded, `${heThong}: DOMContentLoaded`).toBeLessThanOrEqual(GIOI_HAN_DCL);
      |                                                                      ^ Error: T3: DOMContentLoaded
  84  |     }
  85  | 
  86  |     await cdp.detach();
  87  |   });
  88  | 
  89  |   test('TC-NFR-01-004: LCP ≤ 2,5s trên trang chủ cả 3 site', async ({ page }) => {
  90  |     const cdp = await bat4G(page);
  91  | 
  92  |     for (const [heThong, url] of Object.entries(TRANG_CHU)) {
  93  |       const doDuc = await doTrucNghien(page, url);
  94  | 
  95  |       console.log(`[NFR-01-004] ${heThong}: LCP=${Math.round(doDuc.lcp)}ms`);
  96  |       expect(doDuc.lcp, `${heThong}: LCP`).toBeLessThanOrEqual(GIOI_HAN_LCP);
  97  |     }
  98  | 
  99  |     await cdp.detach();
  100 |   });
  101 | 
  102 |   test('TC-NFR-01-005: LCP ≤ 2,5s trên trang đặt lịch T1 và T2', async ({ page }) => {
  103 |     const cdp = await bat4G(page);
  104 | 
  105 |     // Trang đặt lịch của T1 và T2 là trang chủ có form giữ chỗ nhúng sẵn
  106 |     // (SRS-01 FR-M4-01) — cùng đường dẫn, đo riêng để khớp định nghĩa ca.
  107 |     const trangDatLich = {
  108 |       T1: 'https://petngon.vn/vi/dat-lich',
  109 |       T2: 'https://matpet.vn/spa',
  110 |     };
  111 | 
  112 |     for (const [heThong, url] of Object.entries(trangDatLich)) {
  113 |       const doDuc = await doTrucNghien(page, url);
  114 | 
  115 |       console.log(`[NFR-01-005] ${heThong} trang đặt lịch: LCP=${Math.round(doDuc.lcp)}ms`);
  116 |       expect(doDuc.lcp, `${heThong}: LCP trang đặt lịch`).toBeLessThanOrEqual(GIOI_HAN_LCP);
  117 |     }
  118 | 
  119 |     await cdp.detach();
  120 |   });
  121 | });
  122 | 
```