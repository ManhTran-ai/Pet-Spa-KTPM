# Day playbook: 14 ngày

Mục lục: Quy ước chung · Ngày 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 13 · 14 · Kiểm toán cuối

**Quy ước chung.** Tên: TV1 = Mạnh, TV2 = Tài, TV3 = Ngân, TV4 = Lộc. Mỗi ngày có: *Việc* (theo người), *Sản phẩm* (đường dẫn), *Gate* (cổng kiểm tra, kết quả thật lưu vào `reports/gates/day-NN.md`), *HUMAN* (việc người). Phụ thuộc chéo ghi trong ngoặc. Từ Ngày 5 trở đi, Gate luôn gồm `npm run lint`, `npm run typecheck`, `npm test` (khi đã có test) và `npm run rtm:check` (từ Ngày 8). Xong ngày: tag `day-NN`.

> **Điều chỉnh phân công (ADR-05):** việc **"Dựng repo, quy ước Git, ESLint/Jest"** và **"Rà SRS §1–2"** chuyển từ Tài sang **Mạnh** (dòng Ngày 1 của file kế hoạch gốc bị lệch cột). Mọi việc khác giữ nguyên.
>
> **Bản dành cho vai TV2 (Tài):** chỉ thực hiện việc ở **cột Tài**. Các cột khác chỉ để biết phụ thuộc và báo cáo `BLOCKED` khi thiếu input. Ngày 1: Tài **kiểm tra** hạ tầng Mạnh tạo chạy được không và **báo lỗi hạ tầng cho Mạnh**, không dựng lại.

Vai DEV và TESTER (SKILL mục 6): việc ghi "Test:" là vai TESTER.

---

## Ngày 1: Chốt phạm vi và nền tảng

**Mục tiêu:** repo chạy được khung rỗng, backlog, use case, glossary, Test Plan v0.1.

