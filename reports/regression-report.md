# Báo cáo kiểm thử hồi quy (Regression) — Vòng 1

| | |
|---|---|
| **Ngày** | 2026-11-22 (Ngày 13 theo kế hoạch 14 ngày) |
| **Người thực hiện** | Mạnh — Test Lead (TV1) |
| **Phạm vi** | Toàn bộ bộ kiểm thử tự động của nhóm: project `t1` · `t3` · `security` |
| **Lệnh** | `npx playwright test --project=t1 --project=t3 --project=security` |
| **Kết quả** | **82 ca · 66 Pass · 16 Fail** · thời gian **8,1 phút** · 1 worker (tuân thủ ADR-11) |
| **Bằng chứng máy** | `reports/raw/day-11-full-suite.txt` (log đầy đủ 112 KB) · `reports/raw/playwright-report.json` |
| **Vòng** | Vòng hồi quy **1** — chạy lại toàn bộ sau khi thêm 10 ca T1 mới (Phase 5) |

---

## 1. Mục đích

Sau khi bổ sung 10 test case T1 mới (`tests/e2e/t1/m2-m4-m5-m7.spec.ts`) và 4 defect mới (`DEF-025`…`DEF-028`), cần xác nhận:

1. **Không có hồi quy** — các ca Pass trước đó vẫn Pass sau khi thêm mã mới.
2. **Defect đã phát hiện vẫn còn hiện diện** — xác nhận lỗi site đích chưa tự khỏi.
3. **Lấy baseline hồi quy** cho Final Test Report.

---

## 2. Kết quả tổng quan

| Chỉ số | Giá trị |
|---|---|
| Tổng test case chạy | **82** |
| Pass | **66** (80,5%) |
| Fail | **16** (19,5%) |
| Flaky | 0 |
| Skipped | 0 |
| Thời gian | 8,1 phút · 1 worker |

### 2.1. Phân bổ theo project

| Project | Ca | Pass | Fail | Tỷ lệ Pass |
|---|---|---|---|---|
| `t1` — Pet NGON (Mạnh đối chiếu) | 29 | 28 | 1 | 96,6% |
| `t3` — Pretty Paws (Mạnh viết) | 26 | 24 | 2 | 92,3% |
| `security` — NFR-02/04/06/07 (Mạnh chuyên trách) | 27 | 14 | 13 | 51,9% |
| **Tổng** | **82** | **66** | **16** | **80,5%** |

> Nhóm `security` có tỷ lệ Fail cao nhất **không phải** do script lỗi, mà vì đây là nhóm kiểm tra **tiêu chuẩn bảo mật & khả năng tiếp cận** — đây chính là nơi tập trung phần lớn lỗi thật của site đích. Chi tiết ở §3.

### 2.2. Phân bổ theo mức ưu tiên

Tính trên **toàn bộ 81 dòng** đã đồng bộ vào `reports/execution-log.csv` (bao gồm cả các ca thủ công của Mạnh đã thực thi ở Phase 4–5):

| Ưu tiên | Ca đã thực thi | Pass | Fail | Tỷ lệ Pass |
|---|---|---|---|---|
| Critical | 50 | 43 | 7 | 86,0% |
| High | 23 | 19 | 4 | 82,6% |
| Medium | 7 | 3 | 4 | 42,9% |
| Low | 1 | 0 | 1 | 0,0% |
| **Tổng** | **81** | **65** | **16** | **80,2%** |

> **Critical/High: 73/73 đã thực thi (100%)** — đây là số liệu EC-2 chấm ở §5. Chênh lệch 81 (execution-log) với 82 (suite tự động) là do `TC-T2-M3-002` đã chạy thủ công ở baseline nằm trong log nhưng không nằm trong 3 project của suite.

---

## 3. Phân tích 16 Fail

### 3.1. Toàn bộ 16 Fail là defect thật của site đích

