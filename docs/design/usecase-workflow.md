# Thiết kế test — Use case, Workflow, Exploratory và Vòng đời lỗi

Mã tài liệu: TD-UC-WF-EX · Phiên bản 1.0 · Ngày 2026-11-19 · Người phụ trách: **Lộc (TV4)**

Đầu vào: SRS-01 v1.2 §4 (UC-01…UC-08), §5, §6 · Cẩm nang §4.6, §6.1 · Phục vụ yêu cầu **H2-2** của Hướng 2 (thiết kế test) · Test case sinh ra: **78 ca UC + 37 ca Use case** = 115/226 ca (50,9% bộ test)

---

## 1. Cơ sở lý thuyết

### 1.1 Kiểm thử dựa trên Use case và Luồng công việc (Cẩm nang §4.6)

Căn cứ thiết kế là **kịch bản tương tác người dùng ↔ hệ thống**, kiểm tra **từ đầu đến cuối** (End-to-End). Hai loại kịch bản bắt buộc:

| Loại | Định nghĩa | Áp dụng trong dự án |
|---|---|---|
| **Main Success Scenario** | Luồng chính thành công — mọi điều kiện hợp lệ | Ca `Technique = UC` gắn với luồng chính của từng UC |
| **Alternate / Extension Paths** | Luồng rẽ nhánh / ngoại lệ — nhập sai, hủy giữa chừng, trạng thái lỗi | Ca `Technique = Use case` + các ca `EP`/`DT`/`ST` gắn với cột "Luồng rẽ nhánh" của SRS §4 |

### 1.2 Vì sao UC/Workflow chiếm 51% bộ test trong đồ án này

Với hệ thống **đang hoạt động** mà nhóm **không có mã nguồn** (ADR-13), UC là kỹ thuật bám sát nhất với đặc tả đích:

| Lý do | Giải thích |
|---|---|
| Đặc tả đích được viết từ **quan sát hành vi**, không phải từ mã | UC mô tả đúng thứ nhóm quan sát được: người dùng làm gì trên UI |
| Mô hình V thích nghi (ADR-13) cần một tầng kiểm thử **end-to-end** | UC là tầng đó — từ trang chủ đến thông báo xác nhận |
| 8 UC đã được Inspection bổ sung **cột luồng rẽ nhánh** (RV-07) | Nhờ vậy UC có đủ căn cứ để sinh ca, không chỉ dừng ở 1 dòng mô tả |
| 3 hệ thống dùng **3 mô hình giá khác nhau** → cần ca "đọc giá" xuyên suốt | UC-01 (T1) và UC-02 (T2) là ca đối chiếu mô hình giá |

### 1.3 Vòng đời lỗi (Cẩm nang §6.1)

```
New → Assigned → Open → Fixed → Pending Retest → Retest → Closed
                                                    └→ Reopened (nếu test lại vẫn Fail)
```

Nhóm mở rộng thêm 3 trạng thái cho vòng đời **sản phẩm bên thứ ba** (lỗi của site đích, nhóm không sửa được): `Deferred` (chờ chủ hệ thống xử lý) · `Rejected` (không phải lỗi, đã đóng kèm lý do).

---

## 2. Sơ đồ luồng 8 use case (SRS §4)

### 2.1 UC-01 — Xem danh mục dịch vụ và bảng giá (T1, T2, T3)

```
   [Khách vào trang chủ]
            │
            ▼
   ┌─────────────────────┐   N3: danh mục rỗng / không tải được
   │ Danh mục dịch vụ    │──────────────────► [Thông báo lỗi thay vì trang trắng]
   │ hiển thị?          │
   └──────────┬──────────┘
              │ Có
              ▼
   ┌─────────────────────┐   N1: dịch vụ "báo giá riêng" (T2)
   │ Đọc giá từng dịch   │──────────────────► [Hiện khoảng 50.000–500.000₫, không số đơn lẻ]
   │ vụ + thời lượng     │
   └──────────┬──────────┘
              │
              ▼
   ┌─────────────────────┐   N2: T3 tách phụ thu ngày lế / khẩn cấp
   │ Đối chiếu phụ thu   │──────────────────► [Phụ thu hiển thị tách riêng, khép lại vào giá dịch vụ]
   │ riêng ngoài dịch vụ │
   └─────────────────────┘
```

