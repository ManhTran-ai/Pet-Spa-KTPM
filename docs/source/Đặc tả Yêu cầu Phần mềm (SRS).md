# Đặc tả Yêu cầu Phần mềm (SRS) — Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa

| Phiên bản | Ngày | Tác giả | Thay đổi |
|---|---|---|---|
| 0.1 | Ngày 1–2 | Cả nhóm | Khung SRS cho ứng dụng do nhóm tự xây (đã archive) |
| 0.2 | Ngày 2 | Mạnh | Bổ sung tiêu chí chấp nhận đo được cho M1, M7 và toàn bộ NFR (đã archive) |
| **1.0** | **Ngày 3** | **Mạnh** | **Baseline mới: đặc tả yêu cầu ĐÍCH (as-is) của 3 hệ thống pet spa có sẵn, theo hướng kiểm thử hệ thống có sẵn** |
| 1.1 | Ngày 2 | Mạnh | Sửa mục 3.2, 3.3, 3.4, `BR-03`, `BR-12` và `FR-M3-02` theo khảo sát giá REF-01; bổ sung `BR-17`, `BR-18` |
| **1.2** | **Ngày 3** | **Mạnh** | **Baseline sau Inspection (biên bản `docs/reviews/inspection-srs.md`): sửa theo RV-01…RV-08 — `FR-M3-02` (T2), `FR-M2-01` (T3), `FR-M4-04`, §3.2, §3.4, §4 (cột luồng rẽ nhánh), §7 (bậc cân nặng T3); bổ sung tiêu chí chấp nhận định lượng cho 18 yêu cầu** |
| **1.3** | **Ngày 8** | **Mạnh** | **Baseline sau Inspection bộ test case (`docs/reviews/testcase-inspection.md`, CR `CHG-2026-11-19-01`): reconcile phạm vi hệ thống (HĐ) của 9 yêu cầu giữa §4 và §5 — `FR-M5-04` +T1, `FR-M4-06` +T2, `FR-M4-01/02/03/07/08` +T3, `FR-M3-06` +T3; `FR-M7-03` ghi rõ loại trừ T3 (chỉ tiếng Anh)** |

> **Hướng tài liệu (quan trọng).** Tài liệu này **không** đặc tả một hệ thống để nhóm xây. Nó đặc tả **ba hệ thống web đang vận hành thật** mà nhóm sẽ kiểm thử: T1 Pet NGON, T2 Mật Pet Family, T3 Pretty Paws. Mọi yêu cầu ở đây là **yêu cầu đích** — hệ thống thật *đang* làm vậy, và ta kiểm tra xem nó có làm đúng, đầy đủ và nhất quán không. Yêu cầu được trích xuất bằng quan sát hành vi thực tế (đọc trang, tương tác form, theo dõi lưu lượng mạng). Đây là **test basis** cho Test Plan, RTM và test case.

> **Đáp ứng yêu cầu Hướng 2 của đồ án** — *"Thiết kế và kiểm thử cho một phần mềm đang hoạt động, các bạn phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử"* (ADR-15).
> Tài liệu này là **đầu ra của yêu cầu H2-1**: mô tả chi tiết lại toàn bộ yêu cầu và tính năng của 3 hệ thống đích mà nhóm kiểm thử. Nó **được nhóm tự trích xuất từ quan sát hành vi thực tế** — không có bản đặc tả gốc nào do chủ hệ thống cung cấp — nên đây là **đặc tả đích (as-is)**, đồng thời là **test basis** cho Test Plan, RTM và 226 test case.

---

## 1. Giới thiệu

### 1.1 Mục đích

Tài liệu mô tả yêu cầu chức năng, phi chức năng, quy tắc nghiệp vụ và ràng buộc dữ liệu của ba hệ thống đặt lịch dịch vụ chăm sóc thú cưng. Đây là căn cứ (test basis) để thiết kế test case, truy vết bằng RTM, và kiểm thử hệ thống/chấp nhận theo mô hình chữ V, không phụ thuộc mã nguồn của hệ thống đích.

Về mặt phương pháp, tài liệu thực hiện yêu cầu **H2-1** của Hướng 2 đồ án: *mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử*. Vì không tiếp cận được mã nguồn và không có đặc tả gốc từ chủ hệ thống, mọi yêu cầu trong tài liệu đều **được nhóm trích xuất từ hành vi quan sát được** trên bản production, sau đó được kiểm chứng lại qua Inspection (§10.A) và định lượng hoá thành tiêu chí chấp nhận đo được.

### 1.2 Phạm vi

| Mã | Hệ thống đích | URL | Phạm vi kiểm thử |
|---|---|---|---|
| **T1** | Pet NGON — Spa & Grooming Tận Nhà | `https://petngon.vn/vi` | Trang chủ: danh mục 6 gói, bảng giá 7 nhóm cân nặng × chó/mèo, modal đặt lịch 4 bước, phụ thu di chuyển theo km, FAQ, đa ngôn ngữ |
| **T2** | Mật Pet Family | `https://matpet.vn/spa` | Trang spa: calculator giá 3 bước, dịch vụ combo + lẻ + "báo giá riêng", form giữ chỗ (SĐT/tên/ngày), bảng giá tham khảo, tìm kiếm, đa ngôn ngữ Việt/Anh |
| **T3** | Pretty Paws Cat and Dog Grooming | `https://prettypawscatanddoggrooming.groomore.com/` | Trang booking Groomore: danh mục dịch vụ theo nhóm cân nặng (lbs), phí lễ tân, giờ mở cửa, luồng Book Now |

**Ngoài phạm vi:** hệ thống nội bộ quản lý lịch của tiệm (không truy cập được), thanh toán thực, ứng dụng di động native, hệ thống nhắn tin Zalo/SMS, backend API không công bố, hệ thống của nhóm cũ (đã archive, không còn là đối tượng kiểm thử).

### 1.3 Định nghĩa và viết tắt

| Thuật ngữ | Giải thích |
|---|---|
| T1 / T2 / T3 | Ba hệ thống đích (xem mục 1.2) |
| HĐ | Hệ thống đích đang được kiểm thử |
| Bậc cân nặng | Khoảng cân nặng dùng để tra bảng giá; mỗi hệ thống có bậc riêng |
| Nhóm cân nặng | Thuật ngữ chung cho bậc cân nặng, dùng khi so sánh giữa T1/T2/T3 |
| Tắm | Gói tắm vệ sinh cơ bản |
| Cắt tỉa | Gói cắt tỉa lông theo giống |
| Cạo | Gói cạo lông toàn thân |
| Combo | Gói trọn gói gộp nhiều dịch vụ |
| Báo giá riêng | Dịch vụ không có giá cố định, giá tính sau khi spa kiểm tra tình trạng lông |
| Phụ thu | Khoản phí cộng thêm (di chuyển, tận nhà, lễ tân, ngày lễ) |
| Lịch hẹn | Một lượt đặt dịch vụ cho một thú cưng tại một thời điểm |
| FR / NFR / BR / UC | Yêu cầu chức năng / phi chức năng / quy tắc nghiệp vụ / use case |
| RTM | Ma trận truy xuất yêu cầu – test case |
| KT | Kiểm thử |

### 1.4 Tài liệu tham chiếu

- Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm (`docs/source/Cẩm nang ... .md`)
- ISTQB CTFL; IEEE 829/830
- Kế hoạch 14 ngày (`docs/source/Hệ thống Đặt lịch ... .md`), Test Plan (TP-01), RTM (RTM-01)
- Trang đích: petngon.vn/vi, matpet.vn/spa, prettypawscatanddoggrooming.groomore.com

### 1.5 Cấu trúc tài liệu

Mục 2 tổng quan; mục 3 khảo sát đối tượng; mục 4 use case; mục 5 yêu cầu chức năng theo module; mục 6 quy tắc nghiệp vụ; mục 7 ràng buộc dữ liệu; mục 8 vòng đời và chính sách lịch; mục 9 yêu cầu phi chức năng; mục 10 phụ lục.

