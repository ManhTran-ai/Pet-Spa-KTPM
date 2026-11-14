# &#32;Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

## 

## 1. Phạm vi hệ thống (phân loại MoSCoW)

Có 3 actor: Khách hàng, Nhân viên/Groomer, Admin.

| Mã | Module | Mức |
| --- | --- | --- |
| M1 | Tài khoản và phân quyền (đăng ký, đăng nhập, RBAC) | Must |
| M2 | Hồ sơ thú cưng (loài, giống, tuổi, cân nặng, ghi chú sức khỏe) | Must |
| M3 | Danh mục dịch vụ và bảng giá theo cân nặng / loài | Must |
| M4 | Đặt lịch (chọn dịch vụ, nhân viên, khung giờ, chống trùng lịch) | Must |
| M5 | Vòng đời lịch hẹn (Pending → Confirmed → In-Progress → Completed / Cancelled / No-show), đổi/hủy lịch | Must |
| M6 | Tính giá, khuyến mãi, hóa đơn (cổng thanh toán giả lập), nhắc lịch | Should |
| M7 | Quản trị (dịch vụ, nhân viên, báo cáo cơ bản) | Should/Could |

Gợi ý công nghệ: React + Node/Express + MySQL/PostgreSQL, Jest (unit), Postman/Newman (API), ESLint + SonarQube (phân tích tĩnh), Jira/Trello, Google Sheets hoặc TestLink (test case), GitHub.&#32;

## 3. Chiến lược kiểm thử (bám tài liệu)

**V-model:** SRS ↔ System/Acceptance Test; Thiết kế kiến trúc ↔ Integration Test; Thiết kế chi tiết ↔ Unit Test.

**Kỹ thuật áp dụng vào từng chức năng:**

| Kỹ thuật | Áp dụng cho |
| --- | --- |
| Phân vùng tương đương + BVA 3 giá trị (6n+1) | Cân nặng, tuổi thú cưng, SĐT, email, mật khẩu, độ dài tên, khung giờ đặt |
| Bảng quyết định (có gộp cột "-") | Chính sách hủy/hoàn cọc, tính giá và khuyến mãi (VIP, mã giảm, phụ phí giống lớn) |
| Chuyển đổi trạng thái (sơ đồ + bảng, gồm cả chuyển không hợp lệ) | Vòng đời lịch hẹn (M5) |
| Use case / Workflow (luồng chính + luồng rẽ nhánh, E2E) | Đặt lịch → xác nhận → hoàn thành → thanh toán |
| Hộp trắng: Basis Path, V(G) = E−N+2 = P+1, Statement/Branch/Condition coverage | Hàm `checkSlotConflict()` và `calculatePrice()`; đo coverage toàn bộ code lõi |
| Kiểm thử tĩnh: Informal / Walkthrough / Technical Review / Inspection | Inspection cho SRS (ngày 3), Technical Review cho thiết kế (ngày 5), walkthrough code (ngày 9) |
| Phân tích tĩnh tự động (data flow, chuẩn code, LOC, Fan-in/out, Coupling/Cohesion) | Ngày 9, toàn bộ code |
| Phi chức năng (hiệu năng, bảo mật, usability, reliability) | Ngày 12 |
| Re-test / Regression | Ngày 12–13 |

**Nguyên tắc ca kiểm thử:** mỗi test case có đủ ID, Description, Pre-condition, Steps, Expected Output, và đạt 4C (Correctness, Clarity, Completeness, Consistency). Test không hợp lệ phải tách riêng từng ca để tránh Defect masking. **Người viết và chạy test cho một module không phải người code module đó** (tính độc lập).

**Ví dụ nhanh để cả nhóm thống nhất cách làm:**

- *BVA cân nặng hợp lệ 0.5–50 kg (bước 0.1):* {0.4, 0.5, 0.6, 49.9, 50, 50.1}. Các lớp không hợp lệ (âm, 0, chữ, rỗng) mỗi giá trị một ca riêng.
- *Bảng quyết định hủy lịch* (các quy tắc cọc và phí là giả định, nhóm tự chốt trong SRS):

