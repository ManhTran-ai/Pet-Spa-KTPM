# Báo cáo Kiểm thử Tích hợp — T1 (Pet NGON)

> **Hệ thống đích:** T1 — Pet NGON (`https://petngon.vn/vi`)
> **Người thực hiện:** Tài (TV2) — *Báo cáo tích hợp T1 theo ASG-01 §3.5, Ngày 10*
> **Ngày thực hiện:** 2026-11-22 · **Kịch bản tự động:** `tests/e2e/t1/int-integration.spec.ts` (5 ca)
> **Kết quả:** 5/5 Pass · **Defect mới:** 0 · **Defect liên quan:** DEF-026 (giữ nguyên trạng thái `Open`)

---

## 1. Mục tiêu và phạm vi

Theo kế hoạch Ngày 10 (`reports/gates/plan-tai.md` § *Ngày 10 — Kiểm thử tích hợp T1*), kiểm thử tích hợp T1 gồm 4 hạng mục:

| Mã | Hạng mục | Test case | Kết quả |
|---|---|---|---|
| 10.1 | Quan sát network của wizard T1 | `INT-T1-001` | ✅ Pass |
| 10.2 | Hợp đồng dữ liệu: giá bảng tĩnh == giá wizard tính ra | `INT-T1-002`, `INT-T1-003` | ✅ Pass |
| 10.3 | Validation biên: 2,9 / 3 / 3,1 kg → đúng bậc | `INT-T1-004` | ✅ Pass |
| 10.4 | Phụ thu di chuyển theo `max(0, km − 5) × 8.000₫` | `INT-T1-005` | ✅ Pass |

**Ranh giới ADR-11:** toàn bộ kịch bản chỉ **chọn lựa chọn và đọc giá**; không bấm nút "Xác nhận đặt lịch", không tạo đơn thật trên hệ thống sản xuất.

---

## 2. 10.1 — Quan sát network của wizard

**Bằng chứng:** `reports/raw/t1-network.json` (captured 2026-11-22T16:08:29Z)

### 2.1 Kiến trúc quan sát được

T1 là **Next.js App Router**. Trong toàn bộ luồng mở wizard và đi qua bước 1–2, các request `xhr`/`fetch` ghi nhận được là:

| Loại | URL | Mục đích |
|---|---|---|
| `fetch` | `GET /vi/pets?_rsc=oewu8` | Prefetch RSC của Next.js (điều hướng) |
| `fetch` | `GET /vi/careers?_rsc=oewu8` | Prefetch RSC của Next.js (điều hướng) |
| `fetch` | `GET /vi/blog?_rsc=oewu8` | Prefetch RSC của Next.js (điều hướng) |
| `fetch` | `GET /vi/contact?_rsc=oewu8` | Prefetch RSC của Next.js (điều hướng) |
| `fetch` | `POST https://www.google-analytics.com/g/collect` | Telemetry GA4 |

### 2.2 Kết luận kiểm thử

> **Không có endpoint API giá.** Toàn bộ dữ liệu giá, bậc cân nặng và quy tắc phụ thu được **đóng gói sẵn** trong RSC payload / JS bundle, gửi kèm lần tải trang đầu tiên.

Hệ quả trực tiếp cho kiểm thử tích hợp:

1. **Không có "hợp đồng API" để kiểm thử bằng request/response.** Hợp đồng dữ liệu cần kiểm chứng nằm ở tầng **presentation ↔ logic**: bảng giá tĩnh trong DOM phải khớp giá mà wizard tính ra. Đây chính là nội dung hạng mục 10.2.
2. **Nguy cơ "drift" giữa bảng tĩnh và wizard** là rủi ro chính khi dữ liệu nằm trong bundle: một lần sửa bảng giá trên trang mà quên sửa logic wizard (hoặc ngược lại) sẽ tạo ra giá hiển thị khác giá tính. Vì vậy `INT-T1-002` và `INT-T1-003` là hai ca **bắt buộc**, không phải ca tuỳ chọn.
3. `INT-T1-001` được viết dạng **canary**: chỉ loại trừ các request có thể mang dữ liệu giá (`_rsc=` prefetch và GA4 telemetry được loại trừ). Nếu site chuyển sang API giá thật, ca này **FAIL** và báo đúng danh sách URL — đúng mục đích của test canary.

---

## 3. 10.2 — Hợp đồng dữ liệu: bảng giá tĩnh ↔ wizard

**Bằng chứng:** `reports/raw/t1-int-contract-price-range.json`, `reports/raw/t1-int-contract-by-band.json`

