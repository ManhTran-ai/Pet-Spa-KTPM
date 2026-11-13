
---

**Bản làm việc** · Phiên bản 0.1 (Ngày 1) · Ngày 2026-11-13 · Người lập: Mạnh (TV1)

Nguồn: `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` (RTM-01 v0.1). Bản làm việc này được chỉnh sửa theo change control; mọi thay đổi yêu cầu phải kèm CR trong `docs/change-requests.md` và cập nhật RTM cùng commit.
# Ma trận Truy xuất Yêu cầu (RTM)

## Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

Mã tài liệu: RTM-01 · Phiên bản 0.1 (khung, hoàn thiện đủ 100% yêu cầu vào ngày 8) · Người phụ trách: Mạnh; Tài cập nhật bản cuối ngày 13

Nguồn: SRS-01 (40 yêu cầu chức năng và 6 yêu cầu phi chức năng), TP-01. Ma trận cho phép truy vết hai chiều: từ yêu cầu đến test case để biết còn yêu cầu nào chưa được kiểm thử, và từ test case ngược về yêu cầu để phát hiện test case thừa.

**Chú giải.** Kỹ thuật: EP phân vùng tương đương, BVA giá trị biên, DT bảng quyết định, ST chuyển đổi trạng thái, UC use case/workflow, WB hộp trắng. Mức: U unit, I tích hợp, S hệ thống, A chấp nhận. Mã test case là dải dự kiến, thay bằng danh sách thực tế sau ngày 8. Cột Kết quả nhận: Chưa chạy, Pass, Fail (ghi DEF-nnn), Blocked.

## 1. Tổng hợp

| Module | Code | Số yêu cầu | Test case dự kiến | Người viết và chạy test |
| --- | --- | --- | --- | --- |
| M1 Tài khoản, phân quyền | Mạnh | 6 | 28 | Lộc |
| M2 Hồ sơ thú cưng | Tài | 5 | 22 | Mạnh |
| M3 Danh mục, bảng giá | Tài | 4 | 16 | Mạnh |
| M4 Đặt lịch | Ngân | 8 | 24 | Tài |
| M5 Vòng đời lịch hẹn | Ngân | 7 | 24 | Tài |
| M6 Giá, khuyến mãi, thanh toán | Lộc | 6 | 32 | Ngân |
| M7 Quản trị | Mạnh | 4 | 10 | Lộc |
| Phi chức năng (NFR-01 đến NFR-06) | Cả nhóm | 6 | 19 | Theo chuyên trách |
| **Tổng** |  | **46** | **175** |  |

Ưu tiên của 40 yêu cầu chức năng: Must 22, Should 14, Could 4. Yêu cầu phi chức năng Must: NFR-02, NFR-04.

## 2. Yêu cầu chức năng

### M1 – Tài khoản và phân quyền (Lộc viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M1-01 | Đăng ký tài khoản | Must | UC-01 | EP, BVA | U, S | TC-M1-001…009 (9) | Chưa chạy |
| FR-M1-02 | Đăng nhập, cấp JWT | Must | UC-01 | EP, UC | U, I, S | TC-M1-010…015 (6) | Chưa chạy |
| FR-M1-03 | Đăng xuất, hết hạn phiên | Must | UC-01 | UC | I, S | TC-M1-016…018 (3) | Chưa chạy |
| FR-M1-04 | Đổi và quên mật khẩu | Should | UC-01 | EP, BVA, UC | S | TC-M1-019…022 (4) | Chưa chạy |
| FR-M1-05 | Phân quyền theo vai trò | Must | UC-01 | EP, UC | I, S | TC-M1-023…026 (4) | Chưa chạy |
| FR-M1-06 | Khóa sau 5 lần đăng nhập sai | Should | UC-01 | BVA, ST | U, S | TC-M1-027…028 (2) | Chưa chạy |

