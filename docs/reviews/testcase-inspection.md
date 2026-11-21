# Biên bản Inspection bộ test case (Ngày 8)

| Mục | Nội dung |
|---|---|
| **Tài liệu bị rà soát** | Bộ test case 226 ca — `docs/testcases/{t1,t2,t3,nfr}.csv` |
| **Đối chiếu** | SRS-01 v1.2 (`docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md`), `docs/requirements.csv`, `docs/rtm.csv` |
| **Loại kiểm tra** | Inspection (Static Test — Verification theo ADR-13) |
| **Quy trình** | Kick-off → Chuẩn bị cá nhân → Họp rà soát → Sửa đổi → Theo dõi → Đóng |
| **Vai trò** | Moderator: **Mạnh (TV1)** · Scribe: **Lộc (TV4)** · Reviewer: **Tài (TV2)** → **Ngân (TV3)** → **Lộc (TV4)** → **Mạnh (TV1)** |
| **Điều kiện vào** | ✅ Bộ test case đủ 226 ca, truy xuất yêu cầu 100% · ✅ Tác giả đã tự rà (phiên Ngày 7) · ✅ SRS-01 v1.2 là baseline đóng băng (`srs-v1.0`) · ✅ Công cụ rà tự động `scripts/tc-review-check.mjs` đã hiệu lực |
| **Điều kiện ra** | 0 lỗi mức **Major** · 0 lỗi mức **Minor** · Mọi yêu cầu SRS-01 có ≥ 1 test case · `npm run gate` exit 0 · Baseline SRS được nâng lên v1.3 |
| **Ngày họp** | 2026-11-19 (phiên trực tiếp, 4/4 thành viên) |
| **Kết quả** | **ĐẠT** — bộ 226 test case được đóng băng làm baseline thực thi; SRS-01 v1.3 được chốt |

---

## 1. Đối tượng và phạm vi rà soát

| Hạng mục | Số lượng | Ghi chú |
|---|---|---|
| Test case chức năng T1 | 72 | `docs/testcases/t1.csv` |
| Test case chức năng T2 | 66 | `docs/testcases/t2.csv` |
| Test case chức năng T3 | 44 | `docs/testcases/t3.csv` |
| Test case phi chức năng | 44 | `docs/testcases/nfr.csv` |
| **Tổng** | **226** | Không thêm, không bỏ trong phiên này |
| Yêu cầu được phủ | 58 → 60 | `FR-M4-13` và `FR-M7-07` bổ sung trong phiên này |

Công cụ rà: `scripts/tc-review-check.mjs` — kiểm tra tự động 4 thành phần 4C theo `docs/ASSIGNMENT.md` §4, đối chiếu trực tiếp với `docs/requirements.csv`.

---

## 2. Kết quả theo checklist 4C (Cẩm nang §4)

