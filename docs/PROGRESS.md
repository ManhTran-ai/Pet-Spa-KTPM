# PROGRESS: Kiểm thử 3 hệ thống Pet Spa (14 ngày)

Cập nhật: 2026-11-22 · Phiên: 14 (Ngày 14 — **Phase 8 xong**: Final Test Report · Lessons Learned · Báo cáo NFR · Báo cáo UAT · Handoff checklist 14/14 nhóm · hồ sơ nộp `submission/` 55 tệp · sửa logic EC-7 để phản ánh đúng "UAT chưa thực thi" · Exit criteria 4/8 đạt) · Nhóm: Mạnh, Tài, Ngân, Lộc

> **Phase 8 — hồ sơ nộp & bàn giao (2026-11-22).** Hoàn thành 4 sản phẩm Phase 8: `reports/final-test-report.md` (báo cáo kiểm thử cuối cùng — phạm vi, môi trường, kết quả theo hệ thống và theo kỹ thuật, đánh giá 8 EC, đối chiếu H2-1..H2-4) · `docs/lessons-learned.md` (10 bài học kinh nghiệm theo 5 nhóm: quy trình · công cụ · kiểm thử không phá hại · đạo đức · làm việc nhóm) · `reports/nfr-report.md` (44 ca NFR — Lighthouse, axe-core, k6, security header; 37 đã chạy, 20 Fail) · `reports/uat-report.md` (8 kịch bản UAT + phương pháp + tiêu chí nghiệm thu) · `reports/handoff-checklist.md` (14/14 nhóm hồ sơ, 0 mục trống).
>
> **Sửa lỗi logic EC-7.** `scripts/exit-check.mjs` trước đây coi EC-7 là đạt chỉ vì **file `reports/uat-report.md` tồn tại** — dù UAT chưa thực thi, khiến `exit:check` báo 5/8. Đã sửa: EC-7 chỉ đạt khi báo cáo ghi **Đã thực thi ≥ 1** và không có phản hồi chặn. Kết quả: EC-7 = **HUMAN-PENDING**, tổng **4/8 đạt** — khớp với thực tế và với `final-test-report.md`.
>
> **Hồ sơ nộp.** `scripts/export-docs.mjs` bổ sung gom `docs/design/` (5 tài liệu thiết kế + index), `reports/gates/` (17 biên bản gate), `reports/execution-log.csv` (137 dòng), `defect-retest-report.md`; sửa danh sách review cho đúng tên thật (`inspection-srs.md` · `design-review.md` · `testcase-inspection.md`). Kết quả: **56 tài liệu** (57 tệp gồm index), 0 thiếu.

> **Lịch sử phiên.** Phiên 12 (2026-11-22): Phase 3 + Phase 4/5 + Phase 6 + Phase 7 của Mạnh — tự động hóa 56 ca (44 ca Manual → Auto), system test T3/T1, kiểm thử bảo mật NFR-02, kiểm thử tích hợp + re-test lỗi + hồi quy + chấm Exit criteria. Phiên 11 (2026-11-21): **Ngân hoàn tất 57/57 ca** (43 Pass · 13 Fail · 1 Blocked; log `DEF-029`…`DEF-035`) — hợp nhất vào `docs/testcases/t3.csv`, `docs/defects/defects.csv`, `reports/execution-log.csv` (tổng 137 dòng thực thi). Phiên trước (2026-11-19): Phase 1 + Phase 2 xong — Inspection bộ 226 test case (0 Major) · Hội trường thiết kế test + Walkthrough 4 CFG · SRS-01 → v1.4.

> **Hợp nhất sau merge với nhóm (2026-11-22).** Bốn test case của Ngân bị trùng `TC_ID` với bốn test case của Mạnh nhưng khác nội dung → cấp số mới `TC-T3-M4-012`…`TC-T3-M4-015` cho các ca của Ngân (`FR-M4-07`, `FR-M4-08`); `docs/rtm.csv` cập nhật cho 4 ca mới. Bốn defect của Ngân trùng số với `DEF-025`…`DEF-028` của Mạnh → đánh số lại thành `DEF-036`…`DEF-039`; các tham chiếu trong `reports/execution-log.csv` được cập nhật theo. Cột `Status` của `docs/testcases/t3.csv` được đồng bộ lại theo `reports/execution-log.csv` (nguồn bản ghi thực thi) — **không sửa kết quả ca nào để làm xanh**.

> **Phase 3 — tự động hóa 56 ca của Mạnh (2026-11-22).** Đã viết 4 spec Playwright (`tests/e2e/t3/m2-m3-m4-m7.spec.ts` 21 ca · `tests/e2e/t1/m3-bva-m6-dt.spec.ts` 16 ca · `tests/security/security-checks.spec.ts` 6 ca · bổ sung `TC-T3-M1-002`) → **44 ca chuyển từ Manual sang Auto có bằng chứng máy**. Chạy 3 project (`t1`, `t3`, `security`): **72 ca · 56 Pass · 16 Fail**; trong đó 4 Fail của Phase 3 đều là **defect thật của site đích** (`TC-T1-M1-005` tràn ngang 360px · `TC-T3-M3-004` thiếu câu giá dự kiến · `TC-T3-M4-006` báo lỗi im lặng · `TC-NFR-02-010` lộ Google Maps API key). Mở `docs/defects/defects.csv`: **DEF-025** (Medium) · **DEF-026** (Medium) · **DEF-027** (High) · **DEF-028** (High, PII qua API login). Sửa 9 test case còn "Chưa thực thi" theo hành vi thật (7 ca BVA T1 + `TC-T3-M4-010` + `TC-T3-M3-003`) — **không sửa ca nào đã Fail**. Mở CR `CHG-2026-11-22-01` sửa `BR-03` (nhóm dịch vụ Mèo của T3 không chia bậc lbs) → SRS-01 **v1.4 → v1.5**. Đồng bộ `reports/execution-log.csv` (71 dòng: Pass 55 · Fail 16) + cột `Status` trong `docs/testcases/*.csv` (tổng 226 ca: Pass 58 · Fail 16 · Chưa thực thi 150 · Blocked 2). Sửa công thức **EC-2** theo Test Plan §5.2 (hạng mục 7.6 của Phase 7, làm sớm vì công thức cũ đo sai): **Critical/High 64/64 đã thực thi (100%)**, Pass 82.8% → EC-2 = FAIL (trung thực, nhóm không có quyền sửa site đích). Chi tiết: `reports/gates/day-09b.md`.

> **Hướng đồ án đã chốt (ADR-15, 2026-11-19).** Giảng viên đưa ra ba hướng và yêu cầu chọn **một**; nhóm chọn **Hướng 2** — *"Thiết kế và kiểm thử cho một phần mềm đang hoạt động, các bạn phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử"*. Hướng này gồm 4 yêu cầu nhóm cam kết: **H2-1** mô tả chi tiết yêu cầu/tính năng (SRS-01 v1.2 — 58 yêu cầu, 18 BR, 8 UC, 4 bảng quyết định, tiêu chí chấp nhận đều định lượng) · **H2-2** thiết kế test (226 ca + 5 tài liệu `docs/design/`) · **H2-3** kiểm thử không phá hại (Playwright + axe + Lighthouse + k6) · **H2-4** truy vết & báo cáo (RTM 100%, Inspection, Exit criteria, Final Test Report). Hệ quả phân công: mỗi thành viên phụ trách một nhóm kỹ thuật thiết kế test với tài liệu riêng; 226 test case được cân bằng lại (55/56/57/58, chênh lệch 3) và mỗi module của mỗi hệ thống có ≥ 2 người chạy để đối chiếu chéo. Chi tiết: `docs/decisions.md` ADR-15, `docs/ASSIGNMENT.md` §3 và §3A.

> **Điều chỉnh chiến lược (CHG-2026-11-13-03).** Giảng viên không yêu cầu nhóm tự xây dựng ứng dụng web. Đồ án chuyển sang **kiểm thử ba hệ thống web đang vận hành**: T1 Pet NGON (`petngon.vn/vi`), T2 Mật Pet Family (`matpet.vn/spa`), T3 Pretty Paws (`prettypawscatanddoggrooming.groomore.com`). Mốc 14 ngày được tính lại từ **2026-11-13** (Ngày 1). Mọi tài liệu cốt lõi đã viết lại theo hướng này. Quyết định chi tiết: ADR-09 đến ADR-13 trong `docs/decisions.md`.

## Kế hoạch phiên 3 (Ngày 1 theo hướng mới · Mạnh · vai TESTER + tài liệu)

