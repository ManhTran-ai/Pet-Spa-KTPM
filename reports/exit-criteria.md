# Chấm Exit criteria

Căn cứ: TP-01 §5.2 · Nguồn số liệu: `docs/`, `reports/`

| Mã | Tiêu chí | Kết quả | Trạng thái | Nguồn |
| --- | --- | --- | --- | --- |
| EC-1 | 100% yêu cầu Must có ít nhất 1 test case | 40/40 yêu cầu Must đã phủ | PASS | docs/rtm.csv, docs/requirements.csv |
| EC-2 | 100% test case Critical/High đã thực thi, tỷ lệ Pass ≥ 95% | Critical/High đã thực thi 104/203 (51.2%), Pass 87.5% trong nhóm này; toàn bộ 114 ca đã chạy, Pass 83.3% | FAIL | reports/execution-log.csv, docs/testcases/*.csv |
| EC-3 | 0 lỗi Critical/High còn mở, mọi lỗi đi qua đủ vòng đời | 3 lỗi Critical/High đang mở trong tổng 28 lỗi | FAIL | docs/defects/defects.csv |
| EC-4 | Mỗi hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh | 23 test case tự động Pass; 3/3 hệ thống có bộ E2E xanh | PASS | reports/execution-log.csv, tests/e2e/ |
| EC-5 | NFR-01 đạt: điểm Lighthouse Performance (mobile) ≥ 70 trên cả 3 site | điểm thấp nhất 3 | FAIL | reports/raw/lighthouse-summary.csv |
| EC-6 | NFR-02 đạt: không có phát hiện bảo mật mức Critical/High | 1 phát hiện axe-core mức critical; thiếu 14/15 header bảo mật (chỉ 1/3 site có ít nhất 1 header); TLS hợp lệ 3/3 site; lộ cookie phiên 0/3 site; rò rỉ khoá API/chuỗi kết nối 1/3 site | FAIL | reports/raw/axe-summary.csv, reports/raw/security-summary.csv |
| EC-7 | UAT không có phản hồi chặn | HUMAN-PENDING — báo cáo UAT đã có nhưng chưa thực thi | FAIL | reports/uat-report.md |
| EC-8 | Mỗi thành viên có ≥ 1 tài liệu thiết kế test đã được review chéo | 5 tài liệu thiết kế, tất cả đã review chéo | PASS | docs/design/design-index.csv |

**Tổng: 3/8 tiêu chí đạt.**

## Ranh giới Hướng 2 — vì sao một số tiêu chí FAIL

Theo **ADR-15 (Hướng 2)**, nhóm kiểm thử **phần mềm đang hoạt động** của bên thứ ba mà không có mã nguồn và không có quyền triển khai. Do đó:

1. Test **phải Fail trung thực** khi ứng dụng đích có lỗi — không được nới lỏng tiêu chí để "ép xanh" (ASG-01 §5.3).
2. Mọi lỗi phải được ghi thành defect trong `docs/defects/defects.csv` với bằng chứng thô trong `reports/raw/`.
3. Tiêu chí FAIL vì lỗi thật của bên thứ ba là **kết quả đúng** của quy trình, không phải bằng chứng thiếu chất lượng.

| Tiêu chí | Lý do bị chặn bởi ranh giới Hướng 2 |
| --- | --- |
| EC-2 | Tỷ lệ Pass của nhóm Critical/High bị kéo xuống bởi lỗi thật của site đích (mỗi lỗi đã có defect trong `docs/defects/defects.csv`). |
| EC-3 | Lỗi Critical/High còn mở thuộc mã nguồn production của bên thứ ba — không sửa được trong phạm vi dự án Hướng 2. |
| EC-5 | Điểm Lighthouse Performance và LCP phụ thuộc hạ tầng/CDN của bên thứ ba, nằm ngoài phạm vi thay đổi của nhóm. |
| EC-6 | Thiếu header bảo mật, thiếu `alt`, thiếu tương phản màu và thiếu `h1` là cấu hình máy chủ/markup của bên thứ ba. |

Các tiêu chí **EC-1, EC-4, EC-8** đạt vì chúng nằm trong tầm kiểm soát của nhóm (truy xuết yêu cầu, bộ E2E tự động, tài liệu thiết kế đã review chéo).
