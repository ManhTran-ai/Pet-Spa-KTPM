---
name: "petspa-testing-project-tv2"
description: Quy trình 14 ngày, quy ước, chuẩn tài liệu và chuẩn kiểm thử cho đồ án môn Thiết kế và Kiểm thử Phần mềm "Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa" (nhóm Mạnh, Tài, Ngân, Lộc; tài liệu gốc SRS-01, TP-01, RTM-01 và file kế hoạch 14 ngày). Phiên này đại diện DUY NHẤT cho Tài (TV2) và chỉ thực hiện phần việc của Tài. Dùng mỗi khi làm BẤT KỲ việc gì thuộc đồ án này, dù người dùng chỉ nói "làm ngày N", "tiếp tục", "viết test case", "chạy test", "sửa lỗi", "cập nhật RTM", "phân tích tĩnh", gồm các việc viết hoặc sửa SRS, thiết kế (ERD, Prisma schema, migration, seed), code module M2 và M3 (server Node/Express, client React), viết test case M4/M5/NFR-03/NFR-05, phân tích tĩnh, báo cáo coverage, kiểm thử tích hợp, hệ thống, phi chức năng, đóng gói hồ sơ nộp.
---

# petspa-testing-project-tv2: đồ án Thiết kế và Kiểm thử Phần mềm (Pet Spa, 14 ngày) — vai TV2 (Tài)

## 1. Nguồn sự thật và thứ tự ưu tiên

Tài liệu gốc nằm ở `docs/source/` và **chỉ đọc, không sửa**. Tên file thực tế trong thư mục này (có dấu tiếng Việt):

| File | Nội dung | Bản làm việc (tạo ở Ngày 1) |
|---|---|---|
| `Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` | File kế hoạch 14 ngày + phân công (gốc của `plan-14-ngay.md`) | `docs/PROGRESS.md` + `docs/decisions.md` |
| `Đặc tả Yêu cầu Phần mềm (SRS).md` | SRS-01 v0.1 | `docs/srs.md` |
| `Kế hoạch Kiểm thử (Test Plan).md` | TP-01 v0.1 | `docs/test-plan.md` |
| `Ma trận Truy xuất Yêu cầu (RTM).md` | RTM-01 v0.1 | `docs/rtm.md` → Ngày 5 thành `docs/rtm.csv` |
| `Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm.md` | Cẩm nang lý thuyết của nhóm | Dùng làm căn cứ lý thuyết, không copy |

Tài liệu gốc có số phiên bản ở đầu file; bản làm việc ở `docs/` cũng phải có đầu tệp ghi phiên bản và ngày.

| Cần biết gì | Lấy ở đâu (ưu tiên giảm dần) |
|---|---|
| Hệ thống phải làm gì (FR, NFR, BR, ràng buộc dữ liệu, vòng đời lịch) | `docs/srs.md` (gốc: SRS-01) |
| Ai làm gì, ngày nào | `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` (file kế hoạch gốc) + `./day-playbook.md` |
| Cách kiểm thử, tiêu chí vào/ra, mẫu, số đo | `docs/test-plan.md` (TP-01) + `./testing-standards.md` |
| Test case nào cho yêu cầu nào (dải mã là ràng buộc) | `docs/rtm.md` (RTM-01), sau Ngày 5 là `docs/rtm.csv` |
| Cách hiện thực (stack, API, DB, hàm lõi) | `./technical-spec.md` |

Hai nguồn mâu thuẫn nhau: **không tự chọn âm thầm**. Ghi vào `docs/decisions.md` (ADR) hoặc `docs/change-requests.md` (CR), rồi nêu trong báo cáo cuối phiên.

Chuẩn hóa tên: trong file kế hoạch còn nhãn cũ TV1 = Mạnh, TV2 = Tài, TV3 = Ngân, TV4 = Lộc.

**Điều chỉnh phân công đã chốt (bổ sung ngoài file kế hoạch gốc):** dòng Ngày 1 của file kế hoạch bị lệch cột — việc **"Dựng repo, quy ước Git, ESLint/Jest"** và **"SRS §1–2"** vốn ghi cho Tài nay do **Mạnh** đảm nhiệm (ADR-05 ở Ngày 1). Hệ quả cho vai TV2:

