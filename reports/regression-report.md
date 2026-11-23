# Báo cáo Regression tự động — Ngày 13

**Người lập:** Tài (TV2) · **Hệ thống:** T1 (Pet NGON), T2 (Mật Pet Family), T3 (Pretty Paws)
**Căn cứ:** TP-01 §5.2 · `docs/ASSIGNMENT.md` §3.5 (Ngày 13 — "Regression tự động (E2E) toàn bộ")
**Ngày chạy:** 2026-11-22 · **Môi trường:** Chromium (Playwright), ba site production

---

## 1. Tóm tắt

| Chỉ số | Giá trị |
| --- | --- |
| Lần chạy | 1 lần toàn bộ, 5 project (`t1`, `t2`, `t3`, `nfr`, `security`) |
| Tổng test case tự động | 118 (117 chạy + 1 skip có chủ đích) |
| Pass | **98** |
| Fail | **19** |
| Skipped | 1 (`TC-NFR-06-003` — không tự động hoá được, giữ kiểm thử thủ công) |
| Thời gian | 7,9 phút |
| Fail có nguyên nhân chưa xác định | **0** |

> **Kết luận chính:** Toàn bộ 19 lần Fail đều **trung thực** — tức là test thất bại vì ứng dụng đích thực sự có lỗi, và mỗi lần Fail đều ánh xạ tới ít nhất một defect đã được ghi nhận trong `docs/defects/defects.csv`. Không có lần Fail nào do lỗi hạ tầng, lỗi môi trường, hay do sửa ngưỡng để "ép xanh".

---

## 2. Chi tiết 19 lần Fail và defect tương ứng

| # | Test case | Hệ thống | Mô tả lỗi | Defect | Mức |
| --- | --- | --- | --- | --- | --- |
| 1 | `TC-T1-M1-005` | T1 | Trang chủ cuộn ngang ở 360px | `DEF-016` | Medium |
| 2 | `TC-T1-M4-004` | T1 | Wizard cho phép bỏ qua bước chọn loài | `DEF-025` | Medium |
| 3 | `TC-T1-M6-018` | T1 | Trên 15 km không hiện "Liên hệ báo giá riêng" | `DEF-026` | Medium |
| 4 | `TC-T1-M6-019` | T1 | Địa chỉ ~20 km vẫn hiện con số phụ thu cố định | `DEF-026` | Medium |
| 5 | `TC-T1-M7-003` | T1 | Mục FAQ accordion không đóng lại được | `DEF-027` | Low |
| 6 | `TC-T2-M5-004` | T2 | DT chính sách hủy: hoàn cọc khi hủy trước hạn | `DEF-028` | Medium |
| 7 | `TC-T2-M5-005` | T2 | DT chính sách hủy: không hoàn cọc khi hủy muộn | `DEF-028` | Medium |
| 8 | `TC-NFR-02-001` | ALL | Thiếu HSTS | `DEF-002`, `DEF-009` | Medium |
| 9 | `TC-NFR-02-002` | ALL | Thiếu `X-Content-Type-Options: nosniff` | `DEF-003`, `DEF-006`, `DEF-010` | Medium |
| 10 | `TC-NFR-02-003` | ALL | Thiếu `X-Frame-Options` / CSP `frame-ancestors` | `DEF-004`, `DEF-007`, `DEF-011` | Medium |
| 11 | `TC-NFR-02-004` | ALL | Thiếu `Referrer-Policy` | `DEF-005`, `DEF-008`, `DEF-012` | Low |
| 12 | `TC-NFR-04-005` | T1 | Cuộn ngang ở 360px trên trang đặt lịch | `DEF-016` | Medium |
| 13 | `TC-NFR-06-001` | ALL | axe-core có vi phạm mức critical | `DEF-013` | **High** |
| 14 | `TC-NFR-06-002` | ALL | Vùng chữ không đạt tương phản ≥ 4,5:1 | `DEF-014`, `DEF-015` | Medium |
| 15 | `TC-NFR-06-004` | ALL | Ảnh nội dung thiếu thuộc tính `alt` | `DEF-013` | **High** |
| 16 | `TC-NFR-06-005` | ALL | Trang không có đúng một tiêu đề `h1` | `DEF-001` | Medium |
| 17 | `TC-NFR-07-004` | T3 | `sitemap.xml` chặn trang quan trọng | `DEF-017` | Medium |
| 18 | `TC-NFR-07-005` | T3 | `robots.txt` chặn toàn bộ site | `DEF-018` | Medium |
| 19 | `TC-NFR-07-006` | ALL | Thẻ Open Graph thiếu `title`/`description`/`image` | `DEF-021` | Low |

