# Bản đồ công việc của Tài (TV2) — Ngày 6 → Ngày 14

> **Người nhận:** Tài (TV2) · **Lập:** 2026-11-19 (sau Phiên 9 — Technical Review thiết kế test)
> **Phạm vi:** 55 test case · 4 tài liệu thiết kế · toàn bộ hạ tầng kiểm thử tự động
> **Điều kiện vào:** `npm run gate` xanh 4/4 · Exit criteria 5/8 PASS

---

## 0. Tóm tắt: bạn đang ở đâu

| Hạng mục | Trạng thái hiện tại | Còn lại |
|---|---|---|
| Test case được gán | 55 ca (T1: 28 · T2: 17 · NFR: 10) | — |
| Test case đã chạy | **6 ca** (5 Pass, 1 Fail → DEF-016) | **49 ca chưa chạy** |
| Tài liệu thiết kế của bạn | `docs/design/test-design-techniques.md` v1.0 — **đã qua review chéo** ✅ | Hoàn thiện ở Ngày 8 |
| Script Playwright | 9 file spec, 21 ca tự động (nhưng **chỉ 3 ca của bạn**) | Dựng thêm ~30 ca tự động cho T1/T2 |
| Hạ tầng (repo, CI, k6, Lighthouse) | Bạn là **người sở hữu** | Bảo trì + vá 3 lỗi hạ tầng còn treo |
| Exit criteria | 5/8 PASS (EC-1, EC-3, EC-4, EC-6, EC-8) | EC-2, EC-5, EC-7 tới hạn Ngày 11–13 |

**Ba ưu tiên cao nhất ngay bây giờ (làm theo thứ tự):**

1. **P0 — Đóng nợ Ngày 2 còn treo:** `reports/raw/survey-T2-matrix.csv` (36 tổ hợp giá T2). Đây là đầu ra **duy nhất** chưa hoàn thành của bạn từ Ngày 2 và là đầu vào cho `FR-M3-02` + `BR-07`.
2. **P0 — Sửa 2 bug chí mạng trong hạ tầng** (đã phát hiện, xem §3) — chúng chặn đúng việc của bạn.
3. **P1 — Dựng bộ Playwright cho T1** (28 ca của bạn, hiện mới có 3 ca tự động) + T2 cross-check (17 ca, mới có 5 ca).

---

## 1. Ma trận 55 ca của bạn — trạng thái và kế hoạch chạy

### 1.1 T1 Pet NGON — 28 ca (viết + chạy)

| Module | Ca | Loại | Ưu tiên | Trạng thái | Kế hoạch |
|---|---|---|---|---|---|
| M1 Truy cập | 3 | 2 Auto + 1 Manual | C/C | 2 Pass | M1-003 manual — Ngày 11 |
| M2 Danh mục | 3 | Manual | C/H | 0 | Viết spec M2 — Ngày 8, chạy Ngày 11 |
| M3 Bảng giá | 7 | Manual | C×5/M/H | 0 | Viết spec M3 — Ngày 8, chạy Ngày 11 |
| M4 Form đặt lịch | 5 | Manual | C×4/H | 0 | Viết spec M4 — Ngày 8–9, chạy Ngày 11 |
| M5 Quy trình | 2 | Manual | C | 0 | Manual — Ngày 11 |
| M6 Tại nhà + phụ thu | 7 | Manual | C×6/H | 0 | Viết spec M6 — Ngày 9, chạy Ngày 11–12 |
| M7 Đa ngôn ngữ | 1 | Manual | H | 0 | Manual — Ngày 12 |

### 1.2 T2 Mật Pet — 17 ca (đối chiếu chéo với Ngân)

| Module | Ca | Loại | Ưu tiên | Trạng thái | Kế hoạch |
|---|---|---|---|---|---|
| M1 Truy cập | 1 | Auto | C | 0 | Có thể tái dùng logic từ `m1-navigation.spec.ts` (T1) → Ngày 8 |
| M2 Danh mục | 2 | Manual | H | 0 | Manual — Ngày 11 |
| M3 Bảng giá (BVA) | 6 | Manual | C | 0 | BVA ngưỡng 3/6/10 kg — Ngày 11–12 |
| M4 Form | 5 | 3 Auto + 2 Manual | C | 0 | Viết spec M4 — Ngày 9 |
| M5 Chính sách hủy | 2 | Manual | H | 0 | Manual — Ngày 12 |
| M7 Tìm kiếm | 1 | Auto | H | 0 | Viết spec M7 — Ngày 9 |

