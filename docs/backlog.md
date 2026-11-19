# Backlog công việc kiểm thử (MoSCoW)

Phiên bản 1.1 · Ngày 2026-11-19 · Người lập: Mạnh (TV1) · Nguồn: SRS-01 v1.2 và bộ test case `docs/testcases/*.csv` (sau khi cân bằng phân công ASG-01 v3.0)

Bản máy đọc được: `docs/backlog.csv` (104 mục). Quy ước mã: `BL-nnn`.

> Backlog này thay thế backlog của hệ thống tự xây (đã archive). Mỗi mục là **một nhóm test case cho một yêu cầu trên một hệ thống đích**, quy đổi trực tiếp từ RTM-01.

## 1. Quy tắc xếp mức

- **Must**: yêu cầu mức Must trong SRS-01, hoặc test case mức Critical — bắt buộc thực thi, không được cắt.
- **Should**: yêu cầu Should hoặc test case High — cắt được nếu thiếu thời gian, nhưng phải ghi rõ lý do trong báo cáo.
- **Could**: yêu cầu Could hoặc test case Medium/Low — có thể bỏ.
- **Không bao giờ cắt nhóm Must**: vi phạm Exit criteria của Test Plan (100% yêu cầu Must có ít nhất 1 test case đã thực thi).

## 2. Tổng hợp

| Mức | Số mục |
|---|---|
| Critical | 49 |
| High | 41 |
| Medium | 12 |
| Low | 2 |
| **Tổng** | **104** |

| Hệ thống | Số mục |
|---|---|
| T1 — Pet NGON (petngon.vn) | 34 |
| T2 — Mật Pet Family (matpet.vn) | 36 |
| T3 — Pretty Paws (groomore.com) | 27 |
| ALL — Cả 3 hệ thống | 7 |

| Người phụ trách | Số mục |
|---|---|
| Lộc | 18 |
| Mạnh | 27 |
| Ngân | 32 |
| Tài | 27 |

## 3. Backlog chi tiết

