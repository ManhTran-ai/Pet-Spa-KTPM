# Gate Ngày 2 — SRS bản nháp hoàn chỉnh v0.2

Ngày: 2026-11-13 · Thành viên: Mạnh (TV1) · Vai: TESTER + tài liệu
Nguồn số liệu thô: `reports/raw/day-02-*.txt`, `reports/raw/day-02-req-check.md`

## 1. Kết quả từng lệnh

| # | Lệnh | Kết quả | Mã thoát | File thô |
| --- | --- | --- | --- | --- |
| 1 | `npm run req:check` (`node scripts/req-check.mjs`) | 46 dòng yêu cầu (40 FR + 6 NFR); 0 ID trùng; 0 ID lệch giữa CSV và SRS; 40 dòng FR trong §5 đã kiểm tra; **0 vi phạm** | 0 | `reports/raw/day-02-req-check-console.txt`, `reports/raw/day-02-req-check.md` |
| 2 | `npm run lint` | ESLint 9, 0 lỗi 0 cảnh báo | 0 | `reports/raw/day-02-lint.txt` |
| 3 | `npm run typecheck` | `server` (tsc --noEmit) và `client` (tsc --noEmit) đều sạch | 0 | `reports/raw/day-02-typecheck.txt` |
| 4 | `npm test` | `unit`: 1 suite, 1 test Pass (`tests/unit/health.test.ts`); `integration`: 0 test (`--passWithNoTests`); `system`: 0 test | 0 | `reports/raw/day-02-test.txt` |
| 5 | `node scripts/rtm-check.mjs` | Chạy được; báo 46 yêu cầu chưa có test case (đúng như kế hoạch — test case viết từ Ngày 6) và thiếu `docs/rtm.csv` (Ngày 5). `docs/rtm-coverage.md` đã ghi. | 1 (do phát hiện chưa có test case) | `reports/raw/day-02-rtm-check.txt` |

Ghi chú về lệnh 5: `rtm:check` **không phải** tiêu chí Gate của Ngày 2 (theo `day-playbook.md`, Gate chỉ từ Ngày 8 mới gồm `rtm:check`). Mã thoát 1 ở đây là hệ quả đúng của việc chưa có test case, không phải hỏng script — Ngày 1 cũng đã ghi nhận script chạy được.

## 2. Đối chiếu tiêu chí Gate của Ngày 2

| Tiêu chí Gate | Trạng thái | Bằng chứng |
| --- | --- | --- |
| Số dòng `docs/requirements.csv` = 46 và khớp ID trong SRS | Đạt | Lệnh 1: 46 dòng = 40 FR + 6 NFR; 0 ID trùng; 0 ID trong CSV không có trong SRS; 0 ID trong SRS không có trong CSV |
| Khớp RTM-01 | Đạt | RTM-01 §1 vẫn ghi 46 yêu cầu (M1:6, M2:5, M3:4, M4:8, M5:7, M6:6, M7:4, NFR:6); `docs/rtm.md` nâng lên v0.2, không thêm/bớt ID |
| Mọi FR có tiêu chí chấp nhận | Đạt | Lệnh 1 kiểm tra cả 40 dòng FR ở bảng §5: mọi dòng có con số, mã lỗi HTTP, tham chiếu BR/ADR hoặc trỏ tới bảng chi tiết §5.1a/§5.7a |
| Không còn từ mơ hồ không kèm con số | Đạt | Lệnh 1 quét 9 từ mơ hồ (`nhanh`, `thân thiện`, `phù hợp`, `dễ dùng`, `gọn`, `hợp lý`, `thích hợp`, `đầy đủ`, `khoảng thời gian`) trên toàn bộ tiêu chí chấp nhận: 0 phát hiện |
| Mọi `[Cần chốt]` đã xử lý | Đạt | 0 mục `[Cần chốt]` trần trong §6; 5 mục đã trỏ tới ADR-02/ADR-08 |
| NFR cụ thể (Mạnh phụ trách NFR-02) | Đạt | `docs/srs.md` §9a (NFR-02, 9 kiểm tra) và §9b (NFR-01, 03, 04, 05, 06) — mỗi NFR có ngưỡng đo được |
| `npm run lint` | Đạt | Lệnh 2, 0 lỗi |
| `npm run typecheck` | Đạt | Lệnh 3, sạch cả server và client |
| `npm test` | Đạt | Lệnh 4, 1 test Pass, mã thoát 0 |

