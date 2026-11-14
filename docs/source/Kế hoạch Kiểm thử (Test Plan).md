# Kế hoạch Kiểm thử (Test Plan)

## Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa — Kiểm thử 3 hệ thống đích

Mã tài liệu: TP-01 · Phiên bản 1.0 (Ngày 5, sau Technical Review thiết kế test) · Người phụ trách: Mạnh (Test Lead)

Đầu vào: SRS-01 (test basis), RTM-01 · Căn cứ lý thuyết: Cẩm nang môn Thiết kế và Kiểm thử Phần mềm, ISTQB CTFL, IEEE 829 · Nhóm: Mạnh, Tài, Ngân, Lộc

> **Hướng tài liệu.** Bản này thay thế bản TP-01 v0.1 của hệ thống do nhóm tự xây (đã archive). Vì không có mã nguồn của hệ thống đích, chiến lược chuyển sang **kiểm thử hộp đen / hộp xám**: kiểm thử hệ thống (E2E trình duyệt), kiểm thử tích hợp (quan sát luồng front-end → API của site đích), và kiểm thử phi chức năng. **Không có kiểm thử đơn vị hay phân tích tĩnh mã nguồn của hệ thống đích.**

---

## 1. Giới thiệu

### 1.1 Mục đích

Kế hoạch này xác định phạm vi, chiến lược, nguồn lực, lịch và tiêu chí kết thúc của hoạt động kiểm thử, đi theo 5 giai đoạn của quy trình kiểm thử: (1) Lập kế hoạch và kiểm soát, (2) Phân tích và thiết kế, (3) Thực hiện, (4) Báo cáo và đánh giá, (5) Đóng hoạt động kiểm thử.

### 1.2 Mục tiêu kiểm thử

- Tìm càng nhiều lỗi càng sớm càng tốt trong 14 ngày (góc nhìn của Myers).
- Chứng minh ba hệ thống đích hoạt động đúng với đặc tả yêu cầu đích, và cung cấp thông tin rủi ro minh bạch.
- **Kiểm chứng (Verification):** rà soát đặc tả yêu cầu đích và thiết kế test bằng Inspection; đối chiếu hành vi thực tế của site với đặc tả.
- **Thẩm định (Validation):** UAT với người dùng thật ở ngày 13.

### 1.3 Bảy nguyên tắc ISTQB áp dụng

| Nguyên tắc | Áp dụng |
|---|---|
| Kiểm thử cho thấy sự tồn tại của lỗi | Báo cáo cuối nêu rủi ro còn lại, không tuyên bố "hết lỗi" |
| Không thể kiểm thử kiệt quệ | Chọn test theo rủi ro và kỹ thuật EP, BVA, DT thay vì thử mọi tổ hợp |
| Kiểm thử sớm | Inspection SRS ngày 3; viết test case từ ngày 6, trước khi chạy |
| Tích tụ của lỗi | Dồn test case vào M3 (tính giá theo biên cân nặng) và M4 (form) |
| Nghịch lý thuốc trừ sâu | Sau vòng 1 (ngày 11) rà soát, bổ sung test case mới và 60 phút khám phá mỗi site |
| Phụ thuộc bối cảnh | Ưu tiên tính đúng giá theo biên cân nặng, tính phụ thu di chuyển, tìm thấy chính sách hủy — rủi ro đặc thù ngành |
| Ngụy biện không có lỗi | UAT ngày 13 để xác nhận hệ thống phục vụ đúng nhu cầu người dùng |

---

## 2. Phạm vi kiểm thử

### 2.1 Đối tượng kiểm thử

Ba hệ thống web đang vận hành: **T1** Pet NGON (`petngon.vn/vi`), **T2** Mật Pet Family (`matpet.vn/spa`), **T3** Pretty Paws (`prettypawscatanddoggrooming.groomore.com`). Mỗi hệ thống gồm giao diện web responsive, luồng đặt lịch/giữ chỗ, danh mục dịch vụ, bảng giá và các API nền tảng mà trình duyệt gọi đến. Tài liệu đặc tả yêu cầu đích (SRS-01) là đối tượng của kiểm thử tĩnh.

