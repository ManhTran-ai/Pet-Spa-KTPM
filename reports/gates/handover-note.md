## Vui lòng đọc `docs/ASSIGNMENT.md` trước khi bắt đầu

Đây là tài liệu giao việc cho cả 3 thành viên. Nó chứa:
thứ tự đọc tài liệu · ranh giới kiểm thử an toàn (ADR-11) · phân công chi tiết theo từng ngày · quy tắc viết test case theo 4C · cách ghi nhận kết quả và lỗi · định dạng commit · mốc bàn giao.

**Repo:** https://github.com/ManhTran-ai/Pet-Spa-KTPM
**Nhánh:** `main` (clone/pull trước khi làm)

```powershell
git clone https://github.com/ManhTran-ai/Pet-Spa-KTPM.git
cd Pet-Spa-KTPM
npm install
npm run gate        # phải exit 0
```

## Ba hệ thống đích

| Mã | Hệ thống | URL | Phụ trách chính |
|---|---|---|---|
| T1 | Pet NGON | https://petngon.vn/vi | Tài, Lộc |
| T2 | Mật Pet Family | https://matpet.vn/spa | Tài |
| T3 | Pretty Paws | https://prettypawscatanddoggrooming.groomore.com/ | Mạnh, Ngân |

Lưu ý: `matpet.vn/dat-lich` trả 404 — luồng thật nằm ở `matpet.vn/spa`.

## Ranh giới an toàn — bắt buộc tuân thủ

**Không** bấm nút gửi cuối cùng ("Đặt lịch", "Book Now"), **không** tạo tài khoản, **không** gửi payload phá hại, tải tối đa 10 VU.
Chỉ chọn lựa chọn trong form và đọc giá hiển thị. Chi tiết: `docs/ASSIGNMENT.md` §2.

## Việc Ngày 2 (đang mở)

| Người | Việc | Đầu ra |
|---|---|---|
| **Tài** | Đối chiếu ma trận giá T2: 6 bậc cân nặng × 2 loài × 3 dịch vụ; ghi mọi ô lệch | `reports/raw/survey-T2-matrix.csv` |
| **Ngân** | Đối chiếu giá T3 API ↔ trang đặt lịch: 8 dịch vụ chính, giá + thời lượng | `reports/raw/survey-T3-ui-prices.csv` |
| **Lộc** | Rà bản vá SRS v1.1; chuẩn bị đề xuất cách xử lý phát hiện P1 cho Inspection | Biên bản Inspection (Ngày 3) |

Bảng giá tham chiếu đã chốt: `docs/reference/pricing-baseline.md` (REF-01).

## Tài liệu cần đọc

1. `docs/source/Cẩm nang Tổng hợp... .md` — nền tảng lý thuyết
2. `docs/source/Hệ thống Đặt lịch... Spa.md` — kế hoạch 14 ngày, phân công
3. `docs/source/Đặc tả Yêu cầu Phần mềm (SRS).md` — SRS-01 v1.1, test basis
4. `docs/source/Kế hoạch Kiểm thử (Test Plan).md` — TP-01 v1.0
5. `docs/source/Ma trận Truy xuất Yêu cầu (RTM).md` — RTM-01 v1.0

## Quy tắc vàng

- **Không hạ tiêu chí để ép xanh.** Lỗi thật của site bên thứ ba vẫn ghi vào `docs/defects/defects.csv` với bằng chứng.
- **Phân biệt lỗi sản phẩm và lỗi hạ tầng.** `ERR_INTERNET_DISCONNECTED`, timeout, `ENOTFOUND` là lỗi mạng — không ghi defect.
- **Chạy `npm run gate` trước khi commit** — phải exit 0.
- **Không sửa tay** `docs/testcases/*.csv` cột `Status` và `reports/execution-log.csv` — dùng `npm run exec:sync` hoặc `scripts/tc-record.mjs`.