---

## 2. Mô tả tổng quan

### 2.1 Bối cảnh sản phẩm

Ba hệ thống đều là website marketing + đặt lịch của tiệm spa thú cưng, hướng đến chủ thú cưng là người dùng cuối. Mô hình chung: khách xem dịch vụ và bảng giá → chọn loài/cân nặng/dịch vụ để xem giá → điền thông tin liên hệ → giữ chỗ → nhân viên gọi xác nhận. Không hệ thống nào có tài khoản khách hàng bắt buộc để đặt lịch; không hệ thống nào có thanh toán trực tuyến bắt buộc.

### 2.2 Ba module chức năng nghiệp vụ và cách phân bổ giữa các hệ thống

| Mã | Module | T1 | T2 | T3 |
|---|---|---|---|---|
| M1 | Truy cập, điều hướng, thông tin cơ bản | ✓ | ✓ | ✓ |
| M2 | Danh mục dịch vụ | ✓ | ✓ | ✓ |
| M3 | Bảng giá theo cân nặng, tính giá | ✓ | ✓ | ✓ |
| M4 | Form giữ chỗ / đặt lịch | ✓ | ✓ | ✓ |
| M5 | Vòng đời lịch hẹn và chính sách | ✓ | ✓ | ✓ |
| M6 | Dịch vụ tận nhà và phụ thu di chuyển | ✓ | — | — |
| M7 | Tìm kiếm, ngôn ngữ, nội dung, liên kết ngoài | ✓ | ✓ | ✓ |

### 2.3 Người dùng và quyền

| Vai trò | Mô tả | Quyền thực tế trên hệ thống đích |
|---|---|---|
| Khách vãng lai | Chưa đăng nhập (không hệ thống nào bắt buộc) | Xem dịch vụ, xem bảng giá, dùng calculator giá, giữ chỗ, tìm kiếm, đổi ngôn ngữ |
| Chủ thú cưng (KH) | Người điền thông tin giữ chỗ | Nhận xác nhận qua điện thoại/Zalo; theo dõi lịch qua kênh liên hệ của tiệm |

Không có vai trò nhân viên hay quản trị trên giao diện công khai của cả 3 hệ thống — đây là khác biệt quan trọng so với bản SRS cũ, và là lý do mô hình RBAC của bản cũ **không áp dụng**.

### 2.4 Môi trường vận hành

- T1, T2: website responsive, ngôn ngữ Việt (T1, T2 có thêm bản tiếng Anh), chạy trên Chrome, Firefox, Edge, Safari, trình duyệt di động.
- T3: ứng dụng SaaS Groomore, tiếng Anh, chạy trên trình duyệt để bàn và di động, hỗ trợ đặt lịch 24/7.
- Mọi hệ thống đều có HTTPS.

### 2.5 Ràng buộc dự án

14 ngày, 4 thành viên. Chỉ kiểm thử không phá hại (ADR-11): không đặt lịch thật, không đăng ký tài khoản thật, không gửi payload phá hại. Không có môi trường staging do nhóm kiểm soát — mọi kiểm thử diễn ra trên môi trường production của chủ site.

### 2.6 Giả định và phụ thuộc

- Dữ liệu giá và danh mục dịch vụ trên site đích là chuẩn để đối chiếu; nếu site đích đổi giá trong kỳ kiểm thử thì đó là **kết quả kiểm thử** (thay đổi không thông báo) chứ không phải lỗi của nhóm.
- Không suy ra quy tắc nghiệp vụ nào mà quan sát không thấy. Mọi suy luận ghi rõ là **suy luận** và cần nhóm xác nhận.
- Chính sách hủy/đổi lịch thường nằm ở trang FAQ hoặc trang liên hệ, không nằm trong form — kiểm thử phải xác nhận khả năng tìm thấy, không chỉ hành vi.

---

## 3. Khảo sát đối tượng kiểm thử

### 3.1 T1 — Pet NGON (`petngon.vn/vi`)

| Hạng mục | Quan sát |
|---|---|
| Công nghệ | Next.js, render phía server |
| Kết nối chính | Bảng giá theo cân nặng + modal đặt lịch 4 bước + FAQ accordion + phụ thu theo km |
| Giá | 6 gói (Tắm, Cắt tỉa, Cạo, Combo Tắm+Vệ sinh, Combo Tắm+Cắt tỉa, Combo Tắm+Cạo); 7 nhóm cân nặng chó và mèo; mỗi gói có mức "Từ ...₫" và khoảng min–max |
| Cân nặng (chó) | `<3`, `3–5`, `5–10`, `10–15`, `15–20`, `20–25`, `25–30` kg |
| Cân nặng (mèo) | `≤3`, `3–5`, `5–10`, `10–15`, `15–20`, `20–25`, `25–30` kg |
| Tận nhà | Tắm (+50.000₫), Cạo (+80.000₫), Combo Tắm+Cạo (+100.000₫); Cắt tỉa và Combo Tắm+Cắt tỉa chỉ tại spa |
| Phụ thu di chuyển | `max(0, km − 5) × 8.000₫`; 5 km đầu miễn phí; trên 15 km "liên hệ báo giá riêng" |
| Quy trình | 4 bước: chọn dịch vụ → đặt lịch (loài + cân nặng + ngày giờ) → tại spa hoặc tại nhà → xác nhận & thanh toán; xác nhận trong 5 phút qua Zalo |
| Giờ mở cửa | 07:00–22:00 (trang liên hệ); trang blog ghi "đến trong 60' nội thành" |
| Ngôn ngữ | Có chuyển đổi Việt/Anh |
| Nội dung khác | Blog, tuyển dụng, thú cưng bị bỏ rơi, đánh giá khách hàng, điều khoản "Có thể đổi/huỷ lịch không?" (accordion) |

### 3.2 T2 — Mật Pet Family (`matpet.vn/spa`)

| Hạng mục | Quan sát |
|---|---|
| Công nghệ | WordPress, giao diện tự xây trên theme có sẵn |
| Kết nối chính | Calculator giá 3 bước + form giữ chỗ + bảng giá tham khảo + tìm kiếm toàn site |
| Bước 1 | Chọn loài: Chó / Mèo |
| Bước 2 | Chọn bậc cân nặng: `<3`, `>3–6`, `>6–10`, `>10–20`, `>20–30`, `>30–40`, `>40` kg |
| Bước 3 | Combo trọn gói (4 combo) hoặc Dịch vụ lẻ (6 dịch vụ), cộng thêm nhuộm (3 loại) và "báo giá riêng" (6 loại) |
| "Báo giá riêng" | Gỡ rối, Tẩy ố, Tắm trắng, Xả dưỡng: 50.000–500.000₫; Nhuộm hình lớn, Nhuộm tạo hình cơ thể: tuỳ thiết kế |
| Form giữ chỗ | Chỉ cần SĐT (bắt buộc) + tên bé (không bắt buộc) + ngày mong muốn (có sẵn 6 mốc cố định: "Hôm nay", "Ngày mai" và 4 ngày kế tiếp + ô nhập "Ngày khác") |
| Bảng giá tham khảo | Chó & mèo dùng **chung một bảng** 7 bậc cân nặng × 10 dịch vụ grooming (4 combo trọn gói + 6 dịch vụ lẻ) + 3 dịch vụ nhuộm; bảng **không tách giá theo loài** |
| Cơ chế | "Chỉ cần số điện thoại — spa sẽ gọi xác nhận khung giờ"; giá cuối xác nhận tại spa sau khi cân |
| Giờ mở cửa | 08:00–22:00 mỗi ngày |
| Ngôn ngữ | Việt / English (chuyển qua link) |
| Nội dung khác | Tìm Bé Thương (nhận nuôi), Bảo hành, Tuyển dụng, Blog, So sánh giống, Hỏi đáp, Đánh giá khách hàng, Showroom |

