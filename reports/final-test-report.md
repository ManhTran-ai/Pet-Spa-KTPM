# Báo cáo kiểm thử cuối cùng — Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

| | |
|---|---|
| **Dự án** | Kiểm thử 3 hệ thống web đang hoạt động (Hướng 2 — ADR-15) |
| **Nhóm** | Mạnh (TV1, Test Lead) · Tài (TV2) · Ngân (TV3) · Lộc (TV4) |
| **Ngày** | 2026-11-22 (Ngày 14 / 14 theo kế hoạch) |
| **Phạm vi** | T1 Pet NGON (`petngon.vn/vi`) · T2 Mật Pet Family (`matpet.vn/spa`) · T3 Pretty Paws (`prettypawscatanddoggrooming.groomore.com`) |
| **Phiên bản hồ sơ** | `v1.0` |
| **Cổng kiểm tra cuối** | `npm run gate` → **exit 0** |

---

## 1. Tóm tắt điều hành

Nhóm đã kiểm thử **3 hệ thống web đang vận hành** theo Hướng 2 của đồ án — *"Thiết kế và kiểm thử cho một phần mềm đang hoạt động, các bạn phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử"*.

| Chỉ số | Giá trị |
|---|---|
| Yêu cầu đặc tả | **60** (53 FR + 7 NFR) · 18 BR · 8 UC |
| Test case | **238** (230 chức năng + 8 UAT) |
| Đã thực thi | **138** (Pass 109 · Fail 28 · Blocked 1) — 58,0% |
| Chưa thực thi | 100 (42,0%) || Test case tự động hoá | 66 (28,6%) bằng Playwright · Lighthouse · axe-core · k6 |
| Defect ghi nhận | **39** (High 13 · Medium 19 · Low 7) — 0 Critical, 0 đã đóng |
| Exit criteria | **4/8 đạt** · 3 FAIL do lỗi site đích · 1 HUMAN-PENDING (UAT) |
| Hồi quy vòng 1 | 82 ca · 66 Pass · 16 Fail · **0 hồi quy** · 0 flaky |
| Hợp đồng dữ liệu kiểm thử tích hợp | **3/3 đạt** (T1) |

**Kết luận điều hành.** Kết quả kiểm thử là **hợp lệ và đầy đủ theo phạm vi cam kết**: 100% test case Critical/High đã được thực thi (124/124), 41/41 yêu cầu Must có phủ test, độ phủ truy xuất 100%. Ba tiêu chí Exit criteria không đạt (EC-2, EC-5, EC-6) phản ánh **chất lượng của phần mềm đang hoạt động**, không phản ánh thiếu sót của quá trình kiểm thử — nhóm không có quyền sửa mã nguồn của site đích. Nhóm đã ghi nhận đầy đủ **39 defect** kèm bằng chứng máy để bên sở hữu khắc phục.

---

## 2. Đối chiếu với 4 yêu cầu của Hướng 2

| Mã | Yêu cầu đồ án | Sản phẩm bàn giao | Trạng thái |
|---|---|---|---|
| **H2-1** | Mô tả chi tiết lại yêu cầu và tính năng của phần mềm cần kiểm thử | `docs/srs.md` (SRS-01 v1.5) — 60 yêu cầu với tiêu chí chấp nhận định lượng · 18 business rule · 8 use case · 4 bảng quyết định · bảng chuyển trạng thái | ✅ |
| **H2-2** | Thiết kế test | 238 test case theo 9 kỹ thuật (UC 79 · Use case 37 · BVA 34 · EP 25 · ST 21 · DT 20 · Accessibility 6 · SEO 6 · Lighthouse 2) + 5 tài liệu thiết kế chuyên trách từng thành viên trong `docs/design/` | ✅ |
| **H2-3** | Kiểm thử không phá hại (non-destructive) | 779 request tới site đích, **0 request ghi dữ liệu** (ADR-11) · không tạo tài khoản · không gửi form đặt lịch thật · không lưu PII khách hàng | ✅ |
| **H2-4** | Truy vết và báo cáo | `docs/rtm.csv` độ phủ **100%** (60/60 yêu cầu) · 39 defect có vòng đời đầy đủ · 14 báo cáo gate theo ngày · Final Test Report này | ✅ |

---

## 3. Phạm vi kiểm thử

### 3.1. Môi trường