## 3. Sản phẩm đã tạo / cập nhật trong Ngày 2

| Tệp | Nội dung |
| --- | --- |
| `docs/srs.md` | Nâng **v0.1 → v0.2**. Thêm §5.1a (M1, 6 yêu cầu × 5–8 tiêu chí đo được), §5.7a (M7, 4 yêu cầu × 6–9 tiêu chí), §9a (NFR-02, 9 kiểm tra), §9b (5 NFR còn lại). Làm rõ 18 tiêu chí còn mơ hồ ở M2–M6 (mỗi sửa đều ghi rõ "[Rà Ngày 2 — Mạnh]"). Chuyển 5 mục `[Cần chốt]` → `[Cần chốt → ADR-xx]`. Phụ lục B bổ sung cột nguồn quyết định và trạng thái |
| `docs/requirements.csv` | **Mới**, 46 dòng: `id,type,module,priority,uc,title,code_owner,test_owner` |
| `docs/rtm.md` | Nâng v0.1 → v0.2, xác nhận khớp 46 yêu cầu với SRS v0.2 và `requirements.csv` |
| `docs/decisions.md` | Thêm **ADR-07** (mã lỗi 403 `FORBIDDEN` khi không sở hữu đối tượng) và **ADR-08** (ngày nghỉ NV, cách tính bộ đếm `failed_attempts`) |
| `docs/change-requests.md` | Thêm `CHG-2026-11-13-02` (thay đổi trước baseline) và ứng viên **CR-08** (nâng FR-M7-04 lên Should), **CR-09** (ngưỡng đạt NFR-02) |
| `docs/PROGRESS.md` | Kế hoạch phiên 2, trạng thái Ngày 2, nhật ký phiên |
| `scripts/req-check.mjs` | **Mới** — script kiểm tra Gate: cấu trúc CSV, số dòng, ID trùng, khớp SRS, ưu tiên, tiêu chí chấp nhận đo được, từ mơ hồ, `[Cần chốt]`, NFR chi tiết. Thêm lệnh `npm run req:check` |
| `package.json` | Thêm script `req:check` |

## 4. Bản đồ thay đổi yêu cầu — không có thay đổi phạm vi

- **Số lượng yêu cầu không đổi:** vẫn 46 (40 FR + 6 NFR), đúng như RTM-01 và `docs/backlog.csv`.
- **Không thêm, không bớt, không đổi ID** yêu cầu nào.
- **Không thay đổi** mức ưu tiên của bất kỳ FR nào trong bảng §5 (đã đối chiếu máy: 0 sai lệch).
- Mức ưu tiên FR-M6-01 (Should → Must) và FR-M7-04 (Could → Should) **chưa áp dụng** — đang là CR-07 và CR-08 chờ nhóm tại Inspection Ngày 3.

## 5. Việc chưa làm trong Ngày 2 (ngoài phạm vi Mạnh hoặc chưa tới hạn)

- Rà FR của M2/M3 (Tài), M4/M5 (Ngân), M6 (Lộc) theo checklist phụ lục A để ghi `RV-nn` chính thức: thuộc Ngày 3 (Inspection), Mạnh làm Moderator.
- `docs/rtm.csv` (Ngày 5), `docs/testcases/_template.csv` (Ngày 5), `docs/design/openapi.yaml` (Ngày 4).
- Xác nhận của nhóm về các giá trị `[Cần chốt]` và ADR-07/ADR-08: `HUMAN-PENDING` (họp kick-off).

## 6. Ghi chú rủi ro

- Tiêu chí chấp nhận mới của M2–M6 do Mạnh sửa **một cách tối thiểu**, chỉ để đáp ứng yêu cầu "tiêu chí chấp nhận phải đo được". Tác giả gốc (Tài, Ngân, Lộc) cần rà lại phần của mình ở Inspection Ngày 3 và mở CR nếu thấy sai.
- Ba giá trị còn chờ nhóm: tài khoản NV/AD do Admin tạo và Admin đầu tiên được seed (CR-04); cách để lịch `Pending` quá giờ hẹn (CR-03); cột R3/R5 của bảng hủy (CR-01). Chưa ảnh hưởng Gate Ngày 2 nhưng sẽ ảnh hưởng thiết kế test case từ Ngày 6.
- `npm audit` vẫn báo lỗ hổng ở cây phụ thuộc (kế hoạch rà ở Ngày 9).
