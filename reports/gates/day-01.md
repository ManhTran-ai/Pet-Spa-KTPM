# Gate Ngày 1 (hướng mới) — Baseline tài liệu, test case và hạ tầng kiểm thử

Ngày: 2026-11-13 → 2026-11-14 · Thành viên: Mạnh (TV1) · Vai: TESTER + tài liệu
Nguồn số liệu thô: `reports/raw/` (`pw-full.txt`, `day-01-pivot-security.txt`, `day-01-pivot-newman.txt`, `lighthouse-summary.csv`, `axe-summary.csv`, `security-summary.csv`, `playwright-report.json`, `newman-report.json`)

> Gate này thay thế bản `day-01.md` của hướng "tự xây hệ thống" (đã lưu trong `archive/2026-11-13-webapp-pivot/`).

## 1. Kết quả từng lệnh

| # | Lệnh | Kết quả | Mã thoát | File thô |
| --- | --- | --- | --- | --- |
| 1 | `npm run lint` | ESLint 9, 0 lỗi 0 cảnh báo | 0 | `reports/raw/day-01-pivot-lint.txt` |
| 2 | `npm run typecheck` | `tsc --noEmit` sạch cho toàn bộ `tests/` + `scripts/` | 0 | `reports/raw/day-01-pivot-typecheck.txt` |
| 3 | `npm run req:check` | 58 yêu cầu (51 FR + 7 NFR); 0 ID trùng; 0 ID lệch giữa CSV và SRS; **0 vi phạm** | 0 | `reports/raw/day-01-pivot-req-check.txt`, `reports/raw/req-check.md` |
| 4 | `npm run rtm:build` | "RTM: 58 yêu cầu, 58 được phủ, 226 test case" | 0 | `reports/raw/day-01-pivot-rtm-build.txt` |
| 5 | `npm run rtm:check` | Truy xuất hai chiều 100%; 0 yêu cầu chưa phủ; 0 vi phạm | 0 | `reports/raw/day-01-pivot-rtm-check.txt`, `reports/rtm-coverage.md` |
| 6 | `npx playwright test` | 32 test: **20 Pass / 12 Fail** (toàn bộ Fail là lỗi thật của site đích, xem §4) | 1 | `reports/raw/pw-full3.txt`, `reports/raw/playwright-report.json` |
| 7 | `npm run test:api` (Newman) | 5 request, 10 assertion, 0 fail | 0 | `reports/raw/day-01-pivot-newman.txt`, `reports/raw/newman-report.json` |
| 8 | `npm run lh:scan` (Lighthouse) | 3 site × 3 lần, lấy trung vị; Performance T1=67, T2=59, T3=3; LCP T1=4887ms, T2=6473ms, T3=17621ms | 0 | `reports/raw/lighthouse-summary.csv`, `reports/raw/lighthouse-*.json` |
| 9 | `npm run exec:sync` | Đồng bộ 30 test case đã chạy vào `reports/execution-log.csv` (Pass 18, Fail 12) | 0 | `reports/execution-log.csv` |
| 10 | `npm run exit:check` | Chấm 7 tiêu chí: **3 PASS / 4 FAIL** | 0 | `reports/exit-criteria.md` |

## 2. Đối chiếu tiêu chí Gate của Ngày 1 (theo `day-playbook.md`)

| Tiêu chí Gate | Trạng thái | Bằng chứng |
| --- | --- | --- |
| `node scripts/req-check.mjs` → 0 vi phạm | Đạt | Lệnh 3: 58 dòng, 0 vi phạm |
| `node scripts/rtm-build.mjs` → "58 yêu cầu, 58 được phủ, 226 test case" | Đạt | Lệnh 4 |
| `node scripts/rtm-check.mjs` exit 0 | Đạt | Lệnh 5, `reports/rtm-coverage.md` ghi "Tỷ lệ độ phủ yêu cầu 100.0%" |
| `node scripts/exit-check.mjs` chạy được | Đạt | Lệnh 10, sinh `reports/exit-criteria.md` |
| `npm run lint` và `npm run typecheck` exit 0 | Đạt | Lệnh 1 và 2 |
| Có testware tự động chạy thật trên 3 site | Đạt | Lệnh 6: 11 test chức năng Pass trên T1/T2/T3; lệnh 7: Newman 5/5 Pass |
| Đã ghi log lỗi cho mọi Fail | Đạt | 21 lỗi trong `docs/defects/defects.csv`, mỗi lỗi có bằng chứng trong `reports/raw/` |

## 3. Sản phẩm đã tạo / cập nhật trong Ngày 1 (hướng mới)