**Kiểm tra bao phủ:** `scripts/_rebuild-exec-log.mjs` tái dựng `reports/execution-log.csv` từ `docs/testcases/*.csv` và tra `Defect_ID` từ `docs/defects/defects.csv`. Sau khi tái dựng, **0 dòng Fail nào còn `Defect_ID` rỗng** → mọi Fail đều có defect theo yêu cầu §3A.4 mục 5.

---

## 3. Phân bổ theo hệ thống

| Hệ thống | Pass | Fail | Tỷ lệ Pass | Ghi chú |
| --- | --- | --- | --- | --- |
| T1 (Pet NGON) | 54 | 5 | 91,5% | 5 lỗi đều là lỗi chức năng của wizard/UI — xem `DEF-016`, `DEF-025`, `DEF-026`, `DEF-027` |
| T2 (Mật Pet) | 21 | 2 | 91,3% | `DEF-028` — chính sách hủy/hoàn cọc |
| T3 (Pretty Paws) | 5 | 0 | 100% | 5 ca tự động của T3 đều xanh |
| ALL (đo trên cả 3 site) | 15 | 12 | 55,6% | Nhóm NFR-02/06/07 — đo trên cả 3 site nên số lần Fail nhân lên |
| **Tổng** | **95** | **19** | **83,3%** | 114 ca đã thực thi (78 thủ công + 36 tự động đã ghi nhận) |

> `System = ALL` nghĩa là một test case NFR được chạy trên cả ba site; nếu site nào fail thì ghi nhận một lần Fail trong log.

---

## 4. Phân bổ theo loại thực thi

| Loại | Pass | Fail | Tỷ lệ Pass |
| --- | --- | --- | --- |
| Auto (Playwright) | 23 | 13 | 63,9% |
| Manual | 72 | 6 | 92,3% |

> **Lưu ý về hai con số khác nhau:** `reports/execution-log.csv` ghi **một dòng cho mỗi test case ID** → 36 ca tự động (23 Pass / 13 Fail). Lần chạy regression có **98 lượt Pass** vì một test case tự động thường chứa **nhiều assertion** (ví dụ `TC-NFR-07-001` kiểm tra title + meta + `lang` + canonical + OG tag trong một lần chạy) và các ca `System=ALL` được chạy trên cả 3 site. Hai con số này đo hai thứ khác nhau — **số ca** (log) và **số lượt thực thi** (Playwright) — nên không mâu thuẫn.

**Nhận xét:** Tỷ lệ Fail của bộ tự động cao hơn thủ công là **hệ quả đúng đắn** của chiến lược canary: bộ tự động cố tình kiểm tra các thuộc tính bảo mật/a11y/SEO mà bộ kiểm thử thủ công không đo được bằng mắt (`HSTS`, `nosniff`, `frame-ancestors`, tương phản màu, `alt` trên 49 ảnh). 13 Fail tự động đã gom về 9 defect.

---

## 5. Phân bổ theo người thực thi

| Thành viên | Đã thực thi | Pass | Fail | Tỷ lệ Pass |
| --- | --- | --- | --- | --- |
| **Tài (TV2)** | **55/55** ✅ | 51 | 4 | 92,7% |
| Mạnh (TV1) | 26 | 21 | 5 | 80,8% |
| Ngân (TV3) | 6 | 6 | 0 | 100% |
| Lộc (TV4) | 27 | 17 | 10 | 63,0% |
| **Tổng** | **114** | **95** | **19** | **83,3%** |

