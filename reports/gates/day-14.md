# Gate Ngày 14 — Final Test Report + Lessons Learned + đóng gói hồ sơ

| | |
|---|---|
| **Ngày** | 2026-11-22 (Ngày 14 theo kế hoạch 14 ngày) |
| **Thành viên** | Mạnh (TV1, Test Lead) |
| **Phạm vi** | Phase 8 — tổng hợp kết quả, đóng gói hồ sơ nộp, chuẩn bị tag `v1.0` |
| **Trạng thái** | **DONE-HUMAN-PENDING** |
| **Cổng kiểm tra** | `npm run gate` → **exit 0** |

---

## 1. Tóm tắt

| Hạng mục | Kết quả | Sản phẩm |
|---|---|---|
| 8.1 — Final Test Report | ✔ Đạt — 238 ca, 138 đã thực thi, 39 defect, đối chiếu H2-1..H2-4 | `reports/final-test-report.md` |
| 8.2 — Lessons Learned | ✔ Đạt — 10 bài học theo 5 nhóm | `docs/lessons-learned.md` |
| 8.3 — Hồ sơ nộp 14 nhóm | ✔ Đạt — **14/14 nhóm, 0 mục trống** | `reports/handoff-checklist.md` |
| 8.3b — Báo cáo NFR | ✔ Đạt (bổ sung) — 44 ca NFR, 3 nhóm công cụ | `reports/nfr-report.md` |
| 8.3c — Báo cáo UAT | ✔ Đạt (bổ sung) — 8 kịch bản + phương pháp + tiêu chí nghiệm thu | `reports/uat-report.md` |
| 8.3d — Đóng gói `submission/` | ✔ Đạt — **57 tệp** (56 tài liệu + index), 0 thiếu | `submission/` |
| 8.4 — Tag `v1.0` + commit + push | ✔ Đạt | Git |

---

## 2. Lệnh đã chạy & kết quả thật

| Lệnh | Kết quả |
|---|---|
| `npm run gate` | **exit 0** — `req:check` 0 vi phạm · `rtm:check` truy xuất 2 chiều 100% · `assign:check` 4/4 nguyên tắc (Tài 56 · Mạnh 56 · Lộc 57 · Ngân 61, chênh lệch 5 ≤ 7) · `exit:check` **4/8 đạt** |
| `npm run lint` | **exit 0** — 0 lỗi ESLint |
| `npm run typecheck` | **exit 0** — `tsc --noEmit` sạch |
| `node scripts/export-docs.mjs` | Đã gom **56 tài liệu** vào `submission/` (57 tệp gồm index) — 0 thiếu |
| `node scripts/tc-review-check.mjs` | 0 Major · 0 Minor |

---

## 3. Sửa lỗi logic phát hiện trong Phase 8

### 3.1 EC-7 báo PASS dù UAT chưa thực thi

| | |
|---|---|
| **Hiện trạng trước** | `scripts/exit-check.mjs` coi EC-7 là đạt chỉ vì **file `reports/uat-report.md` tồn tại** (`uatRaw.length > 0 && blockingUat.length === 0`) |
| **Hậu quả** | `exit:check` báo **5/8 đạt** trong khi báo cáo UAT ghi rõ "Đã thực thi: 0" — hai tài liệu mâu thuẫn nhau trong cùng một hồ sơ |
| **Cách sửa** | EC-7 chỉ đạt khi báo cáo ghi **"Đã thực thi" ≥ 1** và không có phản hồi chặn. Thêm trạng thái trung gian `HUMAN-PENDING` cho ca "đã có báo cáo nhưng chưa chạy" |
| **Kết quả** | EC-7 = **HUMAN-PENDING** → tổng **4/8 đạt**, khớp với `final-test-report.md` §7 và `handoff-checklist.md` |
| **Nguyên tắc** | Không hạ tiêu chí để xanh, cũng không để script tự báo xanh khi điều kiện chưa đạt — sửa **công thức đo**, không sửa **kết quả** |

### 3.2 Sai lệch số liệu trong báo cáo

| Vấn đề | Cách sửa |
|---|---|
| `final-test-report.md` ghi "10 kỹ thuật" trong khi CSV chỉ có 9 nhãn kỹ thuật | Đếm lại từ `docs/testcases/*.csv` → sửa thành **9 kỹ thuật** (UC 79 · Use case 37 · BVA 34 · EP 25 · ST 21 · DT 20 · Accessibility 6 · SEO 6 · Lighthouse 2) |
| Hai cách tính tỷ lệ Pass Critical/High (80,6% theo log vs 81,5% theo bộ test case) | Thống nhất lấy **80,6%** theo `reports/execution-log.csv` — nguồn chính thức của `exit-check.mjs`; thêm ghi chú giải thích hai nguồn |
| "22/22 defect re-test" (sai nghĩa) | Sửa thành **22 defect đã re-test, cả 22 đều vẫn tái hiện, 0 đóng được** (6 lỗi còn lại không re-test được vì lý do kỹ thuật) |
| "84 ca T1/T2 chưa chạy" (thực tế 76) | Đếm lại từ CSV → **T1: 43 · T2: 33 = 76** |
| "13/20 ca NFR Fail" (thực tế 20/37) | Đếm lại từ `docs/testcases/nfr.csv` → **20 Fail / 37 đã chạy** |
| "47 ca T1 + 37 ca T2 chưa chạy" trong `final-test-report.md` | Sửa thành **43 + 33** |
| "7 project Playwright" (thực tế 12) | Đếm lại từ `playwright.config.ts` → **12 project** |

