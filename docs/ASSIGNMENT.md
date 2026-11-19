# Phân công và hướng dẫn thực hiện — Kiểm thử 3 hệ thống Pet Spa

Mã tài liệu: **ASG-01** · Phiên bản **3.0** · Ngày 2026-11-19 · Người lập: Mạnh (TV1, Test Lead)

> **Bản 3.0 — cập nhật theo ADR-15 và ADR-16.**
> Nhóm chọn **Hướng 2**: *"Thiết kế và kiểm thử cho một phần mềm đang hoạt động — các bạn phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử"*. Đây là hướng **duy nhất** của đồ án.
> Hệ quả bắt buộc: (a) mỗi thành viên có **một nhóm kỹ thuật thiết kế test** và **một tài liệu thiết kế riêng** trong `docs/design/`; (b) phân bổ 226 test case cân bằng (Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58 — chênh lệch 3); (c) mỗi module của mỗi hệ thống có **≥ 2 người chạy** để đối chiếu chéo; (d) **mỗi thành viên phải có tài liệu thiết kế đã review chéo** — kiểm chứng bằng `EC-8` trong `npm run exit:check`.
> Xem `docs/decisions.md` ADR-15, ADR-16 và §3A bên dưới.

Đọc kèm: `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` (kế hoạch 14 ngày), `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v1.2), `docs/source/Kế hoạch Kiểm thử (Test Plan).md` (TP-01 v1.1), `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` (RTM-01 v1.0), `docs/source/Cẩm nang ... .md` (cẩm nang lý thuyết môn học).

---

## 0. Trước khi bắt đầu: đọc gì, theo thứ tự nào

| Bước | Tài liệu | Mục đích | Thời gian |
|---|---|---|---|
| 1 | `docs/source/Hệ thống Đặt lịch... Spa.md` §0–§7 | Hiểu hướng đồ án, ranh giới an toàn, lịch 14 ngày, phân công | 15 phút |
| 2 | `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` | Test basis — 58 yêu cầu, 18 BR, 8 UC, 4 bảng quyết định, bảng chuyển trạng thái | 45 phút |
| 3 | `docs/source/Kế hoạch Kiểm thử (Test Plan).md` | Chiến lược, kỹ thuật thiết kế test, tiêu chí vào/kết thúc | 30 phút |
| 4 | `docs/reference/pricing-baseline.md` | Bảng giá tham chiếu chốt ngày 2 — dùng để đối chiếu | 20 phút |
| 5 | `docs/testcases/<system>.csv` | Test case của đúng hệ thống bạn phụ trách | 30 phút |
| 6 | `docs/backlog.md` + `docs/backlog.csv` | Danh sách công việc MoSCoW của bạn, có sẵn cột `owner` | 15 phút |
| 7 | `docs/design/*.md` | 5 tài liệu thiết kế test — **bắt buộc** đọc cả 5 để biết kỹ thuật của người khác | 40 phút |

> **Không cần đọc** `archive/2026-11-13-webapp-pivot/` — mã nguồn hệ thống webapp nhóm từ xây trước đây, đã bị bỏ theo ADR-09 và **không còn là đối tượng kiểm thử**. Giữ trong repo chỉ để lưu lịch sử dự án.

---

## 1. Ba hệ thống đích

| Mã | Hệ thống | URL | Công nghệ | Mô hình giá | Bảng giá |
|---|---|---|---|---|---|
| **T1** | Pet NGON — Spa & Grooming Tận Nhà | `https://petngon.vn/vi` | Next.js, render server | Chọn **bậc** cân nặng (kg) × 6 gói; có dịch vụ tại nhà | Tĩnh, 6 gói × 14 dòng loài/cân nặng |
| **T2** | Mật Pet Family | `https://matpet.vn/spa` | WordPress + React | Calculator 3 bước (loài → bậc kg → dịch vụ) | Tĩnh **và** calculator tính tức thì |
| **T3** | Pretty Paws Cat and Dog Grooming | `https://prettypawscatanddoggrooming.groomore.com/` | Groomore (SaaS) | Chọn **dịch vụ** theo bậc **lbs** mã hoá trong tên | API JSON `booking-api/v1/service` (41 dịch vụ / 5 nhóm) |

Lưu ý đường dẫn: `matpet.vn/dat-lich` trả **404**; luồng thật nằm ở `matpet.vn/spa`.

---

## 2. Ranh giới kiểm thử an toàn (ADR-11) — áp dụng cho mọi người

**Được phép:**

- GET mọi trang công khai, đọc nội dung, bảng giá, điều khoản.
- Chọn lựa chọn trong form (loài, cân nặng, dịch vụ, ngày) và **đọc giá hiển thị**.
- Kiểm tra header HTTP, cookie, TLS, `robots.txt`, `sitemap.xml`.
- Chạy axe-core, Lighthouse, kiểm tra DOM.

**Không được phép:**

| Không được | Lý do |
|---|---|
| Bấm nút gửi cuối cùng ("Đặt lịch", "Book Now", "Xác nhận") | Tạo lịch thật trong hệ thống của chủ site → gây rác dữ liệu |
| Tạo tài khoản, đăng nhập, đăng ký | Tạo dữ liệu rác |
| Gửi payload phá hại (SQL injection, XSS không vô hại, DoS) | Vi phạm ranh giới "kiểm thử không phá hại" |
| Tải lặp quá 10 VU hoặc tần suất cao | Gây tải nặng cho site bên thứ ba |
| Nhập số điện thoại thật của ai đó | Rò rỉ dữ liệu cá nhân |

**Mức tải cho phép:** tối đa 10 VU, chạy ngoài giờ cao điểm nếu được phép, giữ lễ tinh giữa các lần gọi.

> Hệ quả bắt buộc: các hạng mục không kiểm thử được theo ranh giới này (luồng sau khi bấm "Gửi", email/SMS xác nhận, thanh toán) được ghi trong báo cáo là **"Không kiểm thử được theo ADR-11"** — **không** được đánh dấu Pass.

---

## 3. Phân công theo thành viên

### 3.0 Nguyên tắc phân công (ADR-15, ADR-16)

Bốn nguyên tắc bắt buộc, kiểm tra được bằng script:

1. **Mỗi module của mỗi hệ thống có ≥ 2 người chạy** — đối chiếu chéo bắt buộc (nguyên tắc "người viết và người chạy test cho một hệ thống không phải người phụ trách phần khác của hệ thống đó", kế hoạch §3).
2. **Tổng số test case mỗi người cân bằng**, chênh lệch tối đa 3 ca trên 226 ca.
3. **Chuyên môn NFR giữ nguyên theo nghiên cứu kỹ thuật** (hướng 3): NFR-02 → Mạnh · NFR-01/05 → Ngân · NFR-03/04 → Tài · NFR-06/07 → Lộc.
4. **Mỗi thành viên có ≥ 1 tài liệu thiết kế trong `docs/design/` đã được review chéo** — đây là tiêu chí `EC-8`, kiểm tra tự động bằng `npm run exit:check`.

Script kiểm chứng: `scripts/reassign-owners.mjs` (phân bổ lại Owner), `scripts/rtm-build.mjs` + `scripts/rtm-check.mjs` (truy xuất), `scripts/exit-check.mjs` (EC-1..EC-8).

### 3.1 Ma trận phân bổ Owner trong `docs/testcases/*.csv` (đã kiểm chứng bằng script)

| Hệ thống | Module | SL | Mạnh | Tài | Ngân | Lộc |
|---|---|---|---|---|---|---|
| T1 | M1 | 6 | 2 | 3 | 0 | 1 |
| T1 | M2 | 7 | 3 | 3 | 0 | 1 |
| T1 | M3 | 18 | 7 | 7 | 0 | 4 |
| T1 | M4 | 12 | 4 | 5 | 0 | 3 |
| T1 | M5 | 6 | 2 | 2 | 0 | 2 |
| T1 | M6 | 20 | 8 | 7 | 0 | 5 |
| T1 | M7 | 3 | 1 | 1 | 0 | 1 |
| T2 | M1 | 6 | 0 | 1 | 3 | 2 |
| T2 | M2 | 6 | 0 | 2 | 3 | 1 |
| T2 | M3 | 24 | 0 | 6 | 12 | 6 |
| T2 | M4 | 17 | 0 | 5 | 8 | 4 |
| T2 | M5 | 6 | 0 | 2 | 3 | 1 |
| T2 | M7 | 7 | 0 | 1 | 3 | 3 |
| T3 | M1 | 7 | 3 | 0 | 2 | 2 |
| T3 | M2 | 5 | 2 | 0 | 2 | 1 |
| T3 | M3 | 14 | 5 | 0 | 5 | 4 |
| T3 | M4 | 11 | 4 | 0 | 4 | 3 |
| T3 | M5 | 5 | 2 | 0 | 2 | 1 |
| T3 | M7 | 2 | 1 | 0 | 0 | 1 |
| ALL | NFR | 44 | 12 | 10 | 10 | 12 |
| **Tổng** | | **226** | **56** | **55** | **57** | **58** |

Đối chiếu: trước khi cân bằng là Mạnh 57 · Tài 64 · Ngân 62 · Lộc 43 (chênh lệch 21, Lộc quá tải, Tài thiếu đối chiếu). Sau khi cân bằng chênh lệch còn **3**.

**Kiểm chứng:** `npm run assign:check` (script `scripts/assign-check.mjs`) → phải in `Tổng test case: 226`, `Chênh lệch max-min: 3` và `OK: 4/4 nguyên tắc phân công được thoả mãn.`; `node scripts/reassign-owners.mjs` chỉ dùng để **phân bổ lại** Owner khi thêm/bớt test case.

### 3.2 Ma trận trách nhiệm theo hệ thống (viết / đối chiếu / NFR)

Cột "viết" = người **thiết kế và viết test case** cho hệ thống đó; hai cột "đối chiếu" = người **chạy lại** cùng ca, cùng dữ liệu, phải ra cùng kết luận.

| Thành viên | Hệ thống chính (viết) | Số ca viết | Đối chiếu | Số ca đối chiếu | NFR chuyên trách | Số ca NFR | **Tổng** |
|---|---|---|---|---|---|---|---|
| **Mạnh** | T3 Pretty Paws | 17 | T1 Pet NGON | 27 | NFR-02 | 12 | **56** |
| **Tài** | T1 Pet NGON | 28 | T2 Mật Pet | 17 | NFR-03, NFR-04 | 10 | **55** |
| **Ngân** | T2 Mật Pet | 32 | T3 Pretty Paws | 15 | NFR-01, NFR-05 | 10 | **57** |
| **Lộc** | Đối chiếu cả 3 site | — | T1 (17) + T2 (17) + T3 (12) | 46 | NFR-06, NFR-07 | 12 | **58** |
| | | | | | | | **226** |

Đối chiếu tổng theo hệ thống: T1 = 28 (Tài) + 17 (Lộc) + 27 (Mạnh) = 72 · T2 = 32 (Ngân) + 17 (Tài) + 17 (Lộc) = 66 · T3 = 17 (Mạnh) + 15 (Ngân) + 12 (Lộc) = 44 · NFR = 44. ✔

### 3.3 Vai trò và nhóm kỹ thuật thiết kế test (phần "thiết kế" của Hướng 2)

| Thành viên | Nhóm kỹ thuật thiết kế test phụ trách | Tài liệu thiết kế bắt buộc | Căn cứ lý thuyết | Người review chéo | Trạng thái |
|---|---|---|---|---|---|
| **Mạnh** (TV1, Test Lead) | **Phân tích tĩnh & Rà soát** (Cẩm nang §3) · **McCabe V(G) & mức bao phủ** (§5.3, §5.4) | `docs/design/mccabe-coverage.md` | Cẩm nang §3.1–§3.4, §5.2–§5.4 | Ngân | ✅ v1.0 — đã review chéo 19/11 |
| **Tài** (TV2) | **Phân vùng tương đương + Giá trị biên** (§4.2, §4.3) | `docs/design/test-design-techniques.md` | Cẩm nang §4.2, §4.3 | Ngân | ✅ v1.0 — đã review chéo 19/11 |
| **Ngân** (TV3) | **Bảng quyết định + Chuyển đổi trạng thái** (§4.4, §4.5) | `docs/design/decision-tables.md` + `docs/design/state-transition.md` | Cẩm nang §4.4, §4.5 | Mạnh / Lộc | ✅ v1.0 — đã review chéo 19/11 |
| **Lộc** (TV4) | **Use case + Workflow + Exploratory** (§4.6) · **Vòng đời lỗi** (§6.1) | `docs/design/usecase-workflow.md` | Cẩm nang §4.6, §6.1 | Tài | ✅ v1.0 — đã review chéo 19/11 |

> **Kết quả Technical Review 19/11/2026:** 5/5 tài liệu đủ 4 thành phần bắt buộc · 202 trích dẫn test case đều tồn tại · phát hiện và sửa **3 lỗi Major + 2 Minor** (biên bản: `docs/reviews/design-review.md`).

Mỗi tài liệu thiết kế phải có đủ 4 thành phần:
1. **Nguồn lý thuyết** trích từ Cẩm nang môn học (mục và phần);
2. **Bảng áp dụng thật cho 3 site đích** — không được chỉ lý thuyết;
3. Ít nhất **2 ví dụ thật** trích từ test case có mã `TC-...`;
4. Phần **"hạn chế của kỹ thuật"** và khi nào **không** dùng.

### 3.4 Mạnh — Trưởng nhóm / Test Lead (TV1) · **56 ca**

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T3** (chính) | 17 ca thuộc `docs/testcases/t3.csv` do Mạnh chạy (M1 3, M2 2, M3 5, M4 4, M5 2, M7 1) |
| Đối chiếu | **T1** | 27 ca thuộc M1–M7 của T1 (M1 2, M2 3, M3 7, M4 4, M5 2, M6 8, M7 1) |
| Chuyên trách | NFR-02 (12 ca) | Kiểm thử bảo mật: header, cookie, TLS, phản xạ đầu vào, rò rỉ thông tin |
| Nghiên cứu | — | McCabe V(G) + mức bao phủ cho 4 bảng quyết định SRS §8 → `docs/design/mccabe-coverage.md` |
| Tài liệu | — | Test Plan (TP-01), RTM (RTM-01), điều phối Inspection, Exit criteria, Final Test Report, Lessons learned |
| Kiểm thử tích hợp | T1, T2, T3 | Tổng hợp báo cáo tích hợp từ 3 site (Ngày 10) |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | Khảo sát sâu T3: bảng giá theo dòng sản phẩm, giờ mở cửa theo ngày, luồng "Book Now", trạng thái Open/Closed | `docs/reference/pricing-baseline.md` mục 4 |
| 3 | **Moderator** cuộc Inspection SRS-01; ghi biên bản | `docs/reviews/inspection-srs.md` ✅ |
| 4 | Thiết kế test: bảng quyết định, bảng chuyển trạng thái, định nghĩa template test case | `docs/design/` |
| 5 | **Technical Review** thiết kế test → v1.0; Test Plan v1.0 chốt | Biên bản TR |
| 6 | **Nghiên cứu McCabe**: tính V(G) và mức bao phủ cho SRS §8.1, §8.3, §8.4 | `docs/design/mccabe-coverage.md` |
| 8 | Review chéo test case theo checklist 4C; chốt RTM 100% | `docs/rtm.csv` |
| 9 | Chuẩn bị môi trường, bộ dữ liệu test, Walkthrough thiết kế test | Báo cáo tĩnh |
| 11 | System test vòng 1 T3 + NFR-02 + đối chiếu T1 | Execution log, defect log |
| 13 | Chấm Exit criteria; đóng băng bộ test | `reports/exit-criteria.md` |
| 14 | Final Test Report + Lessons learned | Hồ sơ nộp |

### 3.5 Tài — Hệ thống T1, hạ tầng, biên (TV2) · **55 ca**

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T1** (chính) | 28 ca thuộc `docs/testcases/t1.csv` do Tài chạy (M1 3, M2 3, M3 7, M4 5, M5 2, M6 7, M7 1) |
| Đối chiếu | **T2** | 17 ca thuộc M1–M7 của T2 (M1 1, M2 2, M3 6, M4 5, M5 2, M7 1) |
| Chuyên trách | NFR-03, NFR-04 (10 ca) | Khả năng dùng (số thao tác, thông báo lỗi, bàn phím) và tương thích (trình duyệt, 360px) |
| Nghiên cứu | — | Bảng EP + BVA cho 3 hệ thống → `docs/design/test-design-techniques.md` ✅ |
| Hạ tầng | — | Repo, Playwright + TypeScript, k6, Lighthouse CLI, ESLint, `package.json` scripts |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Đối chiếu ma trận giá T2**: 7 bậc cân nặng × 2 loài × 3 dịch vụ — ghi nhận mọi ô lệch | `reports/raw/survey-T2-matrix.csv` |
| 3 | Reviewer SRS phần Tài (M1–M7 của T2) | Biên bản Inspection ✅ |
| 4 | Thiết kế test: ma trận loài × bậc × dịch vụ; bộ dữ liệu test | Bộ thiết kế test |
| 5 | Dựng `tests/e2e/t1/*.spec.ts` | Script mẫu chạy được |
| 6 | **Nghiên cứu EP + BVA**: bảng phân vùng và bảng giá trị biên 3 hệ thống | `docs/design/test-design-techniques.md` ✅ |
| 7 | Viết test case T1 theo EP, BVA | `docs/testcases/t1.csv` |
| 8 | Viết test case T1 theo DT, ST, UC; hoàn thiện script Playwright theo TC; k6 script | Bộ tự động hóa |
| 9 | Chạy thử bộ E2E lần 1; sửa script | Smoke xanh |
| 10 | **Kiểm thử tích hợp T1**: quan sát network, hợp đồng dữ liệu bảng giá ↔ wizard, validation biên | Báo cáo tích hợp |
| 11–12 | System test T1 + đối chiếu T2; re-test lỗi; NFR-03, NFR-04 | Execution log, defect log |
| 13 | Regression tự động (E2E) toàn bộ | Regression report |
| 14 | Đóng gói hồ sơ nộp, tag repo v1.0; script + video demo | Hồ sơ nộp |

### 3.6 Ngân — Hệ thống T2, quyết định & trạng thái (TV3) · **57 ca**

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T2** (chính) | 32 ca thuộc `docs/testcases/t2.csv` do Ngân chạy (M1 3, M2 3, M3 12, M4 8, M5 3, M7 3) |
| Đối chiếu | **T3** | 15 ca thuộc M1–M7 của T3 (M1 2, M2 2, M3 5, M4 4, M5 2, M7 0) |
| Chuyên trách | NFR-01, NFR-05 (10 ca) | Hiệu năng (Lighthouse, k6) và độ tin cậy (gửi form lặp, lỗi mạng, giữ trạng thái) |
| Nghiên cứu | — | Ma trận quyết định + đồ thị chuyển trạng thái → `docs/design/decision-tables.md`, `docs/design/state-transition.md` ✅ |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Đối chiếu giá T3**: 8 dịch vụ chính, giá + thời lượng giữa API và trang đặt lịch | `reports/raw/survey-T3-ui-prices.csv` |
| 3 | Reviewer SRS phần Ngân (T3, NFR-01, NFR-05) | Biên bản Inspection ✅ |
| 4 | Thiết kế test: ma trận DT và đồ thị trạng thái; kịch bản E2E; khung Playwright | Bộ thiết kế test |
| 5 | Dựng bộ k6 script; kịch bản Lighthouse | Script mẫu |
| 6 | **Nghiên cứu DT + ST**: ma trận quyết định và sơ đồ chuyển trạng thái T1/T2/T3 | `docs/design/decision-tables.md`, `docs/design/state-transition.md` ✅ |
| 7 | Viết test case T2 theo EP, BVA, DT | `docs/testcases/t2.csv` |
| 8 | Viết test case T2 theo ST, UC; kịch bản khám phá; Lighthouse theo site | Bộ tự động hóa |
| 9 | Chạy Lighthouse 3 site × 3 lần; xuất số liệu thô hiệu năng | Số liệu thô |
| 10 | **Kiểm thử tích hợp T2**: API search/booking, hợp đồng dữ liệu bảng giá ↔ calculator | Báo cáo tích hợp |
| 11–12 | System test T2 + đối chiếu T3; re-test lỗi; NFR-01, NFR-05 | Execution log, defect log |
| 13 | Regression k6 + Lighthouse; đối chiếu lại bảng giá | Regression report |
| 14 | Slide, thuyết trình | Hồ sơ nộp |

### 3.7 Lộc — Đối chiếu chéo, lỗi, a11y/SEO, UAT (TV4) · **58 ca**

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **Đối chiếu T1, T2, T3** | 46 ca đối chiếu — cùng dữ liệu, phải ra cùng kết luận với người viết (T1 17 · T2 17 · T3 12) |
| Chuyên trách | NFR-06, NFR-07 (12 ca) | Khả năng tiếp cận (axe-core, tương phản, alt, `h1`) và SEO (title, meta, `lang`, sitemap, robots, OG) |
| Nghiên cứu | — | Sơ đồ luồng UC-01…08 + hiếu chương khám phá + vòng đời lỗi → `docs/design/usecase-workflow.md` |
| Quản lý | — | Defect log và triage, checklist usability, UAT, slide demo |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Sửa SRS-01 v1.1**: `BR-03`, `BR-12`, mục 3.2, 3.3 theo phát hiện P2/P4/P5; đề xuất cách xử lý P1 | Bản vá SRS ✅ |
| 3 | Reviewer SRS phần Lộc (NFR, dữ liệu, thuật ngữ) | Biên bản Inspection ✅ |
| 4 | Thiết kế test: checklist usability, a11y, SEO; kịch bản khám phá | Bộ thiết kế test |
| 5 | Dựng bộ checklist phi chức năng; bảng mốc định lịch khảo sát | Checklist |
| 6 | **Nghiên cứu UC + Workflow + Exploratory**: sơ đồ luồng 8 UC, 3 hiếu chương khám phá, vòng đời lỗi | `docs/design/usecase-workflow.md` |
| 7 | Viết test case đối chiếu + checklist phi chức năng | Test case đợt 1–2 |
| 8 | Review chéo; tổng hợp checklist phi chức năng | Test case v1.0 |
| 9 | Chạy checklist usability/a11y/SEO lần 1 | Báo cáo tĩnh |
| 10 | **Đối chiếu mô hình giá 3 site**: cùng dữ liệu → cùng kết luận? | Báo cáo tích hợp |
| 11 | Triage lỗi cuối ngày; phiên khám phá 60 phút/site | Defect log |
| 12 | Khả năng tiếp cận NFR-06, SEO NFR-07 | Báo cáo phi chức năng |
| 13 | UAT/Alpha với 5–8 người ngoài nhóm, thu phản hồi | UAT feedback |
| 14 | Slide, thuyết trình | Hồ sơ nộp |

### 3.8 Hội trường thiết kế test (Ngày 8, sau khi test case v1.0)

Mỗi thành viên trình bày **10 phút** kỹ thuật thiết kế test mình phụ trách theo mẫu:

| Mục | Nội dung bắt buộc |
|---|---|
| 1. Cơ sở lý thuyết | Trích từ Cẩm nang môn học (mục và phần) |
| 2. Áp dụng cho đồ án | Bảng/triển khai thật trên 3 site đích, có số liệu |
| 3. Ví dụ thật | ≥ 2 test case có mã `TC-...` minh hoạ kỹ thuật |
| 4. Hạn chế | Khi nào kỹ thuật này **không** dùng, và rủi ro khi dùng sai |

Bản tổng hợp: `docs/design/test-design-techniques.md` (do Tài tổng hợp từ 4 bản) — nằm trong hồ sơ nộp.

---

## 3A. Đối chiếu 100% với yêu cầu của Hướng 2

**Hướng 2 được chọn:** *"Thiết kế và kiểm thử cho một phần mềm đang hoạt động, các bạn phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử"* (ADR-15).

### 3A.1 Bốn yêu cầu của Hướng 2 và sản phẩm nhóm cam kết nộp

| # | Yêu cầu của Hướng 2 | Sản phẩm cam kết | Người chịu trách nhiệm | Người phối hợp | Trạng thái |
|---|---|---|---|---|---|
| **H2-1** | **Mô tả chi tiết yêu cầu và tính năng** của phần mềm cần kiểm thử | `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v1.2): **58 yêu cầu** (51 FR + 7 NFR), **18 BR**, **8 UC**, **4 bảng quyết định**, mô tả chi tiết 3 hệ thống; mọi tiêu chí chấp nhận đều **định lượng** | Mạnh (tổng hợp) | Tài (T2) · Ngân (T3) · Lộc (BR, dữ liệu, NFR) | ✅ Xong |
| **H2-2** | **Thiết kế test** | **226 test case** theo EP / BVA / DT / ST / UC / Workflow / Exploratory (`docs/testcases/*.csv`) + **5 tài liệu** trong `docs/design/` | Theo §3.3 | Theo §3.3 | ✅ 226 ca · ✅ 5/5 tài liệu đã review chéo |
| **H2-3** | **Kiểm thử** phần mềm đang hoạt động, không phá hại | Bộ tự động Playwright (E2E + axe-core + Lighthouse + k6), execution log, defect log, báo cáo tích hợp, báo cáo phi chức năng | Tài (hạ tầng) · Ngân (perf) · Lộc (a11y/SEO) · Mạnh (security) | Cả 4 | 🔄 Ngày 9–13 |
| **H2-4** | **Truy vết & báo cáo** chứng minh | RTM truy xuất 2 chiều 100%, biên bản Inspection SRS, Test Plan, Exit criteria EC-1..EC-8, Final Test Report, Lessons learned | Mạnh | Tài (RTM), Lộc (UAT), Ngân (regression) | ✅ RTM 100% · 🔄 báo cáo Ngày 14 |

### 3A.2 Phần "nghiên cứu kỹ thuật kiểm thử chuyên sâu" nằm ở đâu

Hướng 2 có hai vế: **thiết kế test** và **kiểm thử**. Vế "thiết kế test" đòi hỏi dùng kỹ thuật thiết kế ca kiểm thử hộp đen một cách chuyên sâu — đó chính là nội dung "nghiên cứu kỹ thuật kiểm thử chuyên sâu". Vì vậy 5 tài liệu trong `docs/design/` là **đầu ra bắt buộc của H2-2**, không phải một hướng đồ án riêng biệt.

| Tài liệu | Người phụ trách | Nội dung | Số ca truy xuất | Trạng thái |
|---|---|---|---|---|
| `docs/design/test-design-techniques.md` | Tài | Bảng EP + BVA cho 3 hệ thống, bộ dữ liệu biên | 24 EP + 34 BVA = 58 | ✅ v1.0 — đã review chéo 19/11 |
| `docs/design/decision-tables.md` | Ngân | Ma trận quyết định đã rút gọn, có cột kết quả mong đợi | 20 DT | ✅ v1.0 — đã review chéo 19/11 |
| `docs/design/state-transition.md` | Ngân | Đồ thị chuyển trạng thái có nhãn cho wizard T1/T2, drawer T3, accordion FAQ | 19 ST | ✅ v1.0 — đã review chéo 19/11 |
| `docs/design/mccabe-coverage.md` | Mạnh | V(G) và mức bao phủ cho 4 bảng quyết định SRS §8 | 33 ca (đo lại 20 DT) | ✅ v1.0 — đã review chéo 19/11 |
| `docs/design/usecase-workflow.md` | Lộc | Sơ đồ luồng UC-01…08 + 3 hiếu chương khám phá + vòng đời lỗi | 78 UC + 37 Use case = 115 | ✅ v1.0 — đã review chéo 19/11 |

### 3A.3 Điều kiện thỏa mãn "phần mềm đang hoạt động"

| Điều kiện | Cách nhóm đáp ứng | Bằng chứng |
|---|---|---|
| Phần mềm **thật**, đang vận hành | 3 website production, không có môi trường staging do nhóm kiểm soát | SRS §1.2; ADR-10 |
| **Không đọc mã nguồn** đích | Thiết kế hộp đen/hộp xám; mọi yêu cầu trích từ hành vi quan sát + network | SRS §1.1; ADR-13 |
| **Không phá hại** | Chỉ đọc & tương tác không phá hại; không đặt lịch thật, không đăng ký tài khoản, không payload phá hại | ADR-11; §2 của tài liệu này |
| Yêu cầu **do nhóm mô tả lại**, không do nhà phát triển cung cấp | Toàn bộ SRS-01 là đặc tả đích trích từ quan sát; không có bản yêu cầu gốc từ chủ site | SRS §1.1, lịch sử phiên bản §0 |
| Có **3 hệ thống khác nhau** để đủ phạm vi kỹ thuật | Khác nhau về mô hình giá (bậc kg / bậc kg / nhóm lbs), công nghệ (Next.js / WordPress+React / Groomore SaaS), đơn vị đo (kg/kg/lbs) | SRS §2, §3.4 |

### 3A.4 Nghiệm thu cá nhân — "Definition of Done" cho từng thành viên

Mỗi thành viên phải hoàn thành **100%** các mục dưới đây. Bảng này là tiêu chí chấm điểm cá nhân trong Final Test Report.

| # | Hạng mục nghiệm thu | Áp dụng cho | Bằng chứng kiểm chứng |
|---|---|---|---|
| 1 | Có ≥ 1 tài liệu thiết kế trong `docs/design/` với đủ 4 thành phần (§3.3) | Cả 4 | `npm run exit:check` → EC-8 |
| 2 | Tài liệu thiết kế đã được **review chéo** bởi người khác | Cả 4 | `npm run exit:check` → EC-8 |
| 3 | Chạy hết test case của mình (ghi trạng thái trong `docs/testcases/*.csv`) | Cả 4 | `reports/execution-log.csv` |
| 4 | Đối chiếu chéo: mọi ca thuộc hệ thống mình đối chiếu đều có kết luận | Tài, Ngân, Lộc | `reports/execution-log.csv` |
| 5 | Mọi Fail đã có defect tương ứng trong `docs/defects/defects.csv` | Cả 4 | `npm run exit:check` → EC-3 |
| 6 | Bằng chứng thô (ảnh, log, JSON) nằm trong `reports/raw/` | Cả 4 | Kiểm tra thủ công khi review |
| 7 | NFR chuyên trách đã có số liệu thật, không hạ ngưỡng để ép xanh | Cả 4 | `reports/raw/lighthouse-summary.csv`, `axe-summary.csv`, `security-summary.csv` |
| 8 | Trình bày 10 phút tại hội trường thiết kế test (Ngày 8) | Cả 4 | Biên bản hội trường |
| 9 | `npm run gate` exit 0 trước khi commit | Cả 4 | `reports/gates/day-NN.md` |

> Quy tắc không được vi phạm: **không sửa test cho xanh**, không dùng `skip`/`only`, không hạ ngưỡng để đạt Exit criteria. Lỗi hạ tầng (mạng, timeout) không ghi thành defect của site đích.

---

## 4. Quy tắc bắt buộc khi viết test case

Mỗi test case trong `docs/testcases/*.csv` phải có đủ **4C**:

| Thành phần | Ý nghĩa | Kiểm tra bằng |
|---|---|---|
| **Correctness** | Đúng yêu cầu trong SRS-01 | Cột `Requirement_ID` trỏ tới đúng ID |
| **Clarity** | Người khác đọc là chạy được ngay | Cột `Title` mô tả rõ đối tượng và kỳ vọng |
| **Completeness** | Phủ cả hợp lệ và ngoại lệ | Dùng đủ EP / BVA / DT / ST / UC theo cột `Technique` |
| **Consistency** | Thuật ngữ và định dạng nhất quán | Cùng cấu trúc cột, cùng cách viết `Title` |

**Cấu trúc cột bắt buộc** (đã có trong file sẵn):

```
TC_ID,Requirement_ID,System,Title,Priority,Technique,Type,Owner,Status
```

| Cột | Giá trị hợp lệ |
|---|---|
| `TC_ID` | `TC-{T1\|T2\|T3}-M{1..7}-nnn` · `TC-NFR-0x-nnn` · kịch bản UAT: `TC-UAT-nn` |
| `Requirement_ID` | `FR-Mx-nn` hoặc `NFR-0x` — **bắt buộc tồn tại trong SRS-01** |
| `System` | `T1` · `T2` · `T3` · `ALL` (cho NFR áp dụng cả 3 site) |
| `Title` | Mô tả kiểm tra; phải đủ để thực thi mà không cần hỏi lại |
| `Priority` | `Critical` · `High` · `Medium` · `Low` |
| `Technique` | `EP` · `BVA` · `DT` · `ST` · `UC` · `Use case` |
| `Type` | `Auto` · `Manual` |
| `Owner` | `Mạnh` · `Tài` · `Ngân` · `Lộc` |
| `Status` | `Pass` · `Fail` · `Blocked` · `Not Run` |

**Kỹ thuật thiết kế test bắt buộc dùng** (theo Cẩm nang §4):

| Kỹ thuật | Dùng khi | Ví dụ trong dự án |
|---|---|---|
| **EP** — Phân vùng tương đương | Miền rời rạc: cân nặng, số điện thoại, từ khoá | 7 bậc cân nặng T2; SĐT hợp lệ / không hợp lệ |
| **BVA** — Giá trị biên | Có min/max rõ ràng | SĐT 10 ký tự (biên dưới) và 15 ký tự (biên trên); ngày hôm nay / +30 ngày |
| **DT** — Bảng quyết định | Nhiều điều kiện → nhiều kết quả | Phụ thu di chuyển T1 (C1 khoảng cách × C2 hình thức) — SRS §8.4 |
| **ST** — Chuyển trạng thái | Wizard nhiều bước | Wizard T1 (`W0..W7`) và T2 (`S0..S5`) — SRS §8.1, §8.2 |
| **UC** — Use case | Luồng người dùng hoàn chỉnh | UC-01…UC-08 — SRS §4 |

> Nguyên tắc chống Defect masking: **mỗi giá trị không hợp lệ một ca riêng**.

---

## 5. Ghi nhận kết quả

### 5.1 Test case tự động (Playwright)

```powershell
npm run test:e2e            # toàn bộ
npm run test:e2e:t1         # riêng T1
npm run test:e2e:t2         # riêng T2
npm run test:e2e:t3         # riêng T3
npm run test:a11y           # axe-core NFR-06
npm run test:cross-browser  # NFR-04: Chromium, Firefox, WebKit, Edge
npm run test:perf           # k6 tải đọc (cần k6 ngoài npm)
npm run lh:scan             # Lighthouse 3 site × 3 lần
npm run exec:sync           # đồng bộ kết quả vào reports/execution-log.csv + docs/testcases/*.csv
```

`exec:sync` tự cập nhật cột `Status` trong `docs/testcases/*.csv` và ghi `reports/execution-log.csv`. Không sửa tay các file này.

### 5.2 Test case thủ công

```powershell
node scripts/tc-record.mjs --tc TC-T1-M2-003 --result Pass --by Lộc --note "Đã kiểm tra bằng trình duyệt 360px"
node scripts/tc-record.mjs --tc TC-T2-M4-002 --result Fail --by Ngân --defect DEF-022 --note "SĐT rỗng vẫn gửi được"
```

### 5.3 Ghi nhận lỗi

Lỗi ghi vào `docs/defects/defects.csv`. Quy tắc quan trọng:

| Quy tắc | Giải thích |
|---|---|
| Phân biệt **lỗi sản phẩm** và **lỗi hạ tầng** | `ERR_INTERNET_DISCONNECTED`, timeout, `ENOTFOUND` là sự cố mạng — **không** ghi thành defect của site đích |
| Lỗi của site bên thứ ba vẫn ghi thành defect | Đó là **kết quả kiểm thử hợp lệ**, không phải lỗi của nhóm. Ghi với trạng thái `Open` và ghi chú rõ "lỗi của bên thứ ba, không sửa được" |
| **Không hạ tiêu chí để ép xanh** | Nếu site thật sự thiếu header bảo mật thì test phải Fail và phải có defect tương ứng |
| Bằng chứng là bắt buộc | Ảnh chụp, log lỗi, đường dẫn file trong `reports/playwright/` hoặc `reports/raw/` |

Cột của `docs/defects/defects.csv`:

```
DEF_ID,Severity,System,Requirement_ID,Test_Case_ID,Title,Description,Steps,Expected,Actual,Evidence,Owner,Status,Created
```

`Severity`: `Critical` · `High` · `Medium` · `Low` · `Trivial`. `Status`: `New` · `Assigned` · `In Progress` · `Fixed` · `Verified` · `Closed` · `Deferred` · `Rejected`.

---

## 6. Định dạng commit

```
<type>(<phạm vi>): <mô tả ngắn>

type: feat | fix | docs | test | chore | refactor
phạm vi: t1 | t2 | t3 | nfr | docs | scripts | design | reports
```

Ví dụ:

```
docs(design): them bang quyet dinh va do thi trang thai cho T1/T2/T3
test(t2): them ca doi chieu ma tran gia chuyen loai
feat(scripts): them survey-t3-services de lay danh muc API
```

---

## 7. Các lệnh kiểm tra chất lượng — chạy trước khi commit

```powershell
npm run lint          # ESLint cho tests/ và scripts/
npm run typecheck     # tsc --noEmit
npm run req:check     # SRS ↔ requirements.csv: ID, ưu tiên, tiêu chí đo được
npm run rtm:build     # sinh lại docs/rtm.csv và docs/rtm.md từ SRS + test case
npm run rtm:check     # truy xuất hai chiều 100%
npm run exit:check    # chấm EC-1..EC-8
npm run gate          # req:check + rtm:check + exit:check
```

Tất cả phải **exit 0** (trừ `exit:check` chỉ báo số tiêu chí đạt — các tiêu chí còn tới hạn ở ngày 11–13 được phép FAIL). Nếu `req:check` báo vi phạm, thường là do sửa SRS mà quên chạy `npm run req:build` để cập nhật `docs/requirements.csv`.

---

## 8. Mốc bàn giao từng ngày

Mỗi ngày kết thúc, người có vai trò chủ nhiệm commit và cập nhật `docs/PROGRESS.md`:

| Mục | Nội dung |
|---|---|
| `docs/PROGRESS.md` | Bảng trạng thái ngày + nhật ký phiên |
| `reports/gates/day-NN.md` | Gate: lệnh đã chạy, kết quả thật, tiêu chí đánh giá, rủi ro |
| `docs/testcases/*.csv` | Test case mới hoặc đổi trạng thái |
| `docs/defects/defects.csv` | Lỗi mới phát hiện |
| `docs/backlog.csv` | Cập nhật cột `status` của các mục đã xong |

---

## 9. Kênh trao đổi

| Nội dung | Kênh |
|---|---|
| Source code, test case, tài liệu | Git repository `https://github.com/ManhTran-ai/Pet-Spa-KTPM` — nhánh `main` |
| Báo lỗi nghi ngờ | Issue GitHub kèm mã `DEF-nnn` |
| Trao đổi nhanh | Nhóm chat của nhóm |
| Điểm tiến độ | `docs/PROGRESS.md` (cập nhật mỗi ngày) |

---

## 10. Ba câu hỏi thường gặp

**Q: Site đích có lỗi, mình có sửa được không?**
Không. Nhóm là bên kiểm thử độc lập, không phải bên phát triển. Lỗi được **ghi nhận và báo cáo**, không sửa. Đây là lý do Exit criteria EC-3 nói "0 lỗi Critical/High còn mở" được đánh giá trên phía chủ hệ thống — nhóm bàn giao danh sách lỗi kèm bằng chứng.

**Q: Test Fail có phải do mình viết sai không?**
Có thể. Trước khi ghi defect: đọc lại `Expected` trong test case, chạy lại 1–2 lần để loại trừ lỗi tạm thời của mạng, và kiểm tra lại bằng chứng. Nếu là lỗi hạ tầng (mạng, timeout) thì **không** ghi defect, ghi chú vào execution log.

**Q: Tôi nên bắt đầu từ đâu?**
Đọc §0 theo thứ tự, rồi mở `docs/backlog.csv`, lọc theo cột `owner` của bạn và `status = TODO`. Đó là danh sách việc của bạn, đã sắp theo mức MoSCoW.
