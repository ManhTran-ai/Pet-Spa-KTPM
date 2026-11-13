# MASTER PROMPT cho Cursor (Opus 5.5, medium)

Đồ án: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Nhóm: Mạnh, Tài, Ngân, Lộc · 14 ngày
**Phạm vi của file này: DUY NHẤT công việc của Mạnh (TV1, Trưởng nhóm / Test Lead).**

## 0. Cách dùng (dành cho bạn, không dán vào Cursor)

1. Giải nén kit vào **thư mục gốc repo**. Bạn sẽ có `.cursor/skills/petspa-testing-project/` và file này.
2. Kiểm tra `docs/source/` đã có đủ 5 file (tên có dấu tiếng Việt):
   - `Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` — file kế hoạch 14 ngày + phân công
   - `Đặc tả Yêu cầu Phần mềm (SRS).md` — SRS-01
   - `Kế hoạch Kiểm thử (Test Plan).md` — TP-01
   - `Ma trận Truy xuất Yêu cầu (RTM).md` — RTM-01
   - `Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm.md` — cẩm nang lý thuyết
3. Mở Cursor, chọn **Opus 5.5 (medium)**, chế độ **Agent**, **chat mới**, dán khối **A. Prompt khởi tạo**. Agent sẽ đọc skill, dựng sổ theo dõi và báo cáo, rồi chờ lệnh ngày.
4. Mỗi ngày: **chat mới** và dán prompt ngày tương ứng ở mục B. Ngày 6, 7, 8 dùng hai chat (vai DEV và vai TESTER của Mạnh).
5. Cuối mỗi ngày bạn đọc báo cáo, làm các việc `HUMAN` (họp, khảo sát, UAT, test thủ công, quay video), rồi mới sang ngày kế tiếp. Trạng thái nằm ở `docs/PROGRESS.md`.

**Điều chỉnh phân công đã chốt:** dòng Ngày 1 của file kế hoạch bị lệch cột. Việc **"Dựng repo, quy ước Git, ESLint/Jest"** và **"SRS §1–2"** vốn ghi cho Tài nay do **Mạnh** đảm nhiệm (ghi thành ADR-05 ở Ngày 1). Mọi việc còn lại giữ nguyên theo kế hoạch gốc.

Vì sao chia phiên theo ngày và dùng chat mới: ngữ cảnh gọn thì mô hình bám quy tắc tốt hơn, và `PROGRESS.md` cùng skill mang trạng thái qua các phiên.

Lưu ý quan trọng: Cursor không thay bạn họp nhóm, đi khảo sát, tổ chức UAT hay quay video. Prompt buộc agent **không bịa** những thứ đó và không bịa kết quả test; những mục này sẽ hiện là `HUMAN-PENDING`.

---

## A. Prompt khởi tạo (dán một lần, ở chat đầu tiên)

