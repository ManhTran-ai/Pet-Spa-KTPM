# Ma trận Truy xuất Yêu cầu (RTM)

Mã tài liệu: RTM-01 · Phiên bản 1.0 · Ngày 8, sau Technical Review thiết kế test · Người phụ trách: Mạnh (Test Lead)

Đầu vào: SRS-01 (`docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md`) và Test Case Specification (`docs/testcases/*.csv`)

> Bản này thay thế RTM v0.1 của hệ thống do nhóm tự xây (đã archive). Mỗi yêu cầu trong SRS đích đều được truy xuất tới ít nhất một test case; nguyên tắc truy xuất hai chiều (hai chiều đầy đủ) được kiểm tra tự động bằng `scripts/rtm-check.mjs`.

## 1. Tổng quan độ phủ

| Chỉ số | Giá trị |
|---|---|
| Tổng số yêu cầu trong SRS-01 | 60 |
| Yêu cầu có ít nhất 1 test case | 60 (100.0%) |
| Yêu cầu Must có ít nhất 1 test case | 41/41 (100.0%) |
| Tổng số test case | 226 |
| Yêu cầu chưa được phủ | 0 |
| Test case truy xuất tới yêu cầu không tồn tại trong SRS | 0 |
| Test case ID bị trùng | 0 |

## 2. Ma trận truy xuất chi tiết