### 3.3 T3 — Pretty Paws (`prettypawscatanddoggrooming.groomore.com`)

| Hạng mục | Quan sát |
|---|---|
| Công nghệ | Groomore — nền tảng đặt lịch SaaS cho tiệm grooming |
| Kết nối chính | Danh mục dịch vụ theo nhóm cân nặng + nút "Book Now" 24/7 + giờ mở cửa. **Bậc cân nặng lbs mã hoá trong tên dịch vụ**, không có ô nhập cân nặng; form đặt lịch chỉ có ô "Mobile number" + chọn quốc gia |
| Luồng đặt lịch | **Không có wizard nhiều bước**: danh mục 41 dịch vụ / 5 nhóm → nút "Book Now" mở drawer → nhập SĐT → nút `Login`. Không có bước chọn loài, cân nặng, ngày, khung giờ hay nút "Tiếp tục"/quay lại. Drawer chỉ phục vụ **khách đã có hồ sơ**: khách mới được hướng dẫn điền form intake qua Facebook page hoặc nhắn tin `609-816-7755`; nhập SĐT lạ → thông báo "Sorry, it is only available for existing client." |
| Dịch vụ | Dog Bath 0-20lbs ($52, 30 phút), Dog Bath 20-50lbs ($65, 30 phút), Dog Bath short hair over 50lbs ($72, 1h), Dog bath medium/long hair over 50lbs ($79, 1h), Dog Full groom theo 7 nhóm lbs ($69–$175), Cat Bath ($60, 30 phút), Cat Bath and trim ($80, 30 phút), Cat Bath and shave down / lion cut ($110, 1,5h), Cat bath and full body hair cut ($125, 1,5h), Nails/sanitary/eye trim ($10–$29) |
| Phí lễ tân | Không có dịch vụ "phí lễ tân" riêng; 2 khoản phụ thu: `*HOLIDAY FEE*` ($27) và `Emergency appointment fee` ($25, chỉ khi kín lịch) |
| Kết nối chính | "Book Now" 24/7; có địa chỉ, điện thoại, email, trạng thái mở cửa |
| Giờ mở cửa | 08:00–20:00 |
| Bổ sung | Trang blog (bài trên nền tảng Groomore), About us |

### 3.4 Bảng so sánh mô hình giá (cơ sở cho kiểm thử đối chiếu)

| Tiêu chí | T1 | T2 | T3 |
|---|---|---|---|
| Đơn vị cân nặng | kg | kg | lbs |
| Số bậc cân nặng | 7 | 7 | 3–7 tùy dòng sản phẩm (xem BR-03) |
| Nhập cân nặng chính xác | Không (chọn bậc) | Không (chọn bậc) | Không (chọn dịch vụ theo bậc lbs tích hợp trong tên) |
| Tính giá tức thì | Không (chỉ "Từ ...₫") | Có (calculator 3 bước) | Có (nút Book Now dẫn tới lịch có giá) |
| Phân biệt giá theo loài Chó/Mèo | Có (bảng tách 2 khối) | **Không** (một bảng dùng chung, giá bằng nhau) | Có (nhóm dịch vụ riêng cho Chó và Mèo) |
| Dịch vụ lẻ | Không | Có (6 loại) | Có (12 dịch vụ quick service) |
| Combo | Có (3 combo) | Có (4 combo) | Không |
| Dịch vụ tận nhà | Có | Không | Không |
| Phụ thu biến thiên | Phụ thu km | Không | Phí ngày lễ ($27) và phí khẩn cấp ($25) |
| Ngôn ngữ | Việt/Anh | Việt/Anh | Anh |

---

## 4. Use case

| Mã | Use case | Hệ thống | FR liên quan | Luồng rẽ nhánh / ngoại lệ chính |
|---|---|---|---|---|
| UC-01 | Xem danh mục dịch vụ và bảng giá | T1, T2, T3 | FR-M2-01…03, FR-M3-01 | N1: dịch vụ "báo giá riêng" không có giá cố định → hiển thị khoảng 50.000–500.000₫ (T2). N2: T3 công bố phụ thu ngày lế và phí khẩn cấp tách riêng khỏi dịch vụ. N3: danh mục rỗng/không tải được → thông báo lỗi thay vì trang trắng |
| UC-02 | Tính giá dự kiến bằng calculator | T2, T3 | FR-M3-02…05 | N1: bỏ qua bước cân nặng → giá không hiển thị (T2). N2: chọn dịch vụ "báo giá riêng" → khung giá hiện dạng tham khảo, không có con số đơn lẻ. N3: đổi bất kỳ lựa chọn nào → giá tính lại tức thì. N4: T3 không có bước chọn bậc cân nặng → chọn dịch vụ theo bậc lbs trong tên |
| UC-03 | Giữ chỗ / đặt lịch | T1, T2, T3 | FR-M4-01…08 | N1: chưa chọn loài → nút "Tiếp tục" bị khoá (T1, T2). N2: bỏ trống SĐT → form không gửi được (T1, T2) hoặc nút `Login` bị khoá (T3). N3: chọn ngày trong quá khứ → không chọn được. N4: T2 chọn ngày quá 30 ngày → được nhập nhưng phải giải thích theo lịch mở cửa. N5: T3 không có bước chọn dịch vụ/ngày/khung giờ; SĐT không thuộc hồ sơ cũ → báo "Sorry, it is only available for existing client." Xem bảng luồng chi tiết bên dưới |
| UC-04 | Gửi thông tin giữ chỗ qua form | T1, T2 | FR-M4-01…04 | N1: SĐT sai định dạng → báo lỗi tại chỗ. N2: ngày mong muốn nằm ngoài lịch mở cửa → không có khung giờ khả dụng. N3: gửi thành công → hiện thông báo xác nhận và mã lịch hẹn |
| UC-05 | Xem chính sách lịch (hủy/đổi) | T1 | FR-M5-01…04 | N1: hủy trong khung xác nhận qua Zalo → trừ 1 lượt đặt lịch. N2: không có Zalo → được hướng dẫn kênh liên hệ khác. N3: hủy trong vòng 24h giờ đã đặt → không hoàn cọc |
| UC-06 | Tìm kiếm nội dung | T2 | FR-M7-01…02 | N1: từ khoá không có kết quả → hiển thị thông báo "không tìm thấy". N2: từ khoá rỗng → không gọi tìm kiếm. N3: kết quả trả về từ nhiều nhóm nội dung |
| UC-07 | Chuyển đổi ngôn ngữ | T1, T2 | FR-M7-03 | N1: sang tiếng Anh → giữ nguyên ngữ cảnh trang đang xem. N2: tải lại trang ở ngôn ngữ đã chọn → giữ nguyên ngôn ngữ. N3: T3 chỉ có tiếng Anh → không có điều khiển chuyển ngữ |
| UC-08 | Liên hệ tiệm qua kênh công khai | T1, T2, T3 | FR-M7-04…05 | N1: bấm số điện thoại → mở ứng dụng gọi. N2: bấm email → mở trình soạn thư. N3: giờ ngoài khung mở cửa → vẫn gọi được nhưng tiệm không trực |

### Mẫu đặc tả: UC-03 Giữ chỗ / đặt lịch (T2)

- **Actor:** Khách vãng lai. **Tiền điều kiện:** không cần đăng nhập.
- **Luồng chính:** (1) KH chọn loài. (2) KH chọn bậc cân nặng. (3) KH chọn dịch vụ. (4) Hệ thống hiển thị giá dự kiến và tóm tắt lựa chọn. (5) KH nhập SĐT, tên bé, ngày mong muốn. (6) Hệ thống gửi yêu cầu giữ chỗ.
- **Luồng rẽ nhánh:** A1 không chọn loài → nút "Tiếp tục" bị khoá. A2 bỏ qua bước cân nặng → giá không hiển thị. A3 chọn "báo giá riêng" → giá hiển thị dạng tham khảo, không có con số cụ thể. A4 bỏ trống SĐT → form không gửi được. A5 chọn ngày trong quá khứ → không chọn được.
- **Hậu điều kiện:** tiệm nhận được thông tin và gọi xác nhận khung giờ.