1. Gom toàn bộ mã nguồn gian dở và testware cũ vào `archive/2026-11-13-webapp-pivot/`, giải phóng thư mục gốc cho workspace kiểm thử mới. Verify: thư mục gốc chỉ còn tài liệu và script kiểm thử mới.
2. Viết lại bản tổng hợp `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` theo hướng kiểm thử 3 site. Verify: nêu rõ 3 hệ thống, ranh giới an toàn, lịch 14 ngày, tiêu chí kết thúc.
3. Viết lại SRS đích `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` v1.0: 7 module, 58 FR, 7 NFR, 16 BR, bảng quyết định và bảng chuyển trạng thái. Verify: mọi FR/NFR đều có tiêu chí chấp nhận đo được, không còn `[Cần chốt]`.
4. Viết `docs/source/Kế hoạch Kiểm thử (Test Plan).md` v1.0: mô hình V thích nghi, phân tích rủi ro, chiến lược theo mức, kỹ thuật thiết kế test, tiêu chí vào/kết thúc. Verify: khớp phạm vi với SRS và ADR-11.
5. Viết `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` v1.0 sinh tự động từ SRS + test case. Verify: truy xuất hai chiều đầy đủ, 0 yêu cầu chưa phủ.
6. Tạo bộ test case `docs/testcases/t1.csv`, `t2.csv`, `t3.csv`, `nfr.csv`, `uat.csv`. Verify: mỗi test case có đủ 4C và truy xuất về đúng một yêu cầu.
7. Cập nhật `docs/decisions.md` (ADR-09..13), `docs/change-requests.md` (CHG-2026-11-13-03), `docs/requirements.csv`, `docs/backlog.md`/`.csv`, `docs/PROGRESS.md`.
8. Dựng hạ tầng kiểm thử mới: `package.json` (Playwright, Newman, k6, Lighthouse, ESLint), `playwright.config.ts`, cấu trúc `tests/`, script `scripts/rtm-build.mjs` và `scripts/req-build.mjs`.

Rủi ro: (a) site đích thay đổi giao diện giữa kỳ làm script hỏng — dùng selector theo vai trò/nhãn; (b) không có môi trường staging nên phải giới hạn thao tác theo ADR-11; (c) SRS đích là đặc tả "as-observed" nên cần Inspection ngày 3 để chấp nhận rủi ro và loại bỏ yêu cầu quan sát sai; (d) số lượng test case (226) có thể vượt năng lực thực thi trong 2 ngày 11–12 — cần phân bổ lại ở cuối ngày 8.

## Lịch 14 ngày (tính từ 2026-11-13)

| Ngày | Ngày thực | Giai đoạn | Nội dung chính | Gate |
|---|---|---|---|---|
| 1 | 13/11 | Kế hoạch | Bản tổng hợp, SRS đích v1.0, Test Plan v1.0, RTM v1.0, bộ test case, hạ tầng | Tài liệu baseline, truy xuất 100% |
| 2 | 14/11 | Kế hoạch | Khảo sát chi tiết T1/T2/T3, bổ sung quan sát vào SRS, chốt bảng giá tham chiếu | SRS cập nhật |
| 3 | 15/11 | Thiết kế | Inspection SRS đích, biên bản, sửa lỗi đặc tả | Biên bản review |
| 4 | 16/11 | Thiết kế | Thiết kế test chi tiết theo module và hệ thống | Thiết kế test v0.1 |
| 5 | 17/11 | Thiết kế | Technical Review thiết kế test, Test Plan v1.0 chốt, chuẩn bị script mẫu | Biên bản TR |
| 6 | 18/11 | Thiết kế | Viết test case M1–M2, M7 | Test case v0.5 |
| 7 | 19/11 | Thiết kế | Viết test case M3 (giá biên) | Test case v0.7 |
| 8 | 20/11 | Thiết kế | **Inspection bộ test case theo checklist 4C** (Phase 1 của Mạnh): rà 226 ca, mở CR `CHG-2026-11-19-01`, SRS → v1.3, viết lại 11 ca T3 theo hành vi thật | Test case v1.0 · `tc-review-check` 0 Major |
| 9 | 21/11 | Thực hiện | Chuẩn bị môi trường, script Playwright smoke cho 3 site, bộ dữ liệu test | Smoke xanh |
| 9 | 22/11 | Thực hiện | **Phase 3 của Mạnh — tự động hóa 56 ca**: 4 spec Playwright (44 ca Manual → Auto) · chạy `t1`/`t3`/`security` (72 ca · 56 Pass · 16 Fail) · 4 defect `DEF-025`…`DEF-028` · CR `CHG-2026-11-22-01`, SRS → v1.5 | Gate `reports/gates/day-09b.md` · `npm run gate` exit 0 |
| 11 | 22/11 | Thực hiện | **Phase 4 (System test T3) + Phase 5 (System test T1 đối chiếu) của Mạnh**: 17/17 ca T3 và 27/27 ca T1 có kết quả (42 Pass · 2 Fail) · viết spec mới `tests/e2e/t1/m2-m4-m5-m7.spec.ts` cho 10 ca T1 còn lại (10/10 Pass) · chạy lại full suite: **82 ca · 66 Pass · 16 Fail** | Gate `reports/gates/day-11.md` · `npm run gate` exit 0 |
| 10 | 22/11 | Thực hiện | Kiểm thử tích hợp (quan sát hợp đồng dữ liệu giao diện ↔ API) | Báo cáo tích hợp |
| 11 | 23/11 | Thực hiện | System test vòng 1, ghi defect log | Vòng 1 xong |
| 12 | 22/11 | Thực hiện | **Phase 6 của Mạnh — kiểm thử bảo mật NFR-02**: 12/12 ca NFR-02 có kết quả · viết `scripts/security-scan.mjs` tự động hoá bằng chứng bảo mật (`npm run security:scan`) → `security-summary.csv` mở rộng 15 → 24 dòng · sửa công thức EC-6 đo đủ 4 nhóm kiểm tra · giữ trạng thái `Open` cho 8 defect theo quy tắc vòng đời lỗi | Gate `reports/gates/day-12.md` · `npm run gate` exit 0 |
| 13 | 22/11 | Thực hiện | **Phase 7 của Mạnh — kiểm thử tích hợp + re-test lỗi + hồi quy + chấm Exit criteria**: HĐ-1 14/14 khớp · HĐ-2 4/4 gói tính đúng · HĐ-3 công thức khớp · 22/28 defect re-test (0 đóng) · hồi quy vòng 1: **82 ca · 66 Pass · 16 Fail · 0 hồi quy** · Exit criteria **4/8 đạt** | Gate `reports/gates/day-13.md` · `npm run gate` exit 0 |
| 14 | 26/11 | Báo cáo | Final Test Report, Lessons learned, đóng gói hồ sơ nộp | Báo cáo tổng hợp |

## Phân công

> Bản cân bằng theo ADR-15 (2026-11-19). Chi tiết đầy đủ: `docs/ASSIGNMENT.md` §3.

| Thành viên | Hệ thống (chính) | Đối chiếu | Chuyên trách NFR | Nhóm kỹ thuật thiết kế test | Tài liệu thiết kế | Số ca |
|---|---|---|---|---|---|---|
| Mạnh (TV1, Test Lead) | T3 Pretty Paws | T1 | NFR-02 (bảo mật) | Phân tích tĩnh & Rà soát; McCabe V(G), mức bao phủ | `docs/design/mccabe-coverage.md` | 56 |
| Tài (TV2) | T1 Pet NGON | T2 | NFR-03, NFR-04 | Phân vùng tương đương, Giá trị biên | `docs/design/test-design-techniques.md` | 55 |
| Ngân (TV3) | T2 Mật Pet | T3 | NFR-01, NFR-05 | Bảng quyết định, Chuyển đổi trạng thái | `docs/design/decision-tables.md`, `docs/design/state-transition.md` | 57 |
| Lộc (TV4) | Đối chiếu cả 3 site | — | NFR-06, NFR-07 | Use case, Workflow, Exploratory, Vòng đời lỗi | `docs/design/usecase-workflow.md` | 58 |

## Bảng trạng thái ngày

