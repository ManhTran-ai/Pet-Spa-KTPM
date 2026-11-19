# Thiết kế test — Bảng quyết định (Decision Table) và Chuyển đổi trạng thái (State Transition)

Mã tài liệu: TD-DT-ST · Phiên bản 1.0 · Ngày 2026-11-19 · Người phụ trách: **Ngân (TV3)**

Đầu vào: SRS-01 v1.2 §8.1, §8.2, §8.3, §8.4, §6 (BR-01..BR-18) · Phục vụ yêu cầu **H2-2** của Hướng 2 · Test case sinh ra: 20 ca DT + 19 ca ST = 39/226 ca

---

# PHẦN A — BẢNG QUYẾT ĐỊNH

## A.1 Cơ sở lý thuyết

**Decision Table Testing** (Cẩm nang §4.4): biểu diễn quan hệ giữa **điều kiện** (conditions) và **hành động/kết quả** (actions) dưới dạng bảng. Mỗi cột của bảng là một **quy tắc**; tập hợp các quy tắc tạo thành bộ test case tối thiểu bao phủ hết các tổ hợp điều kiện.

Quy trình 4 bước áp dụng: (1) xác định điều kiện · (2) xác định hành động · (3) lập bảng quyết định · (4) chọn tập quy tắc tối thiểu bao phủ hết các tổ hợp quan trọng.

## A.2 Bảng quyết định 1 — Phụ thu di chuyển T1 (SRS §8.4)

**Điều kiện:** C1 = khoảng cách (km) · C2 = có chọn "Tại nhà" hay không.
**Quy tắc:** theo BR-04 `max(0, km − 5) × 8.000₫` và BR-16 (chỉ dịch vụ tại nhà mới phát sinh phụ thu).

| # | C1: khoảng cách | C2: hình thức | Phụ thu di chuyển | Phụ thu gói tại nhà | Test case |
|---|---|---|---|---|---|
| **R1** | ≤ 5 km | Tại nhà | 0₫ | +50.000₫ (Tắm) | `TC-T1-M6-003`, `TC-T1-M6-004`, `TC-T1-M6-005` |
| **R2** | 6 km | Tại nhà | 8.000₫ | +50.000₫ | `TC-T1-M6-006` |
| **R3** | 7 km | Tại nhà | 16.000₫ | +50.000₫ | `TC-T1-M6-007` |
| **R4** | 10 km | Tại nhà | 40.000₫ | +50.000₫ | `TC-T1-M6-008` |
| **R5** | 15 km | Tại nhà | 80.000₫ | +50.000₫ | `TC-T1-M6-009` |
| **R6** | 20 km | Tại nhà | "Liên hệ báo giá riêng" | +50.000₫ | `TC-T1-M6-010` |
| **R7** | Bất kỳ | **Tại spa** | 0₫ | 0₫ | `TC-T1-M6-001` (chọn "đến spa"), `TC-T1-M6-002` (chọn "tại nhà") |

**Quy tắc rút gọn (đã áp dụng):** R2–R5 cùng cấu trúc → rút thành **3 quy tắc đại diện** theo dải BR-05 (biên trong dải, giữa dải, biên giữa dải) thay vì duyệt mọi số km. Nhóm vẫn giữ **8 ca** để phủ biên.

> **Lỗi đã phát hiện khi review chéo (Ngày 8, reviewer Mạnh):** R7 trước đây chỉ trỏ tới `TC-T1-M6-001`, nhưng ca đó chỉ kiểm tra **sự hiện diện của lựa chọn** "đến spa" trong wizard (technique ST) chứ **không** kiểm tra phụ thu bằng 0₫. Để phủ đúng R7 cần cả nhánh "tại nhà" của cùng điều kiện → đã bổ sung `TC-T1-M6-002`.

## A.3 Bảng quyết định 2 — Phụ thu gói tại nhà T1 (BR-06, BR-16)

**Điều kiện:** C1 = gói dịch vụ đã chọn.

| # | C1: gói | Phụ thu cố định tại nhà | Test case |
|---|---|---|---|
| **R1** | Tắm | +50.000₫ | `TC-T1-M6-011` |
| **R2** | Cạo | +80.000₫ | `TC-T1-M6-012` |
| **R3** | Combo Tắm + Cạo | +100.000₫ | `TC-T1-M6-013` |
| **R4** | Gói khác (không hỗ trợ tại nhà) | Không có lựa chọn "Tại nhà" | `TC-T1-M6-002` |
| **R5** | Tổng = giá gói + phụ thu cố định + phụ thu di chuyển | Tổng đúng | `TC-T1-M6-014` |

