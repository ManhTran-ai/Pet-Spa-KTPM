# Kế hoạch thực hiện công việc còn giang dở — Mạnh (TV1, Test Lead)

Mã tài liệu: **PLN-01** · Ngày 2026-11-19 · Người lập: Mạnh · Nguồn: `docs/ASSIGNMENT.md` §3.4, lịch 14 ngày (§5 kế hoạch), `docs/backlog.csv`, `docs/testcases/*.csv`

> **Nguyên tắc thực thi:** các phase chạy **tuần tự**. Phase N+1 chỉ bắt đầu khi phase N đã đạt **đủ tiêu chí nghiệm thu** và được anh (Test Lead) xác nhận. Mỗi phase kết thúc bằng 1 commit + cập nhật `docs/PROGRESS.md` + `reports/gates/day-NN.md`.

---

## 0. Trạng thái hiện tại (đo tại 2026-11-19)

| Chỉ số | Giá trị |
|---|---|
| Test case của Mạnh | **56** (T3 chính 17 · T1 đối chiếu 27 · NFR-02 12) |
| Đã có kết quả | 9 (Pass 5 · Fail 4) |
| **Chưa thực thi** | **47** → Critical 34 · High 11 · Medium 2 |
| Backlog của Mạnh | 27 mục (Critical 15 · High 11 · Medium 1) |
| Exit criteria | 5/8 đạt (EC-1, EC-2, EC-3, EC-4, EC-8) · EC-5, EC-6, EC-7 chưa |
| Tài liệu thiết kế | `mccabe-coverage.md` v1.0 — đã review chéo (Ngân) ✅ |

**Khoản trống đã biết (RV-D6, `docs/reviews/design-review.md`):** bộ 226 test case **chưa từng đi qua Inspection** — mới chỉ có review chéo thiết kế. Chạy test case chưa được rà soát là lãng phí thời gian thực thi, nên Phase 1 đặt trước.

---

## Phase 1 — Rà soát bộ test case 226 ca theo checklist 4C (P0 · Ngày 8)

**Mục tiêu:** đóng RV-D6; bảo đảm mọi test case đúng 4C *trước khi* tốn công thực thi.

| # | Việc | Đầu ra |
|---|---|---|
| 1.1 | Viết checklist 4C dạng máy kiểm được: Correctness (`Requirement_ID` tồn tại trong `requirements.csv`), Clarity (`Title` ≥ 25 ký tự, mô tả rõ đối tượng + kỳ vọng), Completeness (`Technique` ∈ {EP, BVA, DT, ST, UC, Use case} và khớp với tập ca cùng yêu cầu), Consistency (cùng cấu trúc 9 cột, `TC_ID` đúng định dạng, không trùng `Title`) | `scripts/tc-review-check.mjs` |
| 1.2 | Chạy script trên 226 ca, xuất báo cáo lỗi theo mức Major/Minor | `reports/raw/tc-review-check.txt` |
| 1.3 | Sửa các ca vi phạm (đặc biệt T1 M3 BVA và T1 M6 DT — 15 ca của Mạnh) | `docs/testcases/*.csv` |
| 1.4 | Lập biên bản Inspection bộ test case (cùng khuôn §3.2 Cẩm nang: Kick-off → Chuẩn bị cá nhân → Họp → Sửa đổi → Theo dõi → Đóng) | `docs/reviews/testcase-inspection.md` |
| 1.5 | Chốt `docs/rtm.csv` truy xuất 2 chiều 100% sau thay đổi | `docs/rtm.csv`, `docs/rtm.md` |

**Nghiệm thu (đủ cả 5 mới sang phase sau):**
- `node scripts/tc-review-check.mjs` → 0 lỗi Major; lỗi Minor đều có ghi chú chấp nhận lý do.
- `npm run rtm:check` → độ phủ 100% hai chiều.
- `npm run gate` → exit 0.
- `docs/reviews/testcase-inspection.md` có mã phát hiện, phân loại, người sửa, trạng thái.

