# Phân công và hướng dẫn thực hiện — Kiểm thử 3 hệ thống Pet Spa

Mã tài liệu: ASG-01 · Phiên bản 1.0 · Ngày 2026-11-14 · Người lập: Mạnh (TV1, Test Lead)

Đọc kèm: `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` (kế hoạch 14 ngày), `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v1.0), `docs/source/Kế hoạch Kiểm thử (Test Plan).md` (TP-01 v1.0), `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` (RTM-01 v1.0).

---

## 0. Trước khi bắt đầu: đọc gì, theo thứ tự nào

| Bước | Tài liệu | Mục đích | Thời gian |
|---|---|---|---|
| 1 | `docs/source/Hệ thống Đặt lịch... Spa.md` §0–§7 | Hiểu hướng đồ án, ranh giới an toàn, lịch 14 ngày, phân công | 15 phút |
| 2 | `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` | Test basis — 58 yêu cầu, 16 BR, bảng quyết định, bảng chuyển trạng thái | 45 phút |
| 3 | `docs/source/Kế hoạch Kiểm thử (Test Plan).md` | Chiến lược, kỹ thuật thiết kế test, tiêu chí vào/kết thúc | 30 phút |
| 4 | `docs/reference/pricing-baseline.md` | Bảng giá tham chiếu chốt ngày 2 — dùng để đối chiếu | 20 phút |
| 5 | `docs/testcases/<system>.csv` | Test case của đúng hệ thống bạn phụ trách | 30 phút |
| 6 | `docs/backlog.md` + `docs/backlog.csv` | Danh sách công việc MoSCoW của bạn, có sẵn cột `Owner` | 15 phút |

> **Không cần đọc** `archive/2026-11-13-webapp-pivot/` — đó là mã nguồn hệ thống webapp mà nhóm từ xây trước đây, đã bị bỏ theo ADR-09 và **không còn là đối tượng kiểm thử**. Giữ trong repo chỉ để lưu lịch sử dự án.

---

## 1. Ba hệ thống đích

| Mã | Hệ thống | URL | Công nghệ | Bảng giá |
|---|---|---|---|---|
| **T1** | Pet NGON — Spa & Grooming Tận Nhà | `https://petngon.vn/vi` | Next.js, render server | Tĩnh, 6 gói × 14 dòng loài/cân nặng |
| **T2** | Mật Pet Family | `https://matpet.vn/spa` | WordPress + React | Tĩnh **và** calculator 3 bước |
| **T3** | Pretty Paws Cat and Dog Grooming | `https://prettypawscatanddoggrooming.groomore.com/` | Groomore (SaaS) | API JSON `booking-api/v1/service` |

Lưu ý đường dẫn: `matpet.vn/dat-lich` trả **404**; luồng thật nằm ở `matpet.vn/spa`.

---

## 2. Ranh giới kiểm thử an toàn (ADR-11) — áp dụng cho mọi người

**Được phép:**

- GET mọi trang công khai, đọc nội dung, bảng giá, điều khoản.
- Chọn lựa chọn trong form (loài, cân nặng, dịch vụ, ngày) và **đọc giá hiển thị**.
- Kiểm tra header HTTP, cookie, TLS, `robots.txt`, `sitemap.xml`.
- Chạy axe-core, Lighthouse, kiểm tra DOM.

**Không được phép:**

| Không được | Lý do |
|---|---|
| Bấm nút gửi cuối cùng ("Đặt lịch", "Book Now", "Xác nhận") | Tạo lịch thật trong hệ thống của chủ site → gây rác dữ liệu |
| Tạo tài khoản, đăng nhập, đăng ký | Tạo dữ liệu rác |
| Gửi payload phá hại (SQL injection, XSS không vô hại, DoS) | Vi phạm ranh giới "kiểm thử không phá hại" |
| Tải lặp quá 10 VU hoặc tần suất cao | Gây tải nặng cho site bên thứ ba |
| Nhập số điện thoại thật của ai đó | Rò rỉ dữ liệu cá nhân |

**Mức tải cho phép:** tối đa 10 VU, chạy ngoài giờ cao điểm nếu được phép, giữ lễ tinh giữa các lần gọi.

---

## 3. Phân công theo thành viên