---

## 5. Yêu cầu chức năng

Ưu tiên: Must (bắt buộc), Should (nên có), Could (có thể bỏ khi thiếu thời gian). Ràng buộc dữ liệu tham chiếu mục 7; quy tắc nghiệp vụ tham chiếu mục 6.

### 5.1 M1 – Truy cập, điều hướng, thông tin cơ bản

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M1-01 | Trang chủ tải được bằng HTTP 200 không cần đăng nhập | T1, T2, T3 | Must | HTTP 200; không có lỗi console nghiêm trọng; trang hiển thị tiêu đề và điều hướng chính |
| FR-M1-02 | Điều hướng chính mở được từ mọi trang và quay lại được | T1, T2, T3 | Must | Mọi liên kết menu trả HTTP 200; nút quay lại hoạt động trên trang con |
| FR-M1-03 | Hiển thị đầy đủ thông tin liên hệ: địa chỉ, điện thoại, email, giờ mở cửa | T1, T2, T3 | Must | Cả 4 trường xuất hiện; điện thoại đúng định dạng số; giờ mở cửa khớp giữa header và footer |
| FR-M1-04 | Không có lỗi liên kết chết (404) trong menu và footer | T1, T2, T3 | Must | 0 liên kết 404 trong menu/footer; liên kết ngoài mở ở tab mới |
| FR-M1-05 | Trang hiển thị đúng trên màn hình di động, không tràn ngang | T1, T2, T3 | Must | Ở 360px không có cuộn ngang; bảng giá T1 cuộn ngang có thao tác vuốt |
| FR-M1-06 | Ứng dụng báo lỗi thân thiện khi tải trang con thất bại | T1, T2, T3 | Should | Lỗi 404/500 hiển thị trang thông báo, không hiện stack trace |

### 5.2 M2 – Danh mục dịch vụ

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M2-01 | Hiển thị danh sách dịch vụ kèm tên, mô tả, giá và thời lượng | T1, T2, T3 | Must | Mỗi **dịch vụ** trong danh mục có đủ 4 thuộc tính (tên, mô tả, giá, thời lượng); số dịch vụ khớp bảng giá mục 3. **Khoản phụ thu** (T1: phụ thu di chuyển; T3: `*HOLIDAY FEE*` $27, `Emergency appointment fee` $25) là mục riêng, **không** áp dụng tiêu chí 4 thuộc tính vì không có thời lượng |
| FR-M2-02 | Mỗi dịch vụ nêu rõ phạm vi bao gồm (thành phần) | T1, T2, T3 | Must | 100% dịch vụ trong danh mục có mô tả "bao gồm"; danh sách thành phần nêu đúng với mô tả |
| FR-M2-03 | Phân biệt dịch vụ tại spa và tại nhà | T1 | Must | Mỗi dịch vụ có đúng 1 nhãn: "Chỉ tại spa" khi không hỗ trợ tại nhà, "Có tận nhà" khi hỗ trợ; 0 dịch vụ thiếu nhãn |
| FR-M2-04 | Tách dịch vụ grooming, nhuộm và dịch vụ giá riêng thành nhóm | T2 | Should | Ít nhất 3 nhóm hiển thị tách biệt; mỗi dịch vụ "báo giá riêng" được đánh dấu rõ |
| FR-M2-05 | Nêu rõ gói phổ biến và phụ thu thêm của gói tại nhà | T1 | Should | Gói phổ biến có 1 nhãn đánh dấu; 100% gói tại nhà ghi rõ mức phụ thu cộng thêm bằng số (₫) |
| FR-M2-06 | Phân biệt rõ dịch vụ dành cho chó và dịch vụ dành cho mèo | T3 | Should | Danh mục có đúng 2 nhóm dịch vụ cho chó và cho mèo, tách biệt |
| FR-M2-07 | Không niêm yết dịch vụ mà hệ thống không thực hiện được | T1, T2, T3 | Should | 0 dịch vụ có nhãn tại nhà ở hệ thống không cung cấp dịch vụ tại nhà |

### 5.3 M3 – Bảng giá theo cân nặng và tính giá

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M3-01 | Công bố bảng giá theo bậc cân nặng và loài | T1, T2, T3 | Must | Bảng có đủ cột cho 7 bậc cân nặng (T1, T2) và đủ dòng cho mọi dịch vụ; 100% ô giá là số xác định, 0 ô ghi "tùy" |
| FR-M3-02 | Tra bảng giá đúng theo loài và bậc cân nặng được chọn | T1, T2, T3 | Must | T1: chọn (Chó, 5–10kg) + Combo Tắm+Vệ sinh → 375.000₫ đúng bảng; **cùng bậc cân nặng nhưng Mèo → 405.000₫ (khác nhau)**. T2: chọn (Chó, >3–6kg) + Combo Tắm Vệ Sinh → 200.000₫ đúng bảng; **T2 dùng chung một bảng giá cho Chó và Mèo nên không yêu cầu Chó ≠ Mèo**. T3: chọn *Dog Bath 20-50lbs* → $65 đúng bảng |
| FR-M3-03 | Giá hiển thị được tính tức thì khi chọn đủ loài, cân nặng, dịch vụ | T2 | Must | Chọn xong bước 3 → hiển thị giá dự kiến cụ thể và tóm tắt lựa chọn; đổi bất kỳ lựa chọn nào → giá cập nhật |
| FR-M3-04 | Tính giá riêng cho dịch vụ cần khảo giá | T2 | Must | Dịch vụ "báo giá riêng" hiển thị khoảng 50.000–500.000₫ hoặc "tuỳ thiết kế", tuyệt đối không hiện một con số đơn lẻ |
| FR-M3-05 | Giá dự kiến được ghi rõ là dự kiến, không phải giá cuối | T1, T2, T3 | Must | Mỗi trang có bảng giá phải chứa ≥ 1 câu ghi rõ giá cuối xác nhận tại spa/cân thực tế |
| FR-M3-06 | Bảng giá nêu rõ điều kiện bảo hành hoặc ngoại lệ phát sinh phí | T2, T3 | Should | T2: có ≥ 1 ghi chú bảng giá liệt kê 3 phí không bao gồm: gỡ rối, tẩy ố, tắm trắng. T3: nhóm `EMERGENCY APPOINTMENT (2)` niêm yết đúng 2 khoản phụ thu: `*HOLIDAY FEE*` $27 và `Emergency appointment fee *WAIT LIST ONLY*` $25 (xem `BR-17`) |
| FR-M3-07 | Nêu giá "từ ...₫" và khoảng min–max cho gói | T1 | Should | 100% gói hiển thị cả 2 thành phần: mức tối thiểu ("Từ ...₫") và khoảng min–max; giá trị khớp bảng |