- **Mạnh:** chép `docs/source/*` thành bản làm việc `docs/srs.md`, `docs/test-plan.md`, `docs/rtm.md` (thêm đầu tệp: phiên bản, ngày). Viết `docs/backlog.md` (+ `docs/backlog.csv` để nhập vào Jira/Trello) theo MoSCoW của SRS §2.2. Tạo `docs/PROGRESS.md`, `docs/decisions.md` (ADR-01 stack, ADR-02 mặc định nghiệp vụ, ADR-03 giao diện M4/M5 giao Lộc, ADR-04 mock payment/notifier sớm, ADR-05 hạ tầng repo/Git/ESLint/Jest chuyển từ Tài sang Mạnh), `docs/change-requests.md`. Test Plan: xác nhận TP-01 v0.1 khớp stack đã chọn. **Dựng monorepo (npm workspaces `client`, `server`), TypeScript strict, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml` (Postgres, tuỳ chọn), GitHub Actions (lint, typecheck, test), `CONTRIBUTING.md` (nhánh `main` ← `develop` ← `feature/*`, quy ước commit), script khung ở SKILL mục 7 (có thể chưa làm gì, nhưng tên đã có). Rà SRS §1–2 và hoàn thiện nếu thiếu.**
- **Tài:** (phần hạ tầng đã chuyển sang Mạnh — ADR-05) hỗ trợ Mạnh về quy ước Git và khung ESLint/Jest nếu cần.
- **Ngân:** `docs/design/usecases.md`: sơ đồ use case (Mermaid) cho 8 UC, đặc tả chi tiết UC-04 (theo mẫu SRS §4), UC-05 (xem, hủy, đổi lịch).
- **Lộc:** `docs/glossary.md` (từ SRS §1.3, bổ sung); đặc tả UC-07 (thanh toán, hóa đơn). Khảo sát nghiệp vụ spa: soạn phiếu khảo sát (`docs/survey-template.md`: quy trình đặt lịch, khung giờ, chính sách hủy, cọc, phụ phí, cách tính giá), **không điền dữ liệu giả**; kết quả khảo sát chỉ vào tài liệu khi có thật.

**Sản phẩm:** repo khung, `docs/{backlog,glossary,decisions,change-requests,PROGRESS}.md`, `docs/design/usecases.md`.

**Gate:** `npm install`, `npm run lint`, `npm run typecheck`, `npm test` (có thể một test mẫu), CI cấu hình hợp lệ; ADR-01..05 đã ghi.

**HUMAN:** họp kick-off (chốt Hướng 1, vai trò, giá trị [Cần chốt] của SRS §10.B); tạo bảng Jira/Trello; đi khảo sát 3–5 tiệm spa và điền phiếu.

---

## Ngày 2: SRS bản nháp hoàn chỉnh

**Mục tiêu:** SRS v0.2 đủ, nhất quán, kiểm thử được; `docs/requirements.csv` máy đọc được.

Bắt đầu từ SRS-01 v0.1 (đã có FR, NFR, BR, ràng buộc dữ liệu). Mỗi người rà phần của mình, đối chiếu FR ↔ BR ↔ bảng dữ liệu ↔ vòng đời lịch:

- **Mạnh:** FR/NFR của M1, M7; bổ sung NFR cụ thể nếu mơ hồ.
- **Tài:** FR của M2, M3 và ràng buộc dữ liệu (min, max, kiểu, độ dài) cho mọi trường.
- **Ngân:** FR của M4, M5, quy tắc slot, giờ làm, hủy (BR-01 đến 07).
- **Lộc:** FR của M6, quy tắc giá và khuyến mãi (BR-08 đến 11, 18).

Mỗi yêu cầu: ID duy nhất, ưu tiên, tiêu chí chấp nhận **đo được** (con số, mã lỗi, trạng thái). Không để từ mơ hồ ("nhanh", "phù hợp"). Mọi **[Cần chốt]** được xử lý: nhóm xác nhận (ghi ADR) hoặc giữ mặc định có ghi nhận.

Tạo `docs/requirements.csv`: `id, type (FR|NFR), module, priority, title`; 46 dòng (40 FR + 6 NFR), khớp RTM-01.

**Sản phẩm:** `docs/srs.md` v0.2, `docs/requirements.csv`.
**Gate:** số dòng `requirements.csv` = 46 và khớp ID trong SRS; mọi FR có tiêu chí chấp nhận; không còn từ mơ hồ không kèm con số (tự rà theo checklist SRS phụ lục A).
**HUMAN:** nhóm xác nhận các giá trị [Cần chốt].

---

## Ngày 3: Inspection SRS và baseline v1.0

**Mục tiêu:** kiểm thử tĩnh SRS theo Inspection; SRS v1.0.

- **Mạnh (Moderator):** kiểm điều kiện vào (bản nháp đủ 7 module, tác giả tự rà). Lập `docs/reviews/inspection-srs.md` (mẫu ở testing-standards §4), ghép SRS v1.0, theo dõi sửa lỗi.
- **Reviewer theo vòng:** Mạnh rà phần của Tài; Tài rà phần của Ngân; Ngân rà phần của Lộc; Lộc rà phần của Mạnh. Mỗi người áp checklist SRS phụ lục A trên phần được giao, ghi `RV-nn` thật.
- **Tác giả:** sửa phần của mình theo RV (Major bắt buộc).

**Mầm lỗi đã biết cần kiểm chứng và đưa vào Inspection** (đọc lại SRS rồi mới ghi; nếu thật thì ghi RV, và CR nếu cần đổi yêu cầu):

| CR dự kiến | Vấn đề |
|---|---|
| CR-01 | C3 "đã đặt cọc" của bảng hủy (SRS §8.2) chỉ là N khi có lịch không thu cọc, nhưng BR-11 bắt buộc cọc và FR-M7-04 chỉ cho Admin xem và điều chỉnh. Cột R3 và R5 không thể kiểm thử. Đề xuất: cho Admin tạo lịch hộ khách (walk-in) được miễn cọc. |
| CR-02 | FR-M6-04 (thanh toán cọc, Should) là điều kiện để tạo lịch ở FR-M4-01 và UC-04 (Must). Đề xuất: nâng Must, hoặc nêu cách tạo lịch khi không dùng cọc. |
| CR-03 | Lịch `Pending` quá giờ hẹn không có đường ra: No-show chỉ từ `Confirmed` (SRS §8.1, BR-12). Đề xuất: Pending quá giờ tự `Cancelled` hoặc cho `No-show` từ Pending. |
| CR-04 | Không có cách một KH thành VIP (BR-10) và cách tạo tài khoản NV/AD (FR-M1-01 chỉ đăng ký KH). Đề xuất: Admin đặt cờ VIP; NV do Admin tạo; Admin đầu tiên được seed. |
| CR-05 | BR-01 chưa nói lịch có phải kết thúc trước 18:00 hay không. Đề xuất: bắt buộc, ghi thành BR. |
| CR-06 | BR-05 (tối đa 3 lịch Pending/Confirmed cùng lúc) không có trong tiêu chí chấp nhận của FR-M4-01. Đề xuất: thêm. |

Với mỗi CR được nhóm chấp nhận: sửa SRS (tăng phiên bản), cập nhật `requirements.csv`, RTM, ghi `docs/change-requests.md`. Chưa có quyết định của nhóm thì giữ nguyên SRS và đánh dấu `CR-xx: chờ nhóm`.

**Sản phẩm:** `docs/reviews/inspection-srs.md`, `docs/srs.md` v1.0 (tag `srs-v1.0`).
**Gate:** mọi RV Major `Closed`; số RV theo mức được thống kê; mọi CR có trạng thái; RTM và requirements khớp SRS v1.0.
**HUMAN:** buổi họp ghi nhận lỗi (bước 3) và xác nhận kết quả; biên bản họp thật.

---

## Ngày 4: Thiết kế (SDD v0.9)

**Mục tiêu:** `docs/sdd.md` v0.9 và các sơ đồ.

- **Mạnh:** kiến trúc tổng thể (sơ đồ khối, tầng, `Clock`, `PaymentGateway`, `Notifier`) và `docs/design/openapi.yaml` phủ đủ bảng API của technical-spec §6 (schema request/response, mã lỗi, ví dụ).
- **Tài:** `docs/design/erd.md` (Mermaid ERD) + `server/prisma/schema.prisma` khớp technical-spec §5; ràng buộc, chỉ mục.
- **Ngân:** `docs/design/sequences.md` (Sequence đặt lịch: hold → thanh toán → tạo lịch; hủy; đổi lịch; No-show) và `docs/design/states.md` (State diagram lịch hẹn **khớp SRS §8.1**), đặc tả chi tiết (pseudocode) cho `checkSlotConflict`, `evaluateCancellation`, `stateMachine`.
- **Lộc:** `docs/design/wireframes.md` (wireframe văn bản/ASCII cho mọi màn hình ở technical-spec §10, bản đồ route, đúng ≤ 5 bước đặt lịch), Sequence thanh toán, đặc tả chi tiết `calculatePrice`.

**Sản phẩm:** `docs/sdd.md` (mục lục trỏ tới các tệp thiết kế), `docs/design/*`.
**Gate:** `npm run docs:openapi` qua; mọi FR có ít nhất một endpoint/màn hình/bảng trong SDD (bảng truy vết trong SDD §Truy vết); sơ đồ trạng thái khớp SRS §8.1 từng cạnh.
**HUMAN:** vẽ Figma từ wireframe (nếu nhóm muốn).

---

## Ngày 5: Technical Review thiết kế, template test case, RTM khung

- **Mạnh:** Technical Review thiết kế (Walkthrough rồi Technical Review, checklist ở testing-standards §4), chốt `sdd.md` v1.0 (tag `sdd-v1.0`); Test Plan v1.0 (cập nhật theo CR đã chấp nhận); tạo **template test case** (`docs/testcases/_template.csv`, đủ cột, 4C), dựng `docs/rtm.csv` từ `requirements.csv` và dải mã RTM-01, viết `scripts/rtm-check.mjs`.
- **Tài (reviewer):** `prisma migrate` đầu tiên khớp ERD; `db:seed` theo technical-spec §9; bắt đầu code M2, M3.
- **Ngân (reviewer):** bắt đầu code M4 (khung `domain/`, `services/`).
- **Lộc (reviewer):** dựng khung client (Vite, router, layout, `api/`, AuthContext, ErrorBoundary, trang trống theo wireframe).

**Sản phẩm:** `docs/reviews/review-sdd.md`, `docs/sdd.md` v1.0, `docs/test-plan.md` v1.0, `docs/testcases/_template.csv`, `docs/rtm.csv`, `scripts/rtm-check.mjs`, migration và seed.
**Gate:** `db:migrate` và `db:seed` chạy trên DB sạch; `npm run rtm:check` chạy được (có thể còn báo thiếu test case, nhưng không lỗi script); mọi RV Major của review thiết kế `Closed`.
**HUMAN:** buổi Technical Review nhóm.

---

## Ngày 6: Sprint 1 (code lõi) và viết test case đợt 1

Dùng hai vai (chat DEV và chat TESTER riêng). Thứ tự phụ thuộc: Tài (M2, M3) → Lộc (M6 pricing, mock payment) → Ngân (M4) → Mạnh (M1 độc lập).

**DEV**
- **Mạnh:** M1 đầy đủ: đăng ký, đăng nhập (JWT 60 phút), đăng xuất (thu hồi `jti`), `me`, RBAC (`requireRole`) và helper kiểm sở hữu, khóa tài khoản sau 5 lần sai, đổi/quên mật khẩu (Should). Validators theo SRS §7.
- **Tài:** M2 CRUD thú cưng (validators, BR-05, BR-15), M3 dịch vụ và bảng giá theo loài × nhóm cân nặng (`weightGroup`), API dịch vụ cho Admin.
- **Ngân:** M4: `slots.ts`, `checkSlotConflict`, `POST /appointments/holds`, `POST /appointments` (cần giá và payment của Lộc), khóa theo nhân viên (technical-spec §8), tự gán nhân viên.
- **Lộc:** M6: `calculatePrice`, `POST /quotes`, kiểm mã khuyến mãi, **mock `PaymentGateway` tối thiểu (luôn success)**, `Clock` và `Notifier` giao diện (nếu chưa có), khung UI.

**TESTER (từ SRS/SDD, chưa đọc code)**
- **Mạnh viết TC cho M2, M3:** EP + BVA (cân nặng, tuổi, độ dài, biên nhóm 5/15/30 kg).
- **Tài viết TC cho M4, M5:** EP/BVA giờ đặt, use case.
- **Ngân viết TC cho M6:** EP/BVA và bảng quyết định giá.
- **Lộc viết TC cho M1, M7:** EP/BVA mật khẩu, SĐT, email; phân quyền.

**Sản phẩm:** code sprint 1 (compile, lint sạch), `docs/testcases/M*.csv` bản nháp (`status = Designed`), unit test bắt đầu.
**Gate:** `lint`, `typecheck`, `build`, `test:unit` qua; các TC đã viết nằm đúng dải RTM; TC của mỗi module được commit **trước** khi tester đọc code module đó (kiểm bằng lịch sử commit).
**HUMAN:** không.

---

## Ngày 7: Sprint 1 (tiếp) và test case đợt 2

**DEV**
- **Mạnh:** M7 (quản lý nhân viên và ngày nghỉ, khuyến mãi, báo cáo cơ bản, điều chỉnh lịch của Admin có audit log, đặt VIP) và UI đăng nhập/đăng ký, UI quản trị.
- **Tài:** UI M2, M3 (danh sách, biểu mẫu thêm/sửa, bảng giá, lọc).
- **Ngân:** M5: `stateMachine`, confirm, start, complete, `evaluateCancellation` + hoàn cọc, `reschedule`, `markNoShows(now)`, log chuyển trạng thái. `Notifier` gọi khi xác nhận, hủy, đổi.
- **Lộc:** hóa đơn (`invoices`, `GET /appointments/:id/invoice`), UI M6 (báo giá, thanh toán cọc, hóa đơn) **và UI M4/M5** (đặt lịch ≤ 5 bước, Lịch của tôi, hủy, đổi, lịch NV) theo ADR-03; có thể kéo sang Ngày 8–9.

**TESTER**
- Hoàn tất các kỹ thuật còn lại cho cùng bộ module: **Mạnh** (M2, M3: use case, workflow), **Tài** (M4, M5: state transition, bảng quyết định hủy, đổi lịch), **Ngân** (M6: use case thanh toán, E2E), **Lộc** (M1, M7: use case).

**Sản phẩm:** code sprint 1 hoàn chỉnh theo SRS (mức Must xong, Should theo khả năng), bản nháp test case đủ dải RTM.
**Gate:** `lint`, `typecheck`, `build`, `test:unit`; số TC mỗi module bằng dải RTM (đủ kỹ thuật theo testing-standards §2); chạy tay được luồng đặt lịch → xác nhận → hoàn thành trên `npm run dev`.
**HUMAN:** thử luồng chính trên giao diện bằng mắt.

---

## Ngày 8: Unit test, hộp trắng, review chéo, TC v1.0, RTM 100%

- **Mạnh:** unit test M1, M7; review chéo test case (`docs/reviews/review-testcases.md`: người review khác người viết, checklist 4C); RTM ánh xạ 100% FR/NFR; chạy `rtm:check`.
- **Tài:** unit test M2, M3; review test case của module khác.
- **Ngân:** unit test M4, M5; tài liệu Basis Path `docs/whitebox/checkSlotConflict.md` (testing-standards §3) kèm test `WB`.
- **Lộc:** unit test M6; `docs/whitebox/calculatePrice.md` kèm test `WB`; review test case.

Chạy `npm run test:coverage`, xuất `reports/raw/coverage/`; chưa đạt ngưỡng thì viết thêm test, **không** hạ ngưỡng. Test case chốt `tc-v1.0` (tag).

**Sản phẩm:** unit test toàn bộ module lõi; `docs/whitebox/*.md`; `docs/reviews/review-testcases.md`; `docs/rtm.csv` đủ.
**Gate:** `rtm:check` qua (46/46 yêu cầu, trừ NFR-06 ghi chú), `test:unit` qua; coverage đạt hoặc có kế hoạch bù ghi trong PROGRESS; hai hàm có V(G) tính bằng 3 cách khớp nhau và 100% đường độc lập có test.
**HUMAN:** họp review chéo test case (nếu nhóm yêu cầu).

---

## Ngày 9: Phân tích tĩnh, walkthrough, Stub, thông báo

- **Mạnh:** chuẩn bị môi trường test (DB test, `.env.test`, seed, `docs/test-data.md`); Walkthrough code M4 (`docs/reviews/walkthrough-m4.md`, checklist code).
- **Tài:** `npm run report:static` toàn code → `reports/static-analysis.md` (testing-standards §5); sửa phát hiện trong module của mình.
- **Ngân:** sửa cảnh báo M4, M5; viết **Driver** (bộ gọi API) cho tích hợp từ dưới lên.
- **Lộc:** hoàn thiện `Notifier` (các loại, `sendReminders(now)`) và **Stub cổng thanh toán** có kịch bản success, failed, timeout, idempotency; hoàn thiện UI M4/M5 nếu còn.

**Sản phẩm:** `reports/static-analysis.md`, `docs/reviews/walkthrough-m4.md`, `.env.test`, Stub/Driver.
**Gate:** `lint` 0 lỗi; mọi phát hiện Major có sửa hoặc lý do; kết quả chạy lại sau sửa nằm trong báo cáo; `test` toàn bộ vẫn xanh.
**HUMAN:** cài SonarQube/SonarCloud nếu nhóm muốn; họp walkthrough.

---

## Ngày 10: Kiểm thử tích hợp

Theo testing-standards §6, bốn cặp: **Mạnh** M1↔M4, **Tài** M2/M3↔M4, **Ngân** M4↔M5, **Lộc** M4/M5↔M6 (dùng Stub). Viết test tích hợp ở `server/tests/integration/`, tên `[TC-...]` khi gắn test case. Lỗi tìm thấy ghi `DEF-nnn`, sửa và chạy lại. Mạnh tổng hợp `reports/integration-report.md`.

**Gate:** `npm run test:integration` qua (hoặc lỗi còn lại đều có DEF mở và nêu trong báo cáo); `tc:sync` cập nhật trạng thái; báo cáo có kịch bản và kết quả thật.
**HUMAN:** không.

---

## Ngày 11: System Test vòng 1

- Mỗi người **chạy TC của module mình viết** (Mạnh: M2, M3; Tài: M4, M5; Ngân: M6; Lộc: M1, M7). Tự động: `npm run test:system` rồi `tc:sync`. Thủ công: `tc:record`.
- Ghi DEF thật cho mọi Fail. **Lộc triage cuối ngày** (`docs/defects/triage-YYYYMMDD.md`).
- Sau vòng 1: rà soát test case, bổ sung ca mới theo lỗi gặp (cập nhật RTM, CR); phiên khám phá 60 phút theo hiến chương.

**Sản phẩm:** `reports/execution-log.csv`, `docs/defects/defects.csv`, triage, ghi chú khám phá.
**Gate:** mọi TC `auto` đã có kết quả thật; danh sách TC `manual` chưa chạy được liệt kê rõ là `HUMAN-PENDING`; mọi Fail có DEF.
**HUMAN:** chạy TC thủ công, phiên khám phá.

---

## Ngày 12: Sửa lỗi, re-test, phi chức năng

- Mỗi người sửa lỗi thuộc module mình, **vai TESTER re-test đúng TC đã Fail**, vòng đời lỗi đúng (`Open → Fixed → Pending Retest → Retest → Closed`).
- Phi chức năng theo testing-standards §9: **Mạnh** bảo mật (NFR-02), **Tài** usability/responsive/trình duyệt (NFR-03, 05), **Ngân** đồng thời (NFR-04), **Lộc** hiệu năng (NFR-01). Số liệu thô vào `reports/raw/`.
- Tổng hợp `reports/nfr-report.md`.

**Gate:** `test:system` và `test:nfr` chạy xong, kết quả thật; mọi lỗi Critical/High đang xử lý có DEF với trạng thái đúng.
**HUMAN:** kiểm tra thủ công usability, trình duyệt và thiết bị; cài k6 (hoặc dùng `autocannon`).

---

## Ngày 13: Hồi quy, UAT, Exit criteria, đóng băng tính năng

- **Mạnh:** viết `scripts/exit-check.mjs`, chạy và lưu `reports/exit-criteria.md`; đóng băng tính năng (chỉ sửa lỗi), tag `v1.0-rc`.
- **Tài:** coverage cuối (`reports/raw/coverage/`), cập nhật RTM, `reports/static-analysis.md` bản cuối.
- **Ngân:** bộ hồi quy: `tests/postman/` (collection chạy bằng Newman: smoke và API cho yêu cầu Must), `npm run test:regression`; chạy toàn bộ → `reports/regression-report.md`.
- **Lộc:** bộ UAT trong `docs/uat/` (kịch bản từ UC-01..08, phiếu phản hồi, hướng dẫn tổ chức cho 5–8 người ngoài nhóm); sau khi có phiếu thật: `reports/uat-report.md`.

**Gate:** `npm run test:regression` kết quả thật; `exit:check` chạy ra bảng PASS/FAIL kèm số liệu; tiêu chí UAT là `HUMAN-PENDING` nếu chưa có phiếu.
**HUMAN:** tổ chức UAT/Alpha và thu phiếu thật.

---

## Ngày 14: Báo cáo cuối, đóng gói, demo

- **Mạnh:** `reports/final-test-report.md` (testing-standards §11, số liệu thật, nêu thẳng lỗi còn mở) và `docs/lessons-learned.md` (nháp từ PROGRESS và defect log để nhóm chỉnh).
- **Tài:** đóng gói `submission/` (SRS, SDD, Test Plan, test case, RTM, review records, báo cáo, mã nguồn, README chạy dự án) bằng `scripts/export-docs.mjs`; xuất docx/pdf nếu có `pandoc`; tag `v1.0`.
- **Ngân:** `docs/demo/script.md` (kịch bản demo theo UC-04 → UC-06, dữ liệu mẫu, thứ tự bấm), kịch bản quay video; kiểm tra chạy sạch từ máy mới (`git clone` → `npm install` → `db:migrate` → `db:seed` → `npm run dev`).
- **Lộc:** `docs/demo/slides-outline.md` (dàn ý slide: bài toán, hướng 1, V-model, kỹ thuật dùng, số liệu thật, bài học) và bản trình bày.

**Gate:** `npm run lint && npm run typecheck && npm test && npm run build` qua trên bản sạch; `rtm:check`, `exit:check` mới nhất; `submission/` đủ danh sách sản phẩm của TP-01 §11.
**HUMAN:** quay video demo, thuyết trình, bổ sung bài học kinh nghiệm bằng trải nghiệm thật.

---

## Kiểm toán cuối (sau Ngày 14)

Chạy `npm run lint`, `typecheck`, `test`, `test:regression`, `rtm:check`, `exit:check`. Rà: (1) mọi con số trong báo cáo có file thô; (2) không test bị `skip`/`only`; (3) mọi TC `Pass` có dòng trong `execution-log.csv`; (4) mọi CR có trạng thái; (5) tag đủ; (6) danh sách `HUMAN-PENDING` còn lại. Báo cáo kiểm toán nêu rõ việc nào đạt, việc nào chưa, việc nào cần người.