| # | Thành phần | Điều kiện rà | Kết quả | Bằng chứng / Ghi chú |
|---|---|---|---|---|
| 1 | **Correctness** | Mọi `Requirement_ID` tồn tại trong SRS-01 | **Đạt sau sửa** | 226/226 ca trỏ tới yêu cầu có thật. Trước khi sửa có 2 ca trỏ sai: `TC-T1-M5-006` (→ `FR-M5-04` ngoài phạm vi T1), `TC-T3-M4-006` (→ `FR-M4-07` ngoài phạm vi T3). Đã sửa tại TV-02, TV-03. |
| 2 | **Correctness** | `System` của ca nằm trong phạm vi hệ thống của yêu cầu | **Đạt sau sửa** | 13 lỗi Major loại `C-SYSTEM`. Nguyên nhân gốc: §4 (bảng use case) và §5 (bảng yêu cầu) của SRS-01 **mâu thuẫn nhau** về phạm vi hệ thống — mở CR `CHG-2026-11-19-01`. |
| 3 | **Correctness** | Module trong `TC_ID` khớp module của yêu cầu | **Đạt sau sửa** | 1 lỗi Major `C-MODULE`: `TC-T2-M6-001` mang module M6 nhưng trỏ `FR-M2-07` (M2). Đã đổi thành `TC-T2-M2-003` — khớp chuỗi ID M2 của T2 (`001`…`006`, trước đó thiếu `003`). |
| 4 | **Clarity** | `Title` tự chứa đủ điều kiện + kết quả mong đợi | **Đạt sau sửa** | 12 ca T3 viết lại theo hành vi thật; 5 ca NFR sửa chữ hoa đầu câu. Tất cả `Title` ≥ 25 ký tự. |
| 5 | **Clarity** | Không còn token chờ (`TODO`, `TBD`, `xxx`, `chưa rõ`) | **Đạt** | Quét toàn 226 `Title` → 0 kết quả khớp. |
| 6 | **Completeness** | `Technique` ∈ {EP, BVA, DT, ST, UC, Use case} (chức năng) · {Lighthouse, Accessibility, SEO} (NFR) | **Đạt** | 0 vi phạm sau khi tách bộ quy tắc riêng cho ca NFR (các ca NFR đo bằng công cụ, không dùng kỹ thuật thiết kế hộp đen). |
| 7 | **Completeness** | `Type` ∈ {Auto, Manual} · `Priority` ∈ {Critical, High, Medium, Low} · `Owner` ∈ 4 thành viên · `Status` ∈ 5 trạng thái | **Đạt** | 0 vi phạm. |
| 8 | **Completeness** | Mọi yêu cầu SRS-01 có ≥ 1 test case | **Đạt** | 60/60 yêu cầu được phủ. 2 yêu cầu mới (`FR-M4-13`, `FR-M7-07`) được phủ ngay khi sinh ra. |
| 9 | **Consistency** | `TC_ID` đúng định dạng, không trùng, đủ 9 cột | **Đạt sau sửa** | 2 lỗi Major do `Title` chứa dấu phẩy không được quote (`TC-T3-M3-005`, `TC-T3-M4-009`) → CSV bị lệch cột. Đã quote lại. |
| 10 | **Consistency** | Không trùng `Title` trong cùng nhóm (yêu cầu, hệ thống) | **Đạt** | 0 trùng lặp. |

**Tổng: 7/10 đạt ngay, 3/10 đạt sau khi sửa.** Trước khi sửa: **14 Major + 5 Minor**. Sau khi sửa: **0 Major + 0 Minor**.

---

## 3. Danh sách lỗi phát hiện (TV) và xử lý

Quy ước mức độ: **Major** = sai lệch làm thay đổi kết luận kiểm thử hoặc vi phạm điều kiện vào/ra · **Minor** = thiếu chi tiết không đổi kết luận.