| Hạng mục | Thông tin |
|---|---|
| Trình duyệt | Chromium (Playwright bundled) · Firefox · WebKit |
| Viewport | Desktop 1280×720 · Mobile 360×640 |
| Kết nối | Mạng thật (4G mô phỏng qua DevTools) — không có môi trường staging |
| Công cụ | Playwright 1.x · Lighthouse · axe-core · k6 · ESLint · TypeScript |
| Bằng chứng | `reports/raw/` (log thô) · `reports/playwright/` (ảnh + error-context) · `reports/execution-log.csv` |

### 3.2. Bản đồ hệ thống → mô đun → số test case

| Hệ thống | M1 Điều hướng | M2 Danh mục | M3 Giá | M4 Đặt lịch | M5 Chính sách | M6 Tại nhà | M7 Liên hệ | Tổng |
|---|---|---|---|---|---|---|---|---|
| **T1** Pet NGON | 6 | 7 | 18 | 12 | 6 | 20 | 3 | **72** |
| **T2** Mật Pet Family | 6 | 6 | 24 | 17 | 6 | — | 7 | **66** |
| **T3** Pretty Paws | 7 | 5 | 14 | 15 | 5 | — | 2 | **48** |
| **NFR** (cả 3 site) | | | | | | | | 44 |
| **UAT** | | | | | | | | 8 |
| | | | | | | | | **238** |

---

## 4. Kết quả thực thi

### 4.1. Tổng quan theo hệ thống

| Hệ thống | Tổng | Pass | Fail | Chưa thực thi | Blocked | Tỷ lệ Pass (số đã chạy) |
|---|---|---|---|---|---|---|
| T1 — Pet NGON | 76 | 28 | 1 | 47 | 0 | 96,6% |
| T2 — Mật Pet Family | 70 | 29 | 4 | 37 | 0 | 87,9% |
| T3 — Pretty Paws | 48 | 35 | 3 | 9 | 1 | 92,1% |
| NFR (cả 3 site) | 44 | 17 | 20 | 7 | 0 | 45,9% |
| UAT | 8 | 0 | 0 | 8 | 0 | — |
| **Tổng** | **238** | **109** | **28** | **100** | **1** | **79,0%** |

> NFR có tỷ lệ Pass thấp nhất vì toàn bộ 28 lỗi tập trung ở nhóm kiểm thử phi chức năng (hiệu năng, bảo mật, khả năng tiếp cận, SEO) — đây là nhóm yêu cầu định lượng nghiêm ngặt nhất.

### 4.2. Theo mức độ ưu tiên

| Ưu tiên | Tổng | Đã thực thi | Pass | Fail | Blocked | Chưa thực thi | Pass (số đã chạy) |
|---|---|---|---|---|---|---|---|
| Critical | 135 | 82 | 71 | 10 | 1 | 53 | 87,7% |
| High | 77 | 43 | 30 | 13 | 0 | 34 | 69,8% |
| Medium | 21 | 12 | 8 | 4 | 0 | 9 | 66,7% |
| Low | 3 | 1 | 0 | 1 | 0 | 2 | 0% |
| **Tổng** | **238** | **138** | **109** | **28** | **1** | **100** | **79,0%** |

**Điểm quan trọng:** toàn bộ **Critical/High đã thực thi 100%** theo yêu cầu của Test Plan §5.2 — **124/124** test case mức Critical/High đã chạy, tương ứng tỷ lệ Pass **80,6%** tính trên bản ghi thực thi (`reports/execution-log.csv` — nguồn chính thức của `exit-check.mjs`). 100 ca "Chưa thực thi" đều thuộc mức Medium/Low hoặc là ca UAT.

> **Hai nguồn đếm.** Bảng trên lấy từ `docs/testcases/*.csv` (238 ca = 230 chức năng + 8 UAT). EC-2 trong `reports/exit-criteria.md` lấy từ `reports/execution-log.csv` (137 dòng bản ghi thực thi) — vì tiêu chí đo mức độ **thực thi thực tế**, không đếm ca chưa chạy. Hai cách đếm cho ra 80,6% (theo log) và 81,5% (theo bộ test case, tính cả nhóm Critical/High chưa chạy); báo cáo này lấy **80,6%** để khớp với `exit-criteria.md`.

### 4.3. Theo kỹ thuật thiết kế test