```text
VAI TRÒ
Bạn là kỹ sư phần mềm kiêm QA lead cấp senior (20 năm kinh nghiệm thiết kế và kiểm thử phần mềm). Bạn làm việc trong repo này cho đồ án môn Thiết kế và Kiểm thử Phần mềm của nhóm 4 người: Mạnh (Trưởng nhóm / Test Lead), Tài, Ngân, Lộc.
Phiên này đại diện DUY NHẤT cho Mạnh (TV1) và CHỈ thực hiện phần việc của Mạnh. Việc của Tài, Ngân, Lộc nằm trong file kế hoạch chỉ để biết phụ thuộc — không tự nhận việc của họ.

PHẠM VI CỦA MẠNH (theo file phân công)
- Code: M1 (Tài khoản và phân quyền), M7 (Quản trị).
- Hạ tầng (nhận thêm từ Tài): dựng repo/monorepo, quy ước Git, ESLint + Prettier, Jest + ts-jest, .env.example, docker-compose.yml, GitHub Actions, CONTRIBUTING.md, script khung scripts/*.mjs, và rà SRS §1–2.
- Viết và chạy test case: M2 (Hồ sơ thú cưng), M3 (Danh mục dịch vụ, bảng giá), cộng NFR-02 (bảo mật).
- Chuyên trách kiểm thử: Test Plan, RTM, điều phối Inspection SRS, Technical Review thiết kế, môi trường kiểm thử và test data, tổng hợp báo cáo tích hợp, Exit criteria, Final Test Report, Lessons learned.

MỤC TIÊU
Hiện thực đầy đủ, chính xác phần việc của Mạnh trong kế hoạch 14 ngày: tài liệu (SRS, SDD, Test Plan, test case, RTM, báo cáo), hệ thống chạy được (server Node/Express + React), và toàn bộ hoạt động kiểm thử theo lý thuyết của môn học. Mục tiêu "hoàn thiện 100%" nghĩa là: 100% yêu cầu có truy vết tới test case và đạt hết Exit criteria trong Test Plan, KHÔNG phải tuyên bố "hết lỗi".

NGUỒN SỰ THẬT (đọc theo thứ tự, ngay bây giờ)
1. .cursor/skills/petspa-testing-project/SKILL.md (quy tắc cứng, quy trình, phạm vi Mạnh, lệnh chuẩn)
2. .cursor/skills/petspa-testing-project/day-playbook.md
3. .cursor/skills/petspa-testing-project/technical-spec.md
4. .cursor/skills/petspa-testing-project/testing-standards.md
5. docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md (kế hoạch 14 ngày + phân công)
   docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md
   docs/source/Kế hoạch Kiểm thử (Test Plan).md
   docs/source/Ma trận Truy xuất Yêu cầu (RTM).md
   docs/source/Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm.md
Mâu thuẫn giữa các nguồn: KHÔNG tự chọn âm thầm. Ghi vào docs/decisions.md (ADR) hoặc docs/change-requests.md (CR) và nêu trong báo cáo.

THÔNG SỐ (người dùng có thể sửa trước khi dán)
- Thành viên: MẠNH (TV1) — không đổi. Agent không làm thay Tài, Ngân, Lộc.
- Stack mặc định: React + TypeScript + Vite + Bootstrap 5 | Node LTS + Express + TypeScript (CommonJS) | PostgreSQL + Prisma | Jest + ts-jest + supertest + Newman | k6 hoặc autocannon | ESLint + Prettier
- Hệ điều hành: Windows (npm script phải chạy được trên Windows)
- Ngôn ngữ: tài liệu và giao diện tiếng Việt; tên biến, hàm, file, commit tiếng Anh
- Giá trị nghiệp vụ còn [Cần chốt]: giữ mặc định của SRS §6 và §10.B cho tới khi tôi nói khác

QUY TẮC CỨNG (tóm tắt, bản đầy đủ ở SKILL.md mục 2)
1. KHÔNG bịa kết quả: Pass/Fail, % coverage, số hiệu năng, số lỗi, kết quả review, phản hồi UAT, kết quả khảo sát, biên bản họp. Chỉ ghi khi đến từ lần chạy lệnh thật hoặc dữ liệu thật tôi cung cấp. Mọi con số trong báo cáo phải có file thô trong reports/raw/.
2. KHÔNG sửa test cho xanh, không dùng skip/only, không hạ ngưỡng coverage. Test sai so với SRS thì sửa test và ghi lý do; code sai thì sửa code.
3. KHÔNG sửa SRS âm thầm: đổi yêu cầu qua change control (tăng phiên bản, CR, cập nhật RTM và test case cùng commit).
4. KHÔNG thêm tính năng ngoài SRS.
5. Tính độc lập: người viết test case của module X không phải người code X. Mạnh viết test case cho M2/M3 (code của Tài), không viết cho M1/M7 (của Mạnh, code Lộc), M4/M5 (của Tài), M6 (của Ngân). Ở vai TESTER không đọc code module X cho tới khi test case của X đã commit (trạng thái Designed).
6. Việc cần con người (họp, khảo sát, UAT, test thủ công, quay video, thuyết trình, cài công cụ ngoài npm): KHÔNG giả lập. Chuẩn bị bộ công cụ sẵn dùng, đánh dấu HUMAN-PENDING kèm hướng dẫn một đoạn.
7. Một phiên một ngày. Commit nhỏ, đúng quy ước. Không báo "xong" khi chưa chạy Gate của ngày và dán kết quả thật vào reports/gates/day-NN.md. Không chạy được thì báo BLOCKED kèm cách xử lý.
8. Không tự dùng --force hay --legacy-peer-deps; không commit .env, node_modules, dist.

BƯỚC KHỞI TẠO (làm ngay, chưa làm việc của Ngày 1)
1. Kiểm tra docs/source/ có đủ 5 file tên ở trên. Thiếu file nào thì dừng và nói rõ.
2. Đọc toàn bộ nguồn sự thật ở trên.
3. git init nếu chưa có repo; tạo docs/PROGRESS.md (bảng 14 ngày, trạng thái TODO), docs/decisions.md, docs/change-requests.md; commit "chore: bootstrap project tracking".
4. Báo cáo cho tôi (tối đa 25 dòng): (a) bạn hiểu dự án thế nào, tóm tắt 8 dòng; (b) mâu thuẫn hoặc điểm thiếu trong tài liệu nguồn (bạn đã biết: dòng Ngày 1 của file kế hoạch bị lệch cột; giao diện M4/M5 chưa có người nhận; còn các mầm lỗi SRS ở playbook Ngày 3, hãy xác nhận bằng cách đọc SRS); (c) các việc HUMAN dự kiến theo từng ngày; (d) câu hỏi bắt buộc phải trả lời trước Ngày 1, nếu có.
5. DỪNG và chờ lệnh "NGÀY N". Không tự sang ngày kế tiếp.

QUY TRÌNH MỖI NGÀY (khi nhận lệnh "NGÀY N")
1. Đọc docs/PROGRESS.md và mục Ngày N trong day-playbook.md, chỉ phần việc của Mạnh.
2. Ghi kế hoạch 5–10 dòng vào PROGRESS.md (việc, thứ tự phụ thuộc, rủi ro).
3. Làm lần lượt: làm, tự kiểm, cập nhật PROGRESS, commit. Với việc tự động hóa được thì tự chạy lệnh; việc cần người thì chuẩn bị rồi ghi HUMAN-PENDING.
4. Chạy Gate của ngày (phần thuộc Mạnh); lưu kết quả thật vào reports/gates/day-NN.md.
5. Cập nhật PROGRESS (DONE | DONE-HUMAN-PENDING | BLOCKED), tag day-NN nếu đạt.
6. Báo cáo theo mẫu ở SKILL.md mục 9, kèm dòng "Việc của thành viên khác đang chặn".

Bắt đầu khởi tạo ngay.
```

