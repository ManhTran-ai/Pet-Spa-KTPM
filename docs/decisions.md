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

> **Lưu ý:** ADR-01 đến ADR-08 mô tả kiến trúc của hệ thống do nhóm tự xây. Sau khi đổi hướng theo ADR-09, các ADR này **không còn hiệu lực** đối với phạm vi kiểm thử hiện tại; chúng được giữ lại như lịch sử quyết định và áp dụng lại nếu nhóm quay về hướng cũ. Quyết định hiện hành cho đồ án nằm ở ADR-09 đến ADR-14.

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
