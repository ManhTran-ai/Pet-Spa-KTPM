# Change Requests (CR)

Đối tượng: Kiểm thử ba hệ thống web Pet Spa (T1 Pet NGON, T2 Mật Pet Family, T3 Pretty Paws) · Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Nguyên tắc (SRS-01 §13): mọi thay đổi SRS đích sau baseline ngày 3 phải có CR, tăng phiên bản SRS, và cập nhật `docs/requirements.csv`, RTM và test case liên quan trong vòng 1 ngày; Mạnh duyệt.

Trạng thái CR: `Chờ nhóm` | `Đã chấp nhận` | `Từ chối` | `Đã áp dụng`.

| CR | Ngày mở | Người đề xuất | Tiêu đề | Yêu cầu liên quan | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| CHG-2026-11-13-01 | 2026-11-13 | Mạnh | Chốt CSDL trong §2.4 là PostgreSQL + Prisma | Mục 2.4 (không có ID yêu cầu) | Đã áp dụng | Theo ADR-01; ghi chú ngay dưới §2.4 trong `docs/srs.md`; không ảnh hưởng FR/NFR nên không cần cập nhật RTM |
| CHG-2026-11-13-03 | 2026-11-13 | Mạnh | Đổi hướng đồ án: kiểm thử 3 hệ thống web đang vận hành thay vì tự xây hệ thống | Toàn bộ FR/NFR (SRS-01 v1.0 mới) | Đã áp dụng | Theo ADR-09..ADR-13; mốc 14 ngày tính lại từ 2026-11-13; bộ testware cũ archive |
| CHG-2026-11-14-01 | 2026-11-14 | Mạnh | Sửa SRS-01 theo khảo sát giá REF-01: `BR-03`, `BR-12`, `FR-M3-02`, mục 3.2/3.3/3.4; bổ sung `BR-17`, `BR-18` | FR-M3-02, BR-03, BR-12 | Đã áp dụng | SRS v1.0 → v1.1; căn cứ `docs/reference/pricing-baseline.md` §3.4, §4.1 |
| CHG-2026-11-14-02 | 2026-11-14 | Mạnh | Sửa tiêu chí chấp nhận `FR-M3-02` cho T2: bỏ yêu cầu "cùng bậc cân nặng nhưng Mèo → giá khác" | FR-M3-02 | **Đã áp dụng** | Quyết định Inspection 2026-11-18 (RV-01): coi bảng giá dùng chung Chó/Mèo của T2 là **hành vi thiết kế hợp lệ**, không phải lỗi site. Tiêu chí `FR-M3-02` tách theo từng hệ thống: T1 giữ yêu cầu Chó ≠ Mèo, **T2 bỏ**, T3 giữ. SRS v1.1 → v1.2 |
| **CHG-2026-11-21-01** | **2026-11-21** | **Tài** | **Bổ sung gói "Combo Tắm + Vệ sinh" vào danh sách dịch vụ hỗ trợ tại nhà của T1 (phụ thu +70.000₫) trong `BR-06` và `FR-M6-03`** | BR-06, FR-M6-03, FR-M2-03, FR-M2-05 | **Chờ Mạnh duyệt** | Bằng chứng: `reports/raw/survey-T1-cards.json` (khảo sát DOM trực tiếp 21/11/2026). Chi tiết bên dưới. SRS v1.2 → v1.3 (dự kiến) |

## Thay đổi đã áp dụng trên bản làm việc