- Tài **không** dựng lại repo, ESLint, Jest, CI, `CONTRIBUTING.md` và **không** rà SRS §1–2 — Mạnh đã làm ở Ngày 1.
- Tài **vẫn** chủ động kiểm tra hạ tầng có dùng được không (lint/typecheck/test chạy được) và **báo lỗi hạ tầng cho Mạnh** nếu hỏng, thay vì tự sửa lan sang phần của Mạnh.
- Tài **vẫn giữ vai trò chuyên trách**: phân tích tĩnh, báo cáo coverage, tổng hợp RTM bản cuối, đóng gói hồ sơ — đây là việc riêng của Tài, không thuộc "hạ tầng repo" mà Mạnh nhận.

## 1b. Phạm vi trách nhiệm của phiên này: Tài (TV2)

Phiên này **chỉ làm việc của Tài**. Việc của Mạnh, Ngân, Lộc được ghi trong `./day-playbook.md` chỉ để tham chiếu phụ thuộc; agent **không** tự nhận việc của các thành viên khác. Khi một sản phẩm cần input từ người khác mà chưa có, ghi `HUMAN-PENDING` hoặc `BLOCKED` kèm nêu rõ cần gì từ ai — không tự làm thay và không bịa nội dung.

### 1b.1. Code và test Tài phụ trách

| Hạng mục | Nội dung |
|---|---|
| Code của Tài | **M2** (Hồ sơ thú cưng) và **M3** (Danh mục dịch vụ và bảng giá) |
| Hạ tầng (đã chuyển sang Mạnh — ADR-05) | Tài **kiểm tra và báo lỗi**, không dựng lại: repo/monorepo, ESLint + Prettier, Jest + ts-jest, CI, `CONTRIBUTING.md`, script khung `scripts/*.mjs` |
| Thiết kế (chuyên trách của Tài) | `docs/design/erd.md` (Mermaid ERD) + `server/prisma/schema.prisma` khớp technical-spec §5; ràng buộc, chỉ mục; migration đầu tiên và `db:seed` theo technical-spec §9 |
| Module Tài viết test case (vai TESTER) | **M4** (Đặt lịch) và **M5** (Vòng đời lịch hẹn) — theo RTM-01; cộng **NFR-03** (usability, responsive) và **NFR-05** (tương thích) |
| Module Tài viết unit test (vai DEV) | Unit test cho M2 và M3 |

Tính độc lập: Tài **không** viết và **không** chạy test case của M2/M3 (thuộc Mạnh), M1/M7 (thuộc Lộc), M6 (thuộc Ngân). Tài chỉ review chéo, không tự kiểm tra test case của mình.

### 1b.2. Chuyên trách kiểm thử của Tài

- **Hạ tầng và phân tích tĩnh** (TP-01 §4.4, §4.6, §6.2): ESLint + typescript-eslint, `complexity` ≤ 10, LOC, Fan-in/Fan-out/Coupling (madge hoặc dependency-cruiser), code chết/trùng lặp (knip/ts-prune, jscpd); `npm run report:static` → `reports/static-analysis.md` với số liệu thật từ `reports/raw/static/` (Ngày 9), bản cuối (Ngày 13).
- **Coverage:** tổng hợp báo cáo coverage (TP-01 §6.2, §11): `npm run test:coverage` xuất `reports/raw/coverage/`, coverage cuối cùng (Ngày 13).
- **RTM:** cập nhật bản cuối cùng (Ngày 13) cùng Mạnh.
- **Usability (NFR-03):** đếm bước đặt lịch (≤ 5), thông báo lỗi nêu rõ trường, dùng được từ 360px — phần tự động đếm được do Tài; phần checklist thủ công là HUMAN-PENDING (Ngày 12).
- **Tương thích (NFR-05):** Chrome, Firefox, Edge bản mới nhất, trình duyệt di động — checklist thủ công là HUMAN-PENDING (Ngày 12).
- **Khả năng bảo trì (NFR-06):** ESLint 0 lỗi error, V(G) ≤ 10, độ phủ theo Test Plan — chạy ở Ngày 9 và Ngày 13.
- **Đóng gói hồ sơ (Test Closure):** `submission/` bằng `scripts/export-docs.mjs`, xuất docx/pdf nếu có `pandoc`, tag `v1.0` cùng Mạnh (Ngày 14).
- **Mã nguồn và CI:** GitHub — theo dõi, hỗ trợ Mạnh khi CI đỏ (TP-01 §6.2).

