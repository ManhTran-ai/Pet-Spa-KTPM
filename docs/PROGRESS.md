# PROGRESS: Pet Spa (14 ngày)

Cập nhật: 2026-11-13 · Phiên: 2 (Ngày 2) · Commit: baa247c

Kế hoạch phiên 2 (Ngày 2 · Mạnh · vai TESTER + tài liệu):
1. Rà FR/NFR của M1 và M7 trong `docs/srs.md`: làm tiêu chí chấp nhận đo được (mã HTTP, số đo, giá trị cụ thể) cho 10 yêu cầu; bổ sung NFR-02 (Mạnh chuyên trách) thành tiêu chí đo được.
2. Xử lý `[Cần chốt]` liên quan M1/M7 và M4-06: giữ mặc định ADR-02, ghi ADR-07 (mã lỗi truy cập chéo dữ liệu) và ADR-08 (ngày nghỉ, giờ làm của NV). Verify: không còn `[Cần chốt]` chưa xử lý ở phần Mạnh.
3. Rà checklist SRS phụ lục A: tìm từ mơ hồ thiếu con số ở phần Mạnh và sửa tối thiểu có ghi chú tác giả (mục 5.2 FR-M2-02).
4. Tạo `docs/requirements.csv` đúng 46 dòng (40 FR + 6 NFR), khớp RTM-01.
5. Nâng `docs/srs.md` lên v0.2, cập nhật `docs/change-requests.md`, `docs/decisions.md`.
6. Chạy Gate Ngày 2, lưu kết quả thật vào `reports/gates/day-02.md`.

Rủi ro: (a) phần M2–M6 của SRS do thành viên khác soạn — Mạnh chỉ sửa tối thiểu và ghi rõ tác giả, không viết lại; (b) `docs/requirements.csv` phải khớp tuyệt đối với ID trong SRS và RTM-01, kiểm bằng script; (c) các giá trị `[Cần chốt]` chưa được nhóm xác nhận tại kick-off nên mọi mặc định giữ theo ADR-02 và ghi rõ là chờ nhóm.