### Tài liệu
| Tệp | Nội dung |
| --- | --- |
| `docs/source/Hệ thống Đặt lịch Dịch vụ Chăm sóc Thú cưng Spa.md` | Viết lại: 3 hệ thống đích, ranh giới an toàn ADR-11, lịch 14 ngày, tiêu chí kết thúc |
| `docs/source/Đặc tả Yêu cầu Phần Mềm (SRS).md` | v1.0 — 7 module, 51 FR, 7 NFR, 16 BR, bảng quyết định, bảng chuyển trạng thái, checklist Inspection |
| `docs/source/Kế hoạch Kiểm thử (Test Plan).md` | v1.0 — mô hình V thích nghi, phân tích rủi ro, chiến lược theo mức, tiêu chí vào/kết thúc |
| `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` | v1.0 — sinh tự động từ SRS + test case |
| `docs/{srs,test-plan,rtm}.md`, `docs/rtm.csv`, `docs/requirements.csv` | Bản làm việc đồng bộ (58 yêu cầu, 226 test case) |
| `docs/testcases/{t1,t2,t3,nfr,uat}.csv` | 226 test case + 8 kịch bản UAT; cột `Status` cập nhật tự động từ execution log |
| `docs/defects/defects.csv` | 21 lỗi (DEF-001..DEF-021) kèm bằng chứng và quyết định xử lý |
| `docs/decisions.md` | ADR-09 (đổi hướng), ADR-10 (chọn T1/T2/T3), ADR-11 (ranh giới an toàn), ADR-12 (bộ công cụ), ADR-13 (mô hình V thích nghi) |
| `docs/change-requests.md` | CHG-2026-11-13-03 — ghi nhận đổi hướng |

### Hạ tầng kiểm thử
| Tệp | Nội dung |
| --- | --- |
| `playwright.config.ts` | 4 project (`t1`, `t2`, `t3`, `security`), `testMatch` giới hạn theo thư mục, tần suất thấp theo ADR-11, `channel: 'chrome'` |
| `tests/e2e/t1/m1-navigation.spec.ts` | 3 test: HTTP 200, link menu 200, không link chết 404 |
| `tests/e2e/t2/m3-pricing.spec.ts` | 4 test: 3 ô bảng giá (Chó >3–6kg / >6–10kg × Combo) + giá cập nhật tức thì |
| `tests/e2e/t3/m1-m5-info.spec.ts` | 4 test: HTTP 200, thông tin liên hệ, trạng thái mở cửa, nút Book Now 24/7 |
| `tests/security/headers.spec.ts` | 6 test NFR-02 + ghi `reports/raw/security-summary.csv` |
| `tests/security/accessibility.spec.ts` | 5 test NFR-06 (axe-core WCAG 2.1 AA) + ghi `reports/raw/axe-summary.csv` |
| `tests/security/seo.spec.ts` | 6 test NFR-07 (title, meta description, lang, sitemap, robots, Open Graph) |
| `tests/security/responsive.spec.ts` | 3 test NFR-04 (Chrome, cuộn ngang 360px, luồng tính giá 360×740) |
| `tests/support/http.ts` | `getWithRetry` — phân loại lỗi mạng của site đích khỏi lỗi sản phẩm |
| `tests/api/petspa.postman_collection.json` | 5 request GET + `pm.test` assertions (Newman) |
| `tests/perf/read-load.js` | Kịch bản k6 tải đọc ≤ 10 VU |
| `scripts/req-check.mjs`, `rtm-build.mjs`, `rtm-check.mjs`, `backlog-build.mjs`, `exit-check.mjs` | Gate tự động |
| `scripts/nfr-scan.mjs`, `lighthouse-scan.mjs`, `exec-sync.mjs` | Quét NFR, đo Lighthouse, đồng bộ nhật ký thực thi |

## 4. Kết quả kiểm thử thật của Ngày 1

### 4.1. Chức năng — xanh toàn bộ (11/11 Pass)

| Hệ thống | Test | Kết quả |
| --- | --- | --- |
| T1 Pet NGON | HTTP 200 + tiêu đề; link menu trả 200; không link chết 404 trong menu/footer | Pass |
| T2 Mật Pet | Chó >3–6kg Combo Tắm Vệ Sinh = 200.000đ; Chó >3–6kg Combo Tắm Cạo = 250.000đ; Chó >6–10kg Combo Tắm Vệ Sinh = 300.000đ; giá cập nhật tức thì khi đổi bậc | Pass |
| T3 Pretty Paws | HTTP 200 + tiêu đề; đủ điện thoại/email/địa chỉ Hamilton NJ; trạng thái Open + khung giờ 8:00 AM–8:00 PM; nút Book Now 24/7 không cần đăng nhập | Pass |

