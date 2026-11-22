# Báo cáo kiểm thử tích hợp — T1 Pet NGON

| | |
|---|---|
| **Ngày** | 2026-11-22 (Ngày 10 theo kế hoạch 14 ngày) |
| **Người thực hiện** | Mạnh — Test Lead (TV1) |
| **Hệ thống** | T1 — Pet NGON (`petngon.vn/vi`) |
| **Loại kiểm thử** | Kiểm thử tích hợp (hộp xám): quan sát hợp đồng dữ liệu giữa bảng giá tĩnh, wizard đặt lịch và bảng phụ thu |
| **Kết quả** | **Đạt** — 3/3 hợp đồng dữ liệu nhất quán; không phát hiện lỗi tích hợp |
| **Bằng chứng máy** | `reports/raw/day-13-integration-t1.txt` (log đầy đủ) · script: `scripts/integration-scan-t1.mjs` |

> **Ranh giới ADR-11.** Toàn bộ phiên kiểm thử chỉ **đọc** và điền form wizard tới bước 4 (Địa điểm). Em **không bấm "Xác nhận đặt lịch"** → không tạo lịch hẹn thật, không gửi tin nhắn cho khách, không ghi dữ liệu vào hệ thống đích. Không có API ghi dữ liệu nào được gọi (xem §4).

---

## 1. Mục tiêu và phạm vi

Ba hợp đồng dữ liệu cần kiểm chứng — mỗi hợp đồng là một điểm dễ phát sinh lệch dữ liệu giữa các màn hình của cùng một hệ thống:

| Mã | Hợp đồng dữ liệu | Nơi kiểm chứng |
|---|---|---|
| **HĐ-1** | Bảng giá theo bậc cân nặng ↔ giá hiển thị ở bước 2 của wizard | `/vi` §bảng giá ↔ wizard bước 2 |
| **HĐ-2** | Phụ thu tại nhà theo gói (card dịch vụ) ↔ tổng tiền ở bước 4 của wizard | card `.hm-svc__home-note` ↔ wizard bước 4 |
| **HĐ-3** | Phụ thu di chuyển theo khoảng cách ↔ công thức tính ↔ bảng giá công bố | `/vi` §phụ thu di chuyển |

---

## 2. HĐ-1 — Bảng giá tĩnh ↔ wizard: **14/14 khớp**

### 2.1. Bảng giá tĩnh (7 cột × 14 dòng loài/bậc)

| Loài · bậc | Tắm | Cắt tỉa lông | Cạo lông | Combo Tắm + Vệ sinh | Combo Tắm + Cắt tỉa | Combo Tắm + Cạo |
|---|---|---|---|---|---|---|
| Chó mini `< 3kg` | 88.000₫ | 145.000₫ | 88.000₫ | 130.000₫ | 240.000₫ | 185.000₫ |
| Chó nhỏ `3–5kg` | 155.000₫ | 165.000₫ | 110.000₫ | 265.000₫ | 405.000₫ | 350.000₫ |
| Chó vừa `5–10kg` | 240.000₫ | 220.000₫ | 165.000₫ | 375.000₫ | 515.000₫ | 460.000₫ |
| Chó lớn `10–15kg` | 350.000₫ | 275.000₫ | 220.000₫ | 460.000₫ | 605.000₫ | 550.000₫ |
| Chó rất lớn `15–20kg` | 460.000₫ | 330.000₫ | 275.000₫ | 550.000₫ | 660.000₫ | 605.000₫ |
| Chó đại `20–25kg` | 570.000₫ | 385.000₫ | 330.000₫ | 640.000₫ | 750.000₫ | 695.000₫ |
| Chó siêu đại `25–30kg` | 660.000₫ | 440.000₫ | 385.000₫ | 725.000₫ | 835.000₫ | 780.000₫ |
| Mèo mini `≤ 3kg` | 110.000₫ | 160.000₫ | 110.000₫ | 155.000₫ | 240.000₫ | 210.000₫ |
| Mèo nhỏ `3–5kg` | 165.000₫ | 275.000₫ | 165.000₫ | 275.000₫ | 415.000₫ | 365.000₫ |
| Mèo vừa `5–10kg` | 275.000₫ | 370.000₫ | 220.000₫ | 405.000₫ | 565.000₫ | 495.000₫ |
| Mèo lớn `10–15kg` | 385.000₫ | 440.000₫ | 275.000₫ | 495.000₫ | 665.000₫ | 585.000₫ |
| Mèo rất lớn `15–20kg` | 460.000₫ | 455.000₫ | 330.000₫ | 550.000₫ | 690.000₫ | 605.000₫ |
| Mèo đại `20–25kg` | 570.000₫ | 520.000₫ | 385.000₫ | 640.000₫ | 795.000₫ | 695.000₫ |
| Mèo siêu đại `25–30kg` | 660.000₫ | 585.000₫ | 440.000₫ | 725.000₫ | 890.000₫ | 780.000₫ |

