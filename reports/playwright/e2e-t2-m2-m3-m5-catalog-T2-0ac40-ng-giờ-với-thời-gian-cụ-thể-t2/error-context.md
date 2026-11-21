# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t2\m2-m3-m5-catalog.spec.ts >> T2 Mật Pet — M1/M2/M3/M4/M5 (Ngân) >> TC-T2-M5-002: có nêu spa sẽ gọi xác nhận khung giờ với thời gian cụ thể
- Location: tests\e2e\t2\m2-m3-m5-catalog.spec.ts:309:3

# Error details

```
Error: Có nêu thời gian xác nhận

expect(received).toMatch(expected)

Expected pattern: /xác nhận (lịch|khung giờ)[^\n]*\d+\s*(giây|phút|giờ|tiếng)|trong vòng \d+\s*(giây|phút|giờ)/i
Received string:  "Trang chủ
Chó
Mèo
Tìm Bé Thương
Spa
Bảo hành
Về Mật Pet
VI
|
EN
0939.86.36.96
SPA & GROOMING · TỪ 2011
Biết giá trước
khi đưa bé đến spa.·
Chọn loại bé, cân nặng và dịch vụ — bạn thấy ngay mức giá dự kiến minh bạch, rồi giữ chỗ chỉ với số điện thoại. Không còn phải nhắn tin hỏi giá.·
Tính giá dự kiến →
Xem bảng giá
✓
An toàn cho bé
✓
Hơn 15 năm kinh nghiệm
✓
Nhân viên có nghề
🐾
ĐÃ CHĂM SÓC
10.000+
CALCULATOR
Tính giá dự kiến cho bé·
Ba bước nhanh. Giá hiện ngay khi bạn chọn — chưa phải để lại thông tin gì.·
1
Loại bé
Chó / Mèo
2
Cân nặng
Bậc định sẵn
3
Dịch vụ
Combo hoặc lẻ
Bé nhà bạn là?·
Chọn loại để hiển thị đúng bậc cân nặng & dịch vụ.·
🐶
Chó
🐱
Mèo
← Quay lại
Tiếp tục →
GIÁ DỰ KIẾN
Chọn dịch vụ để xem giá dự kiến cho bé của bạn 🐾
Giữ chỗ với mức giá này →
GIỮ CHỖ
Giữ chỗ cho bé·
Chỉ cần số điện thoại — spa sẽ gọi xác nhận khung giờ. Lựa chọn từ calculator đã được điền sẵn.·
TÓM TẮT LỰA CHỌN
Chưa có lựa chọn
—·
Giá cuối được xác nhận tại spa sau khi cân & kiểm tra tình trạng lông. Dịch vụ \"báo giá riêng\" sẽ được tư vấn khi spa gọi lại.·
Số điện thoại / Zalo *
Tên bé
Ngày mong muốn
Hôm nay
21/11
Ngày mai
22/11
T2
23/11
T3
24/11
T4
25/11
Ngày khác·
Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại / Zalo để xác nhận lịch.·
Giữ chỗ cho bé →
BẢNG GIÁ ĐẦY ĐỦ
Bảng giá tham khảo · Chó & Mèo·
Giá theo từng bậc cân nặng. Dịch vụ đặc biệt hiển thị \"báo giá riêng\" — spa kiểm tra trực tiếp để báo chính xác.·
DỊCH VỤ (GROOMING)	<3KG	>3–6KG	>6–10KG	>10–20KG	>20–30KG	>30–40KG	>40KG
COMBO TRỌN GÓI
Combo Tắm Vệ Sinh	120k	200k	300k	400k	500k	600k	700k
Combo Tắm Cạo	200k	250k	350k	450k	600k	700k	800k
Combo Tắm Cắt	300k	350k	400k	550k	700k	800k	1tr
Combo Tắm Cắt Tạo Hình	350k	400k	500k	650k	800k	1tr	1,2tr
DỊCH VỤ LẺ
Cắt dũa + Móng	30k	30k	50k	50k	70k	70k	70k
Vệ sinh tai	30k	30k	50k	50k	70k	70k	70k
Cạo bụng + Bàn + Hậu môn	30k	30k	50k	50k	70k	70k	70k
Tắm sấy	100k	150k	250k	350k	450k	550k	650k
Cạo lông	150k	200k	300k	400k	500k	600k	700k
Cắt lông	200k	300k	400k	500k	650k	750k	900k
DỊCH VỤ (NHUỘM)	<6KG	>6–15KG	>15–30KG	>30KG
NHUỘM TẠO KIỂU
Nhuộm 2 tai + đuôi	250k	300k	350k	400k
Nhuộm 4 chân	250k	300k	350k	400k
Nhuộm hình nhỏ	300k	350k	400k	500k
BÁO GIÁ RIÊNG — TUỲ TÌNH TRẠNG BÉ
Gỡ rối	Báo giá theo tình trạng lông: 50.000 – 500.000đ
Tẩy ố	Báo giá theo tình trạng lông: 50.000 – 500.000đ
Tắm trắng	Báo giá theo tình trạng lông: 50.000 – 500.000đ
Xả dưỡng	Báo giá theo tình trạng lông: 50.000 – 500.000đ
Nhuộm hình lớn	Báo giá tuỳ kích thước & màu
Nhuộm tạo hình cơ thể	Báo giá theo thiết kế riêng
* Giá trên chưa bao gồm phí gỡ rối, tẩy ố và tắm trắng.
CAM KẾT
Bé an toàn, bạn yên tâm·
Spa được vận hành bởi đội ngũ đã chăm sóc hơn 10.000 bé trong 15 năm.·
🛡️
An toàn trên hết·
Quy trình nhẹ nhàng, theo dõi sát với bé nhút nhát hoặc lớn tuổi.·
🧴
Sản phẩm dịu nhẹ·
Sữa tắm & dưỡng phù hợp da bé, không gây kích ứng.·
✂️
Thợ có tay nghề·
Cắt tỉa theo giống & yêu cầu, tư vấn kiểu phù hợp.·
📷
Minh bạch & báo cáo·
Cập nhật tình trạng bé, bàn giao kèm hình trước/sau.·
01
Tiếp nhận·
Đón bé, ghi nhận yêu cầu & lưu ý sức khoẻ.·
02
Kiểm tra·
Cân, kiểm tra da & lông, xác nhận giá cuối.·
03
Grooming·
Thực hiện dịch vụ theo combo / lựa chọn.·
04
Bàn giao·
Trả bé, gửi hình & lời khuyên chăm sóc.·
CHI NHÁNH
Đưa bé đến spa·
Đặt lịch trước để spa chuẩn bị khung giờ phù hợp cho bé.·
Pet Shop & Spa — TP.HCM
239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM
Mở cửa: 08:00 – 22:00 hằng ngày
Hotline: 0939.86.36.96
Chỉ đường →
Gọi 0939.86.36.96·
Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.·
YouTube
Facebook
TikTok·
PET SHOP·
Trang chủ
Chó
Mèo
Tìm Bé Thương
Bảng giá
Bảo hành
Về Mật Pet
Tuyển dụng·
NỘI DUNG & CỘNG ĐỒNG·
Blog
Hướng dẫn chăm sóc
So sánh giống
Hỏi đáp
Đánh giá khách hàng
Showroom·
LIÊN HỆ·
239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM
0939863696
matpetfamily2011@gmail.com
08:00 - 22:00 mỗi ngày
© 2011–2026 Mật Pet Family. All rights reserved."
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
            - button "1 Loại bé Chó / Mèo" [ref=e59] [cursor=pointer]:
              - generic [ref=e60]: "1"
              - generic [ref=e61]:
                - text: Loại bé
                - generic [ref=e62]: Chó / Mèo
            - button "2 Cân nặng Bậc định sẵn" [ref=e63] [cursor=pointer]:
              - generic [ref=e64]: "2"
              - generic [ref=e65]:
                - text: Cân nặng
                - generic [ref=e66]: Bậc định sẵn
            - button "3 Dịch vụ Combo hoặc lẻ" [ref=e67] [cursor=pointer]:
              - generic [ref=e68]: "3"
              - generic [ref=e69]:
                - text: Dịch vụ
                - generic [ref=e70]: Combo hoặc lẻ
          - generic [ref=e72]:
            - heading "Bé nhà bạn là?" [level=3] [ref=e73]
            - paragraph [ref=e74]: Chọn loại để hiển thị đúng bậc cân nặng & dịch vụ.
            - generic [ref=e75]:
              - button "🐶 Chó" [ref=e76] [cursor=pointer]:
                - generic [ref=e77]: 🐶
                - generic [ref=e78]: Chó
              - button "🐱 Mèo" [ref=e79] [cursor=pointer]:
                - generic [ref=e80]: 🐱
                - generic [ref=e81]: Mèo
            - generic [ref=e82]:
              - button "← Quay lại" [disabled]
              - button "Tiếp tục →" [disabled]
        - complementary [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]: Giá dự kiến
            - generic [ref=e86]: Chọn dịch vụ để xem giá dự kiến cho bé của bạn 🐾
            - button "Giữ chỗ với mức giá này →" [disabled]
    - generic [ref=e88]:
      - generic [ref=e89]:
        - generic [ref=e90]: Giữ chỗ
        - heading "Giữ chỗ cho bé" [level=2] [ref=e91]
        - paragraph [ref=e92]: Chỉ cần số điện thoại — spa sẽ gọi xác nhận khung giờ. Lựa chọn từ calculator đã được điền sẵn.
      - generic [ref=e93]:
        - generic [ref=e94]:
          - heading "Tóm tắt lựa chọn" [level=4] [ref=e95]
          - generic [ref=e96]:
            - generic [ref=e97]: Chưa có lựa chọn
            - generic [ref=e98]: —
          - paragraph [ref=e99]: Giá cuối được xác nhận tại spa sau khi cân & kiểm tra tình trạng lông. Dịch vụ "báo giá riêng" sẽ được tư vấn khi spa gọi lại.
        - generic [ref=e101]:
          - generic [ref=e102]:
            - generic [ref=e103]: Số điện thoại / Zalo *
            - textbox "Số điện thoại / Zalo *" [ref=e104]:
              - /placeholder: 0xxx xxx xxx
          - generic [ref=e105]:
            - generic [ref=e106]: Tên bé
            - textbox "Tên bé" [ref=e107]:
              - /placeholder: "Vd: Mochi"
          - generic [ref=e108]:
            - generic [ref=e109]: Ngày mong muốn
            - generic [ref=e110]:
              - button "Hôm nay 21/11" [ref=e111] [cursor=pointer]:
                - generic [ref=e112]: Hôm nay
                - generic [ref=e113]: 21/11
              - button "Ngày mai 22/11" [ref=e114] [cursor=pointer]:
                - generic [ref=e115]: Ngày mai
                - generic [ref=e116]: 22/11
              - button "T2 23/11" [ref=e117] [cursor=pointer]:
                - generic [ref=e118]: T2
                - generic [ref=e119]: 23/11
              - button "T3 24/11" [ref=e120] [cursor=pointer]:
                - generic [ref=e121]: T3
                - generic [ref=e122]: 24/11
              - button "T4 25/11" [ref=e123] [cursor=pointer]:
                - generic [ref=e124]: T4
                - generic [ref=e125]: 25/11
              - generic [ref=e126] [cursor=pointer]:
                - text: Ngày khác
                - textbox "Ngày khác" [ref=e130]
          - paragraph [ref=e131]: Bằng việc gửi, bạn đồng ý để Mật Pet Family liên hệ lại qua điện thoại / Zalo để xác nhận lịch.
          - button "Giữ chỗ cho bé →" [ref=e132] [cursor=pointer]
    - generic [ref=e134]:
      - generic [ref=e135]:
        - generic [ref=e136]: Bảng giá đầy đủ
        - heading "Bảng giá tham khảo · Chó & Mèo" [level=2] [ref=e137]
        - paragraph [ref=e138]: Giá theo từng bậc cân nặng. Dịch vụ đặc biệt hiển thị "báo giá riêng" — spa kiểm tra trực tiếp để báo chính xác.
      - table [ref=e141]:
        - rowgroup [ref=e142]:
          - row [ref=e143]:
            - columnheader "Dịch vụ (Grooming)" [ref=e144]
            - columnheader "<3kg" [ref=e145]
            - columnheader ">3–6kg" [ref=e146]
            - columnheader ">6–10kg" [ref=e147]
            - columnheader ">10–20kg" [ref=e148]
            - columnheader ">20–30kg" [ref=e149]
            - columnheader ">30–40kg" [ref=e150]
            - columnheader ">40kg" [ref=e151]
        - rowgroup [ref=e152]:
          - row [ref=e153]:
            - cell "Combo trọn gói" [ref=e154]
          - row [ref=e155]:
            - cell "Combo Tắm Vệ Sinh" [ref=e156]
            - cell "120k" [ref=e157]
            - cell "200k" [ref=e158]
            - cell "300k" [ref=e159]
            - cell "400k" [ref=e160]
            - cell "500k" [ref=e161]
            - cell "600k" [ref=e162]
            - cell "700k" [ref=e163]
          - row [ref=e164]:
            - cell "Combo Tắm Cạo" [ref=e165]
            - cell "200k" [ref=e166]
            - cell "250k" [ref=e167]
            - cell "350k" [ref=e168]
            - cell "450k" [ref=e169]
            - cell "600k" [ref=e170]
            - cell "700k" [ref=e171]
            - cell "800k" [ref=e172]
          - row [ref=e173]:
            - cell "Combo Tắm Cắt" [ref=e174]
            - cell "300k" [ref=e175]
            - cell "350k" [ref=e176]
            - cell "400k" [ref=e177]
            - cell "550k" [ref=e178]
            - cell "700k" [ref=e179]
            - cell "800k" [ref=e180]
            - cell "1tr" [ref=e181]
          - row [ref=e182]:
            - cell "Combo Tắm Cắt Tạo Hình" [ref=e183]
            - cell "350k" [ref=e184]
            - cell "400k" [ref=e185]
            - cell "500k" [ref=e186]
            - cell "650k" [ref=e187]
            - cell "800k" [ref=e188]
            - cell "1tr" [ref=e189]
            - cell "1,2tr" [ref=e190]
          - row [ref=e191]:
            - cell "Dịch vụ lẻ" [ref=e192]
          - row [ref=e193]:
            - cell "Cắt dũa + Móng" [ref=e194]
            - cell "30k" [ref=e195]
            - cell "30k" [ref=e196]
            - cell "50k" [ref=e197]
            - cell "50k" [ref=e198]
            - cell "70k" [ref=e199]
            - cell "70k" [ref=e200]
            - cell "70k" [ref=e201]
          - row [ref=e202]:
            - cell "Vệ sinh tai" [ref=e203]
            - cell "30k" [ref=e204]
            - cell "30k" [ref=e205]
            - cell "50k" [ref=e206]
            - cell "50k" [ref=e207]
            - cell "70k" [ref=e208]
            - cell "70k" [ref=e209]
            - cell "70k" [ref=e210]
          - row [ref=e211]:
            - cell "Cạo bụng + Bàn + Hậu môn" [ref=e212]
            - cell "30k" [ref=e213]
            - cell "30k" [ref=e214]
            - cell "50k" [ref=e215]
            - cell "50k" [ref=e216]
            - cell "70k" [ref=e217]
            - cell "70k" [ref=e218]
            - cell "70k" [ref=e219]
          - row [ref=e220]:
            - cell "Tắm sấy" [ref=e221]
            - cell "100k" [ref=e222]
            - cell "150k" [ref=e223]
            - cell "250k" [ref=e224]
            - cell "350k" [ref=e225]
            - cell "450k" [ref=e226]
            - cell "550k" [ref=e227]
            - cell "650k" [ref=e228]
          - row [ref=e229]:
            - cell "Cạo lông" [ref=e230]
            - cell "150k" [ref=e231]
            - cell "200k" [ref=e232]
            - cell "300k" [ref=e233]
            - cell "400k" [ref=e234]
            - cell "500k" [ref=e235]
            - cell "600k" [ref=e236]
            - cell "700k" [ref=e237]
          - row [ref=e238]:
            - cell "Cắt lông" [ref=e239]
            - cell "200k" [ref=e240]
            - cell "300k" [ref=e241]
            - cell "400k" [ref=e242]
            - cell "500k" [ref=e243]
            - cell "650k" [ref=e244]
            - cell "750k" [ref=e245]
            - cell "900k" [ref=e246]
      - table [ref=e250]:
        - rowgroup [ref=e251]:
          - row [ref=e252]:
            - columnheader "Dịch vụ (Nhuộm)" [ref=e253]
            - columnheader "<6kg" [ref=e254]
            - columnheader ">6–15kg" [ref=e255]
            - columnheader ">15–30kg" [ref=e256]
            - columnheader ">30kg" [ref=e257]
        - rowgroup [ref=e258]:
          - row [ref=e259]:
            - cell "Nhuộm tạo kiểu" [ref=e260]
          - row [ref=e261]:
            - cell "Nhuộm 2 tai + đuôi" [ref=e262]
            - cell "250k" [ref=e263]
            - cell "300k" [ref=e264]
            - cell "350k" [ref=e265]
            - cell "400k" [ref=e266]
          - row [ref=e267]:
            - cell "Nhuộm 4 chân" [ref=e268]
            - cell "250k" [ref=e269]
            - cell "300k" [ref=e270]
            - cell "350k" [ref=e271]
            - cell "400k" [ref=e272]
          - row [ref=e273]:
            - cell "Nhuộm hình nhỏ" [ref=e274]
            - cell "300k" [ref=e275]
            - cell "350k" [ref=e276]
            - cell "400k" [ref=e277]
            - cell "500k" [ref=e278]
      - table [ref=e280]:
        - rowgroup [ref=e281]:
          - row [ref=e282]:
            - cell "Báo giá riêng — tuỳ tình trạng bé" [ref=e283]
          - row [ref=e284]:
            - cell "Gỡ rối" [ref=e285]
            - 'cell "Báo giá theo tình trạng lông: 50.000 – 500.000đ" [ref=e286]'
          - row [ref=e287]:
            - cell "Tẩy ố" [ref=e288]
            - 'cell "Báo giá theo tình trạng lông: 50.000 – 500.000đ" [ref=e289]'
          - row [ref=e290]:
            - cell "Tắm trắng" [ref=e291]
            - 'cell "Báo giá theo tình trạng lông: 50.000 – 500.000đ" [ref=e292]'
          - row [ref=e293]:
            - cell "Xả dưỡng" [ref=e294]
            - 'cell "Báo giá theo tình trạng lông: 50.000 – 500.000đ" [ref=e295]'
          - row [ref=e296]:
            - cell "Nhuộm hình lớn" [ref=e297]
            - cell "Báo giá tuỳ kích thước & màu" [ref=e298]
          - row [ref=e299]:
            - cell "Nhuộm tạo hình cơ thể" [ref=e300]
            - cell "Báo giá theo thiết kế riêng" [ref=e301]
      - generic [ref=e302]: "* Giá trên chưa bao gồm phí gỡ rối, tẩy ố và tắm trắng."
    - generic [ref=e304]:
      - generic [ref=e305]:
        - generic [ref=e306]: Cam kết
        - heading "Bé an toàn, bạn yên tâm" [level=2] [ref=e307]
        - paragraph [ref=e308]: Spa được vận hành bởi đội ngũ đã chăm sóc hơn 10.000 bé trong 15 năm.
      - generic [ref=e309]:
        - generic [ref=e310]:
          - generic [ref=e311]: 🛡️
          - heading "An toàn trên hết" [level=4] [ref=e312]
          - paragraph [ref=e313]: Quy trình nhẹ nhàng, theo dõi sát với bé nhút nhát hoặc lớn tuổi.
        - generic [ref=e314]:
          - generic [ref=e315]: 🧴
          - heading "Sản phẩm dịu nhẹ" [level=4] [ref=e316]
          - paragraph [ref=e317]: Sữa tắm & dưỡng phù hợp da bé, không gây kích ứng.
        - generic [ref=e318]:
          - generic [ref=e319]: ✂️
          - heading "Thợ có tay nghề" [level=4] [ref=e320]
          - paragraph [ref=e321]: Cắt tỉa theo giống & yêu cầu, tư vấn kiểu phù hợp.
        - generic [ref=e322]:
          - generic [ref=e323]: 📷
          - heading "Minh bạch & báo cáo" [level=4] [ref=e324]
          - paragraph [ref=e325]: Cập nhật tình trạng bé, bàn giao kèm hình trước/sau.
      - generic [ref=e326]:
        - generic [ref=e327]:
          - generic [ref=e328]: "01"
          - generic [ref=e329]: Tiếp nhận
          - paragraph [ref=e330]: Đón bé, ghi nhận yêu cầu & lưu ý sức khoẻ.
        - generic [ref=e331]:
          - generic [ref=e332]: "02"
          - generic [ref=e333]: Kiểm tra
          - paragraph [ref=e334]: Cân, kiểm tra da & lông, xác nhận giá cuối.
        - generic [ref=e335]:
          - generic [ref=e336]: "03"
          - generic [ref=e337]: Grooming
          - paragraph [ref=e338]: Thực hiện dịch vụ theo combo / lựa chọn.
        - generic [ref=e339]:
          - generic [ref=e340]: "04"
          - generic [ref=e341]: Bàn giao
          - paragraph [ref=e342]: Trả bé, gửi hình & lời khuyên chăm sóc.
    - generic [ref=e344]:
      - generic [ref=e345]:
        - generic [ref=e346]: Chi nhánh
        - heading "Đưa bé đến spa" [level=2] [ref=e347]
        - paragraph [ref=e348]: Đặt lịch trước để spa chuẩn bị khung giờ phù hợp cho bé.
      - generic [ref=e349]:
        - img "Chi nhánh Mật Pet" [ref=e351]
        - generic [ref=e352]:
          - heading "Pet Shop & Spa — TP.HCM" [level=4] [ref=e353]
          - generic [ref=e354]: "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCMMở cửa: 08:00 – 22:00 hằng ngàyHotline: 0939.86.36.96"
          - generic [ref=e355]:
            - link "Chỉ đường →" [ref=e356] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
            - link "Gọi 0939.86.36.96" [ref=e357] [cursor=pointer]:
              - /url: tel:0939863696
  - contentinfo [ref=e358]:
    - generic [ref=e360]:
      - generic [ref=e361]:
        - img "Mật Pet Family" [ref=e362]
        - paragraph [ref=e363]: Premium pet shop đồng hành tìm người bạn bốn chân phù hợp nhất cho từng gia đình Việt.
        - generic [ref=e364]:
          - link "YouTube" [ref=e365] [cursor=pointer]:
            - /url: https://www.youtube.com/@matpetfamily2011
          - link "Facebook" [ref=e366] [cursor=pointer]:
            - /url: https://www.facebook.com/matpetfamily
          - link "TikTok" [ref=e367] [cursor=pointer]:
            - /url: https://www.tiktok.com/@matpetfamilyshop
      - generic [ref=e368]:
        - paragraph [ref=e369]: Pet Shop
        - list [ref=e370]:
          - listitem [ref=e371]:
            - link "Trang chủ" [ref=e372] [cursor=pointer]:
              - /url: /
          - listitem [ref=e373]:
            - link "Chó" [ref=e374] [cursor=pointer]:
              - /url: /cho
          - listitem [ref=e375]:
            - link "Mèo" [ref=e376] [cursor=pointer]:
              - /url: /meo
          - listitem [ref=e377]:
            - link "Tìm Bé Thương" [ref=e378] [cursor=pointer]:
              - /url: /tim-be-thuong
          - listitem [ref=e379]:
            - link "Bảng giá" [ref=e380] [cursor=pointer]:
              - /url: /bang-gia
          - listitem [ref=e381]:
            - link "Bảo hành" [ref=e382] [cursor=pointer]:
              - /url: /bao-hanh
          - listitem [ref=e383]:
            - link "Về Mật Pet" [ref=e384] [cursor=pointer]:
              - /url: /vematpet
          - listitem [ref=e385]:
            - link "Tuyển dụng" [ref=e386] [cursor=pointer]:
              - /url: /tuyendung
      - generic [ref=e387]:
        - paragraph [ref=e388]: Nội dung & cộng đồng
        - list [ref=e389]:
          - listitem [ref=e390]:
            - link "Blog" [ref=e391] [cursor=pointer]:
              - /url: /blog
          - listitem [ref=e392]:
            - link "Hướng dẫn chăm sóc" [ref=e393] [cursor=pointer]:
              - /url: /cham-soc
          - listitem [ref=e394]:
            - link "So sánh giống" [ref=e395] [cursor=pointer]:
              - /url: /so-sanh
          - listitem [ref=e396]:
            - link "Hỏi đáp" [ref=e397] [cursor=pointer]:
              - /url: /cau-hoi-thuong-gap
          - listitem [ref=e398]:
            - link "Đánh giá khách hàng" [ref=e399] [cursor=pointer]:
              - /url: /danh-gia-khach-hang
          - listitem [ref=e400]:
            - link "Showroom" [ref=e401] [cursor=pointer]:
              - /url: /showroom
      - generic [ref=e402]:
        - paragraph [ref=e403]: Liên hệ
        - list [ref=e404]:
          - listitem [ref=e405]:
            - link "239 Nguyễn Hồng Đào, Q. Tân Bình, TP.HCM" [ref=e409] [cursor=pointer]:
              - /url: https://maps.app.goo.gl/Di98ypjgr86ohKJp6
          - listitem [ref=e410]:
            - link "0939863696" [ref=e413] [cursor=pointer]:
              - /url: tel:0939863696
          - listitem [ref=e414]:
            - link "matpetfamily2011@gmail.com" [ref=e418] [cursor=pointer]:
              - /url: mailto:matpetfamily2011@gmail.com
          - listitem [ref=e419]:
            - generic [ref=e423]: 08:00 - 22:00 mỗi ngày
    - generic [ref=e424]: © 2011–2026 Mật Pet Family. All rights reserved.
  - button "Mở tư vấn cùng Mật" [ref=e426] [cursor=pointer]
  - alert [ref=e428]
```