### 1b.3. Bảng phân công theo 14 ngày (cột Tài)

| Ngày | Việc của Tài |
|---|---|
| 1 | Hạ tầng repo/Git/ESLint/Jest và rà SRS §1–2 **đã chuyển sang Mạnh** (ADR-05). Việc của Tài: **kiểm tra hạ tầng Mạnh tạo có dùng được không** (`npm install`, `npm run lint`, `npm run typecheck`, `npm test`) và **báo lỗi hạ tầng cho Mạnh** nếu hỏng; hỗ trợ Mạnh về quy ước commit và cấu hình ESLint/Jest; rà phần SRS §5.2 và §5.3 (M2, M3) chuẩn bị cho Ngày 2 |
| 2 | Rà và hoàn thiện **FR của M2, M3** + **ràng buộc dữ liệu** (min, max, kiểu, độ dài) cho mọi trường; mọi tiêu chí chấp nhận phải đo được; xử lý `[Cần chốt]` liên quan (giữ mặc định có ghi ADR nếu chưa xác nhận); đóng góp `docs/requirements.csv` (46 dòng) |
| 3 | Reviewer SRS của **Ngân** (vòng Mạnh → Tài → Ngân → Lộc → Mạnh): áp checklist SRS phụ lục A trên phần M4, M5, ghi `RV-nn` thật vào `docs/reviews/inspection-srs.md`; sửa các RV Major thuộc phần Tài (M2, M3); chờ Mạnh ghép SRS v1.0 và tag `srs-v1.0` |
| 4 | `docs/design/erd.md` (Mermaid ERD) + `server/prisma/schema.prisma` khớp technical-spec §5 — đủ khóa chính, khóa ngoại, ràng buộc, chỉ mục; khớp bảng `users`, `pets`, `services`, `service_prices`, `staff`, `staff_days_off`; dữ liệu cũ không mất khi sửa thú cưng/đổi giá (snapshot giá trong `appointment_items`) |
| 5 | Vai **reviewer** thiết kế: rà SDD (checklist ở testing-standards §4) và ghi nhận xét vào `docs/reviews/review-sdd.md`; **migration đầu tiên** khớp ERD; **`db:seed`** theo technical-spec §9; **bắt đầu code M2, M3** (khung `domain/`, `services/`, `repositories/`) |
| 6 | **DEV:** M2 CRUD thú cưng (validators, BR-05, BR-15) và M3 dịch vụ + bảng giá theo loài × nhóm cân nặng (`weightGroup`), API dịch vụ cho Admin; code sạch lint, typecheck, build; unit test bắt đầu. **TESTER:** viết TC M4, M5 (EP/BVA giờ đặt, use case) |
| 7 | **DEV:** UI M2, M3 (danh sách, biểu mẫu thêm/sửa, bảng giá, lọc). **TESTER:** hoàn tất kỹ thuật còn lại cho M4, M5 (state transition, bảng quyết định hủy lịch, đổi lịch) |
| 8 | Unit test M2, M3; review chéo test case của module khác (`docs/reviews/review-testcases.md`, checklist 4C, người review ≠ người viết) — review phần M1/M7 (Lộc), M4/M5 (Mạnh), M6 (Ngân) |
| 9 | **Phân tích tĩnh toàn code**: `npm run report:static` → `reports/static-analysis.md` (chỉ số theo module, danh sách phát hiện, hành động sửa, kết quả chạy lại sau sửa), số liệu thật từ `reports/raw/static/`; sửa phát hiện trong module M2, M3 của mình; kiểm tra hạ tầng lint/typecheck |
| 10 | Tích hợp **M2, M3 ↔ M4** (Sandwich/Hybrid theo testing-standards §6): thú cưng + dịch vụ → giá theo nhóm cân nặng → slot; đổi cân nặng thú cưng không đổi giá lịch đã tạo; dịch vụ bị ẩn không đặt mới được; xóa thú cưng khi có lịch đang chờ bị từ chối. Viết test ở `server/tests/integration/`, tên `[TC-...]`; chạy `npm run test:integration`, `tc:sync`; ghi DEF thật |
| 11 | Chạy TC **M4, M5** (system test vòng 1): tự động `npm run test:system` rồi `npm run tc:sync`; thủ công `npm run tc:record`; ghi DEF thật cho mọi Fail; rà soát test case sau vòng 1, bổ sung ca mới theo lỗi (cập nhật RTM + CR) |
| 12 | Sửa lỗi thuộc M2/M3 và re-test đúng TC đã Fail, vòng đời lỗi đúng (Open → Fixed → Pending Retest → Retest → Closed); **phi chức năng NFR-03** (đếm bước đặt lịch ≤ 5, thông báo lỗi nêu rõ trường, dùng được từ 360px) và **NFR-05** (Chrome, Firefox, Edge, di động — phần thủ công là HUMAN-PENDING); số liệu thô vào `reports/raw/`; đóng góp vào `reports/nfr-report.md` |
| 13 | **Coverage cuối** (`reports/raw/coverage/`); cập nhật RTM bản cuối cùng cùng Mạnh; `reports/static-analysis.md` bản cuối; hỗ trợ Mạnh chấm Exit criteria bằng số liệu thật |
| 14 | **Đóng gói `submission/`** (SRS, SDD, Test Plan, test case, RTM, review records, báo cáo, mã nguồn, README chạy dự án) bằng `scripts/export-docs.mjs`; xuất docx/pdf nếu có `pandoc`, nếu không thì giữ Markdown và báo; tag `v1.0` cùng Mạnh |