### 1.3 NFR — 10 ca (chuyên trách)

| Mã | Nội dung | Loại | Ưu tiên | Trạng thái |
|---|---|---|---|---|
| NFR-03-001 | Hoàn tất luồng tính giá ≤ 5 thao tác | Manual | H | 0 |
| NFR-03-002 | Thông báo lỗi nêu rõ tên trường | Manual | H | 0 |
| NFR-03-003 | Nhãn trường form nhất quán giữa các trang | Manual | M | 0 |
| NFR-03-004 | Điều hướng và thao tác form bằng bàn phím | Manual | H | 0 |
| NFR-04-001 | Tính giá đúng trên Chrome | Auto | H | ✅ Pass |
| NFR-04-002 | Tính giá đúng trên Firefox | Manual→Auto | H | ✅ Pass (cross-browser project) |
| NFR-04-003 | Tính giá đúng trên Edge | Manual | H | 0 (project `cross-browser-edge` đã có) |
| NFR-04-004 | Tính giá đúng trên Safari | Manual | H | 0 (project `cross-browser-webkit` đã có) |
| NFR-04-005 | Không tràn ngang ở 360px | Auto | H | ❌ Fail → **DEF-016** |
| NFR-04-006 | Luồng tính giá dùng được ở 360×740 | Auto | H | ✅ Pass |

> **Lưu ý NFR-04-003/004:** Playwright **đã có sẵn** project `cross-browser-edge` và `cross-browser-webkit` trong `playwright.config.ts`. Chỉ cần chạy `npm run test:cross-browser` là có kết quả cho cả 4 trình duyệt — không cần viết test mới. Nhưng `TC-NFR-04-002` mới chỉ đánh dấu Pass cho Chromium; bạn cần chạy đủ 4 engine rồi cập nhật cả 4 ca.

---

## 2. Roadmap theo ngày (Ngày 6 → Ngày 14)

### Ngày 6 (hôm nay) — Đóng nợ Ngày 2 + sửa hạ tầng

| # | Việc | Đầu ra | Ưu tiên |
|---|---|---|---|
| 6.1 | **Ma trận giá T2 36 tổ hợp** (6 bậc × 2 loài × 3 dịch vụ) | `reports/raw/survey-T2-matrix.csv` | **P0** |
| 6.2 | Sửa `scripts/tc-record.mjs` (đã sửa sẵn — xem §3) | script chạy được | **P0** |
| 6.3 | Sửa `scripts/exit-check.mjs` — EC-3 đọc sai tên cột (đã sửa sẵn) | EC-3 chấm đúng | **P0** |
| 6.4 | Sửa `docs/testcases/uat.csv` — 2 dòng lệch cột (đã sửa sẵn) | UC-05, UC-08 parse đúng | **P0** |
| 6.5 | Chạy lại `npm run gate` + `npm run test:e2e:t1` | baseline xanh | **P0** |

**Chi tiết 6.1 — cách làm ma trận T2:**

```powershell
# Bảng chuẩn đã chốt: 88 dòng T2 trong docs/reference/pricing-baseline.csv
# Mẫu đầu ra (issue-tai.md):
# Band,Pet,Service,Expected (bảng tĩnh),Actual (calculator),Match,Note
```

- 6 bậc: `<3kg`, `>3–6kg`, `>6–10kg`, `>10–20kg`, `>20–30kg`, `>40kg` — lấy đúng 6 bậc mà calculator T2 thực sự có (kiểm tra lại khi chạy; baseline có 7 bậc gồm `>30–40kg`).
- 2 loài: Chó 🐶, Mèo 🐱 — dùng `getByRole('button', { name: '🐶 Chó', exact: true })`.
- 3 dịch vụ: `Combo Tắm Vệ Sinh`, `Combo Tắm Cạo`, `Combo Tắm Cắt`.
- Chuẩn hoá giá về **số nguyên VND**: `120k` → `120000`, `1tr` → `1000000`, `1,2tr` → `1200000`.
- So sánh với `docs/reference/pricing-baseline.csv` dòng `System = T2`.

