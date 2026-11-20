# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t2\m2-m3-m5-catalog.spec.ts >> T2 Mật Pet — M1/M2/M3/M4/M5 (Ngân) >> TC-T2-M5-003: nội dung hủy/đổi lịch và hoàn cọc tồn tại, không chỉ nói liên hệ tiệm
- Location: tests\e2e\t2\m2-m3-m5-catalog.spec.ts:324:3

# Error details

```
Error: Có nội dung về hủy lịch

expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

# Page snapshot

```yaml
- generic [active] [ref=f3e1]:
  - banner [ref=f3e2]:
    - generic [ref=f3e3]:
      - link [ref=f3e4] [cursor=pointer]:
        - /url: /
        - img "Mật Pet Family - Since 2011 Peace of Mind" [ref=f3e5]
      - navigation [ref=f3e6]:
        - link "Trang chủ" [ref=f3e7] [cursor=pointer]:
          - /url: /
        - link "Chó" [ref=f3e8] [cursor=pointer]:
          - /url: /cho
        - link "Mèo" [ref=f3e9] [cursor=pointer]:
          - /url: /meo
        - link "Tìm Bé Thương" [ref=f3e10] [cursor=pointer]:
          - /url: /tim-be-thuong
        - link "Spa" [ref=f3e11] [cursor=pointer]:
          - /url: /spa
        - link "Bảo hành" [ref=f3e12] [cursor=pointer]:
          - /url: /bao-hanh
        - link "Về Mật Pet" [ref=f3e13] [cursor=pointer]:
          - /url: /vematpet
      - button "Tìm kiếm" [ref=f3e14] [cursor=pointer]
      - generic [ref=f3e18]:
        - link "Tiếng Việt" [ref=f3e19] [cursor=pointer]:
          - /url: /cham-soc
          - text: VI
        - generic [ref=f3e20]: "|"
        - link "English" [ref=f3e21] [cursor=pointer]:
          - /url: /en/cham-soc
          - text: EN
      - link "0939.86.36.96" [ref=f3e22] [cursor=pointer]:
        - /url: tel:0939863696
  - main [ref=f3e26]:
    - navigation [ref=f3e27]:
      - link "Trang chủ" [ref=f3e28] [cursor=pointer]:
        - /url: /
      - generic [ref=f3e29]: ›
      - generic [ref=f3e30]: Cách chăm sóc
    - generic [ref=f3e31]:
      - generic [ref=f3e32]: 📖 Hướng dẫn chăm sóc
      - heading "Cách chăm sóc thú cưng theo giống" [level=1] [ref=f3e34]
      - paragraph [ref=f3e35]: Kiến thức 15 năm chăm sóc chó mèo thuần chủng tại Việt Nam. Đặc điểm, tính cách, chế độ ăn, sức khỏe, môi trường sống — chi tiết theo từng giống.
    - generic [ref=f3e36]:
      - heading "🐶 Hướng dẫn chăm sóc chó" [level=2] [ref=f3e37]
      - generic [ref=f3e38]:
        - link [ref=f3e39] [cursor=pointer]:
          - /url: /cham-soc/maltese
          - img "Cách chăm sóc Maltese" [ref=f3e41]
          - generic [ref=f3e42]:
            - heading "Maltese" [level=3] [ref=f3e43]
            - paragraph [ref=f3e44]: 📏 Nhỏ
        - link [ref=f3e45] [cursor=pointer]:
          - /url: /cham-soc/cardigan-welsh-corgi-corgi-co-duoi
          - img "Cách chăm sóc Cardigan Welsh Corgi" [ref=f3e47]
          - generic [ref=f3e48]:
            - heading "Cardigan Welsh Corgi" [level=3] [ref=f3e49]
            - paragraph [ref=f3e50]: Corgi có đuôi
            - paragraph [ref=f3e51]: 📏 Trung bình
        - link [ref=f3e52] [cursor=pointer]:
          - /url: /cham-soc/dachshund-lap-xuong-long-ngan
          - img "Cách chăm sóc Dachshund" [ref=f3e54]
          - generic [ref=f3e55]:
            - heading "Dachshund" [level=3] [ref=f3e56]
            - paragraph [ref=f3e57]: Lạp Xưởng lông ngắn
            - paragraph [ref=f3e58]: 📏 Nhỏ
        - link [ref=f3e59] [cursor=pointer]:
          - /url: /cham-soc/chow-chow
          - img "Cách chăm sóc Chow Chow" [ref=f3e61]
          - generic [ref=f3e62]:
            - heading "Chow Chow" [level=3] [ref=f3e63]
            - paragraph [ref=f3e64]: Chow Chow
            - paragraph [ref=f3e65]: 📏 Trung bình
        - link [ref=f3e66] [cursor=pointer]:
          - /url: /cham-soc/bichon-frise
          - img "Cách chăm sóc Bichon Frise" [ref=f3e68]
          - generic [ref=f3e69]:
            - heading "Bichon Frise" [level=3] [ref=f3e70]
            - paragraph [ref=f3e71]: 📏 Nhỏ
        - link [ref=f3e72] [cursor=pointer]:
          - /url: /cham-soc/poodle-teacup
          - img "Cách chăm sóc Poodle Teacup" [ref=f3e74]
          - generic [ref=f3e75]:
            - heading "Poodle Teacup" [level=3] [ref=f3e76]
            - paragraph [ref=f3e77]: 📏 Nhỏ
        - link [ref=f3e78] [cursor=pointer]:
          - /url: /cham-soc/labrador-retriever
          - img "Cách chăm sóc Labrador Retriever" [ref=f3e80]
          - generic [ref=f3e81]:
            - heading "Labrador Retriever" [level=3] [ref=f3e82]
            - paragraph [ref=f3e83]: Chó săn mồi
            - paragraph [ref=f3e84]: 📏 Lớn
        - link [ref=f3e85] [cursor=pointer]:
          - /url: /cham-soc/beagle
          - img "Cách chăm sóc Beagle" [ref=f3e87]
          - generic [ref=f3e88]:
            - heading "Beagle" [level=3] [ref=f3e89]
            - paragraph [ref=f3e90]: Chó săn thỏ
            - paragraph [ref=f3e91]: 📏 Trung bình
        - link [ref=f3e92] [cursor=pointer]:
          - /url: /cham-soc/shizu
          - img "Cách chăm sóc Shih Tzu" [ref=f3e94]
          - generic [ref=f3e95]:
            - heading "Shih Tzu" [level=3] [ref=f3e96]
            - paragraph [ref=f3e97]: Chó ông già
            - paragraph [ref=f3e98]: 📏 Nhỏ
            - paragraph [ref=f3e99]: 1 bé sẵn có
        - link [ref=f3e100] [cursor=pointer]:
          - /url: /cham-soc/toy-poodle
          - img "Cách chăm sóc Toy Poodle" [ref=f3e102]
          - generic [ref=f3e103]:
            - heading "Toy Poodle" [level=3] [ref=f3e104]
            - paragraph [ref=f3e105]: 📏 Nhỏ
        - link [ref=f3e106] [cursor=pointer]:
          - /url: /cham-soc/alaskan-malamute
          - img "Cách chăm sóc Alaskan Malamute" [ref=f3e108]
          - generic [ref=f3e109]:
            - heading "Alaskan Malamute" [level=3] [ref=f3e110]
            - paragraph [ref=f3e111]: 📏 Lớn
        - link [ref=f3e112] [cursor=pointer]:
          - /url: /cham-soc/golden-retriever
          - img "Cách chăm sóc Golden Retriever" [ref=f3e114]
          - generic [ref=f3e115]:
            - heading "Golden Retriever" [level=3] [ref=f3e116]
            - paragraph [ref=f3e117]: 📏 Lớn
        - link [ref=f3e118] [cursor=pointer]:
          - /url: /cham-soc/corgi
          - img "Cách chăm sóc Pembroke Welsh Corgi" [ref=f3e120]
          - generic [ref=f3e121]:
            - heading "Pembroke Welsh Corgi" [level=3] [ref=f3e122]
            - paragraph [ref=f3e123]: Corgi không đuôi
            - paragraph [ref=f3e124]: 📏 Trung bình
        - link [ref=f3e125] [cursor=pointer]:
          - /url: /cham-soc/pomeranian-phoc-soc-pom
          - img "Cách chăm sóc Pomeranian" [ref=f3e127]
          - generic [ref=f3e128]:
            - heading "Pomeranian" [level=3] [ref=f3e129]
            - paragraph [ref=f3e130]: Phốc Sóc / Pom
            - paragraph [ref=f3e131]: 📏 Nhỏ
            - paragraph [ref=f3e132]: 2 bé sẵn có
        - link [ref=f3e133] [cursor=pointer]:
          - /url: /cham-soc/samoyed
          - img "Cách chăm sóc Samoyed" [ref=f3e135]
          - generic [ref=f3e136]:
            - heading "Samoyed" [level=3] [ref=f3e137]
            - paragraph [ref=f3e138]: 📏 Lớn
        - link [ref=f3e139] [cursor=pointer]:
          - /url: /cham-soc/alaskan-malamute-giant-alaska-ngao-khong-lo
          - img "Cách chăm sóc Alaskan Malamute Giant" [ref=f3e141]
          - generic [ref=f3e142]:
            - heading "Alaskan Malamute Giant" [level=3] [ref=f3e143]
            - paragraph [ref=f3e144]: Alaska ngáo khổng lồ
            - paragraph [ref=f3e145]: 📏 Rất lớn
        - link [ref=f3e146] [cursor=pointer]:
          - /url: /cham-soc/shiba-inu
          - img "Cách chăm sóc Shiba Inu" [ref=f3e148]
          - generic [ref=f3e149]:
            - heading "Shiba Inu" [level=3] [ref=f3e150]
            - paragraph [ref=f3e151]: 📏 Trung bình
        - link [ref=f3e152] [cursor=pointer]:
          - /url: /cham-soc/poodle-tiny
          - img "Cách chăm sóc Poodle Tiny" [ref=f3e154]
          - generic [ref=f3e155]:
            - heading "Poodle Tiny" [level=3] [ref=f3e156]
            - paragraph [ref=f3e157]: 📏 Nhỏ
        - link [ref=f3e158] [cursor=pointer]:
          - /url: /cham-soc/bull-phap
          - img "Cách chăm sóc Bull Pháp" [ref=f3e160]
          - generic [ref=f3e161]:
            - heading "Bull Pháp" [level=3] [ref=f3e162]
            - paragraph [ref=f3e163]: 📏 Trung bình
        - link [ref=f3e164] [cursor=pointer]:
          - /url: /cham-soc/husky
          - img "Cách chăm sóc Husky" [ref=f3e166]
          - generic [ref=f3e167]:
            - heading "Husky" [level=3] [ref=f3e168]
            - paragraph [ref=f3e169]: 📏 Lớn
    - generic [ref=f3e170]:
      - heading "🐱 Hướng dẫn chăm sóc mèo" [level=2] [ref=f3e171]
      - generic [ref=f3e172]:
        - link [ref=f3e173] [cursor=pointer]:
          - /url: /cham-soc/ragdoll
          - img "Cách chăm sóc Ragdoll" [ref=f3e175]
          - generic [ref=f3e176]:
            - heading "Ragdoll" [level=3] [ref=f3e177]
            - paragraph [ref=f3e178]: 📏 Lớn
        - link [ref=f3e179] [cursor=pointer]:
          - /url: /cham-soc/sphynx
          - img "Cách chăm sóc Sphynx" [ref=f3e181]
          - generic [ref=f3e182]:
            - heading "Sphynx" [level=3] [ref=f3e183]
            - paragraph [ref=f3e184]: Mèo Sphynx không lông
            - paragraph [ref=f3e185]: 📏 Trung bình
        - link [ref=f3e186] [cursor=pointer]:
          - /url: /cham-soc/british-shorthair-classic
          - img "Cách chăm sóc British Shorthair Classic" [ref=f3e188]
          - generic [ref=f3e189]:
            - heading "British Shorthair Classic" [level=3] [ref=f3e190]
            - paragraph [ref=f3e191]: Mèo Anh lông ngắn chân dài tai vểnh
            - paragraph [ref=f3e192]: 📏 Trung bình
        - link [ref=f3e193] [cursor=pointer]:
          - /url: /cham-soc/scottish-fold-shorthair
          - img "Cách chăm sóc Scottish Fold Shorthair" [ref=f3e195]
          - generic [ref=f3e196]:
            - heading "Scottish Fold Shorthair" [level=3] [ref=f3e197]
            - paragraph [ref=f3e198]: Mèo Anh lông ngắn chân dài tai cụp
            - paragraph [ref=f3e199]: 📏 Trung bình
        - link [ref=f3e200] [cursor=pointer]:
          - /url: /cham-soc/british-longhair-classic
          - img "Cách chăm sóc British Longhair Classic" [ref=f3e202]
          - generic [ref=f3e203]:
            - heading "British Longhair Classic" [level=3] [ref=f3e204]
            - paragraph [ref=f3e205]: Mèo Anh lông dài chân dài tai vểnh
            - paragraph [ref=f3e206]: 📏 Trung bình
        - link [ref=f3e207] [cursor=pointer]:
          - /url: /cham-soc/scottish-fold-longhair
          - img "Cách chăm sóc Scottish Fold Longhair" [ref=f3e209]
          - generic [ref=f3e210]:
            - heading "Scottish Fold Longhair" [level=3] [ref=f3e211]
            - paragraph [ref=f3e212]: Mèo Anh lông dài chân dài tai cụp
            - paragraph [ref=f3e213]: 📏 Trung bình
        - link [ref=f3e214] [cursor=pointer]:
          - /url: /cham-soc/munchkin-british-shorthair
          - img "Cách chăm sóc Munchkin British Shorthair" [ref=f3e216]
          - generic [ref=f3e217]:
            - heading "Munchkin British Shorthair" [level=3] [ref=f3e218]
            - paragraph [ref=f3e219]: Mèo Anh lông ngắn chân ngắn tai vểnh
            - paragraph [ref=f3e220]: 📏 Trung bình
        - link [ref=f3e221] [cursor=pointer]:
          - /url: /cham-soc/munchkin-scottish-fold-shorthair
          - img "Cách chăm sóc Munchkin Scottish Fold Shorthair" [ref=f3e223]
          - generic [ref=f3e224]:
            - heading "Munchkin Scottish Fold Shorthair" [level=3] [ref=f3e225]
            - paragraph [ref=f3e226]: Mèo Anh lông ngắn chân ngắn tai cụp
            - paragraph [ref=f3e227]: 📏 Trung bình
        - link [ref=f3e228] [cursor=pointer]:
          - /url: /cham-soc/munchkin-british-longhair
          - img "Cách chăm sóc Munchkin British Longhair" [ref=f3e230]
          - generic [ref=f3e231]:
            - heading "Munchkin British Longhair" [level=3] [ref=f3e232]
            - paragraph [ref=f3e233]: Mèo Anh lông dài chân ngắn tai vểnh
            - paragraph [ref=f3e234]: 📏 Trung bình
    - generic [ref=f3e235]:
      - heading "Vì sao chọn Mật Pet Family?" [level=2] [ref=f3e236]
      - generic [ref=f3e237]:
        - paragraph [ref=f3e238]: Hệ thống hướng dẫn chăm sóc theo giống của Mật Pet Family được xây dựng từ kinh nghiệm thực tế 15 năm (từ 2011) chăm sóc hơn 10,000 thú cưng tại Việt Nam. Mỗi nội dung được kiểm chứng bởi đội ngũ chuyên môn + đồng kiểm tra với cộng đồng 8.7 triệu followers Mật Pet trên các kênh xã hội.
        - paragraph [ref=f3e239]:
          - text: Khi bạn đón bé thuộc giống bất kỳ tại Mật Pet, ngoài bảo hành sức khỏe 30 ngày miễn phí, bạn được truy cập
          - link "Pet Care Portal" [ref=f3e240] [cursor=pointer]:
            - /url: /my-pet
          - text: — dashboard cá nhân theo dõi sức khỏe + tư vấn chăm sóc trọn đời.
  - contentinfo [ref=f3e241]:
    - generic [ref=f3e243]:
      - generic [ref=f3e244]:
        - img "Mật Pet Family" [ref=f3e245]
        - paragraph [ref=f3e246]: Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.
        - generic [ref=f3e247]:
          - link "YouTube" [ref=f3e248] [cursor=pointer]:
            - /url: https://www.youtube.com/@matpetfamily2011
          - link "Facebook" [ref=f3e249] [cursor=pointer]:
            - /url: https://www.facebook.com/matpetfamily
          - link "TikTok" [ref=f3e250] [cursor=pointer]:
            - /url: https://www.tiktok.com/@matpetfamilyshop
      - generic [ref=f3e251]:
        - paragraph [ref=f3e252]: Pet Shop
        - list [ref=f3e253]:
          - listitem [ref=f3e254]:
            - link "Trang chủ" [ref=f3e255] [cursor=pointer]:
              - /url: /
          - listitem [ref=f3e256]:
            - link "Chó" [ref=f3e257] [cursor=pointer]:
              - /url: /cho
          - listitem [ref=f3e258]:
            - link "Mèo" [ref=f3e259] [cursor=pointer]:
              - /url: /meo
          - listitem [ref=f3e260]:
            - link "Tìm Bé Thương" [ref=f3e261] [cursor=pointer]:
              - /url: /tim-be-thuong
          - listitem [ref=f3e262]:
            - link "Bảng giá" [ref=f3e263] [cursor=pointer]:
              - /url: /bang-gia
          - listitem [ref=f3e264]:
            - link "Bảo hành" [ref=f3e265] [cursor=pointer]:
              - /url: /bao-hanh
          - listitem [ref=f3e266]:
            - link "Về Mật Pet" [ref=f3e267] [cursor=pointer]:
              - /url: /vematpet
          - listitem [ref=f3e268]:
            - link "Tuyển dụng" [ref=f3e269] [cursor=pointer]:
              - /url: /tuyendung
      - generic [ref=f3e270]:
        - paragraph [ref=f3e271]: Nội dung & cộng đồng
        - list [ref=f3e272]:
          - listitem [ref=f3e273]:
            - link "Blog" [ref=f3e274] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=f3e275]:
            - link "Hướng dẫn chăm sóc" [ref=f3e276] [cursor=pointer]:
              - /url: /cham-soc
          - listitem [ref=f3e277]:
            - link "So sánh giống" [ref=f3e278] [cursor=pointer]:
              - /url: /so-sanh
          - listitem [ref=f3e279]:
            - link "Hỏi đáp" [ref=f3e280] [cursor=pointer]:
              - /url: /cau-hoi-thuong-gap
          - listitem [ref=f3e281]:
            - link "Đánh giá khách hàng" [ref=f3e282] [cursor=pointer]:
              - /url: /danh-gia-khach-hang
          - listitem [ref=f3e283]:
            - link "Showroom" [ref=f3e284] [cursor=pointer]:
              - /url: /showroom
      - generic [ref=f3e285]:
        - paragraph [ref=f3e286]: Liên hệ
        - list [ref=f3e287]:
          - listitem [ref=f3e288]:
            - link "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM" [ref=f3e292] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
          - listitem [ref=f3e293]:
            - link "0939863696" [ref=f3e296] [cursor=pointer]:
              - /url: tel:0939863696
          - listitem [ref=f3e297]:
            - link "matpetfamily2011@gmail.com" [ref=f3e301] [cursor=pointer]:
              - /url: mailto:matpetfamily2011@gmail.com
          - listitem [ref=f3e302]:
            - generic [ref=f3e306]: 08:00 - 22:00 mỗi ngày
    - generic [ref=f3e307]: © 2011–2026 Mật Pet Family. All rights reserved.
  - button "Mở tư vấn cùng Mật" [ref=f3e309] [cursor=pointer]
  - alert [ref=f3e311]
