# Báo cáo trạng thái re-test lỗi — Vòng 1

| | |
|---|---|
| **Ngày** | 2026-11-22 (Ngày 13 theo kế hoạch 14 ngày) |
| **Người thực hiện** | Mạnh — Test Lead (TV1) |
| **Phạm vi** | Toàn bộ 28 defect trong `docs/defects/defects.csv` |
| **Bằng chứng** | `reports/raw/day-11-full-suite.txt` (82 ca) · `reports/raw/day-09-phase3-suite.txt` (72 ca) · `reports/raw/security-summary.csv` (24 dòng) · `reports/raw/axe-summary.csv` |
| **Kết quả** | **22/28 defect đã re-test · 0 defect đóng · 0 defect chuyển hướng** |

---

## 1. Quy tắc vòng đời lỗi áp dụng

Theo `docs/design/usecase-workflow.md` §5.2 (bộ quy tắc đã được review chéo) và §5.3 (bảng vai trò):

| Quy tắc | Hệ quả cho vòng re-test này |
|---|---|
| Lỗi của bên thứ ba **giữ trạng thái `Open`**, ghi chú *"lỗi của bên thứ ba, không sửa được"* | Không defect nào của site đích được chuyển sang `Deferred`/`Closed` chỉ vì "không sửa được" |
| **Không hạ tiêu chí** để ép xanh | Không sửa assertion, không dùng `skip`/`only`, không hạ ngưỡng |
| Mọi lỗi phải có **bằng chứng** | Re-test cập nhật bằng chứng mới vào cột `Evidence` |
| Người đóng lỗi = người viết ca gốc; Mạnh duyệt đóng lỗi | Chưa có ca nào đạt điều kiện đóng → **0 defect đóng** |
| Lỗi hạ tầng (timeout, `ERR_INTERNET_DISCONNECTED`) **không** ghi vào defect log | 0 lỗi hạ tầng trong 28 defect hiện tại |

> **Đối chiếu với `docs/PLN-01-ke-hoach-cong-viec-Manh.md` §6.3** (bản kế hoạch local của Mạnh): bản này gợi ý chuyển lỗi site đích sang `Deferred` hoặc `Closed`. **Em không làm theo** — quy tắc của `usecase-workflow.md` §5.2 là chuẩn thiết kế test đã review chéo, và nó quy định rõ giữ `Open`. Em ghi nhận sự khác biệt này tại đây để Test Lead chốt nếu nhóm muốn đổi.

---

## 2. Kết quả re-test theo nhóm

### 2.1. Nhóm đã re-test (22 defect)

| Nhóm | Defect | Kết quả re-test | Trạng thái |
|---|---|---|---|
| **Header bảo mật (NFR-02)** | `DEF-002` `DEF-003` `DEF-004` `DEF-005` (T1) | ❌ Vẫn thiếu | Giữ `Open` |
| | `DEF-006` `DEF-007` `DEF-008` (T2) | ❌ Vẫn thiếu | Giữ `Open` |
| | `DEF-009` `DEF-010` `DEF-011` `DEF-012` (T3) | ❌ Vẫn thiếu | Giữ `Open` |
| **Khả năng tiếp cận (NFR-06)** | `DEF-001` (thiếu `h1` T3) | ❌ Vẫn còn (0 phần tử `h1`) | Giữ `Open` |
| | `DEF-013` (thiếu `alt` 49 ảnh T3) | ❌ Vẫn còn | Giữ `Open` |
| | `DEF-014` `DEF-015` (tương phản T1/T2) | ❌ Vẫn còn (40 + 3 node) | Giữ `Open` |
| **Responsive (NFR-04)** | `DEF-016` (tràn ngang 19px T1) | ❌ Vẫn còn | Giữ `Open` |
| **SEO kỹ thuật (NFR-07)** | `DEF-017` `DEF-018` (sitemap/robots T3) | ❌ Vẫn 404 | Giữ `Open` |
| | `DEF-021` (thiếu `og:image` T1/T2) | ❌ Vẫn thiếu | Giữ `Open` |
| **Rò rỉ khoá (NFR-02)** | `DEF-027` (2 API key T3) | ❌ Vẫn còn | Giữ `Open` |
| **UX đặt lịch (T3)** | `DEF-025` (báo lỗi im lặng) | ❌ Vẫn còn | Giữ `Open` |
| | `DEF-026` (thiếu câu "giá dự kiến") | ❌ Vẫn còn | Giữ `Open` |

