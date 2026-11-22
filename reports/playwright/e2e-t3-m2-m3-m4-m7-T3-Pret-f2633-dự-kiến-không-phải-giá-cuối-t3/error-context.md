# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t3\m2-m3-m4-m7.spec.ts >> T3 Pretty Paws — M2/M3 Danh mục dịch vụ và bảng giá >> TC-T3-M3-004: giá được ghi rõ là dự kiến, không phải giá cuối
- Location: tests\e2e\t3\m2-m3-m4-m7.spec.ts:104:3

# Error details

```
Error: expect(received).toMatch(expected)

Expected pattern: /final price|confirmed at|at the shop|actual weight|final/i
Received string:  "Pretty Paws Cat and Dog Grooming
Pretty Paws Cat and Dog Grooming
(609) 816-7755
nycoleco@yahoo.com
Hamilton, NJ, US
Direction
Closed
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
Dog Bath 0-20lbs
Bath, shampoo, conditioner, nail clip/file, brush out, teeth brush, and ear clean. * Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
$52.00
30mins
Dog Bath 20-50lbs
Bath, shampoo, conditioner, nail clip/file, ears, teeth, brush out *Your choice of shampoo and conditioner *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
$65.00
30mins
Dog Bath short hair over 50lbs
Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
$72.00
1h
Dog bath medium/long hair over 50lbs
Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
$79.00
1h
Dog Bath and tidy up 0 - 20lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
$62.00
30mins
Dog Bath and tidy up 21 - 40lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
$72.00
1h
Dog Bath and tidy up 41 - 60lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
$91.00
1h
Dog Bath and tidy up 61- 79lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
$99.00
1h
Dog Bath and tidy up 79+ lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
$118.00
1h
Dog Full Groom 0 - 20 lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$69.00
1h
Dog Full groom 21 - 30lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$77.00
1h
Dog Full Groom 31 - 40lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$86.00
1h
Dog Full Groom 41 - 60lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$102.00
1h
Dog Full groom 61 - 78lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$121.00
1h 30mins
Dog Full groom 79 - 90lbs
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$136.00
2h
Dog Full Groom 91-100+ pounds
Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
$175.00
2h
Cat (bath included) (4)
QUICK SERVICE (no bath) (12)
ADD ON TO GROOM (7)
Keyboard shortcuts
Map data ©2026 Google
Terms
Powered by GrooMore, Inc.
Book Now"
```

# Page snapshot

