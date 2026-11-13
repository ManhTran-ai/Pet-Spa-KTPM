# Change Requests (CR)

Đối tượng: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Nguyên tắc (SRS §10.C): mọi thay đổi SRS sau baseline ngày 3 phải có CR, tăng phiên bản SRS, và cập nhật `docs/requirements.csv`, RTM và test case liên quan trong vòng 1 ngày; Mạnh duyệt.

Trạng thái CR: `Chờ nhóm` | `Đã chấp nhận` | `Từ chối` | `Đã áp dụng`.

| CR | Ngày mở | Người đề xuất | Tiêu đề | Yêu cầu liên quan | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| CHG-2026-11-13-01 | 2026-11-13 | Mạnh | Chốt CSDL trong §2.4 là PostgreSQL + Prisma | Mục 2.4 (không có ID yêu cầu) | Đã áp dụng | Theo ADR-01; ghi chú ngay dưới §2.4 trong `docs/srs.md`; không ảnh hưởng FR/NFR nên không cần cập nhật RTM |

## Thay đổi đã áp dụng trên bản làm việc

| Mã | Ngày | Nội dung | Căn cứ | Tác động RTM / test case |
|---|---|---|---|---|
| CHG-2026-11-13-01 | 2026-11-13 | SRS §2.4: "MySQL hoặc PostgreSQL \[Cần chốt\]" → "PostgreSQL + Prisma", có ghi chú giải thích | ADR-01 (xác nhận của người dùng ngày 2026-11-13) | Không có FR/NFR liên quan; RTM và test case không đổi |
| CHG-2026-11-13-02 | 2026-11-13 | SRS §5.1a, §5.7a, §9a, §9b: bổ sung tiêu chí chấp nhận đo được cho M1, M7 và toàn bộ 6 NFR. Làm rõ 10 tiêu chí còn mơ hồ ở M2–M6. Chuyển 5 mục `[Cần chốt]` thành `[Cần chốt → ADR-xx]`. SRS v0.1 → v0.2 | Yêu cầu Ngày 2 (Mạnh) + ADR-02, ADR-07, ADR-08 | Không thêm/bớt ID yêu cầu: `docs/requirements.csv` giữ 46 dòng (40 FR + 6 NFR); RTM-01 giữ nguyên danh sách yêu cầu; test case chưa viết nên không cần sửa |

Ghi chú quy trình: đây là khoản trống của bản nháp v0.1 được điền trong Ngày 1 theo yêu cầu "rà SRS §1–2 và hoàn thiện nếu thiếu", nên không phải thay đổi yêu cầu sau baseline. Mọi thay đổi sau ngày 3 vẫn phải đi qua CR như SRS §10.C.

Ghi chú CHG-2026-11-13-02: đây là thay đổi **trước baseline** (baseline v1.0 dự kiến ngày 3) nên không cần nhóm biểu quyết riêng; tuy nhiên các giá trị mặc định nêu trong ADR-07 và ADR-08 vẫn phải được nhóm xác nhận tại họp kick-off.

## Mẫu CR

```
CR-nn: <tiêu đề ngắn>
Ngày mở: <ISO> · Người đề xuất: <tên> · Người duyệt: Mạnh
Vấn đề: <mô tả mâu thuẫn/khoảng trống, dẫn chiếu mục SRS>
Yêu cầu liên quan: <FR/BR/NFR/UC>
Đề xuất: <thay đổi cụ thể>
Tác động: SRS mục nào · requirements.csv · RTM dòng nào · test case nào · test case mới cần thêm
Trạng thái: Chờ nhóm | Đã chấp nhận | Từ chối | Đã áp dụng
Quyết định của nhóm: <nội dung họp, ngày>
```

## Ứng viên chưa đề xuất (ghi để chuẩn bị Inspection ngày 3)

Nguồn: `day-playbook.md` § Ngày 3 (danh sách mầm lỗi đã biết). Trạng thái hiện tại: **chưa kiểm chứng**; phải đọc lại SRS rồi mới xác nhận mỗi mục và mở CR chính thức nếu đúng.

| Mã ứng viên | Vấn đề | Kiểm chứng |
|---|---|---|
| CR-01 | Bảng quyết định hủy SRS §8.2: cột R3 ("đã đặt cọc" = N) chỉ khả thi khi có lịch không thu cọc, trong khi BR-11 bắt buộc cọc và FR-M7-04 chỉ cho Admin xem/điều chỉnh | Chờ Ngày 3 |
| CR-02 | FR-M6-04 (thanh toán cọc, Should) là điều kiện của FR-M4-01 và UC-04 (Must) | Chờ Ngày 3 |
| CR-03 | Lịch `Pending` quá giờ hẹn không có đường ra: No-show chỉ áp dụng từ `Confirmed` (SRS §8.1, BR-12) | Chờ Ngày 3 |
| CR-04 | Không có cách KH thành VIP (BR-10) và cách tạo tài khoản NV/AD (FR-M1-01 chỉ đăng ký KH) | Chờ Ngày 3 |
| CR-05 | BR-01 chưa nói lịch có kết thúc trước 18:00 hay không | Chờ Ngày 3 |
| CR-06 | BR-05 (tối đa 3 lịch Pending/Confirmed cùng lúc) không có trong tiêu chí chấp nhận của FR-M4-01 | Chờ Ngày 3 |
| CR-07 | FR-M6-01 (tính giá) đang để mức Should trong SRS §5.6, nhưng là điều kiện của FR-M4-01 (Must) và TP-01 §7 đề xuất nâng lên Must. Backlog đang xếp Must theo đề xuất này | Chờ Ngày 3 |
| CR-08 | FR-M7-04 (ghi nhật ký thao tác của Admin) đang để mức Could trong SRS §5.7, nhưng là cơ sở cho nghiệp vụ `audit_log` của FR-M7-01…03 và cho yêu cầu an toàn dữ liệu. Đề xuất nâng lên Should | Chờ Ngày 3 |
| CR-09 | Bảng §9 không có cột ưu tiên cho NFR; §9a đã làm rõ ngưỡng đạt của NFR-02 (không còn phát hiện Critical/High theo TP-01 §9.5) và §9b làm rõ 5 NFR còn lại | Chờ Ngày 3 |
