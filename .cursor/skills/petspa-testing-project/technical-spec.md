# Đặc tả kỹ thuật hiện thực (technical-spec)

Mục lục: 1 Stack và quyết định mặc định · 2 Cấu trúc code · 3 Kiến trúc server · 4 Hàm lõi (miền) · 5 CSDL · 6 API · 7 Lỗi và bảo mật · 8 Đồng thời và giữ chỗ · 9 Chế độ test và dữ liệu mẫu · 10 Client

Tài liệu này chỉ nêu **cách hiện thực**. Nghiệp vụ lấy từ `docs/srs.md`; mâu thuẫn thì làm theo SRS và ghi ADR.

## 1. Stack và quyết định mặc định

Ghi toàn bộ vào `docs/decisions.md` ở Ngày 1 (ADR-01...). Người dùng có thể ghi đè trong khối THÔNG SỐ của MASTER_PROMPT.

| Hạng mục | Mặc định | Ghi chú |
|---|---|---|
| Client | React (bản ổn định mới nhất) + TypeScript + Vite + Bootstrap 5 + React Router; trạng thái bằng Context và hook, không cần Redux | UI tiếng Việt, `<html lang="vi">` |
| Server | Node (LTS) + Express + TypeScript strict, **CommonJS** | CommonJS để Jest + ts-jest chạy ổn định |
| CSDL | PostgreSQL + Prisma; migration SQL thô cho phần khóa/ràng buộc nếu cần | Bắt buộc Postgres vì cần giao dịch và khóa cho FR-M4-05 |
| Xác thực | bcrypt + JWT (60 phút) | NFR-02 |
| Kiểm tra dữ liệu vào | zod, sinh từ bảng SRS §7 | Một nguồn cho server; client dùng lại thông báo |
| Test | Jest + ts-jest + supertest; Newman cho bộ Postman | Hiệu năng: k6 nếu cài được, nếu không dùng `autocannon` (npm) |
| Lint, format | ESLint (+ typescript-eslint, `complexity` tối đa 10) + Prettier | Không thêm công cụ lint thứ hai |
| Giờ hệ thống | Lưu UTC (`timestamptz`), tính giờ làm theo `Asia/Ho_Chi_Minh` | Dùng `dayjs` (utc, timezone) hoặc `date-fns-tz` |
| CSDL thay thế | Không có Docker: dùng Postgres cài sẵn hoặc dịch vụ miễn phí (Neon, Supabase), chỉ cần `DATABASE_URL` | Test dùng `DATABASE_URL_TEST` riêng |

Biến môi trường (`.env.example`, không commit `.env`): `PORT`, `DATABASE_URL`, `DATABASE_URL_TEST`, `JWT_SECRET`, `TEST_MODE`, `TZ_NAME`, `CORS_ORIGIN`.

Mặc định nghiệp vụ lấy từ SRS (BR-01 đến BR-18). Các điểm SRS chưa nói rõ, chốt mặc định và ghi ADR:

- **Làm tròn VND:** `Math.round` (half up) trên số nguyên đồng, áp dụng từng bước nêu ở §4.2.
- **Kết thúc lịch:** giờ kết thúc không được muộn hơn 18:00 (đóng cửa).
- **Hòa nhau VIP và mã:** nếu mức giảm bằng nhau, ghi nguồn giảm là `VIP`.
- **Tài khoản NV, AD:** Admin đầu tiên được seed; NV do Admin tạo (FR-M7-01). FR-M1-01 chỉ đăng ký KH.
- **Gán VIP:** trường `users.is_vip`, Admin đặt qua API (xem CR-04 ở playbook Ngày 3).

## 2. Cấu trúc code

```
server/src/
  app.ts · index.ts · config/ (env.ts)
  domain/        # HÀM THUẦN, không I/O, không new Date(): dễ unit test và white-box
    weightGroup.ts · pricing.ts (calculatePrice) · slotConflict.ts (checkSlotConflict)
    slots.ts · cancellation.ts (evaluateCancellation) · stateMachine.ts · reschedule.ts
  validators/    # zod schema theo SRS §7
  services/      # nghiệp vụ, gọi repositories và interface ngoài
  repositories/  # Prisma
  infra/         # clock.ts · paymentGateway.ts (mock) · notifier.ts (ghi log) · scheduler.ts
  routes/ · controllers/ · middlewares/ (auth, rbac, error, testMode)
server/prisma/ schema.prisma · migrations/ · seed.ts
client/src/ main.tsx · router.tsx · api/ · context/ · pages/ · components/ · lib/ · types/ · styles/
```