### 5.4 M4 – Form giữ chỗ / đặt lịch

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M4-01 | Cung cấp form giữ chỗ với trường liên hệ bắt buộc và tuỳ chọn | T1, T2, T3 | Must | T2: SĐT bắt buộc, tên bé tuỳ chọn; T1: có bước chọn loài, cân nặng, ngày giờ, địa chỉ; T3: drawer "Book Now" chỉ có 1 trường bắt buộc (`Mobile number`) + 1 trường tuỳ chọn (chọn quốc gia), không có trường thú cưng |
| FR-M4-02 | Từ chối gửi form khi thiếu trường bắt buộc | T1, T2, T3 | Must | T1, T2: bỏ trống SĐT → không gửi được; thông báo lỗi nêu đúng tên trường "Số điện thoại" (1 thông báo). T3: bỏ trống `Mobile number` → nút `Login` bị khoá (`disabled`), không gửi được yêu cầu |
| FR-M4-03 | Kiểm tra định dạng số điện thoại | T1, T2, T3 | Must | T1, T2: chuỗi không phải số bị từ chối; số dưới 9 chữ số bị từ chối hoặc cảnh báo; cả 2 mẫu lỗi đều không gửi được form. T3: chuỗi chứa chữ cái bị khoá nút `Login`; chuỗi chỉ gồm chữ số được chấp nhận (không kiểm tra độ dài tối thiểu) |
| FR-M4-04 | Cho phép chọn ngày mong muốn trong tương lai | T1, T2 | Must | T1: bước "Lịch hẹn" hiển thị **7 ngày cố định** (từ hôm nay trở đi) kèm **8 khung giờ** 08:30–17:00; ngày trong quá khứ không chọn được. T2: ô ngày có `min` = hôm nay, kèm **2 mốc cố định** nhãn "Hôm nay" và "Ngày mai" cùng 4 ngày cuối tuần/tuần kế và lựa chọn "Ngày khác" |
| FR-M4-05 | Chặn ngày mong muốn nằm quá xa trong tương lai | T2 | Should | Ngày quá 30 ngày **được nhập vào ô ngày** nhưng phải được giới hạn hoặc giải thích theo lịch mở cửa (T2 chỉ chặn ngày quá khứ ở tầng input, không đặt `max`) |
| FR-M4-06 | Chọn được loài và cân nặng trước khi xem giá | T1, T2 | Must | T1, T2: wizard bắt buộc qua 2 bước loài và cân nặng (T2 theo máy trạng thái `S0 → S1 → S2`, xem §8.1); 0 cách bỏ qua (nút "Tiếp tục" bị khoá khi chưa chọn) |
| FR-M4-07 | Chọn được dịch vụ trước khi xác nhận | T1, T2, T3 | Must | T1, T2: mỗi hệ thống có 1 bước chọn dịch vụ rõ ràng; 0 dịch vụ nào bị ẩn khi bấm "Tiếp tục". T3: danh mục 41 dịch vụ trong 5 nhóm (`EMERGENCY APPOINTMENT` 2, `Dog (bath included)` 16, `Cat (bath included)` 4, `QUICK SERVICE` 12, `ADD ON TO GROOM` 7), mỗi dịch vụ hiện đủ tên + giá + thời lượng; 0 dịch vụ nào bị ẩn |
| FR-M4-08 | Cho phép quay lại bước trước mà không mất lựa chọn | T1, T2, T3 | Must | T1, T2: quay lại từ bước 3 giữ nguyên loài và cân nặng; nút quay lại hoạt động. T3: mỗi nhóm trong danh mục 41 dịch vụ mở/thu gọn độc lập, đóng 1 nhóm không ảnh hưởng nhóm khác |
| FR-M4-09 | Hiển thị tóm tắt lựa chọn trước khi gửi | T2 | Should | Tóm tắt hiển thị đủ 4 trường: loài, bậc cân nặng, dịch vụ, giá |
| FR-M4-10 | Yêu cầu sự đồng ý về việc liên hệ lại trước khi gửi | T2 | Must | Có 1 thông báo đồng ý liên hệ qua điện thoại/Zalo và 1 điều khoản che khuất tùy chọn |
| FR-M4-11 | Cho phép đặt lịch ngoài giờ mở cửa | T3 | Should | Nút "Book Now" hoạt động 24/7, kể cả ngoài giờ mở cửa |
| FR-M4-12 | Không yêu cầu tạo tài khoản để đặt lịch | T1, T2, T3 | Must | 0 bước đăng ký/đăng nhập trong toàn bộ luồng đặt lịch (kiểm tra từ trang chủ đến màn xác nhận) |
| FR-M4-13 | Chỉ cho khách đã có hồ sơ đặt lịch trực tuyến, khách mới được hướng dẫn tiếp nhận | T3 | Must | T3: nhập SĐT không thuộc hồ sơ cũ → báo "Sorry, it is only available for existing client."; trang chủ có banner hướng khách mới tới form tiếp nhận trên Facebook page hoặc nhắn tin `609-816-7755` |

### 5.5 M5 – Vòng đời lịch hẹn và chính sách

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M5-01 | Nêu rõ quy trình từ đặt lịch đến nhận thú cưng | T1, T2, T3 | Must | Có mô tả 4 bước (T1) hoặc 4 bước (T2) khớp thực tế |
| FR-M5-02 | Công bố thời gian xác nhận lịch | T1, T2 | Must | T1: "xác nhận trong 5 phút qua Zalo"; T2: "spa sẽ gọi xác nhận khung giờ" — thời gian nêu rõ |
| FR-M5-03 | Nêu rõ có thể đổi hoặc hủy lịch và điều kiện | T1 | Must | Mục FAQ "Có thể đổi/huỷ lịch không?" trả lời có ≥ 2 điều kiện cụ thể về thời gian và phí |
| FR-M5-04 | Nêu rõ chính sách hủy và hoàn tiền | T1, T2, T3 | Must | T2, T3: có nội dung cho cả 3 mục: hủy, đổi, hoàn cọc; không chỉ nêu "liên hệ tiệm". T1: mục "Đổi/huỷ lịch" nêu điều kiện thời gian cụ thể (báo trước 4 giờ) và hệ quả tài chính (phụ thu 50% cho lịch tại nhà nếu hủy trong 4 giờ cuối) |
| FR-M5-05 | Nêu rõ thời gian nên đặt trước cho từng loại dịch vụ | T2 | Should | Có câu "nên đặt lịch trước ít nhất 2–4 giờ" theo dịch vụ |
| FR-M5-06 | Thông báo khi bị từ chối lịch do ngoài giờ làm việc | T3 | Must | Chọn khung giờ ngoài giờ mở cửa bị từ chối kèm ≥ 1 câu giải thích lý do |
| FR-M5-07 | Hiển thị trạng thái hiện tại của tiệm (đang mở/đã đóng) | T3 | Must | Trang hiển thị 1 trạng thái "Open"/"Closed" kèm khung giờ mở cửa đầy đủ |

### 5.6 M6 – Dịch vụ tận nhà và phụ thu di chuyển

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M6-01 | Cho phép chọn dịch vụ tại spa hoặc tại nhà | T1 | Must | Bước 3 của wizard có lựa chọn "đến spa" hoặc "tại nhà" |
| FR-M6-02 | Tính phụ thu di chuyển theo công thức công bố | T1 | Must | `max(0, km − 5) × 8.000₫`; 5 km miễn phí; phụ thu hiển thị ngay khi nhập địa chỉ |
| FR-M6-03 | Cộng phụ thu cố định của gói tại nhà vào tổng | T1 | Must | Tắm +50.000₫, Cạo +80.000₫, Combo Tắm+Cạo +100.000₫ |
| FR-M6-04 | Nêu rõ mức phụ thu cố định không gồm phí di chuyển | T1 | Must | 100% gói tại nhà ghi rõ "(chưa gồm phí di chuyển)" |
| FR-M6-05 | Phụ thu di chuyển tăng dần theo khoảng cách, có mốc miễn phí | T1 | Must | Có bảng 4 dảng km: 0–5, 5–10, 10–15, trên 15 km |
| FR-M6-06 | Trên 15 km không báo giá cố định mà chuyển sang liên hệ | T1 | Must | Trên 15 km hiển thị "Liên hệ — Báo giá riêng theo lộ trình" |

### 5.7 M7 – Tìm kiếm, ngôn ngữ, nội dung, liên kết