Kết luận quan trọng: **bảng giá hiển thị tức thì của T2 khớp bảng giá tĩnh** ở cả 3 ô đã đối chiếu — đây là ca kiểm thử tích hợp quan trọng nhất của ngày 1 và nó xanh.

### 4.2. Phi chức năng — 12 Fail, đều là lỗi thật của site bên thứ ba

| Nhóm | Phát hiện | DEF |
| --- | --- | --- |
| NFR-02 (header) | Cả 3 site thiếu `X-Content-Type-Options`; thiếu `X-Frame-Options`/CSP `frame-ancestors`; thiếu `Referrer-Policy`; T1 và T3 thiếu HSTS | DEF-002..DEF-012 (11 lỗi) |
| NFR-06 (tiếp cận) | T3: 0 phần tử `h1`, 49 ảnh thiếu `alt`; T1: 40 vùng chữ sai tương phản; T2: 3 vùng chữ sai tương phản | DEF-001, DEF-013, DEF-014, DEF-015 |
| NFR-04 (tương thích) | T1 tràn ngang 19px ở khung nhìn 360px | DEF-016 |
| NFR-07 (SEO) | T3 không có `sitemap.xml` và `robots.txt` (404); T1/T2 thiếu `og:image` | DEF-017, DEF-018, DEF-021 |
| NFR-01 (hiệu năng) | Điểm Performance trung vị: T1=67, T2=59, T3=3 (ngưỡng ≥70); LCP: T1=4887ms, T2=6473ms, T3=17621ms (ngưỡng ≤2500ms) | DEF-019, DEF-020 |

Xử lý: giữ trạng thái `Open` với ghi chú "lỗi ở site đích (bên thứ ba) — nhóm không thể sửa". **Không hạ tiêu chí và không sửa script cho xanh** — đây là điểm cốt lõi của nguyên tắc kiểm thử hộp đen.

### 4.3. Chấm Exit criteria (chạy sớm để lấy số liệu)

| Mã | Tiêu chí | Kết quả | Trạng thái |
| --- | --- | --- | --- |
| EC-1 | 100% yêu cầu Must có ≥1 test case | 40/40 | PASS |
| EC-2 | 100% test case Critical/High đã thực thi, Pass ≥95% | 29 ca đã chạy, Pass 58.6% | FAIL (dự kiến — chưa tới Ngày 11–13) |
| EC-3 | 0 lỗi Critical/High còn mở | 0/21 | PASS |
| EC-4 | Mỗi hệ thống có ≥1 bộ E2E xanh | 14 test case tự động Pass | PASS |
| EC-5 | NFR-01 đạt (Lighthouse ≥70) | điểm thấp nhất 3 | FAIL |
| EC-6 | NFR-02 đạt (0 phát hiện Critical/High) | 1 phát hiện axe critical; 14/15 header thiếu | FAIL |
| EC-7 | UAT không có phản hồi chặn | HUMAN-PENDING | FAIL (dự kiến — UAT ở Ngày 13) |

## 5. Sai lệch so với kế hoạch và điều chỉnh đã thực hiện