## 4. Phân công

Mỗi người chịu trách nhiệm bốn phần: tài liệu, code, viết/chạy test chéo, một mảng chuyên trách.

|  | Code module | Viết và chạy test cho (không phải của mình) | Mảng chuyên trách |
| --- | --- | --- | --- |
| **Mạnh** (Trưởng nhóm / Test Lead) | M1, M7 | M2, M3 | Test Plan, RTM, điều phối Inspection, Final Test Report, kiểm tra Exit criteria, test bảo mật |
| **Tài** | M2, M3 | M4, M5 | Hạ tầng repo/ESLint/Jest/Sonar, phân tích tĩnh, coverage report, test usability/tương thích |
| **Ngân** | M4, M5 | M6 | Kiểm thử hộp trắng (CFG, V(G), coverage), test reliability (đặt trùng giờ đồng thời), automation regression |
| **Lộc** | M6 | M1, M7 | Quản lý lỗi (Defect Life Cycle, triage), test hiệu năng, UAT/Alpha, thiết kế UI/wireframe, slide demo |

Vai trò trong Inspection (ngày 3) luân phiên: Moderator = TV1, Scribe xoay vòng, mỗi người review module của người kế tiếp (TV1→TV2→TV3→TV4→TV1).

## 5. Lịch 14 ngày

| Ngày | Mạnh | Tài&#32; | Ngân&#32; | Lộc | Sản phẩm |
| --- | --- | --- | --- | --- | --- |
| **1** | Kick-off, chốt Hướng 1, backlog + MoSCoW, mở Jira; Test Plan v0.1,Dựng repo, quy ước Git, | &#32;ESLint/Jest; SRS §1–2 (mục đích, phạm vi, actor) | Use Case diagram + đặc tả UC đặt/đổi/hủy lịch | Khảo sát nghiệp vụ spa (3–5 tiệm), glossary, UC thanh toán | Backlog, UC, Test Plan v0.1 |
| **2** | SRS: FR + NFR (bảo mật, hiệu năng) cho M1, M7 | SRS: FR M2, M3 + ràng buộc dữ liệu (min/max, kiểu, độ dài) | SRS: FR M4, M5 + quy tắc slot, giờ làm, hủy | SRS: FR M6 + quy tắc giá, khuyến mãi | SRS bản nháp (có ID FR/NFR) |
| **3** | Moderator Inspection, ghép SRS v1.0 | Reviewer SRS của TV3 | Reviewer SRS của TV4 | Reviewer SRS của TV1 | Biên bản review, SRS v1.0 |
| **4** | Kiến trúc tổng thể + đặc tả API (OpenAPI) | ERD + DB schema | Activity/Sequence đặt lịch + State diagram lịch hẹn | Wireframe toàn bộ luồng + sequence thanh toán | SDD v0.9 |
| **5** | Technical Review thiết kế, chốt SDD v1.0; Test case template (đủ 5 trường, 4C), khung RTM | Reviewer; dựng DB + seed data; bắt đầu code M2/M3 | Reviewer; bắt đầu code M4 | Reviewer; dựng khung UI + routing | SDD v1.0, template TC, RTM khung |
| **6** | Code M1 (đăng ký/đăng nhập/JWT/RBAC). Test: viết TC M2, M3 (EP + BVA) | Code CRUD thú cưng, dịch vụ + bảng giá. Test: TC M4, M5 (EP/BVA giờ, use case) | Code API tạo lịch + kiểm tra trùng slot. Test: TC M6 (EP/BVA, bảng quyết định giá) | Code tính giá/khuyến mãi + UI khung. Test: TC M1, M7 (EP/BVA mật khẩu, SĐT; phân quyền) | Code sprint 1, TC bản nháp |
| **7** | Code M7 + UI đăng nhập. Test: TC M2, M3 (use case, workflow) | Code UI M2, M3. Test: TC M4, M5 (state transition, bảng quyết định hủy lịch) | Code máy trạng thái lịch hẹn, đổi/hủy. Test: TC M6 (use case thanh toán, E2E) | Code hóa đơn + UI M6. Test: TC M1, M7 (use case) | Code sprint 1, TC bản nháp |
| **8** | Unit test M1, M7; review chéo TC (người review ≠ người viết); RTM ánh xạ 100% FR | Unit test M2, M3; review TC | Unit test M4, M5; Basis Path `checkSlotConflict` (CFG, V(G), đường độc lập) | Unit test M6; Basis Path `calculatePrice`; review TC | Code sprint 1 + unit test, TC v1.0, RTM |
| **9** | Chuẩn bị môi trường + test data; walkthrough code M4 | Phân tích tĩnh toàn code (ESLint, Sonar, LOC, cyclomatic, Fan-in/out) + báo cáo | Sửa cảnh báo M4, M5; viết Driver cho bottom-up | Code nhắc lịch (giả lập) + Stub cổng thanh toán | Báo cáo phân tích tĩnh |
| **10** | Integration M1↔M4 (phân quyền khi đặt lịch) | Integration M2, M3↔M4 (thú cưng + dịch vụ → đặt lịch) | Integration M4↔M5 | Integration M4/M5↔M6 (dùng Stub) | Báo cáo kiểm thử tích hợp (Bottom-up/Sandwich) |
| **11** | System Test vòng 1: chạy TC M2, M3, log lỗi | Chạy TC M4, M5 | Chạy TC M6 | Chạy TC M1, M7; triage lỗi cuối ngày | Execution log, defect log |
| **12** | Fix lỗi + Re-test; test bảo mật (SQLi, XSS, IDOR) | Fix + Re-test; test usability, responsive, trình duyệt | Fix + Re-test; test đặt trùng giờ đồng thời (race condition) | Fix + Re-test; test hiệu năng (50–100 user ảo) | Kết quả phi chức năng |
| **13** | Kiểm tra Exit criteria; feature freeze | Coverage report cuối; cập nhật RTM | Automation suite regression (smoke + API); chạy Regression | Tổ chức UAT/Alpha với 5–8 người ngoài nhóm, thu phản hồi | Regression report, UAT feedback |
| **14** | Final Test Report, Lessons learned | Đóng gói hồ sơ (Test Closure), tag repo v1.0 | Script + video demo | Slide, thuyết trình | Hồ sơ nộp, demo |