- Test đặt ở `server/tests/{unit,integration,system,nfr}` (Jest, cùng cấu hình gốc). Postman collection ở `tests/postman/`.
- Phụ thuộc theo hướng một chiều: routes → controllers → services → domain/repositories. `domain/` không import gì từ tầng ngoài.
- Coupling và Fan-in/Fan-out đo ở Ngày 9, nên giữ module nhỏ, tránh vòng phụ thuộc.

## 3. Kiến trúc server: các giao diện bắt buộc

```ts
interface Clock { now(): Date }                       // SystemClock, TestClock (chỉnh được)
interface PaymentGateway {
  charge(i: { amount: number; ref: string; idempotencyKey: string }): Promise<'success' | 'failed' | 'timeout'>
  refund(i: { ref: string; amount: number }): Promise<'success' | 'failed'>
}
interface Notifier { send(n: { userId: string; type: NotificationType; payload: unknown }): Promise<void> }
```

- Mọi `now` trong logic đi qua `Clock` được tiêm vào service. Domain nhận `now` như tham số.
- `PaymentGateway` mock: mặc định `success`; kịch bản chọn bằng header `X-Mock-Payment: success|failed|timeout` **chỉ khi `TEST_MODE=true`** (Ngày 6 chỉ cần mặc định success; Ngày 9 làm đủ kịch bản). `idempotencyKey` trùng thì trả lại kết quả cũ, không trừ tiền hai lần (FR-M6-04).
- `Notifier` ghi bản ghi vào bảng `notifications` (và log). Loại: `APPOINTMENT_CREATED`, `CONFIRMED`, `CANCELLED`, `RESCHEDULED`, `REMINDER_24H`.
- `scheduler.ts` có hai việc định kỳ gọi hàm thuần/dịch vụ: `markNoShows(now)` (FR-M5-06) và `sendReminders(now)` (FR-M6-06); test gọi trực tiếp các hàm này thay vì chờ cron.

## 4. Hàm lõi (miền)

### 4.1 Nhóm cân nặng (BR-08)

`weightGroup(kg): 'S'|'M'|'L'|'XL'`: S từ 0.5 đến dưới 5; M từ 5 đến dưới 15; L từ 15 đến dưới 30; XL từ 30 đến 50. Ngoài 0.5–50 hoặc không phải số: ném `ValidationError`.

### 4.2 `calculatePrice` (BR-08, 09, 10, 18; FR-M6-01 đến 03)

```ts
calculatePrice(input: {
  lines: { serviceId: string; unitPrice: number }[]   // giá đã tra theo loài + nhóm cân nặng
  coat: 'short' | 'long'
  isVip: boolean
  promo?: { percent: number; minOrder: number } | null // đã kiểm tra hạn dùng, trạng thái bật ở service
}): { lines: {serviceId, unitPrice, surcharge, lineTotal}[]; subtotal: number;
      discountPct: number; discountSource: 'VIP'|'PROMO'|'NONE'; discount: number;
      total: number; deposit: number; remaining: number }
```

Thứ tự tính (làm tròn `Math.round` ở mỗi bước có dấu *):
1. `surcharge = coat === 'long' ? round(unitPrice × 0.15) : 0*`; `lineTotal = unitPrice + surcharge`.
2. `subtotal = Σ lineTotal`.
3. `vipPct = isVip ? 10 : 0`; `promoPct = promo && subtotal >= promo.minOrder ? promo.percent : 0` (điều kiện ghép, cần Condition coverage).
4. `discountPct = max(vipPct, promoPct)`; nguồn: nếu `discountPct == 0` là `NONE`; nếu `vipPct >= promoPct` là `VIP`; ngược lại `PROMO`.
5. `discount = round(subtotal × discountPct / 100)*`; `total = subtotal − discount`.
6. `deposit = round(total × 0.30)*`; `remaining = total − deposit`.
Danh sách `lines` rỗng hoặc quá 5 dịch vụ: ném `ValidationError`. Giữ V(G) ≤ 10.

