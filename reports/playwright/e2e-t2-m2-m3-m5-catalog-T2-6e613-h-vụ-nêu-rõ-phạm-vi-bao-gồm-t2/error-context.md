# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t2\m2-m3-m5-catalog.spec.ts >> T2 Mật Pet — M1/M2/M3/M4/M5 (Ngân) >> TC-T2-M2-002: mỗi dịch vụ nêu rõ phạm vi bao gồm
- Location: tests\e2e\t2\m2-m3-m5-catalog.spec.ts:113:3

# Error details

```
Error: Dịch vụ thiếu mô tả thành phần bao gồm

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 9

- Array []
+ Array [
+   "Combo Tắm Vệ Sinh",
+   "Combo Tắm Cạo",
+   "Combo Tắm Cắt",
+   "Combo Tắm Cắt Tạo Hình",
+   "Nhuộm 2 tai + đuôi",
+   "Nhuộm 4 chân",
+   "Nhuộm hình nhỏ",
+ ]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - link [ref=e4] [cursor=pointer]:
        - /url: /
        - img "Mật Pet Family - Since 2011 Peace of Mind" [ref=e5]
      - navigation [ref=e6]:
        - link "Trang chủ" [ref=e7] [cursor=pointer]:
          - /url: /
        - link "Chó" [ref=e8] [cursor=pointer]:
          - /url: /cho
        - link "Mèo" [ref=e9] [cursor=pointer]:
          - /url: /meo
        - link "Tìm Bé Thương" [ref=e10] [cursor=pointer]:
          - /url: /tim-be-thuong
        - link "Spa" [ref=e11] [cursor=pointer]:
          - /url: /spa
        - link "Bảo hành" [ref=e12] [cursor=pointer]:
          - /url: /bao-hanh
        - link "Về Mật Pet" [ref=e13] [cursor=pointer]:
          - /url: /vematpet
      - button "Tìm kiếm" [ref=e14] [cursor=pointer]
      - generic [ref=e18]:
        - link "Tiếng Việt" [ref=e19] [cursor=pointer]:
          - /url: /spa
          - text: VI
        - generic [ref=e20]: "|"
        - link "English" [ref=e21] [cursor=pointer]:
          - /url: /en/spa
          - text: EN
      - link "0939.86.36.96" [ref=e22] [cursor=pointer]:
        - /url: tel:0939863696
  - generic [ref=e25]:
    - generic [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e29]: Spa & Grooming · Từ 2011
        - heading "Biết giá trước khi đưa bé đến spa." [level=1] [ref=e30]
        - paragraph [ref=e31]: Chọn loại bé, cân nặng và dịch vụ — bạn thấy ngay mức giá dự kiến minh bạch, rồi giữ chỗ chỉ với số điện thoại. Không còn phải nhắn tin hỏi giá.
        - generic [ref=e32]:
          - link "Tính giá dự kiến →" [ref=e33] [cursor=pointer]:
            - /url: "#calc"
          - link "Xem bảng giá" [ref=e34] [cursor=pointer]:
            - /url: "#pricing"
        - generic [ref=e35]:
          - generic [ref=e36]:
            - generic [ref=e37]: ✓
            - text: An toàn cho bé
          - generic [ref=e38]:
            - generic [ref=e39]: ✓
            - text: Hơn 15 năm kinh nghiệm
          - generic [ref=e40]:
            - generic [ref=e41]: ✓
            - text: Nhân viên có nghề
      - generic [ref=e42]:
        - img "Bé sau grooming tại Mật Pet" [ref=e44]
        - generic [ref=e45]:
          - generic [ref=e46]: 🐾
          - generic [ref=e47]:
            - generic [ref=e48]: Đã chăm sóc
            - generic [ref=e49]: 10.000+
    - generic [ref=e51]:
      - generic [ref=e52]:
        - generic [ref=e53]: Calculator
        - heading "Tính giá dự kiến cho bé" [level=2] [ref=e54]
        - paragraph [ref=e55]: Ba bước nhanh. Giá hiện ngay khi bạn chọn — chưa phải để lại thông tin gì.
      - generic [ref=e56]:
        - generic [ref=e57]:
          - generic [ref=e58]:
            - button "✓ Loại bé Chó / Mèo" [ref=e59] [cursor=pointer]:
              - generic [ref=e60]: ✓
              - generic [ref=e61]:
                - text: Loại bé
                - generic [ref=e62]: Chó / Mèo
            - button "✓ Cân nặng Bậc định sẵn" [ref=e63] [cursor=pointer]:
              - generic [ref=e64]: ✓
              - generic [ref=e65]:
                - text: Cân nặng
                - generic [ref=e66]: Bậc định sẵn
            - button "3 Dịch vụ Combo hoặc lẻ" [ref=e67] [cursor=pointer]:
              - generic [ref=e68]: "3"
              - generic [ref=e69]:
                - text: Dịch vụ
                - generic [ref=e70]: Combo hoặc lẻ
          - generic [ref=e72]:
            - heading "Chọn combo hoặc dịch vụ lẻ" [level=3] [ref=e73]
            - paragraph [ref=e74]: Chọn 1 combo trọn gói, hoặc tự ghép dịch vụ lẻ. Nhuộm & dịch vụ "báo giá riêng" có thể thêm kèm.
            - tablist [ref=e75]:
              - button "Combo trọn gói" [ref=e76] [cursor=pointer]
              - button "Dịch vụ lẻ" [ref=e77] [cursor=pointer]
            - generic [ref=e78]:
              - button "Combo Tắm Vệ Sinh 120k" [ref=e79] [cursor=pointer]:
                - generic [ref=e81]: Combo Tắm Vệ Sinh
                - generic [ref=e83]: 120k
              - button "Combo Tắm Cạo 200k" [ref=e84] [cursor=pointer]:
                - generic [ref=e86]: Combo Tắm Cạo
                - generic [ref=e88]: 200k
              - button "Combo Tắm Cắt 300k" [ref=e89] [cursor=pointer]:
                - generic [ref=e91]: Combo Tắm Cắt
                - generic [ref=e93]: 300k
              - button "Combo Tắm Cắt Tạo Hình 350k" [ref=e94] [cursor=pointer]:
                - generic [ref=e96]: Combo Tắm Cắt Tạo Hình
                - generic [ref=e98]: 350k
              - generic [ref=e99]: Nhuộm tạo kiểu
              - button "Nhuộm 2 tai + đuôi 250k" [ref=e100] [cursor=pointer]:
                - generic [ref=e102]: Nhuộm 2 tai + đuôi
                - generic [ref=e104]: 250k
              - button "Nhuộm 4 chân 250k" [ref=e105] [cursor=pointer]:
                - generic [ref=e107]: Nhuộm 4 chân
                - generic [ref=e109]: 250k
              - button "Nhuộm hình nhỏ 300k" [ref=e110] [cursor=pointer]:
                - generic [ref=e112]: Nhuộm hình nhỏ
                - generic [ref=e114]: 300k
              - generic [ref=e115]: Dịch vụ báo giá riêng
              - 'button "Gỡ rối Báo giá theo tình trạng lông: 50.000 – 500.000đ Báo giá riêng" [ref=e116] [cursor=pointer]':
                - generic [ref=e118]:
                  - generic [ref=e119]: Gỡ rối
                  - text: "Báo giá theo tình trạng lông: 50.000 – 500.000đ"
                - generic [ref=e120]: Báo giá riêng
              - 'button "Tẩy ố Báo giá theo tình trạng lông: 50.000 – 500.000đ Báo giá riêng" [ref=e121] [cursor=pointer]':
                - generic [ref=e123]:
                  - generic [ref=e124]: Tẩy ố
                  - text: "Báo giá theo tình trạng lông: 50.000 – 500.000đ"
                - generic [ref=e125]: Báo giá riêng
              - 'button "Tắm trắng Báo giá theo tình trạng lông: 50.000 – 500.000đ Báo giá riêng" [ref=e126] [cursor=pointer]':
                - generic [ref=e128]:
                  - generic [ref=e129]: Tắm trắng
                  - text: "Báo giá theo tình trạng lông: 50.000 – 500.000đ"
                - generic [ref=e130]: Báo giá riêng
              - 'button "Xả dưỡng Báo giá theo tình trạng lông: 50.000 – 500.000đ Báo giá riêng" [ref=e131] [cursor=pointer]':
                - generic [ref=e133]:
                  - generic [ref=e134]: Xả dưỡng
                  - text: "Báo giá theo tình trạng lông: 50.000 – 500.000đ"
                - generic [ref=e135]: Báo giá riêng
              - button "Nhuộm hình lớn Báo giá tuỳ kích thước & màu Báo giá riêng" [ref=e136] [cursor=pointer]:
                - generic [ref=e138]:
                  - generic [ref=e139]: Nhuộm hình lớn
                  - text: Báo giá tuỳ kích thước & màu
                - generic [ref=e140]: Báo giá riêng
              - button "Nhuộm tạo hình cơ thể Báo giá theo thiết kế riêng Báo giá riêng" [ref=e141] [cursor=pointer]:
                - generic [ref=e143]:
                  - generic [ref=e144]: Nhuộm tạo hình cơ thể
                  - text: Báo giá theo thiết kế riêng
                - generic [ref=e145]: Báo giá riêng
            - generic [ref=e146]:
              - button "← Quay lại" [ref=e147] [cursor=pointer]
              - button "Giữ chỗ ngay →" [ref=e148] [cursor=pointer]
        - complementary [ref=e149]:
          - generic [ref=e150]:
            - generic [ref=e151]: Giá dự kiến
            - generic [ref=e152]: Chọn dịch vụ để xem giá dự kiến cho bé của bạn 🐾
            - button "Giữ chỗ với mức giá này →" [disabled]
    - generic [ref=e155]:
      - generic [ref=e156]:
        - heading "Tóm tắt lựa chọn" [level=4] [ref=e157]
        - generic [ref=e158]:
          - generic [ref=e159]: Loại bé
          - generic [ref=e160]: Chó
        - generic [ref=e161]:
          - generic [ref=e162]: Cân nặng
          - generic [ref=e163]: <3kg
        - paragraph [ref=e164]: Giá cuối được xác nhận tại spa sau khi cân & kiểm tra tình trạng lông. Dịch vụ "báo giá riêng" sẽ được tư vấn khi spa gọi lại.
      - generic [ref=e166]:
        - generic [ref=e167]:
          - generic [ref=e168]: Số điện thoại / Zalo *
          - textbox "Số điện thoại / Zalo *" [ref=e169]:
            - /placeholder: 0xxx xxx xxx
        - generic [ref=e170]:
          - generic [ref=e171]: Tên bé
          - textbox "Tên bé" [ref=e172]:
            - /placeholder: "Vd: Mochi"
        - generic [ref=e173]:
          - generic [ref=e174]: Ngày mong muốn
          - generic [ref=e175]:
            - button "Hôm nay 21/11" [ref=e176] [cursor=pointer]:
              - generic [ref=e177]: Hôm nay
              - generic [ref=e178]: 21/11
            - button "Ngày mai 22/11" [ref=e179] [cursor=pointer]:
              - generic [ref=e180]: Ngày mai
              - generic [ref=e181]: 22/11
            - button "T2 23/11" [ref=e182] [cursor=pointer]:
              - generic [ref=e183]: T2
              - generic [ref=e184]: 23/11
            - button "T3 24/11" [ref=e185] [cursor=pointer]:
              - generic [ref=e186]: T3
              - generic [ref=e187]: 24/11
            - button "T4 25/11" [ref=e188] [cursor=pointer]:
              - generic [ref=e189]: T4
              - generic [ref=e190]: 25/11
            - generic [ref=e191] [cursor=pointer]:
              - text: Ngày khác
              - textbox "Ngày khác" [ref=e195]
        - paragraph [ref=e196]: Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại / Zalo để xác nhận lịch.
        - button "Giữ chỗ cho bé →" [ref=e197] [cursor=pointer]
    - generic [ref=e198]: "* Giá trên chưa bao gồm phí gỡ rối, tẩy ố và tắm trắng."
  - contentinfo [ref=e208]:
    - generic [ref=e210]:
      - generic [ref=e211]:
        - img "Mật Pet Family" [ref=e212]
        - paragraph [ref=e213]: Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.
        - generic [ref=e214]:
          - link "YouTube" [ref=e215] [cursor=pointer]:
            - /url: https://www.youtube.com/@matpetfamily2011
          - link "Facebook" [ref=e216] [cursor=pointer]:
            - /url: https://www.facebook.com/matpetfamily
          - link "TikTok" [ref=e217] [cursor=pointer]:
            - /url: https://www.tiktok.com/@matpetfamilyshop
      - generic [ref=e218]:
        - paragraph [ref=e219]: Pet Shop
        - list [ref=e220]:
          - listitem [ref=e221]:
            - link "Trang chủ" [ref=e222] [cursor=pointer]:
              - /url: /
          - listitem [ref=e223]:
            - link "Chó" [ref=e224] [cursor=pointer]:
              - /url: /cho
          - listitem [ref=e225]:
            - link "Mèo" [ref=e226] [cursor=pointer]:
              - /url: /meo
          - listitem [ref=e227]:
            - link "Tìm Bé Thương" [ref=e228] [cursor=pointer]:
              - /url: /tim-be-thuong
          - listitem [ref=e229]:
            - link "Bảng giá" [ref=e230] [cursor=pointer]:
              - /url: /bang-gia
          - listitem [ref=e231]:
            - link "Bảo hành" [ref=e232] [cursor=pointer]:
              - /url: /bao-hanh
          - listitem [ref=e233]:
            - link "Về Mật Pet" [ref=e234] [cursor=pointer]:
              - /url: /vematpet
          - listitem [ref=e235]:
            - link "Tuyển dụng" [ref=e236] [cursor=pointer]:
              - /url: /tuyendung
      - generic [ref=e237]:
        - paragraph [ref=e238]: Nội dung & cộng đồng
        - list [ref=e239]:
          - listitem [ref=e240]:
            - link "Blog" [ref=e241] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e242]:
            - link "Hướng dẫn chăm sóc" [ref=e243] [cursor=pointer]:
              - /url: /cham-soc
          - listitem [ref=e244]:
            - link "So sánh giống" [ref=e245] [cursor=pointer]:
              - /url: /so-sanh
          - listitem [ref=e246]:
            - link "Hỏi đáp" [ref=e247] [cursor=pointer]:
              - /url: /cau-hoi-thuong-gap
          - listitem [ref=e248]:
            - link "Đánh giá khách hàng" [ref=e249] [cursor=pointer]:
              - /url: /danh-gia-khach-hang
          - listitem [ref=e250]:
            - link "Showroom" [ref=e251] [cursor=pointer]:
              - /url: /showroom
      - generic [ref=e252]:
        - paragraph [ref=e253]: Liên hệ
        - list [ref=e254]:
          - listitem [ref=e255]:
            - link "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM" [ref=e259] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
          - listitem [ref=e260]:
            - link "0939863696" [ref=e263] [cursor=pointer]:
              - /url: tel:0939863696
          - listitem [ref=e264]:
            - link "matpetfamily2011@gmail.com" [ref=e268] [cursor=pointer]:
              - /url: mailto:matpetfamily2011@gmail.com
          - listitem [ref=e269]:
            - generic [ref=e273]: 08:00 - 22:00 mỗi ngày
    - generic [ref=e274]: © 2011–2026 Mật Pet Family. All rights reserved.
  - button "Mở tư vấn cùng Mật" [ref=e276] [cursor=pointer]
  - alert [ref=e278]
```

