# Bảng giá tham chiếu — Baseline Ngày 2 (2026-11-14)

Mã tài liệu: REF-01 · Người lập: Mạnh (TV1) · Nguồn: khảo sát trực tiếp 3 site đích

Bản máy đọc được: `docs/reference/pricing-baseline.csv` (213 dòng: T1 = 84, T2 = 88, T3 = 41).

> **Vì sao cần bảng này.** Đây là *test basis* cho kiểm thử tích hợp (Ngày 10): so sánh giá mà hệ thống **tính ra** với giá mà hệ thống **công bố**. Bảng được chụp lại tại một thời điểm cụ thể — nếu site đích đổi giá trong kỳ kiểm thử thì đó là **kết quả kiểm thử**, không phải lỗi của nhóm (SRS-01 §2.6).

## 1. Cách lấy bằng chứng

| Site | Cách lấy | Bằng chứng |
|---|---|---|
| T1 Pet NGON | Đọc thẻ `<table>` trong HTML render sẵn | `reports/raw/survey-T1.html` |
| T2 Mật Pet | Đọc 3 thẻ `<table>` sau khi trang hydrate | `reports/raw/survey-T2-text.txt` |
| T3 Pretty Paws | Gọi endpoint JSON công khai `GET /booking-api/v1/service?booking_page=1` | `reports/raw/survey-T3-services.json` |

Lệnh tái lập: `node scripts/survey-pricing.mjs`, `node scripts/survey-t2-tables.mjs`, `node scripts/survey-t3-services.mjs`.

## 2. T1 — Pet NGON (VND)

6 gói × 7 bậc cân nặng chó + 7 bậc mèo. Bảng có 16 dòng dữ liệu (2 dòng tiêu đề loài).

| Loài & cân nặng | Tắm | Cắt tỉa lông | Cạo lông | Combo Tắm+Vệ sinh | Combo Tắm+Cắt tỉa | Combo Tắm+Cạo |
|---|---|---|---|---|---|---|
| Chó mini `< 3kg` | 88.000 | 145.000 | 88.000 | 130.000 | 240.000 | 185.000 |
| Chó nhỏ `3–5kg` | 155.000 | 165.000 | 110.000 | 265.000 | 405.000 | 350.000 |
| Chó vừa `5–10kg` | 240.000 | 220.000 | 165.000 | 375.000 | 515.000 | 460.000 |
| Chó lớn `10–15kg` | 350.000 | 275.000 | 220.000 | 460.000 | 605.000 | 550.000 |
| Chó rất lớn `15–20kg` | 460.000 | 330.000 | 275.000 | 550.000 | 660.000 | 605.000 |
| Chó đại `20–25kg` | 570.000 | 385.000 | 330.000 | 640.000 | 750.000 | 695.000 |
| Chó siêu đại `25–30kg` | 660.000 | 440.000 | 385.000 | 725.000 | 835.000 | 780.000 |
| Mèo mini `≤ 3kg` | 110.000 | 160.000 | 110.000 | 155.000 | 240.000 | 210.000 |
| Mèo nhỏ `3–5kg` | 165.000 | 275.000 | 165.000 | 275.000 | 415.000 | 365.000 |
| Mèo vừa `5–10kg` | 275.000 | 370.000 | 220.000 | 405.000 | 565.000 | 495.000 |
| Mèo lớn `10–15kg` | 385.000 | 440.000 | 275.000 | 495.000 | 665.000 | 585.000 |
| Mèo rất lớn `15–20kg` | 460.000 | 455.000 | 330.000 | 550.000 | 690.000 | 605.000 |
| Mèo đại `20–25kg` | 570.000 | 520.000 | 385.000 | 640.000 | 795.000 | 695.000 |
| Mèo siêu đại `25–30kg` | 660.000 | 585.000 | 440.000 | 725.000 | 890.000 | 780.000 |

Đơn vị: VND. Nguồn: `reports/raw/survey-T1.html`.

**Quan sát phục vụ thiết kế BVA:** giá **luôn tăng đơn điệu** theo bậc cân nặng trong cùng một cột — đây là bất biến có thể dùng làm oracle cho kiểm thử tích hợp (mọi ô đều phải ≥ ô trên nó).

## 3. T2 — Mật Pet Family (VND)

### 3.1 Grooming — 4 combo + 6 dịch vụ lẻ × 7 bậc

