# Thiết kế test — Phân tích tĩnh, Rà soát và McCabe V(G) / mức bao phủ

Mã tài liệu: TD-MCCABE · Phiên bản 1.0 · Ngày 2026-11-19 · Người phụ trách: **Mạnh (TV1, Test Lead)**

Đầu vào: SRS-01 v1.2 §8.1, §8.3, §8.4 · Cẩm nang §3.1–§3.4, §5.2–§5.4 · Phục vụ yêu cầu **H2-2** của Hướng 2 (thiết kế test) · Test case sinh ra: **20 ca DT** (đã sinh ở `docs/design/decision-tables.md`) được **đo lại bằng V(G)**

> **Vì sao một hệ thống không có mã nguồn vẫn tính được McCabe?** Vì SRS-01 v1.2 §8 đã mô hình hoá **4 bảng quyết định kiểm thử** (ma trận trạng thái wizard T1/T2, chính sách hủy, phụ thu di chuyển). Mỗi bảng quyết định chính là một **đồ thị luồng điều khiển** rút gọn: mỗi **nút điều kiện** (Predicate Node) là một ô quy tắc có điều kiện, mỗi **cạnh** là một nhánh T/F. Ta dựng CFG từ bảng quyết định, tính \(V(G) = P + 1\), rồi đối chiếu với số test case thực sự tồn tại trong `docs/testcases/*.csv`.
>
> Đây là **Verification** (kiểm chứng bộ test đủ sức phủ), không phải Validation — đúng mô hình V thích nghi theo ADR-13.

---

## 1. Cơ sở lý thuyết

### 1.1 Kiểm thử tĩnh — định nghĩa và lợi ích (Cẩm nang §3.1)

Kiểm thử tĩnh đánh giá sản phẩm phần mềm **mà không cần thực thi chương trình**. Ba lợi ích được Cẩm nang nêu và đều được nhóm đo được ở đây:

| Lợi ích | Cách nhóm thể hiện trong dự án | Bằng chứng |
|---|---|---|
| Phát hiện và khắc phục lỗi **sớm**, giảm chi phí sửa lỗi hàng chục lần | Inspection SRS-01 ngày 3 phát hiện **10 lỗi RV-01…RV-10** (2 Major) **trước khi** viết test case | `docs/reviews/inspection-srs.md` |
| Nâng cao năng lực giao tiếp, hiểu chung giữa các thành viên | Mỗi thành viên có **1 tài liệu thiết kế riêng** + **review chéo** (EC-8); hội trường thiết kế test ngày 8 | `docs/design/design-index.csv`, `docs/ASSIGNMENT.md` §3A.4 |
| Rút ngắn thời gian phát triển và giảm khối lượng kiểm thử lại | Bộ 226 ca được **đóng băng v1.0** ngày 8; mọi thay đổi SRS về sau đi qua CR | `docs/change-requests.md` |

### 1.2 Quy trình Rà soát Trang trọng (Cẩm nang §3.2) — 6 bước

Nhóm đã chạy **Inspection** cho SRS-01 ngày 3 theo đúng 6 bước:

| # | Bước | Thực hiện cho SRS-01 v1.1 | Đầu ra |
|---|---|---|---|
| 1 | Khởi tạo | Phạm vi: 51 FR + 7 NFR + 18 BR + 8 UC · Vai trò: Mạnh (Moderator), Lộc (Scribe) · Entry criteria: baseline giá REF-01 chốt | Bảng phân công vai trò |
| 2 | Kích hoạt | Phát tán bản v1.1 + checklist 10 mục (SRS §10.A) | Checklist |
| 3 | Chuẩn bị cá nhân | Mỗi người tự rà và ghi nghi vấn (4/4 thành viên) | Ghi chú chuẩn bị |
| 4 | Họp rà soát | Họp trực tiếp 2026-11-18, 4/4 thành viên | **10 phát hiện RV-01…RV-10** |
| 5 | Sửa đổi | Sửa SRS v1.1 → **v1.2**; 2 lỗi Major đóng bằng CR | SRS v1.2 |
| 6 | Theo dõi & Đóng | Moderator kiểm tra lại theo exit criteria → **ĐẠT 10/10** | Biên bản `docs/reviews/inspection-srs.md` |