| Mã | Ngày | Nội dung | Căn cứ | Tác động RTM / test case |
|---|---|---|---|---|
| CHG-2026-11-13-01 | 2026-11-13 | SRS §2.4: "MySQL hoặc PostgreSQL \[Cần chốt\]" → "PostgreSQL + Prisma", có ghi chú giải thích | ADR-01 (xác nhận của người dùng ngày 2026-11-13) | Không có FR/NFR liên quan; RTM và test case không đổi |
| CHG-2026-11-13-02 | 2026-11-13 | SRS §5.1a, §5.7a, §9a, §9b: bổ sung tiêu chí chấp nhận đo được cho M1, M7 và toàn bộ 6 NFR. Làm rõ 10 tiêu chí còn mơ hồ ở M2–M6. Chuyển 5 mục `[Cần chốt]` thành `[Cần chốt → ADR-xx]`. SRS v0.1 → v0.2 | Yêu cầu Ngày 2 (Mạnh) + ADR-02, ADR-07, ADR-08 | Không thêm/bớt ID yêu cầu: `docs/requirements.csv` giữ 46 dòng (40 FR + 6 NFR); RTM-01 giữ nguyên danh sách yêu cầu; test case chưa viết nên không cần sửa |
| CHG-2026-11-13-03 | 2026-11-13 | **Đổi hướng đồ án.** Giảng viên không yêu cầu sinh viên tự xây dựng ứng dụng web. Toàn bộ testware cũ (SRS/TP/RTM v0.x của hệ thống tự xây, mã nguồn `client`/`server`) được archive vào `archive/2026-11-13-webapp-pivot/`. Viết mới: SRS-01 v1.0 (đặc tả yêu cầu **đích**, as-observed, 58 FR + 7 NFR), TP-01 v1.0, RTM-01 v1.0, bộ test case 226 ca. Đổi định danh ID từ `FR-M<n>-<nn>` của hệ thống cũ sang `FR-M<n>-<nn>` tái sử dụng theo module mới (M1–M7 giữ nguyên ý nghĩa module) | ADR-09, ADR-10, ADR-11, ADR-12, ADR-13 | `docs/requirements.csv` → 65 yêu cầu; RTM-01 viết lại, truy xuất 100%; test case mới trong `docs/testcases/`; `docs/PROGRESS.md` lịch 14 ngày tính lại từ 2026-11-13 |
| CHG-2026-11-14-01 | 2026-11-14 | **Sửa SRS-01 theo bằng chứng khảo sát giá (REF-01).** (a) `BR-03`: viết lại ngưỡng cân nặng của T3 theo từng dòng sản phẩm — trước đây mô tả 6 nhóm cố định, thực tế `Dog Bath` dùng `0-20 / 20-50 / over 50`, `tidy up` dùng `0-20 / 21-40 / 41-60 / 61-79 / 79+`, `Full Groom` dùng 7 nhóm. (b) `BR-12`: gỡ "phí lễ tân 52 USD" — danh mục API không có dịch vụ nào tên phí lễ tân; $52 là giá *Dog Bath 0-20lbs*. (c) Bổ sung `BR-17` (2 khoản phụ thu T3: `*HOLIDAY FEE*` $27, `Emergency appointment fee` $25) và `BR-18` (giá T1 tăng đơn điệu theo bậc cân nặng). (d) Mục 3.2: sửa "10 dịch vụ grooming + 4 dịch vụ nhuộm" → 4 combo + 6 dịch vụ lẻ, 3 dịch vụ nhuộm; ghi rõ bảng **không tách giá theo loài**. (e) Mục 3.3: sửa danh sách dịch vụ và giá T3 theo API. (f) Mục 3.4: sửa số bậc cân nặng, số dịch vụ lẻ, phụ thu biến thiên, thêm dòng phân biệt giá Chó/Mèo. (g) `FR-M3-02`: làm lại tiêu chí chấp nhận theo giá đo được từng site. (h) §7: sửa số dịch vụ T2 và T3 | REF-01 (`docs/reference/pricing-baseline.md`), bằng chứng `reports/raw/survey-T3-services.json` | SRS v1.0 → v1.1. `BR-03`, `BR-12` là ID quy tắc nghiệp vụ (không thuộc `requirements.csv`); `FR-M3-02` đã cập nhật `docs/requirements.csv` và dòng RTM tương ứng; **không thêm/bớt test case** — 226 ca giữ nguyên, truy xuất vẫn 100% |

