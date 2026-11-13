# Quyết định kiến trúc và quy trình (ADR)

Đối tượng: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Nhóm: Mạnh, Tài, Ngân, Lộc
Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Mỗi quyết định có: bối cảnh, quyết định, lý do, hệ quả, trạng thái. Quyết định đã chốt không sửa ngược; thay đổi phải lập ADR mới (ADR-nn+1) và ghi vào `docs/change-requests.md` nếu ảnh hưởng yêu cầu.

| ADR | Tiêu đề | Ngày | Trạng thái |
|---|---|---|---|
| ADR-01 | Stack công nghệ và kiến trúc monorepo | 2026-11-13 | Đã chốt |
| ADR-02 | Mặc định nghiệp vụ cho các giá trị `[Cần chốt]` | 2026-11-13 | Đã chốt (chờ nhóm xác nhận ở kick-off) |
| ADR-03 | Giao diện M4/M5 không có người nhận trong kế hoạch gốc | 2026-11-13 | Đã chốt |
| ADR-04 | Mock `PaymentGateway` và `Notifier` dựng sớm | 2026-11-13 | Đã chốt |
| ADR-05 | Hạ tầng repo/Git/ESLint/Jest và rà SRS §1–2 chuyển từ Tài sang Mạnh | 2026-11-13 | Đã chốt |
| ADR-06 | Dùng Docker cho PostgreSQL ở môi trường dev | 2026-11-13 | Đã chốt |

---

## ADR-01: Stack công nghệ và kiến trúc monorepo

- **Bối cảnh:** SRS §2.4 để trống CSDL `[Cần chốt]`; file kế hoạch gốc gợi ý React + Node/Express + MySQL/PostgreSQL, Jest, Postman/Newman, ESLint, GitHub.
- **Quyết định:** monorepo npm workspaces gồm `server` và `client`.
  - Client: React + TypeScript + Vite + Bootstrap 5 + React Router.
  - Server: Node LTS + Express + TypeScript strict, module CommonJS.
  - CSDL: PostgreSQL + Prisma (bắt buộc vì FR-M4-05 cần giao dịch và khoá theo nhân viên).
  - Test: Jest + ts-jest + supertest; Newman cho bộ Postman; k6 nếu cài được, nếu không dùng `autocannon` (npm).
  - Lint/format: ESLint (+ typescript-eslint, `complexity` tối đa 10) + Prettier.
  - Thời gian hệ thống: lưu UTC (`timestamptz`), tính giờ làm theo `Asia/Ho_Chi_Minh`.
- **Lý do:** PostgreSQL + Prisma là lựa chọn duy nhất trong hai giả định đáp ứng yêu cầu giao dịch đồng thời của M4; CommonJS giúp Jest + ts-jest ổn định trên Windows.
- **Hệ quả:** không dùng MySQL; `DATABASE_URL` và `DATABASE_URL_TEST` tách biệt; mọi npm script phải chạy được trên Windows (không cú pháp bash).
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 giữ nguyên mặc định ADR-02 và chốt PostgreSQL + Prisma.
- **Trạng thái:** Đã chốt. Sửa đổi cần ADR mới.

## ADR-02: Mặc định nghiệp vụ cho các giá trị `[Cần chốt]`

- **Bối cảnh:** SRS §6 và §10.B còn các giá trị `[Cần chốt]`; người dùng chỉ định giữ mặc định của SRS §6 và §10.B tới khi có quyết định khác.
- **Quyết định:** giữ nguyên mặc định của SRS §6 và §10.B làm giá trị kiểm thử:
  - BR-01 giờ làm 08:00–18:00 mỗi ngày; ngày nghỉ do Admin cấu hình.
  - BR-09 phụ phí lông dài 15% giá dịch vụ.
  - BR-10 VIP giảm 10%, không cộng dồn với mã khuyến mãi; áp mức giảm lớn hơn.
  - BR-11 cọc 30% thành tiền; hủy muộn giữ 50% cọc (bảng quyết định SRS §8.2).
  - FR-M6-01 được xem là Must (TP-01 §7 nêu lý do).
  - FR-M4-06 tự gán nhân viên rảnh có ít lịch nhất trong ngày; hết người rảnh trả 409.
  - Mặc định bổ sung (technical-spec §1): làm tròn VND bằng `Math.round` mỗi bước; lịch kết thúc không muộn hơn 18:00; hòa mức giảm VIP và mã thì ghi nguồn giảm là `VIP`; tài khoản NV/AD do Admin tạo (Admin đầu tiên được seed); cờ VIP là `users.is_vip` do Admin đặt.
- **Lý do:** người dùng chỉ định rõ giữ mặc định; mọi test case và RTM viết theo giá trị này.
- **Hệ quả:** nếu nhóm đổi giá trị nào, phải lập CR, cập nhật SRS, RTM và test case liên quan trong cùng commit.
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 giữ nguyên toàn bộ mặc định của SRS §6 và §10.B.
- **Trạng thái:** Đã chốt, chờ nhóm xác nhận ở họp kick-off Ngày 1.

## ADR-03: Giao diện M4/M5 không có người nhận trong kế hoạch gốc