```yaml
- dialog [active] [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img "business logo" [ref=e6]
      - generic [ref=e7]: Pretty Paws Cat and Dog Grooming
    - generic [ref=e52]:
      - generic [ref=e53]:
        - generic [ref=e55]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=e56]
          - generic [ref=e57]:
            - link "(609) 816-7755" [ref=e61] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=e65] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=e69] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=e73] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=e74]:
              - generic [ref=e78]: Closed
              - generic [ref=e79]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=e81] [cursor=pointer]
        - generic [ref=e84]:
          - heading "Business Hours" [level=5] [ref=e85]
          - list [ref=e86]:
            - generic [ref=e87]:
              - generic [ref=e88]: SUN
              - generic [ref=e89]: 8:00 AM
              - generic [ref=e90]: "-"
              - generic [ref=e91]: 8:00 PM
            - generic [ref=e92]:
              - generic [ref=e93]: MON
              - generic [ref=e94]: 8:00 AM
              - generic [ref=e95]: "-"
              - generic [ref=e96]: 8:00 PM
            - generic [ref=e97]:
              - generic [ref=e98]: TUE
              - generic [ref=e99]: 8:00 AM
              - generic [ref=e100]: "-"
              - generic [ref=e101]: 8:00 PM
            - generic [ref=e102]:
              - generic [ref=e103]: WED
              - generic [ref=e104]: 8:00 AM
              - generic [ref=e105]: "-"
              - generic [ref=e106]: 8:00 PM
            - generic [ref=e107]:
              - generic [ref=e108]: THU
              - generic [ref=e109]: 8:00 AM
              - generic [ref=e110]: "-"
              - generic [ref=e111]: 8:00 PM
            - generic [ref=e112]:
              - generic [ref=e113]: FRI
              - generic [ref=e114]: 8:00 AM
              - generic [ref=e115]: "-"
              - generic [ref=e116]: 8:00 PM
            - generic [ref=e117]:
              - generic [ref=e118]: SAT
              - generic [ref=e119]: 8:00 AM
              - generic [ref=e120]: "-"
              - generic [ref=e121]: 8:00 PM
      - generic [ref=e122]:
        - heading "About us" [level=5] [ref=e123]
        - generic [ref=e125]:
          - generic [ref=e126]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=e127]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=e128]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=e129]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=e131]:
        - heading "Services" [level=5] [ref=e132]
        - list [ref=e133]:
          - listitem [ref=e134]:
            - generic [ref=e135]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=e139]:
            - generic [ref=e140]: Dog (bath included) (16)
          - generic [ref=e146]:
            - listitem [ref=e147]:
              - generic [ref=e148]:
                - generic [ref=e149]:
                  - generic [ref=e150]: Dog Bath 0-20lbs
                  - generic [ref=e151]: Bath, shampoo, conditioner, nail clip/file, brush out, teeth brush, and ear clean. * Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e152]:
                  - generic [ref=e153]: $52.00
                  - generic [ref=e154]: 30mins
            - listitem [ref=e155]:
              - generic [ref=e156]:
                - generic [ref=e157]:
                  - generic [ref=e158]: Dog Bath 20-50lbs
                  - generic [ref=e159]: Bath, shampoo, conditioner, nail clip/file, ears, teeth, brush out *Your choice of shampoo and conditioner *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e160]:
                  - generic [ref=e161]: $65.00
                  - generic [ref=e162]: 30mins
            - listitem [ref=e163]:
              - generic [ref=e164]:
                - generic [ref=e165]:
                  - generic [ref=e166]: Dog Bath short hair over 50lbs
                  - generic [ref=e167]: Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e168]:
                  - generic [ref=e169]: $72.00
                  - generic [ref=e170]: 1h
            - listitem [ref=e171]:
              - generic [ref=e172]:
                - generic [ref=e173]:
                  - generic [ref=e174]: Dog bath medium/long hair over 50lbs
                  - generic [ref=e175]: Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e176]:
                  - generic [ref=e177]: $79.00
                  - generic [ref=e178]: 1h
            - listitem [ref=e179]:
              - generic [ref=e180]:
                - generic [ref=e181]:
                  - generic [ref=e182]: Dog Bath and tidy up 0 - 20lbs
                  - generic [ref=e183]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e184]:
                  - generic [ref=e185]: $62.00
                  - generic [ref=e186]: 30mins
            - listitem [ref=e187]:
              - generic [ref=e188]:
                - generic [ref=e189]:
                  - generic [ref=e190]: Dog Bath and tidy up 21 - 40lbs
                  - generic [ref=e191]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e192]:
                  - generic [ref=e193]: $72.00
                  - generic [ref=e194]: 1h
            - listitem [ref=e195]:
              - generic [ref=e196]:
                - generic [ref=e197]:
                  - generic [ref=e198]: Dog Bath and tidy up 41 - 60lbs
                  - generic [ref=e199]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e200]:
                  - generic [ref=e201]: $91.00
                  - generic [ref=e202]: 1h
            - listitem [ref=e203]:
              - generic [ref=e204]:
                - generic [ref=e205]:
                  - generic [ref=e206]: Dog Bath and tidy up 61- 79lbs
                  - generic [ref=e207]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e208]:
                  - generic [ref=e209]: $99.00
                  - generic [ref=e210]: 1h
            - listitem [ref=e211]:
              - generic [ref=e212]:
                - generic [ref=e213]:
                  - generic [ref=e214]: Dog Bath and tidy up 79+ lbs
                  - generic [ref=e215]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e216]:
                  - generic [ref=e217]: $118.00
                  - generic [ref=e218]: 1h
            - listitem [ref=e219]:
              - generic [ref=e220]:
                - generic [ref=e221]:
                  - generic [ref=e222]: Dog Full Groom 0 - 20 lbs
                  - generic [ref=e223]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e224]:
                  - generic [ref=e225]: $69.00
                  - generic [ref=e226]: 1h
            - listitem [ref=e227]:
              - generic [ref=e228]:
                - generic [ref=e229]:
                  - generic [ref=e230]: Dog Full groom 21 - 30lbs
                  - generic [ref=e231]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e232]:
                  - generic [ref=e233]: $77.00
                  - generic [ref=e234]: 1h
            - listitem [ref=e235]:
              - generic [ref=e236]:
                - generic [ref=e237]:
                  - generic [ref=e238]: Dog Full Groom 31 - 40lbs
                  - generic [ref=e239]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e240]:
                  - generic [ref=e241]: $86.00
                  - generic [ref=e242]: 1h
            - listitem [ref=e243]:
              - generic [ref=e244]:
                - generic [ref=e245]:
                  - generic [ref=e246]: Dog Full Groom 41 - 60lbs
                  - generic [ref=e247]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e248]:
                  - generic [ref=e249]: $102.00
                  - generic [ref=e250]: 1h
            - listitem [ref=e251]:
              - generic [ref=e252]:
                - generic [ref=e253]:
                  - generic [ref=e254]: Dog Full groom 61 - 78lbs
                  - generic [ref=e255]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e256]:
                  - generic [ref=e257]: $121.00
                  - generic [ref=e258]: 1h 30mins
            - listitem [ref=e259]:
              - generic [ref=e260]:
                - generic [ref=e261]:
                  - generic [ref=e262]: Dog Full groom 79 - 90lbs
                  - generic [ref=e263]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e264]:
                  - generic [ref=e265]: $136.00
                  - generic [ref=e266]: 2h
            - listitem [ref=e267]:
              - generic [ref=e268]:
                - generic [ref=e269]:
                  - generic [ref=e270]: Dog Full Groom 91-100+ pounds
                  - generic [ref=e271]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e272]:
                  - generic [ref=e273]: $175.00
                  - generic [ref=e274]: 2h
          - listitem [ref=e275]:
            - generic [ref=e276]: Cat (bath included) (4)
          - listitem [ref=e280]:
            - generic [ref=e281]: QUICK SERVICE (no bath) (12)
          - listitem [ref=e285]:
            - generic [ref=e286]: ADD ON TO GROOM (7)
      - generic [ref=e296]:
        - generic:
          - button "Keyboard shortcuts"
        - region "Map" [ref=e297]
        - generic [ref=e298]:
          - iframe [aria-hidden] [ref=e350]
          - button "Toggle fullscreen view" [ref=e351] [cursor=pointer]
          - button "Map camera controls" [ref=e353] [cursor=pointer]
          - link "Open this area in Google Maps (opens a new window)" [ref=e355] [cursor=pointer]:
            - /url: https://maps.google.com/maps?ll=39.450958,-74.642714&z=11&t=m&hl=en-US&gl=US&mapclient=apiv3
            - img "Google" [ref=e357]
          - generic [ref=e358]:
            - button "Keyboard shortcuts" [ref=e364] [cursor=pointer]
            - generic [ref=e365]: Map data ©2026 Google
            - link "Terms (opens in new tab)" [ref=e374] [cursor=pointer]:
              - /url: https://www.google.com/intl/en-US_US/help/terms_maps.html
              - text: Terms
    - generic [ref=e376]:
      - heading [level=6] [ref=e377]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=e378] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=e379] [cursor=pointer]
```