### 3.1 Mạnh — Trưởng nhóm / Test Lead (TV1)

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T3** (chính) | Toàn bộ test case `docs/testcases/t3.csv` (44 ca) |
| Chuyên trách | NFR-02 | Kiểm thử bảo mật: header, cookie, TLS, phản xạ đầu vào, rò rỉ thông tin |
| Tài liệu | — | Test Plan (TP-01), RTM (RTM-01), điều phối Inspection, Exit criteria, Final Test Report, Lessons learned |
| Kiểm thử tích hợp | T1, T2 | Tổng hợp báo cáo tích hợp từ 3 site (Ngày 10) |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | Khảo sát sâu T3: bảng giá theo dòng sản phẩm, giờ mở cửa theo ngày, luồng "Book Now", trạng thái Open/Closed | `docs/reference/pricing-baseline.md` mục 4 |
| 3 | **Moderator** cuộc Inspection SRS-01; ghi biên bản | `docs/reviews/inspection-srs.md` |
| 4 | Thiết kế test: bảng quyết định, bảng chuyển trạng thái, định nghĩa template test case | `docs/design/` |
| 5 | **Technical Review** thiết kế test → v1.0; Test Plan v1.0 chốt | Biên bản TR |
| 8 | Review chéo test case theo checklist 4C; chốt RTM 100% | `docs/rtm.csv` |
| 9 | Chuẩn bị môi trường, bộ dữ liệu test, Walkthrough thiết kế test | Báo cáo tĩnh |
| 11 | System test vòng 1 T3 + NFR-02 | Execution log, defect log |
| 13 | Chấm Exit criteria; đóng băng bộ test | `reports/exit-criteria.md` |
| 14 | Final Test Report + Lessons learned | Hồ sơ nộp |

### 3.2 Tài — Hệ thống T2, hạ tầng (TV2)

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T2** (chính) | Toàn bộ test case `docs/testcases/t2.csv` (66 ca) |
| Viết và chạy test | T1 | 72 ca của `docs/testcases/t1.csv` |
| Chuyên trách | NFR-03, NFR-04 | Khả năng dùng (số thao tác, thông báo lỗi, bàn phím) và tương thích (trình duyệt, 360px) |
| Hạ tầng | — | Repo, Playwright + TypeScript, k6, Lighthouse CLI, ESLint |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Đối chiếu ma trận giá T2**: 6 bậc cân nặng × 2 loài × 3 dịch vụ — ghi nhận mọi ô lệch | `reports/raw/survey-T2-matrix.csv` |
| 3 | Reviewer SRS phần Tài (M1–M7 của T2) | Biên bản Inspection |
| 4 | Thiết kế test: ma trận loài × bậc × dịch vụ; bộ dữ liệu test | Bộ thiết kế test |
| 5 | Dựng `tests/e2e/t2/*.spec.ts` | Script mẫu chạy được |
| 6–7 | Viết test case T2 theo EP, BVA, DT, ST, UC | `docs/testcases/t2.csv` |
| 8 | Hoàn thiện script Playwright theo test case; k6 script | Bộ tự động hóa |
| 9 | Chạy thử bộ E2E lần 1; sửa script | Smoke xanh |
| 10 | **Kiểm thử tích hợp T2**: quan sát network, hợp đồng dữ liệu bảng giá ↔ calculator, validation biên | Báo cáo tích hợp |
| 11–12 | System test T2 + T1; re-test lỗi; NFR-03, NFR-04 | Execution log, defect log |
| 13 | Regression tự động (E2E + API) toàn bộ | Regression report |
| 14 | Đóng gói hồ sơ nộp, tag repo v1.0; script + video demo | Hồ sơ nộp |

