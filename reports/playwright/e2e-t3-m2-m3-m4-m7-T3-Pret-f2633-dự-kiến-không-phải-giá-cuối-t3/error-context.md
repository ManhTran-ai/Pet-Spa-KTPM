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
    - generic [ref=e56]:
      - generic [ref=e57]:
        - generic [ref=e59]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=e60]
          - generic [ref=e61]:
            - link "(609) 816-7755" [ref=e65] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=e69] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=e73] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=e77] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=e78]:
              - generic [ref=e82]: Closed
              - generic [ref=e83]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=e85] [cursor=pointer]
        - generic [ref=e88]:
          - heading "Business Hours" [level=5] [ref=e89]
          - list [ref=e90]:
            - generic [ref=e91]:
              - generic [ref=e92]: SUN
              - generic [ref=e93]: 8:00 AM
              - generic [ref=e94]: "-"
              - generic [ref=e95]: 8:00 PM
            - generic [ref=e96]:
              - generic [ref=e97]: MON
              - generic [ref=e98]: 8:00 AM
              - generic [ref=e99]: "-"
              - generic [ref=e100]: 8:00 PM
            - generic [ref=e101]:
              - generic [ref=e102]: TUE
              - generic [ref=e103]: 8:00 AM
              - generic [ref=e104]: "-"
              - generic [ref=e105]: 8:00 PM
            - generic [ref=e106]:
              - generic [ref=e107]: WED
              - generic [ref=e108]: 8:00 AM
              - generic [ref=e109]: "-"
              - generic [ref=e110]: 8:00 PM
            - generic [ref=e111]:
              - generic [ref=e112]: THU
              - generic [ref=e113]: 8:00 AM
              - generic [ref=e114]: "-"
              - generic [ref=e115]: 8:00 PM
            - generic [ref=e116]:
              - generic [ref=e117]: FRI
              - generic [ref=e118]: 8:00 AM
              - generic [ref=e119]: "-"
              - generic [ref=e120]: 8:00 PM
            - generic [ref=e121]:
              - generic [ref=e122]: SAT
              - generic [ref=e123]: 8:00 AM
              - generic [ref=e124]: "-"
              - generic [ref=e125]: 8:00 PM
      - generic [ref=e126]:
        - heading "About us" [level=5] [ref=e127]
        - generic [ref=e129]:
          - generic [ref=e130]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=e131]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=e132]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=e133]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=e135]:
        - heading "Services" [level=5] [ref=e136]
        - list [ref=e137]:
          - listitem [ref=e138]:
            - generic [ref=e139]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=e143]:
            - generic [ref=e144]: Dog (bath included) (16)
          - generic [ref=e150]:
            - listitem [ref=e151]:
              - generic [ref=e152]:
                - generic [ref=e153]:
                  - generic [ref=e154]: Dog Bath 0-20lbs
                  - generic [ref=e155]: Bath, shampoo, conditioner, nail clip/file, brush out, teeth brush, and ear clean. * Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e156]:
                  - generic [ref=e157]: $52.00
                  - generic [ref=e158]: 30mins
            - listitem [ref=e159]:
              - generic [ref=e160]:
                - generic [ref=e161]:
                  - generic [ref=e162]: Dog Bath 20-50lbs
                  - generic [ref=e163]: Bath, shampoo, conditioner, nail clip/file, ears, teeth, brush out *Your choice of shampoo and conditioner *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e164]:
                  - generic [ref=e165]: $65.00
                  - generic [ref=e166]: 30mins
            - listitem [ref=e167]:
              - generic [ref=e168]:
                - generic [ref=e169]:
                  - generic [ref=e170]: Dog Bath short hair over 50lbs
                  - generic [ref=e171]: Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e172]:
                  - generic [ref=e173]: $72.00
                  - generic [ref=e174]: 1h
            - listitem [ref=e175]:
              - generic [ref=e176]:
                - generic [ref=e177]:
                  - generic [ref=e178]: Dog bath medium/long hair over 50lbs
                  - generic [ref=e179]: Bath, shampoo, conditioner, nail clip/file, teeth brush, ear clean, brush out *Your choice of shampoo and conditioner including deshed, oatmeal, hempz, all natural flea and tick, and fragrance free*
                - generic [ref=e180]:
                  - generic [ref=e181]: $79.00
                  - generic [ref=e182]: 1h
            - listitem [ref=e183]:
              - generic [ref=e184]:
                - generic [ref=e185]:
                  - generic [ref=e186]: Dog Bath and tidy up 0 - 20lbs
                  - generic [ref=e187]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e188]:
                  - generic [ref=e189]: $62.00
                  - generic [ref=e190]: 30mins
            - listitem [ref=e191]:
              - generic [ref=e192]:
                - generic [ref=e193]:
                  - generic [ref=e194]: Dog Bath and tidy up 21 - 40lbs
                  - generic [ref=e195]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e196]:
                  - generic [ref=e197]: $72.00
                  - generic [ref=e198]: 1h
            - listitem [ref=e199]:
              - generic [ref=e200]:
                - generic [ref=e201]:
                  - generic [ref=e202]: Dog Bath and tidy up 41 - 60lbs
                  - generic [ref=e203]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e204]:
                  - generic [ref=e205]: $91.00
                  - generic [ref=e206]: 1h
            - listitem [ref=e207]:
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - generic [ref=e210]: Dog Bath and tidy up 61- 79lbs
                  - generic [ref=e211]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e212]:
                  - generic [ref=e213]: $99.00
                  - generic [ref=e214]: 1h
            - listitem [ref=e215]:
              - generic [ref=e216]:
                - generic [ref=e217]:
                  - generic [ref=e218]: Dog Bath and tidy up 79+ lbs
                  - generic [ref=e219]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Trim up face Trim feet Trim up tail Sanitary clean up (No hair off of body)
                - generic [ref=e220]:
                  - generic [ref=e221]: $118.00
                  - generic [ref=e222]: 1h
            - listitem [ref=e223]:
              - generic [ref=e224]:
                - generic [ref=e225]:
                  - generic [ref=e226]: Dog Full Groom 0 - 20 lbs
                  - generic [ref=e227]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e228]:
                  - generic [ref=e229]: $69.00
                  - generic [ref=e230]: 1h
            - listitem [ref=e231]:
              - generic [ref=e232]:
                - generic [ref=e233]:
                  - generic [ref=e234]: Dog Full groom 21 - 30lbs
                  - generic [ref=e235]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e236]:
                  - generic [ref=e237]: $77.00
                  - generic [ref=e238]: 1h
            - listitem [ref=e239]:
              - generic [ref=e240]:
                - generic [ref=e241]:
                  - generic [ref=e242]: Dog Full Groom 31 - 40lbs
                  - generic [ref=e243]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e244]:
                  - generic [ref=e245]: $86.00
                  - generic [ref=e246]: 1h
            - listitem [ref=e247]:
              - generic [ref=e248]:
                - generic [ref=e249]:
                  - generic [ref=e250]: Dog Full Groom 41 - 60lbs
                  - generic [ref=e251]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e252]:
                  - generic [ref=e253]: $102.00
                  - generic [ref=e254]: 1h
            - listitem [ref=e255]:
              - generic [ref=e256]:
                - generic [ref=e257]:
                  - generic [ref=e258]: Dog Full groom 61 - 78lbs
                  - generic [ref=e259]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e260]:
                  - generic [ref=e261]: $121.00
                  - generic [ref=e262]: 1h 30mins
            - listitem [ref=e263]:
              - generic [ref=e264]:
                - generic [ref=e265]:
                  - generic [ref=e266]: Dog Full groom 79 - 90lbs
                  - generic [ref=e267]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e268]:
                  - generic [ref=e269]: $136.00
                  - generic [ref=e270]: 2h
            - listitem [ref=e271]:
              - generic [ref=e272]:
                - generic [ref=e273]:
                  - generic [ref=e274]: Dog Full Groom 91-100+ pounds
                  - generic [ref=e275]: Bath, shampoo & conditioner(of your choice), nail clip/file, teeth, ears, brush out Hair cut any length
                - generic [ref=e276]:
                  - generic [ref=e277]: $175.00
                  - generic [ref=e278]: 2h
          - listitem [ref=e279]:
            - generic [ref=e280]: Cat (bath included) (4)
          - listitem [ref=e284]:
            - generic [ref=e285]: QUICK SERVICE (no bath) (12)
          - listitem [ref=e289]:
            - generic [ref=e290]: ADD ON TO GROOM (7)
      - generic [ref=e300]:
        - generic:
          - button "Keyboard shortcuts"
        - region "Map" [ref=e301]
        - generic [ref=e302]:
          - iframe [aria-hidden] [ref=e354]
          - button "Toggle fullscreen view" [ref=e355] [cursor=pointer]
          - button "Map camera controls" [ref=e357] [cursor=pointer]
          - link "Open this area in Google Maps (opens a new window)" [ref=e359] [cursor=pointer]:
            - /url: https://maps.google.com/maps?ll=39.450958,-74.642714&z=11&t=m&hl=en-US&gl=US&mapclient=apiv3
            - img "Google" [ref=e361]
          - generic [ref=e362]:
            - button "Keyboard shortcuts" [ref=e368] [cursor=pointer]
            - generic [ref=e369]: Map data ©2026 Google
            - link "Terms (opens in new tab)" [ref=e378] [cursor=pointer]:
              - /url: https://www.google.com/intl/en-US_US/help/terms_maps.html
              - text: Terms
    - generic [ref=e380]:
      - heading [level=6] [ref=e381]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=e382] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=e383] [cursor=pointer]
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