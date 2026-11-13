---
name: "petspa-testing-project"
description: Quy trình 14 ngày, quy ước, chuẩn tài liệu và chuẩn kiểm thử cho đồ án môn Thiết kế và Kiểm thử Phần mềm "Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa" (nhóm Mạnh, Tài, Ngân, Lộc; tài liệu gốc SRS-01, TP-01, RTM-01 và file kế hoạch 14 ngày). Phiên này đại diện DUY NHẤT cho Mạnh (TV1, Trưởng nhóm / Test Lead) và chỉ thực hiện phần việc của Mạnh. Dùng mỗi khi làm BẤT KỲ việc gì thuộc đồ án này, dù người dùng chỉ nói "làm ngày N", "tiếp tục", "viết test case", "chạy test", "sửa lỗi", "cập nhật RTM", "kiểm tra Exit criteria", gồm các việc viết hoặc sửa SRS, thiết kế (OpenAPI, ERD, UML), code module M1 và M7 (server Node/Express, client React), dựng repo và hạ tầng ESLint/Jest/Git, viết test case M2/M3/NFR-02, truy vết yêu cầu, unit/integration/system test, phân tích tĩnh, báo cáo lỗi, báo cáo kiểm thử, đóng gói hồ sơ nộp.
---

# petspa-testing-project: đồ án Thiết kế và Kiểm thử Phần mềm (Pet Spa, 14 ngày)

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

**Điều chỉnh phân công đã chốt (bổ sung ngoài file kế hoạch gốc):** dòng Ngày 1 của file kế hoạch bị lệch cột. Việc **"Dựng repo, quy ước Git, ESLint/Jest"** và **"SRS §1–2"** vốn ghi cho Tài nay do **Mạnh** đảm nhiệm. Mọi nội dung còn lại giữ nguyên theo kế hoạch gốc. Sự điều chỉnh này được ghi thành **ADR-05** ở Ngày 1.

## 1b. Phạm vi trách nhiệm của phiên này: Mạnh (TV1, Trưởng nhóm / Test Lead)

Phiên này **chỉ làm việc của Mạnh**. Việc của Tài, Ngân, Lộc được ghi trong `./day-playbook.md` chỉ để tham chiếu phụ thuộc; agent **không** tự nhận việc của các thành viên khác. Khi một sản phẩm cần input từ người khác mà chưa có, ghi `HUMAN-PENDING` hoặc `BLOCKED` kèm nêu rõ cần gì từ ai — không tự làm thay và không bịa nội dung.

### 1b.1. Code và test Mạnh phụ trách

