# Quyết định kiến trúc và quy trình (ADR)

Đối tượng: Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng / Spa · Nhóm: Mạnh, Tài, Ngân, Lộc
Người ghi: Mạnh (TV1) · Ngày mở: 2026-11-13

Mỗi quyết định có: bối cảnh, quyết định, lý do, hệ quả, trạng thái. Quyết định đã chốt không sửa ngược; thay đổi phải lập ADR mới (ADR-nn+1) và ghi vào `docs/change-requests.md` nếu ảnh hưởng yêu cầu.

| ADR | Tiêu đề | Ngày | Trạng thái |
|---|---|---|---|
| ADR-01 | Stack công nghệ và kiến trúc monorepo | 2026-11-13 | Đã chốt |
| ADR-02 | Mặc định nghiệp vụ cho các giá trị `[Cần chốt]` | 2026-11-13 | Đã chốt (chờ nhóm xác nhận ở kick-off) |
| ADR-03 | Giao diện M4/M5 không có người nhận trong kế hoạch gốc | 2026-11-13 | Đã chốt |
| ADR-04 | Mock `PaymentGateway` và `Notifier` dựng sớm | 2026-11-13 | Đã chốt |
| ADR-05 | Hạ tầng repo/Git/ESLint/Jest và rà SRS §1–2 chuyển từ Tài sang Mạnh | 2026-11-13 | Đã chốt |
| ADR-06 | Dùng Docker cho PostgreSQL ở môi trường dev | 2026-11-13 | Đã chốt |
| ADR-07 | Mã lỗi khi người gọi không sở hữu đối tượng là 403 FORBIDDEN | 2026-11-13 | Đã chốt (chờ nhóm xác nhận ở kick-off) |
| ADR-08 | Ngày nghỉ của nhân viên và cách tính bộ đếm đăng nhập sai | 2026-11-13 | Đã chốt (chờ nhóm xác nhận ở kick-off) |
| ADR-09 | Đổi hướng đồ án: kiểm thử 3 hệ thống web đang vận hành thay vì tự xây hệ thống | 2026-11-13 | Đã chốt |
| ADR-10 | Chọn ba hệ thống đích T1 Pet NGON, T2 Mật Pet Family, T3 Pretty Paws | 2026-11-13 | Đã chốt |
| ADR-11 | Ranh giới kiểm thử an toàn: chỉ đọc và tương tác không phá hại | 2026-11-13 | Đã chốt |
| ADR-12 | Bộ công cụ kiểm thử: Playwright, Postman/Newman, k6, Lighthouse, OWASP ZAP | 2026-11-13 | Đã chốt (rút gọn theo ADR-14) |
| ADR-13 | Mô hình V thích nghi cho kiểm thử hộp đen/hộp xám và loại bỏ kiểm thử đơn vị mã nguồn đích | 2026-11-13 | Đã chốt |
| ADR-14 | Rút gọn bộ công cụ về mức tối giản: giữ Playwright, axe-core, Lighthouse, k6, TypeScript, ESLint, Git | 2026-11-18 | Đã chốt |
| ADR-15 | Chốt hướng đồ án: **Hướng 2** — thiết kế và kiểm thử phần mềm đang hoạt động, mô tả chi tiết yêu cầu và tính năng cần kiểm thử | 2026-11-19 | Đã chốt |
| ADR-16 | Phân công v3.0: cân bằng 226 test case (56/55/57/58), thêm EC-8 kiểm chứng tài liệu thiết kế đã review chéo, thêm script `assign-check` | 2026-11-19 | Đã chốt |
| ADR-17 | Technical Review chéo 5 tài liệu thiết kế test — McCabe V(G) trên CFG rút gọn từ bảng quyết định SRS §8, phép đo coverage theo số nhánh | 2026-11-19 | Đã chốt |

> **Lưu ý:** ADR-01 đến ADR-08 mô tả kiến trúc của hệ thống do nhóm tự xây. Sau khi đổi hướng theo ADR-09, các ADR này **không còn hiệu lực** đối với phạm vi kiểm thử hiện tại; chúng được giữ lại như lịch sử quyết định và áp dụng lại nếu nhóm quay về hướng cũ. Quyết định hiện hành cho đồ án nằm ở ADR-09 đến ADR-15.

---

## ADR-01: Stack công nghệ và kiến trúc monorepo

- **Bối cảnh:** SRS §2.4 để trống CSDL `[Cần chốt]`; file kế hoạch gốc gợi ý React + Node/Express + MySQL/PostgreSQL, Jest, Postman/Newman, ESLint, GitHub.
- **Quyết định:** monorepo npm workspaces gồm `server` và `client`.
  - Client: React + TypeScript + Vite + Bootstrap 5 + React Router.
  - Server: Node LTS + Express + TypeScript strict, module CommonJS.
  - CSDL: PostgreSQL + Prisma (bắt buộc vì FR-M4-05 cần giao dịch và khoá theo nhân viên).
  - Test: Jest + ts-jest + supertest; Newman cho bộ Postman; k6 nếu cài được, nếu không dùng `autocannon` (npm).
  - Lint/format: ESLint (+ typescript-eslint, `complexity` tối đa 10) + Prettier.
  - Thời gian hệ thống: lưu UTC (`timestamptz`), tính giờ làm theo `Asia/Ho_Chi_Minh`.
- **Lý do:** PostgreSQL + Prisma là lựa chọn duy nhất trong hai giả định đáp ứng yêu cầu giao dịch đồng thời của M4; CommonJS giúp Jest + ts-jest ổn định trên Windows.
- **Hệ quả:** không dùng MySQL; `DATABASE_URL` và `DATABASE_URL_TEST` tách biệt; mọi npm script phải chạy được trên Windows (không cú pháp bash).
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 giữ nguyên mặc định ADR-02 và chốt PostgreSQL + Prisma.
- **Trạng thái:** Đã chốt. Sửa đổi cần ADR mới.

