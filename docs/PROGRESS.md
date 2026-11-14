# PROGRESS: Kiểm thử 3 hệ thống Pet Spa (14 ngày)

Cập nhật: 2026-11-14 · Phiên: 4 (Ngày 1 theo hướng mới) · Nhóm: Mạnh, Tài, Ngân, Lộc

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
| 8 | 20/11 | Thiết kế | Viết test case M4–M6, NFR; review chéo theo checklist 4C | Test case v1.0 |
| 9 | 21/11 | Thực hiện | Chuẩn bị môi trường, script Playwright smoke cho 3 site, bộ dữ liệu test | Smoke xanh |
| 10 | 22/11 | Thực hiện | Kiểm thử tích hợp (quan sát hợp đồng dữ liệu giao diện ↔ API) | Báo cáo tích hợp |
| 11 | 23/11 | Thực hiện | System test vòng 1, ghi defect log | Vòng 1 xong |
| 12 | 24/11 | Thực hiện | Re-test, kiểm thử phi chức năng (NFR-01..07), khám phá 60 phút/site | Kết quả NFR |
| 13 | 25/11 | Thực hiện | Regression, UAT với 5–8 người, chấm Exit criteria | Exit criteria |
| 14 | 26/11 | Báo cáo | Final Test Report, Lessons learned, đóng gói hồ sơ nộp | Báo cáo tổng hợp |

## Phân công

| Thành viên | Hệ thống | Viết và chạy test cho | Chuyên trách |
|---|---|---|---|
| Mạnh (TV1, Test Lead) | T1 Pet NGON | T3 + NFR-02 | Test Plan, RTM, điều phối Inspection, Final Test Report, test bảo mật |
| Tài (TV2) | T2 Mật Pet | T1 + NFR-03, NFR-04 | Hạ tầng repo, Playwright, Postman/Newman, Lighthouse, test khả năng dùng và tương thích |
| Ngân (TV3) | T3 Pretty Paws | T2 + NFR-01, NFR-05 | Thiết kế DT/ST, test hiệu năng và độ tin cậy, tự động hóa regression |
| Lộc (TV4) | Đối chiếu cả 3 site | T2 (đối chiếu) | Quản lý lỗi và triage, test khả năng tiếp cận NFR-06, SEO NFR-07, UAT, slide demo |

## Bảng trạng thái ngày

| Ngày | Trạng thái | Gate | Việc còn dở | HUMAN đang chờ |
|---|---|---|---|---|
| 1 | DONE-HUMAN-PENDING | Đạt (3/7 EC đạt, 4/7 chưa tới hạn) | Hoàn thiện hạ tầng kiểm thử, script kiểm tra Gate | Nhóm xác nhận phạm vi và 3 hệ thống đích; nhóm cài k6 và cấp quyền trình duyệt |
| 2 | IN-PROGRESS | | Đối chiếu ma trận giá T2 (Tài) và T3 (Ngân); sửa BR-03, BR-12, mục 3.2/3.3 SRS (Lộc) | Nhóm xác nhận phát hiện P1 (giá Chó/Mèo T2 không khác nhau) |
| 3 | TODO | | | |
| 4 | TODO | | | |
| 5 | TODO | | | |
| 6 | TODO | | | |
| 7 | TODO | | | |
| 8 | TODO | | | |
| 9 | TODO | | | |
| 10 | TODO | | | |
| 11 | TODO | | | |
| 12 | TODO | | | |
| 13 | TODO | | | |
| 14 | TODO | | | |

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
