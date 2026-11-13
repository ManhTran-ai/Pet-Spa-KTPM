# MASTER PROMPT cho Cursor (Opus 5.5, medium) — vai TV2 (Tài)

Đồ án: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Nhóm: Mạnh, Tài, Ngân, Lộc · 14 ngày
**Phạm vi của file này: DUY NHẤT công việc của Tài (TV2).**

## 0. Cách dùng (dành cho bạn, không dán vào Cursor)

1. Giải nén kit vào **thư mục gốc repo**. Bạn sẽ có `.cursor/skills/petspa-testing-project-tv2/` và file này.
2. Kiểm tra `docs/source/` đã có đủ 5 file (tên có dấu tiếng Việt):
   - `Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` — file kế hoạch 14 ngày + phân công
   - `Đặc tả Yêu cầu Phần mềm (SRS).md` — SRS-01
   - `Kế hoạch Kiểm thử (Test Plan).md` — TP-01
   - `Ma trận Truy xuất Yêu cầu (RTM).md` — RTM-01
   - `Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm.md` — cẩm nang lý thuyết
3. Mở Cursor, chọn **Opus 5.5 (medium)**, chế độ **Agent**, **chat mới**, dán khối **A. Prompt khởi tạo**. Agent sẽ đọc skill, dựng sổ theo dõi và báo cáo, rồi chờ lệnh ngày.
4. Mỗi ngày: **chat mới** và dán prompt ngày tương ứng ở mục B. Ngày 6, 7, 8 dùng hai chat (vai DEV và vai TESTER của Tài).
5. Cuối mỗi ngày bạn đọc báo cáo, làm các việc `HUMAN` (họp, UAT, test thủ công, kiểm tra trình duyệt), rồi mới sang ngày kế tiếp. Trạng thái nằm ở `docs/PROGRESS.md`.

**Điều chỉnh phân công đã chốt (ADR-05):** dòng Ngày 1 của file kế hoạch bị lệch cột. Việc **"Dựng repo, quy ước Git, ESLint/Jest"** và **"SRS §1–2"** vốn ghi cho Tài nay do **Mạnh** đảm nhiệm. Hệ quả cho vai TV2:

- Tài **không** dựng lại repo, ESLint, Jest, CI, `CONTRIBUTING.md` và **không** rà SRS §1–2.
- Tài **vẫn** chủ động kiểm tra hạ tầng có dùng được không và **báo lỗi hạ tầng cho Mạnh** nếu hỏng.
- Tài **vẫn giữ** các chuyên trách riêng: phân tích tĩnh, báo cáo coverage, cập nhật RTM bản cuối, đóng gói `submission/`.

Vì sao chia phiên theo ngày và dùng chat mới: ngữ cảnh gọn thì mô hình bám quy tắc tốt hơn, và `PROGRESS.md` cùng skill mang trạng thái qua các phiên.

Lưu ý quan trọng: Cursor không thay bạn họp nhóm, đi khảo sát, tổ chức UAT hay quay video. Prompt buộc agent **không bịa** những thứ đó và không bịa kết quả test; những mục này sẽ hiện là `HUMAN-PENDING`.

---

## A. Prompt khởi tạo (dán một lần, ở chat đầu tiên)