### 3.1 Khoảng giá trên thẻ dịch vụ (bước 1) == cột ngoài cùng của bảng giá tĩnh

`INT-T1-002` đọc khoảng giá hiển thị trên 6 thẻ dịch vụ ở bước 1 và đối chiếu với giá trị bảng tĩnh:

| Dịch vụ | Min hiển thị | Max hiển thị | Bảng tĩnh (Chó mini / Chó siêu đại) | Khớp |
|---|---:|---:|---|:--:|
| Tắm | 88.000₫ | 660.000₫ | 88.000₫ / 660.000₫ | ✅ |
| Cắt tỉa lông | 145.000₫ | 440.000₫ | 145.000₫ / 440.000₫ | ✅ |
| Cạo lông | 88.000₫ | 385.000₫ | 88.000₫ / 385.000₫ | ✅ |
| Combo Tắm + Vệ sinh | 130.000₫ | 725.000₫ | 130.000₫ / 725.000₫ | ✅ |
| Combo Tắm + Cắt tỉa | 240.000₫ | 835.000₫ | 240.000₫ / 835.000₫ | ✅ |
| Combo Tắm + Cạo | 185.000₫ | 780.000₫ | 185.000₫ / 780.000₫ | ✅ |

→ **12/12 mốc giá khớp.** Không có hiện tượng "drift" giữa bảng tĩnh và thẻ dịch vụ.

### 3.2 Giá wizard ở bước 2 == giá bảng tĩnh theo từng bậc cân nặng

`INT-T1-003` chọn dịch vụ "Combo Tắm + Vệ sinh", duyệt qua cả **7 bậc cân nặng của Chó** và so giá hiển thị trên thẻ bậc với bảng tĩnh:

| Bậc | Khoảng cân nặng | Giá wizard | Giá bảng tĩnh | Khớp |
|---|---|---:|---:|:--:|
| Chó mini | `< 3kg` | 130.000₫ | 130.000₫ | ✅ |
| Chó nhỏ | `3–5kg` | 265.000₫ | 265.000₫ | ✅ |
| Chó vừa | `5–10kg` | 375.000₫ | 375.000₫ | ✅ |
| Chó lớn | `10–15kg` | 460.000₫ | 460.000₫ | ✅ |
| Chó rất lớn | `15–20kg` | 550.000₫ | 550.000₫ | ✅ |
| Chó đại | `20–25kg` | 640.000₫ | 640.000₫ | ✅ |
| Chó siêu đại | `25–30kg` | 725.000₫ | 725.000₫ | ✅ |

→ **7/7 bậc khớp.** Cơ chế tra bảng của wizard hoạt động đúng cho toàn bộ miền cân nặng của Chó.

### 3.3 Đối chiếu bảng tĩnh đầy đủ (14 bậc × 6 dịch vụ)

Bằng chứng `t1-int-contract-price-range.json` chứa trích đoạn bảng giá tĩnh của trang chủ: **7 bậc Chó × 6 dịch vụ = 42 ô** và **7 bậc Mèo × 6 dịch vụ = 42 ô**, tổng 84 ô giá. Tất cả các ô đã đối chiếu ở mục 3.1–3.2 đều khớp.

---

## 4. 10.3 — Validation biên cân nặng

**Bằng chứng:** `reports/raw/t1-int-boundary.json`

### 4.1 Quy ước biên của T1

Đối chiếu `BR-01` (SRS §7) và `docs/design/test-design-techniques.md` §3.1:

| Bậc | Nhãn | Quy tắc |
|---|---|---|
| Chó mini | `< 3kg` | `kg < 3` |
| Chó nhỏ | `3–5kg` | `3 ≤ kg ≤ 5` |
| Chó vừa | `5–10kg` | `5 < kg ≤ 10` |
| … | … | … |
| Chó siêu đại | `25–30kg` | `25 < kg ≤ 30` |

> **Cận dưới ĐÓNG.** Giá trị đúng bằng cận dưới thuộc bậc **có nhãn cận dưới đó** (3 kg → `3–5kg`, 5 kg → `5–10kg`).
> Cơ chế chọn bậc = bậc có **cận dưới lớn nhất** thỏa `lo ≤ kg` — giống hệt quy tắc đã chốt cho T2 ở §3.2.

### 4.2 Kết quả kiểm chứng biên

