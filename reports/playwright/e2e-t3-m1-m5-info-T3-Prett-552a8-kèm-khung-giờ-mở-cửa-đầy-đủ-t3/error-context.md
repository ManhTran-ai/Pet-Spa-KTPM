# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t3\m1-m5-info.spec.ts >> T3 Pretty Paws — M1/M5 Truy cập, liên hệ và trạng thái tiệm >> TC-T3-M5-005: trang hiển thị trạng thái mở/đóng kèm khung giờ mở cửa đầy đủ
- Location: tests\e2e\t3\m1-m5-info.spec.ts:32:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /\b(Open|Closed)\b/
Received string:  "Pretty Paws Cat and Dog Grooming
Pretty Paws Cat and Dog Grooming
(609) 816-7755
nycoleco@yahoo.com
Hamilton, NJ, US
Direction
8:00 AM - 8:00 PM
Book Now
Business Hours
SUN
8:00 AM
-
8:00 PM
MON
8:00 AM
-
8:00 PM
TUE
8:00 AM
-
8:00 PM
WED
8:00 AM
-
8:00 PM
THU
8:00 AM
-
8:00 PM
FRI
8:00 AM
-
8:00 PM
SAT
8:00 AM
-
8:00 PM
About us
My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
Services
EMERGENCY APPOINTMENT (2)
Dog (bath included) (16)
Cat (bath included) (4)
QUICK SERVICE (no bath) (12)
ADD ON TO GROOM (7)
Powered by GrooMore, Inc.
Book Now"
```

# Page snapshot

```yaml
- dialog [active] [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img "business logo"
      - generic [ref=e6]: Pretty Paws Cat and Dog Grooming
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e14]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=e15]
          - generic [ref=e16]:
            - link "(609) 816-7755" [ref=e20] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=e24] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=e28] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=e32] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=e33]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=e39] [cursor=pointer]
        - generic [ref=e42]:
          - heading "Business Hours" [level=5] [ref=e43]
          - list [ref=e44]:
            - generic [ref=e45]:
              - generic [ref=e46]: SUN
              - generic [ref=e47]: 8:00 AM
              - generic [ref=e48]: "-"
              - generic [ref=e49]: 8:00 PM
            - generic [ref=e50]:
              - generic [ref=e51]: MON
              - generic [ref=e52]: 8:00 AM
              - generic [ref=e53]: "-"
              - generic [ref=e54]: 8:00 PM
            - generic [ref=e55]:
              - generic [ref=e56]: TUE
              - generic [ref=e57]: 8:00 AM
              - generic [ref=e58]: "-"
              - generic [ref=e59]: 8:00 PM
            - generic [ref=e60]:
              - generic [ref=e61]: WED
              - generic [ref=e62]: 8:00 AM
              - generic [ref=e63]: "-"
              - generic [ref=e64]: 8:00 PM
            - generic [ref=e65]:
              - generic [ref=e66]: THU
              - generic [ref=e67]: 8:00 AM
              - generic [ref=e68]: "-"
              - generic [ref=e69]: 8:00 PM
            - generic [ref=e70]:
              - generic [ref=e71]: FRI
              - generic [ref=e72]: 8:00 AM
              - generic [ref=e73]: "-"
              - generic [ref=e74]: 8:00 PM
            - generic [ref=e75]:
              - generic [ref=e76]: SAT
              - generic [ref=e77]: 8:00 AM
              - generic [ref=e78]: "-"
              - generic [ref=e79]: 8:00 PM
      - generic [ref=e80]:
        - heading "About us" [level=5] [ref=e81]
        - generic [ref=e83]:
          - generic [ref=e84]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=e85]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=e86]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=e87]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=e89]:
        - heading "Services" [level=5] [ref=e90]
        - list [ref=e91]:
          - listitem [ref=e92]:
            - generic [ref=e93]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=e97]:
            - generic [ref=e98]: Dog (bath included) (16)
          - listitem [ref=e102]:
            - generic [ref=e103]: Cat (bath included) (4)
          - listitem [ref=e107]:
            - generic [ref=e108]: QUICK SERVICE (no bath) (12)
          - listitem [ref=e112]:
            - generic [ref=e113]: ADD ON TO GROOM (7)
    - generic [ref=e128]:
      - heading [level=6] [ref=e129]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=e130] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=e131] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect, type Page } from '@playwright/test';
  2  | 
  3  | /**
  4  |  * FR-M1-01, FR-M1-03, FR-M5-07, FR-M4-11 — T3 Pretty Paws
  5  |  * Trang chủ trả HTTP 200, có thông tin liên hệ, trạng thái mở/đóng và nút đặt lịch 24/7.
  6  |  * Chỉ đọc, không bấm "Book Now" để tránh mở form gửi dữ liệu (ADR-11).
  7  |  */
  8  | 
  9  | /** Trang T3 render nội dung trong một Drawer của Material UI; chờ Drawer hiện rồi mới đọc text. */
  10 | async function noiDungTrang(page: Page): Promise<string> {
  11 |   const drawer = page.locator('.MuiDrawer-paper');
  12 |   await drawer.waitFor({ state: 'visible', timeout: 20_000 });
  13 |   return drawer.innerText();
  14 | }
  15 | 
  16 | test.describe('T3 Pretty Paws — M1/M5 Truy cập, liên hệ và trạng thái tiệm', () => {
  17 |   test('TC-T3-M1-001: trang chủ trả HTTP 200 và có tiêu đề', async ({ page }) => {
  18 |     const response = await page.goto('/', { waitUntil: 'domcontentloaded' });
  19 |     expect(response?.status()).toBe(200);
  20 |     await expect(page).toHaveTitle(/Pretty Paws/i);
  21 |   });
  22 | 
  23 |   test('TC-T3-M1-003: trang hiển thị đủ điện thoại, email và địa chỉ', async ({ page }) => {
  24 |     await page.goto('/', { waitUntil: 'load' });
  25 |     const body = await noiDungTrang(page);
  26 | 
  27 |     expect(body).toMatch(/\(?\d{3}\)?\s*\d{3}-\d{4}/);
  28 |     expect(body).toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  29 |     expect(body).toMatch(/Hamilton,?\s*NJ/i);
  30 |   });
  31 | 
  32 |   test('TC-T3-M5-005: trang hiển thị trạng thái mở/đóng kèm khung giờ mở cửa đầy đủ', async ({ page }) => {
  33 |     await page.goto('/', { waitUntil: 'load' });
  34 |     const body = await noiDungTrang(page);
  35 | 
> 36 |     expect(body).toMatch(/\b(Open|Closed)\b/);
     |                  ^ Error: expect(received).toMatch(expected)
  37 |     expect(body).toMatch(/\d{1,2}:\d{2}\s*AM\s*-\s*\d{1,2}:\d{2}\s*PM/);
  38 |   });
  39 | 
  40 |   test('TC-T3-M4-009: có nút "Book Now" để đặt lịch 24/7 mà không cần đăng nhập', async ({ page }) => {
  41 |     await page.goto('/', { waitUntil: 'load' });
  42 |     await noiDungTrang(page);
  43 |     await expect(page.getByRole('button', { name: 'Book Now' }).first()).toBeVisible();
  44 |     // Không có trường đăng nhập/đăng ký trên trang chủ.
  45 |     await expect(page.getByRole('textbox', { name: /password|mật khẩu/i })).toHaveCount(0);
  46 |   });
  47 | });
  48 | 
```