**Ranh giới ADR-11:** không bấm nút gửi cuối cùng. Chỉ chọn và đọc giá.

**Sau khi có kết quả, trả lời 3 câu hỏi trong `reports/gates/issue-tai.md`:**
1. Trong 36 tổ hợp, bao nhiêu khớp / bao nhiêu lệch?
2. Mỗi ô lệch → mở defect trong `docs/defects/defects.csv` kèm ảnh chụp.
3. `FR-M3-02` còn đúng không? (CR `CHG-2026-11-14-02` đã đóng theo hướng (b) — T2 dùng chung bảng Chó/Mèo. Nếu ma trận 36 tổ hợp xác nhận điều đó → **đóng vòng lặp**, không mở CR mới.)

---

### Ngày 7 — Thiết kế test T1 theo EP + BVA + DT/ST

| # | Việc | Đầu ra |
|---|---|---|
| 7.1 | Rà lại `docs/testcases/t1.csv` (28 ca của bạn) theo checklist 4C trong `docs/ASSIGNMENT.md` | RTM vẫn 100% |
| 7.2 | Bổ sung các ca còn thiếu cho `FR-M6-06` (bảng phụ thu >15 km → "Liên hệ báo giá riêng") — RV-D1 đã sửa `TC-T1-M6-010` | `docs/testcases/t1.csv` |
| 7.3 | Chuẩn bị bộ dữ liệu test (ma trận loài × bậc × dịch vụ cho T1) | `docs/design/test-design-techniques.md` §4 |
| 7.4 | **Inspection bộ test case** (RV-D6 — khoản trống cần đóng Ngày 5–8, Mạnh điều phối, bạn là reviewer phần T1) | `docs/reviews/inspection-testcases.md` |

---

### Ngày 8 — Hoàn thiện tài liệu thiết kế + viết spec Playwright cho T1

| # | Việc | Đầu ra |
|---|---|---|
| 8.1 | Rà `docs/design/test-design-techniques.md` — thêm ví dụ thật cho các ca BVA T1 (M3/M6) | v1.1 |
| 8.2 | `tests/e2e/t1/m2-services.spec.ts` — M2 danh mục (3 ca) | spec xanh |
| 8.3 | `tests/e2e/t1/m3-pricing.spec.ts` — M3 bảng giá (7 ca) | spec xanh |
| 8.4 | `tests/e2e/t1/m4-booking.spec.ts` — M4 form (5 ca) | spec xanh |
| 8.5 | `tests/e2e/t1/m6-home-service.spec.ts` — M6 tại nhà + phụ thu (7 ca) | spec xanh |
| 8.6 | `tests/e2e/t1/m7-extra.spec.ts` — M7 đa ngôn ngữ (1 ca) | spec xanh |

**Mẫu selector đã dùng trong repo (copy từ `tests/e2e/t2/m3-pricing.spec.ts`):**

```typescript
async function tiepTuc(page: Page, buoc: () => Promise<void>) {
  const next = page.getByRole('button', { name: 'Tiếp tục →' });
  for (let i = 0; i < 3; i += 1) {
    await buoc();
    if (await next.isEnabled()) break;
  }
  await expect(next).toBeEnabled();
  await next.click();
}
```

> Lưu ý T1: nút điều hướng là `Đặt lịch ngay` / `Tiếp tục` (không có mũi tên `→` như T2). Bạn cần probe thật để xác định nhãn — dùng `reports/raw/t1-booking.png` và `reports/raw/t1-modal.png` làm căn cứ.

---

### Ngày 9 — Hoàn thiện tự động hóa + k6/Lighthouse