Test case truy xuất: `TC-T1-M2-001`, `TC-T1-M2-002`, `TC-T1-M2-007`, `TC-T2-M2-001`, `TC-T2-M2-004`, `TC-T2-M2-006`, `TC-T3-M2-001`, `TC-T3-M2-007`, `TC-T3-M3-005` (9 ca)

### 2.2 UC-02 — Tính giá dự kiến bằng calculator (T2, T3)

```
   [Chọn loài]
       │  N1: bỏ qua bước cân nặng (T2)
       ▼
   ┌──────────────┐
   │ Chọn bậc kg │──────────────► [Giá không hiển thị]
   └──────┬───────┘
          ▼
   ┌──────────────┐   N2: dịch vụ "báo giá riêng"
   │ Chọn dịch vụ│────────────────► [Khung giá dạng tham khảo, không có số đơn lẻ]
   └──────┬───────┘
          ▼
   ┌──────────────┐   N4: T3 không có bước chọn bậc
   │ Hiển thị giá │────────────────► [T3 chọn dịch vụ theo bậc lbs trong tên]
   │ dự kiến     │
   └──────┬───────┘
          │ N3: đổi bất kỳ lựa chọn nào
          ▼
   [Giá tính lại tức thì]
```

Test case truy xuất: `TC-T2-M3-001`, `TC-T2-M3-004`, `TC-T2-M3-005`, `TC-T2-M3-006`, `TC-T2-M3-007`, `TC-T2-M3-011`, `TC-T3-M3-001`, `TC-T3-M3-002`, `TC-T3-M3-003` (9 ca)

### 2.3 UC-03 — Giữ chỗ / đặt lịch (T1, T2, T3)

```
   [Chọn loài] ──N1: chưa chọn loài──► [Nút "Tiếp tục" bị khoá]
       │
       ▼
   [Chọn bậc / gói] ──N2: bỏ qua──► [Giá không hiển thị]
       │
       ▼
   [Chọn dịch vụ]
       │
       ▼
   [Nhập SĐT + tên bé + ngày] ──N3: ngày trong quá khứ──► [Không chọn được]
       │                                          ──N4: T2 ngày > 30 ngày──► [Được nhập, phải giải thích theo lịch mở cửa]
       ▼
   [Gửi form]
       │
       ▼
   [Thông báo giữ chỗ thành công + tóm tắt lựa chọn]
```

Test case truy xuất: `TC-T1-M4-001`, `TC-T1-M4-006`, `TC-T2-M4-001`, `TC-T2-M4-008`, `TC-T2-M4-010`, `TC-T2-M4-011`, `TC-T3-M4-001`, `TC-T3-M4-006`, `TC-T3-M4-009` (9 ca) + 18 ca ST phụ trợ trong `docs/design/state-transition.md`

### 2.4 UC-04 — Gửi thông tin giữ chỗ qua form (T1, T2)

```
   [Nhập SĐT] ──N1: sai định dạng──► [Báo lỗi tại chỗ, nêu đúng tên trường]
       │
       ▼
   [Chọn ngày mong muốn] ──N2: ngoài lịch mở cửa──► [Không có khung giờ khả dụng]
       │
       ▼
   [Gửi form] ──N3: thành công──► [Thông báo xác nhận + mã lịch hẹn]
```

Test case truy xuất: `TC-T1-M4-004`, `TC-T2-M4-002`, `TC-T2-M4-003`, `TC-T2-M4-004`, `TC-T2-M4-005`, `TC-T2-M4-006`, `TC-T2-M4-007` (7 ca)

### 2.5 UC-05 — Xem chính sách lịch (hủy/đổi) (T1)

```
   [Mở FAQ / trang chính sách]
       │
       ▼
   ┌────────────────────────┐   N1: hủy trong khung xác nhận qua Zalo
   │ Nội dung điều kiện    │──────────────────► [Trừ 1 lượt đặt lịch]
   │ hủy/đổi lịch?         │
   └───────────┬────────────┘
               │ N2: không có Zalo
               ▼
   [Hướng dẫn kênh liên hệ khác]
               │
               ▼
   N3: hủy trong vòng 24h giờ đã đặt → [Không hoàn cọc]
```

