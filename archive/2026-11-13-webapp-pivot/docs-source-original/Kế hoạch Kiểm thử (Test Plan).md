# Kế hoạch Kiểm thử (Test Plan)

## Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

Mã tài liệu: TP-01 · Phiên bản 0.1 (chốt v1.0 sau Technical Review thiết kế, ngày 5) · Người phụ trách: Mạnh (Test Lead)

Đầu vào: SRS-01 (test basis), RTM-01 · Căn cứ lý thuyết: Cẩm nang môn Thiết kế và Kiểm thử Phần mềm, ISTQB CTFL · Nhóm: Mạnh, Tài, Ngân, Lộc

## 1. Giới thiệu

### 1.1 Mục đích

Kế hoạch này xác định phạm vi, chiến lược, nguồn lực, lịch và tiêu chí kết thúc của hoạt động kiểm thử, đi theo 5 giai đoạn của quy trình kiểm thử: (1) Lập kế hoạch và kiểm soát, (2) Phân tích và thiết kế, (3) Thực hiện, (4) Báo cáo và đánh giá, (5) Đóng hoạt động kiểm thử.

### 1.2 Mục tiêu kiểm thử

- Tìm càng nhiều lỗi càng sớm càng tốt trong 14 ngày (góc nhìn của Myers).
- Chứng minh hệ thống đáp ứng SRS và cung cấp thông tin rủi ro minh bạch cho nhóm trước khi nộp.
- **Kiểm chứng (Verification)** là “xây dựng hệ thống đúng đặc tả chưa”: rà soát SRS và thiết kế, phân tích tĩnh, kiểm thử đơn vị, tích hợp, hệ thống.
- **Thẩm định (Validation)** là “xây dựng đúng hệ thống người dùng cần chưa”: UAT/Alpha ngày 13.

### 1.3 Bảy nguyên tắc ISTQB áp dụng trong đồ án

| Nguyên tắc | Áp dụng |
| --- | --- |
| Kiểm thử cho thấy sự tồn tại của lỗi | Báo cáo cuối nêu rủi ro còn lại, không tuyên bố “hết lỗi” |
| Không thể kiểm thử kiệt quệ | Chọn test theo rủi ro và kỹ thuật EP, BVA thay vì thử mọi tổ hợp |
| Kiểm thử sớm | Inspection SRS ngày 3; viết test case từ ngày 6, song song với code |
| Tích tụ của lỗi | Gần một nửa số test case dồn vào M4, M5, M6 |
| Nghịch lý thuốc trừ sâu | Sau vòng 1 (ngày 11) rà soát, bổ sung test case mới và 60 phút kiểm thử khám phá |
| Phụ thuộc bối cảnh | Ưu tiên đặt trùng lịch, tính tiền, phân quyền là các rủi ro đặc thù của hệ thống đặt lịch |
| Ngụy biện không có lỗi | UAT ngày 13 để xác nhận hệ thống đúng nhu cầu người dùng |

## 2. Phạm vi kiểm thử

### 2.1 Đối tượng kiểm thử

Các module M1–M7, REST API, giao diện web, cơ sở dữ liệu và hai thành phần giả lập (cổng thanh toán, dịch vụ thông báo); tài liệu SRS, SDD và mã nguồn (kiểm thử tĩnh).

### 2.2 Trong phạm vi

- 40 yêu cầu chức năng FR-Mx-yy và 6 yêu cầu phi chức năng NFR-01 đến NFR-06 trong SRS-01.
- Kiểm thử tĩnh: review SRS, review thiết kế, walkthrough code, phân tích tĩnh tự động.
- Kiểm thử đơn vị, tích hợp, hệ thống, chấp nhận (UAT/Alpha).
- Kiểm thử lại (re-test) và hồi quy (regression).

### 2.3 Ngoài phạm vi

Cổng thanh toán thật; ứng dụng di động native; kiểm thử tải trên 100 người dùng ảo; kiểm thử trên nhiều thiết bị vật lý; kiểm thử khả năng tiếp cận chuyên sâu (WCAG); đa ngôn ngữ. Lý do: giới hạn 14 ngày và 4 người.