## A.4 Bảng quyết định 3 — Giá theo loài × bậc cân nặng (FR-M3-02)

**Điều kiện:** C1 = loài (Chó/Mèo) · C2 = bậc cân nặng · C3 = dịch vụ.

| # | C1: loài | C2: bậc | C3: dịch vụ | Kết quả mong đợi | Test case |
|---|---|---|---|---|---|
| **R1** | Chó | 5–10 kg | Combo Tắm+Vệ sinh | 375.000₫ | `TC-T1-M3-002` |
| **R2** | **Mèo** | 5–10 kg | Combo Tắm+Vệ sinh | **405.000₫** (≠ R1) | `TC-T1-M3-003` |
| **R3** | Chó | >3–6 kg | Combo Tắm Vệ Sinh (T2) | 200.000₫ | `TC-T2-M3-002` |
| **R4** | **Mèo** | >3–6 kg | Combo Tắm Vệ Sinh (T2) | **200.000₫ (BẰNG R3)** — T2 dùng chung bảng giá | `TC-T2-M3-003` |
| **R5** | Chó | 20–50 lbs | Dog Bath (T3) | $65 | `TC-T3-M3-002` |
| **R6** | Mèo | 0–20 lbs | Cat Bath (T3) | $60 — dịch vụ khác nhóm | `TC-T3-M3-003` |

> **Quan trọng (theo RV-01, Inspection Ngày 3):** R1≠R2 nhưng R3=R4 — vì **T2 công bố một bảng giá dùng chung cho Chó và Mèo**. Bảng quyết định này ghi rõ kỳ vọng **khác nhau theo hệ thống**, đồng thời là bằng chứng đối chiếu khi chạy trên cả 3 site.

## A.5 Bảng quyết định 4 — Dịch vụ "báo giá riêng" T2 (BR-07, FR-M3-04)

**Điều kiện:** C1 = dịch vụ thuộc nhóm báo giá riêng.

| # | C1: dịch vụ | Kết quả mong đợi | Test case |
|---|---|---|---|
| **R1** | Gỡ rối | Khoảng 50.000–500.000₫ hoặc "tuỳ thiết kế"; **không** con số đơn lẻ | `TC-T2-M3-008` |
| **R2** | Tẩy ố | Như R1 | `TC-T2-M3-008` |
| **R3** | Tắm trắng | Như R1 | `TC-T2-M3-008` |
| **R4** | Xả dưỡng | Như R1 | `TC-T2-M3-008` |
| **R5** | Nhuộm hình lớn | "Tuỳ thiết kế" | `TC-T2-M3-008` |
| **R6** | Nhuộm tạo hình cơ thể | "Tuỳ thiết kế" | `TC-T2-M3-008` |

## A.6 Bảng quyết định 5 — Chính sách hủy / đổi lịch (SRS §8.3)

**Điều kiện:** C1 = hệ thống · C2 = điều kiện thời gian hủy · C3 = có thông báo trước hay không.

| # | C1 | C2 | C3 | Kết quả mong đợi | Test case |
|---|---|---|---|---|---|
| **R1** | T1 | Hủy trước khi cân nặng đạt mức miễn phí | — | Miễn phí | `TC-T1-M5-005` |
| **R2** | T1 | Hủy sau mức miễn phí | — | Có nêu rõ thời gian và phí | `TC-T1-M5-004` |
| **R3** | T2 | Hủy trước thời hạn | Có | Hoàn cọc | `TC-T2-M5-004` |
| **R4** | T2 | Hủy muộn | Không | Không hoàn cọc | `TC-T2-M5-005` |
| **R5** | Cả 3 | — | — | Nội dung **tìm thấy được trong ≤ 2 lần click** từ trang đặt lịch, có con số cụ thể | `TC-T1-M5-003`, `TC-T2-M5-003`, `TC-T3-M5-002` |

---

# PHẦN B — CHUYỂN ĐỔI TRẠNG THÁI

> Phần này đã tách thành tài liệu riêng: **`docs/design/state-transition.md`** (cùng người phụ trách, cùng ngày).

---
## B. Ví dụ thật trích từ test case

### B.1 Ví dụ 1 — DT đảo chiều kỳ vọng sau phát hiện thực tế

`TC-T2-M3-003` (DT · quy tắc R4): chọn **Mèo**, bậc `>3–6kg`, Combo Tắm Vệ Sinh → kỳ vọng **200.000₫, BẰNG** với ca Chó (`TC-T2-M3-002`).