## 6. Sản phẩm nộp và tiêu chí kết thúc

**Hồ sơ:** SRS · SDD (UML, ERD, wireframe) · Test Plan · Test Case Specification (≈150–200 ca, mỗi người ≈40–50) · RTM · Review records · Static analysis report · Unit test + coverage report · Integration test report · Execution log · Defect log · Regression/UAT report · Final Test Report · Source code · Slide + demo.

**Exit criteria (chốt trong Test Plan, kiểm tra ngày 13):**

- 100% yêu cầu Must có ít nhất 1 test case (RTM).
- 100% test case ưu tiên Critical/High đã thực thi; tỷ lệ Pass ≥ 95%.
- 0 lỗi Critical/High còn mở; mọi lỗi đều đi qua đủ Defect Life Cycle (New → … → Closed).
- Unit test: Statement coverage ≥ 80%, Branch coverage ≥ 70% trên module lõi; hai hàm có Basis Path đạt 100% đường độc lập.
- UAT không có phản hồi chặn.

## 7. Rủi ro và quy tắc làm việc

| Rủi ro | Cách xử lý |
| --- | --- |
| Phạm vi phình to | Chỉ cắt từ nhóm Could/Should (M7, nhắc lịch); Must không đụng |
| Tích hợp muộn | Merge lên nhánh chính hằng ngày; ngày 10 là hạn cứng để tích hợp |
| Một người trễ tiến độ | Họp đứng 15 phút mỗi ngày; việc chậm hơn 1 ngày thì chia lại ngay |
| Test viết sau khi code nên "chạy theo code" | Test case viết từ SRS và thiết kế (ngày 6–8), không đọc code của người được test |
| Lệch nhau về thuật ngữ và định dạng | Dùng chung template và glossary (nguyên tắc Consistency trong 4C) |

## 