Kế hoạch phiên 1 (Ngày 1 · Mạnh) — đã xong:
1. Chép 3 tài liệu nguồn sang bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` (thêm đầu tệp phiên bản + ngày). Verify: đủ 3 file, nội dung khớp nguồn.
2. Viết `docs/backlog.md` + `docs/backlog.csv` theo MoSCoW SRS §2.2 và ưu tiên SRS §5/§9. Verify: CSV đọc được, mọi dòng có mức và chủ sở hữu.
3. Cập nhật `docs/decisions.md` (ADR-01..05 đã có; ghi nhận xác nhận của người dùng: ADR-03 Lộc nhận UI M4/M5; ADR-05 Mạnh nhận toàn bộ hạ tầng; ADR-02 giữ nguyên mặc định; Docker cho PostgreSQL → ADR-06).
4. Dựng monorepo npm workspaces `client`/`server`: TypeScript strict, ESLint + Prettier, Jest + ts-jest. Verify: `npm install`, `npm run lint`, `npm run typecheck`, `npm test` chạy thật.
5. Tạo `.env.example`, `docker-compose.yml` (PostgreSQL), `.github/workflows/ci.yml` (lint, typecheck, test), `CONTRIBUTING.md`.
6. Tạo script khung `scripts/*.mjs` theo SKILL §7: rtm-check, tc-sync, tc-record, exit-check, export-docs, static-analysis, check-openapi.
7. Rà SRS §1–2, hoàn thiện nếu thiếu (bản làm việc `docs/srs.md`).
8. Chạy Gate Ngày 1, lưu kết quả thật vào `reports/gates/day-01.md`.

Rủi ro phiên 1: (a) mạng hạn chế khi `npm install`; (b) xung đột phiên bản peer deps — không dùng `--force`/`--legacy-peer-deps`, báo lại nếu có; (c) chưa có schema Prisma (thuộc Tài, Ngày 4–5) nên `db:*` mới chỉ là khung script.

Thành viên: Mạnh (TV1, Trưởng nhóm / Test Lead), Tài (TV2), Ngân (TV3), Lộc (TV4).
Phiên này đại diện DUY NHẤT cho Mạnh.

| Ngày | Trạng thái | Gate | Việc còn dở | HUMAN đang chờ |
|---|---|---|---|---|
| 1 | DONE-HUMAN-PENDING | Đạt (xem `reports/gates/day-01.md`) | Khảo sát 3–5 tiệm spa (Lộc), bảng Jira/Trello, họp kick-off chốt `[Cần chốt]` | Họp kick-off; tạo bảng Jira/Trello; khảo sát spa |
| 2 | DONE-HUMAN-PENDING | Đạt (xem `reports/gates/day-02.md`) | Nhóm xác nhận `[Cần chốt]` + ADR-07/ADR-08; tác giả M2–M6 rà lại tiêu chí Mạnh sửa tối thiểu | Họp kick-off chốt `[Cần chốt]`; Tài/Ngân/Lộc rà lại tiêu chí M2–M6 |
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
- Đã làm: đọc toàn bộ nguồn sự thật (SKILL.md, day-playbook.md, technical-spec.md, testing-standards.md, 5 file trong `docs/source/`); `git init`; tạo `docs/PROGRESS.md`, `docs/decisions.md`, `docs/change-requests.md`.
- Lệnh đã chạy và kết quả thật: `git status` → `fatal: not a git repository` (trước khởi tạo); `node -v` → v26.7.0; `npm -v` → 11.19.0.
- Quyết định/CR mới: ADR-01..ADR-05 (xem `docs/decisions.md`).
- Còn dở / HUMAN: chưa bắt đầu Ngày 1 (chờ lệnh "NGÀY 1").

### Phiên 1 · Ngày 1 · Vai DEV + tài liệu · 2026-11-13
- Đã làm: bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` (có đầu tệp phiên bản/ngày, có xác nhận khớp stack); `docs/backlog.md` + `docs/backlog.csv` (48 mục: 24 Must, 20 Should, 4 Could); `docs/survey-template.md` mẫu trống; cập nhật `docs/decisions.md` (ADR-01..06) và `docs/change-requests.md` (CHG-2026-11-13-01, thêm ứng viên CR-07); hạ tầng monorepo npm workspaces `client`/`server` với TypeScript strict, ESLint 9 + Prettier, Jest + ts-jest 4 project; `.env.example`, `docker-compose.yml`, `.github/workflows/ci.yml`, `CONTRIBUTING.md`; 9 script khung `scripts/*.mjs`; khung mã `server/src`, `client/src`, 1 test mẫu `server/tests/unit/health.test.ts`; rà SRS §1–2 và điền khoản trống §2.4 (CSDL) kèm ghi chú ADR-01.
- Lệnh đã chạy và kết quả thật: `npm install` → 546 gói, exit 0 (cảnh báo audit 17 lỗ hổng: 7 low, 9 moderate, 1 high; cảnh báo install-scripts cho esbuild); `npm run lint` → 0 lỗi, exit 0; `npm run typecheck` → server + client sạch, exit 0; `npm test` → unit 1 suite 1 test Pass, integration/system 0 test, exit 0; `npm run build` → server tsc + client vite build thành công, exit 0; `npm run infra:check` → "Cấu hình CI và docker-compose hợp lệ", exit 0; `docker compose config --quiet` → exit 0. Chi tiết: `reports/gates/day-01.md`, file thô `reports/raw/day-01-*.txt`.
- Quyết định/CR mới: ADR-06 (Docker cho PostgreSQL); ADR-01..05 bổ sung mục "Xác nhận" theo quyết định của người dùng ngày 2026-11-13; CHG-2026-11-13-01 (SRS §2.4 chốt PostgreSQL + Prisma); CR-07 thêm vào danh sách ứng viên (nâng FR-M6-01 lên Must).
- Phát hiện: `npm audit` báo 1 lỗ hổng mức high trong cây phụ thuộc, chưa xử lý bằng `audit fix --force`; sẽ rà ở Ngày 9. Chưa có `server/prisma/schema.prisma` nên `db:migrate`/`db:seed` mới chỉ là khai báo.
- Còn dở / HUMAN: họp kick-off (chốt giá trị `[Cần chốt]`), tạo bảng Jira/Trello, Lộc khảo sát 3–5 tiệm spa và điền phiếu — cả ba là `HUMAN-PENDING`.

### Phiên 2 · Ngày 2 · Vai TESTER + tài liệu · 2026-11-13
- Đã làm: rà FR/NFR của M1 và M7 trong `docs/srs.md`, bổ sung §5.1a (6 yêu cầu × 5–8 tiêu chí đo được) và §5.7a (4 yêu cầu × 6–9 tiêu chí); bổ sung §9a (NFR-02 do Mạnh chuyên trách, 9 kiểm tra) và §9b (NFR-01/03/04/05/06); làm rõ 18 tiêu chí còn mơ hồ ở M2–M6 (FR-M2-01/02/03/04, FR-M3-01/02/03/04, FR-M4-01/02/07/08, FR-M5-02/03/04, FR-M6-01/04/05) — mỗi sửa ghi rõ "[Rà Ngày 2 — Mạnh]"; chuyển 5 mục `[Cần chốt]` thành `[Cần chốt → ADR-02/ADR-08]` và cập nhật phụ lục B (nguồn quyết định + trạng thái); nâng SRS v0.1 → **v0.2** (bảng lịch sử phiên bản + mô tả 6 nhóm thay đổi); tạo `docs/requirements.csv` 46 dòng (40 FR + 6 NFR) với cột `id,type,module,priority,uc,title,code_owner,test_owner`; nâng `docs/rtm.md` v0.2 (xác nhận khớp 46 yêu cầu); thêm ADR-07 và ADR-08 vào `docs/decisions.md`; thêm `CHG-2026-11-13-02` và ứng viên CR-08, CR-09 vào `docs/change-requests.md`; tạo `scripts/req-check.mjs` + lệnh `npm run req:check` để kiểm tra Gate bằng máy.
- Lệnh đã chạy và kết quả thật: `npm run req:check` → 46 dòng (40 FR + 6 NFR), 0 ID trùng, 0 ID lệch giữa CSV và SRS, 40 dòng FR ở §5 đã kiểm tra, 0 vi phạm, exit 0; `npm run lint` → 0 lỗi, exit 0; `npm run typecheck` → server + client sạch, exit 0; `npm test` → unit 1 suite 1 test Pass, integration/system 0 test, exit 0; `node scripts/rtm-check.mjs` → chạy được, báo 46 yêu cầu chưa có test case (đúng kế hoạch, test case viết từ Ngày 6) và thiếu `docs/rtm.csv` (Ngày 5), exit 1 do phát hiện này. Chi tiết: `reports/gates/day-02.md`, file thô `reports/raw/day-02-*.txt`.
- Quyết định/CR mới: ADR-07 (mã lỗi 403 `FORBIDDEN` khi người gọi không sở hữu đối tượng), ADR-08 (ngày nghỉ NV chỉ chặn lịch mới; bộ đếm `failed_attempts` tính theo tài khoản và đặt lại khi đăng nhập thành công), CHG-2026-11-13-02, CR-08 (nâng FR-M7-04 lên Should), CR-09 (ngưỡng đạt NFR-02).
- Phát hiện: mức ưu tiên FR-M6-01 (Should → Must) và FR-M7-04 (Could → Should) **chưa áp dụng** — chờ nhóm tại Inspection Ngày 3 (CR-07, CR-08). Ba mầm lỗi còn mở từ Ngày 1 (CR-01 cột R3/R5 của bảng hủy, CR-03 lịch `Pending` quá giờ hẹn, CR-04 cách tạo NV/AD và đặt cờ VIP) chưa ảnh hưởng Gate Ngày 2 nhưng sẽ ảnh hưởng thiết kế test case từ Ngày 6.
- Còn dở / HUMAN: nhóm xác nhận các giá trị `[Cần chốt]` và ADR-07/ADR-08 tại họp kick-off (`HUMAN-PENDING`); Tài/Ngân/Lộc rà lại các tiêu chí Mạnh sửa tối thiểu cho M2–M6 trước Inspection Ngày 3; `RV-nn` chính thức và `docs/reviews/inspection-srs.md` thuộc Ngày 3.