1. **Playwright không dùng được `chrome-headless-shell`**: máy bị Application Control policy chặn binary của Playwright (`spawn UNKNOWN`). Đã đổi `playwright.config.ts` sang `channel: 'chrome'` (Chrome hệ thống 157.0.8103.51). Hệ quả tích cực: khớp luôn yêu cầu NFR-04 về trình duyệt thực.
2. **Script `scripts/nfr-scan.mjs` không khởi động được browser** (cùng nguyên nhân policy). Đã chuyển việc quét axe-core và HTTP header vào chính runner Playwright (`tests/security/`), vừa khớp ADR-11 vừa tái dùng được cấu hình.
3. **False-pass ở TC-NFR-06-001**: lần đầu quét axe-core khi trang còn đang tải ảnh nên bỏ sót vi phạm `image-alt` mức critical của T3 (49 node). Đã sửa bằng cách chờ `load` + 3 giây render trước khi quét, và test sau đó Fail đúng như thực tế. Đây là minh hoạ việc test phải được hiệu chỉnh khi phát hiện kết quả không khớp quan sát.
4. **Đánh số test case không khớp `nfr.csv`**: script cũ dùng `TC-NFR-06-001` cho từng site, trong khi bộ test case định nghĩa `System = ALL` (mỗi test áp dụng cho cả 3 site). Đã viết lại `tests/security/*.spec.ts` để mỗi test quét cả 3 site và Fail nếu bất kỳ site nào vi phạm; đồng thời đổi tên 2 test T3 (`TC-T3-M5-007` → `TC-T3-M5-005`, `TC-T3-M4-011` → `TC-T3-M4-009`) cho khớp `docs/testcases/t3.csv`.
5. **Đo Lighthouse bằng preset `desktop` không đúng ngưỡng SRS**: SRS §9.1 quy định Lighthouse Performance **mobile**. Đã chạy lại bằng preset mặc định (mobile emulation) và lấy trung vị 3 lần.
6. **`scripts/exit-check.mjs` chưa tính phần header bảo mật**: EC-6 trước đó chỉ đọc `axe-summary.csv`. Đã bổ sung `security-summary.csv` vào nguồn đo.
7. **Lỗi mạng của site đích làm test Fail sai nguyên nhân**: một lần chạy ghi nhận `ERR_INTERNET_DISCONNECTED`, `ENOTFOUND matpet.vn` và timeout 15 giây. Nếu để vậy, nhật ký sẽ quy lỗi hạ tầng thành lỗi sản phẩm. Đã thêm `tests/support/http.ts` với `getWithRetry` (3 lần thử, timeout 45 giây) cho các lệnh GET; lỗi mạng được phân loại là sự cố hạ tầng, chỉ lỗi assertion về nội dung mới ghi nhận là defect. Chạy lại sau đó: 12 Fail, toàn bộ là lỗi thật của site đích.
8. **Không cài được Firefox/WebKit**: `npx playwright install firefox webkit` bị chặn bởi kiểm tra yêu cầu hệ thống của Windows (máy này không đủ điều kiện chạy webkit). Đã chuyển `TC-NFR-04-002..004` (Firefox, Edge, Safari) sang `Manual` và bỏ 2 project `cross-browser`/`mobile` không có test file; `TC-NFR-04-001` (Chrome) được tự động hoá trong `tests/security/responsive.spec.ts`.

## 6. Việc chưa làm (ngoài phạm vi Mạnh hoặc chưa tới hạn)

- Rà FR của từng tác giả và mở CR tại Inspection Ngày 3 (Mạnh làm Moderator).
- `docs/design/dt-*.md`, `docs/test-design/states.md`, `docs/test-data.md` (Ngày 4).
- Technical Review thiết kế test và biên bản họp (Ngày 5).
- Test case M1–M7 còn lại ở dạng Manual chưa thực thi — sẽ chạy ở Ngày 11–12.
- UAT với 5–8 người ngoài nhóm (Ngày 13): `HUMAN-PENDING`.
- OWASP ZAP và Lighthouse CLI cho Firefox/Edge/Safari (NFR-04, NFR-05): `HUMAN-PENDING`.

## 7. Ghi chú rủi ro

- **Tần suất chạy**: mỗi lần `npx playwright test` quét 3 site × nhiều trang. ADR-11 giới hạn tần suất thấp; hiện 1 lần chạy đầy đủ mất ~8 phút và tạo ~30 request mỗi site. Trước Ngày 11 cần thống nhất nhịp chạy để không gây tải cho site đích.
- **Độ ổn định selector**: T1/T2/T3 có thể đổi giao diện giữa kỳ. Đã ưu tiên selector theo vai trò/nhãn (`getByRole`, `getByText`) thay vì class sinh tự động; `.rail-price`/`.rail-lines` ở T2 vẫn là ngoại lệ vì không có nhãn ổn định — cần rà lại ở Ngày 9.
- **Độ ổn định mạng**: site đích đôi lúc phản hồi chậm hoặc rớt DNS. Đã thêm retry cho lệnh GET, nhưng nếu gặp lỗi mạng ở lần chạy chính thức cần ghi rõ "hạ tầng" trong nhật ký thay vì quy thành defect, và chạy lại để xác nhận.
- **Điểm Lighthouse dao động mạnh**: T3 Performance trung vị 3 với LCP 17.6 giây, phụ thuộc nhiều vào tốc độ mạng lúc đo. Nên chạy lại 3 lần vào Ngày 12 rồi lấy trung vị, tránh kết luận từ một lần đo.
- **Số lượng test case**: 226 ca trong 14 ngày với 4 người là khả thi cho phần tự động hóa, nhưng phần Manual sẽ là nút thắt. Cần cân bằng lại tải theo owner ở cuối Ngày 8.