# Test source

```ts
  18  |  *   TC-T2-M4-006  FR-M4-04 — ô ngày có min = hôm nay + 2 mốc cố định
  19  |  *   TC-T2-M4-007  FR-M4-05 — ngày quá 30 ngày được nhập, không có giới hạn max
  20  |  *   TC-T2-M5-001  FR-M5-01 — trang mô tả quy trình 4 bước
  21  |  *   TC-T2-M5-002  FR-M5-02 — nêu spa sẽ gọi xác nhận khung giờ
  22  |  *   TC-T2-M5-003  FR-M5-04 — nội dung hủy/đổi lịch và hoàn cọc
  23  |  *
  24  |  * Ranh giới ADR-11: chỉ đọc, không gửi form.
  25  |  */
  26  | 
  27  | async function moTrangVaCuonToiBangGia(page: Page): Promise<void> {
  28  |   await moTrangSpa(page);
  29  |   await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  30  |   await page.waitForTimeout(1_200);
  31  | }
  32  | 
  33  | /** Đọc toàn bộ bảng giá tĩnh trên trang /spa. */
  34  | async function docBangGia(page: Page): Promise<{
  35  |   cols: string[];
  36  |   rows: { ten: string; gia: string[] }[];
  37  | }> {
  38  |   return page.evaluate(() => {
  39  |     const bang = [...document.querySelectorAll('table')].find((t) =>
  40  |       t.textContent?.includes('Dịch vụ (Grooming)'),
  41  |     );
  42  |     if (!bang) return { cols: [], rows: [] };
  43  |     const trs = [...bang.querySelectorAll('tr')];
  44  |     const cols = [...(trs[0]?.querySelectorAll('th, td') ?? [])].map((c) => c.textContent?.trim() ?? '');
  45  |     const rows = trs.slice(1).map((tr) => {
  46  |       const cells = [...tr.querySelectorAll('td')].map((c) => c.textContent?.trim() ?? '');
  47  |       return { ten: cells[0] ?? '', gia: cells.slice(1) };
  48  |     });
  49  |     return { cols, rows };
  50  |   });
  51  | }
  52  | 
  53  | /** Đọc các nút dịch vụ ở bước S3 (sau khi đã chọn loài + cân nặng). */
  54  | async function docNutDichVu(page: Page): Promise<
  55  |   { ten: string; moTa: string; gia: string; text: string; baoGiaRieng: boolean }[]
  56  | > {
  57  |   return page.evaluate(() =>
  58  |     [...document.querySelectorAll('button.svc')].map((b) => {
  59  |       const ten = b.querySelector('b')?.textContent?.trim() ?? '';
  60  |       const moTa = b.querySelector('.d')?.textContent?.trim() ?? '';
  61  |       const gia = b.querySelector('.pr')?.textContent?.trim() ?? '';
  62  |       const text = b.textContent?.trim() ?? '';
  63  |       const baoGiaRieng = !!b.querySelector('.quote');
  64  |       return { ten, moTa, gia, text, baoGiaRieng };
  65  |     }),
  66  |   );
  67  | }
  68  | 
  69  | /** Đi tới bước chọn dịch vụ (S3) với loài Chó và bậc cân nặng cho trước. */
  70  | async function sangBuocDichVuChon(page: Page, band: string): Promise<void> {
  71  |   await moTrangSpa(page);
  72  |   await chonLoai(page, 'Chó');
  73  |   await page.getByRole('button', { name: 'Tiếp tục →' }).click();
  74  |   await chonBucCanNang(page, band);
  75  |   await sangBuocDichVu(page);
  76  | }
  77  | 
  78  | test.describe('T2 Mật Pet — M1/M2/M3/M4/M5 (Ngân)', () => {
  79  |   test('TC-T2-M1-003: trang hiển thị đủ địa chỉ, điện thoại, email và giờ mở cửa', async ({ page }) => {
  80  |     await moTrangVaCuonToiBangGia(page);
  81  |     const body = await page.evaluate(() => document.body.innerText);
  82  | 
  83  |     expect(body, 'Địa chỉ').toMatch(/239 Nguyễn Hồng Đào/);
  84  |     expect(body, 'Điện thoại').toMatch(/0939\.86\.36\.96/);
  85  |     expect(body, 'Email').toMatch(/matpetfamily2011@gmail\.com/);
  86  |     expect(body, 'Giờ mở cửa').toMatch(/Mở cửa:\s*08:00\s*–\s*22:00/);
  87  |   });
  88  | 
  89  |   test('TC-T2-M2-001: mỗi dịch vụ trong danh mục có đủ tên, mô tả, giá và thời lượng', async ({
  90  |     page,
  91  |   }) => {
  92  |     await sangBuocDichVuChon(page, '<3kg');
  93  |     const dichVu = await docNutDichVu(page);
  94  | 
  95  |     expect(dichVu.length, 'Số dịch vụ trong danh mục').toBeGreaterThan(0);
  96  | 
  97  |     const thieuTen = dichVu.filter((d) => !d.ten).map((d) => d.ten);
  98  |     expect(thieuTen, 'Dịch vụ thiếu tên').toEqual([]);
  99  | 
  100 |     // Dịch vụ có giá cố định phải có giá; dịch vụ "báo giá riêng" thì không.
  101 |     const sai = dichVu
  102 |       .filter((d) => (d.baoGiaRieng ? d.gia !== '' : d.gia === ''))
  103 |       .map((d) => `${d.ten} (gia="${d.gia}", baoGiaRieng=${d.baoGiaRieng})`);
  104 |     expect(sai, 'Dịch vụ thiếu giá hoặc có giá sai').toEqual([]);
  105 | 
  106 |     // FR-M2-01: mỗi dịch vụ phải có thời lượng (tìm trong toàn bộ text của nút).
  107 |     const thieuThoiLuong = dichVu
  108 |       .filter((d) => !/\d+\s*('|′|\s)?\s*(phút|min\b|giờ|hours?\b)/i.test(d.text))
  109 |       .map((d) => d.ten);
  110 |     expect(thieuThoiLuong, 'Dịch vụ thiếu thời lượng').toEqual([]);
  111 |   });
  112 | 
  113 |   test('TC-T2-M2-002: mỗi dịch vụ nêu rõ phạm vi bao gồm', async ({ page }) => {
  114 |     await sangBuocDichVuChon(page, '<3kg');
  115 |     const dichVu = await docNutDichVu(page);
  116 | 
  117 |     const thieuMoTa = dichVu.filter((d) => !d.moTa).map((d) => d.ten);
> 118 |     expect(thieuMoTa, 'Dịch vụ thiếu mô tả thành phần bao gồm').toEqual([]);
      |                                                                 ^ Error: Dịch vụ thiếu mô tả thành phần bao gồm
  119 |   });
  120 | 
  121 |   test('TC-T2-M2-004: danh mục tách nhóm Combo trọn gói và Dịch vụ lẻ', async ({ page }) => {
  122 |     await sangBuocDichVuChon(page, '<3kg');
  123 | 
  124 |     const tabs = await page.evaluate(() =>
  125 |       [...document.querySelectorAll('button')]
  126 |         .map((b) => b.textContent?.trim())
  127 |         .filter((t) => t === 'Combo trọn gói' || t === 'Dịch vụ lẻ'),
  128 |     );
  129 |     expect(tabs, 'Hai nhóm dịch vụ').toEqual(['Combo trọn gói', 'Dịch vụ lẻ']);
  130 | 
  131 |     // Nhóm "Dịch vụ lẻ" hiện đúng các dịch vụ lẻ khai ở BR-11.
  132 |     await page.getByRole('button', { name: 'Dịch vụ lẻ', exact: true }).click();
  133 |     await page.waitForTimeout(600);
  134 |     const le = await docNutDichVu(page);
  135 |     const tenLe = le.map((d) => d.ten);
  136 | 
  137 |     for (const dichVu of [
  138 |       'Cắt dũa + Móng',
  139 |       'Vệ sinh tai',
  140 |       'Cạo bụng + Bàn + Hậu môn',
  141 |       'Tắm sấy',
  142 |       'Cạo lông',
  143 |       'Cắt lông',
  144 |     ]) {
  145 |       expect(tenLe, `Nhóm "Dịch vụ lẻ" có "${dichVu}"`).toContain(dichVu);
  146 |     }
  147 |   });
  148 | 
  149 |   test('TC-T2-M3-001: bảng giá có đủ cột cho mọi bậc cân nặng và mọi dịch vụ', async ({
  150 |     page,
  151 |   }) => {
  152 |     await moTrangVaCuonToiBangGia(page);
  153 |     const { cols, rows } = await docBangGia(page);
  154 | 
  155 |     // BR-02: 7 bậc cân nặng.
  156 |     expect(cols, 'Cột bảng giá').toEqual([
  157 |       'Dịch vụ (Grooming)',
  158 |       '<3kg',
  159 |       '>3–6kg',
  160 |       '>6–10kg',
  161 |       '>10–20kg',
  162 |       '>20–30kg',
  163 |       '>30–40kg',
  164 |       '>40kg',
  165 |     ]);
  166 | 
  167 |     // Mỗi dòng dịch vụ có đủ 7 ô giá, mọi ô là số xác định.
  168 |     const thieu = rows
  169 |       .filter((r) => r.ten && !/^Combo trọn gói$|^Dịch vụ lẻ$/i.test(r.ten))
  170 |       .filter((r) => r.gia.length !== 7 || r.gia.some((g) => !/^[\d.,ktr]+$/i.test(g)))
  171 |       .map((r) => `${r.ten}: ${JSON.stringify(r.gia)}`);
  172 |     expect(thieu, 'Dòng giá thiếu ô hoặc có ô không xác định').toEqual([]);
  173 |   });
  174 | 
  175 |   test('TC-T2-M3-007: dịch vụ báo giá riêng hiển thị khoảng hoặc tuỳ thiết kế, không phải con số đơn lẻ', async ({
  176 |     page,
  177 |   }) => {
  178 |     await sangBuocDichVuChon(page, '<3kg');
  179 |     const dichVu = await docNutDichVu(page);
  180 | 
  181 |     const rieng = dichVu.filter((d) => d.baoGiaRieng);
  182 |     expect(rieng.length, 'Số dịch vụ báo giá riêng').toBe(6);
  183 | 
  184 |     for (const d of rieng) {
  185 |       const coKhoang = /50\.000\s*–\s*500\.000/.test(d.moTa);
  186 |       const coThietKe = /tuỳ|thiết kế|kích thước/i.test(d.moTa);
  187 |       expect(coKhoang || coThietKe, `Mô tả của "${d.ten}" không nêu khoảng giá`).toBe(true);
  188 |     }
  189 |   });
  190 | 
  191 |   test('TC-T2-M3-008: DT — cả 6 dịch vụ báo giá riêng đều không hiện một con số đơn lẻ', async ({
  192 |     page,
  193 |   }) => {
  194 |     await sangBuocDichVuChon(page, '<3kg');
  195 |     const dichVu = await docNutDichVu(page);
  196 | 
  197 |     const rieng = dichVu.filter((d) => d.baoGiaRieng);
  198 |     expect(rieng.length, 'Số dịch vụ báo giá riêng').toBe(6);
  199 | 
  200 |     // Không được hiện đúng 1 con số trần duy nhất (kiểu "500.000đ").
  201 |     const conSoDuyNhat = rieng
  202 |       .filter((d) => {
  203 |         const so = d.moTa.match(/\d[\d.]*/g) ?? [];
  204 |         return so.length === 1;
  205 |       })
  206 |       .map((d) => `${d.ten}: ${d.moTa}`);
  207 |     expect(conSoDuyNhat, 'Dịch vụ báo giá riêng hiện một con số đơn lẻ').toEqual([]);
  208 |   });
  209 | 
  210 |   test('TC-T2-M3-009: trang giá ghi rõ giá cuối xác nhận tại spa, giá hiển thị chỉ là dự kiến', async ({
  211 |     page,
  212 |   }) => {
  213 |     await moTrangVaCuonToiBangGia(page);
  214 |     const body = await page.evaluate(() => document.body.innerText);
  215 | 
  216 |     expect(body).toMatch(/GIÁ DỰ KIẾN/i);
  217 |     expect(body).toMatch(/Giá cuối được xác nhận tại spa/);
  218 |   });
```