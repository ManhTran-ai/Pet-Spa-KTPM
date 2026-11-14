# Change Requests (CR)

Đối tượng: Kiểm thử ba hệ thống web Pet Spa (T1 Pet NGON, T2 Mật Pet Family, T3 Pretty Paws) · Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Nguyên tắc (SRS-01 §13): mọi thay đổi SRS đích sau baseline ngày 3 phải có CR, tăng phiên bản SRS, và cập nhật `docs/requirements.csv`, RTM và test case liên quan trong vòng 1 ngày; Mạnh duyệt.

Trạng thái CR: `Chờ nhóm` | `Đã chấp nhận` | `Từ chối` | `Đã áp dụng`.

| CR | Ngày mở | Người đề xuất | Tiêu đề | Yêu cầu liên quan | Trạng thái | Ghi chú |
|---|---|---|---|---|---|---|
| CHG-2026-11-13-01 | 2026-11-13 | Mạnh | Chốt CSDL trong §2.4 là PostgreSQL + Prisma | Mục 2.4 (không có ID yêu cầu) | Đã áp dụng | Theo ADR-01; ghi chú ngay dưới §2.4 trong `docs/srs.md`; không ảnh hưởng FR/NFR nên không cần cập nhật RTM |
| CHG-2026-11-13-03 | 2026-11-13 | Mạnh | Đổi hướng đồ án: kiểm thử 3 hệ thống web đang vận hành thay vì tự xây hệ thống | Toàn bộ FR/NFR (SRS-01 v1.0 mới) | Đã áp dụng | Theo ADR-09..ADR-13; mốc 14 ngày tính lại từ 2026-11-13; bộ testware cũ archive |
| CHG-2026-11-14-01 | 2026-11-14 | Mạnh | Sửa SRS-01 theo khảo sát giá REF-01: `BR-03`, `BR-12`, `FR-M3-02`, mục 3.2/3.3/3.4; bổ sung `BR-17`, `BR-18` | FR-M3-02, BR-03, BR-12 | Đã áp dụng | SRS v1.0 → v1.1; căn cứ `docs/reference/pricing-baseline.md` §3.4, §4.1 |
| CHG-2026-11-14-02 | 2026-11-14 | Mạnh | Sửa tiêu chí chấp nhận `FR-M3-02` cho T2: bỏ yêu cầu "cùng bậc cân nặng nhưng Mèo → giá khác" | FR-M3-02 | **Chờ nhóm** | T2 công bố **một** bảng giá dùng chung cho Chó và Mèo; đo được giá bằng nhau ở 2 bậc. Cần nhóm quyết định: coi là lỗi site T2, hay coi tiêu chí cũ là suy luận sai |

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