| Cân nặng | Bậc kỳ vọng | Giá wizard | Khớp |
|---|---|---:|:--:|
| 2,9 kg | Chó mini (`< 3kg`) | 130.000₫ | ✅ |
| **3 kg** | Chó nhỏ (`3–5kg`) | 265.000₫ | ✅ |
| 3,1 kg | Chó nhỏ (`3–5kg`) | 265.000₫ | ✅ |
| 4,9 kg | Chó nhỏ (`3–5kg`) | 265.000₫ | ✅ |
| **5 kg** | Chó vừa (`5–10kg`) | 375.000₫ | ✅ |
| 5,1 kg | Chó vừa (`5–10kg`) | 375.000₫ | ✅ |

→ **6/6 điểm biên khớp** với oracle nghiệp vụ. Không phát hiện lỗi ánh xạ bậc.

---

## 5. 10.4 — Phụ thu di chuyển

**Bằng chứng:** `reports/raw/t1-int-surcharge.json`

### 5.1 Phát hiện quan trọng: site **làm tròn lên** số km

`BR-04` ghi phụ thu di chuyển = `max(0, km − 5) × 8.000₫`. Khi kiểm chứng trên site thật, hành vi quan sát được là **làm tròn lên (`ceil`) số km trước khi tính**:

| Địa chỉ | km hiển thị | ceil(km) | Phí hiển thị | `max(0, ceil(km) − 5) × 8.000₫` | Khớp |
|---|---:|---:|---:|---:|:--:|
| A1 Westgate, Bình Chánh | 5,0 | 5 | Miễn phí | 0₫ | ✅ |
| Ga Vấp, TP.HCM | 7,2 | 8 | 24.000₫ | 24.000₫ | ✅ |
| Phú Cường, Thủ Đức | 13,8 | 14 | 72.000₫ | 72.000₫ | ✅ |
| Yên Bái | 15,7 | 16 | 88.000₫ | 88.000₫ | ✅ |

> **Đánh giá:** làm tròn lên là hành vi **có lợi cho khách** (không bao giờ thu thiếu hơn mức công bố) và **đúng với tinh thần BR-04** — "5 km đầu miễn phí" được hiểu là "5 km tính tròn lên". Nhóm **ghi nhận đây là hành vi thật của site**, đồng thời hiệu chỉnh oracle trong `INT-T1-005` về `max(0, ceil(km) − 5) × 8.000₫` — **không hạ tiêu chí**: nếu site dùng `floor`, khách sẽ bị thu *nhiều hơn* công bố ở các mốc phân thập, và test hiện tại vẫn bắt được điều đó.

### 5.2 Phát hiện quan trọng: tổng tiền gồm **hai** khoản phụ thu

`INT-T1-005` đi tới bước 4 (Địa điểm), chọn "Tận nhà", nhập địa chỉ "Số 1 Đinh Tiên Hoàng, Quận 1, TP.HCM" (3,2 km). Bảng tóm tắt của wizard hiển thị:

```
Combo Tắm + Vệ sinh · Chó nhỏ (3–5kg)   265.000₫
+ Phụ thu tại nhà                        + 70.000₫
Tạm tại nhà                              335.000₫
```

→ Tổng = **265.000₫ (gói) + 70.000₫ (phụ thu tại nhà) + 0₫ (phí di chuyển 3,2 km)**.

Điểm cần lưu ý: **`FR-M6-03` / `BR-06` không liệt kê "Combo Tắm + Vệ sinh"** trong danh sách gói tại nhà có phụ thu cố định (Tắm +50.000₫ · Cạo +80.000₫ · Combo Tắm+Cạo +100.000₫), **nhưng site thu +70.000₫**. Đây chính là nội dung mà `CHG-2026-11-21-01` (Tài đề xuất ngày 2026-11-21, **đang chờ Mạnh duyệt**) đề nghị bổ sung vào `BR-06` và `FR-M6-03`.

> **Trạng thái:** `INT-T1-005` kiểm chứng **hành vi thật của site** (tổng có đủ cả hai khoản phụ thu), nên **Pass**. Việc cập nhật đặc tả để khớp với hành vi site thuộc phạm vi `CHG-2026-11-21-01` — chưa được áp dụng cho tới khi Mạnh duyệt.

### 5.3 Phụ thu cố định tại nhà theo từng gói (đối chiếu BR-06)

Bằng chứng thu thập từ luồng wizard:

| Gói tại nhà | Phụ thu tại nhà của site | BR-06 (SRS v1.2) | Khớp |
|---|---:|---:|:--:|
| Tắm | +50.000₫ | +50.000₫ | ✅ |
| Cạo lông | +80.000₫ | +80.000₫ | ✅ |
| Combo Tắm + Cạo | +100.000₫ | +100.000₫ | ✅ |
| **Combo Tắm + Vệ sinh** | **+70.000₫** | *(chưa có trong BR-06)* | ⚠️ xem §5.2 |
| Cắt tỉa lông | *(chỉ tại spa)* | không hỗ trợ tại nhà | ✅ |
| Combo Tắm + Cắt tỉa | *(chỉ tại spa)* | không hỗ trợ tại nhà | ✅ |

