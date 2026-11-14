# Chấm Exit criteria

Căn cứ: TP-01 §5.2 · Nguồn số liệu: `docs/`, `reports/`

| Mã | Tiêu chí | Kết quả | Trạng thái | Nguồn |
| --- | --- | --- | --- | --- |
| EC-1 | 100% yêu cầu Must có ít nhất 1 test case | 40/40 yêu cầu Must đã phủ | PASS | docs/rtm.csv, docs/requirements.csv |
| EC-2 | 100% test case Critical/High đã thực thi, tỷ lệ Pass ≥ 95% | 30 ca đã chạy, Pass 60.0% | FAIL | reports/execution-log.csv |
| EC-3 | 0 lỗi Critical/High còn mở, mọi lỗi đi qua đủ vòng đời | 0 lỗi Critical/High đang mở trong tổng 21 lỗi | PASS | docs/defects/defects.csv |
| EC-4 | Mỗi hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh | 15 test case tự động Pass | PASS | reports/execution-log.csv, tests/e2e/ |
| EC-5 | NFR-01 đạt: điểm Lighthouse Performance (mobile) ≥ 70 trên cả 3 site | điểm thấp nhất 3 | FAIL | reports/raw/lighthouse-summary.csv |
| EC-6 | NFR-02 đạt: không có phát hiện bảo mật mức Critical/High | 1 phát hiện axe-core mức critical; 14/15 header bảo mật thiếu trên 1 hệ thống đo được | FAIL | reports/raw/axe-summary.csv, reports/raw/security-summary.csv |
| EC-7 | UAT không có phản hồi chặn | HUMAN-PENDING | FAIL | reports/uat-report.md |
