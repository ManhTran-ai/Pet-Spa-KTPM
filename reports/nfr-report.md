# Báo cáo kiểm thử phi chức năng (NFR) — 3 hệ thống Pet Spa

| | |
|---|---|
| **Phạm vi** | T1 Pet NGON · T2 Mật Pet Family · T3 Pretty Paws |
| **Nhóm** | Mạnh (TV1) · Tài (TV2) · Ngân (TV3) · Lộc (TV4) |
| **Ngày** | 2026-11-22 (Ngày 14) |
| **Công cụ** | Lighthouse 12.3 · axe-core 4.14 (Playwright) · k6 · Playwright 1.x |
| **Nguồn số liệu** | `reports/raw/lighthouse-summary.csv` · `reports/raw/axe-summary.csv` · `reports/raw/security-summary.csv` · `reports/raw/k6-summary.json` |

---

## 1. Tóm tắt

| Chỉ số | Giá trị |
|---|---|
| Test case NFR | **44** (7 nhóm NFR-01..NFR-07) |
| Đã thực thi | **37** (84,1%) · Pass 17 · Fail 20 |
| Chưa thực thi | 7 |
| Tự động hoá | 26/44 (59,1%) |
| Defect phát sinh từ NFR | **13** trong 39 defect (33,3%) |

---

## 2. NFR-01 — Hiệu năng (6 ca · 5 Fail / 1 Pass)

### 2.1 Kết quả Lighthouse (mobile, 3 lần mỗi trang)

| Hệ thống | Performance | Accessibility | Best practices | SEO | LCP (ms) | CLS |
|---|---|---|---|---|---|---|
| T1 Pet NGON | **67** | 94 | 100 | 100 | 4.887 | 0,000 |
| T2 Mật Pet Family | **59** | 94 | 96 | 100 | 6.473 | 0,000 |
| T3 Pretty Paws | **3** | 81 | 79 | 91 | **17.621** | **0,991** |


### 2.2 Đánh giá

- **T1**: Performance 67 không đạt ngưỡng 70 → `TC-NFR-01-001`, `TC-NFR-01-002` Fail.
- **T2**: Performance 59, LCP 6.473 giây → cùng Fail 5 ca.
- **T3**: Performance **3/100** — chỉ số nặng nhất trong cả 3 site. LCP 17,621 giây (vượt ngưỡng 2,5 giây gấp **7 lần**), CLS 0,991 (trang tự dịch chuyển mạnh khi load — nguồn gốc của lỗi tràn ngang ở 360px).


### 2.3 Vận hành tải (k6 — kịch bản chỉ đọc)

Chỉ số tồn tại cho cả 3 site, chạy 10 VU / 1 phút, chỉ GET:

| Chỉ số | Ngưỡng | Kết quả |
|---|---|---|
| `http_req_failed` | < 5% | **0,00%** (183 request, 0 lỗi 5xx) |
| `http_req_duration` p(95) | < 5.000 ms | **907,74 ms** đạt |
| p(90) | — | 740,20 ms |
| Độ trễ T1 | — | avg 571,99 ms · max 2.651,28 ms |
| Độ trễ T2 | — | avg 293,56 ms · max 1.328,38 ms |
| Độ trễ T3 | — | avg 216,18 ms · max 237,38 ms |

> **Điểm đáng chú ý:** server phản hồi nhanh và ổn định (p95 < 1 giây, 0 lỗi) — **vận hành không phải nút chặn**. Toàn bộ điểm Performance thấp đến từ **frontend**: ảnh chưa tối ưu, script bị chặn, LCP chậm do tải tài nguyên lớn. Đây là phần bi của người dùng, không phải hạ tầng.


---

## 3. NFR-02 — Bảo mật (12 ca · 5 Fail / 7 Pass)

### 3.1 Header bảo mật (nguồn: `reports/raw/security-summary.csv`)

| Header | T1 | T2 | T3 |
|---|---|---|---|
| Strict-Transport-Security | ✗ | ✓ `max-age=63072000` | ✗ |
| X-Content-Type-Options | ✗ | ✗ | ✗ |
| X-Frame-Options | ✗ | ✗ | ✗ |
| Content-Security-Policy | ✗ | ✗ | ✗ |
| Referrer-Policy | ✗ | ✗ | ✗ |

