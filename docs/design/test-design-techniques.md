# Thiết kế test — Phân vùng tương đương (EP) và Phân tích giá trị biên (BVA)

Mã tài liệu: TD-EP-BVA · Phiên bản 1.0 · Ngày 2026-11-19 · Người phụ trách: **Tài (TV2)**

Đầu vào: SRS-01 v1.2 (§5, §6, §7) · Phục vụ yêu cầu **H2-2** của Hướng 2 (thiết kế test) · Test case sinh ra: 24 ca EP + 34 ca BVA = 58/226 ca

---

## 1. Cơ sở lý thuyết

| Kỹ thuật | Nguồn | Tóm tắt |
|---|---|---|
| **Phân vùng tương đương (Equivalence Partitioning)** | Cẩm nang §4.2 | Chia miền đầu vào thành các lớp tương đương về hành vi; chọn **một** đại diện đại lý cho mỗi lớp hợp lệ và **một** cho mỗi lớp không hợp lệ |
| **Phân tích giá trị biên (Boundary Value Analysis)** | Cẩm nang §4.3 | Lỗi thường tích lũy quanh **ranh giới** miền, không phải giữa miền; kiểm tra `min−1`, `min`, `min+1`, `max−1`, `max`, `max+1` |

Nguyên tắc áp dụng trong dự án: **mỗi giá trị không hợp lệ một ca riêng** (để tránh Defect masking — nguyên tắc trong kế hoạch 14 ngày §3).

---

## 2. EP — Bảng phân vùng

### 2.1 Số điện thoại / Zalo (T2) — ràng buộc SRS §7

| Lớp | Điều kiện | Đại diện | Kết quả mong đợi | Test case |
|---|---|---|---|---|
| **P1 — Hợp lệ** | Chuỗi số 10–15 chữ số, bắt đầu bằng `0` | `0987654321` (10 số) | Chấp nhận, cho gửi form | `TC-T2-M4-005` |
| **P2 — Hợp lệ (biên trên)** | 15 chữ số | `098765432109876` | Chấp nhận | `TC-T2-M4-004` |
| **P3 — Không hợp lệ: chứa chữ cái** | Có ký tự không phải số | `0987abc432` | Từ chối, báo lỗi | `TC-T2-M4-003` |
| **P4 — Không hợp lệ: quá ngắn** | < 10 chữ số | `098765432` (9 số) | Từ chối hoặc cảnh báo | `TC-T2-M4-004` |
| **P5 — Không hợp lệ: quá dài** | > 15 chữ số | 16 chữ số | Từ chối hoặc cảnh báo | `TC-T2-M4-004` |
| **P6 — Không hợp lệ: rỗng** | Không nhập | (để trống) | Không gửi được, báo đúng tên trường | `TC-T2-M4-002` |
| **P7 — Không hợp lệ: không bắt đầu bằng 0** | `987654321` | — | Từ chối | `TC-T2-M4-005` (kiểm tra biên) |

### 2.2 Tên bé (T1, T2) — ràng buộc SRS §7

| Lớp | Điều kiện | Đại diện | Kết quả mong đợi | Test case |
|---|---|---|---|---|
| **P1 — Hợp lệ** | 1–50 ký tự | `Bông` | Chấp nhận | `TC-T1-M4-002` |
| **P2 — Hợp lệ (biên)** | Đúng 50 ký tự | 50 ký tự | Chấp nhận | `TC-T1-M4-002` |
| **P3 — Không hợp lệ: rỗng** | Không nhập | (để trống) | T2 cho gửi (tên là tuỳ chọn) | `TC-T2-M4-001` |
| **P4 — Không hợp lệ: quá dài** | > 50 ký tự | 51 ký tự | Cắt bớt hoặc cảnh báo | `TC-T1-M4-002` |

### 2.3 Ngày mong muốn (T1, T2) — ràng buộc SRS §7