| Mã | Mức | Quy tắc | Đặc điểm | Phát hiện bởi | Nội dung | Xử lý | Trạng thái |
|---|---|---|---|---|---|---|---|
| **TV-01** | Major | `C-SYSTEM` | `FR-M5-04` | Ngân (TV3) | §4 `UC-05` gán `FR-M5-01…04` cho **T1**, nhưng §5.5 giới hạn `FR-M5-04` cho `T2, T3`. Ca `TC-T1-M5-006` trỏ `FR-M5-04` → nằm ngoài phạm vi. Kiểm chứng sống: FAQ T1 có mục "Có thể đổi/huỷ lịch không?" → *huỷ/đổi miễn phí nếu báo trước 4 giờ; trong 4 giờ cuối phụ thu 50% cho lịch tại nhà*. | Mở CR `CHG-2026-11-19-01` → mở rộng `FR-M5-04` sang `T1, T2, T3`, bổ sung tiêu chí T1. Đồng thời trỏ lại `TC-T1-M5-006` sang `FR-M5-03` (scope `T1`) và đổi `Title` cho khớp. | **Đã đóng** |
| **TV-02** | Major | `C-SYSTEM` | `FR-M4-06` | Tài (TV2) | §8.1 mô tả máy trạng thái wizard **T2** (`S0 → S1 → S2`) nhưng §5.4 giới hạn `FR-M4-06` cho `T1`. Kiểm chứng sống: `matpet.vn/spa` hiện đúng 3 bước "Loại bé / Cân nặng / Dịch vụ" với nút "Tiếp tục →" bị khoá khi chưa chọn. | `FR-M4-06` → scope `T1, T2`, tiêu chí dẫn chiếu §8.1. `TC-T2-M4-013`/`-014` trở nên hợp lệ. | **Đã đóng** |
| **TV-03** | Major | `C-SYSTEM` | `FR-M4-01`, `FR-M4-02`, `FR-M4-03` | Mạnh (TV1) | §4 `UC-03` gán `FR-M4-01…08` cho `T1, T2, T3`, nhưng §5.4 chỉ ghi `T1, T2`. Kiểm chứng sống drawer T3: có `select` quốc gia + `input[type=tel]` placeholder `Mobile number`; nút `Login` `disabled=true` khi SĐT rỗng hoặc chứa chữ cái. | Mở rộng cả 3 yêu cầu sang `T1, T2, T3` với tiêu chí riêng cho T3 (khoá nút, không kiểm tra độ dài tối thiểu). Viết lại 6 ca T3 tương ứng. | **Đã đóng** |
| **TV-04** | Major | `C-SYSTEM` | `FR-M4-07`, `FR-M4-08` | Mạnh (TV1) | Cùng mâu thuẫn §4/§5 với TV-03. Kiểm chứng sống: danh mục T3 có 5 nhóm mở/thu gọn độc lập, tổng 41 dịch vụ. Bấm tên dịch vụ **không** mở drawer và **không** đổi trạng thái chọn. | Mở rộng `FR-M4-07`/`FR-M4-08` sang `T1, T2, T3`; tiêu chí T3 mô tả cơ chế mở/thu gọn nhóm thay cho bước chọn dịch vụ. Viết lại 2 ca T3 tương ứng. | **Đã đóng** |
| **TV-05** | Major | `C-SYSTEM` | `FR-M3-06` | Lộc (TV4) | §5.3 giới hạn `FR-M3-06` cho `T2`. T3 có nhóm `EMERGENCY APPOINTMENT (2)` với 2 khoản phụ thu `*HOLIDAY FEE*` $27 và `Emergency appointment fee *WAIT LIST ONLY*` $25 (đã mô tả ở `BR-17` nhưng chưa gắn vào yêu cầu nào). | Mở rộng `FR-M3-06` sang `T2, T3`; tiêu chí T3 nêu đích danh 2 khoản phụ thu. Viết lại `TC-T3-M3-005`. | **Đã đóng** |
| **TV-06** | Major | `C-MODULE` | `TC-T2-M6-001` | Ngân (TV3) | `TC_ID` mang module **M6** nhưng `Requirement_ID` là `FR-M2-07` (module **M2**). | Đổi `TC_ID` → `TC-T2-M2-003` (bổ sung khoảng trống trong chuỗi M2 của T2). Nội dung và kỹ thuật giữ nguyên. | **Đã đóng** |
| **TV-07** | Major | `C-SYSTEM` | `TC-T3-M4-006` | Mạnh (TV1) | Ca trỏ `FR-M4-07` trong khi T3 không có bước chọn dịch vụ trong luồng đặt lịch (bấm dịch vụ ở danh mục không mở drawer). | Sinh yêu cầu mới `FR-M4-13` (T3 chỉ nhận đặt lịch từ khách đã có hồ sơ) và trỏ ca sang `FR-M4-13`, viết lại theo hành vi thật. | **Đã đóng** |
| **TV-08** | Major | `C-SYSTEM` | `TC-T3-M7-002` | Lộc (TV4) | Ca trỏ `FR-M7-03` (chuyển ngôn ngữ) cho T3, nhưng T3 **chỉ có tiếng Anh** và không có điều khiển chuyển ngữ — khớp với `UC-07` N3 và §3.4. | Sinh yêu cầu mới `FR-M7-07` (hiển thị nội dung bằng một ngôn ngữ duy nhất khi hệ thống không hỗ trợ đa ngôn ngữ), scope `T3`. Trỏ ca sang `FR-M7-07`. `FR-M7-03` ghi rõ loại trừ T3. | **Đã đóng** |
| **TV-09** | Major | `C-COLUMN` | `TC-T3-M3-005`, `TC-T3-M4-009` | Tài (TV2) | `Title` chứa dấu phẩy chưa được đặt trong dấu nháy kép → bộ phân tích CSV dịch cột, làm lệch `Priority`/`Technique`/`Type`/`Owner`/`Status`. | Bọc `Title` trong dấu nháy kép. | **Đã đóng** |
| **TV-10** | Minor | `CL-TITLE` | 5 ca NFR | Lộc (TV4) | `Title` bắt đầu bằng chữ thường: `TC-NFR-01-006`, `TC-NFR-02-004`, `TC-NFR-06-001`, `TC-NFR-07-004`, `TC-NFR-07-005`. `TC-NFR-02-004` cũng chỉ 25 ký tự, chưa nêu đối tượng kiểm tra. | Viết hoa chữ đầu và làm rõ đối tượng kiểm tra trong `Title`. | **Đã đóng** |

Tổng: **10 lỗi** — 9 Major, 1 Minor (nhóm Minor gồm 5 ca). Không còn lỗi mở.