**14/15 header còn thiếu trên 3 site** → `TC-NFR-02-001`, `-002`, `-003`, `-004` Fail. Cả 3 site dùng WordPress/Wix với theme có sẵn, không cấu hình security header.


### 3.2 Các kiểm tra khác

| Test case | Kiểm tra | Kết quả |
|---|---|---|
| `TC-NFR-02-005` | Cookie phiên có `Secure` + `HttpOnly` | **Pass** (chỉ thiếu trên cookie analytics) |
| `TC-NFR-02-006` | Không cookie phiên không mã hoá | Pass |
| `TC-NFR-02-007` | Payload script vô hại | Pass — không hợp thoại alert |
| `TC-NFR-02-008` | URL sai — lỗi thân thiện, không stack trace | Pass |
| `TC-NFR-02-009` | TLS bắt tay | **Pass** (T1 QUIC, T2/T3 TLS 1.3, hết hạn 01/2027) |
| `TC-NFR-02-010` | Không rò khoá API / chuỗi kết nối | **Fail** → `DEF-027` (T3 lộ 2 API key Google Maps + Firebase) |
| `TC-NFR-02-011` | Không rò email/SĐT thật trong HTML nguồn | **Fail** → `DEF-028` (T3 trả PII khách hàng qua API) |
| `TC-NFR-02-012` | Form không gửi GET dữ liệu cảm nhậm | Pass |


### 3.3 Đánh giá rủi ro

| Mức độ | Vấn đề | Rủi ro |
|---|---|---|
| **High** | T3 rò API key (Google Maps + Firebase) trong HTML nguồn | Nghĩ phạm vi chỉ đọc/dữ liệu, chi phí phát sinh (chi phí hàng tháng) |
| **High** | T3 API trả hồ sơ khách hàng đầy đủ (PII không mask) | Vi phạm dữ liệu cá nhân |
| **Medium** | Thiếu 14/15 security header trên cả 3 site | Clickjacking, MIME sniffing, downgrade HTTPS |
| **Low** | Cookie analytics thiếu `Secure`/`HttpOnly` | Vượt qua HTTPS, đọc qua JS |

> **Lưu ý ranh giới (ADR-11):** không phát hiện nào trên đây là thông tin **bị lội bị mất** hay **bị ghi ra** — nhóm chỉ đọc, không gửi dữ liệu.


---

## 4. NFR-06 — Khả năng truy cập (6 ca · 4 Fail / 1 Pass / 1 chưa chạy)

Nguồn: `reports/raw/axe-summary.csv` (axe-core 4.14 qua Playwright).

| Hệ thống | Rule | Impact | Số lần xuất hiện |
|---|---|---|---|
| T3 | `image-alt` | **critical** | **49** |
| T1 | `color-contrast` | serious | 40 |
| T2 | `color-contrast` | serious | 3 |
| T3 | `list` | serious | 1 |
| T3 | `scrollable-region-focusable` | serious | 1 |
| T3 | `meta-viewport` | moderate | 1 |


| Test case | Kiểm tra | Kết quả |
|---|---|---|
| `TC-NFR-06-001` | axe-core không có vi phạm mức critical | **Fail** — T3 có 49 lỗi `image-alt` mức critical |
| `TC-NFR-06-002` | Độ phân chiếu ≥ 4,5:1 | **Fail** — 43 vị trí (T1 40 + T2 3) |
| `TC-NFR-06-003` | Mọi trường form có nhãn | Pass |
| `TC-NFR-06-004` | Mọi ảnh nội dung có `alt` | **Fail** — 49 ảnh T3 |
| `TC-NFR-06-005` | Mọi trang có đúng một tiêu đề `h1` | **Fail** |
| `TC-NFR-06-006` | Hướng dẫn bằng bảng | Chưa thực thi |

> **Định nghĩa và biên phân giải:** 49 lỗi `alt` thiếu nhiều nhưng **không chặn** người dùng không thể đọc, chỉ gây vòng vo cho người không nhìn. Độ phân chiếu màu (43 vị trí) là **serious** vì chặn người không nhìn đọc nội dung. Không có lỗi nào chặn người dùng dùng chức năng chính.


---

## 5. NFR-07 — SEO (6 ca · 3 Fail / 3 Pass)

