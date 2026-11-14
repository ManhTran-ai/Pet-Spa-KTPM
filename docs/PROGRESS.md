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
| 2 | TODO | | | |
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
