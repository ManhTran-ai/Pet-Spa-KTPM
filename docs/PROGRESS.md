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
| 1 | TODO | | | |
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
