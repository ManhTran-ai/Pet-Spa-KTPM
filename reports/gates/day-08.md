# Gate Ngày 8 — Inspection bộ test case theo checklist 4C

Ngày: 2026-11-19 · Thành viên: Mạnh (TV1) · Vai: TESTER + tài liệu · Moderator phiên rà soát
Nguồn số liệu thô: `reports/raw/tc-review-check.txt`

Biên bản đầy đủ: `docs/reviews/testcase-inspection.md` · CR: `CHG-2026-11-19-01`

## 1. Kết quả từng lệnh

| # | Lệnh | Kết quả | Mã thoát | File thô |
| --- | --- | --- | --- | --- |
| 1 | `node scripts/tc-review-check.mjs` (lần 1, trước sửa) | 226 test case; **14 Major + 5 Minor** | 1 | `reports/raw/tc-review-check.txt` (lịch sử git) |
| 2 | `npm run docs:sync` | SRS gốc → `docs/srs.md` (480 dòng); Test Plan → `docs/test-plan.md`; RTM → `docs/rtm.md` | 0 | — |
| 3 | `npm run req:build` | `requirements.csv`: 58 → **60 yêu cầu** (53 FR + 7 NFR) | 0 | — |
| 4 | `npm run req:check` | 60 dòng; 0 ID trùng; 0 ID lệch giữa CSV và SRS; **0 vi phạm** | 0 | — |
| 5 | `npm run rtm:build` | RTM: 60 yêu cầu, **60 được phủ**, 226 test case | 0 | — |
| 6 | `npm run backlog:build` | backlog: 102 mục | 0 | — |
| 7 | `node scripts/tc-review-check.mjs` (lần 2, sau sửa) | 226 test case; **0 Major · 0 Minor · 0 Observation** | **0** | `reports/raw/tc-review-check.txt` |
| 8 | `npm run gate` | `req:check` 0 vi phạm · `rtm:check` độ phủ 100% · `assign:check` 4/4 nguyên tắc · `exit:check` 5/8 | **0** | `reports/rtm-coverage.md`, `reports/exit-criteria.md` |

## 2. Đối chiếu tiêu chí Gate của Ngày 8

| Tiêu chí Gate | Trạng thái | Bằng chứng |
| --- | --- | --- |
| Mọi test case viết theo checklist 4C, 0 lỗi Major | Đạt | Lệnh 7: **0 Major · 0 Minor · 0 Observation** trên 226 ca |
| Mọi `Requirement_ID` tồn tại trong SRS-01 | Đạt | Lệnh 7, quy tắc `C-REQ` — 0 phát hiện |
| `System` và module của mỗi ca nằm trong phạm vi yêu cầu | Đạt sau sửa | Lệnh 7, quy tắc `C-SYSTEM` / `C-MODULE` — 0 phát hiện (trước sửa: 13 + 1) |
| Mọi yêu cầu SRS-01 có ≥ 1 test case | Đạt | Lệnh 7, quy tắc `CMP-COVER` — 60/60 được phủ |
| CSV đủ 9 cột, `TC_ID` không trùng, `Title` không trùng trong cùng nhóm | Đạt sau sửa | Lệnh 7, quy tắc `C-COLUMN` / `C-ID` / `C-DUP` — 0 phát hiện (trước sửa: 2 `C-COLUMN`) |
| SRS-01 đã qua quy trình thay đổi (CR → version bump → sync → rebuild) | Đạt | `CHG-2026-11-19-01` trong `docs/change-requests.md`; SRS v1.2 → **v1.3**; lệnh 2–4 |
| RTM truy xuết 100% | Đạt | Lệnh 5: 60 yêu cầu, 60 được phủ, 226 test case |
| `npm run gate` exit 0 | Đạt | Lệnh 8 |
| Số lượng test case không đổi (226) | Đạt | Kiểm đối chiếu trước/sau: 226 → 226 (không thêm, không bỏ) |
| Phân công vẫn cân bằng | Đạt | Lệnh 8 `assign:check`: Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58; chênh lệch 3 (≤ 3); 0 module chỉ 1 người chạy |

## 3. Sản phẩm đã tạo / cập nhật trong Ngày 8