### 3.3 Ngân — Hệ thống T3, thiết kế test, hiệu năng (TV3)

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T3** (chính) | Toàn bộ test case `docs/testcases/t3.csv` (44 ca) |
| Viết và chạy test | T2 | 66 ca của `docs/testcases/t2.csv` |
| Chuyên trách | NFR-01, NFR-05 | Hiệu năng (Lighthouse) và độ tin cậy (gửi form lặp, lỗi mạng, giữ trạng thái) |
| Thiết kế | — | Bảng quyết định và bảng chuyển trạng thái; kịch bản Lighthouse; khung Playwright |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Đối chiếu giá T3**: 8 dịch vụ chính, giá + thời lượng giữa API và trang đặt lịch | `reports/raw/survey-T3-ui-prices.csv` |
| 3 | Reviewer SRS phần Ngân (T3, NFR-01, NFR-05) | Biên bản Inspection |
| 4 | Thiết kế test: EP/BVA cho form giữ chỗ; bộ kịch bản E2E; khung Playwright | Bộ thiết kế test |
| 5 | Dựng bộ k6 script; kịch bản Lighthouse | Script mẫu |
| 6–7 | Viết test case T3 theo EP, BVA, DT, UC | `docs/testcases/t3.csv` |
| 8 | Kịch bản khám phá; Lighthouse theo site | Bộ tự động hóa |
| 9 | Chạy Lighthouse 3 site × 3 lần; xuất số liệu thô hiệu năng | Số liệu thô |
| 10 | **Kiểm thử tích hợp T3**: API slot/dịch vụ, endpoint `booking-api/v1/service` | Báo cáo tích hợp |
| 11–12 | System test T3 + T2; re-test lỗi; NFR-01, NFR-05 | Execution log, defect log |
| 13 | Regression k6 + Lighthouse; đối chiếu lại bảng giá | Regression report |
| 14 | Slide, thuyết trình | Hồ sơ nộp |

### 3.4 Lộc — Đối chiếu chéo, lỗi, a11y/SEO, UAT (TV4)

| Hạng mục | Hệ thống | Trách nhiệm |
|---|---|---|
| Viết và chạy test | **T2** (đối chiếu) | Đối chiếu chéo với Tài — cùng dữ liệu, phải ra cùng kết luận |
| Viết và chạy test | T1 | 72 ca của `docs/testcases/t1.csv` |
| Chuyên trách | NFR-06, NFR-07 | Khả năng tiếp cận (axe-core, tương phản, alt, `h1`) và SEO (title, meta, `lang`, sitemap, robots, OG) |
| Quản lý | — | Defect log và triage, checklist usability, UAT, slide demo |

**Việc cụ thể theo ngày:**

| Ngày | Việc | Gate |
|---|---|---|
| 2 | **Sửa SRS-01 v1.1**: `BR-03`, `BR-12`, mục 3.2, 3.3 theo phát hiện P2/P4/P5; đề xuất cách xử lý P1 | Bản vá SRS |
| 3 | Reviewer SRS phần Lộc (NFR, dữ liệu, thuật ngữ) | Biên bản Inspection |
| 4 | Thiết kế test: checklist usability, a11y, SEO; kịch bản khám phá | Bộ thiết kế test |
| 5 | Dựng bộ checklist phi chức năng; bảng mốc định lịch khảo sát | Checklist |
| 6–7 | Viết test case đối chiếu + checklist phi chức năng | Test case đợt 1–2 |
| 8 | Review chéo; tổng hợp checklist phi chức năng | Test case v1.0 |
| 9 | Chạy checklist usability/a11y/SEO lần 1 | Báo cáo tĩnh |
| 10 | **Đối chiếu mô hình giá 3 site**: cùng dữ liệu → cùng kết luận? | Báo cáo tích hợp |
| 11 | Triage lỗi cuối ngày; phiên khám phá 60 phút/site | Defect log |
| 12 | Khả năng tiếp cận NFR-06, SEO NFR-07 | Báo cáo phi chức năng |
| 13 | UAT/Alpha với 5–8 người ngoài nhóm, thu phản hồi | UAT feedback |
| 14 | Slide, thuyết trình | Hồ sơ nộp |

---

## 4. Quy tắc bắt buộc khi viết test case

Mỗi test case trong `docs/testcases/*.csv` phải có đủ **4C**:

| Thành phần | Ý nghĩa | Kiểm tra bằng |
|---|---|---|
| **Correctness** | Đúng yêu cầu trong SRS-01 | Cột `Requirement_ID` trỏ tới đúng ID |
| **Clarity** | Người khác đọc là chạy được ngay | Cột `Title` mô tả rõ đối tượng và kỳ vọng |
| **Completeness** | Phủ cả hợp lệ và ngoại lệ | Dùng đủ EP / BVA / DT / ST / UC theo cột `Technique` |
| **Consistency** | Thuật ngữ và định dạng nhất quán | Cùng cấu trúc cột, cùng cách viết `Title` |

