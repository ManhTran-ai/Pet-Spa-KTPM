
---

**Bản làm việc** · Phiên bản 0.2 (Ngày 2) · Ngày 2026-11-13 · Người lập: Mạnh (TV1)

Nguồn: `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v0.1). Bản làm việc này được chỉnh sửa theo change control; mọi thay đổi yêu cầu phải kèm CR trong `docs/change-requests.md` và cập nhật RTM cùng commit.

**Thay đổi từ v0.1 → v0.2 (Ngày 2, Mạnh):**

1. Bổ sung tiêu chí chấp nhận đo được cho M1 (mục 5.1a) và M7 (mục 5.7a): mã lỗi HTTP, số lần, giá trị đầu vào, thời hạn bằng đơn vị thời gian.
2. Bổ sung tiêu chí chấp nhận đo được cho toàn bộ 6 NFR (mục 9a cho NFR-02 do Mạnh chuyên trách, mục 9b cho NFR còn lại).
3. Làm rõ 10 tiêu chí chấp nhận còn mơ hồ ở M2–M6 (FR-M2-02, FR-M2-04, FR-M3-02, FR-M3-04, FR-M4-02, FR-M4-07, FR-M5-04, FR-M6-01, FR-M6-04, FR-M6-05), ghi rõ tác giả sửa.
4. Chuyển 5 mục `[Cần chốt]` thành `[Cần chốt → ADR-xx]` theo mặc định ADR-02 và ADR-08; cập nhật phụ lục B với nguồn quyết định và trạng thái.
5. Bổ sung ADR-07 (mã lỗi truy cập chéo dữ liệu) và ADR-08 (ngày nghỉ NV, bộ đếm đăng nhập sai).
6. Không thay đổi phạm vi chức năng, không thêm FR/NFR mới, không thay đổi ID yêu cầu nào.

# Đặc tả Yêu cầu Phần mềm (SRS)

## Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

| Phiên bản | Ngày | Tác giả | Thay đổi |
| --- | --- | --- | --- |
| 0.1 | Ngày 1–2 | Cả nhóm | Khung và bản nháp yêu cầu |
| 0.2 | Ngày 2 | Mạnh | Tiêu chí chấp nhận đo được cho M1, M7 và toàn bộ NFR; làm rõ tiêu chí mơ hồ M2–M6; xử lý `[Cần chốt]` bằng ADR |
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

Mục 2 tổng quan; mục 3 giao diện ngoài; mục 4 use case; mục 5 yêu cầu chức năng (5.1a và 5.7a là tiêu chí chấp nhận chi tiết của M1 và M7); mục 6 quy tắc nghiệp vụ; mục 7 ràng buộc dữ liệu; mục 8 vòng đời lịch hẹn; mục 9 yêu cầu phi chức năng (9a là tiêu chí chi tiết NFR-02, 9b là tiêu chí chi tiết các NFR còn lại); mục 10 phụ lục.

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

Trình duyệt Chrome, Firefox, Edge bản mới nhất; điện thoại Android/iOS. Công nghệ đã chốt tại Ngày 1: React + TypeScript + Vite (client), Node/Express + TypeScript (server), **PostgreSQL + Prisma** (CSDL). Xem ADR-01.

> **[Đã chốt Ngày 1 — ADR-01]** CSDL chọn PostgreSQL + Prisma thay cho mục "MySQL hoặc PostgreSQL \[Cần chốt\]" của bản gốc. Lý do: FR-M4-05 cần giao dịch và khoá theo nhân viên; PostgreSQL là lựa chọn duy nhất trong hai giả định đáp ứng yêu cầu này.

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

> **[Rà Ngày 2 — Mạnh]** Toàn bộ tiêu chí chấp nhận của M1 được viết lại thành dạng đo được: nêu mã lỗi HTTP cụ thể, số lần, giá trị đầu vào và thời hạn bằng đơn vị thời gian. Chi tiết ở mục 5.1a.

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M1-01 | KH đăng ký tài khoản với họ tên, email, SĐT, mật khẩu | Must | Dữ liệu hợp lệ thì tạo được tài khoản; email đã tồn tại trả 409; mật khẩu lưu dạng băm |
| FR-M1-02 | Đăng nhập bằng email và mật khẩu | Must | Đúng thông tin thì nhận JWT hết hạn sau 60 phút; sai thì báo lỗi chung, không lộ email có tồn tại hay không |
| FR-M1-03 | Đăng xuất và hết hạn phiên | Must | Sau đăng xuất hoặc khi token hết hạn, API bảo vệ trả 401 |
| FR-M1-04 | Đổi mật khẩu và quên mật khẩu (liên kết đặt lại giả lập) | Should | Mật khẩu mới theo BR-13; mật khẩu cũ sai bị từ chối; liên kết hết hạn sau 15 phút |
| FR-M1-05 | Phân quyền theo vai trò KH/NV/AD | Must | Chức năng ngoài quyền trả 403; KH không xem được thú cưng và lịch của KH khác |
| FR-M1-06 | Khóa tạm tài khoản khi đăng nhập sai liên tiếp | Should | Sai 5 lần liên tiếp thì khóa 15 phút (BR-16); trong thời gian khóa, đăng nhập đúng vẫn bị từ chối |

#### 5.1a Tiêu chí chấp nhận chi tiết của M1 (Mạnh, Ngày 2)

Quy ước dùng chung: mọi lỗi trả về theo mẫu `{ "error": { "code", "message", "details" } }` (SRS §3.2). Mã lỗi: `VALIDATION_ERROR` 400, `UNAUTHENTICATED` 401, `FORBIDDEN` 403, `NOT_FOUND` 404, `CONFLICT` 409, `BUSINESS_RULE_VIOLATION` 422.

| ID | Tiêu chí chấp nhận đo được |
| --- | --- |
| FR-M1-01 | (1) Gửi họ tên `Nguyễn Văn A`, email `a@example.com`, SĐT `0901234567`, mật khẩu `Passw0rd` → HTTP 201, trả về `userId` và `role = CUSTOMER`; trong CSDL cột `password_hash` bắt đầu bằng `$2b$` và khác chuỗi mật khẩu gốc. (2) Gửi lại cùng email → HTTP 409, mã `CONFLICT`, không tạo bản ghi thứ hai. (3) Thiếu 1 trong 4 trường bắt buộc → HTTP 400, mã `VALIDATION_ERROR`, `details` nêu đúng tên trường thiếu. (4) Email sai định dạng, SĐT không đủ 10 chữ số hoặc không bắt đầu bằng `0`, mật khẩu vi phạm BR-13 → HTTP 400, `details` chỉ đúng trường vi phạm, trường hợp này mỗi lỗi một yêu cầu riêng. (5) Họ tên 1 ký tự hoặc 51 ký tự → HTTP 400. (6) Mật khẩu 7 ký tự và 33 ký tự → HTTP 400. (7) Số lần thử đăng ký trùng email không làm tăng `failed_attempts` của tài khoản đã có. |
| FR-M1-02 | (1) Đăng nhập đúng → HTTP 200, trả `accessToken` có `exp` đúng bằng thời điểm phát hành cộng 60 phút, trả `tokenType = Bearer`. (2) Sai mật khẩu → HTTP 401, mã `UNAUTHENTICATED`, thông báo **giống hệt** trường hợp email không tồn tại (so sánh chuỗi message và `code` phải bằng nhau). (3) Email không tồn tại → HTTP 401, cùng thông báo với (2). (4) Email sai định dạng → HTTP 400. (5) Mỗi lần đăng nhập sai tăng `failed_attempts` đúng 1; đăng nhập đúng khi `failed_attempts = 0` trả HTTP 200 và đặt `failed_attempts = 0`. |
| FR-M1-03 | (1) `POST /auth/logout` với token hợp lệ → HTTP 200, `jti` của token được ghi vào bảng `revoked_tokens`. (2) Gọi `GET /auth/me` bằng token đã thu hồi → HTTP 401, mã `UNAUTHENTICATED`. (3) Gọi `GET /auth/me` bằng token hết hạn → HTTP 401, mã `UNAUTHENTICATED`. (4) Gọi `GET /auth/me` không có header `Authorization` → HTTP 401. (5) Token ký sai chữ ký → HTTP 401. (6) `GET /auth/me` bằng token hợp lệ → HTTP 200, trả `id`, `email`, `fullName`, `role`, `isVip` và không trả `passwordHash`, `failedAttempts`, `lockedUntil`. |
| FR-M1-04 | (1) `POST /auth/change-password` với mật khẩu cũ sai → HTTP 400 hoặc 401 (mã `UNAUTHENTICATED` hoặc `VALIDATION_ERROR`), mật khẩu cũ không đổi. (2) Mật khẩu mới vi phạm BR-13 → HTTP 400, `details` nêu điều kiện vi phạm. (3) Đổi thành công → HTTP 200, mật khẩu mới trong CSDL là chuỗi băm khác chuỗi băm cũ; các token đã cấp trước đó vẫn dùng được đến khi hết hạn. (4) `POST /auth/forgot-password` với email tồn tại → HTTP 200 **kể cả khi email không tồn tại** (không rò rỉ email có tồn tại hay không), trả về `resetToken` giả lập trong phản hồi chỉ khi `TEST_MODE = true`. (5) Token đặt lại có `expires_at` đúng bằng thời điểm tạo cộng 15 phút. (6) Dùng token đặt lại sau 15 phút → HTTP 400/410, mã `VALIDATION_ERROR`. (7) Dùng lại token đặt lại đã dùng → HTTP 400/410. (8) Đặt lại thành công → mật khẩu mới có hiệu lực ngay khi đăng nhập. |
| FR-M1-05 | (1) KH gọi `GET /admin/staff` → HTTP 403, mã `FORBIDDEN`. (2) NV gọi `GET /admin/reports/summary` → HTTP 403. (3) KH gọi `GET /pets/:id` với `id` thuộc về KH khác → HTTP 403, mã `FORBIDDEN`, phản hồi không chứa tên, giống, cân nặng của thú cưng đó. (4) KH gọi `GET /appointments/:id` của KH khác → HTTP 403. (5) NV gọi `GET /appointments/:id` của lịch không được gán cho mình → HTTP 403. (6) AD gọi các API quản trị → HTTP 200. (7) Endpoint không tồn tại → HTTP 404, mã `NOT_FOUND`. (8) Mọi endpoint có `:id` phải trả 403 khi người gọi không sở hữu đối tượng, không trả 404 để tránh rò rỉ sự tồn tại. |
| FR-M1-06 | (1) Sai mật khẩu 4 lần liên tiếp → HTTP 401, `failed_attempts = 4`, tài khoản **chưa** khóa. (2) Sai lần thứ 5 → HTTP 401, `locked_until` bằng thời điểm đó cộng 15 phút. (3) Trong 15 phút khóa, đăng nhập **đúng mật khẩu** vẫn bị từ chối HTTP 401. (4) Sau khi hết 15 phút (kiểm bằng mock clock), đăng nhập đúng → HTTP 200 và `failed_attempts` được đặt lại 0. (5) Một lần đăng nhập đúng giữa chuỗi sai làm đặt lại bộ đếm về 0. (6) Sai 5 lần với 5 tài khoản khác nhau thì mỗi tài khoản bị khoá độc lập, không ảnh hưởng tài khoản khác. |

Rủi ro và giả định đã ghi nhận:

- **FR-M1-04 (mật khẩu quên):** liên kết đặt lại được giả lập, không gửi email thật (SRS §2.5). Token trả về trong phản hồi chỉ khi `TEST_MODE = true`; ở môi trường thật trả 200 với thông báo chung.
- **FR-M1-05:** mã lỗi khi người gọi không sở hữu đối tượng là **403 `FORBIDDEN`** (không phải 404) — chốt tại ADR-07.
- **FR-M1-06:** ngưỡng "sai 5 lần liên tiếp" tính trên mỗi tài khoản, bộ đếm được đặt lại khi đăng nhập thành công — chốt tại ADR-08.
- **FR-M1-02:** thời hạn JWT 60 phút kể từ thời điểm phát hành; mọi mốc thời gian kiểm thử được dùng mock clock.

### 5.2 M2 – Hồ sơ thú cưng

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M2-01 | KH thêm thú cưng: tên, loài, giống, giới tính, tuổi, cân nặng, loại lông, ghi chú sức khỏe | Must | Lưu thành công khi hợp lệ; thiếu trường bắt buộc hoặc ngoài miền thì báo lỗi theo từng trường **[Rà Ngày 2 — Mạnh]** → "Dữ liệu hợp lệ → HTTP 201, trả `id`; thiếu bất kỳ trường bắt buộc nào trong 8 trường → HTTP 400 mã `VALIDATION_ERROR`, `details` liệt kê đúng các trường thiếu; mỗi trường vượt miền ở SRS §7 (tuổi 0 và 241 tháng, cân nặng 0,4 kg và 50,1 kg, tên 31 ký tự, giống 51 ký tự, ghi chú 501 ký tự) → HTTP 400, `details` chỉ nêu trường vi phạm; loài không thuộc {Chó, Mèo} hoặc loại lông không thuộc {Ngắn, Dài} → HTTP 400." |
| FR-M2-02 | KH xem danh sách và chi tiết thú cưng của mình | Must | **[Rà Ngày 2 — Mạnh]** Chỉ thấy thú cưng của chính mình (mỗi `id` trả về đều thuộc `owner_id` của KH đang gọi); danh sách rỗng trả HTTP 200 với mảng `items` rỗng và mã thông báo `PET_LIST_EMPTY`; `GET /pets/:id` với `id` không thuộc KH trả HTTP 403 mã `FORBIDDEN` (ADR-07) |
| FR-M2-03 | KH sửa thông tin thú cưng | Must | Áp dụng cùng ràng buộc như khi thêm; đổi cân nặng không làm đổi giá của lịch đã tạo **[Rà Ngày 2 — Mạnh]** → "Sửa với dữ liệu hợp lệ → HTTP 200 và các trường được cập nhật đúng giá trị mới; dữ liệu vi phạm ràng buộc ở FR-M2-01 → HTTP 400 cùng mã lỗi; sửa `weight` của một thú cưng đang có lịch `Pending`/`Confirmed` không làm thay đổi `total` hay `appointment_items` của các lịch đó (giá được chụp tại thời điểm tạo lịch)." |
| FR-M2-04 | KH xóa thú cưng | Must | Xóa được khi thỏa BR-15; ngược lại từ chối kèm lý do **[Rà Ngày 2 — Mạnh]** → "Thú cưng không có lịch ở trạng thái `Pending`, `Confirmed` hoặc `In-Progress` thì xóa trả HTTP 200 và `GET /pets/:id` sau đó trả HTTP 404; có lịch ở một trong ba trạng thái đó thì trả HTTP 422 mã `BUSINESS_RULE_VIOLATION`, `details` nêu số lịch và mã từng lịch đang chặn." |
| FR-M2-05 | Giới hạn số thú cưng mỗi tài khoản | Should | Thêm thú cưng thứ 6 bị từ chối (BR-05) |

### 5.3 M3 – Danh mục dịch vụ và bảng giá

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M3-01 | Xem danh mục dịch vụ (tên, mô tả, thời lượng, giá) | Must | Chỉ hiển thị dịch vụ đang bật, sắp theo tên **[Rà Ngày 2 — Mạnh]** → "`GET /services` trả HTTP 200, mỗi phần tử có `id`, `name`, `description`, `duration` (phút, bội của 30 trong 30–240 theo BR-02) và `price` theo nhóm cân nặng; mọi dịch vụ `is_active = false` không xuất hiện; kết quả sắp theo `name` tăng dần không phân biệt hoa thường." |
| FR-M3-02 | Bảng giá theo nhóm cân nặng và loài | Must | Giá đúng nhóm theo BR-08; cân nặng đúng biên 5, 15, 30 kg xếp đúng nhóm **[Rà Ngày 2 — Mạnh]** → "Cân nặng 4,9 kg → nhóm S; 5 kg → M; 14,9 kg → M; 15 kg → L; 29,9 kg → L; 30 kg → XL; 50 kg → XL; 0,4 kg và 50,1 kg → HTTP 400 mã `VALIDATION_ERROR`." |
| FR-M3-03 | AD thêm, sửa, ẩn dịch vụ (API ở M3, giao diện ở M7) | Must | Dịch vụ ẩn không đặt mới được, lịch cũ không bị ảnh hưởng; giá và thời lượng ngoài miền bị từ chối **[Rà Ngày 2 — Mạnh]** → "Thêm dịch vụ hợp lệ → HTTP 201; `duration` không phải bội của 30 hoặc ngoài 30–240 phút → HTTP 400; `price` ngoài 10.000–5.000.000 VND → HTTP 400 (SRS §7); đặt dịch vụ bị ẩn vào lịch mới → HTTP 422 mã `BUSINESS_RULE_VIOLATION`; các lịch đã chứa dịch vụ bị ẩn vẫn trả về đúng `id`, `name`, `duration` và `price` của thời điểm tạo lịch, và giá không đổi." |
| FR-M3-04 | Tìm kiếm, lọc dịch vụ theo loài và tên | Could | Kết quả đúng, không phân biệt hoa thường **[Rà Ngày 2 — Mạnh]** → "Tìm theo tên: khớp không phân biệt hoa thường và dấu cách (`Tắm` khớp `tắm`), trả HTTP 200 với `items` chỉ gồm dịch vụ `is_active = true`; lọc theo loài chỉ trả dịch vụ hỗ trợ loài đó; không có kết quả thì trả HTTP 200 với `items` rỗng, không phải lỗi." |

### 5.4 M4 – Đặt lịch

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M4-01 | KH chọn thú cưng, 1–5 dịch vụ, ngày giờ, nhân viên (tùy chọn) để đặt lịch | Must | Thiếu thú cưng hoặc dịch vụ thì không đi tiếp; sau cọc thành công, lịch ở trạng thái Pending **[Rà Ngày 2 — Mạnh]** → "Không có `petId` hoặc `serviceIds` rỗng → HTTP 400 mã `VALIDATION_ERROR`; `serviceIds` có 6 phần tử → HTTP 400 (tối đa 5, SRS §7); tạo lịch thành công → HTTP 201, `status = Pending`, giữ slot của nhân viên; KH đang có 3 lịch `Pending`/`Confirmed` mà tạo lịch thứ 4 → HTTP 422 mã `BUSINESS_RULE_VIOLATION` (BR-05)." |
| FR-M4-02 | Hiển thị slot trống theo giờ làm và tổng thời lượng | Must | Chỉ hiển thị chuỗi slot liên tục đủ thời lượng; không hiển thị slot trong quá khứ hoặc trong vòng 2 giờ tới **[Rà Ngày 2 — Mạnh]** → "Với tổng thời lượng 90 phút (3 slot 30 phút), chỉ trả về chuỗi slot liên tục còn trống đủ 3 slot; không có slot nào trước thời điểm hiện tại cộng 2 giờ (BR-03) và không có slot nằm ngoài 08:00–18:00 (BR-01) hoặc ngày nghỉ của NV (ADR-08)." |
| FR-M4-03 | Chặn đặt trùng, chồng lịch của cùng nhân viên | Must | Chồng dù một slot thì trả 409; lịch liền kề (kết thúc đúng lúc bắt đầu) được phép |
| FR-M4-04 | Giới hạn thời điểm đặt trước | Must | Cho phép từ đúng 2 giờ đến đúng 30 ngày; 1 giờ 59 phút hoặc quá 30 ngày bị từ chối (BR-03) |
| FR-M4-05 | Chống đặt trùng khi nhiều KH cùng chọn một slot | Must | Hai yêu cầu đồng thời cho cùng slot và nhân viên: đúng một yêu cầu giữ được slot, yêu cầu kia nhận 409 |
| FR-M4-06 | Tự gán nhân viên rảnh khi KH không chọn | Should | Gán nhân viên rảnh có ít lịch nhất trong ngày; không còn ai rảnh thì báo hết chỗ **\[Cần chốt → ADR-02\]** |
| FR-M4-07 | KH xem lịch sử và chi tiết lịch hẹn | Should | Hiển thị đúng trạng thái, dịch vụ, tổng tiền; chỉ lịch của chính KH **[Rà Ngày 2 — Mạnh]** → "Mỗi lịch trả về `status`, danh sách dịch vụ, `subtotal`, `discount`, `deposit`, `total` (khớp FR-M6-01); danh sách chỉ gồm lịch có `customer_id` bằng KH đang gọi; `GET /appointments/:id` của KH khác trả HTTP 403 mã `FORBIDDEN`." |
| FR-M4-08 | NV xem lịch làm việc theo ngày, tuần | Should | Chỉ lịch được gán cho NV đó, sắp theo giờ **[Rà Ngày 2 — Mạnh]** → "`GET /staff/schedule?date=` trả HTTP 200 với danh sách lịch có `staff_id` bằng NV đang gọi, sắp theo `start_at` tăng dần; `?from=&to=` trả lịch trong khoảng tuần; lịch của NV khác không xuất hiện; NV đã bị khóa thì không xuất hiện trong slot (FR-M7-01)." |

### 5.5 M5 – Vòng đời lịch hẹn

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M5-01 | Quản lý trạng thái lịch hẹn | Must | Chỉ cho phép các chuyển trạng thái ở bảng 8.1; ghi lại thời điểm và người thực hiện |
| FR-M5-02 | NV, AD xác nhận lịch Pending | Must | Chỉ NV được gán hoặc AD xác nhận được; xác nhận xong KH nhận thông báo **[Rà Ngày 2 — Mạnh]** → "NV được gán xác nhận lịch `Pending` → HTTP 200, `status = Confirmed`; NV **không** được gán xác nhận → HTTP 403 mã `FORBIDDEN`; AD xác nhận lịch của bất kỳ KH nào → HTTP 200; xác nhận lịch đã `Confirmed` → HTTP 409 mã `CONFLICT` (SRS §8.1); sau khi xác nhận, `notifications` có 1 bản ghi cho KH." |
| FR-M5-03 | NV bắt đầu và hoàn thành dịch vụ | Must | Bắt đầu chỉ khi Confirmed; hoàn thành chỉ khi In-Progress **[Rà Ngày 2 — Mạnh]** → "Bắt đầu lịch `Confirmed` → HTTP 200, `status = In-Progress`; bắt đầu lịch `Pending` → HTTP 409 mã `CONFLICT`; hoàn thành lịch `In-Progress` → HTTP 200, `status = Completed`; hoàn thành lịch `Confirmed` → HTTP 409; NV không được gán thao tác lịch của NV khác → HTTP 403." |
| FR-M5-04 | KH hủy lịch theo chính sách hủy | Must | Kết quả hoàn hoặc giữ cọc đúng bảng quyết định 8.2 **[Rà Ngày 2 — Mạnh]** → "Áp đúng 5 trường hợp R1–R5 của bảng quyết định §8.2: mỗi trường hợp trả HTTP 200 với `cancel_outcome` tương ứng `REJECTED` / `REFUND_100` / `NO_FEE` / `KEEP_50_DEPOSIT` / `LATE_CANCEL_RECORDED`; giá trị hoàn/giữ cọc khớp tỷ lệ 100% hoặc 50% của `deposit`." |
| FR-M5-05 | KH đổi lịch | Should | Tối đa 2 lần, trước giờ hẹn ít nhất 12 giờ; lịch mới phải hợp lệ theo BR-01…04 (BR-07) |
| FR-M5-06 | Tự động chuyển No-show | Should | Quá 30 phút sau giờ hẹn mà lịch còn Confirmed thì thành No-show; lịch In-Progress không bị đổi |
| FR-M5-07 | Từ chối chuyển trạng thái không hợp lệ | Must | Ví dụ Completed sang Cancelled, Cancelled sang Confirmed: trả 409, trạng thái giữ nguyên |

### 5.6 M6 – Tính giá, khuyến mãi, thanh toán, thông báo

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M6-01 | Tính giá theo nhóm cân nặng, phụ phí lông dài, cộng nhiều dịch vụ | Must | Kết quả đúng công thức BR-18, làm tròn đến đồng **[Rà Ngày 2 — Mạnh]** → "Với `subtotal` dịch vụ, tổng dịch vụ = `subtotal` × (1 + 0,15) nếu lông dài/dày; giảm = max(10% nếu VIP, `percent` của mã nếu có, chỉ một mã); `total` = tổng dịch vụ − giảm, làm tròn đến đồng; `deposit` = 30% `total` (BR-11)." |
| FR-M6-02 | Áp mã khuyến mãi | Should | Mã sai, hết hạn hoặc đơn chưa đạt giá trị tối thiểu bị từ chối kèm lý do; tối đa 1 mã mỗi lịch |
| FR-M6-03 | Giảm giá thành viên VIP | Should | VIP giảm 10%; không cộng dồn với mã khuyến mãi (BR-10) |
| FR-M6-04 | Đặt cọc và thanh toán qua cổng giả lập | Should | Thành công thì tạo lịch; thất bại hoặc timeout thì không tạo lịch và giải phóng slot; bấm thanh toán lặp không trừ tiền hai lần **[Rà Ngày 2 — Mạnh]** → "Cổng trả `success` → HTTP 200, lịch tạo ở trạng thái `Pending`; `failed` → HTTP 402 mã `PAYMENT_FAILED`, không có bản ghi lịch, slot trở lại trạng thái trống; `timeout` → HTTP 504 mã `PAYMENT_TIMEOUT`, không có bản ghi lịch, slot được giải phóng; gọi lại `POST /appointments/:id/pay` với cùng `idempotencyKey` không tạo giao dịch thứ hai (tổng tiền trừ đúng 1 lần)." |
| FR-M6-05 | Xuất hóa đơn | Should | Hóa đơn nêu dịch vụ, phụ phí, giảm giá, cọc, số còn lại; tổng khớp FR-M6-01 **[Rà Ngày 2 — Mạnh]** → "Hóa đơn trả về 5 dòng: từng dịch vụ, phụ phí lông dài, mức giảm, cọc đã trả, số còn lại; `subtotal − discount = total` và `deposit + remaining = total` đúng bằng 1 đồng." |
| FR-M6-06 | Nhắc lịch và thông báo | Could | Nhắc trước 24 giờ; thông báo khi xác nhận, hủy, đổi lịch (ghi log) |

### 5.7 M7 – Quản trị

> **[Rà Ngày 2 — Mạnh]** Toàn bộ tiêu chí chấp nhận của M7 được viết lại thành dạng đo được. Chi tiết ở mục 5.7a.

| ID | Yêu cầu | Ưu tiên | Tiêu chí chấp nhận |
| --- | --- | --- | --- |
| FR-M7-01 | AD quản lý nhân viên: thêm, sửa, khóa, giờ làm, ngày nghỉ | Should | Nhân viên bị khóa hoặc nghỉ không xuất hiện ở slot; lịch đã có được cảnh báo — chi tiết ở §5.7a, quy tắc ngày nghỉ ở BR-01/ADR-08 |
| FR-M7-02 | AD quản lý mã khuyến mãi | Should | Tạo, sửa, tắt mã với hạn dùng và giá trị tối thiểu; mã đã tắt không áp được (HTTP 422) — chi tiết ở §5.7a |
| FR-M7-03 | Báo cáo số lịch theo ngày, tuần, dịch vụ và doanh thu | Could | Số liệu khớp các lịch `Completed`; lọc được theo khoảng ngày (`from`/`to`) — chi tiết ở §5.7a |
| FR-M7-04 | AD xem và điều chỉnh mọi lịch hẹn | Could | Hủy hoặc đổi lịch theo quyền; ghi nhật ký thao tác vào `audit_log` — chi tiết ở §5.7a |

#### 5.7a Tiêu chí chấp nhận chi tiết của M7 (Mạnh, Ngày 2)

Quy ước mã lỗi dùng chung với mục 5.1a.

| ID | Tiêu chí chấp nhận đo được |
| --- | --- |
| FR-M7-01 | (1) `POST /admin/staff` với dữ liệu hợp lệ (họ tên, email, SĐT, mật khẩu theo BR-13, `work_start`, `work_end`) → HTTP 201, tạo tài khoản có `role = STAFF` và bản ghi `staff` tương ứng. (2) Email NV đã tồn tại → HTTP 409, mã `CONFLICT`. (3) `work_start` / `work_end` nằm ngoài 08:00–18:00 hoặc `work_end ≤ work_start` → HTTP 400, mã `VALIDATION_ERROR`, `details` nêu đúng trường. (4) `POST /admin/staff/:id/lock` → HTTP 200, `users.status = LOCKED`; NV đó **không** xuất hiện trong `GET /slots` từ thời điểm khóa trở đi. (5) `POST /admin/staff/:id/days-off` với ngày nằm trong `08:00–18:00` và có lịch `Pending` hoặc `Confirmed` → HTTP 422, mã `BUSINESS_RULE_VIOLATION`, phản hồi nêu số lịch bị ảnh hưởng và mã lịch. (6) `POST /admin/staff/:id/days-off` với ngày không có lịch → HTTP 201. (7) Khóa NV đang có lịch `Pending` hoặc `Confirmed` → HTTP 422 kèm cảnh báo danh sách lịch bị ảnh hưởng. (8) NV bị khóa không đăng nhập được và không nhận được token mới. (9) Thêm ngày nghỉ trùng ngày đã có → HTTP 409, mã `CONFLICT`. |
| FR-M7-02 | (1) `POST /admin/promotions` với `code` 4–20 ký tự chữ in hoa và số, `percent` 1–50, `min_order` ≥ 10.000, `valid_from` < `valid_to` → HTTP 201. (2) `code` đã tồn tại → HTTP 409. (3) `percent` ngoài 1–50 → HTTP 400. (4) `code` chứa ký tự thường hoặc ký tự đặc biệt → HTTP 400. (5) `PATCH /admin/promotions/:id` đặt `active = false` → HTTP 200; áp mã đó cho một lịch mới → HTTP 422, mã `BUSINESS_RULE_VIOLATION`, nêu lý do "mã đã tắt". (6) Mã có `valid_to` đã qua so với thời điểm hiện tại → HTTP 422 khi áp, nêu lý do "mã đã hết hạn". (7) Đơn có `subtotal` < `min_order` → HTTP 422, nêu lý do "chưa đạt giá trị tối thiểu". (8) Mã hợp lệ và đơn đạt tối thiểu → áp được, tổng giảm khớp `percent`. |
| FR-M7-03 | (1) `GET /admin/reports/summary?from=&to=` trả về số lịch theo trạng thái, theo dịch vụ và doanh thu. (2) Doanh thu chỉ tính lịch `Completed` và bằng tổng `total` của các lịch đó; lịch `Cancelled`, `No-show` và `Pending` không tính. (3) Khoảng ngày `from` > `to` → HTTP 400. (4) Khoảng ngày không có lịch nào → HTTP 200 với tổng bằng 0, không phải lỗi. (5) Số liệu trả về khớp với đếm trực tiếp trên CSDL trên cùng bộ lịch. (6) Lọc theo khoảng ngày chỉ trả về lịch có `start_at` trong khoảng đó. |
| FR-M7-04 | (1) `GET /admin/appointments` trả về **mọi** lịch của mọi KH; `GET /appointments/:id` của lịch thuộc KH khác với tài khoản AD → HTTP 200. (2) AD hủy lịch áp dụng đúng bảng quyết định SRS §8.2 như KH, kết quả trả trong trường `cancel_outcome` tương ứng R1–R5. (3) AD đổi lịch vẫn tuân thủ BR-07 (tối đa 2 lần, trước giờ hẹn ít nhất 12 giờ). (4) Mỗi thao tác của AD trên lịch (xem, hủy, đổi) ghi 1 dòng vào `audit_log` gồm `actor_id`, `action`, `target`, `at`. (5) Sửa lịch của KH qua Admin không làm thay đổi giá của lịch đã tạo (snapshot `appointment_items`). (6) Không có bản ghi `audit_log` nào thì lịch bị ảnh hưởng. |

Rủi ro và giả định đã ghi nhận:

- **FR-M7-01:** ngày nghỉ của NV chỉ ảnh hưởng việc **tạo lịch mới**; lịch đã có vẫn tồn tại nhưng bị trả kèm cảnh báo khi AD thao tác — chốt tại ADR-08.
- **FR-M7-01:** khoảng giờ làm của NV mặc định 08:00–18:00 theo BR-01, nằm trong giờ mở cửa của spa; Admin có thể cấu hình khác trong giờ mở cửa.
- **FR-M7-03:** "doanh thu" dùng trường `total` của lịch `Completed` (đã trừ giảm, đã gồm phụ phí), không dùng `deposit`.
- **FR-M7-04:** `audit_log` ghi ở mức hành động (action), mỗi lần gọi API quản trị tạo 1 dòng; không ghi cho lần đọc thuần túy ngoài `GET` danh sách.
- **FR-M7-04:** mức ưu tiên của FR-M7-04 là **Could** trong SRS §5.7, nhưng là cơ sở cho nghiệp vụ `audit_log` của FR-M7-01…03 và cho yêu cầu an toàn dữ liệu; đề xuất nâng lên Should — mở CR-08.

## 6. Quy tắc nghiệp vụ

Các giá trị đánh dấu **\[Cần chốt → ADR-xx\]** là giả định của nhóm đã được ghi nhận tại ADR-02, ADR-07 và ADR-08; thay đổi giá trị thì phải cập nhật test case liên quan (RTM giúp tìm ra chúng).

| ID | Quy tắc | FR liên quan |
| --- | --- | --- |
| BR-01 | Giờ làm việc 08:00–18:00 mỗi ngày; AD cấu hình ngày nghỉ **\[Cần chốt → ADR-08\]** | FR-M4-02, FR-M7-01 |
| BR-02 | Slot 30 phút; thời lượng dịch vụ là bội của 30 phút, từ 30 đến 240 phút | FR-M4-02, FR-M3-03 |
| BR-03 | Đặt trước tối thiểu 2 giờ, tối đa 30 ngày so với thời điểm hiện tại | FR-M4-04 |
| BR-04 | Một nhân viên không có hai lịch chồng thời gian; giờ kết thúc bằng giờ bắt đầu cộng tổng thời lượng dịch vụ | FR-M4-03 |
| BR-05 | Mỗi KH có tối đa 5 thú cưng và tối đa 3 lịch ở trạng thái Pending hoặc Confirmed cùng lúc | FR-M2-05, FR-M4-01 |
| BR-06 | Chính sách hủy theo bảng quyết định mục 8.2 | FR-M5-04 |
| BR-07 | Đổi lịch tối đa 2 lần mỗi lịch, thực hiện trước giờ hẹn ít nhất 12 giờ; lịch mới phải thỏa BR-01 đến BR-04 | FR-M5-05 |
| BR-08 | Nhóm cân nặng: S từ 0.5 đến dưới 5 kg; M từ 5 đến dưới 15 kg; L từ 15 đến dưới 30 kg; XL từ 30 đến 50 kg. Giá dịch vụ định theo nhóm và loài | FR-M3-02, FR-M6-01 |
| BR-09 | Thú cưng lông dài hoặc lông dày chịu phụ phí 15% giá dịch vụ **\[Cần chốt → ADR-02\]** | FR-M6-01 |
| BR-10 | Mỗi lịch dùng tối đa 1 mã khuyến mãi; mã phải còn hạn và đơn đạt giá trị tối thiểu. VIP giảm 10%. Giảm VIP và mã khuyến mãi không cộng dồn: áp mức giảm lớn hơn **\[Cần chốt → ADR-02\]** | FR-M6-02, FR-M6-03 |
| BR-11 | Cọc bằng 30% thành tiền, thanh toán qua cổng giả lập khi đặt lịch; phần còn lại thanh toán sau khi hoàn thành **\[Cần chốt → ADR-02\]** | FR-M6-04 |
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

### 9a. Tiêu chí chấp nhận đo được của NFR-02 (Mạnh, Ngày 2)

NFR-02 là yêu cầu phi chức năng **Must** và do Mạnh chuyên trách kiểm thử (TP-01 §4.6). Ngưỡng chấp nhận: **không còn phát hiện nào ở mức Critical hoặc High** (TP-01 §9.5).

| # | Kiểm tra | Cách đo | Kết quả đạt |
| --- | --- | --- | --- |
| NFR-02.1 | Mật khẩu được băm | Truy vấn trực tiếp cột `password_hash` sau khi đăng ký | Chuỗi bắt đầu bằng `$2b$`, độ dài 60 ký tự, khác hoàn toàn mật khẩu gốc; đăng ký 2 tài khoản cùng mật khẩu cho 2 giá trị băm khác nhau |
| NFR-02.2 | SQL injection | Gửi `' OR '1'='1`, `1; DROP TABLE pets;--`, `admin'--` vào các trường văn bản (email, tên thú cưng, tên dịch vụ, mã khuyến mãi) và vào tham số truy vấn (`?q=`, `?species=`, `?from=`) | HTTP 400 với `VALIDATION_ERROR` hoặc HTTP 422; không trả về tập kết quả rộng hơn dự kiến; bảng `pets` còn nguyên sau khi thử `DROP TABLE` |
| NFR-02.3 | XSS | Gửi `<script>alert(1)</script>` vào tên thú cưng, ghi chú sức khỏe, tên dịch vụ; đọc lại qua API và hiển thị trên giao diện | API trả về dữ liệu nguyên văn (escaping ở tầng render, không lưu HTML thô); trong DOM không có phần tử `<script>` do dữ liệu sinh ra; không có hộp thoại `alert` khi mở trang |
| NFR-02.4 | Truy cập chéo dữ liệu KH | KH A gọi `GET/PUT/DELETE /pets/:id` và `GET /appointments/:id` với `id` thuộc KH B | HTTP 403 với mã `FORBIDDEN` (ADR-07); phản hồi không chứa dữ liệu của KH B; số bản ghi của KH B trong CSDL không đổi sau lần gọi |
| NFR-02.5 | Token sai hoặc hết hạn | Gọi API bảo vệ với token sai chữ ký, token hết hạn, token đã thu hồi, không có header | Cả bốn trường hợp trả HTTP 401 với mã `UNAUTHENTICATED` |
| NFR-02.6 | Không lộ stack trace | Gây lỗi 500 (ví dụ dữ liệu lỗi ở tầng CSDL) và kiểm tra phản hồi | HTTP 500 với mã `INTERNAL_ERROR`; phản hồi không chứa `stack`, `file`, `prisma` hay tên bảng CSDL |
| NFR-02.7 | Không ghi bí mật vào log | Đọc log ứng dụng sau khi đăng ký, đăng nhập | Log không chứa mật khẩu gốc, mật khẩu băm, `accessToken` hay `refreshToken` |
| NFR-02.8 | Kiểm tra header bảo mật | Gọi API và kiểm tra header trả về | Có `X-Content-Type-Options: nosniff`, `X-Frame-Options` hoặc `Content-Security-Policy`, `Strict-Transport-Security`; CORS chỉ cho phép origin trong danh sách whitelist |
| NFR-02.9 | Tham số hoá truy vấn | Đọc code và kiểm tra không có nối chuỗi trực tiếp giá trị người dùng vào câu SQL; mọi truy vấn thô dùng tham số | Không phát hiện nối chuỗi tham số không kiểm soát trong `server/src` |

