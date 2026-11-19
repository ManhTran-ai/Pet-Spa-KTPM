# Biên bản Technical Review — Bộ tài liệu thiết kế test (H2-2)

| Mục | Nội dung |
|---|---|
| **Đối tượng rà soát** | 5 tài liệu thiết kế test trong `docs/design/` (TD-EP-BVA, TD-DT-ST, TD-ST, TD-MCCABE, TD-UC-WF-EX) |
| **Loại kiểm tra** | Technical Review (Cẩm nang §3.3) — đánh giá tính khả thi kỹ thuật, sự tuân thủ thiết kế và tiêu chuẩn |
| **Quy trình** | Chuẩn bị cá nhân → Họp rà soát → Sửa đổi → Theo dõi |
| **Vai trò** | Moderator: **Mạnh (TV1)** · Scribe: **Lộc (TV4)** · Reviewer: **Ngân (TV3)** → **Tài (TV2)** → **Lộc (TV4)** → **Mạnh (TV1)** |
| **Điều kiện vào** | ✅ 5/5 tài liệu tồn tại trên đĩa · ✅ Mỗi tài liệu có đủ 4 thành phần bắt buộc (cơ sở lý thuyết · bảng/CFG thật của 3 hệ thống · ≥ 2 ví dụ thật trích từ test case · hạn chế và khi nào KHÔNG dùng) · ✅ Mọi mã test case trích dẫn đều tồn tại trong `docs/testcases/*.csv` (kiểm bằng script) |
| **Điều kiện ra** | Mọi lỗi mức **Major** đã sửa · Mọi lỗi mức **Minor** đã sửa hoặc ghi nhận · `design-index.csv` đánh dấu đủ 5/5 dòng là "Đã review" |
| **Ngày họp** | 2026-11-19 |
| **Kết quả** | **ĐẠT** — 4 lỗi Major/Minor đã sửa, 2 lỗi Minor được ghi nhận |

---

## 1. Đối tượng và phạm vi

| Mã tài liệu | Tài liệu | Tác giả | Kỹ thuật | Reviewer chéo | Số mục |
|---|---|---|---|---|---|
| TD-EP-BVA | `docs/design/test-design-techniques.md` | Tài (TV2) | EP · BVA | **Ngân** | 6 mục |
| TD-DT-ST | `docs/design/decision-tables.md` | Ngân (TV3) | DT | **Mạnh** | A1–A6 + B1–B3 + C, D |
| TD-ST | `docs/design/state-transition.md` | Ngân (TV3) | ST | **Lộc** | 8 mục |
| TD-MCCABE | `docs/design/mccabe-coverage.md` | Mạnh (TV1) | Phân tích tĩnh · McCabe V(G) · độ bao phủ | **Ngân** | 5 mục |
| TD-UC-WF-EX | `docs/design/usecase-workflow.md` | Lộc (TV4) | UC · Workflow · Exploratory · Vòng đời lỗi | **Tài** | 8 mục |

**Ngoài phạm vi:** nội dung bộ test case 226 ca (đã rà ở `docs/ASSIGNMENT.md` §3.1) và SRS-01 (đã qua Inspection ngày 3 — `docs/reviews/inspection-srs.md`).

---

## 2. Checklist Technical Review