## 3. Phân tích rủi ro và ưu tiên kiểm thử

| Rủi ro sản phẩm | Module | Khả năng | Tác động | Mức | Biện pháp |
| --- | --- | --- | --- | --- | --- |
| Đặt trùng lịch, lỗi đồng thời | M4 | Cao | Cao | Rất cao | BVA khung giờ, test đồng thời, tích hợp, white-box `checkSlotConflict` |
| Tính sai giá hoặc khuyến mãi | M6 | Cao | Cao | Rất cao | Bảng quyết định, BVA nhóm cân nặng, coverage nhánh và điều kiện cho `calculatePrice` |
| Chuyển trạng thái hoặc hủy sai chính sách | M5 | Trung bình | Cao | Cao | State transition (cả chuyển không hợp lệ), bảng quyết định hủy |
| Phân quyền sai, lộ dữ liệu KH khác | M1 | Trung bình | Cao | Cao | Test RBAC, kiểm thử bảo mật cơ bản |
| Nhập liệu sai ở biên (cân nặng, giờ, độ dài) | M1–M4 | Cao | Trung bình | Cao | EP và BVA theo SRS mục 7 |
| Thông báo không gửi hoặc gửi sai | M6 | Trung bình | Thấp | Trung bình | Use case, đọc log giả lập |
| Báo cáo sai số liệu | M7 | Thấp | Thấp | Thấp | Use case, đối chiếu dữ liệu |

Test case mức rủi ro Rất cao và Cao được viết và chạy trước. Rủi ro dự án nằm ở mục 12.

## 4. Chiến lược kiểm thử

### 4.1 Các mức kiểm thử (khớp mô hình chữ V)

| Mức | Đối tượng | Người thực hiện | Công cụ | Căn cứ | Thời điểm |
| --- | --- | --- | --- | --- | --- |
| Đơn vị | Hàm, lớp, module | Người code module, viết unit test | Jest | Thiết kế chi tiết | Ngày 6–8 |
| Tích hợp | Giao tiếp giữa module | Cặp: Mạnh (M1↔M4), Tài (M2, M3↔M4), Ngân (M4↔M5), Lộc (M4, M5↔M6) | Postman/Newman, Jest | SDD kiến trúc, OpenAPI | Ngày 10 |
| Hệ thống | Toàn hệ thống theo SRS | Người viết test case (không phải người code) | Thủ công, Postman | SRS | Ngày 11–12 |
| Chấp nhận | Nhu cầu người dùng | 5–8 người ngoài nhóm, Lộc điều phối | Kịch bản use case, phiếu phản hồi | Use case | Ngày 13 |

### 4.2 Chiến lược tích hợp

Dùng Sandwich/Hybrid: tích hợp từ dưới lên cho chuỗi M2, M3 → M4 → M5, dùng Driver (Ngân) khi giao diện chưa sẵn; dùng Stub cho cổng thanh toán và dịch vụ thông báo (Lộc). Không dùng Big Bang vì khó khoanh vùng lỗi khi có sự cố.

### 4.3 Kỹ thuật thiết kế test case

| Kỹ thuật | Đối tượng | Quy tắc áp dụng |
| --- | --- | --- |
| Phân vùng tương đương (EP) | Mọi trường nhập liệu ở SRS mục 7 | Dữ liệu hợp lệ có thể gộp trong một ca; mỗi giá trị không hợp lệ một ca riêng để tránh che lỗi |
| BVA 3 giá trị | Biến có miền số: cân nặng, tuổi, độ dài chuỗi, thời điểm đặt, số dịch vụ | Chọn min−1, min, min+1, max−1, max, max+1 (6n+1 ca cho n biến) |
| Bảng quyết định | Hủy lịch (SRS 8.2), tính giá (BR-18), khuyến mãi (BR-10) | Rút gọn cột bằng dấu “-”; kiểm tra từng cột còn lại |
| Chuyển đổi trạng thái | Vòng đời lịch hẹn (SRS 8.1) | Phủ mọi chuyển hợp lệ và mọi ô ✗ |
| Use case, workflow | UC-01 đến UC-08 | Luồng chính thành công và các luồng rẽ nhánh (với UC-04: A1 đến A5) |
| Hộp trắng (Basis Path) | `checkSlotConflict()`, `calculatePrice()` | Vẽ đồ thị luồng điều khiển, tính V(G), sinh đủ đường độc lập |