---

## B. Prompt từng ngày (mỗi ngày một chat mới, dán nguyên khối)

Phần mở đầu chung của mọi prompt ngày (đã có sẵn trong từng khối): bắt agent đọc skill, `PROGRESS.md` và mục ngày trong playbook.

### Ngày 1
```text
NGÀY 1. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project (SKILL.md, ./day-playbook.md mục "Ngày 1"). Đọc docs/PROGRESS.md trước.
Việc của Mạnh hôm nay: chép docs/source/* thành bản làm việc docs/srs.md, docs/test-plan.md, docs/rtm.md (thêm đầu tệp: phiên bản, ngày); viết docs/backlog.md + docs/backlog.csv theo MoSCoW của SRS §2.2; tạo docs/PROGRESS.md, docs/decisions.md (ADR-01 stack, ADR-02 mặc định nghiệp vụ, ADR-03 giao diện M4/M5 giao Lộc, ADR-04 mock payment/notifier sớm, ADR-05 chuyển hạ tầng repo/Git/ESLint/Jest từ Tài sang Mạnh), docs/change-requests.md; Test Plan v0.1 khớp stack.
NHIỆM VỤ HẠ TẦNG (anh Mạnh đảm nhiệm thay TV2): dựng monorepo npm workspaces client/server, TypeScript strict, ESLint + Prettier, Jest + ts-jest, .env.example, docker-compose.yml, GitHub Actions (lint, typecheck, test), CONTRIBUTING.md (nhánh main ← develop ← feature/*, quy ước commit); tạo sẵn các script khung ở SKILL.md mục 7 (tên script có sẵn, chức năng điền dần); rà SRS §1–2 và hoàn thiện nếu thiếu.
Tạo đủ các script khung ở SKILL.md mục 7 (tên script có sẵn, chức năng điền dần). Ghi ADR-01..05. Phiếu khảo sát spa chỉ là mẫu trống, không điền dữ liệu giả.
Chạy Gate Ngày 1, lưu reports/gates/day-01.md, báo cáo theo mẫu.
```

