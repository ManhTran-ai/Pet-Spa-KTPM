
---

**Bản làm việc** · Phiên bản 0.1 (Ngày 1) · Ngày 2026-11-13 · Người lập: Mạnh (TV1)

Nguồn: `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v0.1). Bản làm việc này được chỉnh sửa theo change control; mọi thay đổi yêu cầu phải kèm CR trong `docs/change-requests.md` và cập nhật RTM cùng commit.
# Đặc tả Yêu cầu Phần mềm (SRS)

## Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

| Phiên bản | Ngày | Tác giả | Thay đổi |
| --- | --- | --- | --- |
| 0.1 | Ngày 1–2 | Cả nhóm | Khung và bản nháp yêu cầu |
| 1.0 | Ngày 3 | Mạnh | Baseline sau Inspection |

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu mô tả yêu cầu chức năng, phi chức năng, quy tắc nghiệp vụ và ràng buộc dữ liệu của hệ thống. Đây là căn cứ (test basis) để thiết kế test case, truy vết bằng RTM, và kiểm thử hệ thống/chấp nhận theo mô hình chữ V.

### 1.2 Phạm vi

Hệ thống web cho phép chủ thú cưng đăng ký tài khoản, quản lý hồ sơ thú cưng, xem dịch vụ và giá, đặt/hủy/đổi lịch tại cơ sở spa, đặt cọc và nhận hóa đơn. Nhân viên xử lý lịch hẹn; quản trị viên quản lý dịch vụ, nhân viên, khuyến mãi và báo cáo.

**Ngoài phạm vi:** cổng thanh toán thật, ứng dụng di động native, chat trực tuyến, quản lý kho vật tư, nhiều chi nhánh, đa ngôn ngữ.

### 1.3 Định nghĩa và viết tắt

| Thuật ngữ | Giải thích |
| --- | --- |
| KH / NV / AD | Khách hàng / Nhân viên (groomer, lễ tân) / Quản trị viên |
| Lịch hẹn | Một lượt đặt gồm 1 thú cưng, 1–5 dịch vụ nối tiếp, 1 nhân viên, 1 thời điểm bắt đầu |
| Slot | Khung thời gian 30 phút |
| Cọc | Khoản đặt trước khi đặt lịch (BR-11) |
| VIP | Khách hàng thành viên được giảm giá (BR-10) |
| RBAC | Phân quyền theo vai trò |
| FR / NFR / BR / UC | Yêu cầu chức năng / phi chức năng / quy tắc nghiệp vụ / use case |
| RTM | Ma trận truy xuất yêu cầu – test case |

### 1.4 Tài liệu tham chiếu

- Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm (tài liệu của nhóm)
- ISTQB CTFL; IEEE 830
- Kế hoạch đồ án 14 ngày, Test Plan (TP-01), RTM (RTM-01)

### 1.5 Cấu trúc tài liệu

Mục 2 tổng quan; mục 3 giao diện ngoài; mục 4 use case; mục 5 yêu cầu chức năng; mục 6 quy tắc nghiệp vụ; mục 7 ràng buộc dữ liệu; mục 8 vòng đời lịch hẹn; mục 9 yêu cầu phi chức năng; mục 10 phụ lục.

## 2. Mô tả tổng quan

### 2.1 Bối cảnh sản phẩm

Hệ thống độc lập theo kiến trúc client–server (web React, REST API, cơ sở dữ liệu quan hệ). Hệ thống tương tác với hai thành phần ngoài được giả lập: cổng thanh toán (trả về thành công, thất bại hoặc timeout) và dịch vụ thông báo (ghi log thay cho email thật).

### 2.2 Các module

| Mã | Module | Phụ trách code | Mức |
| --- | --- | --- | --- |
| M1 | Tài khoản và phân quyền | Mạnh | Must |
| M2 | Hồ sơ thú cưng | Tài | Must |
| M3 | Danh mục dịch vụ và bảng giá | Tài | Must |
| M4 | Đặt lịch | Ngân | Must |
| M5 | Vòng đời lịch hẹn | Ngân | Must |
| M6 | Tính giá, khuyến mãi, thanh toán, thông báo | Lộc | Should (FR-M6-01 đề xuất Must) |
| M7 | Quản trị | Mạnh | Should / Could |

### 2.3 Người dùng và quyền

| Vai trò | Mô tả | Quyền chính |
| --- | --- | --- |
| Khách vãng lai | Chưa đăng nhập | Xem danh mục dịch vụ, đăng ký, đăng nhập |
| Khách hàng (KH) | Chủ thú cưng | Quản lý thú cưng của mình, đặt/hủy/đổi lịch, thanh toán cọc, xem lịch sử |
| Nhân viên (NV) | Groomer, lễ tân | Xem lịch làm việc của mình, xác nhận lịch, bắt đầu và hoàn thành dịch vụ |
| Quản trị viên (AD) | Chủ/quản lý spa | Quyền của NV, cộng quản lý dịch vụ, nhân viên, khuyến mãi, báo cáo, điều chỉnh mọi lịch |

### 2.4 Môi trường vận hành

Trình duyệt Chrome, Firefox, Edge bản mới nhất; điện thoại Android/iOS. Công nghệ gợi ý: React, Node/Express, MySQL hoặc PostgreSQL **\[Cần chốt\]**.

### 2.5 Ràng buộc

Thời gian 14 ngày, 4 thành viên; không dùng thanh toán và email thật; dữ liệu là dữ liệu mẫu.

### 2.6 Giả định và phụ thuộc

- Hệ thống phải cho phép giả lập đồng hồ (mock clock) để kiểm thử các mốc 2 giờ, 12 giờ, 24 giờ, 30 phút.
- Một lịch hẹn có đúng một thú cưng, một nhân viên và 1–5 dịch vụ nối tiếp nhau.
- Giao diện quản trị (M7) dùng lại API dịch vụ của M3.

## 3. Yêu cầu giao diện ngoài

### 3.1 Giao diện người dùng

Các màn hình chính: Đăng ký/Đăng nhập; Hồ sơ thú cưng; Danh mục dịch vụ và bảng giá; Đặt lịch (chọn dịch vụ, ngày giờ, nhân viên); Lịch của tôi; Lịch làm việc của nhân viên; Thanh toán và hóa đơn; Quản trị. Giao diện responsive từ chiều rộng 360px; thông báo lỗi nêu rõ trường sai và cách sửa. Wireframe nằm trong SDD.

### 3.2 Giao diện phần mềm

REST API định dạng JSON, đặc tả bằng OpenAPI (SDD). Xác thực bằng JWT (Bearer). Mã lỗi thống nhất: 400 dữ liệu sai định dạng, 401 chưa xác thực, 403 không đủ quyền, 404 không tìm thấy, 409 xung đột (trùng lịch, chuyển trạng thái sai), 422 vi phạm quy tắc nghiệp vụ.

### 3.3 Giao diện hệ thống ngoài (giả lập)

- Cổng thanh toán: nhận số tiền và mã lịch; trả về success, failed hoặc timeout theo kịch bản test.
- Dịch vụ thông báo: ghi nội dung thông báo vào log; có thể đọc lại để kiểm thử.

## 4. Use case

| Mã | Use case | Actor | FR liên quan |
| --- | --- | --- | --- |
| UC-01 | Đăng ký, đăng nhập, quản lý phiên | KH, NV, AD | FR-M1-01…06 |
| UC-02 | Quản lý thú cưng | KH | FR-M2-01…05 |
| UC-03 | Xem dịch vụ và bảng giá | Khách vãng lai, KH | FR-M3-01, 02, 04 |
| UC-04 | Đặt lịch | KH | FR-M4-01…06, FR-M6-01…04 |
| UC-05 | Xem, hủy, đổi lịch hẹn | KH | FR-M4-07, FR-M5-04, 05, 07 |
| UC-06 | Xử lý lịch hẹn | NV, AD | FR-M4-08, FR-M5-01, 02, 03, 06, FR-M6-06 |
| UC-07 | Thanh toán và hóa đơn | KH | FR-M6-02…05 |
| UC-08 | Quản trị hệ thống | AD | FR-M3-03, FR-M7-01…04 |

### Mẫu đặc tả: UC-04 Đặt lịch

Cả nhóm viết các use case còn lại theo cùng mẫu này.

- **Actor:** KH. **Tiền điều kiện:** KH đã đăng nhập và có ít nhất 1 thú cưng.
- **Luồng chính:** (1) KH chọn thú cưng. (2) KH chọn 1–5 dịch vụ. (3) Hệ thống tính giá (FR-M6-01) và hiển thị slot trống (FR-M4-02). (4) KH chọn ngày giờ và, nếu muốn, nhân viên. (5) KH nhập mã khuyến mãi (tùy chọn). (6) Hệ thống tạm giữ slot 10 phút (BR-17) và tính tiền cọc. (7) KH thanh toán cọc qua cổng giả lập. (8) Hệ thống tạo lịch ở trạng thái Pending và gửi thông báo.
- **Luồng rẽ nhánh:** A1 hết slot hoặc nhân viên bận: báo lỗi 409, quay lại bước 4. A2 mã khuyến mãi không hợp lệ: báo lý do, tiếp tục không áp mã. A3 thanh toán thất bại hoặc timeout: không tạo lịch, giải phóng slot. A4 KH hủy giữa chừng: giải phóng slot. A5 hai KH cùng chọn một slot: chỉ một người giữ được slot.
- **Hậu điều kiện:** lịch ở trạng thái Pending; slot của nhân viên được giữ.

## 5. Yêu cầu chức năng

Ưu tiên: Must (bắt buộc), Should (nên có), Could (có thể bỏ khi thiếu thời gian). Ràng buộc dữ liệu tham chiếu mục 7; quy tắc nghiệp vụ tham chiếu mục 6.

### 5.1 M1 – Tài khoản và phân quyền

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M1-01 | KH đăng ký tài khoản với họ tên, email, SĐT, mật khẩu | Must | Dữ liệu hợp lệ thì tạo được tài khoản; email đã tồn tại trả 409; mật khẩu lưu dạng băm |
| FR-M1-02 | Đăng nhập bằng email và mật khẩu | Must | Đúng thông tin thì nhận JWT hết hạn sau 60 phút; sai thì báo lỗi chung, không lộ email có tồn tại hay không |
| FR-M1-03 | Đăng xuất và hết hạn phiên | Must | Sau đăng xuất hoặc khi token hết hạn, API bảo vệ trả 401 |
| FR-M1-04 | Đổi mật khẩu và quên mật khẩu (liên kết đặt lại giả lập) | Should | Mật khẩu mới theo BR-13; mật khẩu cũ sai bị từ chối; liên kết hết hạn sau 15 phút |
| FR-M1-05 | Phân quyền theo vai trò KH/NV/AD | Must | Chức năng ngoài quyền trả 403; KH không xem được thú cưng và lịch của KH khác |
| FR-M1-06 | Khóa tạm tài khoản khi đăng nhập sai liên tiếp | Should | Sai 5 lần liên tiếp thì khóa 15 phút (BR-16); trong thời gian khóa, đăng nhập đúng vẫn bị từ chối |

### 5.2 M2 – Hồ sơ thú cưng

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M2-01 | KH thêm thú cưng: tên, loài, giống, giới tính, tuổi, cân nặng, loại lông, ghi chú sức khỏe | Must | Lưu thành công khi hợp lệ; thiếu trường bắt buộc hoặc ngoài miền thì báo lỗi theo từng trường |
| FR-M2-02 | KH xem danh sách và chi tiết thú cưng của mình | Must | Chỉ thấy thú cưng của chính mình; danh sách trống có thông báo phù hợp |
| FR-M2-03 | KH sửa thông tin thú cưng | Must | Áp dụng cùng ràng buộc như khi thêm; đổi cân nặng không làm đổi giá của lịch đã tạo |
| FR-M2-04 | KH xóa thú cưng | Must | Xóa được khi thỏa BR-15; ngược lại từ chối kèm lý do |
| FR-M2-05 | Giới hạn số thú cưng mỗi tài khoản | Should | Thêm thú cưng thứ 6 bị từ chối (BR-05) |

### 5.3 M3 – Danh mục dịch vụ và bảng giá

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M3-01 | Xem danh mục dịch vụ (tên, mô tả, thời lượng, giá) | Must | Chỉ hiển thị dịch vụ đang bật, sắp theo tên |
| FR-M3-02 | Bảng giá theo nhóm cân nặng và loài | Must | Giá đúng nhóm theo BR-08; cân nặng đúng biên 5, 15, 30 kg xếp đúng nhóm |
| FR-M3-03 | AD thêm, sửa, ẩn dịch vụ (API ở M3, giao diện ở M7) | Must | Dịch vụ ẩn không đặt mới được, lịch cũ không bị ảnh hưởng; giá và thời lượng ngoài miền bị từ chối |
| FR-M3-04 | Tìm kiếm, lọc dịch vụ theo loài và tên | Could | Kết quả đúng, không phân biệt hoa thường |

### 5.4 M4 – Đặt lịch

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M4-01 | KH chọn thú cưng, 1–5 dịch vụ, ngày giờ, nhân viên (tùy chọn) để đặt lịch | Must | Thiếu thú cưng hoặc dịch vụ thì không đi tiếp; sau cọc thành công, lịch ở trạng thái Pending |
| FR-M4-02 | Hiển thị slot trống theo giờ làm và tổng thời lượng | Must | Chỉ hiển thị chuỗi slot liên tục đủ thời lượng; không hiển thị slot trong quá khứ hoặc trong vòng 2 giờ tới |
| FR-M4-03 | Chặn đặt trùng, chồng lịch của cùng nhân viên | Must | Chồng dù một slot thì trả 409; lịch liền kề (kết thúc đúng lúc bắt đầu) được phép |
| FR-M4-04 | Giới hạn thời điểm đặt trước | Must | Cho phép từ đúng 2 giờ đến đúng 30 ngày; 1 giờ 59 phút hoặc quá 30 ngày bị từ chối (BR-03) |
| FR-M4-05 | Chống đặt trùng khi nhiều KH cùng chọn một slot | Must | Hai yêu cầu đồng thời cho cùng slot và nhân viên: đúng một yêu cầu giữ được slot, yêu cầu kia nhận 409 |
| FR-M4-06 | Tự gán nhân viên rảnh khi KH không chọn | Should | Gán nhân viên rảnh có ít lịch nhất trong ngày; không còn ai rảnh thì báo hết chỗ **\[Cần chốt\]** |
| FR-M4-07 | KH xem lịch sử và chi tiết lịch hẹn | Should | Hiển thị đúng trạng thái, dịch vụ, tổng tiền; chỉ lịch của chính KH |
| FR-M4-08 | NV xem lịch làm việc theo ngày, tuần | Should | Chỉ lịch được gán cho NV đó, sắp theo giờ |

### 5.5 M5 – Vòng đời lịch hẹn

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M5-01 | Quản lý trạng thái lịch hẹn | Must | Chỉ cho phép các chuyển trạng thái ở bảng 8.1; ghi lại thời điểm và người thực hiện |
| FR-M5-02 | NV, AD xác nhận lịch Pending | Must | Chỉ NV được gán hoặc AD xác nhận được; xác nhận xong KH nhận thông báo |
| FR-M5-03 | NV bắt đầu và hoàn thành dịch vụ | Must | Bắt đầu chỉ khi Confirmed; hoàn thành chỉ khi In-Progress |
| FR-M5-04 | KH hủy lịch theo chính sách hủy | Must | Kết quả hoàn hoặc giữ cọc đúng bảng quyết định 8.2 |
| FR-M5-05 | KH đổi lịch | Should | Tối đa 2 lần, trước giờ hẹn ít nhất 12 giờ; lịch mới phải hợp lệ theo BR-01…04 (BR-07) |
| FR-M5-06 | Tự động chuyển No-show | Should | Quá 30 phút sau giờ hẹn mà lịch còn Confirmed thì thành No-show; lịch In-Progress không bị đổi |
| FR-M5-07 | Từ chối chuyển trạng thái không hợp lệ | Must | Ví dụ Completed sang Cancelled, Cancelled sang Confirmed: trả 409, trạng thái giữ nguyên |

### 5.6 M6 – Tính giá, khuyến mãi, thanh toán, thông báo

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M6-01 | Tính giá theo nhóm cân nặng, phụ phí lông dài, cộng nhiều dịch vụ | Must | Kết quả đúng công thức BR-18, làm tròn đến đồng |
| FR-M6-02 | Áp mã khuyến mãi | Should | Mã sai, hết hạn hoặc đơn chưa đạt giá trị tối thiểu bị từ chối kèm lý do; tối đa 1 mã mỗi lịch |
| FR-M6-03 | Giảm giá thành viên VIP | Should | VIP giảm 10%; không cộng dồn với mã khuyến mãi (BR-10) |
| FR-M6-04 | Đặt cọc và thanh toán qua cổng giả lập | Should | Thành công thì tạo lịch; thất bại hoặc timeout thì không tạo lịch và giải phóng slot; bấm thanh toán lặp không trừ tiền hai lần |
| FR-M6-05 | Xuất hóa đơn | Should | Hóa đơn nêu dịch vụ, phụ phí, giảm giá, cọc, số còn lại; tổng khớp FR-M6-01 |
| FR-M6-06 | Nhắc lịch và thông báo | Could | Nhắc trước 24 giờ; thông báo khi xác nhận, hủy, đổi lịch (ghi log) |

### 5.7 M7 – Quản trị

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M7-01 | AD quản lý nhân viên: thêm, sửa, khóa, giờ làm, ngày nghỉ | Should | Nhân viên bị khóa hoặc nghỉ không xuất hiện ở slot; lịch đã có được cảnh báo |
| FR-M7-02 | AD quản lý mã khuyến mãi | Should | Tạo, sửa, tắt mã với hạn dùng và giá trị tối thiểu; mã đã tắt không áp được |
| FR-M7-03 | Báo cáo số lịch theo ngày, tuần, dịch vụ và doanh thu | Could | Số liệu khớp các lịch Completed; lọc được theo khoảng ngày |
| FR-M7-04 | AD xem và điều chỉnh mọi lịch hẹn | Could | Hủy hoặc đổi lịch theo quyền; ghi nhật ký thao tác |

## 6. Quy tắc nghiệp vụ

Các giá trị đánh dấu **\[Cần chốt\]** là giả định của nhóm; thay đổi giá trị thì phải cập nhật test case liên quan (RTM giúp tìm ra chúng).

| ID | Quy tắc | FR liên quan |
| --- | --- | --- |
| BR-01 | Giờ làm việc 08:00–18:00 mỗi ngày; AD cấu hình ngày nghỉ **\[Cần chốt\]** | FR-M4-02, FR-M7-01 |
| BR-02 | Slot 30 phút; thời lượng dịch vụ là bội của 30 phút, từ 30 đến 240 phút | FR-M4-02, FR-M3-03 |
| BR-03 | Đặt trước tối thiểu 2 giờ, tối đa 30 ngày so với thời điểm hiện tại | FR-M4-04 |
| BR-04 | Một nhân viên không có hai lịch chồng thời gian; giờ kết thúc bằng giờ bắt đầu cộng tổng thời lượng dịch vụ | FR-M4-03 |
| BR-05 | Mỗi KH có tối đa 5 thú cưng và tối đa 3 lịch ở trạng thái Pending hoặc Confirmed cùng lúc | FR-M2-05, FR-M4-01 |
| BR-06 | Chính sách hủy theo bảng quyết định mục 8.2 | FR-M5-04 |
| BR-07 | Đổi lịch tối đa 2 lần mỗi lịch, thực hiện trước giờ hẹn ít nhất 12 giờ; lịch mới phải thỏa BR-01 đến BR-04 | FR-M5-05 |
| BR-08 | Nhóm cân nặng: S từ 0.5 đến dưới 5 kg; M từ 5 đến dưới 15 kg; L từ 15 đến dưới 30 kg; XL từ 30 đến 50 kg. Giá dịch vụ định theo nhóm và loài | FR-M3-02, FR-M6-01 |
| BR-09 | Thú cưng lông dài hoặc lông dày chịu phụ phí 15% giá dịch vụ **\[Cần chốt\]** | FR-M6-01 |
| BR-10 | Mỗi lịch dùng tối đa 1 mã khuyến mãi; mã phải còn hạn và đơn đạt giá trị tối thiểu. VIP giảm 10%. Giảm VIP và mã khuyến mãi không cộng dồn: áp mức giảm lớn hơn **\[Cần chốt\]** | FR-M6-02, FR-M6-03 |
| BR-11 | Cọc bằng 30% thành tiền, thanh toán qua cổng giả lập khi đặt lịch; phần còn lại thanh toán sau khi hoàn thành **\[Cần chốt\]** | FR-M6-04 |
| BR-12 | Quá 30 phút sau giờ hẹn mà lịch chưa bắt đầu thì thành No-show và không hoàn cọc | FR-M5-06 |
| BR-13 | Mật khẩu dài 8–32 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 chữ số | FR-M1-01, FR-M1-04 |
| BR-14 | Gửi nhắc lịch trước 24 giờ; gửi thông báo khi lịch được xác nhận, hủy hoặc đổi | FR-M6-06 |
| BR-15 | Chỉ xóa được thú cưng khi không có lịch ở trạng thái Pending, Confirmed hoặc In-Progress | FR-M2-04 |
| BR-16 | Đăng nhập sai 5 lần liên tiếp thì khóa tài khoản 15 phút | FR-M1-06 |
| BR-17 | Slot được tạm giữ 10 phút từ lúc KH bấm đặt lịch đến khi thanh toán xong; hết hạn mà chưa thanh toán thì giải phóng | FR-M4-05, FR-M6-04 |
| BR-18 | Công thức giá: tổng dịch vụ = tổng (giá theo nhóm cân nặng × (1 + 15% nếu lông dài)); giảm = mức lớn hơn giữa giảm VIP và giảm mã; thành tiền = tổng dịch vụ trừ giảm, làm tròn đến đồng | FR-M6-01 |

## 7. Ràng buộc dữ liệu

Bảng này là đầu vào trực tiếp cho kỹ thuật phân vùng tương đương và phân tích giá trị biên (BVA 3 giá trị: min−1, min, min+1, max−1, max, max+1).

| Trường | Kiểu | Bắt buộc | Min | Max | Định dạng, ghi chú |
| --- | --- | --- | --- | --- | --- |
| Họ tên | Chuỗi | Có | 2 ký tự | 50 ký tự | Chữ và khoảng trắng |
| Email | Chuỗi | Có | 6 ký tự | 254 ký tự | Đúng định dạng email, duy nhất |
| Số điện thoại | Chuỗi số | Có | 10 chữ số | 10 chữ số | Bắt đầu bằng 0 |
| Mật khẩu | Chuỗi | Có | 8 ký tự | 32 ký tự | Theo BR-13 |
| Tên thú cưng | Chuỗi | Có | 1 ký tự | 30 ký tự |  |
| Loài | Liệt kê | Có |  |  | Chó hoặc Mèo |
| Giống | Chuỗi | Có | 1 ký tự | 50 ký tự |  |
| Tuổi | Số nguyên (tháng) | Có | 1 | 240 |  |
| Cân nặng | Số thập phân, bước 0.1 | Có | 0.5 kg | 50 kg | Biên dùng cho BR-08 |
| Loại lông | Liệt kê | Có |  |  | Ngắn hoặc Dài |
| Ghi chú sức khỏe | Chuỗi | Không | 0 | 500 ký tự |  |
| Số dịch vụ mỗi lịch | Số nguyên | Có | 1 | 5 |  |
| Thời lượng dịch vụ | Số nguyên (phút) | Có | 30 | 240 | Bội của 30 |
| Giá dịch vụ | Số nguyên (VND) | Có | 10.000 | 5.000.000 |  |
| Mã khuyến mãi | Chuỗi | Có | 4 ký tự | 20 ký tự | Chữ in hoa và số |
| Mức giảm của mã | Phần trăm | Có | 1% | 50% |  |
| Thời điểm đặt lịch | Ngày giờ | Có | Hiện tại + 2 giờ | Hiện tại + 30 ngày | Bội của 30 phút, trong giờ làm |

## 8. Vòng đời lịch hẹn

### 8.1 Bảng chuyển trạng thái

✗ là chuyển không hợp lệ và phải bị từ chối với mã 409 (FR-M5-07). Completed, Cancelled, No-show là trạng thái cuối.

| Trạng thái hiện tại | Xác nhận | Bắt đầu | Hoàn thành | Hủy | Quá 30 phút không đến | Đổi lịch |
| --- | --- | --- | --- | --- | --- | --- |
| Pending | Confirmed | ✗ | ✗ | Cancelled | ✗ | Pending |
| Confirmed | ✗ | In-Progress | ✗ | Cancelled | No-show | Confirmed |
| In-Progress | ✗ | ✗ | Completed | ✗ | ✗ | ✗ |
| Completed | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Cancelled | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| No-show | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

Sơ đồ trạng thái (State Transition Diagram) do Ngân vẽ trong SDD, khớp với bảng này.

### 8.2 Bảng quyết định hủy lịch

|  | R1 | R2 | R3 | R4 | R5 |
| --- | --- | --- | --- | --- | --- |
| C1: Lịch chưa bắt đầu | N | Y | Y | Y | Y |
| C2: Hủy trước giờ hẹn ít nhất 24 giờ | - | Y | Y | N | N |
| C3: Đã đặt cọc | - | Y | N | Y | N |
| Từ chối hủy | X |  |  |  |  |
| Hủy và hoàn cọc 100% |  | X |  |  |  |
| Hủy, không phát sinh khoản nào |  |  | X |  |  |
| Hủy và giữ 50% cọc |  |  |  | X |  |
| Hủy muộn, ghi nhận vào hồ sơ KH |  |  |  |  | X |

## 9. Yêu cầu phi chức năng

| ID | Loại | Yêu cầu | Cách xác nhận |
| --- | --- | --- | --- |
| NFR-01 | Hiệu năng | API tìm slot và tạo lịch đạt p95 không quá 2 giây với 50 người dùng đồng thời; trang chính tải trong 3 giây | Kiểm thử tải (JMeter hoặc k6) |
| NFR-02 | Bảo mật | Mật khẩu băm bằng bcrypt; chống SQL injection và XSS; kiểm tra quyền sở hữu đối tượng (không truy cập chéo dữ liệu KH khác); JWT có hạn; không lộ stack trace | Kiểm thử bảo mật cơ bản, review code |
| NFR-03 | Khả năng sử dụng | Hoàn tất đặt lịch trong không quá 5 bước; lỗi nêu rõ trường sai; giao diện dùng được từ 360px | Kiểm thử usability, UAT |
| NFR-04 | Độ tin cậy | Không tạo lịch trùng khi đồng thời; dữ liệu không mất khi thanh toán lỗi giữa chừng; dữ liệu đầu vào bất thường không làm hệ thống ngừng | Kiểm thử đồng thời, kiểm thử tiêu cực |
| NFR-05 | Tương thích | Chạy đúng trên Chrome, Firefox, Edge bản mới nhất và trình duyệt di động | Kiểm thử tương thích |
| NFR-06 | Khả năng bảo trì | ESLint không có lỗi mức error; độ phức tạp chu trình V(G) của hàm lõi không quá 10; độ phủ theo Test Plan | Phân tích tĩnh, báo cáo coverage |

## 10. Phụ lục

### A. Checklist Inspection SRS (ngày 3)

Quy trình: Kick-off, chuẩn bị cá nhân, họp rà soát, sửa đổi, theo dõi và đóng. Vai trò: Moderator (Mạnh), Author (người viết module), Reviewer (người kế tiếp trong vòng Mạnh → Tài → Ngân → Lộc → Mạnh), Scribe xoay vòng. Điều kiện vào: bản nháp đủ 7 module, tác giả đã tự rà. Điều kiện ra: mọi lỗi mức Major đã sửa và Moderator xác nhận.

- [ ] Mỗi yêu cầu có ID duy nhất và mức ưu tiên
- [ ] Mỗi yêu cầu có tiêu chí chấp nhận đo được, kiểm thử được
- [ ] Không có từ mơ hồ như “nhanh”, “thân thiện”, “phù hợp” mà thiếu con số
- [ ] FR, BR và bảng dữ liệu không mâu thuẫn nhau (ví dụ BR-08 và biên cân nặng ở mục 7)
- [ ] Mọi trường dữ liệu có kiểu, min, max, định dạng
- [ ] Mọi trạng thái có đường vào và đường ra rõ ràng; chuyển không hợp lệ được nêu
- [ ] Có luồng rẽ nhánh và ngoại lệ cho mỗi use case chính
- [ ] Thuật ngữ nhất quán với bảng định nghĩa mục 1.3
- [ ] Vai trò và quyền của mỗi chức năng được nêu rõ
- [ ] Giả định đánh dấu \[Cần chốt\] đều đã được xác nhận hoặc ghi nhận rủi ro

### B. Việc cần chốt trong ngày 1–2

| Hạng mục | Đề xuất hiện tại |
| --- | --- |
| Giờ làm việc và ngày nghỉ (BR-01) | 08:00–18:00 mỗi ngày |
| Phụ phí lông dài (BR-09) | 15% |
| VIP và mã khuyến mãi (BR-10) | VIP 10%, không cộng dồn với mã |
| Tỷ lệ cọc và phí hủy muộn (BR-11, mục 8.2) | Cọc 30%, giữ 50% cọc khi hủy muộn |
| Mức ưu tiên của FR-M6-01 (tính giá) | Nâng lên Must, vì FR-M4-01 cần có giá |
| Thuật toán tự gán nhân viên (FR-M4-06) | Nhân viên rảnh có ít lịch nhất trong ngày |
| Công nghệ | React, Node/Express, MySQL hoặc PostgreSQL |

### C. Kiểm soát thay đổi yêu cầu

Mọi thay đổi SRS sau baseline (ngày 3) ghi vào bảng lịch sử phiên bản; người đề xuất cập nhật RTM và test case liên quan trong vòng 1 ngày, Mạnh duyệt.