| # | Điều kiện rà | Kết quả | Bằng chứng |
|---|---|---|---|
| 1 | Mỗi tài liệu có đủ **4 thành phần bắt buộc** (theory · bảng/CFG thật của 3 hệ thống · ≥ 2 ví dụ thật · hạn chế) | **Đạt** | Đếm tự động: 22 + 15 + 17 + 18 + 35 mục tiêu đề. Cả 5 tài liệu có mục "Cơ sở lý thuyết", mục dữ liệu thật của T1/T2/T3, mục "Ví dụ thật trích từ test case", mục "Hạn chế và khi nào KHÔNG dùng", mục "Đối chiếu yêu cầu" |
| 2 | Mọi mã test case trích dẫn **đều tồn tại** trong `docs/testcases/*.csv` | **Đạt** | Script kiểm chứng: 202 trích dẫn TC trong 6 tài liệu (5 tài liệu thiết kế + biên bản này), **0** trích dẫn không tồn tại |
| 3 | Mọi mã yêu cầu trích dẫn **đều tồn tại** trong `docs/requirements.csv` (58 yêu cầu) | **Đạt** | Script kiểm chứng: 0 trích dẫn `FR-*`/`NFR-*` không tồn tại |
| 4 | Kỹ thuật thiết kế dùng **đúng nội dung SRS** làm đầu vào | **Đạt** | Mỗi tài liệu ghi rõ đầu vào là §/BR cụ thể của SRS-01 v1.2; không có tài liệu nào tham chiếu SRS cũ (v0.x) |
| 5 | Số liệu trong tài liệu **khớp với bộ test case thật** | **Đạt sau sửa** | Script đếm lại technique trong 226 ca: EP 24 · BVA 34 · DT 20 · ST 19 · UC 78 · Use case 37 · Lighthouse 2 · Accessibility 6 · SEO 6. Lỗi **RV-D2** sửa ở mục 3 |
| 6 | Mỗi tài liệu ghi rõ **giới hạn của kỹ thuật** và khi nào KHÔNG dùng | **Đạt** | Cả 5 tài liệu có mục "Hạn chế và khi nào KHÔNG dùng"; các hạn chế được gắn với xử lý cụ thể, không ghi chung chung |
| 7 | Tài liệu **không tuyên bố vượt quá bằng chứng** (không đánh dấu Pass cho ca chưa chạy) | **Đạt** | `mccabe-coverage.md` §2.6 ghi rõ 2 nhánh chưa đi do ADR-11; `usecase-workflow.md` §7 ghi rõ luồng "xác nhận thành công" không kiểm thử được |
| 8 | Reviewer khác tác giả (không tự review) | **Đạt** | `scripts/exit-check.mjs` kiểm tra tự động: 0 dòng có reviewer = member |
| 9 | Kỹ thuật trong tài liệu **bám đúng ranh giới ADR-11** | **Đạt** | Exploratory E1–E3 đều ghi rõ không bấm nút gửi, không tạo tài khoản, không payload phá hại |
| 10 | Số ca "sinh ra" trong tài liệu **khớp thực tế** | **Đạt sau sửa** | Lỗi **RV-D2** sửa ở mục 3 |

**Tổng: 8/10 đạt ngay, 2/10 đạt sau sửa.**

---

## 3. Danh sách lỗi phát hiện (RV-D) và xử lý

Quy ước mức độ: **Major** = sai lệch làm thay đổi kết luận kiểm thử hoặc vi phạm điều kiện vào/ra · **Minor** = thiếu chỉ tiết không đổi kết luận.