**Cấu trúc cột bắt buộc** (đã có trong file sẵn):

```
TC_ID,Requirement_ID,System,Title,Priority,Technique,Type,Owner,Status
```

| Cột | Giá trị hợp lệ |
|---|---|
| `TC_ID` | `TC-{T1\|T2\|T3\|NFR}-M{1..7}-nnn` · `TC-NFR-0x-nnn` · kịch bản UAT: `TC-UAT-nn` |
| `Requirement_ID` | `FR-Mx-nn` hoặc `NFR-0x` — **bắt buộc tồn tại trong SRS-01** |
| `System` | `T1` · `T2` · `T3` · `ALL` (cho NFR áp dụng cả 3 site) |
| `Title` | Mô tả kiểm tra; phải đủ để thực thi mà không cần hỏi lại |
| `Priority` | `Critical` · `High` · `Medium` · `Low` |
| `Technique` | `EP` · `BVA` · `DT` · `ST` · `UC` · `Use case` |
| `Type` | `Auto` · `Manual` |
| `Owner` | `Mạnh` · `Tài` · `Ngân` · `Lộc` |
| `Status` | `Pass` · `Fail` · `Blocked` · `Not Run` |

**Kỹ thuật thiết kế test bắt buộc dùng** (theo Cẩm nang §4):

| Kỹ thuật | Dùng khi | Ví dụ trong dự án |
|---|---|---|
| **EP** — Phân vùng tương đương | Miền rời rạc: cân nặng, số điện thoại, từ khoá | 7 bậc cân nặng T2; SĐT hợp lệ / không hợp lệ |
| **BVA** — Giá trị biên | Có min/max rõ ràng | SĐT 10 ký tự (biên dưới) và 15 ký tự (biên trên); ngày hôm nay / +30 ngày |
| **DT** — Bảng quyết định | Nhiều điều kiện → nhiều kết quả | Phụ thu di chuyển T1 (C1 khoảng cách × C2 hình thức) — SRS §8.4 |
| **ST** — Chuyển trạng thái | Wizard nhiều bước | Wizard T1 (`W0..W7`) và T2 (`S0..S5`) — SRS §8.1, §8.2 |
| **UC** — Use case | Luồng người dùng hoàn chỉnh | UC-01…UC-08 — SRS §4 |

---

## 5. Ghi nhận kết quả

### 5.1 Test case tự động (Playwright)

```powershell
npm run test:e2e            # toàn bộ
npm run test:e2e:t1         # riêng T1
npm run test:e2e:t2         # riêng T2
npm run test:e2e:t3         # riêng T3
npm run test:a11y           # axe-core NFR-06
npm run test:cross-browser  # NFR-04: Chromium, Firefox, WebKit, Edge
npm run test:perf           # k6 tải đọc (cần k6 ngoài npm)
npm run exec:sync           # đồng bộ kết quả vào reports/execution-log.csv + docs/testcases/*.csv
```

`exec:sync` tự cập nhật cột `Status` trong `docs/testcases/*.csv` và ghi `reports/execution-log.csv`. Không sửa tay các file này.

### 5.2 Test case thủ công

```powershell
node scripts/tc-record.mjs --tc TC-T1-M2-003 --result Pass --by Lộc --note "Đã kiểm tra bằng trình duyệt 360px"
node scripts/tc-record.mjs --tc TC-T2-M4-002 --result Fail --by Ngân --defect DEF-022 --note "SĐT rỗng vẫn gửi được"
```

### 5.3 Ghi nhận lỗi

Lỗi ghi vào `docs/defects/defects.csv`. Quy tắc quan trọng:

| Quy tắc | Giải thích |
|---|---|
| Phân biệt **lỗi sản phẩm** và **lỗi hạ tầng** | `ERR_INTERNET_DISCONNECTED`, timeout, `ENOTFOUND` là sự cố mạng — **không** ghi thành defect của site đích |
| Lỗi của site bên thứ ba vẫn ghi thành defect | Đó là **kết quả kiểm thử hợp lệ**, không phải lỗi của nhóm. Ghi với trạng thái `Open` và ghi chú rõ "lỗi của bên thứ ba, không sửa được" |
| **Không hạ tiêu chí để ép xanh** | Nếu site thật sự thiếu header bảo mật thì test phải Fail và phải có defect tương ứng |
| Bằng chứng là bắt buộc | Ảnh chụp, log lỗi, đường dẫn file trong `reports/playwright/` hoặc `reports/raw/` |