> **Bài học rút ra (đã ghi vào `docs/lessons-learned.md` §2.4):** mọi con số trong báo cáo phải **đọc lại từ file thô**, không dựa vào trí nhớ. Trong 7 lần kiểm tra ở Phase 8, cả 7 lần đều phát hiện sai lệch — dù nhỏ.

---

## 4. Bổ sung cấu trúc hồ sơ nộp

`scripts/export-docs.mjs` trước đây thiếu 4 nhóm tài liệu bắt buộc:

| Nhóm | Thay đổi |
|---|---|
| 5 tài liệu thiết kế test | Bổ sung gom toàn bộ `docs/design/` (6 file: 5 tài liệu + `design-index.csv`) |
| Biên bản gate theo ngày | Bổ sung gom toàn bộ `reports/gates/` (16 file) |
| Bản ghi thực thi | Bổ sung gom `reports/execution-log.csv` (137 dòng) — nguồn số liệu chính thức cho Exit criteria |
| Báo cáo re-test lỗi | Bổ sung `reports/defect-retest-report.md` |
| Danh sách biên bản review | Sửa tên cho đúng thực tế: `inspection-srs.md` · `design-review.md` · `testcase-inspection.md` (trước dùng tên không tồn tại) |

**Kết quả:** `submission/` gồm **57 tệp** (56 tài liệu + `README.md` index), mục "Chưa có" trong `submission/README.md` là **"(không)"**.

---

## 5. Nghiệm thu Phase 8 (theo kế hoạch §8)

| Điều kiện nghiệm thu | Kết quả |
|---|---|
| `reports/handoff-checklist.md` đánh dấu đủ 14/14 nhóm, không mục nào trống | ✔ **Đạt** — 12 nhóm ✔ Đạt · 2 nhóm ⚠ Đạt một phần (UAT chưa chạy · demo cần chạy thử) · **0 nhóm trống** |
| Final Test Report có bảng số liệu thật lấy từ `reports/execution-log.csv`, không có con số ước lượng | ✔ **Đạt** — mọi con số đã đối chiếu lại từ file thô (§3.2) |
| Repo có tag `v1.0` | ✔ **Đạt** — tag `v1.0` trên commit Phase 8 |
| `npm run gate` exit 0 | ✔ **Đạt** |

---

## 6. Việc còn nợ (không chặn bàn giao)

| # | Việc | Người phụ trách | Ước lượng | Ảnh hưởng |
|---|---|---|---|---|
| 1 | **Thực hiện UAT** với 5–8 người ngoài nhóm | Lộc (TV4) | 3 ngày | Đóng EC-7 — tiêu chí duy nhất còn mở bởi nhóm |
| 2 | Chạy 76 ca T1/T2 còn "Chưa thực thi" | Tài + Ngân | 2 ngày | Đưa EC-2 lên mức đo đầy đủ nhất |
| 3 | Tự động hoá 27 ca NFR còn lại | Mạnh + Lộc | 1 ngày | Bằng chứng máy cho toàn bộ NFR |
| 4 | Chạy 2 ca tương thích Edge + Safari | Tài | 0,5 ngày | Đủ 4/4 trình duyệt |
| 5 | Bàn giao 39 defect cho chủ site kèm khuyến nghị ưu tiên | Mạnh | 1 ngày | Biến phát hiện thành giá trị thực tế |
| 6 | Chạy demo 1 lần trước buổi bảo vệ | Mạnh | 1 giờ | Chắc chắn script không hỏng do site đổi |

---

## 7. Ghi chú bàn giao

- `docs/PLN-01-ke-hoach-cong-viec-Manh.md` là tài liệu **quản lý cá nhân của Test Lead** — nằm trong `.gitignore`, **không push lên GitHub** theo yêu cầu.
- Mọi báo cáo trong `reports/` đều truy được về file thô trong `reports/raw/` — không có con số ước lượng.
- 39 defect đều giữ trạng thái `Open`/`New` theo `docs/design/usecase-workflow.md` §5.2 — nhóm không có quyền sửa site đích, và **không sửa test case để làm xanh**.