| ID | Yêu cầu | HĐ | Ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|---|
| FR-M7-01 | Có chức năng tìm kiếm nội dung | T2 | Must | Nhập 1 từ khoá ra ≥ 1 kết quả lọc theo từ khoá |
| FR-M7-02 | Tìm kiếm không phân biệt hoa thường và xử lý từ khoá rỗng | T2 | Must | 2 chuỗi "SPA" và "spa" cho cùng tập kết quả; từ khoá rỗng không gây lỗi mà hiện ≥ 1 thông báo hướng dẫn |
| FR-M7-03 | Chuyển đổi ngôn ngữ và giữ ngữ cảnh trang | T1, T2 | Should | Chuyển sang tiếng Anh vẫn ở trang hiện tại; 0 chuỗi tiếng Việt còn sót lại ở nội dung chính. **T3 không thuộc phạm vi**: T3 chỉ có tiếng Anh, không có điều khiển chuyển ngữ (xem §3.4 và `UC-07` N3) |
| FR-M7-04 | Cung cấp kênh liên hệ đa dạng (điện thoại, email, Zalo/chat) | T1, T2, T3 | Must | Ít nhất 2 kênh liên hệ hoạt động; liên kết Zalo/messenger mở đúng ứng dụng |
| FR-M7-05 | Trang tìm bé thương và bảo hành không chặn người dùng | T2 | Could | 2 trang mở được (HTTP 200), 0 yêu cầu đăng nhập |
| FR-M7-06 | Nội dung FAQ dạng accordion mở/đóng được | T1 | Should | Mỗi mục mở độc lập; ≥ 2 mục mở cùng lúc mà không đóng lẫn nhau; biểu tượng đổi theo trạng thái |
| FR-M7-07 | Hiển thị nội dung bằng một ngôn ngữ duy nhất khi hệ thống không hỗ trợ đa ngôn ngữ | T3 | Should | T3: toàn bộ nội dung hiển thị bằng tiếng Anh; 0 điều khiển chuyển ngôn ngữ trên trang (không có nút, link hay select đổi ngữ) |

### 5.8 M2/M3/M4/M5 bổ sung theo hệ thống (nhóm Mạnh)

Không thêm yêu cầu mới; chỉ ghi rõ phạm vi theo hệ thống ở bảng trên.

---

## 6. Quy tắc nghiệp vụ

Các quy tắc dưới đây là **quy tắc của hệ thống đích** (đọc được từ nội dung site), dùng làm chuẩn để so sánh kết quả thực tế với kỳ vọng.

| ID | Quy tắc | HĐ | FR liên quan |
|---|---|---|---|
| BR-01 | Bậc cân nặng chó của T1: `<3`, `3–5`, `5–10`, `10–15`, `15–20`, `20–25`, `25–30` kg; mèo: `≤3`, `3–5`, `5–10`, `10–15`, `15–20`, `20–25`, `25–30` kg | T1 | FR-M3-01, FR-M3-02 |
| BR-02 | Bậc cân nặng của T2: `<3`, `>3–6`, `>6–10`, `>10–20`, `>20–30`, `>30–40`, `>40` kg | T2 | FR-M3-01, FR-M3-02 |
| BR-03 | Ngưỡng cân nặng của T3 tính theo lbs và **khác nhau theo từng dòng sản phẩm**: `Dog Bath` dùng `0–20`, `20–50`, `over 50` (chia theo độ dài lông: short hair / medium-long hair); `Dog Bath and tidy up` dùng `0–20`, `21–40`, `41–60`, `61–79`, `79+`; `Dog Full Groom` dùng `0–20`, `21–30`, `31–40`, `41–60`, `61–78`, `79–90`, `91–100+`; `Cat Bath` dùng `0–20`, `21–40`, `41–60`, `61–79`, `79+`. **T3 không có ô nhập cân nặng** — bậc cân nặng lbs được mã hoá trong tên dịch vụ; khách chọn *dịch vụ* đúng bậc | T3 | FR-M3-01, FR-M3-02 |
| BR-04 | Phụ thu di chuyển T1 = `max(0, km − 5) × 8.000₫`; 5 km đầu miễn phí | T1 | FR-M6-02, FR-M6-05 |
| BR-05 | Dải phụ thu di chuyển T1: 0–5 km miễn phí; 5–10 km: 40.000–80.000₫; 10–15 km: 80.000–120.000₫; trên 15 km: liên hệ báo giá riêng | T1 | FR-M6-05, FR-M6-06 |
| BR-06 | Phụ thu tại nhà cố định của T1: Tắm +50.000₫; Cạo +80.000₫; Combo Tắm+Cạo +100.000₫; các gói khác không hỗ trợ tại nhà | T1 | FR-M6-03, FR-M6-04 |
| BR-07 | Dịch vụ "báo giá riêng" của T2 không có giá cố định: gỡ rối, tẩy ố, tắm trắng, xả dưỡng trong khoảng 50.000–500.000₫; nhuộm hình lớn và nhuộm tạo hình tuỳ thiết kế | T2 | FR-M3-04 |
| BR-08 | Giá cuối của T2 được xác nhận tại spa sau khi cân và kiểm tra tình trạng lông | T2 | FR-M3-05 |
| BR-09 | Quy trình T1 gồm 4 bước: chọn dịch vụ → đặt lịch (loài + cân nặng + ngày giờ) → tại spa hoặc tại nhà → xác nhận và thanh toán; xác nhận trong 5 phút qua Zalo | T1 | FR-M5-01, FR-M5-02 |
| BR-10 | Quy trình T2 gồm 4 bước: tiếp nhận → kiểm tra (cân, kiểm tra da và lông, xác nhận giá cuối) → grooming → bàn giao | T2 | FR-M5-01 |
| BR-11 | Dịch vụ lẻ của T2: cắt dũa+móng, vệ sinh tai, cạo bụng+bàn+hậu môn, tắm sấy, cạo lông, cắt lông; giá theo bậc cân nặng `<3` đến `>40` kg | T2 | FR-M2-04, FR-M3-01 |
| BR-12 | T3 không có dịch vụ "phí lễ tân" riêng; dịch vụ rẻ nhất trong nhóm `Dog (bath included)` là *Dog Bath 0-20lbs* giá 52 USD / 30 phút | T3 | FR-M2-01, FR-M3-01 |
| BR-17 | T3 có 2 khoản phụ thu riêng: `*HOLIDAY FEE*` 27 USD (áp dụng cho lịch trong ngày lễ) và `Emergency appointment fee *WAIT LIST ONLY*` 25 USD (chỉ dùng khi đã kín lịch) | T3 | FR-M2-01, FR-M3-01 |
| BR-18 | Giá của T1 tăng đơn điệu theo bậc cân nặng trong cùng một cột dịch vụ: giá ở bậc cao hơn không bao giờ nhỏ hơn giá ở bậc thấp hơn ngay bên trên | T1 | FR-M3-01, FR-M3-02 |
| BR-13 | T3 cho phép đặt lịch 24/7, giờ mở cửa 08:00–20:00 | T3 | FR-M4-11, FR-M5-07 |
| BR-14 | T1 mở cửa 07:00–22:00; T2 mở cửa 08:00–22:00 | T1, T2 | FR-M1-03 |
| BR-15 | Bảng giá T2 không bao gồm phí gỡ rối, tẩy ố và tắm trắng | T2 | FR-M3-06 |
| BR-16 | Chỉ dịch vụ tại nhà mới phát sinh phụ thu di chuyển; dịch vụ tại spa không phát sinh phụ thu nào | T1 | FR-M6-01, FR-M6-02 |

---

## 7. Ràng buộc dữ liệu

Bảng này là đầu vào trực tiếp cho phân vùng tương đương và phân tích giá trị biên.