| # | Test case | Hệ thống | Ưu tiên | Defect | Bản chất lỗi |
|---|---|---|---|---|---|
| 1 | `TC-T1-M1-005` | T1 | High | `DEF-016` | Tràn ngang 19px ở màn hình 360px |
| 2 | `TC-T3-M3-004` | T3 | Critical | `DEF-026` | Trang giá không ghi rõ giá dự kiến vs giá cuối |
| 3 | `TC-T3-M4-006` | T3 | Critical | `DEF-025` | SĐT không có hồ sơ bị từ chối **im lặng** (không thông báo) |
| 4 | `TC-NFR-02-001` | ALL | Critical | `DEF-002` `DEF-009` | Thiếu header `Strict-Transport-Security` (T1, T3) |
| 5 | `TC-NFR-02-002` | ALL | Critical | `DEF-003` `DEF-006` `DEF-010` | Thiếu `X-Content-Type-Options: nosniff` (cả 3 site) |
| 6 | `TC-NFR-02-003` | ALL | Critical | `DEF-004` `DEF-007` `DEF-011` | Thiếu `X-Frame-Options` / CSP `frame-ancestors` (cả 3 site) |
| 7 | `TC-NFR-02-004` | ALL | High | `DEF-005` `DEF-008` `DEF-012` | Thiếu header `Referrer-Policy` (cả 3 site) |
| 8 | `TC-NFR-02-010` | ALL | Critical | `DEF-027` | T3 lộ 2 API key (Google Maps + Firebase) trong mã nguồn |
| 9 | `TC-NFR-04-005` | ALL | High | `DEF-016` | Có tràn ngang ở 360px (cùng root cause với #1) |
| 10 | `TC-NFR-06-001` | ALL | Critical | `DEF-013` | axe-core phát hiện vi phạm mức critical trên 3 site |
| 11 | `TC-NFR-06-002` | ALL | High | `DEF-014` `DEF-015` | Vùng chữ không đạt tương phản ≥ 4,5:1 (T1: 40 vùng · T2: 3 vùng) |
| 12 | `TC-NFR-06-004` | ALL | Medium | `DEF-013` | Thiếu thuộc tính `alt` trên 49 ảnh nội dung (T3) |
| 13 | `TC-NFR-06-005` | ALL | Medium | `DEF-001` | Trang chủ T3 không có phần tử `h1` |
| 14 | `TC-NFR-07-004` | ALL | Medium | `DEF-017` | T3 không có `sitemap.xml` |
| 15 | `TC-NFR-07-005` | ALL | Medium | `DEF-018` | T3 không có `robots.txt` |
| 16 | `TC-NFR-07-006` | ALL | Low | `DEF-021` | T1 và T2 thiếu thẻ meta Open Graph `og:image` |

### 3.2. Nhóm theo nguyên nhân gốc

| Nhóm nguyên nhân | Số Fail | Defect liên quan |
|---|---|---|
| Thiếu header bảo mật | 4 | `DEF-002`…`DEF-005`, `DEF-009`…`DEF-012` |
| Khả năng tiếp cận (a11y) | 4 | `DEF-001`, `DEF-013`, `DEF-014`, `DEF-015` |
| SEO kỹ thuật | 3 | `DEF-017`, `DEF-018`, `DEF-021` |
| Responsive 360px | 2 | `DEF-016` (1 root cause, 2 test case) |
| Rò rỉ khoá API | 1 | `DEF-027` |
| Thông báo lỗi người dùng | 1 | `DEF-025` |
| Minh bạch giá | 1 | `DEF-026` |

**16 Fail ← 14 root cause** (vì `DEF-016` và `DEF-013` mỗi defect sinh ra 2 test case Fail).

### 3.3. Không có hồi quy

| Kiểm tra | Kết quả |
|---|---|
| Ca đã Pass ở baseline Phase 3 (72 ca) còn Pass ở vòng này? | ✅ **Có** — 66/66 ca Pass vẫn Pass |
| Ca Fail ở baseline vẫn Fail (lỗi chưa tự khỏi)? | ✅ **Có** — 16/16 vẫn Fail, cùng defect ID |
| Có ca mới Fail do thay đổi mã? | ❌ **Không** — 10 ca T1 mới: 10/10 Pass |
| Có ca Flaky (Pass/Fail xen kẽ giữa các lần chạy)? | ❌ **Không** — 0 flaky |

> **Kết luận:** không phát hiện hồi quy. 10 test case mới viết ở Phase 5 không làm hỏng bất kỳ ca nào đang Pass.

---

## 4. Đối chiếu với baseline

| Vòng chạy | Ngày | Ca | Pass | Fail | Tỷ lệ Pass |
|---|---|---|---|---|---|
| Baseline Phase 3 (`t1` + `t3` + `security`) | 22/11 | 72 | 56 | 16 | 77,8% |
| Baseline Phase 5 (`t1` + `t3` + `security`, sau khi thêm 10 ca T1) | 22/11 | 82 | 66 | 16 | 80,5% |
| **Hồi quy vòng 1 (lần chạy này)** | 22/11 | **82** | **66** | **16** | **80,5%** |

**Ổn định 100%** — cùng số ca, cùng số Pass, cùng số Fail, cùng tập defect ID.

---

## 5. Vòng hồi quy tiếp theo (vòng 2)

Vòng 2 sẽ chạy khi có một trong các điều kiện:

| Điều kiện | Kỳ vọng |
|---|---|
| Site đích sửa lỗi (bất kỳ defect nào chuyển `Open` → `Fixed`) | Ca Fail tương ứng chuyển Pass |
| Nhóm nhận thêm test case từ Tài/Ngân/Lộc (45 ca T1 + 63 ca T2 còn "Chưa thực thi") | Tổng số ca tăng, tỷ lệ Pass giữ nguyên hoặc tăng |
| Có thay đổi cấu hình Playwright / spec / script quét | Toàn bộ 82 ca chạy lại, không ca nào chuyển từ Pass → Fail |
| Trước khi đóng gói hồ sơ nộp (Ngày 14) | Chốt số liệu cuối cho Final Test Report |

**Quy tắc bất di bất dịch của vòng 2** (theo `docs/design/usecase-workflow.md` §5.2 và quy tắc 3 của skill):
- ❌ Không sửa assertion để ca Fail chuyển Pass.
- ❌ Không dùng `skip` / `only` / hạ ngưỡng.
- ✅ Nếu site đích đã sửa lỗi → chạy lại ca đó, ghi kết quả mới và đóng defect với bằng chứng.
- ✅ Nếu site đích chưa sửa → giữ `Open`, cập nhật ngày re-test gần nhất.

---

## 6. Vì sao không "sửa cho xanh"

16 Fail này là **kết quả kiểm thử hợp lệ**, không phải lỗi của bộ testware:

| Loại lỗi | Ai chịu trách nhiệm | Hành động của nhóm |
|---|---|---|
| Thiếu header bảo mật, thiếu `alt`, thiếu `h1`, thiếu sitemap/robots/OG | Site đích (bên thứ ba) | Ghi nhận defect, báo cáo, **không sửa script** |
| Tràn ngang 360px, báo lỗi im lặng, thiếu câu "giá dự kiến" | Site đích (bên thứ ba) | Ghi nhận defect, báo cáo, **không sửa script** |
| Rò rỉ API key | Site đích (bên thứ ba) | Ghi nhận defect (đã mask khoá trong log), **không khai thác** |

> **Ranh giới ADR-11.** Nhóm không có quyền sửa mã nguồn của site đích. Việc hạ tiêu chuẩn kiểm thử để suite xanh sẽ là **đóng bài sai** — báo cáo trung thực là giá trị của đồ án này.

---

## 7. Kết luận

| Tiêu chí | Kết quả |
|---|---|
| Chạy được toàn bộ bộ hồi quy | ✅ 82/82 ca, 0 lỗi hạ tầng |
| Hồi quy (Regression) | ✅ **0 ca hồi quy** |
| Flaky test | ✅ 0 |
| Ổn định so với baseline | ✅ 100% |
| Fail đều có defect ID | ✅ 16/16 (14 root cause) |
| Fail đều là lỗi thật của site đích | ✅ 16/16 |

**Baseline hồi quy vòng 1 (đóng băng cho Final Test Report): 82 ca · 66 Pass · 16 Fail · 0 hồi quy · 0 flaky.**

Bằng chứng máy: `reports/raw/day-11-full-suite.txt` · `reports/execution-log.csv` (81 dòng đồng bộ).