### 2.2 Trong phạm vi

- 7 module chức năng M1–M7 (mục 2.2 SRS-01) × 3 hệ thống.
- 7 yêu cầu phi chức năng NFR-01 đến NFR-07.
- Kiểm thử tĩnh: Inspection SRS đích, Technical Review thiết kế test.
- Kiểm thử hệ thống: E2E trình duyệt (Playwright) + thủ công.
- Kiểm thử tích hợp: quan sát và kiểm tra hợp đồng API mà site đích dùng.
- Kiểm thử chấp nhận: UAT với 5–8 người ngoài nhóm.
- Kiểm thử lại (re-test) và hồi quy (regression).

### 2.3 Ngoài phạm vi

Hệ thống nội bộ quản lý lịch của tiệm; thanh toán trực tuyến thật; ứng dụng di động native; hệ thống nhắn tin Zalo/SMS; API không công bố của nhà cung cấp nền tảng; kiểm thử tải trên >100 người dùng ảo; kiểm thử khả năng tiếp cận chuyên sâu WCAG 2.1 AA (chỉ làm mức cơ bản theo NFR-06). Lý do: giới hạn 14 ngày, 4 người, và không kiểm soát được môi trường đích.

---

## 3. Phân tích rủi ro và ưu tiên kiểm thử

| Rủi ro sản phẩm | Module | Khả năng | Tác động | Mức | Biện pháp |
|---|---|---|---|---|---|
| Tính sai giá ở biên bậc cân nặng (chọn sai nhóm, giá lệch bảng) | M3 | Cao | Cao | Rất cao | BVA 6n+1 trên mọi ngưỡng; DT loài × bậc × dịch vụ |
| Phụ thu di chuyển tính sai so với công thức `max(0, km−5)×8.000₫` | M6 | Cao | Cao | Rất cao | Bảng quyết định mục 8.4 SRS; kiểm tra các mốc 5, 10, 15 km |
| Form giữ chỗ nhận sai SĐT hoặc thiếu kiểm tra dữ liệu | M4 | Cao | Cao | Rất cao | EP trên SĐT (rỗng, chữ, độ dài sai, ký tự đặc biệt) |
| Dịch vụ "báo giá riêng" hiển thị sai thành một con số đơn lẻ | M3 | Trung bình | Cao | Cao | DT với 6 dịch vụ giá riêng của T2 |
| Chính sách hủy/đổi lịch không tìm thấy hoặc không nêu điều kiện cụ thể | M5 | Cao | Trung bình | Cao | Bảng quyết định mục 8.3 SRS: 5 điều kiện × 3 hệ thống |
| Wizard đặt lịch cho phép bỏ qua bước bắt buộc | M4 | Trung bình | Cao | Cao | State transition mục 8.1/8.2 SRS, phủ mọi ô ✗ |
| Bảng giá không nhất quán giữa trang bảng giá và giá tính tức thì | M3 | Trung bình | Cao | Cao | Đối chiếu tự động giữa hai nguồn trên T2 |
| Tìm kiếm trả kết quả sai hoặc lỗi với từ khoá rỗng | M7 | Trung bình | Trung bình | Trung bình | EP + UC |
| Chuyển ngôn ngữ để sót tiếng Việt hoặc mất ngữ cảnh | M7 | Trung bình | Thấp | Thấp | UC |
| Thiếu header bảo mật, phản xạ đầu vào thực thi | NFR-02 | Trung bình | Cao | Cao | Kiểm tra header + payload vô hại |
| Trang chậm, LCP vượt ngưỡng | NFR-01 | Trung bình | Trung bình | Trung bình | Lighthouse 3 lần lấy trung vị |
| Trình duyệt khác nhau hiển thị khác nhau | NFR-04 | Trung bình | Trung bình | Trung bình | Playwright đa trình duyệt |
| Site đích đổi giao diện giữa kỳ làm script hỏng | Mỗi | Cao | Trung bình | Cao | Selector theo vai trò/nhãn; smoke hằng ngày; ghi defect |

Test case mức rủi ro Rất cao và Cao được viết và chạy trước. Rủi ro dự án nằm ở mục 12.