| Yêu cầu | Nội dung | Hệ thống | Ưu tiên | Module | Test case | SL | Kỹ thuật | Phụ trách |
|---|---|---|---|---|---|---|---|---|
| FR-M1-01 | Trang chủ tải được bằng HTTP 200 không cần đăng nhập | T1, T2, T3 | Must | M1 | TC-T1-M1-001; TC-T2-M1-001; TC-T3-M1-001 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M1-02 | Điều hướng chính mở được từ mọi trang và quay lại được | T1, T2, T3 | Must | M1 | TC-T1-M1-002; TC-T2-M1-002; TC-T3-M1-002 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M1-03 | Hiển thị đầy đủ thông tin liên hệ: địa chỉ, điện thoại, email, giờ mở cửa | T1, T2, T3 | Must | M1 | TC-T1-M1-003; TC-T2-M1-003; TC-T3-M1-003 | 3 | Use case | Tài, Ngân, Mạnh |
| FR-M1-04 | Không có lỗi liên kết chết (404) trong menu và footer | T1, T2, T3 | Must | M1 | TC-T1-M1-004; TC-T2-M1-004; TC-T3-M1-004; TC-T3-M1-007 | 4 | Use case, UC | Mạnh, Tài, Ngân, Lộc |
| FR-M1-05 | Trang hiển thị đúng trên màn hình di động, không tràn ngang | T1, T2, T3 | Must | M1 | TC-T1-M1-005; TC-T2-M1-005; TC-T3-M1-005 | 3 | Use case | Mạnh, Lộc, Ngân |
| FR-M1-06 | Ứng dụng báo lỗi thân thiện khi tải trang con thất bại | T1, T2, T3 | Should | M1 | TC-T1-M1-006; TC-T2-M1-006; TC-T3-M1-006 | 3 | Use case | Lộc |
| FR-M2-01 | Hiển thị danh sách dịch vụ kèm tên, mô tả, giá và thời lượng | T1, T2, T3 | Must | M2 | TC-T1-M2-001; TC-T1-M2-007; TC-T2-M2-001; TC-T2-M2-006; TC-T3-M2-001; TC-T3-M2-007 | 6 | UC | Tài, Lộc, Ngân, Mạnh |
| FR-M2-02 | Mỗi dịch vụ nêu rõ phạm vi bao gồm (thành phần) | T1, T2, T3 | Must | M2 | TC-T1-M2-002; TC-T2-M2-002; TC-T3-M2-002 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M2-03 | Phân biệt dịch vụ tại spa và tại nhà | T1 | Must | M2 | TC-T1-M2-003; TC-T1-M2-004 | 2 | UC | Tài, Mạnh |
| FR-M2-04 | Tách dịch vụ grooming, nhuộm và dịch vụ giá riêng thành nhóm | T2 | Should | M2 | TC-T2-M2-004; TC-T2-M2-005 | 2 | UC | Ngân, Tài |
| FR-M2-05 | Nêu rõ gói phổ biến và phụ thu thêm của gói tại nhà | T1 | Should | M2 | TC-T1-M2-005; TC-T1-M2-006 | 2 | UC | Mạnh |
| FR-M2-06 | Phân biệt rõ dịch vụ dành cho chó và dịch vụ dành cho mèo | T3 | Should | M2 | TC-T3-M2-008 | 1 | UC | Ngân |
| FR-M2-07 | Không niêm yết dịch vụ mà hệ thống không thực hiện được | T1, T2, T3 | Should | M2 | TC-T2-M2-003; TC-T3-M2-009 | 2 | UC | Lộc |
| FR-M3-01 | Công bố bảng giá theo bậc cân nặng và loài | T1, T2, T3 | Must | M3 | TC-T1-M3-001; TC-T2-M3-001; TC-T3-M3-001 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M3-02 | Tra bảng giá đúng theo loài và bậc cân nặng được chọn | T1, T2, T3 | Must | M3 | TC-T1-M3-002; TC-T1-M3-003; TC-T1-M3-007; TC-T1-M3-008; TC-T1-M3-009; TC-T1-M3-010; TC-T1-M3-011; TC-T1-M3-012; TC-T1-M3-013; TC-T1-M3-014; TC-T1-M3-015; TC-T1-M3-016; TC-T1-M3-017; TC-T1-M3-018; TC-T2-M3-002; TC-T2-M3-003; TC-T2-M3-011; TC-T2-M3-012; TC-T2-M3-013; TC-T2-M3-014; TC-T2-M3-015; TC-T2-M3-016; TC-T2-M3-017; TC-T2-M3-018; TC-T2-M3-019; TC-T2-M3-020; TC-T2-M3-021; TC-T2-M3-022; TC-T2-M3-023; TC-T2-M3-024; TC-T3-M3-002; TC-T3-M3-003; TC-T3-M3-006; TC-T3-M3-007; TC-T3-M3-008; TC-T3-M3-009; TC-T3-M3-010; TC-T3-M3-011; TC-T3-M3-012; TC-T3-M3-013; TC-T3-M3-014 | 41 | EP, DT, BVA, UC | Tài, Mạnh, Lộc, Ngân |
| FR-M3-03 | Giá hiển thị được tính tức thì khi chọn đủ loài, cân nặng, dịch vụ | T2 | Must | M3 | TC-T2-M3-004; TC-T2-M3-005; TC-T2-M3-006 | 3 | UC | Ngân |
| FR-M3-04 | Tính giá riêng cho dịch vụ cần khảo giá | T2 | Must | M3 | TC-T2-M3-007; TC-T2-M3-008 | 2 | EP, DT | Ngân |
| FR-M3-05 | Giá dự kiến được ghi rõ là dự kiến, không phải giá cuối | T1, T2, T3 | Must | M3 | TC-T1-M3-004; TC-T2-M3-009; TC-T3-M3-004 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M3-06 | Bảng giá nêu rõ điều kiện bảo hành hoặc ngoại lệ phát sinh phí | T2, T3 | Should | M3 | TC-T2-M3-010; TC-T3-M3-005 | 2 | UC | Ngân, Mạnh |
| FR-M3-07 | Nêu giá "từ ...₫" và khoảng min–max cho gói | T1 | Should | M3 | TC-T1-M3-005; TC-T1-M3-006 | 2 | UC, EP | Tài |
| FR-M4-01 | Cung cấp form giữ chỗ với trường liên hệ bắt buộc và tuỳ chọn | T1, T2, T3 | Must | M4 | TC-T1-M4-001; TC-T2-M4-001; TC-T3-M4-001 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M4-02 | Từ chối gửi form khi thiếu trường bắt buộc | T1, T2, T3 | Must | M4 | TC-T1-M4-002; TC-T2-M4-002; TC-T3-M4-002 | 3 | EP | Tài, Ngân, Mạnh |
| FR-M4-03 | Kiểm tra định dạng số điện thoại | T1, T2, T3 | Must | M4 | TC-T2-M4-003; TC-T2-M4-004; TC-T2-M4-005; TC-T3-M4-003; TC-T3-M4-004; TC-T3-M4-010 | 6 | EP, ST | Ngân, Mạnh, Lộc |
| FR-M4-04 | Cho phép chọn ngày mong muốn trong tương lai | T1, T2 | Must | M4 | TC-T1-M4-003; TC-T2-M4-006 | 2 | EP | Tài, Ngân |
| FR-M4-05 | Chặn ngày mong muốn nằm quá xa trong tương lai | T2 | Should | M4 | TC-T2-M4-007 | 1 | EP | Ngân |
| FR-M4-06 | Chọn được loài và cân nặng trước khi xem giá | T1, T2 | Must | M4 | TC-T1-M4-004; TC-T1-M4-005; TC-T1-M4-009; TC-T2-M4-013; TC-T2-M4-014 | 5 | ST | Tài, Mạnh, Lộc |
| FR-M4-07 | Chọn được dịch vụ trước khi xác nhận | T1, T2, T3 | Must | M4 | TC-T1-M4-006; TC-T1-M4-010; TC-T2-M4-008; TC-T2-M4-015 | 4 | UC, ST | Mạnh, Lộc, Ngân |
| FR-M4-08 | Cho phép quay lại bước trước mà không mất lựa chọn | T1, T2, T3 | Must | M4 | TC-T1-M4-007; TC-T1-M4-011; TC-T1-M4-012; TC-T2-M4-009; TC-T2-M4-016; TC-T2-M4-017 | 6 | ST | Mạnh, Lộc, Tài |
| FR-M4-09 | Hiển thị tóm tắt lựa chọn trước khi gửi | T2 | Should | M4 | TC-T2-M4-010 | 1 | UC | Tài |
| FR-M4-10 | Yêu cầu sự đồng ý về việc liên hệ lại trước khi gửi | T2 | Must | M4 | TC-T2-M4-011 | 1 | UC | Tài |
| FR-M4-11 | Cho phép đặt lịch ngoài giờ mở cửa | T3 | Should | M4 | TC-T3-M4-005; TC-T3-M4-008 | 2 | EP, UC | Ngân |
| FR-M4-12 | Không yêu cầu tạo tài khoản để đặt lịch | T1, T2, T3 | Must | M4 | TC-T1-M4-008; TC-T2-M4-012; TC-T3-M4-009; TC-T3-M4-011 | 4 | UC, ST | Mạnh, Tài, Lộc |
| FR-M4-13 | Chỉ cho khách đã có hồ sơ đặt lịch trực tuyến, khách mới được hướng dẫn tiếp nhận | T3 | Must | M4 | TC-T3-M4-006; TC-T3-M4-007 | 2 | EP, UC | Ngân |
| FR-M5-01 | Nêu rõ quy trình từ đặt lịch đến nhận thú cưng | T1, T2, T3 | Must | M5 | TC-T1-M5-001; TC-T2-M5-001; TC-T3-M5-001 | 3 | UC | Tài, Ngân, Mạnh |
| FR-M5-02 | Công bố thời gian xác nhận lịch | T1, T2 | Must | M5 | TC-T1-M5-002; TC-T2-M5-002 | 2 | UC | Tài, Ngân |
| FR-M5-03 | Nêu rõ có thể đổi hoặc hủy lịch và điều kiện | T1 | Must | M5 | TC-T1-M5-003; TC-T1-M5-004; TC-T1-M5-005; TC-T1-M5-006 | 4 | UC, DT | Mạnh, Lộc |
| FR-M5-04 | Nêu rõ chính sách hủy và hoàn tiền | T1, T2, T3 | Must | M5 | TC-T2-M5-003; TC-T2-M5-004; TC-T2-M5-005; TC-T3-M5-002 | 4 | UC, DT | Ngân, Tài, Mạnh |
| FR-M5-05 | Nêu rõ thời gian nên đặt trước cho từng loại dịch vụ | T2 | Should | M5 | TC-T2-M5-006 | 1 | UC | Lộc |
| FR-M5-06 | Thông báo khi bị từ chối lịch do ngoài giờ làm việc | T3 | Must | M5 | TC-T3-M5-003; TC-T3-M5-004 | 2 | EP | Ngân |
| FR-M5-07 | Hiển thị trạng thái hiện tại của tiệm (đang mở/đã đóng) | T3 | Must | M5 | TC-T3-M5-005 | 1 | UC | Lộc |
| FR-M6-01 | Cho phép chọn dịch vụ tại spa hoặc tại nhà | T1 | Must | M6 | TC-T1-M6-001; TC-T1-M6-002 | 2 | ST | Tài |
| FR-M6-02 | Tính phụ thu di chuyển theo công thức công bố | T1 | Must | M6 | TC-T1-M6-003; TC-T1-M6-004; TC-T1-M6-005; TC-T1-M6-006; TC-T1-M6-007; TC-T1-M6-008; TC-T1-M6-009; TC-T1-M6-020 | 8 | DT, UC | Tài, Mạnh, Lộc |
| FR-M6-03 | Cộng phụ thu cố định của gói tại nhà vào tổng | T1 | Must | M6 | TC-T1-M6-011; TC-T1-M6-012; TC-T1-M6-013; TC-T1-M6-014 | 4 | DT | Mạnh |
| FR-M6-04 | Nêu rõ mức phụ thu cố định không gồm phí di chuyển | T1 | Must | M6 | TC-T1-M6-015; TC-T1-M6-016 | 2 | UC | Mạnh, Lộc |
| FR-M6-05 | Phụ thu di chuyển tăng dần theo khoảng cách, có mốc miễn phí | T1 | Must | M6 | TC-T1-M6-017 | 1 | UC | Lộc |
| FR-M6-06 | Trên 15 km không báo giá cố định mà chuyển sang liên hệ | T1 | Must | M6 | TC-T1-M6-010; TC-T1-M6-018; TC-T1-M6-019 | 3 | DT, EP | Mạnh, Lộc |
| FR-M7-01 | Có chức năng tìm kiếm nội dung | T2 | Must | M7 | TC-T2-M7-001 | 1 | UC | Ngân |
| FR-M7-02 | Tìm kiếm không phân biệt hoa thường và xử lý từ khoá rỗng | T2 | Must | M7 | TC-T2-M7-002; TC-T2-M7-003; TC-T2-M7-004 | 3 | EP | Ngân, Tài |
| FR-M7-03 | Chuyển đổi ngôn ngữ và giữ ngữ cảnh trang | T1, T2 | Should | M7 | TC-T1-M7-001; TC-T2-M7-005 | 2 | UC | Tài, Lộc |
| FR-M7-04 | Cung cấp kênh liên hệ đa dạng (điện thoại, email, Zalo/chat) | T1, T2, T3 | Must | M7 | TC-T1-M7-002; TC-T2-M7-006; TC-T3-M7-001 | 3 | UC | Mạnh, Lộc |
| FR-M7-05 | Trang tìm bé thương và bảo hành không chặn người dùng | T2 | Could | M7 | TC-T2-M7-007 | 1 | UC | Lộc |
| FR-M7-06 | Nội dung FAQ dạng accordion mở/đóng được | T1 | Should | M7 | TC-T1-M7-003 | 1 | ST | Lộc |
| FR-M7-07 | Hiển thị nội dung bằng một ngôn ngữ duy nhất khi hệ thống không hỗ trợ đa ngôn ngữ | T3 | Should | M7 | TC-T3-M7-002 | 1 | UC | Lộc |
| NFR-01 | Hiệu năng: trang chủ tải xong (DOMContentLoaded) trong ≤ 3 giây trên mạng 4G mô phỏng; LCP ≤ 2,5 giây | T1, T2, T3 | Must | NFR | TC-NFR-01-001; TC-NFR-01-002; TC-NFR-01-003; TC-NFR-01-004; TC-NFR-01-005; TC-NFR-01-006 | 6 | Lighthouse, Use case | Ngân |
| NFR-02 | Bảo mật: HTTPS bật, HSTS có, `X-Content-Type-Options: nosniff`, `X-Frame-Options` hoặc CSP `frame-ancestors`, `Referrer-Policy`; không lộ stack trace; phản xạ đầu vào không thực thi (XSS) | T1, T2, T3 | Must | NFR | TC-NFR-02-001; TC-NFR-02-002; TC-NFR-02-003; TC-NFR-02-004; TC-NFR-02-005; TC-NFR-02-006; TC-NFR-02-007; TC-NFR-02-008; TC-NFR-02-009; TC-NFR-02-010; TC-NFR-02-011; TC-NFR-02-012 | 12 | Use case | Mạnh |
| NFR-03 | Khả năng dùng: hoàn tất luồng tính giá trong ≤ 5 thao tác; thông báo lỗi nêu rõ trường; nhãn nhất quán; dùng được bằng bàn phím | T1, T2, T3 | Should | NFR | TC-NFR-03-001; TC-NFR-03-002; TC-NFR-03-003; TC-NFR-03-004 | 4 | Use case | Tài |
| NFR-04 | Tương thích: chạy đúng chức năng chính trên Chrome, Firefox, Edge và WebKit bản mới nhất; trình duyệt di động 360px | T1, T2, T3 | Must | NFR | TC-NFR-04-001; TC-NFR-04-002; TC-NFR-04-003; TC-NFR-04-004; TC-NFR-04-005; TC-NFR-04-006 | 6 | UC, Use case | Tài |
| NFR-05 | Độ tin cậy: gửi form nhiều lần liên tiếp không tạo bản ghi trùng; lỗi mạng hiển thị thông báo, không treo; tải lại trang không mất trạng thái đã chọn | T1, T2, T3 | Should | NFR | TC-NFR-05-001; TC-NFR-05-002; TC-NFR-05-003; TC-NFR-05-004 | 4 | Use case | Ngân |
| NFR-06 | Khả năng tiếp cận: đủ tương phản chữ ≥ 4,5:1; mọi trường form có nhãn; ảnh có `alt`; điều hướng bằng bàn phím; tiêu đề trang duy nhất | T1, T2, T3 | Should | NFR | TC-NFR-06-001; TC-NFR-06-002; TC-NFR-06-003; TC-NFR-06-004; TC-NFR-06-005; TC-NFR-06-006 | 6 | Accessibility | Lộc |
| NFR-07 | SEO và kỹ thuật bảo trì: mỗi trang có `title` và `meta description` duy nhất; có `lang`; sitemap.xml và robots.txt tồn tại và không chặn; Open Graph đầy đủ | T1, T2, T3 | Could | NFR | TC-NFR-07-001; TC-NFR-07-002; TC-NFR-07-003; TC-NFR-07-004; TC-NFR-07-005; TC-NFR-07-006 | 6 | SEO | Lộc |