**Tất cả 22 defect đều vẫn hiện diện sau re-test.** Cột `Resolution` của 22 defect đã được cập nhật với ghi chú:

> *"Đã re-test 22/11/2026 (hồi quy vòng 1) — lỗi vẫn còn, site đích chưa sửa"*

### 2.2. Nhóm chưa re-test (6 defect)

6 defect này **chưa có ca tự động** nên chưa được chạy lại trong vòng hồi quy 1:

| Defect | Mô tả | Lý do chưa re-test | Kế hoạch |
|---|---|---|---|
| `DEF-019` | Lighthouse Performance < 70 (cả 3 site) | Cần `npm run lh:scan` — 3 lần/site, tốn thời gian, không nằm trong suite E2E | Ngày 14 (đóng gói) |
| `DEF-020` | Lighthouse LCP > 2,5s (cả 3 site) | Như trên | Ngày 14 |
| `DEF-022` | T2 cho phép chọn ngày > 30 ngày | Ca `TC-T2-M4-007` thuộc T2 (Ngân viết) — ngoài phạm vi phiên Mạnh | Khi Ngân chạy |
| `DEF-023` | T1/T3 không có ô chọn ngày | Ca `TC-T1-M4-003` của Tài (đối chiếu) — ngoài phạm vi phiên Mạnh | Khi Tài chạy |
| `DEF-024` | T3 mã hoá bậc lbs trong tên dịch vụ | Ca `TC-T3-M3-006` của Ngân — ngoài phạm vi phiên Mạnh | Khi Ngân chạy |
| `DEF-028` | T3 trả PII qua API tra cứu SĐT | Cần SĐT **đã có hồ sơ thật** trong hệ thống đích — nhóm không có SĐT khách hàng hợp lệ; em **không** dùng SĐT của người thật để truy cập dữ liệu cá nhân | `HUMAN-PENDING` |

> **Lưu ý về `DEF-028`:** đây là defect nghiêm trọng nhất trong toàn bộ danh mục (PII của khách hàng bị lộ qua API chỉ cần biết SĐT). Em **không** thực hiện re-test vì việc đó đòi hỏi truy cập hồ sơ của khách hàng thật — vi phạm ADR-11 và quyền riêng tư. Bằng chứng phát hiện đã được lưu tại `reports/gates/day-09b.md` §6.2 (chỉ ghi nhận quan sát, **không** lưu bản sao PII).

---

## 3. Thống kê trạng thái defect sau re-test

| Trạng thái | Trước re-test | Sau re-test | Thay đổi |
|---|---|---|---|
| `New` | 7 | 7 | — |
| `Open` | 21 | 21 | — |
| `In Progress` | 0 | 0 | — |
| `Fixed` | 0 | 0 | — |
| `Closed` | 0 | 0 | — |
| `Deferred` | 0 | 0 | — |
| **Tổng** | **28** | **28** | — |

### 3.1. Phân bổ theo hệ thống và mức độ

| Hệ thống | Số lỗi | Critical | High | Medium | Low |
|---|---|---|---|---|---|
| T3 | 13 | 0 | 3 | 8 | 2 |
| T1 | 6 | 0 | 0 | 5 | 1 |
| T2 | 5 | 0 | 0 | 3 | 2 |
| ALL (cả 3 site) | 4 | 0 | 2 | 0 | 2 |
| **Tổng** | **28** | **0** | **5** | **16** | **7** |

### 3.2. Phân bổ theo mô đun nghiệp vụ

| Mô đun | Số lỗi | Chi tiết |
|---|---|---|
| NFR-02 (bảo mật) | 13 | 11 header + `DEF-027` rò rỉ khoá + `DEF-028` PII |
| NFR-06 (tiếp cận) | 4 | `DEF-001` `DEF-013` `DEF-014` `DEF-015` |
| NFR-07 (SEO) | 3 | `DEF-017` `DEF-018` `DEF-021` |
| NFR-01 (hiệu năng) | 2 | `DEF-019` `DEF-020` |
| NFR-04 (tương thích) | 1 | `DEF-016` |
| M3 (giá) | 2 | `DEF-024` `DEF-026` |
| M4 (đặt lịch) | 3 | `DEF-022` `DEF-023` `DEF-025` |