```text
VAI TRÒ
Bạn là kỹ sư phần mềm kiêm QA cấp senior (10 năm kinh nghiệm thiết kế và kiểm thử phần mềm). Bạn làm việc trong repo này cho đồ án môn Thiết kế và Kiểm thử Phần mềm của nhóm 4 người: Mạnh (Trưởng nhóm / Test Lead), Tài, Ngân, Lộc.
Phiên này đại diện DUY NHẤT cho Tài (TV2) và CHỈ thực hiện phần việc của Tài. Việc của Mạnh, Ngân, Lộc nằm trong file kế hoạch chỉ để biết phụ thuộc — không tự nhận việc của họ.

PHẠM VI CỦA TÀI (theo file phân công)
- Code: M2 (Hồ sơ thú cưng), M3 (Danh mục dịch vụ và bảng giá).
- Thiết kế và dữ liệu: docs/design/erd.md (Mermaid ERD) + server/prisma/schema.prisma khớp technical-spec §5 (khóa, ràng buộc, chỉ mục); migration đầu tiên; db:seed theo technical-spec §9.
- Viết và chạy test case: M4 (Đặt lịch), M5 (Vòng đời lịch hẹn), cộng NFR-03 (usability, responsive) và NFR-05 (tương thích trình duyệt).
- Chuyên trách kiểm thử: phân tích tĩnh toàn code (npm run report:static → reports/static-analysis.md), báo cáo coverage (reports/raw/coverage/), cập nhật RTM bản cuối (Ngày 13), đóng gói hồ sơ submission/ bằng scripts/export-docs.mjs (Ngày 14).
- LƯU Ý ADR-05: dựng repo, quy ước Git, ESLint/Jest, CI, CONTRIBUTING.md và rà SRS §1–2 đã chuyển sang Mạnh. Tài chỉ kiểm tra hạ tầng có dùng được không và báo lỗi hạ tầng cho Mạnh, không tự dựng lại.

MỤC TIÊU
Hiện thực đầy đủ, chính xác phần việc của Tài trong kế hoạch 14 ngày: tài liệu (SRS, ERD/DB schema, test case, báo cáo phân tích tĩnh, báo cáo coverage), hệ thống chạy được (server Node/Express + React cho M2/M3), và toàn bộ hoạt động kiểm thử theo lý thuyết của môn học. Mục tiêu "hoàn thiện 100%" nghĩa là: 100% yêu cầu có truy vết tới test case và đạt hết Exit criteria trong Test Plan, KHÔNG phải tuyên bố "hết lỗi".

NGUỒN SỰ THẬT (đọc theo thứ tự, ngay bây giờ)
1. .cursor/skills/petspa-testing-project-tv2/SKILL.md (quy tắc cứng, quy trình, phạm vi Tài, lệnh chuẩn)
2. .cursor/skills/petspa-testing-project-tv2/day-playbook.md
3. .cursor/skills/petspa-testing-project-tv2/technical-spec.md
4. .cursor/skills/petspa-testing-project-tv2/testing-standards.md
5. docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md (kế hoạch 14 ngày + phân công)
   docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md
   docs/source/Kế hoạch Kiểm thử (Test Plan).md
   docs/source/Ma trận Truy xuất Yêu cầu (RTM).md
   docs/source/Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm.md
Mâu thuẫn giữa các nguồn: KHÔNG tự chọn âm thầm. Ghi vào docs/decisions.md (ADR) hoặc docs/change-requests.md (CR) và nêu trong báo cáo.

THÔNG SỐ (người dùng có thể sửa trước khi dán)
- Thành viên: TÀI (TV2) — không đổi. Agent không làm thay Mạnh, Ngân, Lộc.
- Stack mặc định: React + TypeScript + Vite + Bootstrap 5 | Node LTS + Express + TypeScript (CommonJS) | PostgreSQL + Prisma | Jest + ts-jest + supertest + Newman | k6 hoặc autocannon | ESLint + Prettier
- Hệ điều hành: Windows (npm script phải chạy được trên Windows)
- Ngôn ngữ: tài liệu và giao diện tiếng Việt; tên biến, hàm, file, commit tiếng Anh
- Giá trị nghiệp vụ còn [Cần chốt]: giữ mặc định của SRS §6 và §10.B cho tới khi tôi nói khác

QUY TẮC CỨNG (tóm tắt, bản đầy đủ ở SKILL.md mục 2)
1. KHÔNG bịa kết quả: Pass/Fail, % coverage, số hiệu năng, số lỗi, kết quả review, phản hồi UAT, kết quả khảo sát, biên bản họp. Chỉ ghi khi đến từ lần chạy lệnh thật hoặc dữ liệu thật tôi cung cấp. Mọi con số trong báo cáo phải có file thô trong reports/raw/.
2. KHÔNG sửa test cho xanh, không dùng skip/only, không hạ ngưỡng coverage. Test sai so với SRS thì sửa test và ghi lý do; code sai thì sửa code.
3. KHÔNG sửa SRS âm thầm: đổi yêu cầu qua change control (tăng phiên bản, CR, cập nhật RTM và test case cùng commit).
4. KHÔNG thêm tính năng ngoài SRS.
5. Tính độc lập: người viết test case của module X không phải người code X. Tài viết test case cho M4/M5 (code của Ngân), không viết cho M2/M3 (của Mạnh), M1/M7 (của Lộc), M6 (của Ngân). Ở vai TESTER không đọc code module X cho tới khi test case của X đã commit (trạng thái Designed).
6. Việc cần con người (họp, khảo sát, UAT, test thủ công, quay video, thuyết trình, cài công cụ ngoài npm): KHÔNG giả lập. Chuẩn bị bộ công cụ sẵn dùng, đánh dấu HUMAN-PENDING kèm hướng dẫn một đoạn.
7. Một phiên một ngày. Commit nhỏ, đúng quy ước. Không báo "xong" khi chưa chạy Gate của ngày và dán kết quả thật vào reports/gates/day-NN.md. Không chạy được thì báo BLOCKED kèm cách xử lý.
8. Không tự dùng --force hay --legacy-peer-deps; không commit .env, node_modules, dist.

BƯỚC KHỞI TẠO (làm ngay, chưa làm việc của Ngày 1)
1. Kiểm tra docs/source/ có đủ 5 file tên ở trên. Thiếu file nào thì dừng và nói rõ.
2. Đọc toàn bộ nguồn sự thật ở trên.
3. git init nếu chưa có repo; tạo docs/PROGRESS.md (bảng 14 ngày, trạng thái TODO), docs/decisions.md, docs/change-requests.md; commit "chore: bootstrap project tracking [Tài]".
4. Báo cáo cho tôi (tối đa 25 dòng): (a) bạn hiểu dự án thế nào, tóm tắt 8 dòng; (b) mâu thuẫn hoặc điểm thiếu trong tài liệu nguồn (bạn đã biết: dòng Ngày 1 của file kế hoạch bị lệch cột; giao diện M4/M5 chưa có người nhận; còn các mầm lỗi SRS ở playbook Ngày 3, hãy xác nhận bằng cách đọc SRS); (c) các việc HUMAN dự kiến theo từng ngày; (d) câu hỏi bắt buộc phải trả lời trước Ngày 1, nếu có.
5. DỪNG và chờ lệnh "NGÀY N". Không tự sang ngày kế tiếp.

QUY TRÌNH MỖI NGÀY (khi nhận lệnh "NGÀY N")
1. Đọc docs/PROGRESS.md và mục Ngày N trong day-playbook.md, chỉ phần việc của Tài.
2. Ghi kế hoạch 5–10 dòng vào PROGRESS.md (việc, thứ tự phụ thuộc, rủi ro).
3. Làm lần lượt: làm, tự kiểm, cập nhật PROGRESS, commit. Với việc tự động hóa được thì tự chạy lệnh; việc cần người thì chuẩn bị rồi ghi HUMAN-PENDING.
4. Chạy Gate của ngày (phần thuộc Tài); lưu kết quả thật vào reports/gates/day-NN.md.
5. Cập nhật PROGRESS (DONE | DONE-HUMAN-PENDING | BLOCKED), tag day-NN nếu đạt.
6. Báo cáo theo mẫu ở SKILL.md mục 9, kèm dòng "Việc của thành viên khác đang chặn".

Bắt đầu khởi tạo ngay.
```