Test case truy xuất: `TC-T1-M5-003`, `TC-T1-M5-004`, `TC-T1-M5-005`, `TC-T1-M5-006`, `TC-T2-M5-003`, `TC-T2-M5-004`, `TC-T2-M5-005` (7 ca)

### 2.6 UC-06 — Tìm kiếm nội dung (T2)

```
   [Nhập từ khoá]
       │  N2: từ khoá rỗng
       ▼
   ┌──────────────┐
   │ Lọc danh     │──────────────► [Không gọi tìm kiếm, hiện toàn bộ danh sách]
   │ sách        │
   └──────┬───────┘
          │ N1: không có kết quả
          ▼
   [Thông báo "không tìm thấy"]
          │
          ▼
   N3: kết quả trả về từ nhiều nhóm nội dung
```

Test case truy xuất: `TC-T2-M7-001`, `TC-T2-M7-002`, `TC-T2-M7-003`, `TC-T2-M7-004` (4 ca)

### 2.7 UC-07 — Chuyển đổi ngôn ngữ (T1, T2)

```
   [Bấm chuyển sang tiếng Anh]
       │
       ▼
   ┌────────────────────────┐   N2: tải lại trang ở ngôn ngữ đã chọn
   │ Giữ nguyên ngữ cảnh   │──────────────────► [Vẫn giữ ngôn ngữ đã chọn]
   │ trang đang xem?        │
   └───────────┬────────────┘
               │ N3: T3 chỉ có tiếng Anh
               ▼
   [Không có điều khiển chuyển ngữ trên T3]
```

Test case truy xuất: `TC-T1-M7-001`, `TC-T2-M7-005`, `TC-T3-M7-002` (3 ca)

### 2.8 UC-08 — Liên hệ tiệm qua kênh công khai (T1, T2, T3)

```
   [Mở trang liên hệ / footer]
       │
       ▼
   ┌────────────────────────┐   N1: bấm số điện thoại
   │ Kiểm tra kênh liên hệ │──────────────────► [Mở ứng dụng gọi]
   └───────────┬────────────┘
               │ N2: bấm email
               ▼
   [Mở ứng dụng soạn thư]
               │
               ▼
   N3: giờ ngoài khung mở cửa → [Vẫn gọi được, tiệm không trực]
```

Test case truy xuất: `TC-T1-M7-002`, `TC-T2-M7-006`, `TC-T2-M7-007`, `TC-T3-M7-001` (4 ca)

---

## 3. Workflow — chuỗi hoạt động liên module

UC chỉ mô tả **một** tương tác. Workflow mô tả **chuỗi** nhiều tương tác nối tiếp — đây là tầng kiểm thử **tích hợp** trong mô hình V thích nghi (ADR-13).

| # | Workflow | Chuỗi module | Kỳ vọng | Test case truy xuất |
|---|---|---|---|---|
| **WF-1** | Tra cứu giá từ trang chủ | M1 → M2 → M3 | Từ trang chủ điều hướng tới bảng giá, chọn bậc và dịch vụ → đọc được giá **không cần rời site** | `TC-T1-M1-002`, `TC-T1-M3-001`, `TC-T2-M1-002`, `TC-T2-M3-001` |
| **WF-2** | Tra cứu giá → giữ chỗ | M3 → M4 → M5 | Giá đọc ở M3 và giá trong tóm tắt ở M4 phải **khớp nhau** | `TC-T2-M3-004`, `TC-T2-M3-011`, `TC-T2-M4-010` |
| **WF-3** | Giữ chỗ → đọc chính sách | M4 → M5 | Từ form giữ chỗ, tìm được chính sách hủy/đổi trong **≤ 2 lần click** | `TC-T1-M5-003`, `TC-T2-M5-003`, `TC-T3-M5-002` |
| **WF-4** | Dịch vụ tại nhà → phụ thu | M6 → M3 | Chọn "tại nhà" → nhập địa chỉ → tổng tiền = giá gói + phụ thu cố định + phụ thu di chuyển | `TC-T1-M6-002`, `TC-T1-M6-014`, `TC-T1-M6-020` |
| **WF-5** | Tìm kiếm → mở dịch vụ | M7 → M2 | Từ kết quả tìm kiếm mở được trang dịch vụ, giá khớp với bảng giá | `TC-T2-M7-001`, `TC-T2-M2-001`, `TC-T2-M2-006` |
| **WF-6** | Liên hệ từ mọi trang | M1 → M7 | Từ trang chủ, điều hướng tới trang liên hệ; kênh liên hệ hoạt động ở cả header lẫn footer | `TC-T1-M7-002`, `TC-T2-M7-006`, `TC-T3-M7-001` |
| **WF-7** | Đặt lịch 3 hệ thống — đối chiếu | M4 (T1/T2/T3) | Cùng một bộ dữ liệu → **3 kết luận khác nhau** về giá (3 mô hình giá) — đây là kết luận cần ghi vào báo cáo tích hợp, **không phải lỗi** | `TC-T1-M3-002`, `TC-T2-M3-002`, `TC-T3-M3-002` |