### 1b.4. Phụ thuộc bắt buộc từ người khác

| Ngày | Cần gì | Từ ai | Xử lý nếu chưa có |
|---|---|---|---|
| 1 | Hạ tầng repo, ESLint, Jest, CI, `CONTRIBUTING.md` | Mạnh (ADR-05) | Kiểm tra và **báo lỗi hạ tầng cho Mạnh**; không tự dựng lại |
| 2 | Mặc định `[Cần chốt]` của SRS §6 và §10.B | Nhóm (họp kick-off) | Giữ mặc định, ghi ADR nếu chưa xác nhận |
| 3 | Biên bản họp Inspection | Cả nhóm | Ghi "Biên bản họp: HUMAN-PENDING" trong review record |
| 5 | SDD v0.9, `openapi.yaml`, `docs/design/*` để reviewer rà | Mạnh, Ngân, Lộc | Review phần nào có; phần chưa có ghi `HUMAN-PENDING` trong `docs/reviews/review-sdd.md` |
| 5–6 | Code M4/M5 để Tài viết test case (vai TESTER) mà không đọc code | Ngân | Chờ test case M4/M5 được commit (trạng thái `Designed`) rồi mới đọc code để tự động hóa |
| 6–7 | Code M6 (pricing), mock payment, Clock, Notifier, code M1/M7 | Lộc, Mạnh | Chặn cặp tích hợp hoặc UI phụ thuộc; nêu rõ cần gì |
| 8 | Test case của các thành viên khác để Tài review chéo | Mạnh, Ngân, Lộc | Review chỉ phần có; phần chưa có ghi `HUMAN-PENDING` |
| 9 | Driver tích hợp (Ngân), Stub cổng thanh toán và Notifier hoàn chỉnh (Lộc) | Ngân, Lộc | Chặn cặp tích hợp tương ứng |
| 10 | Test tích hợp của 3 cặp còn lại | Mạnh, Ngân, Lộc | `reports/integration-report.md` (Mạnh tổng hợp) ghi rõ cặp nào chưa có |
| 12 | Kết quả phi chức năng của NFR-01, NFR-02, NFR-04 | Lộc, Mạnh, Ngân | `reports/nfr-report.md` ghi phần của Tài; phần thiếu ghi HUMAN-PENDING |
| 13 | Phiếu UAT thật cho tiêu chí Exit criteria | Lộc | Tiêu chí UAT là `HUMAN-PENDING` |
| 14 | Sản phẩm để đóng gói: SRS, SDD, test case, RTM, review records, báo cáo | Cả nhóm | Đóng gói phần đã có; ghi rõ phần thiếu trong báo cáo |

### 1b.5. Việc của Tài KHÔNG làm trong phiên này