## ADR-02: Mặc định nghiệp vụ cho các giá trị `[Cần chốt]`

- **Bối cảnh:** SRS §6 và §10.B còn các giá trị `[Cần chốt]`; người dùng chỉ định giữ mặc định của SRS §6 và §10.B tới khi có quyết định khác.
- **Quyết định:** giữ nguyên mặc định của SRS §6 và §10.B làm giá trị kiểm thử:
  - BR-01 giờ làm 08:00–18:00 mỗi ngày; ngày nghỉ do Admin cấu hình.
  - BR-09 phụ phí lông dài 15% giá dịch vụ.
  - BR-10 VIP giảm 10%, không cộng dồn với mã khuyến mãi; áp mức giảm lớn hơn.
  - BR-11 cọc 30% thành tiền; hủy muộn giữ 50% cọc (bảng quyết định SRS §8.2).
  - FR-M6-01 được xem là Must (TP-01 §7 nêu lý do).
  - FR-M4-06 tự gán nhân viên rảnh có ít lịch nhất trong ngày; hết người rảnh trả 409.
  - Mặc định bổ sung (technical-spec §1): làm tròn VND bằng `Math.round` mỗi bước; lịch kết thúc không muộn hơn 18:00; hòa mức giảm VIP và mã thì ghi nguồn giảm là `VIP`; tài khoản NV/AD do Admin tạo (Admin đầu tiên được seed); cờ VIP là `users.is_vip` do Admin đặt.
- **Lý do:** người dùng chỉ định rõ giữ mặc định; mọi test case và RTM viết theo giá trị này.
- **Hệ quả:** nếu nhóm đổi giá trị nào, phải lập CR, cập nhật SRS, RTM và test case liên quan trong cùng commit.
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 giữ nguyên toàn bộ mặc định của SRS §6 và §10.B.
- **Trạng thái:** Đã chốt, chờ nhóm xác nhận ở họp kick-off Ngày 1.

## ADR-03: Giao diện M4/M5 không có người nhận trong kế hoạch gốc

- **Bối cảnh:** file kế hoạch gốc (`Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` §5) gán UI cho: Mạnh (M1, M7 + UI đăng nhập), Tài (UI M2, M3), Ngân (không có UI), Lộc (UI M6). Giao diện đặt lịch (M4), Lịch của tôi và Lịch làm việc của nhân viên (M5) không được giao cho ai.
- **Quyết định:** giao UI M4/M5 cho **Lộc** (chủ UI trong nhóm, đã giao M6/UI M6 và wireframe), thực hiện ở Ngày 7–9.
- **Lý do:** Lộc là người thiết kế wireframe (`docs/design/wireframes.md`) nên giữ được tính nhất quán giữa wireframe và UI; Ngân gánh nhiều việc M4/M5 server.
- **Hệ quả:** nếu Lộc không nhận được, UI M4/M5 là `HUMAN-PENDING` và ghi rõ vào báo cáo; không tự code thay.
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13 — Lộc nhận UI M4/M5.
- **Trạng thái:** Đã chốt.

## ADR-04: Mock `PaymentGateway` và `Notifier` dựng sớm

- **Bối cảnh:** UC-04 cần cổng thanh toán giả lập từ đầu luồng; FR-M6-04 và UC-07 cần trả về success/failed/timeout; FR-M6-06 cần ghi log thông báo.
- **Quyết định:** dựng giao diện `Clock`, `PaymentGateway`, `Notifier` ngay từ Ngày 6 theo `technical-spec.md` §3. Ngày 6 mock `PaymentGateway` trả `success` mặc định; Ngày 9 Lộc mở rộng thành Stub có kịch bản (success, failed, timeout) và idempotency. `Notifier` ghi vào bảng `notifications`.
- **Lý do:** tránh tích hợp muộn (rủi ro đã nêu ở file kế hoạch gốc §7); cho phép test biên thời gian bằng đồng hồ giả.
- **Hệ quả:** header `X-Mock-Payment` chỉ được bật khi `TEST_MODE=true`; `/__test__/*` trả 404 khi tắt.
- **Trạng thái:** Đã chốt.

## ADR-05: Hạ tầng repo/Git/ESLint/Jest và rà SRS §1–2 chuyển từ Tài sang Mạnh