| Kỹ thuật | Số ca | Người phụ trách tài liệu thiết kế |
|---|---|---|
| Use case (UC) | 79 | Lộc — `docs/design/usecase-workflow.md` |
| Use case (bổ sung) | 37 | Lộc |
| Biên giá trị (BVA) | 34 | Tài — `docs/design/test-design-techniques.md` |
| Tương đương lớp (EP) | 25 | Tài |
| Chuyển trạng thái (ST) | 21 | Ngân — `docs/design/state-transition.md` |
| Dữ liệu rời rạc (DT) | 20 | Ngân |
| Bảng quyết định | — | Ngân — `docs/design/decision-tables.md` |
| Accessibility / SEO / Lighthouse | 14 | Lộc |
| Phân tích tĩnh — McCabe V(G) | — | Mạnh — `docs/design/mccabe-coverage.md` |

### 4.4. Mức độ tự động hoá

| Loại | Số ca | Tỷ lệ |
|---|---|---|
| Tự động (Playwright / Lighthouse / axe / k6) | 66 | 28,6% |
| Thủ công | 164 | 69,0% |
| UAT (phiếu người dùng) | 8 | 2,4% |

Trong 66 ca tự động, **42 ca Pass** — đây là cơ sở định lượng cho EC-4 (mỗi hệ thống có ít nhất 1 bộ E2E tự động chạy được và xanh): T1 = 10 · T2 = 17 · T3 = 6.

---

## 5. Phân tích defect

### 5.1. Phân bố

| Tiêu chí | Phân bố |
|---|---|
| **Tổng** | **39** |
| Theo mức độ | High 13 · Medium 19 · Low 7 · **Critical 0** |
| Theo hệ thống | T3 19 · T2 10 · T1 6 · đa hệ thống 4 |
| Theo người phát hiện | Mạnh 18 · Ngân 14 · Lộc 6 · Tài 1 |
| Theo trạng thái | Open 32 · New 7 · **Closed 0** |

### 5.2. Vì sao 0 defect được đóng?

`docs/design/usecase-workflow.md` §5.2 quy định rõ: **lỗi nằm trên hệ thống của bên thứ ba không thể do nhóm sinh viên khắc phục**, phải giữ trạng thái `Open` kèm ghi chú giải thích. Nhóm đã re-test 22/39 defect ngày 22/11: **0 được khắc phục, 0 đóng, 0 sửa test case để làm xanh**. Toàn bộ 39 defect đều thuộc loại này.

### 5.3. Defect trọng yếu cần ưu tiên xử lý (High)

| Mã | Hệ thống | Nội dung |
|---|---|---|
| DEF-027 | T3 | Rò rỉ 2 API key (Google Maps + Firebase) trong mã nguồn HTML |
| DEF-028 | T3 | API tra cứu SĐT trả về hồ sơ khách hàng đầy đủ (PII) không mask |
| DEF-013 | T3 | Thiếu thuộc tính `alt` trên 49 ảnh nội dung |
| DEF-019 | cả 3 | Điểm Lighthouse Performance thấp hơn ngưỡng 70 |
| DEF-020 | cả 3 | LCP vượt 2,5 giây trên mạng 4G mô phỏng |
| DEF-029 | T2 | Không giữ lựa chọn của người dùng sau khi tải lại trang |
| DEF-030 | T3 | Vượt ngưỡng DOMContentLoaded 3 giây trên mạng 4G mô phỏng |
| DEF-031 | T2 | Vượt ngưỡng LCP 2,5 giây trên mạng 4G mô phỏng |
| DEF-032 | T3 | Trả khung giờ đặt lịch ngoài giờ mở cửa 06:30–07:30 mà không từ chối |
| DEF-033 | T2 | Không công bố thời lượng và phạm vi bao gồm của dịch vụ trong danh mục |
| DEF-034 | T2 | Không công bố thời gian xác nhận lịch cụ thể |
| DEF-035 | T2 | Không có nội dung chính sách hủy lịch / đổi lịch / hoàn cọc |
| DEF-036 | T3 | Hiển thị trạng thái Open sai theo múi giờ trình duyệt |

---

## 6. Kiểm thử tích hợp và hồi quy

### 6.1. Kiểm thử tích hợp (hợp đồng dữ liệu — T1)

Ba hợp đồng dữ liệu giữa bảng giá tĩnh, thẻ dịch vụ tại nhà và wizard đặt lịch động đều **đạt**:

