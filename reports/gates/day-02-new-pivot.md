# Gate Ngày 2 — Khảo sát chi tiết & chốt bảng giá tham chiếu

Ngày: 2026-11-14 · Người lập: Mạnh (TV1) · Kế hoạch: `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` §5

Gate của Ngày 2 theo kế hoạch: **SRS cập nhật** — khảo sát chi tiết T1/T2/T3, bổ sung quan sát vào SRS, chốt bảng giá tham chiếu.

---

## 1. Lệnh đã chạy và kết quả thật

| # | Lệnh | Kết quả | Mã |
|---|---|---|---|
| 1 | `node scripts/survey-pricing.mjs` | T1: 1 bảng (17 dòng). T2: 3 bảng (13/5/7 dòng). T3: 0 bảng `<table>` — dữ liệu nằm trong API | 0 |
| 2 | `node scripts/survey-t2-tables.mjs` | Xác nhận bảng T2 **dùng chung cho Chó và Mèo** — đổi nút Chó/Mèo không làm đổi bảng | 0 |
| 3 | `node scripts/survey-t2-dog-cat.mjs` | Chó `>3–6kg` = 200.000đ; **Mèo `>3–6kg` = 200.000đ**; Chó `>6–10kg` = 300.000đ; **Mèo `>6–10kg` = 300.000đ** | 0 |
| 4 | `node scripts/survey-t3-api.mjs` | Phát hiện endpoint công khai `GET /booking-api/v1/service?booking_page=1` (HTTP 200) qua theo dõi lưu lượng mạng | 0 |
| 5 | `node scripts/survey-t3-services.mjs` | HTTP 200 — 41 dịch vụ trong 5 nhóm; giá tính bằng **cent**, thời lượng tính bằng **phút** | 0 |
| 6 | `node scripts/survey-t3-setting.mjs` | HTTP 200 — cấu hình đặt lịch; **không** có trường nào tên "reception fee" | 0 |
| 7 | `node scripts/survey-t3-table.mjs` | `survey-T3-price-table.csv`: 41 dòng dịch vụ | 0 |
| 8 | `node scripts/build-pricing-baseline.mjs` | `docs/reference/pricing-baseline.csv`: **213 dòng** (T1 = 84, T2 = 88, T3 = 41) | 0 |
| 9 | `node scripts/req-build.mjs` | `requirements.csv`: 58 yêu cầu | 0 |
| 10 | `node scripts/rtm-build.mjs` | RTM: **58 yêu cầu, 58 được phủ, 226 test case** | 0 |
| 11 | `node scripts/req-check.mjs` | 58 dòng · 51 FR · 7 NFR · ID trùng 0 · **số vi phạm 0** | 0 |
| 12 | `node scripts/rtm-check.mjs` | Tỷ lệ độ phủ **100.0%**, tổng test case 226, vi phạm 0 | 0 |
| 13 | `npm run lint` | 0 lỗi | 0 |
| 14 | `npm run typecheck` | Sạch | 0 |

---

## 2. Sản phẩm bàn giao

| Tệp | Nội dung |
|---|---|
| `docs/reference/pricing-baseline.csv` | Bảng giá tham chiếu 213 dòng (máy đọc được) |
| `docs/reference/pricing-baseline.md` | REF-01 — bảng đầy đủ 3 site + 6 phát hiện + phân công Ngày 2 |
| `docs/ASSIGNMENT.md` | ASG-01 — tài liệu giao việc cho 3 thành viên |
| `README.md` | Điểm vào repo cho người mới |
| `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` | v1.0 → **v1.1** |
| `docs/change-requests.md` | CHG-2026-11-14-01 (đã áp dụng), CHG-2026-11-14-02 (chờ nhóm) |
| `docs/PROGRESS.md` | Cập nhật trạng thái Ngày 2 + nhật ký phiên 5 |

---

## 3. Sáu phát hiện — ảnh hưởng tới đặc tả