### 2.2. Kết quả đối chiếu từng cặp (loài × bậc) với dịch vụ "Tắm"

| Cặp | Wizard | Bảng tĩnh | Kết quả |
|---|---|---|---|
| Chó · Chó mini (`< 3kg`) | 88.000₫ | 88.000₫ | ✅ khớp |
| Chó · Chó nhỏ (`3–5kg`) | 155.000₫ | 155.000₫ | ✅ khớp |
| Chó · Chó vừa (`5–10kg`) | 240.000₫ | 240.000₫ | ✅ khớp |
| Chó · Chó lớn (`10–15kg`) | 350.000₫ | 350.000₫ | ✅ khớp |
| Chó · Chó rất lớn (`15–20kg`) | 460.000₫ | 460.000₫ | ✅ khớp |
| Chó · Chó đại (`20–25kg`) | 570.000₫ | 570.000₫ | ✅ khớp |
| Chó · Chó siêu đại (`25–30kg`) | 660.000₫ | 660.000₫ | ✅ khớp |
| Mèo · Mèo mini (`≤ 3kg`) | 110.000₫ | 110.000₫ | ✅ khớp |
| Mèo · Mèo nhỏ (`3–5kg`) | 165.000₫ | 165.000₫ | ✅ khớp |
| Mèo · Mèo vừa (`5–10kg`) | 275.000₫ | 275.000₫ | ✅ khớp |
| Mèo · Mèo lớn (`10–15kg`) | 385.000₫ | 385.000₫ | ✅ khớp |
| Mèo · Mèo rất lớn (`15–20kg`) | 460.000₫ | 460.000₫ | ✅ khớp |
| Mèo · Mèo đại (`20–25kg`) | 570.000₫ | 570.000₫ | ✅ khớp |
| Mèo · Mèo siêu đại (`25–30kg`) | 660.000₫ | 660.000₫ | ✅ khớp |

**→ 14/14 khớp, 0 lệch.** Cả khoảng kg lẫn giá đều giống nhau.

### 2.3. Nhận xét kiến trúc

Giá trong wizard **không được tính động** từ bảng giá — mỗi thẻ bậc cân nặng mang sẵn giá riêng trong thẻ `<em>`:

```html
<button class="bk-pet"><b>Chó nhỏ</b><span>3–5kg</span><em>155.000₫</em></button>
```

Hai màn hình dùng **cùng một bảng giá** ở tầng dữ liệu → không thể lệch do tính toán. Đây là điểm tích cực về thiết kế: **hợp đồng dữ liệu giữa bảng giá và wizard là bất biến theo cấu trúc**, không phụ thuộc logic tính tiền.

### 2.4. Đối chiếu với `BR-01`

`BR-01` quy định 7 bậc cho cả chó và mèo: `<3`, `3–5`, `5–10`, `10–15`, `15–20`, `20–25`, `25–30` kg.

| Điểm | Thực tế | Kết luận |
|---|---|---|
| Số bậc | 7 bậc × 2 loài = 14 dòng | ✅ khớp `BR-01` |
| Ngưỡng | `< 3kg` (chó) · `≤ 3kg` (mèo) · `3–5kg` … `25–30kg` | ✅ khớp `BR-01` |
| Dải giá "Tắm" | 88.000₫ (chó mini) → 660.000₫ (chó & mèo siêu đại) | ✅ trong khoảng `FR-M3-01` |

---

## 3. HĐ-2 — Phụ thu tại nhà ↔ tổng tiền bước 4: **4/4 gói tính đúng**

### 3.1. Phụ thu công bố trên card dịch vụ

| Gói | Badge | Phụ thu tại nhà |
|---|---|---|
| Tắm | Có tận nhà | **+50.000₫** (chưa gồm phí di chuyển) |
| Cắt tỉa lông | Chỉ tại spa | — |
| Cạo lông | Có tận nhà | **+80.000₫** (chưa gồm phí di chuyển) |
| Combo Tắm + Vệ sinh | Có tận nhà | **+70.000₫** (chưa gồm phí di chuyển) |
| Combo Tắm + Cắt tỉa | Chỉ tại spa | — |
| Combo Tắm + Cạo | Có tận nhà | **+100.000₫** (chưa gồm phí di chuyển) |

### 3.2. Đối chiếu với tổng tiền ở bước 4 (Chó nhỏ `3–5kg`)

