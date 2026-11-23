# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: nfr\reliability.spec.ts >> NFR-05 — Độ tin cậy >> TC-NFR-05-003: tải lại trang giữ nguyên trạng thái đã chọn
- Location: tests\nfr\reliability.spec.ts:88:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.rail-price')
Expected substring: "200.000"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toContainText" locator('.rail-price') with timeout 15000ms
  - waiting for locator('.rail-price')

```

```yaml
- banner:
  - link "Mật Pet Family - Since 2011 Peace of Mind":
    - /url: /
    - img "Mật Pet Family - Since 2011 Peace of Mind"
  - navigation:
    - link "Trang chủ":
      - /url: /
    - link "Chó":
      - /url: /cho
    - link "Mèo":
      - /url: /meo
    - link "Tìm Bé Thương":
      - /url: /tim-be-thuong
    - link "Spa":
      - /url: /spa
    - link "Bảo hành":
      - /url: /bao-hanh
    - link "Về Mật Pet":
      - /url: /vematpet
  - button "Tìm kiếm"
  - link "Tiếng Việt":
    - /url: /spa
    - text: VI
  - text: "|"
  - link "English":
    - /url: /en/spa
    - text: EN
  - link "0939.86.36.96":
    - /url: tel:0939863696
- text: Spa & Grooming · Từ 2011
- heading "Biết giá trước khi đưa bé đến spa." [level=1]
- paragraph: Chọn loại bé, cân nặng và dịch vụ — bạn thấy ngay mức giá dự kiến minh bạch, rồi giữ chỗ chỉ với số điện thoại. Không còn phải nhắn tin hỏi giá.
- link "Tính giá dự kiến →":
  - /url: "#calc"
- link "Xem bảng giá":
  - /url: "#pricing"
- text: ✓ An toàn cho bé ✓ Hơn 15 năm kinh nghiệm ✓ Nhân viên có nghề
- img "Bé sau grooming tại Mật Pet"
- text: 🐾 Đã chăm sóc 10.000+ Calculator
- heading "Tính giá dự kiến cho bé" [level=2]
- paragraph: Ba bước nhanh. Giá hiện ngay khi bạn chọn — chưa phải để lại thông tin gì.
- button "1 Loại bé Chó / Mèo"
- button "2 Cân nặng Bậc định sẵn"
- button "3 Dịch vụ Combo hoặc lẻ"
- heading "Bé nhà bạn là?" [level=3]
- paragraph: Chọn loại để hiển thị đúng bậc cân nặng & dịch vụ.
- button "🐶 Chó"
- button "🐱 Mèo"
- button "← Quay lại" [disabled]
- button "Tiếp tục →" [disabled]
- complementary:
  - text: Giá dự kiến Chọn dịch vụ để xem giá dự kiến cho bé của bạn 🐾
  - button "Giữ chỗ với mức giá này →" [disabled]
- heading "Tóm tắt lựa chọn" [level=4]
- text: Chưa có lựa chọn —
- paragraph: Giá cuối được xác nhận tại spa sau khi cân & kiểm tra tình trạng lông. Dịch vụ "báo giá riêng" sẽ được tư vấn khi spa gọi lại.
- text: Số điện thoại / Zalo *
- textbox "Số điện thoại / Zalo *":
  - /placeholder: 0xxx xxx xxx
- text: Tên bé
- textbox "Tên bé":
  - /placeholder: "Vd: Mochi"