### 3.1 Phân tích nguyên nhân gốc

Cả 9 lỗi Major đều thuộc nhóm **Correctness**, và 7/9 bắt nguồn từ **một nguyên nhân duy nhất**: bảng use case (§4) và bảng yêu cầu (§5) của SRS-01 **không cùng phạm vi hệ thống**. Đây không phải lỗi viết test case mà là lỗi đặc tả — vì vậy xử lý đúng là sửa SRS theo quy trình CR, chứ không phải xoá hay bỏ test case.

Em không chọn phương án xoá/bỏ ca vì số lượng 226 ca là cam kết với khối lượng đã giao; cũng không chọn phương án "ép" yêu cầu wizard lên T3 vì điều đó sẽ ghi vào đặc tả một hành vi **không tồn tại** — vi phạm nguyên tắc đặc tả theo hành vi quan sát được (SRS §2.6).

---

## 4. Bằng chứng kiểm chứng hành vi (site đích, chỉ đọc — ADR-11)

Phiên này có thu thập bằng chứng sống trực tiếp trên 3 site đích, không gửi biểu mẫu đặt lịch, không tạo khách hàng mới.

| Hệ thống | Hành vi kiểm chứng | Phục vụ lỗi |
|---|---|---|
| T1 (`petngon.vn/vi`) | FAQ accordion "Có thể đổi/huỷ lịch không?" → *"Bạn có thể huỷ hoặc đổi lịch miễn phí nếu thông báo trước 4 giờ. Trong vòng 4 giờ trước giờ hẹn, phụ thu 50% cho lịch tại nhà do đã điều phối thợ và xe."* | TV-01 |
| T2 (`matpet.vn/spa`) | Wizard 3 bước "Loại bé / Cân nặng / Dịch vụ", nút "Tiếp tục →" và "← Quay lại"; giá dự kiến + tóm tắt lựa chọn cập nhật theo từng bước | TV-02 |
| T3 (Groomore) | Drawer "Book Now": `select` quốc gia (246 tuỳ chọn, mặc định `International`) + `input[type=tel]` placeholder `Mobile number`; nút `Login` `disabled=true` khi rỗng hoặc chứa chữ cái, `disabled=false` khi nhập chữ số; định dạng tự động `(609) 123-4567` | TV-03, TV-07 |
| T3 (Groomore) | Danh mục 5 nhóm / 41 dịch vụ; **bấm tên dịch vụ không mở drawer, không đổi trạng thái chọn**; mỗi nhóm mở/thu gọn độc lập | TV-04 |
| T3 (Groomore) | Nhóm `EMERGENCY APPOINTMENT (2)`: `*HOLIDAY FEE*` $27, `Emergency appointment fee *WAIT LIST ONLY*` $25 | TV-05 |
| T3 (Groomore) | Submit SĐT không có hồ sơ → alert *"Sorry, it is only available for existing client."*; banner *"NEW CLIENTS please fill out our intake form on our Facebook page or text 609-816-7755 for the form before booking an appointment."* | TV-07 |
| T3 (Groomore) | Không có nút/link/select chuyển ngôn ngữ; toàn bộ nội dung tiếng Anh | TV-08 |

---

## 5. Tác động xuôi dòng

| Đối tượng | Tác động | Xử lý |
|---|---|---|
| `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` | v1.2 → **v1.3**: 9 yêu cầu đổi phạm vi HĐ, 8 yêu cầu đổi tiêu chí chấp nhận, **2 yêu cầu mới** (`FR-M4-13`, `FR-M7-07`), thêm §8.2b (luồng T3), sửa §3.3, §4, §7 | Cập nhật trong phiên này |
| `docs/srs.md` | Đồng bộ từ bản gốc (`npm run docs:sync`) | Cập nhật trong phiên này |
| `docs/requirements.csv` | 58 → **60** yêu cầu (53 FR + 7 NFR); truy xuất 60/60 | `npm run req:build` |
| `docs/rtm.csv` + `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` | 60 yêu cầu, 60 được phủ, 226 test case | `npm run rtm:build` |
| `docs/testcases/t1.csv` | 1 ca đổi `Requirement_ID` + `Title` (`TC-T1-M5-006`) | Cập nhật trong phiên này |
| `docs/testcases/t2.csv` | 1 ca đổi `TC_ID` (`TC-T2-M6-001` → `TC-T2-M2-003`) | Cập nhật trong phiên này |
| `docs/testcases/t3.csv` | 11 ca viết lại (`TC-T3-M3-005`, `TC-T3-M4-001`…`-011`, `TC-T3-M7-002`) | Cập nhật trong phiên này |
| `docs/testcases/nfr.csv` | 5 ca sửa `Title` | Cập nhật trong phiên này |
| `docs/change-requests.md` | Mở `CHG-2026-11-19-01` — trạng thái **Đã áp dụng** | Cập nhật trong phiên này |
| Số lượng test case | **226 — không thêm, không bỏ** | — |