**4 hình thức rà soát** (Cẩm nang §3.3) và mức độ dùng trong đồ án:

| Hình thức | Mức trang trọng | Dùng cho | Có biên bản? |
|---|---|---|---|
| Informal Review | Thấp | Rà nhanh test case giữa 2 người cùng module | Không (theo chuẩn) |
| Walkthrough | Trung bình | Hội trường thiết kế test ngày 8 (mỗi người 10 phút) | Có (mục 3.8 `docs/ASSIGNMENT.md`) |
| Technical Review | Cao | Technical Review thiết kế test ngày 5 | Có (`reports/gates/day-05.md`) |
| **Inspection** | **Cao nhất** | **SRS-01 ngày 3** | **Có — đầy đủ 6 bước** |

> **Nhận xét phản biện (Điểm yếu của dự án):** Inspection mới chỉ áp dụng cho **SRS-01**. Bộ test case 226 ca và 5 tài liệu thiết kế chưa đi qua Inspection — hiện chỉ có *review chéo* (EC-8). Đây là khoản trống đã ghi ở `docs/PROGRESS.md` và cần xử lý ở Ngày 5–8.

### 1.3 McCabe V(G) và mức bao phủ (Cẩm nang §5.2–§5.4)

- **Cấu trúc CFG**: Node (câu lệnh tuần tự) · Edge (cạnh) · **Predicate Node** (nút ≥ 2 cạnh ra, tức điểm rẽ nhánh).
- **Công thức**: \(V(G) = E - N + 2p\), và tương đương \(V(G) = P + 1\) với \(P\) = số nút điều kiện, \(p = 1\) cho một khối tuần tự.
- **Ý nghĩa**: \(V(G)\) = **số ca kiểm thử tối thiểu** cần thiết kế để đạt độ bao phủ đường dẫn cơ bản.
- **4 cấp độ bao phủ**: (1) Statement · (2) Branch/Decision · (3) Condition · (4) Branch & Condition.

---

## 2. Dựng CFG từ 4 bảng quyết định của SRS §8

### 2.1 Bảng quyết định 1 — Vòng đời wizard T2 (SRS §8.1)

| Từ | Chọn loài | Chọn bậc cân nặng | Chọn dịch vụ | Quay lại | Gửi form |
|---|---|---|---|---|---|
| S0 | → S1 | ✗ | ✗ | ✗ | ✗ |
| S1 | — | → S2 | ✗ | → S0 | ✗ |
| S2 | — | — | → S3 | → S1 | ✗ |
| S3 | — | — | — | → S2 | ✗ (còn thiếu SĐT) |
| S4 | — | — | — | → S3 | → S5 |
| S5 | ✗ | ✗ | ✗ | ✗ | ✗ |

**CFG rút gọn (mỗi nút = một trạng thái, mỗi cạnh = một sự kiện):**

```
        ┌────────────────────┐
        │  S5 (terminal)     │   ← 1 cạnh vào
        └─────────▲──────────┘
                  │ gửi form (hợp lệ)
        ┌─────────┴──────────┐
        │  S4 đã điền thông  │
        │  tin liên hệ       │─── quay lại ───┐
        └─────────▲──────────┘                │
                  │ điền SĐT                  │
        ┌─────────┴──────────┐                │
        │  S3 đã chọn dịch vụ │────────────────┘
        └─────────▲──────────┘
                  │ chọn dịch vụ
        ┌─────────┴──────────┐
        │  S2 đã chọn bậc    │─── quay lại ───┐
        │  cân nặng          │                │
        └─────────▲──────────┘                │
                  │ chọn bậc cân nặng        │
        ┌─────────┴──────────┐                │
        │  S1 đã chọn loài   │────────────────┘
        └─────────▲──────────┘
                  │ chọn loài
        ┌─────────┴──────────┐
        │  S0 chưa chọn loài │
        └────────────────────┘
```