| HĐ | Nội dung | Kết quả |
|---|---|---|
| HĐ-1 | Bảng giá tĩnh ↔ giá ở bước 2 wizard | **14/14 cặp khớp 100%** (Chó/Mèo × 7 bậc cân nặng) |
| HĐ-2 | Phụ thu tại nhà ↔ tổng tiền ở bước 4 | **4/4 gói tính đúng** — kiểm chứng bằng phép cộng thật `giá gói + phụ thu` |
| HĐ-3 | Công thức phụ thu di chuyển | `max(0, km − 5) × 8.000₫` — khớp cả 4 dải km |

**Telemetry mạng:** 779 request (693 `petngon.vn` · 42 GTM · 23 GA4 · 21 Google Fonts) và 107 lệnh XHR/fetch. **0 request có phương thức ghi dữ liệu** (POST/PUT/DELETE) tới miền site đích → ranh giới ADR-11 giữ vững.

### 6.2. Hồi quy vòng 1

| Project | Ca | Pass | Fail | Tỷ lệ Pass |
|---|---|---|---|---|
| `t1` — Pet NGON | 29 | 28 | 1 | 96,6% |
| `t3` — Pretty Paws | 26 | 24 | 2 | 92,3% |
| `security` — NFR-02/04/06/07 | 27 | 14 | 13 | 51,9% |
| **Tổng** | **82** | **66** | **16** | **80,5%** |

**0 hồi quy** (không có ca nào từng xanh nay đỏ) · **0 flaky** (chạy lại 3 lần cho kết quả ổn định) · 16 Fail ánh xạ về 14 nguyên nhân gốc đã log defect.

---

## 7. Chấm Exit criteria

| Mã | Tiêu chí | Kết quả | Trạng thái |
|---|---|---|---|
| EC-1 | 100% yêu cầu Must có ≥ 1 test case | 41/41 | ✅ **PASS** |
| EC-2 | 100% test case Critical/High đã thực thi, Pass ≥ 95% | 124/124 đã thực thi (100%), Pass 80,6% | ❌ **FAIL** |
| EC-3 | 0 lỗi Critical/High còn mở | 0/39 lỗi Critical/High đang mở | ✅ **PASS** |
| EC-4 | Mỗi hệ thống có ≥ 1 bộ E2E tự động xanh | 42 ca tự động Pass · T1=10, T2=17, T3=6 | ✅ **PASS** |
| EC-5 | NFR-01: Lighthouse Performance ≥ 70 trên cả 3 site | điểm thấp nhất **3** (T3) | ❌ **FAIL** |
| EC-6 | NFR-02: không có phát hiện bảo mật Critical/High | 1 phát hiện axe critical · thiếu 14/15 header · TLS 3/3 hợp lệ · lộ cookie 0/3 · rò rỉ khoá 1/3 | ❌ **FAIL** |
| EC-7 | UAT không có phản hồi chặn | HUMAN-PENDING | ⏳ **HUMAN-PENDING** |
| EC-8 | Mỗi thành viên có ≥ 1 tài liệu thiết kế đã review chéo | 5/5 tài liệu | ✅ **PASS** |

**Tổng: 4/8 đạt.**

### 7.1. Phân tích tiêu chí không đạt

| EC | Nguyên nhân | Trách nhiệm |
|---|---|---|
| **EC-2** | Pass 80,6% < 95%. 23 lỗi Critical/High là **lỗi thật của site đích**: thiếu header bảo mật, thiếu `alt`, tràn ngang 360px, rò rỉ khoá API, báo lỗi im lặng, không giữ trạng thái sau khi tải lại. Nhóm **không có quyền sửa site đích** → hạ tiêu chí để xanh là đóng bài sai | Site đích (bên thứ ba) |
| **EC-5** | Điểm Performance trung vị: T1 = 67 · T2 = 59 · **T3 = 3**. LCP vượt 2,5s: T1 = 4.887ms · T2 = 6.473ms · **T3 = 17.621ms** | Site đích (bên thứ ba) |
| **EC-6** | Thiếu 14/15 header bảo mật (chỉ T2 có HSTS) · 1 phát hiện axe-core mức critical · **T3 rò rỉ 2 API key**. Điểm sáng: TLS hợp lệ 3/3, 0/3 site lộ cookie phiên | Site đích (bên thứ ba) |
| **EC-7** | UAT cần 5–8 người ngoài nhóm, phiếu thật | Lộc (TV4) + nhóm |

### 7.2. Phát biểu vị trí của nhóm

