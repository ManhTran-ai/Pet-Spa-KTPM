# Chuẩn kiểm thử (testing-standards)

Mục lục: 1 Test case · 2 Kỹ thuật và cách phân bổ · 3 Hộp trắng (Basis Path) · 4 Review và Inspection · 5 Phân tích tĩnh · 6 Kiểm thử tích hợp · 7 Kiểm thử hệ thống, hồi quy, khám phá · 8 Script kiểm tra · 9 Phi chức năng · 10 Lỗi, số đo, Exit criteria · 11 Báo cáo cuối

Bám TP-01 và cẩm nang môn học: V-model, kiểm thử tĩnh trước kiểm thử động, EP/BVA/bảng quyết định/chuyển trạng thái/use case/hộp trắng, tích hợp Sandwich, vòng đời lỗi.

## 1. Test case

### 1.1 Định dạng `docs/testcases/<module>.csv` (UTF-8 có BOM để Excel mở đúng tiếng Việt)

Cột cố định, đúng thứ tự:
`tc_id, req_id, module, title, technique, level, priority, type, precondition, steps, test_data, expected, execution, automated_ref, author, executor, status, defect_id, run_date, build`

- `tc_id`: `TC-Mx-nnn` hoặc `TC-NF-nnn`, nằm trong dải của RTM-01. `req_id`: đúng một yêu cầu.
- `technique`: `EP`, `BVA`, `DT`, `ST`, `UC`, `WB`, hoặc tên loại phi chức năng. `level`: `U`, `I`, `S`, `A`.
- `priority`: `Critical`, `High`, `Medium`, `Low`, suy từ mức rủi ro ở TP-01 §3 (rủi ro Rất cao → Critical/High, Cao → High, Trung bình → Medium, Thấp → Low).
- `type`: `positive` hoặc `negative`. `execution`: `auto` hoặc `manual`. `automated_ref`: đường dẫn file test và tên test (rỗng nếu `manual`).
- `author`: người viết (vai TESTER). `executor`: người chạy. `status`: `Designed` → `Not run` → `Pass` | `Fail` | `Blocked`. `status` chỉ do `tc:sync` hoặc `tc:record` đổi, không sửa tay.
- Ô nhiều dòng (steps) dùng dấu ngoặc kép và ` | ` ngăn bước, ví dụ `1. Nhập ... | 2. Bấm Lưu`.

### 1.2 Chất lượng mỗi test case (4C)

- **Correctness:** Expected suy từ SRS (có trích FR/BR), không suy từ code.
- **Clarity:** bước cụ thể, dữ liệu cụ thể (giá trị thật, không "nhập giá trị hợp lệ").
- **Completeness:** đủ ID, Description (`title`), Pre-condition, Steps, Expected Output.
- **Consistency:** cùng thuật ngữ với glossary, cùng định dạng, mã lỗi HTTP và thông báo khớp SRS §3.2.
- Test không hợp lệ: **mỗi giá trị không hợp lệ một ca riêng** (tránh Defect masking). Dữ liệu hợp lệ gộp được trong một ca.
- Mỗi test tự động: tên bắt đầu bằng `[TC-Mx-nnn]`; một test một `tc_id`. Biến thể dạng bảng (`test.each`) dùng `[TC-M5-023#Completed+Cancel]`; mỗi biến thể là một test độc lập, báo cáo riêng.

### 1.3 Quy mô và ưu tiên viết

Tổng ≈ 175 test case (RTM-01). **Dải mã trong RTM là mức tối thiểu ràng buộc.** Nếu kỹ thuật cần thêm ca để phủ đủ (ví dụ thêm một giá trị biên), mở rộng dải theo thứ tự tiếp theo, cập nhật RTM và ghi vào `docs/change-requests.md`; không bỏ bớt phủ để vừa số lượng. Viết theo mức rủi ro: Rất cao và Cao trước (M4, M6, M5, M1), Thấp sau.

## 2. Kỹ thuật và cách phân bổ

