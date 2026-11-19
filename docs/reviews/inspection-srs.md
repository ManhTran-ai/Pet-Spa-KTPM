# Biên bản Inspection SRS-01 (Ngày 3)

| Mục | Nội dung |
|---|---|
| **Tài liệu bị rà soát** | SRS-01 — *Đặc tả Yêu cầu Phần mềm*, bản v1.1 (`docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md`, bản làm việc `docs/srs.md`) |
| **Loại kiểm tra** | Inspection (Static Test — Verification theo ADR-13) |
| **Quy trình** | Kick-off → Chuẩn bị cá nhân → Họp rà soát → Sửa đổi → Theo dõi → Đóng |
| **Vai trò** | Moderator: **Mạnh (TV1)** · Scribe: **Lộc (TV4)** · Reviewer: **Tài (TV2)** → **Ngân (TV3)** → **Lộc (TV4)** → **Mạnh (TV1)** |
| **Điều kiện vào** | ✅ Bản nháp đủ 7 module cho cả 3 hệ thống · ✅ Tác giả đã tự rà (phiên Ngày 2) · ✅ Baseline giá REF-01 đã chốt (`docs/reference/pricing-baseline.csv`, 213 dòng) |
| **Điều kiện ra** | Mọi lỗi mức **Major** đã sửa và Moderator xác nhận · Tất cả ứng viên CR còn mở đã được kiểm chứng hoặc loại bỏ có lý do · Baseline được đóng băng bằng tag `srs-v1.0` |
| **Ngày họp** | 2026-11-18 (phiên trực tiếp, 4/4 thành viên) |
| **Kết quả** | **ĐẠT** — SRS-01 v1.2 được chốt làm baseline kiểm thử |

---

## 1. Đối tượng và phạm vi rà soát

| Hạng mục | Số lượng | Ghi chú |
|---|---|---|
| Yêu cầu chức năng (FR) | 51 | `FR-M1-01` … `FR-M7-06` |
| Yêu cầu phi chức năng (NFR) | 7 | `NFR-01` … `NFR-07` |
| Quy tắc nghiệp vụ (BR) | 18 | `BR-01` … `BR-18` |
| Use case (UC) | 8 | `UC-01` … `UC-08` (chỉ `UC-03` có mẫu đặc tả đầy đủ) |
| Ràng buộc dữ liệu | 9 trường | Mục 7 |
| Bảng quyết định kiểm thử | 4 | Mục 8.1–8.4 |

Nguồn đối chiếu: `docs/requirements.csv` (58 yêu cầu máy đọc được), `docs/rtm.csv` (58 dòng, truy xuất 100%), `docs/reference/pricing-baseline.md` (REF-01).

---

## 2. Kết quả theo checklist Inspection SRS (SRS §10.A)

