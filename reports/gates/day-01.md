# Gate Ngày 1 — Chốt phạm vi và nền tảng

Ngày: 2026-11-13 · Thành viên: Mạnh (TV1) · Vai: DEV + tài liệu
Nguồn số liệu thô: `reports/raw/day-01-*.txt`

## 1. Kết quả từng lệnh

| # | Lệnh | Kết quả | Mã thoát | File thô |
| --- | --- | --- | --- | --- |
| 1 | `npm install` | Cài 546 gói, thành công; có cảnh báo `npm audit` (17 lỗ hổng: 7 low, 9 moderate, 1 high) và cảnh báo `install-scripts` cho `esbuild` | 0 | `reports/raw/day-01-install.txt` |
| 2 | `npm run lint` | ESLint 9, 0 lỗi 0 cảnh báo | 0 | `reports/raw/day-01-lint.txt` |
| 3 | `npm run typecheck` | `server` (tsc --noEmit) và `client` (tsc --noEmit) đều sạch | 0 | `reports/raw/day-01-typecheck.txt` |
| 4 | `npm test` | `unit`: 1 suite, 1 test Pass (`tests/unit/health.test.ts`); `integration`: 0 test (`--passWithNoTests`); `system`: 0 test | 0 | `reports/raw/day-01-test.txt` |
| 5 | `npm run build` | server `tsc` xuất `dist/`; client `vite build` thành công (27 modules) | 0 | ghi trong nhật ký phiên PROGRESS |
| 6 | `npm run infra:check` | "Cấu hình CI và docker-compose hợp lệ." | 0 | `reports/raw/day-01-scripts.txt` |
| 7 | `docker compose config --quiet` | Không lỗi cú pháp | 0 | nhật ký phiên |
| 8 | `node scripts/rtm-check.mjs` | Chạy được; báo thiếu `docs/requirements.csv` (Ngày 2) và `docs/rtm.csv` (Ngày 5) như ghi chú, không phải lỗi | 0 | `reports/raw/day-01-scripts.txt` |
| 9 | `node scripts/tc-record.mjs` (không tham số) | Báo "Thiếu TC-ID..." — kiểm tra tham số đúng như thiết kế | 1 | `reports/raw/day-01-scripts.txt` |
| 10 | `node scripts/tc-sync.mjs` | Báo "Không tìm thấy reports/raw/jest.json. Chạy npm run test:json trước." | 1 | `reports/raw/day-01-scripts.txt` |
| 11 | `node scripts/openapi-check.mjs` | Báo "Chưa có docs/design/openapi.yaml (tạo ở Ngày 4)" | 1 | `reports/raw/day-01-scripts.txt` |

## 2. Đối chiếu tiêu chí Gate của Ngày 1

| Tiêu chí Gate | Trạng thái | Bằng chứng |
| --- | --- | --- |
| `npm install` chạy được | Đạt | Lệnh 1, mã thoát 0 |
| `npm run lint` | Đạt | Lệnh 2, 0 lỗi |
| `npm run typecheck` | Đạt | Lệnh 3, sạch cả server và client |
| `npm test` (có một test mẫu) | Đạt | Lệnh 4, 1 test Pass |
| CI cấu hình hợp lệ | Đạt | Lệnh 6 + 7; `.github/workflows/ci.yml` có checkout, setup-node, `npm ci`, lint, typecheck, test; `docker-compose.yml` có dịch vụ `postgres` |
| ADR-01..05 đã ghi | Đạt | `docs/decisions.md` có ADR-01..ADR-06 (thêm ADR-06 cho Docker theo xác nhận ngày 2026-11-13) |

## 3. Sản phẩm đã tạo

- Tài liệu: `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` (bản làm việc có đầu tệp phiên bản và ngày), `docs/backlog.md`, `docs/backlog.csv` (48 dòng: 24 Must, 20 Should, 4 Could), `docs/survey-template.md` (mẫu trống), `docs/decisions.md`, `docs/change-requests.md`, `docs/PROGRESS.md`.
- Hạ tầng: `package.json` (npm workspaces `client`, `server`), `tsconfig.base.json`, `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.gitignore`, `.env.example`, `docker-compose.yml`, `.github/workflows/ci.yml`, `CONTRIBUTING.md`.
- Mã nguồn khung: `server/src/{app.ts,index.ts,config/env.ts}`, `client/src/{main.tsx,App.tsx}`, `client/index.html`, `client/vite.config.ts`, `server/tests/unit/health.test.ts`.
- Script khung: `scripts/lib/common.mjs`, `scripts/rtm-check.mjs`, `scripts/tc-sync.mjs`, `scripts/tc-record.mjs`, `scripts/exit-check.mjs`, `scripts/static-analysis.mjs`, `scripts/openapi-check.mjs`, `scripts/infra-check.mjs`, `scripts/export-docs.mjs`.

## 4. Việc chưa làm trong Ngày 1 (ngoài phạm vi Mạnh hoặc chưa tới hạn)

- `docs/design/usecases.md`, `docs/glossary.md`, đặc tả UC: của Ngân và Lộc.
- `docs/requirements.csv` (Ngày 2), `docs/rtm.csv` và `docs/testcases/_template.csv` (Ngày 5), `docs/design/openapi.yaml` (Ngày 4).
- Khảo sát 3–5 tiệm spa: `HUMAN-PENDING` (Lộc thu thập).
- Bảng Jira/Trello: `HUMAN-PENDING`.

## 5. Ghi chú rủi ro

- `npm audit` báo 17 lỗ hổng (1 high) trong cây phụ thuộc. Chưa dùng `npm audit fix --force` để tránh phá phiên bản; sẽ rà ở Ngày 9 khi phân tích tĩnh.
- Cảnh báo `install-scripts` cho `esbuild` (vite) chưa được npm cho phép chạy postinstall. Build vẫn chạy được; nếu gặp sự cố Vite ở máy khác thì cần `npm install-scripts approve esbuild`.
- Chưa có `server/prisma/schema.prisma` (thuộc Tài, Ngày 4–5) nên `db:migrate`, `db:seed` mới chỉ là khai báo script.