Cột của `docs/defects/defects.csv`:

```
DEF_ID,Severity,System,Requirement_ID,Test_Case_ID,Title,Description,Steps,Expected,Actual,Evidence,Owner,Status,Created
```

`Severity`: `Critical` · `High` · `Medium` · `Low` · `Trivial`. `Status`: `New` · `Assigned` · `In Progress` · `Fixed` · `Verified` · `Closed` · `Deferred` · `Rejected`.

---

## 6. Định dạng commit

```
<type>(<phạm vi>): <mô tả ngắn>

type: feat | fix | docs | test | chore | refactor
phạm vi: t1 | t2 | t3 | nfr | docs | scripts | ci
```

Ví dụ:

```
docs(srs): sua BR-03 va BR-12 theo kiem thu muc 4 pricing-baseline
test(t2): them ca doi chieu ma tran gia chuyen loai
feat(scripts): them survey-t3-services de lay danh muc API
```

---

## 7. Các lệnh kiểm tra chất lượng — chạy trước khi commit

```powershell
npm run lint          # ESLint cho tests/ và scripts/
npm run typecheck     # tsc --noEmit
npm run req:check     # SRS ↔ requirements.csv: ID, ưu tiên, tiêu chí đo được
npm run rtm:build     # sinh lại docs/rtm.csv và docs/rtm.md từ SRS + test case
npm run rtm:check     # truy xuất hai chiều 100%
npm run gate          # req:check + rtm:check + exit:check
```

Tất cả phải **exit 0**. Nếu `req:check` báo vi phạm, thường là do sửa SRS mà quên chạy `req:build` để cập nhật `docs/requirements.csv`.

---

## 8. Mốc bàn giao từng ngày

Mỗi ngày kết thúc, người có vai trò chủ nhiệm commit và cập nhật `docs/PROGRESS.md`:

| Mục | Nội dung |
|---|---|
| `docs/PROGRESS.md` | Bảng trạng thái ngày + nhật ký phiên |
| `reports/gates/day-NN.md` | Gate: lệnh đã chạy, kết quả thật, tiêu chí đánh giá, rủi ro |
| `docs/testcases/*.csv` | Test case mới hoặc đổi trạng thái |
| `docs/defects/defects.csv` | Lỗi mới phát hiện |
| `docs/backlog.csv` | Cập nhật cột `status` của các mục đã xong |

---

## 9. Kênh trao đổi

| Nội dung | Kênh |
|---|---|
| Source code, test case, tài liệu | Git repository `https://github.com/ManhTran-ai/Pet-Spa-KTPM` — nhánh `main` |
| Báo lỗi nghi ngờ | Issue GitHub kèm mã `DEF-nnn` |
| Trao đổi nhanh | Nhóm chat của nhóm |
| Điểm tiến độ | `docs/PROGRESS.md` (cập nhật mỗi ngày) |

---

## 10. Ba câu hỏi thường gặp

**Q: Site đích có lỗi, mình có sửa được không?**
Không. Nhóm là bên kiểm thử độc lập, không phải bên phát triển. Lỗi được **ghi nhận và báo cáo**, không sửa. Đây là lý do Exit criteria EC-3 nói "0 lỗi Critical/High còn mở" được đánh giá trên phía chủ hệ thống — nhóm bàn giao danh sách lỗi kèm bằng chứng.

**Q: Test Fail có phải do mình viết sai không?**
Có thể. Trước khi ghi defect: đọc lại `Expected` trong test case, chạy lại 1–2 lần để loại trừ lỗi tạm thời của mạng, và kiểm tra lại bằng chứng. Nếu là lỗi hạ tầng (mạng, timeout) thì **không** ghi defect, ghi chú vào execution log.

**Q: Tôi nên bắt đầu từ đâu?**
Đọc §0 theo thứ tự, rồi mở `docs/backlog.csv`, lọc theo cột `Owner` của bạn và `status = TODO`. Đó là danh sách việc của bạn, đã sắp theo mức MoSCoW.
