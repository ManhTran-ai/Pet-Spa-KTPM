# Thiết kế test — Chuyển đổi trạng thái (State Transition Testing)

Mã tài liệu: TD-ST · Phiên bản 1.0 · Ngày 2026-11-19 · Người phụ trách: **Ngân (TV3)**

Đầu vào: SRS-01 v1.2 §8.1, §8.2, §5.4, §5.5, §5.7 · Phục vụ yêu cầu **H2-2** của Hướng 2 · Test case sinh ra: 19 ca ST = 19/226 ca

> Phần bổ trợ cho `docs/design/decision-tables.md` (cùng người phụ trách). Hai tài liệu tách bạch theo kỹ thuật: DT mô tả **quan hệ điều kiện → kết quả**, ST mô tả **vòng đời trạng thái**.

---

## 1. Cơ sở lý thuyết

**State Transition Testing** (Cẩm nang §4.5): mô hình hoá hệ thống thành các **trạng thái** (states) và **chuyển trạng thái** (transitions). Ba loại test được thiết kế:

| Loại | Câu hỏi | Giá trị cho dự án |
|---|---|---|
| **Chuyển hợp lệ** | Hệ thống có thực hiện đúng chuyển không? | Xác nhận wizard đi đúng đường và giữ lựa chọn khi quay lại |
| **Chuyển không hợp lệ** | Hệ thống có **chặn đúng** chuyển cấm không? | Đây là ca lỗi có giá trị nhất: nếu site cho bỏ qua bước loài/cân nặng, giá hiển thị sẽ sai |
| **Trạng thái chưa kiểm thử** | Còn trạng thái nào bị bỏ sót không? | Rà soát sau vòng 1 + phiên khám phá 60 phút/site |

Nguyên tắc: **chỉ mô hình hoá trạng thái quan sát được qua UI**. Trạng thái nội bộ của hệ thống đích không lộ ra thì không kiểm chứng được (xem §5).

---

## 2. Wizard T2 (SRS §8.1) — trạng thái `S0..S5`

Trạng thái: `S0` chưa chọn loài → `S1` đã chọn loài → `S2` đã chọn bậc cân nặng → `S3` đã chọn dịch vụ → `S4` đã điền thông tin liên hệ → `S5` đã gửi (terminal).

```
        ┌──────────────┐
        │ S0 Chưa chọn  │
        │    loài      │
        └──────┬───────┘
               │ chọn loài (Chó/Mèo)
               ▼
        ┌──────────────┐
        │ S1 Đã chọn   │◄──── Quay lại ────┐
        │    loài      │                   │
        └──────┬───────┘                   │
               │ chọn bậc cân nặng          │
               ▼                           │
        ┌──────────────┐                   │
        │ S2 Đã chọn   │                   │
        │  bậc cân nặng│                   │
        └──────┬───────┘                   │
               │ chọn dịch vụ              │
               ▼                           │
        ┌──────────────┐   Quay lại        │
        │ S3 Đã chọn   │──────────────┐    │
        │   dịch vụ   │              │    │
        └──────┬───────┘              │    │
               │ điền SĐT            │    │
               ▼                     ▼    │
        ┌──────────────┐         ┌──────────────┐
        │ S4 Đã điền   │────────►│ Quay lại về  │
        │  thông tin   │  Quay lại│  bước trước │
        └──────┬───────┘         └──────────────┘
               │ gửi form (còn thiếu SĐT thì bị chặn)
               ▼
        ┌──────────────┐
        │ S5 Đã gửi    │  (terminal)
        └──────────────┘
```

### 2.1 Bảng chuyển trạng thái T2