---

## 4. Chiến lược kiểm thử

### 4.1 Các mức kiểm thử (khớp mô hình chữ V)

| Mức | Đối tượng | Người thực hiện | Công cụ | Căn cứ | Thời điểm |
|---|---|---|---|---|---|
| Tĩnh (Verification) | SRS đích, thiết kế test, test case | Moderator Mạnh; Reviewer theo vòng | Inspection, Technical Review | SRS-01, TP-01 | Ngày 3, 5, 8 |
| Tích hợp | Luồng front-end → API của site đích; hợp đồng dữ liệu giữa bảng giá và API | Mạnh (T1), Tài (T2), Ngân (T3) | Playwright `page.on('request'/'response')`, HTTP client | Thiết kế test | Ngày 10 |
| Hệ thống | Toàn bộ chức năng M1–M7 theo SRS đích | Người viết test case của hệ thống khác | Playwright, thủ công, Postman/Newman | SRS-01 | Ngày 11–12 |
| Chấp nhận | Nhu cầu người dùng thật | 5–8 người ngoài nhóm, Lộc điều phối | Kịch bản UC, phiếu phản hồi | UC-01…UC-08 | Ngày 13 |

### 4.2 Chiến lược kiểm thử tích hợp

Không tích hợp mã nguồn (không có). Thay vào đó kiểm tra **hợp đồng dữ liệu** của site đích: (a) giá mà API trả về khớp giá hiển thị trên bảng giá tĩnh; (b) danh sách slot/dịch vụ mà API trả về khớp danh mục; (c) form gửi đúng payload mà server nhận. Ghi nhận sai lệch làm defect của hệ thống đích.

### 4.3 Kỹ thuật thiết kế test case

| Kỹ thuật | Đối tượng | Quy tắc áp dụng |
|---|---|---|
| Phân vùng tương đương (EP) | SĐT, tên bé, ngày, từ khoá tìm kiếm (SRS §7) | Dữ liệu hợp lệ có thể gộp trong một ca; mỗi giá trị không hợp lệ một ca riêng để tránh che lỗi |
| BVA 3 giá trị | Mọi ngưỡng bậc cân nặng của T1, T2, T3 (BR-01…BR-03) | Chọn min−1, min, min+1, max−1, max, max+1 quanh mỗi ngưỡng; 6n+1 ca cho n biến |
| Bảng quyết định | Phụ thu di chuyển (SRS §8.4), ma trận loài × bậc × dịch vụ, dịch vụ giá riêng (BR-07), chính sách hủy (SRS §8.3) | Rút gọn cột bằng dấu "−"; mỗi cột còn lại một ca độc lập |
| Chuyển đới trạng thái | Wizard T2 (§8.1) và wizard T1 (§8.2) | Phủ mọi chuyển hợp lệ và mọi ô ✗ |
| Use case, workflow | UC-01…UC-08 | Luồng chính thành công và mọi luồng rẽ nhánh |
| Khám phá | Cả 3 site, 1 phiên 60 phút/site sau vòng 1 | Theo hiến chương: mục tiêu, phạm vi, ghi chú, lỗi tìm được |

Mỗi test case có đủ Test Case ID, Description, Pre-condition, Steps, Expected Output và đạt 4C (đúng đắn, rõ ràng, đầy đủ, nhất quán).

### 4.4 Kiểm thử tĩnh

| Hoạt động | Hình thức | Ngày | Vai trò | Sản phẩm |
|---|---|---|---|---|
| Rà soát SRS đích | Inspection (6 bước, checklist SRS phụ lục A) | 3 | Moderator Mạnh; Reviewer theo vòng Mạnh → Tài → Ngân → Lộc → Mạnh; Scribe xoay vòng | Biên bản, SRS v1.0 |
| Rà soát thiết kế test | Walkthrough rồi Technical Review | 5 | Từng tác giả trình bày; checklist thiết kế | Biên bản, SDD-test v1.0 |
| Rà soát test case | Review chéo theo checklist 4C | 8 | Người review ≠ người viết | Biên bản review test case |

### 4.5 Kiểm thử phi chức năng