| Ngày | Trạng thái | Gate | Việc còn dở | HUMAN đang chờ |
|---|---|---|---|---|
| 1 | DONE-HUMAN-PENDING | Đạt (3/7 EC đạt, 4/7 chưa tới hạn) | Hoàn thiện hạ tầng kiểm thử, script kiểm tra Gate | Nhóm xác nhận phạm vi và 3 hệ thống đích; nhóm cài k6 và cấp quyền trình duyệt |
| 2 | DONE-HUMAN-PENDING | Đạt (4/7 EC đạt, 3/7 chưa tới hạn) | Đối chiếu ma trận giá T2 (Tài) và T3 (Ngân); sửa BR-03, BR-12, mục 3.2/3.3 SRS (Lộc) | Nhóm xác nhận phát hiện P1 (giá Chó/Mèo T2 không khác nhau) |
| 3 | DONE-HUMAN-PENDING | Đạt (4/7 EC đạt, 3/7 chưa tới hạn) | 4 tài liệu nghiên cứu kỹ thuật ở `docs/design/` (Ngày 6) | Nhóm xác nhận chọn hướng 2 (ADR-15); chạy lại E2E đầy đủ xác nhận 15 Fail là lỗi thật của site đích |
| 4 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `assign:check` 4/4 nguyên tắc phân công OK) | Hoàn thiện 2 tài liệu thiết kế còn thiếu (`mccabe-coverage.md` — Mạnh, `usecase-workflow.md` — Lộc) và đánh dấu review chéo trong `docs/design/design-index.csv` cho EC-8 | Nhóm xác nhận lựa chọn Hướng 2 (ADR-15) và phê duyệt ma trận phân công ASG-01 v3.0 |
| 5 | IN-PROGRESS | Đạt (5/8 EC đạt) | Ngân: k6 + Lighthouse NFR-01, spec Playwright T2, NFR-05 — xong; còn chạy tay các ca Manual T2/T3 | Nhóm xác nhận lựa chọn **Hướng 2** (ADR-15) và phê duyệt ma trận phân công ASG-01 v3.0 |
| 5 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `tc-review-check` **0 Major · 0 Minor** trên 226 ca) | **Phase 1 xong** — Inspection bộ test case theo checklist 4C: mở CR `CHG-2026-11-19-01`, SRS v1.2 → **v1.3** (9 yêu cầu đổi phạm vi HĐ, thêm `FR-M4-13` + `FR-M7-07`), viết lại 11 ca T3 theo hành vi thật, `requirements.csv` 58 → 60 yêu cầu, RTM 60/60 = 100% | Nhóm xác nhận phạm vi HĐ mới của 9 yêu cầu trong CR `CHG-2026-11-19-01` |
| 8 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `tc-review-check` **0 Major · 0 Minor** trên 226 ca) | **Phase 1 xong** — Inspection bộ test case theo checklist 4C: mở CR `CHG-2026-11-19-01`, SRS v1.2 → **v1.3** (9 yêu cầu đổi phạm vi HĐ, thêm `FR-M4-13` + `FR-M7-07`), viết lại 11 ca T3 theo hành vi thật, `requirements.csv` 58 → 60 yêu cầu, RTM 60/60 = 100%. Biên bản: `docs/reviews/testcase-inspection.md` · Gate: `reports/gates/day-08.md` | Nhóm xác nhận phạm vi HĐ mới của 9 yêu cầu trong CR `CHG-2026-11-19-01` |
| 9 | DONE-HUMAN-PENDING | Đạt (5/8 EC đạt; `tc-review-check` 0 Major; `npm run gate` exit 0) | **Phase 2 xong** — Hội trường thiết kế test (4 thành viên × 4 mục) → 5 quyết định WF-01…WF-05 · Walkthrough 4 CFG (Statement 100% · Branch 94,3% · Condition 100%) · CR `CHG-2026-11-19-02`, SRS v1.3 → **v1.4** · Bộ dữ liệu test dùng chung `docs/reference/test-data-baseline.csv` (16 dòng) + cột `Input_Guide` trong `pricing-baseline.csv` | Nhóm xác nhận điều kiện tiên quyết mới của `FR-M5-06` trong CR `CHG-2026-11-19-02` (2 ca T3 chuyển `Blocked`) |
| 9 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `npm run lint` + `npm run typecheck` exit 0; `npm run gate` exit 0) | **Phase 3 xong** — Hạ tầng tự động hóa cho 56 ca của Mạnh: 4 spec Playwright, **44 ca Manual → Auto** có bằng chứng máy · Chạy 3 project (`t1`, `t3`, `security`): **72 ca · 56 Pass · 16 Fail** · 4 defect mới `DEF-025`…`DEF-028` · Sửa 9 ca còn "Chưa thực thi" theo hành vi thật (không sửa ca đã Fail) · CR `CHG-2026-11-22-01`, SRS v1.4 → **v1.5** · Đồng bộ `execution-log.csv` (71 dòng) + `Status` trong `docs/testcases/*.csv` (226 ca: Pass 58 · Fail 16 · Chưa thực thi 150 · Blocked 2) · Sửa công thức EC-2 theo TP §5.2: **Critical/High 64/64 đã thực thi (100%)**, Pass 82.8% → EC-2 FAIL (trung thực — nhóm không có quyền sửa site đích) · Gate: `reports/gates/day-09b.md` | Test Lead (Mạnh) chốt 4 defect `DEF-025`…`DEF-028` và quyết định EC-6 (site đích thiếu header, nhóm không có quyền sửa) |
| 10 | DONE-HUMAN-PENDING | Đạt (5/8 EC đạt) | **Ngân xong phần T2 của Ngày 10** — báo cáo tích hợp T2 (`reports/gates/day-10-ngan.md`): bảng giá ↔ calculator khớp · 20/20 ca tự động T2 xanh · 3 defect mới `DEF-029`…`DEF-031` đã log | Tài (T1) và Lộc (đối chiếu 3 site) viết báo cáo tích hợp; Nhóm quyết định hạ/không hạ ngưỡng NFR-01 (điểm Lighthouse ≤ 70) |
| 11 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `npm run lint` + `npm run typecheck` exit 0; `npm run gate` exit 0) | **Phase 4 + Phase 5 xong** — System test vòng 1: **17/17 ca T3** của Mạnh (16 Pass · 1 Fail → `DEF-026`) và **27/27 ca T1** của Mạnh (26 Pass · 1 Fail → `DEF-016`) · Viết spec mới `tests/e2e/t1/m2-m4-m5-m7.spec.ts` cho **10 ca T1 còn lại** (5 ca Critical) → 10/10 Pass · Sửa 2 ca **trước lần chạy có kết quả** vì giả định sai về hành vi thật (M2-005: nhãn "Từ"; M4-009: nút khoá ở bước 2 chứ không phải bước 1) — **không sửa ca nào đã Fail** · Chạy lại full suite 3 project: **82 ca · 66 Pass · 16 Fail** · Đồng bộ `execution-log.csv` (81 dòng) → 226 ca: Pass 68 · Fail 16 · Chưa thực thi 140 · Blocked 2 · EC-2: **Critical/High 73/73 đã thực thi (100%)**, Pass 84.9% → FAIL (trung thực — 11 lỗi Critical/High của site đích) · Gate: `reports/gates/day-11.md` | **Biên bản đối chiếu chéo với Tài (hạng mục 5.5) chưa đóng** — 45 ca T1 của Tài còn "Chưa thực thi" → chuyển sang Phase 8; Test Lead cần chốt 2 quan sát tại `day-11.md` §7 (FAQ T1 ghi 70k cho Tắm vs `BR-06` ghi 50.000₫; FAQ thiếu "Combo Tắm + Vệ sinh") |
| 12 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `npm run lint` + `npm run typecheck` exit 0; `npm run gate` exit 0) | **Phase 6 xong** — Kiểm thử bảo mật NFR-02: **12/12 ca NFR-02 có kết quả** (5 Pass · 5 Fail, đều là defect site đích) · Viết `scripts/security-scan.mjs` (`npm run security:scan`) tự động hoá bằng chứng bảo mật → `reports/raw/security-summary.csv` mở rộng **15 → 24 dòng** (15 header + 3 TLS + 3 cookie + 3 rò rỉ) cho **cả 3 site** · Kết quả: **thiếu 14/15 header bảo mật** (chỉ T2 có HSTS) · TLS đạt 3/3 (T1 QUIC · T2 TLS 1.3 · T3 TLS 1.2) · 0 site có cookie phiên · **T3 lộ 2 API key** (Google Maps + Firebase) → cập nhật `DEF-027` · Sửa công thức **EC-6** đo đủ 4 nhóm (trước đếm nhầm cả dòng TLS/cookie là "thiếu header") → EC-6 = FAIL với số liệu đầy đủ · Giữ trạng thái `Open` cho 8 defect `DEF-002..005`/`DEF-009..012` theo quy tắc vòng đời lỗi (`usecase-workflow.md` §5.2) · Gate: `reports/gates/day-12.md` | **Cần anh chốt cách báo cáo EC-6** — em khuyến nghị phương án A (ghi EC-6 = FAIL, phân loại "hệ thống đích không thoả NFR-02 — kết quả kiểm thử hợp lệ"); bảng số liệu đã chuẩn bị sẵn ở `day-12.md` §2 và §4 |
| 13 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `npm run gate` exit 0) | **Phase 7 của Mạnh + Phase 7 của Ngân xong** — Mạnh: kiểm thử tích hợp T1 **3/3 hợp đồng dữ liệu đạt** (HĐ-1 bảng giá ↔ wizard **14/14 khớp** · HĐ-2 phụ thu tại nhà ↔ tổng tiền bước 4 **4/4 gói tính đúng** · HĐ-3 công thức `max(0, km−5)×8.000₫` + 4 dải km khớp) · telemetry **780 request, 107 XHR, 0 request ghi dữ liệu** → ranh giới ADR-11 giữ vững · Re-test lỗi: **22/28 defect đã re-test, 0 được khắc phục, 0 đóng, 0 sửa test cho xanh** · Hồi quy vòng 1: **82 ca · 66 Pass · 16 Fail · 0 hồi quy · 0 flaky** (ổn định 100% so với baseline) · Exit criteria **4/8 đạt** (EC-1/3/4/8 PASS; EC-2/5/6 FAIL do lỗi site đích; EC-7 HUMAN-PENDING) · Sửa câu chữ EC-6 + thêm nhóm đo cookie phiên (4 nhóm đo đủ) · Phát hiện `BR-06` thiếu gói "Combo Tắm + Vệ sinh" (+70.000₫) → chờ CR · Ngân: **57/57 ca đã có kết luận** (43 Pass · 13 Fail · 1 Blocked) · Hợp nhất hai bên: 4 TC_ID của Ngân được cấp số mới `TC-T3-M4-012`…`015`, 4 defect được đánh số lại `DEF-036`…`DEF-039` · Gate: `reports/gates/day-13.md` + `reports/gates/day-10-ngan.md` | **Tài + Ngân chạy 45 ca T1 + 63 ca T2 còn "Chưa thực thi"**; **Lộc + 5–8 người ngoài nhóm chạy UAT** (EC-7); Mạnh chạy `npm run lh:scan` lần cuối (re-test `DEF-019`/`DEF-020`); Test Lead chốt `BR-06` + FAQ T1; **Nhóm phán quyết 13 lỗi High còn mở (DEF-019/020/029…035/036…039) — đều là lỗi site đích bên thứ ba, không thể sửa** |
| 14 | DONE-HUMAN-PENDING | Đạt (4/8 EC đạt; `npm run lint` + `npm run typecheck` + `npm run gate` exit 0) | **Phase 8 xong** — Final Test Report (`reports/final-test-report.md`: 238 ca · 138 đã thực thi 58,0% · Critical/High 124/124 = 100% · Pass 80,6% · 39 defect · đối chiếu H2-1..H2-4) · Lessons Learned (`docs/lessons-learned.md`: 10 bài học theo 5 nhóm) · Báo cáo NFR (`reports/nfr-report.md`: 44 ca, Lighthouse T1 67/T2 59/T3 3, axe 49 ảnh T3 thiếu `alt`, k6 p95 907,74 ms) · Báo cáo UAT (`reports/uat-report.md`: 8 kịch bản + phương pháp + tiêu chí nghiệm thu) · Handoff checklist (`reports/handoff-checklist.md`: **14/14 nhóm, 0 mục trống**) · Hồ sơ nộp `submission/` **56 tài liệu (57 tệp gồm index), 0 thiếu** · **Sửa lỗi logic EC-7** (trước coi "file tồn tại" là đạt → nay đòi "Đã thực thi ≥ 1") → EC-7 = HUMAN-PENDING, tổng **4/8 đạt** — khớp `final-test-report.md` | **EC-7 — UAT với 5–8 người ngoài nhóm** (Lộc, 3 ngày); Tài + Ngân chạy 76 ca T1/T2 còn "Chưa thực thi"; Mạnh bàn giao 39 defect cho chủ site |

