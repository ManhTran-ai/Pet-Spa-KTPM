# Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa — Bản kế hoạch 14 ngày (bản định hướng kiểm thử hệ thống có sẵn)

## 0. Thay đổi hướng (đọc trước)

Bản kế hoạch này viết lại theo quyết định ngày **2026-11-13** của nhóm trưởng: **không tự xây dựng ứng dụng web**, mà **kiểm thử 2–3 hệ thống web đặt lịch dịch vụ chăm sóc thú cưng (pet spa) đang vận hành thật**.

| Nội dung | Bản cũ (đã archive) | Bản mới |
|---|---|---|
| Đối tượng | Ứng dụng do nhóm tự code (React + Node/Express + PostgreSQL) | 3 website pet spa có sẵn, truy cập công khai |
| Loại kiểm thử | Unit / Integration / System trên mã nguồn của nhóm | Hộp đen / hộp xám: E2E trình duyệt, API, hiệu năng, bảo mật, khả năng dùng, tương thích |
| SRS | Đặc tả yêu cầu cho hệ thống **sẽ xây** | Đặc tả yêu cầu **đích** (as-is), trích xuất từ hành vi quan sát được của 3 site |
| V-model | SRS ↔ System Test, SDD ↔ Unit Test | Đặc tả yêu cầu đích ↔ Kiểm thử hệ thống/E2E; thiết kế test ↔ Kiểm thử tích hợp; **không có Unit Test** vì không có mã nguồn |
| Bàn giao | Mã nguồn + hồ sơ | Hồ sơ kiểm thử + bộ test tự động chạy được + báo cáo lỗi |

Mã nguồn ứng dụng cũ đã gom vào `archive/2026-11-13-webapp-pivot/` và không còn là phần bàn giao. Ba tài liệu gốc SRS-01/TP-01/RTM-01 bản cũ nằm ở `archive/2026-11-13-webapp-pivot/docs-source-original/`.

Căn cứ lý thuyết: **Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm** (`docs/source/Cẩm nang ... .md`), ISTQB CTFL, IEEE 829/830.

---

## 1. Ba hệ thống đích

| Mã | Hệ thống | URL | Nền tảng | Đặc điểm dùng để thiết kế test |
|---|---|---|---|---|
| **T1** | Pet NGON — Spa & Grooming Tận Nhà | `https://petngon.vn/vi` | Next.js | Modal đặt lịch 4 bước; bảng giá 7 nhóm cân nặng × 6 gói × chó/mèo; dịch vụ tận nhà; phụ thu theo km; FAQ accordion |
| **T2** | Mật Pet Family — Bảng giá minh bạch | `https://matpet.vn/spa` | WordPress | Calculator giá 3 bước (loài → bậc cân nặng → dịch vụ); dịch vụ lẻ + combo; "báo giá riêng"; form giữ chỗ chỉ cần SĐT; đa ngôn ngữ Việt/Anh; có tìm kiếm |
| **T3** | Pretty Paws Cat and Dog Grooming | `https://prettypawscatanddoggrooming.groomore.com/` | Groomore (SaaS booking engine) | Đặt lịch hạn tầng, chọn dịch vụ theo nhóm cân nặng (lbs), có phí lễ tân, "Book Now" 24/7 |

**Điều kiện tiên quyết đã kiểm chứng (2026-11-13):** cả 3 site đều truy cập được không cần đăng nhập, có bảng giá công bố và có luồng đặt lịch/giữ chỗ chạy được. Ba site được chọn vì khác nhau về mô hình tính giá (tính tại chỗ theo cân nặng cụ thể / bậc cân nặng / theo nhóm cân nặng), khác nhau về công nghệ (SPA / CMS / SaaS) và khác nhau về đơn vị đo (kg / kg / lbs) — tạo đủ phạm vi để áp EP, BVA, bảng quyết định, chuyển đổi trạng thái và kiểm thử so sánh.

**Mức thâm nhập đã chốt:** chỉ đọc và tương tác **không phá hại** — không đặt lịch thật, không đăng ký tài khoản thật, không gửi payload phá hại; kiểm thử bảo mật chỉ dùng payload vô hại, kiểm tra header/cookie/TLS và phản xạ đầu vào. Xem ADR-11.

---

## 2. Phạm vi kiểm thử