| Yêu cầu | Nội dung | Công cụ | Người | Ngày |
|---|---|---|---|---|
| NFR-01 Hiệu năng | Lighthouse Performance (mobile) trên trang chủ và trang đặt lịch, 3 lần lấy trung vị | Lighthouse CLI | Ngân | 12 |
| NFR-02 Bảo mật | Header bảo mật, cookie Secure/HttpOnly, TLS, phản xạ đầu vào vô hại, không lộ stack trace | HTTP client, Playwright, openssl | Mạnh | 12 |
| NFR-03 Khả năng dùng | Số thao tác đến giá, thông báo lỗi, điều hướng bàn phím, tính nhất quán nhãn | Checklist thủ công | Tài | 12 |
| NFR-04 Tương thích | Chrome, Firefox, Edge, Safari; 360px; không cuộn ngang | Playwright project, checklist thủ công | Tài | 12 |
| NFR-05 Độ tin cậy | Gửi form lặp lại, mô phỏng mạng lỗi, tải lại trang giữ trạng thái | Playwright | Ngân | 12 |
| NFR-06 Khả năng tiếp cận | axe-core, tương phản, nhãn form, `alt`, điều hướng bàn phím | Lighthouse A11y + axe-core | Lộc | 12 |
| NFR-07 SEO | `title`, `meta description`, `lang`, sitemap, robots, Open Graph | HTTP client, Lighthouse SEO | Lộc | 12 |

### 4.6 Kiểm thử liên quan đến thay đổi

- **Re-test:** chạy lại đúng test case đã thất bại sau khi báo cáo lỗi được ghi nhận và trạng thái chuyển sang Fixed (đối với lỗi phía site đích: chờ thay đổi trên site rồi xác nhận).
- **Regression:** chạy toàn bộ bộ E2E tự động sau mỗi đợt cập nhật script hoặc sau khi phát hiện site đích đổi giao diện (ngày 12 và ngày 13).

### 4.7 Tự động hóa

- **Playwright (TypeScript)** cho E2E: một project cho mỗi hệ thống (`t1`, `t2`, `t3`) + project `cross-browser` cho NFR-04. Selector theo vai trò/nhãn (`getByRole`, `getByLabel`, `getByText`) để chịu được thay đổi giao diện.
- **Postman/Newman** cho kiểm thử API công khai mà site đích dùng (tra cứu danh mục, slot) — chỉ các endpoint GET, không ghi dữ liệu.
- **k6** cho kiểm thử tải đọc (GET) ở mức nhẹ, không gây ảnh hưởng dịch vụ.
- **Lighthouse CLI** cho NFR-01, NFR-06, NFR-07.
- **axe-core** cho kiểm thử khả năng tiếp cận.

---

## 5. Tiêu chí vào, kết thúc, tạm dừng

### 5.1 Tiêu chí vào (Entry criteria)

| Mức | Điều kiện |
|---|---|
| Tĩnh | SRS đích v1.0 đã baseline; tác giả đã tự rà theo checklist phụ lục A |
| Thiết kế test | Test Plan v1.0; template test case đủ cột; dải mã test case trong RTM đã chốt |
| Tích hợp | Bộ Playwright cài được và chạy được trên ít nhất 1 site; đã ghi log network |
| Hệ thống | Test case v1.0 đã review chéo; môi trường trình duyệt sẵn sàng; dữ liệu test định nghĩa xong |
| Chấp nhận | System test đạt Exit criteria; kịch bản UAT sẵn sàng |

### 5.2 Tiêu chí kết thúc (Exit criteria, kiểm tra ngày 13)

- 100% yêu cầu Must có ít nhất 1 test case (RTM).
- 100% test case ưu tiên Critical và High đã thực thi; tỷ lệ Pass ≥ 95%.
- 0 lỗi Critical hoặc High còn mở; mọi lỗi đi qua đủ vòng đời.
- Mỗi trong 3 hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh.
- NFR-02 đạt trên cả 3 site; không có phát hiện bảo mật mức Critical/High.
- UAT không có phản hồi chặn.

### 5.3 Tạm dừng và tiếp tục