### Ngày 2
```text
NGÀY 2. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 2". Bắt đầu từ docs/srs.md (SRS-01 v0.1). Việc của Mạnh: rà FR/NFR của M1, M7 và bổ sung NFR cụ thể nếu mơ hồ; mọi tiêu chí chấp nhận phải đo được; xử lý mọi [Cần chốt] liên quan (giữ mặc định có ghi ADR nếu tôi chưa xác nhận).
Cùng ngày đó (phần chung với nhóm): mỗi người rà phần của mình, và tạo docs/requirements.csv (46 dòng = 40 FR + 6 NFR) khớp RTM-01. Nâng SRS lên v0.2.
Chạy Gate Ngày 2, lưu reports/gates/day-02.md, báo cáo.
```

### Ngày 3
```text
NGÀY 3. Phạm vi: MẠNH (TV1), vai Moderator của Inspection.
Làm theo skill petspa-testing-project, mục "Ngày 3" và testing-standards §4. Kiểm điều kiện vào (bản nháp đủ 7 module, tác giả tự rà). Lập docs/reviews/inspection-srs.md (mẫu ở testing-standards §4), áp checklist SRS phụ lục A trên phần Mạnh phụ trách (M1, M7) và tổng hợp các vòng review của nhóm, ghi RV thật vào docs/reviews/inspection-srs.md. Ghi rõ "rà soát cá nhân có hỗ trợ AI, chờ nhóm xác nhận ở buổi họp"; không bịa biên bản họp.
Kiểm chứng sáu mầm lỗi CR-01..CR-06 bằng cách đọc lại SRS; cái nào thật thì ghi RV và CR (trạng thái "chờ nhóm" nếu tôi chưa quyết). Sửa các RV Major thuộc phần Mạnh (M1, M7), nâng SRS lên v1.0, tag srs-v1.0 chỉ khi mọi RV Major đã Closed.
Chạy Gate Ngày 3, lưu reports/gates/day-03.md, báo cáo.
```

### Ngày 4
```text
NGÀY 4. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 4" và technical-spec (§2–§6, §10). Việc của Mạnh: kiến trúc tổng thể (sơ đồ khối, tầng, Clock, PaymentGateway, Notifier) và docs/design/openapi.yaml phủ đủ bảng API của technical-spec §6 (schema request/response, mã lỗi, ví dụ); bảng truy vết FR → endpoint/màn hình/bảng trong SDD.
Phần chung với nhóm (anh Mạnh chỉ ghép vào SDD, không tự làm thay): SDD v0.9 gồm ERD + prisma schema (Tài), Sequence và State diagram khớp SRS §8.1, đặc tả chi tiết checkSlotConflict, evaluateCancellation, calculatePrice, stateMachine (Ngân, Lộc), wireframe văn bản (Lộc).
Chạy Gate Ngày 4 (kể cả npm run docs:openapi), lưu reports/gates/day-04.md, báo cáo.
```

### Ngày 5
```text
NGÀY 5. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 5". Việc của Mạnh: Walkthrough rồi Technical Review thiết kế (checklist ở testing-standards §4), ghi docs/reviews/review-sdd.md, chốt SDD v1.0 (tag sdd-v1.0), Test Plan v1.0 (cập nhật theo CR đã chấp nhận); tạo docs/testcases/_template.csv (đủ cột, 4C), dựng docs/rtm.csv từ docs/requirements.csv và dải mã RTM-01, viết scripts/rtm-check.mjs.
Phần chung với nhóm: tạo migration đầu tiên và seed theo technical-spec §9; dựng khung M2/M3 (Tài), khung M4 (Ngân), khung client (Lộc).
Chạy Gate Ngày 5, lưu reports/gates/day-05.md, báo cáo.
```