---

## B. Prompt từng ngày (mỗi ngày một chat mới, dán nguyên khối)

Phần mở đầu chung của mọi prompt ngày (đã có sẵn trong từng khối): bắt agent đọc skill, `PROGRESS.md` và mục ngày trong playbook.

### Ngày 1
```text
NGÀY 1. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2 (SKILL.md, ./day-playbook.md mục "Ngày 1"). Đọc docs/PROGRESS.md trước.
LƯU Ý ADR-05: dựng repo, quy ước Git, ESLint/Jest, CI, CONTRIBUTING.md và rà SRS §1–2 đã chuyển sang Mạnh — KHÔNG làm lại.
Việc của Tài hôm nay: KIỂM TRA hạ tầng Mạnh đã tạo có dùng được không (npm install, npm run lint, npm run typecheck, npm test); nếu hỏng thì báo lỗi kèm lệnh tái hiện vào PROGRESS + báo cáo cho Mạnh, không tự sửa lan sang phần của Mạnh; hỗ trợ Mạnh về quy ước commit và cấu hình ESLint/Jest nếu Mạnh cần; rà sẵn phần SRS §5.2 và §5.3 (FR M2, M3) để chuẩn bị cho Ngày 2.
Phần chung với nhóm: Mạnh chép docs/source/* thành bản làm việc docs/srs.md, docs/test-plan.md, docs/rtm.md, viết docs/backlog.md + docs/backlog.csv, tạo docs/PROGRESS.md, docs/decisions.md (ADR-01..05), docs/change-requests.md, Test Plan v0.1; Ngân làm docs/design/usecases.md; Lộc làm docs/glossary.md, đặc tả UC-07 và phiếu khảo sát (mẫu trống, không điền dữ liệu giả).
Chạy Gate Ngày 1, lưu reports/gates/day-01.md, báo cáo theo mẫu.
```