| Từ | Chuyển hợp lệ | Chuyển **không hợp lệ** (phải bị chặn) | Test case |
|---|---|---|---|
| **S0** | → S1 (chọn loài) | ✗ chọn bậc · ✗ chọn dịch vụ · ✗ quay lại · ✗ gửi form | `TC-T2-M4-013` |
| **S1** | → S2 (chọn bậc) · → S0 (quay lại) | ✗ chọn dịch vụ · ✗ gửi form | `TC-T2-M4-014` |
| **S2** | → S3 (chọn dịch vụ) · → S1 (quay lại) | ✗ gửi form | `TC-T2-M4-015` |
| **S3** | → S4 (điền SĐT) · → S2 (quay lại) | ✗ gửi form (còn thiếu SĐT) | `TC-T2-M4-016` |
| **S4** | → S5 (gửi) · → S3 (quay lại) | — | `TC-T2-M4-017`, `TC-T2-M4-009` |
| **S5** (terminal) | — | ✗ mọi chuyển | — |

### 2.2 Trạng thái chưa kiểm thử của T2 (cần rà ở vòng 2)

| Trạng thái | Mô tả | Ghi chú |
|---|---|---|
| **S3b** | Đã chọn dịch vụ nhưng **chưa** điền SĐT, bấm gửi | Cùng kỳ vọng với S3 (bị chặn) — hợp nhất với ca `TC-T2-M4-016` |
| **S4b** | Đã điền SĐT, quay lại S3, **đổi dịch vụ**, tiến tục | Kiểm tra giá cập nhật theo dịch vụ mới — ứng viên bổ sung ca |
| **S0b** | Tải lại trang giữa chừng (F5) | Kiểm tra trạng thái có được giữ hay không — ứng viên cho phiên khám phá |

---

## 3. Wizard T1 (SRS §8.2) — trạng thái `W0..W7`

Trạng thái: `W0` mở modal → `W1` đã chọn loài → `W2` đã chọn gói → `W3` đã chọn cân nặng → `W4` đã chọn ngày giờ → `W5` đã chọn tại spa / tại nhà → `W6` đã nhập địa chỉ (nếu tại nhà) → `W7` xác nhận đơn (terminal).

```
   ┌────────────┐
   │ W0 Mở modal│
   └─────┬──────┘
         │ chọn loài
         ▼
   ┌────────────┐◄──────────────┐
   │ W1 Đã chọn │               │ Quay lại
   │   loài     │───────────────┤
   └─────┬──────┘               │
         │ chọn gói             │
         ▼                      │
   ┌────────────┐               │
   │ W2 Đã chọn │───────────────┘
   │   gói      │
   └─────┬──────┘
         │ chọn cân nặng
         ▼
   ┌────────────┐
   │ W3 Đã chọn │◄──── Quay lại ────┐
   │ cân nặng   │                   │
   └─────┬──────┘                   │
         │ chọn ngày giờ            │
         ▼                          │
   ┌────────────┐                   │
   │ W4 Đã chọn │                   │
   │  ngày giờ  │                   │
   └─────┬──────┘                   │
         │ chọn tại spa / tại nhà   │
         ▼                          │
   ┌────────────┐                   │
   │ W5 Đã chọn │───────────────────┘
   │ hình thức  │
   └─────┬──────┘
         │ (nếu tại nhà) nhập địa chỉ
         ▼
   ┌────────────┐
   │ W6 Đã nhập │
   │  địa chỉ   │
   └─────┬──────┘
         │ xác nhận đơn
         ▼
   ┌────────────┐
   │ W7 Xác nhận│ (terminal)
   └────────────┘
```

### 3.1 Bảng chuyển trạng thái T1

| Từ | Chuyển hợp lệ | Chuyển **không hợp lệ** | Test case |
|---|---|---|---|
| **W0** | → W1 | ✗ chọn gói · ✗ quay lại · ✗ xác nhận | `TC-T1-M4-004` |
| **W1** | → W2 · → W0 | ✗ xác nhận | `TC-T1-M4-009` |
| **W2** | → W3 · → W1 | ✗ xác nhận | `TC-T1-M4-010` |
| **W3..W6** | → bước kế tiếp · → bước trước | ✗ nhảy thẳng sang xác nhận | `TC-T1-M4-011`, `TC-T1-M4-012` |
| **W7** | — | ✗ mọi chuyển | — |

### 3.2 Nhánh phụ — chọn "Tại nhà" tại W5

