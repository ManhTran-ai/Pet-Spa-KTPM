# Bao cao tich hop T2 - Mat Pet Family

Ngay thuc hien: 2026-11-20 · Nguoi thuc hien: **Ngan (TV3)** · Ke hoach: `docs/ASSIGNMENT.md` §3.3 (Ngay 10)

## 1. Pham vi kiem thu tich hop

| Hang muc | Noi dung | Yeu cau truy xuat |
|---|---|---|
| Hop dong du lieu bang gia tinh <-> calculator | Gia tinh tuc thoi tren wizard khop bang gia tinh tren cung trang | FR-M3-01, FR-M3-02, FR-M3-03 |
| Hop dong du lieu API <-> giao dien | API `GET /api/portal/company-settings` va du lieu gia tinh | FR-M1-03, FR-M2-01 |
| Validate bien cua form giu cho | SĐT, ngay mong muon | FR-M4-02, FR-M4-03, FR-M4-04, FR-M4-05 |

Ranh gioi ADR-11: chi doc va chon, khong POST dat lich, khong tao tai khoan.

## 2. Cac lenh da chay va ket qua that

| # | Lenh | Ket qua | Ma |
|---|---|---|---|
| 1 | `k6 run tests/perf/read-load.js` | 183 request · 0 loi 5xx · `http_req_failed` 0.00% · p95 = 907.74 ms · 10 VU / 1m | 0 |
| 2 | `npx playwright test --project=t2` | 20 test · **20 Pass / 0 Fail** | 0 |
| 3 | `npx playwright test --project=nfr` | 7 test · 1 Pass / 6 Fail (6 Fail la loi that cua site dich) | 1 |
| 4 | `node scripts/survey-t2-dom.mjs` | BANG GIA: 3 bang, 4 combo + 6 le + 3 nhuom + 6 bao gia rieng | 0 |
| 5 | `node scripts/survey-t2-api.mjs` | API `GET /api/portal/company-settings` → HTTP 200 | 0 |

## 3. Hop dong du lieu bang gia tinh <-> calculator

Bang gia tinh cua T2 (3 bang HTML) va gia tinh tuc thoi tren wizard **cung xuat phat tu mot nguon du lieu duy nhat**, nen khong co xung dot:

| Bang gia tinh | Gia tinh tuc thoi | Ket qua |
|---|---|---|
| Combo Tam Ve Sinh, >3-6kg = 200k | `~200.000đ` | Khop |
| Combo Tam Cao, >3-6kg = 250k | `~250.000đ` | Khop |
| Combo Tam Ve Sinh, >6-10kg = 300k | `~300.000đ` | Khop |

Bang gia dung don vi rut gon (`120k`, `1tr`, `1,2tr`) con calculator hien thi dinh dang day du (`~200.000đ`) → ca tich hop phai chuan hoa truoc khi so sanh (dac ta P3 da ghi nhom).

Bang gia tinh co hieu ung `visibility:hidden` (reveal khi cuon) → phai doc `textContent`, khong dung `innerText`.

## 4. Hop dong du lieu API <-> giao dien

| Endpoint | Method | Ket qua | Vai tro |
|---|---|---|---|
| `/api/portal/company-settings` | GET | 200 | Cai dat tien (gio mo cua, don vi, tien te) |
| `/_rsc=...` (`/`, `/cho`, `/meo`, `/tim-be-thuong`, `/bao-hanh`, `/en/spa`) | GET | 200 | Prefetch Next.js RSC |

Danh muc dich vu **khong** nam trong API rieng (khac T3) ma duoc nhung truc tiep trong HTML server-render. Do do khong co "dich vu trong API nhung khong hien tren UI" o T2.

## 5. Validate bien cua form giu cho

| Truong hop | Kiem thu | Ket qua |
|---|---|---|
| Bo trong SĐT | FR-M4-02 | Fail → hien thong bao "Vui long nhap so dien thoai hop le de spa lien he." |
| SĐT chua chu cai (`abc`) | FR-M4-03 | Bi tu choi (cung thong bao) |
| SĐT qua ngan (1 ky tu) | FR-M4-04 | Bi tu choi |
| SĐT qua dai (20 ky tu) | FR-M4-04 | Bi tu choi |
| SĐT hop le Viet Nam | FR-M4-03 | Duoc chap nhan (khong con thong bao loi) |
| Ngay mong muon | FR-M4-04 | Chi co `min = hom nay`, **khong co `max`** → DEF-022 (da ghi nhom truoc) |

## 6. Danh gia tich hop

| Hang muc | Trang thai | Ghi chu |
|---|---|---|
| Bang gia tinh <-> calculator | **Khop** | 20/20 test tu dong xanh |
| Danh muc dich vu day du | **Khop** | 4 combo + 6 le + 3 nhuom + 6 bao gia rieng, khong dich vu nao vo hinh |
| API company-settings | **Khop** | HTTP 200, cấu hình tải về trước khi render wizard |
| Validate SĐT | **Khop** | Tu choi sai dinh dang va sai do dai |
| Validate ngay | **Khong dat** | Khong gioi han `max` → DEF-022 |
| Chu ky hoa trang thai | **Khong dat** | Tai lai trang mat toan bo lua chon → DEF-029 |
| Hieu nang 4G | **Khong dat** | T2 LCP = 4.3s → DEF-031; T3 DCL = 6.8s → DEF-030 |

## 7. Loi moi phat hien trong Ngay 10

| DEF | Tieu de | Muc do |
|---|---|---|
| DEF-029 | T2 khong giu lua chon cua nguoi dung sau khi tai lai trang | High |
| DEF-030 | T3 vuot nguong DOMContentLoaded 3 giay tren mang 4G mo phong | High |
| DEF-031 | T2 vuot nguong LCP 2,5 giay tren mang 4G mo phong | High |

Chi tiet tai `docs/defects/defects.csv`.