| Lớp | Điều kiện | Đại diện | Kết quả mong đợi | Test case |
|---|---|---|---|---|
| **P1 — Hợp lệ: hôm nay** | = ngày hiện tại | 19/11/2026 | Chấp nhận | `TC-T2-M4-006` |
| **P2 — Hợp lệ: ngày mai** | +1 ngày | 20/11/2026 | Chấp nhận | `TC-T2-M4-006` |
| **P3 — Hợp lệ: trong 30 ngày** | +1 … +30 | 25/11/2026 | Chấp nhận | `TC-T2-M4-006` |
| **P4 — Hợp lệ (biên trên)** | = +30 ngày | 19/12/2026 | Chấp nhận | `TC-T2-M4-007` |
| **P5 — Không hợp lệ: quá khứ** | < hôm nay | 18/11/2026 | Chặn tại tầng input (`min`) | `TC-T2-M4-006` |
| **P6 — Ranh giới hành vi thật** | > +30 ngày | 18/01/2027 | **Được nhập** (T2 không đặt `max`) — ghi nhận là hành vi thật, không phải lỗi | `TC-T2-M4-007` → DEF-022 |

### 2.4 Bậc cân nặng (T1, T2) — BR-01, BR-02

| Lớp | T1 (kg) | T2 (kg) | Kết quả mong đợi |
|---|---|---|---|
| P1 — Nhỏ nhất | `<3` | `<3` | Bậc đầu tiên trong bảng giá |
| P2–P6 — Bậc giữa | `3–5`, `5–10`, `10–15`, `15–20`, `20–25` | `>3–6`, `>6–10`, `>10–20`, `>20–30`, `>30–40` | Tra đúng cột bảng giá |
| P7 — Lớn nhất | `25–30` | `>40` | Bậc cuối trong bảng giá |

> **Lưu ý Hướng 2:** vì T1/T2 **không có ô nhập cân nặng** mà chỉ chọn *bậc*, EP ở đây được áp dụng cho **giá trị biên của bậc** (chuyển sang BVA ở mục 3), không áp dụng cho "nhập số cân nặng".

### 2.5 Dịch vụ (T1, T2, T3) — BR-11, BR-03

| Lớc | T1 | T2 | T3 |
|---|---|---|---|
| P1 — Combo trọn gói | 3 combo | 4 combo | Không có |
| P2 — Dịch vụ lẻ | Không (chỉ gói) | 6 dịch vụ lẻ | 12 quick service + 7 add-on |
| P3 — Dịch vụ nhuộm | Không có | 3 loại | Không có |
| P4 — "Báo giá riêng" | Không có | 6 loại | Không có |
| P5 — Có tại nhà | 4/6 gói | Không có | Không có |
| P6 — Chỉ tại spa | 2/6 gói | Không có | Toàn bộ |

### 2.6 Từ khoá tìm kiếm (T2) — FR-M7-02

| Lớp | Điều kiện | Đại diện | Kết quả mong đợi | Test case |
|---|---|---|---|---|
| **P1 — Hợp lệ, có kết quả** | Từ khoá tồn tại | `spa` | Lọc danh sách theo từ khoá | `TC-T2-M7-001` |
| **P2 — Hợp lệ, không phân biệt hoa thường** | `SPA` vs `spa` | `SPA` | Cùng kết quả với `spa` | `TC-T2-M7-002` |
| **P3 — Rỗng** | Chuỗi rỗng | `""` | Không gây lỗi, hiển thị toàn bộ | `TC-T2-M7-003` |
| **P4 — Không tồn tại** | Từ khoá vô nghĩa | `zzzzz` | Thông báo rõ ràng "không tìm thấy" | `TC-T2-M7-004` |
| **P5 — Biên độ dài** | 100 ký tự | 100 ký tự | Không vỡ layout | `TC-T2-M7-004` |

### 2.7 Địa chỉ tại nhà (T1) — FR-M6-02

| Lớc | Điều kiện | Đại diện | Kết quả mong đợi | Test case |
|---|---|---|---|---|
| **P1 — Hợp lệ, gần** | ≤ 5 km | Địa chỉ "A1 Westgate, Bình Chánh" | 0₫ phụ thu di chuyển | `TC-T1-M6-003` … `TC-T1-M6-005` |
| **P2 — Hợp lệ, xa** | 5–15 km | Địa chỉ ~10 km | Phụ thu theo công thức BR-04 | `TC-T1-M6-008` |
| **P3 — Ranh giới dải** | > 15 km | Địa chỉ ~20 km | "Liên hệ báo giá riêng", không hiện con số | `TC-T1-M6-018`, `TC-T1-M6-019` |
| **P4 — Không hợp lệ** | < 5 ký tự | `abc` | Chặn gửi | `TC-T1-M4-002` |

---