| Mã | Module chức năng | T1 | T2 | T3 |
|---|---|---|---|---|
| M1 | Truy cập, điều hướng, thông tin cơ bản | ✓ | ✓ | ✓ |
| M2 | Danh mục dịch vụ | ✓ | ✓ | ✓ |
| M3 | Bảng giá theo cân nặng và calculator giá | ✓ | ✓ | ✓ |
| M4 | Form giữ chỗ / đặt lịch | ✓ | ✓ | ✓ |
| M5 | Chính sách lịch hẹn, hủy/đổi, quy trình | ✓ | ✓ | ✓ |
| M6 | Dịch vụ tận nhà và phụ thu di chuyển | ✓ | — | — |
| M7 | Tìm kiếm, ngôn ngữ, nội dung, liên kết | ✓ | ✓ | ✓ |

NFR: NFR-01 hiệu năng, NFR-02 bảo mật, NFR-03 khả năng dùng, NFR-04 tương thích, NFR-05 độ tin cậy, NFR-06 khả năng tiếp cận, NFR-07 SEO/kỹ thuật bảo trì.

---

## 3. Chiến lược kiểm thử (bám tài liệu môn học)

**Mô hình chữ V trong bối cảnh hệ thống có sẵn:**

| Nhánh trái (Verification) | Nhánh phải (Validation) |
|---|---|
| Đặc tả yêu cầu đích (đảo ngược từ hành vi quan sát) ↔ Kiểm thử hệ thống, E2E | Hệ thống đáp ứng nhu cầu người dùng thật ↔ Kiểm thử chấp nhận (UAT) |
| Thiết kế test case (EP/BVA/DT/ST/UC) ↔ Kiểm thử tích hợp (quan sát network của site đích) | Thông tin trải nghiệm thực tế của người dùng ↔ Kiểm thử khả năng dùng |
| Phân tích tĩnh tài liệu (Inspection SRS, Technical Review thiết kế test) | Phản hồi lỗi từ chủ site ↔ Vòng đời lỗi |

**Bản chất hộp đen / hộp xám:** không đọc mã nguồn của hệ thống đích (không có quyền và không cần). Test được thiết kế từ đặc tả đích và từ hành vi quan sát. Ở mức tích hợp, nhóm quan sát lưu lượng mạng (DevTools / Playwright `page.on('request')`) để xác nhận luồng front-end → API của site đích mà không can thiệp.

**Kỹ thuật thiết kế test case áp dụng:**

| Kỹ thuật | Áp dụng cho |
|---|---|
| Phân vùng tương đương (EP) | SĐT, tên bé, ngày mong muốn, từ khoá tìm kiếm, độ dài tên dịch vụ trong T3 |
| BVA 3 giá trị (6n+1) | Các ngưỡng cân nặng: T2 bậc `<3 / >3–6 / >6–10 / >10–20 / >20–30 / >30–40 / >40`; T1 nhóm `<3 / 3–5 / 5–10 / 10–15 / 15–20 / 20–25 / 25–30`; T3 nhóm lbs `20–50 / 51–60 / 61–78 / 79–90 / 91–100+` |
| Bảng quyết định (DT) | Phụ thu di chuyển T1: `max(0, km−5) × 8.000₫` với các mốc 0/5/10/15 km; ma trận loài × bậc cân nặng × dịch vụ (T2); quy tắc "báo giá riêng" (T2) |
| Chuyển đổi trạng thái (ST) | Vòng đời wizard đặt lịch T2 (`loài → cân nặng → dịch vụ → giữ chỗ → xác nhận`), gồm các ô chuyển không hợp lệ (quay lại từ bước 3 về bước 1, bỏ qua bước 2) |
| Use case / Workflow | Đặt lịch đầu-cuối; hủy/đổi lịch; tìm kiếm; chuyển ngôn ngữ |
| Khám phá (Exploratory) | 1 phiên 60 phút/site sau vòng thực thi 1, theo hiến chương |

**Nguyên tắc ca kiểm thử:** mỗi test case có đủ ID, Mô tả, Tiền điều kiện, Các bước, Kết quả mong đợi và đạt 4C (Correctness, Clarity, Completeness, Consistency). **Mỗi giá trị không hợp lệ một ca riêng** để tránh Defect masking. **Người viết và người chạy test cho một hệ thống không phải người phụ trách phần khác của hệ thống đó** (tính độc lập, giữ nguyên nguyên tắc của bản kế hoạch gốc).

---

## 4. Phân công

