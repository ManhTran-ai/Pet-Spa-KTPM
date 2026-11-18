# Thiết kế test — T3 Pretty Paws và T2 Mật Pet Family

Mã tài liệu: TSD-01 · Người lập: **Ngân (TV3)** · Ngày: 2026-11-18 · Kế hoạch: `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` §5 (Ngày 4)

Test basis: SRS-01 v1.1 (`docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md`) · REF-01 (`docs/reference/pricing-baseline.md`) · Cẩm nang môn học §4 (EP, BVA, DT, ST, UC).

Phạm vi tài liệu này: **Ngân phụ trách thiết kế test cho T3 (chính) và T2 (đối chiếu)**. Phần NFR-01/NFR-05 của Ngân nằm ở §4.

---

## 0. Nguyên tắc thiết kế

| Nguyên tắc | Áp dụng |
|---|---|
| Viết test từ **đặc tả yêu cầu đích**, không từ kết quả chạy thử | Mọi kỳ vọng trong tài liệu này truy về tiêu chí chấp nhận của SRS-01, không truy về hành vi quan sát được |
| Mỗi giá trị không hợp lệ một ca riêng | Tránh defect masking (Cẩm nang §4) |
| Test theo vai trò/nhãn, không theo CSS path | Site đích có thể đổi giao diện giữa kỳ |
| Chỉ đọc, không tạo lịch thật | ADR-11 |
| Mỗi ca kiểm thử phải đủ 4C | `docs/ASSIGNMENT.md` §4 |

---

## 1. T3 Pretty Paws — bảng quyết định

### 1.1 DT-01 — Chọn dịch vụ và hiển thị giá theo nhóm cân nặng (`FR-M3-02`)

T3 dùng mô hình "chọn dịch vụ theo dòng sản phẩm"; mỗi dòng sản phẩm có bộ ngưỡng cân nặng riêng (BR-03). Điều kiện quyết định: dòng sản phẩm (C1) và nhóm cân nặng (C2).

| # | C1 Dòng sản phẩm | C2 Nhóm cân nặng | Hành động mong đợi | Test case |
|---|---|---|---|---|
| 1 | Dog Bath | 0-20 lbs | Giá $52.00, 30 phút | TC-T3-M3-002 |
| 2 | Dog Bath | 20-50 lbs | Giá $65.00, 30 phút | TC-T3-M3-002 |
| 3 | Dog Bath | over 50 lbs, lông ngắn | Giá $72.00, 60 phút | TC-T3-M3-002 |
| 4 | Dog Bath | over 50 lbs, lông dài trung bình | Giá $79.00, 60 phút | TC-T3-M3-002 |
| 5 | Dog Bath and tidy up | 0-20 lbs | Giá $62.00, 30 phút | TC-T3-M3-002 |
| 6 | Dog Bath and tidy up | 21-40 lbs | Giá $72.00, 60 phút | TC-T3-M3-002 |
| 7 | Dog Bath and tidy up | 41-60 lbs | Giá $91.00, 60 phút | TC-T3-M3-002 |
| 8 | Dog Bath and tidy up | 61-79 lbs | Giá $99.00, 60 phút | TC-T3-M3-002 |
| 9 | Dog Bath and tidy up | 79+ lbs | Giá $118.00, 60 phút | TC-T3-M3-002 |
| 10 | Dog Full Groom | 0-20 lbs | Giá $69.00, 60 phút | TC-T3-M3-002 |
| 11 | Dog Full Groom | 21-30 lbs | Giá $77.00, 60 phút | TC-T3-M3-002 |
| 12 | Dog Full Groom | 31-40 lbs | Giá $86.00, 60 phút | TC-T3-M3-002 |
| 13 | Dog Full Groom | 41-60 lbs | Giá $102.00, 60 phút | TC-T3-M3-002 |
| 14 | Dog Full Groom | 61-78 lbs | Giá $121.00, 90 phút | TC-T3-M3-002 |
| 15 | Dog Full Groom | 79-90 lbs | Giá $136.00, 120 phút | TC-T3-M3-002 |
| 16 | Dog Full Groom | 91-100+ lbs | Giá $175.00, 120 phút | TC-T3-M3-002 |
| 17 | Cat Bath | *(không chia nhóm)* | Giá $60.00, 30 phút | TC-T3-M3-003 |