| Trường | HĐ | Kiểu | Bắt buộc | Min | Max | Định dạng, ghi chú |
|---|---|---|---|---|---|---|
| Số điện thoại / Zalo | T2, T3 | Chuỗi số | Có | 10 chữ số (T2) | 15 chữ số (T2) | Bắt đầu bằng 0 (số Việt Nam); placeholder `0xxx xxx xxx`. **T3**: placeholder `Mobile number`, chỉ chứa chữ số, không kiểm tra độ dài tối thiểu |
| Tên bé | T1, T2 | Chuỗi | Không (T2) | 1 ký tự | 50 ký tự | T2 có placeholder "Vd: Mochi" |
| Ngày mong muốn | T1, T2 | Ngày | Có | Hôm nay | +30 ngày (T2) | Định dạng ngày/tháng; T2 có 5 nút ngày nhanh + ô "Ngày khác" |
| Loài thú cưng | T1, T2 | Liệt kê | Có | | | Chó hoặc Mèo |
| Bậc cân nặng | T1, T2 | Liệt kê | Có | | | Xem BR-01..BR-02. **T3 không có ô nhập cân nặng**: bậc cân nặng (lbs) được mã hoá trong tên dịch vụ, xem BR-03 |
| Dịch vụ | T1, T2, T3 | Liệt kê | Có | | | T1: 6 gói; T2: 4 combo + 6 lẻ + 3 nhuộm + 6 báo giá riêng; T3: 41 dịch vụ trong 5 nhóm (`Dog bath included` 16, `Cat bath included` 4, `Quick service` 12, `Add on` 7, `Emergency` 2) |
| Địa chỉ (tại nhà) | T1 | Chuỗi | Có khi chọn tại nhà | 5 ký tự | 200 ký tự | Dùng để tính phụ thu km |
| Từ khoá tìm kiếm | T2 | Chuỗi | Không | 0 ký tự | 100 ký tự | Không phân biệt hoa thường |
| Số tiền | T1, T2, T3 | Số nguyên | | | | VNĐ (T1, T2) hoặc USD (T3) |

---

## 8. Vòng đời lịch hẹn và chính sách

### 8.1 Vòng đời wizard đặt lịch (T2) — dùng cho kiểm thử chuyển đổi trạng thái

Trạng thái: `S0 Chưa chọn loài` → `S1 Đã chọn loài` → `S2 Đã chọn bậc cân nặng` → `S3 Đã chọn dịch vụ` → `S4 Đã điền thông tin liên hệ` → `S5 Đã gửi`.

| Từ | Chọn loài | Chọn bậc cân nặng | Chọn dịch vụ | Quay lại | Gửi form |
|---|---|---|---|---|---|
| S0 | → S1 | ✗ | ✗ | ✗ | ✗ |
| S1 | — | → S2 | ✗ | → S0 | ✗ |
| S2 | — | — | → S3 | → S1 | ✗ |
| S3 | — | — | — | → S2 | ✗ (còn thiếu SĐT) |
| S4 | — | — | — | → S3 | → S5 |
| S5 (terminal) | ✗ | ✗ | ✗ | ✗ | ✗ |

✗ = chuyển không hợp lệ, phải bị chặn. Nút "Tiếp tục" bị khoá khi trạng thái hiện tại chưa đủ dữ liệu.

### 8.2 Vòng đời wizard đặt lịch (T1)

Trạng thái: `W0 Mở modal` → `W1 Đã chọn loài` → `W2 Đã chọn gói` → `W3 Đã chọn cân nặng` → `W4 Đã chọn ngày giờ` → `W5 Đã chọn tại spa / tại nhà` → `W6 Đã nhập địa chỉ (nếu tại nhà)` → `W7 Xác nhận đơn`.

| Từ | Chọn loài | Chọn gói | Quay lại | Xác nhận |
|---|---|---|---|---|
| W0 | → W1 | ✗ | ✗ | ✗ |
| W1 | — | → W2 | → W0 | ✗ |
| W2 | — | — | → W1 | ✗ |
| W3..W6 | — | — | → bước trước | → W7 |
| W7 (terminal) | ✗ | ✗ | ✗ | ✗ |

### 8.2b Luồng đặt lịch (T3) — **không phải wizard**

T3 là nền tảng SaaS Groomore: luồng đặt lịch là **1 màn hình tra cứu khách hàng**, không phải chuỗi bước. Trạng thái: `P0 Chưa mở drawer` → `P1 Đã mở drawer` → `P2 Đã nhập SĐT hợp lệ` → `P3 Đã gửi` / `P4 Bị từ chối`.

| Từ | Mở drawer | Nhập SĐT | Bấm `Login` |
|---|---|---|---|
| P0 | → P1 | ✗ | ✗ |
| P1 | — | → P2 | ✗ (nút `Login` bị khoá khi SĐT rỗng hoặc chứa chữ cái) |
| P2 | — | — | → P3 (SĐT thuộc hồ sơ cũ) hoặc → P4 (báo "Sorry, it is only available for existing client.") |
| P3, P4 (terminal) | ✗ | ✗ | ✗ |

T3 **không** có các bước chọn loài, cân nặng, dịch vụ, ngày, khung giờ; cũng không có nút "Tiếp tục" hay quay lại. Vì vậy các ca kiểm thử chuyển trạng thái (`ST`) của T3 chỉ áp dụng cho 2 trạng thái khoá nút — xem `FR-M4-02`, `FR-M4-03`.

### 8.3 Chính sách hủy / đổi lịch — bảng quyết định kiểm thử

Không hệ thống nào công bố chính sách hủy bằng bảng quyết định. Bảng dưới đây là **bảng kiểm thử** để đánh giá mức độ đầy đủ và khả năng tìm thấy của chính sách, áp dụng cho cả 3 hệ thống.

| | Q1 Đã công bố chính sách hủy | Q2 Nêu điều kiện thời gian hủy | Q3 Nêu hệ quả tài chính (cọc/hoàn) | Q4 Nêu cách hủy (kênh) | Q5 Nêu chính sách đổi lịch |
|---|---|---|---|---|---|
| T1 | Y | Y | Y | Y | Y |
| T2 | Y | Y | Y | Y | Y |
| T3 | Y | Y | Y | Y | Y |

Điều kiện đạt cho mỗi ô: nội dung tồn tại **và tìm thấy được** trong ≤ 2 lần click từ trang đặt lịch; nội dung có con số cụ thể (giờ trước, phần trăm hoặc số tiền), không chỉ "liên hệ tiệm".

### 8.4 Bảng quyết định tính phụ thu di chuyển (T1) — bảng kiểm thử

Điều kiện: C1 khoảng cách, C2 có chọn tại nhà.

| | R1 | R2 | R3 | R4 |
|---|---|---|---|---|
| C1 Khoảng cách (km) | ≤5 | 6 | 12 | 20 |
| C2 Hình thức | Tại nhà | Tại nhà | Tại nhà | Tại nhà |
| Phụ thu di chuyển | 0₫ | 8.000₫ | 56.000₫ | "Liên hệ báo giá riêng" |
| Phụ thu gói tại nhà (Tắm) | +50.000₫ | +50.000₫ | +50.000₫ | +50.000₫ |

---

## 9. Yêu cầu phi chức năng