Mỗi test case có đủ Test Case ID, Description, Pre-condition, Steps, Expected Output và đạt 4C (đúng đắn, rõ ràng, đầy đủ, nhất quán).

### 4.4 Kiểm thử tĩnh

| Hoạt động | Hình thức | Ngày | Vai trò | Sản phẩm |
| --- | --- | --- | --- | --- |
| Rà soát SRS | Inspection (6 bước, checklist SRS phụ lục A) | 3 | Moderator Mạnh; Reviewer theo vòng Mạnh → Tài → Ngân → Lộc → Mạnh; Scribe xoay vòng | Biên bản, SRS v1.0 |
| Rà soát thiết kế | Walkthrough rồi Technical Review | 5 | Từng tác giả trình bày; mọi người review kỹ thuật | Biên bản, SDD v1.0 |
| Rà soát code | Walkthrough (M4), review chéo theo cặp | 9 | Ngân trình bày, Mạnh điều phối | Danh sách lỗi code |
| Phân tích tĩnh tự động | ESLint, SonarQube: luồng dữ liệu, chuẩn code, code chết, LOC, V(G), Fan-in/Fan-out, Coupling/Cohesion | 9 | Tài | Báo cáo phân tích tĩnh |

### 4.5 Kiểm thử hộp trắng

- Ngân phụ trách phương pháp: vẽ đồ thị luồng điều khiển, tính V(G) = E − N + 2 = P + 1, sinh test case đường độc lập. Ngân thực hiện cho `checkSlotConflict()` và Lộc cho `calculatePrice()` (ngày 8).
- Mục tiêu độ phủ: Statement ≥ 80% và Branch ≥ 70% trên module lõi (M1, M4, M5, M6); hai hàm trên đạt 100% đường độc lập, Branch 100% và Condition coverage cho các điều kiện ghép.

### 4.6 Kiểm thử phi chức năng

| Yêu cầu | Nội dung | Công cụ | Người | Ngày |
| --- | --- | --- | --- | --- |
| NFR-01 Hiệu năng | 50–100 người dùng ảo tìm slot và tạo lịch | k6 hoặc JMeter | Lộc | 12 |
| NFR-02 Bảo mật | SQL injection, XSS, truy cập chéo dữ liệu, quyền | Thủ công, OWASP ZAP | Mạnh | 12 |
| NFR-03 Usability | Số bước đặt lịch, thông báo lỗi, responsive | Thủ công, UAT | Tài | 12–13 |
| NFR-04 Độ tin cậy | Hai yêu cầu đồng thời cùng slot; lỗi thanh toán giữa chừng | Script song song | Ngân | 12 |
| NFR-05 Tương thích | Chrome, Firefox, Edge, trình duyệt di động | Thủ công | Tài | 12 |
| NFR-06 Bảo trì | ESLint, V(G), coverage | Sonar, Jest | Tài | 9, 13 |

### 4.7 Kiểm thử liên quan đến thay đổi

- **Re-test:** chạy lại đúng test case đã thất bại sau khi lỗi chuyển sang Fixed.
- **Regression:** chạy bộ smoke và API (Postman/Newman) sau mỗi đợt sửa lỗi lớn (ngày 12) và toàn bộ vào ngày 13; Ngân xây dựng và chạy.

### 4.8 Tự động hóa

Unit test (Jest) cho mọi hàm lõi; bộ API regression cho các yêu cầu Must. Giao diện kiểm thử thủ công do giới hạn thời gian.