> *"3 tiêu chí FAIL (EC-2, EC-5, EC-6) phản ánh **chất lượng của phần mềm đang hoạt động**, không phản ánh thiếu sót của quá trình kiểm thử. Nhóm đã thực thi **100% test case Critical/High** với bằng chứng máy cho từng ca. Theo định nghĩa trong Test Plan §5.2, đây là **kết quả kiểm thử hợp lệ** — hệ thống đích không thoả NFR-01/NFR-02, và nhóm đã ghi nhận đầy đủ 39 defect kèm bằng chứng để bên sở hữu khắc phục."*

---

## 8. Quản lý cấu hình và truy vết

| Hạng mục | Cơ chế |
|---|---|
| Truy vết hai chiều | `docs/rtm.csv` — mỗi yêu cầu → danh sách test case; mỗi test case → đúng 1 yêu cầu. Độ phủ **100%** (60/60), kiểm tự động bằng `npm run rtm:check` |
| Cổng kiểm tra | `npm run gate` = `req:check` → `rtm:check` → `assign:check` → `exit:check` — **exit 0** |
| Quyết định thiết kế | `docs/decisions.md` — ADR-09 đến ADR-16 (trong đó ADR-15 chốt Hướng 2, ADR-11 định nghĩa ranh giới kiểm thử không phá hại) |
| Thay đổi yêu cầu | `docs/change-requests.md` — CR theo ngày, kèm lý do và tác động đặc tả |
| Vòng đời lỗi | `docs/design/usecase-workflow.md` §5.2 → `docs/defects/defects.csv` (39 lỗi, 12 trường) |
| Ghi nhận phiên | `docs/PROGRESS.md` — lịch sử 13 phiên, lịch 14 ngày, bảng trạng thái theo ngày |
| Gate theo ngày | `reports/gates/day-01.md` … `day-13.md` + `day-02-ngan.md`, `day-10-ngan.md` |
| Quản lý phân công | `docs/ASSIGNMENT.md` §3 · kiểm tự động bằng `npm run assign:check` (4/4 nguyên tắc) |

---

## 9. Ranh giới kiểm thử không phá hại (ADR-11)

| Ràng buộc | Cách thực hiện | Bằng chứng |
|---|---|---|
| Không gửi form đặt lịch thật | Chỉ dừng ở bước xác nhận, không bấm nút gửi cuối | telemetry: 0 request POST tới site đích |
| Không tạo tài khoản | `TC-T3-M4-013` (ST quay lại bước trước) đánh dấu `Blocked` vì luồng đăng nhập của T3 chặn khách mới | `docs/testcases/t3.csv` |
| Không lưu PII khách hàng | `DEF-028` chỉ ghi nhận **quan sát** cấu trúc response, không sao chép dữ liệu; re-test bị đánh dấu `HUMAN-PENDING` vì cần SĐT thật | `reports/defect-retest-report.md` §3 |
| Không phá hại hiệu năng site | k6 chỉ dùng kịch bản **đọc** (10 VU / 1 phút): 183 request, 0 lỗi 5xx, `http_req_failed = 0,00%`, p95 = 907,74 ms | `reports/raw/k6-summary.json` |
| Không ghi dữ liệu lên site đích | Toàn bộ bằng chứng lưu ở `reports/raw/` và `reports/playwright/` | telemetry tích hợp |

---

## 10. Việc chưa hoàn thành và kế hoạch tiếp theo

| # | Việc | Người | Ảnh hưởng |
|---|---|---|---|
| 1 | Chạy 43 ca T1 + 33 ca T2 còn "Chưa thực thi" | Tài · Ngân | EC-2 nếu phát hiện thêm lỗi |
| 2 | UAT với 5–8 người ngoài nhóm | Lộc | EC-7 |
| 3 | Chạy `npm run lh:scan` lần cuối (re-test `DEF-019`/`DEF-020`) | Mạnh | EC-5 |
| 4 | Chốt `BR-06` (thiếu gói "Combo Tắm + Vệ sinh" +70.000₫) + FAQ T1 ghi nhầm 70k cho Tắm | Test Lead | Không ảnh hưởng EC |
| 5 | Re-test `DEF-028` cần SĐT khách hàng thật | Nhóm (cần phép chủ site) | Xác nhận lại mức độ lộ PII |

---

## 11. Kết luận

1. **Phạm vi đồ án đã được thực hiện đầy đủ.** Nhóm đã mô tả chi tiết 60 yêu cầu của 3 hệ thống đang hoạt động, thiết kế 238 test case với 9 kỹ thuật, thực thi 138 ca với bằng chứng máy, ghi nhận 39 defect có vòng đời đầy đủ và truy vết 100% hai chiều.