### Ngày 2
```text
NGÀY 2. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 2". Bắt đầu từ docs/srs.md (SRS-01 v0.1). Việc của Tài: rà và hoàn thiện FR của M2, M3 và RÀNG BUỘC DỮ LIỆU (min, max, kiểu, độ dài) cho mọi trường theo bảng SRS §7; mọi tiêu chí chấp nhận phải đo được (con số, mã lỗi, trạng thái), không để từ mơ hồ ("nhanh", "phù hợp"); xử lý mọi [Cần chốt] liên quan (giữ mặc định có ghi ADR nếu tôi chưa xác nhận).
Phần chung với nhóm: mỗi người rà phần của mình, và tạo docs/requirements.csv (46 dòng = 40 FR + 6 NFR) khớp RTM-01. Nâng SRS lên v0.2.
Chạy Gate Ngày 2, lưu reports/gates/day-02.md, báo cáo.
```

### Ngày 3
```text
NGÀY 3. Phạm vi: TÀI (TV2), vai Reviewer trong Inspection.
Làm theo skill petspa-testing-project-tv2, mục "Ngày 3" và testing-standards §4. Vòng review: Mạnh → Tài → Ngân → Lộc → Mạnh, nên Tài rà phần của Ngân (FR M4, M5, quy tắc slot, giờ làm, hủy; BR-01 đến 07). Áp checklist SRS phụ lục A trên phần được giao, ghi RV-nn thật vào docs/reviews/inspection-srs.md (mẫu ở testing-standards §4). Ghi rõ "rà soát cá nhân có hỗ trợ AI, chờ nhóm xác nhận ở buổi họp"; không bịa biên bản họp.
Sửa các RV Major thuộc phần Tài (M2, M3). Chờ Mạnh ghép SRS v1.0 và tag srs-v1.0.
Chạy Gate Ngày 3, lưu reports/gates/day-03.md, báo cáo.
```

### Ngày 4
```text
NGÀY 4. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 4" và technical-spec §5, §9. Việc của Tài: docs/design/erd.md (Mermaid ERD) + server/prisma/schema.prisma khớp technical-spec §5 — đủ khóa chính, khóa ngoại, ràng buộc, chỉ mục; phải phủ các bảng users, password_reset_tokens, revoked_tokens, pets, services, service_prices, staff, staff_days_off, slot_holds, appointments, appointment_items, appointment_status_log, promotions, payments, invoices, notifications, audit_log; bảo đảm dữ liệu cũ không mất khi sửa thú cưng hoặc đổi giá (snapshot giá trong appointment_items); đối chiếu ràng buộc dữ liệu SRS §7 với kiểu và min/max trong schema.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (kiến trúc tổng thể + docs/design/openapi.yaml phủ đủ bảng API + bảng truy vết FR trong SDD), Ngân (sequences.md, states.md khớp SRS §8.1, đặc tả checkSlotConflict, evaluateCancellation, stateMachine), Lộc (wireframes.md, sequence thanh toán, đặc tả calculatePrice). SDD v0.9 do Mạnh tổng hợp.
Chạy Gate Ngày 4, lưu reports/gates/day-04.md, báo cáo.
```

