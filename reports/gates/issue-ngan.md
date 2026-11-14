## Người nhận: Ngân (TV3)

**Ngày 2 — Đối chiếu giá T3 Pretty Paws (API ↔ giao diện)**

### Bối cảnh

T3 chạy trên nền tảng SaaS **Groomore**. Danh mục dịch vụ **không nằm trong HTML** — nó nằm trong endpoint JSON công khai:

```
GET https://prettypawscatanddoggrooming.groomore.com/booking-api/v1/service?booking_page=1
```

Đã tải về: `reports/raw/survey-T3-services.json` — **41 dịch vụ trong 5 nhóm**. API trả giá tính bằng **cent** (5200 = $52.00) và thời lượng tính bằng **phút**.

Bảng giá tĩnh đã chốt: `docs/reference/pricing-baseline.md` §4 (và `docs/reference/pricing-baseline.csv`, dòng `System = T3`).

### Việc cần làm

1. Mở trang đặt lịch công khai của T3 và xác nhận **giá hiển thị trên giao diện** khớp giá trong API cho **8 dịch vụ chính**:

| Dịch vụ | API | Giá | Thời lượng |
|---|---|---|---|
| Dog Bath 0-20lbs | 5200 | $52.00 | 30 phút |
| Dog Bath 20-50lbs | 6500 | $65.00 | 30 phút |
| Dog Bath short hair over 50lbs | 7200 | $72.00 | 60 phút |
| Dog bath medium/long hair over 50lbs | 7900 | $79.00 | 60 phút |
| Dog Full Groom 0-20 lbs | 6900 | $69.00 | 60 phút |
| Dog Full Groom 91-100+ pounds | 17500 | $175.00 | 120 phút |
| Cat Bath | 6000 | $60.00 | 30 phút |
| Cat Bath and shave down, or lion cut | 11000 | $110.00 | 90 phút |

2. Ghi kết quả vào `reports/raw/survey-T3-ui-prices.csv`.
3. Bổ sung 2 dịch vụ phụ thu mới phát hiện (chưa có trong SRS cũ): `*HOLIDAY FEE*` ($27) và `Emergency appointment fee *WAIT LIST ONLY*` ($25) — xác nhận chúng có hiển thị trên UI không.

### Định dạng file kết quả

```
Service,API Price (cents),API Duration (min),UI Price,UI Duration,Match,Note
Dog Bath 0-20lbs,5200,30,52.00,30,YES,
```

### Việc phụ (không bắt buộc trong Ngày 2)

Ghi lại những gì bạn quan sát được về **giờ mở cửa theo từng ngày** (T3 mở 08:00–20:00 cả 7 ngày) và **trạng thái Open/Closed** — cần cho `FR-M5-06`, `FR-M5-07`, `FR-M4-11`.

### Ranh giới an toàn (ADR-11)

**Không** bấm "Book Now" và **không** hoàn tất đặt lịch. Chỉ xem danh mục và giá.

### Kiểm tra trước khi commit

```powershell
npm run lint
npm run typecheck
npm run gate
```

### Tài liệu

- `docs/ASSIGNMENT.md` §3.3 (phân công của bạn), §4, §5
- `docs/reference/pricing-baseline.md` §4
- `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` §3.3, §6 (BR-03, BR-12, BR-13, BR-17), §7

### Câu hỏi cần trả lời trong báo cáo

1. Cả 8 dịch vụ đã khớp API ↔ UI chưa?
2. `BR-03` đã viết lại theo từng dòng sản phẩm — có đúng với thực tế không?
3. Có dịch vụ nào trong API **không** hiển thị trên UI (hoặc ngược lại) không?
