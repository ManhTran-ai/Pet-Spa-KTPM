# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t3\m4-m5-booking.spec.ts >> T3 Pretty Paws — M4/M5 Luồng đặt lịch và khung giờ >> TC-T3-M5-003: khung giờ ngoài giờ mở cửa phải bị từ chối kèm lý do
- Location: tests\e2e\t3\m4-m5-booking.spec.ts:248:3

# Error details

```
Error: T3 trả về khung giờ ngoài 08:00–20:00: Dog Bath 20-50lbs 2026-11-28 06:30; Dog Bath 20-50lbs 2026-11-28 07:30; Dog Bath 20-50lbs 2026-11-28 07:00; Dog Bath 20-50lbs 2026-11-29 07:00; Dog Bath 20-50lbs 2026-12-06 07:30; Dog Bath 20-50lbs 2026-12-06 07:00; Dog Bath 20-50lbs 2026-12-06 07:30; Dog Bath 20-50lbs 2026-12-12 07:30; Dog Bath 20-50lbs 2026-12-12 07:00; Dog Bath 20-50lbs 2026-12-13 07:00

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 30
```

# Page snapshot

```yaml
- dialog [active] [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e5]:
      - img "business logo" [ref=e6]
      - generic [ref=e7]: Pretty Paws Cat and Dog Grooming
    - generic [ref=e60]:
      - generic [ref=e61]:
        - generic [ref=e63]:
          - heading "Pretty Paws Cat and Dog Grooming" [level=5] [ref=e64]
          - generic [ref=e65]:
            - link "(609) 816-7755" [ref=e69] [cursor=pointer]:
              - /url: sms:+16098167755
            - link "nycoleco@yahoo.com" [ref=e73] [cursor=pointer]:
              - /url: mailto:nycoleco@yahoo.com
            - link "Hamilton, NJ, US" [ref=e77] [cursor=pointer]:
              - /url: https://www.google.com/maps/search/?api=1&query=Hamilton,+NJ,+US
            - link "Direction" [ref=e81] [cursor=pointer]:
              - /url: https://www.google.com/maps/dir/?api=1&destination=Hamilton,+NJ,+US
            - generic [ref=e82]:
              - generic [ref=e86]: Closed
              - generic [ref=e87]: 8:00 AM - 8:00 PM
            - button "Book Now" [ref=e89] [cursor=pointer]
        - generic [ref=e92]:
          - heading "Business Hours" [level=5] [ref=e93]
          - list [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]: SUN
              - generic [ref=e97]: 8:00 AM
              - generic [ref=e98]: "-"
              - generic [ref=e99]: 8:00 PM
            - generic [ref=e100]:
              - generic [ref=e101]: MON
              - generic [ref=e102]: 8:00 AM
              - generic [ref=e103]: "-"
              - generic [ref=e104]: 8:00 PM
            - generic [ref=e105]:
              - generic [ref=e106]: TUE
              - generic [ref=e107]: 8:00 AM
              - generic [ref=e108]: "-"
              - generic [ref=e109]: 8:00 PM
            - generic [ref=e110]:
              - generic [ref=e111]: WED
              - generic [ref=e112]: 8:00 AM
              - generic [ref=e113]: "-"
              - generic [ref=e114]: 8:00 PM
            - generic [ref=e115]:
              - generic [ref=e116]: THU
              - generic [ref=e117]: 8:00 AM
              - generic [ref=e118]: "-"
              - generic [ref=e119]: 8:00 PM
            - generic [ref=e120]:
              - generic [ref=e121]: FRI
              - generic [ref=e122]: 8:00 AM
              - generic [ref=e123]: "-"
              - generic [ref=e124]: 8:00 PM
            - generic [ref=e125]:
              - generic [ref=e126]: SAT
              - generic [ref=e127]: 8:00 AM
              - generic [ref=e128]: "-"
              - generic [ref=e129]: 8:00 PM
      - generic [ref=e130]:
        - heading "About us" [level=5] [ref=e131]
        - generic [ref=e133]:
          - generic [ref=e134]: My name is Nycole, and I’m the owner and groomer behind Pretty Paws Cat and Dog Grooming! 🩷🐾
          - generic [ref=e135]: I’ve been grooming for over 10 years and have had the pleasure of working with cats and dogs of all sizes and breeds. Animals have always been a huge part of my life, and I’m a true animal lover with pets of my own, ranging from cats to horses! 🐱🐶🐴
          - generic [ref=e136]: At Pretty Paws, I believe every pet deserves patience, love, and individualized care. That’s why I offer a kennel-free grooming experience, where each pet is groomed straight through with one-on-one attention in a calm, relaxed environment.
          - generic [ref=e137]: My goal is to make every visit feel like a little spa day for your babies, treating each one with the same love and care I give my own. Thank you for trusting me with your furry family members. It truly means so much to me! 🩷🐾
      - generic [ref=e139]:
        - heading "Services" [level=5] [ref=e140]
        - list [ref=e141]:
          - listitem [ref=e142]:
            - generic [ref=e143]: EMERGENCY APPOINTMENT (2)
          - listitem [ref=e147]:
            - generic [ref=e148]: Dog (bath included) (16)
          - listitem [ref=e152]:
            - generic [ref=e153]: Cat (bath included) (4)
          - listitem [ref=e157]:
            - generic [ref=e158]: QUICK SERVICE (no bath) (12)
          - listitem [ref=e162]:
            - generic [ref=e163]: ADD ON TO GROOM (7)
    - generic [ref=e178]:
      - heading [level=6] [ref=e179]:
        - text: Powered by
        - link "GrooMore, Inc." [ref=e180] [cursor=pointer]:
          - /url: https://www.groomore.com
      - button "Book Now" [ref=e181] [cursor=pointer]
```