```

# Test source

```ts
  245 |     const min = await page.evaluate(() => {
  246 |       const i = document.querySelector('input[type="date"]');
  247 |       return i?.getAttribute('min') ?? null;
  248 |     });
  249 |     expect(min, 'min của ô ngày').toBeTruthy();
  250 | 
  251 |     const homNay = new Date();
  252 |     const dinhDang = (d: Date) =>
  253 |       `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  254 |     expect(min).toBe(dinhDang(homNay));
  255 | 
  256 |     // 2 mốc cố định + 3 ngày trong tuần.
  257 |     const moc = await page.evaluate(() =>
  258 |       [...document.querySelectorAll('.date-pill .dp-top')]
  259 |         .map((s) => s.textContent?.trim() ?? '')
  260 |         .filter((t) => /^(Hôm nay|Ngày mai|T\d)$/.test(t)),
  261 |     );
  262 |     expect(moc, 'Các mốc ngày cố định').toEqual([
  263 |       'Hôm nay',
  264 |       'Ngày mai',
  265 |       'T2',
  266 |       'T3',
  267 |       'T4',
  268 |     ]);
  269 |   });
  270 | 
  271 |   test('TC-T2-M4-007: ngày quá 30 ngày được nhập vào ô ngày nhưng không có giới hạn max', async ({
  272 |     page,
  273 |   }) => {
  274 |     await moTrangSpa(page);
  275 | 
  276 |     const oNgay = page.locator('input[type="date"]');
  277 |     const namSau = new Date();
  278 |     namSau.setDate(namSau.getDate() + 60);
  279 |     const giaTri = `${namSau.getFullYear()}-${String(namSau.getMonth() + 1).padStart(2, '0')}-${String(namSau.getDate()).padStart(2, '0')}`;
  280 | 
  281 |     await oNgay.fill(giaTri);
  282 |     await page.waitForTimeout(500);
  283 | 
  284 |     const trangThai = await page.evaluate(() => {
  285 |       const i = document.querySelector<HTMLInputElement>('input[type="date"]');
  286 |       return {
  287 |         value: i?.value ?? '',
  288 |         max: i?.getAttribute('max') ?? '',
  289 |         hopLe: i?.checkValidity() ?? false,
  290 |       };
  291 |     });
  292 | 
  293 |     expect(trangThai.value, 'Giá trị ngày đã nhập').toBe(giaTri);
  294 |     expect(trangThai.max, 'Ô ngày không đặt giới hạn max').toBe('');
  295 |     expect(trangThai.hopLe, 'Ô ngày vẫn hợp lệ').toBe(true);
  296 |   });
  297 | 
  298 |   test('TC-T2-M5-001: trang mô tả quy trình 4 bước khớp thực tế', async ({ page }) => {
  299 |     await moTrangVaCuonToiBangGia(page);
  300 |     const body = await page.evaluate(() => document.body.innerText);
  301 | 
  302 |     // BR-10: tiếp nhận → kiểm tra → grooming → bàn giao.
  303 |     expect(body).toMatch(/01\s*Tiếp nhận/);
  304 |     expect(body).toMatch(/02\s*Kiểm tra/);
  305 |     expect(body).toMatch(/03\s*Grooming/);
  306 |     expect(body).toMatch(/04\s*Bàn giao/);
  307 |   });
  308 | 
  309 |   test('TC-T2-M5-002: có nêu spa sẽ gọi xác nhận khung giờ với thời gian cụ thể', async ({
  310 |     page,
  311 |   }) => {
  312 |     await moTrangVaCuonToiBangGia(page);
  313 |     const body = await page.evaluate(() => document.body.innerText);
  314 | 
  315 |     expect(body, 'Có nói spa sẽ gọi xác nhận khung giờ').toMatch(
  316 |       /spa sẽ gọi (lại )?xác nhận khung giờ/i,
  317 |     );
  318 |     // Tiêu chí chấp nhận yêu cầu nêu rõ thời gian xác nhận.
  319 |     expect(body, 'Có nêu thời gian xác nhận').toMatch(
  320 |       /xác nhận (lịch|khung giờ)[^\n]*\d+\s*(giây|phút|giờ|tiếng)|trong vòng \d+\s*(giây|phút|giờ)/i,
  321 |     );
  322 |   });
  323 | 
  324 |   test('TC-T2-M5-003: nội dung hủy/đổi lịch và hoàn cọc tồn tại, không chỉ nói liên hệ tiệm', async ({
  325 |     page,
  326 |   }) => {
  327 |     const trang = ['/spa', '/cau-hoi-thuong-gap', '/bao-hanh', '/cham-soc'];
  328 | 
  329 |     let noiDung = '';
  330 |     for (const duongDan of trang) {
  331 |       await page.goto(`https://matpet.vn${duongDan}`, { waitUntil: 'load' });
  332 |       await page.waitForTimeout(2_000);
  333 |       await page.evaluate(() => {
  334 |         document.querySelectorAll('details').forEach((d) => d.setAttribute('open', ''));
  335 |       });
  336 |       await page.waitForTimeout(500);
  337 |       noiDung += `\n${duongDan}\n` + (await page.evaluate(() => document.body.innerText));
  338 |     }
  339 | 
  340 |     // FR-M5-04: cần nội dung cho cả 3 mục — hủy, đổi, hoàn cọc.
  341 |     const coHuy = /hủy|huỷ|chấp nhận hủy/i.test(noiDung);
  342 |     const coDoi = /đổi lịch|đổi khung giờ|reschedul/i.test(noiDung);
  343 |     const coHoanCoc = /hoàn (cọc|tiền)|hoàn lại tiền|đặt cọc/i.test(noiDung);
  344 | 
> 345 |     expect(coHuy, 'Có nội dung về hủy lịch').toBe(true);
      |                                              ^ Error: Có nội dung về hủy lịch
  346 |     expect(coDoi, 'Có nội dung về đổi lịch').toBe(true);
  347 |     expect(coHoanCoc, 'Có nội dung về hoàn cọc').toBe(true);
  348 |   });
  349 | });
  350 | 
```