## 3. BVA — Bảng giá trị biên

### 3.1 Ngưỡng cân nặng T1 (BR-01) — 12 ca

Áp dụng BVA 3 giá trị (Robust) tại mỗi ngưỡng.

| Ngưỡng | `min−1` | `min` | `min+1` | Bậc kỳ vọng ở `min` | Test case |
|---|---|---|---|---|---|
| 3 kg | 2,9 kg | 3 kg | 3,1 kg | `3–5` | `TC-T1-M3-007/008/009` |
| 5 kg | 4,9 kg | 5 kg | 5,1 kg | `5–10` | `TC-T1-M3-010/011` |
| 10 kg | 9,9 kg | 10 kg | 10,1 kg | `10–15` | `TC-T1-M3-012/013/014` |
| 15 kg | 14,9 kg | 15 kg | 15,1 kg | `15–20` | `TC-T1-M3-015` |
| 20 kg | 19,9 kg | 20 kg | 20,1 kg | `20–25` | `TC-T1-M3-016` |
| 25 kg | 24,9 kg | 25 kg | 25,1 kg | `25–30` | `TC-T1-M3-017` |
| 30 kg | 29,9 kg | 30 kg | 30,1 kg | Trên 30 kg | `TC-T1-M3-018` |

### 3.2 Ngưỡng cân nặng T2 (BR-02) — 13 ca

| Ngưỡng | `min−1` | `min` | `min+1` | Bậc kỳ vọng ở `min` | Test case |
|---|---|---|---|---|---|
| 3 kg | 2,9 kg | 3 kg | 3,1 kg | `>3–6` | `TC-T2-M3-012/013/014` |
| 6 kg | 5,9 kg | 6 kg | 6,1 kg | `>6–10` | `TC-T2-M3-015/016` |
| 10 kg | 9,9 kg | 10 kg | 10,1 kg | `>10–20` | `TC-T2-M3-017/018` |
| 20 kg | 19,9 kg | 20 kg | 20,1 kg | `>20–30` | `TC-T2-M3-019/020` |
| 30 kg | 29,9 kg | 30 kg | 30,1 kg | `>30–40` | `TC-T2-M3-021/022` |
| 40 kg | 39,9 kg | 40 kg | 40,1 kg | `>40` | `TC-T2-M3-023/024` |

> **Quy tắc biên của T2: cận dưới ĐÓNG.** Mỗi bậc chứa cân nặng từ cận dưới
> của nó trở đi cho tới cận trên của bậc kế tiếp:
> `<3kg` = kg < 3 · `>3–6kg` = 3 ≤ kg ≤ 6 · `>6–10kg` = 6 < kg ≤ 10 ·
> `>10–20kg` = 10 < kg ≤ 20 · … · `>40kg` = kg > 40.
>
> Nhãn trên site (`>3–6kg`, `>6–10kg`…) là **quy ước đặt tên**: mỗi bậc mang
> nhãn cận dưới của bậc kế tiếp, chứ không phải phép so sánh nghiêm ngặt.
> Vì vậy **cân nặng đúng bằng cận dưới thuộc bậc có nhãn đó** (6 kg → `>6–10kg`,
> không phải `>3–6kg`).
>
> **Bằng chứng hành vi thật** (`reports/raw/probe-t2-bva3.json`): calculator tính
> giá đúng theo bảng giá tĩnh — `<3kg` = 120k, `>3–6kg` = 200k, `>6–10kg` = 300k,
> `>10–20kg` = 400k (Combo Tắm Vệ Sinh). Cài đặt: `tests/e2e/t2/m3-bva.spec.ts`
> (`bacCho`), quy tắc chọn bậc = bậc có **cận dưới lớn nhất** mà vẫn ≤ kg.

### 3.3 Ngưỡng cân nặng T3 (BR-03, đơn vị lbs) — 9 ca

**BVA phải áp dụng *trên từng dòng sản phẩm***, vì `BR-03` quy định mỗi dòng có bộ ngưỡng riêng. Bộ 9 ca dưới đây chia cho **2 dòng sản phẩm**:

| Dòng sản phẩm | Ngưỡng | `min−1` | `min` | `min+1` | Bậc kỳ vọng ở `min` | Test case |
|---|---|---|---|---|---|---|
| **Dog Bath** | 20 lbs | 19 lbs | 20 lbs | 21 lbs | `20–50lbs` | `TC-T3-M3-006/007/008` |
| **Dog Full Groom** | 61 lbs | 60 lbs | 61 lbs | 62 lbs | `61–78lbs` | `TC-T3-M3-009/010` |
| **Dog Full Groom** | 78 lbs | 77 lbs | 78 lbs | 79 lbs | `79–90lbs` | `TC-T3-M3-011/012` |
| **Dog Full Groom** | 79 lbs | 79 lbs | 79 lbs | 80 lbs | `91–100+lbs` | `TC-T3-M3-013/014` |

> **Đặc thù T3 (từ RV-06, Inspection Ngày 3):** T3 **không có ô nhập cân nặng** — bậc lbs được mã hoá trong *tên dịch vụ*. Vì vậy BVA ở T3 được kiểm chứng bằng cách **tra giá của dịch vụ có tên chứa bậc biên**, không phải nhập số. Test case được viết lại theo hướng này ở RV-06.
>
> **Lỗi đã phát hiện khi review chéo (Ngày 8, reviewer Ngân):** bản đầu của bảng này dùng ngưỡng `50/60/78/90 lbs` và bậc `51–60lbs`. Sai hai chỗ: (a) **bậc `51–60lbs` không tồn tại** trong bất kỳ dòng sản phẩm nào của T3 (`BR-03`); (b) 3 ca đầu thuộc dòng `Dog Bath` còn 6 ca sau thuộc dòng `Dog Full Groom` — trộn hai dòng sản phẩm khác nhau vào một bộ BVA là **vô nghĩa kiểm thử** vì bậc `over 50lbs` của `Dog Bath` không liên quan gì tới `61–78lbs` của `Dog Full Groom`. Đã sửa toàn bộ 9 ca: tách rõ dòng sản phẩm và dùng đúng ngưỡng của từng dòng.

### 3.4 Biên khoảng cách — phụ thu di chuyển T1 (BR-04, BR-05) — 8 ca

Công thức `max(0, km − 5) × 8.000₫`, dải BR-05: `0–5` miễn phí · `5–10`: 40.000–80.000₫ · `10–15`: 80.000–120.000₫ · `>15`: báo giá riêng.

| Giá trị | Kết quả mong đợi | Test case |
|---|---|---|
| 0 km | 0₫ | `TC-T1-M6-003` |
| 2 km | 0₫ | `TC-T1-M6-004` |
| **5 km (biên dải miễn phí)** | 0₫ | `TC-T1-M6-005` |
| **6 km (biên dải 5–10)** | 8.000₫ | `TC-T1-M6-006` |
| 7 km | 16.000₫ | `TC-T1-M6-007` |
| **10 km (biên dải 5–10)** | 40.000₫ | `TC-T1-M6-008` |
| **15 km (biên dải 10–15)** | 80.000₫ | `TC-T1-M6-009` |
| **20 km (biên dải >15)** | "Liên hệ báo giá riêng" | `TC-T1-M6-010` |

### 3.5 Biên độ dài chuỗi (SRS §7) — 4 ca

| Trường | Min | Max | Biên trên (`max+1`) | Test case |
|---|---|---|---|---|
| Số điện thoại | 10 | 15 | 16 | `TC-T2-M4-004` |
| Tên bé | 1 | 50 | 51 | `TC-T1-M4-002` |
| Địa chỉ (tại nhà) | 5 | 200 | 201 | `TC-T1-M4-002` |
| Từ khoá tìm kiếm | 0 | 100 | 101 | `TC-T2-M7-004` |

---

## 4. Ví dụ thật trích từ test case

### 4.1 Ví dụ 1 — EP trên miền rời rạc: SĐT

`TC-T2-M4-003` (EP · lớp P3): nhập `0987abc432` → form **không gửi được**, thông báo lỗi nêu đúng trường "Số điện thoại" (1 thông báo, theo tiêu chí `FR-M4-02`).

**Vì sao tách riêng khỏi P4/P5:** nếu gộp "SĐT sai" thành một ca gồm cả chữ cái lẫn quá ngắn, hệ thống có thể chặn đúng một lỗi và bỏ sót lỗi còn lại → **Defect masking**. Đây là lý do nhóm áp dụng nguyên tắc "mỗi giá trị không hợp lệ một ca riêng".