| Dịch vụ | `<3kg` | `>3–6kg` | `>6–10kg` | `>10–20kg` | `>20–30kg` | `>30–40kg` | `>40kg` |
|---|---|---|---|---|---|---|---|
| Combo Tắm Vệ Sinh | 120k | 200k | 300k | 400k | 500k | 600k | 700k |
| Combo Tắm Cạo | 200k | 250k | 350k | 450k | 600k | 700k | 800k |
| Combo Tắm Cắt | 300k | 350k | 400k | 550k | 700k | 800k | 1tr |
| Combo Tắm Cắt Tạo Hình | 350k | 400k | 500k | 650k | 800k | 1tr | 1,2tr |
| Cắt dũa + Móng | 30k | 30k | 50k | 50k | 70k | 70k | 70k |
| Vệ sinh tai | 30k | 30k | 50k | 50k | 70k | 70k | 70k |
| Cạo bụng + Bàn + Hậu môn | 30k | 30k | 50k | 50k | 70k | 70k | 70k |
| Tắm sấy | 100k | 150k | 250k | 350k | 450k | 550k | 650k |
| Cạo lông | 150k | 200k | 300k | 400k | 500k | 600k | 700k |
| Cắt lông | 200k | 300k | 400k | 500k | 650k | 750k | 900k |

### 3.2 Nhuộm — 3 dịch vụ × 4 bậc

| Dịch vụ | `<6kg` | `>6–15kg` | `>15–30kg` | `>30kg` |
|---|---|---|---|---|
| Nhuộm 2 tai + đuôi | 250k | 300k | 350k | 400k |
| Nhuộm 4 chân | 250k | 300k | 350k | 400k |
| Nhuộm hình nhỏ | 300k | 350k | 400k | 500k |

### 3.3 Báo giá riêng — 6 dịch vụ

| Dịch vụ | Khoảng giá |
|---|---|
| Gỡ rối · Tẩy ố · Tắm trắng · Xả dưỡng | 50.000–500.000đ theo tình trạng lông |
| Nhuộm hình lớn | tuỳ kích thước & màu |
| Nhuộm tạo hình cơ thể | tuỳ thiết kế riêng |

### 3.4 Phát hiện cần xử lý tại Inspection (Ngày 3)

**P1 — Giá Chó và Mèo không khác nhau.** Đo trực tiếp trên calculator của T2 (bằng chứng: `reports/raw/survey-T2-dog-vs-cat.json`):

| Bậc cân nặng | Chó — Combo Tắm Vệ Sinh | Mèo — Combo Tắm Vệ Sinh |
|---|---|---|
| `>3–6kg` | 200.000đ | 200.000đ |
| `>6–10kg` | 300.000đ | 300.000đ |

Tiêu chí chấp nhận của `FR-M3-02` trong SRS-01 v1.0 yêu cầu *"cùng bậc cân nặng nhưng Mèo → giá khác"*. Hai khả năng: (a) site T2 có lỗi — không phân biệt giá theo loài, hoặc (b) bảng giá tĩnh của T2 **không tách loài** và tiêu chí SRS là suy luận sai. Bằng chứng tĩnh (§3.1) cho thấy bảng chỉ có một bảng dùng chung cho Chó và Mèo — nghiêng về (b). Chưa kết luận; cần xác nhận của nhóm và đưa vào biên bản Inspection.

**P2 — Bảng giá tĩnh không tách Chó/Mèo** nhưng SRS mục 3.2 ghi *"Bảng giá tham khảo: Chó & mèo 7 bậc cân nặng × 10 dịch vụ grooming + 4 dịch vụ nhuộm"*. Thực tế: **6** dịch vụ lẻ (không phải 10 — 10 là tổng 4 combo + 6 lẻ) và **3** dịch vụ nhuộm (không phải 4). Cần sửa mục 3.2 SRS-01.

**P3 — Bảng giá tĩnh dùng ký hiệu rút gọn** (`120k`, `1tr`, `1,2tr`) trong khi calculator hiển thị định dạng đầy đủ (`~200.000đ`). Test tích hợp phải chuẩn hoá trước khi so sánh.

## 4. T3 — Pretty Paws (USD)

Lấy từ endpoint JSON công khai `GET /booking-api/v1/service?booking_page=1`. API trả giá **tính bằng cent** (5200 = $52.00) và **thời lượng tính bằng phút**. Toàn bộ 41 dịch vụ nằm trong 5 nhóm:

| Nhóm | Số dịch vụ | Khoảng giá |
|---|---|---|
| EMERGENCY APPOINTMENT | 2 | $25 (khẩn cấp, wait-list) · $27 (phí ngày lễ) |
| Dog (bath included) | 16 | $52 – $175 |
| Cat (bath included) | 4 | $60 – $125 |
| QUICK SERVICE (no bath) | 12 | $10 – $29 |
| ADD ON TO GROOM | 7 | $8 – $25 |

Các mốc giá chính:

