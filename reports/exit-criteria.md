# Chấm Exit criteria

Căn cứ: TP-01 §5.2 · Nguồn số liệu: `docs/`, `reports/`

| Mã | Tiêu chí | Kết quả | Trạng thái | Nguồn |
| --- | --- | --- | --- | --- |
| EC-1 | 100% yêu cầu Must có ít nhất 1 test case | 41/41 yêu cầu Must đã phủ | PASS | docs/rtm.csv, docs/requirements.csv |
| EC-2 | 100% test case Critical/High đã thực thi, tỷ lệ Pass ≥ 95% | Critical/High: 73/73 đã thực thi (100.0%), Pass 84.9% · toàn bộ ca đã chạy: 81 | FAIL | reports/execution-log.csv |
| EC-3 | 0 lỗi Critical/High còn mở, mọi lỗi đi qua đủ vòng đời | 0 lỗi Critical/High đang mở trong tổng 28 lỗi | PASS | docs/defects/defects.csv |
| EC-4 | Mỗi hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh | 23 test case tự động Pass · theo hệ thống: T1=10, T2=1, T3=4 | PASS | reports/execution-log.csv, tests/e2e/ |
| EC-5 | NFR-01 đạt: điểm Lighthouse Performance (mobile) ≥ 70 trên cả 3 site | điểm thấp nhất 3 | FAIL | reports/raw/lighthouse-summary.csv |
| EC-6 | NFR-02 đạt: không có phát hiện bảo mật mức Critical/High | 1 phát hiện axe-core mức critical; thiếu 14/15 header bảo mật (chỉ 1/3 site có ít nhất 1 header); TLS hợp lệ 3/3 site; lộ cookie phiên 0/3 site; rò rỉ khoá API/chuỗi kết nối 1/3 site | FAIL | reports/raw/axe-summary.csv, reports/raw/security-summary.csv |
| EC-7 | UAT không có phản hồi chặn | HUMAN-PENDING | FAIL | reports/uat-report.md |
| EC-8 | Mỗi thành viên có ≥ 1 tài liệu thiết kế test đã được review chéo | 5 tài liệu thiết kế, tất cả đã review chéo | PASS | docs/design/design-index.csv |