### 4.2 Ví dụ 2 — BVA tại ngưỡng 10 kg của T1

Ba ca `TC-T1-M3-012` (9,9 kg), `TC-T1-M3-013` (10 kg), `TC-T1-M3-014` (10,1 kg) — kỳ vọng: 9,9 kg → bậc `5–10`; 10 kg → bậc `10–15`; 10,1 kg → bậc `10–15`.

**Vì sao cần cả `min−1`:** nếu site hiển thị bảng giá với nhãn "10–15kg" mà người dùng hiểu là "từ 10 trở lên" thì khách 9,9 kg sẽ bị tính nhầm bậc. Kiểm tra `min−1` bắt được lỗi **diễn giải đánh dấu khoảng**, không chỉ lỗi so sánh số.

### 4.3 Ví dụ 3 — BVA tại ngưỡng 20 lbs của `Dog Bath` (đặc thù Hướng 2)

`TC-T3-M3-006/007/008` — dịch vụ `Dog Bath 0-20lbs` ($52), `Dog Bath 20-50lbs` ($65), `Dog Bath short hair over 50lbs` ($72).

**Vì sao không nhập số:** do T3 mã hoá bậc trong tên dịch vụ và **không có ô nhập cân nặng** (phát hiện RV-06, `docs/reviews/inspection-srs.md`), BVA ở T3 kiểm chứng **tính đúng của giá theo bậc** chứ không phải hành vi nhập. Đây là điểm khác biệt cốt lõi so với hướng "xây hệ thống rồi test": test case phải **bám theo hành vi thật**, nếu không sẽ test một cái không tồn tại.

**Vì sao phải tách theo dòng sản phẩm:** `Dog Bath` và `Dog Full Groom` **không dùng chung bộ ngưỡng** (`BR-03`). BVA trộn hai dòng sẽ tạo ra ca như "61 lbs thuộc bậc `51–60lbs`" — một bậc **không tồn tại** trong danh mục thật. Đây là loại lỗi mà review chéo bắt được, nhưng chạy test thì không: ca vẫn Fail đúng logic, chỉ là Fail vì kỳ vọng bịa ra.

---

## 5. Hạn chế và khi nào KHÔNG dùng EP/BVA

| Hạn chế | Giải thích | Xử lý trong dự án |
|---|---|---|
| **EP không đảm bảo bao phủ tương tác nhiều điều kiện** | EP xử lý từng biến độc lập; khi kết quả phụ thuộc **nhiều** điều kiện cùng lúc, EP không đủ | Chuyển sang **DT** cho ma trận quyết định (Ngân) — `docs/design/decision-tables.md` |
| **EP không đảm bảo bao phủ trạng thái** | EP không mô tả vòng đời | Chuyển sang **ST** cho wizard (Ngân) — `docs/design/state-transition.md` |
| **BVA không áp dụng cho miền liên tục không rõ biên** | Ví dụ phụ thu T1 cần **ước lượng km từ địa chỉ** — không có ô nhập km, nên "biên" không quan sát được trực tiếp | Dùng **quy tắc nghiệp vụ BR-04/BR-05** làm oracle thay vì đo trên UI; ghi rõ trong `TC-T1-M6-018/019` rằng UI hiển thị theo dải chứ không theo con số |
| **BVA tốn số ca** | 6n+1 × nhiều miền | Chỉ BVA cho **ngưỡng cân nặng** (rủi ro cao nhất về doanh thu) và **biên khoảng cách**; các miền còn lại dùng EP |
| **BVA không phát hiện lỗi logic tổ hợp** | Ví dụ bảng giá tính đúng từng ô nhưng tổng tiền sai | Bổ sung `TC-T1-M6-014` (tổng = giá gói + phụ thu cố định + phụ thu di chuyển) |

---

## 6. Đối chiếu yêu cầu

| Yêu cầu Hướng 2 | Mức độ đáp ứng của tài liệu này |
|---|---|
| **H2-2 Thiết kế test** | EP + BVA cho 3 hệ thống: 5 trường dữ liệu (SĐT, tên bé, ngày, cân nặng, địa chỉ, từ khoá), 4 bảng biên cân nặng, 1 bảng biên khoảng cách → **58 test case** truy xuất về SRS §5, §6, §7 |

Người review chéo: **Ngân** (Ngày 8) · Tổng hợp vào `docs/design/test-design-techniques.md`.