**Quy tắc chuyển trạng thái đi kèm (oracle cho kiểm thử tích hợp):** giá của T3 **tăng đơn điệu** theo nhóm cân nặng trong cùng một dòng sản phẩm — giá ở nhóm cao hơn không bao giờ nhỏ hơn giá ở nhóm thấp hơn ngay bên trên. Đây là bất biến dùng để kiểm tra toàn bộ danh mục mà không cần liệt kê từng ô (tương tự BR-18 của T1).

### 1.2 DT-02 — Trạng thái mở/đóng của tiệm (`FR-M5-07`, `FR-M5-06`)

T3 khai `timezone_name = America/New_York` và `working_hour = 480–1200` (08:00–20:00) cho cả 7 ngày. Điều kiện: múi giờ hiển thị (C1) và giờ tại tiệm (C2).

| # | C1 Múi giờ trình duyệt | C2 Giờ tại tiệm (New York) | Hành động mong đợi | Test case |
|---|---|---|---|---|
| 1 | America/New_York | 03:00 (ngoài giờ mở) | Hiển thị "Closed" | TC-T3-M5-005 |
| 2 | America/New_York | 12:00 (trong giờ mở) | Hiển thị "Open" | TC-T3-M5-005 |
| 3 | Asia/Ho_Chi_Minh | 03:00 (ngoài giờ mở) | Hiển thị "Closed" | TC-T3-M5-005 |
| 4 | Asia/Ho_Chi_Minh | 23:00 (ngoài giờ mở) | Hiển thị "Closed" | TC-T3-M5-005 |
| 5 | Asia/Tokyo | 03:00 (ngoài giờ mở) | Hiển thị "Closed" | TC-T3-M5-005 |
| 6 | UTC | 12:00 (trong giờ mở) | Hiển thị "Open" | TC-T3-M5-005 |
| 7 | Pacific/Auckland | 03:00 (ngoài giờ mở) | Hiển thị "Closed" | TC-T3-M5-005 |
| 8 | Asia/Ho_Chi_Minh | 12:00 (trong giờ mở) | Hiển thị "Open" | TC-T3-M5-005 |

**Ràng buộc thời gian:** trạng thái render **bất đồng bộ** (~4 giây sau khi Drawer hiện). Test phải chờ tới khi trạng thái xuất hiện (tối đa 20 giây), không được đọc ngay khi Drawer hiện — nếu không sẽ báo Fail sai nguyên nhân (xem DEF-023).

### 1.3 DT-03 — Khả năng đặt lịch không cần tài khoản (`FR-M4-12`)

| # | C1 Khách | C2 Hành động | Hành động mong đợi | Test case |
|---|---|---|---|---|
| 1 | Khách mới | Mở luồng đặt lịch | Có hướng dẫn, không bắt tạo tài khoản | TC-T3-M4-009 |
| 2 | Khách mới | Nhập SĐT | Nút tiếp tục bật khi ô có dữ liệu, không yêu cầu đăng ký | TC-T3-M4-009 |
| 3 | Khách cũ | Đăng nhập | Có lựa chọn đăng nhập | TC-T3-M4-009 |

### 1.4 DT-04 — Số điện thoại hợp lệ (`FR-M4-03`, `FR-M4-02`)