# Test source

```ts
  155 |             ketQua.push({ ten: `${dv.ten} ${ngay}`, slot: phut });
  156 |           }
  157 |         }
  158 |       }
  159 |     }
  160 |     return ketQua;
  161 |   }, DICH_VU_DO);
  162 | 
  163 |   const hienThi = (phut: number) =>
  164 |     `${String(Math.floor(phut / 60)).padStart(2, '0')}:${String(phut % 60).padStart(2, '0')}`;
  165 | 
  166 |   const trong: string[] = [];
  167 |   const ngoai: string[] = [];
  168 |   for (const r of raw) {
  169 |     const nhan = `${r.ten} ${hienThi(r.slot)}`;
  170 |     if (r.slot >= MO_GIO && r.slot < DONG_GIO) trong.push(nhan);
  171 |     else ngoai.push(nhan);
  172 |   }
  173 |   return { trong, ngoai };
  174 | }
  175 | 
  176 | test.describe('T3 Pretty Paws — M4/M5 Luồng đặt lịch và khung giờ', () => {
  177 |   test('TC-T3-M4-005: bước nhập SĐT của T3 không có ô chọn ngày', async ({ page }) => {
  178 |     await moTrangChu(page);
  179 | 
  180 |     await page.getByRole('button', { name: 'Book Now' }).first().click();
  181 |     await page.waitForTimeout(2_500);
  182 | 
  183 |     const drawer = page.locator('.MuiDrawer-paper').first();
  184 |     await expect(drawer).toBeVisible();
  185 | 
  186 |     // Bước đầu của luồng chỉ có: chọn quốc gia + nhập số điện thoại + nút Login.
  187 |     await expect(page.getByPlaceholder('Mobile number').first()).toBeVisible();
  188 |     await expect(drawer.getByRole('button', { name: 'Login' }).first()).toBeVisible();
  189 | 
  190 |     // Không có ô nhập ngày / date picker ở bước này.
  191 |     const soOngNgay = await drawer
  192 |       .locator('input[type="date"], input[type="datetime-local"]')
  193 |       .count();
  194 |     expect(soOngNgay, 'Số ô nhập ngày ở bước nhập SĐT').toBe(0);
  195 | 
  196 |     const coDatePicker = await drawer
  197 |       .locator(
  198 |         '.MuiDatePicker-root, [role="dialog"][aria-label*="date" i], input[placeholder*="date" i]',
  199 |       )
  200 |       .count();
  201 |     expect(coDatePicker, 'Số date picker ở bước nhập SĐT').toBe(0);
  202 |   });
  203 | 
  204 |   test('TC-T3-M4-006: mở nhóm nào thì dịch vụ trong nhóm đó hiện đủ, không vô hình', async ({
  205 |     page,
  206 |   }) => {
  207 |     await moTrangChu(page);
  208 | 
  209 |     let tong = 0;
  210 |     for (const nhom of NHOM) {
  211 |       await batNhom(page, nhom.ten);
  212 | 
  213 |       const dichVu = await docDichVuTrongNhom(page, nhom.ten);
  214 |       expect(dichVu.length, `Số dịch vụ trong nhóm "${nhom.ten}"`).toBe(nhom.soLuong);
  215 | 
  216 |       const voHinh = dichVu.filter((d) => !d.hienThi).map((d) => d.ten);
  217 |       expect(voHinh, `Dịch vụ không hiển thị trong nhóm "${nhom.ten}"`).toEqual([]);
  218 | 
  219 |       const thieuGia = dichVu.filter((d) => !d.gia || !d.thoiLuong).map((d) => d.ten);
  220 |       expect(thieuGia, `Dịch vụ thiếu giá/thời lượng trong nhóm "${nhom.ten}"`).toEqual([]);
  221 | 
  222 |       tong += dichVu.length;
  223 | 
  224 |       // Thu gọn nhóm lại để nhóm kế tiếp mở đúng.
  225 |       await batNhom(page, nhom.ten);
  226 |     }
  227 | 
  228 |     expect(tong, 'Tổng số dịch vụ hiển thị').toBe(41);
  229 |   });
  230 | 
  231 |   test('TC-T3-M4-008: nút Book Now vẫn hoạt động ngoài giờ mở cửa', async ({ page }) => {
  232 |     // Giờ tại tiệm là 23:00 — nằm ngoài khung 08:00–20:00.
  233 |     await giaDongHocVeGio(page, 23);
  234 | 
  235 |     await moTrangChu(page);
  236 | 
  237 |     const nut = page.getByRole('button', { name: 'Book Now' }).first();
  238 |     await expect(nut).toBeVisible();
  239 |     await expect(nut).toBeEnabled();
  240 | 
  241 |     await nut.click();
  242 |     await page.waitForTimeout(2_500);
  243 | 
  244 |     // Drawer đặt lịch mở được → nút hoạt động 24/7 (FR-M4-11, BR-13).
  245 |     await expect(page.getByPlaceholder('Mobile number').first()).toBeVisible();
  246 |   });
  247 | 
  248 |   test('TC-T3-M5-003: khung giờ ngoài giờ mở cửa phải bị từ chối kèm lý do', async ({ page }) => {
  249 |     await moTrangChu(page);
  250 | 
  251 |     const { ngoai } = await kiemTraKhungGio(page);
  252 |     expect(
  253 |       ngoai.length,
  254 |       `T3 trả về khung giờ ngoài 08:00–20:00: ${ngoai.slice(0, 10).join('; ')}`,
> 255 |     ).toBe(0);
      |       ^ Error: T3 trả về khung giờ ngoài 08:00–20:00: Dog Bath 20-50lbs 2026-11-28 06:30; Dog Bath 20-50lbs 2026-11-28 07:30; Dog Bath 20-50lbs 2026-11-28 07:00; Dog Bath 20-50lbs 2026-11-29 07:00; Dog Bath 20-50lbs 2026-12-06 07:30; Dog Bath 20-50lbs 2026-12-06 07:00; Dog Bath 20-50lbs 2026-12-06 07:30; Dog Bath 20-50lbs 2026-12-12 07:30; Dog Bath 20-50lbs 2026-12-12 07:00; Dog Bath 20-50lbs 2026-12-13 07:00
  256 |   });
  257 | 
  258 |   test('TC-T3-M5-004: khung giờ nằm trong giờ mở cửa được chấp nhận', async ({ page }) => {
  259 |     await moTrangChu(page);
  260 | 
  261 |     const { trong } = await kiemTraKhungGio(page);
  262 |     expect(trong.length, 'Số khung giờ trong 08:00–20:00').toBeGreaterThan(0);
  263 |   });
  264 | });
  265 | 
```