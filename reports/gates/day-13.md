# Gate Ngày 13 — Regression tự động toàn bộ + Exit criteria

**Người lập:** Tài (TV2) · **Ngày:** 2026-11-22
**Căn cứ:** `docs/ASSIGNMENT.md` §3.5 (Ngày 13) · §3A.4 mục 9 (`npm run gate` exit 0 trước khi commit)

---

## 1. `npm run gate` — exit code 0 ✅

Gate = `req:check && rtm:check && assign:check && exit:check`

| Gate | Kết quả | Chi tiết |
| --- | --- | --- |
| `req:check` | ✅ PASS | 58 yêu cầu (51 FR + 7 NFR); 0 ID trùng; 0 ID lệch giữa CSV và SRS; **0 vi phạm** |
| `rtm:check` | ✅ PASS | `reports/rtm-coverage.md` — truy xuất 2 chiều đạt 100% |
| `assign:check` | ✅ PASS | 226 ca; Owner Tài 55 / Mạnh 56 / Lộc 58 / Ngân 57; chênh lệch max−min = 3 (≤ 3); 0 module chỉ có 1 người chạy; **4/4 nguyên tắc OK** |
| `exit:check` | ⚠️ 3/8 tiêu chí đạt | Xem §2 — 5 tiêu chí còn lại bị chặn bởi ranh giới Hướng 2 hoặc phụ thuộc con người |

Raw log: `reports/raw/gate-day13.txt`

---

## 2. Exit criteria — 3/8 đạt

| Mã | Kết quả | Trạng thái |
| --- | --- | --- |
| EC-1 | 40/40 yêu cầu Must đã phủ | **PASS** |
| EC-2 | Critical/High đã thực thi 104/203 (51,2%); Pass 87,5% trong nhóm này; toàn bộ 114 ca Pass 83,3% | FAIL |
| EC-3 | 3 lỗi Critical/High đang mở trong tổng 28 lỗi | FAIL |
| EC-4 | 23 test case tự động Pass; **3/3 hệ thống có bộ E2E xanh** | **PASS** |
| EC-5 | điểm Lighthouse Performance thấp nhất 3 | FAIL |
| EC-6 | 1 phát hiện axe-core mức critical; 14/15 header bảo mật thiếu | FAIL |
| EC-7 | UAT chưa chạy (cần 5–8 người ngoài nhóm) | FAIL — HUMAN-PENDING |
| EC-8 | 5 tài liệu thiết kế, tất cả đã review chéo | **PASS** |

### Phân loại nguyên nhân FAIL

| Tiêu chí | Nguyên nhân | Trong tầm kiểm soát của nhóm? |
| --- | --- | --- |
| EC-2 | Tỷ lệ Pass nhóm Critical/High bị kéo xuống bởi lỗi thật của site đích | ❌ Không — đã có defect cho mọi Fail |
| EC-3 | 3 lỗi Critical/High còn mở thuộc mã nguồn production bên thứ ba | ❌ Không — không có quyền triển khai |
| EC-5 | Điểm Lighthouse Performance/LCP phụ thuộc hạ tầng & CDN bên thứ ba | ❌ Không |
| EC-6 | Thiếu header bảo mật, thiếu `alt`, thiếu tương phản, thiếu `h1` | ❌ Không |
| EC-7 | UAT cần người dùng thật (5–8 người ngoài nhóm) | ✅ Có — nhưng là việc cần con người, do Lộc (TV4) phụ trách Ngày 13 |

**Kết luận:** 4/5 tiêu chí FAIL nằm ngoài tầm kiểm soát của nhóm theo **ADR-15 (Hướng 2)** — kiểm thử phần mềm đang hoạt động của bên thứ ba, không có mã nguồn, không có quyền triển khai. Theo **ASG-01 §5.3**, hành động đúng đắn là **để test Fail trung thực** và **ghi defect**, không phải hạ ngưỡng để ép xanh.

Chi tiết đầy đủ: `reports/exit-criteria.md`

---

## 3. Regression tự động toàn bộ

| Chỉ số | Giá trị |
| --- | --- |
| Lệnh | `npx playwright test --project=t1 --project=t2 --project=t3 --project=nfr --project=security` |
| Kết quả | **98 passed · 19 failed · 1 skipped** |
| Thời gian | 7,9 phút |
| Fail chưa có nguyên nhân | **0** |
| Mọi Fail có defect | ✅ 19/19 |

Chi tiết từng lỗi: `reports/regression-report.md` · Raw log: `reports/raw/regression-day13.txt`

---

## 4. `npm run lint` / `npm run typecheck`

| Lệnh | Kết quả |
| --- | --- |
| `npm run lint` | 0 error, 7 warning (tất cả là biến không dùng trong script khảo sát cũ) |
| `npm run typecheck` | ✅ sạch — 0 lỗi |

> Đã sửa 2 lỗi TypeScript phát sinh khi bổ sung bằng chứng chẩn đoán cho `TC-NFR-04-005` và `TC-NFR-03-004b/c`:
> `NodeListOf<Element>` không có `[Symbol.iterator]` → chuyển sang `Array.from(...)`; và ép kiểu
> thuộc tính `disabled` qua `Element & { disabled?: boolean }` để không phụ thuộc tag phần tử.

---

## 5. Định nghĩa đã xong (Definition of Done — Tài, §3A.4)

| # | Mục | Trạng thái | Bằng chứng |
| --- | --- | --- | --- |
| 1 | ≥ 1 tài liệu thiết kế trong `docs/design/` | ✅ | `docs/design/test-design-techniques.md` |
| 2 | Đã được review chéo | ✅ | `docs/design/design-index.csv` (Ngân review Tài) |
| 3 | Chạy hết test case của mình | ✅ **55/55** | `reports/execution-log.csv` |
| 4 | Đối chiếu chéo: mọi ca T2 đều có kết luận | ✅ 17/17 | `reports/execution-log.csv` (System=T2) |
| 5 | Mọi Fail đã có defect tương ứng | ✅ | `npm run exit:check` → EC-3 + kiểm tra `Defect_ID` rỗng = 0 |
| 6 | Bằng chứng thô trong `reports/raw/` | ✅ | `reports/raw/t1-network.json`, `t1-int-*.json`, `regression-day13.txt`, `gate-day13.txt` |
| 7 | NFR chuyên trách có số liệu thật, không hạ ngưỡng | ✅ | `reports/raw/lighthouse-summary.csv`, `axe-summary.csv`, `security-summary.csv` |
| 8 | Trình bày 10 phút tại hội trường thiết kế test | ✅ Đã thực hiện Ngày 8 | `docs/reviews/design-review.md` |
| 9 | `npm run gate` exit 0 trước khi commit | ✅ | `reports/raw/gate-day13.txt` |