Tạm dừng khi site đích không truy cập được, từ 30% test case bị chặn bởi một lỗi, hoặc site đích phản hồi lỗi server. Tiếp tục khi lỗi chặn đã được ghi nhận và bộ smoke 10 test case Pass.

---

## 6. Môi trường, công cụ và dữ liệu kiểm thử

### 6.1 Môi trường

| Môi trường | Mô tả | Quản lý |
|---|---|---|
| Máy cá nhân | Mỗi thành viên có máy riêng; Chrome + Firefox + Edge cài sẵn | Từng thành viên |
| Test chung | Tập trung trong repo; script Playwright chạy trên máy CI hoặc máy cá nhân | Mạnh |

Không có môi trường staging: mọi kiểm thử diễn ra trên production của site đích, với giới hạn tần suất và mức thâm nhập đã chốt ở ADR-11.

### 6.2 Công cụ

| Mục đích | Công cụ | Phụ trách |
|---|---|---|
| Quản lý công việc và lỗi | GitHub Issues hoặc Trello | Lộc |
| Quản lý test case, RTM | CSV trong repo (`docs/testcases/*.csv`) + Google Sheets | Mạnh |
| E2E trình duyệt | Playwright (TypeScript) | Tài (hạ tầng), mỗi người viết script cho site mình |
| API test | Postman + Newman | Ngân |
| Hiệu năng, A11y, SEO | Lighthouse CLI | Ngân, Lộc |
| Tải đọc | k6 hoặc autocannon | Ngân |
| Khả năng tiếp cận | axe-core | Lộc |
| Bảo mật | HTTP client (curl/Node fetch), openssl | Mạnh |
| Mã nguồn và CI | GitHub | Tài |

### 6.3 Dữ liệu kiểm thử

- Số điện thoại dùng để kiểm thử validation: dùng số giả **không thuộc số thật của người dùng** và không gửi đi (chỉ kiểm tra phản hồi client-side và phản hồi server không ghi nhận).
- Bộ giá trị cân nặng phủ mọi bậc và biên của T1, T2, T3: 0, 2.9, 3, 3.1, 5, 6, 10, 15, 20, 25, 30, 40, 40.1 kg — ánh xạ sang lbs khi cần (1 kg ≈ 2,20462 lb).
- Danh sách 6 dịch vụ "báo giá riêng" của T2.
- Bộ 6 mốc khoảng cách cho phụ thu T1: 0, 5, 6, 10, 15, 20 km.
- Ngày mong muốn: hôm nay, ngày mai, +7 ngày, +31 ngày, ngày trong quá khứ.
- Từ khoá tìm kiếm: "spa", "SPA", "grooming", "tắm", chuỗi không tồn tại, chuỗi rỗng, chuỗi 200 ký tự.

---

## 7. Vai trò và trách nhiệm

Người viết và người chạy test case cho một hệ thống không phải người phụ trách chính hệ thống đó (tính độc lập).

| Thành viên | Hệ thống phụ trách | Viết và chạy test cho | Chuyên trách | TC dự kiến |
|---|---|---|---|---|
| Mạnh (Test Lead) | T1 Pet NGON | T3 + NFR-02 | Test Plan, RTM, điều phối Inspection, Final Test Report, Exit criteria, test bảo mật | 57 |
| Tài | T2 Mật Pet | T1 + NFR-03, NFR-04 | Hạ tầng repo, Playwright, Postman/Newman, Lighthouse, phân tích tĩnh tài liệu, test khả năng dùng và tương thích | 64 |
| Ngân | T3 Pretty Paws | T2 + NFR-01, NFR-05 | Thiết kế DT/ST, test hiệu năng và độ tin cậy, tự động hóa regression | 62 |
| Lộc | Đối chiếu cả 3 site | T2 (đối chiếu) + một phần T1 | Quản lý lỗi và triage, test khả năng tiếp cận NFR-06, SEO NFR-07, UAT, slide demo | 43 |

Tổng 226 test case dự kiến (72 ca T1, 66 ca T2, 44 ca T3, 44 ca NFR áp dụng cho cả 3 site) cộng 8 kịch bản UAT. Phân bổ đã cân bằng lại ở Ngày 1 sau khi thiết kế test case; rà lại vào cuối ngày 8 khi bộ test case v1.0 chốt.