# Test source

```ts
  11  | 
  12  | /** Drawer "Book Now" của T3 — chỉ mở khi cần kiểm tra form M4. */
  13  | async function moDrawer(page: Page) {
  14  |   await page.getByRole('button', { name: 'Book Now' }).first().click();
  15  |   const drawer = page.locator('.MuiDrawer-paper');
  16  |   await drawer.waitFor({ state: 'visible', timeout: 30_000 });
  17  |   return drawer;
  18  | }
  19  | 
  20  | /** Mở nhóm dịch vụ để danh mục và giá được render ra. */
  21  | async function moNhomDichVu(page: Page, tenNhom: string) {
  22  |   await page.getByText(tenNhom, { exact: false }).first().scrollIntoViewIfNeeded();
  23  |   await page.getByText(tenNhom, { exact: false }).first().click();
  24  |   await page.waitForTimeout(1500);
  25  | }
  26  | 
  27  | test.describe('T3 Pretty Paws — M2/M3 Danh mục dịch vụ và bảng giá', () => {
  28  |   test('TC-T3-M2-001: mọi dịch vụ trong danh mục có tên, mô tả và thời lượng', async ({ page }) => {
  29  |     await page.goto('/', { waitUntil: 'load' });
  30  |     await page.waitForTimeout(2500);
  31  | 
  32  |     // Danh mục được chia thành 5 nhóm; mỗi nhóm khai số lượng dịch vụ.
  33  |     await expect(page.getByText('EMERGENCY APPOINTMENT (2)')).toBeVisible();
  34  |     await expect(page.getByText('Dog (bath included) (16)')).toBeVisible();
  35  |     await expect(page.getByText('Cat (bath included) (4)')).toBeVisible();
  36  |     await expect(page.getByText('QUICK SERVICE (no bath) (12)')).toBeVisible();
  37  |     await expect(page.getByText('ADD ON TO GROOM (7)')).toBeVisible();
  38  | 
  39  |     await moNhomDichVu(page, 'Dog (bath included)');
  40  | 
  41  |     // Mỗi dịch vụ phải có mô tả và thời lượng ("30mins" / "1h").
  42  |     const body = await page.locator('body').innerText();
  43  |     expect(body).toMatch(/Dog Bath 0-20lbs/);
  44  |     expect(body).toMatch(/30mins|1h|1h30mins|2h/);
  45  |   });
  46  | 
  47  |   test('TC-T3-M2-002: mỗi dịch vụ có mô tả thành phần dịch vụ', async ({ page }) => {
  48  |     await page.goto('/', { waitUntil: 'load' });
  49  |     await page.waitForTimeout(2500);
  50  |     await moNhomDichVu(page, 'Dog (bath included)');
  51  | 
  52  |     const body = await page.locator('body').innerText();
  53  |     // Mô tả dịch vụ nêu các thành phần (tắm, cắt móng, chải, vệ sinh tai...).
  54  |     expect(body).toMatch(/shampoo|conditioner|nail clip|brush out|ears|teeth/i);
  55  |   });
  56  | 
  57  |   test('TC-T3-M3-001: bảng giá có đủ cột cho mọi dịch vụ trong nhóm', async ({ page }) => {
  58  |     await page.goto('/', { waitUntil: 'load' });
  59  |     await page.waitForTimeout(2500);
  60  |     await moNhomDichVu(page, 'Dog (bath included)');
  61  | 
  62  |     const gia = await page.locator('body').innerText();
  63  |     const soDichVu = (gia.match(/\(\d+\)/g) ?? []).length;
  64  |     expect(soDichVu).toBeGreaterThan(0);
  65  | 
  66  |     // Mỗi dịch vụ mở ra đều có giá dạng $xx.xx — không ô nào ghi "tùy".
  67  |     const prices = gia.match(/\$\s?[\d.]+/g) ?? [];
  68  |     expect(prices.length).toBeGreaterThan(0);
  69  |     expect(gia).not.toMatch(/\$\s?(tùy|tuy|variable|N\/A)/i);
  70  |   });
  71  | 
  72  |   test('TC-T3-M3-002: tra bảng giá đúng cho dịch vụ chọn theo bậc lbs trong tên', async ({ page }) => {
  73  |     await page.goto('/', { waitUntil: 'load' });
  74  |     await page.waitForTimeout(2500);
  75  |     await moNhomDichVu(page, 'Dog (bath included)');
  76  | 
  77  |     // REF-01: Dog Bath 0-20lbs = $52.00 · Dog Bath 20-50lbs = $65.00
  78  |     const body = await page.locator('body').innerText();
  79  |     expect(body).toMatch(/Dog Bath 0-20lbs[\s\S]{0,400}?\$52\.00/);
  80  |     expect(body).toMatch(/Dog Bath 20-50lbs[\s\S]{0,400}?\$65\.00/);
  81  |   });
  82  | 
  83  |   test('TC-T3-M3-003: T3 tách nhóm Chó và Mèo — dịch vụ Mèo có bảng giá riêng', async ({ page }) => {
  84  |     await page.goto('/', { waitUntil: 'load' });
  85  |     await page.waitForTimeout(2500);
  86  | 
  87  |     await moNhomDichVu(page, 'Dog (bath included)');
  88  |     const cho = await page.locator('body').innerText();
  89  |     expect(cho).toMatch(/Dog Bath 0-20lbs[\s\S]{0,400}?\$52\.00/);
  90  | 
  91  |     // Nhóm Mèo có danh mục riêng (Cat Bath) với bảng giá riêng.
  92  |     await moNhomDichVu(page, 'Cat (bath included)');
  93  |     const meo = await page.locator('body').innerText();
  94  |     expect(meo).toMatch(/Cat Bath[\s\S]{0,300}?\$60\.00/);
  95  | 
  96  |     // Dịch vụ Chó và Mèo là hai dòng khác nhau, giá khác nhau.
  97  |     const giaCho = cho.match(/Dog Bath 0-20lbs[\s\S]{0,400}?\$([\d.]+)/)?.[1];
  98  |     const giaMeo = meo.match(/Cat Bath[\s\S]{0,300}?\$([\d.]+)/)?.[1];
  99  |     expect(giaCho).toBeDefined();
  100 |     expect(giaMeo).toBeDefined();
  101 |     expect(giaMeo).not.toBe(giaCho);
  102 |   });
  103 | 
  104 |   test('TC-T3-M3-004: giá được ghi rõ là dự kiến, không phải giá cuối', async ({ page }) => {
  105 |     await page.goto('/', { waitUntil: 'load' });
  106 |     await page.waitForTimeout(2500);
  107 |     await moNhomDichVu(page, 'Dog (bath included)');
  108 | 
  109 |     const body = await page.locator('body').innerText();
  110 |     // Trang phải có câu nhắc giá cuối cùng được xác nhận tại tiệm.
> 111 |     expect(body).toMatch(/final price|confirmed at|at the shop|actual weight|final/i);
      |                  ^ Error: expect(received).toMatch(expected)
  112 |   });
  113 | 
  114 |   test('TC-T3-M3-005: danh mục nêu rõ các khoản phụ thu ngoại lệ', async ({ page }) => {
  115 |     await page.goto('/', { waitUntil: 'load' });
  116 |     await page.waitForTimeout(2500);
  117 | 
  118 |     await expect(page.getByText('EMERGENCY APPOINTMENT (2)')).toBeVisible();
  119 |     await moNhomDichVu(page, 'EMERGENCY APPOINTMENT');
  120 | 
  121 |     const body = await page.locator('body').innerText();
  122 |     expect(body).toMatch(/HOLIDAY FEE/i);
  123 |     expect(body).toMatch(/\$27\.00/);
  124 |     expect(body).toMatch(/Emergency appointment fee/i);
  125 |     expect(body).toMatch(/\$25\.00/);
  126 |   });
  127 | 
  128 |   test('TC-T3-M4-001: drawer Book Now có trường SĐT bắt buộc và chọn quốc gia', async ({ page }) => {
  129 |     await page.goto('/', { waitUntil: 'load' });
  130 |     await page.waitForTimeout(2500);
  131 | 
  132 |     const drawer = await moDrawer(page);
  133 |     const phone = drawer.locator('input.PhoneInputInput');
  134 |     const country = drawer.locator('select.PhoneInputCountrySelect');
  135 | 
  136 |     await expect(phone).toBeVisible();
  137 |     await expect(phone).toHaveAttribute('type', 'tel');
  138 |     await expect(country).toBeVisible();
  139 | 
  140 |     // Danh sách quốc gia là đầy đủ, không phải vài lựa chọn rút gọn.
  141 |     const soQuocGia = await country.locator('option').count();
  142 |     expect(soQuocGia).toBeGreaterThan(200);
  143 |   });
  144 | 
  145 |   test('TC-T3-M4-002: bỏ trống SĐT thì nút Login bị khoá và form không gửi được', async ({ page }) => {
  146 |     await page.goto('/', { waitUntil: 'load' });
  147 |     await page.waitForTimeout(2500);
  148 | 
  149 |     const drawer = await moDrawer(page);
  150 |     const login = drawer.getByRole('button', { name: 'Login' });
  151 | 
  152 |     await expect(login).toBeDisabled();
  153 |     // Không có request nào được gửi khi nút bị khoá.
  154 |     let calls = 0;
  155 |     page.on('request', (r) => {
  156 |       if (r.url().includes('/booking-api/v1/login')) calls += 1;
  157 |     });
  158 |     await page.waitForTimeout(1000);
  159 |     expect(calls).toBe(0);
  160 |   });
  161 | 
  162 |   test('TC-T3-M4-003: nhập SĐT chứa chữ cái vào drawer T3 thì nút Login bị khoá', async ({ page }) => {
  163 |     await page.goto('/', { waitUntil: 'load' });
  164 |     await page.waitForTimeout(2500);
  165 | 
  166 |     const drawer = await moDrawer(page);
  167 |     const phone = drawer.locator('input.PhoneInputInput');
  168 |     const login = drawer.getByRole('button', { name: 'Login' });
  169 | 
  170 |     await phone.fill('abc');
  171 |     await page.waitForTimeout(800);
  172 | 
  173 |     // Ô nhập chỉ nhận ký tự số → giá trị vẫn rỗng.
  174 |     await expect(phone).toHaveValue('');
  175 |     await expect(login).toBeDisabled();
  176 |   });
  177 | 
  178 |   test('TC-T3-M4-004: nhập SĐT 10 chữ số hợp lệ vào drawer T3 thì nút Login được kích hoạt', async ({
  179 |     page,
  180 |   }) => {
  181 |     await page.goto('/', { waitUntil: 'load' });
  182 |     await page.waitForTimeout(2500);
  183 | 
  184 |     const drawer = await moDrawer(page);
  185 |     const phone = drawer.locator('input.PhoneInputInput');
  186 |     const login = drawer.getByRole('button', { name: 'Login' });
  187 | 
  188 |     await phone.fill('6098167755');
  189 |     await page.waitForTimeout(800);
  190 | 
  191 |     await expect(login).toBeEnabled();
  192 |   });
  193 | 
  194 |   test('TC-T3-M4-005: nút Book Now hoạt động 24/7 và mở được drawer ngoài giờ mở cửa', async ({ page }) => {
  195 |     await page.goto('/', { waitUntil: 'load' });
  196 |     await page.waitForTimeout(2500);
  197 | 
  198 |     // Trạng thái hiện tại của tiệm không ảnh hưởng tới việc mở drawer.
  199 |     const drawer = await moDrawer(page);
  200 |     await expect(drawer.locator('input.PhoneInputInput')).toBeVisible();
  201 |   });
  202 | 
  203 |   test('TC-T3-M4-006: đặt lịch T3 bằng SĐT chưa có hồ sơ bị từ chối kèm thông báo rõ ràng', async ({ page }) => {
  204 |     await page.goto('/', { waitUntil: 'load' });
  205 |     await page.waitForTimeout(2500);
  206 | 
  207 |     const drawer = await moDrawer(page);
  208 |     const phone = drawer.locator('input.PhoneInputInput');
  209 |     const login = drawer.getByRole('button', { name: 'Login' });
  210 | 
  211 |     // Số dùng để kiểm thử không thuộc hồ sơ khách hàng nào của T3.
```