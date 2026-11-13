# Change Requests (CR)

Đối tượng: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Nguyên tắc (SRS §10.C): mọi thay đổi SRS sau baseline ngày 3 phải có CR, tăng phiên bản SRS, và cập nhật `docs/requirements.csv`, RTM và test case liên quan trong vòng 1 ngày; Mạnh duyệt.

Trạng thái CR: `Chờ nhóm` | `Đã chấp nhận` | `Từ chối` | `Đã áp dụng`.

| CR | Ngày mở | Người đề xuất | Tiêu đề | Yêu cầu liên quan | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| — | — | — | — | — | — | Chưa có CR nào được mở. Danh sách ứng viên sẽ ghi ở Ngày 3 sau khi đọc lại SRS. |

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