| # | C1 Nội dung ô SĐT | C2 Độ dài | Hành động mong đợi | Test case |
|---|---|---|---|---|
| 1 | Rỗng | 0 | Nút gửi bị khoá, có thông báo nêu trường | TC-T3-M4-002 |
| 2 | Chứa chữ cái | ≥ 1 | Bị từ chối hoặc cảnh báo | TC-T3-M4-003 |
| 3 | Quá ngắn | 1–5 | Bị từ chối hoặc cảnh báo | TC-T3-M4-004 |
| 4 | Hợp lệ | 10 | Nút gửi được bật | TC-T3-M4-005 |
| 5 | Quá dài | > 15 | Bị từ chối hoặc cảnh báo | TC-T3-M4-004 |

> **Lưu ý thiết kế:** tiêu chí chấp nhận của `FR-M4-03` yêu cầu "số không đủ độ dài bị từ chối **hoặc cảnh báo**". Vì vậy ca test kiểm tra **hành vi quan sát được** (nút gửi bị khoá hoặc có thông báo cảnh báo), không ép một hình thức cụ thể — tránh vi phạm nguyên tắc "không hạ tiêu chí để ép xanh".

---

## 2. T3 Pretty Paws — bảng chuyển trạng thái

### 2.1 ST-01 — Vòng đời luồng đặt lịch T3

Khác với wizard T1/T2 (nhiều bước trên cùng trang), T3 là ứng dụng trang đơn kiểu SaaS: danh mục dịch vụ nằm trong Drawer, luồng đặt lịch nằm ở trang lịch riêng.

| Trạng thái | Mô tả | Sự kiện | Chuyển sang |
|---|---|---|---|
| `T0` | Trang chủ, Drawer danh mục đóng | Mở Drawer | `T1` |
| `T1` | Drawer danh mục mở, hiện nhóm dịch vụ | Mở nhóm | `T2` |
| `T2` | Nhóm dịch vụ mở, hiện giá + thời lượng | Bấm "Book Now" | `T3` |
| `T3` | Drawer đặt lịch: chọn quốc gia + nhập SĐT | Nhập SĐT hợp lệ | `T4` |
| `T4` | Nút gửi được bật | Quay lại | `T3` |
| `T5` | Đã gửi (terminal) | — | — |

### 2.2 Bảng chuyển trạng thái (ST)

| Từ \ Sự kiện | Mở Drawer | Mở nhóm dịch vụ | Bấm "Book Now" | Nhập SĐT | Quay lại | Gửi |
|---|---|---|---|---|---|---|
| `T0` | → `T1` | ✗ | ✗ | ✗ | ✗ | ✗ |
| `T1` | — | → `T2` | → `T3` | ✗ | ✗ | ✗ |
| `T2` | — | → `T1` | → `T3` | ✗ | ✗ | ✗ |
| `T3` | — | — | — | → `T4` | — | ✗ (còn thiếu SĐT) |
| `T4` | — | — | — | — | → `T3` | → `T5` |
| `T5` (terminal) | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |

✗ = chuyển không hợp lệ, phải bị chặn.

**Chuyển tiếp hợp lệ cần kiểm chứng:** `T1 → T2`, `T2 → T1` (đóng/mở nhóm), `T2 → T3`, `T3 → T4`, `T4 → T3`, `T4 → T5`.
**Chuyển tiếp không hợp lệ cần kiểm chứng:** `T0 → T2` (mở nhóm khi Drawer chưa mở), `T3 → T5` (gửi khi chưa nhập SĐT), `T5 → *` (mọi hành động sau khi gửi).

> **Ràng buộc ADR-11:** trạng thái `T5` (đã gửi) **không được thực thi** — nhóm không bấm nút gửi cuối cùng. Ca test cho `T4 → T5` được viết ở dạng Manual và chỉ kiểm tra trạng thái nút, không thực thi gửi.

### 2.3 ST-02 — Vòng đời trạng thái mở/đóng của tiệm (T3)

| Trạng thái | Điều kiện | Hành vi mong đợi |
|---|---|---|
| `O` (Open) | Giờ tại tiệm trong 08:00–20:00 | Hiện "Open" |
| `C` (Closed) | Giờ tại tiệm ngoài 08:00–20:00 | Hiện "Closed" |
| `U` (Unrendered) | Chưa tải xong cấu hình (~4 giây) | Vùng trạng thái trống — **không phải** lỗi |