Ghi chú quy trình: đây là khoản trống của bản nháp v0.1 được điền trong Ngày 1 theo yêu cầu "rà SRS §1–2 và hoàn thiện nếu thiếu", nên không phải thay đổi yêu cầu sau baseline. Mọi thay đổi sau ngày 3 vẫn phải đi qua CR như SRS §10.C.

Ghi chú CHG-2026-11-13-02: đây là thay đổi **trước baseline** (baseline v1.0 dự kiến ngày 3) nên không cần nhóm biểu quyết riêng; tuy nhiên các giá trị mặc định nêu trong ADR-07 và ADR-08 vẫn phải được nhóm xác nhận tại họp kick-off.

## Mẫu CR

```
CR-nn: <tiêu đề ngắn>
Ngày mở: <ISO> · Người đề xuất: <tên> · Người duyệt: Mạnh
Vấn đề: <mô tả mâu thuẫn/khoảng trống, dẫn chiếu mục SRS>
Yêu cầu liên quan: <FR/BR/NFR/UC>
Đề xuất: <thay đổi cụ thể>
Tác động: SRS mục nào · requirements.csv · RTM dòng nào · test case nào · test case mới cần thêm
Trạng thái: Chờ nhóm | Đã chấp nhận | Từ chối | Đã áp dụng
Quyết định của nhóm: <nội dung họp, ngày>
```

## Ứng viên đã kiểm chứng và đóng trong Inspection Ngày 3 (2026-11-18)

Nguồn: quan sát trực tiếp trên site đích (chỉ đọc, ADR-11). Bằng chứng máy: `reports/raw/survey-day03-open-cr.json`. Biên bản đầy đủ: `docs/reviews/inspection-srs.md`.

| Mã ứng viên | Vấn đề | Kiểm chứng | Quyết định |
|---|---|---|---|
| CR-10 | T1: công thức phụ thu di chuyển `max(0, km − 5) × 8.000₫` không nêu làm tròn và cách ước lượng km từ địa chỉ | Site hiển thị khoảng phụ thu theo dải km (0–5, 5–10, 10–15, >15 km) thay vì con số tính từ địa chỉ → công thức là mô hình lý thuyết trong SRS, không phải hành vi UI quan sát được | **Giữ nguyên SRS**; BR-04/BR-05 ghi rõ đây là quy tắc nghiệp vụ, tiêu chí chấp nhận kiểm tra theo dải km |
| CR-11 | T2: giá tính tức thì có khớp bảng giá tĩnh ở mọi ô không | **Đã kiểm chứng** — khớp ở các ô đo được (Chó, >3–6kg, Combo Tắm Vệ Sinh = 200.000₫) | **Đóng**; còn lại là việc thực thi test case `TC-T2-M3-011` (Ngày 11) |
| CR-16 | T2: giá Chó và Mèo cùng bậc cân nặng có khác nhau không | **Đã kiểm chứng** — bằng nhau (200.000₫ ở `>3–6kg`, 300.000₫ ở `>6–10kg`) | **Đóng** → `CHG-2026-11-14-02` đã áp dụng, xem RV-01 |
| CR-12 | T2: nhóm "báo giá riêng" hiển thị khoảng giá cụ thể hay chỉ "tuỳ thiết kế" | **Đã kiểm chứng** — hiển thị **cả hai**: khoảng 50.000–500.000₫ cho 4 dịch vụ (Gỡ rối, Tẩy ố, Tắm trắng, Xả dưỡng), "tuỳ thiết kế" cho 2 dịch vụ nhuộm; khung giá khi chọn "Gỡ rối" hiện "Báo giá riêng" không có con số đơn lẻ | **Đóng** — khớp `BR-07`/`FR-M3-04`, không phải defect. Xem RV-10 |
| CR-13 | T3: form đặt lịch nhập cân nặng theo lbs hay kg | **Đã kiểm chứng** — T3 **không có ô nhập cân nặng**; bậc cân nặng lbs mã hoá trong tên dịch vụ (16/16 dịch vụ nhóm "Dog (bath included)" có lbs trong tên); form chỉ có ô "Mobile number" + chọn quốc gia | **Đóng** — đơn vị **lbs**, BVA chọn *dịch vụ* theo bậc chứ không nhập cân nặng. Sửa §7 và `BR-03`. Xem RV-06 |
| CR-14 | T3: phí lễ tân 52 USD/30 phút gắn với dịch vụ nào | **Đã kiểm chứng 14/11** → không tồn tại | **Đóng** — đã sửa `BR-12` trong CHG-2026-11-14-01 |
| CR-15 | Ngưỡng "trong vòng 30 ngày" của FR-M4-05 có áp dụng đồng nhất cho T1/T3 không | **Đã kiểm chứng** — T1 và T3 không có ô ngày, không công bố ngưỡng 30 ngày; T2 có `min` = hôm nay nhưng `max` = null (nhập được ngày ở 60 ngày) | **Đóng** — giữ nguyên phạm vi T2 của `FR-M4-05`; điều chỉnh tiêu chí chấp nhận cho khớp thực tế. Xem RV-09 |