- **Bối cảnh:** file kế hoạch gốc (`Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` §5) gán UI cho: Mạnh (M1, M7 + UI đăng nhập), Tài (UI M2, M3), Ngân (không có UI), Lộc (UI M6). Giao diện đặt lịch (M4), Lịch của tôi và Lịch làm việc của nhân viên (M5) không được giao cho ai.
- **Quyết định:** giao UI M4/M5 cho **Lộc** (chủ UI trong nhóm, đã giao M6/UI M6 và wireframe), thực hiện ở Ngày 7–9.
- **Lý do:** Lộc là người thiết kế wireframe (`docs/design/wireframes.md`) nên giữ được tính nhất quán giữa wireframe và UI; Ngân gánh nhiều việc M4/M5 server.
- **Hệ quả:** nếu Lộc không nhận được, UI M4/M5 là `HUMAN-PENDING` và ghi rõ vào báo cáo; không tự code thay.
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 — Lộc nhận UI M4/M5.
- **Trạng thái:** Đã chốt.

## ADR-04: Mock `PaymentGateway` và `Notifier` dựng sớm

- **Bối cảnh:** UC-04 cần cổng thanh toán giả lập từ đầu luồng; FR-M6-04 và UC-07 cần trả về success/failed/timeout; FR-M6-06 cần ghi log thông báo.
- **Quyết định:** dựng giao diện `Clock`, `PaymentGateway`, `Notifier` ngay từ Ngày 6 theo `technical-spec.md` §3. Ngày 6 mock `PaymentGateway` trả `success` mặc định; Ngày 9 Lộc mở rộng thành Stub có kịch bản (success, failed, timeout) và idempotency. `Notifier` ghi vào bảng `notifications`.
- **Lý do:** tránh tích hợp muộn (rủi ro đã nêu ở file kế hoạch gốc §7); cho phép test biên thời gian bằng đồng hồ giả.
- **Hệ quả:** header `X-Mock-Payment` chỉ được bật khi `TEST_MODE=true`; `/__test__/*` trả 404 khi tắt.
- **Trạng thái:** Đã chốt.

## ADR-05: Hạ tầng repo/Git/ESLint/Jest và rà SRS §1–2 chuyển từ Tài sang Mạnh

- **Bối cảnh:** dòng Ngày 1 của file kế hoạch gốc bị lệch cột: nội dung "Dựng repo, quy ước Git, ESLint/Jest; SRS §1–2" nằm ở cột Tài, trong khi phần việc của Mạnh ở cột đó là "Kick-off, chốt Hướng 1, backlog + MoSCoW, mở Jira; Test Plan v0.1".
- **Quyết định:** việc **dựng repo/monorepo, quy ước Git, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml`, GitHub Actions, `CONTRIBUTING.md`, script khung `scripts/*.mjs`** và **rà SRS §1–2** do **Mạnh** đảm nhiệm. Mọi nội dung còn lại giữ nguyên theo kế hoạch gốc.
- **Lý do:** Gate từ Ngày 1 (`npm run lint`, `typecheck`, `npm test`) và Gate Ngày 5 (`rtm:check`) phụ thuộc hạ tầng này; Mạnh là Test Lead nên giữ chất lượng hạ tầng kiểm thử. Điều chỉnh này được ghi trong `SKILL.md` và `day-playbook.md` của skill.
- **Hệ quả:** Tài vẫn giữ các mảng hạ tầng còn lại của mình (hỗ trợ quy ước Git, khung ESLint/Jest nếu cần; phân tích tĩnh, báo cáo coverage, script Postman/Newman).
- **Mở rộng (xác nhận ngày 2026-11-13):** toàn bộ công việc liên quan đến hạ tầng, thiết lập Git và tạo repo chuyển sang Mạnh. Phạm vi hạ tầng Mạnh phụ trách: monorepo npm workspaces, TypeScript strict, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml`, GitHub Actions, `CONTRIBUTING.md`, script khung `scripts/*.mjs`, rà SRS §1–2.
- **Trạng thái:** Đã chốt.

## ADR-06: Dùng Docker cho PostgreSQL ở môi trường dev

- **Bối cảnh:** SRS §2.4 để trống CSDL; cần CSDL cho M2–M6 và cho môi trường test `DATABASE_URL_TEST`.
- **Quyết định:** dùng Docker Compose với dịch vụ `postgres:16-alpine` cho môi trường dev (`npm run db:up` / `db:down`). Môi trường test dùng CSDL tách biệt (`petspa_test`) trên cùng instance Postgres, đặt trong `DATABASE_URL_TEST`.
- **Lý do:** người dùng xác nhận ngày 2026-11-13 có dùng Docker; giúp 4 thành viên có cùng phiên bản PostgreSQL mà không cài Postgres trên từng máy.
- **Hệ quả:** mỗi thành viên cần Docker Desktop; nếu một người không có Docker thì dùng PostgreSQL cài sẵn và chỉ cần đặt `DATABASE_URL`/`DATABASE_URL_TEST` trong `.env`. Việc cài Docker là `HUMAN-PENDING` (không tự cài phần mềm ngoài npm).
- **Trạng thái:** Đã chốt.