Trạng thái: `TODO` | `IN-PROGRESS` | `DONE` | `DONE-HUMAN-PENDING` | `BLOCKED`.

## Nhật ký phiên

### Phiên 0 · Khởi tạo · 2026-11-13
- Đã làm: đọc toàn bộ nguồn sự thật; `git init`; tạo `docs/PROGRESS.md`, `docs/decisions.md`, `docs/change-requests.md`.
- Quyết định: ADR-01..05.

### Phiên 1 · Ngày 1 (hướng cũ: tự xây hệ thống) · 2026-11-13
- Đã làm: monorepo `client`/`server` (TypeScript strict, ESLint + Prettier, Jest + ts-jest), `docker-compose.yml` cho PostgreSQL, CI GitHub Actions, 9 script khung; `docs/backlog.md`/`.csv`; ADR-06.
- Lệnh đã chạy: `npm install` → 546 gói exit 0; `npm run lint`/`typecheck`/`test`/`build` → exit 0. Chi tiết: `reports/gates/day-01.md`.
- **Trạng thái: đã lưu trữ** vào `archive/2026-11-13-webapp-pivot/` sau khi đổi hướng.

### Phiên 2 · Ngày 2 (hướng cũ) · 2026-11-13
- Đã làm: rà và làm rõ tiêu chí M1/M7, bổ sung NFR-02, `docs/requirements.csv` 46 dòng, `docs/rtm.md` v0.2, ADR-07/08, CHG-2026-11-13-02, `scripts/req-check.mjs`.
- Lệnh đã chạy: `npm run req:check` → 46 dòng, 0 vi phạm, exit 0. Chi tiết: `reports/gates/day-02.md`.
- **Trạng thái: đã lưu trữ.**

### Phiên 3 · Ngày 1 (hướng mới: kiểm thử 3 hệ thống) · 2026-11-13
- Đã làm:
  - Khảo sát thực tế 3 site bằng trình duyệt: xác nhận calculator 3 bước của T2 (Chó → >3–6 kg → Combo Tắm Vệ Sinh = 200.000₫ khớp bảng giá), wizard 4 bước của T1, 6 gói dịch vụ, nhãn tại spa/tại nhà, công thức phụ thu di chuyển `max(0, km − 5) × 8.000₫`; phát hiện `matpet.vn/dat-lich` trả 404, luồng thật nằm ở `matpet.vn/spa`.
  - Gom mã nguồn gian dở và tài liệu gốc vào `archive/2026-11-13-webapp-pivot/` (`client/`, `server/`, `.github/`, `docs-source-original/`, file cấu hình). Xóa `node_modules` còn sót do lỗi di chuyển thư mục.
  - Viết lại `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` theo hướng mới.
  - Viết lại `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` v1.0: 7 module M1–M7, 58 FR, 7 NFR (NFR-01..07), 16 quy tắc nghiệp vụ, bảng quyết định phụ thu di chuyển và chính sách hủy, bảng chuyển trạng thái wizard T1/T2, bảng dữ liệu tham chiếu, checklist Inspection.
  - Viết mới `docs/source/Kế hoạch Kiểm thử (Test Plan).md` v1.0 (12 mục) và `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` v1.0.
  - Tạo bộ test case: `docs/testcases/t1.csv` (72), `t2.csv` (66), `t3.csv` (44), `nfr.csv` (44), `uat.csv` (8 UC) — tổng 226 test case.
  - Tạo `scripts/rtm-build.mjs` và `scripts/req-build.mjs` sinh RTM và requirements.csv tự động từ SRS, có kiểm tra truy xuất hai chiều.
  - Đồng bộ `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md`, `docs/rtm.csv`, `docs/requirements.csv` (65 yêu cầu).
  - Cập nhật `docs/decisions.md` với ADR-09..ADR-13.
- Lệnh đã chạy và kết quả thật: `node scripts/rtm-build.mjs` → "RTM: 65 yêu cầu, 65 được phủ, 226 test case", exit 0, không có yêu cầu chưa phủ, không có test case trùng ID, không có test case tham chiếu yêu cầu không tồn tại; `node scripts/req-build.mjs` → "requirements.csv: 65 yêu cầu", exit 0, mọi yêu cầu đều có test owner.
- Quyết định/CR mới: ADR-09 (đổi hướng), ADR-10 (chọn T1/T2/T3), ADR-11 (ranh giới kiểm thử an toàn), ADR-12 (bộ công cụ), ADR-13 (mô hình V thích nghi); CHG-2026-11-13-03.
- Phát hiện: SRS v1.0 có 2 yêu cầu lặp bảng M7 do lỗi soạn thảo — đã sửa; `FR-M2-06`, `FR-M2-07` bổ sung sau khi thiết kế test case phát hiện thiếu phạm vi (phân biệt dịch vụ chó/mèo của T3; không niêm yết dịch vụ không thực hiện được).
- Còn dở / HUMAN: nhóm xác nhận phạm vi 3 site và mức kiểm thử an toàn tại kick-off Ngày 2; chưa có script Playwright chạy thật (đưa vào Ngày 9).

### Phiên 4 · Ngày 1 (hướng mới) — hoàn thiện hạ tầng và chạy thật · 2026-11-14
- Đã làm:
  - Viết 5 spec Playwright thật: `tests/e2e/t1/m1-navigation.spec.ts` (3 test), `tests/e2e/t2/m3-pricing.spec.ts` (4 test), `tests/e2e/t3/m1-m5-info.spec.ts` (4 test), `tests/security/headers.spec.ts` (NFR-02), `tests/security/accessibility.spec.ts` (NFR-06), `tests/security/seo.spec.ts` (NFR-07), `tests/security/responsive.spec.ts` (NFR-04).
  - Đổi `playwright.config.ts` sang `channel: 'chrome'` vì Application Control của máy chặn `chrome-headless-shell` của Playwright.
  - Viết `scripts/lighthouse-scan.mjs` (Lighthouse mobile, 3 lần mỗi site, lấy trung vị), `scripts/nfr-scan.mjs`, `scripts/exec-sync.mjs` (đồng bộ execution log + trạng thái test case tự động).
  - Bổ sung `scripts/exit-check.mjs` đo EC-6 bằng cả `axe-summary.csv` và `security-summary.csv`.
  - Cập nhật `docs/defects/defects.csv` lên 21 lỗi (DEF-001..DEF-021) với bằng chứng thật.
  - Viết `reports/gates/day-01.md` (Gate Ngày 1 hướng mới) — thay bản của hướng cũ đã lưu trữ.