## Ứng viên chưa đề xuất (ghi để chuẩn bị Inspection Ngày 3)

Nguồn: quan sát ban đầu trên 3 site đích. Trạng thái hiện tại: **chưa kiểm chứng**; phải đọc lại SRS-01 rồi mới xác nhận mỗi mục và mở CR chính thức nếu đúng.

| Mã ứng viên | Vấn đề | Kiểm chứng |
|---|---|---|
| CR-10 | T1: công thức phụ thu di chuyển `max(0, km − 5) × 8.000₫` không nêu rõ làm tròn thế nào khi khoảng cách không nguyên, và không nêu cách ước lượng khoảng cách từ địa chỉ | Chờ Ngày 3 |
| CR-11 | T2: giá tính tức thì có khớp bảng giá tĩnh ở mọi ô hay không — quan sát mới xác nhận một ô (Chó, >3–6 kg, Combo Tắm Vệ Sinh = 200.000₫) | **Đã kiểm chứng 14/11** → khớp ở 3 ô đã đo. Cần Tài đối chiếu đủ ma trận 6 bậc × 2 loài × 3 dịch vụ (Ngày 2) |
| CR-16 | T2: giá Chó và Mèo ở cùng bậc cân nặng có khác nhau không — đo được là **bằng nhau** (200.000₫ ở `>3–6kg`, 300.000₫ ở `>6–10kg`), trong khi `FR-M3-02` yêu cầu khác nhau | **Đã kiểm chứng 14/11** → mở CHG-2026-11-14-02, chờ nhóm quyết định tại Inspection Ngày 3 |
| CR-12 | T2: nhóm "báo giá riêng" hiển thị khoảng giá cụ thể hay chỉ câu chữ "tuỳ thiết kế" — ảnh hưởng tiêu chí chấp nhận của FR-M3-04 | Chờ Ngày 3 |
| CR-13 | T3: bảng giá theo lbs nhưng form đặt lịch có nhập cân nặng bằng lbs hay kg — cần chốt đơn vị nhập để viết BVA | Chờ Ngày 3 |
| CR-14 | T3: phí lễ tân 52 USD/30 phút gắn với dịch vụ nào, có hiển thị trong bảng giá hay chỉ ở trang đặt lịch | **Đã kiểm chứng 14/11** → không tồn tại; đã sửa `BR-12` trong CHG-2026-11-14-01 |
| CR-15 | Cả 3 site: ngưỡng "trong vòng 30 ngày" của FR-M4-05 (chỉ ghi ở T2) có áp dụng đồng nhất cho T1 và T3 hay không | Chờ Ngày 3 |