### Ngày 5
```text
NGÀY 5. Phạm vi: TÀI (TV2), vai Reviewer thiết kế.
Làm theo skill petspa-testing-project-tv2, mục "Ngày 5" và testing-standards §4. Việc của Tài: rà thiết kế theo checklist Technical Review và ghi nhận xét của mình vào docs/reviews/review-sdd.md; MIGRATION ĐẦU TIÊN khớp ERD (prisma migrate) và db:seed theo technical-spec §9 (5 KH gồm 2 VIP, 3 NV, 1 AD; thú cưng phủ S/M/L/XL, lông ngắn và dài, chó và mèo, kèm giá trị biên 4.9, 5, 14.9, 15, 29.9, 30 kg; 6–8 dịch vụ; mã khuyến mãi hợp lệ, hết hạn, chưa đạt tối thiểu, đã tắt); BẮT ĐẦU CODE M2, M3 (khung domain/, services/, repositories/, validators theo SRS §7).
Phần chung với nhóm: Mạnh (Technical Review, chốt SDD v1.0 + tag sdd-v1.0, Test Plan v1.0, docs/testcases/_template.csv, docs/rtm.csv, scripts/rtm-check.mjs), Ngân (bắt đầu code M4), Lộc (dựng khung client).
Chạy Gate Ngày 5, lưu reports/gates/day-05.md, báo cáo.
```

### Ngày 6 (hai chat)
```text
NGÀY 6 · VAI DEV · TÀI. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 6", phần DEV. Việc của Tài: M2 CRUD thú cưng (validators theo SRS §7, BR-05 giới hạn 5 thú cưng, BR-15 chỉ xóa được khi không có lịch Pending/Confirmed/In-Progress) và M3 dịch vụ + bảng giá theo loài × nhóm cân nặng (weightGroup: S/M/L/XL theo BR-08), API dịch vụ cho Admin; code sạch lint, typecheck, build; unit test bắt đầu; dùng Clock cho mọi mốc thời gian; hàm lõi ở server/src/domain là hàm thuần.
Phần chung với nhóm (không tự làm thay): Tài → Lộc (M6 pricing, mock payment tối thiểu luôn success, Clock, Notifier giao diện) → Ngân (M4) → Mạnh (M1). Thứ tự phụ thuộc: M2/M3 cần hạ tầng Mạnh đã dựng.
Chạy Gate Ngày 6 (phần DEV), lưu reports/gates/day-06.md, báo cáo.
```
```text
NGÀY 6 · VAI TESTER · TÀI. CHẠY Ở CHAT MỚI, NGỮ CẢNH SẠCH.
Làm theo skill petspa-testing-project-tv2, mục "Ngày 6", phần TESTER, và testing-standards §1–§2. Viết test case (docs/testcases/*.csv, status = Designed) cho M4 và M5: EP/BVA giờ đặt (biên 2 giờ, 30 ngày, 24 giờ, 12 giờ, 30 phút) và use case, đúng dải mã trong RTM (TC-M4-001…024, TC-M5-001…024).
Bạn CHỈ được đọc docs/** (SRS, SDD, ERD, OpenAPI). KHÔNG mở server/src/** hay client/src/** của M4/M5 cho tới khi file test case của M4/M5 đã commit. Commit test case trước khi làm việc khác.
Chạy Gate Ngày 6 (phần TESTER), báo cáo.
```

