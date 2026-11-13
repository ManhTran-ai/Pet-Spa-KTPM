# PROGRESS: Pet Spa (14 ngày)

Cập nhật: 2026-11-13 · Phiên: 1 (Ngày 1) · Commit: 78d4471

Kế hoạch phiên 1 (Ngày 1 · Mạnh):
1. Chép 3 tài liệu nguồn sang bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` (thêm đầu tệp phiên bản + ngày). Verify: đủ 3 file, nội dung khớp nguồn.
2. Viết `docs/backlog.md` + `docs/backlog.csv` theo MoSCoW SRS §2.2 và ưu tiên SRS §5/§9. Verify: CSV đọc được, mọi dòng có mức và chủ sở hữu.
3. Cập nhật `docs/decisions.md` (ADR-01..05 đã có; ghi nhận xác nhận của người dùng: ADR-03 Lộc nhận UI M4/M5; ADR-05 Mạnh nhận toàn bộ hạ tầng; ADR-02 giữ nguyên mặc định; Docker cho PostgreSQL → ADR-06).
4. Dựng monorepo npm workspaces `client`/`server`: TypeScript strict, ESLint + Prettier, Jest + ts-jest. Verify: `npm install`, `npm run lint`, `npm run typecheck`, `npm test` chạy thật.
5. Tạo `.env.example`, `docker-compose.yml` (PostgreSQL), `.github/workflows/ci.yml` (lint, typecheck, test), `CONTRIBUTING.md`.
6. Tạo script khung `scripts/*.mjs` theo SKILL §7: rtm-check, tc-sync, tc-record, exit-check, export-docs, static-analysis, check-openapi.
7. Rà SRS §1–2, hoàn thiện nếu thiếu (bản làm việc `docs/srs.md`).
8. Chạy Gate Ngày 1, lưu kết quả thật vào `reports/gates/day-01.md`.

Rủi ro: (a) mạng hạn chế khi `npm install`; (b) xung đột phiên bản peer deps — không dùng `--force`/`--legacy-peer-deps`, báo lại nếu có; (c) chưa có schema Prisma (thuộc Tài, Ngày 4–5) nên `db:*` mới chỉ là khung script.

Thành viên: Mạnh (TV1, Trưởng nhóm / Test Lead), Tài (TV2), Ngân (TV3), Lộc (TV4).
Phiên này đại diện DUY NHẤT cho Mạnh.

| Ngày | Trạng thái | Gate | Việc còn dở | HUMAN đang chờ |
|---|---|---|---|---|
| 1 | DONE-HUMAN-PENDING | Đạt (xem `reports/gates/day-01.md`) | Khảo sát 3–5 tiệm spa (Lộc), bảng Jira/Trello, họp kick-off chốt `[Cần chốt]` | Họp kick-off; tạo bảng Jira/Trello; khảo sát spa |
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