---

## 6. Điều kiện đóng

| Điều kiện ra | Trạng thái |
|---|---|
| Mọi lỗi mức Major đã sửa | ✅ TV-01…TV-09 đã sửa |
| Mọi lỗi Minor đã sửa | ✅ TV-10 đã sửa (5 ca) |
| Mọi yêu cầu SRS-01 có ≥ 1 test case | ✅ 60/60 |
| `scripts/tc-review-check.mjs` exit 0 | ✅ **0 Major · 0 Minor · 0 Observation** |
| `npm run gate` exit 0 | ✅ `req:check` 0 vi phạm · `rtm:check` 60/60 = 100% · `assign:check` 4/4 nguyên tắc · `exit:check` 5/8 (EC-2 siết ở Phase 7, EC-6 theo ADR-11) |
| Baseline đóng băng | ✅ SRS-01 v1.3 + bộ 226 ca |

**Moderator xác nhận:** bộ 226 test case là baseline thực thi hợp lệ cho cả 3 hệ thống đích. Chuyển sang **Phase 2 — Walkthrough & Test Design Assembly**.

---

## 7. Nhật ký phiên (Scribe: Lộc)

| # | Nội dung | Người ghi |
|---|---|---|
| 1 | Mở phiên; chạy `scripts/tc-review-check.mjs` lần 1 → 14 Major + 5 Minor trên 226 ca | Lộc |
| 2 | Phân tích 14 Major: 1 `C-MODULE`, 13 `C-SYSTEM`; truy nguồn về mâu thuẫn phạm vi §4 ↔ §5 của SRS-01 | Mạnh |
| 3 | Kiểm chứng hành vi sống trên T1 (FAQ đổi/huỷ lịch), T2 (wizard 3 bước), T3 (drawer SĐT, danh mục 41 dịch vụ, cổng khách cũ) — chỉ đọc, ADR-11 | Mạnh |
| 4 | Mở CR `CHG-2026-11-19-01`, trình bày phương án reconcile cho nhóm; được phê duyệt | Mạnh → nhóm |
| 5 | Sửa SRS v1.2 → v1.3 (9 yêu cầu đổi phạm vi, 2 yêu cầu mới, §3.3/§4/§7/§8.2b) | Mạnh, Lộc |
| 6 | Viết lại 11 ca T3 theo hành vi thật, sửa 1 ca T1, đổi ID 1 ca T2, sửa 5 `Title` NFR | Ngân, Tài |
| 7 | Rebuild `requirements.csv`, `rtm.csv`, backlog; chạy lại linter → 0/0/0 | Tài |
| 8 | Chạy `npm run gate` → exit 0 | Ngân |

**Tài liệu kèm theo:** `reports/raw/tc-review-check.txt` (báo cáo linter 4C, lần chạy sau sửa = 0 phát hiện).

---

## 8. Ghi chú về giới hạn

- Phiên này rà soát **tài liệu test case**, không phải mã nguồn. Hành vi site đích được kiểm chứng bằng quan sát công khai và thao tác chỉ đọc / kiểm tra kiểm tra phía client — **không** tạo khách hàng mới, **không** hoàn tất đặt lịch (ADR-11).
- Các ca `TC-T3-M4-006` và `TC-T3-M4-007` được viết theo hành vi **từ chối** của hệ thống (khách chưa có hồ sơ) nên có thể thực thi đầy đủ trong môi trường thật mà không đặt lịch thật. Các luồng sau khi bấm `Login` với SĐT thuộc hồ sơ cũ **không** kiểm thử được — ghi nhận trong Test Plan §2.3.
- Việc ghi nhận hành vi thiết kế của site đích là **kết quả khảo sát**, không phải defect — nhóm không sửa site đích. Điều này áp dụng cho `FR-M4-13` (cổng khách cũ) và `FR-M7-07` (chỉ tiếng Anh).
