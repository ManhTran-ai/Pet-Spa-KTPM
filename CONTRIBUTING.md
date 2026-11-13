# Đóng góp cho dự án Pet Spa

Dự án: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Nhóm: Mạnh (TV1), Tài (TV2), Ngân (TV3), Lộc (TV4).

## 1. Yêu cầu môi trường

- Node.js >= 20 (khuyến nghị bản LTS mới nhất)
- npm >= 10
- Docker Desktop (cho PostgreSQL) hoặc PostgreSQL cài sẵn
- Git

## 2. Cài đặt và chạy

```bash
npm install
cp .env.example .env
npm run db:up
npm run db:migrate
npm run db:seed
npm run dev
```

- Server: http://localhost:4000 (`GET /api/health`)
- Client: http://localhost:5173

## 3. Nhánh

```
main      <- develop <- feature/*
```

- `main`: bản phát hành, chỉ nhận merge từ `develop` khi đã qua Gate của ngày và đã tag.
- `develop`: nhánh tích hợp hằng ngày.
- `feature/<mo-ta-ngan>`: nhánh làm việc cá nhân, tạo từ `develop`.

Quy tắc: mỗi ngày merge lên `develop` trước họp đứng 15 phút.

## 4. Quy ước commit

Định dạng: `<tiêu-đề> (<phạm vi>): <mô tả> [<Người phụ trách>]`

- Tiền tố: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`.
- Phạm vi trong ngoặc đơn: module (`M1`…`M7`) hoặc khu vực (`repo`, `M2`, `SRS`, `TP`, `RTM`).
- Người phụ trách trong ngoặc vuông: `Mạnh`, `Tài`, `Ngân`, `Lộc`.
- Thân commit: mô tả ngắn, không viết hoa chữ cái đầu, không kết thúc bằng dấu chấm.

Ví dụ:

```
feat(M1): them dang ky va dang nhap JWT 60 phut [Manh]
fix(M4): chong dat trung slot khi tao lich [Ngan]
docs(RTM): cap nhat anh xa FR sang test case [Manh]
chore(repo): setup eslint and jest [Manh]
```

## 5. Quy tắc nhánh và Pull Request

- Mỗi PR gắn với một yêu cầu hoặc lỗi cụ thể, nêu mã trong mô tả (`FR-M4-03`, `DEF-012`).
- PR phải có `npm run lint`, `npm run typecheck`, `npm test` xanh trước khi merge.
- Không merge trực tiếp vào `main` nếu chưa qua Gate của ngày tương ứng.
- Tag: `day-NN` (sau mỗi ngày), `srs-v1.0`, `sdd-v1.0`, `tc-v1.0`, `v1.0-rc`, `v1.0`.

## 6. Quy tắc test

- Test tự động phải có tên bắt đầu bằng `[TC-Mx-nnn]` đúng với `tc_id` trong `docs/testcases/*.csv`.
- Cấu hình Jest theo 4 project: `unit`, `integration`, `system`, `nfr`.
- Không dùng `skip`/`only` để làm xanh bộ test; không hạ ngưỡng coverage.
- Test viết từ SRS và SDD, không viết cho khớp với code của người khác.

## 7. Môi trường test

- `DATABASE_URL_TEST` trỏ tới CSDL riêng cho test; dữ liệu được dọn giữa các file test.
- `TEST_MODE=true` để bật `/__test__/*` và header `X-Mock-Payment`.
- Seed dữ liệu mẫu theo `docs/test-data.md` (Ngày 9).

## 8. Không được làm

- Không commit `.env`, `node_modules/`, `dist/`, `coverage/`.
- Không tự dùng `--force` hay `--legacy-peer-deps` khi `npm install` lỗi phiên bản; báo lại trong nhóm đứng.
- Không sửa SRS mà không mở CR trong `docs/change-requests.md`.
- Không thêm tính năng ngoài SRS.