- text: Ngày mong muốn
- button "Hôm nay 21/11"
- button "Ngày mai 22/11"
- button "T2 23/11"
- button "T3 24/11"
- button "T4 25/11"
- text: Ngày khác
- textbox "Ngày khác"
- paragraph: Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại / Zalo để xác nhận lịch.
- button "Giữ chỗ cho bé →"
- text: "* Giá trên chưa bao gồm phí gỡ rối, tẩy ố và tắm trắng."
- contentinfo:
  - img "Mật Pet Family"
  - paragraph: Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.
  - link "YouTube":
    - /url: https://www.youtube.com/@matpetfamily2011
  - link "Facebook":
    - /url: https://www.facebook.com/matpetfamily
  - link "TikTok":
    - /url: https://www.tiktok.com/@matpetfamilyshop
  - paragraph: Pet Shop
  - list:
    - listitem:
      - link "Trang chủ":
        - /url: /
    - listitem:
      - link "Chó":
        - /url: /cho
    - listitem:
      - link "Mèo":
        - /url: /meo
    - listitem:
      - link "Tìm Bé Thương":
        - /url: /tim-be-thuong
    - listitem:
      - link "Bảng giá":
        - /url: /bang-gia
    - listitem:
      - link "Bảo hành":
        - /url: /bao-hanh
    - listitem:
      - link "Về Mật Pet":
        - /url: /vematpet
    - listitem:
      - link "Tuyển dụng":
        - /url: /tuyendung
  - paragraph: Nội dung & cộng đồng
  - list:
    - listitem:
      - link "Blog":
        - /url: /blog
    - listitem:
      - link "Hướng dẫn chăm sóc":
        - /url: /cham-soc
    - listitem:
      - link "So sánh giống":
        - /url: /so-sanh
    - listitem:
      - link "Hỏi đáp":
        - /url: /cau-hoi-thuong-gap
    - listitem:
      - link "Đánh giá khách hàng":
        - /url: /danh-gia-khach-hang
    - listitem:
      - link "Showroom":
        - /url: /showroom
  - paragraph: Liên hệ
  - list:
    - listitem:
      - link "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM":
        - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
    - listitem:
      - link "0939863696":
        - /url: tel:0939863696
    - listitem:
      - link "matpetfamily2011@gmail.com":
        - /url: mailto:matpetfamily2011@gmail.com
    - listitem: 08:00 - 22:00 mỗi ngày
  - text: © 2011–2026 Mật Pet Family. All rights reserved.
- button "Tắt lời chào": ×
- link "Mật đây! 🐾 Cần chọn bé cưng? Để Mật giúp nha.":
  - /url: /tim-be-thuong