---

## CHG-2026-11-21-01 — Bổ sung gói "Combo Tắm + Vệ sinh" vào dịch vụ tại nhà của T1

```
CR-nn:        Bổ sung "Combo Tắm + Vệ sinh" vào danh sách dịch vụ hỗ trợ tại nhà của T1
Ngày mở:      2026-11-21 · Người đề xuất: Tài (TV2) · Người duyệt: Mạnh (TV1)
Trạng thái:   Chờ Mạnh duyệt
```

### 1. Vấn đề

SRS-01 v1.2 §6 (`BR-06`) ghi:

> Phụ thu tại nhà cố định của T1: Tắm +50.000₫; Cạo +80.000₫; Combo Tắm+Cạo +100.000₫; **các gói khác không hỗ trợ tại nhà**

Và `FR-M6-03` (tiêu chí chấp nhận) liệt kê đúng 3 mức: "Tắm +50.000₫, Cạo +80.000₫, Combo Tắm+Cạo +100.000₫".

Khảo sát trực tiếp DOM trang `https://petngon.vn/vi` ngày 2026-11-21 cho thấy T1 thực tế có **4** dịch vụ hỗ trợ tại nhà, trong đó có gói mà SRS chưa ghi nhận:

| # | Dịch vụ | Nhãn tại nhà | Phụ thu tại nhà | Đã có trong BR-06? |
|---|---|---|---|---|
| 1 | Tắm | "Có tận nhà" | +50.000₫ | ✅ có |
| 2 | Cắt tỉa lông | "Chỉ tại spa" | — | ✅ có (không tại nhà) |
| 3 | Cạo lông | "Có tận nhà" | +80.000₫ | ✅ có |
| 4 | **Combo Tắm + Vệ sinh** | **"Có tận nhà"** | **+70.000₫** | ❌ **thiếu** |
| 5 | Combo Tắm + Cắt tỉa | "Chỉ tại spa" | — | ✅ có (không tại nhà) |
| 6 | Combo Tắm + Cạo | "Có tận nhà" | +100.000₫ | ✅ có |

Văn bản DOM thô (rút gọn, từ `reports/raw/survey-T1-cards.json`):

```
shower  home_work  Có tận nhà  Combo Tắm + Vệ sinh
  Tắm sạch toàn thân với sữa tắm chuyên dụng theo loại da, sấy khô, vệ sinh tai, cắt móng, làm sạch tuyến hôi.
  home_work  Phụ thu tận nhà: +70.000₫ (chưa gồm phí di chuyển)
  Chi tiết giá theo cân nặng — xem bảng bên dưới  Từ 130.000₫  60 phút
```

Các phát hiện đi kèm:

- `FR-M2-03` yêu cầu "0 dịch vụ thiếu nhãn" — nhãn của gói này là "Có tận nhà", nên **đang đúng**, nhưng `FR-M6-03` thì sai.
- `FR-M2-05` yêu cầu "100% gói tại nhà ghi rõ mức phụ thu cộng thêm bằng số (₫)" — gói này có ghi `+70.000₫` → **đang đúng**.
- Do `BR-06` là nguồn chuẩn cho cả `FR-M6-03` và `FR-M6-04`, mọi test case kiểm tra phụ thu tại nhà hiện đang **thiếu 1 dịch vụ** trong phạm vi.

### 2. Yêu cầu liên quan

`BR-06` (quy tắc nghiệp vụ) · `FR-M6-03` (Must) · `FR-M6-04` (Must) · `FR-M2-03` (Must) · `FR-M2-05` (Should)

### 3. Đề xuất

**(a) Sửa `BR-06`** — bỏ mệnh đề "các gói khác không hỗ trợ tại nhà" (vì sai) và ghi rõ đủ 4 gói:

