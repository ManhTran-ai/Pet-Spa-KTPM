## Người nhận: Lộc (TV4)

**Ngày 2 — Rà bản vá SRS v1.1 và chuẩn bị đề xuất cho Inspection (Ngày 3)**

### Bối cảnh

SRS-01 v1.1 vừa được sửa theo bằng chứng khảo sát giá (REF-01). Bạn là người rà lại và đề xuất cách xử lý các phát hiện còn treo trước khi nhóm họp Inspection.

Bản vá: `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (v1.0 → v1.1) — xem `docs/change-requests.md` CHG-2026-11-14-01.

### Việc cần làm

**1. Rà bản vá SRS v1.1.** Đối chiếu từng thay đổi với bằng chứng gốc:

| Mục sửa | Bằng chứng kiểm chứng |
|---|---|
| `BR-03` — ngưỡng cân nặng T3 theo từng dòng sản phẩm | `reports/raw/survey-T3-services.json` |
| `BR-12` — gỡ "phí lễ tân 52 USD" | `reports/raw/survey-T3-services.json` (không có dịch vụ nào tên phí lễ tân) |
| `BR-17` — 2 khoản phụ thu T3 | `reports/raw/survey-T3-services.json` |
| `BR-18` — giá T1 tăng đơn điệu | `docs/reference/pricing-baseline.csv` (dòng T1) |
| Mục 3.2 — số dịch vụ T2, bảng không tách loài | `reports/raw/survey-T2-text.txt` |
| Mục 3.3, 3.4 — danh sách dịch vụ T3, số bậc, phụ thu | `reports/raw/survey-T3-services.json` |
| `FR-M3-02` — tiêu chí chấp nhận mới | `docs/reference/pricing-baseline.md` |

**2. Đề xuất cách xử lý P1.** Đây là phát hiện quan trọng nhất của Ngày 2:

> T2 công bố **một** bảng giá dùng chung cho Chó và Mèo. Đo trực tiếp: Chó `>3–6kg` = 200.000đ, Mèo `>3–6kg` = **200.000đ** (bằng nhau). Trong khi `FR-M3-02` v1.0 yêu cầu *"cùng bậc cân nặng nhưng Mèo → giá khác"*.

Hai cách hiểu:
- **(a)** Site T2 có lỗi — không phân biệt giá theo loài dù người dùng chọn loài → mở defect.
- **(b)** Tiêu chí `FR-M3-02` là **suy luận sai** của nhóm khi viết SRS — vì bảng tĩnh chỉ có 1 bảng, không tách loài → sửa tiêu chí chấp nhận.

Bằng chứng hiện có nghiêng về **(b)**. Hãy đọc `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` §3.2 và §6, rồi viết đề xuất có dẫn chiếu. Nhóm sẽ quyết định tại Inspection (Ngày 3) — xem CR `CHG-2026-11-14-02`.

**3. Rà checklist Inspection trong SRS §10.A** — chuẩn bị sẵn các điểm cần trao đổi khi họp.

### Ranh giới an toàn (ADR-11)

Chỉ đọc. Không đặt lịch, không tạo tài khoản.

### Kiểm tra trước khi commit

```powershell
npm run req:check     # phải 0 vi phạm
npm run rtm:check     # phải 100%
npm run gate
```

Nếu bạn sửa SRS, nhớ chạy `node scripts/req-build.mjs` để cập nhật `docs/requirements.csv` cho khớp.

### Tài liệu

- `docs/ASSIGNMENT.md` §3.4 (phân công của bạn)
- `docs/reference/pricing-baseline.md` §3.4, §4.1 (6 phát hiện P1–P6)
- `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` §10.A (checklist Inspection), §10.C (kiểm soát thay đổi)
- `docs/change-requests.md`

### Câu hỏi cần trả lời trong báo cáo

1. Bản vá SRS v1.1 có đúng với bằng chứng không? Có mục nào sửa quá tay không?
2. Đề xuất của bạn cho P1: (a) hay (b)? Dẫn chiếu cụ thể.
3. Có phát hiện nào trong P1–P6 mà bạn cho là **chưa đủ bằng chứng**, cần kiểm chứng thêm trước Inspection không?