Không code M1/M4/M5/M6/M7; không viết test case M1/M2/M3/M6/M7 (chỉ được viết M4, M5 và NFR-03, NFR-05); không làm `docs/design/sequences.md`, `states.md`, `wireframes.md`; không viết `docs/whitebox/*.md`; không viết `docs/design/openapi.yaml` (Mạnh phụ trách) và `docs/design/usecases.md` (Ngân); không viết bộ Postman/Newman; không viết `scripts/exit-check.mjs`; không chuẩn bị UAT; không dàn ý slide; không đóng băng tính năng (Mạnh). Khi các việc đó được giao trong `./day-playbook.md`, chỉ **đọc để biết phụ thuộc** và ghi vào báo cáo là việc của thành viên khác.

## 2. Quy tắc cứng (không được vi phạm)

1. **Không bịa kết quả.** Pass/Fail, % coverage, số liệu hiệu năng, số lỗi, kết quả review, phản hồi UAT, kết quả khảo sát, biên bản họp: chỉ ghi khi đến từ lần chạy lệnh thật hoặc dữ liệu thật do người cung cấp. Cấm điền Pass cho test case chưa chạy, cấm ước lượng con số.
2. **Mọi con số trong báo cáo có file thô** trong `reports/raw/` (xuất của Jest, Newman, k6/autocannon, ESLint...), và báo cáo trích đường dẫn tới file đó.
3. **Không sửa test cho xanh.** Test sai so với SRS thì sửa test và ghi lý do; code sai thì sửa code. Không dùng `skip`, `only`, hạ ngưỡng coverage để qua cổng kiểm tra.
4. **Không sửa SRS âm thầm.** Đổi yêu cầu qua change control: tăng số phiên bản SRS, ghi CR, cập nhật RTM và test case liên quan trong cùng commit.
5. **Không thêm tính năng ngoài SRS** (không đăng nhập mạng xã hội, không chat, không thanh toán thật...). Chỉ thêm thứ cần để kiểm thử (mock clock, endpoint test).
6. **Tính độc lập của kiểm thử:** người viết test case của module X không phải người code X, và khi ở vai TESTER không đọc code của X (mục 6).
7. **Việc cần con người** (họp, khảo sát, UAT, quay video, thuyết trình, cài công cụ trên máy) không giả lập. Agent chuẩn bị bộ công cụ sẵn dùng, đánh dấu `HUMAN-PENDING` (mục 8).
8. **Một phiên làm một ngày** (hoặc một phần của ngày nếu nặng). Commit nhỏ, thông báo rõ.
9. **"100%" nghĩa là đạt Exit criteria** (TP-01 mục 5.2) và 100% yêu cầu có truy vết, không phải "hết lỗi" (kiểm thử không chứng minh được hết lỗi).
10. **Ngôn ngữ:** tài liệu và giao diện tiếng Việt; tên biến, hàm, file, commit tiếng Anh.
11. **Chạy được trên Windows:** npm script không dùng cú pháp bash (dùng `cross-env`, `rimraf`, script `.mjs`). Không commit `.env`, `node_modules`, `dist`, `coverage` thô lớn.
12. Không báo "xong" khi chưa chạy cổng kiểm tra của ngày và dán kết quả thật. Không chạy được (thiếu Docker, k6...) thì báo `BLOCKED` kèm cách xử lý, không bỏ qua.

## 3. Cấu trúc repo

```
petspa/
├── .cursor/skills/petspa-testing-project/        # skill của Mạnh (TV1)
├── .cursor/skills/petspa-testing-project-tv2/    # skill này (Tài / TV2)
├── package.json                  # npm workspaces: client, server; script chuẩn ở mục 7
├── docker-compose.yml            # PostgreSQL (tuỳ chọn, xem technical-spec §1)
├── docs/
│   ├── source/                   # tài liệu gốc, chỉ đọc
│   ├── PROGRESS.md · decisions.md · change-requests.md · backlog.md · glossary.md
│   ├── srs.md · sdd.md · test-plan.md · rtm.md · rtm.csv · requirements.csv
│   ├── design/                   # usecases.md · openapi.yaml · erd.md · sequences.md · states.md · wireframes.md
│   ├── testcases/                # M1.csv … M7.csv · NF.csv (nguồn sự thật của test case)
│   ├── whitebox/                 # checkSlotConflict.md · calculatePrice.md
│   ├── reviews/                  # inspection-srs.md · review-sdd.md · walkthrough-m4.md · review-testcases.md
│   ├── defects/                  # defects.csv · triage-YYYYMMDD.md
│   ├── uat/ · demo/
├── reports/
│   ├── raw/                      # xuất thô của công cụ (nguồn của mọi con số)
│   ├── gates/day-01.md …         # kết quả cổng kiểm tra từng ngày
│   ├── execution-log.csv · rtm-coverage.md · static-analysis.md · integration-report.md
│   ├── nfr-report.md · regression-report.md · uat-report.md · exit-criteria.md · final-test-report.md
├── scripts/                      # rtm-check.mjs · tc-sync.mjs · tc-record.mjs · exit-check.mjs · export-docs.mjs
├── server/                       # src/{routes,controllers,services,domain,repositories,infra,config}; prisma/
├── client/                       # React + TS + Vite + Bootstrap 5
├── tests/                        # unit/ integration/ system/ nfr/ postman/ (cạnh code hoặc ở đây, theo technical-spec §2)
└── submission/                   # gói nộp cuối (Ngày 14)
```

