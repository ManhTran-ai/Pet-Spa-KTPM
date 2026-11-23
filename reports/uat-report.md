# Báo cáo kiểm thử chấp nhận người dùng (UAT)

| | |
|---|---|
| **Phạm vi** | 3 hệ thống web đang hoạt động (T1 Pet NGON · T2 Mật Pet Family · T3 Pretty Paws) |
| **Nhóm** | Mạnh (TV1) · Tài (TV2) · Ngân (TV3) · Lộc (TV4) |
| **Ngày** | 2026-11-22 (Ngày 14) |
| **Trạng thái** | **HUMAN-PENDING** — chưa thực thi |
| **Người chịu trách nhiệm** | Lộc (TV4) — điều phối thuê người dùng |
| **Nguồn test case** | `docs/testcases/uat.csv` (8 ca) |


---

## 1. Tóm tắt

| Chỉ số | Giá trị |
|---|---|
| Kịch bản UAT | **8** (`UC-01`..`UC-08`) |
| Đã thực thi | **0** |
| Chưa thực thi | **8** (100%) |
| Hệ thống | T1 × 4 ca · T2 × 5 ca · T3 × 1 ca (UC-08) |
| Mức độ | Critical 3 · High 3 · Medium 2 |

> **Kết luận ngắn:** đây là **tiêu chí Exit criteria duy nhất còn để mở bởi nhóm** (EC-7). Trạng thái `HUMAN-PENDING` là chính xác, không phải thiếu sót — UAT đòi hỏi người dùng thật, mà nhóm kiểm thử không thể tự đại diện.


---

## 2. Danh sách kịch bản UAT

| UC_ID | Kịch bản | Hệ thống | Mức độ | Trạng thái |
|---|---|---|---|---|
| `UC-01` | Tìm giá dịch vụ chăm sóc theo cân nặng (chọn tại nhà, kiểm tra phí thu di chuyển) | T1 | Critical | Chưa thực thi |
| `UC-02` | Tra bảng giá dịch vụ theo loài và cân nặng | T2 | Critical | Chưa thực thi |
| `UC-03` | Đặt lịch gội tại spa Mật Pet | T2 | Critical | Chưa thực thi |
| `UC-04` | Kiểm tra dịch vụ báo giá riêng trước khi đặt | T2 | High | Chưa thực thi |
| `UC-05` | Xem quy trình và thời gian xác nhận lịch | T1 | High | Chưa thực thi |
| `UC-06` | Tra cứu chính sách hủy hoặc đổi lịch | T1, T2 | High | Chưa thực thi |
| `UC-07` | Tìm kiếm dịch vụ trên Mật Pet | T2 | Medium | Chưa thực thi |
| `UC-08` | Liên hệ tiệm qua kênh khác nhau | T1, T2, T3 | Medium | Chưa thực thi |


---

## 3. Vì sao UAT chưa thực thi được

### 3.1 Ba rào cản kỹ thuật

| # | Rào cản | Giải thích | Khắc phục |
|---|---|---|---|
| 1 | **Cần người dùng thật** | 8 ca đều yêu cầu "5–8 người ngoài nhóm" — đây là tiêu chí đo *mức độ dễ dùng với người không chuyên*, không có người dùng thật thì kết quả vô nghĩa | Thuê 5–8 người (bạn bè, người thân, sinh viên khác khoa) |
| 2 | **Không thể tự động hoá** | UAT đánh giá *trải nghiệm*, không phải *hành vi quan sát được*. Script Playwright không thay thế được người dùng | Không có — đây là bản chất của UAT |
| 3 | **Một số ca đụng ranh giới ADR-11** | `UC-03` yêu cầu **bấm nút gửi đặt lịch** — sẽ tạo lịch thật trên site của chủ tiệm | Cần sự cho phép bằng văn bản từ chủ site, hoặc dùng SĐT/dữ liệu test do chủ site cung cấp |

### 3.2 Rủi ro nếu bỏ qua UAT

| Rủi ro | Mức độ | Lý do |
|---|---|---|
| Bỏ sót lỗi "hiểu được nhưng làm không được" | Cao | Test tự động kiểm tra *hệ thống có đúng không*; UAT kiểm tra *con người có dùng được không* |
| Đánh giá sai mức độ dễ dùng của luồng đặt lịch | Cao | 22/238 ca đã Fail do lỗi UI, phần lớn thuộc loại "người dùng bị chặn ở bước nào" |
| Hồ sơ nộp thiếu nhóm tài liệu bắt buộc | Trung bình | Kế hoạch §6.1 liệt kê UAT là 1 trong 14 nhóm hồ sơ |