- **EP:** chia miền theo SRS §7 (hợp lệ, dưới min, trên max, sai kiểu, rỗng, ký tự đặc biệt). Hợp lệ gộp một ca; mỗi lớp không hợp lệ một ca.
- **BVA 3 giá trị:** mỗi biên lấy min−1, min, min+1, max−1, max, max+1 (6n+1 cho n biến). Biến dạng thập phân dùng bước 0.1 (cân nặng 0.4, 0.5, 0.6, 49.9, 50, 50.1). Biên thời gian dùng `Clock` giả: 1 giờ 59 phút 59 giây, 2 giờ, 2 giờ 1 giây; 29 ngày 23 giờ 59 phút, 30 ngày, 30 ngày 1 phút; 11 giờ 59 phút, 12 giờ; 23 giờ 59 phút, 24 giờ; 29 phút 59 giây, 30 phút 1 giây.
- **Bảng quyết định (DT):** lập bảng trong CSV phần `steps` hoặc trong `docs/testcases/dt-*.md`, gộp cột bằng "-", mỗi cột còn lại một ca. Cần bảng cho: hủy lịch (SRS §8.2, 5 cột), tính giá (loại thú × lông dài × số dịch vụ × VIP × mã), khuyến mãi (mã hợp lệ, hết hạn, chưa đạt tối thiểu, đã tắt, VIP đè mã hay mã đè VIP).
- **Chuyển đổi trạng thái (ST):** vẽ sơ đồ (`docs/design/states.md`) và bảng; mọi chuyển hợp lệ một ca (M5-01); mọi ô ✗ là một biến thể `test.each` độc lập (M5-07, M1-06 cho trạng thái khóa tài khoản).
- **Use case (UC):** luồng chính và mọi luồng rẽ nhánh (UC-04: A1 đến A5). Đầu cuối: đặt lịch → xác nhận → bắt đầu → hoàn thành → hóa đơn.
- **Ví dụ phân bổ cần theo:**
  - FR-M3-02 (6 ca) = 6 giá trị quanh 3 biên nhóm cân nặng: 4.9→S, 5.0→M, 14.9→M, 15.0→L, 29.9→L, 30.0→XL.
  - FR-M5-04 (6 ca) = R1 đến R5 (mỗi cột bảng 8.2 một ca) + một ca đúng biên 24 giờ.
  - FR-M4-04 (4 ca) = đúng 2 giờ (chấp nhận), 1 giờ 59 phút (từ chối), đúng 30 ngày (chấp nhận), 30 ngày 1 phút (từ chối).
  - FR-M6-01 (8 ca) = bảng quyết định tính giá + BVA nhóm cân nặng; kỳ vọng tính tay theo công thức BR-18 và ghi cách tính trong `steps`.

## 3. Hộp trắng (Basis Path)

Áp dụng cho `checkSlotConflict()` (Ngân) và `calculatePrice()` (Lộc), Ngày 8. Tài liệu `docs/whitebox/<hàm>.md` gồm:

1. Mã nguồn hàm (trích từ `server/src/domain`).
2. Đánh số nút, vẽ đồ thị luồng điều khiển (CFG) bằng Mermaid; liệt kê cạnh.
3. Tính V(G) bằng **ba cách** và đối chiếu: `E − N + 2`, `P + 1` (P = số nút điều kiện), số vùng khép kín. Ba kết quả phải bằng nhau.
4. Liệt kê đủ V(G) đường độc lập; mỗi đường: chuỗi nút, điều kiện đi qua, dữ liệu vào, kết quả mong đợi.
5. Bảng ánh xạ đường → `tc_id` (kỹ thuật `WB`), và test Jest tương ứng.
6. Bằng chứng coverage từ Jest: **Statement, Branch, và Condition** cho điều kiện ghép (ví dụ `promo && subtotal >= minOrder`). Mục tiêu hai hàm: 100% đường độc lập, Branch 100%.

Quan hệ độ phủ: phủ Condition mạnh hơn phủ Branch, phủ Branch mạnh hơn phủ Statement. V(G) của hàm lõi không quá 10 (NFR-06, ESLint `complexity`).

## 4. Review và Inspection (kiểm thử tĩnh)

Bốn hình thức: Informal, Walkthrough, Technical Review, Inspection. Dùng: Inspection cho SRS (Ngày 3), Walkthrough rồi Technical Review cho thiết kế (Ngày 5), Walkthrough cho code M4 (Ngày 9), review chéo test case (Ngày 8).