### 4.3 `checkSlotConflict` (BR-04, BR-17; FR-M4-03, 05)

```ts
type BusyItem = { start: Date; end: Date; kind: 'APPOINTMENT'|'HOLD';
                  status?: AppointmentStatus; expiresAt?: Date }
checkSlotConflict(candidate: {start: Date; end: Date}, busy: BusyItem[], now: Date): boolean
```
- `candidate.end <= candidate.start` thì ném lỗi.
- Bỏ qua `APPOINTMENT` có trạng thái không chiếm chỗ (chỉ `Pending`, `Confirmed`, `In-Progress` chiếm chỗ); bỏ qua `HOLD` đã hết hạn (`expiresAt <= now`).
- Chồng lấn khi `candidate.start < item.end && candidate.end > item.start`. Liền kề (kết thúc bằng bắt đầu) **không** chồng. Trả `true` nếu có xung đột.

### 4.4 Khác

- `slots.ts`: sinh slot 30 phút 08:00–18:00 theo ngày; một lịch gồm 1–5 dịch vụ nối tiếp, tổng thời lượng là bội của 30; slot hợp lệ khi chuỗi liên tục đủ thời lượng, không quá khứ, bắt đầu từ `now + 2h` đến `now + 30 ngày` (BR-01, 02, 03), nhân viên không nghỉ, không xung đột.
- `cancellation.ts`: `evaluateCancellation({status, startAt, now, depositPaid})`. C1 = `status ∈ {Pending, Confirmed}`; C2 = `startAt − now >= 24h` (đúng 24 giờ tính là có); C3 = `depositPaid`. Kết quả theo SRS §8.2: R1 `REJECT`; R2 `REFUND_FULL`; R3 `NO_CHARGE`; R4 `KEEP_HALF` (hoàn 50% cọc); R5 `LATE_RECORDED` (ghi nhận hủy muộn vào hồ sơ KH).
- `reschedule.ts`: chỉ khi `Pending` hoặc `Confirmed`, `rescheduleCount < 2`, `startAt − now >= 12h`, lịch mới qua BR-01 đến 04 (BR-07). Trạng thái giữ nguyên.
- `stateMachine.ts`: bảng chuyển trạng thái đúng SRS §8.1 (`Pending→Confirmed|Cancelled`, `Confirmed→In-Progress|Cancelled|No-show`, `In-Progress→Completed`). Ô còn lại ném `InvalidTransitionError` (HTTP 409). Mỗi lần chuyển ghi `appointment_status_log` (từ, đến, thời điểm, người thực hiện).
- No-show: `Confirmed` mà `now >= startAt + 30 phút` và chưa `In-Progress` thì thành `No-show`, không hoàn cọc (BR-12).

## 5. Cơ sở dữ liệu (tên bảng và ràng buộc chính)

| Bảng | Cột chính và ràng buộc |
|---|---|
| `users` | id, email (duy nhất), password_hash, full_name, phone, role (`CUSTOMER`,`STAFF`,`ADMIN`), is_vip, status, failed_attempts, locked_until |
| `password_reset_tokens` | user_id, token_hash, expires_at (15 phút), used_at |
| `revoked_tokens` | jti, expires_at (đăng xuất, FR-M1-03) |
| `pets` | id, owner_id, name, species (`DOG`,`CAT`), breed, sex, age_months, weight_kg numeric(4,1), coat (`SHORT`,`LONG`), health_note |
| `services` | id, name, description, duration_min, active |
| `service_prices` | service_id, species, size_group, price (duy nhất theo bộ ba) |
| `staff` | user_id, active, work_start, work_end |
| `staff_days_off` | staff_id, date |
| `slot_holds` | id, customer_id, staff_id, pet_id, start_at, end_at, service_ids, expires_at, status (`ACTIVE`,`CONSUMED`,`EXPIRED`,`RELEASED`) |
| `appointments` | id, customer_id, pet_id, staff_id, start_at, end_at, status, subtotal, discount, discount_source, total, deposit, deposit_paid, promo_code, reschedule_count, cancel_outcome, created_by |
| `appointment_items` | appointment_id, service_id, unit_price, surcharge, line_total |
| `appointment_status_log` | appointment_id, from_status, to_status, at, by_user |
| `promotions` | id, code (duy nhất), percent 1–50, min_order, valid_from, valid_to, active |
| `payments` | id, appointment_id, kind (`DEPOSIT`,`REFUND`), amount, status, idempotency_key (duy nhất) |
| `invoices` | appointment_id, issued_at, payload |
| `notifications` | user_id, type, payload, created_at |
| `audit_log` | actor_id, action, target, at (thao tác Admin, FR-M7-04) |