- Lệnh đã chạy và kết quả thật:
  - `npm run lint` → 0 lỗi; `npm run typecheck` → sạch.
  - `npm run req:check` → 58 yêu cầu, 0 vi phạm.
  - `npm run rtm:build` → "RTM: 58 yêu cầu, 58 được phủ, 226 test case"; `npm run rtm:check` → độ phủ 100%, 0 vi phạm.
  - `npx playwright test` → 32 test, **20 Pass / 12 Fail**; 20/20 test chức năng xanh, 12 Fail đều là lỗi thật của site đích.
  - `npm run test:api` → 5 request, 10 assertion, 0 fail.
  - `npm run lh:scan` → Performance trung vị T1=67, T2=59, T3=3; LCP T1=4887ms, T2=6473ms, T3=17621ms.
  - `npm run exec:sync` → 30 dòng execution log (Pass 18, Fail 12).
  - `npm run exit:check` → 3/7 tiêu chí đạt.
- Phát hiện đáng chú ý: bảng giá tính tức thì của T2 **khớp bảng giá tĩnh** ở cả 3 ô đã đối chiếu (200.000₫ / 250.000₫ / 300.000₫) — ca kiểm thử tích hợp quan trọng nhất xanh.
- Sai lệch đã xử lý: (1) `chrome-headless-shell` bị policy chặn → dùng Chrome hệ thống; (2) `nfr-scan.mjs` không khởi động được browser → chuyển quét vào runner Playwright; (3) false-pass ở `TC-NFR-06-001` do quét axe-core trước khi ảnh render xong → thêm chờ `load` + 3s; (4) đánh số test NFR không khớp `nfr.csv` (`System = ALL`) → viết lại spec để mỗi test quét cả 3 site; (5) đổi tên 2 test T3 cho khớp `t3.csv`; (6) đo Lighthouse bằng preset mobile đúng SRS §9.1; (7) lỗi mạng site đích làm Fail sai nguyên nhân → thêm `tests/support/http.ts` với `getWithRetry`; (8) không cài được Firefox/WebKit → chuyển `TC-NFR-04-002..004` sang Manual.
- Còn dở / HUMAN: nhóm xác nhận phạm vi và mức kiểm thử an toàn; cài k6, Lighthouse CLI cho Firefox/Edge/Safari; OWASP ZAP; chạy 100+ test case Manual trong Ngày 11–12; UAT 5–8 người ở Ngày 13.

### Phiên 5 · Ngày 2 (hướng mới) — khảo sát chi tiết, chốt bảng giá tham chiếu · 2026-11-14
- Đã làm:
  - Khảo sát giá 3 site và gom thành `docs/reference/pricing-baseline.csv` (213 dòng: T1 = 84, T2 = 88, T3 = 41) + `docs/reference/pricing-baseline.md` (REF-01).
  - T1: đọc thẻ `<table>` trong HTML render sẵn → 6 gói × 14 dòng loài/cân nặng.
  - T2: đọc 3 thẻ `<table>` sau khi trang hydrate → 4 combo + 6 dịch vụ lẻ × 7 bậc, 3 dịch vụ nhuộm × 4 bậc, 6 dịch vụ báo giá riêng.
  - T3: tìm endpoint JSON công khai `GET /booking-api/v1/service?booking_page=1` qua việc theo dõi lưu lượng mạng → 41 dịch vụ / 5 nhóm, giá tính bằng cent, thời lượng tính bằng phút.
  - Viết `docs/ASSIGNMENT.md` (ASG-01) — tài liệu giao việc cho 3 thành viên: thứ tự đọc tài liệu, ranh giới an toàn, phân công theo từng ngày, quy tắc 4C và kỹ thuật thiết kế test, cách ghi nhận kết quả và lỗi, định dạng commit, mốc bàn giao.
  - Viết `README.md` gốc repo — điểm vào cho thành viên mới.
  - Bổ sung `scripts/build-pricing-baseline.mjs` và 5 script khảo sát (`survey-pricing`, `survey-t2-tables`, `survey-t2-dog-cat`, `survey-t3-services`, `survey-t3-table`).
- Phát hiện mới cần xử lý tại Inspection (Ngày 3):
  - **P1** — Giá Chó và Mèo của T2 **giống hệt nhau** ở cùng bậc cân nặng (200.000đ ở `>3–6kg`, 300.000đ ở `>6–10kg`), trong khi tiêu chí chấp nhận của `FR-M3-02` yêu cầu "cùng bậc cân nặng nhưng Mèo → giá khác". Bằng chứng tĩnh cho thấy bảng giá T2 chỉ có một bảng dùng chung cho cả hai loài → nghiêng về lỗi đặc tả của SRS, chưa kết luận.
  - **P2** — Mục 3.2 SRS ghi "10 dịch vụ grooming + 4 dịch vụ nhuộm"; thực tế là 6 dịch vụ lẻ (10 = tổng 4 combo + 6 lẻ) và 3 dịch vụ nhuộm.
  - **P3** — Bảng giá tĩnh của T2 dùng ký hiệu rút gọn (`120k`, `1tr`, `1,2tr`), calculator hiển thị định dạng đầy đủ (`~200.000đ`) → test tích hợp phải chuẩn hoá trước khi so sánh.
  - **P4** — `BR-03` mô tả T3 có 6 nhóm cân nặng cố định; thực tế mỗi dòng sản phẩm có bộ ngưỡng riêng (`Dog Bath`: 0-20/20-50/over 50; `tidy up`: 0-20/21-40/41-60/61-79/79+; `Full Groom`: 0-20/21-30/31-40/41-60/61-78/79-90/91-100+).
  - **P5** — "Phí lễ tân $52 (30 phút)" trong mục 3.3 và `BR-12` không tồn tại trong danh mục API; $52 thực chất là giá *Dog Bath 0-20lbs*.
  - **P6** — T3 có 2 dịch vụ phụ thu chưa nêu trong SRS: `*HOLIDAY FEE*` ($27) và `Emergency appointment fee *WAIT LIST ONLY*` ($25).
  - Bất biến mới dùng làm oracle cho kiểm thử tích hợp: **giá của T1 luôn tăng đơn điệu theo bậc cân nặng** trong cùng một cột.
- Lệnh đã chạy và kết quả thật:
  - `node scripts/survey-pricing.mjs` → T1 1 bảng (17 dòng), T2 3 bảng (13/5/7 dòng), T3 0 bảng `<table>` (dữ liệu nằm trong API).
  - `node scripts/survey-t3-services.mjs` → HTTP 200, 41 dịch vụ / 5 nhóm.
  - `node scripts/survey-t2-dog-cat.mjs` → Chó `>3–6kg` = 200.000đ, Mèo `>3–6kg` = 200.000đ (trùng); Chó `>6–10kg` = 300.000đ, Mèo `>6–10kg` = 300.000đ (trùng).
  - `node scripts/build-pricing-baseline.mjs` → `pricing-baseline.csv: 213 dòng { T1: 84, T2: 88, T3: 41 }`.
- Còn dở / HUMAN: Tài đối chiếu ma trận giá T2 (`reports/raw/survey-T2-matrix.csv`); Ngân đối chiếu giá T3 API ↔ UI (`reports/raw/survey-T3-ui-prices.csv`); Lộc sửa SRS-01 v1.1 (P2, P4, P5) và đề xuất cách xử lý P1; Mạnh cập nhật `FR-M3-02` và bổ sung test case đối chiếu ma trận giá.

### Phiên 6 · Ngày 3 (chuẩn bị) — hoàn thiện hạ tầng và rút gọn bộ công cụ · 2026-11-18
- Đã làm:
  - Cài đủ browser cho NFR-04: `npx playwright install chromium firefox webkit` + dùng Edge hệ thống (`channel: 'msedge'`).
  - Dựng 4 project đa trình duyệt trong `playwright.config.ts` (`cross-browser-chromium`, `cross-browser-firefox`, `cross-browser-webkit`, `cross-browser-edge`) và file `tests/crossbrowser/nfr-04-browser.spec.ts`.
  - Sửa 3 lỗi hạ tầng trong lần chạy E2E đầu tiên: (1) `trace: 'retain-on-failure'` bị antivirus xoá file giữa chừng → Playwright báo `ENOENT` khi đóng context → chuyển `trace: 'off'`; (2) quét axe-core 3 site vượt timeout 60 s → nới lên 300 s và quét một lần dùng lại cho cả 5 test case (giảm 15 lần tải trang); (3) `channel` đặt ở cấp `use` chung khiến Firefox/WebKit không khởi động được → chuyển `channel` xuống từng project.
  - Cài `k6` 2.4.0 qua winget (`GrafanaLabs.k6`) và chạy thật `tests/perf/read-load.js`.
  - **Rút gọn bộ công cụ theo ADR-14** (người dùng chọn phương án "tối giản" ngày 2026-11-18):
    - Xoá: `tests/api/` (collection Postman), `.github/` (CI), `scripts/{tc-sync,static-analysis,infra-check,openapi-check,nfr-scan,zap-scan}.mjs`, `archive/2026-11-13-webapp-pivot/` (toàn bộ nội dung vẫn còn ở commit `3ef6451`).
    - Gỡ devDependency `newman` và `tsx`; bỏ script `test:api`, `nfr:scan`.
    - Sửa `scripts/exec-sync.mjs` bỏ nhánh đọc `newman-report.json`; sửa `scripts/export-docs.mjs` cho khớp danh sách tài liệu hướng hiện tại.
    - Cập nhật `docs/decisions.md` (thêm ADR-14), `docs/test-plan.md` + bản gốc trong `docs/source/`, `docs/ASSIGNMENT.md`, `docs/PROGRESS.md`, `README.md`.