- **Inspection (6 bước):** Planning/kick-off (Mạnh làm Moderator, kiểm điều kiện vào) → chuẩn bị cá nhân (Reviewer theo vòng Mạnh → Tài → Ngân → Lộc → Mạnh, dùng checklist SRS ở phụ lục A của SRS) → họp ghi nhận lỗi (HUMAN; Scribe xoay vòng) → sửa đổi (tác giả) → theo dõi (Moderator) → đóng. Điều kiện ra: mọi lỗi Major đã sửa.
- **Mẫu `docs/reviews/*.md`:** đầu tài liệu: đối tượng, phiên bản, loại review, Moderator/Author/Reviewer/Scribe, ngày, hình thức (cá nhân có hỗ trợ AI hay họp nhóm). Bảng lỗi:

| RV | Vị trí (mục, ID) | Mô tả | Mức (Major/Minor) | Loại (thiếu, sai, mơ hồ, mâu thuẫn, không kiểm thử được) | Người sửa | Trạng thái |
|---|---|---|---|---|---|---|

  Cuối tệp: số lỗi theo mức, kết luận (đạt/chưa), và dòng "Biên bản họp: HUMAN-PENDING" nếu chưa có họp thật.
- **Checklist thiết kế (Technical Review, Ngày 5):** mọi FR có thành phần/API/bảng tương ứng; OpenAPI khớp bảng API trong technical-spec; ERD có đủ khóa và ràng buộc; sơ đồ trạng thái khớp SRS §8.1; hai hàm lõi có đặc tả đủ để viết unit test; không vòng phụ thuộc giữa module; mock clock, payment, notifier có giao diện.
- **Checklist code (walkthrough M4):** đọc và đối chiếu với FR-M4-01 đến 08; kiểm tra biên thời gian; khóa/giao dịch; xử lý lỗi; không `new Date()` trong nghiệp vụ; tên rõ, hàm ngắn.

## 5. Phân tích tĩnh (Ngày 9, Tài)

`npm run report:static` chạy và gộp kết quả (xuất thô vào `reports/raw/static/`):

| Mục | Công cụ | Ngưỡng/ghi chú |
|---|---|---|
| Chuẩn code, lỗi tiềm ẩn, luồng dữ liệu (biến chưa dùng, truy cập trước khi gán) | ESLint + typescript-eslint (cấu hình strict) | 0 lỗi mức error |
| Độ phức tạp chu trình V(G) | ESLint `complexity` (≤ 10) | Hàm lõi ≤ 10 |
| Số dòng code (LOC) | `cloc` hoặc script đếm | Báo cáo theo module |
| Fan-in, Fan-out, Coupling, vòng phụ thuộc | `madge` hoặc `dependency-cruiser` | 0 vòng phụ thuộc; ghi Fan-out cao |
| Code chết, trùng lặp | `knip`/`ts-prune`, `jscpd` | Báo cáo, sửa mục Major |
| SonarQube | Tùy chọn (HUMAN nếu cài được, hoặc SonarCloud) | Nếu không có, nói rõ trong báo cáo |

`reports/static-analysis.md`: bảng chỉ số theo module, danh sách phát hiện, hành động sửa (ai, commit nào), kết quả chạy lại sau sửa. Sửa cảnh báo ở Ngày 9 do Ngân (M4, M5), từng dev (module mình).

## 6. Kiểm thử tích hợp (Ngày 10)

Chiến lược **Sandwich/Hybrid**, không Big Bang. Stub: cổng thanh toán, `Notifier`. Driver: các bộ gọi API thay cho giao diện chưa có (viết ở Ngày 9, do Ngân).

| Cặp | Người | Kịch bản bắt buộc |
|---|---|---|
| M1 ↔ M4 | Mạnh | Không đăng nhập → 401; KH đặt lịch cho thú cưng của người khác → 403; NV/AD thao tác ngoài quyền → 403 |
| M2, M3 ↔ M4 | Tài | Thú cưng + dịch vụ → giá theo nhóm cân nặng → slot; đổi cân nặng thú cưng không đổi giá lịch đã tạo; dịch vụ bị ẩn không đặt mới được; xóa thú cưng khi có lịch đang chờ bị từ chối |
| M4 ↔ M5 | Ngân | Tạo lịch → xác nhận → bắt đầu → hoàn thành; hủy theo chính sách; đổi lịch có kiểm xung đột; No-show |
| M4, M5 ↔ M6 | Lộc | Thanh toán success/failed/timeout (Stub); hoàn cọc khi hủy; thông báo gửi đúng loại; idempotency không trừ tiền hai lần |

`reports/integration-report.md`: mỗi cặp: kịch bản, test case liên quan, kết quả thật, lỗi (DEF). Mạnh tổng hợp.

