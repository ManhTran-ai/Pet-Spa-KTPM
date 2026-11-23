# Gate Ngày 9 — Hội trường thiết kế test + Walkthrough 4 CFG

Ngày: 2026-11-19 · Thành viên: Mạnh (TV1) · Vai: TESTER + tài liệu · Moderator hội trường
Biên bản hội trường: `docs/reviews/design-review.md` §6 · CR: `CHG-2026-11-19-02`

## 1. Kết quả từng lệnh

| # | Lệnh | Kết quả | Mã thoát | File thô |
| --- | --- | --- | --- | --- |
| 1 | `node scripts/build-pricing-baseline.mjs` | `pricing-baseline.csv`: 213 dòng { T1: 84 · T2: 88 · T3: 41 } — **có cột `Input_Guide`**; `test-data-baseline.csv`: **16 dòng** (mới) | 0 | — |
| 2 | `node scripts/tc-review-check.mjs` | 226 test case; **0 Major · 0 Minor · 0 Observation** | **0** | `reports/raw/tc-review-check.txt` |
| 3 | `npm run gate` | `req:check` 0 vi phạm (60 yêu cầu) · `rtm:check` độ phủ 100% · `assign:check` 4/4 nguyên tắc · `exit:check` 5/8 | **0** | `reports/rtm-coverage.md`, `reports/exit-criteria.md` |

## 2. Walkthrough 4 CFG — kết quả rà từng nhánh

Nguồn: `docs/design/mccabe-coverage.md` §2 (4 CFG dựng từ bảng quyết định SRS §8). Tổng \(V(G) = 21\).

| CFG | Bảng quyết định SRS | Node / Cạnh / V(G) | Nhánh đã đi / tổng | Trạng thái |
| --- | --- | --- | --- | --- |
| **CFG-1** Wizard T2 | §8.1 (SRS §8.1) | 6 / 9 / **5** | 8 / 9 | ⚠️ 1 nhánh chưa đi (xem §2.1) |
| **CFG-2** Wizard T1 | §8.2 | 5 / 7 / **4** | 6 / 7 | ⚠️ 1 nhánh chưa đi (xem §2.1) |
| **CFG-3** Chính sách hủy / đổi lịch | §8.3 | 6 / 11 / **7** | 11 / 11 | ✅ Đầy đủ |
| **CFG-4** Phụ thu di chuyển T1 | §8.4 | 5 / 8 / **5** | 8 / 8 | ✅ Đầy đủ |
| **Tổng** | — | **22 / 35 / V(G)=21** | **33 / 35 (94,3%)** | — |

**Bằng chứng phủ từng CFG (ca thật trong `docs/testcases/*.csv`):**

| CFG | Ca thật phủ nhánh | Số ca |
| --- | --- | --- |
| CFG-1 (§8.1 T2) | `TC-T2-M4-009` (quay lại giữ lựa chọn), `TC-T2-M4-013` (bỏ qua loài — bị chặn), `TC-T2-M4-014` (bỏ qua cân nặng — bị chặn), `TC-T2-M4-015` (nhảy thẳng — bị chặn), `TC-T2-M4-016` (quay lại rồi tiến tục), `TC-T2-M4-017` (quay lại bước đầu) | 6 |
| CFG-2 (§8.2 T1) | `TC-T1-M4-004`, `-005`, `-007`, `-009`, `-010`, `-011`, `-012` + `TC-T1-M6-001`/`-002` (nhánh rẽ tại W5) | 9 |
| CFG-3 (§8.3) | `TC-T1-M5-004`, `TC-T1-M5-005`, `TC-T2-M5-004`, `TC-T2-M5-005` + 4 ca UC bổ trợ (`TC-T1-M5-003`, `TC-T1-M5-006`, `TC-T2-M5-003`, `TC-T3-M5-002`) | 8 |
| CFG-4 (§8.4) | `TC-T1-M6-003`…`-014` (0/2/5/6/7/10/15/20 km + tắm/cạo/combo/tổng tiền) | 12 |

### 2.1. Hai nhánh **không thể** thực thi trong môi trường thật (ADR-11)

