# Slide 08 — Phân tích tĩnh & McCabe V(G): đảm bảo đủ số ca kiểm thử

> Thành viên trình bày: **Mạnh (TV1)** · Kỹ thuật phụ trách: Phân tích tĩnh, Rà soát Trang trọng, McCabe V(G) và mức bao phủ
> Tài liệu đầy đủ: `docs/design/mccabe-coverage.md` · Thời lượng: 10 phút

---

## 1. Cơ sở lý thuyết (Cẩm nang §3.1–§3.4, §5.2–§5.4)

| Khái niệm | Nguồn | Nội dung |
|---|---|---|
| Kiểm thử tĩnh | §3.1 | Rà soát **tài liệu**, không cần mã nguồn |
| Rà soát Trang trọng | §3.2 | 6 bước: Kick-off → Chuẩn bị cá nhân → Họp rà soát → Sửa đổi → Theo dõi → Đóng |
| Checklist 4C | §4 | Correctness · Clarity · Completeness · Consistency |
| McCabe \(V(G)\) | §5.2 | Số **đường đi tối thiểu** để phủ hết nhánh: \(V(G) = E - N + 2p\) hoặc \(V(G) = P + 1\) |
| Mức bao phủ | §5.4 | Cấp 1 Statement → Cấp 2 Branch → Cấp 3 Condition → Cấp 4 Branch & Condition |

> **Thông điệp:** McCabe trả lời *"cần **bao nhiêu** ca"*; EP/BVA/DT/ST trả lời *"ca đó **kiểm tra cái gì**"*. Bổ trợ nhau, không thay thế nhau.

---

## 2. Áp dụng cho đồ án — 4 CFG dựng từ SRS §8

Vì site đích **không có mã nguồn** (ADR-13), em dựng CFG từ **4 bảng quyết định** trong SRS §8 — bảng quyết định chính là CFG rút gọn.

| Bảng quyết định | HĐ | N | E | P | **V(G)** | Ca tối thiểu | Ca thực tế | Đạt? |
|---|---|---|---|---|---|---|---|---|
| §8.1 Wizard | T2 | 6 | 9 | 4 | **5** | 5 | 6 | ✔ |
| §8.2 Wizard | T1 | 5 | 7 | 3 | **4** | 4 | 7 | ✔ |
| §8.3 Hủy/đổi | Cả 3 | 6 | 11 | 5 | **7** | 7 | 8 | ✔ |
| §8.4 Phụ thu km | T1 | 5 | 8 | 4 | **5** | 5 | 12 | ✔ |
| **Tổng** | | **22** | **35** | **16** | **21** | **21** | **33** | **✔ 4/4** |

**4 cấp độ bao phủ đo trên bộ test thật:**

| Mức | Kết quả | Đánh giá |
|---|---|---|
| Cấp 1 — Statement | 22/22 node = **100%** | Đạt |
| Cấp 2 — Branch | 33/35 nhánh = **94,3%** | Đạt |
| Cấp 3 — Condition | 16/16 điều kiện con = **100%** | Đạt |
| Cấp 4 — Branch & Condition | **94,3%** | Chưa đạt tuyệt đối |

**2 nhánh chưa đi — KHÔNG phải lỗ hổng của bộ test:**

| Nhánh | Vì sao chưa đi |
|---|---|
| S3 → ✗ "gửi form khi còn thiếu SĐT" (T2) | Muốn đi nhánh này phải **gửi thật** → vi phạm ADR-11 |
| W7 → ✗ "chuyển từ trạng thái terminal" (T1) | Sau khi xác nhận đơn, site **đóng modal** → không quan sát được |

> Đây là hệ quả trực tiếp của kiểm thử **không phá hại** trên production. Báo cáo phải nêu giới hạn phương pháp, **không** đánh dấu Pass cho ca không thực thi được.

---

## 3. Ví dụ thật

### Ví dụ 1 — `TC-T1-M6-014` · "Tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển"