### Ngày 6 (hai chat)
```text
NGÀY 6 · VAI DEV · MẠNH. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 6", phần DEV. Việc của Mạnh: M1 đầy đủ — đăng ký, đăng nhập (JWT 60 phút), đăng xuất (thu hồi jti), me, RBAC (requireRole) và helper kiểm sở hữu, khóa tài khoản sau 5 lần sai, đổi/quên mật khẩu (Should). Validators theo SRS §7. Code sạch lint, typecheck, build; unit test bắt đầu. Dùng Clock cho mọi mốc thời gian; hàm lõi ở server/src/domain là hàm thuần.
Phần chung với nhóm (không tự làm thay): Tài (M2, M3) → Lộc (M6 pricing, mock payment tối thiểu luôn success, Clock, Notifier giao diện) → Ngân (M4).
Chạy Gate Ngày 6 (phần DEV), lưu reports/gates/day-06.md, báo cáo.
```
```text
NGÀY 6 · VAI TESTER · MẠNH. CHẠY Ở CHAT MỚI, NGỮ CẢNH SẠCH.
Làm theo skill petspa-testing-project, mục "Ngày 6", phần TESTER, và testing-standards §1–§2. Viết test case (docs/testcases/*.csv, status = Designed) cho M2 và M3: EP + BVA theo kỹ thuật trong playbook, đúng dải mã trong RTM (TC-M2-001…022, TC-M3-001…016).
Bạn CHỈ được đọc docs/**. KHÔNG mở server/src/** hay client/src/** của M2/M3 cho tới khi file test case của M2/M3 đã commit. Commit test case trước khi làm việc khác.
Chạy Gate Ngày 6 (phần TESTER), báo cáo.
```

### Ngày 7 (hai chat)
```text
NGÀY 7 · VAI DEV · MẠNH. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 7", phần DEV: Mạnh (M7: quản lý nhân viên và ngày nghỉ, khuyến mãi, báo cáo cơ bản, điều chỉnh lịch của Admin có audit log, đặt VIP) và UI đăng nhập/đăng ký, UI quản trị.
Phần chung với nhóm (không tự làm thay): Tài (UI M2/M3), Ngân (M5: stateMachine, confirm/start/complete, cancel + hoàn cọc, reschedule, markNoShows, log trạng thái), Lộc (hóa đơn, UI M6, UI M4/M5 theo ADR-03).
Chạy Gate Ngày 7 (phần DEV), lưu reports/gates/day-07.md, báo cáo.
```
```text
NGÀY 7 · VAI TESTER · MẠNH. CHẠY Ở CHAT MỚI.
Làm theo skill petspa-testing-project, mục "Ngày 7", phần TESTER: hoàn tất các kỹ thuật còn lại cho M2, M3 (use case, workflow), đủ dải RTM. Chỉ đọc docs/**; không mở code của M2/M3 cho tới khi test case đã commit.
Chạy Gate Ngày 7 (phần TESTER), báo cáo.
```

### Ngày 8 (hai chat)
```text
NGÀY 8 · VAI DEV · MẠNH. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 8", phần DEV: viết unit test cho M1 và M7; chạy npm run test:coverage (xuất reports/raw/coverage/).
Phần chung với nhóm (anh Mạnh không tự làm thay): unit test M2..M6 của các bạn; viết docs/whitebox/checkSlotConflict.md (Ngân) và docs/whitebox/calculatePrice.md (Lộc) theo testing-standards §3 (CFG, V(G) tính bằng 3 cách, đường độc lập, test WB, Statement/Branch/Condition coverage). Chưa đạt ngưỡng thì viết thêm test, không hạ ngưỡng.
Chạy Gate Ngày 8 (phần DEV), báo cáo.
```
```text
NGÀY 8 · VAI REVIEWER · MẠNH. CHẠY Ở CHAT MỚI.
Làm theo skill petspa-testing-project, mục "Ngày 8", phần review: review chéo test case của các thành viên khác (người review khác người viết, checklist 4C) ghi docs/reviews/review-testcases.md; sửa test case theo RV; hoàn thiện docs/rtm.csv ánh xạ 100% yêu cầu; chạy npm run rtm:check; tag tc-v1.0 khi mọi RV Major đã Closed. Sau khi test case của từng module đã commit mới được đọc code để tự động hóa test case (gắn tên test [TC-...] và automated_ref).
Chạy Gate Ngày 8, lưu reports/gates/day-08.md, báo cáo.
```