**Bối cảnh:** trước Inspection Ngày 3, tiêu chí `FR-M3-02` yêu cầu Chó ≠ Mèo cho **mọi** hệ thống. Probe thực tế trên T2 (`reports/raw/survey-day03-open-cr.json`) đo được giá **bằng nhau** ở cả 2 bậc → đây là **hành vi thiết kế hợp lệ của T2** (một bảng giá dùng chung), không phải lỗi site.

**Bài học cho Hướng 2:** khi đặc tả đích được viết từ suy luận thay vì quan sát, kỹ thuật DT buộc phải **kiểm chứng từng quy tắc bằng dữ liệu thật** — nếu không, bảng quyết định sẽ mang kỳ vọng sai. Đây là lý do nhóm chạy **Inspection có bằng chứng** trước khi chốt bảng quyết định.

### B.2 Ví dụ 2 — DT kiểm tra tổng tiền, không chỉ từng thành phần

`TC-T1-M6-014`: chọn gói Tắm tại nhà, khoảng cách 7 km → tổng tiền phải bằng **giá gói + 50.000₫ (phụ thu cố định BR-06) + 16.000₫ (phụ thu di chuyển BR-04)**.

**Vì sao cần quy tắc R5 riêng:** các quy tắc R1–R4 kiểm tra từng khoản phụ thu **riêng lẻ** đều đúng, nhưng site vẫn có thể **cộng sai** khi ra tổng. Một bảng quyết định chỉ kiểm tra từng thành phần sẽ bỏ sót lỗi này.

### B.3 Ví dụ 3 — DT với điều kiện phụ thuộc nhau

`TC-T1-M6-005` (5 km, biên dải miễn phí) và `TC-T1-M6-006` (6 km, biên dải 5–10): cùng C2 = "Tại nhà", chỉ C1 thay đổi → kết quả 0₫ → 8.000₫.

**Bài học thiết kế:** "khoảng cách" và "hình thức" **không độc lập** (không thể có khoảng cách mà không chọn hình thức) → cột tương ứng vô nghĩa. Nhóm đã **rút gọn** bảng §A.2 thành các dải BR-05 thay vì duyệt 2ⁿ tổ hợp. Phần chuyển trạng thái được tách riêng sang `docs/design/state-transition.md`.

---

## C. Hạn chế và khi nào KHÔNG dùng DT

| Hạn chế | Giải thích | Xử lý trong dự án |
|---|---|---|
| **DT bùng nổ số quy tắc** | n điều kiện → 2ⁿ tổ hợp | Chỉ dùng cho bảng có **≤ 3 điều kiện**; bảng §8.3 có 5 cột điều kiện nên được **rút gọn** thành 5 quy tắc kiểm tra *tính tìm thấy* thay vì duyệt 32 tổ hợp |
| **DT không phát hiện lỗi tuần tự thời gian** | 2 lần hủy liên tiếp có thể khác 1 lần hủy | Bổ sung ca khám phá 60 phút/site (Lộc, Ngày 11) |
| **DT yêu cầu điều kiện độc lập** | Nếu 2 điều kiện luôn đi kèm nhau thì cột tương ứng vô nghĩa | R5 của bảng §8.4: "khoảng cách" và "hình thức" không độc lập → đã rút gọn thành dải BR-05 |
| **ST không mô tả được logic nghiệp vụ phức tạp** | Ví dụ chính sách hủy không phải trạng thái | Dùng **DT** cho chính sách hủy (bảng §A.6) |
| **ST giả định trạng thái quan sát được** | Trạng thái nội bộ không lộ ra UI thì không kiểm chứng được | Chỉ mô hình hoá trạng thái **quan sát được qua UI** (wizard T1/T2, drawer T3, accordion FAQ) |
| **ST không đảm bảo bao phủ dữ liệu** | Cùng một trạng thái nhưng dữ liệu sai vẫn hỏng | Kết hợp **EP/BVA** cho dữ liệu trong mỗi trạng thái (`docs/design/test-design-techniques.md`) |

---

## D. Đối chiếu yêu cầu

| Yêu cầu Hướng 2 | Mức độ đáp ứng của tài liệu này |
|---|---|
| **H2-2 Thiết kế test** | 6 bảng quyết định + 3 đồ thị chuyển trạng thái (T1, T2, T3) + 1 bảng trạng thái (FAQ) → **39 test case** truy xuết về SRS §5, §6, §8 |

Người review chéo: **Mạnh** (Ngày 8) · Đóng góp vào `docs/design/test-design-techniques.md`.