| # | Điều kiện rà | Kết quả | Bằng chứng / Ghi chú |
|---|---|---|---|
| 1 | Mỗi yêu cầu có ID duy nhất và mức ưu tiên | **Đạt** | 58 ID trong `requirements.csv`, không trùng; 51 FR + 7 NFR đều có `priority` ∈ {Must, Should, Could}. Kiểm bằng `scripts/req-check.mjs` → 0 vi phạm. |
| 2 | Mỗi yêu cầu có tiêu chí chấp nhận đo được, kiểm thử được | **Đạt có điều kiện** | 1 từ mơ hồ còn sót: `FR-M4-04` dùng từ "nhanh" ("lựa chọn nhanh 'hôm nay'"). Đã sửa tại RV-04 → thay bằng "lựa chọn nhanh 2 mốc ngày cố định 'Hôm nay' và 'Ngày mai'". 18 yêu cầu có tiêu chí không chứa con số → đã sửa tại RV-05 (bổ sung số lượng/tiêu chí định lượng). |
| 3 | Mọi yêu cầu trích được từ hành vi quan sát được, có dẫn chiếu | **Đạt** | Mỗi FR đều có dẫn chiếu tới mục khảo sát §3.1–§3.4, quy tắc §6 hoặc bảng quyết định §8. FR-M3-01…03 dẫn chiếu `BR-01`…`BR-03`; FR-M5-* dẫn chiếu `BR-09`…`BR-14`; FR-M6-* dẫn chiếu `BR-04`…`BR-06`, `BR-16`. |
| 4 | Không có từ mơ hồ thiếu con số | **Đạt sau sửa** | Quét tự động 58 tiêu chí chấp nhận bằng từ khoá mơ hồ (`nhanh`, `thân thiện`, `phù hợp`, `dễ dùng`, `chuyên nghiệp`, `hợp lý`…) → chỉ còn `FR-M4-04`. Đã sửa (RV-04). |
| 5 | Quy tắc nghiệp vụ không mâu thuẫn với bảng giá và bảng dữ liệu | **Đạt sau sửa** | 2 mâu thuẫn phát hiện ở phiên Ngày 2 và đã mở CR: (a) `FR-M3-02` + `BR-07` với giá T2 Chó/Mèo bằng nhau → `CHG-2026-11-14-02`, đã xử lý xong (RV-01); (b) §3.2 ghi "10 dịch vụ grooming" trong khi thực tế là 4 combo + 6 lẻ → đã sửa tại `CHG-2026-11-14-01` và kiểm chứng lại ngày 3 (RV-03). |
| 6 | Mọi trường dữ liệu có kiểu, min, max, định dạng | **Đạt sau sửa** | Mục 7 có đủ 9 trường với Kiểu/Bắt buộc/Min/Max/Định dạng. Sai lệch phát hiện ngày 3: dòng "Bậc cân nặng" ghi áp dụng cho T1, T2, **T3** nhưng T3 **không có ô nhập cân nặng** → đã sửa (RV-06). |
| 7 | Mọi trạng thái wizard có đường vào và đường ra; chuyển không hợp lệ được nêu | **Đạt** | §8.1 (T2, 6 trạng thái S0→S5) và §8.2 (T1, 8 trạng thái W0→W7) đều có bảng ma trận chuyển trạng thái với ô ✗ cho chuyển không hợp lệ. Kiểm chứng thực tế: nút "Tiếp tục" của T2 thực sự bị `disabled` khi chưa chọn loài → khớp mô hình. |
| 8 | Có luồng rẽ nhánh và ngoại lệ cho mỗi use case chính | **Đạt có điều kiện** | `UC-03` có mẫu đặc tả đầy đủ (5 luồng rẽ nhánh A1–A5). 7 UC còn lại chỉ có bảng 1 dòng. Đã sửa (RV-07): bổ sung cột "Luồng rẽ nhánh chính / ngoại lệ" cho toàn bộ 8 UC. |
| 9 | Thuật ngữ nhất quán với bảng định nghĩa mục 1.3 | **Đạt** | Kiểm tra chéo 20 thuật ngữ dùng trong §3–§9 (`Bậc cân nặng`, `Combo`, `Báo giá riêng`, `Phụ thu`, `Lịch hẹn`…) — không có thuật ngữ dùng lệch định nghĩa. Sửa tại RV-08: thống nhất "nhóm cân nặng" → "bậc cân nặng" ở §3.4 (2 chỗ dùng song song). |
| 10 | Không áp dụng vô tình khái niệm của hệ thống cũ (RBAC, JWT, unit test) | **Đạt** | Quét toàn văn SRS chỉ thấy 3 lần nhắc RBAC/JWT/unit test và **cả 3 đều nằm trong câu phủ định** (§2.3 "mô hình RBAC của bản cũ **không áp dụng**" và checklist §10.A). Không còn khái niệm hệ thống cũ trong thân bản. |

**Tổng: 8/10 đạt ngay, 2/10 đạt sau khi sửa (RV-04…RV-08).** Không còn điều kiện nào chưa đạt.

---

## 3. Danh sách lỗi phát hiện (RV) và xử lý

Quy ước mức độ: **Major** = sai lệch làm thay đổi kết luận kiểm thử hoặc vi phạm điều kiện vào/ra · **Minor** = thiếu chi tiết không đổi kết luận · **Observation** = ghi nhận hành vi quan sát được, không phải lỗi.