**Rủi ro:** có thể phát hiện ca sai → phải sửa trước khi chạy, không được sửa sau khi đã Fail (vi phạm quy tắc "không sửa test cho xanh").

---

## Phase 2 — Hội trường thiết kế test + Walkthrough (P0 · Ngày 8–9)

**Mục tiêu:** đạt mục 8 của §3A.4 (trình bày 10 phút) và chuẩn bị cho execution.

| # | Việc | Đầu ra |
|---|---|---|
| 2.1 | Chuẩn bị nội dung trình bày 10 phút theo mẫu §3.8: cơ sở lý thuyết (Cẩm nang §3.1–3.4, §5.2–5.4) → áp dụng 4 CFG của SRS §8 → ≥ 2 ví dụ `TC-...` thật → hạn chế của kỹ thuật | `docs/design/mccabe-coverage.md` §7 (phần trình bày) + `docs/slides/slide-08-mccabe.md` |
| 2.2 | Chốt biên bản hội trường: mục tiêu, danh sách tham dự, 4 nội dung bắt buộc của từng thành viên, ý kiến, quyết định | `docs/reviews/design-review.md` §Hội trường |
| 2.3 | Walkthrough thiết kế test: đi qua 4 CFG, xác nhận test case nào phủ cạnh nào, đánh dấu 2 cạnh chưa đi được do ADR-11 (có tài liệu lý do) | `reports/gates/day-09.md` |
| 2.4 | Chuẩn bị bộ dữ liệu test dùng chung (bảng giá REF-01, bậc cân nặng, khung giờ mở cửa T1/T2/T3) | `docs/reference/pricing-baseline.csv` (đã có) — bổ sung cột ghi chú cách nhập |

**Nghiệm thu:**
- Biên bản hội trường có đủ 4 mục × 4 thành viên.
- Mỗi thành viên xác nhận 2 cạnh CFG chưa phủ có lý do ADR-11.
- Bộ dữ liệu test được mọi người dùng chung, không tự chế số liệu.

---

## Phase 3 — Hoàn thiện hạ tầng tự động hóa cho 56 ca của Mạnh (P0 · Ngày 9)

**Mục tiêu:** biến các ca "Manual" thành script có bằng chứng máy (giữ đúng ranh giới ADR-11) để giảm rủi ro ghi nhầm và có bằng chứng tái lập được.

| # | Việc | Đầu ra |
|---|---|---|
| 3.1 | Bổ sung E2E cho T3 các module chưa có: M2 (danh mục dịch vụ), M3 (bảng giá theo bậc lbs), M4 (form đặt lịch), M7 (kênh liên hệ) | `tests/e2e/t3/m2-m3-m4-m7.spec.ts` |
| 3.2 | Bổ sung 2 ca đang khai `Auto` nhưng chưa có script: `TC-T1-M1-005` (không cuộn ngang 360px), `TC-T3-M1-002` (mọi liên kết menu → HTTP 200) | `tests/e2e/t1/m1-navigation.spec.ts`, `tests/e2e/t3/m1-m5-info.spec.ts` |
| 3.3 | Viết script cho bộ BVA/DT trọng tâm của Mạnh: 7 ca BVA cân nặng T1, 8 ca DT phụ thu T1 (M6), 5 ca DT/BVA T3 (M3) | `tests/e2e/t1/m3-bva-m6-dt.spec.ts`, `tests/e2e/t3/m3-pricing.spec.ts` |
| 3.4 | Bổ sung script cho 6 ca NFR-02 Manual còn lại, bảo đảm **không phá hại** theo ADR-11 (chỉ GET, không payload DoS, không đăng nhập) | `tests/security/*.spec.ts` |
| 3.5 | Chạy `npm run test:e2e` + `npm run test:a11y`, lưu báo cáo | `reports/raw/playwright-report.json`, `reports/playwright-html/` |