| Mã | Yêu cầu | Hệ thống | Mức | Kỹ thuật | Loại | SL | Người phụ trách |
|---|---|---|---|---|---|---|---|
| BL-001 | FR-M1-01 | T1 | Critical | UC | Auto | 1 | Tài |
| BL-002 | FR-M1-01 | T2 | Critical | UC | Auto | 1 | Ngân |
| BL-003 | FR-M1-01 | T3 | Critical | UC | Auto | 1 | Mạnh |
| BL-004 | FR-M1-03 | T1 | Critical | Use case | Manual | 1 | Tài |
| BL-005 | FR-M1-03 | T2 | Critical | Use case | Manual | 1 | Ngân |
| BL-006 | FR-M1-03 | T3 | Critical | Use case | Manual | 1 | Mạnh |
| BL-007 | FR-M1-04 | T1 | Critical | Use case | Auto | 1 | Mạnh |
| BL-008 | FR-M1-04 | T2 | Critical | Use case | Auto | 1 | Tài |
| BL-009 | FR-M2-05 | T1 | Critical | UC | Manual | 2 | Mạnh |
| BL-010 | FR-M3-01 | T1 | Critical | UC | Manual | 1 | Tài |
| BL-011 | FR-M3-01 | T2 | Critical | UC | Manual | 1 | Ngân |
| BL-012 | FR-M3-01 | T3 | Critical | UC | Manual | 1 | Mạnh |
| BL-013 | FR-M3-02 | T1 | Critical | EP | Manual | 14 | Tài |
| BL-014 | FR-M3-02 | T2 | Critical | EP | Auto | 16 | Ngân |
| BL-015 | FR-M3-02 | T3 | Critical | EP | Manual | 11 | Mạnh |
| BL-016 | FR-M3-03 | T2 | Critical | UC | Auto | 3 | Ngân |
| BL-017 | FR-M3-04 | T2 | Critical | EP | Auto | 2 | Ngân |
| BL-018 | FR-M3-05 | T1 | Critical | UC | Manual | 1 | Tài |
| BL-019 | FR-M3-05 | T2 | Critical | UC | Manual | 1 | Ngân |
| BL-020 | FR-M3-05 | T3 | Critical | UC | Manual | 1 | Mạnh |
| BL-021 | FR-M4-01 | T1 | Critical | UC | Manual | 1 | Tài |
| BL-022 | FR-M4-01 | T2 | Critical | UC | Auto | 1 | Ngân |
| BL-023 | FR-M4-01 | T3 | Critical | UC | Manual | 1 | Mạnh |
| BL-024 | FR-M4-02 | T1 | Critical | EP | Manual | 1 | Tài |
| BL-025 | FR-M4-02 | T2 | Critical | EP | Auto | 1 | Ngân |
| BL-026 | FR-M4-02 | T3 | Critical | EP | Manual | 1 | Mạnh |
| BL-027 | FR-M4-03 | T2 | Critical | EP | Manual | 3 | Ngân |
| BL-028 | FR-M4-06 | T1 | Critical | ST | Manual | 3 | Tài |
| BL-029 | FR-M4-06 | T2 | Critical | ST | Manual | 2 | Tài |
| BL-030 | FR-M4-07 | T1 | Critical | UC | Manual | 2 | Mạnh |
| BL-031 | FR-M4-07 | T2 | Critical | UC | Auto | 2 | Ngân |
| BL-032 | FR-M4-07 | T3 | Critical | UC | Manual | 2 | Ngân |
| BL-033 | FR-M4-10 | T2 | Critical | UC | Manual | 1 | Tài |
| BL-034 | FR-M4-12 | T1 | Critical | UC | Manual | 1 | Mạnh |
| BL-035 | FR-M4-12 | T2 | Critical | UC | Auto | 1 | Tài |
| BL-036 | FR-M4-12 | T3 | Critical | UC | Manual | 1 | Lộc |
| BL-037 | FR-M5-01 | T1 | Critical | UC | Manual | 1 | Tài |
| BL-038 | FR-M5-01 | T2 | Critical | UC | Manual | 1 | Ngân |
| BL-039 | FR-M5-02 | T1 | Critical | UC | Manual | 1 | Tài |
| BL-040 | FR-M5-02 | T2 | Critical | UC | Manual | 1 | Ngân |
| BL-041 | FR-M5-06 | T3 | Critical | EP | Manual | 2 | Ngân |
| BL-042 | FR-M5-07 | T3 | Critical | UC | Manual | 1 | Lộc |
| BL-043 | FR-M6-01 | T1 | Critical | ST | Manual | 2 | Tài |
| BL-044 | FR-M6-03 | T1 | Critical | DT | Manual | 4 | Mạnh |
| BL-045 | FR-M7-01 | T2 | Critical | UC | Auto | 1 | Ngân |
| BL-046 | FR-M7-04 | T1 | Critical | UC | Manual | 1 | Mạnh |
| BL-047 | FR-M7-04 | T2 | Critical | UC | Manual | 1 | Lộc |
| BL-048 | FR-M7-04 | T3 | Critical | UC | Manual | 1 | Mạnh |
| BL-049 | NFR-02 | ALL | Critical | Use case | Auto | 12 | Mạnh |
| BL-050 | FR-M1-02 | T1 | High | UC | Auto | 1 | Tài |
| BL-051 | FR-M1-02 | T2 | High | UC | Auto | 1 | Ngân |
| BL-052 | FR-M1-02 | T3 | High | UC | Auto | 1 | Mạnh |
| BL-053 | FR-M1-05 | T1 | High | Use case | Auto | 1 | Mạnh |
| BL-054 | FR-M1-05 | T2 | High | Use case | Auto | 1 | Lộc |
| BL-055 | FR-M1-05 | T3 | High | Use case | Auto | 1 | Ngân |
| BL-056 | FR-M1-06 | T1 | High | Use case | Manual | 1 | Lộc |
| BL-057 | FR-M1-06 | T2 | High | Use case | Manual | 1 | Lộc |
| BL-058 | FR-M1-06 | T3 | High | Use case | Manual | 1 | Lộc |
| BL-059 | FR-M2-01 | T1 | High | UC | Manual | 2 | Tài |
| BL-060 | FR-M2-01 | T2 | High | UC | Manual | 2 | Ngân |
| BL-061 | FR-M2-01 | T3 | High | UC | Manual | 2 | Mạnh |
| BL-062 | FR-M2-02 | T1 | High | UC | Manual | 1 | Tài |
| BL-063 | FR-M2-02 | T2 | High | UC | Manual | 1 | Ngân |
| BL-064 | FR-M2-02 | T3 | High | UC | Manual | 1 | Mạnh |
| BL-065 | FR-M2-03 | T1 | High | UC | Manual | 2 | Tài |
| BL-066 | FR-M4-03 | T3 | High | EP | Manual | 2 | Mạnh |
| BL-067 | FR-M4-04 | T1 | High | EP | Manual | 1 | Tài |
| BL-068 | FR-M4-04 | T2 | High | EP | Manual | 1 | Ngân |
| BL-069 | FR-M4-08 | T1 | High | ST | Manual | 3 | Mạnh |
| BL-070 | FR-M4-08 | T2 | High | ST | Auto | 3 | Tài |
| BL-071 | FR-M4-08 | T3 | High | ST | Manual | 2 | Ngân |
| BL-072 | FR-M4-09 | T2 | High | UC | Auto | 1 | Tài |
| BL-073 | FR-M4-11 | T3 | High | EP | Manual | 2 | Ngân |
| BL-074 | FR-M5-01 | T3 | High | UC | Manual | 1 | Mạnh |
| BL-075 | FR-M5-03 | T1 | High | UC | Manual | 3 | Mạnh |
| BL-076 | FR-M5-04 | T2 | High | UC | Manual | 3 | Ngân |
| BL-077 | FR-M5-04 | T3 | High | UC | Manual | 1 | Mạnh |
| BL-078 | FR-M6-02 | T1 | High | DT | Manual | 8 | Tài |
| BL-079 | FR-M6-04 | T1 | High | UC | Manual | 2 | Mạnh |
| BL-080 | FR-M6-05 | T1 | High | UC | Manual | 1 | Lộc |
| BL-081 | FR-M6-06 | T1 | High | DT | Manual | 3 | Mạnh |
| BL-082 | FR-M7-02 | T2 | High | EP | Auto | 3 | Ngân |
| BL-083 | FR-M7-03 | T1 | High | UC | Manual | 1 | Tài |
| BL-084 | FR-M7-03 | T2 | High | UC | Manual | 1 | Lộc |
| BL-085 | NFR-01 | ALL | High | Lighthouse | Auto | 6 | Ngân |
| BL-086 | NFR-03 | ALL | High | Use case | Manual | 4 | Tài |
| BL-087 | NFR-04 | ALL | High | UC | Auto | 6 | Tài |
| BL-088 | NFR-05 | ALL | High | Use case | Manual | 4 | Ngân |
| BL-089 | NFR-06 | ALL | High | Accessibility | Auto | 6 | Lộc |
| BL-090 | NFR-07 | ALL | High | SEO | Auto | 6 | Lộc |
| BL-091 | FR-M2-04 | T2 | Medium | UC | Manual | 2 | Ngân |
| BL-092 | FR-M2-06 | T3 | Medium | UC | Manual | 1 | Ngân |
| BL-093 | FR-M2-07 | T2 | Medium | UC | Manual | 1 | Lộc |
| BL-094 | FR-M2-07 | T3 | Medium | UC | Manual | 1 | Lộc |
| BL-095 | FR-M3-06 | T2 | Medium | UC | Manual | 1 | Ngân |
| BL-096 | FR-M3-06 | T3 | Medium | UC | Manual | 1 | Mạnh |
| BL-097 | FR-M3-07 | T1 | Medium | UC | Manual | 2 | Tài |
| BL-098 | FR-M4-05 | T2 | Medium | EP | Manual | 1 | Ngân |
| BL-099 | FR-M5-04 | T1 | Medium | UC | Manual | 1 | Lộc |
| BL-100 | FR-M5-05 | T2 | Medium | UC | Manual | 1 | Lộc |
| BL-101 | FR-M7-05 | T2 | Medium | UC | Auto | 1 | Lộc |
| BL-102 | FR-M7-06 | T1 | Medium | ST | Manual | 1 | Lộc |
| BL-103 | FR-M1-04 | T3 | Low | Use case | Auto | 2 | Ngân |
| BL-104 | FR-M7-03 | T3 | Low | UC | Manual | 1 | Lộc |

## 4. Thứ tự thực hiện

- **Ngày 6–8:** viết test case cho nhóm Must và Critical theo bảng chi tiết.
- **Ngày 9:** chuẩn bị môi trường và script smoke, xác nhận bộ test case chạy được.
- **Ngày 10:** kiểm thử tích hợp (quan sát hợp đồng dữ liệu giao diện ↔ API).
- **Ngày 11:** system test vòng 1, ưu tiên toàn bộ nhóm Critical.
- **Ngày 12:** re-test và nhóm NFR.
- **Ngày 13:** regression và UAT.

## 5. Cắt phạm vi

Thứ tự cắt đề xuất khi thiếu thời gian: nhóm Medium trước, sau đó nhóm Low. Không cắt nhóm Critical. Mọi mục bị cắt phải được liệt kê trong Final Test Report kèm lý do.