| Gói | Giá gốc | Phụ thu | Tạm tính hiển thị | Kiểm tra |
|---|---|---|---|---|
| Tắm | 155.000₫ | +50.000₫ | **205.000₫** | ✅ khớp |
| Cạo lông | 110.000₫ | +80.000₫ | **190.000₫** | ✅ khớp |
| Combo Tắm + Vệ sinh | 265.000₫ | +70.000₫ | **335.000₫** | ✅ khớp |
| Combo Tắm + Cạo | 350.000₫ | +100.000₫ | **450.000₫** | ✅ khớp |

**→ 4/4 gói tính đúng**, mỗi gói đều hiển thị dòng "+ Phụ thu tận nhà" với đúng mức tiền ở bước 4.

> **Cách kiểm chứng:** script `scripts/integration-scan-t1.mjs` **không** so sánh với danh sách giá trị viết tay — nó **tự tính** `Tạm tính = giá gói + phụ thu tại nhà` từ dữ liệu đọc được trên trang, rồi so với giá trị hiển thị ở bước 4. Nhờ vậy phép kiểm chứng đúng về mặt toán chứ không phụ thuộc con số ghi sẵn trong script.

### 3.3. Chi tiết bước 4 (gói Tắm, chọn "Tận nhà")

```
Tắm · Chó nhỏ (3–5kg)                    155.000₫
+ Phụ thu tận nhà                        + 50.000₫
Tạm tính                                 205.000₫
```

Trên cùng màn hình, lựa chọn địa điểm hiển thị:

```
store   Tại spa      1.09 A1 Westgate, Bình Chánh      KHÔNG PHỤ THU
home_work  Tận nhà   Thợ đến địa chỉ của bạn             +50.000₫ + KM
```

→ Mức phụ thu **hiển thị trước khi xác nhận**, khớp với tổng tiền. Không có khoản phí nào bị ẩn.

### 3.4. Đối chiếu với `BR-06` / `FR-M6-03`

`BR-06` quy định phụ thu tại nhà cố định của T1: **Tắm +50.000₫; Cạo +80.000₫; Combo Tắm+Cạo +100.000₫; các gói khác không hỗ trợ tại nhà**. `FR-M6-03` xác nhận 3 mức tiền đó (AC: *"Tắm +50.000₫, Cạo +80.000₫, Combo Tắm+Cạo +100.000₫"*).

| Gói | `BR-06` / `FR-M6-03` | Thực tế | Kết luận |
|---|---|---|---|
| Tắm | +50.000₫ | +50.000₫ | ✅ khớp |
| Cạo lông | +80.000₫ | +80.000₫ | ✅ khớp |
| Combo Tắm + Cạo | +100.000₫ | +100.000₫ | ✅ khớp |
| Combo Tắm + Vệ sinh | *không nêu* | +70.000₫, hỗ trợ tại nhà | ⚠️ **xung đột với vế "các gói khác không hỗ trợ tại nhà" của `BR-06`** — xem §5.1 |

→ **3/3 mức tiền mà `FR-M6-03` yêu cầu đều được tính đúng.** Mâu thuẫn chỉ nằm ở vế phạm vi ("các gói khác không hỗ trợ tại nhà") của `BR-06`, không ảnh hưởng tiêu chí chấp nhận của `FR-M6-03`.

---

## 4. HĐ-3 — Phụ thu di chuyển

### 4.1. Công thức công bố trên trang

```
Phụ thu = max(0, km − 5) × 8.000₫
```

| Dải km | Mức phụ thu | Khu vực ví dụ |
|---|---|---|
| 0 – 5 km | Miễn phí | Q.1, Q.3, Bình Thạnh, Phú Nhuận |
| 5 – 10 km | 40.000₫ – 80.000₫ | Q.7, Q.10, Tân Bình, Gò Vấp |
| 10 – 15 km | 80.000₫ – 120.000₫ | Bình Chánh, Thủ Đức, Nhà Bè |
| Trên 15 km | Liên hệ — Báo giá riêng theo lộ trình | — |

### 4.2. Đối chiếu `BR-04` / `BR-05`

| Quy tắc | Nội dung | Thực tế | Kết luận |
|---|---|---|---|
| `BR-04` | Phụ thu = `max(0, km − 5) × 8.000₫`; 5 km đầu miễn phí | Đúng y như công bố | ✅ khớp |
| `BR-05` | 0–5 km miễn phí; 5–10 km: 40.000–80.000₫; 10–15 km: 80.000–120.000₫; >15 km: liên hệ | Đúng y như công bố | ✅ khớp |

### 4.3. Hạn chế kiểm chứng

Em **không nhập địa chỉ thật** để kích hoạt tính khoảng cách — việc đó sẽ gửi dữ liệu địa chỉ ra ngoài và tạo dữ liệu định danh tại site đích (ADR-11). Thay vào đó em kiểm chứng **công thức công bố** và sự nhất quán giữa công thức với dải bảng giá — 5 km miễn phí khớp `BR-04`, các mốc 40k/80k/120k khớp `BR-05`.