**Nghiệm thu:**
- `npm run lint` và `npm run typecheck` → exit 0.
- `npm run test:e2e` → script mới chạy được, không lỗi hạ tầng.
- **Tên mỗi test Playwright bắt đầu bằng mã `TC-...`** (bắt buộc — `scripts/exec-sync.mjs` chỉ nhận diện kết quả qua tiền tố này).
- Không có test nào bấm nút gửi cuối cùng / đăng nhập / đặt lịch thật.

---

## Phase 4 — System test vòng 1: T3 (hệ thống chính) (P0 · Ngày 11)

**Mục tiêu:** chạy hết **17 ca T3** của Mạnh.

| # | Việc | Đầu ra |
|---|---|---|
| 4.1 | Chạy 15 ca T3 chưa thực thi: `TC-T3-M1-002`, `M2-001..002`, `M3-001..005`, `M4-001..004`, `M5-001..002`, `M7-001` | `reports/execution-log.csv` (qua `npm run exec:sync`) |
| 4.2 | Mỗi Fail → tạo defect trong `docs/defects/defects.csv` (bắt buộc có bằng chứng) | defect tương ứng |
| 4.3 | Chụp lưu ảnh/log bằng chứng vào `reports/raw/` | ảnh + log |
| 4.4 | Cập nhật trạng thái cột `Status` trong `docs/testcases/t3.csv` | `docs/testcases/t3.csv` |

**Nghiệm thu:** 17/17 ca T3 có kết quả; 0 ca "Chưa thực thi"; mọi Fail có DEF; `npm run exec:sync` chạy không lỗi.

---

## Phase 5 — System test vòng 1: T1 đối chiếu (P0 · Ngày 11–12)

**Mục tiêu:** chạy hết **27 ca T1** (đối chiếu chéo với Tài) — trọng tâm là 20 ca Critical.

| # | Việc | Đầu ra |
|---|---|---|
| 5.1 | 7 ca BVA cân nặng `TC-T1-M3-008..014` — đối chiếu bảng giá REF-01 | execution log + bảng so khớp |
| 5.2 | 8 ca DT phụ thu `TC-T1-M6-008..015` — dựng bảng quyết định đầy đủ (khoảng cách × hình thức) | execution log + bảng DT |
| 5.3 | 2 ca ST wizard `TC-T1-M4-007`, `-009` — quay lại bước 3 / bỏ qua bước 1 | execution log |
| 5.4 | 8 ca UC còn lại (M1-005, M2-004..006, M4-006, -008, M5-003..004, M7-002) | execution log |
| 5.5 | **Đối chiếu chéo với Tài**: cùng ca, cùng dữ liệu → phải ra cùng kết luận; ghi nhận khác biệt | `reports/gates/day-11.md` §Đối chiếu chéo |

**Nghiệm thu:** 27/27 ca T1 có kết quả; 0 ca "Chưa thực thi"; đối chiếu chéo với Tài có biên bản khớp/không khớp.

---

## Phase 6 — Kiểm thử bảo mật NFR-02 + vòng đời defect (P0 · Ngày 12)

**Mục tiêu:** chạy 6 ca NFR-02 Manual còn lại và **đóng EC-6**.