### M2 – Hồ sơ thú cưng (Mạnh viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M2-01 | Thêm thú cưng | Must | UC-02 | EP, BVA | U, S | TC-M2-001…009 (9) | Chưa chạy |
| FR-M2-02 | Xem danh sách, chi tiết | Must | UC-02 | UC | S | TC-M2-010…012 (3) | Chưa chạy |
| FR-M2-03 | Sửa thông tin thú cưng | Must | UC-02 | EP, BVA | U, S | TC-M2-013…016 (4) | Chưa chạy |
| FR-M2-04 | Xóa thú cưng (BR-15) | Must | UC-02 | EP, UC | U, S | TC-M2-017…020 (4) | Chưa chạy |
| FR-M2-05 | Giới hạn 5 thú cưng mỗi tài khoản | Should | UC-02 | BVA | U, S | TC-M2-021…022 (2) | Chưa chạy |

### M3 – Danh mục dịch vụ và bảng giá (Mạnh viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M3-01 | Xem danh mục dịch vụ | Must | UC-03 | UC | S | TC-M3-001…003 (3) | Chưa chạy |
| FR-M3-02 | Bảng giá theo nhóm cân nặng, loài | Must | UC-03 | BVA, DT | U, S | TC-M3-004…009 (6) | Chưa chạy |
| FR-M3-03 | AD thêm, sửa, ẩn dịch vụ | Must | UC-08 | EP, BVA, UC | I, S | TC-M3-010…014 (5) | Chưa chạy |
| FR-M3-04 | Tìm kiếm, lọc dịch vụ | Could | UC-03 | EP | S | TC-M3-015…016 (2) | Chưa chạy |

### M4 – Đặt lịch (Tài viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M4-01 | Chọn thú cưng, dịch vụ, giờ, nhân viên | Must | UC-04 | UC, EP | I, S, A | TC-M4-001…004 (4) | Chưa chạy |
| FR-M4-02 | Hiển thị slot trống | Must | UC-04 | EP, BVA | U, S | TC-M4-005…008 (4) | Chưa chạy |
| FR-M4-03 | Chặn trùng, chồng lịch nhân viên | Must | UC-04 | BVA, WB | U, I, S | TC-M4-009…012 (4) | Chưa chạy |
| FR-M4-04 | Giới hạn đặt trước 2 giờ đến 30 ngày | Must | UC-04 | BVA | U, S | TC-M4-013…016 (4) | Chưa chạy |
| FR-M4-05 | Chống đặt trùng khi đồng thời | Must | UC-04 | UC | I, S | TC-M4-017…018 (2) | Chưa chạy |
| FR-M4-06 | Tự gán nhân viên rảnh | Should | UC-04 | EP | U, S | TC-M4-019…020 (2) | Chưa chạy |
| FR-M4-07 | KH xem lịch sử lịch hẹn | Should | UC-05 | UC | S | TC-M4-021…022 (2) | Chưa chạy |
| FR-M4-08 | NV xem lịch làm việc | Should | UC-06 | UC | S | TC-M4-023…024 (2) | Chưa chạy |

### M5 – Vòng đời lịch hẹn (Tài viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M5-01 | Quản lý trạng thái lịch hẹn | Must | UC-06 | ST | U, S | TC-M5-001…006 (6) | Chưa chạy |
| FR-M5-02 | NV, AD xác nhận lịch | Must | UC-06 | UC | I, S | TC-M5-007…008 (2) | Chưa chạy |
| FR-M5-03 | Bắt đầu, hoàn thành dịch vụ | Must | UC-06 | ST, UC | I, S | TC-M5-009…011 (3) | Chưa chạy |
| FR-M5-04 | Hủy lịch theo chính sách | Must | UC-05 | DT | U, S, A | TC-M5-012…017 (6) | Chưa chạy |
| FR-M5-05 | Đổi lịch | Should | UC-05 | BVA, DT | U, S | TC-M5-018…020 (3) | Chưa chạy |
| FR-M5-06 | Tự động chuyển No-show | Should | UC-06 | BVA, ST | U, S | TC-M5-021…022 (2) | Chưa chạy |
| FR-M5-07 | Từ chối chuyển trạng thái không hợp lệ | Must | UC-05 | ST | U, S | TC-M5-023…024 (2) | Chưa chạy |