| Hạng mục | Nội dung |
|---|---|
| Code của Mạnh | **M1** (Tài khoản và phân quyền) và **M7** (Quản trị) |
| Hạ tầng (nhận thêm từ Tài) | Dựng repo/monorepo, quy ước Git, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml`, GitHub Actions, `CONTRIBUTING.md`, script khung `scripts/*.mjs`, SRS §1–2 |
| Module Mạnh viết test case (vai TESTER) | **M2** (Hồ sơ thú cưng) và **M3** (Danh mục dịch vụ, bảng giá) — theo RTM-01; cộng **NFR-02** (bảo mật) |
| Module Mạnh viết unit test (vai DEV) | Unit test cho M1 và M7 |

Tính độc lập: Mạnh **không** viết và **không** chạy test case của M1/M7 (thuộc Lộc), M4/M5 (thuộc Tài), M6 (thuộc Ngân). Mạnh chỉ review chéo, không tự kiểm tra test case của mình.

### 1b.2. Chuyên trách kiểm thử của Mạnh

- Test Plan: `docs/test-plan.md` — v0.1 (Ngày 1), v1.0 (Ngày 5), cập nhật theo CR đã chấp nhận.
- RTM: `docs/rtm.csv` dựng khung (Ngày 5), hoàn thiện 100% ánh xạ (Ngày 8), rà soát cập nhật (Ngày 13).
- Điều phối Inspection SRS (Ngày 3): Moderator; kiểm điều kiện vào; theo dõi sửa; ghép SRS v1.0 và tag `srs-v1.0`.
- Technical Review thiết kế (Ngày 5): chốt SDD v1.0, tag `sdd-v1.0`.
- Môi trường kiểm thử: DB test, `.env.test`, seed, `docs/test-data.md` (Ngày 9); quản lý môi trường Test/UAT (TP-01 §6.1).
- Tổng hợp báo cáo kiểm thử tích hợp `reports/integration-report.md` (Ngày 10).
- Exit criteria: `scripts/exit-check.mjs` → `reports/exit-criteria.md` (Ngày 13).
- Final Test Report `reports/final-test-report.md` + `docs/lessons-learned.md` (Ngày 14).
- Kiểm thử bảo mật NFR-02 (Ngày 12): SQLi, XSS, IDOR, token, bcrypt.
- Test Plan, RTM, quản lý test case trên TestLink/Sheets (TP-01 §6.2).

### 1b.3. Bảng phân công theo 14 ngày (cột Mạnh)

| Ngày | Việc của Mạnh |
|---|---|
| 1 | Chép `docs/source/*` → bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md`; `docs/backlog.md` + `docs/backlog.csv` (MoSCoW); `docs/PROGRESS.md`; `docs/decisions.md` (ADR-01..05); `docs/change-requests.md`; Test Plan v0.1; **dựng repo, quy ước Git, ESLint/Jest, script khung (nhận từ Tài)**; rà SRS §1–2 |
| 2 | Rà và hoàn thiện FR/NFR của M1, M7; xử lý `[Cần chốt]` liên quan; đóng góp `docs/requirements.csv` (46 dòng) |
| 3 | Moderator Inspection SRS; lập `docs/reviews/inspection-srs.md`; ghép SRS v1.0, tag `srs-v1.0`; kiểm chứng CR-01..CR-06; sửa RV Major của phần Mạnh |
| 4 | Kiến trúc tổng thể (sơ đồ khối, tầng, `Clock`, `PaymentGateway`, `Notifier`); `docs/design/openapi.yaml` phủ đủ bảng API (technical-spec §6); bảng truy vết FR → endpoint/màn hình/bảng trong SDD |
| 5 | Technical Review thiết kế → `docs/reviews/review-sdd.md`; chốt SDD v1.0 (tag `sdd-v1.0`); Test Plan v1.0; `docs/testcases/_template.csv`; dựng `docs/rtm.csv`; `scripts/rtm-check.mjs` |
| 6 | **DEV:** M1 đầy đủ (đăng ký, đăng nhập JWT 60 phút, đăng xuất thu hồi `jti`, `me`, RBAC `requireRole`, helper kiểm sở hữu, khóa sau 5 lần sai, đổi/quên mật khẩu, validators theo SRS §7). **TESTER:** viết TC M2, M3 (EP + BVA) |
| 7 | **DEV:** M7 (quản lý NV và ngày nghỉ, khuyến mãi, báo cáo cơ bản, điều chỉnh lịch của Admin có audit log, đặt VIP) + UI đăng nhập/đăng ký + UI quản trị. **TESTER:** hoàn tất kỹ thuật còn lại cho M2, M3 (use case, workflow) |
| 8 | Unit test M1, M7; review chéo test case (`docs/reviews/review-testcases.md`, checklist 4C, người review ≠ người viết); RTM ánh xạ 100% FR/NFR; chạy `rtm:check`; tag `tc-v1.0` khi mọi RV Major đã Closed |
| 9 | Chuẩn bị môi trường test (DB test, `.env.test`, seed, `docs/test-data.md`); Walkthrough code M4 (`docs/reviews/walkthrough-m4.md`); tổng hợp `reports/static-analysis.md` từ báo cáo của Tài |
| 10 | Tích hợp M1 ↔ M4 (kiểm tra phân quyền khi đặt lịch); tổng hợp `reports/integration-report.md` từ 4 cặp |
| 11 | Chạy TC M2, M3 (system test vòng 1); ghi DEF thật cho mọi Fail; rà soát test case sau vòng 1, bổ sung ca mới theo lỗi (cập nhật RTM + CR) |
| 12 | Sửa lỗi thuộc M1/M7 và re-test đúng TC đã Fail; **test bảo mật NFR-02** (SQLi, XSS, IDOR, token sai/hết hạn, bcrypt trong DB); tổng hợp `reports/nfr-report.md` |
| 13 | Viết và chạy `scripts/exit-check.mjs` → `reports/exit-criteria.md`; đóng băng tính năng (chỉ sửa lỗi), tag `v1.0-rc` |
| 14 | `reports/final-test-report.md` (số liệu thật, nêu thẳng lỗi còn mở); `docs/lessons-learned.md`; kiểm tra chạy sạch từ bản clone mới; tag `v1.0` |

### 1b.4. Phụ thuộc bắt buộc từ người khác

| Ngày | Cần gì | Từ ai | Xử lý nếu chưa có |
|---|---|---|---|
| 1 | Khảo sát nghiệp vụ spa (3–5 tiệm) | Lộc | `HUMAN-PENDING`; không điền dữ liệu giả |
| 3 | Biên bản họp Inspection | Cả nhóm | Ghi "Biên bản họp: HUMAN-PENDING" trong review record |
| 5 | Migration + seed, code M2/M3, code M4, khung client | Tài, Ngân, Lộc | `BLOCKED` nếu chặn Gate; nêu rõ cần gì |
| 6–7 | Code M2/M3 của Tài để Mạnh viết test case (vai TESTER) mà không đọc code | Tài | Chờ test case M2/M3 được commit (trạng thái `Designed`) rồi mới đọc code để tự động hóa |
| 8 | Test case của các thành viên khác để Mạnh review chéo: M1/M7 (Lộc), M4/M5 (Tài), M6 (Ngân) | Lộc, Tài, Ngân | Review chỉ phần có; phần chưa có ghi `HUMAN-PENDING` |
| 8 | Kết quả phân tích tĩnh | Tài | Tổng hợp khi có `reports/static-analysis.md` |
| 9 | Driver tích hợp, Stub thanh toán, Notifier hoàn chỉnh | Ngân, Lộc | Chặn cặp tích hợp tương ứng |
| 10 | Test tích hợp của 3 cặp còn lại | Tài, Ngân, Lộc | `reports/integration-report.md` ghi rõ cặp nào chưa có |
| 12 | Kết quả phi chức năng của NFR-01, 03, 04, 05 | Lộc, Tài, Ngân | `reports/nfr-report.md` ghi phần của Mạnh; phần thiếu ghi HUMAN-PENDING |
| 13 | Bộ UAT và phiếu thật | Lộc | Tiêu chí UAT của Exit criteria là `HUMAN-PENDING` |

### 1b.5. Việc của Mạnh KHÔNG làm trong phiên này

Không code M2/M3/M4/M5/M6; không viết test case M1/M4/M5/M6/M7 (chỉ được viết M2, M3 và NFR-02); không làm `docs/design/erd.md`, `sequences.md`, `states.md`, `wireframes.md`; không viết `docs/whitebox/*.md`; không viết bộ Postman/Newman; không chuẩn bị UAT; không dàn ý slide. Khi các việc đó được giao trong `day-playbook.md`, chỉ **đọc để biết phụ thuộc** và ghi vào báo cáo là việc của thành viên khác.

## 2. Quy tắc cứng (không được vi phạm)

1. **Không bịa kết quả.** Pass/Fail, % coverage, số liệu hiệu năng, số lỗi, kết quả review, phản hồi UAT, kết quả khảo sát, biên bản họp: chỉ ghi khi đến từ lần chạy lệnh thật hoặc dữ liệu thật do người cung cấp. Cấm điền Pass cho test case chưa chạy, cấm ước lượng con số.
2. **Mọi con số trong báo cáo có file thô** trong `reports/raw/` (xuất của Jest, Newman, k6/autocannon, ESLint...), và báo cáo trích đường dẫn tới file đó.
3. **Không sửa test cho xanh.** Test sai so với SRS thì sửa test và ghi lý do; code sai thì sửa code. Không dùng `skip`, `only`, hạ ngưỡng coverage để qua cổng kiểm tra.
4. **Không sửa SRS âm thầm.** Đổi yêu cầu qua change control: tăng số phiên bản SRS, ghi CR, cập nhật RTM và test case liên quan trong cùng commit.
5. **Không thêm tính năng ngoài SRS** (không đăng nhập mạng xã hội, không chat, không thanh toán thật...). Chỉ thêm thứ cần để kiểm thử (mock clock, endpoint test).
6. **Tính độc lập của kiểm thử:** người viết test case của module X không phải người code module X, và khi ở vai TESTER không đọc code của X (mục 6).
7. **Việc cần con người** (họp, khảo sát, UAT, quay video, thuyết trình, cài công cụ trên máy) không giả lập. Agent chuẩn bị bộ công cụ sẵn dùng, đánh dấu `HUMAN-PENDING` (mục 8).
8. **Một phiên làm một ngày** (hoặc một phần của ngày nếu nặng). Commit nhỏ, thông báo rõ.
9. **"100%" nghĩa là đạt Exit criteria** (TP-01 mục 5.2) và 100% yêu cầu có truy vết, không phải "hết lỗi" (kiểm thử không chứng minh được hết lỗi).
10. **Ngôn ngữ:** tài liệu và giao diện tiếng Việt; tên biến, hàm, file, commit tiếng Anh.
11. **Chạy được trên Windows:** npm script không dùng cú pháp bash (dùng `cross-env`, `rimraf`, script `.mjs`). Không commit `.env`, `node_modules`, `dist`, `coverage` thô lớn.
12. Không báo "xong" khi chưa chạy cổng kiểm tra của ngày và dán kết quả thật. Không chạy được (thiếu Docker, k6...) thì báo `BLOCKED` kèm cách xử lý, không bỏ qua.

## 3. Cấu trúc repo

```
petspa/
├── .cursor/skills/petspa-testing-project/   # skill này
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

## 4. Quy ước ID và truy vết

| Loại | Định dạng | Ghi ở đâu |
|---|---|---|
| Yêu cầu | `FR-Mx-yy`, `NFR-nn`, `BR-nn`, `UC-nn` | SRS; comment trong code `// FR-M4-03, BR-04` |
| Test case | `TC-Mx-nnn`, `TC-NF-nnn` (dải theo RTM-01) | `docs/testcases/*.csv`; tên test `[TC-M4-009] mô tả` |
| Lỗi | `DEF-nnn` (khi chạy test), `RV-nn` (khi review) | `docs/defects/defects.csv`, `docs/reviews/*.md` |
| Quyết định / thay đổi | `ADR-nn` / `CR-nn` | `docs/decisions.md` / `docs/change-requests.md` |

- Commit: `feat(M4): reject overlapping slots (FR-M4-03) [Ngân]`. Tiền tố: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`. Ngoặc đơn là module hoặc khu vực, ngoặc vuông là người phụ trách theo kế hoạch. Phiên này luôn dùng `[Mạnh]` cho commit của Mạnh (kể cả hạ tầng và tài liệu, ví dụ `chore(repo): setup eslint and jest [Mạnh]`).
- Tag: `day-NN` mỗi ngày xong; `srs-v1.0` (Ngày 3), `sdd-v1.0` (Ngày 5), `tc-v1.0` (Ngày 8), `v1.0-rc` (Ngày 13), `v1.0` (Ngày 14).
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

Ngày quá nặng (đặc biệt 6, 7, 8, 9, 11) thì chia phiên theo **vai của Mạnh**: "Ngày 6 / Mạnh · DEV" và "Ngày 6 / Mạnh · TESTER". Mỗi phiên vẫn cập nhật PROGRESS và chạy phần Gate liên quan. Không chia phiên theo thành viên khác (Tài, Ngân, Lộc) trong phiên này.

## 6. Hai vai trò: DEV và TESTER

Agent đóng vai **Mạnh** ở cả hai vai, nhưng phải tách để giữ tính độc lập:

- **Vai DEV của Mạnh:** đọc SRS, SDD, `technical-spec`; viết code và unit test của **M1** và **M7**; dựng repo, ESLint/Jest, script khung; thiết kế kiến trúc tổng thể và `docs/design/openapi.yaml`.
- **Vai TESTER của Mạnh:** viết test case cho **M2** và **M3** (và NFR-02). **Được đọc:** `docs/**` (SRS, SDD, OpenAPI), kết quả chạy. **Không được đọc** `server/src/**`, `client/src/**` của M2/M3 cho tới khi file test case của M2/M3 đã commit với trạng thái `Designed`. Sau đó mới được đọc code để tự động hóa test case.
- Mạnh **không** viết test case cho M1/M7 (của Lộc), M4/M5 (của Tài), M6 (của Ngân). Mạnh chỉ làm **review chéo** (`docs/reviews/review-testcases.md`), người review ≠ người viết.
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

## 8. Việc cần con người

Những việc dưới đây agent **không tự làm thay**, chỉ chuẩn bị đầu vào và hồ sơ, rồi ghi `HUMAN-PENDING` cùng hướng dẫn một đoạn:

- Họp kick-off, họp Inspection và Technical Review (6 bước), khảo sát 3–5 tiệm spa, UAT với 5–8 người ngoài nhóm, quay video demo, thuyết trình.
- Tạo bảng Jira/Trello, vẽ Figma (agent cho wireframe dạng văn bản), cài công cụ ngoài npm (k6, SonarQube, OWASP ZAP, pandoc).
- Test thủ công: usability, responsive, tương thích trình duyệt/di động, exploratory.

Agent có thể làm vai **người review cá nhân** (bước chuẩn bị của Inspection) và ghi lỗi thật tìm được, nhưng biên bản phải ghi rõ "rà soát có hỗ trợ AI, chờ nhóm xác nhận ở buổi họp".

## 9. Báo cáo cuối phiên (mẫu bắt buộc)

```
Ngày/phạm vi: Ngày N · Vai: DEV | TESTER | cả hai · Thành viên: Mạnh (TV1)
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

- `./day-playbook.md`: **đầu mỗi phiên**; việc, sản phẩm, Gate, HUMAN của từng ngày. Chỉ dùng **cột Mạnh** cho việc phải làm; các cột khác để biết phụ thuộc.
- `./technical-spec.md`: khi thiết kế hoặc viết code (stack, kiến trúc, hàm lõi, DB, API, mock clock, đồng thời).
- `./testing-standards.md`: khi viết test case, review, phân tích tĩnh, kiểm thử tích hợp/hệ thống/phi chức năng, quản lý lỗi, báo cáo, script kiểm tra.

## 11. Lưu ý hay gặp

- Mọi mốc 2 giờ, 12 giờ, 24 giờ, 30 phút phải đi qua `Clock` (không gọi `new Date()` trong logic nghiệp vụ), nếu không thì không kiểm được biên.
- Mock cổng thanh toán tối thiểu (luôn thành công) phải có từ Ngày 6 để M4 chạy; Ngày 9 mở rộng thành Stub có kịch bản (success, failed, timeout). Giao diện `Notifier` có từ Ngày 7, Ngày 9 hoàn thiện.
- Giao diện M4/M5 (đặt lịch, lịch của tôi, lịch nhân viên) không có người nhận trong kế hoạch: mặc định giao Lộc (chủ UI), làm ngày 7–9, ghi vào `docs/decisions.md`.
- Xung đột phiên bản khi `npm install`: không tự dùng `--force` hay `--legacy-peer-deps`; báo lại kèm đề xuất.
- Không chắc API của thư viện (Prisma, Jest, k6...) thì đọc tài liệu chính thức của phiên bản đã cài, không đoán.
- **Hạ tầng do Mạnh phụ trách** (nhận từ Tài): nếu repo, ESLint, Jest hoặc script `scripts/*.mjs` chưa có, Mạnh dựng trước khi làm việc khác, vì Gate từ Ngày 1 và Ngày 5 phụ thuộc vào nó.
- **Phạm vi:** nếu người dùng yêu cầu việc thuộc Tài/Ngân/Lộc, nói rõ việc đó ngoài phạm vi phiên này và đề xuất cách chia nhỏ hoặc bàn giao — không tự làm thay.