Chuyển tiếp hợp lệ: `U → O` hoặc `U → C` tùy thời điểm; `O ↔ C` khi giờ chạy qua 08:00 hoặc 20:00 giờ tiệm.
Chuyển tiếp không hợp lệ: `C → O` khi giờ tiệm vẫn ngoài khung giờ mở — đây chính là lỗi DEF-022.

---

## 3. T2 Mật Pet Family — thiết kế đối chiếu

Ngân phụ trách viết và chạy test cho T2 (theo `docs/ASSIGNMENT.md` §3.3). Thiết kế ở đây chỉ gồm phần **đối chiếu chéo** với Tài (người viết chính), tránh trùng lặp và đảm bảo độc lập.

### 3.1 DT-05 — Ma trận loài × bậc cân nặng × dịch vụ (`FR-M3-02`)

| | `<3kg` | `>3–6kg` | `>6–10kg` | `>10–20kg` | `>20–30kg` | `>30–40kg` | `>40kg` |
|---|---|---|---|---|---|---|---|
| Chó · Combo Tắm Vệ Sinh | 120k | 200k | 300k | 400k | 500k | 600k | 700k |
| Chó · Combo Tắm Cạo | 200k | 250k | 350k | 450k | 600k | 700k | 800k |
| Chó · Combo Tắm Cắt | 300k | 350k | 400k | 550k | 700k | 800k | 1tr |
| Mèo · Combo Tắm Vệ Sinh | *(chưa đo)* | *(chưa đo)* | *(chưa đo)* | *(chưa đo)* | *(chưa đo)* | *(chưa đo)* | *(chưa đo)* |

**Kỹ thuật kiểm thử:** EP (loài × dịch vụ) kết hợp BVA (bậc cân nặng).
**Oracle:** đối chiếu ô giá tính tức thì với bảng giá tĩnh trên cùng trang (`FR-M3-02` yêu cầu khớp).

**Bất biến dùng làm oracle:** giá của T2 **tăng đơn điệu** theo bậc cân nặng trong cùng một dòng dịch vụ (quan sát từ REF-01 §3.1). Bất biến này cho phép kiểm tra cả 7 bậc × 10 dịch vụ mà không cần liệt kê 70 ô.

**Điểm cần nhóm phán quyết (CHG-2026-11-14-02):** hàng Mèo. T2 công bố **một** bảng giá dùng chung cho Chó và Mèo — đo được ở `>3–6kg` (200.000đ) và `>6–10kg` (300.000đ) hai bậc cho cả hai loài. Trong khi CHG còn chờ nhóm, ca test `TC-T2-M3-003` được viết theo tiêu chí **hiện hành của SRS-01 v1.1**; nếu nhóm chốt theo hướng (b) thì ca này chuyển từ Fail sang Pass và phải cập nhật lại.

### 3.2 ST-03 — Vòng đời wizard T2 (đối chiếu)

SRS-01 §8.1 đã định nghĩa đầy đủ 6 trạng thái `S0..S5` cùng ma trận chuyển tiếp hợp lệ / không hợp lệ. Thiết kế của Ngân bổ sung các ca **chuyển tiếp không hợp lệ** mà SRS §8.1 nêu là phải bị chặn:

| Ca | Chuyển tiếp | Kỳ vọng | Test case |
|---|---|---|---|
| 1 | `S0 → S2` (bỏ qua bước chọn loài) | Bị chặn | TC-T2-M4-013 |
| 2 | `S1 → S3` (bỏ qua bước chọn cân nặng) | Bị chặn | TC-T2-M4-014 |
| 3 | `S3 → S5` (nhảy thẳng tới bước xác nhận) | Bị chặn | TC-T2-M4-015 |
| 4 | `S4 → S2` (quay lại rồi tiến tục) | Hợp lệ, giữ lựa chọn | TC-T2-M4-016 |
| 5 | `S4 → S0` (quay lại bước đầu, đổi lựa chọn) | Hợp lệ, cho đổi loài | TC-T2-M4-017 |