---

## 8. Lịch kiểm thử

| Giai đoạn | Ngày | Hoạt động chính | Sản phẩm |
|---|---|---|---|
| 1. Lập kế hoạch và kiểm soát | 1–5, cập nhật suốt dự án | Test Plan v0.1 (ngày 1), v1.0 (ngày 5); theo dõi hằng ngày | TP-01 |
| 2. Phân tích và thiết kế kiểm thử | 3–8 | Inspection SRS đích (3); template test case, RTM khung (5); thiết kế test (4); viết test case (6–8); review chéo (8) | Test case v1.0, RTM, thiết kế test |
| 3. Thực hiện | 9–13 | Chuẩn bị môi trường (9); kiểm thử tích hợp (10); system test vòng 1 (11); re-test + phi chức năng (12); regression + UAT (13) | Execution log, defect log |
| 4. Báo cáo và đánh giá | 13–14 | Chấm Exit criteria (13); Final Test Report (14) | Báo cáo kiểm thử tổng hợp |
| 5. Đóng hoạt động kiểm thử | 14 | Lưu trữ testware, tag repo v1.0, rút kinh nghiệm | Lessons learned |

---

## 9. Quản lý test case và lỗi

### 9.1 Quy ước định danh

Test case: `TC-<HĐ>-M<n>-nnn` trong đó HĐ ∈ {T1, T2, T3}; ví dụ `TC-T2-M3-006`. Lỗi: `DEF-nnn`. Lỗi tìm thấy khi review: `RV-nn`. Dải mã test case theo từng yêu cầu ghi trong RTM-01.

### 9.2 Mẫu test case (ví dụ)

| Trường | Nội dung |
|---|---|
| Test Case ID | TC-T2-M3-006 |
| Yêu cầu | FR-M3-02 |
| Hệ thống đích | T2 Mật Pet Family |
| Mô tả | BVA ngưỡng bậc cân nặng: chọn Chó 3 kg — thuộc bậc `>3–6` |
| Pre-condition | Đang ở trang `matpet.vn/spa`, bước 1 của calculator |
| Các bước | 1. Chọn loài "Chó". 2. Bấm "Tiếp tục". 3. Chọn bậc ">3–6kg". 4. Bấm "Tiếp tục". 5. Chọn "Combo Tắm Vệ Sinh". |
| Expected Output | Giá hiển thị "200.000₫" hoặc "200k", khớp bảng giá cột `>3–6kg` |
| Ưu tiên | Critical |
| Kết quả | Pass, Fail (kèm DEF-nnn) hoặc Blocked |

### 9.3 Mẫu báo cáo lỗi

Mã DEF · tiêu đề · hệ thống đích và FR · test case phát hiện · thời điểm phát hiện · các bước tái hiện · kết quả thực tế so với mong đợi · mức nghiêm trọng · mức ưu tiên · người báo · trạng thái · bằng chứng (ảnh chụp, log mạng, video ngắn).

### 9.4 Vòng đời lỗi

New → Assigned → Open → Fixed → Pending Retest → Retest → Closed. Nếu retest vẫn lỗi thì chuyển Reopened rồi quay lại Open. Vì hệ thống đích do bên thứ ba vận hành, trạng thái "Fixed" nghĩa là **site đích đã thay đổi** và nhóm đã xác nhận. Lộc điều phối buổi triage cuối ngày trong ngày 11–13.

### 9.5 Mức nghiêm trọng

| Mức | Định nghĩa | Ví dụ |
|---|---|---|
| Critical | Tính sai tiền, lộ dữ liệu cá nhân, hệ thống không dùng được, lỗi bảo mật nghiêm trọng | Giá hiển thị 200k nhưng bảng ghi 250k; tên bé hiển thị thẻ HTML thay vì chữ |
| High | Chức năng Must hỏng và không có cách tránh | Không tính được giá; nút "Tiếp tục" cho qua bước bắt buộc |
| Medium | Chức năng hỏng một phần, có cách tránh | Bảng giá không cuộn được trên di động |
| Low | Giao diện, chính tả, lỗi nhỏ | Sai chính tả nhãn nút |