| Nhánh | Vì sao chưa đi được | Xử lý |
| --- | --- | --- |
| **CFG-1 · `S3 → ✗ "gửi form khi còn thiếu SĐT"`** (§8.1, T2) | Muốn đi nhánh này phải **gửi thật** form với SĐT thiếu → vi phạm ranh giới kiểm thử không phá hại (ADR-11). Ca `TC-T2-M4-002` (EP) đã chặn form ngay ở bước validate nên không tới được nhánh | Ghi nhận là **hạn chế của ranh giới kiểm thử**, không phải thiếu test. Đã nêu ở `mccabe-coverage.md` §2.6 và §6.2 |
| **CFG-2 · `W7 → ✗ "mọi chuyển từ trạng thái terminal"`** (§8.2, T1) | Sau khi xác nhận đơn, site **đóng modal** → không quan sát được trạng thái sau terminal | Gộp vào ca `TC-T1-M4-010` (nhảy thẳng bị chặn) |

**Kết luận walkthrough:** độ bao phủ Branch đo được là **94,3% (33/35 nhánh)**; Statement **100% (22/22 node)**; Condition **100% (16/16 điều kiện con đạt cả T và F)**. Hai nhánh chưa đi **không phải "hụt test"** — chúng là hệ quả trực tiếp của kiểm thử không phá hại trên hệ thống production. Đây là kết luận trung thực, không phải kết luận thuận lợi: nếu đánh dấu 2 nhánh này là đã phủ thì Branch Coverage sẽ là 100% nhưng **sai thực tế**.

**Mức Cấp 4 (Branch & Condition) = 94,3%** — bị giới hạn bởi chính 2 nhánh này, đã ghi rõ trong `mccabe-coverage.md` §2.6.

## 3. Đối chiếu tiêu chí Gate của Ngày 9

| Tiêu chí Gate | Trạng thái | Bằng chứng |
| --- | --- | --- |
| Hội trường thiết kế test có đủ 4 mục × 4 thành viên | Đạt | `design-review.md` §6.1 — 4/4 thành viên trình bày đủ 4 mục bắt buộc |
| Mọi ý kiến trong hội trường đã được quyết định | Đạt | `design-review.md` §6.2 — WF-01…WF-05, 5/5 đã chốt (WF-05 cố ý hoãn theo kế hoạch) |
| Phát hiện mới trong hội trường đã mở CR | Đạt | WF-01 → `CHG-2026-11-19-02` (SRS v1.3 → **v1.4**) |
| Bộ dữ liệu test dùng chung cho cả 4 thành viên | Đạt | `docs/reference/test-data-baseline.csv` (16 dòng) + cột `Input_Guide` trong `pricing-baseline.csv` (213 dòng) |
| Walkthrough 4 CFG đã ghi nhận cả nhánh không thể thực thi | Đạt | §2.1 — 2 nhánh, nêu rõ lý do ADR-11 |
| Slide trình bày của Mạnh đã tạo | Đạt | `docs/slides/slide-08-mccabe.md` (+ `mccabe-coverage.md` §6) |
| Linter 4C vẫn sạch sau thay đổi | Đạt | Lệnh 2: **0 Major · 0 Minor · 0 Observation** trên 226 ca |
| `npm run gate` exit 0 | Đạt | Lệnh 3 |
| Số lượng test case không đổi (226) | Đạt | 226 → 226 (không thêm, không bỏ) |
| Phân công vẫn cân bằng | Đạt | `assign:check`: Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58; chênh lệch 3 (≤ 3) |

## 4. Sản phẩm đã tạo / cập nhật trong Ngày 9

