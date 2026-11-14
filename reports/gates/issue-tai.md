## Người nhận: Tài (TV2)

**Ngày 2 — Đối chiếu ma trận giá T2 Mật Pet Family**

### Bối cảnh

T2 có **calculator giá 3 bước** (chọn loài → bậc cân nặng → dịch vụ) hiển thị giá tức thì, **và** một bảng giá tĩnh. Đây là hợp đồng dữ liệu quan trọng nhất của cả đồ án — cần xác nhận giá tính ra **khớp** giá công bố ở mọi ô.

Bảng giá tĩnh đã chốt: `docs/reference/pricing-baseline.md` §3 (và `docs/reference/pricing-baseline.csv`, dòng `System = T2`).

### Việc cần làm

1. Lấy bảng giá tĩnh trong `docs/reference/pricing-baseline.csv` (88 dòng T2) làm chuẩn.
2. Với **6 bậc cân nặng** × **2 loài** (Chó, Mèo) × **3 dịch vụ** (Combo Tắm Vệ Sinh, Combo Tắm Cạo, Cắt lông) → **36 tổ hợp**.
3. Với mỗi tổ hợp: chọn loài → chọn bậc cân nặng → chọn dịch vụ → **đọc giá hiển thị** (không gửi form).
4. So sánh với bảng tĩnh. Ghi kết quả vào `reports/raw/survey-T2-matrix.csv`.

### Định dạng file kết quả

```
Band,Pet,Service,Expected (bảng tĩnh),Actual (calculator),Match,Note
>3-6kg,Chó,Combo Tắm Vệ Sinh,200000,200000,YES,
>3-6kg,Mèo,Combo Tắm Vệ Sinh,200000,200000,YES,
```

`Match` = `YES` / `NO`. `Note` ghi lý do nếu `NO`.

### Lưu ý chuẩn hoá

- Bảng tĩnh dùng ký hiệu rút gọn: `120k`, `1tr`, `1,2tr`. Calculator dùng `~200.000đ`. Phải chuẩn hoá về **số nguyên VND** trước khi so sánh (`1tr` → 1000000, `1,2tr` → 1200000).
- Dùng `getByRole('button', { name: 'Tiếp tục →' })`; nút chỉ enable sau khi React hydrate — tham chiếu `tests/e2e/t2/m3-pricing.spec.ts`.
- **Phát hiện P1 đã mở sẵn**: giá Chó và Mèo ở cùng bậc cân nặng **bằng nhau** (đã đo 2 bậc). Đối chiếu đủ 36 tổ hợp sẽ cho biết điều này có đúng toàn bộ bảng hay không.

### Ranh giới an toàn (ADR-11)

Không bấm nút gửi cuối cùng. Chỉ chọn và đọc giá.

### Kiểm tra trước khi commit

```powershell
npm run lint
npm run typecheck
npm run gate
```

### Tài liệu

- `docs/ASSIGNMENT.md` §3.2 (phân công của bạn), §4 (quy tắc 4C), §5 (ghi nhận kết quả)
- `docs/reference/pricing-baseline.md` §3
- `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` §3.2, §6 (BR-02, BR-11), §8.1 (bảng chuyển trạng thái wizard)

### Câu hỏi cần trả lời trong báo cáo

1. Trong 36 tổ hợp, bao nhiêu khớp? Bao nhiêu lệch?
2. Nếu có ô lệch → mở defect trong `docs/defects/defects.csv` kèm ảnh chụp.
3. `FR-M3-02` có còn đúng không — hay phải sửa tiêu chí chấp nhận? (xem CR CHG-2026-11-14-02)