## 5. Tiêu chí vào, kết thúc, tạm dừng

### 5.1 Tiêu chí vào (Entry criteria)

| Mức | Điều kiện |
| --- | --- |
| Đơn vị | SDD chi tiết (API, ERD) đã baseline; module build được |
| Tích hợp | Unit test của hai module đều Pass; Stub và Driver sẵn sàng; build ổn định |
| Hệ thống | Tích hợp xong, không còn lỗi Critical mở; môi trường test và dữ liệu mẫu sẵn sàng; test case v1.0 đã review chéo |
| Chấp nhận | System test đạt Exit criteria; bản build đóng băng; kịch bản UAT sẵn sàng |

### 5.2 Tiêu chí kết thúc (Exit criteria, kiểm tra ngày 13)

- 100% yêu cầu Must có ít nhất 1 test case (RTM).
- 100% test case ưu tiên Critical và High đã thực thi; tỷ lệ Pass ≥ 95%.
- 0 lỗi Critical hoặc High còn mở; mọi lỗi đi qua đủ vòng đời lỗi.
- Statement coverage ≥ 80% và Branch coverage ≥ 70% trên module lõi; hai hàm có Basis Path đạt 100% đường độc lập.
- UAT không có phản hồi chặn.

### 5.3 Tạm dừng và tiếp tục

Tạm dừng khi build không chạy được, hoặc từ 30% test case bị chặn bởi một lỗi, hoặc môi trường test hỏng. Tiếp tục khi lỗi chặn đã sửa và bộ smoke 10 test case Pass.

## 6. Môi trường, công cụ và dữ liệu kiểm thử

### 6.1 Môi trường

| Môi trường | Mô tả | Quản lý |
| --- | --- | --- |
| Dev | Máy cá nhân, cơ sở dữ liệu riêng của từng người | Từng thành viên |
| Test / UAT | Một máy chủ chung, cơ sở dữ liệu tách biệt, build cập nhật theo ngày và đóng băng từ ngày 13 | Mạnh |

### 6.2 Công cụ

| Mục đích | Công cụ | Phụ trách |
| --- | --- | --- |
| Quản lý công việc và lỗi | Jira hoặc Trello | Lộc |
| Quản lý test case, RTM | Google Sheets hoặc TestLink | Mạnh |
| Unit test, coverage | Jest | Tài tổng hợp báo cáo |
| API test, regression | Postman, Newman | Ngân |
| Phân tích tĩnh | ESLint, SonarQube | Tài |
| Hiệu năng | k6 hoặc JMeter | Lộc |
| Bảo mật cơ bản | OWASP ZAP, kiểm tra thủ công | Mạnh |
| Mã nguồn và CI | GitHub | Tài |

### 6.3 Dữ liệu kiểm thử

- Tài khoản mẫu: 5 KH (trong đó 2 VIP), 3 NV, 1 AD.
- Thú cưng phủ đủ 4 nhóm cân nặng (S, M, L, XL), lông ngắn và lông dài, cả chó và mèo; thêm các giá trị biên 4.9, 5, 14.9, 15, 29.9, 30 kg.
- 6–8 dịch vụ với thời lượng khác nhau; mã khuyến mãi hợp lệ, hết hạn, đơn chưa đạt giá trị tối thiểu.
- Script seed để đưa cơ sở dữ liệu về trạng thái ban đầu trước mỗi vòng kiểm thử.
- Các mốc 2 giờ, 12 giờ, 24 giờ, 30 phút tính theo thời gian hiện tại, nên hệ thống cần đồng hồ giả lập (mock clock) để kiểm đúng biên.

## 7. Vai trò và trách nhiệm

Người viết và chạy test case của một module không phải người code module đó (tính độc lập).