- Lệnh đã chạy và kết quả thật:
  - `npx playwright test` (baseline) → 32 test: **17 passed / 15 failed**; phân loại 15 Fail: 3 lỗi hạ tầng (file trace bị AV xoá), 1 timeout axe-core, **11 lỗi thật của site đích** (thiếu HSTS/nosniff/X-Frame-Options/Referrer-Policy, contrast, h1 T3 = 0, sitemap + robots T3 = 404, thiếu Open Graph, tràn ngang 19px ở T1 360px).
  - `npx playwright test --project=cross-browser-*` → **4 passed** (Chromium, Firefox, WebKit, Edge) — giá tính tức thì T2 = 200.000đ trên cả 4 trình duyệt.
  - `k6 run tests/perf/read-load.js` → 44 request, 0 fail, `http_req_failed` 0.00%, p95 = 1.13s, 5 VU / 30s.
  - `npm run lint` → 0 lỗi; `npm run typecheck` → sạch; `npm run req:check` → 0 vi phạm; `npm run rtm:check` → độ phủ 100%; `npm run exit:check` → 4/7 tiêu chí đạt.
- Phát hiện chưa xử lý: OWASP ZAP không chạy được (`Command failed to spawn: Aborted` khi gọi `java -autorun` — có vẻ do antivirus chặn tiến trình Java con). Vì đã loại ZAP khỏi bộ công cụ nên không còn ràng buộc; NFR-02 đo bằng kiểm tra header/cookie/TLS của Playwright.
- Còn dở / HUMAN: chạy lại E2E đầy đủ sau khi sửa hạ tầng để xác nhận 15 Fail còn lại là lỗi thật của site đích; nhóm xác nhận phạm vi; phán quyết CHG-2026-11-14-02 (P1) tại Inspection Ngày 3.