### Ngày 7 (hai chat)
```text
NGÀY 7 · VAI DEV · TÀI. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 7", phần DEV: UI M2, M3 (danh sách, biểu mẫu thêm/sửa, bảng giá, lọc) theo wireframe ở docs/design/wireframes.md và bảng route trong technical-spec §10; mọi trang dữ liệu có đủ ba trạng thái: đang tải, lỗi (nút thử lại), rỗng; biểu mẫu kiểm tra phía client theo SRS §7, hiển thị lỗi theo từng trường; responsive từ 360px.
Phần chung với nhóm (không tự làm thay): Mạnh (M7 + UI đăng nhập/quản trị), Ngân (M5: stateMachine, confirm/start/complete, cancel + hoàn cọc, reschedule, markNoShows, log trạng thái), Lộc (hóa đơn, UI M6, UI M4/M5 theo ADR-03).
Chạy Gate Ngày 7 (phần DEV), lưu reports/gates/day-07.md, báo cáo.
```
```text
NGÀY 7 · VAI TESTER · TÀI. CHẠY Ở CHAT MỚI.
Làm theo skill petspa-testing-project-tv2, mục "Ngày 7", phần TESTER: hoàn tất các kỹ thuật còn lại cho M4, M5 — state transition (mọi chuyển hợp lệ và mọi ô ✗ trong bảng SRS §8.1), bảng quyết định hủy lịch (SRS §8.2, 5 cột), bảng quyết định đổi lịch, use case/workflow; đủ dải RTM. Chỉ đọc docs/**; không mở code của M4/M5 cho tới khi test case đã commit.
Chạy Gate Ngày 7 (phần TESTER), báo cáo.
```

### Ngày 8 (hai chat)
```text
NGÀY 8 · VAI DEV · TÀI. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 8", phần DEV: viết unit test cho M2, M3; chạy npm run test:coverage (xuất reports/raw/coverage/). Chưa đạt ngưỡng thì viết thêm test, không hạ ngưỡng.
Phần chung với nhóm (anh Tài không tự làm thay): unit test M1, M4, M5, M6, M7 của các bạn; viết docs/whitebox/checkSlotConflict.md (Ngân) và docs/whitebox/calculatePrice.md (Lộc) theo testing-standards §3 (CFG, V(G) tính bằng 3 cách, đường độc lập, test WB, Statement/Branch/Condition coverage).
Chạy Gate Ngày 8 (phần DEV), báo cáo.
```
```text
NGÀY 8 · VAI REVIEWER · TÀI. CHẠY Ở CHAT MỚI.
Làm theo skill petspa-testing-project-tv2, mục "Ngày 8", phần review: review chéo test case của module khác (người review khác người viết, checklist 4C) ghi docs/reviews/review-testcases.md — review phần M1/M7 (Lộc), M2/M3 (Mạnh), M6 (Ngân); sửa test case theo RV.
Phần chung với nhóm (Mạnh phụ trách): hoàn thiện docs/rtm.csv ánh xạ 100% yêu cầu; chạy npm run rtm:check; tag tc-v1.0 khi mọi RV Major đã Closed. Sau khi test case của từng module đã commit mới được đọc code để tự động hóa test case (gắn tên test [TC-...] và automated_ref).
Chạy Gate Ngày 8, lưu reports/gates/day-08.md, báo cáo.
```

### Ngày 9
```text
NGÀY 9. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 9" và testing-standards §5. Việc của Tài (chuyên trách chính): chạy npm run report:static toàn code → reports/static-analysis.md, xuất thô vào reports/raw/static/; bảng chỉ số theo module (chỉ số ESLint 0 lỗi error, V(G) của ESLint complexity ≤ 10, LOC, Fan-in/Fan-out/Coupling, code chết/trùng lặp), danh sách phát hiện, hành động sửa (ai, commit nào), kết quả chạy lại sau sửa; nếu SonarQube không cài được thì ghi rõ "không có" thay vì bỏ trống; sửa phát hiện trong module M2, M3 của mình.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (chuẩn bị môi trường test: DB test, .env.test, seed, docs/test-data.md; walkthrough code M4), Ngân (sửa cảnh báo M4, M5; viết Driver cho tích hợp), Lộc (hoàn thiện Notifier và Stub cổng thanh toán success/failed/timeout/idempotency).
Chạy Gate Ngày 9, lưu reports/gates/day-09.md, báo cáo.
```