Định nghĩa mức độ (theo TP-01 §9.5): **Critical** — lộ dữ liệu của KH khác, SQL injection thực thi được, mật khẩu lưu dạng rõ, lộ stack trace chứa thông tin nhạy cảm; **High** — token không hết hạn, XSS thực thi được, endpoint không kiểm tra quyền sở hữu.

### 9b. Tiêu chí chấp nhận đo được của các NFR còn lại (Mạnh rà, Ngày 2)

Các NFR dưới đây do thành viên khác phụ trách kiểm thử, nhưng Mạnh (Test Lead) rà lại để bảo đảm tiêu chí chấp nhận đo được, phục vụ thiết kế test case và Exit criteria.

| ID | Tiêu chí chấp nhận đo được |
| --- | --- |
| NFR-01 | (1) `GET /slots` và `POST /appointments` đo p95 trên kịch bản 50 người dùng đồng thời (k6, thời lượng 5 phút, warm-up 1 phút): p95 ≤ 2.000 ms. (2) Trang chủ đo bằng Lighthouse trên môi trường test có dữ liệu mẫu: `LCP` ≤ 3.000 ms. (3) Ngưỡng đạt: không có mốc p95 nào vượt 2.000 ms ở cả hai endpoint trong 3 lần chạy liên tiếp. |
| NFR-03 | (1) Luồng đặt lịch từ màn hình chủ đăng nhập đến màn hình xác nhận thanh toán tối đa 5 lần thao tác chính (chọn thú cưng → chọn dịch vụ → chọn ngày giờ → chọn NV hoặc để hệ thống tự gán → xác nhận). (2) Mọi lỗi validation hiển thị đúng tên trường và thông điệp tiếng Việt; không hiển thị thông báo chung chung. (3) Ở chiều rộng 360 px, không có thanh cuộn ngang và không có phần tử nào tràn khung nhìn; các nút hành động có kích thước chạm tối thiểu 44×44 px. (4) Toàn bộ luồng đặt lịch và 3 luồng rẽ nhánh (không còn slot, mã khuyến mãi không hợp lệ, thanh toán thất bại) đạt tỷ lệ hoàn thành ≥ 80% với ≥ 5 người dùng thật (UAT — `HUMAN-PENDING`). |
| NFR-04 | (1) 10 yêu cầu đặt lịch đồng thời cho cùng một slot và cùng một NV: đúng 1 lịch được tạo, 9 lần còn lại trả HTTP 409 mã `CONFLICT`; tổng số lịch trong CSDL tăng đúng 1. (2) Gọi `POST /appointments/:id/pay` với `idempotencyKey` giống nhau 3 lần: chỉ 1 giao dịch, `deposit` bị trừ 1 lần. (3) Cắt kết nối giữa lúc thanh toán: lịch ở trạng thái `Pending` với `deposit = 0`, không mất dữ liệu dịch vụ đã chọn. (4) Gửi payload lỗi vượt giới hạn (email 300 ký tự, `services` 50 phần tử, số âm, chuỗi rỗng, JSON sai cú pháp): mọi trường hợp trả HTTP 400 mã `VALIDATION_ERROR`, tiến trình server không bị dừng (kiểm tra sau mỗi lần gọi: `GET /api/health` vẫn trả HTTP 200). (5) Dữ liệu đầu vào không hợp lệ không làm thay đổi dữ liệu đã có trong CSDL. |
| NFR-05 | (1) Luồng đăng nhập → xem danh mục dịch vụ → đặt lịch chạy đúng trên 3 trình duyệt: Chrome, Firefox, Edge (phiên bản mới nhất) ở kích thước 360×800, 768×1024, 1440×900; không có lỗi console mức error. (2) Trên trình duyệt di động (Chrome Android, Safari iOS), các thao tác chạm hoạt động đúng và form không tự nhảy khi bàn phím mở. (3) Điểm khác biệt hành vi nào phát hiện được phải được ghi thành lỗi và không được coi là đạt. |
| NFR-06 | (1) `npm run lint` trả về 0 lỗi mức error (cảnh báo mức warning được ghi nhận, không chặn). (2) V(G) của các hàm lõi (`pricing`, `slot-availability`, `state-transition`, `auth`) ≤ 10; đo bằng `npm run report:static` (ESLint complexity rule). (3) Độ phủ dòng lệnh ≥ 70% và độ phủ nhánh ≥ 60% cho `server/src` theo TP-01 §9.4; báo cáo coverage nằm trong `reports/`. (4) `npm run typecheck` không có lỗi TypeScript. |

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