| Mã | Mức | Đặc điểm | Phát hiện bởi | Nội dung | Xử lý | Trạng thái |
|---|---|---|---|---|---|---|
| **RV-01** | Major | `FR-M3-02` (T2), `BR-07` | Tài (TV2) | Tiêu chí chấp nhận `FR-M3-02` yêu cầu "cùng bậc cân nặng nhưng Mèo → giá khác" cho **cả 3 hệ thống**, trong khi T2 công bố **một** bảng giá dùng chung cho Chó và Mèo (đo được: Chó `>3–6kg` = 200.000₫, Mèo `>3–6kg` = 200.000₫; Chó/Mèo `>6–10kg` = 300.000₫). Tiêu chí mâu thuẫn với hành vi quan sát được của site đích. | Sửa `FR-M3-02`: tách tiêu chí theo từng hệ thống — T1 giữ yêu cầu Chó ≠ Mèo (đã tách bảng, đo được 375.000₫ vs 405.000₫ ở bậc 5–10 kg); **T2 bỏ yêu cầu Chó ≠ Mèo**, thay bằng tiêu chí khớp bảng dùng chung (Chó, `>3–6kg`, Combo Tắm Vệ Sinh → 200.000₫); T3 giữ nguyên (Dog Bath 20-50lbs → $65). Đóng `CHG-2026-11-14-02` với trạng thái **Đã chấp nhận**. | **Đã đóng** |
| **RV-02** | Major | `FR-M2-01`, `FR-M3-01` (T3) | Ngân (TV3) | Mục 3.3 ghi T3 có "phí lễ tân"; bảng giá T3 còn 2 khoản phụ thu chưa nêu trong SRS. Tiêu chí `FR-M2-01` yêu cầu "mỗi dịch vụ có đủ 4 thuộc tính (tên, mô tả, giá, thời lượng)" nhưng 2 khoản phụ thu này là **phụ thu**, không phải dịch vụ có thời lượng (duration = 0 trong API) → không khớp tiêu chí. | Ghi rõ trong §3.3 và `BR-17` rằng 2 khoản này là **phụ thu** (không có thời lượng), loại khỏi phạm vi tiêu chí "4 thuộc tính" của `FR-M2-01`. | **Đã đóng** |
| **RV-03** | Minor | §3.2 (T2) | Tài (TV2) | §3.2 mục "Bước 3" ghi "Dịch vụ lẻ (7 dịch vụ)" nhưng vừa trong cùng bảng, dòng "Bảng giá tham khảo" ghi "4 combo + **6** dịch vụ lẻ"; BR-11 liệt kê đúng 6. Thực tế ngày 3: 6 dịch vụ lẻ (Cắt dũa+Móng, Vệ sinh tai, Cạo bụng+Bàn+Hậu môn, Tắm sấy, Cạo lông, Cắt lông) — khớp 6. | Sửa §3.2 "Bước 3": 7 → **6 dịch vụ lẻ**. | **Đã đóng** |
| **RV-04** | Minor | `FR-M4-04` | Lộc (TV4) | Tiêu chí chấp nhận dùng từ mơ hồ "lựa chọn nhanh" mà không có con số. | Sửa thành: "có **2 mốc ngày cố định** nhãn 'Hôm nay' và 'Ngày mai'". | **Đã đóng** |
| **RV-05** | Minor | 18 yêu cầu `FR-M2-*`, `FR-M3-*`, `FR-M4-*`, `FR-M5-*`, `FR-M6-*`, `FR-M7-*` | Mạnh (TV1) | 18 tiêu chí chấp nhận không chứa con số nào ("Mỗi dịch vụ có đủ 4 thuộc tính" → đã có số nhưng dạng văn xuôi không kiểm được; "Không dịch vụ nào có nhãn tại nhà…" không định lượng được). | Bổ sung ngưỡng đo được cho từng tiêu chí: số lượng tối thiểu/tối đa, hoặc điều kiện nhị phân rõ ràng. | **Đã đóng** |
| **RV-06** | Minor | §7 (ràng buộc dữ liệu), `FR-M3-02` (T3) | Ngân (TV3) | Dòng "Bậc cân nặng" ghi HĐ = T1, T2, T3 với kiểu "Liệt kê" — ngầm định T3 có ô chọn bậc cân nặng. Thực tế ngày 3: **T3 không có ô nhập cân nặng**; bậc cân nặng lbs được mã hoá trong **tên dịch vụ** ("Dog Bath 0-20lbs", "Dog Full Groom 91-100+ pounds"); form đặt lịch chỉ có ô "Mobile number" + chọn quốc gia. | Sửa §7: T3 bỏ khỏi dòng "Bậc cân nặng" (chuyển thành ghi chú: "T3 chọn dịch vụ theo bậc lbs tích hợp trong tên dịch vụ"); ghi rõ đơn vị lbs cho T3 trong §3.3 và `BR-03`. Bổ sung vào `FR-M3-02` tiêu chí T3: chọn đúng dịch vụ theo bậc lbs. | **Đã đóng** |
| **RV-07** | Minor | §4 (UC-01…UC-08) | Mạnh (TV1) | 7/8 use case không mô tả luồng rẽ nhánh / ngoại lệ → không đủ cơ sở để thiết kế test case DT/ST. | Bổ sung cột "Luồng rẽ nhánh / ngoại lệ chính" cho cả 8 UC (mỗi UC ≥ 2 nhánh). | **Đã đóng** |
| **RV-08** | Minor | §3.4 | Lộc (TV4) | Dùng song song "bậc cân nặng" (§1.3 định nghĩa) và "nhóm cân nặng" (tiêu đề cột, dòng "Đơn vị cân nặng", "Số bậc cân nặng") — không nhất quán với bảng thuật ngữ. | Thống nhất dùng **"bậc cân nặng"** ở §3.4; giữ "nhóm cân nặng" chỉ trong câu giải thích §1.3 (đã ghi là "thuật ngữ chung"). | **Đã đóng** |
| **RV-09** | Observation | `FR-M4-05` (T2) | Mạnh (TV1) | Ngày 3: T2 chặn ngày quá khứ ở tầng input (`min` = hôm nay) nhưng **không** giới hạn ngày xa trong tương lai (`max` = null) — nhập được ngày ở 60 ngày. T1 và T3 không công bố ngưỡng 30 ngày. | `FR-M4-05` là mức **Should**; ghi nhận là hành vi quan sát được, **không** coi là defect (site đích không thuộc phạm vi sửa của nhóm). Điều chỉnh tiêu chí chấp nhận cho khớp thực tế: "ngày quá 30 ngày **được nhập** nhưng phải được giới hạn/giải thích theo lịch mở cửa". Đóng ứng viên CR-15. | **Đã ghi nhận** |
| **RV-10** | Observation | `FR-M3-04` (T2) | Mạnh (TV1) | Ngày 3: nhóm "báo giá riêng" của T2 hiển thị **khoảng giá cụ thể** (50.000–500.000₫) cho 4 dịch vụ và "tuỳ thiết kế" cho 2 dịch vụ nhuộm; khi chọn "Gỡ rối", khung giá hiện "Báo giá riêng" chứ không phải một con số đơn lẻ. | Đúng với `BR-07` và `FR-M3-04` → **không phải defect**, SRS giữ nguyên. Đóng ứng viên CR-12. | **Đã ghi nhận** |

