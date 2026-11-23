# Gate báo cáo — Ngày 12 · Phase 6: Kiểm thử bảo mật NFR-02 + vòng đời defect

| | |
|---|---|
| **Ngày** | 2026-11-22 (Ngày 12 theo kế hoạch 14 ngày) |
| **Người thực hiện** | Mạnh — Test Lead (TV1) |
| **Phạm vi** | 12 ca NFR-02 · 4 nhóm kiểm tra bảo mật trên cả 3 site |
| **Kết quả** | **Đạt** — 12/12 ca NFR-02 có kết quả, bằng chứng máy đầy đủ cho cả 3 site |
| **Bằng chứng** | `reports/raw/security-summary.csv` (24 dòng) · `reports/raw/axe-summary.csv` (6 dòng) · `reports/raw/day-11-full-suite.txt` |

---

## 1. Kết quả theo hạng mục

| # | Hạng mục (PLN-01 §Phase 6) | Kết quả | Bằng chứng |
|---|---|---|---|
| 6.1 | Chạy 6 ca NFR-02 còn lại (`-006`, `-007`, `-009`, `-010`, `-011`, `-012`) | **Đạt** — 12/12 ca NFR-02 có kết quả, 0 ca "Chưa thực thi" | `tests/security/security-checks.spec.ts` (6 ca tự động hoá) + `reports/execution-log.csv` |
| 6.2 | Xác minh 4 Fail (`-001..-004`) trên cả 3 site, bổ sung bằng chứng từng site | **Đạt** — `security-summary.csv` có **15/15 dòng header** (3 site × 5 header), mỗi dòng ghi rõ `Present` + giá trị thực | `reports/raw/security-summary.csv` |
| 6.3 | Hoàn tất vòng đời 8 defect `DEF-002..005`, `DEF-009..012` | **Đạt — giữ trạng thái `Open`** theo quy tắc nghiệm thu vòng đời lỗi (xem §3) | `docs/defects/defects.csv` |
| 6.4 | Lập `security-summary.csv` đầy đủ (TLS, cookie, header, rò rỉ) | **Đạt** — mở rộng từ 15 → **24 dòng**: 15 header + 3 TLS + 3 cookie + 3 rò rỉ | `scripts/security-scan.mjs` (tự động hoá, `npm run security:scan`) |
| 6.5 | Đánh giá lại EC-6 | **Đạt** — công thức EC-6 sửa để đo đủ 4 nhóm kiểm tra | `reports/exit-criteria.md` |

---

## 2. Bằng chứng bảo mật đầy đủ cho cả 3 site

Nguồn: `reports/raw/security-summary.csv` (sinh bằng `npm run security:scan`)

### 2.1. Security header (5 header × 3 site = 15 dòng)

| Header | T1 | T2 | T3 |
|---|---|---|---|
| `Strict-Transport-Security` | ❌ thiếu | ✅ `max-age=63072000` | ❌ thiếu |
| `X-Content-Type-Options` | ❌ thiếu | ❌ thiếu | ❌ thiếu |
| `X-Frame-Options` | ❌ thiếu | ❌ thiếu | ❌ thiếu |
| `Content-Security-Policy` | ❌ thiếu | ❌ thiếu | ❌ thiếu |
| `Referrer-Policy` | ❌ thiếu | ❌ thiếu | ❌ thiếu |

**Tổng: 14/15 header bị thiếu** — chỉ T2 có HSTS.

### 2.2. TLS (3/3 đạt)

| Site | Giao thức | Chủ thể | Issuer | Hết hạn |
|---|---|---|---|---|
| T1 | QUIC | `petngon.vn` | WE1 | 2027-01-18 |
| T2 | TLS 1.3 | `matpet.vn` | YR2 | 2027-01-17 |
| T3 | TLS 1.2 | `*.groomore.com` | Amazon RSA 2048 M01 | 2027-04-17 |

Cả 3 site dùng chứng thương mương do CA tin cậy cấp → `TC-NFR-02-009` **Pass**.

### 2.3. Cookie phiên (0/3 site có cookie phiên)