| Mã | Phát hiện | Xử lý |
|---|---|---|
| **P1** | T2: giá Chó và Mèo ở cùng bậc cân nặng **bằng nhau** (đo được 2 bậc). `FR-M3-02` yêu cầu khác nhau | Mở **CHG-2026-11-14-02**, chờ nhóm quyết định tại Inspection |
| **P2** | Mục 3.2 ghi "10 dịch vụ grooming + 4 dịch vụ nhuộm"; thực tế 4 combo + 6 lẻ, và 3 dịch vụ nhuộm | Đã sửa trong CHG-2026-11-14-01 |
| **P3** | Bảng tĩnh T2 dùng ký hiệu rút gọn (`120k`, `1tr`), calculator dùng định dạng đầy đủ (`~200.000đ`) | Ghi vào REF-01 §3.4; test tích hợp phải chuẩn hoá trước khi so sánh |
| **P4** | `BR-03` mô tả T3 có 6 nhóm cân nặng cố định; thực tế mỗi dòng sản phẩm có bộ ngưỡng riêng | Đã sửa trong CHG-2026-11-14-01 |
| **P5** | "Phí lễ tân $52" không tồn tại trong danh mục; $52 là giá *Dog Bath 0-20lbs* | Đã sửa `BR-12` trong CHG-2026-11-14-01 |
| **P6** | T3 có 2 khoản phụ thu chưa nêu: `*HOLIDAY FEE*` $27, `Emergency appointment fee` $25 | Đã bổ sung `BR-17` |

Ngoài ra bổ sung `BR-18`: giá T1 **tăng đơn điệu** theo bậc cân nặng trong cùng một cột — dùng làm oracle cho kiểm thử tích hợp Ngày 10.

---

## 4. Đánh giá tiêu chí kết thúc Ngày 2

| Tiêu chí | Kết quả |
|---|---|
| Khảo sát chi tiết đủ 3 hệ thống | **Đạt** — T1 (bảng HTML), T2 (3 bảng + calculator), T3 (API JSON 41 dịch vụ) |
| Bảng giá tham chiếu chốt | **Đạt** — REF-01, 213 dòng, có bằng chứng thô trong `reports/raw/` |
| SRS cập nhật theo quan sát | **Đạt** — v1.1, `req:check` 0 vi phạm |
| RTM không đứt đoạn | **Đạt** — truy xuất 100%, 226 test case giữ nguyên |
| Tài liệu giao việc cho 3 thành viên | **Đạt** — `docs/ASSIGNMENT.md` |
| Kết quả đối chiếu ma trận giá đầy đủ (T2, T3) | **Chưa đạt** — Tài và Ngân đang làm, xem §5 |

---

## 5. Việc còn dở và người phụ trách

| Người | Việc | Đầu ra | Hạn |
|---|---|---|---|
| **Tài** | Đối chiếu ma trận giá T2: 6 bậc cân nặng × 2 loài × 3 dịch vụ; ghi nhận mọi ô lệch | `reports/raw/survey-T2-matrix.csv` | Ngày 2 |
| **Ngân** | Đối chiếu giá T3 API ↔ trang đặt lịch: 8 dịch vụ chính, giá + thời lượng | `reports/raw/survey-T3-ui-prices.csv` | Ngày 2 |
| **Lộc** | Rà lại bản vá SRS v1.1; chuẩn bị đề xuất cách xử lý P1 cho Inspection | Biên bản Inspection | Ngày 3 |
| **Mạnh** | Cập nhật `FR-M3-02` + bổ sung test case đối chiếu ma trận giá sau khi Tài/Ngân trả kết quả | `docs/testcases/*.csv` | Ngày 2–3 |
| **Nhóm** | Quyết định CHG-2026-11-14-02 (P1): lỗi site T2 hay tiêu chí SRS sai | Biên bản Inspection | Ngày 3 |

---

## 6. Rủi ro

| Rủi ro | Mức | Cách xử lý |
|---|---|---|
| Site đích đổi giá giữa kỳ → bảng tham chiếu lỗi thời | Trung bình | Bảng chụp tại thời điểm cụ thể; khi phát hiện thay đổi ghi vào `defects.csv` như điểm không nhất quán của site đích so với SRS (SRS §10.C), không sửa SRS ngay |
| T3 dùng nền tảng SaaS Groomore — URL có thể đổi cấu trúc | Thấp | Đã ghi endpoint vào REF-01; script khảo sát tái lập được |
| P1 chưa có phán quyết → `FR-M3-02` có 2 cách hiểu | Cao | Chặn ở Inspection Ngày 3 trước khi viết test case M3 của T2 |
| T2 và T3 chưa đối chiếu đủ ma trận → có thể còn ô lệch chưa phát hiện | Trung bình | Tài/Ngân hoàn thành trong Ngày 2 |