| Từ | Điều kiện | Chuyển | Test case |
|---|---|---|---|
| **W5** | Chọn "Tại spa" | → W7 (bỏ qua W6) | `TC-T1-M6-001` |
| **W5** | Chọn "Tận nhà" | → W6 (bắt buộc nhập địa chỉ) | `TC-T1-M6-002` |

### 3.3 Trạng thái chưa kiểm thử của T1

| Trạng thái | Mô tả | Ghi chú |
|---|---|---|
| **W4b** | Chọn ngày rồi quay lại W3, đổi cân nặng → giá cập nhật? | Ứng viên bổ sung ca — kiểm tra tính nhất quán giá khi đổi bậc |
| **W5b** | Chọn "Tại nhà" nhưng bỏ trống địa chỉ ở W6, bấm xác nhận | Kỳ vọng bị chặn — ứng viên ca |
| **W7b** | Sửa địa chỉ sau khi đã chọn "Tại nhà" | Phụ thu di chuyển phải cập nhật |

---

## 4. Drawer "Book Now" T3 — trạng thái `B0..B5`

| Trạng thái | Mô tả | Test case |
|---|---|---|
| **B0** | Drawer đóng, nút "Book Now" hiện trên trang | `TC-T3-M4-005` |
| **B1** | Drawer mở, đã nhập số điện thoại hợp lệ | `TC-T3-M4-001` |
| **B2** | Drawer mở, SĐT sai định dạng → nút `Login` bị khoá | `TC-T3-M4-003`, `TC-T3-M4-004`, `TC-T3-M4-010` |
| **B3** | *(sau cổng khách hàng)* Chọn khung giờ **trong** giờ mở cửa (08:00–20:00) → được chấp nhận | `TC-T3-M5-004` |
| **B4** | *(sau cổng khách hàng)* Chọn khung giờ **ngoài** giờ mở cửa → bị từ chối kèm lý do | `TC-T3-M5-003` |
| **B5** | Quay lại giữ nguyên lựa chọn | `TC-T3-M4-007`, `TC-T3-M4-011` |

**Điểm khác biệt quan trọng (từ RV-06, Inspection Ngày 3):** T3 **không có bước chọn ngày** và **không có ô nhập cân nặng** — trạng thái luồng của T3 ngắn hơn hẳn T1/T2. Nếu thiết kế test theo khuôn mẫu wizard T1/T2 thì sẽ sinh ra ca test cho một bước **không tồn tại**.

> **Giới hạn kiểm thử của `B3`/`B4` (bổ sung 2026-11-19, CR `CHG-2026-11-19-02`).** Kiểm chứng sống ngày 19 cho thấy drawer "Book Now" của T3 chỉ có **1 ô nhập SĐT + 1 ô chọn quốc gia + 1 nút `Login`** — **không có màn chọn khung giờ** trong luồng công khai (DOM: `1 input[type=tel]`, `1 select`, `0` phần tử chứa `AM`/`PM`, `0` nút chọn ngày; API `/booking-api/v1/appointment` → HTTP 404). Bước chọn khung giờ chỉ xuất hiện **sau khi** SĐT được xác thực thuộc hồ sơ khách đã có, tức nằm sau cổng `FR-M4-13` và **vượt ra ngoài ranh giới kiểm thử không phá hại** (ADR-11). Vì vậy `TC-T3-M5-003` / `TC-T3-M5-004` được đánh dấu **Blocked** — không phải Pass, cũng không phải lỗi của site đích.

---

## 5. Accordion FAQ T1 (FR-M7-06) — trạng thái `Q0..Q3`

| Trạng thái | Mô tả | Test case |
|---|---|---|
| **Q0** | Tất cả mục FAQ đóng | `TC-T1-M7-003` |
| **Q1** | Một mục mở, biểu tượng ở trạng thái "mở" | `TC-T1-M7-003` |
| **Q2** | ≥ 2 mục mở đồng thời, không đóng lẫn nhau | `TC-T1-M7-003` |
| **Q3** | Đóng lại mục đang mở, biểu tượng trở về "đóng" | `TC-T1-M7-003` |