# Test source

```ts
  219 | 
  220 |   test('TC-T2-M3-010: bảng giá nêu rõ ngoại lệ phát sinh phí gỡ rối, tẩy ố, tắm trắng', async ({
  221 |     page,
  222 |   }) => {
  223 |     await moTrangVaCuonToiBangGia(page);
  224 |     const body = await page.evaluate(() => document.body.innerText);
  225 | 
  226 |     expect(body).toMatch(/phí gỡ rối/i);
  227 |     expect(body).toMatch(/tẩy ố/i);
  228 |     expect(body).toMatch(/tắm trắng/i);
  229 |   });
  230 | 
  231 |   test('TC-T2-M3-012: BVA ngưỡng 3kg — cân 2.9kg thuộc bậc dưới (<3kg)', async ({ page }) => {
  232 |     await sangBuocDichVuChon(page, '<3kg');
  233 | 
  234 |     // Bậc dưới biên (<3kg) là bậc đầu tiên; giá của nó thấp hơn bậc kế tiếp.
  235 |     await page.getByRole('button', { name: /Combo Tắm Vệ Sinh/ }).first().click();
  236 |     const gia = await page.locator('.rail-price').innerText();
  237 |     expect(gia).toContain('120.000');
  238 |   });
  239 | 
  240 |   test('TC-T2-M4-006: ô ngày của T2 có min = hôm nay, kèm 2 mốc cố định "Hôm nay" và "Ngày mai"', async ({
  241 |     page,
  242 |   }) => {
  243 |     await moTrangSpa(page);
  244 | 
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
> 319 |     expect(body, 'Có nêu thời gian xác nhận').toMatch(
      |                                               ^ Error: Có nêu thời gian xác nhận
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
  345 |     expect(coHuy, 'Có nội dung về hủy lịch').toBe(true);
  346 |     expect(coDoi, 'Có nội dung về đổi lịch').toBe(true);
  347 |     expect(coHoanCoc, 'Có nội dung về hoàn cọc').toBe(true);
  348 |   });
  349 | });
  350 | 
```