### 3.3 BVA — ngưỡng bậc cân nặng T2

Bảy ngưỡng: `<3` · `>3–6` · `>6–10` · `>10–20` · `>20–30` · `>30–40` · `>40`. Với mỗi ngưỡng lấy 3 giá trị (dưới biên, tại biên, trên biên) → **21 ca BVA**, ghi ở `docs/testcases/t2.csv` (`TC-T2-M3-012` … `TC-T2-M3-024`).

| Ngưỡng | Dưới biên | Tại biên | Trên biên |
|---|---|---|---|
| 3 kg | 2.9 kg | 3 kg | 3.1 kg |
| 6 kg | 5.9 kg | 6 kg | 6.1 kg |
| 10 kg | 9.9 kg | 10 kg | 10.1 kg |
| 20 kg | 19.9 kg | 20 kg | 20.1 kg |
| 30 kg | 29.9 kg | 30 kg | 30.1 kg |
| 40 kg | 39.9 kg | 40 kg | 40.1 kg |

---

## 4. NFR-01 Hiệu năng — thiết kế kịch bản đo

### 4.1 Kịch bản Lighthouse

| Tham số | Giá trị | Căn cứ |
|---|---|---|
| Preset | `mobile` | SRS-01 §9.1 (điểm Performance mobile) |
| Số lần chạy mỗi site | 3, lấy **trung vị** | SRS-01 §9.1 |
| Trang đo | Trang chủ (`/vi`, `/spa`, `/`) | `FR-M1-01` |
| Ngưỡng đạt | Performance ≥ 70 | NFR-01.1 |
| Chỉ số phụ | LCP, CLS, DOMContentLoaded | NFR-01 |

**Lưu ý về tính lặp lại:** Lighthouse trên site đích có biến thiên lớn giữa các lần chạy (đặc biệt T3 — LCP dao động hàng chục giây). Vì vậy:
- Luôn chạy đủ 3 lần và lấy trung vị, **không** lấy kết quả đơn lẻ.
- Ghi lại toàn bộ 3 giá trị thô vào `reports/raw/lighthouse-{T1|T2|T3}-{1,2,3}.json` để người đánh giá kiểm tra lại.
- Điểm Lighthouse phụ thuộc mạng và tải máy → khi Fail phải kiểm tra lại lần thứ 2–3 trước khi kết luận là lỗi sản phẩm (quy tắc trong `docs/ASSIGNMENT.md` §10).

### 4.2 Kịch bản k6 tải đọc (`TC-NFR-01-006`)

| Tham số | Giá trị | Căn cứ |
|---|---|---|
| Số VU | 10 (tối đa) | ADR-11 |
| Loại tải | Chỉ GET trang công khai | ADR-11 |
| Thời gian | 1 phút | `TC-NFR-01-006` |
| Ngưỡng | 0 lỗi 5xx | `TC-NFR-01-006` |

Ràng buộc bắt buộc: k6 **không** được POST vào endpoint đặt lịch và không được tạo lịch thật.

---

## 5. NFR-05 Độ tin cậy — thiết kế

| Ca | Kịch bản | Kỳ vọng | Test case |
|---|---|---|---|
| 1 | Gửi form 3 lần liên tiếp | Không tạo bản ghi trùng; thông báo xác nhận hiển thị mỗi lần | TC-NFR-05-001 |
| 2 | Mô phỏng mạng lỗi (chặn request) | Hiện thông báo trong ≤ 10 giây, không treo trang | TC-NFR-05-002 |
| 3 | Tải lại trang sau khi chọn | Giữ nguyên lựa chọn | TC-NFR-05-003 |
| 4 | Tải lại trong luồng wizard | Không mất lựa chọn | TC-NFR-05-004 |