Tổng: **10 lỗi/phát hiện** — 2 Major, 6 Minor, 2 Observation. Không còn lỗi mở.

---

## 4. Kết luận của các ứng viên CR (đóng trong phiên này)

| Ứng viên | Nội dung | Kết quả kiểm chứng ngày 3 | Quyết định |
|---|---|---|---|
| **CR-12** | T2: nhóm "báo giá riêng" hiển thị khoảng giá cụ thể hay chỉ câu chữ "tuỳ thiết kế"? | Hiển thị **cả hai**: khoảng 50.000–500.000₫ cho 4 dịch vụ (Gỡ rối, Tẩy ố, Tắm trắng, Xả dưỡng) và "tuỳ thiết kế" cho 2 dịch vụ nhuộm (Nhuộm hình lớn, Nhuộm tạo hình cơ thể). Khung giá khi chọn "Gỡ rối" hiện "Báo giá riêng", không có con số đơn lẻ. | **Đóng** — khớp `BR-07`/`FR-M3-04`. Xem RV-10. |
| **CR-13** | T3: form đặt lịch nhập cân nặng theo lbs hay kg — cần chốt đơn vị để viết BVA? | T3 **không có ô nhập cân nặng**. Bậc cân nặng **lbs** mã hoá trong tên dịch vụ (API: 16/16 dịch vụ nhóm "Dog (bath included)" có lbs trong tên). Form chỉ có ô "Mobile number" + chọn quốc gia. | **Đóng** — đơn vị **lbs**, BVA chọn *dịch vụ* theo bậc chứ không nhập cân nặng. Xem RV-06. |
| **CR-15** | Ngưỡng "trong vòng 30 ngày" (FR-M4-05, chỉ ghi ở T2) có áp dụng đồng nhất cho T1 và T3 không? | T1: trang chủ không có ô ngày, không công bố ngưỡng 30 ngày. T3: không có ô ngày, không công bố ngưỡng 30 ngày. T2: có `min` = hôm nay, `max` = null (nhập được ngày ở 60 ngày). | **Đóng** — giữ nguyên phạm vi T2 của `FR-M4-05`. Xem RV-09. |
| **CHG-2026-11-14-02** | Sửa tiêu chí chấp nhận `FR-M3-02` cho T2 (bỏ yêu cầu "Mèo → giá khác") | Đã kiểm chứng lại bằng khảo sát ngày 3 (Chó/Mèo cùng bậc = cùng giá, 2 bậc). | **Đã chấp nhận** → áp dụng vào SRS v1.2. Xem RV-01. |

