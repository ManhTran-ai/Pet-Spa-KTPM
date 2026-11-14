# Tóm tắt kiểm thử bảo mật (NFR-02)

Nguồn: `reports/raw/security-summary.csv` · ngày chạy xem trong `reports/gates/`.

## HTTP security header

- **T1** — X-Content-Type-Options: **không có** (Không đạt)
- **T1** — X-Frame-Options: **không có** (Không đạt)
- **T1** — Content-Security-Policy: **không có** (Không đạt)
- **T1** — Referrer-Policy: **không có** (Không đạt)
- **T1** — Strict-Transport-Security: **không có** (Không đạt)
- **T2** — X-Content-Type-Options: **không có** (Không đạt)
- **T2** — X-Frame-Options: **không có** (Không đạt)
- **T2** — Content-Security-Policy: **không có** (Không đạt)
- **T2** — Referrer-Policy: **không có** (Không đạt)
- **T2** — Strict-Transport-Security: `max-age=63072000` (Đạt)
- **T3** — X-Content-Type-Options: **không có** (Không đạt)
- **T3** — X-Frame-Options: **không có** (Không đạt)
- **T3** — Content-Security-Policy: **không có** (Không đạt)
- **T3** — Referrer-Policy: **không có** (Không đạt)
- **T3** — Strict-Transport-Security: **không có** (Không đạt)

## axe-core (NFR-06)

- **T1** — `color-contrast` (serious, 40 node): Elements must meet minimum color contrast ratio thresholds
- **T2** — `color-contrast` (serious, 3 node): Elements must meet minimum color contrast ratio thresholds
- **T3** — `image-alt` (critical, 49 node): Images must have alternative text
- **T3** — `list` (serious, 1 node): <ul> and <ol> must only directly contain <li>, <script> or <template> elements
- **T3** — `meta-viewport` (moderate, 1 node): Zooming and scaling must not be disabled
- **T3** — `scrollable-region-focusable` (serious, 1 node): Scrollable region must have keyboard access