Dữ liệu cũ không bị mất khi sửa thú cưng hoặc đổi giá: lịch lưu snapshot giá trong `appointment_items`.

## 6. API (tiền tố `/api`, JSON, Bearer JWT)

| Phương thức, đường dẫn | Vai trò | FR |
|---|---|---|
| `POST /auth/register` · `/auth/login` · `/auth/logout` · `GET /auth/me` | Công khai, KH | M1-01, 02, 03 |
| `POST /auth/change-password` · `/auth/forgot-password` · `/auth/reset-password` | KH, NV, AD | M1-04 |
| `GET/POST /pets` · `GET/PUT/DELETE /pets/:id` | KH (chủ sở hữu) | M2-01 đến 05 |
| `GET /services?species=&q=` · `GET /services/:id` | Công khai | M3-01, 02, 04 |
| `POST /services` · `PUT /services/:id` · `PATCH /services/:id/visibility` | AD | M3-03 |
| `GET /slots?date=&serviceIds=&petId=&staffId=` | KH | M4-02, 04, 06 |
| `POST /quotes` (`petId`, `serviceIds`, `promoCode?`) | KH | M6-01, 02, 03 |
| `POST /appointments/holds` | KH | M4-01, 03, 05; BR-17 |
| `POST /appointments` (từ `holdId`, `promoCode?`, `idempotencyKey`) | KH | M4-01; M6-04 |
| `GET /appointments` · `GET /appointments/:id` | KH (của mình), NV (được gán), AD (tất cả) | M4-07, 08 |
| `POST /appointments/:id/confirm` · `/start` · `/complete` | NV (được gán), AD | M5-02, 03 |
| `POST /appointments/:id/cancel` · `/reschedule` | KH (của mình), AD | M5-04, 05, 07; M7-04 |
| `GET /appointments/:id/invoice` | KH (của mình), NV, AD | M6-05 |
| `GET /staff/schedule?from=&to=` | NV | M4-08 |
| `GET/POST/PUT/PATCH /admin/staff` (+ `/schedule`, khóa) | AD | M7-01 |
| `GET/POST/PUT/PATCH /admin/promotions` | AD | M7-02 |
| `GET /admin/reports/summary?from=&to=` | AD | M7-03 |
| `PATCH /admin/customers/:id/vip` | AD | BR-10 (CR-04) |
| `GET /health` | Công khai | |
| `POST /__test__/reset` · `/__test__/clock` · `GET /__test__/notifications` | Chỉ khi `TEST_MODE=true` | Hỗ trợ kiểm thử |

`docs/design/openapi.yaml` (Ngày 4) phải phủ đủ bảng này; sau đó mọi thay đổi API sửa OpenAPI trong cùng commit.

## 7. Lỗi và bảo mật

- Mẫu lỗi: `{ "error": { "code": "...", "message": "tiếng Việt, nêu rõ trường sai", "details": [...] } }`.
- Mã HTTP theo SRS §3.2: 400 (`VALIDATION_ERROR`: sai định dạng, ngoài miền), 401 (`UNAUTHENTICATED`, token hết hạn), 403 (`FORBIDDEN`), 404 (`NOT_FOUND`), 409 (`CONFLICT` trùng lịch/email; `INVALID_TRANSITION`), 422 (`BUSINESS_RULE_VIOLATION`: vi phạm BR như đặt trước chưa đủ 2 giờ, quá 5 thú cưng, mã khuyến mãi không hợp lệ), 500 (`INTERNAL_ERROR`, không lộ stack trace).
- Đăng nhập sai: thông báo chung, không lộ email có tồn tại hay không. Sai 5 lần liên tiếp thì khóa 15 phút (BR-16), trong thời gian khóa đăng nhập đúng vẫn bị từ chối.
- Kiểm tra quyền sở hữu ở **mọi** endpoint có `:id` (không truy cập chéo dữ liệu KH khác: NFR-02). RBAC ở middleware, kiểm tra sở hữu ở service.
- Tham số hóa truy vấn (Prisma, `$queryRaw` có tham số), thoát đầu ra ở client, `helmet`, CORS theo whitelist, giới hạn tần suất cho `/auth/*`.
- Không ghi mật khẩu, token vào log.