> **WF-7 là workflow quan trọng nhất của đồ án** — nó chứng minh giá trị của Hướng 2: ba hệ thống cùng bán dịch vụ chăm sóc thú cưng nhưng dùng ba mô hình giá khác nhau (bậc kg × gói / bậc kg × dịch vụ / dịch vụ theo bậc lbs). Kết luận "3 giá khác nhau từ cùng một đầu vào" là **phát hiện**, không phải defect.

---

## 4. Exploratory testing — 3 hiếu chương khám phá

### 4.1 Nguyên tắc

Khám phá (Exploratory Testing) bổ sung cho thiết kế script: thay vì chạy ca có kịch bản cố định, người kiểm thử dùng **mục tiêu** để điều hướng trong 60 phút, ghi lại những gì quan sát được. Chạy **sau** vòng 1 (Ngày 11) để tránh lặp lại ca đã viết.

**Ràng buộc ADR-11 áp dụng cho khám phá**: không bấm nút gửi cuối, không tạo tài khoản, không payload phá hại, tối đa 10 VU.

### 4.2 Hiếu chương khám phá E1 — "Tìm đường đi tắt của người dùng thật" (T2)

| Mục | Nội dung |
|---|---|
| **Mục tiêu** | Tìm cách khách dùng thật để **làm đẹp giá nhanh nhất** — thao tác tối thiểu, và các đường tắt mà ca thiết kế không nghĩ tới |
| **Phạm vi** | `matpet.vn/spa` — toàn bộ trang, không đi vào luồng gửi form |
| **Bảng mốc định lịch khảo sát** | 0–5 phút · 5–15 phút · 15–30 phút · 30–45 phút · 45–60 phút — ghi lại điều gì đã thử ở mốc nào |
| **Câu hỏi định hướng** | Có đường nào ra giá nhanh hơn 4 bước (loài → bậc → dịch vụ → đọc giá)? NFR-03 yêu cầu ≤ 5 thao tác — có thực tế đạt không? |
| **Ghi chú bắt buộc** | Mỗi lần thử ghi: mốc thời gian · thao tác đã làm · kết quả quan sát · ảnh chụp nếu có |
| **Kết quả mong đợi** | Danh sách "đường tắt" tìm được · đánh giá lại ngưỡng NFR-03.1 (≤ 5 thao tác) · lỗi phát hiện nếu có |
| **Test case liên quan** | `TC-NFR-03-001` (hoàn tất luồng tính giá trong ≤ 5 thao tác) |

### 4.3 Hiếu chương khám phá E2 — "Điểm mù của form" (T1 + T3)