| Thành viên | Code | Viết và chạy test case | Chuyên trách | TC dự kiến |
| --- | --- | --- | --- | --- |
| Mạnh (Test Lead) | M1, M7 | M2, M3, NFR-02 | Test Plan, RTM, điều phối Inspection, Final Test Report, kiểm tra Exit criteria, test bảo mật | 44 |
| Tài | M2, M3 | M4, M5, NFR-03, NFR-05 | Hạ tầng repo, ESLint, Jest, Sonar; phân tích tĩnh; báo cáo coverage; test usability, tương thích | 55 |
| Ngân | M4, M5 | M6, NFR-04 | Kiểm thử hộp trắng, test độ tin cậy (đồng thời), automation regression | 35 |
| Lộc | M6 | M1, M7, NFR-01 | Quản lý lỗi và triage, test hiệu năng, UAT/Alpha, wireframe UI, slide demo | 41 |

Tổng 175 test case dự kiến. Số test case của Ngân thấp hơn vì Ngân gánh thêm hộp trắng và automation; xem lại cân bằng tải ở cuối ngày 8.

## 8. Lịch kiểm thử

| Giai đoạn | Ngày | Hoạt động chính | Sản phẩm |
| --- | --- | --- | --- |
| 1. Lập kế hoạch và kiểm soát | 1–5, cập nhật suốt dự án | Test Plan v0.1 (ngày 1), v1.0 sau Technical Review thiết kế (ngày 5); theo dõi hằng ngày | TP-01 |
| 2. Phân tích và thiết kế kiểm thử | 3–8 | Inspection SRS (3); template test case, RTM khung (5); viết test case từ SRS (6–8); review chéo test case, RTM đủ 100% FR (8) | Test case v1.0, RTM |
| 3. Thực hiện | 6–13 | Unit test (6–8); phân tích tĩnh (9); tích hợp (10); system test vòng 1 (11); fix, re-test, phi chức năng (12); regression, UAT (13) | Execution log, defect log |
| 4. Báo cáo và đánh giá | 13–14 | Kiểm tra Exit criteria; coverage cuối; Final Test Report | Báo cáo kiểm thử tổng hợp |
| 5. Đóng hoạt động kiểm thử | 14 | Lưu trữ testware, tag repo v1.0, rút kinh nghiệm | Lessons learned |

## 9. Quản lý test case và lỗi

### 9.1 Quy ước định danh

Test case: TC-Mx-nnn (module) hoặc TC-NF-nnn (phi chức năng). Lỗi: DEF-nnn. Lỗi tìm thấy khi review: RV-nn. Dải mã test case theo từng yêu cầu ghi trong RTM-01.

### 9.2 Mẫu test case (ví dụ)

| Trường | Nội dung |
| --- | --- |
| Test Case ID | TC-M2-006 |
| Yêu cầu | FR-M2-01 |
| Mô tả | BVA cân nặng: nhập 0.4 kg (min − 1) phải bị từ chối |
| Pre-condition | KH đã đăng nhập, đang ở form thêm thú cưng, các trường khác hợp lệ |
| Các bước | 1. Nhập cân nặng 0.4. 2. Bấm Lưu |
| Expected Output | Báo lỗi “Cân nặng phải từ 0.5 đến 50 kg”, không lưu thú cưng |
| Ưu tiên | High |
| Kết quả | Pass, Fail (kèm DEF-nnn) hoặc Blocked |

### 9.3 Mẫu báo cáo lỗi

Mã DEF · tiêu đề · module và FR · test case phát hiện · build, môi trường · các bước tái hiện · kết quả thực tế so với mong đợi · mức nghiêm trọng · mức ưu tiên · người báo · người sửa · trạng thái · bằng chứng (ảnh, log).

### 9.4 Vòng đời lỗi

New → Assigned → Open → Fixed → Pending Retest → Retest → Closed. Nếu retest vẫn lỗi thì chuyển Reopened rồi quay lại Open. Lộc điều phối buổi triage cuối ngày trong ngày 11–13 để gán người sửa và chốt mức nghiêm trọng.

### 9.5 Mức nghiêm trọng