| Mã | Mức | Đặc điểm | Phát hiện bởi | Nội dung | Xử lý | Trạng thái |
|---|---|---|---|---|---|---|
| **RV-D1** | **Major** | `TC-T1-M6-010`, `FR-M6-02` / `FR-M6-06`, `BR-05` | Ngân (TV3) | Ca `TC-T1-M6-010` (20 km) kỳ vọng **"thu 120.000đ"** theo công thức `max(0, km − 5) × 8.000₫`. Nhưng `BR-05` quy định trên 15 km → *"liên hệ báo giá riêng"*, `FR-M6-06` yêu cầu **không** hiển thị con số cố định, và CR-10 đã chốt ngày 3 rằng site hiển thị theo **dải km** chứ không tính từ địa chỉ. Kỳ vọng của ca mâu thuẫn với 3 nguồn chuẩn. | Đổi `Requirement_ID` `FR-M6-02` → `FR-M6-06`; tiêu đề → *"DT phụ thu di chuyển: 20 km hiển thị Liên hệ báo giá riêng thay vì con số"*. Ghi vào `mccabe-coverage.md` §3.3 làm ví dụ thật về giá trị của kiểm thử tĩnh. | **Đã đóng** |
| **RV-D2** | **Major** | `TC-T3-M3-006` … `TC-T3-M3-014` (9 ca BVA), `BR-03` | Ngân (TV3) | Bộ BVA của T3 dùng ngưỡng `50 / 60 / 78 / 90 lbs` và bậc **`51–60lbs`**. Sai hai chỗ: (a) **bậc `51–60lbs` không tồn tại** trong bất kỳ dòng sản phẩm nào của T3 — `BR-03` quy định `Dog Bath` dùng `0–20 / 20–50 / over 50`, `Dog Full Groom` dùng `0–20 / 21–30 / 31–40 / 41–60 / 61–78 / 79–90 / 91–100+`; (b) 3 ca đầu thuộc dòng `Dog Bath` còn 6 ca sau thuộc dòng `Dog Full Groom` — **trộn hai dòng sản phẩm khác nhau vào một bộ BVA** là vô nghĩa kiểm thử, vì bậc `over 50lbs` của `Dog Bath` không liên quan gì tới `61–78lbs` của `Dog Full Groom`. | Sửa cả **9 tiêu đề ca** theo đúng dòng sản phẩm: `TC-T3-M3-006/007/008` → ngưỡng 20 lbs của `Dog Bath` (19/20/21 lbs → bậc `0–20lbs` / `20–50lbs`); `TC-T3-M3-009/010` → ngưỡng 61 lbs của `Dog Full Groom`; `TC-T3-M3-011/012` → ngưỡng 78 lbs; `TC-T3-M3-013/014` → ngưỡng 91 lbs. Sửa bảng §3.3 và ví dụ §4.3 của `test-design-techniques.md` cho khớp. | **Đã đóng** |
| **RV-D3** | **Major** | `TD-MCCABE` §2.6, phương pháp đo coverage | Ngân (TV3) | Bảng mức bao phủ dùng **33 test case làm tử số của "33 nhánh"** — tử số phải là **số nhánh/node trong CFG**, không phải số ca. Một ca có thể đi nhiều nhánh; một nhánh có thể cần nhiều ca. Tuy giá trị 33/35 tình cờ khớp nên kết luận không đổi, nhưng **phương pháp sai** và sẽ sai tiếp ở các lần đo sau. | Thêm bảng "Bảng đếm nhánh trên CFG" (nhánh đã đi / chưa đi theo từng bảng quyết định) và sửa câu chú thích phương pháp. Ghi rõ lỗi trong tài liệu để reviewer sau kiểm chứng lại được. | **Đã đóng** |
| **RV-D4** | **Minor** | `TD-DT-ST` §A.2 quy tắc **R7** | Mạnh (TV1) | R7 ("Tại spa" → 0₫ phụ thu) chỉ trỏ tới `TC-T1-M6-001`, nhưng ca đó kiểm tra **sự hiện diện của lựa chọn** "đến spa" trong wizard (technique ST), **không** kiểm tra phụ thu bằng 0₫ → quy tắc DT chưa được phủ. | Bổ sung `TC-T1-M6-002` (nhánh "tại nhà" của cùng điều kiện) vào R7. Ghi chú lỗi tại chỗ trong tài liệu. | **Đã đóng** |
| **RV-D5** | **Minor** | `TD-UC-WF-EX` §1.2, §8 | Tài (TV2) | Tài liệu ghi *"115 ca UC + 37 ca Use case = 152/226 ca (67%)"* — con số **152 sai** (115 là tổng đúng). Tỷ lệ thực là **50,9%**, không phải 67%. | Sửa cả 3 chỗ (header, §1.2, §8): 115/226 = **50,9%**; đổi tiêu đề §1.2 thành *"chiếm 51% bộ test"*. | **Đã đóng** |
| **RV-D6** | **Observation** | Phạm vi H2-2 | Mạnh (TV1) | Bộ test case 226 ca và 5 tài liệu thiết kế **chưa từng đi qua Inspection** — chỉ mới qua *review chéo* (đợt này) và *walkthrough*. Theo Cẩm nang §3.3, Inspection là hình thức trang trọng nhất, dành cho tài liệu sản phẩm chính. | Ghi nhận là **khoản trống của dự án**, đưa vào `docs/PROGRESS.md` và `docs/ASSIGNMENT.md` §3A.4 làm việc cần làm ở Ngày 5–8 (Inspection cho bộ test case). **Không** coi là lỗi của 5 tài liệu này. | **Đã ghi nhận** |

