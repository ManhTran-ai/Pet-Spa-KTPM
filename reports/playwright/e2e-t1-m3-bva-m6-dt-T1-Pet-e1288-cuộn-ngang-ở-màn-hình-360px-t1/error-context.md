# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\t1\m3-bva-m6-dt.spec.ts >> T1 Pet NGON — M1 Hiển thị trên màn hình di động >> TC-T1-M1-005: trang chủ không cuộn ngang ở màn hình 360px
- Location: tests\e2e\t1\m3-bva-m6-dt.spec.ts:55:3

# Error details

```
Error: scrollWidth=379 > clientWidth=360

expect(received).toBeLessThanOrEqual(expected)

Expected: <= 361
Received:    379
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]: celebration
      - generic [ref=e5]: Đặt lịch online lần đầu — Giảm ngay 10%!
      - generic [ref=e6]: NEW10
    - generic [ref=e7]:
      - generic [ref=e8]:
        - link "Pet NGON" [ref=e9] [cursor=pointer]:
          - /url: /vi
        - button "Mở menu điều hướng" [ref=e12] [cursor=pointer]:
          - generic [ref=e13]: menu
      - generic [ref=e14]:
        - button "Đổi ngôn ngữ" [ref=e15] [cursor=pointer]:
          - generic [ref=e16]: language
          - generic [ref=e17]: VI
          - text: / EN
        - button "calendar_month Đặt lịch" [ref=e18] [cursor=pointer]:
          - generic [ref=e19]: calendar_month
          - generic [ref=e20]: Đặt lịch
  - generic [ref=e22]:
    - generic [ref=e23]:
      - generic [ref=e24]:
        - generic [ref=e25]: spa
        - text: Pet NGON Spa & Grooming
      - heading [level=1] [ref=e26]:
        - text: Spa cho thú cưng —
        - emphasis [ref=e27]: tận tâm, tận nhà.
      - paragraph [ref=e28]: Tắm vệ sinh, cắt tỉa, cạo lông và combo trọn gói. Nhiều dịch vụ có thể thực hiện ngay tại nhà bạn — chúng tôi mang spa đến tận cửa cho bé cưng.
      - generic [ref=e29]:
        - button "calendar_month Đặt lịch ngay" [ref=e30] [cursor=pointer]:
          - generic [ref=e31]: calendar_month
          - text: Đặt lịch ngay
        - link "menu_book Xem dịch vụ" [ref=e32] [cursor=pointer]:
          - /url: /vi#services
          - generic [ref=e33]: menu_book
          - text: Xem dịch vụ
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]: home_work
          - generic [ref=e37]:
            - generic [ref=e38]: Tận nhà
            - text: Tắm · Cạo · Combo cạo
        - generic [ref=e39]:
          - generic [ref=e40]: verified
          - generic [ref=e41]:
            - generic [ref=e42]: Thợ chứng chỉ
            - text: 6+ năm kinh nghiệm
        - generic [ref=e43]:
          - generic [ref=e44]: payments
          - generic [ref=e45]:
            - generic [ref=e46]: Báo giá theo cân
            - text: Minh bạch trước khi đặt
    - generic [ref=e47]:
      - img "Chú chó vui vẻ — spa & grooming tận nhà Pet NGON tại TP.HCM" [ref=e49]
      - generic [ref=e50]:
        - generic [ref=e51]: favorite
        - text: 2.000+ bé cưng
      - generic [ref=e52]:
        - generic [ref=e53]: shower
        - generic [ref=e54]: Tắm tận nhà
      - generic [ref=e55]:
        - generic [ref=e56]: schedule
        - generic [ref=e57]:
          - generic [ref=e58]: Đến trong 60'
          - generic [ref=e59]: Nội thành HCMC
  - generic [ref=e61]:
    - generic [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e64]: spa
        - text: Dịch vụ Grooming
      - heading "6 gói dịch vụ — giá theo loài và cân nặng" [level=2] [ref=e65]
      - paragraph [ref=e66]: Bảng giá riêng cho chó và mèo, chi tiết theo từng khoảng cân nặng. Phụ thu di chuyển hiển thị ngay khi đặt. Tắm, cạo và combo tắm + cạo có thể thực hiện tại nhà.
    - generic [ref=e67]:
      - article [ref=e68]:
        - generic [ref=e69]:
          - generic [ref=e70]: bathtub
          - generic [ref=e71]:
            - generic [ref=e72]: home_work
            - text: Có tận nhà
        - generic [ref=e73]:
          - heading "Tắm" [level=3] [ref=e74]
          - paragraph [ref=e75]: Gói tắm cơ bản — tắm sạch với sữa tắm dịu nhẹ, sấy khô và chải mượt. Đơn giản, nhanh gọn.
          - generic [ref=e76]:
            - generic [ref=e77]: home_work
            - text: "Phụ thu tận nhà:"
            - generic [ref=e78]: +50.000₫
            - text: (chưa gồm phí di chuyển)
          - paragraph [ref=e79]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e80] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e81]:
            - generic [ref=e82]:
              - generic [ref=e83]: Từ
              - generic [ref=e84]: 88.000₫
              - generic [ref=e85]:
                - generic [ref=e86]: schedule
                - text: 45 phút
            - button "calendar_month Đặt lịch" [ref=e87] [cursor=pointer]:
              - generic [ref=e88]: calendar_month
              - text: Đặt lịch
      - article [ref=e89]:
        - generic [ref=e90]:
          - generic [ref=e91]: content_cut
          - generic [ref=e92]:
            - generic [ref=e93]: store
            - text: Chỉ tại spa
        - generic [ref=e94]:
          - heading "Cắt tỉa lông" [level=3] [ref=e95]
          - paragraph [ref=e96]: Cắt tỉa tạo kiểu theo giống chó/mèo của bé. Thợ tỉa chuyên nghiệp tư vấn kiểu phù hợp khuôn mặt, mùa vụ.
          - paragraph [ref=e97]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e98] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e99]:
            - generic [ref=e100]:
              - generic [ref=e101]: Từ
              - generic [ref=e102]: 145.000₫
              - generic [ref=e103]:
                - generic [ref=e104]: schedule
                - text: 90 phút
            - button "calendar_month Đặt lịch" [ref=e105] [cursor=pointer]:
              - generic [ref=e106]: calendar_month
              - text: Đặt lịch
      - article [ref=e107]:
        - generic [ref=e108]:
          - generic [ref=e109]: cut
          - generic [ref=e110]:
            - generic [ref=e111]: home_work
            - text: Có tận nhà
        - generic [ref=e112]:
          - heading "Cạo lông" [level=3] [ref=e113]
          - paragraph [ref=e114]: Cạo lông toàn thân vào mùa nóng hoặc khi lông bết, rối khó cứu. Tông đơ chuyên dụng, lưỡi an toàn.
          - generic [ref=e115]:
            - generic [ref=e116]: home_work
            - text: "Phụ thu tận nhà:"
            - generic [ref=e117]: +80.000₫
            - text: (chưa gồm phí di chuyển)
          - paragraph [ref=e118]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e119] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e120]:
            - generic [ref=e121]:
              - generic [ref=e122]: Từ
              - generic [ref=e123]: 88.000₫
              - generic [ref=e124]:
                - generic [ref=e125]: schedule
                - text: 60 phút
            - button "calendar_month Đặt lịch" [ref=e126] [cursor=pointer]:
              - generic [ref=e127]: calendar_month
              - text: Đặt lịch
      - article [ref=e128]:
        - generic [ref=e129]:
          - generic [ref=e130]: shower
          - generic [ref=e131]:
            - generic [ref=e132]: local_fire_department
            - text: Phổ biến
          - generic [ref=e133]:
            - generic [ref=e134]: home_work
            - text: Có tận nhà
        - generic [ref=e135]:
          - heading "Combo Tắm + Vệ sinh" [level=3] [ref=e136]
          - paragraph [ref=e137]: Tắm sạch toàn thân với sữa tắm chuyên dụng theo loại da, sấy khô, vệ sinh tai, cắt móng, làm sạch tuyến hôi.
          - generic [ref=e138]:
            - generic [ref=e139]: home_work
            - text: "Phụ thu tận nhà:"
            - generic [ref=e140]: +70.000₫
            - text: (chưa gồm phí di chuyển)
          - paragraph [ref=e141]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e142] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e143]:
            - generic [ref=e144]:
              - generic [ref=e145]: Từ
              - generic [ref=e146]: 130.000₫
              - generic [ref=e147]:
                - generic [ref=e148]: schedule
                - text: 60 phút
            - button "calendar_month Đặt lịch" [ref=e149] [cursor=pointer]:
              - generic [ref=e150]: calendar_month
              - text: Đặt lịch
      - article [ref=e151]:
        - generic [ref=e152]:
          - generic [ref=e153]: spa
          - generic [ref=e154]:
            - generic [ref=e155]: star
            - text: Tiết kiệm
          - generic [ref=e156]:
            - generic [ref=e157]: store
            - text: Chỉ tại spa
        - generic [ref=e158]:
          - heading "Combo Tắm + Cắt tỉa" [level=3] [ref=e159]
          - paragraph [ref=e160]: Combo tiết kiệm — gói đầy đủ tắm vệ sinh và cắt tỉa tạo kiểu trong cùng một buổi.
          - paragraph [ref=e161]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e162] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e163]:
            - generic [ref=e164]:
              - generic [ref=e165]: Từ
              - generic [ref=e166]: 240.000₫
              - generic [ref=e167]:
                - generic [ref=e168]: schedule
                - text: 120 phút
            - button "calendar_month Đặt lịch" [ref=e169] [cursor=pointer]:
              - generic [ref=e170]: calendar_month
              - text: Đặt lịch
      - article [ref=e171]:
        - generic [ref=e172]:
          - generic [ref=e173]: auto_awesome
          - generic [ref=e174]:
            - generic [ref=e175]: home_work
            - text: Có tận nhà
        - generic [ref=e176]:
          - heading "Combo Tắm + Cạo" [level=3] [ref=e177]
          - paragraph [ref=e178]: Cạo lông sạch và tắm sạch da trong cùng buổi — lý tưởng cho mùa hè hoặc thú cưng bị bết lông.
          - generic [ref=e179]:
            - generic [ref=e180]: home_work
            - text: "Phụ thu tận nhà:"
            - generic [ref=e181]: +100.000₫
            - text: (chưa gồm phí di chuyển)
          - paragraph [ref=e182]:
            - link "Chi tiết giá theo cân nặng — xem bảng bên dưới" [ref=e183] [cursor=pointer]:
              - /url: "#service-pricing"
          - generic [ref=e184]:
            - generic [ref=e185]:
              - generic [ref=e186]: Từ
              - generic [ref=e187]: 185.000₫
              - generic [ref=e188]:
                - generic [ref=e189]: schedule
                - text: 90 phút
            - button "calendar_month Đặt lịch" [ref=e190] [cursor=pointer]:
              - generic [ref=e191]: calendar_month
              - text: Đặt lịch
    - region "Bảng giá theo cân nặng" [ref=e192]:
      - heading "Bảng giá theo cân nặng" [level=2] [ref=e193]
      - paragraph [ref=e194]: So sánh tất cả gói theo từng hạng cân; chọn gói phù hợp rồi đặt lịch trên thẻ phía trên.
      - paragraph [ref=e195]: Vuốt ngang trên điện thoại để xem đủ các cột giá.
      - table [ref=e197]:
        - rowgroup [ref=e198]:
          - row [ref=e199]:
            - columnheader "Loài & cân nặng" [ref=e200]
            - columnheader "Tắm" [ref=e201]
            - columnheader "Cắt tỉa lông" [ref=e202]
            - columnheader "Cạo lông" [ref=e203]
            - columnheader "Combo Tắm + Vệ sinh" [ref=e204]
            - columnheader "Combo Tắm + Cắt tỉa" [ref=e205]
            - columnheader "Combo Tắm + Cạo" [ref=e206]
        - rowgroup [ref=e207]:
          - row [ref=e208]:
            - cell "Chó" [ref=e209]
          - row [ref=e210]:
            - rowheader "Chó mini < 3kg" [ref=e211]:
              - generic [ref=e212]: Chó mini
              - generic [ref=e213]: < 3kg
            - cell "88.000₫" [ref=e214]
            - cell "145.000₫" [ref=e215]
            - cell "88.000₫" [ref=e216]
            - cell "130.000₫" [ref=e217]
            - cell "240.000₫" [ref=e218]
            - cell "185.000₫" [ref=e219]
          - row [ref=e220]:
            - rowheader "Chó nhỏ 3–5kg" [ref=e221]:
              - generic [ref=e222]: Chó nhỏ
              - generic [ref=e223]: 3–5kg
            - cell "155.000₫" [ref=e224]
            - cell "165.000₫" [ref=e225]
            - cell "110.000₫" [ref=e226]
            - cell "265.000₫" [ref=e227]
            - cell "405.000₫" [ref=e228]
            - cell "350.000₫" [ref=e229]
          - row [ref=e230]:
            - rowheader "Chó vừa 5–10kg" [ref=e231]:
              - generic [ref=e232]: Chó vừa
              - generic [ref=e233]: 5–10kg
            - cell "240.000₫" [ref=e234]
            - cell "220.000₫" [ref=e235]
            - cell "165.000₫" [ref=e236]
            - cell "375.000₫" [ref=e237]
            - cell "515.000₫" [ref=e238]
            - cell "460.000₫" [ref=e239]
          - row [ref=e240]:
            - rowheader "Chó lớn 10–15kg" [ref=e241]:
              - generic [ref=e242]: Chó lớn
              - generic [ref=e243]: 10–15kg
            - cell "350.000₫" [ref=e244]
            - cell "275.000₫" [ref=e245]
            - cell "220.000₫" [ref=e246]
            - cell "460.000₫" [ref=e247]
            - cell "605.000₫" [ref=e248]
            - cell "550.000₫" [ref=e249]
          - row [ref=e250]:
            - rowheader "Chó rất lớn 15–20kg" [ref=e251]:
              - generic [ref=e252]: Chó rất lớn
              - generic [ref=e253]: 15–20kg
            - cell "460.000₫" [ref=e254]
            - cell "330.000₫" [ref=e255]
            - cell "275.000₫" [ref=e256]
            - cell "550.000₫" [ref=e257]
            - cell "660.000₫" [ref=e258]
            - cell "605.000₫" [ref=e259]
          - row [ref=e260]:
            - rowheader "Chó đại 20–25kg" [ref=e261]:
              - generic [ref=e262]: Chó đại
              - generic [ref=e263]: 20–25kg
            - cell "570.000₫" [ref=e264]
            - cell "385.000₫" [ref=e265]
            - cell "330.000₫" [ref=e266]
            - cell "640.000₫" [ref=e267]
            - cell "750.000₫" [ref=e268]
            - cell "695.000₫" [ref=e269]
          - row [ref=e270]:
            - rowheader "Chó siêu đại 25–30kg" [ref=e271]:
              - generic [ref=e272]: Chó siêu đại
              - generic [ref=e273]: 25–30kg
            - cell "660.000₫" [ref=e274]
            - cell "440.000₫" [ref=e275]
            - cell "385.000₫" [ref=e276]
            - cell "725.000₫" [ref=e277]
            - cell "835.000₫" [ref=e278]
            - cell "780.000₫" [ref=e279]
        - rowgroup [ref=e280]:
          - row [ref=e281]:
            - cell "Mèo" [ref=e282]
          - row [ref=e283]:
            - rowheader "Mèo mini ≤ 3kg" [ref=e284]:
              - generic [ref=e285]: Mèo mini
              - generic [ref=e286]: ≤ 3kg
            - cell "110.000₫" [ref=e287]
            - cell "160.000₫" [ref=e288]
            - cell "110.000₫" [ref=e289]
            - cell "155.000₫" [ref=e290]
            - cell "240.000₫" [ref=e291]
            - cell "210.000₫" [ref=e292]
          - row [ref=e293]:
            - rowheader "Mèo nhỏ 3–5kg" [ref=e294]:
              - generic [ref=e295]: Mèo nhỏ
              - generic [ref=e296]: 3–5kg
            - cell "165.000₫" [ref=e297]
            - cell "275.000₫" [ref=e298]
            - cell "165.000₫" [ref=e299]
            - cell "275.000₫" [ref=e300]
            - cell "415.000₫" [ref=e301]
            - cell "365.000₫" [ref=e302]
          - row [ref=e303]:
            - rowheader "Mèo vừa 5–10kg" [ref=e304]:
              - generic [ref=e305]: Mèo vừa
              - generic [ref=e306]: 5–10kg
            - cell "275.000₫" [ref=e307]
            - cell "370.000₫" [ref=e308]
            - cell "220.000₫" [ref=e309]
            - cell "405.000₫" [ref=e310]
            - cell "565.000₫" [ref=e311]
            - cell "495.000₫" [ref=e312]
          - row [ref=e313]:
            - rowheader "Mèo lớn 10–15kg" [ref=e314]:
              - generic [ref=e315]: Mèo lớn
              - generic [ref=e316]: 10–15kg
            - cell "385.000₫" [ref=e317]
            - cell "440.000₫" [ref=e318]
            - cell "275.000₫" [ref=e319]
            - cell "495.000₫" [ref=e320]
            - cell "665.000₫" [ref=e321]
            - cell "585.000₫" [ref=e322]
          - row [ref=e323]:
            - rowheader "Mèo rất lớn 15–20kg" [ref=e324]:
              - generic [ref=e325]: Mèo rất lớn
              - generic [ref=e326]: 15–20kg
            - cell "460.000₫" [ref=e327]
            - cell "455.000₫" [ref=e328]
            - cell "330.000₫" [ref=e329]
            - cell "550.000₫" [ref=e330]
            - cell "690.000₫" [ref=e331]
            - cell "605.000₫" [ref=e332]
          - row [ref=e333]:
            - rowheader "Mèo đại 20–25kg" [ref=e334]:
              - generic [ref=e335]: Mèo đại
              - generic [ref=e336]: 20–25kg
            - cell "570.000₫" [ref=e337]
            - cell "520.000₫" [ref=e338]
            - cell "385.000₫" [ref=e339]
            - cell "640.000₫" [ref=e340]
            - cell "795.000₫" [ref=e341]
            - cell "695.000₫" [ref=e342]
          - row [ref=e343]:
            - rowheader "Mèo siêu đại 25–30kg" [ref=e344]:
              - generic [ref=e345]: Mèo siêu đại
              - generic [ref=e346]: 25–30kg
            - cell "660.000₫" [ref=e347]
            - cell "585.000₫" [ref=e348]
            - cell "440.000₫" [ref=e349]
            - cell "725.000₫" [ref=e350]
            - cell "890.000₫" [ref=e351]
            - cell "780.000₫" [ref=e352]
  - generic [ref=e354]:
    - generic [ref=e355]:
      - generic [ref=e356]:
        - generic [ref=e357]: route
        - text: Quy trình đặt lịch
      - heading "4 bước — đặt lịch xong trong 2 phút" [level=2] [ref=e358]
    - generic [ref=e359]:
      - generic [ref=e360]:
        - generic [ref=e361]: "01"
        - generic [ref=e362]: touch_app
        - generic [ref=e364]: Chọn dịch vụ
        - paragraph [ref=e365]: Lướt 5 gói, đọc kỹ phần "bao gồm" và bảng giá theo cân.
      - generic [ref=e366]:
        - generic [ref=e367]: "02"
        - generic [ref=e368]: edit_calendar
        - generic [ref=e370]: Đặt lịch trên web
        - paragraph [ref=e371]: Chọn loài + cân nặng, ngày giờ. Mất 1-2 phút.
      - generic [ref=e372]:
        - generic [ref=e373]: "03"
        - generic [ref=e374]: home_work
        - generic [ref=e376]: Tại spa hoặc tại nhà
        - paragraph [ref=e377]: Chọn đến spa hoặc nhập địa chỉ — phụ thu hiện rõ.
      - generic [ref=e378]:
        - generic [ref=e379]: "04"
        - generic [ref=e380]: verified
        - generic [ref=e382]: Xác nhận & thanh toán
        - paragraph [ref=e383]: Tổng kết đơn, nhận tin nhắn xác nhận trong 5 phút.
  - generic [ref=e386]:
    - generic [ref=e387]:
      - generic [ref=e388]:
        - generic [ref=e389]: directions_car
        - text: Phụ thu di chuyển
      - heading "Bảng giá rõ ràng theo khoảng cách" [level=2] [ref=e390]
      - paragraph [ref=e391]: Phụ thu được tính tự động khi bạn nhập địa chỉ trong form đặt lịch — không có phí ẩn. 5km đầu miễn phí, sau đó 8.000₫/km. Ngoài phụ thu này, dịch vụ tận nhà cộng thêm phụ thu cố định riêng theo gói (xem bảng giá ở mỗi dịch vụ).
      - code [ref=e393]: Phụ thu = max(0, km − 5) × 8.000₫
    - generic [ref=e394]:
      - generic [ref=e395]:
        - generic [ref=e396]:
          - generic [ref=e397]: location_on
          - text: 0 – 5 km
        - generic [ref=e398]: Miễn phí
        - generic [ref=e399]: Khu trung tâm Q.1, Q.3, Bình Thạnh, Phú Nhuận
      - generic [ref=e400]:
        - generic [ref=e401]:
          - generic [ref=e402]: location_on
          - text: 5 – 10 km
        - generic [ref=e403]: 40.000₫ – 80.000₫
        - generic [ref=e404]: Q.7, Q.10, Tân Bình, Gò Vấp
      - generic [ref=e405]:
        - generic [ref=e406]:
          - generic [ref=e407]: location_on
          - text: 10 – 15 km
        - generic [ref=e408]: 80.000₫ – 120.000₫
        - generic [ref=e409]: Bình Chánh, Thủ Đức, Nhà Bè
      - generic [ref=e410]:
        - generic [ref=e411]:
          - generic [ref=e412]: location_on
          - text: Trên 15 km
        - generic [ref=e413]: Liên hệ
        - generic [ref=e414]: Báo giá riêng theo lộ trình
  - generic [ref=e416]:
    - generic [ref=e417]:
      - generic [ref=e418]:
        - generic [ref=e419]: reviews
        - text: Khách hàng nói gì
      - heading "Hơn 2.000 bé cưng đã được pamper" [level=2] [ref=e420]
    - generic [ref=e421]:
      - generic [ref=e422]:
        - generic [ref=e423]:
          - generic [ref=e424]: star
          - generic [ref=e425]: star
          - generic [ref=e426]: star
          - generic [ref=e427]: star
          - generic [ref=e428]: star
        - paragraph [ref=e429]: “Đặt lịch tắm tại nhà siêu tiện. Bé Bông không phải đi xe nên không stress, thợ rất nhẹ tay.”
        - generic [ref=e430]:
          - generic [ref=e431]: M
          - generic [ref=e432]:
            - generic [ref=e433]: Chị Mai
            - generic [ref=e434]: Poodle Bông 4kg · Tắm vệ sinh tại nhà
      - generic [ref=e435]:
        - generic [ref=e436]:
          - generic [ref=e437]: star
          - generic [ref=e438]: star
          - generic [ref=e439]: star
          - generic [ref=e440]: star
          - generic [ref=e441]: star
        - paragraph [ref=e442]: “Combo tắm + cạo mùa hè. Mun nóng quá nên cạo cho mát, thợ làm gọn trong 1.5 tiếng tại nhà luôn.”
        - generic [ref=e443]:
          - generic [ref=e444]: T
          - generic [ref=e445]:
            - generic [ref=e446]: Anh Tuấn
            - generic [ref=e447]: Mèo Anh lông ngắn Mun 5kg · Combo Tắm + Cạo tại nhà
      - generic [ref=e448]:
        - generic [ref=e449]:
          - generic [ref=e450]: star
          - generic [ref=e451]: star
          - generic [ref=e452]: star
          - generic [ref=e453]: star
          - generic [ref=e454]: star
        - paragraph [ref=e455]: “Form cắt chuẩn breed, chụp hình đẹp như đi show. Giá theo cân hợp lý, biết trước rõ ràng.”
        - generic [ref=e456]:
          - generic [ref=e457]: H
          - generic [ref=e458]:
            - generic [ref=e459]: Chị Hà
            - generic [ref=e460]: Golden Mochi 25kg · Combo Tắm + Cắt tỉa tại spa
  - generic [ref=e462]:
    - generic [ref=e463]:
      - generic [ref=e464]:
        - generic [ref=e465]: help
        - text: Câu hỏi thường gặp
      - heading "Mọi thứ bạn cần biết trước khi đặt lịch" [level=2] [ref=e466]
    - generic [ref=e467]:
      - generic [ref=e468]:
        - button "Vì sao giá khác nhau giữa chó và mèo? remove" [ref=e469] [cursor=pointer]:
          - generic [ref=e470]: Vì sao giá khác nhau giữa chó và mèo?
          - generic [ref=e471]: remove
        - generic [ref=e472]: Mèo và chó có loại lông, da và phản ứng với nước/máy sấy khác nhau. Mèo cần kỹ thuật giữ và sữa tắm riêng, lông mèo dễ bết. Chó được phân theo cân nặng vì lượng sữa tắm, thời gian sấy và công sức của thợ tỷ lệ thuận với kích thước.
      - button "Cân nặng được xác định thế nào? add" [ref=e474] [cursor=pointer]:
        - generic [ref=e475]: Cân nặng được xác định thế nào?
        - generic [ref=e476]: add
      - button "Dịch vụ nào có thể làm tại nhà? add" [ref=e478] [cursor=pointer]:
        - generic [ref=e479]: Dịch vụ nào có thể làm tại nhà?
        - generic [ref=e480]: add
      - button "Phụ thu tại nhà tính như thế nào? add" [ref=e482] [cursor=pointer]:
        - generic [ref=e483]: Phụ thu tại nhà tính như thế nào?
        - generic [ref=e484]: add
      - button "Tôi cần chuẩn bị gì khi thợ đến nhà? add" [ref=e486] [cursor=pointer]:
        - generic [ref=e487]: Tôi cần chuẩn bị gì khi thợ đến nhà?
        - generic [ref=e488]: add
      - button "Có thể đổi/huỷ lịch không? add" [ref=e490] [cursor=pointer]:
        - generic [ref=e491]: Có thể đổi/huỷ lịch không?
        - generic [ref=e492]: add
  - generic [ref=e494]:
    - text: pets
    - generic [ref=e495]:
      - heading "Sẵn sàng cho bé cưng một buổi spa?" [level=3] [ref=e496]
      - paragraph [ref=e497]: Đặt lịch online — chọn tại spa hoặc tận nhà. Xác nhận trong 5 phút qua Zalo.
    - generic [ref=e498]:
      - button "calendar_month Đặt lịch ngay" [ref=e499] [cursor=pointer]:
        - generic [ref=e500]: calendar_month
        - text: Đặt lịch ngay
      - link "chat_bubble Chat Zalo" [ref=e501] [cursor=pointer]:
        - /url: https://zalo.me/0325305143
        - generic [ref=e502]: chat_bubble
        - text: Chat Zalo
  - contentinfo [ref=e503]:
    - generic [ref=e504]:
      - generic [ref=e505]:
        - generic [ref=e506]: Pet NGON
        - paragraph [ref=e509]: Spa thú cưng cao cấp — chăm sóc từng bé như người nhà từ 2018. Tận tâm, tận nhà.
        - generic [ref=e510]:
          - link "Facebook" [ref=e511] [cursor=pointer]:
            - /url: https://www.facebook.com/spapetngon/
          - link "Messenger" [ref=e512] [cursor=pointer]:
            - /url: https://www.messenger.com/t/spapetngon/
          - link "Instagram" [ref=e513] [cursor=pointer]:
            - /url: https://www.instagram.com/petngon/
          - link "TikTok" [ref=e514] [cursor=pointer]:
            - /url: https://www.tiktok.com/@petngonspa
      - generic [ref=e515]:
        - heading "Dịch vụ" [level=5] [ref=e516]
        - generic [ref=e517] [cursor=pointer]: Tắm & Combo Tắm + Vệ sinh
        - generic [ref=e518] [cursor=pointer]: Cắt tỉa lông
        - generic [ref=e519] [cursor=pointer]: Cạo lông
        - generic [ref=e520] [cursor=pointer]: Combo trọn gói
      - generic [ref=e521]:
        - heading "Hỗ trợ" [level=5] [ref=e522]
        - generic [ref=e523] [cursor=pointer]: Câu hỏi thường gặp
        - generic [ref=e524] [cursor=pointer]: Bảng giá phụ thu
        - generic [ref=e525] [cursor=pointer]: Đổi/huỷ lịch
        - generic [ref=e526] [cursor=pointer]: Blog chăm sóc
      - generic [ref=e527]:
        - heading "Liên hệ" [level=5] [ref=e528]
        - paragraph [ref=e529]:
          - generic [ref=e530]: location_on
          - text: 1.09 block A1, chung cư Westgate, Tân Nhựt, Bình Chánh, TP Hồ Chí Minh
        - paragraph [ref=e531]:
          - link "call (+84) 325 305 143" [ref=e532] [cursor=pointer]:
            - /url: tel:+84325305143
            - generic [ref=e533]: call
            - text: (+84) 325 305 143
        - paragraph [ref=e534]:
          - link "mail hello@petngon.vn" [ref=e535] [cursor=pointer]:
            - /url: mailto:hello@petngon.vn
            - generic [ref=e536]: mail
            - text: hello@petngon.vn
    - generic [ref=e537]:
      - generic [ref=e538]: © 2026 Pet NGON. All rights reserved.
      - generic [ref=e539]:
        - text: Made with
        - generic [ref=e540]: favorite
        - text: in HCMC
  - alert [ref=e541]
```