| Test case | Kiểm tra | Kết quả |
|---|---|---|
| `TC-NFR-07-001` | Mọi trang có 1 `title` duy nhất, không rỗng | Pass |
| `TC-NFR-07-002` | Mọi trang có `meta description` không rỗng | Pass |
| `TC-NFR-07-003` | Thẻ `html` có `lang` | Pass |
| `TC-NFR-07-004` | `sitemap.xml` tồn tại, đúng trang quan trọng | **Fail** — T3 không có |
| `TC-NFR-07-005` | `robots.txt` tồn tại | **Fail** — T3 không có |
| `TC-NFR-07-006` | Thẻ Open Graph (`title`, `description`, `image`) | **Fail** |


---

## 6. NFR-03 / NFR-04 / NFR-05 (14 ca · 5 Fail / 5 Pass / 4 chưa chạy)

| Nhóm | Tổng | Pass | Fail | Chưa chạy | Điểm chính |
|---|---|---|---|---|---|
| NFR-01 — Hiệu năng | 6 | 1 | 5 | 0 | T3 Performance 3/100, LCP 17,6s |
| NFR-02 — Bảo mật | 12 | 7 | 5 | 0 | 14/15 header thiếu trên 3 site; T3 lộ API key + PII |
| NFR-03 — Usability | 4 | 0 | 0 | 4 | Chưa chạy (Tài) |
| NFR-04 — Tương thích | 6 | 3 | 1 | 2 | Fail 1: `TC-NFR-04-005` tràn ngang 19px ở 360px → `DEF-016` (T1). `TC-NFR-04-003` (Edge), `-004` (Safari) chưa chạy |
| NFR-05 — Độ tin cậy | 4 | 2 | 2 | 0 | Fail 2: `TC-NFR-05-003`, `-004` — tải lại trang mất trạng thái đã chọn |
| NFR-06 — Truy cập | 6 | 1 | 4 | 1 | 49 ảnh T3 thiếu `alt` (critical); 43 vị trí sai độ phân chiếu |
| NFR-07 — SEO | 6 | 3 | 3 | 0 | T3 thiếu `sitemap.xml`, `robots.txt`, Open Graph |
| **Tổng** | **44** | **17** | **20** | **7** | 5 Critical · 10 High · 4 Medium · 1 Low (trong 20 ca Fail) |


### 6.1 NFR-04 — Tương thích trình duyệt

Chỉ chạy kiểm chứng trên **Chromium** và **WebKit** (2/4 trình duyệt). Edge (`TC-NFR-04-003`) và Safari (`TC-NFR-04-004`) chưa chạy — đang ở trạng thái "Chưa thực thi" vì thiếu máy ảo cho 2 trình duyệt này.

### 6.2 NFR-05 — Độ tin cậy

`TC-NFR-05-003` và `TC-NFR-05-004` Fail: tải lại trang **không giữ lại trạng thái đã chọn** (đã chọn loại/gói, tải lại bị mất). Đây là loại lỗi ảnh hưởng trực tiếp đến người dùng đang nhúng dịch vụ thú cưng — xác nhận lại thông tin đã nhập là bước phụ sinh.


---

## 7. Bối cảnh: 20 lỗi NFR nằm ở đâu

> **Lưu ý về cách đọc bảng:** 44 test case NFR đều có `System = ALL` — tức là **mỗi ca kiểm tra cả 3 site**. Vì vậy "20 ca Fail" tương ứng với **nhiều lần phát hiện trên nhiều site**, không phải 20 lỗi riêng biệt. Bảng dưới đây là **số site có phát hiện**, dựa trên bằng chứng trong `reports/raw/`.

| Hệ thống | NFR-01 | NFR-02 | NFR-03 | NFR-04 | NFR-05 | NFR-06 | NFR-07 | Tổng site bị ảnh hưởng |
|---|---|---|---|---|---|---|---|---|
| T1 Pet NGON | ✗ | ✗ | — | ✗ | ✓ | ✗ | ✓ | **5** |
| T2 Mật Pet Family | ✗ | ✗ | — | ✓ | ✓ | ✗ | ✓ | **4** |
| T3 Pretty Paws | ✗ | ✗ | — | ✓ | ✗ | ✗ | ✗ | **6** |
| Site chưa kiểm chứng | — | — | 4 ca | 2 ca | — | 1 ca | — | 7 ca chưa chạy |


