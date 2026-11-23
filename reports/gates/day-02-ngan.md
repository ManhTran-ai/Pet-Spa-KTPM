# Báo cáo Ngày 2 — Ngân (TV3): đối chiếu giá T3 API ↔ giao diện

Ngày thực hiện: 2026-11-18 · Người thực hiện: **Ngân (TV3)** · Kế hoạch: `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` §5 (Ngày 2)

Giao việc theo `reports/gates/issue-ngan.md`: đối chiếu giá 8 dịch vụ chính của T3 giữa API `booking-api/v1/service` và trang đặt lịch công khai, ghi kết quả vào `reports/raw/survey-T3-ui-prices.csv`.

---

## 1. Lệnh đã chạy và kết quả thật

| # | Lệnh | Kết quả | Mã |
|---|---|---|---|
| 1 | `node scripts/survey-t3-ui-prices.mjs` | `survey-T3-ui-prices.csv`: **41 dòng** — 41 dịch vụ UI khớp 41 dịch vụ API, **41/41 khớp cả giá lẫn thời lượng** | 0 |
| 2 | `node scripts/survey-t3-weight-bands.mjs` | `survey-T3-weight-bands.csv`: 17 dòng — **1/4 dòng sản phẩm lệch** (`Cat Bath`) | 0 |
| 3 | `node scripts/survey-t3-status-timezone.mjs` | `survey-T3-status-timezone.csv`: 8 dòng — **6/8 múi giờ hiển thị sai trạng thái** | 0 |

## 2. Câu trả lời cho 3 câu hỏi trong `issue-ngan.md`

### Câu 1 — Cả 8 dịch vụ đã khớp API ↔ UI chưa?

**Đã khớp — và khớp cả 41/41 dịch vụ, không riêng 8 dịch vụ chính.**

| Dịch vụ | API (cent) | API (phút) | UI giá | UI thời lượng | Khớp |
|---|---|---|---|---|---|
| Dog Bath 0-20lbs | 5200 | 30 | $52.00 | 30mins | ✅ |
| Dog Bath 20-50lbs | 6500 | 30 | $65.00 | 30mins | ✅ |
| Dog Bath short hair over 50lbs | 7200 | 60 | $72.00 | 1h | ✅ |
| Dog bath medium/long hair over 50lbs | 7900 | 60 | $79.00 | 1h | ✅ |
| Dog Full Groom 0-20 lbs | 6900 | 60 | $69.00 | 1h | ✅ |
| Dog Full Groom 91-100+ pounds | 17500 | 120 | $175.00 | 2h | ✅ |
| Cat Bath | 6000 | 30 | $60.00 | 30mins | ✅ |
| Cat Bath and shave down, or lion cut | 11000 | 90 | $110.00 | 1h 30mins | ✅ |

Ngoài 8 dịch vụ chính, em đối chiếu **toàn bộ 41 dịch vụ** trong 5 nhóm và không phát hiện sai lệch nào. Không có dịch vụ nào có trong API mà không hiện trên UI, và ngược lại.

**Định dạng khác nhau cần lưu ý khi viết test tích hợp (Ngày 10):**
- API tính giá bằng **cent** (`5200` = $52.00), UI hiển thị `$52.00`.
- API tính thời lượng bằng **phút** (`90`), UI hiển thị `1h 30mins` — phải chuẩn hoá về phút trước khi so sánh (cùng loại vấn đề P3 mà Tài gặp ở T2).

### Câu 2 — `BR-03` đã viết lại theo từng dòng sản phẩm, có đúng với thực tế không?

**3/4 dòng đúng, 1 dòng sai.** Bằng chứng: `reports/raw/survey-T3-weight-bands.csv`.

| Dòng sản phẩm | BR-03 v1.1 khai | Danh mục thật | Kết quả |
|---|---|---|---|
| Dog Bath | 0-20 / 20-50 / over 50 | 4 dịch vụ (over 50 chia theo độ dài lông: short hair / medium-long hair) | ✅ |
| Dog Bath and tidy up | 0-20 / 21-40 / 41-60 / 61-79 / 79+ | 5 dịch vụ | ✅ |
| Dog Full Groom | 0-20 / 21-30 / 31-40 / 41-60 / 61-78 / 79-90 / 91-100+ | 7 dịch vụ | ✅ |
| **Cat Bath** | **0-20 / 21-40 / 41-60 / 61-79 / 79+** | **chỉ 1 dịch vụ `Cat Bath` ($60.00, 30 phút), không mã hoá ngưỡng nào** | ❌ |

**→ Ghi DEF-024.** Mâu thuẫn này là giữa *đặc tả SRS-01 v1.1* và *hành vi quan sát được của site*, nên em mở CR để nhóm phán quyết tại Inspection Ngày 3, không tự sửa SRS.

Bổ sung phát hiện liên quan: 3 dịch vụ Mèo còn lại (`Cat Bath and trim`, `Cat Bath and shave down, or lion cut`, `Cat bath and full body hair cut`) cũng **không mang ngưỡng cân nặng trong tên**, nghĩa là BR-03 chưa mô tả dòng sản phẩm Mèo nào. Đặc tả cần ghi rõ: T3 chỉ chia nhóm cân nặng cho dòng **Chó**, dòng **Mèo** dùng giá cố định theo loại dịch vụ.

### Câu 3 — Có dịch vụ nào trong API không hiển thị trên UI (hoặc ngược lại) không?

**Không.** 41 ↔ 41, khớp hoàn toàn về tên, giá và thời lượng.