| # | Việc | Đầu ra |
|---|---|---|
| 9.1 | `tests/e2e/t2/m4-booking.spec.ts` — T2 M4 (3 ca Auto của bạn) | spec xanh |
| 9.2 | `tests/e2e/t2/m7-search.spec.ts` — T2 M7 (1 ca Auto) | spec xanh |
| 9.3 | `tests/e2e/t2/m1-navigation.spec.ts` — T2 M1 (1 ca Auto) | spec xanh |
| 9.4 | Chạy `npm run test:cross-browser` đủ 4 engine → cập nhật NFR-04-001/002/003/004 | 4 ca Pass |
| 9.5 | Rà k6 script `tests/perf/read-load.js` — đảm bảo ≤ 10 VU (ADR-11) | `reports/raw/day-XX-k6.txt` |
| 9.6 | Walkthrough thiết kế test (bạn trình bày phần EP/BVA) | Biên bản |

---

### Ngày 10 — Kiểm thử tích hợp T1

| # | Việc | Đầu ra |
|---|---|---|
| 10.1 | Quan sát network của wizard T1 (tab Network trong DevTools, hoặc `page.on('request')`) | `reports/raw/t1-network.txt` |
| 10.2 | Kiểm chứng **hợp đồng dữ liệu**: giá trong bảng tĩnh == giá wizard tính ra (cùng bậc, cùng dịch vụ) | `reports/integration-report.md` (phần T1) |
| 10.3 | Kiểm chứng validation biên: nhập 2.9 / 3 / 3.1 kg → đúng bậc | bằng chứng |
| 10.4 | Phụ thu di chuyển: 0 / 2 / 5 / 6 / 7 km theo `max(0, km − 5) × 8.000₫` | bằng chứng |

---

### Ngày 11–12 — System test: chạy 49 ca còn lại

| Ngày | Khối ca | Ghi chú |
|---|---|---|
| 11 | 28 ca T1 + 6 ca BVA T2 + 4 NFR-03 + 2 NFR-04 | Dùng `npm run tc:record -- --tc <ID> --result Pass --by "Tài" --note "..."` |
| 12 | 2 ca M2 T2 + 5 ca M4 T2 + 2 ca M5 T2 + 2 NFR-04 | Re-test các ca Fail, đóng defect |

**Quy trình ghi nhận (bắt buộc):**

```powershell
# 1. Chạy ca → quan sát
# 2. Ghi kết quả
npm run tc:record -- --tc TC-T1-M3-002 --result Pass --by "Tài" --note "đã đối chiếu bảng giá tĩnh, khớp 155.000đ"
# 3. Nếu Fail → trước hết phân biệt lỗi hạ tầng vs lỗi sản phẩm
npm run tc:record -- --tc TC-T1-M3-005 --result Fail --by "Tài" --defect DEF-025 --note "ảnh: reports/raw/t1-m3-005.png"
```

**Quy tắc không được phá vỡ:**
- **Không** bấm nút gửi/đặt lịch cuối cùng (ADR-11).
- Lỗi mạng (`ERR_INTERNET_DISCONNECTED`, timeout, `ENOTFOUND`) → **không** ghi defect; ghi `Blocked` + ghi chú hạ tầng.
- Lỗi thật của site bên thứ ba → **vẫn** ghi defect, trạng thái `Open`, kèm bằng chứng.
- **Không** hạ tiêu chí để ép xanh.
- Mọi Fail phải có `DEF-nnn` trỏ về trong `docs/defects/defects.csv` — `npm run exit:check` chấm EC-3.

---

### Ngày 13 — Regression + chấm Exit criteria

| # | Việc | Đầu ra |
|---|---|---|
| 13.1 | Chạy regression toàn bộ: `npm run test:e2e` | `reports/raw/regression-day13.txt` |
| 13.2 | Re-test toàn bộ defect đã ghi nhận | cập nhật `defects.csv` |
| 13.3 | Chạy `npm run gate` → đạt EC-1…EC-8 | `reports/exit-criteria.md` |
| 13.4 | Hỗ trợ Lộc chạy UAT (8 kịch bản `docs/testcases/uat.csv`) | `reports/uat-report.md` |