## 7. Kiểm thử hệ thống, hồi quy, khám phá (Ngày 11–13)

- **Thực thi:** `npm run test:system` (API đầu cuối trên DB test, `TEST_MODE`), sau đó `npm run tc:sync` để cập nhật `status`, `run_date`, `build` (commit SHA) và nối `reports/execution-log.csv`. Test `manual` ghi bằng `tc:record`. Lần chạy nào cũng xuất JSON thô vào `reports/raw/`.
- **Phát hiện lỗi:** ghi `DEF-nnn` vào `docs/defects/defects.csv` ngay khi Fail (mục 10). Không "sửa lặng lẽ" rồi chạy lại mà không ghi lỗi.
- **Ngày 11 sau vòng 1 (nghịch lý thuốc trừ sâu):** rà test case, bổ sung ca mới theo lỗi đã gặp; một phiên khám phá 60 phút theo hiến chương (mục tiêu, phạm vi, ghi chú, lỗi tìm được), do người thực hiện (HUMAN) hoặc agent ghi lại phiên thật.
- **Sửa lỗi và re-test (Ngày 12):** `Open → Fixed → Pending Retest → Retest → Closed`; chạy lại **đúng** test case đã Fail; Fail lần nữa thì `Reopened`.
- **Hồi quy (Ngày 12 sau mỗi đợt sửa lớn và toàn bộ Ngày 13):** `npm run test:regression` = unit + integration + system + bộ Newman (smoke và API cho yêu cầu Must). Kết quả ở `reports/regression-report.md`.
- **UAT (Ngày 13):** kịch bản UAT lấy từ UC-01 đến UC-08; mẫu phiếu: người thử, thiết bị, kịch bản, kết quả, vấn đề, mức chặn (có/không). Số liệu UAT chỉ từ phiếu thật (HUMAN).

## 8. Script kiểm tra (agent tự viết ở Ngày 5–13, Node `.mjs`, chạy được trên Windows)

- `scripts/rtm-check.mjs` (Ngày 5, hoàn thiện Ngày 8): đọc `docs/requirements.csv` (từ SRS: id, loại, ưu tiên), `docs/testcases/*.csv`, `docs/rtm.csv`. Kiểm: mỗi yêu cầu có ≥ 1 test case (NFR-06 được miễn có test case riêng, cần ghi chú báo cáo công cụ); mỗi test case có `req_id` tồn tại; dải mã trong RTM khớp thực tế; mọi `automated_ref` trỏ tới test có `[TC-ID]` thật; không trùng `tc_id`. Xuất `reports/rtm-coverage.md`; thoát mã khác 0 nếu vi phạm.
- `scripts/tc-sync.mjs`: đọc JSON của Jest (`--json`), tìm `[TC-...]` trong tên test, cập nhật CSV (`status`, `run_date`, `build`), nối execution log. Test có ID nhưng không có dòng CSV, hoặc ngược lại, là lỗi.
- `scripts/tc-record.mjs`: ghi kết quả thủ công, bắt buộc `--by`, tự điền ngày; `fail` bắt buộc `--defect`.
- `scripts/exit-check.mjs` (Ngày 13): đọc RTM, CSV test case, `defects.csv`, `reports/raw/coverage/coverage-summary.json`, kết quả white-box; chấm từng tiêu chí ở mục 10.3, ghi `reports/exit-criteria.md` (PASS/FAIL kèm số liệu và đường dẫn nguồn). Không có dữ liệu thì FAIL kèm lý do, **không** giả định.
- `scripts/export-docs.mjs` (Ngày 14, tuỳ chọn): gom tài liệu vào `submission/`; xuất docx/pdf nếu `pandoc` có sẵn, nếu không thì giữ Markdown và báo.

## 9. Phi chức năng (Ngày 12)