> **Nhận xét phân bổ:** **13/28 lỗi (46,4%) tập trung ở NFR-02** — nhóm kiểm tra bảo mật. Đây là kết quả đúng như kỳ vọng: cả 3 site đều là website WordPress/Wix dùng theme có sẵn, thiếu cấu hình security header ở tầng máy chủ. Ngược lại, nhóm kiểm tra **chức năng** gần như không có lỗi — chỉ **5 lỗi** ở M3/M4 (`DEF-022` `DEF-023` `DEF-024` `DEF-025` `DEF-026`), đều là vấn đề trải nghiệm nhỏ như thiếu thông báo lỗi, thiếu câu "giá dự kiến".
>
> **Lưu ý về mức độ:** không có defect nào ở mức `Critical` — 0/28. Mức cao nhất là `High` (5 defect: `DEF-013` `DEF-019` `DEF-020` `DEF-027` `DEF-028`). `DEF-028` (lộ PII qua API) là lỗi nghiêm trọng nhất về **mức độ tác động**, nhưng theo thang đo của nhóm vẫn xếp `High` vì cần thêm điều kiện "biết SĐT của khách" để khai thác.

---

## 4. Vì sao 0 defect được đóng?

| Điều kiện đóng lỗi | Trạng thái |
|---|---|
| Site đích đã sửa lỗi | ❌ Chưa — re-test 22/11 vẫn tái hiện toàn bộ |
| Người viết ca gốc chạy lại và xác nhận đã hết | ❌ Chưa — không có ca nào chuyển Fail → Pass |
| Mạnh duyệt đóng | ❌ Chưa — không có đề nghị đóng nào |
| Có bằng chứng đóng | ❌ Chưa |

**Kết luận:** 28 defect giữ nguyên trạng thái. Đây là **kết quả trung thực** — nhóm không có quyền sửa mã nguồn của site đích, và không có bằng chứng nào cho thấy lỗi đã được khắc phục.

---

## 5. Kế hoạch vòng re-test 2

| Điều kiện | Hành động |
|---|---|
| Site đích sửa bất kỳ lỗi nào trong 28 defect | Chạy lại đúng ca đó → nếu Pass thì cập nhật `Status = Fixed` + bằng chứng mới → Mạnh duyệt đóng |
| Ngân/Tài/Lộc chạy các ca của họ | Re-test `DEF-022` `DEF-023` `DEF-024` → cập nhật trạng thái |
| Chạy `npm run lh:scan` lần cuối (Ngày 14) | Re-test `DEF-019` `DEF-020` |
| Nhóm có SĐT khách hàng **được phép** dùng (hoặc site T3 tự tạo hồ sơ test) | Re-test `DEF-028` — **cần `HUMAN-PENDING`** |

---

## 6. Kết luận

| Tiêu chí | Kết quả |
|---|---|
| Số defect đã re-test | **22/28** (6 defect còn lại có lý do cụ thể, xem §2.2) |
| Defect nào đã được khắc phục | **0** |
| Defect nào bị đóng sai (không đủ bằng chứng) | **0** |
| Test nào bị sửa để ép xanh | **0** |
| Bằng chứng mới bổ sung | Cột `Resolution` của 22 defect + `reports/raw/day-11-full-suite.txt` |

**Trạng thái vòng re-test 1: 28 defect · 21 `Open` · 7 `New` · 0 đóng · 0 chuyển hướng.**

Điều này là kết quả đúng: **vòng re-test chưa đóng được defect nào không phải vì thiếu nỗ lực, mà vì site đích chưa sửa.** Đây chính là nội dung cần trình bày trong Final Test Report — nhóm đã kiểm thử đầy đủ và trung thực, phần còn lại thuộc về bên thứ ba.

Bằng chứng: `reports/raw/day-11-full-suite.txt` · `docs/defects/defects.csv` (28 dòng, 22 đã ghi chú re-test).