Bảng §8.4 có 4 quy tắc → DT thuần nghĩ cần đúng **4 ca**. Nhưng CFG tính ra \(V(G) = 5\). Ca này là ca **DT thuần không sinh ra**: R1..R4 kiểm tra từng khoản phụ thu riêng lẻ, còn R5 kiểm tra phép **cộng**. Thiếu nó, site có thể tính đúng từng khoản nhưng cộng sai tổng.

### Ví dụ 2 — `TC-T1-M6-010` · "20 km hiển thị Liên hệ báo giá riêng thay vì con số"

Ban đầu ca này kỳ vọng *"thu 120.000₫"* theo công thức **suy luận** `max(0, km−5)×8.000₫`, nhưng `BR-05` + `FR-M6-06` quy định trên 15 km không hiện con số. Đối chiếu CFG ↔ SRS phát hiện mâu thuẫn → đã sửa `FR-M6-02` → `FR-M6-06`.

> **Kỹ thuật tĩnh bắt được lỗi mà "chạy test" không bắt được** — vì ca sai kỳ vọng vẫn *Fail đúng theo logic của nó*.

### Ví dụ 3 — `TC-T2-M4-013` / `TC-T2-M4-014` · 2 ca cùng đường đi

\(V(G) = 5\) nên chỉ cần 1 ca để đạt tối thiểu, nhưng nhóm **giữ cả 2** (bỏ qua bước loài vs bỏ qua bước cân nặng) vì rủi ro *"bỏ qua bước giữa"* là lỗi âm thầm gây **tính sai giá**. Đánh đổi **có chủ ý** giữa số ca tối ưu và mức chắc chắn.

---

## 4. Hạn chế: khi nào KHÔNG dùng & rủi ro khi dùng sai

| Hạn chế | Khi nào không dùng | Rủi ro khi dùng sai |
|---|---|---|
| McCabe vốn là kỹ thuật **hộp trắng** — cần CFG mã nguồn | Với hệ thống **có** mã nguồn | Ở Hướng 2 đây là cách hợp thức duy nhất — nhưng phải nói rõ CFG là *rút gọn* |
| Đo bao phủ "trên giấy" ≠ đường đi thật | Khi tuyên bố *"đã phủ 100%"* — phải chờ execution log | Tuyên bố phủ 100% chỉ vì **ca tồn tại** → báo cáo sai |
| Gộp node làm giảm V(G) | Khi bảng đã rút gọn sẵn | Gộp quá mức → tưởng đã đủ ca. §8.2: nếu **không** gộp, V(G) = 6 ≤ 7 ca thực tế → kết luận không đổi |
| 2 công thức cho kết quả khác nhau (bảng rút gọn) | Với bảng nhiều nhánh rút gọn | §8.3: \(E-N+2p = 7\) vs \(P+1 = 6\) → chọn **giá trị lớn hơn** (bảo thủ) |
| V(G) **không** nói được ca nào FAIL | Khi đánh giá chất lượng kỳ vọng | Tưởng đạt V(G) = đạt chất lượng → ca kỳ vọng sai vẫn "Fail đúng" |
| Chỉ 4 bảng quyết định trong SRS | Khi tuyên bố bao phủ **toàn hệ thống** | Tổng V(G) = 21 chỉ phản ánh 4 bảng — **không** nói "100% toàn hệ thống" |

---

## 5. Kết luận

1. Kiểm thử tĩnh trên **tài liệu** là hợp thức khi không có mã nguồn — đã bắt được mâu thuẫn SRS ↔ test case (`TC-T1-M6-010`) **trước khi chạy**.
2. 4 bảng quyết định: **Statement 100% · Branch 94,3% · Condition 100%** — 4/4 đạt mức tối thiểu.
3. 2 nhánh chưa đi là **hệ quả của ADR-11**, không phải thiếu test — báo cáo phải nêu rõ.
4. McCabe đảm bảo **đủ số lượng**; EP/BVA/DT/ST đảm bảo **đúng kỳ vọng**. Cần cả hai.