> Phụ thu tại nhà cố định của T1: Tắm +50.000₫; Cạo +80.000₫; **Combo Tắm+Vệ sinh +70.000₫**; Combo Tắm+Cạo +100.000₫; chỉ Combo Tắm+Cắt tỉa là dịch vụ duy nhất không hỗ trợ tại nhà.

**(b) Sửa tiêu chí chấp nhận `FR-M6-03`** trong `docs/requirements.csv`:

> "Tắm +50.000₫, Cạo +80.000₫, **Combo Tắm+Vệ sinh +70.000₫**, Combo Tắm+Cạo +100.000₫"

**(c) Sửa mô tả `FR-M6-03`** (tên yêu cầu) để không còn hàm ý chỉ có 3 gói: "Cùng phụ thu cố định của gói tại nhà" → giữ nguyên, chỉ sửa tiêu chí (b).

**(d) Không cần sửa `FR-M2-03` / `FR-M2-05`** — đã khớp thực tế.

### 4. Tác động

| Hạng mục | Tác động |
|---|---|
| SRS §6 `BR-06` | Sửa 1 dòng. SRS-01 v1.2 → **v1.3** |
| `docs/requirements.csv` | Sửa tiêu chí chấp nhận của `FR-M6-03` (không đổi số dòng) |
| `docs/rtm.csv` / `docs/rtm.md` | Dòng `FR-M6-03` đổi tiêu chí → chạy `npm run rtm:build` để đồng bộ |
| Test case hiện có | `TC-T1-M6-011`, `TC-T1-M6-012`, `TC-T1-M6-013` đang kiểm tra 3 mức phụ thu → cần **bổ sung 1 ca** cho Combo Tắm+Vệ sinh +70.000₫ |
| Test case mới (đề xuất) | `TC-T1-M6-019` (FR-M6-03, Critical, DT) — "Gói Combo Tắm + Vệ sinh tại nhà công phụ thu cố định 70.000₫" (Owner: Tài) |
| Test case mới (đề xuất) | `TC-T1-M2-008` (FR-M2-03, High, UC) — "0 dịch vụ nào của T1 thiếu nhãn tại spa / tại nhà" (Owner: Tài) |
| Tổng số test case | 226 → **228** (sau khi Mạnh duyệt) |
| `docs/change-requests.md` | Dòng này (mục trạng thái chuyển sang "Đã áp dụng" khi được duyệt) |

### 5. Bằng chứng

| Tệp | Nội dung |
|---|---|
| `reports/raw/survey-T1-cards.json` | Dump DOM 6 thẻ dịch vụ T1, có nhãn + mức phụ thu tại nhà |
| `reports/raw/survey-T1-text.txt` (dòng 107–115) | Bản text thô: "Combo Tắm + Vệ sinh … Phụ thu tận nhà: +70.000₫" |
| `scripts/survey-t1-home-service.mjs` | Script tái lập khảo sát (chạy lại được bằng `node scripts/survey-t1-home-service.mjs`) |

Khảo sát tuân thủ ADR-11: chỉ GET trang công khai, không đăng nhập, không gửi form, không tạo dữ liệu.

### 6. Quyết định của nhóm

_(chờ Mạnh TV1 duyệt)_

### 7. Ghi chú thêm cho người duyệt

- Đây **không phải defect của site T1** — site hiển thị đúng và nhất quán. Đây là **sai lệch giữa đặc tả SRS và thực tế**, nên đi theo quy trình CR chứ không mở DEF.
- Quy trình: Mạnh duyệt → Tài sửa SRS §6 + `requirements.csv` → `npm run req:build && npm run rtm:build` → thêm 2 test case → `npm run rtm:check` xác nhận truy xuất vẫn 100%.
- Nếu nhóm quyết định **giữ nguyên BR-06** (coi như biến thể), cần mở 1 DEF mức Low ghi nhận sai lệch đặc tả và ghi vào `docs/reviews/inspection-srs.md` — đề nghị Mạnh chọn rõ 1 trong 2 hướng.
