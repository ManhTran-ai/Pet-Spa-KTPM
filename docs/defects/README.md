# Quản lý lỗi

Phụ trách: Lộc (TV4) · Tài liệu nền: TP-01 §9.3, §9.4

## 1. Vòng đời lỗi

`New` → `Assigned` → `Open` → `Fixed` → `Pending Retest` → `Retest` → `Closed`

- `Reopened`: retest vẫn còn lỗi, quay lại `Open`.
- Vì hệ thống đích do bên thứ ba vận hành, `Fixed` nghĩa là **site đích đã thay đổi** và nhóm đã xác nhận lại bằng re-test.
- Lộc tổ chức buổi triage cuối ngày trong các ngày 11–13.

## 2. Mức nghiêm trọng

| Mức | Định nghĩa | Ví dụ |
|---|---|---|
| Critical | Tính sai tiền, lộ dữ liệu cá nhân, hệ thống không dùng được, lỗi bảo mật nghiêm trọng | Giá hiển thị 200.000₫ nhưng bảng ghi 250.000₫; tên bé hiển thị thẻ HTML thay vì chữ |
| High | Chức năng Must hỏng và không có cách tránh | Không tính được giá; nút "Tiếp tục" cho qua bước bắt buộc |
| Medium | Chức năng hỏng một phần, có cách tránh | Bảng giá không cuộn được trên di động |
| Low | Giao diện, chính tả, lỗi nhỏ | Sai chính tả nhãn nút |

## 3. Mẫu báo cáo lỗi

| Trường | Nội dung |
|---|---|
| Mã | `DEF-nnn` |
| Tiêu đề | Mô tả lỗi trong 1 câu, có hệ thống đích |
| Hệ thống đích và yêu cầu | T1/T2/T3 · FR/NFR liên quan |
| Test case phát hiện | `TC-<...>` |
| Thời điểm phát hiện | ISO date |
| Các bước tái hiện | Đủ để người khác tái hiện đúng |
| Kết quả thực tế so với mong đợi | Hai dòng riêng biệt |
| Mức nghiêm trọng / ưu tiên | Critical/High/Medium/Low |
| Người báo | |
| Bằng chứng | Ảnh chụp, log mạng, video ngắn (đường dẫn trong `reports/`) |
| Trạng thái | Theo vòng đời |
| Cách xử lý | |

## 4. Quy tắc báo cáo

- Mỗi lỗi gắn với đúng một test case và đúng một yêu cầu; lỗi phát hiện khi review test case dùng mã `RV-nn` và ghi riêng trong biên bản review.
- Lỗi không tái hiện được trên 2 lần thì chuyển `Open` → `Deferred` kèm lý do, không đóng.
- Lỗi thuộc phạm vi "Không kiểm thử được theo ADR-11" không mở defect; ghi vào mục giới hạn của Final Test Report.

## 5. Bảng theo dõi

Dữ liệu nằm trong `docs/defects/defects.csv` (định dạng CSV, một lỗi một dòng). Script `scripts/exit-check.mjs` đọc file này để chấm tiêu chí EC-3.