### Ngày 10
```text
NGÀY 10. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 10" và testing-standards §6. Việc của Tài: cặp tích hợp M2, M3 ↔ M4 — thú cưng + dịch vụ → giá theo nhóm cân nặng → slot; đổi cân nặng thú cưng không đổi giá lịch đã tạo; dịch vụ bị ẩn không đặt mới được; xóa thú cưng khi có lịch đang chờ bị từ chối. Chiến lược Sandwich/Hybrid, không Big Bang. Viết test ở server/tests/integration/, tên [TC-...]; chạy npm run test:integration, tc:sync, ghi DEF thật cho lỗi gặp.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (M1↔M4 và tổng hợp reports/integration-report.md từ 4 cặp), Ngân (M4↔M5), Lộc (M4/M5↔M6 dùng Stub).
Chạy Gate Ngày 10, lưu reports/gates/day-10.md, báo cáo.
```

### Ngày 11
```text
NGÀY 11. Phạm vi: TÀI (TV2), vai TESTER (executor).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 11" và testing-standards §7. Việc của Tài: chạy TC M4, M5 (system test vòng 1) — tự động: npm run test:system rồi npm run tc:sync; thủ công: npm run tc:record. Ghi DEF thật cho mọi Fail vào docs/defects/defects.csv. Sau vòng 1: rà soát test case, bổ sung ca mới theo lỗi đã gặp (cập nhật RTM + CR); liệt kê các TC manual chưa chạy được là HUMAN-PENDING, không tự điền kết quả.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (TC M2, M3), Ngân (TC M6), Lộc (TC M1, M7 và triage cuối ngày ghi docs/defects/triage-<ngày>.md).
Chạy Gate Ngày 11, lưu reports/gates/day-11.md, báo cáo.
```

### Ngày 12
```text
NGÀY 12. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 12" và testing-standards §7, §9. Việc của Tài: sửa lỗi thuộc M2/M3 và re-test đúng TC đã Fail, vòng đời lỗi đúng (Open → Fixed → Pending Retest → Retest → Closed, Fail lần nữa thì Reopened); PHI CHỨC NĂNG NFR-03 (đếm bước đặt lịch ≤ 5, thông báo lỗi nêu rõ trường sai, giao diện dùng được từ 360px) và NFR-05 (Chrome, Firefox, Edge bản mới nhất, trình duyệt di động) — phần checklist thủ công là HUMAN-PENDING, phần tự động đếm được thì tự chạy; số liệu thô vào reports/raw/; đóng góp vào reports/nfr-report.md.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (bảo mật NFR-02), Ngân (đồng thời NFR-04), Lộc (hiệu năng NFR-01 k6 hoặc autocannon).
Chạy Gate Ngày 12, lưu reports/gates/day-12.md, báo cáo.
```

### Ngày 13
```text
NGÀY 13. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 13". Việc của Tài: COVERAGE CUỐI (npm run test:coverage, xuất reports/raw/coverage/, báo cáo số liệu thật); CẬP NHẬT RTM bản cuối cùng cùng Mạnh (npm run rtm:check); reports/static-analysis.md bản cuối; hỗ trợ Mạnh chấm Exit criteria bằng số liệu thật.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (viết và chạy scripts/exit-check.mjs → reports/exit-criteria.md; đóng băng tính năng, tag v1.0-rc), Ngân (bộ Newman trong tests/postman và npm run test:regression → reports/regression-report.md), Lộc (bộ UAT trong docs/uat/, kịch bản từ UC-01..08, phiếu phản hồi, hướng dẫn tổ chức). Tiêu chí UAT là HUMAN-PENDING cho tới khi có phiếu thật.
Chạy Gate Ngày 13, lưu reports/gates/day-13.md, báo cáo.
```

### Ngày 14
```text
NGÀY 14. Phạm vi: TÀI (TV2).
Làm theo skill petspa-testing-project-tv2, mục "Ngày 14" và testing-standards §11. Việc của Tài: ĐÓNG GÓI HỒ SƠ bằng scripts/export-docs.mjs — gom vào submission/: SRS, SDD, Test Plan, test case, RTM, review records, báo cáo (static-analysis, coverage, integration, nfr, regression, exit-criteria), mã nguồn, README chạy dự án; xuất docx/pdf nếu có pandoc, nếu không thì giữ Markdown và báo rõ; đối chiếu danh sách sản phẩm bắt buộc của TP-01 §11 và báo còn thiếu gì.
Phần chung với nhóm (anh Tài không tự làm thay): Mạnh (reports/final-test-report.md, docs/lessons-learned.md, kiểm tra chạy sạch từ bản clone mới, tag v1.0), Ngân (kịch bản demo và quay video), Lộc (dàn ý slide và bản trình bày).
Chạy Gate Ngày 14, lưu reports/gates/day-14.md, báo cáo.
```