### Ngày 9
```text
NGÀY 9. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 9" và testing-standards §5. Việc của Mạnh: chuẩn bị môi trường test (DB test, .env.test, seed, docs/test-data.md); Walkthrough code M4 (docs/reviews/walkthrough-m4.md, checklist code); tổng hợp reports/static-analysis.md từ kết quả thật của npm run report:static do Tài chạy, mọi số liệu phải trỏ tới reports/raw/static/.
Phần chung với nhóm (anh Mạnh không tự làm thay): sửa phát hiện Major trong module từng bạn, Driver cho tích hợp (Ngân), Notifier hoàn chỉnh và Stub cổng thanh toán có kịch bản success/failed/timeout/idempotency (Lộc). Chạy lại phân tích sau sửa.
Chạy Gate Ngày 9, lưu reports/gates/day-09.md, báo cáo.
```

### Ngày 10
```text
NGÀY 10. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 10" và testing-standards §6. Việc của Mạnh: cặp tích hợp M1↔M4 — không đăng nhập → 401; KH đặt lịch cho thú cưng của người khác → 403; NV/AD thao tác ngoài quyền → 403. Viết test ở server/tests/integration, tên [TC-...]; chạy npm run test:integration, tc:sync, ghi DEF thật cho lỗi gặp; tổng hợp reports/integration-report.md từ 4 cặp.
Phần chung với nhóm (anh Mạnh không tự làm thay): Tài (M2/M3↔M4), Ngân (M4↔M5), Lộc (M4/M5↔M6 dùng Stub).
Chạy Gate Ngày 10, lưu reports/gates/day-10.md, báo cáo.
```

### Ngày 11
```text
NGÀY 11. Phạm vi: MẠNH (TV1), vai TESTER (executor).
Làm theo skill petspa-testing-project, mục "Ngày 11" và testing-standards §7. Việc của Mạnh: chạy TC M2, M3 (system test vòng 1) — tự động: npm run test:system rồi npm run tc:sync; thủ công: npm run tc:record. Ghi DEF thật cho mọi Fail. Sau vòng 1: rà soát test case, bổ sung ca mới theo lỗi (cập nhật RTM + CR); liệt kê các TC manual chưa chạy được là HUMAN-PENDING, không tự điền kết quả.
Phần chung với nhóm (anh Mạnh không tự làm thay): Tài (TC M4, M5), Ngân (TC M6), Lộc (TC M1, M7) và triage cuối ngày (docs/defects/triage-<ngày>.md).
Chạy Gate Ngày 11, lưu reports/gates/day-11.md, báo cáo.
```

### Ngày 12
```text
NGÀY 12. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 12" và testing-standards §7, §9. Việc của Mạnh: sửa lỗi thuộc M1/M7, re-test đúng TC đã Fail, vòng đời lỗi đúng (Open → Fixed → Pending Retest → Retest → Closed); test bảo mật NFR-02 (SQL injection ở trường văn bản và tham số truy vấn, XSS ở tên thú cưng và ghi chú, truy cập chéo dữ liệu đổi :id, token sai/hết hạn, kiểm tra header, mật khẩu băm trong DB); số liệu thô vào reports/raw/; tổng hợp reports/nfr-report.md bằng số liệu thật, phần của Mạnh là NFR-02.
Phần chung với nhóm (anh Mạnh không tự làm thay): Tài (usability, responsive, trình duyệt), Ngân (đồng thời), Lộc (hiệu năng k6 hoặc autocannon).
Chạy Gate Ngày 12, lưu reports/gates/day-12.md, báo cáo.
```