### M6 – Tính giá, khuyến mãi, thanh toán, thông báo (Ngân viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M6-01 | Tính giá theo cân nặng, phụ phí | Must | UC-04 | DT, BVA, WB | U, S | TC-M6-001…008 (8) | Chưa chạy |
| FR-M6-02 | Áp mã khuyến mãi | Should | UC-04, UC-07 | EP, BVA, DT | U, S | TC-M6-009…015 (7) | Chưa chạy |
| FR-M6-03 | Giảm giá VIP | Should | UC-04, UC-07 | DT | U, S | TC-M6-016…018 (3) | Chưa chạy |
| FR-M6-04 | Đặt cọc, thanh toán giả lập | Should | UC-04, UC-07 | UC, EP | I, S, A | TC-M6-019…025 (7) | Chưa chạy |
| FR-M6-05 | Xuất hóa đơn | Should | UC-07 | UC | S | TC-M6-026…029 (4) | Chưa chạy |
| FR-M6-06 | Nhắc lịch, thông báo | Could | UC-06 | UC | I, S | TC-M6-030…032 (3) | Chưa chạy |

### M7 – Quản trị (Lộc viết và chạy test)

| Yêu cầu | Nội dung | Ưu tiên | UC | Kỹ thuật | Mức | Test case dự kiến | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| FR-M7-01 | Quản lý nhân viên | Should | UC-08 | UC, EP | S | TC-M7-001…004 (4) | Chưa chạy |
| FR-M7-02 | Quản lý mã khuyến mãi | Should | UC-08 | EP, BVA | S | TC-M7-005…006 (2) | Chưa chạy |
| FR-M7-03 | Báo cáo số lịch, doanh thu | Could | UC-08 | UC | S | TC-M7-007…008 (2) | Chưa chạy |
| FR-M7-04 | AD xem, điều chỉnh mọi lịch | Could | UC-08 | UC | S | TC-M7-009…010 (2) | Chưa chạy |

## 3. Yêu cầu phi chức năng

| Yêu cầu | Nội dung | Ưu tiên | Loại kiểm thử | Mức | Test case dự kiến | Người | Kết quả |
| --- | --- | --- | --- | --- | --- | --- | --- |
| NFR-01 | Hiệu năng | Should | Kiểm thử tải | S | TC-NF-001…003 (3) | Lộc | Chưa chạy |
| NFR-02 | Bảo mật | Must | SQL injection, XSS, truy cập chéo, quyền | S | TC-NF-004…009 (6) | Mạnh | Chưa chạy |
| NFR-03 | Khả năng sử dụng | Should | Usability, responsive | S, A | TC-NF-010…013 (4) | Tài | Chưa chạy |
| NFR-04 | Độ tin cậy | Must | Đồng thời, lỗi giữa chừng | S | TC-NF-014…016 (3) | Ngân | Chưa chạy |
| NFR-05 | Tương thích | Should | Trình duyệt, di động | S | TC-NF-017…019 (3) | Tài | Chưa chạy |
| NFR-06 | Khả năng bảo trì | Should | Phân tích tĩnh, coverage (không có test case riêng) |  | Báo cáo phân tích tĩnh, báo cáo coverage | Tài | Chưa chạy |

## 4. Quy tắc sử dụng và cập nhật

- **Truy vết xuôi:** mọi yêu cầu có ít nhất một test case. Mục tiêu ngày 8: 46 trên 46 yêu cầu (NFR-06 được đáp ứng bằng báo cáo công cụ); riêng 22 yêu cầu chức năng Must và 2 yêu cầu phi chức năng Must phải có test case trước mọi yêu cầu khác.
- **Truy vết ngược:** mỗi test case ghi mã yêu cầu mà nó kiểm tra. Test case không gắn với yêu cầu nào thì xem xét xóa hoặc bổ sung yêu cầu vào SRS.
- **Cập nhật kết quả:** người viết test case cập nhật cột Kết quả sau mỗi lần chạy; nếu Fail thì ghi DEF-nnn. Mạnh rà soát cuối ngày trong ngày 11–13.
- **Khi SRS thay đổi:** tô màu các dòng bị ảnh hưởng, cập nhật test case trong 1 ngày (SRS mục 10.C).
- **Bổ sung sau ngày 5:** thêm cột ánh xạ sang thành phần thiết kế (API, bảng dữ liệu) khi SDD v1.0 chốt.
- **Kiểm tra cuối (ngày 13):** độ phủ yêu cầu 100%, tỷ lệ Pass, danh sách yêu cầu còn lỗi mở đưa vào Final Test Report.