## 3. Hai khoản phụ thu (việc phụ trong `issue-ngan.md`)

| Dịch vụ | API | UI | Hiển thị trên UI? |
|---|---|---|---|
| `*HOLIDAY FEE*` | $27.00 | $27.00 | ✅ Có, ở nhóm `EMERGENCY APPOINTMENT` |
| `Emergency appointment fee *WAIT LIST ONLY*` | $25.00 | $25.00 | ✅ Có, ở nhóm `EMERGENCY APPOINTMENT` |

Cả hai đã được SRS-01 v1.1 ghi ở `BR-17`. Tuy nhiên tên hiển thị trên UI **không có dấu `$` phân cách phần mô tả** và thời lượng hiển thị là `0mins` — về mặt hành vi đúng (đây là khoản phụ thu, không phải dịch vụ có thời lượng), nhưng UI hiển thị `0mins` cho khách có th gây nhầm lẫn. Ghi nhận quan sát, chưa mở defect riêng.

## 4. Việc phụ: giờ mở cửa và trạng thái Open/Closed

Em điều tra thêm vì `FR-M5-07` và `FR-M5-06` cần dữ liệu này. Kết quả từ endpoint `GET /booking-api/v1/book-online-setting`:

| Trường | Giá trị |
|---|---|
| `timezone_name` | `America/New_York` |
| `weight_unit` | `Lb` (xác nhận đơn vị nhập là **lbs**) |
| `working_hour` | Cả 7 ngày trong tuần, `start = 480`, `end = 1200` (tức 08:00–20:00), không có giờ nghỉ |
| `currency_symbol` | `$` |

**Việc phụ (không bắt buộc) của `issue-ngan.md` — giờ mở cửa theo từng ngày và trạng thái Open/Closed:** đã ghi nhận đầy đủ ở mục 4.1.

### 4.1 Phát hiện: trạng thái Open/Closed tính theo múi giờ TRÌNH DUYỆT, không theo múi giờ của tiệm

Em chạy cùng một URL với 8 múi giờ khác nhau, lúc đó giờ tại tiệm (New York) là **03:28 — ngoài giờ mở cửa 08:00–20:00**. Bằng chứng: `reports/raw/survey-T3-status-timezone.csv`.

| Múi giờ trình duyệt | Giờ trình duyệt | Giờ tiệm (New York) | UI hiển thị | Đúng? |
|---|---|---|---|---|
| America/New_York | 03:27 | 03:27 | Closed | ✅ |
| America/Los_Angeles | 00:27 | 03:27 | Closed | ✅ |
| Europe/London | 08:27 | 03:27 | **Open** | ❌ |
| Asia/Ho_Chi_Minh | 15:28 | 03:28 | **Open** | ❌ |
| Asia/Singapore | 16:28 | 03:28 | **Open** | ❌ |
| Asia/Tokyo | 17:28 | 03:28 | **Open** | ❌ |
| Australia/Sydney | 19:28 | 03:28 | **Open** | ❌ |
| UTC | 08:29 | 03:29 | **Open** | ❌ |

**6/8 múi giờ sai.** Trạng thái đổi theo giờ địa phương của trình duyệt, trong khi `book-online-setting` khai báo `timezone_name = America/New_York` và `working_hour` là 08:00–20:00.

**Tác động thực tế:** khách ở múi giờ Việt Nam (UTC+7) vào lúc 15:28 chiều theo giờ của họ sẽ thấy tiệm "Open", trong khi tiệm ở New Jersey đã đóng từ 20:00 hôm trước. Đây là lỗi hiển thị thông tin sai về trạng thái hoạt động — vi phạm tiêu chí chấp nhận của `FR-M5-07`.

**→ Ghi DEF-022** (mức High, vì khách dựa vào trạng thái này để quyết định có đặt lịch hôm nay hay không).

Kèm theo, em quan sát thêm: trạng thái **không** xuất hiện cùng lúc với khung giờ mở cửa — vùng trạng thái trống rồi mới điền vào sau khoảng **4 giây** (do render bất đồng bộ sau khi gọi API cấu hình). **→ Ghi DEF-023** (mức Medium).

> **Lưu ý cho test script:** vì trạng thái render bất đồng bộ, `TC-T3-M5-005` phải chờ tới khi trạng thái xuất hiện (tối đa 20 giây) thay vì đọc ngay khi Drawer hiện. Em sẽ sửa spec ở Ngày 4–5.

## 5. Trả lời CR-13 (đơn vị nhập cân nặng của T3)

`book-online-setting` trả `weight_unit = "Lb"` → T3 dùng **lbs**. CR-13 trong `docs/change-requests.md` được trả lời: BVA cho T3 viết theo lbs.

## 6. Kết luận

| Câu hỏi | Kết luận |
|---|---|
| Giá T3 API ↔ UI | ✅ Khớp 41/41, không có sai lệch |
| `BR-03` đúng với thực tế? | ⚠️ 3/4 dòng đúng; `Cat Bath` sai → DEF-024 + mở CR |
| Dịch vụ lệch giữa API và UI? | ✅ Không có |
| Trạng thái Open/Closed | ❌ Sai theo múi giờ trình duyệt → DEF-022, DEF-023 |
| Đơn vị cân nặng | ✅ lbs (CR-13) |

**Việc còn dở:** chờ nhóm phán quyết CR về `BR-03` / `Cat Bath` tại Inspection Ngày 3. Em chưa sửa SRS-01 (đặc tả thuộc phạm vi chỉnh sửa của Mạnh/Lộc).
