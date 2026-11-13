# Backlog sản phẩm (MoSCoW)

Phiên bản 0.1 · Ngày 2026-11-13 · Người lập: Mạnh (TV1) · Nguồn: SRS-01 §2.2 (mức module), SRS-01 §5 (ưu tiên từng FR), SRS-01 §9 (NFR)

Bản máy đọc được để nhập vào Jira/Trello: `docs/backlog.csv` (48 dòng). Quy ước mã: `BL-nnn`.

## 1. Quy tắc xếp mức

- **Must**: bắt buộc, không được cắt (file kế hoạch gốc §7: chỉ cắt từ Could/Should).
- **Should**: nên có, cắt được nếu thiếu thời gian.
- **Could**: có thể bỏ.
- Mức lấy từ ưu tiên của từng FR trong SRS §5 và §9; với M7 (Should/Could) áp dụng mức riêng của từng FR: FR-M7-01/02 = Should, FR-M7-03/04 = Could.

## 2. Tổng hợp

| Mức | Số mục | Mã |
|---|---|---|
| Must | 24 | BL-001, BL-002, BL-003, BL-005, BL-007, BL-008, BL-009, BL-010, BL-012, BL-013, BL-014, BL-016, BL-017, BL-018, BL-019, BL-020, BL-024, BL-025, BL-026, BL-027, BL-030, BL-031, BL-044, BL-046 |
| Should | 20 | BL-004, BL-011, BL-021, BL-022, BL-023, BL-028, BL-029, BL-032, BL-033, BL-034, BL-035, BL-037, BL-038, BL-041, BL-042, BL-043, BL-045, BL-047, BL-048 |
| Could | 4 | BL-015, BL-036, BL-039, BL-040 |
| **Tổng** | **48** | |

## 3. Backlog theo module

| Mã | Module | Mức | Số mục backlog | Người code | Người viết/chạy test | Mục tiêu sprint |
|---|---|---|---|---|---|---|
| M1 | Tài khoản và phân quyền | Must | 6 | Mạnh | Lộc | Sprint 1 |
| M2 | Hồ sơ thú cưng | Must | 5 | Tài | Mạnh | Sprint 1 |
| M3 | Danh mục dịch vụ và bảng giá | Must | 4 | Tài (Mạnh cho API M7) | Mạnh | Sprint 1–2 |
| M4 | Đặt lịch | Must | 8 API + 1 UI (BL-041) | Ngân | Tài | Sprint 1–2 |
| M5 | Vòng đời lịch hẹn | Must | 7 API + 1 UI (BL-042) | Ngân | Tài | Sprint 1–2 |
| M6 | Tính giá, khuyến mãi, thanh toán, thông báo | Should | 6 | Lộc | Ngân | Sprint 1–2 |
| M7 | Quản trị | Should/Could | 4 | Mạnh | Lộc | Sprint 2 |
| NFR | Yêu cầu phi chức năng | Must/Should | 6 | Theo mục 4.6 của Test Plan | Theo chuyên trách | Sprint 3 |
| UI | Giao diện M4/M5 theo ADR-03 | Should | 2 | Lộc | Tài | Sprint 2 |

## 4. Thứ tự thực hiện đề xuất

- **Sprint 1 (Ngày 6–7):** BL-001…BL-013, BL-016…BL-020, BL-024…BL-027, BL-030, BL-031 — tất cả mục Must của lõi M1–M5 và M6-01.
- **Sprint 2 (Ngày 7–9):** BL-014…BL-015, BL-021…BL-023, BL-028, BL-029, BL-032…BL-042.
- **Sprint 3 (Ngày 12–13):** BL-043…BL-048 và phần Could còn lại.

## 5. Cắt phạm vi và phương án dự phòng

Theo file kế hoạch gốc §7, chỉ cắt từ nhóm Could/Should. Thứ tự cắt đề xuất nếu thiếu thời gian: BL-040 → BL-039 → BL-036 → BL-015 → BL-048.

Rủi ro: mất nhóm Must sẽ vi phạm Exit criteria (TP-01 §5.2: 100% yêu cầu Must có ít nhất 1 test case), nên không bao giờ cắt Must.

## 6. Ghi chú

- BL-014: API dịch vụ cho Admin thuộc M3 (Tài code theo RTM-01), giao diện quản trị thuộc M7 (Mạnh code). Mục này ghi rõ để tránh trùng lặp khi chia việc.
- BL-041, BL-042: giao diện M4/M5 mới được giao cho Lộc tại quyết định của người dùng ngày 2026-11-13 (ADR-03).
- BL-046: NFR-04 là Must; phần kiểm thử độ tin cậy do Ngân chịu trách nhiệm.