**Lưu ý EC-3:** tiêu chí gốc là *"0 lỗi Critical/High còn mở"*. Vì site đích là của bên thứ ba và nhóm **không sửa được**, `docs/ASSIGNMENT.md` §10 đã chốt: EC-3 được **đánh giá ở phía chủ hệ thống** — nhóm bàn giao danh sách lỗi kèm bằng chứng. Trong báo cáo, ghi rõ điều này thay vì tuyên bố "đã đạt" một cách hình thức.

**Lưu ý EC-5:** Lighthouse Performance hiện đang FAIL (điểm thấp nhất = 3 ở T3). Đây là **kết quả kiểm thử thật** của site đích, không phải lỗi của nhóm. Không được hạ ngưỡng. Ngân chịu trách nhiệm số liệu này.

---

### Ngày 14 — Đóng gói bàn giao

| # | Việc | Đầu ra |
|---|---|---|
| 14.1 | Đóng gói hồ sơ nộp (theo checklist §3A.4 của `docs/ASSIGNMENT.md`) | hồ sơ |
| 14.2 | Tag repo `v1.0` (Mạnh làm) | tag |
| 14.3 | Script + video demo bộ tự động | video |
| 14.4 | Cập nhật `docs/PROGRESS.md` + `docs/ASSIGNMENT.md` | log |

---

## 3. Bug hạ tầng đã phát hiện — đã sửa sẵn, cần bạn hiểu để không vỡ lại

### 3.1 `scripts/tc-record.mjs` — **script ghi kết quả không chạy được** (P0)

| Vấn đề | Hậu quả |
|---|---|
| Script tìm test case bằng `r.tc_id` (viết thường) | CSV thật dùng `TC_ID` (viết hoa) → **không tìm thấy ca nào** |
| Script ghi vào `record.status` / `record.executor` | Không cột nào mang tên đó → kết quả **bị ghi đè mất** |
| CLI chỉ nhận dạng `--by/--defect/--note` | `docs/ASSIGNMENT.md` §5.1 hướng dẫn dùng `--tc` và `--result` → **lệnh trong tài liệu không chạy** |
| Chỉ sửa `docs/testcases/*.csv`, không đụng `reports/execution-log.csv` | EC-2 đọc `execution-log.csv` → **tiêu chí chấm sai** |

**Đã sửa:** script dùng đúng `TC_ID`/`Status`, hỗ trợ `--tc/--result/--by/--defect/--note` (không phân biệt hoa thường cho `--result`), ghi **cả hai** file, sắp xếp theo `TC_ID`, và thêm npm script `npm run tc:record`.

### 3.2 `scripts/exit-check.mjs` — EC-3 đọc sai tên cột (P0)

`docs/defects/defects.csv` dùng `Severity`/`Status` (viết hoa) nhưng script đọc `d.severity`/`d.status` → **luôn ra 0 lỗi Critical/High đang mở** → EC-3 báo PASS giả. Thực tế có **3 lỗi High đang mở** (DEF-013, DEF-019, DEF-020).

Đã sửa: đọc cả hai biến thể. **Lưu ý:** sau khi sửa, EC-3 chuyển từ PASS → FAIL. Đây là **kết quả trung thực**, không phải hồi quy — xem mục "Lưu ý EC-3" ở Ngày 13 để báo cáo đúng cách.

### 3.3 `docs/testcases/uat.csv` — 2 dòng lệch cột (P0)

`UC-05` thiếu cột `Pre_condition`; `UC-08` có `System = T1,T2,T3` không đặt trong dấu nháy → bị tách thành 3 cột. Hậu quả: `Priority` và `Status` bị lệch, `Status` = rỗng → UC-05/08 bị tính là "chưa thực thi" vô lý và EC-7 chấm sai.

Đã sửa cả 2 dòng.

### 3.4 Vấn đề môi trường (P1)