# Test source

```ts
  1   | ﻿import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | /**
  4   |  * T1 Pet NGON — M1 (hiển thị di động), M3 (bảng giá theo bậc cân nặng),
  5   |  * M6 (phụ thu di chuyển và phụ thu tại nhà).
  6   |  *
  7   |  * Ranh giới ADR-11: chỉ đọc bảng giá và điền form wizard tới bước 4, **không bấm
  8   |  * "Xác nhận đặt lịch"** nên không tạo lịch hẹn thật.
  9   |  */
  10  | 
  11  | /** Bảng giá tĩnh của T1 — 6 dịch vụ × 7 bậc × Chó/Mèo. */
  12  | async function docGiaBangGia(page: Page) {
  13  |   await page.goto('/vi', { waitUntil: 'load' });
  14  |   await page.waitForTimeout(2000);
  15  |   const table = page.locator('table').first();
  16  |   await table.waitFor({ state: 'visible', timeout: 30_000 });
  17  |   return table;
  18  | }
  19  | 
  20  | /** Mở wizard đặt lịch và đi tới bước 4 (Địa điểm) — không gửi form. */
  21  | async function toiBuocDiaDiem(page: Page, dichVu: string, loai: string, bac: string) {
  22  |   await page.goto('/vi', { waitUntil: 'load' });
  23  |   await page.waitForTimeout(1500);
  24  | 
  25  |   await page.getByRole('button', { name: /Đặt lịch ngay/i }).first().click();
  26  |   const overlay = page.locator('.bk-overlay');
  27  |   await overlay.waitFor({ state: 'visible', timeout: 30_000 });
  28  |   const next = () => overlay.locator('button').filter({ hasText: 'Tiếp tục' });
  29  | 
  30  |   await overlay.locator('.bk-svc').filter({ hasText: dichVu }).first().click();
  31  |   await page.waitForTimeout(500);
  32  |   await overlay.locator('.bk-pet').filter({ hasText: loai }).first().click();
  33  |   await page.waitForTimeout(1000);
  34  |   await next().click();
  35  |   await page.waitForTimeout(1500);
  36  | 
  37  |   await overlay.locator('.bk-pet').filter({ hasText: bac }).first().click();
  38  |   await page.waitForTimeout(800);
  39  |   await overlay.locator('.bk-input').first().fill('Bé Kiểm Thử');
  40  |   await page.waitForTimeout(600);
  41  |   await next().click();
  42  |   await page.waitForTimeout(1500);
  43  | 
  44  |   await overlay.locator('button').filter({ hasText: /\d{2}\/\d{2}/ }).first().click();
  45  |   await page.waitForTimeout(600);
  46  |   await overlay.locator('button').filter({ hasText: /^\d{2}:\d{2}$/ }).first().click();
  47  |   await page.waitForTimeout(800);
  48  |   await next().click();
  49  |   await page.waitForTimeout(1800);
  50  | 
  51  |   return overlay;
  52  | }
  53  | 
  54  | test.describe('T1 Pet NGON — M1 Hiển thị trên màn hình di động', () => {
  55  |   test('TC-T1-M1-005: trang chủ không cuộn ngang ở màn hình 360px', async ({ page }) => {
  56  |     await page.setViewportSize({ width: 360, height: 740 });
  57  |     await page.goto('/vi', { waitUntil: 'load' });
  58  |     await page.waitForTimeout(2500);
  59  | 
  60  |     const overflow = await page.evaluate(() => ({
  61  |       scrollWidth: document.documentElement.scrollWidth,
  62  |       clientWidth: document.documentElement.clientWidth,
  63  |     }));
  64  | 
  65  |     // Trang không được tràn ngang ở 360px.
  66  |     expect(
  67  |       overflow.scrollWidth,
  68  |       `scrollWidth=${overflow.scrollWidth} > clientWidth=${overflow.clientWidth}`,
> 69  |     ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      |       ^ Error: scrollWidth=379 > clientWidth=360
  70  |   });
  71  | });
  72  | 
  73  | test.describe('T1 Pet NGON — M3 Bảng giá theo bậc cân nặng', () => {
  74  |   // BVA theo ngưỡng của BR-01. T1 chọn BẬC (vùng) chứ không nhập số kg,
  75  |   // nên biên BVA là biên của vùng cân nặng trên bảng giá.
  76  |   const BAN_CAN_NANG = [
  77  |     { tc: '008', band: '3–5kg', moTa: 'ngưỡng 3kg' },
  78  |     { tc: '009', band: '3–5kg', moTa: 'ngưỡng 3kg + 0.1kg' },
  79  |     { tc: '010', band: '5–10kg', moTa: 'ngưỡng 5kg' },
  80  |     { tc: '011', band: '5–10kg', moTa: 'ngưỡng 5kg + 0.1kg' },
  81  |     { tc: '012', band: '5–10kg', moTa: 'ngưỡng 10kg − 0.1kg' },
  82  |     { tc: '013', band: '10–15kg', moTa: 'ngưỡng 10kg' },
  83  |     { tc: '014', band: '10–15kg', moTa: 'ngưỡng 10kg + 0.1kg' },
  84  |   ] as const;
  85  | 
  86  |   for (const bc of BAN_CAN_NANG) {
  87  |     test(`TC-T1-M3-${bc.tc}: BVA ngưỡng ${bc.moTa} thuộc bậc ${bc.band}`, async ({ page }) => {
  88  |       const table = await docGiaBangGia(page);
  89  |       const text = await table.innerText();
  90  | 
  91  |       // Bậc cân nặng phải xuất hiện trong bảng giá.
  92  |       expect(text).toContain(bc.band);
  93  |     });
  94  |   }
  95  | });
  96  | 
  97  | test.describe('T1 Pet NGON — M6 Phụ thu di chuyển và phụ thu tại nhà', () => {
  98  |   test('TC-T1-M6-008: DT phụ thu di chuyển: 10 km thu 40.000₫', async ({ page }) => {
  99  |     await page.goto('/vi', { waitUntil: 'load' });
  100 |     await page.waitForTimeout(2000);
  101 | 
  102 |     const body = await page.locator('body').innerText();
  103 |     // Dải 5–10 km công bố mức phụ thu 40.000₫–80.000₫ (BR-05).
  104 |     expect(body).toMatch(/5\s*–\s*10 km[\s\S]{0,120}?40\.000₫\s*–\s*80\.000₫/);
  105 |   });
  106 | 
  107 |   test('TC-T1-M6-009: DT phụ thu di chuyển: 15 km thu 80.000₫', async ({ page }) => {
  108 |     await page.goto('/vi', { waitUntil: 'load' });
  109 |     await page.waitForTimeout(2000);
  110 | 
  111 |     const body = await page.locator('body').innerText();
  112 |     // Dải 10–15 km công bố mức phụ thu 80.000₫–120.000₫ (BR-05).
  113 |     expect(body).toMatch(/10\s*–\s*15 km[\s\S]{0,120}?80\.000₫\s*–\s*120\.000₫/);
  114 |   });
  115 | 
  116 |   test('TC-T1-M6-010: DT phụ thu di chuyển: 20 km hiển thị Liên hệ báo giá riêng thay vì con số', async ({
  117 |     page,
  118 |   }) => {
  119 |     await page.goto('/vi', { waitUntil: 'load' });
  120 |     await page.waitForTimeout(2000);
  121 | 
  122 |     const body = await page.locator('body').innerText();
  123 |     // Dải trên 15 km không hiện con số cố định (FR-M6-06).
  124 |     expect(body).toMatch(/Trên 15 km[\s\S]{0,160}?Liên hệ[\s\S]{0,80}?Báo giá riêng theo lộ trình/);
  125 |     // Không được gắn con số cố định vào dải trên 15 km.
  126 |     expect(body).not.toMatch(/Trên 15 km[\s\S]{0,60}?\d{1,3}\.\d{3}₫/);
  127 |   });
  128 | 
  129 |   test('TC-T1-M6-011: gói tắm tại nhà cộng phụ thu cố định 50.000₫', async ({ page }) => {
  130 |     await page.goto('/vi', { waitUntil: 'load' });
  131 |     await page.waitForTimeout(2000);
  132 | 
  133 |     // Mỗi gói dịch vụ công bố phụ thu tại nhà trong `.hm-svc__home-note`.
  134 |     const ghiChu = page.locator('.hm-svc__home-note');
  135 |     const giaTam = ghiChu.locator('xpath=preceding-sibling::*[1]').filter({ hasText: 'Tắm' });
  136 |     void giaTam;
  137 | 
  138 |     const theTam = page.locator('.hm-svc').filter({ hasText: 'Tắm' }).first();
  139 |     await theTam.scrollIntoViewIfNeeded();
  140 |     const text = await theTam.innerText();
  141 |     expect(text).toMatch(/\+50\.000₫/);
  142 |     // Phụ thu cố định không bao gồm phí di chuyển (FR-M6-04).
  143 |     expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  144 |   });
  145 | 
  146 |   test('TC-T1-M6-012: gói cạo tại nhà cộng phụ thu cố định 80.000₫', async ({ page }) => {
  147 |     await page.goto('/vi', { waitUntil: 'load' });
  148 |     await page.waitForTimeout(2000);
  149 | 
  150 |     const theCao = page.locator('.hm-svc').filter({ hasText: 'Cạo lông' }).first();
  151 |     await theCao.scrollIntoViewIfNeeded();
  152 |     const text = await theCao.innerText();
  153 |     expect(text).toMatch(/\+80\.000₫/);
  154 |     expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  155 |   });
  156 | 
  157 |   test('TC-T1-M6-013: combo tắm cạo tại nhà cộng phụ thu cố định 100.000₫', async ({ page }) => {
  158 |     await page.goto('/vi', { waitUntil: 'load' });
  159 |     await page.waitForTimeout(2000);
  160 | 
  161 |     const theCombo = page.locator('.hm-svc').filter({ hasText: 'Combo Tắm + Cạo' }).first();
  162 |     await theCombo.scrollIntoViewIfNeeded();
  163 |     const text = await theCombo.innerText();
  164 |     expect(text).toMatch(/\+100\.000₫/);
  165 |     expect(text).toMatch(/\(chưa gồm phí di chuyển\)/);
  166 |   });
  167 | 
  168 |   test('TC-T1-M6-014: tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển', async ({ page }) => {
  169 |     // Wizard T1: Chó nhỏ (3–5kg) + Tắm = 155.000₫; chọn "Tận nhà" → +50.000₫.
```