---

## 6. Ví dụ thật trích từ test case

### 6.1 Ví dụ 1 — chuyển không hợp lệ bị chặn đúng

`TC-T2-M4-013`: từ **S0** (chưa chọn loài), thử bỏ qua bước 1 và đi thẳng bước 2 → nút "Tiếp tục" **bị khoá**. Kỳ vọng theo bảng: `S0 ✗ chọn bậc`.

**Vì sao đây là ca quan trọng nhất của kỹ thuật này:** nếu site cho bỏ qua bước chọn bậc cân nặng thì giá ở bước 3 sẽ được tính theo bậc mặc định — khách bị tính **sai giá** mà không có dấu hiệu nào. Chuyển không hợp lệ là nơi lỗi "âm thầm" xảy ra.

### 6.2 Ví dụ 2 — quay lại phải giữ lựa chọn

`TC-T2-M4-009`: từ **S3** (đã chọn dịch vụ) quay lại **S2** → loài và bậc cân nặng đã chọn **vẫn còn**. Đây là chuyển hợp lệ theo bảng (`S3 → S2`), đồng thời là hệ quả của yêu cầu `FR-M4-08`.

`TC-T1-M4-007` là ca tương ứng cho T1: quay lại từ bước 3 giữ nguyên loài và cân nặng.

### 6.3 Ví dụ 3 — trạng thái phụ bị bỏ sót nếu không rà soát

Ca `TC-T3-M4-005` (T3 **không có bước chọn ngày**) chỉ tồn tại vì nhóm rà soát lại ma trận trạng thái sau Inspection. Nếu chỉ sao chép cấu trúc wizard T1/T2 sang T3 thì nhóm sẽ viết ca "chọn ngày mong muốn trên T3" — một ca test **không thể thực hiện**, và sẽ bị đánh dấu Blocked trong khi thực tế site không có lỗi.

---

## 7. Hạn chế và khi nào KHÔNG dùng ST

| Hạn chế | Giải thích | Xử lý trong dự án |
|---|---|---|
| **Chỉ mô hình hoá được trạng thái quan sát qua UI** | Trạng thái nội bộ (VD: T2 gửi form thành công → hệ thống tạo lịch ở DB) không quan sát được | Chỉ mô hình hoá 4 nhóm trạng thái UI: wizard T1, wizard T2, drawer T3, accordion FAQ |
| **ST không mô tả được logic nghiệp vụ phức tạp** | Chính sách hủy/đổi lịch không phải trạng thái | Dùng **DT** (`docs/design/decision-tables.md` §A.6) |
| **ST không đảm bảo bao phủ dữ liệu trong trạng thái** | Cùng một trạng thái nhưng dữ liệu sai vẫn hỏng | Kết hợp **EP/BVA** cho dữ liệu trong mỗi trạng thái (`docs/design/test-design-techniques.md`) |
| **Số trạng thái tăng nhanh theo số bước wizard** | Mỗi bước thêm 1 trạng thái và 2–3 chuyển | Chỉ mô hình hoá các bước **có quyết định rẽ nhánh** (chọn tại spa/tại nhà, gửi form hợp lệ/không) |
| **ST bỏ sót trạng thái nếu không rà soát định kỳ** | Site có thể thêm bước mới giữa kỳ | Rà soát ma trận trạng thái sau mỗi vòng thực thi (Ngày 12) + phiên khám phá |

---

## 8. Đối chiếu yêu cầu

| Yêu cầu Hướng 2 | Mức độ đáp ứng của tài liệu này |
|---|---|
| **H2-2 Thiết kế test** | 3 đồ thị trạng thái (T1, T2, T3) + 1 bảng trạng thái (FAQ T1) + 6 trạng thái chưa kiểm thử được đánh dấu để rà ở vòng 2 → **19 test case** truy xuết về SRS §5, §8 |

Người review chéo: **Lộc** (Ngày 8) · Đóng góp vào `docs/design/test-design-techniques.md`.