- button "Mở tư vấn cùng Mật"
- alert
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * NFR-05 — Độ tin cậy (Ngân, Ngày 8/11).
  5   |  *
  6   |  * TC-NFR-05-001: gửi form 3 lần liên tiếp không tạo bản ghi trùng.
  7   |  * TC-NFR-05-002: lỗi mạng hiển thị thông báo, không treo trang.
  8   |  * TC-NFR-05-003: tải lại trang giữ nguyên trạng thái đã chọn.
  9   |  * TC-NFR-05-004: tải lại trang trong luồng wizard không làm mất lựa chọn.
  10  |  *
  11  |  * Ranh giới ADR-11: chỉ đọc và kiểm tra trạng thái, KHÔNG gửi form hợp lệ
  12  |  * (không tạo bản ghi thật trên hệ thống đang chạy).
  13  |  */
  14  | 
  15  | const T2_SPA = 'https://matpet.vn/spa';
  16  | 
  17  | async function chonComboT2(page: Page, band = '>3–6kg') {
  18  |   await page.goto(T2_SPA, { waitUntil: 'load' });
  19  |   await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  20  |   const next = page.getByRole('button', { name: 'Tiếp tục →' });
  21  |   await expect(next).toBeEnabled();
  22  |   await next.click();
  23  |   await page.getByRole('button', { name: band, exact: true }).click();
  24  |   await expect(next).toBeEnabled();
  25  |   await next.click();
  26  |   await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
  27  | }
  28  | 
  29  | test.describe('NFR-05 — Độ tin cậy', () => {
  30  |   test('TC-NFR-05-001: bấm gửi 3 lần liên tiếp không tạo bản ghi trùng', async ({ page }) => {
  31  |     await chonComboT2(page);
  32  |     await page.getByRole('button', { name: 'Giữ chỗ với mức giá này →' }).click();
  33  | 
  34  |     // ADR-11: không được tạo bản ghi thật trên hệ thống đang chạy.
  35  |     // Chặn mọi POST và trả lời giả để quan sát hành vi phía client.
  36  |     let soRequestGui = 0;
  37  |     await page.route('**/*', async (route) => {
  38  |       const req = route.request();
  39  |       if (req.method() === 'POST') {
  40  |         soRequestGui += 1;
  41  |         await route.fulfill({
  42  |           status: 200,
  43  |           contentType: 'application/json',
  44  |           body: JSON.stringify({ ok: true }),
  45  |         });
  46  |         return;
  47  |       }
  48  |       await route.continue();
  49  |     });
  50  | 
  51  |     await page.locator('#f_phone').fill('0912345678');
  52  |     const nútGửi = page.getByRole('button', { name: 'Giữ chỗ cho bé →' });
  53  | 
  54  |     // Bấm tối đa 3 lần; nếu form đã đóng sau lần gửi đầu (dấu hiệu chống
  55  |     // gửi trùng) thì dừng — nút không còn trong DOM.
  56  |     for (let i = 0; i < 3; i += 1) {
  57  |       if (!(await nútGửi.isVisible().catch(() => false))) break;
  58  |       await nútGửi.click();
  59  |       await page.waitForTimeout(800);
  60  |     }
  61  | 
  62  |     // Trang không treo.
  63  |     await expect(page.locator('body')).toBeVisible();
  64  |     // Tối đa 1 lần gửi thực sự ra server cho 3 lần bấm (chống gửi trùng).
  65  |     expect(soRequestGui).toBeLessThanOrEqual(1);
  66  |   });
  67  | 
  68  |   test('TC-NFR-05-002: lỗi mạng hiển thị thông báo, không treo trang', async ({ page }) => {
  69  |     await chonComboT2(page);
  70  | 
  71  |     // Chặn mọi request tới API của site để mô phỏng mất mạng.
  72  |     await page.route('**/api/**', (route) => route.abort('failed'));
  73  | 
  74  |     await page.getByRole('button', { name: 'Giữ chỗ với mức giá này →' }).click();
  75  |     await page.locator('#f_phone').fill('0912345678');
  76  |     await page.getByRole('button', { name: 'Giữ chỗ cho bé →' }).click();
  77  |     await page.waitForTimeout(2_000);
  78  | 
  79  |     // Trang vẫn phản hồi (không treo) và có thông báo lỗi hoặc thông báo
  80  |     // thất bại cho người dùng.
  81  |     await expect(page.locator('body')).toBeVisible();
  82  |     const coThongBao = await page
  83  |       .getByText(/không gửi được|thất bại|lỗi|vui lòng thử lại|liên hệ/i)
  84  |       .count();
  85  |     expect(coThongBao).toBeGreaterThan(0);
  86  |   });
  87  | 
  88  |   test('TC-NFR-05-003: tải lại trang giữ nguyên trạng thái đã chọn', async ({ page }) => {
  89  |     await chonComboT2(page);
  90  |     await page.reload({ waitUntil: 'load' });
  91  |     await page.waitForTimeout(1_500);
  92  | 
  93  |     // Tiêu chí chấp nhận NFR-05: 100% lựa chọn được giữ sau khi tải lại trang.
  94  |     // T2 không lưu trạng thái → DEF-029.
> 95  |     await expect(page.locator('.rail-price')).toContainText('200.000');
      |                                               ^ Error: expect(locator).toContainText(expected) failed
  96  |     await expect(page.locator('.rail-lines')).toContainText('Combo Tắm Vệ Sinh');
  97  |   });
  98  | 
  99  |   test('TC-NFR-05-004: tải lại trang trong luồng wizard không làm mất lựa chọn', async ({ page }) => {
  100 |     await page.goto(T2_SPA, { waitUntil: 'load' });
  101 |     await page.getByRole('button', { name: '🐶 Chó', exact: true }).click();
  102 |     const next = page.getByRole('button', { name: 'Tiếp tục →' });
  103 |     await expect(next).toBeEnabled();
  104 |     await next.click();
  105 |     await page.getByRole('button', { name: '>6–10kg', exact: true }).click();
  106 | 
  107 |     await page.reload({ waitUntil: 'load' });
  108 |     await page.waitForTimeout(1_500);
  109 | 
  110 |     // Bậc cân nặng đã chọn vẫn còn sau khi tải lại (DEF-029).
  111 |     await expect(page.locator('.chip.sel')).toHaveText('>6–10kg');
  112 |   });
  113 | });
  114 | 
```