| # | Việc | Đầu ra |
|---|---|---|
| 6.1 | Chạy 6 ca còn lại: `TC-NFR-02-006` (cookie phiên không mã hóa), `-007` (payload script vô hại), `-009` (TLS bắt tay), `-010` (rò rỉ khóa API/chuỗi kết nối), `-011` (rò rỉ email/SĐT trong HTML nguồn), `-012` (form GET chứa dữ liệu nhạy cảm) | execution log |
| 6.2 | Xác minh lại 4 Fail hiện có (`-001..-004`) trên **cả 3 site**, bổ sung bằng chứng cho từng site | `reports/raw/security-summary.csv` mở rộng đủ 15 dòng + header bị thiếu |
| 6.3 | Hoàn tất vòng đời 8 defect `DEF-002..005`, `DEF-009..012`: cập nhật Severity/Status theo ADR-11 (lỗi site đích, nhóm không sửa được → ghi chú rõ, chuyển `Deferred`/`Closed` khi đã bàn giao) | `docs/defects/defects.csv` |
| 6.4 | Lập `reports/raw/security-summary.csv` đầy đủ (TLS, cookie, header, rò rỉ) + ảnh chứng minh | file + ảnh |
| 6.5 | Đánh giá lại EC-6 | `reports/exit-criteria.md` |

**Nghiệm thu:**
- 12/12 ca NFR-02 có kết quả; 0 ca "Chưa thực thi".
- `npm run exit:check` → EC-6 có số liệu thật đầy đủ (không để trống).
- **Lưu ý quyết định cần anh chốt:** EC-6 đang định nghĩa "không có phát hiện bảo mật mức Critical/High" nhưng script đo cả việc *thiếu header* — mà site đích thực sự thiếu 14/15 header và nhóm **không có quyền sửa**. Em **không hạ ngưỡng** để ép xanh; đề xuất trong Final Test Report ghi EC-6 = FAIL kèm lý do "hệ thống đích không thoả NFR-02" và phân loại đây là **kết quả kiểm thử hợp lệ**, hoặc thống nhất đổi cách đo (chỉ tính lỗ hổng thực thi được) — cần anh quyết định ở Phase 6.

---

## Phase 7 — Kiểm thử tích hợp + Regression + chấm Exit criteria (P0 · Ngày 10 và 13)

| # | Việc | Đầu ra |
|---|---|---|
| 7.1 | **Kiểm thử tích hợp T1** (Ngày 10): quan sát network, hợp đồng dữ liệu bảng giá ↔ wizard, validation biên | `reports/integration-test-report.md` |
| 7.2 | **Tổng hợp báo cáo tích hợp từ 3 site** (Ngày 10 — vai trò Test Lead) | cùng file, mục tổng hợp |
| 7.3 | Re-test toàn bộ defect đã đóng (`Verified`) | execution log |
| 7.4 | Regression tự động toàn bộ E2E | `reports/regression-report.md` |
| 7.5 | Chấm lại EC-1..EC-8, đóng băng bộ test (tag) | `reports/exit-criteria.md`, `reports/gates/day-13.md` |
| 7.6 | **Siết EC-2 trong `scripts/exit-check.mjs`**: hiện tiêu chí chỉ tính tỷ lệ Pass, chưa kiểm tra "100% Critical/High đã thực thi" như công thức trong Test Plan — bổ sung phần kiểm tra độ phủ thực thi theo Priority | `scripts/exit-check.mjs`, `docs/test-plan.md` §5.2 |

**Nghiệm thu:**
- `npm run gate` → exit 0, EC đạt tối đa trong điều kiện thực tế.
- `docs/defects/defects.csv`: 0 lỗi Critical/High chưa xử lý; mọi lỗi đã qua đủ vòng đời.
- Bộ test được đóng băng bằng tag.

---

## Phase 8 — Final Test Report + Lessons learned + đóng gói hồ sơ (P0 · Ngày 14)

| # | Việc | Đầu ra |
|---|---|---|
| 8.1 | Final Test Report: phạm vi, môi trường, kết quả 226 ca, phân bố Pass/Fail/Blocked/Not Run theo hệ thống và theo kỹ thuật thiết kế, đánh giá từng EC, đối chiếu mục tiêu Hướng 2 (H2-1..H2-4), phần tử hạn chế | `reports/final-test-report.md` |
| 8.2 | Lessons learned: điều gì đã làm tốt, điều gì lãng phí thời gian, ADR nào đã đúng, đề xuất cải tiến quy trình | `reports/lessons-learned.md` |
| 8.3 | Hồ sơ nộp: đủ 14 nhóm theo §6.1 kế hoạch (SRS · 5 tài liệu thiết kế · Test Plan · 226 TC · RTM · biên bản review · báo cáo tích hợp · execution log · defect log · báo cáo phi chức năng · regression/UAT · Final Test Report · bộ test tự động · slide+demo) | `reports/handoff-checklist.md` |
| 8.4 | Tag `v1.0` + commit cuối + push | Git |