| ID | Yêu cầu | HĐ | Ưu tiên | Cách xác nhận |
|---|---|---|---|---|
| NFR-01 | Hiệu năng: trang chủ tải xong (DOMContentLoaded) trong ≤ 3 giây trên mạng 4G mô phỏng; LCP ≤ 2,5 giây | T1, T2, T3 | Must | Lighthouse (mobile, thang 0–100), 3 lần lấy trung vị; ngưỡng đạt: điểm Performance ≥ 70, DOMContentLoaded ≤ 3 giây, LCP ≤ 2,5 giây |
| NFR-02 | Bảo mật: HTTPS bật, HSTS có, `X-Content-Type-Options: nosniff`, `X-Frame-Options` hoặc CSP `frame-ancestors`, `Referrer-Policy`; không lộ stack trace; phản xạ đầu vào không thực thi (XSS) | T1, T2, T3 | Must | Kiểm tra header qua HTTP client và trình duyệt; payload vô hại; ngưỡng đạt: đủ 4/4 header, cookie phiên có `Secure` + `HttpOnly`, 0 phát hiện mức Critical/High |
| NFR-03 | Khả năng dùng: hoàn tất luồng tính giá trong ≤ 5 thao tác; thông báo lỗi nêu rõ trường; nhãn nhất quán; dùng được bằng bàn phím | T1, T2, T3 | Should | Checklist thủ công, đo số thao tác; ngưỡng đạt: ≤ 5 thao tác ra giá ở T2, mọi thông báo lỗi nêu đúng tên trường, 100% thao tác form bằng bàn phím |
| NFR-04 | Tương thích: chạy đúng chức năng chính trên Chrome, Firefox, Edge và WebKit bản mới nhất; trình duyệt di động 360px | T1, T2, T3 | Must | Playwright đa trình duyệt + kiểm tra thủ công; ngưỡng đạt: 0 lỗi chức năng trên 4 trình duyệt, 0 lần cuộn ngang ở 360px |
| NFR-05 | Độ tin cậy: gửi form nhiều lần liên tiếp không tạo bản ghi trùng; lỗi mạng hiển thị thông báo, không treo; tải lại trang không mất trạng thái đã chọn | T1, T2, T3 | Should | Script tự động + mô phỏng mạng lỗi; ngưỡng đạt: 3 lần gửi tạo tối đa 1 bản ghi, mọi lỗi mạng có thông báo trong ≤ 10 giây, 100% lựa chọn được giữ sau khi tải lại trang |
| NFR-06 | Khả năng tiếp cận: đủ tương phản chữ ≥ 4,5:1; mọi trường form có nhãn; ảnh có `alt`; điều hướng bằng bàn phím; tiêu đề trang duy nhất | T1, T2, T3 | Should | Lighthouse Accessibility + axe-core; ngưỡng đạt: 0 vi phạm axe-core mức critical, tương phản ≥ 4,5:1 ở mọi vùng chữ |
| NFR-07 | SEO và kỹ thuật bảo trì: mỗi trang có `title` và `meta description` duy nhất; có `lang`; sitemap.xml và robots.txt tồn tại và không chặn; Open Graph đầy đủ | T1, T2, T3 | Could | Kiểm tra thẻ meta, phân tích sitemap; ngưỡng đạt: 1 `title` và 1 `meta description` không rỗng trên mỗi trang, sitemap.xml và robots.txt trả HTTP 200 |

### 9.1 Tiêu chí chấp nhận chi tiết cho NFR-01, NFR-02

| NFR | Kiểm tra | Ngưỡng đạt | Kết quả mong đợi khi đạt |
|---|---|---|---|
| NFR-01.1 | Lighthouse Performance (mobile) | ≥ 70 | Ba lần chạy, lấy trung vị ≥ 70; không đo trên mạng bị nghẽn |
| NFR-02.1 | Kiểm tra header bảo mật | Đủ 4/4 header | Có `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `X-Frame-Options` hoặc `frame-ancestors` trong CSP, `Referrer-Policy` |
| NFR-02.2 | Cookie | Không cookie phiên không mã hoá dạng `sessionid`; cookie `Secure` và `HttpOnly` cho cookie phiên | Đạt nếu không có cookie phiên thiếu `Secure`/`HttpOnly` |
| NFR-02.3 | Phản xạ đầu vàu (XSS) | Payload thực thi không được | Nhập `<script>alert(1)</script>` vào tên bé → hiển thị dạng văn bản, không có hộp thoại alert |
| NFR-02.4 | Rò rỉ thông tin | Không lộ stack trace | Yêu cầu URL sai → trang lỗi thân thiện, không chứa tên file, dòng code hoặc framework |

### 9.2 Tiêu chí chấp nhận chi tiết cho NFR-03, NFR-04, NFR-05, NFR-06, NFR-07

| NFR | Kiểm tra | Ngưỡng đạt |
|---|---|---|
| NFR-03.1 | Số thao tác để ra giá dự kiến | T2 ≤ 5 thao tác (chọn loài → cân nặng → dịch vụ → đọc giá) |
| NFR-03.2 | Thông báo lỗi trường rỗng | Có thông báo nêu đúng tên trường, không chỉ "lỗi" |
| NFR-04.1 | Chạy chức năng chính trên 4 trình duyệt (Chromium, Firefox, WebKit, Edge) | Không có lỗi chức năng ở bất kỳ trình duyệt nào trong 4 trình duyệt |
| NFR-04.2 | Màn hình 360px | Không có cuộn ngang ở khối nội dung chính |
| NFR-05.1 | Gửi form 3 lần liên tiếp | Không tạo bản ghi trùng; thông báo xác nhận hiển thị mỗi lần |
| NFR-06.1 | axe-core vi phạm | 0 vi phạm mức critical |
| NFR-06.2 | Tương phản | Tất cả vùng chữ đạt ≥ 4,5:1 |
| NFR-07.1 | `title` và `meta description` | Mỗi trang có 1 `title` khác nhau và không rỗng; có `meta description` |

---

## 10. Phụ lục

### A. Checklist Inspection SRS (ngày 3)

Quy trình: Kick-off, chuẩn bị cá nhân, họp rà soát, sửa đổi, theo dõi và đóng. Vai trò: Moderator (Mạnh), Author (người viết module), Reviewer (người kế tiếp trong vòng Mạnh → Tài → Ngân → Lộc → Mạnh), Scribe xoay vòng. Điều kiện vào: bản nháp đủ 7 module cho cả 3 hệ thống, tác giả đã tự rà. Điều kiện ra: mọi lỗi mức Major đã sửa và Moderator xác nhận.

- [x] Mỗu yêu cầu có ID duy nhất và mức ưu tiên
- [x] Mỗu yêu cầu có tiêu chí chấp nhận đo được, kiểm thử được
- [x] Mọi yêu cầu đều trích được từ hành vi quan sát được của site đích, có dẫn chiếu
- [x] Không có từ mơ hồ như "nhanh", "thân thiện", "phù hợp" mà thiếu con số
- [x] Quy tắc nghiệp vụ không mâu thuẫn với bảng giá và bảng dữ liệu
- [x] Mọi trường dữ liệu có kiểu, min, max, định dạng
- [x] Mọi trạng thái wizard có đường vào và đường ra rõ ràng; chuyển không hợp lệ được nêu
- [x] Có luồng rẽ nhánh và ngoại lệ cho mỗi use case chính
- [x] Thuật ngữ nhất quán với bảng định nghĩa mục 1.3
- [x] Không áp dụng vô tình khái niệm của hệ thống cũ (RBAC, JWT, unit test)

> **Kết quả Inspection ngày 3: 10/10 đạt.** Biên bản và danh sách lỗi RV-01…RV-10: `docs/reviews/inspection-srs.md`. Baseline đóng băng: tag `srs-v1.0`.

### B. Việc cần chốt trong ngày 1–2

| Hạng mục | Đề xuất hiện tại |
|---|---|
| Nguồn đích trích xuất | Nội dung hiển thị công khai trên trang + hành vi tương tác quan sát được (không đọc mã nguồn) |
| Phạm vi "báo giá riêng" | Được tính là hợp lệ, không phải lỗi — nhưng phải hiển thị dạng khoảng, không hiện con số đơn lẻ |
| Chính sách hủy | Xem là yêu cầu **khả năng tìm thấy** (mục 8.3), không phải yêu cầu giá trị cụ thể |
| Ngưỡng hiệu năng | Lighthouse mobile ≥ 70, lấy trung vị 3 lần |
| Mức thâm nhập | Chỉ đọc, không phá hại (ADR-11) |

### C. Kiểm soát thay đổi yêu cầu

Mọi thay đổi SRS sau baseline (ngày 3) ghi vào bảng lịch sử phiên bản; người đề xuất cập nhật RTM và test case liên quan trong vòng 1 ngày, Mạnh duyệt. Với hệ thống đích, "thay đổi" thường do chính site đích thay đổi — khi phát hiện, ghi vào `docs/defects/defects.csv` như một điểm không nhất quán của tài liệu đích so với SRS, không sửa SRS ngay mà chờ đánh giá mức độ ảnh hưởng tới test case.