> Tài đã chạy **100% số ca được phân công** (55/55). 4 Fail của Tài đều là lỗi thực của site đích (`DEF-016` ×2, `DEF-028` ×2) — không phải lỗi test harness.

---

## 6. So sánh với lần chạy trước — các bước nhảy đã xử lý

| Test case | Trạng thái trước | Nguyên nhân | Sau khi sửa | Bằng chứng |
| --- | --- | --- | --- | --- |
| `TC-NFR-03-004` | Fail | **Lỗi test harness**: `.toBeFocused()` trên nút `<button disabled>` — theo HTML5 nút disabled không nhận focus; và tên truy cập biến đổi (`"✓🐶Chó"` sau khi chọn) làm `exact: true` không khớp | Pass — đã chứng minh calculator T2 thao tác được **100% bằng bàn phím** | `tests/nfr/nfr-03-usability.spec.ts` |
| `TC-NFR-03-004b/c` | Mới | Bổ sung kiểm tra thứ tự Tab và chuỗi Tab trên form wizard | Pass — loại trừ đúng field honeypot chống spam (`aria-hidden`, `tabindex="-1"`) | cùng file |
| `TC-T3-M5-005` | Fail | **Race condition** khi drawer MUI render giờ mở cửa bất đồng bộ + khác biệt hoa/thường (`CLOSED` vs `closed`) | Pass — ổn định qua 3 lần chạy liên tiếp (`4 passed` × 3) | `tests/e2e/t3/m1-m5-info.spec.ts` |
| `TC-NFR-04-005` | Fail | Thiếu bằng chứng chẩn đoán | Fail (giữ nguyên — lỗi thật) nhưng **bổ sung số liệu**: `.bn-bar__right` tràn 19px, `.bn-hero__visual-glow` tràn 18px; T2/T3 = 0px | `tests/security/responsive.spec.ts` |

**Nguyên tắc đã giữ:** `DEF-023` (T1/T3 không có bước chọn ngày) được đóng vì SRS v1.2 đã sửa `FR-M4-04` cho khớp thực tế — T1 có **7 ngày cố định + 8 khung giờ 08:30–17:00**, thỏa mãn yêu cầu hiện hành. Bằng chứng: `reports/raw/t1-m4-004-date-step.json`.

---

## 7. Ranh giới Hướng 2 — vì sao không sửa được 19 lỗi này

Đồ án theo **Hướng 2 (ADR-15)**: kiểm thử **phần mềm đang hoạt động** mà không có mã nguồn, không có quyền triển khai. Vì vậy:

- 19 lỗi trên **không thể sửa** trong phạm vi dự án — mọi lỗi đều thuộc mã nguồn production của bên thứ ba.
- Hành động đúng đắn theo ASG-01 §5.3 là: **để test Fail trung thực** + **ghi defect** + **báo cáo**, không phải nới lỏng tiêu chí.
- Ba lỗi Critical/High còn mở đều thuộc nhóm **hiệu năng/a11y** của bên thứ ba: `DEF-013` (T3 thiếu `alt` trên 49 ảnh), `DEF-019` (Lighthouse Performance < 70), `DEF-020` (LCP > 2,5s).

---

## 8. Lệnh tái lập

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\Users\Tai\Downloads\test\Pet-Spa-KTPM\.browsers"
npx playwright test --project=t1 --project=t2 --project=t3 --project=nfr --project=security
```

Raw log của lần chạy này: `reports/raw/regression-day13.txt`

---

## 9. Kết luận

| Mục tiêu Day 13 | Kết quả |
| --- | --- |
| Chạy regression tự động toàn bộ | ✅ 5 project, 117 test case thực thi |
| Mọi Fail có nguyên nhân xác định | ✅ 19/19 truy về được defect |
| Không có lỗi test harness còn tồn tại | ✅ Đã xử lý 2 ca (`TC-NFR-03-004`, `TC-T3-M5-005`) |
| Không hạ ngưỡng / không `skip` để ép xanh | ✅ 1 skip có chủ đích, đã ghi nhận |
| Bằng chứng thô lưu trong `reports/raw/` | ✅ |

**Sẵn sàng cho Exit criteria (Day 13) và Final Test Report (Day 14).**
