# Pet Spa KTPM — Kiểm thử hộp đen / hộp xám 3 hệ thống web

Đồ án môn **Thiết kế và Kiểm thử Phần mềm**. Nhóm 4 thành viên: Mạnh (TV1), Tài (TV2), Ngân (TV3), Lộc (TV4).

> **Đối tượng kiểm thử:** ba hệ thống web pet spa **đang vận hành thật** — không phải phần mềm do nhóm tự xây. Quyết định đổi hướng: `docs/decisions.md` ADR-09.

---

## Bắt đầu ở đâu

| Bạn là | Đọc file này |
|---|---|
| **Thành viên mới** | [`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md) — hướng dẫn đọc tài liệu, phân công, quy tắc viết test case, cách ghi nhận lỗi |
| **Test Lead (Mạnh)** | [`docs/source/Kế hoạch Kiểm thử (Test Plan).md`](docs/source/) |
| **Cần tra nhanh trạng thái** | [`docs/PROGRESS.md`](docs/PROGRESS.md) |

---

## Ba hệ thống đích

| Mã | Hệ thống | URL | Phân công (theo ADR-15) |
|---|---|---|---|
| **T1** | Pet NGON | `https://petngon.vn/vi` | Tài (viết), Mạnh + Lộc (đối chiếu) |
| **T2** | Mật Pet Family | `https://matpet.vn/spa` | Ngân (viết), Tài + Lộc (đối chiếu) |
| **T3** | Pretty Paws | `https://prettypawscatanddoggrooming.groomore.com/` | Mạnh (viết), Ngân + Lộc (đối chiếu) |

Phân bổ 226 test case: Mạnh 56 · Tài 55 · Ngân 57 · Lộc 58. Kiểm chứng bằng `npm run assign:check`.

**Ranh giới an toàn (ADR-11):** chỉ đọc, không đặt lịch thật, không tạo tài khoản, tải ≤ 10 VU. Chi tiết ở [`docs/ASSIGNMENT.md`](docs/ASSIGNMENT.md) §2.

---

## Cấu trúc repo

```
docs/
  ASSIGNMENT.md          Hướng dẫn cho 3 thành viên + phân công chi tiết theo ngày
  PROGRESS.md            Trạng thái 14 ngày, nhật ký phiên
  decisions.md           ADR-01..17 — mọi quyết định kiến trúc và hướng
  change-requests.md     CR — thay đổi yêu cầu có kiểm soát
  requirements.csv       58 yêu cầu (máy đọc được)
  backlog.csv / .md      105 mục công việc MoSCoW, có cột Owner
  rtm.csv / .md          Ma trận truy xuất yêu cầu – test case (sinh tự động)
  srs.md                 Bản sao SRS-01
  test-plan.md           Bản sao TP-01
  source/                Bản gốc của 5 tài liệu nộp (SRS, TP, RTM, kế hoạch 14 ngày, cẩm nang môn học)
  reference/             Bảng giá tham chiếu chốt ngày 2 (REF-01)
  testcases/             226 test case: t1.csv, t2.csv, t3.csv, nfr.csv, uat.csv
  design/                 5 tài liệu thiết kế test (H2-2) + design-index.csv (khai báo review chéo)
    defects/defects.csv    Defect log
  reviews/               Biên bản review: inspection-srs.md (Ngày 3), design-review.md (Ngày 5)

reports/
  gates/day-NN.md        Gate báo cáo từng ngày
  execution-log.csv      Nhật ký thực thi (sinh tự động)
  exit-criteria.md       Chấm 8 exit criteria (EC-1..EC-8)
  raw/                   Bằng chứng thô (ảnh Lighthouse, JSON, survey)

tests/
  e2e/t1|t2|t3/          Spec Playwright cho từng hệ thống
  security/              NFR-02 (bảo mật), NFR-06 (a11y), NFR-07 (SEO), NFR-04 (responsive)
  crossbrowser/          NFR-04 — cùng ca kiểm thử chạy trên 4 trình duyệt
  perf/                  Script k6

scripts/                 Script Gate: req-check, rtm-build, rtm-check, exec-sync, exit-check, survey-*
```

---

## Bộ công cụ (ADR-12, ADR-14)

| Công cụ | Dùng cho |
|---|---|
| **Playwright** (TypeScript) | E2E chức năng M1–M7 trên 3 site; NFR-02, NFR-04, NFR-06, NFR-07 |
| **axe-core** | Quét khả năng tiếp cận WCAG 2.1 AA (NFR-06) |
| **Lighthouse CLI** | Hiệu năng, SEO, khả năng tiếp cận (NFR-01, NFR-07) |
| **k6** | Kiểm thử tải đọc mức nhẹ (NFR-01) |
| **TypeScript + ESLint** | Kiểm tra chất lượng mã test |
| **Git** | Quản lý phiên bản, tag theo ngày, GitHub Issue phân công |

> Đã loại bỏ (ADR-14): Postman/Newman, OWASP ZAP, GitHub Actions, cùng các script chết của hướng cũ (`tc-sync`, `static-analysis`, `infra-check`, `openapi-check`, `nfr-scan`). Lý do và điều kiện cần để dùng lại nằm ở ADR-14.

---

## Lệnh thường dùng

```powershell
npm install
npx playwright install chromium firefox webkit   # browser cho NFR-04 (Chrome/Edge dùng bản hệ thống)
npm run lint                 # ESLint
npm run typecheck            # tsc --noEmit
npm run test:e2e             # Playwright toàn bộ
npm run test:e2e:t2          # riêng T2
npm run test:a11y            # axe-core trên cả 3 site (NFR-06)
npm run test:cross-browser   # NFR-04: Chromium, Firefox, WebKit, Edge
npm run test:perf            # k6 tải đọc (cần k6 ngoài npm)
npm run lh:scan              # Lighthouse 3 site × 3 lần
npm run exec:sync            # đồng bộ kết quả vào execution log + test case
npm run assign:check         # 4 nguyên tắc phân công: cân bằng, ≥2 người/module, NFR chuyên trách
npm run exit:check           # chấm EC-1..EC-8
npm run gate                 # req:check + rtm:check + assign:check + exit:check
```

Tất cả script Gate phải **exit 0**.

> **Yêu cầu ngoài npm:** `k6` (kiểm thử tải) và Lighthouse CLI đi kèm npm nên không cần cài thêm. Playwright cần tải browser một lần bằng lệnh trên.

---

## Tài liệu gốc (bắt buộc đọc)

`docs/source/` chứa 5 tài liệu nền:

1. **Cẩm nang Tổng hợp và Phân tích Chuyên sâu Môn học Thiết kế và Kiểm thử Phần mềm** — nền tảng lý thuyết của toàn bộ đồ án.
2. **Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa** — kế hoạch 14 ngày, phân công, ranh giới an toàn.
3. **Đặc tả Yêu cầu Phần mềm (SRS)** — SRS-01 v1.1, test basis.
4. **Kế hoạch Kiểm thử (Test Plan)** — TP-01 v1.0.
5. **Ma trận Truy xuất Yêu cầu (RTM)** — RTM-01 v1.0.