| Mức | Định nghĩa | Ví dụ |
| --- | --- | --- |
| Critical | Mất dữ liệu, tính sai tiền, đặt trùng lịch, lỗi bảo mật, hệ thống sập | Hai KH cùng đặt thành công một slot |
| High | Chức năng Must hỏng và không có cách tránh | Không đăng nhập được |
| Medium | Chức năng hỏng một phần, có cách tránh | Bộ lọc dịch vụ sai kết quả |
| Low | Giao diện, chính tả, lỗi nhỏ | Sai chính tả nhãn |

## 10. Số đo và báo cáo

| Chỉ số | Cách tính | Mục tiêu |
| --- | --- | --- |
| Độ phủ yêu cầu | Số yêu cầu có ít nhất 1 test case chia cho tổng số yêu cầu | 100% |
| Tỷ lệ thực thi | Test case đã chạy chia cho tổng test case | 100% với Critical và High |
| Tỷ lệ Pass | Test case Pass chia cho test case đã chạy | 95% trở lên |
| Statement / Branch coverage | Theo báo cáo Jest | 80% / 70% trên module lõi |
| Phân bố lỗi theo module | Số lỗi mỗi module | Theo dõi biểu hiện tích tụ lỗi |
| Hiệu quả review | Lỗi tìm thấy ở review SRS và SDD chia cho tổng lỗi | Báo cáo trong Final Test Report |
| Tỷ lệ Reopened | Lỗi Reopened chia cho lỗi đã Fixed | Không quá 10% |

Báo cáo: họp đứng 15 phút mỗi ngày; bảng trạng thái test cuối ngày trong ngày 11–13; Final Test Report (ngày 14) gồm tóm tắt, thực tế so với kế hoạch, kết quả thực thi, coverage, phân tích lỗi, rủi ro còn lại, đánh giá theo Exit criteria và bài học kinh nghiệm.

## 11. Sản phẩm kiểm thử (testware)

| Sản phẩm | Phụ trách | Hạn |
| --- | --- | --- |
| Test Plan (TP-01) | Mạnh | Ngày 1 (v0.1), ngày 5 (v1.0) |
| Biên bản review SRS, SDD, code | Scribe xoay vòng | Ngày 3, 5, 9 |
| Test case Specification | Cả nhóm, mỗi người theo module mình viết | Ngày 8 |
| RTM (RTM-01) | Mạnh, Tài cập nhật cuối | Ngày 8, 13 |
| Báo cáo phân tích tĩnh | Tài | Ngày 9 |
| Unit test, báo cáo coverage | Từng dev; Tài tổng hợp | Ngày 8, 13 |
| Báo cáo kiểm thử tích hợp | Mạnh tổng hợp từ 4 cặp | Ngày 10 |
| Execution log, defect log | Cả nhóm; Lộc quản lý | Ngày 11–12 |
| Kết quả phi chức năng | Theo chuyên trách (mục 4.6) | Ngày 12 |
| Báo cáo regression | Ngân | Ngày 13 |
| Báo cáo UAT | Lộc | Ngày 13 |
| Final Test Report, Lessons learned | Mạnh | Ngày 14 |

## 12. Rủi ro dự án và phương án dự phòng

| Rủi ro | Phương án |
| --- | --- |
| SRS thay đổi giữa chừng | Kiểm soát thay đổi (SRS mục 10.C): cập nhật RTM và test case trong 1 ngày |
| Môi trường test không ổn định | Script seed và triển khai tự động; build cố định theo ngày |
| Một lỗi Blocker chặn nhiều test case | Áp dụng tiêu chí tạm dừng (mục 5.3); sửa trong ngày |
| Thiếu thời gian viết test case | Viết theo mức rủi ro: Rất cao và Cao trước, Thấp sau |
| Thành viên vắng | Cặp bù trừ: Mạnh–Lộc, Tài–Ngân; bàn giao việc dở trong họp đứng |
| Test viết xong mà code đổi lớn | Review lại test case ngay sau khi Technical Review thiết kế thay đổi |

## 