| | Hệ thống / phạm vi | Viết và chạy test cho | Mảng chuyên trách |
|---|---|---|---|
| **Mạnh** (Trưởng nhóm / Test Lead) | T1 Pet NGON (chính) | T3 Pretty Paws + NFR-02 | Test Plan, RTM, điều phối Inspection, Final Test Report, Exit criteria, kiểm thử bảo mật |
| **Tài** | T2 Mật Pet Family (chính) | T1 Pet NGON + NFR-03, NFR-04 | Hạ tầng repo, Playwright + k6 + Lighthouse, phân tích tĩnh tài liệu, kiểm thử khả năng dùng và tương thích |
| **Ngân** | T3 Pretty Paws (chính) | T2 Mật Pet + NFR-01, NFR-05 | Thiết kế bảng quyết định và chuyển đổi trạng thái, kiểm thử hiệu năng và độ tin cậy, tự động hóa regression |
| **Lộc** | Đối chiếu chéo cả 3 site | T2 Mật Pet (đối chiếu) | Quản lý lỗi và triage, kiểm thử khả năng tiếp cận NFR-06 và SEO NFR-07, UAT, slide demo |

Vai trò trong Inspection (ngày 3) luân phiên: Moderator = Mạnh, Scribe xoay vòng, mỗi người review phần của người kế tiếp (Mạnh → Tài → Ngân → Lộc → Mạnh).

---

## 5. Lịch 14 ngày

| Ngày | Mạnh | Tài | Ngân | Lộc | Sản phẩm |
|---|---|---|---|---|---|
| **1** | Kick-off, chốt 3 hệ thống đích, khảo sát sâu T1, Test Plan v0.1, ADR-09..ADR-11 | Khảo sát sâu T2, lập bảng so sánh mô hình giá 3 site | Khảo sát sâu T3, bảng ngưỡng cân nặng theo lbs/kg | Khảo sát quy trình vận hành spa (FAQ, quy trình 4 bước), bảng thuật ngữ | Đặc tả đích v0.1, Test Plan v0.1, khảo sát |
| **2** | Viết SRS M1, M2, M7 cho T1; NFR | Viết SRS M1..M7 cho T2 (bản nháp) | Viết SRS M1..M7 cho T3; bảng quyết định giá | Viết quy tắc nghiệp vụ chung, ràng buộc dữ liệu | SRS v0.2 |
| **3** | Moderator Inspection SRS, ghép v1.0 | Reviewer SRS của Ngân | Reviewer SRS của Lộc | Reviewer SRS của Mạnh | Biên bản review, SRS v1.0 |
| **4** | Thiết kế test: bảng quyết định phụ thu T1; sơ đồ trạng thái wizard T2; bảng ngưỡng cân nặng | Thiết kế test: ma trận loài × bậc × dịch vụ; bộ dữ liệu test; định nghĩa TC template + dải mã | Thiết kế test: EP/BVA cho form giữ chỗ; bộ kịch bản E2E; khung Playwright | Thiết kế test: checklist usability, a11y, SEO; kịch bản khám phá | Bộ thiết kế test, template TC, RTM khung |
| **5** | Technical Review thiết kế test → SDD-test v1.0; Test Plan v1.0; dựng `docs/rtm.csv` | Dựng hạ tầng: repo Playwright + TypeScript, ESLint, config 3 site | Dựng bộ k6 script hiệu năng; kịch bản Lighthouse; checklist kiểm thử đối chiếu | Dựng bộ checklist phi chức năng (usability/a11y/SEO); bảng mốc định lịch khảo sát | Test Plan v1.0, template TC, RTM khung, hạ tầng |
| **6** | Viết TC T1 (EP, BVA) — tự động hóa E2E phần đầu | Viết TC T2 (EP, BVA) | Viết TC T3 (EP, BVA) | Viết TC đối chiếu + checklist phi chức năng | Test case đợt 1 |
| **7** | Viết TC T1 (DT, ST, UC) | Viết TC T2 (DT, ST, UC) | Viết TC T3 (DT, UC) | Bổ sung TC theo kết quả review | Test case đợt 2 |
| **8** | Review chéo test case (4C); RTM 100%; tự động hóa E2E đầy đủ | Review chéo; hoàn thiện script Playwright theo TC; k6 script | Review chéo; kịch bản khám phá; Lighthouse theo site | Review chéo; tổng hợp checklist phi chức năng | TC v1.0, RTM đủ, bộ tự động hóa |
| **9** | Chuẩn bị môi trường và dữ liệu test; rà soát tính hợp lệ của dữ liệu giá; Walkthrough thiết kế test | Chạy thử bộ E2E lần 1; sửa script; xuất báo cáo tĩnh tài liệu | Chạy Lighthouse 3 site 3 lần; xuất số liệu thô hiệu năng | Chạy checklist usability/a11y/SEO lần 1 | Báo cáo tĩnh, dữ liệu thô hiệu năng |
| **10** | Kiểm thử tích hợp T1: quan sát network, luồng front-end → API, hợp đồng dữ liệu | Kiểm thử tích hợp T2: API search/booking, kiểm tra validation biên | Kiểm thử tích hợp T3: API slot/dịch vụ | Đối chiếu mô hình giá 3 site: cùng dữ liệu → cùng kết luận? | Báo cáo kiểm thử tích hợp |
| **11** | System test vòng 1: chạy TC T1, ghi lỗi | Chạy TC T2, ghi lỗi | Chạy TC T3, ghi lỗi | Triage lỗi cuối ngày; phiên khám phá 60 phút/site | Execution log, defect log |
| **12** | Re-test lỗi T1; test bảo mật NFR-02 (header, cookie, TLS, phản xạ vô hại) | Re-test lỗi T2; usability + tương thích NFR-03, NFR-04 | Re-test lỗi T3; hiệu năng NFR-01, độ tin cậy NFR-05 | Khả năng tiếp cận NFR-06, SEO NFR-07 | Báo cáo phi chức năng |
| **13** | Chấm Exit criteria; đóng băng bộ test | Regression tự động (E2E + API) toàn bộ; cập nhật RTM | Regression k6 + Lighthouse; đối chiếu lại bảng giá | UAT/Alpha với 5–8 người ngoài nhóm, thu phản hồi | Regression report, UAT feedback |
| **14** | Final Test Report, Lessons learned | Đóng gói hồ sơ nộp, tag repo v1.0 | Script + video demo | Slide, thuyết trình | Hồ sơ nộp, demo |

