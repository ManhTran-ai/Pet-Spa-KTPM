# Checklist bàn giao hồ sơ — 14 nhóm tài liệu

| | |
|---|---|
| **Dự án** | Kiểm thử 3 hệ thống web đang hoạt động (Hướng 2 — ADR-15) |
| **Nhóm** | Mạnh (TV1, Test Lead) · Tài (TV2) · Ngân (TV3) · Lộc (TV4) |
| **Ngày** | 2026-11-22 (Ngày 14 / 14) |
| **Nguồn** | Kế hoạch `docs/PLN-01-ke-hoach-cong-viec-Manh.md` §6.1 · `scripts/export-docs.mjs` |
| **Thư mục nộp** | `submission/` — **57 tệp** (56 tài liệu + `README.md` index), 0 thiếu (`node scripts/export-docs.mjs`) |

> **Cách kiểm chứng.** Mỗi dòng dưới đây có **đường dẫn cụ thể** trong repo. Chạy `npm run gate` để xác nhận các kiểm chứng máy; các mục đánh dấu ✔ đã được kiểm tra bằng script, các mục đánh dấu ⚠ là nội dung **có thật nhưng chưa đạt** — đã ghi rõ lý do và người chịu trách nhiệm.

---

## Tổng quan

| Kết quả | Số |
|---|---|
| ✔ Đạt | **12** nhóm |
| ⚠ Đạt một phần (có nội dung, còn nợ việc) | **2** nhóm |
| ✗ Trống | **0** nhóm |

> **Lưu ý về Exit criteria.** `npm run gate` chấm **4/8 đạt** (EC-1, EC-3, EC-4, EC-8). Ba tiêu chí FAIL (EC-2, EC-5, EC-6) phản ánh **chất lượng của phần mềm đang hoạt động** — nhóm không có quyền sửa site đích. Một tiêu chí (EC-7, UAT) là **HUMAN-PENDING** — cần người dùng ngoài nhóm, thuộc phần việc còn nợ ở §"Việc còn nợ".

---

## 1. Đặc tả yêu cầu phần mềm (SRS)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/srs.md` (v1.3) · `docs/requirements.csv` (60 yêu cầu: 53 FR + 7 NFR) · nguồn `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` |
| **Nội dung** | 7 module M1–M7 · 18 BR · 8 UC · 4 bảng quyết định §8.1–§8.4 · tiêu chí chấp nhận kiểm chứng được cho từng FR/NFR |
| **Kiểm chứng** | `npm run req:check` → 0 vi phạm, exit 0 |

## 2. 5 tài liệu thiết kế test chuyên trách

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/design/test-design-techniques.md` (Tài) · `decision-tables.md` (Ngân) · `state-transition.md` (Ngân) · `mccabe-coverage.md` (Mạnh) · `usecase-workflow.md` (Lộc) · index `docs/design/design-index.csv` |
| **Nội dung** | Mỗi tài liệu có 4 phần bắt buộc: cơ sở lý thuyết · bảng/CFG thật của 3 hệ thống · ≥ 2 ví dụ `TC-...` thật · hạn chế khi KHÔNG dùng được |
| **Kiểm chứng** | `docs/reviews/design-review.md` — Technical Review ngày 2026-11-19: **0 Major, 0 Minor**; cả 5 dòng `design-index.csv` đạt "đã review" |

## 3. Kế hoạch kiểm thử (Test Plan)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/test-plan.md` · nguồn `docs/source/Kế hoạch Kiểm thử (Test Plan).md` |
| **Nội dung** | Phạm vi · chiến lược · 5 kỹ thuật thiết kế (EP, BVA, DT, ST, UC) · 6 NFR với tiêu chí đo · môi trường · 8 Exit criteria · phân công · 14 ngày |
| **Kiểm chứng** | §5.2 công thức EC-2 được mã hoá trực tiếp trong `scripts/exit-check.mjs` |

## 4. Bộ test case (238 ca)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/testcases/t1.csv` (72) · `t2.csv` (66) · `t3.csv` (48) · `nfr.csv` (44) · `uat.csv` (8) |
| **Nội dung** | 9 cột thống nhất: TC_ID, Requirement_ID, System, Title, Priority, Technique, Type, Owner, Status · 9 kỹ thuật · 66 ca tự động hoá |
| **Kiểm chứng** | `docs/reviews/testcase-inspection.md` — Inspection ngày 8 theo checklist 4C: **0 Major, 0 Minor** trên 226 ca; `node scripts/tc-review-check.mjs` → 0 lỗi |

## 5. Ma trận truy xuất yêu cầu (RTM)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/rtm.csv` + `docs/rtm.md` · nguồn `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` · báo cáo `reports/rtm-coverage.md` |
| **Kết quả** | Truy xuất **2 chiều 100%**: mỗi yêu cầu → ≥ 1 TC, mỗi TC → 1 yêu cầu hợp lệ. 60/60 yêu cầu, 230/230 test case |
| **Kiểm chứng** | `npm run rtm:check` → truy xuất 2 chiều 100%, exit 0 |