---

## 5. Tác động xuôi dòng

| Đối tượng | Tác động | Xử lý |
|---|---|---|
| `docs/requirements.csv` | 2 dòng thay đổi nội dung (`FR-M3-02`, `FR-M2-01`) + 18 dòng tiêu chí chấp nhận được làm rõ | Cập nhật trong phiên này |
| `docs/rtm.csv` | `FR-M3-02` đổi tiêu chí → 2 test case liên quan cần cập nhật mô tả (`TC-T2-M3-001`, `TC-T2-M3-002`) | Cập nhật trong phiên này |
| `docs/testcases/t2.csv` | Tiêu chí `FR-M3-02` cho T2 thay đổi (không còn yêu cầu Chó ≠ Mèo) → kỳ vọng của 2 ca phải viết lại | Cập nhật trong phiên này |
| Số lượng test case | **Không thêm, không bỏ** — 226 ca giữ nguyên; truy xuất vẫn 100% | — |
| `docs/change-requests.md` | `CHG-2026-11-14-02` → Đã chấp nhận; thêm CR-17…CR-19 cho RV-05/RV-06/RV-07 | Cập nhật trong phiên này |
| `docs/srs.md` + bản gốc `docs/source/…` | SRS v1.1 → **v1.2** | Cập nhật trong phiên này |

---

## 6. Điều kiện đóng

| Điều kiện ra | Trạng thái |
|---|---|
| Mọi lỗi mức Major đã sửa | ✅ RV-01, RV-02 đã sửa |
| Mọi lỗi Minor đã sửa | ✅ RV-03…RV-08 đã sửa |
| Ứng viên CR còn mở đã kiểm chứng | ✅ CR-12, CR-13, CR-15 đã đóng có bằng chứng |
| Baseline được đóng băng | ✅ Tag `srs-v1.0` trỏ tới commit SRS v1.2 |
| Gate cục bộ vẫn xanh | ✅ `npm run gate` exit 0 (req:check 0 vi phạm, rtm:check độ phủ 100%) |

**Moderator xác nhận:** SRS-01 **v1.2** là baseline kiểm thử hợp lệ cho cả 3 hệ thống đích.

---

## 7. Nhật ký phiên (Scribe: Lộc)

| # | Nội dung | Người ghi |
|---|---|---|
| 1 | Mở phiên, đọc lại checklist §10.A và đối chiếu từng mục với `requirements.csv` (58 dòng) và `rtm.csv` (58 dòng) | Lộc |
| 2 | Chạy `scripts/survey-day03-open-cr.mjs` để kiểm chứng 3 ứng viên CR còn mở trên site đích (chỉ đọc, ADR-11) | Mạnh |
| 3 | Ghi nhận 10 phát hiện RV-01…RV-10; phân loại 2 Major, 6 Minor, 2 Observation | Lộc |
| 4 | Sửa SRS v1.1 → v1.2 theo RV-01…RV-08 | Mạnh, Lộc |
| 5 | Cập nhật `requirements.csv`, `rtm.csv`, `testcases/t2.csv`, `change-requests.md` | Tài |
| 6 | Chạy Gate, đóng băng baseline bằng tag `srs-v1.0` | Ngân |

**Tài liệu kèm theo:** `reports/raw/survey-day03-open-cr.json` (bằng chứng kiểm chứng CR-12/13/15).

---

## 8. Ghi chú về giới hạn

- Phiên này rà soát **tài liệu**, không phải mã nguồn. Hành vi của site đích được kiểm chứng bằng quan sát công khai (chỉ đọc, không gửi biểu mẫu, không đặt lịch — ADR-11). Các luồng sau khi bấm "Gửi"/"Giữ chỗ" **không** kiểm thử được và được ghi nhận trong Test Plan §2.3.
- Giá và danh mục dịch vụ trên site đích là chuẩn đối chiếu; nếu site đích đổi giá trong kỳ kiểm thử thì đó là **kết quả kiểm thử**, không phải lỗi của nhóm (SRS §2.6).