- **Bối cảnh:** dòng Ngày 1 của file kế hoạch gốc bị lệch cột: nội dung "Dựng repo, quy ước Git, ESLint/Jest; SRS §1–2" nằm ở cột Tài, trong khi phần việc của Mạnh ở cột đó là "Kick-off, chốt Hướng 1, backlog + MoSCoW, mở Jira; Test Plan v0.1".
- **Quyết định:** việc **dựng repo/monorepo, quy ước Git, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml`, GitHub Actions, `CONTRIBUTING.md`, script khung `scripts/*.mjs`** và **rà SRS §1–2** do **Mạnh** đảm nhiệm. Mọi nội dung còn lại giữ nguyên theo kế hoạch gốc.
- **Lý do:** Gate từ Ngày 1 (`npm run lint`, `typecheck`, `npm test`) và Gate Ngày 5 (`rtm:check`) phụ thuộc hạ tầng này; Mạnh là Test Lead nên giữ chất lượng hạ tầng kiểm thử. Điều chỉnh này được ghi trong `SKILL.md` và `day-playbook.md` của skill.
- **Hệ quả:** Tài vẫn giữ các mảng hạ tầng còn lại của mình (hỗ trợ quy ước Git, khung ESLint/Jest nếu cần; phân tích tĩnh, báo cáo coverage, script Postman/Newman).
- **Mở rộng (xác nhận ngày 2026-11-13):** toàn bộ công việc liên quan đến hạ tầng, thiết lập Git và tạo repo chuyển sang Mạnh. Phạm vi hạ tầng Mạnh phụ trách: monorepo npm workspaces, TypeScript strict, ESLint + Prettier, Jest + ts-jest, `.env.example`, `docker-compose.yml`, GitHub Actions, `CONTRIBUTING.md`, script khung `scripts/*.mjs`, rà SRS §1–2.
- **Trạng thái:** Đã chốt.

## ADR-06: Dùng Docker cho PostgreSQL ở môi trường dev

- **Bối cảnh:** SRS §2.4 để trống CSDL; cần CSDL cho M2–M6 và cho môi trường test `DATABASE_URL_TEST`.
- **Quyết định:** dùng Docker Compose với dịch vụ `postgres:16-alpine` cho môi trường dev (`npm run db:up` / `db:down`). Môi trường test dùng CSDL tách biệt (`petspa_test`) trên cùng instance Postgres, đặt trong `DATABASE_URL_TEST`.
- **Lý do:** người dùng xác nhận ngày 2026-11-13 có dùng Docker; giúp 4 thành viên có cùng phiên bản PostgreSQL mà không cài Postgres trên từng máy.
- **Hệ quả:** mỗi thành viên cần Docker Desktop; nếu một người không có Docker thì dùng PostgreSQL cài sẵn và chỉ cần đặt `DATABASE_URL`/`DATABASE_URL_TEST` trong `.env`. Việc cài Docker là `HUMAN-PENDING` (không tự cài phần mềm ngoài npm).
- **Trạng thái:** Đã chốt.

## ADR-07: Mã lỗi khi người gọi không sở hữu đối tượng là 403 FORBIDDEN

- **Bối cảnh:** SRS §3.2 quy định 403 là "không đủ quyền" và 404 là "không tìm thấy", nhưng chưa nêu trường hợp người dùng đã đăng nhập hợp lệ nhưng yêu cầu một đối tượng thuộc tài khoản khác (truy cập chéo dữ liệu). FR-M1-05 và NFR-02 đều yêu cầu chặn truy cập chéo nhưng không chốt mã lỗi.
- **Quyết định:** khi tài khoản đã xác thực nhưng không sở hữu đối tượng, API trả **HTTP 403 với mã `FORBIDDEN`** — không dùng 404.
- **Lý do:** 404 thường bị hiểu là "đối tượng không tồn tại", gây nhầm lẫn cho lập trình viên và cho người dùng; 403 phản ánh đúng nguyên nhân là thiếu quyền, đồng thời không rò rỉ nội dung dữ liệu của tài khoản khác (phản hồi không chứa dữ liệu). Quyết định này chỉ áp dụng cho **đối tượng có thật**; đối tượng không tồn tại thực sự vẫn trả 404 `NOT_FOUND`.
- **Hệ quả:** FR-M1-05, FR-M2-02, FR-M4-07 và NFR-02.4 dùng 403; test case của Lộc (M1), Mạnh (M2) và Tài (M4) phải kỳ vọng 403 cho các trường hợp truy cập chéo.
- **Xác nhận:** người dùng chỉ định giữ mặc định khi chưa có quyết định khác; mục này chưa được nhóm xác nhận riêng.
- **Trạng thái:** Đã chốt (chờ nhóm xác nhận ở họp kick-off).

## ADR-08: Ngày nghỉ của nhân viên và cách tính bộ đếm đăng nhập sai

- **Bối cảnh:** BR-01 để trống phần "ngày nghỉ"; FR-M7-01 yêu cầu Admin cấu hình ngày nghỉ nhưng chưa nêu ảnh hưởng tới lịch đã có. BR-16 nói "sai 5 lần liên tiếp" nhưng chưa nêu cách đặt lại bộ đếm.
- **Quyết định:**
  1. Giờ làm việc 08:00–18:00 mỗi ngày (BR-01). Admin cấu hình ngày nghỉ theo từng nhân viên; **ngày nghỉ chỉ chặn tạo lịch mới**, lịch `Pending`/`Confirmed` đã có vẫn tồn tại nhưng thao tác của Admin lên lịch đó phải trả kèm cảnh báo.
  2. Khoảng giờ làm riêng của nhân viên nằm trong khung 08:00–18:00; `work_end ≤ work_start` là dữ liệu không hợp lệ.
  3. Bộ đếm `failed_attempts` tính **riêng theo tài khoản**, tăng 1 mỗi lần đăng nhập sai, và **được đặt lại về 0 khi đăng nhập thành công**; đạt 5 lần thì khóa 15 phút tính từ thời điểm lần sai thứ 5.
- **Lý do:** cần một quy tắc duy nhất để thiết kế test case M1 (FR-M1-06) và M7 (FR-M7-01) mà không phụ thuộc vào việc nhóm đã họp; các giá trị mặc định đã được nhóm đồng ý giữ theo ADR-02.
- **Hệ quả:** FR-M1-06, FR-M7-01, BR-01, BR-16; FR-M4-02 (slot trống không hiển thị ngày nghỉ của NV).
- **Xác nhận:** người dùng chỉ định giữ mặc định khi chưa có quyết định khác; mục này chưa được nhóm xác nhận riêng.
- **Trạng thái:** Đã chốt (chờ nhóm xác nhận ở họp kick-off).

## ADR-09: Đổi hướng đồ án — kiểm thử 3 hệ thống web đang vận hành

- **Bối cảnh:** kế hoạch gốc giả định nhóm tự xây một hệ thống đặt lịch dịch vụ chăm sóc thú cưng đầy đủ (server + client + CSDL). Người dùng thông báo giảng viên **không yêu cầu sinh viên tự xây dựng trang web**; hướng được chấp thuận là chọn 2–3 hệ thống có sẵn trong ngành và thực hiện kiểm thử chuyên sâu theo đúng lý thuyết môn học.
- **Quyết định:** đồ án chuyển sang hình thức **kiểm thử hộp đen / hộp xám ba hệ thống web thực tế**. Toàn bộ tài liệu cốt lõi (SRS, Test Plan, RTM, test case, báo cáo) được viết lại theo hướng này. Nguồn mã của hệ thống đích không truy cập được nên nhóm **không tự viết mã ứng dụng**; sản phẩm của nhóm là bộ testware hoàn chỉnh (đặc tả test, test case, script tự động hóa, báo cáo lỗi, báo cáo kiểm thử).
- **Lý do:** bám sát yêu cầu thực tế của giảng viên; tận dụng thế mạnh của đồ án là **kiểm thử** chứ không phải lập trình; tạo ra sản phẩm đo được (độ phủ yêu cầu, tỷ lệ lỗi, đánh giá phi chức năng) thay vì một sản phẩm web trùng lặp với nhiều hệ thống đã có sẵn trên thị trường.
- **Hệ quả:**
  - Bộ testware cũ trong `archive/2026-11-13-webapp-pivot/` không còn hiệu lực; SRS/TP/RTM v0.1 của hệ thống tự xây được archive.
  - Yêu cầu trong SRS-01 trở thành **đặc tả yêu cầu đích** (As-Observed), không phải yêu cầu để xây dựng.
  - Kiểm thử đơn vị (unit test) và phân tích tĩnh mã nguồn đích ra khỏi phạm vi; các kỹ thuật thiết kế test chuyển sang black-box: EP, BVA, DT, ST, UC, khám phá.
  - Thời gian 14 ngày tính lại từ 2026-11-13, giữ nguyên 4 thành viên và vai trò.
  - Trách nhiệm đạo đức: chỉ kiểm thử trên production, không phá hại, không tạo dữ liệu thật (xem ADR-11).
- **Xác nhận:** người dùng xác nhận ngày 2026-11-13.
- **Trạng thái:** Đã chốt.

## ADR-10: Chọn ba hệ thống đích T1, T2, T3

- **Bối cảnh:** cần 2–3 hệ thống thực tế đủ khác nhau về nghiệp vụ và công nghệ để có phạm vi kiểm thử phong phú, đồng thời phải truy cập được để kiểm thử E2E tự động.
- **Quyết định:**
  - **T1 — Pet NGON** (`petngon.vn/vi`): tiếng Việt, có wizard đặt lịch 4 bước, phân biệt dịch vụ tại spa / tại nhà, công thức phụ thu di chuyển `max(0, km − 5) × 8.000₫`, phụ thu cố định theo gói, FAQ chính sách hủy, chuyển ngôn ngữ.
  - **T2 — Mật Pet Family** (`matpet.vn/spa`): calculator giá 3 bước loài → bậc cân nặng → dịch vụ, giá tính tức thì khớp bảng giá tĩnh, nhóm dịch vụ "báo giá riêng", form giữ chỗ, tìm kiếm, đa ngôn ngữ.
  - **T3 — Pretty Paws** (`prettypawscatanddoggrooming.groomore.com`): bảng giá theo **lbs** (20–50, 51–60, 61–78, 79–90, 91–100+), phí lễ tân theo 30 phút, trạng thái Open/Closed theo giờ mở cửa, nút "Book Now" chạy 24/7, nền tảng Groomore.
- **Lý do:** T1 và T2 là hệ thống Việt Nam có nghiệp vụ ngành đặc thù (phụ thu tại nhà, chính sách giữ chỗ) — đủ để dựng test case giá biên và bảng quyết định; T3 là hệ thống nước ngoài có đơn vị đo và mô hình khác, dùng để kiểm thử tính quốc tế hóa, đơn vị tiền và lịch mở cửa. Ba hệ thống dùng ba nền tảng web khác nhau nên lỗi giao diện không trùng lặp, tăng hiệu quả phát hiện lỗi.
- **Hệ quả:** mỗi hệ thống có một bộ test case riêng trong `docs/testcases/t1.csv`, `t2.csv`, `t3.csv`; bảng giá và ngưỡng cân nặng trong SRS-01 và test case phải bám đúng đơn vị của từng site (kg cho T1/T2, lbs cho T3, quy đổi 1 kg ≈ 2,20462 lb).
- **Xác nhận:** người dùng chọn ngày 2026-11-13 (phương án A trong bảng lựa chọn).
- **Trạng thái:** Đã chốt.

## ADR-11: Ranh giới kiểm thử an toàn — chỉ đọc và tương tác không phá hại

- **Bối cảnh:** ba hệ thống đích là production của doanh nghiệp tư nhân; không có quyền truy cập mã nguồn hay môi trường test. Kiểm thử quá mức có thể gây thiệt hại cho người dùng thật (đặt lịch giả, gửi SMS/email hàng loạt) và vi phạm pháp luật.
- **Quyết định:** phạm vi kiểm thử chỉ gồm hành vi **đọc** và **tương tác không phá hại**:
  - Không hoàn thành form đặt lịch/giữ chỗ thật; dừng ở bước xác nhận, không bấm nút gửi cuối cùng. Nếu cần kiểm tra gửi form thì dùng payload rỗng hoặc dữ liệu không định danh và **không chạm vào nút gửi thật**.
  - Không tạo tài khoản, không đăng nhập, không đăng ký nhận thông tin.
  - Payload kiểm thử bảo mật chỉ dùng dạng vô hại: kiểm tra header, cookie, TLS; phản xạ XSS với payload không phá hại và phải xác nhận không có hộp thoại alert; không dùng payload SQLi tấn công, không quét cổng, không dò lỗ hổng tự động phá hại.
  - Không gọi API ghi dữ liệu; chỉ GET. Tải đọc (k6) ở mức nhẹ, ≤ 10 VU, ngoài giờ cao điểm.
  - Tần suất thấp, có delay giữa các request, không chạy song song 3 site.
- **Lý do:** đồ án kiểm thử phần mềm của nhóm sinh viên không được phép gây ảnh hưởng hệ thống của bên thứ ba; đồng thời phát hiện lỗi bằng hộp đen không cần phá hại gì.
- **Hệ quả:** một số hành vi không thể kiểm chứng đầy đủ (ví dụ: luồng xác nhận lịch thành công, gửi email xác nhận). Nhóm ghi nhận rõ giới hạn này trong Test Plan mục 2.3 và trong Final Test Report; các hạng mục đó được đánh dấu "Không kiểm thử được theo ADR-11" chứ không đánh dấu Pass.
- **Xác nhận:** người dùng chọn mức "an toàn" ngày 2026-11-13.
- **Trạng thái:** Đã chốt.

## ADR-12: Bộ công cụ kiểm thử

- **Bối cảnh:** cần bộ công cụ đáp ứng đồng thời kiểm thử chức năng, tích hợp, hiệu năng, khả năng tiếp cận, SEO và bảo mật, trong giới hạn 4 thành viên và 14 ngày, chạy được trên Windows.
- **Quyết định:**
  - **Playwright (TypeScript)** — kiểm thử E2E trình duyệt; một project cho mỗi site (`t1`, `t2`, `t3`) cộng 4 project `cross-browser-*` cho NFR-04 (Chromium, Firefox, WebKit/Safari, Edge). Selector theo vai trò/nhãn (`getByRole`, `getByLabel`, `getByText`).
  - **k6** — kiểm thử tải đọc mức nhẹ (5 VU, 30 giây, chỉ GET).
  - **Lighthouse CLI** — hiệu năng, khả năng tiếp cận, SEO (3 lần mỗi site, lấy trung vị).
  - **axe-core** (`@axe-core/playwright`) — kiểm thử khả năng tiếp cận chi tiết WCAG 2.1 AA.
  - **Quản lý test case:** CSV trong repo (`docs/testcases/*.csv`), đồng bộ Google Sheets cho nhóm.
- **Lý do:** Playwright hỗ trợ đa trình duyệt và đa viewport trong một framework, phù hợp NFR-04; Lighthouse và axe-core cho NFR-01/06/07 với thang điểm định lượng; k6 nhẹ và chạy được bằng script.
- **Hệ quả:** thêm `playwright.config.ts` với project cho 3 site; thêm `package.json` với script `test:e2e`, `test:perf`, `test:a11y`, `test:cross-browser`; lint bằng ESLint cho mã test. Không dùng Jest/Prisma/PostgreSQL nữa.
- **Xác nhận:** người dùng chọn ngày 2026-11-13.
- **Trạng thái:** Đã chốt (rút gọn theo ADR-14).

## ADR-14: Rút gọn bộ công cụ về mức tối giản

- **Bối cảnh:** sau khi dựng đủ hạ tầng, nhóm đánh giá lại chi phí cài đặt và giá trị đóng góp của từng công cụ so với yêu cầu của giảng viên. Ba công cụ tốn nhiều công cài đặt nhưng đóng góp ít cho các tiêu chí chấm điểm:
  - **Postman + Newman** — bộ collection chỉ có 5 request GET, trùng phạm vi với những gì Playwright đã kiểm tra; thêm một ngôn ngữ cấu hình (collection JSON) mà không mở rộng độ phủ.
  - **OWASP ZAP** — cần cài thêm Java 21 (256 MB) và ZAP 2.17 (287 MB); TP-01 vốn ghi đây là công cụ *tuỳ chọn* cho NFR-02. NFR-02 đã được đo đầy đủ bằng kiểm tra HTTP header, thuộc tính cookie, TLS và phản xạ vô hại trong Playwright.
  - **GitHub Actions CI** — không nằm trong yêu cầu đồ án; nhóm đã có quy trình Gate cục bộ (`npm run gate`) và lịch bàn giao theo ngày.
- **Quyết định:** giữ bộ công cụ tối giản sau đây, bỏ toàn bộ công cụ và script không còn dùng:

  | Giữ | Bỏ |
  |---|---|
  | Playwright + axe-core | Postman/Newman (collection, `npm run test:api`) |
  | Lighthouse CLI | OWASP ZAP + Java 21 (`scripts/zap-scan.mjs`) |
  | k6 | GitHub Actions (`.github/workflows/ci.yml`) |
  | TypeScript + ESLint | Jest/Prisma/PostgreSQL (đã bỏ từ ADR-12) |
  | Git | `scripts/{tc-sync,static-analysis,infra-check,openapi-check,nfr-scan}.mjs` — script chết hoặc thuộc hướng cũ |

  Ghi thêm: `archive/2026-11-13-webapp-pivot/` (mã nguồn hệ thống webapp tự xây) bị xoá khỏi repo — không còn là đối tượng kiểm thử theo ADR-09 và toàn bộ nội dung vẫn còn trong lịch sử Git (`git show 3ef6451:archive/...`).
- **Lý do:** mỗi công cụ bị loại đều không tạo ra số liệu nào mà các tiêu chí chấm điểm (EC-1..EC-7) đang đo. Việc cài thêm Java 21 + ZAP còn làm chậm khả năng tái lập môi trường cho 3 thành viên khác trong khi giới hạn 14 ngày.
- **Hệ quả:**
  - `package.json` còn 7 devDependency: `@axe-core/playwright`, `@playwright/test`, `@types/node`, `@typescript-eslint/*`, `eslint`, `lighthouse`, `typescript`.
  - Không còn kiểm thử API riêng bằng Newman; mọi endpoint GET công khai đều kiểm tra qua `request` context của Playwright (`tests/support/http.ts`).
  - NFR-02 không có số liệu từ ZAP; báo cáo phi chức năng nêu rõ đây là hạng mục **không kiểm thử được theo ADR-11** (không quét chủ động) thay vì khẳng định không có lỗ hổng.
  - Gate cục bộ (`npm run gate`) thay thế CI; mỗi ngày bàn giao chạy Gate và lưu kết quả vào `reports/gates/day-NN.md`.
- **Xác nhận:** người dùng chọn phương án "tối giản" ngày 2026-11-18.
- **Trạng thái:** Đã chốt.

## ADR-15: Chốt hướng đồ án — Hướng 2: thiết kế và kiểm thử phần mềm đang hoạt động, mô tả chi tiết yêu cầu và tính năng cần kiểm thử

- **Bối cảnh:** giảng viên đưa ra ba hướng đồ án và yêu cầu nhóm **chọn một**:

  | Hướng | Nội dung | Đánh giá với đồ án hiện tại |
  |---|---|---|
  | 1 | Thiết kế và kiểm thử phần mềm bắt đầu từ tài liệu dự án, tài liệu SRS | Nhóm đã thử ở Ngày 1–2 (SRS/TP/RTM v0.x cho webapp React + Express + PostgreSQL) rồi dừng: giảng viên nói rõ **không yêu cầu sinh viên tự xây ứng dụng web**. Quay lại hướng 1 = phải xây lại toàn bộ hệ thống trong 14 ngày, không mang lại điểm chấm |
  | **2** | **Thiết kế và kiểm thử phần mềm đang hoạt động — phải mô tả chi tiết lại các yêu cầu và tính năng của phần mềm cần kiểm thử** | **Được chọn.** Trùng khớp 1:1 với ADR-09/10/11: nhóm kiểm thử 3 hệ thống web đang vận hành, SRS-01 là đặc tả **đích (as-observed)** trích từ hành vi quan sát được |
  | 3 | Nghiên cứu các kỹ thuật kiểm thử phần mềm chuyên sâu | Không chọn làm hướng. Nội dung này **được hấp thụ vào Hướng 2** ở vai trò "thiết kế test" — xem phần "Định nghĩa hướng 2" bên dưới |

- **Quyết định:** nhóm chọn **Hướng 2** làm hướng đồ án duy nhất.

### Định nghĩa Hướng 2 cho đồ án này — 4 yêu cầu và cách nhóm đáp ứng

Hướng 2 gồm hai vế: **(a) thiết kế test** và **(b) kiểm thử**, với điều kiện bắt buộc: **phải mô tả chi tiết lại yêu cầu và tính năng của phần mềm cần kiểm thử**. Nhóm ánh xạ thành 4 yêu cầu cụ thể và bộ sản phẩm tương ứng:

| # | Yêu cầu của Hướng 2 | Sản phẩm nhóm cam kết nộp | Trạng thái |
|---|---|---|---|
| **H2-1** | **Mô tả chi tiết yêu cầu và tính năng** của phần mềm cần kiểm thử | `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` (SRS-01 v1.2): 58 yêu cầu (51 FR + 7 NFR), 18 quy tắc nghiệp vụ, 8 use case, 4 bảng quyết định, mô tả chi tiết 3 hệ thống; **mọi tiêu chí chấp nhận đều định lượng** | ✅ Xong |
| **H2-2** | **Thiết kế test** (kỹ thuật thiết kế ca kiểm thử hộp đen) | 226 test case theo EP / BVA / DT / ST / UC / Workflow / Exploratory (`docs/testcases/*.csv`) + 5 tài liệu thiết kế trong `docs/design/` | ✅ Xong (thiết kế), 🔄 bổ sung tài liệu ở Ngày 6 |
| **H2-3** | **Kiểm thử** phần mềm đang hoạt động (không phá hại) | Bộ tự động Playwright (E2E + axe-core + Lighthouse + k6), execution log, defect log | 🔄 Ngày 9–13 |
| **H2-4** | Truy vết & báo cáo để chứng minh đã mô tả đúng và kiểm thử đúng | RTM truy xuất 2 chiều 100%, biên bản Inspection SRS, Test Plan, Final Test Report, Exit criteria | ✅ RTM 100% · 🔄 báo cáo ở Ngày 14 |

**Vì sao nội dung của Hướng 3 vẫn còn, nhưng không phải là hướng riêng:** "nghiên cứu kỹ thuật kiểm thử chuyên sâu" là **phương pháp** để làm vế "thiết kế test" của Hướng 2 cho đủ chuyên sâu. Giảng viên chỉ chấm **một** hướng, nhưng bài của Hướng 2 không cấm dùng kỹ thuật thiết kế test nghiêm túc — ngược lại, Hướng 2 đòi hỏi "thiết kế ... kiểm thử" nên thiếu kỹ thuật thiết kế sẽ là điểm trừ. Vì vậy mỗi thành viên được giao **một nhóm kỹ thuật** và **một tài liệu thiết kế có số liệu thật từ 3 site đích** — đây là **đầu ra của Hướng 2 (H2-2)**, không phải một hướng đồ án thứ ba.

- **Hệ quả:**
  - **Không** thay đổi phạm vi, SRS, hay bộ test case — ADR-09 đến ADR-14 giữ nguyên hiệu lực.
  - Bộ test case 226 ca giữ nguyên; chỉ **phân bổ lại Owner** cho cân bằng (bảng phân công trong `docs/ASSIGNMENT.md` §3.1).
  - 5 tài liệu thiết kế trong `docs/design/` là **bắt buộc** theo H2-2:
    | Tài liệu | Người phụ trách | Nội dung |
    |---|---|---|
    | `docs/design/test-design-techniques.md` | Tài | Bảng EP + BVA cho 3 hệ thống, bộ dữ liệu biên |
    | `docs/design/mccabe-coverage.md` | Mạnh | V(G) và mức bao phủ cho 4 bảng quyết định SRS §8 |
    | `docs/design/decision-tables.md` | Ngân | Ma trận quyết định đã rút gọn, có cột kết quả mong đợi |
    | `docs/design/state-transition.md` | Ngân | Đồ thị chuyển trạng thái có nhãn cho wizard T1/T2, bảng chuyển trạng thái hợp lệ |
    | `docs/design/usecase-workflow.md` | Lộc | Sơ đồ luồng UC-01…08 + hiếu chương khám phá |
  - Exit criteria giữ nguyên EC-1..EC-7; thêm EC-8: **mỗi thành viên có ≥ 1 tài liệu thiết kế trong `docs/design/` đã được review chéo**.

- **Xác nhận:** người dùng chốt ngày 2026-11-19 — nhóm chọn **Hướng 2**, chỉ một hướng duy nhất.
- **Trạng thái:** Đã chốt.

## ADR-16: Phân công v3.0 — cân bằng 226 test case, EC-8 kiểm chứng tài liệu thiết kế, script `assign-check`

- **Bối cảnh:** ADR-15 định hướng lại hướng đồ án nhưng phân công chi tiết trong `docs/ASSIGNMENT.md` v2.0 và `docs/source/Kế hoạch Kiểm thử (Test Plan).md` §7 còn **sai lệch số liệu** so với dữ liệu thật trong `docs/testcases/*.csv`:
  - Test Plan §7 ghi 57/64/62/43 (chênh lệch 21) trong khi `docs/testcases/*.csv` đã được phân bổ lại theo ADR-15 thành 56/55/57/58 (chênh lệch 3).
  - Ma trận trách nhiệm hệ thống ghi "T1 do Tài, T2 do Tài" — mâu thuẫn với chính ADR-15 (T1 do Tài, T2 do Ngân, T3 do Mạnh).
  - §3.4 ghi "21 ca T3" và "25 ca T1" cho Mạnh, §3.7 ghi "42 ca đối chiếu" cho Lộc — số thật lần lượt là 17, 27 và 46.
  - Nguyên tắc "≥ 2 người chạy mỗi module" và "NFR chuyên trách" được tuyên bố nhưng **không có script nào kiểm chứng** → rủi ro lệch phân công mà không ai phát hiện.
  - EC-8 nêu trong ADR-15 chưa được hiện thực hoá trong `scripts/exit-check.mjs` → tiêu chí "mỗi thành viên có tài liệu thiết kế đã review chéo" không thể chấm tự động.
- **Quyết định:**
  1. Viết lại `docs/ASSIGNMENT.md` lên **v3.0** với số liệu lấy từ `docs/testcases/*.csv` (đã kiểm chứng), sửa cả ma trận Owner (§3.1), ma trận trách nhiệm hệ thống (§3.2) và ma trận vai trò (§3.4–§3.7).
  2. Thêm **§3A.4 "Nghiệm thu cá nhân — Definition of Done"** gồm 9 mục kiểm chứng được cho từng thành viên, ánh xạ tới H2-1…H2-4.
  3. Thêm script **`scripts/assign-check.mjs`** (`npm run assign:check`) kiểm chứng 4 nguyên tắc phân công: (i) cân bằng số ca, chênh lệch ≤ 3; (ii) mỗi module của mỗi hệ thống có ≥ 2 người chạy; (iii) NFR chuyên trách theo ADR-15; (iv) không người nào tự gánh toàn bộ hệ thống mình viết.
  4. Hiện thực hoá **EC-8** trong `scripts/exit-check.mjs`: đọc `docs/design/design-index.csv` (mới), kiểm tra mỗi thành viên có ≥ 1 tài liệu thiết kế **tồn tại**, **không tự review**, và **đã được review chéo**.
  5. Sửa `docs/source/Kế hoạch Kiểm thử (Test Plan).md` §7 và §5.2 cho khớp ADR-15/16, đồng bộ bản làm việc qua `npm run docs:sync`.
- **Lý do:** yêu cầu của người dùng là phân công **chia đều** và **bảo đảm 100% đáp ứng hướng đồ án**. "Cân bằng" và "100%" chỉ đáng tin nếu có máy kiểm tra. Ba quyết định trên biến các cam kết bằng văn bản thành tiêu chí có thể kiểm tra tự động và phát hiện lệch phân công trước khi bàn giao.
- **Hệ quả:**
  - `npm run gate` nay gồm `assign:check`; lệnh exit 1 nếu vi phạm bất kỳ nguyên tắc phân công nào.
  - `docs/design/design-index.csv` trở thành bảng khai báo bắt buộc: mỗi dòng là một tài liệu thiết kế + người phụ trách + người review. Tài liệu mới phải thêm dòng tương ứng.
  - `docs/ASSIGNMENT.md` §3A.4 trở thành bảng nghiệm thu cá nhân dùng trong Final Test Report.
  - Hai tài liệu thiết kế còn thiếu (`mccabe-coverage.md` của Mạnh, `usecase-workflow.md` của Lộc) khiến EC-8 chưa đạt — đây là việc còn dở đã ghi trong `docs/PROGRESS.md`.
- **Xác nhận:** người dùng yêu cầu ngày 2026-11-19 — "chia đều cho nhóm 4 thành viên" và "100% đáp ứng yêu cầu của hướng đồ án".
- **Trạng thái:** Đã chốt.

## ADR-17: Technical Review chéo 5 tài liệu thiết kế test — McCabe V(G) trên CFG rút gọn, và phép đo coverage theo số nhánh

- **Bối cảnh:**
  - ADR-16 để lại EC-8 chưa đạt vì thiếu 2 tài liệu thiết kế (`mccabe-coverage.md`, `usecase-workflow.md`). H2-2 yêu cầu "thiết kế test chuyên sâu" — thiếu 2/5 tài liệu là không đáp ứng 100% hướng đồ án.
  - **McCabe là kỹ thuật hộp trắng** (cần CFG của mã nguồn), nhưng ADR-13 đã loại bỏ mọi kiểm thử mã nguồn đích. Cần một cách hợp thức để vẫn dùng được V(G) và mức bao phủ.
  - 5 tài liệu thiết kế được viết bởi 4 người khác nhau, chưa từng qua rà soát chéo → rủi ro sai lệch số liệu và trích dẫn sai.
- **Quyết định:**
  1. **Dựng CFG từ bảng quyết định trong SRS §8** (4 bảng: Wizard T2 §8.1, Wizard T1 §8.2, Chính sách hủy §8.3, Phụ thu di chuyển §8.4). Mỗi bảng quyết định là một CFG rút gọn: nút điều kiện = ô quy tắc có điều kiện, cạnh = nhánh T/F. Tính \(V(G) = E - N + 2p\) và đối chiếu \(V(G) = P + 1\); khi hai công thức lệch nhau (bảng §8.3) lấy **giá trị lớn hơn** làm chuẩn bảo thủ.
  2. **Đo mức bao phủ trên CFG, không phải trên mã nguồn** — và tử số là **số nhánh/node trên CFG**, không phải số test case. Số test case chỉ là bằng chứng cho việc nhánh đã đi tới. Ghi rõ giới hạn này trong tài liệu và trong báo cáo.
  3. **Khi hai công thức V(G) cho kết quả khác nhau** → không "chọn đẹp", mà chọn giá trị **bảo thủ** và **ghi rõ lý do** trong tài liệu.
  4. **Technical Review chéo** cả 5 tài liệu theo Cẩm nang §3.3 (chuẩn bị cá nhân → họp rà soát → sửa đổi → theo dõi), lưu biên bản tại `docs/reviews/design-review.md`. Mọi lỗi phải **sửa ngay trong mã và tài liệu**, không chỉ ghi báo cáo.
  5. **Kiểm chứng trích dẫn bằng script**: mọi mã `TC-...` và `FR-...`/`NFR-...` trích trong tài liệu thiết kế phải tồn tại trong `docs/testcases/*.csv` và `docs/requirements.csv`.
- **Lý do:** Hướng 2 yêu cầu 100% — một tài liệu thiết kế thiếu hoặc sai số liệu là thiếu. Mặt khác, phép đo coverage sai phương pháp là tệ hơn không đo: nó tạo ảo giác đảm bảo. Với hệ thống không mã nguồn, CFG rút gọn từ bảng quyết định là cách **hợp thức duy nhất** để dùng McCabe, và phải nêu rõ giới hạn.
- **Hệ quả:**
  - EC-8 **đạt** — `docs/design/design-index.csv` 5/5 dòng "Đã review"; `npm run exit:check` → 5/8 tiêu chí.
  - Review phát hiện và sửa **3 lỗi Major + 2 Minor + 1 Observation** (RV-D1…RV-D6), trong đó 2 lỗi Major là **kỳ vọng sai trong test case** — loại lỗi mà chạy test không bắt được vì ca vẫn Fail đúng logic của nó.
  - Bộ test case 226 ca **chưa từng qua Inspection** (chỉ mới có review chéo + walkthrough) → ghi nhận RV-D6 là khoảng trống của dự án, đưa vào việc Ngày 5–8.
  - `docs/ASSIGNMENT.md` §3.3 và §3A.2 cập nhật trạng thái 5/5 tài liệu.
- **Xác nhận:** nhóm thống nhất trong phiên làm việc ngày 2026-11-19; người dùng yêu cầu "tiếp tục công việc đến khi hoàn thành".
- **Trạng thái:** Đã chốt.

## ADR-13: Mô hình V thích nghi cho kiểm thử hộp đen và loại bỏ kiểm thử đơn vị mã nguồn đích
- **Bối cảnh:** mô hình V chuẩn (IEEE 829) ghép Unit test với Verification và System/UAT test với Validation. Với hệ thống đích không có mã nguồn, mức Unit test không thực hiện được; nếu giữ nguyên sẽ tạo khoảng trống trong báo cáo và làm giảm độ tin cậy.
- **Quyết định:** mô hình V được thích nghi thành hai nhánh song song:
  - **Verification** (kiểm chứng): Inspection và Technical Review trên SRS đích, Test Plan, thiết kế test và test case — thay cho Unit test và Static Analysis của mã nguồn. Đây là kiểm thử tĩnh theo đúng nghĩa của ISTQB.
  - **Validation** (thẩm định): kiểm thử tích hợp, kiểm thử hệ thống, kiểm thử chấp nhận người dùng.
  - Kiểm thử tích hợp thực hiện bằng **quan sát hợp đồng dữ liệu** giữa giao diện và API của site đích (giá API trả về khớp bảng giá tĩnh; payload form khớp yêu cầu server), không phải tích hợp mã nguồn.
- **Lý do:** giữ được tính đầy đủ của mô hình V và nguyên tắc "kiểm thử sớm" (Inspection ở ngày 3, trước khi viết test case) trong điều kiện không có mã nguồn.
- **Hệ quả:** Test Plan mô tả rõ các mức kiểm thử đã thích nghi (mục 4.1); Final Test Report giải thích điểm khác biệt so với mô hình V chuẩn và nêu rõ phần nào không thực hiện được cùng lý do.
- **Xác nhận:** suy ra từ ADR-09; người dùng xác nhận hướng kiểm thử này ngày 2026-11-13.
- **Trạng thái:** Đã chốt.