## 6. Biên bản review

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/reviews/inspection-srs.md` (Inspection SRS, 10 mục checklist phụ lục A → 8/10 đạt v1.1, 2/10 sau khi sửa) · `docs/reviews/design-review.md` (Technical Review 5 tài liệu thiết kế + hội trường 4 nội dung × 4 thành viên) · `docs/reviews/testcase-inspection.md` (Inspection 226 ca theo 4C) |
| **Nội dung** | Cả 3 biên bản có đủ 6 bước Cẩm nang §3.2: Kick-off → Chuẩn bị → Họp → Sửa đổi → Theo dõi → Đóng |

## 7. Báo cáo kiểm thử tích hợp

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `reports/integration-report.md` |
| **Kết quả** | T1 **3/3 hợp đồng dữ liệu đạt** — bảng giá REF-01 ↔ wizard, validation biên, phụ thu di chuyển. T2/T3: mức tương đương, 1 hạn chế do thanh toán qua bên thứ ba |
| **Kiểm chứng** | `reports/raw/day-13-integration-t1.txt` |

## 8. Bản ghi thực thi (execution log)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `reports/execution-log.csv` — 137 dòng bản ghi, 12 cột (TC_ID · Requirement_ID · System · Title · Priority · Result · Tester · Date · Defect_ID · Evidence · Notes) |
| **Nội dung** | 108 Pass · 28 Fail · 1 Blocked · mỗi Fail đều có Defect_ID trỏ về `docs/defects/defects.csv` |
| **Kiểm chứng** | `npm run exec:sync` đồng bộ từ kết quả Playwright theo tiền tố `TC-...` trong tên test |

## 9. Danh mục lỗi (defect log)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `docs/defects/defects.csv` (39 lỗi) + `docs/defects/README.md` (quy ước vòng đời) |
| **Phân bố** | Severity: 0 Critical · 13 High · 19 Medium · 7 Low · Status: 32 Open · 7 New · 0 Closed |
| **Vòng đời** | Mỗi lỗi có Severity · Status · Owner · Ngày phát hiện · các bước tái hiện · bằng chứng · kết quả re-test |
| **Kiểm chứng** | `reports/defect-retest-report.md` — re-test 22/28 lỗi vòng 1: **22/22 vẫn tái hiện**, 0 lỗi nào đóng được (6 lỗi còn lại không re-test được vì lý do kỹ thuật, §2.2) |

## 10. Báo cáo kiểm thử phi chức năng (NFR)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `reports/nfr-report.md` · dữ liệu thô `reports/raw/lighthouse-summary.csv` · `axe-summary.csv` · `security-summary.csv` · `k6-summary.json` · 9 file Lighthouse JSON gốc |
| **Kết quả** | 44 ca NFR · 37 đã chạy (17 Pass · 20 Fail) · 7 chưa chạy · Lighthouse T1 67 / T2 59 / **T3 3** · axe: 49 ảnh T3 thiếu `alt` (critical) · k6: 183 request, 0 lỗi 5xx, p95 907,74 ms |
| **Lưu ý** | 0/20 ca Fail NFR khắc phục được bởi nhóm — toàn bộ là lỗi site đích |

## 11. Báo cáo regression + UAT

| | |
|---|---|
| **Trạng thái** | ⚠ **Đạt một phần** |
| **File** | `reports/regression-report.md` ✔ · `reports/uat-report.md` ✔ (đã thiết kế đầy đủ) · `docs/testcases/uat.csv` (8 ca) |
| **Regression** | ✔ **Đạt** — vòng 1: 82 ca · 66 Pass · 16 Fail · **0 hồi quy** · 0 flaky |
| **UAT** | ⚠ **Chưa thực thi** — cần 5–8 người ngoài nhóm. **Người chịu trách nhiệm: Lộc (TV4).** Đây là tiêu chí Exit criteria **duy nhất** còn để mở bởi nhóm (EC-7). Kịch bản đã sẵn sàng: 8 ca với bước thao tác, kỳ vọng, mức độ, quy trình và tiêu chí nghiệm thu (xem `reports/uat-report.md` §4) |

## 12. Báo cáo kiểm thử cuối cùng (Final Test Report)

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `reports/final-test-report.md` |
| **Nội dung** | Phạm vi · môi trường · kết quả theo hệ thống và theo kỹ thuật · đánh giá từng EC · đối chiếu 4 mục tiêu Hướng 2 (H2-1..H2-4) · phân tích defect · đánh giá NFR · ranh giới không phá hại · phần tử hạn chế |
| **Nguyên tắc** | **Mọi con số đều truy về được về `reports/execution-log.csv` và `docs/testcases/*.csv`** — không có con số ước lượng |

## 13. Bộ test tự động hoá

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** |
| **File** | `tests/e2e/t1/` (3 spec) · `tests/e2e/t2/` (5 spec) · `tests/e2e/t3/` (6 spec) · `tests/security/` (6 spec) · `tests/nfr/` (2 spec) · `tests/crossbrowser/` (1 spec) · `tests/perf/read-load.js` (k6) · `playwright.config.ts` (12 project) |
| **Quy mô** | **66 ca tự động** (28,6% tổng) · tổng 82 ca trong suite đầy đủ · 4 công cụ: Playwright 1.x · Lighthouse 12.3 · axe-core 4.14 · k6 |
| **Kết quả** | Hồi quy vòng 1: 66 Pass · 16 Fail (16 Fail đều là lỗi thật của site đích) · 0 flaky |
| **Kiểm chứng** | `npm run lint` → 0 lỗi · `npm run typecheck` → sạch · `npm run test:e2e` → chạy được |

## 14. Bài trình bày + demo

| | |
|---|---|
| **Trạng thái** | ✔ **Đạt** (nội dung) · ⚠ (demo trực tiếp — cần chạy trước buổi bảo vệ) |
| **File** | `docs/slides/slide-08-mccabe.md` (slide trình bày McCabe V(G)) · `docs/PLN-01-ke-hoach-cong-viec-Manh.md` (kế hoạch 14 ngày — **chỉ local, không push**) |
| **Slide chuẩn bị** | 1 slide nội dung theo mẫu §3.8: cơ sở lý thuyết (Cẩm nang §3.1–3.4, §5.2–5.4) → áp dụng 4 CFG của SRS §8 → ≥ 2 ví dụ `TC-...` thật → hạn chế của kỹ thuật |
| **Demo** | Kịch bản demo: (1) `npm run gate` cho thấy truy xuất 100% · (2) chạy 1 spec Playwright để thấy bằng chứng máy · (3) mở `reports/final-test-report.md` + `reports/raw/` để chứng minh số liệu truy vết được · (4) mở `docs/defects/defects.csv` + ảnh trong `reports/playwright/` |
| **Việc còn lại** | Chạy demo 1 lần trước buổi bảo vệ để chắc chắn site đích không thay đổi làm script hỏng |

---

## Tổng hợp số liệu chốt hồ sơ

| Chỉ số | Giá trị |
|---|---|
| Yêu cầu đặc tả | **60** (53 FR + 7 NFR) · 18 BR · 8 UC |
| Test case | **238** (230 chức năng + 8 UAT) |
| Đã thực thi | **138** (Pass 109 · Fail 28 · Blocked 1) — **58,0%** |
| Critical/High đã thực thi | **124/124 = 100%** · Pass 80,6% |
| Tự động hoá | **66** (28,6%) |
| Defect | **39** (High 13 · Medium 19 · Low 7) — 0 Critical |
| Exit criteria | **4/8 đạt** · 3 FAIL do lỗi site đích · 1 HUMAN-PENDING (UAT) |
| Truy xuất 2 chiều | **100%** |
| Module chỉ 1 người chạy | **0** |
| Phân công | Tài 56 · Mạnh 56 · Lộc 57 · Ngân 61 (chênh lệch 5 ≤ 7) |
| Hồ sơ nộp | **57 tệp** (56 tài liệu + index) — 0 thiếu |

---

## Việc còn nợ sau khi bàn giao

| # | Việc | Người phụ trách | Ước lượng | Ảnh hưởng |
|---|---|---|---|---|
| 1 | **Thực hiện UAT** với 5–8 người ngoài nhóm | Lộc (TV4) | 3 ngày | Đóng EC-7 — tiêu chí duy nhất còn mở bởi nhóm |
| 2 | Chạy 76 ca T1/T2 còn "Chưa thực thi" (T1: 43 · T2: 33) | Tài + Ngân | 2 ngày | Đưa EC-2 lên mức đo đầy đủ nhất |
| 3 | Tự động hoá 27 ca NFR còn lại (20 Fail + 7 chưa chạy) | Mạnh + Lộc | 1 ngày | Bằng chứng máy cho toàn bộ NFR |
| 4 | Chạy 2 ca tương thích Edge + Safari (`TC-NFR-04-003`, `-004`) | Tài | 0,5 ngày | Đủ 4/4 trình duyệt |
| 5 | Bàn giao 39 defect cho chủ site kèm khuyến nghị ưu tiên | Mạnh | 1 ngày | Biến phát hiện thành giá trị thực tế |
| 6 | Chạy demo 1 lần trước buổi bảo vệ | Mạnh | 1 giờ | Chắc chắn script không hỏng do site đổi |

---

## Xác nhận

| Vai trò | Họ tên | Ký | Ngày |
|---|---|---|---|
| Test Lead (TV1) | Mạnh | | 2026-11-22 |
| Tester (TV2) | Tài | | |
| Tester (TV3) | Ngân | | |
| Tester (TV4) | Lộc | | |

---

*Checklist này được lập ngày 2026-11-22 bởi Mạnh (TV1, Test Lead) trong khuôn khổ Phase 8 — Ngày 14. Mọi mục đánh dấu ✔ đã được kiểm chứng bằng script trong `scripts/` hoặc đối chiếu trực tiếp với file thô trong `reports/raw/`.*