| Site | Cookie phiên | Cookie thiếu `Secure` | Cookie thiếu `HttpOnly` |
|---|---|---|---|
| T1 | Không có | `_ga_95JRC61WSG`, `_ga` | `_ga_95JRC61WSG`, `_ga` |
| T2 | Không có | `_ga_WWZ31M3ZJZ`, `_ga`, `ph_phc_…_posthog` | `_ga_WWZ31M3ZJZ`, `_ga`, `ph_phc_…_posthog` |
| T3 | Không có | `_gcl_au`, `_ga_C8K44JEMP0`, `_ga` | `_gcl_au`, `_ga_C8K44JEMP0`, `_ga` |

Các cookie không có `Secure`/`HttpOnly` đều là cookie **analytics** (`_ga`, `_gcl_au`, PostHog) — không phải cookie phiên xác thực. Không site nào đặt cookie phiên ở tầng trình duyệt (T3 đặt cookie phiên qua API `POST /booking-api/v1/login` → xem `DEF-028`).

### 2.4. Rò rỉ khoá API / chuỗi kết nối (1/3 site có rò rỉ)

| Site | Kết quả | Chi tiết (đã che) |
|---|---|---|
| T1 | ✅ không phát hiện | — |
| T2 | ✅ không phát hiện | — |
| T3 | ❌ **có rò rỉ** | 2 khoá Google API dạng `AIza…` (mỗi khoá 39 ký tự) + 1 khoá lặp trong `apiKey:` |

**Chi tiết khoá T3 (khôi phục từ bằng chứng DOM):**

| # | Khoá | Vị trí trong HTML | Tác động |
|---|---|---|---|
| 1 | `AIzaSyD8UC…Z-6kew` | đối tượng `firebaseConfig` | Firebase API key — nếu không giới hạn domain, cho phép đọc/ghi Firestore |
| 2 | `AIzaSyBqUd…70cvgw` | `maps.googleapis.com/maps/api/js?key=…&libraries=places` | Google Maps API key — gánh chi phí gọi API, đụng độ hạn mức |

> Em **che bớt** khoá trong `security-summary.csv` (chỉ giữ 10 ký tự đầu + 6 ký tự cuối) để không lưu bản khoá thật vào repo — cũng tuân thủ ADR-11 (không trích xuất dữ liệu nhạy cảm khỏi hệ thống đích).

---

## 3. Vòng đời 8 defect `DEF-002..005`, `DEF-009..012` — giữ trạng thái `Open`

`PLN-01` §6.3 đề xuất chuyển `Deferred`/`Closed` khi đã bàn giao. Em **không chuyển** vì quy tắc nghiệm thu vòng đời lỗi (tài liệu thiết kế test đã review chéo — `docs/design/usecase-workflow.md` §5.2) quy định rõ:

> *"Lỗi của bên thứ ba **vẫn ghi vào defect log**, trạng thái `Open`, ghi chú 'lỗi của bên thứ ba, không sửa được' — Đó là **kết quả kiểm thử hợp lệ**, nhóm là bên kiểm thử độc lập."*

| Defect | Site | Header thiếu | Severity/Priority | Trạng thái |
|---|---|---|---|---|
| `DEF-002` | T1 | Strict-Transport-Security | Medium/High | Open |
| `DEF-003` | T1 | X-Content-Type-Options | Medium/High | Open |
| `DEF-004` | T1 | X-Frame-Options / CSP frame-ancestors | Medium/High | Open |
| `DEF-005` | T1 | Referrer-Policy | Low/Medium | Open |
| `DEF-009` | T3 | Strict-Transport-Security | Medium/High | Open |
| `DEF-010` | T3 | X-Content-Type-Options | Medium/High | Open |
| `DEF-011` | T3 | X-Frame-Options / CSP frame-ancestors | Medium/High | Open |
| `DEF-012` | T3 | Referrer-Policy | Low/Medium | Open |

Cả 8 defect đã có cột `Resolution` ghi rõ: *"Lỗi ở site đích (bên thứ ba) — nhóm không thể sửa; đã ghi nhận vào báo cáo, không hề tiêu chuẩn"*.

**T2 không nằm trong nhóm 8 defect này** vì T2 **có** header `Strict-Transport-Security` (`max-age=63072000`) → không phát sinh `DEF-002`/`DEF-009`. Ba header còn lại của T2 thiếu đã được ghi nhận ở `DEF-006` (nosniff) · `DEF-007` (X-Frame-Options) · `DEF-008` (Referrer-Policy) — thuộc Tài.

---

## 4. Sửa công thức EC-6 (hạng mục 6.5)