---

## C. Prompt tiện ích

### Tiếp tục phiên dở
```text
TIẾP TỤC. Đọc docs/PROGRESS.md, xác định ngày và việc đang dở của Tài, rồi tiếp tục theo skill petspa-testing-project-tv2. Không làm lại phần đã DONE. Không tự nhận việc của Mạnh, Ngân, Lộc; nếu việc đang dở thuộc người khác thì báo rõ. Nêu rõ bạn tiếp từ đâu. Kết thúc bằng Gate của ngày và báo cáo theo mẫu.
```

### Chia nhỏ ngày nặng
```text
NGÀY <N> · TÀI · <DEV | TESTER | cả hai>. Chỉ làm phần việc của Tài trong mục "Ngày <N>" của day-playbook.md (kể cả phụ thuộc bắt buộc từ người khác, nếu có, hãy nói rõ và ghi BLOCKED thay vì tự làm thay). Giữ nguyên quy tắc cứng. Chạy phần Gate liên quan và cập nhật PROGRESS.
```

### Báo lỗi hạ tầng cho Mạnh (ADR-05)
```text
KIỂM TRA HẠ TẦNG. Chạy npm install, npm run lint, npm run typecheck, npm test và đánh giá xem bộ hạ tầng Mạnh dựng ở Ngày 1 (monorepo workspaces client/server, ESLint + Prettier, Jest + ts-jest, CI, CONTRIBUTING.md) có chạy được không. Với mỗi lỗi: ghi lệnh tái hiện, thông báo lỗi đầy đủ, file liên quan, và đề xuất cách sửa. Ghi vào docs/PROGRESS.md và báo cáo cho Mạnh. KHÔNG tự dựng lại bộ công cụ và không sửa sang phần việc của Mạnh; chỉ sửa trong phạm vi M2/M3 nếu lỗi nằm ở đó.
```

### Xử lý khi tôi đã quyết CR
```text
QUYẾT ĐỊNH CR: <CR-xx>: <chấp nhận | từ chối | chỉnh như sau: ...>.
Cập nhật docs/change-requests.md; nếu chấp nhận: sửa SRS (tăng phiên bản), requirements.csv, RTM, test case liên quan và code nếu đã có, trong cùng commit; chạy npm run rtm:check; báo cáo ảnh hưởng (yêu cầu, test case, module).
```

### Nhập kết quả thật từ việc HUMAN
```text
NHẬP KẾT QUẢ HUMAN: <mô tả>. Dữ liệu thật tôi cung cấp bên dưới (biên bản họp, kết quả test thủ công usability/responsive/trình duyệt, kết quả khảo sát). Đưa vào đúng tệp (reviews, testcases qua npm run tc:record, survey, reports/nfr-report.md), cập nhật PROGRESS (HUMAN-PENDING → DONE nếu đủ), chạy lại rtm:check nếu liên quan. Không suy diễn thêm dữ liệu ngoài những gì tôi đưa.
<dán dữ liệu thật>
```

### Kiểm toán cuối
```text
KIỂM TOÁN CUỐI. Theo mục "Kiểm toán cuối" của day-playbook.md, chạy: npm run lint, typecheck, test, test:regression, rtm:check, exit:check. Rà: (1) mọi con số trong báo cáo có file thô; (2) không còn skip/only; (3) mọi TC Pass có dòng trong execution-log.csv; (4) mọi CR có trạng thái; (5) tag đầy đủ; (6) danh sách HUMAN-PENDING còn lại; (7) báo cáo phân tích tĩnh và coverage có số liệu thật trỏ tới reports/raw/. Báo cáo: việc nào đạt, việc nào chưa, việc nào cần người; không làm đẹp số liệu.
```