| Yêu cầu | Cách đo | Ngưỡng (SRS §9) | Người |
|---|---|---|---|
| NFR-01 Hiệu năng | k6 (hoặc `autocannon`) 50 rồi 100 người dùng ảo vào `GET /slots` và `POST /appointments/holds` | p95 ≤ 2 giây ở 50 người dùng đồng thời; xuất thô vào `reports/raw/perf/` | Lộc |
| NFR-02 Bảo mật | SQL injection (trường văn bản và tham số truy vấn), XSS (tên thú cưng, ghi chú), truy cập chéo dữ liệu (đổi `:id`), token sai/hết hạn, kiểm tra header, mật khẩu băm trong DB; OWASP ZAP là tuỳ chọn (HUMAN) | Không có Critical/High | Mạnh |
| NFR-03 Usability | Đếm bước đặt lịch (≤ 5), thông báo lỗi nêu rõ trường, dùng được từ 360px | Checklist thủ công (HUMAN) | Tài |
| NFR-04 Độ tin cậy | `Promise.all` N yêu cầu cùng một slot; ngắt thanh toán giữa chừng (failed/timeout); đầu vào bất thường (chuỗi rất dài, JSON hỏng) | Đúng một thành công; không lịch mồ côi; không sập | Ngân |
| NFR-05 Tương thích | Chrome, Firefox, Edge bản mới nhất, trình duyệt di động | Checklist thủ công (HUMAN) | Tài |
| NFR-06 Bảo trì | ESLint, V(G), coverage | Theo mục 5 và mục 10 | Tài |

Kết quả tổng hợp ở `reports/nfr-report.md`; chỉ ghi số liệu từ `reports/raw/`.

## 10. Lỗi, số đo, Exit criteria

### 10.1 `docs/defects/defects.csv`
`def_id, title, module, req_id, tc_id, found_in (build/commit), env, steps, actual, expected, severity, priority, reporter, assignee, status, fixed_in, retest_by, created, updated, evidence`

### 10.2 Vòng đời và phân loại
- Trạng thái: `New → Assigned → Open → Fixed → Pending Retest → Retest → Closed`; Retest thất bại → `Reopened → Open`.
- Mức nghiêm trọng (TP-01 §9.5): **Critical** (mất dữ liệu, tính sai tiền, đặt trùng lịch, lỗi bảo mật, sập), **High** (chức năng Must hỏng không cách tránh), **Medium** (hỏng một phần có cách tránh), **Low** (giao diện, chính tả).
- Triage cuối ngày trong Ngày 11–13 do Lộc điều phối: gán người sửa, chốt mức. Ghi `docs/defects/triage-YYYYMMDD.md`.

### 10.3 Exit criteria (chấm bằng `exit-check`, TP-01 §5.2)
1. 100% yêu cầu Must có ≥ 1 test case.
2. 100% test case Critical/High đã thực thi; tỷ lệ Pass ≥ 95% trên số đã chạy.
3. 0 lỗi Critical/High còn mở; mọi lỗi đã đi qua đủ vòng đời (không nhảy trạng thái).
4. Statement ≥ 80%, Branch ≥ 70% trên module lõi (M1, M4, M5, M6, tính bằng `server/src/{services,domain}` tương ứng); hai hàm white-box đạt 100% đường độc lập.
5. UAT không có phản hồi chặn (cần phiếu UAT thật; chưa có thì tiêu chí này `HUMAN-PENDING`, không tính là đạt).

### 10.4 Số đo (TP-01 §10)
Độ phủ yêu cầu; tỷ lệ thực thi; tỷ lệ Pass; coverage; phân bố lỗi theo module; hiệu quả review = lỗi tìm ở review SRS/SDD chia tổng lỗi; tỷ lệ Reopened = Reopened chia Fixed (≤ 10%). Mỗi số có công thức và nguồn dữ liệu trong báo cáo.

## 11. Báo cáo kiểm thử cuối (`reports/final-test-report.md`, Ngày 14)

1. Tóm tắt điều hành (≤ 10 dòng, số liệu thật). 2. Phạm vi thực hiện so với kế hoạch (cái gì đã làm, cắt, lùi). 3. Kết quả thực thi theo mức và theo module. 4. Coverage và phân tích tĩnh. 5. Phân tích lỗi (theo mức, module, nguyên nhân gốc; biểu hiện tích tụ lỗi). 6. Hiệu quả review (số lỗi bắt được từ Inspection, Technical Review). 7. Kết quả phi chức năng. 8. Chấm Exit criteria (dán từ `exit-criteria.md`). 9. Rủi ro còn lại và lỗi chưa đóng (nói thẳng, không tuyên bố "hết lỗi"). 10. Bài học kinh nghiệm (agent soạn nháp từ PROGRESS và defect log, nhóm chỉnh sửa). 11. Phụ lục: danh sách sản phẩm kiểm thử và đường dẫn.