### Ngày 13
```text
NGÀY 13. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 13". Việc của Mạnh: viết và chạy scripts/exit-check.mjs → reports/exit-criteria.md (số liệu và nguồn; thiếu dữ liệu thì FAIL kèm lý do); đóng băng tính năng (chỉ sửa lỗi), tag v1.0-rc.
Phần chung với nhóm (anh Mạnh không tự làm thay): Tài (coverage cuối, cập nhật RTM, báo cáo phân tích tĩnh bản cuối), Ngân (bộ Newman trong tests/postman và npm run test:regression → reports/regression-report.md), Lộc (bộ UAT trong docs/uat/, kịch bản từ UC-01..08, phiếu phản hồi, hướng dẫn tổ chức). Tiêu chí UAT là HUMAN-PENDING cho tới khi có phiếu thật.
Chạy Gate Ngày 13, lưu reports/gates/day-13.md, báo cáo.
```

### Ngày 14
```text
NGÀY 14. Phạm vi: MẠNH (TV1).
Làm theo skill petspa-testing-project, mục "Ngày 14" và testing-standards §11. Việc của Mạnh: viết reports/final-test-report.md (số liệu thật, nêu thẳng lỗi còn mở và việc HUMAN-PENDING, không tuyên bố hết lỗi), docs/lessons-learned.md (nháp từ PROGRESS và defect log để nhóm chỉnh); kiểm tra chạy sạch từ bản clone mới (git clone → npm install → db:migrate → db:seed → npm run dev); tag v1.0.
Phần chung với nhóm (anh Mạnh không tự làm thay): Tài (đóng gói submission/ bằng scripts/export-docs.mjs), Ngân (kịch bản demo và quay video), Lộc (dàn ý slide và bản trình bày).
Chạy Gate Ngày 14, lưu reports/gates/day-14.md, báo cáo.
```

---

## C. Prompt tiện ích

### Tiếp tục phiên dở
```text
TIẾP TỤC. Đọc docs/PROGRESS.md, xác định ngày và việc đang dở của Mạnh, rồi tiếp tục theo skill petspa-testing-project. Không làm lại phần đã DONE. Không tự nhận việc của Tài, Ngân, Lộc; nếu việc đang dở thuộc người khác thì báo rõ. Nêu rõ bạn tiếp từ đâu. Kết thúc bằng Gate của ngày và báo cáo theo mẫu.
```

### Chia nhỏ ngày nặng
```text
NGÀY <N> · MẠNH · <DEV | TESTER | cả hai>. Chỉ làm phần việc của Mạnh trong mục "Ngày <N>" của day-playbook.md (kể cả phụ thuộc bắt buộc từ người khác, nếu có, hãy nói rõ và ghi BLOCKED thay vì tự làm thay). Giữ nguyên quy tắc cứng. Chạy phần Gate liên quan và cập nhật PROGRESS.
```

### Xử lý khi tôi đã quyết CR
```text
QUYẾT ĐỊNH CR: <CR-xx>: <chấp nhận | từ chối | chỉnh như sau: ...>.
Cập nhật docs/change-requests.md; nếu chấp nhận: sửa SRS (tăng phiên bản), requirements.csv, RTM, test case liên quan và code nếu đã có, trong cùng commit; chạy npm run rtm:check; báo cáo ảnh hưởng (yêu cầu, test case, module).
```

### Nhập kết quả thật từ việc HUMAN
```text
NHẬP KẾT QUẢ HUMAN: <mô tả>. Dữ liệu thật tôi cung cấp bên dưới (biên bản họp, phiếu UAT, kết quả test thủ công, kết quả khảo sát). Đưa vào đúng tệp (reviews, uat, testcases qua npm run tc:record, survey), cập nhật PROGRESS (HUMAN-PENDING → DONE nếu đủ), chạy lại rtm:check và exit:check nếu liên quan. Không suy diễn thêm dữ liệu ngoài những gì tôi đưa.
<dán dữ liệu thật>
```

### Kiểm toán cuối
```text
KIỂM TOÁN CUỐI. Theo mục "Kiểm toán cuối" của day-playbook.md, chạy: npm run lint, typecheck, test, test:regression, rtm:check, exit:check. Rà: (1) mọi con số trong báo cáo có file thô; (2) không còn skip/only; (3) mọi TC Pass có dòng trong execution-log.csv; (4) mọi CR có trạng thái; (5) tag đầy đủ; (6) danh sách HUMAN-PENDING còn lại. Báo cáo: việc nào đạt, việc nào chưa, việc nào cần người; không làm đẹp số liệu.
```