Trạng thái cập nhật Ngày 2 (Mạnh): các mặc định dưới đây **đã được ghi vào ADR-02/ADR-08 và giữ nguyên theo chỉ đạo của Trưởng nhóm**, chờ nhóm xác nhận tại họp kick-off (`HUMAN-PENDING`).

| Hạng mục | Đề xuất hiện tại | Nguồn quyết định | Trạng thái |
| --- | --- | --- | --- |
| Giờ làm việc và ngày nghỉ (BR-01) | 08:00–18:00 mỗi ngày; NV được AD cấu hình ngày nghỉ, chỉ ảnh hưởng lịch tạo mới | ADR-08 | Chờ nhóm xác nhận |
| Phụ phí lông dài (BR-09) | 15% | ADR-02 | Chờ nhóm xác nhận |
| VIP và mã khuyến mãi (BR-10) | VIP 10%, không cộng dồn với mã, áp mức lớn hơn | ADR-02 | Chờ nhóm xác nhận |
| Tỷ lệ cọc và phí hủy muộn (BR-11, mục 8.2) | Cọc 30%, giữ 50% cọc khi hủy muộn | ADR-02 | Chờ nhóm xác nhận |
| Mức ưu tiên của FR-M6-01 (tính giá) | Nâng lên Must, vì FR-M4-01 cần có giá | ADR-02 | Đã áp dụng |
| Thuật toán tự gán nhân viên (FR-M4-06) | Nhân viên rảnh có ít lịch nhất trong ngày; hết người rảnh thì trả HTTP 409 mã `CONFLICT` | ADR-02 | Chờ nhóm xác nhận |
| Công nghệ | React + TypeScript + Vite, Node/Express + TypeScript, **PostgreSQL + Prisma** | ADR-01 | Đã chốt |
| Mã lỗi khi người gọi không sở hữu đối tượng | HTTP **403** `FORBIDDEN` (không dùng 404) | ADR-07 | Đã chốt |
| Bộ đếm đăng nhập sai | Tính riêng theo tài khoản, đặt lại khi đăng nhập thành công | ADR-08 | Đã chốt |
| Mức ưu tiên FR-M7-04 (audit log) | Đề xuất nâng Could → Should | CR-08 (chờ Inspection Ngày 3) | Chờ Inspection |
| Mức ưu tiên FR-M6-01 | Đã nâng lên Must | CR-01 (chờ Inspection Ngày 3) | Chờ Inspection |

### C. Kiểm soát thay đổi yêu cầu

Mọi thay đổi SRS sau baseline (ngày 3) ghi vào bảng lịch sử phiên bản; người đề xuất cập nhật RTM và test case liên quan trong vòng 1 ngày, Mạnh duyệt.