### Phiên 7 · Ngày 3 — Inspection SRS + chốt hướng đồ án · 2026-11-19
- Đã làm:
  - **Inspection SRS-01** (Moderator: Mạnh) theo quy trình 6 bước Cẩm nang §3.2: 10 mục checklist Appendix A → 8/10 đạt v1.1, 2/10 sau khi sửa. Ghi **10 phát hiện RV-01…RV-10** trong `docs/reviews/inspection-srs.md`.
    - RV-01 (Major) `FR-M3-02` T2 — T2 dùng **chung bảng giá** Chó/Mèo ở cả 7 bậc cân nặng → tiêu chí chấp nhận tách theo từng hệ thống (T1 giữ, T2 bỏ, T3 giữ).
    - RV-02 (Major) `FR-M2-01` T3 — 2 khoản phụ thu `*HOLIDAY FEE*` ($27) và `Emergency appointment fee` ($25) không nằm trong quy tắc 4 thuộc tính (thời lượng = 0).
    - RV-03…RV-08 (Minor) — số dịch vụ lẻ T3 (6, không phải 7), mốc ngày cố định, 18 tiêu chí chấp nhận định lượng, ràng buộc cân nặng T3 (lbs trong tên dịch vụ), cột luồng rẽ nhánh cho 8 UC, thuật ngữ "bậc cân nặng".
    - RV-09, RV-10 (Quan sát) — T2 nhận ngày > 30 ngày (chỉ có `min`, không có `max`); nhóm "báo giá riêng" hiện cả khoảng 50.000–500.000₫ lẫn "tuỳ thiết kế".
  - **Đóng 5 CR ứng viên** (CR-10, CR-11, CR-12, CR-13, CR-15) sau khi kiểm chứng bằng probe trình duyệt thật; bằng chứng `reports/raw/survey-day03-open-cr.json`, `reports/raw/survey-day03-detail.json`.
  - **CHG-2026-11-14-02** chuyển "Chờ nhóm" → "Đã áp dụng" theo phán quyết RV-01.
  - Ghi 3 defect mới từ quan sát: DEF-022 (T2 cho phép ngày > 30 ngày), DEF-023 (T1/T3 không có bước chọn ngày), DEF-024 (T3 mã hoá bậc lbs trong tên dịch vụ).
  - Cập nhật 7 test case bị ảnh hưởng bởi RV-01/04/06/09: `TC-T1-M4-003`, `TC-T2-M3-003`, `TC-T2-M4-006`, `TC-T2-M4-007`, `TC-T3-M3-002`, `TC-T3-M3-003`, `TC-T3-M4-005`.
  - **SRS-01 v1.0 → v1.2**: mọi tiêu chí chấp nhận đều định lượng; SRS `FR-M4-04` mô tả đúng thực tế (T1 có 7 ngày cố định + 8 khung giờ; T2 có 2 mốc "Hôm nay"/"Ngày mai"; T3 không có bước chọn ngày).
  - **Chốt hướng đồ án (ADR-15)**: nhóm chọn **Hướng 2** — "thiết kế và kiểm thử cho một phần mềm đang hoạt động, phải mô tả chi tiết lại các yêu cầu và tính năng cần kiểm thử". Ánh xạ thành 4 yêu cầu cam kết H2-1 (mô tả chi tiết yêu cầu/tính năng → SRS-01 v1.2) · H2-2 (thiết kế test → 226 ca + 5 tài liệu `docs/design/`) · H2-3 (kiểm thử không phá hại → Playwright + axe + Lighthouse + k6) · H2-4 (truy vết & báo cáo → RTM 100%, Inspection, Exit criteria, Final Test Report). Ghi ADR-15 vào `docs/decisions.md`.
  - **Cân bằng lại phân công**: `scripts/reassign-owners.mjs` phân bổ lại 226 ca theo ma trận module → 4 người: Mạnh 56, Tài 55, Ngân 57, Lộc 58 (chênh lệch 3, trước đó là 21). Mỗi module của mỗi hệ thống có ≥ 2 người chạy.
  - Cập nhật `docs/ASSIGNMENT.md` lên bản 2.0: thêm §3.0–§3.8 và §3A "Đối chiếu với yêu cầu của Hướng 2" (4 yêu cầu H2-1…H2-4 + điều kiện thỏa mãn "phần mềm đang hoạt động"); 5 tài liệu thiết kế bắt buộc trong `docs/design/`.
  - Thêm `scripts/sync-docs.mjs` + `npm run docs:sync` — đồng bộ bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` từ bản gốc `docs/source/` (trước đó `docs/srs.md` bị lệch 450 dòng so với bản gốc).
- Lệnh đã chạy và kết quả thật:
  - `node scripts/req-build.mjs` → 58 yêu cầu; `node scripts/rtm-build.mjs` → 58 yêu cầu, 58 được phủ, 226 test case.
  - `npm run req:check` → 0 vi phạm; `npm run rtm:check` → truy xuất 2 chiều 100%, exit 0.
  - `npm run lint` → 0 lỗi; `npm run typecheck` → sạch.
  - `npm run gate` → req:check OK, rtm:check OK, exit:check 4/7 (3 tiêu chí còn tới hạn ở ngày 11–13).
  - Probe Playwright trực tiếp trên T1 (`scripts/_probe5.mjs`, đã xoá sau khi dùng): xác nhận bước 3 "Lịch hẹn" có 7 ngày cố định + 8 khung giờ 08:30–17:00, **không có mốc "Hôm nay"/"Ngày mai"** — dùng để sửa RV-04 cho đúng thực tế.
- Còn dở / HUMAN: nhóm xác nhận lựa chọn **Hướng 2** (ADR-15) trong họp; 5 tài liệu thiết kế ở `docs/design/` cần hoàn thành ở Ngày 6 (là đầu ra bắt buộc của H2-2); chạy lại E2E đầy đủ để xác nhận 15 Fail còn lại là lỗi thật của site đích.

### Phiên 8 · Ngày 4 — Hoàn thiện tài liệu phân công theo Hướng 2 · 2026-11-19
- Đã làm:
  - Đối chiếu `docs/ASSIGNMENT.md` với dữ liệu thật và phát hiện **sai lệch số liệu** so với `docs/testcases/*.csv`: Mạnh ghi "21 ca T3 / 25 ca T1" nhưng thực tế là 17 / 27; Lộc ghi "42 ca đối chiếu" nhưng thực tế là 46; `docs/source/Kế hoạch Kiểm thử (Test Plan).md` §7 ghi 57/64/62/43 (chênh lệch 21) thay vì 56/55/57/58 (chênh lệch 3).
  - Viết lại `docs/ASSIGNMENT.md` lên **v3.0** (ASG-01): ma trận Owner theo module (đã kiểm chứng bằng script), ma trận trách nhiệm theo hệ thống (viết / đối chiếu / NFR), vai trò và nhóm kỹ thuật thiết kế test của từng thành viên, việc cụ thể theo ngày 2–14 cho từng người, §3A.1 (4 yêu cầu H2-1…H2-4), §3A.2 (vị trí "nghiên cứu kỹ thuật kiểm thử chuyên sâu"), §3A.3 (điều kiện "phần mềm đang hoạt động"), **§3A.4 Definition of Done cá nhân (9 mục)**.
  - Thêm `scripts/assign-check.mjs` + `npm run assign:check`: kiểm chứng 4 nguyên tắc phân công (cân bằng chênh lệch ≤ 3 · mỗi module có ≥ 2 người chạy · NFR chuyên trách đúng · không ai gánh trọn hệ thống mình viết).
  - Thêm `docs/design/design-index.csv` (mỗi dòng: tài liệu thiết kế + người phụ trách + người review chéo + trạng thái review) và hiện thực hoá **EC-8** trong `scripts/exit-check.mjs` — tiêu chí "mỗi thành viên có ≥ 1 tài liệu thiết kế đã review chéo" nay chấm được tự động.
  - `package.json`: `gate` = `req:check && rtm:check && assign:check && exit:check`.
  - Ghi **ADR-16** vào `docs/decisions.md` (bối cảnh sai lệch số liệu, quyết định, hệ quả).
  - Sửa `docs/source/Kế hoạch Kiểm thử (Test Plan).md` §7 (bảng vai trò) và §5.2 (thêm EC-8), đồng bộ `docs/test-plan.md` bằng `npm run docs:sync`.
  - Sửa `README.md` — bảng "hệ thống nào do ai viết/đối chiếu" cho khớp ADR-15 (T1: Tài viết, Mạnh + Lộc đối chiếu · T2: Ngân viết, Tài + Lộc đối chiếu · T3: Mạnh viết, Ngân + Lộc đối chiếu) và cập nhật danh sách lệnh (`assign:check`).
- Lệnh đã chạy và kết quả thật:
  - `npm run gate` → `req:check` 0 vi phạm (58 yêu cầu, 51 FR + 7 NFR) · `rtm:check` độ phủ 100% · **`assign:check`: 226 ca; Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58; chênh lệch 3; 0 module chỉ có 1 người chạy; 4/4 nguyên tắc OK** · `exit:check` **4/8 tiêu chí đạt** (EC-1, EC-3, EC-4, EC-6 PASS; EC-2, EC-5, EC-7 còn tới hạn theo lịch 11–13; **EC-8 FAIL** do 2 tài liệu thiết kế còn thiếu + 5 dòng chưa đánh dấu "Đã review").
- Còn dở / HUMAN:
  - **EC-8 chưa đạt** — cần 2 tài liệu thiết kế còn thiếu (`docs/design/mccabe-coverage.md` của Mạnh, `docs/design/usecase-workflow.md` của Lộc) và các thành viên tự cập nhật cột `review_status` trong `docs/design/design-index.csv` sau khi review chéo (Ngân review Tài, Mạnh review Ngân, Lộc review Ngân, Tài review Lộc).
  - EC-2, EC-5, EC-7 tới hạn ở Ngày 11–13 theo kế hoạch; người dùng cần xác nhận lựa chọn Hướng 2 trong họp (ADR-15) và phê duyệt ma trận phân công v3.0.

### Phiên 9 · Ngày 5 — Hoàn tất 5 tài liệu thiết kế test + Technical Review chéo · 2026-11-19
- Đã làm:
  - **Viết 2 tài liệu thiết kế còn thiếu** để đủ 5/5 theo yêu cầu H2-2:
    - `docs/design/mccabe-coverage.md` (Mạnh) — Cẩm nang §3.1–§3.4 (kiểm thử tĩnh, quy trình Rà soát Trang trọng 6 bước, 4 hình thức rà soát) + §5.2–§5.4 (McCabe V(G), 4 mức bao phủ); dựng **4 CFG** từ 4 bảng quyết định SRS §8 (Wizard T2 V(G)=5 · Wizard T1 V(G)=4 · Chính sách hủy V(G)=7 · Phụ thu di chuyển V(G)=5, **tổng 21**); đo 4 mức bao phủ trên CFG (Statement 100% · Branch 94,3% · Condition 100% · B&C 94,3%); 2 nhánh chưa đi được ghi rõ là hệ quả của ADR-11 chứ không phải lỗ hổng test.
    - `docs/design/usecase-workflow.md` (Lộc) — Cẩm nang §4.6 + §6.1; **8 sơ đồ luồng UC-01…08** đủ nhánh/ngoại lệ theo SRS §4; **7 workflow** liên module (WF-1…WF-7); **3 hiếu chương khám phá** E1/E2/E3 có bảng mốc định lịch khảo sát; **vòng đời lỗi 11 trạng thái** kèm quy tắc nghiệm thu và bảng vai trò.
  - **Technical Review chéo** toàn bộ 5 tài liệu (quy trình §3.3) → biên bản `docs/reviews/design-review.md`. Kết quả: 5/5 tài liệu đủ 4 thành phần bắt buộc · 194/194 trích dẫn test case tồn tại · 0 trích dẫn yêu cầu sai · phát hiện và sửa **3 lỗi Major + 2 Minor + 1 Observation**:
    - **RV-D1 (Major)** — `TC-T1-M6-010` kỳ vọng "20 km thu 120.000đ", mâu thuẫn `BR-05`/`FR-M6-06`/CR-10 (>15 km → "Liên hệ báo giá riêng"). Đã đổi `FR-M6-02` → `FR-M6-06` và sửa tiêu đề.
    - **RV-D2 (Major)** — bộ BVA 9 ca của T3 dùng bậc **`51–60lbs` không tồn tại** và **trộn 2 dòng sản phẩm** (`Dog Bath` + `Dog Full Groom`) vào một bộ BVA. Đã viết lại cả 9 tiêu đề theo đúng dòng sản phẩm theo `BR-03`.
    - **RV-D3 (Major)** — bảng mức bao phủ trong `mccabe-coverage.md` dùng **33 test case làm tử số của "33 nhánh"**; tử số phải là số nhánh trên CFG. Đã thêm bảng đếm nhánh và sửa phương pháp đo.
    - **RV-D4 (Minor)** — quy tắc R7 của bảng DT §A.2 ("Tại spa" → 0₫) chỉ trỏ tới 1 ca kiểm tra *sự hiện diện của lựa chọn* chứ không kiểm tra phụ thu. Đã bổ sung `TC-T1-M6-002`.
    - **RV-D5 (Minor)** — `usecase-workflow.md` ghi "152/226 ca (67%)" trong khi tổng đúng là **115/226 (50,9%)**. Đã sửa cả 3 chỗ.
    - **RV-D6 (Observation)** — bộ test case 226 ca chưa từng đi qua Inspection (chỉ mới review chéo + walkthrough). Ghi nhận là khoản trống của dự án, đưa vào việc Ngày 5–8.
  - `docs/design/design-index.csv` → 5/5 dòng đánh dấu **"Đã review"** với người review chéo và ngày → **EC-8 đạt**.
  - Cập nhật `docs/ASSIGNMENT.md` §3.3 và §3A.2 (trạng thái 5/5 tài liệu, ghi kết quả Technical Review).
- Lệnh đã chạy và kết quả thật:
  - `npm run gate` → `req:check` 0 vi phạm (58 yêu cầu, 51 FR + 7 NFR) · `rtm:check` độ phủ 100% · `assign:check` 226 ca / Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58 / chênh lệch 3 / 0 module chỉ có 1 người chạy / 4/4 nguyên tắc OK · `exit:check` **5/8 tiêu chí đạt** (EC-1, EC-3, EC-4, EC-6, **EC-8** PASS; EC-2, EC-5, EC-7 còn tới hạn theo lịch 11–13).
  - Script kiểm chứng trích dẫn: 5 tài liệu thiết kế + biên bản review → 202 mã TC trích dẫn, **0** mã không tồn tại; 9 mã yêu cầu `FR-*`/`NFR-*`, **0** mã không tồn tại trong `docs/requirements.csv`.
- Còn dở / HUMAN:
  - **EC-2, EC-5, EC-7 tới hạn ở Ngày 11–13** theo kế hoạch — không phải việc có thể đóng sớm.
  - Người dùng cần xác nhận lựa chọn **Hướng 2** (ADR-15) trong họp và phê duyệt ma trận phân công v3.0.
  - **Việc cần làm ở Ngày 5–8 (RV-D6):** tổ chức Inspection cho bộ test case 226 ca — hiện chỉ mới có review chéo, chưa đạt hình thức rà soát trang trọng nhất theo Cẩm nang §3.3.
  - `docs/decisions.md` chưa có ADR cho đợt Technical Review này — sẽ bổ sung khi chốt ADR-17.

### Phân 10 — Ngày 10: Kiểm thử tích hợp T1 + điều tra sâu lỗi NFR của Tài · 2026-11-22
- Đã làm:
  - **Kiểm thử tích hợp T1 (Pet NGON)** — bộ `tests/e2e/t1/int-integration.spec.ts` gồm 5 ca `INT-T1-001…005`, báo cáo `reports/integration-t1.md`:
    - `INT-T1-001` — **canary network**: xác nhận wizard **không gọi API giá** (dữ liệu đóng gói sẵn trong bundle SSR/RSC của Next.js). Đã lọc đúng `_rsc=` (route prefetch) và `google-analytics.com` (telemetry GA4) — nếu lọc sai, ca này báo động giả. Fail = dữ liệu đã chuyển sang API từ xa.
    - `INT-T1-002` — **hợp đồng dữ liệu**: 12/12 khoảng giá min/max của 6 dịch vụ trong wizard khớp 1:1 với bảng giá tĩnh.
    - `INT-T1-003` — 7/7 bậc cân nặng chó khớp bảng tĩnh (130.000₫ → 725.000₫).
    - `INT-T1-004` — **validation biên**: 6/6 điểm biên (2,9 / 3 / 3,1 / 4,9 / 5 / 5,1 kg) ánh xạ đúng bậc.
    - `INT-T1-005` — **công thức phụ thu di chuyển** `max(0, ⌈km⌉ − 5) × 8.000₫` khớp production (7,2 km → 24.000₫; 13,8 km → 72.000₫; 15,7 km → 88.000₫). Tổng = giá gói + 70.000₫ phụ thu tại nhà (Combo Tắm + Vệ sinh) + phí di chuyển.
  - **Điều tra sâu 2 lỗi NFR của Tài** (Day 11–12) — bằng chứng, không phải "sửa cho xanh":
    - `TC-NFR-03-004` — **phát hiện lỗi test harness, không phải lỗi ứng dụng**: theo HTML5, `<button disabled>` **không thể nhận focus**, nên `expect(next).toBeFocused()` là khẳng định sai. Thêm: tên truy cập của T2 đổi thành `"✓🐶Chó"` sau khi chọn → phải dùng regex locator thay vì `exact: true`. Kết luận: **calculator T2 thao tác được 100% bằng bàn phím** (thứ tự Tab: nav → bước → loài → ngày → nút gửi) → chuyển Fail → **Pass**.
    - Bổ sung `TC-NFR-03-004b/c` — kiểm tra **thứ tự Tab** và **chuỗi Tab**. Phải loại trừ field honeypot chống spam (`aria-hidden="true"`, `tabindex="-1"`, offset âm) — đây là hành vi đúng, không phải lỗi.
    - `TC-NFR-04-005` — **giữ nguyên Fail** (lỗi thật) nhưng bổ sung số liệu chẩn đoán: T1 tràn **19px** (`.bn-bar__right`) và **18px** (`.bn-hero__visual-glow`); T2/T3 = **0px**. Xác nhận người dùng **thực sự cuộn ngang được** (đặt `scrollLeft = 9999` → giữ nguyên giá trị).
  - **Sửa race condition `TC-T3-M5-005`**: drawer MUI render giờ mở cửa bất đồng bộ + phân biệt hoa/thường (`CLOSED` vs `closed`). Thêm helper chờ trạng thái xuất hiện, regex không phân biệt hoa thường, chuẩn hóa text nhiều dòng. Xác nhận ổn định qua **3 lần chạy liên tiếp** (`4 passed` × 3).
  - **Đóng `DEF-023`** (obsolete): SRS v1.2 đã sửa `FR-M4-04`; T1 thực tế có **7 ngày cố định + 8 khung giờ 08:30–17:00**, thỏa mãn yêu cầu hiện hành. Bằng chứng: `reports/raw/t1-m4-004-date-step.json`.
  - Liên kết `TC-T1-M1-005` với `DEF-016`; làm giàu `DEF-016` bằng số liệu tràn cụ thể theo từng site.
  - Viết `scripts/_rebuild-exec-log.mjs` — dựng lại `reports/execution-log.csv` từ `docs/testcases/*.csv` (nguồn sự thật) + tra `Defect_ID` từ `docs/defects/defects.csv`, tránh log bị thu hẹp khi chạy từng project riêng lẻ.
- Lệnh đã chạy & kết quả thực tế:
  - Regression toàn bộ: **98 passed · 19 failed · 1 skipped** (7,9 phút) → `reports/raw/regression-day13.txt`.
  - **19/19 Fail đều truy về được defect**; sau khi tái dựng log, **0 dòng Fail nào còn `Defect_ID` rỗng**.
- Cần dây / HUMAN:
  - **CHG-2026-11-21-01** (bổ sung "Combo Tắm + Vệ sinh" +70.000₫ vào danh sách dịch vụ tại nhà của T1 — `BR-06` / `FR-M6-03`) **đang chờ Mạnh duyệt**; sau khi duyệt sẽ cập nhật SRS v1.3 và dựng lại RTM.

### Phân 11 — Ngày 13: Regression tự động toàn bộ + chấm Exit criteria · 2026-11-22
- Đã làm:
  - **Regression tự động toàn bộ** (5 project `t1`, `t2`, `t3`, `nfr`, `security`) → báo cáo `reports/regression-report.md`:
    - Kết quả **98 Pass / 19 Fail / 1 Skip** (skip có chủ đích: `TC-NFR-06-003` giữ kiểm thử thủ công).
    - **0 Fail chưa xác định nguyên nhân**; 19/19 Fail đã có defect tương ứng.
    - Bảng ánh xạ đầy đủ 19 lỗi → defect nằm trong `reports/regression-report.md` §2.
  - **Sửa 2 lỗi TypeScript** phát sinh khi bổ sung bằng chứng chẩn đoán: `NodeListOf<Element>` không có `[Symbol.iterator]` → `Array.from(...)`; và ép kiểu thuộc tính `disabled` qua `Element & { disabled?: boolean }` (không phụ thuộc tag phần tử).
  - **Cải thiện `scripts/exit-check.mjs`** để đo **đúng định nghĩa** từng tiêu chí:
    - `EC-2` giờ đo riêng nhóm **Critical/High** (đọc `Priority` từ `docs/testcases/*.csv` — `execution-log.csv` không mang cột này): đã thực thi 104/203 (51,2%), Pass 87,5% trong nhóm này.
    - `EC-4` giờ đo **từng hệ thống** (T1/T2/T3): 23 ca tự động Pass, **3/3 hệ thống có bộ E2E xanh**.
    - Thêm mục **"Ranh giới Hướng 2"** vào `reports/exit-criteria.md` — giải thích vì sao EC-2/3/5/6 FAIL là **hệ quả đúng** của việc kiểm thử phần mềm đang hoạt động của bên thứ ba (ADR-15), không phải khiếm khuyết quy trình; theo ASG-01 §5.3 test phải **Fail trung thực** + **ghi defect**, không hạ ngưỡng để ép xanh.
  - Viết `reports/gates/day-13.md` — bằng chứng gate theo §3A.4 mục 9.
- Lệnh đã chạy & kết quả thực tế:
  - `npm run gate` → **exit 0**: `req:check` 0 vi phạm (58 yêu cầu = 51 FR + 7 NFR) · `rtm:check` truy xuất 2 chiều 100% · `assign:check` 226 ca / Tài 55 · Mạnh 56 · Ngân 57 · Lộc 58, chênh lệch 3, 0 module chỉ 1 người chạy, **4/4 nguyên tắc OK** · `exit:check` **3/8 tiêu chí đạt**.
  - `npm run lint` → 0 error (7 warning cũ) · `npm run typecheck` → **sạch**.
  - `node scripts/_rebuild-exec-log.mjs` → 114 dòng (**95 Pass / 19 Fail**).
- Tình trạng Definition of Done của Tài (§3A.4): **9/9 mục đạt** — trong đó mục 3 "chạy hết test case của mình" là **55/55**.
- Cần dây / HUMAN:
  - **EC-7 (UAT)** là phần việc cần **con người**: 8 kịch bản UAT trong `docs/testcases/uat.csv` đòi 5–8 người dùng ngoài nhóm — do **Lộc (TV4)** phụ trách Ngày 13. Không thể tự động hoá.
  - **3 lỗi Critical/High còn mở** (`DEF-013` T3 thiếu `alt` trên 49 ảnh, `DEF-019` Lighthouse Performance < 70, `DEF-020` LCP > 2,5s) đều thuộc mã nguồn production bên thứ ba → **ngoài tầm sửa của nhóm**; cần gửi phản hồi cho bên thứ ba.
  - **CHG-2026-11-21-01** vẫn chờ Mạnh duyệt.
  - **Final Test Report + Lessons learned (Ngày 14)** — Mạnh là người tổng hợp; các đầu vào đã sẵn sàng: `reports/regression-report.md`, `reports/exit-criteria.md`, `reports/integration-t1.md`, `reports/gates/day-13.md`, `reports/execution-log.csv`, `docs/defects/defects.csv`.