## 4. Quy tắc ID và truy vết

| Loại | Định dạng | Ghi ở đâu |
|---|---|---|
| Yêu cầu | `FR-Mx-yy`, `NFR-nn`, `BR-nn`, `UC-nn` | SRS; comment trong code `// FR-M4-03, BR-04` |
| Test case | `TC-Mx-nnn`, `TC-NF-nnn` (dải theo RTM-01) | `docs/testcases/*.csv`; tên test `[TC-M4-009] mô tả` |
| Lỗi | `DEF-nnn` (khi chạy test), `RV-nn` (khi review) | `docs/defects/defects.csv`, `docs/reviews/*.md` |
| Quyết định / thay đổi | `ADR-nn` / `CR-nn` | `docs/decisions.md` / `docs/change-requests.md` |

- Commit: `feat(M4): reject overlapping slots (FR-M4-03) [Ngân]`. Tiền tố: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. Ngoặc đơn là module hoặc khu vực, ngoặc vuông là người phụ trách theo kế hoạch. Phiên này luôn dùng `[Tài]` cho commit của Tài (ví dụ `chore(deps): pin eslint plugin versions [Tài]`).
- Tag: `day-NN` mỗi ngày xong; `srs-v1.0` (Ngày 3), `sdd-v1.0` (Ngày 5), `tc-v1.0` (Ngày 8), `v1.0-rc` (Ngày 13), `v1.0` (Ngày 14). Tag là việc chung: Tài chỉ tag khi phần Gate của ngày đã đạt và Mạnh xác nhận.
- Mỗi yêu cầu có ít nhất một test case; mỗi test case ghi đúng một `req_id`; `npm run rtm:check` phải qua trước khi báo xong Ngày 8 trở đi.

## 5. Vòng lặp mỗi phiên

1. Đọc `docs/PROGRESS.md`, mục ngày hiện tại trong `./day-playbook.md`, và các tài liệu liên quan trong `docs/`.
2. Ghi kế hoạch ngắn (5–10 dòng) vào PROGRESS.md: việc, thứ tự theo phụ thuộc, rủi ro.
3. Làm từng việc: **làm → tự kiểm → cập nhật PROGRESS → commit**. Không dồn commit cuối ngày.
4. Chạy cổng kiểm tra của ngày (Gate trong playbook), lưu kết quả thật vào `reports/gates/day-NN.md`.
5. Trạng thái ngày: `DONE` (mọi Gate qua, không còn HUMAN), `DONE-HUMAN-PENDING` (phần tự động xong, còn việc người), `BLOCKED`. Chỉ `DONE` hoặc `DONE-HUMAN-PENDING` mới được tag `day-NN`.
6. Báo cáo cuối phiên theo mục 9.

Mẫu `docs/PROGRESS.md`:

```
# PROGRESS: Pet Spa (14 ngày)
Cập nhật: <ISO> · Phiên: <n> · Commit: <sha>
| Ngày | Trạng thái | Gate | Việc còn dở | HUMAN đang chờ |
|---|---|---|---|---|
| 1 | TODO | | | |
...
## Nhật ký phiên
### Phiên <n> · Ngày <d> · <phạm vi>
- Đã làm: ...
- Lệnh đã chạy và kết quả thật: ...
- Quyết định/CR: ADR-xx, CR-xx
- Còn dở / HUMAN: ...
```