**Ràng buộc ADR-11:** ca 1 (gửi form) không thể thực thi tự động vì sẽ tạo lịch thật. Ca này ở dạng Manual và chỉ thực hiện nếu chủ site đồng ý bằng văn bản; nếu không, ghi vào mục **giới hạn kiểm thử** của Final Test Report (không mở defect).

---

## 6. Bộ dữ liệu test

| Bộ | Nguồn | Dùng cho |
|---|---|---|
| Bảng giá T3 (41 dịch vụ) | `reports/raw/survey-T3-services.json` | DT-01, kiểm thử tích hợp |
| Bảng giá T3 đối chiếu UI | `reports/raw/survey-T3-ui-prices.csv` | DT-01 oracle |
| Bảng giá T2 (7 bậc × 10 dịch vụ) | `docs/reference/pricing-baseline.csv` (System = T2) | DT-05 |
| Ngưỡng cân nặng T3 | `reports/raw/survey-T3-weight-bands.csv` | DT-01, BVA |
| Ngưỡng cân nặng T2 | REF-01 §3.1 | BVA §3.3 |
| Cấu hình tiệm T3 | `reports/raw/survey-T3-setting.json` | DT-02 |

**Quy tắc dữ liệu test:**
- Dùng số điện thoại trong **dải 555-01xx** (dành riêng cho số giả theo ITU E.164) — không bao giờ dùng số thật của ai.
- Không nhập tên bé thật; dùng tên dánh nhãn rõ là dữ liệu test.
- Không gửi form đặt lịch (ADR-11).

---

## 7. Ma trận truy xuất thiết kế test ↔ test case

| Yêu cầu | Kỹ thuật thiết kế | Số test case dự kiến | Nhóm |
|---|---|---|---|
| FR-M3-01 | EP | 1 | Ngân |
| FR-M3-02 | EP + BVA + DT | 2 + 13 | Ngân |
| FR-M3-03 | UC | 2 | Ngân |
| FR-M3-05 | UC | 1 | Ngân |
| FR-M3-06 | UC | 1 | Ngân |
| FR-M4-01 | UC | 1 | Ngân |
| FR-M4-02 | EP | 1 | Ngân |
| FR-M4-03 | EP + BVA | 3 | Ngân |
| FR-M4-04 | EP | 1 | Ngân |
| FR-M4-07 | UC + ST | 2 | Ngân |
| FR-M4-08 | ST | 2 | Ngân |
| FR-M4-09 | UC | 1 | Ngân |
| FR-M4-10 | UC | 1 | Ngân |
| FR-M4-12 | UC | 1 | Ngân |
| FR-M5-06 | EP | 2 | Ngân |
| FR-M5-07 | UC + DT | 1 | Ngân |
| FR-M6-01 | ST | 2 | Ngân |
| NFR-01 | Lighthouse + k6 | 6 | Ngân |
| NFR-05 | Use case | 4 | Ngân |

---

## 8. Câu hỏi cần nhóm quyết định

| # | Câu hỏi | Ảnh hưởng | Mức |
|---|---|---|---|
| 1 | `BR-03` khai 5 ngưỡng cho `Cat Bath` nhưng danh mục thật chỉ có 1 dịch vụ — sửa đặc tả hay coi là lỗi site? | BVA của T3 (DEF-024, CHG-2026-11-18-01) | Cao |
| 2 | Hàng Mèo của ma trận giá T2: coi là lỗi site hay sửa tiêu chí `FR-M3-02`? | 7 ca BVA T2 (CHG-2026-11-14-02) | Cao |
| 3 | `TC-NFR-05-001` (gửi form 3 lần) cần gửi thật — có xin được phép chủ site không? | 1 ca Manual | Trung bình |
| 4 | T3 có bắt khách mới điền form intake qua Facebook trước khi đặt lịch — đây là rào cản hợp lệ hay xung đột `FR-M4-12`? | `TC-T3-M4-009` | Trung bình |