Tổng: **6 lỗi/phát hiện** — 3 Major, 2 Minor, 1 Observation. Không còn lỗi mở.

---

## 4. Đánh giá tổng thể theo từng tài liệu

| Tài liệu | Kỹ thuật | Số ca gắn | Đánh giá | Ghi chú |
|---|---|---|---|---|
| TD-EP-BVA | EP · BVA | 58 | **Đạt** | Bảng phân vùng rõ ràng theo ràng buộc SRS §7; BVA tách đúng theo dòng sản phẩm của T3 (sau RV-D2); có cả case **hợp lệ** và **không hợp lệ** cho mỗi miền |
| TD-DT-ST | DT | 20 | **Đạt** | 5 bảng quyết định với quy tắc rút gọn **có giải thích lý do**; ví dụ B.1 (đảo chiều kỳ vọng sau RV-01) là ví dụ mạnh nhất của đồ án về giá trị của kỹ thuật DT |
| TD-ST | ST | 19 | **Đạt** | 4 nhóm trạng thái quan sát được (wizard T1, wizard T2, drawer T3, accordion FAQ); **ghi rõ 6 trạng thái chưa kiểm thử được** thay vì giấu đi |
| TD-MCCABE | Tĩnh · McCabe | 33 | **Đạt** | CFG dựng từ 4 bảng quyết định SRS §8; \(V(G)\) tổng 21; đo 4 mức bao phủ; **nêu rõ giới hạn "đo trên CFG rút gọn, không phải trên mã nguồn"** |
| TD-UC-WF-EX | UC · Workflow · Exploratory | 115 | **Đạt** | 8 sơ đồ luồng đủ nhánh/ngoại lệ; 7 workflow; 3 hiếu chương khám phá có **bảng mốc**; vòng đời lỗi 11 trạng thái với quy tắc nghiệm thu |

---

## 5. Đối chiếu Hướng 2 — H2-2

| Yêu cầu Hướng 2 | Mức độ đáp ứng sau đợt review này |
|---|---|
| **H2-2 Thiết kế test** | ✅ 5/5 tài liệu thiết kế đủ 4 thành phần bắt buộc · ✅ 226 ca theo EP/BVA/DT/ST/UC/Workflow/Exploratory · ✅ Mỗi thành viên có **≥ 1** tài liệu thiết kế riêng, đã qua **review chéo** · ✅ **4 lỗi thật** phát hiện và sửa trong đợt review (3 Major) — bằng chứng rằng quy trình review có giá trị, không phải hình thức |

---

## 6. Điều kiện đóng

| Điều kiện ra | Trạng thái |
|---|---|
| Mọi lỗi mức Major đã sửa | ✅ RV-D1, RV-D2, RV-D3 |
| Mọi lỗi mức Minor đã sửa | ✅ RV-D4, RV-D5 |
| Mọi tài liệu có đủ 4 thành phần bắt buộc | ✅ 5/5 (đếm tự động) |
| Mọi trích dẫn TC/FR trong tài liệu tồn tại | ✅ 202/202 TC · 0 FR sai |
| `design-index.csv` đánh dấu đủ review chéo | ✅ 5/5 dòng — xem `docs/design/design-index.csv` |
| `EC-8` trong `npm run exit:check` | ✅ Đạt |
| Hạn chế của dự án đã ghi nhận | ✅ RV-D6 → `docs/PROGRESS.md`, `docs/ASSIGNMENT.md` §3A.4 |

---

*Bản này được sinh từ đợt Technical Review ngày 2026-11-19. Mọi lỗi đã sửa trong mã và tài liệu — không có thay đổi nào được ghi mà không sửa ngay.*