| Vấn đề | Nguyên nhân | Cách xử lý |
|---|---|---|
| `npx playwright test` không tìm thấy project | `npx` tải Playwright mới (1.65.1) thay vì dùng bản trong `node_modules` | Luôn dùng `npm run test:e2e:t1` (gọi binary trong `node_modules`) |
| Firefox: `spawn UNKNOWN` | Playwright tải browser về cache sandbox tạm, bị xoá giữa các phiên shell | Cài browser vào `.browsers/` cục bộ + đặt `PLAYWRIGHT_BROWSERS_PATH` |
| `.browsers/` nặng 1,2 GB | Không muốn commit | Đã thêm `.browsers/` vào `.gitignore` |

**Thiết lập một lần cho máy bạn:**

```powershell
$env:PLAYWRIGHT_BROWSERS_PATH = "C:\Users\Tai\Downloads\test\Pet-Spa-KTPM\.browsers"
npx playwright install chromium firefox webkit
```

> Nếu không set biến này, Firefox và WebKit sẽ fail vì cache sandbox bị dọn. Chromium vẫn chạy vì project `t1`/`t2`/`t3` dùng `channel: 'chrome'` (Chrome hệ thống).

---

## 4. Definition of Done **của bạn** (theo `docs/ASSIGNMENT.md` §3A.4)

| # | Điều kiện | Trạng thái |
|---|---|---|
| 1 | 55 ca của bạn có trạng thái trong `docs/testcases/*.csv` | ❌ 49/55 chưa chạy |
| 2 | Tài liệu thiết kế của bạn đã được review chéo | ✅ (Ngân đã review 19/11) |
| 3 | Mọi Fail đã có defect tương ứng trong `docs/defects/defects.csv` | ✅ hiện tại (DEF-016) — phải duy trì |
| 4 | Bằng chứng thô nằm trong `reports/raw/` | ⚠️ thiếu cho phần lớn ca |
| 5 | NFR chuyên trách (NFR-03, NFR-04) có số liệu thật | ⚠️ NFR-03 còn 4 ca chưa chạy |
| 6 | `npm run gate` xanh | ✅ 4/4 |
| 7 | Đóng góp vào bộ tự động hóa chạy được | ⚠️ mới 3 ca của bạn |
| 8 | Báo cáo tích hợp T1 (Ngày 10) | ❌ chưa có |
| 9 | Regression xanh (Ngày 13) | ❌ chưa chạy |

---

## 5. Nguồn sự thật — đọc file nào, khi nào

| Khi nào | Đọc file |
|---|---|
| Trước khi viết test case | `docs/design/test-design-techniques.md` (của bạn) · `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` §3, §6, §8 |
| Trước khi viết spec Playwright | `docs/testcases/t1.csv` · `docs/reference/pricing-baseline.csv` · `tests/e2e/t2/m3-pricing.spec.ts` (mẫu) |
| Trước khi ghi kết quả | `docs/ASSIGNMENT.md` §5 · `docs/defects/README.md` |
| Trước khi chấm exit criteria | `reports/exit-criteria.md` · `docs/source/Kế hoạch Kiểm thử (Test Plan).md` §5.2 |
| Khi cần biết giá chuẩn | `docs/reference/pricing-baseline.md` (213 dòng) |
| Khi cần biết quy tắc nhóm | `docs/ASSIGNMENT.md` §2 (ADR-11) · §4 (4C) · §5 (ghi nhận) |

---

## 6. Câu hỏi cần trả lời cho nhóm

1. Ma trận 36 tổ hợp giá T2 lệch bao nhiêu ô? Mỗi ô lệch thuộc loại nào?
2. Có bao nhiêu ca của bạn **không thể kiểm thử được** do ADR-11 (ví dụ: bước "gửi giữ chỗ")? Cần ghi vào báo cáo như giới hạn.
3. Bộ Playwright T1 tự động được bao nhiêu ca? Có đủ để EC-4 xanh không?
4. Những ca nào của bạn **không thể** tự động hóa và cần chạy tay? Vì sao?
5. Có phát hiện nào làm thay đổi `FR-M3-02` hay không?

---

*Tài liệu này được lập ngày 2026-11-19 dựa trên trạng thái thật của repo (`git status`, `docs/testcases/*.csv`, `npm run gate`). Mọi số liệu trong đây đều đã kiểm chứng bằng script, không ước lượng.*