| Mục | Nội dung |
|---|---|
| **Mục tiêu** | Tìm các trường form **mà nhóm đã bỏ sót** khi viết ca — đặc biệt là trường không bắt buộc nhưng ảnh hưởng kết quả |
| **Phạm vi** | Modal đặt lịch T1 (bước 2–4) · Drawer "Book Now" T3 |
| **Bảng mốc định lịch khảo sát** | Mỗi bước wizard T1 (4 bước) là 1 mốc · Drawer T3 (3 mốc) |
| **Câu hỏi định hướng** | Có trường nào không ghi rõ là tuỳ chọn? Trường nào bị bắt buộc một cách phi lý? Nhập ký tự lạ vào từng trường → thông báo có nêu đúng tên trường không? |
| **Ghi chú bắt buộc** | Ảnh chụp mỗi trường · văn bản thông báo lỗi nguyên văn · trường nào bị bỏ sót |
| **Kết quả mong đợi** | Bổ sung ca cho các trường bị bỏ sót (nếu có) hoặc xác nhận bộ ca đã đủ |
| **Test case liên quan** | `TC-T1-M4-001`, `TC-T1-M4-002`, `TC-T2-M4-001`, `TC-T3-M4-001`, `TC-NFR-03-002` |

### 4.4 Hiếu chương khám phá E3 — "Đường vòng tới nội dung quan trọng" (cả 3 site)

| Mục | Nội dung |
|---|---|
| **Mục tiêu** | Kiểm tra **khả năng tìm thấy** của nội dung quan trọng: bảng giá, chính sách hủy, thông tin liên hệ, giờ mở cửa — có thấy được trong ≤ 2 lần click từ trang đặt lịch không? |
| **Phạm vi** | T1, T2, T3 — trang chủ và trang đặt lịch |
| **Bảng mốc định lịch khảo sát** | Mỗi loại nội dung × mỗi hệ thống = 1 mốc (4 × 3 = 12 mốc) |
| **Câu hỏi định hướng** | Có nội dung nào phải đào 3–4 cấp menu mới tới? Nội dung nào chỉ nằm trong footer? Nội dung nào phải tìm kiếm mới ra? |
| **Ghi chú bắt buộc** | Sơ đồ đường đi (từ trang đặt lịch → nội dung) · số lần click · ảnh chụp |
| **Kết quả mong đợi** | Bảng "khả năng tìm thấy" cho 4 loại nội dung × 3 hệ thống — đối chiếu tiêu chí SRS §8.3 ("≤ 2 lần click") |
| **Test case liên quan** | `TC-T1-M5-003`, `TC-T2-M5-003`, `TC-T3-M5-002`, `TC-T1-M6-017`, `TC-T1-M7-002` |

### 4.5 Quy tắc ghi nhận phiên khám phá

Mỗi phiên khám phá tạo **1 file** trong `reports/raw/` đặt tên `explore-<system>-<date>.md` với cấu trúc bắt buộc:

```markdown
# Phiên khám phá E<n> — <Hệ thống> — <Ngày>
- Người thực hiện: <tên> · Thời lượng: 60 phút
- Hiếu chương: E1 / E2 / E3

## Bảng mốc khảo sát
| Mốc | Đã thử gì | Kết quả quan sát | Ảnh/bằng chứng |

## Lỗi tìm được
| Mã lỗi | Mô tả | Trùng DEF-xxx? |

## Đề xuất bổ sung test case
| Đề xuất | Kỹ thuật | Vì sao cần |
```

> **Quy tắc quan trọng:** lỗi tìm được trong phiên khám phá phải được ghi vào `docs/defects/defects.csv` bằng `scripts/tc-record.mjs` — **không** ghi thẳng vào báo cáo riêng. Nếu không, exit criteria EC-3 sẽ đánh giá sai.

---

## 5. Vòng đời lỗi — áp dụng cho hệ thống đích

### 5.1 Sơ đồ trạng thái đầy đủ

```
   ┌──────┐
   │ New  │  phát hiện trong phiên khám phá hoặc khi chạy ca
   └──┬───┘
      │ triage (Lộc, cuối mỗi ngày thực thi)
      ▼
   ┌──────────┐   không phải lỗi site đích   ┌───────────┐
   │ Assigned │──────────────────────────────►│ Rejected  │
   └────┬─────┘                                └───────────┘
        │ xác nhận là lỗi thật
        ▼
   ┌──────┐
   │ Open │  ← lỗi của bên thứ ba: không ai sửa được, nhưng vẫn báo cáo
   └──┬───┘
      │ site đích sửa (hoặc chủ site xác nhận đã xử lý)
      ▼
   ┌───────┐
   │ Fixed │
   └──┬────┘
      │ chạy lại ca (retest)
      ▼
   ┌────────────────┐
   │ Pending Retest │
   └──┬──────────┬──┘
      │ Pass     │ Fail
      ▼          ▼
  ┌────────┐  ┌──────────┐
  │ Retest │  │ Reopened │──► quay lại Open
  └───┬────┘  └──────────┘
      │ Pass
      ▼
  ┌────────┐
  │ Closed │  (hoặc Deferred nếu chủ site xác nhận sẽ xử lý sau)
  └────────┘
```