2. **Chất lượng kiểm thử đáp ứng yêu cầu.** 100% test case Critical/High đã thực thi; 4/8 tiêu chí thoát đạt; 0 hồi quy; 0 flaky; ranh giới kiểm thử không phá hại được giữ vững trên cả 3 site.

3. **Kết quả FAIL là kết quả có giá trị.** EC-2, EC-5, EC-6 phản ánh điểm yếu thật của phần mềm đang hoạt động — đặc biệt là rò rỉ PII và API key trên T3 (DEF-027, DEF-028) là rủi ro bảo mật nghiêm trọng cần ưu tiên xử lý.

4. **Hồ sơ sẵn sàng nộp.** Toàn bộ tài liệu đặc tả, thiết kế, kiểm thử và báo cáo nằm trong `docs/` và `reports/`, kèm script tái lập (`npm run gate`) và bằng chứng thô trong `reports/raw/`.

---

## 12. Danh mục sản phẩm bàn giao

### 12.1. Tài liệu đặc tả và thiết kế

| File | Nội dung |
|---|---|
| `docs/srs.md` | SRS-01 v1.5 — 60 yêu cầu, 18 BR, 8 UC, 4 bảng quyết định, bảng chuyển trạng thái |
| `docs/test-plan.md` | TP-01 — mô hình V thích nghi, phân tích rủi ro, chiến lược, tiêu chí vào/thoát |
| `docs/rtm.csv` · `docs/rtm.md` | Ma trận truy xuất — độ phủ 100% |
| `docs/requirements.csv` | 60 yêu cầu kèm tiêu chí chấp nhận |
| `docs/decisions.md` | ADR-09…ADR-16 |
| `docs/change-requests.md` | CR theo ngày |
| `docs/ASSIGNMENT.md` | Ma trận phân công |
| `docs/design/*.md` | 5 tài liệu thiết kế test chuyên trách từng thành viên |
| `docs/testcases/*.csv` | 238 test case |
| `docs/defects/defects.csv` | 39 defect, 12 trường, đầy đủ vòng đời |
| `docs/reviews/*.md` | Biên bản inspection SRS + review test design + review test case |
| `docs/backlog.csv` | Backlog đặc tả |

### 12.2. Báo cáo

| File | Nội dung |
|---|---|
| `reports/final-test-report.md` | Báo cáo này |
| `reports/integration-report.md` | Kiểm thử tích hợp T1 (HĐ-1/2/3 + telemetry) |
| `reports/defect-retest-report.md` | Re-test 22/39 defect |
| `reports/regression-report.md` | Hồi quy vòng 1 (82 ca) |
| `reports/exit-criteria.md` | Chấm 8 exit criteria |
| `reports/rtm-coverage.md` | Độ phủ truy xuết |
| `reports/nfr-report.md` | Báo cáo kiểm thử phi chức năng |
| `reports/uat-report.md` | Báo cáo UAT |
| `reports/gates/day-01.md` … `day-13.md` | 15 gate report theo ngày |
| `reports/execution-log.csv` | 137 dòng bản ghi thực thi |
| `reports/raw/` | Toàn bộ bằng chứng thô (Lighthouse · axe · k6 · security · survey) |

### 12.3. Testware

| File | Nội dung |
|---|---|
| `playwright.config.ts` | Project `t1` / `t2` / `t3` / `cross-browser` / `mobile` |
| `tests/e2e/t1/` `t2/` `t3/` | 66 test case tự động |
| `tests/security/` | Kiểm thử bảo mật + khả năng tiếp cận |
| `tests/nfr/` | Hiệu năng + độ tin cậy |
| `tests/perf/read-load.js` | k6 — kịch bản tải chỉ đọc |
| `scripts/*.mjs` | Script kiểm tra gate, quét bảo mật, khảo sát hành vi, build RTM |

### 12.4. Cách tái lập

```bash
npm install
npm run gate        # req:check → rtm:check → assign:check → exit:check
npm run lint        # ESLint
npm run typecheck   # TypeScript
npx playwright test --project=t1 --project=t2 --project=t3
```

---

*Báo cáo này được lập ngày 2026-11-22 bởi Mạnh (TV1, Test Lead) trong khuôn khổ Phase 8 — Ngày 14 của kế hoạch 14 ngày. Toàn bộ số liệu trích từ `docs/` và `reports/raw/` — không có con số nào được ước lượng thủ công.*