| Tệp | Nội dung |
| --- | --- |
| `docs/slides/slide-08-mccabe.md` | **Mới** — slide trình bày 10 phút của Mạnh (phân tích tĩnh · McCabe · độ bao phủ), theo `ASSIGNMENT.md` §3.8 |
| `docs/design/mccabe-coverage.md` | Bổ sung **§6** — kịch bản trình bày 10 phút: lý thuyết §3.1–§3.4 + §5.2–§5.4, 4 CFG, ví dụ thật (`TC-T1-M6-014`, `TC-T1-M6-010`, `TC-T2-M4-013/014`), giới hạn |
| `docs/reviews/design-review.md` | Bổ sung **§6** — biên bản hội trường: 4 mục × 4 thành viên (§6.1), 5 quyết định WF-01…WF-05 (§6.2), điều kiện đóng (§6.3) |
| `docs/reference/pricing-baseline.csv` | **Thêm cột `Input_Guide`** — mô tả cách điều hướng tới và nhập dữ liệu cho từng ca giá, trên cả T1/T2/T3 (213 dòng) |
| `docs/reference/test-data-baseline.csv` | **Mới** — 16 dòng dữ liệu dùng chung: giờ mở cửa, bậc cân nặng, công thức phụ thu, quy trình đặt lịch của 3 hệ thống |
| `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` | **v1.3 → v1.4** — `FR-M5-06` bổ sung điều kiện tiên quyết (chọn khung giờ ở T3 nằm sau cổng `FR-M4-13`) |
| `docs/change-requests.md` | Mở `CHG-2026-11-19-02` — trạng thái **Đã áp dụng** |
| `docs/design/state-transition.md` | §4 — sửa trạng thái `B3`/`B4` của T3 thành trạng thái **sau cổng khách hàng**, kèm ghi chú giải thích vì sao không kiểm thử được dưới ADR-11 |
| `docs/testcases/t3.csv` | `TC-T3-M5-003` / `TC-T3-M5-004` → trạng thái **`Blocked`** (đúng thực tế, không ghi vào execution log sớm) |
| `scripts/build-pricing-baseline.mjs` | Sinh cột `Input_Guide` + file `test-data-baseline.csv` |

## 5. Việc chưa làm trong Ngày 9 (chuyển sang Phase 3+)

- `exit:check` vẫn **5/8**:
  - **EC-2** — theo quyết định WF-05, siết ở **Ngày 13 / Phase 7**. Hiện công thức chỉ nhìn vào dòng đã có trong `reports/execution-log.csv` nên **đang đếm thiên lệch** (chỉ 6 ca đã chạy). Sẽ sửa để tính cả ca `Blocked` và ca chưa chạy.
  - **EC-5** — Lighthouse Performance (mobile) < 70 trên cả 3 site. Đây là **kết quả kiểm thử thật** của hệ thống đang vận hành, không phải lỗi đặc tả. Giữ FAIL, ghi rõ trong Final Test Report.
  - **EC-6** — giữ **FAIL** theo ADR-11 (1 phát hiện axe-core mức critical; 14/15 header bảo mật thiếu trên 1 hệ thống đo được).
  - **EC-7** — UAT cần con người ký, trạng thái `HUMAN-PENDING`.
- **Phase 3** — Dựng hạ tầng tự động hoá cho 56 ca của Mạnh: Playwright E2E cho T3 M2/M3/M4/M7, script BVA/DT, kiểm tra bảo mật NFR-02.
- **Phase 4** — System Test Round 1 trên T3 (17 ca) → `reports/execution-log.csv` + `docs/defects/defects.csv`.
- **Phase 5** — System Test Round 1 đối chiếu chéo T1 (27 ca).
- **Phase 6** — Kiểm thử bảo mật NFR-02 (12 ca) + sàng lọc lỗi.
- **Phase 7** — Tích hợp, hồi quy, siết EC-2.
- **Phase 8** — Báo cáo kiểm thử cuối, bài học kinh nghiệm, đóng gói hồ sơ nộp.

## 6. Ghi chú rủi ro

- **Rủi ro thay đổi hành vi site đích trong kỳ kiểm thử.** 11 ca T3 viết lại ở Phase 1 và 2 ca `Blocked` ở Phase 2 phụ thuộc vào hành vi hiện tại của nền tảng Groomore. Nếu site đổi luồng drawer giữa chừng, đó là **kết quả kiểm thử** (defect hoặc thay đổi nghiệp vụ), không phải lỗi của đặc tả — SRS §2.6.
- **`FR-M4-13` và `FR-M7-07` là đặc tả hành vi hiện hữu**, không phải yêu cầu chức năng mong muốn. Nhóm không đề xuất sửa site đích.
- **Độ bao phủ Branch 94,3% phải được đọc kèm §2.1.** Nếu ai đọc `mccabe-coverage.md` mà bỏ qua giới hạn này sẽ hiểu sai kết luận. Đã in lại bảng này ngay trong báo cáo Gate để tránh sai lệch khi trích dẫn.
- **2 ca `Blocked` chưa được đưa vào execution log** — cố ý giữ để EC-2 tính đúng ở Phase 7, tránh báo cáo độ phủ ảo.