---

## 6. Sản phẩm nộp và tiêu chí kết thúc

**Hồ sơ:** Đặc tả yêu cầu đích (SRS) · Thiết kế test (SDD-test) · Test Plan · Test Case Specification (≈150–160 ca) · RTM · Biên bản review · Báo cáo kiểm thử tích hợp · Execution log · Defect log · Báo cáo phi chức năng · Regression/UAT report · Final Test Report · Bộ test tự động chạy được (Playwright + k6 + Lighthouse) · Slide + demo.

**Exit criteria (chốt trong Test Plan, kiểm tra ngày 13):**

- 100% yêu cầu Must có ít nhất 1 test case (RTM).
- 100% test case ưu tiên Critical/High đã thực thi; tỷ lệ Pass ≥ 95%.
- 0 lỗi Critical/High còn mở; mọi lỗi đi qua đủ Defect Life Cycle (New → … → Closed).
- Mỗi trong 3 hệ thống đích có ít nhất 1 bộ E2E tự động chạy được và xanh.
- Không có phát hiện bảo mật mức Critical/High; bảo mật NFR-02 đạt trên cả 3 site.
- UAT không có phản hồi chặn.

## 7. Rủi ro và quy tắc làm việc

| Rủi ro | Cách xử lý |
|---|---|
| Hệ thống đích thay đổi giao diện giữa chừng | Script Playwright dùng selector theo **vai trò/nhãn** (`getByRole`, `getByLabel`) thay vì CSS path; chạy smoke mỗi ngày để phát hiện sớm; ghi vào defect log |
| Web đích có thể chậm hoặc giới hạn số request | Giới hạn tốc độ, có retry có kiểm soát, cache trang tĩnh; lịch chạy tải vào ngoài giờ cao điểm |
| Tạo rác cho chủ site do test | Chỉ đọc, không đặt lịch thật, không đăng ký tài khoản (ADR-11); nếu chủ site đồng ý thì mới mở thêm kịch bản có ghi |
| Phạm vi phình to | Chỉ cắt từ nhóm Could/Should; Must không đụng |
| Một người trễ tiến độ | Họp đứng 15 phút mỗi ngày; việc chậm hơn 1 ngày thì chia lại ngay |
| Test viết sau khi xem hành vi nên "chạy theo hệ thống" | Test case viết từ SRS đích và thiết kế test (ngày 6–8), không từ kết quả chạy thử |
| Lệch nhau về thuật ngữ và định dạng | Dùng chung template, glossary và bảng mã TC; nguyên tắc Consistency trong 4C |