| Dịch vụ | Giá | Thời lượng |
|---|---|---|
| Dog Bath 0-20lbs | $52.00 | 30 phút |
| Dog Bath 20-50lbs | $65.00 | 30 phút |
| Dog Bath short hair over 50lbs | $72.00 | 60 phút |
| Dog bath medium/long hair over 50lbs | $79.00 | 60 phút |
| Dog Full Groom 0-20 lbs | $69.00 | 60 phút |
| Dog Full groom 21-30lbs | $77.00 | 60 phút |
| Dog Full Groom 31-40lbs | $86.00 | 60 phút |
| Dog Full Groom 41-60lbs | $102.00 | 60 phút |
| Dog Full groom 61-78lbs | $121.00 | 90 phút |
| Dog Full groom 79-90lbs | $136.00 | 120 phút |
| Dog Full Groom 91-100+ pounds | $175.00 | 120 phút |
| Cat Bath | $60.00 | 30 phút |
| Cat Bath and trim | $80.00 | 30 phút |
| Cat Bath and shave down, or lion cut | $110.00 | 90 phút |
| Cat bath and full body hair cut | $125.00 | 90 phút |

### 4.1 Phát hiện cần xử lý tại Inspection

**P4 — Nhóm cân nặng của T3 không phải 6 nhóm cố định.** SRS-01 `BR-03` ghi `20–50`, `31–40`, `41–60`, `61–78`, `79–90`, `91–100+`. Thực tế mỗi *dòng sản phẩm* có bộ ngưỡng riêng: `Dog Bath` dùng `0-20 / 20-50 / over 50` (chia theo độ dài lông), `Dog Bath and tidy up` dùng `0-20 / 21-40 / 41-60 / 61-79 / 79+`, `Dog Full Groom` dùng `0-20 / 21-30 / 31-40 / 41-60 / 61-78 / 79-90 / 91-100+`. `BR-03` cần viết lại thành *ngưỡng theo từng dòng sản phẩm*.

**P5 — "Phí lễ tân $52 (30 phút)" trong SRS mục 3.3 không tồn tại trong danh mục.** Không có dịch vụ nào tên "reception/front desk" trong API; `$52` thực chất là giá của *Dog Bath 0-20lbs*. `BR-12` cần sửa hoặc gỡ.

**P6 — Có thêm 2 dịch vụ phụ thu mà SRS chưa nêu**: `*HOLIDAY FEE*` ($27) và `Emergency appointment fee *WAIT LIST ONLY*` ($25). Cần đưa vào bảng dữ liệu §7.

## 5. Bảng tổng hợp mô hình giá (đối chiếu 3 site)

| Tiêu chí | T1 | T2 | T3 |
|---|---|---|---|
| Đơn vị cân nặng | kg | kg | lbs |
| Số nhóm cân nặng | 7 chó + 7 mèo | 7 | Theo từng dòng sản phẩm (3–7) |
| Nhập cân nặng chính xác | Không | Không | Không |
| Tính giá tức thì | Không | **Có** (calculator 3 bước) | Có (trang lịch Groomore) |
| Dịch vụ lẻ | Không | Có (6 loại) | Có |
| Combo | Có (3 combo) | Có (4 combo) | Không |
| Dịch vụ tận nhà | Có | Không | Không |
| Phụ thu biến thiên | Phụ thu km | Không | Phí ngày lễ / khẩn cấp |
| Phân biệt giá Chó/Mèo | **Có** (bảng tách loài) | **Không** (cùng giá) | **Có** (nhóm dịch vụ riêng) |
| Ngôn ngữ | Việt/Anh | Việt/Anh | Anh |

**Kết luận đối chiếu (cho Lộc, Ngày 10):** cùng một bộ dữ liệu đầu vào (loài + cân nặng + dịch vụ) cho **ba kết luận khác nhau** về giá — vì ba hệ thống dùng ba mô hình giá khác nhau. Đây là kết luận cần ghi vào `reports/integration-report.md`, không phải lỗi.

## 6. Việc dành cho từng thành viên (Ngày 2)

| Người | Việc | Đầu ra | Xác minh |
|---|---|---|---|
| **Tài** | Đối chiếu bảng T2 với calculator: dùng 6 bậc cân nặng × 2 loài × 3 dịch vụ, ghi nhận mọi ô lệch | `reports/raw/survey-T2-matrix.csv` | Mọi giá tính tức thì khớp bảng tĩnh, hoặc có defect kèm bằng chứng |
| **Ngân** | Đối chiếu bảng T3 API với trang đặt lịch công khai: 8 dịch vụ chính, giá + thời lượng | `reports/raw/survey-T3-ui-prices.csv` | Giá hiển thị khớp API cho cả 8 dịch vụ |
| **Lộc** | Viết lại `BR-03`, `BR-12` và mục 3.2/3.3 của SRS-01 theo phát hiện P2, P4, P5; đề xuất cách xử lý P1 | Bản vá SRS-01 v1.1 (nộp trước hết Ngày 3) | `npm run req:check` vẫn 0 vi phạm |
| **Mạnh** | Cập nhật `FR-M3-02` và bổ sung test case đối chiếu ma trận giá | `docs/testcases/*.csv` | `npm run rtm:check` vẫn 0 vi phạm |

> **Lưu ý về ranh giới an toàn (ADR-11).** Không chọn "đặt lịch" / "Book Now" ở T3, không bấm nút gửi cuối cùng ở T1/T2. Chỉ chọn lựa chọn và đọc giá.