| Tệp | Nội dung |
| --- | --- |
| `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` | **v1.2 → v1.3**. 9 yêu cầu đổi phạm vi hệ thống (`FR-M5-04` +T1, `FR-M4-06` +T2, `FR-M4-01/02/03/07/08` +T3, `FR-M3-06` +T3), 8 yêu cầu đổi tiêu chí chấp nhận, **2 yêu cầu mới** (`FR-M4-13`, `FR-M7-07`), thêm §8.2b (luồng T3 — không phải wizard), sửa §3.3 (luồng đặt lịch T3), §4 (`UC-03` N5, `UC-05`), §7 (dòng SĐT T3) |
| `docs/srs.md` | Đồng bộ từ bản gốc (`docs:sync`) |
| `docs/requirements.csv` | 58 → **60** yêu cầu; 9 dòng đổi `systems`, 8 dòng đổi tiêu chí chấp nhận |
| `docs/rtm.csv` + `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` | 60 yêu cầu, 60 được phủ, 226 test case |
| `docs/testcases/t1.csv` | `TC-T1-M5-006`: đổi `Requirement_ID` `FR-M5-04` → `FR-M5-03`, sửa `Title` |
| `docs/testcases/t2.csv` | `TC-T2-M6-001` → `TC-T2-M2-003` (khớp module `FR-M2-07`) |
| `docs/testcases/t3.csv` | Viết lại 11 ca: `TC-T3-M3-005`, `TC-T3-M4-001`…`-011`, `TC-T3-M7-002` — bỏ các bước wizard không tồn tại ở T3, thay bằng hành vi quan sát được |
| `docs/testcases/nfr.csv` | Sửa `Title` 5 ca (`TC-NFR-01-006`, `-02-004`, `-06-001`, `-07-004`, `-07-005`) |
| `docs/change-requests.md` | Mở `CHG-2026-11-19-01` — trạng thái **Đã áp dụng** |
| `docs/reviews/testcase-inspection.md` | **Mới** — biên bản Inspection đầy đủ theo 6 bước Cẩm nang §3.2, 10 phát hiện TV-01…TV-10, bảng bằng chứng sống trên 3 site đích |
| `scripts/tc-review-check.mjs` | **Mới** — linter 4C tự động: kiểm tra `Correctness` / `Clarity` / `Completeness` / `Consistency` trên 226 ca, đối chiếu `requirements.csv`; exit code ≠ 0 nếu còn Major |
| `reports/raw/tc-review-check.txt` | **Mới** — báo cáo linter (lần chạy cuối: 0 phát hiện) |

## 4. Bản đồ thay đổi yêu cầu

- **Số yêu cầu: 58 → 60.** Tăng do 2 yêu cầu mới sinh ra từ hành vi đã kiểm chứng sống ở T3:
  - `FR-M4-13` — T3 chỉ nhận đặt lịch từ khách đã có hồ sơ; khách mới được hướng dẫn qua form tiếp nhận.
  - `FR-M7-07` — Hệ thống không hỗ trợ đa ngôn ngữ thì hiển thị nội dung bằng một ngôn ngữ duy nhất (T3).
- **Không có yêu cầu nào bị bỏ.** Không đổi ID yêu cầu cũ.
- **Số test case: 226 → 226.** Không thêm, không bỏ. 14 ca sửa nội dung: 1 đổi `TC_ID`, 1 đổi `Requirement_ID`, 12 viết lại `Title`/`Requirement_ID` theo hành vi thật.
- **Không có yêu cầu nào thuộc phạm vi của site đích bị "điều chỉnh để vượt kiểm thử".** Mọi thay đổi đều làm đặc tả **khớp hơn** với hành vi quan sát được, theo nguyên tắc SRS §2.6.

## 5. Việc chưa làm trong Ngày 8 (chuyển sang Phase 2+)

- `exit:check` mới đạt **5/8**:
  - **EC-2** (siết tiêu chí) — theo quyết định đã chốt, hoàn thiện ở **Ngày 13 / Phase 7**.
  - **EC-6** — giữ **FAIL** do giới hạn site đích đang vận hành thật (ADR-11); ghi rõ trong Final Test Report.
- Phase 2 — Walkthrough & Test Design Assembly (Ngày 8–9).
- Phase 3 — Dựng hạ tầng tự động hoá cho 56 ca của Mạnh (Ngày 9).

## 6. Ghi chú rủi ro

- 11 ca T3 viết lại phụ thuộc vào **hành vi hiện tại** của nền tảng Groomore. Nếu site đích đổi luồng drawer trong kỳ kiểm thử, đó là **kết quả kiểm thử** (defect hoặc thay đổi nghiệp vụ), không phải lỗi của đặc tả — SRS §2.6.
- `FR-M4-13` và `FR-M7-07` là **yêu cầu đặc tả hành vi hiện hữu**, không phải yêu cầu chức năng mong muốn. Nhóm không đề xuất sửa site đích.
- 2 ca `TC-T3-M4-006` / `TC-T3-M4-007` kiểm thử **hành vi từ chối** nên chạy được đầy đủ trong môi trường thật mà không tạo lịch hẹn thật. Các luồng sau khi bấm `Login` với SĐT thuộc hồ sơ cũ **không** kiểm thử được — đã ghi nhận trong Test Plan §2.3.