---

## 10. Số đo và báo cáo

| Chỉ số | Cách tính | Mục tiêu |
|---|---|---|
| Độ phủ yêu cầu | Số yêu cầu có ít nhất 1 test case chia cho tổng số yêu cầu | 100% |
| Độ phủ theo hệ thống | Số yêu cầu có test case trên từng hệ thống | 100% |
| Tỷ lệ thực thi | Test case đã chạy chia cho tổng test case | 100% với Critical và High |
| Tỷ lệ Pass | Test case Pass chia cho test case đã chạy | 95% trở lên |
| Phân bố lỗi theo hệ thống | Số lỗi mỗi hệ thống | Theo dõi biểu hiện tích tụ lỗi |
| Phân bố lỗi theo module | Số lỗi mỗi module | Theo dõi biểu hiện tích tụ lỗi |
| Hiệu quả review | Lỗi tìm thấy ở review SRS chia cho tổng lỗi | Báo cáo trong Final Test Report |
| Tỷ lệ Reopened | Lỗi Reopened chia cho lỗi đã Fixed | Không quá 10% |
| Điểm Lighthouse | Trung vị 3 lần chạy, mobile | Performance ≥ 70, Accessibility ≥ 80 |

Báo cáo: họp đứng 15 phút mỗi ngày; bảng trạng thái test cuối ngày trong ngày 11–13; Final Test Report (ngày 14) gồm tóm tắt, thực tế so với kế hoạch, kết quả thực thi, phân tích lỗi, kết quả phi chức năng, rủi ro còn lại, đánh giá theo Exit criteria và bài học kinh nghiệm.

---

## 11. Sản phẩm kiểm thử (testware)

| Sản phẩm | Phụ trách | Hạn |
|---|---|---|
| Test Plan (TP-01) | Mạnh | Ngày 1 (v0.1), ngày 5 (v1.0) |
| Biên bản review SRS, thiết kế test, test case | Scribe xoay vòng | Ngày 3, 5, 8 |
| Test case Specification | Cả nhóm, mỗi người theo hệ thống mình viết | Ngày 8 |
| RTM (RTM-01) | Mạnh, Tài cập nhật cuối | Ngày 8, 13 |
| Báo cáo kiểm thử tích hợp | Mạnh tổng hợp từ 3 site | Ngày 10 |
| Execution log, defect log | Cả nhóm; Lộc quản lý | Ngày 11–12 |
| Kết quả phi chức năng | Theo chuyên trách (mục 4.5) | Ngày 12 |
| Báo cáo regression | Ngân | Ngày 13 |
| Báo cáo UAT | Lộc | Ngày 13 |
| Final Test Report, Lessons learned | Mạnh | Ngày 14 |

---

## 12. Rủi ro dự án và phương án dự phòng

| Rủi ro | Phương án |
|---|---|
| Site đích thay đổi giao diện giữa chừng | Selector theo vai trò/nhãn; smoke hằng ngày; ghi vào defect log; không sửa script "cho xanh" mà ghi lỗi |
| Site đích giới hạn hoặc chặn request tự động | Giảm tần suất, thêm delay giữa các ca, dùng cache cho trang tĩnh; chạy tải ngoài giờ cao điểm |
| Chính sách pháp lý/đạo đức khi kiểm thử site của bên thứ ba | Chỉ đọc, không phá hại (ADR-11); không gửi payload phá hại; không đăng ký tài khoản; ghi rõ trong báo cáo |
| Không đạt được Exit criteria về tỷ lệ Pass | Lỗi phía site đích không sửa được ngay; báo cáo minh bạch tỷ lệ Pass thực tế và phân loại nguyên nhân, không hạ tiêu chí |
| Đội ngũ thiếu kinh nghiệm Playwright/k6 | Chuẩn bị script mẫu sẵn ở ngày 5; mỗi người chạy được bộ smoke trước khi viết ca riêng |
| Test case viết xong mà hiểu biểu diễn sai | Review lại test case ngay sau Technical Review thiết kế |