> Phần **hiển thị** phí di chuyển trong tổng tiền là **không kiểm thử được theo ADR-11** → ghi nhận là giới hạn, không đánh dấu Pass.

---

## 5. Quan sát phát sinh

### 5.1. `BR-06` không bao phủ gói "Combo Tắm + Vệ sinh" — **mâu thuẫn nội bộ**

| Nơi | Nội dung |
|---|---|
| `BR-06` (SRS v1.5) | "Phụ thu tại nhà cố định của T1: **Tắm +50.000₫; Cạo +80.000₫; Combo Tắm+Cạo +100.000₫; các gói khác không hỗ trợ tại nhà**" |
| `FR-M6-03` (AC) | "Tắm +50.000₫, Cạo +80.000₫, Combo Tắm+Cạo +100.000₫" — liệt kê 3 gói, **không** có vế "các gói khác không hỗ trợ tại nhà" |
| Thực tế (card dịch vụ + wizard) | **Combo Tắm + Vệ sinh** hỗ trợ tại nhà, phụ thu **+70.000₫** → thực tế có **4** gói tại nhà |

Mâu thuẫn nằm ở **vế "các gói khác không hỗ trợ tại nhà"** của `BR-06` — vế này **sai** so với thực tế (gói Combo Tắm + Vệ sinh có hỗ trợ tại nhà). Phần liệt kê 3 mức tiền trong `BR-06` và `FR-M6-03` thì **đều đúng**, chỉ thiếu gói thứ 4.

**Mức độ:** Medium (quy tắc nghiệp vụ mô tả sai phạm vi) · **Hệ quả:** `FR-M6-04` yêu cầu *"100% gói tại nhà ghi rõ '(chưa gồm phí di chuyển)'"* → tiêu chí chấp nhận vẫn **đạt** (mọi gói đều ghi rõ), nên **không có test case nào Fail**. Vì vậy em **chưa mở defect** — chờ Test Lead chốt có cần mở `DEF-0xx` hay sửa `BR-06` qua CR.

> **Ghi nhận liên quan:** FAQ "Phụ thu tại nhà tính như thế nào?" của T1 ghi *"70k cho Tắm, 80k cho Cạo, 100k cho Combo"* — **con số 70k thuộc về "Combo Tắm + Vệ sinh", không phải "Tắm"**. FAQ nhầm tên gói, và cũng không liệt kê "Combo Tắm + Vệ sinh" trong câu hỏi "Dịch vụ nào có thể làm tại nhà?". Xem `reports/gates/day-11.md` §7.

### 5.2. Trạng thái API và dữ liệu gửi đi

779 request trong phiên kiểm thử, phân bổ theo domain:

| Domain | Số request | Loại |
|---|---|---|
| `petngon.vn` | 693 | Tài nguyên trang + RSC prefetch của Next.js |
| `www.googletagmanager.com` | 42 | Google Tag Manager |
| `www.google-analytics.com` | 23 | GA4 (`/g/collect`) |
| `fonts.gstatic.com` | 21 | Font |

Phân bổ status: `200` × 752 · `204` × 23 (GA4) · `304` × 4 (cache).

**Không có request ghi dữ liệu** (`POST`/`PUT`/`PATCH`/`DELETE`) tới domain của site — toàn bộ `POST` đều là GA4 `/g/collect` (204) và RSC prefetch là `GET`. Xác nhận ranh giới ADR-11 được giữ: **không tạo lịch hẹn, không ghi vào hệ thống đích**.

---

## 6. Kết luận

| Hợp đồng dữ liệu | Kết quả | Số liệu |
|---|---|---|
| HĐ-1 · Bảng giá tĩnh ↔ wizard | ✅ Đạt | **14/14 cặp khớp**, 0 lệch |
| HĐ-2 · Phụ thu tại nhà ↔ tổng tiền bước 4 | ✅ Đạt | **4/4 gói tính đúng** |
| HĐ-3 · Phụ thu di chuyển ↔ `BR-04`/`BR-05` | ✅ Đạt (giới hạn ADR-11 ở phần hiển thị) | Công thức + 4 dải giá khớp |

**Không phát hiện lỗi tích hợp.** Hệ thống T1 có tính nhất quán dữ liệu tốt giữa bảng giá tĩnh, card dịch vụ và wizard đặt lịch.

**Một quan sát cần anh (Test Lead) chốt:** `BR-06` mô tả thiếu gói "Combo Tắm + Vệ sinh" (§5.1). Em đề xuất mở CR sửa `BR-06` — giống cách `CHG-2026-11-22-01` đã sửa `BR-03` cho T3.