### 5.2 Quy tắc nghiệm thu vòng đời lỗi

| Quy tắc | Vì sao | Kiểm bằng |
|---|---|---|
| Mọi lỗi phải có **Test_Case_ID** trỏ về ca đã tạo ra nó | Lỗi không truy được về test case = lỗi không có test basis | `scripts/rtm-check.mjs` |
| Lỗi hạ tầng (timeout, `ERR_INTERNET_DISCONNECTED`, `ENOTFOUND`) **không** ghi vào defect log | Đây là sự cố mạng của nhóm, không phải lỗi site đích | Kiểm tra thủ công khi triage |
| Lỗi của bên thứ ba **vẫn ghi vào defect log**, trạng thái `Open`, ghi chú "lỗi của bên thứ ba, không sửa được" | Đó là **kết quả kiểm thử hợp lệ** — nhóm là bên kiểm thử độc lập | EC-3 |
| **Không hạ tiêu chí** để ép xanh | Nếu site thật sự thiếu header bảo mật thì ca phải Fail và phải có defect | Quy tắc trong `docs/ASSIGNMENT.md` §5.3 |
| Mọi lỗi phải có **bằng chứng** (ảnh, log, đường dẫn file) | Lỗi không có bằng chứng không thể tái hiện | Kiểm tra thủ công khi review |
| Triage **cuối mỗi ngày thực thi** (Ngày 11, 12) | Không có người phụ trách thì lỗi nằm im không ai xử lý | `docs/PROGRESS.md` |

### 5.3 Bảng vai trò trong vòng đời lỗi

| Vai trò | Người | Trách nhiệm |
|---|---|---|
| Người phát hiện | Thành viên chạy ca | Ghi bằng chứng, mô tả Steps/Expected/Actual |
| Người triage | **Lộc (TV4)** | Xác đận lỗi thật vs lỗi hạ tầng, gán Severity, gán Owner, theo dõi trạng thái |
| Người đóng lỗi | Người viết ca gốc | Chạy lại ca sau khi site sửa, cập nhật `Status` |
| Người duyệt | **Mạnh (TV1)** | Duyệt Severity, xác nhận đóng lỗi, ký báo cáo |

---

## 6. Ví dụ thật trích từ test case

### 6.1 Ví dụ 1 — UC bắt được lỗi mà kiểm thử từng phần không thấy

`TC-T2-M4-010` (UC-04, luồng chính): tóm tắt lựa chọn hiển thị **loài, bậc cân nặng, dịch vụ và giá**.

**Vì sao cần UC chứ không chỉ kiểm tra từng trường:** nếu chỉ test riêng "hiển thị loài" (M4) và "hiển thị giá" (M3) thì sẽ **không** phát hiện trường hợp tóm tắt hiển thị loài **Mèo** nhưng giá lấy theo bậc của **Chó** — hai thành phần đều "đúng" riêng lẻ nhưng sai khi ghép. Đây là lỗi **tích hợp dữ liệu**, chỉ xuất hiện ở tầng end-to-end.

### 6.2 Ví dụ 2 — Workflow WF-4 bắt được lỗi cộng sai tổng

`TC-T1-M6-014` là ca riêng của Mạnh (DT), nhưng nó chỉ có ý nghĩa khi đặt trong **WF-4** (M6 → M3): chọn "tại nhà" (M6) → nhập địa chỉ (M6) → đọc tổng tiền (M3).

**Bài học:** cùng một test case nhưng **đặt trong workflow** thì nêu được lý do tồn tại của nó. Đây là điểm khác biệt giữa "có test case" và "có thiết kế test".

### 6.3 Ví dụ 3 — Exploratory E1 có thể phủ hiệu suất nào ca thiết kế không có