---

## 4. Kế hoạch thực thi UAT (đề xuất cho vòng tiếp theo)

### 4.1 Nhân sự và thời gian

| Hạng mục | Nội dung |
|---|---|
| Người tham gia | 5–8 người ngoài nhóm, ưu tiên người **chưa từng đặt lịch dịch vụ thú cưng online** |
| Thời lượng | 45–60 phút / người |
| Điều phối | Lộc (TV4) |
| Quan sát | Lộc hoặc Tài ghi chú, không gợi ý |
| Kết quả | Điểm số 1–5 cho mỗi UC + ghi chú tự do + nhận xét chung về trải nghiệm |

### 4.2 Quy trình cho từng kịch bản

1. **Không giới thiệu trước** — chỉ đọc kịch bản đúng như câu chữ trong `docs/testcases/uat.csv`.
2. **Quan sát, không gợi ý** — ghi lại chỗ người dùng dừng lại, hỏi lại, hoặc từ bỏ.
3. **Ghi "khoảnh khắc bất ngờ"** — thời điểm người dùng không biết phải làm gì tiếp.
4. **Thu thập phản hồi định tính** — ưu tiên câu hỏi mở ("Anh/chị cảm thấy bước nào khó nhất?") thay vì câu hỏi dẫn dắt.
5. **Chấm điểm sau khi xong** — không cho xem điểm của người khác.

### 4.3 Tiêu chí nghiệm thu

| # | Tiêu chí | Ngưỡng |
|---|---|---|
| 1 | Số người tham gia | ≥ 5 |
| 2 | Tỷ lệ hoàn thành kịch bản không cần trợ giúp | ≥ 80% (`UC-01`, `UC-02`, `UC-05`, `UC-06`, `UC-07`) |
| 3 | "Khoảnh khắc bất ngờ" mỗi kịch bản | ≤ 1 |
| 4 | Điểm trung bình mỗi UC | ≥ 4/5 |
| 5 | Mọi lỗi phát hiện được đưa vào `docs/defects/defects.csv` | 100% |


---

## 5. Trạng thái Exit criteria liên quan

| Tiêu chí | Định nghĩa | Trạng thái | Lý do |
|---|---|---|---|
| **EC-7** | UAT hoàn tất, người dùng xác nhận chức năng chính đáp ứng nhu cầu | ❌ **HUMAN-PENDING** | Chưa có người dùng ngoài nhóm tham gia |

> **Phân biệt quan trọng:** EC-2, EC-5, EC-6 FAIL vì **chất lượng của phần mềm đang hoạt động** — nhóm không có quyền sửa site đích. EC-7 là tiêu chí duy nhất FAIL vì **quá trình kiểm thử chưa đủ** — và đây là việc cần làm tiếp theo, không phải việc đã hoàn thành.


---

## 6. Kết luận

UAT là **tiêu chí Exit criteria duy nhất còn để mở**. Tại thời điểm chốt hồ sơ (2026-11-22):

- ✅ **8/8 kịch bản đã thiết kế đầy đủ** — có bước thao tác, kỳ vọng, hệ thống, mức độ ưu tiên và số người tham gia yêu cầu.
- ✅ **Phương pháp, tiêu chí nghiệm thu và quy trình đã chuẩn bị** (§4).
- ✅ **Rủi ro và rào cản đã được phân tích** (§3) — bao gồm cả việc `UC-03` đụng ranh giới ADR-11.
- ⏳ **Chưa thực thi** — cần 5–8 người ngoài nhóm, 3 ngày, người điều phối Lộc.

**Khuyến nghị cho nhóm:** ưu tiên thực hiện UAT trước khi chốt phiên bản tiếp theo của hồ sơ. Trong 238 test case, 230 ca đã bằng bằng chứng máy và 8 ca UAT là **8 ca duy nhất kiểm tra điều mà máy không kiểm tra được** — liệu người dùng thật sự có dùng được sản phẩm hay không.

---

*Báo cáo này được lập ngày 2026-11-22 bởi Mạnh (TV1, Test Lead) trong khuôn khổ Phase 8 — Ngày 14. Nội dung kịch bản lấy từ `docs/testcases/uat.csv`.*