**Đếm:** N = 6 node · E = 9 cạnh (S0→S1, S1→S2, S2→S3, S3→S4, S4→S5, S1→S0, S2→S1, S3→S2, S4→S3).

\[
V(G) = E - N + 2p = 9 - 6 + 2(1) = \mathbf{5}
\]
\[
V(G) = P + 1 = 4 + 1 = \mathbf{5} \quad \checkmark
\]

**Số ca ST thực sự có trong bộ test:** `TC-T2-M4-009` (quay lại giữ lựa chọn), `TC-T2-M4-013` (bỏ qua loài — bị chặn), `TC-T2-M4-014` (bỏ qua cân nặng — bị chặn), `TC-T2-M4-015` (nhảy thẳng — bị chặn), `TC-T2-M4-016` (quay lại rồi tiến tục), `TC-T2-M4-017` (quay lại bước đầu) → **6 ca**.

> **Kết luận V(G)**: \(V(G) = 5\) là số ca **tối thiểu**; bộ test có **6 ca** → **đạt độ bao phủ đường dẫn cơ bản**, dư 1 ca để phủ chuyển không hợp lệ "gửi form khi còn thiếu SĐT" (ô ✗ ở hàng S3).

### 2.2 Bảng quyết định 2 — Vòng đời wizard T1 (SRS §8.2)

| Từ | Chọn loài | Chọn gói | Quay lại | Xác nhận |
|---|---|---|---|---|
| W0 | → W1 | ✗ | ✗ | ✗ |
| W1 | — | → W2 | → W0 | ✗ |
| W2 | — | — | → W1 | ✗ |
| W3..W6 | — | — | → bước trước | → W7 |
| W7 | ✗ | ✗ | ✗ | ✗ |

**CFG:** nút W3..W6 gộp thành **1 nút đại diện** `W3..W6` (vì 4 bước này cùng hành vi: quay lại bước trước, tiến tới xác nhận). N = 5 node (W0, W1, W2, W3..W6, W7) · E = 7 cạnh (W0→W1, W1→W2, W2→W3..6, W3..6→W7, W1→W0, W2→W1, W3..6→bước trước).

\[
V(G) = 7 - 5 + 2 = \mathbf{4}
\]

**Số ca ST thực sự có:** `TC-T1-M4-004` (bắt buộc qua bước loài), `TC-T1-M4-005` (bắt buộc qua bước cân nặng), `TC-T1-M4-007` (quay lại giữ lựa chọn), `TC-T1-M4-009` (bỏ qua bước 1 — bị chặn), `TC-T1-M4-010` (nhảy thẳng — bị chặn), `TC-T1-M4-011` (quay lại rồi tiến tục), `TC-T1-M4-012` (quay lại bước đầu) → **7 ca**.

> **Kết luận V(G)**: \(V(G) = 4\), bộ test có **7 ca** → đạt, dư 3 ca cho các nhánh rẽ tại W5 (chọn tại spa / tại nhà → `TC-T1-M6-001`, `TC-T1-M6-002`).

### 2.3 Bảng quyết định 3 — Chính sách hủy / đổi lịch (SRS §8.3)

5 điều kiện nhị phân (Q1..Q5) → nếu lập bảng đầy đủ sẽ có \(2^5 = 32\) cột. Nhóm **rút gọn** thành 5 quy tắc kiểm tra *tính tìm thấy* (xem `docs/design/decision-tables.md` §A.6).

**CFG của bảng đã rút gọn:** 5 quy tắc độc lập, mỗi quy tắc là 1 nút điều kiện nhị phân với 1 cạnh "đạt" và 1 cạnh "không đạt".

