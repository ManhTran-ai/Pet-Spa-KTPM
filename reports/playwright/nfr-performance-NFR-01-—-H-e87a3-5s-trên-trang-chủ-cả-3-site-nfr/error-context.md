# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nfr\performance.spec.ts >> NFR-01 — Hiệu năng tải trang trên mạng 4G mô phỏng >> TC-NFR-01-004: LCP ≤ 2,5s trên trang chủ cả 3 site
- Location: tests\nfr\performance.spec.ts:89:3

# Error details

```
Error: T2: LCP

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 2500
Received:    4476
```

# Page snapshot

```yaml
- generic [active] [ref=f1e1]:
  - banner [ref=f1e2]:
    - generic [ref=f1e3]:
      - link [ref=f1e4] [cursor=pointer]:
        - /url: /
        - img "Mật Pet Family - Since 2011 Peace of Mind" [ref=f1e5]
      - navigation [ref=f1e6]:
        - link "Trang chủ" [ref=f1e7] [cursor=pointer]:
          - /url: /
        - link "Chó" [ref=f1e8] [cursor=pointer]:
          - /url: /cho
        - link "Mèo" [ref=f1e9] [cursor=pointer]:
          - /url: /meo
        - link "Tìm Bé Thương" [ref=f1e10] [cursor=pointer]:
          - /url: /tim-be-thuong
        - link "Spa" [ref=f1e11] [cursor=pointer]:
          - /url: /spa
        - link "Bảo hành" [ref=f1e12] [cursor=pointer]:
          - /url: /bao-hanh
        - link "Về Mật Pet" [ref=f1e13] [cursor=pointer]:
          - /url: /vematpet
      - button "Tìm kiếm" [ref=f1e14] [cursor=pointer]
      - generic [ref=f1e18]:
        - link "Tiếng Việt" [ref=f1e19] [cursor=pointer]:
          - /url: /spa
          - text: VI
        - generic [ref=f1e20]: "|"
        - link "English" [ref=f1e21] [cursor=pointer]:
          - /url: /en/spa
          - text: EN
      - link "0939.86.36.96" [ref=f1e22] [cursor=pointer]:
        - /url: tel:0939863696
  - generic [ref=f1e25]:
    - generic [ref=f1e27]:
      - generic [ref=f1e28]:
        - generic [ref=f1e29]: Spa & Grooming · Từ 2011
        - heading "Biết giá trước khi đưa bé đến spa." [level=1] [ref=f1e30]
        - paragraph [ref=f1e31]: Chọn loại bé, cân nặng và dịch vụ — bạn thấy ngay mức giá dự kiến minh bạch, rồi giữ chỗ chỉ với số điện thoại. Không còn phải nhắn tin hỏi giá.
        - generic [ref=f1e32]:
          - link "Tính giá dự kiến →" [ref=f1e33] [cursor=pointer]:
            - /url: "#calc"
          - link "Xem bảng giá" [ref=f1e34] [cursor=pointer]:
            - /url: "#pricing"
        - generic [ref=f1e35]:
          - generic [ref=f1e36]:
            - generic [ref=f1e37]: ✓
            - text: An toàn cho bé
          - generic [ref=f1e38]:
            - generic [ref=f1e39]: ✓
            - text: Hơn 15 năm kinh nghiệm
          - generic [ref=f1e40]:
            - generic [ref=f1e41]: ✓
            - text: Nhân viên có nghề
      - generic [ref=f1e42]:
        - img "Bé sau grooming tại Mật Pet" [ref=f1e44]
        - generic [ref=f1e45]:
          - generic [ref=f1e46]: 🐾
          - generic [ref=f1e47]:
            - generic [ref=f1e48]: Đã chăm sóc
            - generic [ref=f1e49]: 10.000+
    - generic [ref=f1e52]:
      - generic [ref=f1e53]:
        - generic [ref=f1e54]:
          - button "1 Loại bé Chó / Mèo" [ref=f1e55] [cursor=pointer]:
            - generic [ref=f1e56]: "1"
            - generic [ref=f1e57]:
              - text: Loại bé
              - generic [ref=f1e58]: Chó / Mèo
          - button "2 Cân nặng Bậc định sẵn" [ref=f1e59] [cursor=pointer]:
            - generic [ref=f1e60]: "2"
            - generic [ref=f1e61]:
              - text: Cân nặng
              - generic [ref=f1e62]: Bậc định sẵn
          - button "3 Dịch vụ Combo hoặc lẻ" [ref=f1e63] [cursor=pointer]:
            - generic [ref=f1e64]: "3"
            - generic [ref=f1e65]:
              - text: Dịch vụ
              - generic [ref=f1e66]: Combo hoặc lẻ
        - generic [ref=f1e68]:
          - heading "Bé nhà bạn là?" [level=3] [ref=f1e69]
          - paragraph [ref=f1e70]: Chọn loại để hiển thị đúng bậc cân nặng & dịch vụ.
          - generic [ref=f1e71]:
            - button "🐶 Chó" [ref=f1e72] [cursor=pointer]:
              - generic [ref=f1e73]: 🐶
              - generic [ref=f1e74]: Chó
            - button "🐱 Mèo" [ref=f1e75] [cursor=pointer]:
              - generic [ref=f1e76]: 🐱
              - generic [ref=f1e77]: Mèo
          - generic [ref=f1e78]:
            - button "← Quay lại" [disabled]
            - button "Tiếp tục →" [disabled]
      - complementary [ref=f1e79]:
        - generic [ref=f1e80]:
          - generic [ref=f1e81]: Giá dự kiến
          - generic [ref=f1e82]: Chọn dịch vụ để xem giá dự kiến cho bé của bạn 🐾
          - button "Giữ chỗ với mức giá này →" [disabled]
    - generic [ref=f1e85]:
      - generic [ref=f1e86]:
        - heading "Tóm tắt lựa chọn" [level=4] [ref=f1e87]
        - generic [ref=f1e88]:
          - generic [ref=f1e89]: Chưa có lựa chọn
          - generic [ref=f1e90]: —
        - paragraph [ref=f1e91]: Giá cuối được xác nhận tại spa sau khi cân & kiểm tra tình trạng lông. Dịch vụ "báo giá riêng" sẽ được tư vấn khi spa gọi lại.
      - generic [ref=f1e93]:
        - generic [ref=f1e94]:
          - generic [ref=f1e95]: Số điện thoại / Zalo *
          - textbox "Số điện thoại / Zalo *" [ref=f1e96]:
            - /placeholder: 0xxx xxx xxx
        - generic [ref=f1e97]:
          - generic [ref=f1e98]: Tên bé
          - textbox "Tên bé" [ref=f1e99]:
            - /placeholder: "Vd: Mochi"
        - generic [ref=f1e100]:
          - generic [ref=f1e101]: Ngày mong muốn
          - generic [ref=f1e102]:
            - button "Hôm nay 21/11" [ref=f1e103] [cursor=pointer]:
              - generic [ref=f1e104]: Hôm nay
              - generic [ref=f1e105]: 21/11
            - button "Ngày mai 22/11" [ref=f1e106] [cursor=pointer]:
              - generic [ref=f1e107]: Ngày mai
              - generic [ref=f1e108]: 22/11
            - button "T2 23/11" [ref=f1e109] [cursor=pointer]:
              - generic [ref=f1e110]: T2
              - generic [ref=f1e111]: 23/11
            - button "T3 24/11" [ref=f1e112] [cursor=pointer]:
              - generic [ref=f1e113]: T3
              - generic [ref=f1e114]: 24/11
            - button "T4 25/11" [ref=f1e115] [cursor=pointer]:
              - generic [ref=f1e116]: T4
              - generic [ref=f1e117]: 25/11
            - generic [ref=f1e118] [cursor=pointer]:
              - text: Ngày khác
              - textbox "Ngày khác" [ref=f1e122]
        - paragraph [ref=f1e123]: Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại / Zalo để xác nhận lịch.
        - button "Giữ chỗ cho bé →" [ref=f1e124] [cursor=pointer]
    - generic [ref=f1e125]: "* Giá trên chưa bao gồm phí gỡ rối, tẩy ố và tắm trắng."
  - contentinfo [ref=f1e135]:
    - generic [ref=f1e137]:
      - generic [ref=f1e138]:
        - img "Mật Pet Family" [ref=f1e139]
        - paragraph [ref=f1e140]: Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.
        - generic [ref=f1e141]:
          - link "YouTube" [ref=f1e142] [cursor=pointer]:
            - /url: https://www.youtube.com/@matpetfamily2011
          - link "Facebook" [ref=f1e143] [cursor=pointer]:
            - /url: https://www.facebook.com/matpetfamily
          - link "TikTok" [ref=f1e144] [cursor=pointer]:
            - /url: https://www.tiktok.com/@matpetfamilyshop
      - generic [ref=f1e145]:
        - paragraph [ref=f1e146]: Pet Shop
        - list [ref=f1e147]:
          - listitem [ref=f1e148]:
            - link "Trang chủ" [ref=f1e149] [cursor=pointer]:
              - /url: /
          - listitem [ref=f1e150]:
            - link "Chó" [ref=f1e151] [cursor=pointer]:
              - /url: /cho
          - listitem [ref=f1e152]:
            - link "Mèo" [ref=f1e153] [cursor=pointer]:
              - /url: /meo
          - listitem [ref=f1e154]:
            - link "Tìm Bé Thương" [ref=f1e155] [cursor=pointer]:
              - /url: /tim-be-thuong
          - listitem [ref=f1e156]:
            - link "Bảng giá" [ref=f1e157] [cursor=pointer]:
              - /url: /bang-gia
          - listitem [ref=f1e158]:
            - link "Bảo hành" [ref=f1e159] [cursor=pointer]:
              - /url: /bao-hanh
          - listitem [ref=f1e160]:
            - link "Về Mật Pet" [ref=f1e161] [cursor=pointer]:
              - /url: /vematpet
          - listitem [ref=f1e162]:
            - link "Tuyển dụng" [ref=f1e163] [cursor=pointer]:
              - /url: /tuyendung
      - generic [ref=f1e164]:
        - paragraph [ref=f1e165]: Nội dung & cộng đồng
        - list [ref=f1e166]:
          - listitem [ref=f1e167]:
            - link "Blog" [ref=f1e168] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=f1e169]:
            - link "Hướng dẫn chăm sóc" [ref=f1e170] [cursor=pointer]:
              - /url: /cham-soc
          - listitem [ref=f1e171]:
            - link "So sánh giống" [ref=f1e172] [cursor=pointer]:
              - /url: /so-sanh
          - listitem [ref=f1e173]:
            - link "Hỏi đáp" [ref=f1e174] [cursor=pointer]:
              - /url: /cau-hoi-thuong-gap
          - listitem [ref=f1e175]:
            - link "Đánh giá khách hàng" [ref=f1e176] [cursor=pointer]:
              - /url: /danh-gia-khach-hang
          - listitem [ref=f1e177]:
            - link "Showroom" [ref=f1e178] [cursor=pointer]:
              - /url: /showroom
      - generic [ref=f1e179]:
        - paragraph [ref=f1e180]: Liên hệ
        - list [ref=f1e181]:
          - listitem [ref=f1e182]:
            - link "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM" [ref=f1e186] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
          - listitem [ref=f1e187]:
            - link "0939863696" [ref=f1e190] [cursor=pointer]:
              - /url: tel:0939863696
          - listitem [ref=f1e191]:
            - link "matpetfamily2011@gmail.com" [ref=f1e195] [cursor=pointer]:
              - /url: mailto:matpetfamily2011@gmail.com
          - listitem [ref=f1e196]:
            - generic [ref=f1e200]: 08:00 - 22:00 mỗi ngày
    - generic [ref=f1e201]: © 2011–2026 Mật Pet Family. All rights reserved.
  - button "Mở tư vấn cùng Mật" [ref=f1e203] [cursor=pointer]
  - alert [ref=f1e205]
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
  83  |       expect(doDuc.domContentLoaded, `${heThong}: DOMContentLoaded`).toBeLessThanOrEqual(GIOI_HAN_DCL);
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
> 96  |       expect(doDuc.lcp, `${heThong}: LCP`).toBeLessThanOrEqual(GIOI_HAN_LCP);
      |                                            ^ Error: T2: LCP
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