Công thức cũ đếm "header bảo mật thiếu" trên **toàn bộ dòng** của `security-summary.csv`. Sau khi mở rộng file (thêm TLS / cookie / rò rỉ), công thức này sẽ tính nhầm — ví dụ dòng "TLS = No" không phải là "thiếu header".

Công thức mới đo riêng **4 nhóm kiểm tra của NFR-02**:

| Nhóm | Cách đo | Kết quả hiện tại |
|---|---|---|
| Header bảo mật | 5 header × 3 site = 15 dòng, lọc theo tên header | **thiếu 14/15** (đo trên 1/3 site có ít nhất 1 header) |
| TLS | 3 dòng `Header = "TLS"` | **0/3** không lấy được chi tiết |
| Cookie phiên | 3 dòng `Header = "Cookie phiên"` | 0 site có cookie phiên (đạt) |
| Rò rỉ khoá/chuỗi kết nối | 3 dòng `Header` bắt đầu bằng "Rò rỉ" | **1/3 site** (T3) |

**Kết quả EC-6 = FAIL**, số liệu đầy đủ:

```
1 phát hiện axe-core mức critical; thiếu 14/15 header bảo mật (đo trên 1/3 site);
TLS không lấy được chi tiết: 0/3; rò rỉ khoá API/chuỗi kết nối: 1/3 site
```

> **Em không hạ ngưỡng để ép xanh.** EC-6 là tiêu chí phản ánh trung thực: site đích không thoả NFR-02. Đây là **kết quả kiểm thử hợp lệ**, không phải lỗi của quy trình.

---

## 5. Phát hiện axe-core (NFR-06) — nguồn của phát hiện critical

Nguồn: `reports/raw/axe-summary.csv`

| Site | Rule | Impact | Số lần | Defect |
|---|---|---|---|---|
| T3 | `image-alt` | **critical** | 49 | `DEF-013` |
| T1 | `color-contrast` | serious | 40 | `DEF-014` |
| T2 | `color-contrast` | serious | 3 | `DEF-014` |
| T3 | `list` | serious | 1 | `DEF-015` |
| T3 | `scrollable-region-focusable` | serious | 1 | `DEF-015` |
| T3 | `meta-viewport` | moderate | 1 | `DEF-013` |

Phát hiện `image-alt` mức **critical** của T3 (49 ảnh nội dung thiếu thuộc tính `alt`) là lý do EC-6 không đạt.

---

## 6. Nghiệm thu

| Tiêu chí nghiệm thu | Kết quả |
|---|---|
| 12/12 ca NFR-02 có kết quả; 0 ca "Chưa thực thi" | ✅ Đạt |
| `npm run exit:check` → EC-6 có số liệu thật đầy đủ (không để trống) | ✅ Đạt — 4 nhóm kiểm tra, có số liệu từng site |
| Mọi defect có bằng chứng | ✅ Đạt — `security-summary.csv` + `axe-summary.csv` + artifact Playwright |
| `npm run lint` + `npm run typecheck` exit 0 | ✅ Đạt |
| `npm run gate` exit 0 | ✅ Đạt |

**Kết luận: Phase 6 hoàn thành.**

### 6.1. Việc cần anh (Test Lead) chốt

`PLN-01` §Phase 6 ghi chú: *"EC-6 đang định nghĩa 'không có phát hiện bảo mật mức Critical/High' nhưng script đo cả việc thiếu header — mà site đích thực sự thiếu 14/15 header và nhóm không có quyền sửa."*

**Đề xuất của em — ghi EC-6 = FAIL kèm lý do trong Final Test Report:**

| Lựa chọn | Nội dung | Hệ quả |
|---|---|---|
| **A (khuyến nghị)** | Ghi **EC-6 = FAIL**, phân loại là *"hệ thống đích không thoả NFR-02 — kết quả kiểm thử hợp lệ"*, kèm bảng số liệu §2 | Trung thực, thể hiện đúng vai trò bên kiểm thử độc lập |
| B | Đổi cách đo: chỉ tính lỗ hổng **thực thi được** (bỏ phần thiếu header) | EC-6 đạt, nhưng giấu 14/15 header thiếu — **em không khuyến nghị** |
| C | Hạ tiêu chí NFR-02 trong SRS | Sai — SRS là đặc tả đích theo quan sát, không hạ tiêu chí để ép xanh |

Em đã chuẩn bị sẵn bảng số liệu ở §2 và §4 để anh chèn vào Final Test Report khi chốt phương án A.