- N = 6 node (1 node đầu + 5 nút điều kiện) · E = 11 cạnh (1 cạnh vào + 5 × 2 cạnh ra).
- P = 5 nút điều kiện.

\[
V(G) = 11 - 6 + 2 = \mathbf{7} \qquad V(G) = P + 1 = 5 + 1 = \mathbf{6}
\]

> **Ghi chú phản biện:** hai công thức cho kết quả **khác nhau** (7 vs 6) vì bảng đã rút gọn có 1 cạnh "điều kiện không ảnh hưởng" (don't-care) bị gộp. Nhóm lấy **giá trị lớn hơn (7)** làm chuẩn — đây là lựa chọn bảo thủ, và là minh hoạ trực tiếp hạn chế của kỹ thuật DT (xem §4).

**Số ca DT thực sự có:** `TC-T1-M5-004` (điều kiện đổi lịch nêu rõ thời gian và phí), `TC-T1-M5-005` (hủy trước mức miễn phí), `TC-T2-M5-004` (hoàn cọc khi hủy trước thời hạn), `TC-T2-M5-005` (không hoàn cọc khi hủy muộn) → **4 ca DT** + 4 ca UC bổ trợ (`TC-T1-M5-003`, `TC-T1-M5-006`, `TC-T2-M5-003`, `TC-T3-M5-002`) = **8 ca** phủ mục này.

> **Kết luận V(G)**: \(V(G) = 7\), bộ test có **8 ca** phủ M5-chính sách → đạt.

### 2.4 Bảng quyết định 4 — Phụ thu di chuyển T1 (SRS §8.4)

| | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| C1 Khoảng cách (km) | ≤5 | 6 | 12 | 20 |
| C2 Hình thức | Tại nhà | Tại nhà | Tại nhà | Tại nhà |
| Phụ thu di chuyển | 0₫ | 8.000₫ | 56.000₫ | "Liên hệ báo giá riêng" |
| Phụ thu gói tại nhà (Tắm) | +50.000₫ | +50.000₫ | +50.000₫ | +50.000₫ |

**CFG:** điều kiện C1 là **nút rẽ nhánh chính** (4 dải → 4 nhánh), C2 là điều kiện nhị phân phụ (tại nhà / tại spa) đã được gộp vì không độc lập với C1 (đã ghi ở `docs/design/decision-tables.md` §B.3).

- N = 5 node (1 node vào + 4 node nhánh dải) · E = 8 cạnh (1 cạnh vào + 4 cạnh ra + 3 cạnh nối tiếp trên đường đi chính) · P = 4.

\[
V(G) = 8 - 5 + 2 = \mathbf{5} \qquad V(G) = P + 1 = 4 + 1 = \mathbf{5} \quad \checkmark
\]

**Số ca DT thực sự có:** `TC-T1-M6-003` (0 km), `TC-T1-M6-004` (2 km), `TC-T1-M6-005` (5 km), `TC-T1-M6-006` (6 km), `TC-T1-M6-007` (7 km), `TC-T1-M6-008` (10 km), `TC-T1-M6-009` (15 km), `TC-T1-M6-010` (20 km → báo giá riêng), `TC-T1-M6-011` (tắm +50.000), `TC-T1-M6-012` (cạo +80.000), `TC-T1-M6-013` (combo +100.000), `TC-T1-M6-014` (tổng tiền) → **12 ca**.

> **Kết luận V(G)**: \(V(G) = 5\), bộ test có **12 ca** → đạt; dư 7 ca phủ 4 dải km biên (BR-05) và 3 mức phụ thu cố định gói (BR-06).

### 2.5 Tổng hợp

| Bảng quyết định | N | E | P | V(G) | Ca tối thiểu | Ca thực tế | Đạt? |
|---|---|---|---|---|---|---|---|
| §8.1 Wizard T2 | 6 | 9 | 4 | **5** | 5 | 6 | ✔ |
| §8.2 Wizard T1 | 5 | 7 | 3 | **4** | 4 | 7 | ✔ |
| §8.3 Chính sách hủy | 6 | 11 | 5 | **7** | 7 | 8 | ✔ |
| §8.4 Phụ thu di chuyển | 5 | 8 | 4 | **5** | 5 | 12 | ✔ |
| **Tổng** | **22** | **35** | **16** | **21** | **21** | **33** | **✔ 4/4** |

**Tổng \(V(G)\) của cả 4 bảng = 21**; bộ test case có **33 ca** thuộc 4 bảng này → vượt mức tối thiểu **+12 ca** (+57%).

### 2.6 Mức bao phủ (Cẩm nang §5.4) — đo trên bộ test thật

Vì không có mã nguồn, ta đo ở **mức quyết định (Decision/Branch)** trên CFG của bảng quyết định: một nhánh được coi là "đã thực thi" khi tồn tại ≥ 1 test case đi qua nhánh đó.

> **Phương pháp đo (quan trọng — và là điểm dễ sai):** tử số của mọi mức bao phủ là **số nhánh/node có trong CFG**, **không phải** số test case. Số test case chỉ là *bằng chứng* cho việc nhánh đó đã được đi tới. Một ca có thể đi nhiều nhánh; một nhánh có thể cần nhiều ca. Bản đầu của tài liệu này đã dùng nhầm 33 ca làm tử số của "33 nhánh" — đã sửa trong lần review chéo (Ngày 8).

**Bảng đếm nhánh trên CFG:**

| Bảng quyết định | Node | Cạnh | Nhánh (edge) | Nhánh đã đi được | Nhánh chưa đi được |
|---|---|---|---|---|---|
| §8.1 Wizard T2 | 6 | 9 | 9 | 8 | 1 |
| §8.2 Wizard T1 | 5 | 7 | 7 | 6 | 1 |
| §8.3 Chính sách hủy | 6 | 11 | 11 | 11 | 0 |
| §8.4 Phụ thu di chuyển | 5 | 8 | 8 | 8 | 0 |
| **Tổng** | **22** | **35** | **35** | **33** | **2** |

| Mức bao phủ | Công thức | Kết quả đo được | Đánh giá |
|---|---|---|---|
| **Cấp 1 — Statement Coverage** | Số node đã thực thi / tổng node | 22/22 node = **100%** | Đạt |
| **Cấp 2 — Branch Coverage** | Số nhánh đã thực thi / tổng nhánh | 33/35 nhánh = **94,3%** | Đạt |
| **Cấp 3 — Condition Coverage** | Mỗi điều kiện con nhị phân được đánh giá cả T và F | 16/16 điều kiện con đạt cả 2 nhánh = **100%** | Đạt |
| **Cấp 4 — Branch & Condition** | Đồng thời đạt cấp 2 và cấp 3 | **94,3%** (giới hạn bởi nhánh chưa đi) | Chưa đạt tuyệt đối |

**2 nhánh chưa được thực thi (5,7% còn lại):**

| Nhánh chưa đi | Bảng | Vì sao chưa đi | Kế hoạch bổ sung |
|---|---|---|---|
| S3 → ✗ "gửi form khi còn thiếu SĐT" | §8.1 (T2) | Cần nhập SĐT **không hợp lệ** rồi bấm gửi → vi phạm ranh giới ADR-11 nếu gửi thật | Ca `TC-T2-M4-002` (EP) đã chặn form ở bước validate, không tới được nhánh này → ghi nhận là **hạn chế của ranh giới kiểm thử**, không phải thiếu test |
| W7 → ✗ "mọi chuyển từ trạng thái terminal" | §8.2 (T1) | Sau khi xác nhận đơn, site đóng modal — **không quan sát được** trạng thái sau terminal | Gộp vào ca `TC-T1-M4-010` (nhảy thẳng bị chặn) |

> **Kết luận có giá trị:** 2 nhánh chưa đi **không phải lỗ hổng của bộ test** — chúng là hệ quả trực tiếp của việc kiểm thử **không phá hại** (ADR-11) trên hệ thống production. Đây là ví dụ điển hình của Hướng 2: báo cáo phải nêu **giới hạn của phương pháp**, không được đánh dấu Pass cho ca không thực thi được.

---

## 3. Ví dụ thật trích từ test case

### 3.1 Ví dụ 1 — V(G) bắt được lỗ thiếu test case mà DT đơn lẻ không thấy

Bảng §8.4 có 4 quy tắc (R1..R4) → một người thiết kế chỉ nhìn DT sẽ nghĩ cần đúng **4 ca**. Nhưng CFG tính ra \(V(G) = 5\) vì có **1 nút điều kiện** (C1 khoảng cách) và **4 nhánh** → cần tối thiểu 5 ca để đi hết đường.

**Test case chứng minh đã có:** `TC-T1-M6-014` — "Tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển". Đây là ca mà DT thuần **không sinh ra**: R1..R4 chỉ kiểm tra từng khoản phụ thu riêng lẻ, còn R5 kiểm tra phép **cộng**. Nếu không có ca này, site có thể tính đúng từng khoản nhưng cộng sai tổng → lỗi không bị phát hiện.

**Bài học:** DT cho biết *quy tắc nào cần kiểm tra*, còn \(V(G)\) cho biết *cần bao nhiêu đường đi*. Hai kỹ thuật bổ trợ nhau, không thay thế nhau.

### 3.2 Ví dụ 2 — V(G) chỉ ra ca kiểm thử thừa, có thể dùng để cắt giảm thời gian

Bảng §8.1 (T2) có \(V(G) = 5\), nhưng nhóm viết **6 ca**. Kiểm tra chi tiết cho thấy 2 ca gần như trùng nhau:

- `TC-T2-M4-013`: bỏ qua bước chọn loài (từ S0) → bị chặn.
- `TC-T2-M4-014`: bỏ qua bước chọn cân nặng (từ S1) → bị chặn.

Hai ca này **đi cùng một đường đi** (S0/S1 → khoá nút "Tiếp tục") → chỉ cần 1 ca để đạt \(V(G) = 5\). Nhóm **giữ cả 2 ca** vì chúng nằm ở hai trạng thái khác nhau (S0 và S1) và rủi ro "bỏ qua bước giữa" là lỗi âm thầm gây tính sai giá — đánh đổi giữa số ca tối ưu và mức độ chắc chắn.

> **Ghi nhận:** đây là quyết định **có chủ ý**, không phải dư thừa do lười. Được ghi lại để reviewer có thể phản biện.

### 3.3 Ví dụ 3 — V(G) phát hiện mâu thuẫn giữa SRS và bộ test case

Khi đối chiếu bảng §8.4 với `docs/testcases/t1.csv`, em phát hiện `TC-T1-M6-010` (20 km) đang kỳ vọng **"thu 120.000đ"** theo công thức `max(0, km − 5) × 8.000₫` — trong khi:

- `BR-05` quy định trên 15 km → "liên hệ báo giá riêng";
- `FR-M6-06` yêu cầu trên 15 km **không** hiển thị con số cố định;
- CR-10 đã chốt ngày 3 rằng site hiển thị theo **dải km**, không hiện con số tính từ địa chỉ.

→ **Đã sửa** `TC-T1-M6-010`: đổi `Requirement_ID` từ `FR-M6-02` → `FR-M6-06`, tiêu đề thành "DT phụ thu di chuyển: 20 km hiển thị Liên hệ báo giá riêng thay vì con số".

**Bài học cho Hướng 2:** khi đặc tả đích được viết bằng **suy luận** (công thức lý thuyết) thay vì **quan sát** (hành vi thật của site), bộ test case sẽ mang kỳ vọng sai. Kỹ thuật McCabe đóng vai trò **đối chiếu chéo tài liệu**: mỗi quy tắc trong CFG phải truy được về đúng một điều kiện của SRS, và mỗi test case phải truy được về đúng một quy tắc. Kỹ thuật này bắt được lỗi mà "chạy test" không bắt được — vì ca sai kỳ vọng vẫn **Fail đúng** theo logic của nó.

---

## 4. Hạn chế và khi nào KHÔNG dùng McCabe / độ bao phủ

| Hạn chế | Giải thích | Xử lý trong dự án |
|---|---|---|
| **McCabe vốn là kỹ thuật hộp trắng** — cần CFG của mã nguồn | Hệ thống đích **không có mã nguồn** (ADR-13) | Dựng CFG **từ bảng quyết định trong SRS §8** — bảng quyết định chính là CFG rút gọn. Đây là cách hợp thức duy nhất trong bối cảnh Hướng 2 |
| **Đo bao phủ "trên giấy" không đảm bảo đường đi thực sự đi được** | Test case có thể bị Fail do lỗi hạ tầng chứ không do đi đúng nhánh | Phân biệt rõ: `V(G)` = **số ca tối thiểu cần có**; việc ca đó **thực sự đi qua nhánh** phải xác nhận ở execution log (Ngày 11–12). Không được coi là đã phủ chỉ vì ca tồn tại |
| **Gộp node làm giảm V(G)** | Gộp W3..W6 thành 1 nút giảm V(G) từ 6 xuống 4 | Ghi rõ cách gộp trong §2.2 để reviewer kiểm chứng lại; nếu không gộp, V(G) = 6 vẫn ≤ số ca thực tế (7) → **kết luận không đổi** |
| **Hai công thức McCabe cho kết quả khác nhau khi bảng đã rút gọn** | §8.3: \(E-N+2p = 7\) nhưng \(P+1 = 6\) | Chọn **giá trị lớn hơn** (7) làm chuẩn — bảo thủ, và đây chính là hạn chế đã nêu ở `docs/design/decision-tables.md` §C |
| **V(G) không nói được ca nào FAIL** | V(G) là số lượng, không phải chất lượng | Chất lượng ca do **EP/BVA/DT/ST** quyết định; V(G) chỉ đảm bảo *đủ số lượng*, không đảm bảo *đúng kỳ vọng* |
| **Chỉ 4 bảng quyết định trong SRS** — không phải mọi logic của 3 hệ thống | Vì số liệu tổng V(G) = 21 chỉ phản ánh 4 bảng | Nêu rõ phạm vi trong §2.5 và §6; **không** tuyên bố "đạt 100% độ bao phủ toàn hệ thống" |
| **Đo bao phủ mức Statement/Condition trên CFG rút gọn không tương đương đo trên mã nguồn** | CFG rút gọn không có câu lệnh thật | Ghi rõ trong bảng §2.6 là "đo trên CFG của bảng quyết định", không phải trên mã nguồn |

---

## 5. Đối chiếu yêu cầu

| Yêu cầu Hướng 2 | Mức độ đáp ứng của tài liệu này |
|---|---|
| **H2-2 Thiết kế test** | 4 CFG dựng từ SRS §8 · \(V(G)\) tổng 21 · đo 4 cấp độ bao phủ (Statement 100% · Branch 94,3% · Condition 100% · B&C 94,3%) · đối chiếu 33 ca test thật → **4/4 bảng quyết định đạt mức tối thiểu** |
| **H2-1 Mô tả chi tiết** | Phát hiện **1 mâu thuẫn SRS ↔ test case** (`TC-T1-M6-010`) và đã sửa — minh hoạ vai trò của kiểm thử tĩnh trong việc *làm sạch* đặc tả đích |

Người review chéo: **Ngân** (Ngày 8) · Đóng góp vào `docs/design/test-design-techniques.md`.