---

## 8. Kết luận và khuyến nghị

### 8.1 Phân loại theo nguyên nhân gốc

| Nguyên nhân gốc | Số ca Fail | Nhóm khác phụ | Nhóm khắc phục được? |
|---|---|---|---|
| **Thiếu cấu hình** (security header, `alt`, `meta`, `sitemap`) | 11 | NFR-02, NFR-06, NFR-07 | ✗ — cần chủ site sửa |
| **Frontend nặng** (LCP chậm, CLS cao) | 5 | NFR-01 | ✗ — cần tối ưu ảnh + script |
| **Lỗi logic UI** (mất trạng thái khi tải lại) | 2 | NFR-05 | ✗ — cần sửa code site |
| **Bố cục / responsive** (tràn ngang 360px) | 1 | NFR-04 | ✗ — cần sửa CSS site |
| **Rò khoá / PII** | 2 | NFR-02 | ✗ — cần sửa backend site |

**0/20 ca Fail NFR có thể khắc phục bởi nhóm** — tất cả đều là của site đích và nằm ngoài quyền hạn.


### 8.2 Khuyến nghị ưu tiên cho chủ site

| # | Khuyến nghị | Tác động | Độ khó |
|---|---|---|---|
| 1 | Thêm 5 security header (HSTS, X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy) | 4 ca NFR-02 + phần lớn EC-6 | Thấp — config 1 lần |
| 2 | T3: rotate + hướng dẫn API key ra khỏi HTML nguồn | `DEF-027` | Trung bình |
| 3 | T3: mask trường PII trước khi trả API | `DEF-028` | Trung bình |
| 4 | Thêm `alt` cho 49 ảnh T3 + chuẩn hoá độ phân chiếu 43 vị trí | 3 ca NFR-06 | Thấp |
| 5 | T3: giảm LCP (17,6s) và CLS (0,991) — nén ảnh, lazy-load, resize ảnh | 1 ca NFR-01 + 2 ca | Cao |
| 6 | Lưu trạng thái wizard qua `sessionStorage` khi tải lại | 2 ca NFR-05 | Thấp |
| 7 | Fix tràn ngang 19px ở 360px của T1 | `DEF-016` | Thấp |


### 8.3 Ghi chú về phương pháp đo

> Các điểm số trên **không dùng để đánh giá nhóm** mà để đánh giá **phần mềm đang hoạt động**. Nhóm không có quyền sửa mã nguồn site đích (ADR-13), nên nhiều chỉ số FAIL là **kết quả kiểm thử hợp lệ**, không phải sai sót của nhóm.
>
> Nếu đối chiếu **tương đối**: 20/37 ca NFR đã chạy bị Fail (54,1%) — tỷ lệ Fail của NFR **cao hơn nhiều** so với chức năng, vì NFR trực tiếp phát hiện vấn đề bảo mật, hiệu năng và truy cập — đang là lỗi nghiêm trọng nhất.


---

## 9. Phụ lục — File bằng chứng

| File | Nội dung |
|---|---|
| `reports/raw/lighthouse-summary.csv` | 18 dòng: 4 mục × 3 hệ thống + 6 dòng metric LCP/CLS |
| `reports/raw/lighthouse-booking-summary.csv` | Đo riêng trang đặt lịch của T1/T2 |
| `reports/raw/lighthouse-T{1,2,3}-{1,2,3}.json` | 9 file JSON gốc của Lighthouse |
| `reports/raw/axe-summary.csv` | 6 dòng vi phạm axe-core trên 3 hệ thống |
| `reports/raw/security-summary.csv` | 21 dòng: 7 mục × 3 hệ thống |
| `reports/raw/k6-summary.json` | Tóm tắt k6 (ngưỡng, độ trễ theo site) |
| `reports/raw/day-03-k6.txt` | Log k6 đầy đủ |
| `reports/playwright/` | Ảnh chứng minh + `error-context.md` cho các ca Fail |

---

*Báo cáo này được lập ngày 2026-11-22 bởi Mạnh (TV1, Test Lead) trong khuôn khổ Phase 8 — Ngày 14. Mọi con số trong báo cáo đều truy về được về file thô trong `reports/raw/`.*