**Nghiệm thu:**
- `reports/handoff-checklist.md` đánh dấu đủ 14/14 nhóm, không mục nào trống.
- Final Test Report có bảng số liệu thật lấy từ `reports/execution-log.csv`, không có con số ước lượng.
- Repo có tag `v1.0`; `npm run gate` exit 0.

---

## Tổng hợp thứ tự ưu tiên

| Phase | Nội dung | Mức | Ngày | Chặn cái gì |
|---|---|---|---|---|
| 1 | Inspection 226 test case (4C) | P0 | 8 | Mọi phase thực thi sau |
| 2 | Hội trường thiết kế + walkthrough + dữ liệu test | P0 | 8–9 | Mục 8 §3A.4 |
| 3 | Hạ tầng tự động hóa cho 56 ca | P0 | 9 | Phase 4–6 (bằng chứng máy) |
| 4 | System test T3 (17 ca) | P0 | 11 | EC-2 |
| 5 | System test T1 đối chiếu (27 ca) | P0 | 11–12 | EC-2, đối chiếu chéo |
| 6 | NFR-02 bảo mật (12 ca) + vòng đời defect | P0 | 12 | EC-6 |
| 7 | Tích hợp + regression + chấm Exit criteria | P0 | 10, 13 | EC-1..EC-8 |
| 8 | Final Test Report + Lessons learned + hồ sơ nộp | P0 | 14 | H2-4 |

---

## Rủi ro toàn cục và cách xử lý

| Rủi ro | Xử lý |
|---|---|
| Site đích thay đổi giữa lúc chạy (giá, layout) | Luôn đối chiếu với `docs/reference/pricing-baseline.csv` (baseline đóng băng); ghi nhận sai lệch bằng CR mới, không sửa ngầm test case |
| Lỗi hạ tầng (network, timeout) bị ghi nhầm là defect của site | Phân biệt rõ theo §5.3; lỗi hạ tầng chỉ ghi vào execution log, không mở defect |
| Thực thi trên production bị giới hạn tần suất | `workers: 1`, `fullyParallel: false`, giữ lễ tinh giữa các lần gọi — đã cấu hình trong `playwright.config.ts` |
| Sửa test case sau khi đã Fail để ép xanh | Tuyệt đối không. Mọi sửa đổi test case sau execution phải ghi trong biên bản Phase 1 với lý do |
| 46 ca Manual trên production tốn nhiều thời gian | Phase 3 chuyển phần lớn sang script; ca còn lại làm thủ công có checklist + ảnh chụp |
| EC-6 về mặt kỹ thuật không thể đạt do site thiếu header | Không hạ ngưỡng; báo cáo trung thực + quyết định của Test Lead ở Phase 6 |

---

## Quy ước bàn giao giữa các phase

1. Mỗi phase kết thúc → 1 commit theo mẫu §6 (`<type>(<phạm vi>): <mô tả>`), cập nhật `docs/PROGRESS.md`, viết `reports/gates/day-NN.md`.
2. `npm run gate` phải exit 0 trước mỗi commit.
3. Em báo cáo kết quả phase vừa xong (kèm số liệu thật) và **dừng chờ anh xác nhận** trước khi bắt đầu phase kế tiếp.
4. Mọi phát hiện mới ảnh hưởng yêu cầu → mở CR trong `docs/change-requests.md`, không sửa SRS tại chỗ.