Ca `TC-NFR-03-001` yêu cầu "hoàn tất luồng tính giá trong **≤ 5 thao tác**" — nhưng thiết kế test không biết người dùng thật đi đường nào. Hiếu chương E1 đặt mục tiêu "tìm đường đi tắt" để trả lời: liệu có đường nào ra giá nhanh hơn, và đường ngắn nhất có vượt 5 thao tác không?

**Bài học:** Exploratory testing bổ sung cho thiết kế bằng **câu hỏi**, không phải bằng **ca**. Giá trị của nó là phát hiện phần việc mà bộ ca chưa nghĩ tới — và đây cũng là lý do nhóm **không** coi exploratory là thay thế cho thiết kế test.

---

## 7. Hạn chế và khi nào KHÔNG dùng UC / Workflow / Exploratory

| Hạn chế | Giải thích | Xử lý trong dự án |
|---|---|---|
| **UC không đảm bảo bao phủ dữ liệu biên** | UC kiểm tra luồng, không kiểm tra giá trị biên của từng trường | Kết hợp **EP/BVA** cho dữ liệu (`docs/design/test-design-techniques.md`) |
| **UC không đảm bảo bao phủ đường đi trạng thái** | Một UC đi qua luồng chính không phát hiện được chuyển trạng thái bị chặn sai | Kết hợp **ST** cho wizard (`docs/design/state-transition.md`) |
| **UC dễ "thành công giả"** | Ca chạy được nhưng kỳ vọng ghi chung chung → luôn Fail hoặc luôn Pass | Tiêu chí chấp nhận định lượng trong SRS §5; ca phải nêu con số cụ thể |
| **Workflow dài thì tốn thời gian và dễ đứt** | Chuỗi 5+ module × 3 hệ thống = nhiều giờ chạy | Chỉ định nghĩa **7 workflow** cốt lõi, tập trung vào chỗ dễ lệch dữ liệu (WF-2, WF-4, WF-7) |
| **Exploratory không lặp lại được** | Không có ca cố định → khó tái hiện, khó chứng minh trong Final Test Report | Bắt buộc ghi bảng mốc + ảnh chụp (§4.5) → lỗi tìm được vẫn tái hiện được qua ca mới sinh ra |
| **Exploratory phụ thuộc kinh nghiệm người thực hiện** | Người không quen sẽ tìm ít hơn | Chỉ định rõ **mục tiêu** và **bảng mốc định lịch khảo sát** cho từng hiếu chương → 2 người khác làm cùng hiếu chương được kết quả tương đương |
| **UC của hệ thống đích có thể không khớp thực tế** | Đặc tả đích là "as-observed" nhưng vẫn có thể sai ở chi tiết | Đã kiểm chứng bằng Inspection ngày 3 (10 phát hiện RV-01…RV-10, 2 Major đã sửa) |
| **Không kiểm thử được phần sau khi bấm gửi** | ADR-11 cấm gửi form thật → luồng "xác nhận thành công" không chạy được | Ghi trong báo cáo là **"Không kiểm thử được theo ADR-11"** — **không** đánh dấu Pass |

---

## 8. Đối chiếu yêu cầu

| Yêu cầu Hướng 2 | Mức độ đáp ứng của tài liệu này |
|---|---|
| **H2-2 Thiết kế test** | 8 sơ đồ luồng UC (đủ nhánh/ngoại lệ theo SRS §4) · 7 workflow liên module · 3 hiếu chương khám phá có bảng mốc · 1 vòng đời lỗi 11 trạng thái → **115/226 ca (50,9%)** truy xuất về UC/Workflow |
| **H2-3 Kiểm thử không phá hại** | Ràng buộc ADR-11 được cài vào từng hiếu chương khám phá (§4.1) và vào quy tắc ghi nhận (§4.5) |
| **H2-4 Truy vết & báo cáo** | Vòng đời lỗi là trục cho defect log → EC-3; workflow WF-7 là đầu vào cho báo cáo kiểm thử tích hợp (Ngày 10) |

Người review chéo: **Tài** (Ngày 8) · Đóng góp vào `docs/design/test-design-techniques.md`.