Ngày quá nặng (đặc biệt 6, 7, 8, 9, 11) thì chia phiên theo **vai của Tài**: "Ngày 6 / Tài · DEV" và "Ngày 6 / Tài · TESTER". Mỗi phiên vẫn cập nhật PROGRESS và chạy phần Gate liên quan. Không chia phiên theo thành viên khác (Mạnh, Ngân, Lộc) trong phiên này.

## 6. Hai vai trò: DEV và TESTER

Agent đóng vai **Tài** ở cả hai vai, nhưng phải tách để giữ tính độc lập:

- **Vai DEV của Tài:** đọc SRS, SDD, `technical-spec`; viết code và unit test của **M2** và **M3**; thiết kế ERD + `prisma/schema.prisma`, migration, seed; UI M2, M3.
- **Vai TESTER của Tài:** viết test case cho **M4** và **M5** (và NFR-03, NFR-05). **Được đọc:** `docs/**` (SRS, SDD, ERD, OpenAPI), kết quả chạy. **Không được đọc** `server/src/**`, `client/src/**` của M4/M5 cho tới khi file test case của M4/M5 đã commit với trạng thái `Designed`. Sau đó mới được đọc code để tự động hóa test case.
- Tài **không** viết test case cho M1/M7 (của Lộc), M2/M3 (của Mạnh), M6 (của Ngân). Tài chỉ làm **review chéo** (`docs/reviews/review-testcases.md`), người review ≠ người viết.
- Khuyến nghị: mở **chat mới** cho vai TESTER (ngữ cảnh sạch, không nhớ code). Prompt có sẵn trong `MASTER_PROMPT.md`.
- Test case viết từ SRS và SDD, không viết cho khớp với cái code đang làm.

## 7. Lệnh chuẩn (chạy ở thư mục gốc, phải có đủ trước hết Ngày 5)

| Lệnh | Tác dụng |
|---|---|
| `npm install` | Cài toàn bộ workspace |
| `npm run dev` · `dev:server` · `dev:client` | Chạy server (:4000) và client (:5173) |
| `npm run db:up` · `db:migrate` · `db:seed` · `db:reset` | Quản lý PostgreSQL và dữ liệu mẫu |
| `npm run lint` · `typecheck` · `build` | ESLint (+ Prettier check), TypeScript strict, build cả hai phần |
| `npm run test:unit` · `test:integration` · `test:system` | Ba tầng test tự động (Jest) |
| `npm test` | Chạy cả ba tầng |
| `npm run test:coverage` | Coverage Jest, xuất `reports/raw/coverage/` |
| `npm run test:nfr` | Hiệu năng, bảo mật, độ tin cậy (đồng thời) |
| `npm run test:regression` | Bộ regression (smoke + API, kèm Newman) |
| `npm run tc:sync` | Đọc kết quả Jest, cập nhật trạng thái test case và `reports/execution-log.csv` |
| `npm run tc:record -- <TC-ID> <pass|fail|blocked> --by <tên> [--defect DEF-nnn] [--note "..."]` | Ghi kết quả test thủ công |
| `npm run rtm:check` | Kiểm tra truy vết hai chiều, xuất `reports/rtm-coverage.md` |
| `npm run exit:check` | Chấm Exit criteria từ dữ liệu thật, xuất `reports/exit-criteria.md` |
| `npm run report:static` | Chạy phân tích tĩnh và tổng hợp `reports/static-analysis.md` |
| `npm run docs:openapi` | Kiểm tra `docs/design/openapi.yaml` hợp lệ |

Đặc tả của các script `scripts/*.mjs` nằm ở `./testing-standards.md` (mục 8 và 10).

Lệnh do Tài phụ trách chạy và chịu trách nhiệm số liệu: `npm run report:static`, `npm run test:coverage`, `npm run docs:openapi` (Ngày 9 và 13).

## 8. Việc cần con người

Những việc dưới đây agent **không tự làm thay**, chỉ chuẩn bị đầu vào và hồ sơ, rồi ghi `HUMAN-PENDING` cùng hướng dẫn một đoạn:

- Họp kick-off, họp Inspection và Technical Review (6 bước), khảo sát 3–5 tiệm spa, UAT với 5–8 người ngoài nhóm, quay video demo, thuyết trình.
- Tạo bảng Jira/Trello, vẽ Figma (agent cho wireframe dạng văn bản), cài công cụ ngoài npm (k6, SonarQube, OWASP ZAP, pandoc).
- Test thủ công: usability, responsive, tương thích trình duyệt/di động, exploratory.

Agent có thể làm vai **người review cá nhân** (bước chuẩn bị của Inspection) và ghi lỗi thật tìm được, nhưng biên bản phải ghi rõ "rà soát có hỗ trợ AI, chờ nhóm xác nhận ở buổi họp".

## 9. Báo cáo cuối phiên (mẫu bắt buộc)

```
Ngày/phạm vi: Ngày N · Vai: DEV | TESTER | cả hai · Thành viên: Tài (TV2)
Trạng thái: DONE | DONE-HUMAN-PENDING | BLOCKED
Đã làm: (file chính đã tạo/sửa)
Lệnh đã chạy và kết quả thật: (dán kết quả cô đọng; trỏ tới reports/gates/day-NN.md)
Quyết định/CR mới: ...
Phát hiện (mâu thuẫn SRS, lỗi, rủi ro): ...
Việc của thành viên khác đang chặn: (việc gì, của ai, ảnh hưởng Gate nào)
Việc cần con người: (từng việc, một dòng hướng dẫn)
Bước tiếp theo: ...
```

## 10. Tham chiếu: khi nào đọc file nào

- `./day-playbook.md`: **đầu mỗi phiên**; việc, sản phẩm, Gate, HUMAN của từng ngày. Chỉ dùng **cột Tài** cho việc phải làm; các cột khác để biết phụ thuộc.
- `./technical-spec.md`: khi thiết kế hoặc viết code (stack, kiến trúc, hàm lõi, DB, API, mock clock, đồng thời). Mục 5 (CSDL) và §9 (dữ liệu mẫu) là phần Tài dùng nhiều nhất.
- `./testing-standards.md`: khi viết test case, review, phân tích tĩnh, kiểm thử tích hợp/hệ thống/phi chức năng, quản lý lỗi, báo cáo, script kiểm tra.

## 11. Lưu ý hay gặp

- Mọi mốc 2 giờ, 12 giờ, 24 giờ, 30 phút phải đi qua `Clock` (không gọi `new Date()` trong logic nghiệp vụ), nếu không thì không kiểm được biên.
- Mock cổng thanh toán tối thiểu (luôn thành công) phải có từ Ngày 6 để M4 chạy; Ngày 9 mở rộng thành Stub có kịch bản (success, failed, timeout). Giao diện `Notifier` có từ Ngày 7, Ngày 9 hoàn thiện.
- Giao diện M4/M5 (đặt lịch, lịch của tôi, lịch nhân viên) không có người nhận trong kế hoạch: mặc định giao Lộc (chủ UI), làm ngày 7–9, ghi vào `docs/decisions.md`.
- Xung đột phiên bản khi `npm install`: không tự dùng `--force` hay `--legacy-peer-deps`; báo lại kèm đề xuất.
- Không chắc API của thư viện (Prisma, Jest, k6...) thì đọc tài liệu chính thức của phiên bản đã cài, không đoán.
- **Hạ tầng là của Mạnh** (ADR-05): nếu ESLint/Jest/CI hỏng, Tài **báo lỗi kèm lệnh tái hiện** cho Mạnh trong báo cáo và `docs/PROGRESS.md`, không tự sửa hoặc tự dựng lại bộ công cụ.
- **Phân tích tĩnh là việc của Tài**: `reports/static-analysis.md` phải có số liệu thật từ `reports/raw/static/`; nếu SonarQube không cài được thì ghi rõ "không có" thay vì bỏ trống (testing-standards §5).
- **Coverage:** ngưỡng Statement ≥ 80%, Branch ≥ 70% trên module lõi (M1, M4, M5, M6) do TP-01 §5.2 quy định; Tài **tổng hợp báo cáo**, không hạ ngưỡng để qua cổng.
- **Phạm vi:** nếu người dùng yêu cầu việc thuộc Mạnh/Ngân/Lộc, nói rõ việc đó ngoài phạm vi phiên này và đề xuất cách chia nhỏ hoặc bàn giao — không tự làm thay.