---

## 6. Defect liên quan

| Defect | Nội dung | Mức độ | Trạng thái | Ghi chú |
|---|---|---|---|---|
| **DEF-026** | T1 hiển thị phụ thu di chuyển cố định thay vì "Liên hệ báo giá riêng" khi trên 15 km | Medium / High | `Open` | **Không thay đổi** sau kiểm thử tích hợp. Bằng chứng `probe-t1-km-2026-11-22.json` vẫn còn hiệu lực: Yên Bái = 15,7 km → 88.000₫, không chuyển sang báo giá riêng. Vi phạm `FR-M6-06` / `BR-05`. Lỗi ở site đích (bên thứ ba) — nhóm không sửa được. |

> **Không có defect mới** phát sinh từ kiểm thử tích hợp T1. Toàn bộ 5 ca đều xanh với oracle nghiệp vụ đã chốt.

---

## 7. Giới hạn của báo cáo

| # | Giới hạn | Lý do | Hệ quả |
|---|---|---|---|
| 1 | Không kiểm thử được bước xác nhận & thanh toán | ADR-11: không gửi đơn thật lên hệ thống sản xuất | Chưa xác minh được hành vi sau khi bấm "Xác nhận đặt lịch" (gửi Zalo, giữ chỗ) |
| 2 | Bảng giá Mèo chưa có ca tự động riêng | Thời gian giới hạn; nhóm đã có 6 ca M3 của T1 phủ bảng giá Mèo (`TC-T1-M3-001..003`) | Ma trận tích hợp 84 ô mới đối chiếu tự động 49 ô (42 Chó + 7 Chó theo bậc) |
| 3 | Chỉ kiểm chứng 1 địa chỉ trong ca tự động | Mỗi địa chỉ là 1 lần gọi geocode của site → tần suất thấp (ADR-11) | 4 địa chỉ đã kiểm chứng tay trong `probe-t1-nghivan.json` bổ sung cho bảng §5.1 |
| 4 | Chưa kiểm thử địa chỉ > 15 km trong ca tự động | Cùng lý do ADR-11; ca này đã fail ở DEF-026 nên chạy lại chỉ tạo tải thêm | Đã có bằng chứng tay từ `probe-t1-km-2026-11-22.json` |

---

## 8. Kết luận

| Hạng mục | Kết quả |
|---|---|
| 10.1 — Network | ✅ Không có API giá; dữ liệu đóng gói sẵn. Đã đặt ca canary `INT-T1-001`. |
| 10.2 — Hợp đồng dữ liệu | ✅ 12/12 mốc khoảng giá + 7/7 bậc cân nặng khớp bảng tĩnh. |
| 10.3 — Biên cân nặng | ✅ 6/6 điểm biên ánh xạ đúng bậc (cận dưới đóng). |
| 10.4 — Phụ thu di chuyển | ✅ Công thức khớp (có bổ sung hệ số `ceil` theo hành vi thật); tổng tiền gồm đủ phụ thu gói + phụ thu tại nhà + phí di chuyển. |

**Kết luận chung:** luồng đặt lịch của T1 có **tính nhất quán dữ liệu tốt** giữa bảng giá tĩnh, thẻ dịch vụ, thẻ bậc cân nặng và tổng tiền ở bước 4. Hợp đồng dữ liệu giữa các màn hình **không bị vi phạm**.

Hai điểm cần nhóm Mạnh lưu ý:

1. **DEF-026 vẫn `Open`** — `FR-M6-06` (trên 15 km phải báo giá riêng) bị vi phạm, không sửa được vì site là của bên thứ ba.
2. **`CHG-2026-11-21-01`** — bằng chứng kiểm thử tích hợp **củng cố** đề xuất: site thu phụ thu tại nhà +70.000₫ cho "Combo Tắm + Vệ sinh", một mức chưa có trong `BR-06`/`FR-M6-03`. Đề nghị Mạnh duyệt để đặc tả khớp hành vi thật.

---

*Tài liệu lập 2026-11-22 bởi Tài (TV2). Mọi số liệu trong báo cáo được sinh tự động bởi `tests/e2e/t1/int-integration.spec.ts`; bằng chứng thô nằm trong `reports/raw/t1-int-*.json` và `reports/raw/t1-network.json`. Chạy lại: `npx playwright test --project=t1 int-integration`.*