## 8. Đồng thời và giữ chỗ (FR-M4-05, BR-17)

- `POST /appointments/holds` chạy trong **một giao dịch**: khóa theo nhân viên (`pg_advisory_xact_lock` trên staff_id, hoặc `SELECT ... FOR UPDATE` trên hàng `staff`), nạp lịch và hold còn hiệu lực của nhân viên, gọi `checkSlotConflict`, rồi mới ghi hold (hết hạn sau 10 phút). Thất bại thì 409.
- Khi KH không chọn nhân viên (FR-M4-06): chọn nhân viên rảnh có ít lịch nhất trong ngày; thử lần lượt theo thứ tự đó, mỗi lần trong giao dịch riêng; không ai rảnh thì 409 "hết chỗ".
- `POST /appointments` tiêu thụ hold: kiểm hold còn `ACTIVE` và chưa hết hạn, tính giá lại bằng `calculatePrice`, gọi `PaymentGateway.charge`. `success` thì tạo lịch `Pending` (deposit_paid = true), hold `CONSUMED`; `failed` hoặc `timeout` thì không tạo lịch, hold `RELEASED`. Tất cả trong một giao dịch nhất quán với bảng `payments` (idempotency).
- Ràng buộc đồng thời được chứng minh bằng test song song `Promise.all` (NFR-04, FR-M4-05): đúng một thành công, các yêu cầu còn lại nhận 409.

## 9. Chế độ test và dữ liệu mẫu

- `TEST_MODE=true`: bật `/__test__/*` và header `X-Mock-Payment`. Production/dev thường **không** bật. Endpoint test trả 404 khi tắt.
- `/__test__/clock` nhận `{ now }` hoặc `{ advanceMinutes }` và đổi `TestClock`; `/__test__/reset` dọn dữ liệu và chạy lại seed.
- Dữ liệu mẫu (TP-01 §6.3), tạo bằng `db:seed`: 5 KH (2 VIP), 3 NV, 1 AD (mật khẩu giả, ghi trong `docs/test-data.md`, không dùng ngoài môi trường test); thú cưng phủ S/M/L/XL, lông ngắn và dài, chó và mèo, kèm giá trị biên 4.9, 5, 14.9, 15, 29.9, 30 kg; 6–8 dịch vụ khác thời lượng và bảng giá đủ 4 nhóm cân nặng cho cả hai loài; mã khuyến mãi: hợp lệ, hết hạn, đơn chưa đạt tối thiểu, đã tắt.
- Test dùng DB riêng (`DATABASE_URL_TEST`), dọn dữ liệu giữa các file test.

## 10. Client

- Trang: Đăng ký/Đăng nhập, Hồ sơ thú cưng (danh sách, thêm, sửa, xóa), Danh mục dịch vụ và bảng giá, **Đặt lịch (tối đa 5 bước: thú cưng → dịch vụ → ngày giờ và nhân viên → mã giảm và báo giá → thanh toán cọc)**, Lịch của tôi (chi tiết, hủy, đổi), Lịch làm việc (NV), Hóa đơn, Quản trị (dịch vụ, nhân viên, khuyến mãi, báo cáo).
- Route bảo vệ theo vai trò. Mọi trang dữ liệu có đủ ba trạng thái: đang tải, lỗi (nút thử lại), rỗng.
- Biểu mẫu kiểm tra phía client theo cùng ràng buộc SRS §7, hiển thị lỗi theo từng trường; vẫn tin server là nguồn kiểm tra cuối.
- Responsive từ 360px (NFR-03); đủ `label`, `alt`, `aria-label`, focus rõ; dùng `Link/NavLink` cho route nội bộ.
- Client gọi `/api/...` qua một lớp `api/` duy nhất; Vite proxy sang `http://localhost:4000`.