## 3. Độ phủ theo hệ thống đích

| Hệ thống | Số yêu cầu áp dụng | Số yêu cầu đã phủ | Độ phủ | Số test case |
|---|---|---|---|---|
| T1 | 43 | 40 | 93.0% | 72 |
| T2 | 43 | 43 | 100.0% | 66 |
| T3 | 35 | 33 | 94.3% | 44 |

## 4. Độ phủ theo kỹ thuật thiết kế test

| Kỹ thuật | Số test case |
|---|---|
| UC | 78 |
| Use case | 37 |
| BVA | 34 |
| EP | 25 |
| DT | 20 |
| ST | 18 |
| Accessibility | 6 |
| SEO | 6 |
| Lighthouse | 2 |

## 5. Độ phủ theo mức ưu tiên

| Ưu tiên | Số test case |
|---|---|
| Critical | 129 |
| High | 74 |
| Medium | 20 |
| Low | 3 |

## 6. Use case kiểm thử chấp nhận (UAT)

| UC | Tên | Hệ thống | Kết quả mong đợi | Người tham gia | Ưu tiên |
|---|---|---|---|---|---|
| UC-01 | Tìm giá dịch vụ chăm sóc cho chó theo cân nặng | T1 | Người dùng thấy giá dự kiến đúng bảng cộng phụ thu cố định 100.000đ cộng phụ thu di chuyển 24.000đ, tổng tiền hiển thị rõ | 5-8 người ngoài nhóm | Critical |
| UC-02 | Tra bảng giá dịch vụ lẻ theo loài và cân nặng | T2 | Giá hiển thị đúng ô trong bảng giá cột Mèo, bậc >3-6kg, dòng Combo Tắm Vệ Sinh | 5-8 người ngoài nhóm | Critical |
| UC-03 | Đặt lịch giữ chỗ tại spa Mật Pet | T2 | Form được gửi, hiển thị thông báo giữ chỗ thành công và tóm tắt lựa chọn | 5-8 người ngoài nhóm | Critical |
| UC-04 | Kiểm tra dịch vụ báo giá riêng trước khi đặt | T2 | Hệ thống không hiển thị một con số đơn lẻ, mà hiển thị khoảng hoặc yêu cầu liên hệ | 5-8 người ngoài nhóm | High |
| UC-05 | Xem quy trình và thời gian xác nhận lịch | T1 | 5-8 người ngoài nhóm | High | Chưa thực thi |
| UC-06 | Tra cứu chính sách hủy hoặc đổi lịch | T1 | Tìm thấy điều kiện cụ thể về thời gian và phí, không chỉ nói liên hệ tiệm | 5-8 người ngoài nhóm | High |
| UC-07 | Tìm kiếm dịch vụ trên Mật Pet | T2 | Danh sách kết quả lọc theo từ khoá, hoa thường cho cùng kết quả, xóa từ khoá không gây lỗi | 5-8 người ngoài nhóm | Medium |
| UC-08 | Liên hệ tiệm qua kênh khác nhau | T1 | 1. Mở trang liên hệ hoặc footer. 2. Kiểm tra số điện thoại, email, liên kết Zalo hoặc messenger. | Có ít nhất 2 kênh hoạt động, liên kết mở đúng ứng dụng | 5-8 người ngoài nhóm |

## 7. Quy tắc bảo trì

1. Mỗi yêu cầu trong SRS-01 phải có ít nhất một test case trước khi vào kiểm thử hệ thống (Entry criteria giai đoạn 2).
2. Mỗi test case phải truy xuất về đúng một yêu cầu; test case không gắn yêu cầu nào bị loại khỏi RTM và không được thực thi.
3. Test case bổ sung phải cập nhật đồng thời file CSV trong `docs/testcases/` và bảng mục 2 của RTM này.
4. Thay đổi SRS phải kích hoạt kiểm tra truy xuất hai chiều trước khi baseline lại phiên bản RTM.
